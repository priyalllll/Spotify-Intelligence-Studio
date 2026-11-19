import React, { useState, useEffect } from 'react';
import {
  Activity,
  Award,
  Sparkles,
  Brain,
  Info,
  Loader2,
  CheckCircle2,
  PieChart,
  Zap,
  Clock,
  Music,
  Library,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Flame,
  Compass,
  Repeat,
  Heart,
  Globe,
  Sliders
} from 'lucide-react';
import { calculateSpotifyIntelligenceScores, type AnalyticsEngineResult, type ScoreItem } from '../../utils/analyticsEngine';
import { RadialGauge } from './RadialGauge';
import type {
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyAudioFeatures,
  SpotifyTopArtistsResponse,
  SpotifyTopTracksResponse,
  SpotifyPlaylistsResponse,
  SpotifyAudioAnalysisResponse
} from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { spotifyAudioService } from '../../services/spotifyAudioService';

interface IntelligenceScoreViewProps {
  accessToken?: string;
}

export const IntelligenceScoreView: React.FC<IntelligenceScoreViewProps> = ({ accessToken }) => {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<SpotifyAudioFeatures[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScoreTelemetry = (token?: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFromBackend<SpotifyTopArtistsResponse>('/api/top-artists', token).catch(() => null),
      fetchFromBackend<SpotifyTopTracksResponse>('/api/top-tracks', token).catch(() => null),
      fetchFromBackend<SpotifyPlaylistsResponse>('/api/playlists', token).catch(() => null),
      spotifyAudioService.getAudioAnalysis(token || '').catch(() => null),
    ])
      .then(([artistsData, tracksData, playlistsData, analysisData]) => {
        if (artistsData?.items) setTopArtists(artistsData.items);
        if (tracksData?.items) setTopTracks(tracksData.items);
        if (playlistsData?.items) setPlaylists(playlistsData.items);
        if (analysisData?.audio_features) setAudioFeatures(analysisData.audio_features);
      })
      .catch((err: Error) => {
        console.error('Error fetching intelligence score telemetry:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScoreTelemetry(accessToken);
  }, [accessToken]);

  // Calculate 8 Scores via Analytics Engine
  const analytics: AnalyticsEngineResult = calculateSpotifyIntelligenceScores(
    topArtists,
    topTracks,
    playlists,
    audioFeatures
  );

  // Loading State
  if (loading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">Music Intelligence Score System</h2>
            <p className="text-xs text-spotify-muted">Calculating 8 acoustic score dimensions from Spotify API...</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-[#181818]/60 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
          <Loader2 className="w-10 h-10 text-[#1DB954] animate-spin" />
          <span className="text-xs font-mono text-spotify-muted font-bold">Executing Analytics Engine Algorithms...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error && topArtists.length === 0 && topTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[#242424] rounded-3xl border border-red-500/30 p-8 text-center shadow-2xl max-w-2xl mx-auto">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Unable to Load Scores</h3>
          <p className="text-xs text-red-300 font-mono max-w-md">{error}</p>
        </div>
        <button
          onClick={() => fetchScoreTelemetry(accessToken)}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Score Calculation</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <span>Spotify Intelligence Score System</span>
            <Activity className="w-5 h-5 text-[#1DB954] animate-pulse" />
          </h2>
          <p className="text-xs text-spotify-muted">
            8 music intelligence scores calculated deterministically from your Spotify Web API telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] bg-[#1DB954]/10 px-3.5 py-1.5 rounded-full border border-[#1DB954]/30 shadow-md font-bold">
          <Brain className="w-4 h-4 text-[#1DB954]" />
          <span>8 SCORING DIMENSIONS ACTIVE</span>
        </div>
      </div>

      {/* Hero Master Overall Music Intelligence Score Banner */}
      <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#1DB954]/20 p-6 sm:p-8 rounded-3xl border border-[#1DB954]/40 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div className="relative flex items-center justify-center shrink-0">
              <RadialGauge
                score={analytics.overallScore}
                size={150}
                strokeWidth={12}
                color="#1DB954"
                glowColor="rgba(29, 185, 84, 0.5)"
                title="Intelligence Score"
                subtitle="Master Composite"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1DB954] font-bold">
                  MASTER COMPOSITE INDEX
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-white border border-white/20">
                  VERIFIED 0-100
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                Overall Music Intelligence Score: {analytics.overallScore}/100
              </h3>
              <p className="text-xs text-spotify-muted max-w-xl leading-relaxed font-sans">
                {analytics.summaryText}
              </p>
            </div>
          </div>

          <div className="bg-[#121212]/90 p-4 rounded-2xl border border-white/10 text-right font-mono text-xs space-y-1.5 shrink-0 hidden md:block shadow-xl">
            <div className="text-[10px] text-spotify-subtle uppercase tracking-wider">Scoring Engine</div>
            <div className="text-sm font-bold text-[#1DB954]">100% Deterministic</div>
            <div className="text-[10px] text-spotify-muted">No Random Values</div>
          </div>
        </div>
      </div>

      {/* Animated Circular Progress Gauges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Animated Circular Score Cards</span>
          </h3>
          <span className="text-[10px] font-mono text-spotify-subtle">{analytics.scores.length} Gauges Rendered</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.scores.map((item) => (
            <RadialGauge
              key={item.id}
              score={item.score}
              size={130}
              strokeWidth={10}
              color={item.color}
              glowColor={item.glowColor}
              title={item.name}
              subtitle={item.category}
            />
          ))}
        </div>
      </div>

      {/* Detailed Cards Explaining Why Each Score Was Assigned */}
      <div className="bg-[#242424] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Score Assignment Explanations</h3>
              <p className="text-xs text-spotify-muted">Detailed justification explaining why each score was assigned from your Spotify data</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full font-bold">
            WHY ASSIGNED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.scores.map((scoreItem) => (
            <div
              key={scoreItem.id}
              className="bg-[#181818] p-5 rounded-2xl border border-white/5 space-y-3 shadow-lg flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: scoreItem.color }}></span>
                    <h4 className="text-sm font-bold font-heading text-white">{scoreItem.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold text-black" style={{ backgroundColor: scoreItem.color }}>
                      {scoreItem.badge}
                    </span>
                    <span className="text-sm font-mono font-extrabold text-white">{scoreItem.score}/100</span>
                  </div>
                </div>

                <p className="text-xs text-spotify-muted font-sans leading-relaxed">
                  {scoreItem.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                {/* Why Score Was Assigned Box */}
                <div className="p-3 bg-[#121212] rounded-xl border border-[#1DB954]/30 text-xs font-sans text-gray-200 leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#1DB954] font-semibold block text-[11px] font-mono uppercase">Why Assigned:</strong>
                    {scoreItem.whyAssigned}
                  </span>
                </div>

                {/* Mathematical Formula */}
                <div className="p-2.5 bg-[#121212] rounded-xl border border-white/5 font-mono text-[10px] text-spotify-subtle">
                  <span className="text-spotify-muted uppercase block text-[9px] mb-0.5">Algorithmic Formula:</span>
                  <code className="text-purple-300">{scoreItem.formulaDoc}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
