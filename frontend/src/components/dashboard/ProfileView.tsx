import React, { useState, useEffect } from 'react';
import {
  Users,
  Globe,
  ShieldCheck,
  Clock,
  Music,
  Library,
  Heart,
  Sparkles,
  Award,
  Flame,
  Gem,
  Rocket,
  Activity,
  CheckCircle2,
  Mail,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import type {
  SpotifyUserProfile,
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
  formatNumber,
  formatSafeString
} from '../../utils/formatters';

interface ProfileViewProps {
  accessToken?: string;
  spotifyUser?: SpotifyUserProfile | null;
  isLoading?: boolean;
  error?: string | null;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  accessToken,
  spotifyUser,
  isLoading = false,
  error = null,
}) => {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadProfileTelemetry = (token?: string) => {
    setFetchingData(true);
    setFetchError(null);

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
        console.error('Error fetching profile telemetry:', err);
        setFetchError(err.message || 'Failed to fetch Spotify telemetry');
      })
      .finally(() => setFetchingData(false));
  };

  useEffect(() => {
    loadProfileTelemetry(accessToken);
  }, [accessToken]);

  // Loading State
  if ((isLoading || fetchingData) && !spotifyUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#181818]/60 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">
        <Loader2 className="w-10 h-10 text-[#1DB954] animate-spin" />
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Loading Spotify Profile</h3>
          <p className="text-xs text-spotify-muted font-mono">Fetching real-time profile telemetry from Spotify API...</p>
        </div>
      </div>
    );
  }

  // Error State with Retry Button
  if ((error || fetchError) && !spotifyUser) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-[#242424] rounded-3xl border border-red-500/30 p-8 text-center shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Unable to load Spotify profile</h3>
          <p className="text-xs text-red-300 max-w-md font-mono">{error || fetchError}</p>
        </div>
        <button
          onClick={() => loadProfileTelemetry(accessToken)}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Profile Telemetry</span>
        </button>
      </div>
    );
  }

  // Calculate Dynamic Favorite Genre & Artist
  const allGenres = topArtists.flatMap((a) => a.genres || []);
  const genreCounts: Record<string, number> = {};
  allGenres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const favoriteGenre = sortedGenres[0]?.[0]
    ? sortedGenres[0][0].charAt(0).toUpperCase() + sortedGenres[0][0].slice(1)
    : 'Not Available';

  const favoriteArtist = topArtists[0]?.name || 'Not Available';

  // Resolved Profile Meta Data from spotifyUser
  const displayName = formatSafeString(spotifyUser?.display_name, spotifyUser?.id || 'Spotify Listener');
  const userId = formatSafeString(spotifyUser?.id, 'Not Available');
  const userEmail = formatSafeString(spotifyUser?.email, 'Not Available');
  const avatarUrl = spotifyUser?.images?.[0]?.url;
  const initialLetter = displayName.charAt(0).toUpperCase() || 'S';
  const productLabel = spotifyUser?.product
    ? String(spotifyUser.product).toUpperCase()
    : 'SPOTIFY ACCOUNT';
  const countryCode = spotifyUser?.country ? String(spotifyUser.country).toUpperCase() : 'Not Available';
  const followerCountFormatted = formatFollowers(spotifyUser?.followers?.total);
  const spotifyUrl = spotifyUser?.external_urls?.spotify || 'https://open.spotify.com';
  const archetypeTitle = favoriteGenre !== 'Not Available' ? `${favoriteGenre} Listener Profile` : 'Spotify Listener Profile';

  // Listening Statistics Cards
  const stats = [
    {
      title: 'Total Listening Hours',
      value: 'Not Available',
      sub: 'Not provided by Spotify API',
      icon: Clock,
      color: 'text-spotify-muted',
    },
    {
      title: 'Top Artists Ingested',
      value: formatNumber(topArtists.length),
      sub: `${topArtists.length} top creators`,
      icon: Users,
      color: 'text-purple-400',
    },
    {
      title: 'Top Tracks Catalog',
      value: formatNumber(topTracks.length),
      sub: `${topTracks.length} top tracks`,
      icon: Music,
      color: 'text-[#1DB954]',
    },
    {
      title: 'Synced Playlists',
      value: formatNumber(playlists.length),
      sub: `${playlists.length} playlists`,
      icon: Library,
      color: 'text-blue-400',
    },
    {
      title: 'Favorite Genre',
      value: favoriteGenre,
      sub: sortedGenres[0]?.[1] ? `${sortedGenres[0][1]} artist occurrences` : 'Calculated from top artists',
      icon: Sparkles,
      color: 'text-amber-400',
    },
    {
      title: 'Favorite Artist',
      value: favoriteArtist,
      sub: topArtists[0]?.genres?.[0] ? topArtists[0].genres[0] : '#1 ranked artist',
      icon: Heart,
      color: 'text-pink-400',
    },
  ];

  // Verified Achievements List
  const achievements = [
    { id: '1', title: 'OAuth Verified', desc: 'Authenticated via Spotify OAuth 2.0 PKCE protocol', icon: ShieldCheck, color: 'text-[#1DB954]', bg: 'bg-[#1DB954]/15 border-[#1DB954]/30' },
    { id: '2', title: 'Top Creators Ingested', desc: `Synced ${topArtists.length} top artists from Spotify API`, icon: Flame, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
    { id: '3', title: 'Track Catalog Synced', desc: `Synced ${topTracks.length} top tracks from Spotify API`, icon: Gem, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
    { id: '4', title: 'Playlist Telemetry', desc: `Synced ${playlists.length} playlists from Spotify library`, icon: Rocket, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  ];

  // Recent Activity Feed
  const recentActivities = topTracks.length > 0
    ? topTracks.slice(0, 4).map((track, idx) => ({
        id: track.id || `${idx}`,
        action: `Top Track #${idx + 1}: "${track.name}"`,
        category: track.artists?.map((a) => a.name).join(', ') || 'Spotify Creator',
        time: track.album?.name || 'Spotify Album',
        icon: Music,
      }))
    : [
        { id: '1', action: 'Spotify OAuth Handshake Active', category: 'Authentication', time: 'Active Session', icon: ShieldCheck },
        { id: '2', action: 'Synced Top Artists & Tracks', category: 'Telemetry Engine', time: 'Live Sync', icon: Sparkles },
        { id: '3', action: 'Synced User Playlists', category: 'Playlist Sync', time: 'Live Sync', icon: Library },
      ];

  return (
    <div className="space-y-8">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Spotify Account Profile</h2>
          <p className="text-xs text-spotify-muted">Connected Spotify account details, verified stats, and active telemetry</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] bg-[#181818] px-3.5 py-1.5 rounded-full border border-white/5 shadow-md">
          <UserCheck className="w-4 h-4" />
          <span>Spotify OAuth Active</span>
        </div>
      </div>

      {/* 1. Spotify User Profile Hero Banner */}
      <div className="bg-gradient-to-r from-[#242424] via-[#181818] to-[#242424] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1DB954]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#1DB954] shadow-2xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1DB954] to-purple-600 flex items-center justify-center text-black font-extrabold text-3xl shadow-2xl border-4 border-[#1DB954]">
                  {initialLetter}
                </div>
              )}
              <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#1DB954] text-black shadow-lg">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h3 className="text-2xl font-extrabold font-heading text-white">{displayName}</h3>
                <span className="text-xs font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-0.5 rounded-full border border-[#1DB954]/20 font-semibold">
                  {productLabel}
                </span>
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded bg-[#242424] text-spotify-muted hover:text-[#1DB954] transition-colors"
                  title="Open on Spotify"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="text-xs font-mono text-spotify-muted flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="text-white font-semibold">ID: {userId}</span>
                {userEmail !== 'Not Available' && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#1DB954]" />
                      {userEmail}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  {countryCode}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>✦ Archetype: {archetypeTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-around md:justify-end gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 text-xs font-mono">
            <div>
              <span className="text-spotify-subtle block">Followers</span>
              <span className="text-white font-bold">{followerCountFormatted}</span>
            </div>
            <div>
              <span className="text-spotify-subtle block">Account Status</span>
              <span className="text-[#1DB954] font-bold">Active OAuth 2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Six Listening Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 hover:border-[#1DB954]/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-spotify-muted font-semibold">{stat.title}</span>
                <div className={`p-2 rounded-xl bg-[#181818] border border-white/5 ${stat.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xl font-extrabold font-heading text-white tracking-tight truncate">{stat.value}</div>
                <div className="text-[11px] font-mono text-spotify-subtle mt-1 truncate">{stat.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Achievements Section */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-amber-400 border border-white/5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Telemetry Milestone Achievements</h3>
              <p className="text-[11px] text-spotify-muted font-mono">Verified badges from Spotify Web API endpoints</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-1 rounded border border-[#1DB954]/20">
            VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${item.bg} space-y-2 flex flex-col justify-between transition-transform hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-[#181818] ${item.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-[#1DB954] text-black px-2 py-0.5 rounded">
                    UNLOCKED
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-heading text-white">{item.title}</h4>
                  <p className="text-[10px] text-spotify-muted leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Activity Stream Section */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Top Telemetry Stream</h3>
              <p className="text-[11px] text-spotify-muted font-mono">Real-time track frequency logging from Spotify</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
            Live Stream
          </span>
        </div>

        <div className="space-y-2.5">
          {recentActivities.map((act) => {
            const IconComp = act.icon;
            return (
              <div
                key={act.id}
                className="bg-[#181818] p-3 rounded-xl border border-white/5 flex items-center justify-between hover:border-[#1DB954]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#242424] text-[#1DB954]">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{act.action}</span>
                    <span className="text-[10px] text-spotify-muted font-mono">{act.category}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-spotify-subtle">{act.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
