import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Music,
  Users,
  Library,
  Disc,
  Clock,
  Sparkles,
  ExternalLink,
  Flame,
  Play,
  Pause,
  Loader2,
  Trash2,
  History,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import type { SpotifyArtist, SpotifyTrack, SpotifyPlaylist } from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { formatDurationMs, formatFollowers } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken?: string;
}

export type SearchSortOption = 'popularity' | 'alphabetical' | 'followers' | 'duration' | 'recent';
export type SearchCategoryFilter = 'all' | 'artists' | 'tracks' | 'playlists' | 'genres';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  accessToken,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState<SearchCategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SearchSortOption>('popularity');
  const [loading, setLoading] = useState(false);

  // Cached Datasets
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

  // Search History
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [playingPreviewUrl, setPlayingPreviewUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load datasets & local search history on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('spotify_search_history');
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    } catch (e) {}

    Promise.all([
      fetchFromBackend<{ items?: SpotifyArtist[] }>('/api/top-artists', accessToken).catch(() => null),
      fetchFromBackend<{ items?: SpotifyTrack[] }>('/api/top-tracks', accessToken).catch(() => null),
      fetchFromBackend<{ items?: SpotifyPlaylist[] }>('/api/playlists', accessToken).catch(() => null),
    ]).then(([artistsData, tracksData, playlistsData]) => {
      if (artistsData?.items) setTopArtists(artistsData.items);
      if (tracksData?.items) setTopTracks(tracksData.items);
      if (playlistsData?.items) setPlaylists(playlistsData.items);
    });
  }, [accessToken]);

  // Keyboard shortcut Ctrl + K / Cmd + K to open/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent if triggered
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounce Query (400ms)
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setLoading(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  // Save to history helper
  const handleSaveHistory = (term: string) => {
    if (!term) return;
    const updated = [term, ...searchHistory.filter((h) => h.toLowerCase() !== term.toLowerCase())].slice(0, 8);
    setSearchHistory(updated);
    try {
      localStorage.setItem('spotify_search_history', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('spotify_search_history');
    } catch (e) {}
  };

  // Audio Preview Toggle
  const togglePreview = (url: string) => {
    if (playingPreviewUrl === url) {
      audioRef.current?.pause();
      setPlayingPreviewUrl(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const newAudio = new Audio(url);
      newAudio.volume = 0.5;
      newAudio.play();
      newAudio.onended = () => setPlayingPreviewUrl(null);
      audioRef.current = newAudio;
      setPlayingPreviewUrl(url);
    }
  };

  // Search Results Filtering & Sorting
  const q = debouncedQuery.toLowerCase();

  const matchingArtists = topArtists.filter(
    (a) => a.name.toLowerCase().includes(q) || a.genres?.some((g) => g.toLowerCase().includes(q))
  );

  const matchingTracks = topTracks.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.artists?.some((a) => a.name.toLowerCase().includes(q)) ||
      t.album?.name.toLowerCase().includes(q)
  );

  const matchingPlaylists = playlists.filter(
    (p) => p.name.toLowerCase().includes(q) || p.owner?.display_name?.toLowerCase().includes(q)
  );

  // Sorting Handler
  const sortItems = <T extends any>(items: T[]): T[] => {
    return [...items].sort((a: any, b: any) => {
      if (sortBy === 'popularity') return (b.popularity || 0) - (a.popularity || 0);
      if (sortBy === 'alphabetical') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'followers') return (b.followers?.total || 0) - (a.followers?.total || 0);
      if (sortBy === 'duration') return (b.duration_ms || 0) - (a.duration_ms || 0);
      return 0;
    });
  };

  const sortedArtists = sortItems(matchingArtists);
  const sortedTracks = sortItems(matchingTracks);
  const sortedPlaylists = sortItems(matchingPlaylists);

  // Highlight Text Helper
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-[#1DB954]/30 text-[#1DB954] font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  const totalResultsCount =
    (category === 'all' || category === 'artists' ? sortedArtists.length : 0) +
    (category === 'all' || category === 'tracks' ? sortedTracks.length : 0) +
    (category === 'all' || category === 'playlists' ? sortedPlaylists.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181818] w-full max-w-4xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
        
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 bg-[#242424] border-b border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[#1DB954] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveHistory(query)}
              placeholder="Search artists, tracks, playlists, genres... (Ctrl + K)"
              className="flex-1 bg-transparent text-white text-base sm:text-lg focus:outline-none placeholder:text-spotify-subtle font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full hover:bg-white/10 text-spotify-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full bg-[#121212] hover:bg-white/10 text-spotify-muted hover:text-white text-xs font-mono font-bold border border-white/10"
            >
              ESC
            </button>
          </div>

          {/* Filter Chips & Sorting Control */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['all', 'artists', 'tracks', 'playlists'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase font-mono transition-all ${
                    category === cat
                      ? 'bg-[#1DB954] text-black font-extrabold shadow'
                      : 'bg-[#181818] text-spotify-muted hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-spotify-muted">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#1DB954]" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SearchSortOption)}
                className="bg-[#181818] text-white text-xs rounded-lg px-2.5 py-1 border border-white/10 focus:outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="followers">Followers</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Results / History Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 text-[#1DB954] animate-spin" />
              <span className="text-xs font-mono text-spotify-muted">Searching Spotify Catalog...</span>
            </div>
          ) : !debouncedQuery ? (
            /* Recent Searches State */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
                  <History className="w-4 h-4 text-[#1DB954]" />
                  <span>Recent Searches</span>
                </div>
                {searchHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-[10px] font-mono text-spotify-muted hover:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>

              {searchHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#242424] hover:bg-[#1DB954] hover:text-black text-xs text-spotify-muted font-semibold transition-all border border-white/5 flex items-center gap-2"
                    >
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-spotify-subtle font-mono py-4">No recent search history. Type above to search artists, tracks, or playlists.</p>
              )}
            </div>
          ) : totalResultsCount === 0 ? (
            /* Empty Search State */
            <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
              <Search className="w-10 h-10 text-spotify-subtle" />
              <h4 className="text-sm font-bold text-white font-heading">No Results Found</h4>
              <p className="text-xs text-spotify-muted font-mono max-w-sm">No artists, tracks, or playlists match "{debouncedQuery}". Try refining your query.</p>
            </div>
          ) : (
            /* Active Results Grid */
            <div className="space-y-6">
              
              {/* Artists Category Results */}
              {(category === 'all' || category === 'artists') && sortedArtists.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                    <Users className="w-4 h-4 text-[#1DB954]" />
                    <span>Artists ({sortedArtists.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {sortedArtists.map((artist) => (
                      <div key={artist.id} className="bg-[#242424] p-3 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3 truncate">
                          {artist.images?.[0]?.url ? (
                            <img src={artist.images[0].url} alt={artist.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
                              <Users className="w-5 h-5" />
                            </div>
                          )}
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">
                              {renderHighlightedText(artist.name, debouncedQuery)}
                            </div>
                            <div className="text-[10px] text-spotify-muted truncate">
                              {artist.genres?.slice(0, 2).join(', ') || 'Artist'}
                            </div>
                          </div>
                        </div>

                        <a
                          href={artist.external_urls?.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-[#181818] hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracks Category Results */}
              {(category === 'all' || category === 'tracks') && sortedTracks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                    <Music className="w-4 h-4 text-purple-400" />
                    <span>Tracks ({sortedTracks.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {sortedTracks.map((track) => (
                      <div key={track.id} className="bg-[#242424] p-3 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3 truncate">
                          {track.album?.images?.[0]?.url ? (
                            <img src={track.album.images[0].url} alt={track.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-[#1DB954] flex items-center justify-center text-black shrink-0">
                              <Music className="w-5 h-5" />
                            </div>
                          )}
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">
                              {renderHighlightedText(track.name, debouncedQuery)}
                            </div>
                            <div className="text-[10px] text-spotify-muted truncate">
                              {track.artists?.map((a) => a.name).join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {track.preview_url && (
                            <button
                              onClick={() => togglePreview(track.preview_url!)}
                              className="p-2 rounded-full bg-[#181818] hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors"
                              title="Play audio preview"
                            >
                              {playingPreviewUrl === track.preview_url ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          <span className="text-[10px] font-mono text-spotify-muted hidden sm:inline">{formatDurationMs(track.duration_ms)}</span>
                          <a
                            href={track.external_urls?.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-[#181818] hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists Category Results */}
              {(category === 'all' || category === 'playlists') && sortedPlaylists.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                    <Library className="w-4 h-4 text-blue-400" />
                    <span>Playlists ({sortedPlaylists.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {sortedPlaylists.map((playlist) => (
                      <div key={playlist.id} className="bg-[#242424] p-3 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3 truncate">
                          {playlist.images?.[0]?.url ? (
                            <img src={playlist.images[0].url} alt={playlist.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                              <Library className="w-5 h-5" />
                            </div>
                          )}
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">
                              {renderHighlightedText(playlist.name, debouncedQuery)}
                            </div>
                            <div className="text-[10px] text-spotify-muted truncate">
                              By {playlist.owner?.display_name || 'Spotify'} • {playlist.tracks?.total || 0} tracks
                            </div>
                          </div>
                        </div>

                        <a
                          href={playlist.external_urls?.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-[#181818] hover:bg-[#1DB954] text-[#1DB954] hover:text-black transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Search Footer Bar */}
        <div className="p-3 bg-[#242424] border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-spotify-subtle">
          <span>Keyboard: Navigate with Tab • ESC to close</span>
          <span className="text-[#1DB954]">Global Spotify Search Engine</span>
        </div>

      </div>
    </div>
  );
};
