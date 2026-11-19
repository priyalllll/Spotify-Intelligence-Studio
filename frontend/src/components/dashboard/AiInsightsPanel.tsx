import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, Zap, ArrowUpRight, RefreshCw } from 'lucide-react';
import type { SpotifyArtist, SpotifyTrack, SpotifyTopArtistsResponse, SpotifyTopTracksResponse, SpotifyAudioAnalysisResponse } from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { formatPercent, formatSafeString } from '../../utils/formatters';

interface AiInsightsPanelProps {
  accessToken?: string;
}

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({ accessToken }) => {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetchFromBackend<SpotifyTopArtistsResponse>('/api/top-artists', accessToken).catch(() => null),
      fetchFromBackend<SpotifyTopTracksResponse>('/api/top-tracks', accessToken).catch(() => null),
    ])
      .then(([artistsData, tracksData]) => {
        if (artistsData?.items) setTopArtists(artistsData.items);
        if (tracksData?.items) setTopTracks(tracksData.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [accessToken]);

  // Dynamic Real-Time Calculations
  const allGenres = topArtists.flatMap((a) => a.genres || []);
  const genreCounts: Record<string, number> = {};
  allGenres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const favoriteGenre = sortedGenres[0]?.[0]
    ? sortedGenres[0][0].charAt(0).toUpperCase() + sortedGenres[0][0].slice(1)
    : 'Music';

  const top1Artist = topArtists[0]?.name || 'Top Creator';
  const top1Track = topTracks[0]?.name || 'Top Song';

  const avgPopularity = topTracks.length > 0
    ? Math.round(topTracks.reduce((acc, t) => acc + (t.popularity || 0), 0) / topTracks.length)
    : 50;

  const explicitCount = topTracks.filter((t) => t.explicit).length;

  return (
    <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-6 rounded-2xl border border-purple-500/30 shadow-2xl space-y-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-heading text-white">Gemini AI Listening Intelligence</h3>
              <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-spotify-muted">Real-time acoustic fingerprint analysis</p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="px-3 py-1.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="p-4 rounded-xl bg-[#181818]/90 border border-white/5 text-xs text-gray-200 leading-relaxed font-sans shadow-inner">
          "Your current listening fingerprint reflects a strong preference for <strong className="text-[#1DB954]">{favoriteGenre}</strong>. You frequently stream <strong className="text-white">{top1Artist}</strong> with your #1 track being <strong className="text-purple-300">"{top1Track}"</strong>. Your catalog has an average popularity index score of <strong className="text-amber-400">{avgPopularity}/100</strong> across {topTracks.length} top streamed songs."
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        <div className="bg-[#181818] p-3.5 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider font-semibold block">Favorite Genre</span>
          <span className="text-sm font-bold text-white block truncate">{favoriteGenre}</span>
          <span className="text-[10px] text-[#1DB954] font-mono">Calculated from artists</span>
        </div>

        <div className="bg-[#181818] p-3.5 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider font-semibold block">Popularity Index</span>
          <span className="text-sm font-bold text-purple-400 block font-mono">{avgPopularity} / 100</span>
          <span className="text-[10px] text-spotify-subtle font-mono">Mainstream affinity score</span>
        </div>

        <div className="bg-[#181818] p-3.5 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider font-semibold block">Explicit Track Ratio</span>
          <span className="text-sm font-bold text-blue-400 block font-mono">{explicitCount} Explicit Tracks</span>
          <span className="text-[10px] text-spotify-subtle font-mono">{topTracks.length > 0 ? Math.round((explicitCount / topTracks.length) * 100) : 0}% of catalog</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#181818] to-[#242424] border border-[#1DB954]/30 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-2.5">
          <Lightbulb className="w-4 h-4 text-[#1DB954] shrink-0" />
          <span className="text-gray-200">
            <strong>AI Recommendation:</strong> Based on your affinity for {favoriteGenre}, explore new releases from top creators.
          </span>
        </div>

        <button
          onClick={loadData}
          className="px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2A2A2A] text-[#1DB954] font-semibold text-xs border border-[#1DB954]/40 hover:border-[#1DB954] transition-all shrink-0 flex items-center gap-1"
        >
          <span>Sync Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
