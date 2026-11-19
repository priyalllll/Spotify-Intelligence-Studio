import React, { useState, useEffect } from 'react';
import {
  Music,
  Clock,
  Flame,
  Zap,
  Play,
  Pause,
  Sparkles,
  BarChart2,
  TrendingUp,
  Activity,
  Gem,
  Star,
  ExternalLink,
  Loader2,
  AlertCircle,
  Search,
  ArrowUpDown,
  Volume2,
  RefreshCw
} from 'lucide-react';
import type { SpotifyTrack, SpotifyTopTracksResponse } from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import {
  formatDurationMs,
  formatPercent,
  formatNumber,
  formatSafeString
} from '../../utils/formatters';

interface TracksViewProps {
  accessToken?: string;
}

export const TracksView: React.FC<TracksViewProps> = ({ accessToken }) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'duration'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Preview Audio Player State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const fetchTopTracks = (token?: string) => {
    setLoading(true);
    setError(null);

    fetchFromBackend<SpotifyTopTracksResponse>('/api/top-tracks', token)
      .then((data) => {
        console.log('✅ Top Tracks Loaded from Spotify API:', data.items?.length || 0);
        setTracks(data.items || []);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('❌ Error fetching top tracks:', err.message);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTopTracks(accessToken);

    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [accessToken]);

  const handleTogglePlay = (track: SpotifyTrack) => {
    if (!track.preview_url) return;

    if (playingTrackId === track.id) {
      audioElement?.pause();
      setPlayingTrackId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const newAudio = new Audio(track.preview_url);
      newAudio.play();
      newAudio.onended = () => setPlayingTrackId(null);
      setAudioElement(newAudio);
      setPlayingTrackId(track.id);
    }
  };

  // Filter & Sort Logic
  const filteredTracks = tracks.filter((track) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = (track.name || '').toLowerCase().includes(q);
    const artistMatch = track.artists?.some((a) => (a.name || '').toLowerCase().includes(q));
    const albumMatch = (track.album?.name || '').toLowerCase().includes(q);
    return titleMatch || artistMatch || albumMatch;
  });

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (sortBy === 'popularity') {
      return sortOrder === 'desc' ? (b.popularity || 0) - (a.popularity || 0) : (a.popularity || 0) - (b.popularity || 0);
    }
    if (sortBy === 'duration') {
      return sortOrder === 'desc' ? (b.duration_ms || 0) - (a.duration_ms || 0) : (a.duration_ms || 0) - (b.duration_ms || 0);
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc' ? (b.name || '').localeCompare(a.name || '') : (a.name || '').localeCompare(b.name || '');
    }
    return 0;
  });

  // Loading State UI (Skeleton & Spinner)
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">Track Telemetry & Acoustic Feature Matrix</h2>
            <p className="text-xs text-spotify-muted">Fetching real-time top tracks from Spotify Web API...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-3 animate-pulse">
              <div className="h-4 w-24 bg-white/10 rounded"></div>
              <div className="h-8 w-16 bg-white/20 rounded"></div>
              <div className="h-3 w-32 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#181818]/60 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">
          <Loader2 className="w-10 h-10 text-[#1DB954] animate-spin" />
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold font-heading text-white">Loading Top Tracks</h3>
            <p className="text-xs text-spotify-muted font-mono">Querying GET /v1/me/top/tracks?limit=50 from Spotify Web API...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State UI with Retry Button
  if (error && tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#242424] rounded-3xl border border-red-500/30 p-8 text-center shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Unable to Load Top Tracks</h3>
          <p className="text-xs text-red-300 max-w-md font-mono">{error}</p>
        </div>
        <button
          onClick={() => fetchTopTracks(accessToken)}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Tracks</span>
        </button>
      </div>
    );
  }

  // Dynamic Metrics Calculated Directly from Spotify API
  const totalTracks = tracks.length;

  const avgPopularity = totalTracks > 0
    ? Math.round(tracks.reduce((acc, t) => acc + (t.popularity || 0), 0) / totalTracks)
    : 0;

  const avgDurationMs = totalTracks > 0
    ? Math.round(tracks.reduce((acc, t) => acc + (t.duration_ms || 0), 0) / totalTracks)
    : 0;

  const explicitCount = tracks.filter((t) => t.explicit).length;
  const explicitPercentage = totalTracks > 0 ? (explicitCount / totalTracks) * 100 : 0;

  const top1Track = tracks[0] || null;

  const kpis = [
    {
      title: 'Total Tracks Ingested',
      value: formatNumber(totalTracks),
      change: 'Spotify API',
      sub: 'medium-term catalog',
      icon: Music,
      color: 'text-[#1DB954]'
    },
    {
      title: 'Average Duration',
      value: `${formatDurationMs(avgDurationMs)} min`,
      change: 'Playback Index',
      sub: 'average track length',
      icon: Clock,
      color: 'text-purple-400'
    },
    {
      title: 'Average Popularity',
      value: `${avgPopularity} / 100`,
      change: 'Mainstream Affinity',
      sub: 'popularity score',
      icon: Flame,
      color: 'text-amber-400'
    },
    {
      title: 'Explicit Content Ratio',
      value: formatPercent(explicitPercentage),
      change: `${explicitCount} Explicit Tracks`,
      sub: 'content rating ratio',
      icon: Zap,
      color: 'text-blue-400'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Track Telemetry & Acoustic Feature Matrix</h2>
          <p className="text-xs text-spotify-muted">
            Analyzing {totalTracks} Spotify tracks across popularity index, duration matrix, and streaming velocity
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] bg-[#181818] px-3.5 py-1.5 rounded-full border border-white/5 shadow-md">
          <Sparkles className="w-4 h-4" />
          <span>Spotify Web API Telemetry Live</span>
        </div>
      </div>

      {/* 1. Four KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 hover:border-[#1DB954]/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-spotify-muted font-semibold">{kpi.title}</span>
                <div className={`p-2 rounded-xl bg-[#181818] border border-white/5 ${kpi.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-extrabold font-heading text-white tracking-tight truncate">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono mt-1">
                  <span className="text-[#1DB954] font-bold truncate max-w-[140px]">{kpi.change}</span>
                  <span className="text-spotify-subtle">{kpi.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Sorting Controls Toolbar */}
      <div className="bg-[#242424] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-spotify-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists, or albums..."
            className="w-full bg-[#181818] text-white text-xs rounded-full pl-10 pr-4 py-2.5 border border-white/10 focus:border-[#1DB954] focus:outline-none transition-all placeholder:text-spotify-subtle"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-xs font-mono text-spotify-muted">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#1DB954]" />
            <span>Sort by:</span>
          </div>

          <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-xl border border-white/5 text-xs font-mono">
            {[
              { id: 'popularity', label: 'Popularity' },
              { id: 'name', label: 'Title' },
              { id: 'duration', label: 'Duration' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  if (sortBy === option.id) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(option.id as any);
                    setSortOrder('desc');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === option.id
                    ? 'bg-[#1DB954] text-black font-bold'
                    : 'text-spotify-muted hover:text-white'
                }`}
              >
                {option.label} {sortBy === option.id ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Detailed Top Tracks Table */}
      <div className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Top Spotify Tracks Catalog</h3>
              <p className="text-[11px] text-spotify-muted">Showing {sortedTracks.length} of {totalTracks} tracks</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
            GET /v1/me/top/tracks
          </span>
        </div>

        {sortedTracks.length === 0 ? (
          <div className="py-16 text-center text-xs text-spotify-muted font-mono space-y-2">
            <Music className="w-8 h-8 text-[#1DB954] mx-auto opacity-60" />
            <p className="text-white font-bold text-sm">No tracks matched your search query</p>
            <p>Try clearing your search keyword "{searchQuery}" to view all tracks.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-spotify-muted border-b border-white/5 text-[10px] uppercase font-mono tracking-wider">
                  <th className="pb-3 font-semibold pl-2"># Track</th>
                  <th className="pb-3 font-semibold">Album</th>
                  <th className="pb-3 font-semibold">Popularity Index</th>
                  <th className="pb-3 font-semibold">Preview Audio</th>
                  <th className="pb-3 font-semibold text-right pr-2">Duration / Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedTracks.map((track, index) => {
                  const rankText = `#${index + 1}`;
                  const albumCover = track.album?.images?.[0]?.url;
                  const artistNames = track.artists?.map((a) => a.name).join(', ') || 'Not Available';
                  const durationFormatted = formatDurationMs(track.duration_ms);
                  const isPlaying = playingTrackId === track.id;
                  const popularityScore = track.popularity ?? 0;

                  return (
                    <tr key={track.id || index} className="group hover:bg-[#2A2A2A] transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#1DB954] w-6">{rankText}</span>
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 group border border-white/10">
                            {albumCover ? (
                              <img src={albumCover} alt={track.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-[#181818] flex items-center justify-center text-white">
                                <Music className="w-4 h-4 text-[#1DB954]" />
                              </div>
                            )}
                            {track.preview_url && (
                              <button
                                onClick={() => handleTogglePlay(track)}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity"
                                title={isPlaying ? 'Pause 30s Audio Preview' : 'Play 30s Audio Preview'}
                              >
                                {isPlaying ? (
                                  <Pause className="w-4 h-4 text-[#1DB954] fill-[#1DB954] animate-pulse" />
                                ) : (
                                  <Play className="w-4 h-4 text-white fill-white group-hover:text-[#1DB954] group-hover:fill-[#1DB954]" />
                                )}
                              </button>
                            )}
                          </div>
                          <div className="max-w-[200px] sm:max-w-[260px] truncate">
                            <div className="font-bold text-[#1DB954] hover:underline flex items-center gap-1.5 truncate cursor-pointer" onClick={() => window.open(track.external_urls?.spotify || 'https://open.spotify.com', '_blank')}>
                              <span className="truncate">{formatSafeString(track.name, 'Spotify Track')}</span>
                              {track.explicit && (
                                <span className="bg-red-500/20 text-red-400 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-red-500/30 shrink-0">
                                  EXPLICIT
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-spotify-muted truncate">{artistNames}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 text-spotify-muted max-w-[160px] truncate">
                        {formatSafeString(track.album?.name, 'Single')}
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#181818] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1DB954] rounded-full"
                              style={{ width: `${popularityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono text-spotify-muted">{popularityScore}%</span>
                        </div>
                      </td>

                      <td className="py-3">
                        {track.preview_url ? (
                          <button
                            onClick={() => handleTogglePlay(track)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                              isPlaying
                                ? 'bg-[#1DB954] text-black border-[#1DB954]'
                                : 'bg-[#181818] text-[#1DB954] border-white/5 hover:border-[#1DB954]/40'
                            }`}
                          >
                            {isPlaying ? <Volume2 className="w-3 h-3 animate-bounce" /> : <Play className="w-3 h-3 fill-current" />}
                            <span>{isPlaying ? 'Playing Preview' : '30s Preview'}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-spotify-subtle">No Preview</span>
                        )}
                      </td>

                      <td className="py-3 text-right pr-2 font-semibold">
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-mono text-white text-xs">{durationFormatted}</span>
                          <a
                            href={track.external_urls?.spotify || 'https://open.spotify.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181818] hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors text-[11px] font-mono border border-white/5"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
