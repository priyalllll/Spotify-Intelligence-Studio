import React, { useState, useEffect } from 'react';
import {
  Library,
  Music,
  Clock,
  Heart,
  Disc,
  Layers,
  Sparkles,
  RefreshCw,
  BarChart2,
  PieChart,
  TrendingUp,
  Plus,
  ExternalLink,
  Loader2,
  AlertCircle,
  Globe,
  Lock,
  Users,
  FolderPlus,
  Search,
  ArrowUpDown
} from 'lucide-react';
import type { SpotifyPlaylist, SpotifyPlaylistsResponse } from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { formatNumber, formatSafeString } from '../../utils/formatters';

interface PlaylistsViewProps {
  accessToken?: string;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'tracks'>('tracks');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchPlaylists = (token?: string) => {
    setLoading(true);
    setError(null);

    fetchFromBackend<SpotifyPlaylistsResponse>('/api/playlists', token)
      .then((data) => {
        console.log('✅ Spotify Playlists Loaded from Spotify API:', data.items?.length || 0);
        setPlaylists(data.items || []);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('❌ Error fetching Spotify playlists:', err.message);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlaylists(accessToken);
  }, [accessToken]);

  // Search & Sort Filter Logic
  const filteredPlaylists = playlists.filter((playlist) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (playlist.name || '').toLowerCase().includes(q);
    const ownerMatch = (playlist.owner?.display_name || playlist.owner?.id || '').toLowerCase().includes(q);
    const descMatch = (playlist.description || '').toLowerCase().includes(q);
    return nameMatch || ownerMatch || descMatch;
  });

  const sortedPlaylists = [...filteredPlaylists].sort((a, b) => {
    if (sortBy === 'tracks') {
      const countA = a.tracks?.total || 0;
      const countB = b.tracks?.total || 0;
      return sortOrder === 'desc' ? countB - countA : countA - countB;
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc' ? (b.name || '').localeCompare(a.name || '') : (a.name || '').localeCompare(b.name || '');
    }
    return 0;
  });

  // Derived Dynamic Playlist Analytics
  const totalPlaylists = playlists.length;
  const totalTracks = playlists.reduce((acc, p) => acc + (p.tracks?.total || 0), 0);
  const publicCount = playlists.filter((p) => p.public).length;
  const privateCount = playlists.filter((p) => !p.public).length;
  const avgTracksPerPlaylist = totalPlaylists > 0 ? (totalTracks / totalPlaylists).toFixed(1) : '0';

  // KPI Summary Cards
  const kpis = [
    {
      title: 'Total Playlists',
      value: formatNumber(totalPlaylists),
      change: 'Spotify API',
      sub: 'synced with Spotify account',
      icon: Library,
      color: 'text-[#1DB954]'
    },
    {
      title: 'Total Tracks Catalog',
      value: formatNumber(totalTracks),
      change: `~${avgTracksPerPlaylist} / list`,
      sub: 'across all playlists',
      icon: Music,
      color: 'text-purple-400'
    },
    {
      title: 'Public Playlists',
      value: formatNumber(publicCount),
      change: 'Visible Profile',
      sub: 'publicly shared lists',
      icon: Globe,
      color: 'text-[#1DB954]'
    },
    {
      title: 'Private Playlists',
      value: formatNumber(privateCount),
      change: 'Personal Library',
      sub: 'private collections',
      icon: Lock,
      color: 'text-amber-400'
    },
  ];

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">Smart Playlists & Catalog Telemetry</h2>
            <p className="text-xs text-spotify-muted">Synchronizing playlists with Spotify Web API...</p>
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
            <h3 className="text-lg font-bold font-heading text-white">Loading Spotify Playlists</h3>
            <p className="text-xs text-spotify-muted font-mono">Querying GET /v1/me/playlists?limit=50 from Spotify Web API...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State UI with Retry Button
  if (error && playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#242424] rounded-3xl border border-red-500/30 p-8 text-center shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Unable to Load Spotify Playlists</h3>
          <p className="text-xs text-red-300 max-w-md font-mono">{error}</p>
        </div>
        <button
          onClick={() => fetchPlaylists(accessToken)}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Playlists</span>
        </button>
      </div>
    );
  }

  // Empty State UI
  if (!loading && !error && playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#242424] rounded-3xl border border-white/10 p-8 text-center shadow-2xl">
        <FolderPlus className="w-12 h-12 text-[#1DB954]" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">No Playlists Found</h3>
          <p className="text-xs text-spotify-muted max-w-md">You don't have any playlists in your Spotify account yet. Create a playlist on Spotify to view telemetry here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Smart Playlists & Catalog Telemetry</h2>
          <p className="text-xs text-spotify-muted">
            {totalPlaylists} active playlists synchronized with Spotify Web API ({formatNumber(totalTracks)} total tracks)
          </p>
        </div>

        <button className="px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
          <Plus className="w-4 h-4" />
          <span>Generate AI Playlist</span>
        </button>
      </div>

      {/* Playlist Summary Cards */}
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

      {/* Search & Sort Toolbar */}
      <div className="bg-[#242424] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-spotify-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playlists by name or owner..."
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
              { id: 'tracks', label: 'Track Count' },
              { id: 'name', label: 'Alphabetical' },
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

      {/* 4. Detailed Playlists Table & Clickable Cards */}
      <div className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Synced Playlist Catalog Roster</h3>
              <p className="text-[11px] text-spotify-muted">Showing {sortedPlaylists.length} of {totalPlaylists} playlists</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
            GET /v1/me/playlists
          </span>
        </div>

        {sortedPlaylists.length === 0 ? (
          <div className="py-16 text-center text-xs text-spotify-muted font-mono space-y-2">
            <Library className="w-8 h-8 text-[#1DB954] mx-auto opacity-60" />
            <p className="text-white font-bold text-sm">No playlists matched your search query</p>
            <p>Try clearing your search keyword "{searchQuery}" to view all playlists.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-spotify-muted border-b border-white/5 text-[10px] uppercase font-mono tracking-wider">
                  <th className="pb-3 font-semibold pl-2"># Playlist Name</th>
                  <th className="pb-3 font-semibold">Owner</th>
                  <th className="pb-3 font-semibold">Track Count</th>
                  <th className="pb-3 font-semibold">Visibility</th>
                  <th className="pb-3 font-semibold text-right pr-2">Spotify Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedPlaylists.map((playlist, idx) => {
                  const rankText = `#${idx + 1}`;
                  const coverImage = playlist.images?.[0]?.url;
                  const ownerName = formatSafeString(playlist.owner?.display_name || playlist.owner?.id, 'Spotify User');
                  const trackTotal = playlist.tracks?.total ?? 0;
                  const spotifyUrl = playlist.external_urls?.spotify || 'https://open.spotify.com';

                  return (
                    <tr
                      key={playlist.id || idx}
                      onClick={() => window.open(spotifyUrl, '_blank')}
                      className="group hover:bg-[#2A2A2A] cursor-pointer transition-colors"
                    >
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#1DB954] w-6">{rankText}</span>
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={playlist.name}
                              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/10"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1DB954] to-emerald-800 flex items-center justify-center text-white shrink-0">
                              <Disc className="w-5 h-5 animate-spin-slow" />
                            </div>
                          )}
                          <div className="max-w-[220px] truncate">
                            <div className="font-bold text-white group-hover:text-[#1DB954] transition-colors flex items-center gap-2 truncate">
                              <span className="truncate">{formatSafeString(playlist.name, 'Spotify Playlist')}</span>
                            </div>
                            <div className="text-[11px] text-spotify-muted truncate">{playlist.description || 'Spotify Playlist'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-spotify-muted font-mono text-[11px] max-w-[140px] truncate">
                        {ownerName}
                      </td>
                      <td className="py-3 font-mono font-bold text-[#1DB954]">
                        {trackTotal} tracks
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          {playlist.public ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30">
                              PUBLIC
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-500/15 border border-amber-500/30">
                              PRIVATE
                            </span>
                          )}
                          {playlist.collaborative && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30">
                              SHARED
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right pr-2 font-semibold">
                        <a
                          href={spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181818] hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors text-[11px] font-mono border border-white/5"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
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
