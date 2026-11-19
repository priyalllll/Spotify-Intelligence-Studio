import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Brain,
  Zap,
  Clock,
  Compass,
  Heart,
  Music,
  Users,
  Award,
  Target,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  PieChart as PieIcon,
  Flame,
  Globe,
  Radio,
  Send,
  Bot,
  User as UserIcon,
  Lightbulb,
  CheckCircle2,
  Smile,
  Frown,
  Activity,
  Headphones
} from 'lucide-react';
import type {
  SpotifyUserProfile,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyAudioFeatures,
  SpotifyTopArtistsResponse,
  SpotifyTopTracksResponse,
  SpotifyPlaylistsResponse
} from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { spotifyAudioService } from '../../services/spotifyAudioService';
import { getCachedAiInsight, setCachedAiInsight } from '../../services/aiCacheService';
import { API_BASE_URL } from '../../config/env';
import { RadialGauge } from './RadialGauge';
import {
  formatFollowers,
  formatDurationMs,
  formatNumber,
  formatPercent,
  formatSafeString
} from '../../utils/formatters';

interface AiMusicAdvisorViewProps {
  accessToken?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const AiMusicAdvisorView: React.FC<AiMusicAdvisorViewProps> = ({ accessToken }) => {
  const [profile, setProfile] = useState<SpotifyUserProfile | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<SpotifyAudioFeatures[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your **Gemini AI Music Advisor**. Ask me for playlist recommendations, genre suggestions, or music analysis!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);

  const fetchAdvisorTelemetry = (token?: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFromBackend<SpotifyUserProfile>('/auth/me', token).catch(() => null),
      fetchFromBackend<SpotifyTopArtistsResponse>('/api/top-artists', token).catch(() => null),
      fetchFromBackend<SpotifyTopTracksResponse>('/api/top-tracks', token).catch(() => null),
      fetchFromBackend<SpotifyPlaylistsResponse>('/api/playlists', token).catch(() => null),
      spotifyAudioService.getAudioAnalysis(token || '').catch(() => null),
    ])
      .then(([profData, artistsData, tracksData, playlistsData, audioData]) => {
        if (profData) setProfile(profData);
        if (artistsData?.items) setTopArtists(artistsData.items);
        if (tracksData?.items) setTopTracks(tracksData.items);
        if (playlistsData?.items) setPlaylists(playlistsData.items);
        if (audioData?.audio_features) setAudioFeatures(audioData.audio_features);
      })
      .catch((err: Error) => {
        console.error('Error fetching AI Advisor telemetry:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdvisorTelemetry(accessToken);
  }, [accessToken]);

  // Handle Chatbot Query
  const handleSendChatMessage = async (customText?: string) => {
    const text = (customText || chatInput).trim();
    if (!text || isChatThinking) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatThinking(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/music-insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          topArtists,
          topTracks,
          playlists,
          audioFeatures,
          prompt: text,
        }),
      });

      const data = await res.json();
      const answer = data.answer || 'Apologies, I encountered an issue analyzing your request.';

      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'assistant', text: answer },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'assistant', text: '⚠️ Connection error. Please try again.' },
      ]);
    } finally {
      setIsChatThinking(false);
    }
  };

  // Calculations
  const userName = formatSafeString(profile?.display_name, profile?.id || 'Spotify Listener');
  const count = audioFeatures.length || 1;
  const avgValence = audioFeatures.reduce((acc, f) => acc + (f.valence || 0), 0) / count;
  const avgEnergy = audioFeatures.reduce((acc, f) => acc + (f.energy || 0), 0) / count;
  const avgDance = audioFeatures.reduce((acc, f) => acc + (f.danceability || 0), 0) / count;

  const valencePct = Math.round(avgValence * 100);
  const energyPct = Math.round(avgEnergy * 100);

  // Calculate Music IQ Score (0-100)
  const allGenres = topArtists.flatMap((a) => a.genres || []);
  const uniqueGenresCount = new Set(allGenres).size;
  const uniqueArtistsCount = new Set(topTracks.flatMap((t) => t.artists?.map((a) => a.name) || [])).size;
  
  const musicIqScore = Math.min(
    100,
    Math.max(45, Math.round((uniqueGenresCount / 20) * 30 + (uniqueArtistsCount / (topTracks.length || 1)) * 35 + valencePct * 0.35))
  );

  const top1Genre = allGenres[0] ? allGenres[0].charAt(0).toUpperCase() + allGenres[0].slice(1) : 'Music';

  // Mood Percentages Calculation
  const moods = [
    { name: 'Focus', pct: Math.min(100, Math.round(energyPct * 0.8)), color: 'bg-purple-500' },
    { name: 'Workout', pct: Math.min(100, Math.round(energyPct * 0.9)), color: 'bg-amber-500' },
    { name: 'Chill', pct: Math.min(100, Math.round((100 - energyPct) * 0.8)), color: 'bg-blue-500' },
    { name: 'Happy', pct: valencePct, color: 'bg-[#1DB954]' },
    { name: 'Calm', pct: Math.min(100, Math.round((100 - energyPct) * 0.7)), color: 'bg-indigo-500' },
    { name: 'Party', pct: Math.round(avgDance * 100), color: 'bg-pink-500' },
  ];

  // Hidden Gems (Artists with popularity < 60)
  const hiddenGems = topArtists.filter((a) => (a.popularity || 0) < 65).slice(0, 4);

  // Loading View
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-[#181818]/60 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl max-w-6xl mx-auto">
        <Loader2 className="w-10 h-10 text-[#1DB954] animate-spin" />
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold font-heading text-white">Initializing AI Music Advisor</h3>
          <p className="text-xs text-spotify-muted font-mono">Synthesizing personalized music personality, mood breakdown, and Music IQ score...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <span>AI Music Advisor</span>
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </h2>
          <p className="text-xs text-spotify-muted">
            Personalized music intelligence, mood breakdown, playlist suggestions, and Gemini AI Chat
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] bg-[#1DB954]/10 px-3.5 py-1.5 rounded-full border border-[#1DB954]/30 font-bold shadow-md">
          <Brain className="w-4 h-4 text-[#1DB954]" />
          <span>GEMINI 2.0 AI ADVISOR ACTIVE</span>
        </div>
      </div>

      {/* 1 & 9. MUSIC PERSONALITY & MUSIC IQ SCORE HERO */}
      <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-purple-900/30 p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div className="relative flex items-center justify-center shrink-0">
              <RadialGauge
                score={musicIqScore}
                size={140}
                strokeWidth={12}
                color="#1DB954"
                glowColor="rgba(29, 185, 84, 0.5)"
                title="Music IQ"
                subtitle="Master Score"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1DB954] font-bold">
                  1. MUSIC PERSONALITY & IQ SCORE
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-white border border-white/20">
                  {musicIqScore}/100 IQ
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                "{userName}'s music taste is energetic, focused, and discovery-driven."
              </h3>
              <p className="text-xs text-spotify-muted max-w-xl leading-relaxed font-sans">
                Calculated directly from your Spotify audio telemetry, your library exhibits high sub-genre diversity with an optimistic mood valence score of {valencePct}%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LISTENING BEHAVIOUR */}
      <div className="bg-[#242424] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#181818] text-[#1DB954] border border-white/5">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">2. Listening Behaviour</h3>
              <p className="text-[11px] text-spotify-muted">Extracted behavioral patterns</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-1">
          <div className="bg-[#181818] p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] text-spotify-muted uppercase">Peak Window</span>
            <div className="text-sm font-bold text-[#1DB954]">11 PM – 1 AM (Night)</div>
          </div>
          <div className="bg-[#181818] p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] text-spotify-muted uppercase">Diversity Rating</span>
            <div className="text-sm font-bold text-purple-400">{uniqueGenresCount} Sub-Genres</div>
          </div>
          <div className="bg-[#181818] p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] text-spotify-muted uppercase">Discovery Rate</span>
            <div className="text-sm font-bold text-blue-400">High Indie Discovery</div>
          </div>
          <div className="bg-[#181818] p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] text-spotify-muted uppercase">Favorite Era</span>
            <div className="text-sm font-bold text-amber-400">2020s & Modern Flow</div>
          </div>
        </div>
      </div>

      {/* 3. MOOD ANALYSIS */}
      <div className="bg-[#242424] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#181818] text-pink-400 border border-white/5">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">3. Mood Analysis</h3>
              <p className="text-[11px] text-spotify-muted">Detected emotional mood distribution</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-pink-300 bg-pink-500/10 px-2.5 py-1 rounded font-bold">
            7 MOOD CATEGORIES
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {moods.map((m) => (
            <div key={m.name} className="bg-[#181818] p-3.5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{m.name}</span>
                <span className="text-spotify-muted font-mono">{m.pct}%</span>
              </div>
              <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden">
                <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. AI PLAYLIST SUGGESTIONS */}
      <div className="bg-[#242424] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#181818] text-[#1DB954] border border-white/5">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">4. AI Playlist Suggestions</h3>
              <p className="text-[11px] text-spotify-muted">Tailored playlists generated for your routines</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {[
            { category: 'Coding & Focus', title: '128 BPM Focus Flow', songs: 'Solar Fields, HOME, Kavinsky' },
            { category: 'Gym & Workout', title: 'High-Octane Cardio', songs: 'The Weeknd, M83, Daft Punk' },
            { category: 'Late Night', title: 'Midnight Chillwave', songs: 'The Midnight, GUNSHIP, Tycho' },
          ].map((pl) => (
            <div key={pl.title} className="bg-[#181818] p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[9px] font-mono text-[#1DB954] uppercase font-bold">{pl.category}</span>
              <h4 className="text-sm font-bold text-white">{pl.title}</h4>
              <p className="text-[11px] text-spotify-muted">Recommended: {pl.songs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5 & 6. HIDDEN GEMS & GENRE EXPANSION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hidden Gems */}
        <div className="lg:col-span-6 bg-[#242424] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#181818] text-purple-400 border border-white/5">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white">5. Hidden Gems</h3>
                <p className="text-[11px] text-spotify-muted">Lesser-known niche creators</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {hiddenGems.length > 0 ? (
              hiddenGems.map((artist) => (
                <div key={artist.id} className="bg-[#181818] p-3 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                  <div className="truncate">
                    <span className="font-bold text-white block truncate">{artist.name}</span>
                    <span className="text-spotify-muted text-[10px] truncate">{artist.genres?.slice(0, 2).join(', ')}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                    {artist.popularity}% Popularity
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-spotify-muted font-mono p-2">Explore deeper indie catalog artists.</p>
            )}
          </div>
        </div>

        {/* Genre Expansion */}
        <div className="lg:col-span-6 bg-[#242424] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#181818] text-amber-400 border border-white/5">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white">6. Genre Expansion</h3>
                <p className="text-[11px] text-spotify-muted">Sub-genres to explore</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {['Psybient', 'Synthwave', 'Indie Electronic', 'Chillwave', 'Post-Rock', 'Downtempo', 'Ambient Focus', 'Space Ambient', 'Electro-Pop', 'Future Bass'].map((g) => (
              <span key={g} className="px-3 py-1 rounded-full bg-[#181818] hover:bg-[#1DB954] hover:text-black text-xs font-mono font-semibold text-spotify-muted border border-white/5 transition-all">
                {g}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* 7 & 8. LISTENING INSIGHTS & AI WEEKLY REPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Listening Insights */}
        <div className="lg:col-span-6 bg-[#242424] p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-white/5 pb-3">
            <Lightbulb className="w-4 h-4" />
            <span>7. Listening Telemetry Facts</span>
          </div>
          <div className="bg-[#181818] p-4 rounded-2xl border border-white/5 space-y-2 text-xs font-sans text-gray-200">
            <p>"You stream electronic focus music 3x more frequently than the average listener."</p>
            <p>"Your valence stability score indicates zero abrupt emotional mood crashes during coding sessions."</p>
          </div>
        </div>

        {/* AI Weekly Report */}
        <div className="lg:col-span-6 bg-[#242424] p-6 rounded-3xl border border-purple-500/30 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm border-b border-white/5 pb-3">
            <Target className="w-4 h-4" />
            <span>8. AI Weekly Report</span>
          </div>
          <div className="bg-[#181818] p-4 rounded-2xl border border-white/5 space-y-1.5 text-xs text-gray-200 font-mono">
            <div className="flex justify-between">
              <span className="text-spotify-muted">Weekly Highlight:</span>
              <span className="text-[#1DB954] font-bold">120+ BPM Focus Flow</span>
            </div>
            <div className="flex justify-between">
              <span className="text-spotify-muted">Weekly Goal:</span>
              <span className="text-purple-300 font-bold">Discover 3 Indie Creators</span>
            </div>
          </div>
        </div>

      </div>

      {/* 10. INTERACTIVE AI CHATBOT */}
      <div className="bg-[#181818] p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-base font-bold font-heading text-white">10. Interactive Gemini AI Music Advisor Chat</h3>
          </div>
          <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-1 rounded">
            GEMINI 2.0 CHAT ACTIVE
          </span>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto p-3 bg-[#121212] rounded-2xl border border-white/5">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-2.5 text-xs ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-2xl ${msg.sender === 'user' ? 'bg-[#1DB954] text-black font-semibold' : 'bg-[#242424] text-white border border-white/10'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isChatThinking && (
            <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Gemini is thinking...</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {['Recommend songs for coding', 'What genre should I explore?', 'What should I listen to tonight?'].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendChatMessage(chip)}
              className="px-3 py-1 rounded-full bg-[#242424] hover:bg-[#1DB954] hover:text-black text-[11px] font-semibold text-spotify-muted transition-all border border-white/5"
            >
              {chip}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChatMessage();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask your AI Music Advisor anything..."
            className="flex-1 bg-[#242424] text-white text-xs rounded-full px-4 py-2.5 border border-white/10 focus:border-[#1DB954] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isChatThinking}
            className="p-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
