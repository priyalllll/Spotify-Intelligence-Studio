import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Brain,
  Clock,
  Calendar,
  Zap,
  Award,
  PieChart,
  Compass,
  CheckCircle2,
  Flame,
  Disc,
  Activity,
  Music,
  BarChart2,
  TrendingUp,
  Radio,
  Loader2,
  AlertCircle,
  Volume2,
  RefreshCw,
  Sliders,
  Layers,
  Heart
} from 'lucide-react';
import { spotifyAudioService } from '../../services/spotifyAudioService';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { getCachedAiInsight, setCachedAiInsight } from '../../services/aiCacheService';
import { AiMusicAssistant } from './AiMusicAssistant';
import type {
  SpotifyAudioAnalysisResponse,
  SpotifyUserProfile,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist
} from '../../types/spotify';

interface AiInsightsViewProps {
  accessToken?: string;
}

interface AiSectionResult {
  title: string;
  key: string;
  icon: any;
  color: string;
  badge: string;
  prompt: string;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({ accessToken }) => {
  const [profile, setProfile] = useState<SpotifyUserProfile | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [analysisData, setAnalysisData] = useState<SpotifyAudioAnalysisResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active AI Insight Section State & Generated Content Cache
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>('personality');
  const [generatedInsights, setGeneratedInsights] = useState<Record<string, string>>({});
  const [generatingSectionKey, setGeneratingSectionKey] = useState<string | null>(null);

  const aiSections: AiSectionResult[] = [
    {
      key: 'personality',
      title: 'Listening Personality',
      icon: Brain,
      color: 'text-purple-400',
      badge: 'GEMINI AI ARCHETYPE',
      prompt: 'Analyze my music listening personality and core archetype based on my top creators, acoustic energy, and valence.',
    },
    {
      key: 'mood',
      title: 'Mood Analysis',
      icon: Sparkles,
      color: 'text-amber-400',
      badge: 'VALENCE SPECTRUM',
      prompt: 'Provide a detailed emotional mood analysis of my top streamed tracks and acoustic valence breakdown.',
    },
    {
      key: 'productivity',
      title: 'Productivity Score',
      icon: Zap,
      color: 'text-[#1DB954]',
      badge: 'COGNITIVE FLOW',
      prompt: 'Calculate my Music Productivity Score (0-100) and explain how my listening matches focus and work flow.',
    },
    {
      key: 'focus',
      title: 'Focus Music Analysis',
      icon: Clock,
      color: 'text-blue-400',
      badge: 'TEMPO & SPEECH',
      prompt: 'Analyze my focus music preferences, BPM tempo distribution, and low-speechiness instrumental compatibility.',
    },
    {
      key: 'evolution',
      title: 'Genre Evolution',
      icon: TrendingUp,
      color: 'text-pink-400',
      badge: 'SPECTRUM SHIFT',
      prompt: 'Explain how my genre preferences have evolved across my active Spotify listening history.',
    },
    {
      key: 'patterns',
      title: 'Hidden Listening Patterns',
      icon: Compass,
      color: 'text-cyan-400',
      badge: 'PATTERNS DISCOVERED',
      prompt: 'Uncover hidden listening patterns, peak session times, and unexpected sonic connections in my library.',
    },
    {
      key: 'recommendations',
      title: 'Weekly Recommendations',
      icon: Award,
      color: 'text-emerald-400',
      badge: 'CURATED FOR YOU',
      prompt: 'Provide 5 tailored weekly artist and album recommendations based on my top streamed creators.',
    },
    {
      key: 'insights',
      title: 'Personalized Insights',
      icon: Activity,
      color: 'text-indigo-400',
      badge: 'EXECUTIVE SUMMARY',
      prompt: 'Synthesize personalized executive insights summarizing my overall music profile and taste recommendations.',
    },
  ];

  // Fetch Telemetry & Initial AI Insights
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFromBackend<SpotifyUserProfile>('/auth/me', accessToken).catch(() => null),
      fetchFromBackend<{ items?: SpotifyArtist[] }>('/api/top-artists', accessToken).catch(() => null),
      fetchFromBackend<{ items?: SpotifyTrack[] }>('/api/top-tracks', accessToken).catch(() => null),
      fetchFromBackend<{ items?: SpotifyPlaylist[] }>('/api/playlists', accessToken).catch(() => null),
      spotifyAudioService.getAudioAnalysis(accessToken || '').catch(() => null),
    ])
      .then(([profData, artistsData, tracksData, playlistsData, audioData]) => {
        if (profData) setProfile(profData);
        if (artistsData?.items) setTopArtists(artistsData.items);
        if (tracksData?.items) setTopTracks(tracksData.items);
        if (playlistsData?.items) setPlaylists(playlistsData.items);
        if (audioData) setAnalysisData(audioData);
      })
      .catch((err: Error) => {
        console.error('Error loading AI insights telemetry:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  // Request Section Insight via Gemini API with Caching
  const generateSectionInsight = async (section: AiSectionResult) => {
    const cacheKey = `${section.key}_${profile?.id || 'user'}_${topArtists[0]?.id || 'artists'}`;
    const cached = getCachedAiInsight(cacheKey);

    if (cached) {
      setGeneratedInsights((prev) => ({ ...prev, [section.key]: cached }));
      return;
    }

    setGeneratingSectionKey(section.key);

    try {
      const res = await fetch('http://localhost:5000/ai/music-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          topArtists,
          topTracks,
          playlists,
          audioFeatures: analysisData?.audio_features || [],
          prompt: section.prompt,
        }),
      });

      const data = await res.json();
      const answerText = data.answer || 'Unable to generate Gemini AI analysis.';

      setCachedAiInsight(cacheKey, answerText);
      setGeneratedInsights((prev) => ({ ...prev, [section.key]: answerText }));
    } catch (err) {
      console.error('Error generating AI section insight:', err);
    } finally {
      setGeneratingSectionKey(null);
    }
  };

  useEffect(() => {
    if (!loading && topArtists.length > 0) {
      const currentSec = aiSections.find((s) => s.key === selectedSectionKey);
      if (currentSec && !generatedInsights[currentSec.key]) {
        generateSectionInsight(currentSec);
      }
    }
  }, [selectedSectionKey, loading, topArtists]);

  // Loading State UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-[#181818]/60 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl max-w-6xl mx-auto">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Initializing Gemini AI Music Analyst</h3>
          <p className="text-xs text-spotify-muted">Analyzing acoustic features, valence, tempo, and energy distribution from Spotify Web API...</p>
        </div>
      </div>
    );
  }

  const featuresList = analysisData?.audio_features || [];
  const tracksList = analysisData?.tracks || topTracks || [];
  const totalCount = featuresList.length || 1;

  // Dynamic Audio Metrics Calculations
  const avgDanceability = featuresList.reduce((acc, f) => acc + (f.danceability || 0), 0) / totalCount;
  const avgEnergy = featuresList.reduce((acc, f) => acc + (f.energy || 0), 0) / totalCount;
  const avgValence = featuresList.reduce((acc, f) => acc + (f.valence || 0), 0) / totalCount;
  const avgTempo = featuresList.reduce((acc, f) => acc + (f.tempo || 0), 0) / totalCount;

  const danceabilityPct = Math.round(avgDanceability * 100);
  const energyPct = Math.round(avgEnergy * 100);
  const valencePct = Math.round(avgValence * 100);
  const tempoBpm = Math.round(avgTempo);

  const activeSectionObj = aiSections.find((s) => s.key === selectedSectionKey) || aiSections[0];
  const activeInsightText = generatedInsights[activeSectionObj.key];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Interactive Gemini AI Music Assistant */}
      <AiMusicAssistant accessToken={accessToken} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Gemini AI Music Intelligence Suite</h2>
          <p className="text-xs text-spotify-muted">
            8 deep AI analysis dimensions generated directly from your live Spotify account telemetry with intelligent response caching
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-500/15 px-3.5 py-1.5 rounded-full border border-purple-500/30 shadow-md">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Gemini 2.0 AI Integration Active</span>
        </div>
      </div>

      {/* 8 AI Analysis Section Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {aiSections.map((sec) => {
          const IconComp = sec.icon;
          const isActive = selectedSectionKey === sec.key;
          return (
            <button
              key={sec.key}
              onClick={() => setSelectedSectionKey(sec.key)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-[#1DB954] text-black border-[#1DB954] font-bold shadow-lg scale-105'
                  : 'bg-[#242424] hover:bg-[#2A2A2A] text-spotify-muted hover:text-white border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <IconComp className={`w-4 h-4 ${isActive ? 'text-black' : sec.color}`} />
                {generatedInsights[sec.key] && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black' : 'bg-[#1DB954]'}`}></span>
                )}
              </div>
              <span className="text-xs font-semibold tracking-tight block truncate">{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active AI Analysis Section Card */}
      <div className="bg-[#242424] p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl bg-[#181818] border border-white/5 ${activeSectionObj.color}`}>
              <activeSectionObj.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {activeSectionObj.badge}
                </span>
                <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded">
                  RESPONSE CACHED
                </span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white mt-1">{activeSectionObj.title}</h3>
            </div>
          </div>

          <button
            onClick={() => generateSectionInsight(activeSectionObj)}
            disabled={generatingSectionKey === activeSectionObj.key}
            className="px-3.5 py-1.5 rounded-full bg-[#181818] hover:bg-[#1DB954] text-spotify-muted hover:text-black border border-white/10 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generatingSectionKey === activeSectionObj.key ? 'animate-spin text-[#1DB954]' : ''}`} />
            <span>Regenerate AI</span>
          </button>
        </div>

        {/* Generated AI Content Body */}
        {generatingSectionKey === activeSectionObj.key ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#181818] rounded-2xl border border-white/5">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="text-xs font-mono text-purple-300">Querying Gemini 2.0 API with your Spotify telemetry...</span>
          </div>
        ) : activeInsightText ? (
          <div className="bg-[#181818] p-6 rounded-2xl border border-white/5 space-y-3 text-xs sm:text-sm font-sans leading-relaxed text-gray-200">
            {activeInsightText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-wrap">{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-[#181818] rounded-2xl border border-white/5 text-center">
            <Brain className="w-8 h-8 text-purple-400" />
            <p className="text-xs text-spotify-muted font-mono max-w-sm">Click "Regenerate AI" or switch tabs to load Gemini AI analysis for {activeSectionObj.title}.</p>
          </div>
        )}
      </div>
    </div>
  );
};
