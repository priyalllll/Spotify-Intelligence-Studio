import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  Brain,
  Bot,
  User as UserIcon,
  Loader2,
  RefreshCw,
  Zap,
  Flame,
  Compass,
  Headphones
} from 'lucide-react';
import type {
  SpotifyUserProfile,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyAudioFeatures
} from '../../types/spotify';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiMusicAssistantProps {
  accessToken?: string;
}

export const AiMusicAssistant: React.FC<AiMusicAssistantProps> = ({ accessToken }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `### 👋 Welcome to Spotify AI Music Analyst!

I am powered by **Google Gemini 2.0** and your real-time Spotify telemetry. Ask me anything about your music taste, top creators, audio energy distribution, or get custom recommendations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Telemetry Cache State
  const [profile, setProfile] = useState<SpotifyUserProfile | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<SpotifyAudioFeatures[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'Describe my music taste',
    'Recommend new artists',
    'Recommend playlists',
    'Analyze my listening habits',
    'What genres fit me?',
    'Summarize this month',
    'Best songs for studying',
    'Best songs for gym',
    'Compare my genres',
    'Generate weekly report',
  ];

  // ===========================
  // Fetch Telemetry on Mount
  // ===========================
  useEffect(() => {
    const token =
      accessToken ||
      sessionStorage.getItem('spotify_access_token') ||
      localStorage.getItem('spotify_access_token');

    if (!token) return;

    // Fetch Profile
    fetch('http://localhost:5000/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setProfile(data))
      .catch(console.error);

    // Fetch Top Artists
    fetch('http://localhost:5000/auth/top-artists', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.items && setTopArtists(data.items))
      .catch(console.error);

    // Fetch Top Tracks
    fetch('http://localhost:5000/auth/top-tracks', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.items && setTopTracks(data.items))
      .catch(console.error);

    // Fetch Playlists
    fetch('http://localhost:5000/auth/playlists', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.items && setPlaylists(data.items))
      .catch(console.error);

    // Fetch Audio Features
    fetch('http://localhost:5000/auth/audio-analysis', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.audio_features && setAudioFeatures(data.audio_features))
      .catch(console.error);
  }, [accessToken]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Send Message Handler
  const handleSendMessage = async (customPrompt?: string) => {
    const query = (customPrompt || inputQuery).trim();
    if (!query || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const res = await fetch('http://localhost:5000/ai/music-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          topArtists,
          topTracks,
          playlists,
          audioFeatures,
          prompt: query,
        }),
      });

      const data = await res.json();
      const aiAnswer = data.answer || 'Apologies, I encountered an issue analyzing your telemetry. Please try again.';

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: aiAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error sending AI prompt:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: '⚠️ Unable to connect to backend AI server. Please check your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Copy to Clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear Chat History
  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you analyze your Spotify telemetry?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Simple Markdown Parser Helper
  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm font-sans leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={i} className="text-sm sm:text-base font-extrabold font-heading text-white pt-2 pb-1 border-b border-white/10">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('#### ')) {
            return (
              <h4 key={i} className="text-xs sm:text-sm font-bold font-heading text-purple-300 pt-1">
                {line.replace('#### ', '')}
              </h4>
            );
          }
          if (line.startsWith('* ') || line.startsWith('- ')) {
            const content = line.substring(2);
            return (
              <li key={i} className="ml-4 list-disc text-gray-200">
                {formatInlineStyles(content)}
              </li>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={i} className="ml-2 pl-2 border-l-2 border-[#1DB954] text-gray-200 py-0.5">
                {formatInlineStyles(line)}
              </div>
            );
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={i} className="p-2 rounded bg-[#181818] border-l-2 border-purple-400 italic text-purple-200 text-xs">
                {formatInlineStyles(line.replace('> ', ''))}
              </blockquote>
            );
          }
          if (line.trim() === '') {
            return <div key={i} className="h-1" />;
          }
          return <p key={i} className="text-gray-200">{formatInlineStyles(line)}</p>;
        })}
      </div>
    );
  };

  // Inline Bold Formatting Helper
  const formatInlineStyles = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-white font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="text-purple-300 italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-[#121212] text-[#1DB954] font-mono text-[11px] px-1.5 py-0.5 rounded border border-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <span>AI Music Assistant</span>
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </h2>
          <p className="text-xs text-spotify-muted">
            Interactive Gemini 2.0 music intelligence analyst trained on your Spotify listening profile
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#2A2A2A] text-spotify-muted hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Container Card */}
      <div className="bg-[#181818] rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[650px] relative overflow-hidden">
        {/* Chat Header Bar */}
        <div className="px-6 py-3.5 bg-[#242424]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1DB954] to-purple-500 flex items-center justify-center text-black font-bold shadow-md">
              <Bot className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Gemini 2.0 Music Analyst</span>
              <span className="text-[10px] text-[#1DB954] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping"></span>
                Connected to Spotify Web API
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-spotify-muted bg-[#121212] px-2.5 py-1 rounded border border-white/5 hidden sm:block">
            {profile?.display_name ? `Profile: ${profile.display_name}` : 'Spotify OAuth Active'}
          </div>
        </div>

        {/* Messages Stream Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar Icon */}
              {msg.sender === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-xs shrink-0 shadow-md">
                  <UserIcon className="w-4 h-4 text-black" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`group relative max-w-2xl rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-xl ${
                  msg.sender === 'user'
                    ? 'bg-[#1DB954] text-black font-semibold rounded-tr-none'
                    : 'bg-[#242424] text-white border border-white/10 rounded-tl-none'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  renderFormattedMarkdown(msg.text)
                )}

                {/* Footer Timestamp & Copy Action */}
                <div
                  className={`mt-2 flex items-center justify-between text-[9px] font-mono pt-1.5 border-t ${
                    msg.sender === 'user'
                      ? 'border-black/10 text-black/70'
                      : 'border-white/5 text-spotify-subtle'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1 rounded hover:bg-white/10 text-spotify-muted hover:text-white transition-colors flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#1DB954]" />
                          <span className="text-[#1DB954]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing / Thinking Indicator */}
          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="bg-[#242424] text-white border border-purple-500/30 rounded-2xl rounded-tl-none px-4 py-3 shadow-xl flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                <span className="text-xs font-mono text-purple-300">
                  Gemini 2.0 is analyzing your Spotify acoustic telemetry...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips Section */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#121212]/80 border-t border-white/5 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] font-mono text-spotify-subtle shrink-0 uppercase tracking-wider">
              Suggestions:
            </span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  disabled={isThinking}
                  className="px-3 py-1 rounded-full bg-[#242424] hover:bg-[#1DB954] hover:text-black border border-white/10 text-[11px] font-semibold text-spotify-muted whitespace-nowrap transition-all duration-200 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-[#242424] border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Gemini AI about your music taste, genres, habits..."
            disabled={isThinking}
            className="flex-1 bg-[#181818] text-white text-xs sm:text-sm rounded-full px-4 py-3 border border-white/10 focus:border-[#1DB954] focus:outline-none transition-all placeholder:text-spotify-subtle disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="p-3 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
