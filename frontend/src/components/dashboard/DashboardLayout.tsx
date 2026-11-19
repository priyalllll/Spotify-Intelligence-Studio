import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar, type DashboardViewType } from './Sidebar';
import { Header, type TimeRangeType } from './Header';
import { DashboardMainView } from './DashboardMainView';
import { GlobalSearchModal } from './GlobalSearchModal';
import { Loader2 } from 'lucide-react';
import type { SpotifyUserProfile } from '../../types/spotify';
import { API_BASE_URL } from '../../config/env';

// Code-split heavy dashboard sub-views for optimal bundle size
const ArtistsView = lazy(() =>
  import('./ArtistsView').then((module) => ({ default: module.ArtistsView }))
);
const TracksView = lazy(() =>
  import('./TracksView').then((module) => ({ default: module.TracksView }))
);
const PlaylistsView = lazy(() =>
  import('./PlaylistsView').then((module) => ({ default: module.PlaylistsView }))
);
const AdvancedAnalyticsView = lazy(() =>
  import('./AdvancedAnalyticsView').then((module) => ({ default: module.AdvancedAnalyticsView }))
);
const SpotifyWrappedView = lazy(() =>
  import('./SpotifyWrappedView').then((module) => ({ default: module.SpotifyWrappedView }))
);
const MusicCoachView = lazy(() =>
  import('./MusicCoachView').then((module) => ({ default: module.MusicCoachView }))
);
const AiMusicAdvisorView = lazy(() =>
  import('./AiMusicAdvisorView').then((module) => ({ default: module.AiMusicAdvisorView }))
);
const SystemMonitoringView = lazy(() =>
  import('./SystemMonitoringView').then((module) => ({ default: module.SystemMonitoringView }))
);
const AiInsightsView = lazy(() =>
  import('./AiInsightsView').then((module) => ({ default: module.AiInsightsView }))
);
const SpotifyReportView = lazy(() =>
  import('./SpotifyReportView').then((module) => ({ default: module.SpotifyReportView }))
);
const IntelligenceScoreView = lazy(() =>
  import('./IntelligenceScoreView').then((module) => ({ default: module.IntelligenceScoreView }))
);
const ProfileView = lazy(() =>
  import('./ProfileView').then((module) => ({ default: module.ProfileView }))
);
const SettingsView = lazy(() =>
  import('./SettingsView').then((module) => ({ default: module.SettingsView }))
);

interface DashboardLayoutProps {
  onSwitchToLanding: () => void;
}

const LoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-[#181818]/60 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl max-w-4xl mx-auto">
    <Loader2 className="w-10 h-10 text-[#1DB954] animate-spin" />
    <div className="text-center space-y-1">
      <h3 className="text-sm font-bold font-heading text-white">Loading Workspace Telemetry...</h3>
      <p className="text-xs text-spotify-muted font-mono">Code-splitting module chunk initialization...</p>
    </div>
  </div>
);

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onSwitchToLanding,
}) => {
  const [currentView, setCurrentView] = useState<DashboardViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('30d');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [accessToken, setAccessToken] = useState<string>('');
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Initialize Access Token & Refresh Token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    const refresh = params.get('refresh_token');

    if (token) {
      setAccessToken(token);
      sessionStorage.setItem('spotify_access_token', token);
      localStorage.setItem('spotify_access_token', token);
    } else {
      const savedToken =
        sessionStorage.getItem('spotify_access_token') ||
        localStorage.getItem('spotify_access_token');

      if (savedToken) {
        setAccessToken(savedToken);
      }
    }

    if (refresh) {
      sessionStorage.setItem('spotify_refresh_token', refresh);
      localStorage.setItem('spotify_refresh_token', refresh);
    }

    if (token || refresh) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Keyboard shortcut Ctrl + K / Cmd + K to open search modal from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Spotify User Profile with Auto Token Refresh
  useEffect(() => {
    if (!accessToken) return;

    setIsLoadingProfile(true);
    setProfileError(null);

    const loadUserProfile = async (token: string) => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          const savedRefreshToken =
            sessionStorage.getItem('spotify_refresh_token') ||
            localStorage.getItem('spotify_refresh_token');

          if (savedRefreshToken) {
            console.log('🔄 Access token expired. Attempting token refresh via /auth/refresh...');
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken: savedRefreshToken }),
            });

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              if (refreshData.accessToken) {
                console.log('✅ Token Refreshed Successfully!');
                sessionStorage.setItem('spotify_access_token', refreshData.accessToken);
                localStorage.setItem('spotify_access_token', refreshData.accessToken);
                setAccessToken(refreshData.accessToken);
                return;
              }
            }
          }
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.details || errData.error || `HTTP ${res.status}`);
        }

        const data: SpotifyUserProfile = await res.json();
        console.log('✅ Spotify User Profile Loaded:', data.display_name || data.id);
        setSpotifyUser(data);
        setIsLoadingProfile(false);
      } catch (err: any) {
        console.error('❌ Error loading Spotify profile:', err.message);
        setProfileError(err.message);
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile(accessToken);
  }, [accessToken]);

  // Active View Render with React Suspense
  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardMainView accessToken={accessToken} />;

      case 'analytics':
        return <AdvancedAnalyticsView accessToken={accessToken} />;

      case 'wrapped':
        return <SpotifyWrappedView accessToken={accessToken} />;

      case 'advisor':
        return <AiMusicAdvisorView accessToken={accessToken} />;

      case 'coach':
        return <MusicCoachView accessToken={accessToken} />;

      case 'monitoring':
        return <SystemMonitoringView />;

      case 'artists':
        return <ArtistsView accessToken={accessToken} />;

      case 'tracks':
        return <TracksView accessToken={accessToken} />;

      case 'playlists':
        return <PlaylistsView accessToken={accessToken} />;

      case 'ai':
        return <AiInsightsView accessToken={accessToken} />;

      case 'report':
        return <SpotifyReportView accessToken={accessToken} />;

      case 'scores':
        return <IntelligenceScoreView accessToken={accessToken} />;

      case 'profile':
        return (
          <ProfileView
            accessToken={accessToken}
            spotifyUser={spotifyUser}
            isLoading={isLoadingProfile}
            error={profileError}
          />
        );

      case 'settings':
        return <SettingsView />;

      default:
        return <DashboardMainView accessToken={accessToken} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSwitchToLanding={onSwitchToLanding}
        accessToken={accessToken}
      />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        collapsed={sidebarCollapsed}
        spotifyUser={spotifyUser}
        onSelectView={setCurrentView}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      <main
        className={`pt-24 pb-16 px-4 sm:px-8 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <Suspense fallback={<LoadingFallback />}>
            {renderActiveView()}
          </Suspense>
        </div>
      </main>

      {/* Global Search Modal Overlay */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        accessToken={accessToken}
      />
    </div>
  );
};