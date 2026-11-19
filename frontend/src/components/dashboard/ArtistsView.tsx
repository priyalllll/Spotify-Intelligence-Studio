import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Flame,
  Globe,
  Crown,
  Gem,
  TrendingUp,
  BarChart2,
  PieChart,
  Star,
  ExternalLink,
  Loader2,
  AlertCircle,
  UserX,
  RefreshCw
} from 'lucide-react';
import type { SpotifyArtist, SpotifyTopArtistsResponse } from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { formatFollowers, formatNumber, formatSafeString } from '../../utils/formatters';

interface ArtistsViewProps {
  accessToken?: string;
}

export const ArtistsView: React.FC<ArtistsViewProps> = ({ accessToken }) => {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartMetric, setChartMetric] = useState<'streams' | 'hours'>('streams');

  const fetchTopArtists = (token?: string) => {
    setLoading(true);
    setError(null);

    fetchFromBackend<SpotifyTopArtistsResponse>('/api/top-artists', token)
      .then((data) => {
        console.log('✅ Top Artists Loaded from Spotify API:', data.items?.length || 0);
        setArtists(data.items || []);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('❌ Error fetching top artists:', err.message);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTopArtists(accessToken);
  }, [accessToken]);

  // Loading State UI (Skeleton & Spinner)
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">Artist Telemetry & Affinity Intelligence</h2>
            <p className="text-xs text-spotify-muted">Fetching real-time top creators from Spotify Web API...</p>
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
            <h3 className="text-lg font-bold font-heading text-white">Loading Top Artists</h3>
            <p className="text-xs text-spotify-muted font-mono">Querying GET /v1/me/top/artists?limit=50 from Spotify API...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State UI with Retry Button
  if (error && artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#242424] rounded-3xl border border-red-500/30 p-8 text-center shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Unable to Load Top Artists</h3>
          <p className="text-xs text-red-300 max-w-md font-mono">{error}</p>
        </div>
        <button
          onClick={() => fetchTopArtists(accessToken)}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Artists</span>
        </button>
      </div>
    );
  }

  // Empty State UI
  if (!loading && !error && artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#242424] rounded-3xl border border-white/10 p-8 text-center shadow-2xl">
        <UserX className="w-12 h-12 text-[#1DB954]" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">No Top Artists Found</h3>
          <p className="text-xs text-spotify-muted max-w-md">Spotify returned zero top artists for this account. Stream more music on Spotify to populate your affinity catalog!</p>
        </div>
      </div>
    );
  }

  // Dynamic Metrics Calculated directly from Spotify Web API Response
  const totalIngested = artists.length;

  const averagePopularity = totalIngested > 0
    ? Math.round(artists.reduce((acc, cur) => acc + (cur.popularity || 0), 0) / totalIngested)
    : 0;

  const allGenresSet = new Set<string>();
  artists.forEach((a) => a.genres?.forEach((g) => allGenresSet.add(g)));
  const totalUniqueGenres = allGenresSet.size;

  // Highlighted Creators
  const top1Artist = artists[0] || null;

  const hiddenGemArtist = totalIngested > 0
    ? [...artists].sort((a, b) => (a.popularity || 0) - (b.popularity || 0))[0]
    : null;

  const mostPopularArtist = totalIngested > 0
    ? [...artists].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0]
    : null;

  const kpis = [
    {
      title: 'Total Artists Ingested',
      value: formatNumber(totalIngested),
      change: 'Spotify API',
      sub: 'top medium-term creators',
      icon: Users,
      color: 'text-[#1DB954]'
    },
    {
      title: 'Favorite Artist',
      value: top1Artist ? formatSafeString(top1Artist.name) : 'Not Available',
      change: top1Artist ? `${formatFollowers(top1Artist.followers?.total)} Followers` : '0',
      sub: '#1 ranked artist',
      icon: Heart,
      color: 'text-pink-400'
    },
    {
      title: 'Average Popularity',
      value: `${averagePopularity} / 100`,
      change: 'Mainstream Index',
      sub: 'affinity score',
      icon: Flame,
      color: 'text-amber-400'
    },
    {
      title: 'Genre Diversity Index',
      value: `${totalUniqueGenres} Genres`,
      change: 'Broad Spectrum',
      sub: 'sub-genres represented',
      icon: Globe,
      color: 'text-purple-400'
    },
  ];

  const top5Artists = artists.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Artist Telemetry & Affinity Intelligence</h2>
          <p className="text-xs text-spotify-muted">
            Analyzing {totalIngested} Spotify creators across affinity ranking, sub-genres, and popularity telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] bg-[#181818] px-3.5 py-1.5 rounded-full border border-white/5 shadow-md">
          <Star className="w-4 h-4" />
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
                  <span className="text-[#1DB954] font-bold">{kpi.change}</span>
                  <span className="text-spotify-subtle">{kpi.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Three Special Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Played Artist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-5 rounded-2xl border border-[#1DB954]/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1DB954] font-bold text-xs">
              <Crown className="w-4 h-4" />
              <span>MOST PLAYED ARTIST</span>
            </div>
            <span className="text-[10px] font-mono bg-[#1DB954]/20 text-[#1DB954] px-2 py-0.5 rounded font-bold">
              #1 RANK
            </span>
          </div>

          {top1Artist ? (
            <>
              <div className="flex items-center gap-4 pt-1">
                {top1Artist.images?.[0]?.url ? (
                  <img
                    src={top1Artist.images[0].url}
                    alt={top1Artist.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#1DB954]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1DB954] to-emerald-800 flex items-center justify-center font-bold text-black text-xl border-2 border-[#1DB954]">
                    {top1Artist.name.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="text-lg font-bold font-heading text-white truncate">{top1Artist.name}</h3>
                  <p className="text-xs text-spotify-muted truncate">
                    {top1Artist.genres?.slice(0, 2).join(' / ') || 'Spotify Creator'}
                  </p>
                  <div className="text-[11px] font-mono text-[#1DB954] mt-0.5">
                    {formatFollowers(top1Artist.followers?.total)} followers
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-spotify-subtle border-t border-white/5 pt-2 font-mono">
                <span>Popularity Index: <strong className="text-white">{top1Artist.popularity || 0}/100</strong></span>
                <a
                  href={top1Artist.external_urls?.spotify || 'https://open.spotify.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DB954] hover:underline flex items-center gap-1"
                >
                  <span>Spotify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-xs text-spotify-muted py-4">No top artist data available.</div>
          )}
        </div>

        {/* Hidden Gem Artist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-5 rounded-2xl border border-purple-500/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Gem className="w-4 h-4" />
              <span>HIDDEN GEM ARTIST</span>
            </div>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">
              {hiddenGemArtist ? `${hiddenGemArtist.popularity || 0} POPULARITY` : 'GEM'}
            </span>
          </div>

          {hiddenGemArtist ? (
            <>
              <div className="flex items-center gap-4 pt-1">
                {hiddenGemArtist.images?.[0]?.url ? (
                  <img
                    src={hiddenGemArtist.images[0].url}
                    alt={hiddenGemArtist.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-xl border-2 border-purple-500">
                    {hiddenGemArtist.name.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="text-lg font-bold font-heading text-white truncate">{hiddenGemArtist.name}</h3>
                  <p className="text-xs text-spotify-muted truncate">
                    {hiddenGemArtist.genres?.slice(0, 2).join(' / ') || 'Niche Creator'}
                  </p>
                  <div className="text-[11px] font-mono text-purple-300 mt-0.5">
                    {formatFollowers(hiddenGemArtist.followers?.total)} followers
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-spotify-subtle border-t border-white/5 pt-2 font-mono">
                <span>Underrated sonic discovery</span>
                <a
                  href={hiddenGemArtist.external_urls?.spotify || 'https://open.spotify.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline flex items-center gap-1"
                >
                  <span>Spotify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-xs text-spotify-muted py-4">No hidden gem data available.</div>
          )}
        </div>

        {/* Most Popular Artist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Flame className="w-4 h-4" />
              <span>MOST POPULAR ARTIST</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
              {mostPopularArtist ? `${mostPopularArtist.popularity || 0}/100` : 'GLOBAL'}
            </span>
          </div>

          {mostPopularArtist ? (
            <>
              <div className="flex items-center gap-4 pt-1">
                {mostPopularArtist.images?.[0]?.url ? (
                  <img
                    src={mostPopularArtist.images[0].url}
                    alt={mostPopularArtist.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-500"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white text-xl border-2 border-amber-500">
                    {mostPopularArtist.name.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="text-lg font-bold font-heading text-white truncate">{mostPopularArtist.name}</h3>
                  <p className="text-xs text-spotify-muted truncate">
                    {mostPopularArtist.genres?.slice(0, 2).join(' / ') || 'Global Creator'}
                  </p>
                  <div className="text-[11px] font-mono text-amber-300 mt-0.5">
                    {formatFollowers(mostPopularArtist.followers?.total)} followers
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-spotify-subtle border-t border-white/5 pt-2 font-mono">
                <span>Highest Spotify Popularity Score</span>
                <a
                  href={mostPopularArtist.external_urls?.spotify || 'https://open.spotify.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Spotify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-xs text-spotify-muted py-4">No popular artist data available.</div>
          )}
        </div>
      </div>

      {/* 3. Detailed Top Artists Roster Table */}
      <div className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Top Spotify Artists Roster</h3>
              <p className="text-[11px] text-spotify-muted">Real-time creator telemetry from GET /v1/me/top/artists</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
            GET /v1/me/top/artists
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-spotify-muted border-b border-white/5 text-[10px] uppercase font-mono tracking-wider">
                <th className="pb-3 font-semibold pl-2"># Artist</th>
                <th className="pb-3 font-semibold">Primary Genres</th>
                <th className="pb-3 font-semibold">Followers</th>
                <th className="pb-3 font-semibold">Popularity Index</th>
                <th className="pb-3 font-semibold text-right pr-2">Spotify Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {artists.map((artist, index) => {
                const rankText = `#${index + 1}`;
                const genresText = artist.genres && artist.genres.length > 0
                  ? artist.genres.slice(0, 3).map((g) => g.toLowerCase()).join(', ')
                  : 'Not Available';
                const avatarImg = artist.images?.[0]?.url;
                const followerCountFormatted = formatFollowers(artist.followers?.total);
                const popularityScore = artist.popularity ?? 0;

                return (
                  <tr key={artist.id || index} className="group hover:bg-[#2A2A2A] transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#1DB954] w-6">{rankText}</span>
                        {avatarImg ? (
                          <img
                            src={avatarImg}
                            alt={artist.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1DB954] to-purple-600 flex items-center justify-center font-bold text-black text-xs shrink-0 border border-white/10">
                            {artist.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-white group-hover:text-[#1DB954] transition-colors">
                          {artist.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-spotify-muted capitalize max-w-[200px] truncate">
                      {genresText}
                    </td>
                    <td className="py-3 font-mono font-bold text-[#1DB954]">
                      {followerCountFormatted}
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
                    <td className="py-3 text-right pr-2 font-semibold">
                      <a
                        href={artist.external_urls?.spotify || 'https://open.spotify.com'}
                        target="_blank"
                        rel="noopener noreferrer"
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
      </div>
    </div>
  );
};
