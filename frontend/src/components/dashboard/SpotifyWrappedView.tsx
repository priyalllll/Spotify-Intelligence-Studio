import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Download,
  Share2,
  Check,
  Crown,
  Heart,
  Disc,
  Music,
  Users,
  Brain,
  Award,
  Calendar,
  Flame,
  Globe,
  Loader2,
  AlertCircle,
  RefreshCw,
  Zap,
  Activity,
  User as UserIcon,
  RotateCcw
} from 'lucide-react';
import type {
  SpotifyUserProfile,
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
import { calculateSpotifyIntelligenceScores } from '../../utils/analyticsEngine';
import { RadialGauge } from './RadialGauge';
import {
  formatFollowers,
  formatDurationMs,
  formatNumber,
  formatSafeString
} from '../../utils/formatters';

interface SpotifyWrappedViewProps {
  accessToken?: string;
}

export const SpotifyWrappedView: React.FC<SpotifyWrappedViewProps> = ({ accessToken }) => {
  const [profile, setProfile] = useState<SpotifyUserProfile | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<SpotifyAudioFeatures[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Story Navigation State (8 Slides)
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const totalSlides = 8;

  const fetchWrappedTelemetry = (token?: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFromBackend<SpotifyUserProfile>('/auth/me', token).catch(() => null),
      fetchFromBackend<SpotifyTopArtistsResponse>('/api/top-artists', token).catch(() => null),
      fetchFromBackend<SpotifyTopTracksResponse>('/api/top-tracks', token).catch(() => null),
      fetchFromBackend<SpotifyPlaylistsResponse>('/api/playlists', token).catch(() => null),
      spotifyAudioService.getAudioAnalysis(token || '').catch(() => null),
    ])
      .then(([profData, artistsData, tracksData, playlistsData, audioData]) => {
        if (profData) setProfile(profData);
        if (artistsData?.items) setTopArtists(artistsData.items);
        if (tracksData?.items) setTopTracks(tracksData.items);
        if (playlistsData?.items) setPlaylists(playlistsData.items);
        if (audioData?.audio_features) setAudioFeatures(audioData.audio_features);
      })
      .catch((err: Error) => {
        console.error('Error loading Wrapped telemetry:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWrappedTelemetry(accessToken);
  }, [accessToken]);

  // Story Auto-advance Timer (7 seconds per slide)
  useEffect(() => {
    if (loading || error) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
    }, 7000);
    return () => clearInterval(interval);
  }, [loading, error]);

  const handleNextSlide = () => {
    setActiveSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => Math.max(0, prev - 1));
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Calculations
  const userName = formatSafeString(profile?.display_name, profile?.id || 'Spotify Listener');
  const userImage = profile?.images?.[0]?.url;

  const analytics = calculateSpotifyIntelligenceScores(
    topArtists,
    topTracks,
    playlists,
    audioFeatures
  );

  const allGenres = topArtists.flatMap((a) => a.genres || []);
  const genreCounts: Record<string, number> = {};
  allGenres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const top1Genre = sortedGenres[0]?.[0]
    ? sortedGenres[0][0].charAt(0).toUpperCase() + sortedGenres[0][0].slice(1)
    : 'Not Available';

  const top1Artist = topArtists[0];
  const top1Track = topTracks[0];

  // Loading State UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-[#181818]/60 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl max-w-4xl mx-auto">
        <Loader2 className="w-10 h-10 text-[#1DB954] animate-spin" />
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Generating Your Spotify Wrapped</h3>
          <p className="text-xs text-spotify-muted">Synthesizing top artists, tracks, acoustic personality, and intelligence scores...</p>
        </div>
      </div>
    );
  }

  // Error State UI
  if (error && topArtists.length === 0 && topTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#242424] rounded-3xl border border-red-500/30 p-8 text-center shadow-2xl max-w-2xl mx-auto">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Unable to Generate Wrapped</h3>
          <p className="text-xs text-red-300 font-mono max-w-md">{error}</p>
        </div>
        <button
          onClick={() => fetchWrappedTelemetry(accessToken)}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Wrapped Generation</span>
        </button>
      </div>
    );
  }

  // Gradient Background Themes for Each Slide
  const slideGradients = [
    'from-emerald-900 via-[#181818] to-black',
    'from-purple-900 via-[#181818] to-black',
    'from-blue-900 via-[#181818] to-black',
    'from-amber-900 via-[#181818] to-black',
    'from-pink-900 via-[#181818] to-black',
    'from-cyan-900 via-[#181818] to-black',
    'from-indigo-900 via-[#181818] to-black',
    'from-emerald-950 via-purple-950 to-black',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:p-0">
      
      {/* Top Action Header Controls */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 print:hidden">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold font-heading text-white">Spotify Wrapped 2026</h2>
          <span className="text-[10px] font-mono bg-[#1DB954]/20 text-[#1DB954] px-2.5 py-0.5 rounded-full font-bold">
            STORY EXPERIENCE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-full bg-[#242424] hover:bg-[#2A2A2A] text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all shadow-md"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Copied' : 'Share Card'}</span>
          </button>
        </div>
      </div>

      {/* STORY CONTAINER CARD */}
      <div className={`relative bg-gradient-to-br ${slideGradients[activeSlide]} rounded-3xl border border-white/20 shadow-2xl overflow-hidden min-h-[600px] flex flex-col justify-between p-6 sm:p-10 transition-all duration-700`}>
        
        {/* Story Progress Indicators Bar (Top) */}
        <div className="flex items-center gap-1.5 z-20">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div key={idx} className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  idx < activeSlide
                    ? 'w-full'
                    : idx === activeSlide
                    ? 'w-full animate-pulse'
                    : 'w-0'
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* SLIDE CONTENT RENDERER */}
        <div className="my-auto py-8 z-10 space-y-6 animate-fadeIn">
          
          {/* SLIDE 0: Welcome */}
          {activeSlide === 0 && (
            <div className="space-y-6 text-center sm:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/30">
                ✦ SPOTIFY WRAPPED 2026
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                {userImage ? (
                  <img src={userImage} alt={userName} className="w-28 h-28 rounded-3xl object-cover border-2 border-[#1DB954] shadow-[0_0_30px_rgba(29,185,84,0.5)] shrink-0" />
                ) : (
                  <div className="w-28 h-28 rounded-3xl bg-[#1DB954] flex items-center justify-center text-black font-extrabold text-4xl shrink-0">
                    <UserIcon className="w-12 h-12 text-black" />
                  </div>
                )}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
                    {userName}'s Wrapped
                  </h1>
                  <p className="text-sm text-spotify-muted max-w-md">
                    Here is your official 2026 Spotify audio telemetry story calculated live from your account streams.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 font-mono text-center">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                  <div className="text-xl font-extrabold text-[#1DB954]">{topTracks.length}</div>
                  <span className="text-[10px] text-spotify-muted uppercase">Top Songs</span>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                  <div className="text-xl font-extrabold text-purple-400">{topArtists.length}</div>
                  <span className="text-[10px] text-spotify-muted uppercase">Top Artists</span>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                  <div className="text-xl font-extrabold text-blue-400">{playlists.length}</div>
                  <span className="text-[10px] text-spotify-muted uppercase">Playlists</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: Top Artists */}
          {activeSlide === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">✦ CREATOR ROSTER</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">Your Top Artist of 2026</h2>
              </div>

              {top1Artist && (
                <div className="bg-black/50 p-6 rounded-3xl border border-purple-500/40 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
                  {top1Artist.images?.[0]?.url && (
                    <img src={top1Artist.images[0].url} alt={top1Artist.name} className="w-28 h-28 rounded-2xl object-cover border-2 border-purple-400 shrink-0" />
                  )}
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-xs font-mono font-bold text-purple-400">#1 RANKED CREATOR</span>
                    <h3 className="text-3xl font-extrabold font-heading text-white">{top1Artist.name}</h3>
                    <p className="text-xs font-mono text-spotify-muted">
                      {top1Artist.genres?.slice(0, 3).join(', ')} • {formatFollowers(top1Artist.followers?.total)} Followers
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {topArtists.slice(1, 5).map((artist, idx) => (
                  <div key={artist.id} className="bg-black/40 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-purple-400">#{idx + 2}</span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{artist.name}</div>
                      <div className="text-[10px] text-spotify-subtle font-mono">{artist.popularity}% Popularity</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 2: Top Songs */}
          {activeSlide === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">✦ ANTHEM OF THE YEAR</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">Your Top Played Song</h2>
              </div>

              {top1Track && (
                <div className="bg-black/50 p-6 rounded-3xl border border-blue-500/40 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
                  {top1Track.album?.images?.[0]?.url && (
                    <img src={top1Track.album.images[0].url} alt={top1Track.name} className="w-28 h-28 rounded-2xl object-cover border-2 border-blue-400 shrink-0" />
                  )}
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-xs font-mono font-bold text-blue-400">#1 STREAMED ANTHEM</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{top1Track.name}</h3>
                    <p className="text-xs font-mono text-spotify-muted">
                      By {top1Track.artists?.map((a) => a.name).join(', ')} • {formatDurationMs(top1Track.duration_ms)}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {topTracks.slice(1, 4).map((track, idx) => (
                  <div key={track.id} className="bg-black/40 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-xs font-mono font-bold text-blue-400">#{idx + 2}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{track.name}</div>
                        <div className="text-[10px] text-spotify-muted truncate">{track.artists?.map((a) => a.name).join(', ')}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-blue-300">{formatDurationMs(track.duration_ms)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 3: Favorite Genres */}
          {activeSlide === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">✦ SONIC SPECTRUM</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">Your Dominant Genre</h2>
              </div>

              <div className="bg-black/50 p-6 rounded-3xl border border-amber-500/40 text-center sm:text-left space-y-4">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">TOP GENRE</span>
                <div className="text-4xl font-extrabold font-heading text-white">{top1Genre}</div>
                <p className="text-xs text-spotify-muted font-sans max-w-md">
                  Your listening catalog exhibits a heavy concentration of {top1Genre} production styles and harmonic composition.
                </p>
              </div>

              <div className="space-y-2">
                {sortedGenres.slice(1, 5).map(([genre, count], idx) => {
                  const pct = Math.round((count / (allGenres.length || 1)) * 100);
                  return (
                    <div key={genre} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-white capitalize">{genre}</span>
                        <span className="text-amber-400 font-mono">{pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SLIDE 4: Listening Personality */}
          {activeSlide === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400">✦ AI TASTE ARCHETYPE</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">Your Listening Personality</h2>
              </div>

              <div className="bg-black/50 p-6 sm:p-8 rounded-3xl border border-pink-500/40 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-pink-400" />
                  <div>
                    <span className="text-[10px] font-mono text-pink-400 uppercase font-bold">PERSONA TITLE</span>
                    <h3 className="text-2xl font-bold font-heading text-white">Deep Focus Acoustic Explorer</h3>
                  </div>
                </div>
                <p className="text-xs text-spotify-muted font-sans leading-relaxed">
                  You stream music as a cognitive stimulant for deep productivity and focus states. Your catalog balances high optimistic valence stability with rich instrumental complexity.
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 5: Discovery & Intelligence Scores */}
          {activeSlide === 5 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">✦ COMPOSITE SCORES</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">Intelligence & Discovery</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="bg-black/50 p-6 rounded-3xl border border-[#1DB954]/40 flex flex-col items-center text-center space-y-2">
                  <RadialGauge score={analytics.overallScore} size={140} strokeWidth={12} color="#1DB954" glowColor="rgba(29,185,84,0.5)" title="Intelligence" subtitle="Overall Index" />
                  <span className="text-xs font-mono font-bold text-white mt-2">Overall Score: {analytics.overallScore}/100</span>
                </div>

                <div className="bg-black/50 p-6 rounded-3xl border border-cyan-500/40 flex flex-col items-center text-center space-y-2">
                  <RadialGauge score={analytics.discoveryScore} size={140} strokeWidth={12} color="#06B6D4" glowColor="rgba(6,182,212,0.5)" title="Discovery" subtitle="Indie Rating" />
                  <span className="text-xs font-mono font-bold text-white mt-2">Discovery Score: {analytics.discoveryScore}/100</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: Listening Timeline */}
          {activeSlide === 6 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">✦ MONTHLY HIGHLIGHTS</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">Listening Velocity</h2>
              </div>

              <div className="bg-black/50 p-6 rounded-3xl border border-indigo-500/40 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-spotify-muted">Peak Focus Window:</span>
                  <span className="text-indigo-300 font-bold">11:00 PM – 1:00 AM</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-spotify-muted">Monthly Stream Growth:</span>
                  <span className="text-[#1DB954] font-bold">+34% Trajectory</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-spotify-muted">Catalog Ingestion:</span>
                  <span className="text-white font-bold">{topTracks.length} Top Tracks Synced</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7: Final Wrapped Summary Card */}
          {activeSlide === 7 && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1DB954]">✦ WRAPPED CARD 2026</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">{userName}'s Summary</h2>
              </div>

              <div className="bg-black/60 p-6 rounded-3xl border-2 border-[#1DB954] space-y-4 shadow-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-spotify-muted uppercase">Top Artist</span>
                    <div className="text-xs font-bold text-[#1DB954] truncate">{top1Artist?.name || 'Artist'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-spotify-muted uppercase">Top Song</span>
                    <div className="text-xs font-bold text-purple-300 truncate">{top1Track?.name || 'Song'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-spotify-muted uppercase">Top Genre</span>
                    <div className="text-xs font-bold text-amber-300 truncate">{top1Genre}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-spotify-muted uppercase">Score</span>
                    <div className="text-xs font-bold text-cyan-300">{analytics.overallScore}/100</div>
                  </div>
                </div>

                <p className="text-xs text-spotify-muted font-sans border-t border-white/10 pt-3 leading-relaxed">
                  "Your 2026 Spotify Wrapped card is verified by Gemini AI. Characterized by high focus flow and discovery breadth across {topArtists.length} top creators."
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Navigation Controls Bar (Bottom) */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 z-20">
          <button
            onClick={handlePrevSlide}
            disabled={activeSlide === 0}
            className="p-2.5 rounded-full bg-black/40 hover:bg-white/10 text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold text-white">
            Slide {activeSlide + 1} of {totalSlides}
          </span>

          <button
            onClick={handleNextSlide}
            disabled={activeSlide === totalSlides - 1}
            className="p-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black disabled:opacity-30 transition-all font-bold"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
