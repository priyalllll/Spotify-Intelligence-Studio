import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Sparkles, ExternalLink } from 'lucide-react';

export type TimeRangeType = '7d' | '30d' | '6m' | 'all';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  timeRange: TimeRangeType;
  onTimeRangeChange: (tr: TimeRangeType) => void;
  collapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  timeRange,
  onTimeRangeChange,
  collapsed,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#181818]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-spotify-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search artists, tracks, genres, or playlists... (Ctrl + K)"
            className="w-full bg-[#242424] text-white text-xs rounded-full pl-10 pr-12 py-2.5 border border-white/10 focus:border-[#1DB954] focus:outline-none transition-all placeholder:text-spotify-subtle"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-spotify-subtle bg-[#121212] px-1.5 py-0.5 rounded border border-white/10">
            Ctrl K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1 bg-[#242424] p-1 rounded-full border border-white/5">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '6m', label: '6 Months' },
            { id: 'all', label: 'All Time' },
          ].map((tr) => (
            <button
              key={tr.id}
              onClick={() => onTimeRangeChange(tr.id as TimeRangeType)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                timeRange === tr.id
                  ? 'bg-[#1DB954] text-black shadow-md'
                  : 'text-spotify-muted hover:text-white'
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-[#242424] hover:bg-[#2A2A2A] text-spotify-muted hover:text-white border border-white/5 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#1DB954] border-2 border-[#181818]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#242424] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-white font-heading">Studio Telemetry Alerts</span>
                <span className="text-[10px] text-[#1DB954] font-mono">2 Unread</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">New AI Taste Summary Ready</p>
                    <p className="text-spotify-muted text-[11px] mt-0.5">Gemini 2.0 updated your Synthwave focus flow profile.</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#1DB954] shrink-0 mt-1"></span>
                  <div>
                    <p className="text-white font-medium">Spotify Playlist Sync Complete</p>
                    <p className="text-spotify-muted text-[11px] mt-0.5">Exported "Deep Focus 128 BPM" to Spotify library.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#2A2A2A] border border-white/10 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1DB954] to-purple-500 flex items-center justify-center font-bold text-black text-xs">
              P
            </div>
            <span className="text-xs font-semibold text-white hidden sm:inline">Priya S.</span>
            <ChevronDown className="w-3.5 h-3.5 text-spotify-muted" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#242424] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs font-bold text-white">Priya S.</p>
                <p className="text-[10px] text-spotify-muted font-mono">Spotify Premium Account</p>
              </div>
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-spotify-muted hover:text-white hover:bg-[#181818] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>Open Spotify App</span>
              </a>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
