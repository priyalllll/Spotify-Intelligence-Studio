import React from 'react';
import {
  LayoutDashboard,
  Users,
  Music,
  Library,
  Sparkles,
  FileText,
  Activity,
  User,
  Settings,
  Disc,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  BarChart2,
  Gift,
  Brain,
  Bot,
  Server
} from 'lucide-react';

export type DashboardViewType =
  | 'dashboard'
  | 'analytics'
  | 'wrapped'
  | 'advisor'
  | 'coach'
  | 'monitoring'
  | 'artists'
  | 'tracks'
  | 'playlists'
  | 'ai'
  | 'report'
  | 'scores'
  | 'profile'
  | 'settings';

interface SidebarProps {
  currentView: DashboardViewType;
  onSelectView: (view: DashboardViewType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSwitchToLanding: () => void;
  accessToken?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  onSwitchToLanding,
  accessToken,
}) => {
  const isConnected = Boolean(accessToken);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'analytics', label: 'Advanced Analytics', icon: BarChart2, badge: '9 Charts' },
    { id: 'wrapped', label: 'Spotify Wrapped', icon: Gift, badge: '2026' },
    { id: 'advisor', label: 'AI Music Advisor', icon: Bot, badge: 'NEW' },
    { id: 'coach', label: 'Music Coach', icon: Brain, badge: 'Gemini' },
    { id: 'monitoring', label: 'System Monitoring', icon: Server, badge: 'Admin' },
    { id: 'artists', label: 'Top Artists', icon: Users, badge: '348' },
    { id: 'tracks', label: 'Tracks & Features', icon: Music, badge: '1.4k' },
    { id: 'playlists', label: 'Playlists', icon: Library, badge: '24' },
    { id: 'ai', label: 'AI Insights', icon: Sparkles, badge: 'Gemini' },
    { id: 'report', label: 'Intelligence Report', icon: FileText, badge: 'Flagship' },
    { id: 'scores', label: 'Intelligence Scores', icon: Activity, badge: '8 Scores' },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#181818] border-r border-white/10 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div
            onClick={() => {
              onSelectView('dashboard');
            }}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(29,185,84,0.4)]">
              <Disc className="w-5 h-5 text-black animate-spin-slow" />
            </div>
            {!collapsed && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-heading font-bold text-sm text-white tracking-tight">
                  Spotify Intelligence
                </span>
                <span className="text-[10px] font-mono text-[#1DB954] font-semibold uppercase tracking-wider">
                  Analytics Studio
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg bg-[#242424] hover:bg-[#2A2A2A] text-spotify-muted hover:text-white border border-white/5 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-3 border-b border-white/5">
          <button
            onClick={onSwitchToLanding}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-spotify-muted hover:text-white bg-[#242424] hover:bg-[#2A2A2A] border border-white/5 transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Back to Landing Page"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#1DB954] shrink-0" />
            {!collapsed && <span>Back to Landing Page</span>}
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id as DashboardViewType)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[#1DB954] text-black shadow-[0_4px_20px_rgba(29,185,84,0.3)]'
                    : 'text-spotify-muted hover:text-white hover:bg-[#242424]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'group-hover:text-[#1DB954]'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-black/20 text-black'
                        : 'bg-[#121212] text-[#1DB954] border border-[#1DB954]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-white/10 bg-[#121212]/50">
        {!collapsed ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#1DB954] animate-ping' : 'bg-amber-500'}`}></span>
              <span className="text-white font-semibold">{isConnected ? 'Spotify Connected' : 'Session Pending'}</span>
            </div>
            <p className="text-[10px] text-spotify-subtle font-mono">
              {isConnected ? 'OAuth 2.0 PKCE Active' : 'Login Required'}
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title={isConnected ? 'Spotify Connected' : 'Session Pending'}>
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-[#1DB954] animate-ping' : 'bg-amber-500'}`}></span>
          </div>
        )}
      </div>
    </aside>
  );
};
