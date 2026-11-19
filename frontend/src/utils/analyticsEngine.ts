import type {
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyAudioFeatures
} from '../types/spotify';

export interface ScoreItem {
  id: string;
  name: string;
  score: number;
  category: 'Diversity' | 'Acoustics' | 'Behavior';
  description: string;
  whyAssigned: string;
  formulaDoc: string;
  color: string;
  glow: string;
  badge: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'NICHE';
}

export interface AnalyticsEngineResult {
  overallScore: number;
  scores: ScoreItem[];
  diversityScore: number;
  discoveryScore: number;
  mainstreamScore: number;
  moodStabilityScore: number;
  artistLoyaltyScore: number;
  genreDiversityScore: number;
  replayScore: number;
  summaryText: string;
}

/**
 * Calculates the 8 exact requested Spotify Intelligence Scores (0-100) using real Spotify Web API data.
 */
export function calculateSpotifyIntelligenceScores(
  topArtists: SpotifyArtist[] = [],
  topTracks: SpotifyTrack[] = [],
  playlists: SpotifyPlaylist[] = [],
  audioFeatures: SpotifyAudioFeatures[] = []
): AnalyticsEngineResult {
  const totalTracksCount = topTracks.length || 1;
  const totalArtistsCount = topArtists.length || 1;

  // 1. Mainstream Score (0-100)
  const mainstreamScore = totalTracksCount > 0
    ? Math.round(topTracks.reduce((acc, t) => acc + (t.popularity || 0), 0) / totalTracksCount)
    : 50;

  // 2. Discovery Score (0-100)
  const avgArtistPopularity = totalArtistsCount > 0
    ? topArtists.reduce((acc, a) => acc + (a.popularity || 0), 0) / totalArtistsCount
    : 60;
  const discoveryScore = Math.min(100, Math.max(10, Math.round(100 - avgArtistPopularity * 0.65)));

  // 3. Genre Diversity (0-100)
  const allGenres = topArtists.flatMap((a) => a.genres || []);
  const uniqueGenres = new Set(allGenres);
  const genreDiversityScore = Math.min(100, Math.max(15, Math.round((uniqueGenres.size / 22) * 100)));

  // 4. Diversity Score (0-100)
  const trackArtists = topTracks.flatMap((t) => t.artists?.map((a) => a.name) || []);
  const uniqueTrackArtists = new Set(trackArtists);
  const artistRatioScore = Math.min(50, (uniqueTrackArtists.size / totalTracksCount) * 50);
  const diversityScore = Math.min(100, Math.max(15, Math.round((genreDiversityScore * 0.5) + artistRatioScore)));

  // 5. Mood Stability (0-100)
  const valences = audioFeatures.map((f) => f.valence || 0.5);
  const count = valences.length || 1;
  const avgValence = valences.reduce((a, b) => a + b, 0) / count;
  const variance = valences.reduce((acc, v) => acc + Math.pow(v - avgValence, 2), 0) / count;
  const stdDev = Math.sqrt(variance);
  const moodStabilityScore = Math.min(100, Math.max(25, Math.round(100 - stdDev * 220)));

  // 6. Artist Loyalty (0-100)
  const artistCounts: Record<string, number> = {};
  trackArtists.forEach((a) => {
    artistCounts[a] = (artistCounts[a] || 0) + 1;
  });
  const sortedArtistCounts = Object.values(artistCounts).sort((a, b) => b - a);
  const top3TracksCount = (sortedArtistCounts[0] || 0) + (sortedArtistCounts[1] || 0) + (sortedArtistCounts[2] || 0);
  const artistLoyaltyScore = Math.min(100, Math.max(10, Math.round((top3TracksCount / totalTracksCount) * 100)));

  // 7. Replay Score (0-100)
  const top10Tracks = topTracks.slice(0, 10);
  const top10AvgPopularity = top10Tracks.length > 0
    ? top10Tracks.reduce((acc, t) => acc + (t.popularity || 0), 0) / top10Tracks.length
    : 50;
  const replayScore = Math.min(100, Math.max(20, Math.round((top10AvgPopularity / (mainstreamScore || 1)) * 60 + (10 / totalTracksCount) * 40)));

  // 8. Overall Music Intelligence Score (0-100 Composite)
  const overallScore = Math.round(
    (diversityScore +
      discoveryScore +
      mainstreamScore +
      moodStabilityScore +
      artistLoyaltyScore +
      genreDiversityScore +
      replayScore) /
      7
  );

  const getScoreColor = (val: number) => {
    if (val >= 80) return { color: '#1DB954', glow: 'rgba(29, 185, 84, 0.4)', badge: 'EXCELLENT' as const };
    if (val >= 60) return { color: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)', badge: 'HIGH' as const };
    if (val >= 40) return { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', badge: 'MODERATE' as const };
    return { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)', badge: 'NICHE' as const };
  };

  const scores: ScoreItem[] = [
    {
      id: 'diversity',
      name: 'Diversity Score',
      score: diversityScore,
      category: 'Diversity',
      description: 'Overall breadth of sub-genres and unique creator variation across your stream history.',
      whyAssigned: `Assigned ${diversityScore}/100 because your top tracks contain ${uniqueTrackArtists.size} unique creators across ${uniqueGenres.size} sub-genres.`,
      formulaDoc: '50% × Genre Diversity + 50% × Unique Creator Ratio',
      ...getScoreColor(diversityScore),
    },
    {
      id: 'discovery',
      name: 'Discovery Score',
      score: discoveryScore,
      category: 'Diversity',
      description: 'Tendency to stream emerging, indie, or non-mainstream creators.',
      whyAssigned: `Assigned ${discoveryScore}/100 based on your average top creator popularity index rating of ${Math.round(avgArtistPopularity)}/100.`,
      formulaDoc: '100 - (Average Artist Popularity Index × 0.65)',
      ...getScoreColor(discoveryScore),
    },
    {
      id: 'mainstream',
      name: 'Mainstream Score',
      score: mainstreamScore,
      category: 'Acoustics',
      description: 'Mean Spotify popularity index rating across all top streamed tracks.',
      whyAssigned: `Assigned ${mainstreamScore}/100 because the mean popularity index across your top ${totalTracksCount} tracks is ${mainstreamScore}.`,
      formulaDoc: 'Mean Popularity Index rating across top Spotify tracks',
      ...getScoreColor(mainstreamScore),
    },
    {
      id: 'mood_stability',
      name: 'Mood Stability',
      score: moodStabilityScore,
      category: 'Acoustics',
      description: 'Emotional valence consistency and low volatility across sessions.',
      whyAssigned: `Assigned ${moodStabilityScore}/100 based on low standard deviation (${stdDev.toFixed(2)}) across track valence scores.`,
      formulaDoc: '100 - (Standard Deviation of Track Valence × 220)',
      ...getScoreColor(moodStabilityScore),
    },
    {
      id: 'artist_loyalty',
      name: 'Artist Loyalty',
      score: artistLoyaltyScore,
      category: 'Behavior',
      description: 'Concentration ratio of stream time spent on your top 3 creators.',
      whyAssigned: `Assigned ${artistLoyaltyScore}/100 because ${top3TracksCount} of your ${totalTracksCount} top tracks come from your top 3 favorite artists.`,
      formulaDoc: '(Streams by Top 3 Artists / Total Track Volume) × 100',
      ...getScoreColor(artistLoyaltyScore),
    },
    {
      id: 'genre_diversity',
      name: 'Genre Diversity',
      score: genreDiversityScore,
      category: 'Diversity',
      description: 'Count and distribution of unique sub-genres in your catalog.',
      whyAssigned: `Assigned ${genreDiversityScore}/100 for representing ${uniqueGenres.size} distinct sub-genres in your artist library.`,
      formulaDoc: '(Unique Sub-Genres Extracted / 22 Target) × 100',
      ...getScoreColor(genreDiversityScore),
    },
    {
      id: 'replay',
      name: 'Replay Score',
      score: replayScore,
      category: 'Behavior',
      description: 'Repeat playback density and heavy rotation of top tracks.',
      whyAssigned: `Assigned ${replayScore}/100 based on high popularity density in your top 10 heavy-rotation songs.`,
      formulaDoc: '(Top 10 Tracks Popularity Density Ratio × 60) + (10 / Total Tracks × 40)',
      ...getScoreColor(replayScore),
    },
  ];

  const summaryText = `Your Overall Music Intelligence Score ranks at ${overallScore}/100. Calculated deterministically from real Spotify telemetry, your profile demonstrates strong Diversity (${diversityScore}/100) and Discovery (${discoveryScore}/100).`;

  return {
    overallScore,
    scores,
    diversityScore,
    discoveryScore,
    mainstreamScore,
    moodStabilityScore,
    artistLoyaltyScore,
    genreDiversityScore,
    replayScore,
    summaryText,
  };
}
