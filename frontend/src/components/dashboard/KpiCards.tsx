import React, { useState, useEffect } from 'react';
import {
  Music,
  Users,
  Library,
  Clock,
  Disc,
  Flame,
  Zap,
  Crown,
  Sparkles,
  Heart,
  Globe,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import type {
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyTopArtistsResponse,
  SpotifyTopTracksResponse,
  SpotifyPlaylistsResponse
} from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import {
  formatFollowers,
  formatDurationMs,
  formatNumber,
  formatPercent,
  formatSafeString
} from '../../utils/formatters';

interface KpiCardsProps {
  accessToken?: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ accessToken }) => {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardAnalytics = (token?: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFromBackend<SpotifyTopArtistsResponse>('/api/top-artists', token).catch(() => null),
      fetchFromBackend<SpotifyTopTracksResponse>('/api/top-tracks', token).catch(() => null),
      fetchFromBackend<SpotifyPlaylistsResponse>('/api/playlists', token).catch(() => null),
    ])
      .then(([artistsData, tracksData, playlistsData]) => {
        if (artistsData?.items) setTopArtists(artistsData.items);
        if (tracksData?.items) setTopTracks(tracksData.items);
        if (playlistsData?.items) setPlaylists(playlistsData.items);
      })
      .catch((err: Error) => {
        console.error('Error fetching dashboard analytics:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardAnalytics(accessToken);
  }, [accessToken]);

  // ==========================================
  // Dynamic Real-Time Analytics Calculations
  // ==========================================
  const totalTracksCount = topTracks.length;
  
  // Unique artists extracted from top tracks + top artists
  const uniqueArtistsSet = new Set<string>();
  topArtists.forEach((a) => uniqueArtistsSet.add(a.name));
  topTracks.forEach((t) => t.artists?.forEach((a) => uniqueArtistsSet.add(a.name)));
  const totalArtistsCount = uniqueArtistsSet.size;

  const totalPlaylistsCount = playlists.length;

  // Average Track Popularity
  const avgPopularity = totalTracksCount > 0
    ? Math.round(topTracks.reduce((acc, t) => acc + (t.popularity || 0), 0) / totalTracksCount)
    : 0;

  // Favorite Genre
  const allGenres = topArtists.flatMap((a) => a.genres || []);
  const genreCounts: Record<string, number> = {};
  allGenres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const topGenreName = sortedGenres[0]?.[0]
    ? sortedGenres[0][0].charAt(0).toUpperCase() + sortedGenres[0][0].slice(1)
    : 'Not Available';
  const topGenreCount = sortedGenres[0]?.[1] || 0;

  // Estimated Listening Hours from Top Tracks & Playlists duration
  const topTracksMs = topTracks.reduce((acc, t) => acc + (t.duration_ms || 0), 0);
  const avgTrackMs = totalTracksCount > 0 ? topTracksMs / totalTracksCount : 210000;
  const playlistsTotalTracks = playlists.reduce((acc, p) => acc + (p.tracks?.total || 0), 0);
  const estimatedPlaylistsMs = playlistsTotalTracks * avgTrackMs;
  const totalEstimatedMs = topTracksMs + estimatedPlaylistsMs;
  const estimatedHours = (totalEstimatedMs / 3600000).toFixed(1);

  // Loading Skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#242424] p-4.5 rounded-2xl border border-white/10 space-y-3 animate-pulse">
            <div className="h-3 w-20 bg-white/10 rounded"></div>
            <div className="h-7 w-28 bg-white/20 rounded"></div>
            <div className="h-2.5 w-32 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error State with Retry
  if (error && totalTracksCount === 0 && totalArtistsCount === 0) {
    return (
      <div className="bg-[#242424] p-6 rounded-2xl border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="text-sm font-bold font-heading text-white">Dashboard Telemetry Offline</h4>
            <p className="text-xs text-red-300 font-mono">{error}</p>
          </div>
        </div>
        <button
          onClick={() => fetchDashboardAnalytics(accessToken)}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 transition-transform hover:scale-105 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Telemetry</span>
        </button>
      </div>
    );
  }

  const cards = [
    {
      id: 'total-tracks',
      title: 'Total Tracks Ingested',
      value: formatNumber(totalTracksCount),
      subValue: `${totalTracksCount} top tracks fetched`,
      icon: Music,
      accentColor: 'text-[#1DB954]',
      bgGlow: 'from-[#1DB954]/15 to-transparent',
    },
    {
      id: 'artists-ingested',
      title: 'Artists Ingested',
      value: formatNumber(totalArtistsCount),
      subValue: `${totalArtistsCount} unique creators`,
      icon: Users,
      accentColor: 'text-purple-400',
      bgGlow: 'from-purple-500/15 to-transparent',
    },
    {
      id: 'playlists',
      title: 'Playlists Count',
      value: formatNumber(totalPlaylistsCount),
      subValue: `${totalPlaylistsCount} synced playlists`,
      icon: Library,
      accentColor: 'text-blue-400',
      bgGlow: 'from-blue-500/15 to-transparent',
    },
    {
      id: 'favorite-genre',
      title: 'Favorite Genre',
      value: topGenreName,
      subValue: topGenreCount > 0 ? `${topGenreCount} artist occurrences` : 'Calculated genre',
      icon: Disc,
      accentColor: 'text-pink-400',
      bgGlow: 'from-pink-500/15 to-transparent',
    },
    {
      id: 'average-popularity',
      title: 'Average Popularity',
      value: `${avgPopularity} / 100`,
      subValue: `${avgPopularity}% Mainstream Index`,
      icon: Flame,
      accentColor: 'text-amber-400',
      bgGlow: 'from-amber-500/15 to-transparent',
    },
    {
      id: 'listening-hours',
      title: 'Estimated Listening Hours',
      value: `~${estimatedHours} Hours`,
      subValue: 'Estimated from catalog durations',
      icon: Clock,
      accentColor: 'text-cyan-400',
      bgGlow: 'from-cyan-500/15 to-transparent',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2 text-xs font-heading font-bold text-white">
          <TrendingUp className="w-4 h-4 text-[#1DB954]" />
          <span>Real-Time Spotify Analytics Widgets</span>
        </div>
        <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-0.5 rounded border border-[#1DB954]/20">
          SPOTIFY API SYNCED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((kpi) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="group relative bg-[#242424] hover:bg-[#2A2A2A] p-4.5 rounded-2xl border border-white/10 hover:border-[#1DB954]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden flex flex-col justify-between"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${kpi.bgGlow} rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`}></div>

              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-spotify-muted font-semibold tracking-tight">
                    {kpi.title}
                  </span>
                  <div className={`p-1.5 rounded-xl bg-[#181818] border border-white/5 ${kpi.accentColor}`}>
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <div className="text-lg sm:text-xl font-extrabold font-heading text-white tracking-tight truncate">
                    {kpi.value}
                  </div>
                  <span className="text-[10px] text-spotify-subtle font-mono block mt-0.5 truncate">
                    {kpi.subValue}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] relative z-10 font-mono">
                <span className="text-[#1DB954] font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  Spotify Live
                </span>
                <span className="text-spotify-subtle">Calculated</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
