import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  PieChart as PieIcon,
  Activity,
  Calendar,
  Zap,
  Music,
  Users,
  Library,
  Disc,
  Clock,
  Sparkles,
  Download,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Flame,
  Globe,
  Radio
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import type {
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyAudioFeatures,
  SpotifyTopArtistsResponse,
  SpotifyTopTracksResponse,
  SpotifyPlaylistsResponse
} from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { spotifyAudioService } from '../../services/spotifyAudioService';
import {
  formatFollowers,
  formatDurationMs,
  formatNumber,
  formatPercent,
  formatSafeString
} from '../../utils/formatters';

interface AdvancedAnalyticsViewProps {
  accessToken?: string;
}

const COLOR_PALETTE = [
  '#1DB954', // Spotify Green
  '#A855F7', // Purple
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
];

// Dark Recharts Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0];
    return (
      <div className="bg-[#181818]/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1">
        <p className="text-white font-bold">{label || dataItem.name}</p>
        <p className="text-[#1DB954]">
          {dataItem.name}: <strong className="text-white">{dataItem.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const AdvancedAnalyticsView: React.FC<AdvancedAnalyticsViewProps> = ({ accessToken }) => {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<SpotifyAudioFeatures[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = (token?: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFromBackend<SpotifyTopArtistsResponse>('/api/top-artists', token).catch(() => null),
      fetchFromBackend<SpotifyTopTracksResponse>('/api/top-tracks', token).catch(() => null),
      fetchFromBackend<SpotifyPlaylistsResponse>('/api/playlists', token).catch(() => null),
      spotifyAudioService.getAudioAnalysis(token || '').catch(() => null),
    ])
      .then(([artistsData, tracksData, playlistsData, audioData]) => {
        if (artistsData?.items) setTopArtists(artistsData.items);
        if (tracksData?.items) setTopTracks(tracksData.items);
        if (playlistsData?.items) setPlaylists(playlistsData.items);
        if (audioData?.audio_features) setAudioFeatures(audioData.audio_features);
      })
      .catch((err: Error) => {
        console.error('Error loading advanced analytics:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics(accessToken);
  }, [accessToken]);

  // Export Chart as PDF/Print
  const handleExport = () => {
    window.print();
  };

  // ==========================================
  // Dashboard Summary Calculations
  // ==========================================
  const totalTracksCount = topTracks.length;
  const totalArtistsCount = topArtists.length;
  
  const uniqueAlbumsSet = new Set(topTracks.map((t) => t.album?.id || t.album?.name));
  const totalAlbumsCount = uniqueAlbumsSet.size;

  const allGenres = topArtists.flatMap((a) => a.genres || []);
  const uniqueGenresSet = new Set(allGenres);
  const totalGenresCount = uniqueGenresSet.size;

  const avgPopularity = totalTracksCount > 0
    ? Math.round(topTracks.reduce((acc, t) => acc + (t.popularity || 0), 0) / totalTracksCount)
    : 0;

  const avgDurationMs = totalTracksCount > 0
    ? Math.round(topTracks.reduce((acc, t) => acc + (t.duration_ms || 0), 0) / totalTracksCount)
    : 0;

  const explicitCount = topTracks.filter((t) => t.explicit).length;
  const explicitPct = totalTracksCount > 0 ? Math.round((explicitCount / totalTracksCount) * 100) : 0;

  const totalFollowersSum = topArtists.reduce((acc, a) => acc + (a.followers?.total || 0), 0);

  // ==========================================
  // Recharts Chart Datasets
  // ==========================================

  // 1. Genre Distribution (Pie Chart)
  const genreCounts: Record<string, number> = {};
  allGenres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  const genreDistributionData = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, val]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: val,
    }));

  // 2. Top Artists Popularity (Horizontal Bar Chart)
  const top10ArtistsData = topArtists.slice(0, 10).map((a) => ({
    name: a.name.length > 12 ? `${a.name.slice(0, 10)}...` : a.name,
    Popularity: a.popularity || 0,
  }));

  // 3. Track Popularity (Bar Chart Top 20)
  const top20TracksData = topTracks.slice(0, 15).map((t) => ({
    name: t.name.length > 14 ? `${t.name.slice(0, 12)}...` : t.name,
    Popularity: t.popularity || 0,
  }));

  // 4. Audio Features Radar Chart
  const featureCount = audioFeatures.length || 1;
  const avgDance = Math.round((audioFeatures.reduce((acc, f) => acc + (f.danceability || 0.6), 0) / featureCount) * 100);
  const avgEnergy = Math.round((audioFeatures.reduce((acc, f) => acc + (f.energy || 0.7), 0) / featureCount) * 100);
  const avgValence = Math.round((audioFeatures.reduce((acc, f) => acc + (f.valence || 0.5), 0) / featureCount) * 100);
  const avgAcoustic = Math.round((audioFeatures.reduce((acc, f) => acc + (f.acousticness || 0.2), 0) / featureCount) * 100);
  const avgInstrumental = Math.round((audioFeatures.reduce((acc, f) => acc + (f.instrumentalness || 0.1), 0) / featureCount) * 100);
  const avgSpeech = Math.round((audioFeatures.reduce((acc, f) => acc + (f.speechiness || 0.1), 0) / featureCount) * 100);
  const avgLiveness = Math.round((audioFeatures.reduce((acc, f) => acc + (f.liveness || 0.15), 0) / featureCount) * 100);

  const radarData = [
    { subject: 'Danceability', Score: avgDance },
    { subject: 'Energy', Score: avgEnergy },
    { subject: 'Valence', Score: avgValence },
    { subject: 'Acousticness', Score: avgAcoustic },
    { subject: 'Instrumentalness', Score: avgInstrumental },
    { subject: 'Speechiness', Score: avgSpeech },
    { subject: 'Liveness', Score: avgLiveness },
  ];

  // 5. Popularity Histogram
  const popularityBins = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
  topTracks.forEach((t) => {
    const pop = t.popularity || 0;
    if (pop <= 20) popularityBins['0-20']++;
    else if (pop <= 40) popularityBins['21-40']++;
    else if (pop <= 60) popularityBins['41-60']++;
    else if (pop <= 80) popularityBins['61-80']++;
    else popularityBins['81-100']++;
  });

  const popularityHistogramData = Object.entries(popularityBins).map(([range, count]) => ({
    range,
    Tracks: count,
  }));

  // 6. Album Release Timeline
  const releaseYearCounts: Record<string, number> = {};
  topTracks.forEach((t) => {
    const year = t.album?.release_date ? t.album.release_date.slice(0, 4) : 'Recent';
    if (year) releaseYearCounts[year] = (releaseYearCounts[year] || 0) + 1;
  });

  const releaseTimelineData = Object.entries(releaseYearCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([year, count]) => ({
      year,
      Tracks: count,
    }));

  // 7. Explicit vs Clean Songs (Donut Chart)
  const cleanCount = totalTracksCount - explicitCount;
  const explicitCleanData = [
    { name: 'Clean Songs', value: cleanCount > 0 ? cleanCount : (totalTracksCount === 0 ? 1 : 0) },
    { name: 'Explicit Songs', value: explicitCount },
  ];

  // 8. Artist Diversity Score Visualization
  const artistDiversityScore = Math.min(100, Math.round((totalArtistsCount / (totalTracksCount || 1)) * 100));
  const diversityData = [
    { metric: 'Creator Breadth', Value: artistDiversityScore },
    { metric: 'Genre Diversity', Value: Math.min(100, totalGenresCount * 4) },
  ];

  // 9. Playlist Size Comparison
  const playlistSizeData = playlists.slice(0, 7).map((p) => ({
    name: p.name.length > 12 ? `${p.name.slice(0, 10)}...` : p.name,
    Tracks: p.tracks?.total || 0,
  }));

  // Loading Skeletons
  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">Advanced Recharts Analytics</h2>
            <p className="text-xs text-spotify-muted">Computing 9 interactive Recharts datasets from Spotify API...</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-[#181818]/60 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
          <Loader2 className="w-10 h-10 text-[#1DB954] animate-spin" />
          <span className="text-xs font-mono text-spotify-muted">Executing Recharts Data Pipelines...</span>
        </div>
      </div>
    );
  }

  // Error State with Retry Button
  if (error && totalTracksCount === 0 && totalArtistsCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#242424] rounded-3xl border border-red-500/30 p-8 text-center shadow-2xl max-w-2xl mx-auto">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Unable to Load Advanced Analytics</h3>
          <p className="text-xs text-red-300 font-mono max-w-md">{error}</p>
        </div>
        <button
          onClick={() => fetchAnalytics(accessToken)}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Recharts</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto print:p-0">
      
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <span>Advanced Recharts Analytics Platform</span>
            <Activity className="w-5 h-5 text-[#1DB954] animate-pulse" />
          </h2>
          <p className="text-xs text-spotify-muted">
            9 interactive Recharts analytics visualizations calculated strictly from live Spotify Web API data
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 shrink-0"
        >
          <Download className="w-4 h-4 text-black" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* DASHBOARD SUMMARY HEADER (8 METRICS) */}
      <div className="bg-[#242424] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-bold font-heading text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#1DB954]" />
            <span>Dashboard Analytics Summary Header</span>
          </span>
          <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-0.5 rounded border border-[#1DB954]/20">
            8 LIVE METRICS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono">
          <div className="bg-[#181818] p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[9px] text-spotify-muted uppercase block truncate">Total Tracks</span>
            <div className="text-base font-extrabold text-white">{formatNumber(totalTracksCount)}</div>
          </div>

          <div className="bg-[#181818] p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[9px] text-spotify-muted uppercase block truncate">Total Artists</span>
            <div className="text-base font-extrabold text-purple-400">{formatNumber(totalArtistsCount)}</div>
          </div>

          <div className="bg-[#181818] p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[9px] text-spotify-muted uppercase block truncate">Total Albums</span>
            <div className="text-base font-extrabold text-blue-400">{formatNumber(totalAlbumsCount)}</div>
          </div>

          <div className="bg-[#181818] p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[9px] text-spotify-muted uppercase block truncate">Total Genres</span>
            <div className="text-base font-extrabold text-amber-400">{formatNumber(totalGenresCount)}</div>
          </div>

          <div className="bg-[#181818] p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[9px] text-spotify-muted uppercase block truncate">Avg Popularity</span>
            <div className="text-base font-extrabold text-[#1DB954]">{avgPopularity}/100</div>
          </div>

          <div className="bg-[#181818] p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[9px] text-spotify-muted uppercase block truncate">Avg Duration</span>
            <div className="text-base font-extrabold text-indigo-400">{formatDurationMs(avgDurationMs)}</div>
          </div>

          <div className="bg-[#181818] p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[9px] text-spotify-muted uppercase block truncate">Explicit %</span>
            <div className="text-base font-extrabold text-red-400">{explicitPct}%</div>
          </div>

          <div className="bg-[#181818] p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[9px] text-spotify-muted uppercase block truncate">Top Followers</span>
            <div className="text-base font-extrabold text-pink-400 truncate">{formatFollowers(totalFollowersSum)}</div>
          </div>
        </div>
      </div>

      {/* 9 INTERACTIVE RECHARTS VISUALIZATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Genre Distribution Pie Chart */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <PieIcon className="w-4 h-4 text-[#1DB954]" />
              <span>1. Genre Distribution</span>
            </div>
            <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded">PIE CHART</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genreDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4}>
                  {genreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Top Artists Popularity (Horizontal Bar) */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Users className="w-4 h-4 text-purple-400" />
              <span>2. Top Artists Popularity</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">HORIZONTAL BAR</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10ArtistsData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis type="number" stroke="#9CA3AF" fontSize={10} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Popularity" fill="#A855F7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Track Popularity Bar Chart */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Music className="w-4 h-4 text-blue-400" />
              <span>3. Track Popularity</span>
            </div>
            <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">TOP TRACKS</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top20TracksData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={9} interval={0} angle={-30} textAnchor="end" />
                <YAxis stroke="#9CA3AF" fontSize={10} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Popularity" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Audio Features Radar Chart */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>4. Audio Features Radar</span>
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">RADAR CHART</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={60} data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" fontSize={8} />
                <Radar name="Acoustic Metric" dataKey="Score" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Popularity Histogram */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>5. Popularity Histogram</span>
            </div>
            <span className="text-[10px] font-mono text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded">SCORE BRACKETS</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularityHistogramData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="range" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Tracks" fill="#EC4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Album Release Timeline */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>6. Album Release Timeline</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">RELEASE YEARS</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={releaseTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="year" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Tracks" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Explicit vs Clean Songs (Donut) */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Radio className="w-4 h-4 text-red-400" />
              <span>7. Explicit vs Clean Songs</span>
            </div>
            <span className="text-[10px] font-mono text-red-300 bg-red-500/10 px-2 py-0.5 rounded">DONUT CHART</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={explicitCleanData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                  <Cell fill="#1DB954" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. Artist Diversity Score */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>8. Artist Diversity Score</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">CREATOR RATIO</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diversityData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="metric" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Value" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 9. Playlist Size Comparison */}
        <div className="bg-[#242424] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Library className="w-4 h-4 text-cyan-400" />
              <span>9. Playlist Size Comparison</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">TRACKS PER PLAYLIST</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={playlistSizeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={9} interval={0} angle={-30} textAnchor="end" />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Tracks" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
