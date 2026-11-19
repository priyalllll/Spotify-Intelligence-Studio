import React, { useState, useEffect } from 'react';
import { History, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { formatDurationMs, formatSafeString } from '../../utils/formatters';

interface RecentlyPlayedTableProps {
  accessToken?: string;
}

interface RecentlyPlayedItem {
  track: {
    id: string;
    name: string;
    popularity: number;
    duration_ms: number;
    artists?: Array<{ name: string }>;
    album?: {
      name: string;
      images?: Array<{ url: string }>;
    };
    external_urls?: {
      spotify?: string;
    };
  };
  played_at: string;
}

export const RecentlyPlayedTable: React.FC<RecentlyPlayedTableProps> = ({ accessToken }) => {
  const [items, setItems] = useState<RecentlyPlayedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentlyPlayed = () => {
    setLoading(true);
    setError(null);

    fetchFromBackend<{ items?: RecentlyPlayedItem[] }>('/api/recently-played', accessToken)
      .then((data) => {
        if (data?.items) {
          setItems(data.items);
        }
      })
      .catch((err: Error) => {
        console.error('Error fetching recently played:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecentlyPlayed();
  }, [accessToken]);

  const formatPlayedAt = (iso: string) => {
    if (!iso) return 'Recently';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins || 1} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hrs ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  };

  return (
    <div className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">Recently Played Streams</h3>
            <p className="text-[11px] text-spotify-muted">Real-time Spotify Web API stream telemetry</p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
          GET /v1/me/player/recently-played
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 space-y-2">
          <Loader2 className="w-6 h-6 text-[#1DB954] animate-spin" />
          <span className="text-xs text-spotify-muted font-mono ml-2">Loading recently played streams...</span>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-xs text-red-300 font-mono space-y-3">
          <p>Failed to load recent stream history: {error}</p>
          <button
            onClick={fetchRecentlyPlayed}
            className="px-3 py-1.5 rounded-full bg-[#1DB954] text-black font-extrabold text-xs inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Sync</span>
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-xs text-spotify-muted font-mono">
          No recent stream history returned from Spotify API. Stream tracks on Spotify to populate this log!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-spotify-muted border-b border-white/5 text-[10px] uppercase font-mono tracking-wider">
                <th className="pb-3 font-semibold pl-2"># Track</th>
                <th className="pb-3 font-semibold">Album</th>
                <th className="pb-3 font-semibold">Popularity</th>
                <th className="pb-3 font-semibold text-right pr-2">Played / Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.slice(0, 10).map((item, index) => {
                const track = item.track;
                const cover = track?.album?.images?.[0]?.url;
                const artistName = track?.artists?.map((a) => a.name).join(', ') || 'Spotify Artist';
                const trackName = formatSafeString(track?.name, 'Spotify Track');
                const albumName = formatSafeString(track?.album?.name, 'Single');
                const popularityScore = track?.popularity ?? 0;

                return (
                  <tr
                    key={`${track?.id || index}-${index}`}
                    className="group hover:bg-[#2A2A2A] transition-colors"
                  >
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="text-spotify-subtle font-mono text-[11px] w-4">{index + 1}</span>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 group border border-white/10">
                          {cover ? (
                            <img src={cover} alt={trackName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#181818] flex items-center justify-center text-white">
                              <History className="w-4 h-4 text-[#1DB954]" />
                            </div>
                          )}
                          <a
                            href={track?.external_urls?.spotify || 'https://open.spotify.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <ExternalLink className="w-4 h-4 text-[#1DB954]" />
                          </a>
                        </div>
                        <div className="max-w-[200px] truncate">
                          <div className="font-bold text-white group-hover:text-[#1DB954] transition-colors truncate">
                            {trackName}
                          </div>
                          <div className="text-[11px] text-spotify-muted truncate">{artistName}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-spotify-muted">
                      <span className="truncate max-w-[140px] block">{albumName}</span>
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

                    <td className="py-3 text-right pr-2">
                      <div className="text-white font-mono text-[11px]">{formatPlayedAt(item.played_at)}</div>
                      <div className="text-[10px] text-spotify-subtle font-mono">{formatDurationMs(track?.duration_ms)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
