import React, { useState } from 'react';
import { Sidebar, type DashboardViewType } from './Sidebar';
import { Header, type TimeRangeType } from './Header';
import { DashboardMainView } from './DashboardMainView';
import { ArtistsView } from './ArtistsView';
import { TracksView } from './TracksView';
import { PlaylistsView } from './PlaylistsView';
import { AiInsightsView } from './AiInsightsView';
import { ProfileView } from './ProfileView';
import { SettingsView } from './SettingsView';

interface DashboardLayoutProps {
  onSwitchToLanding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onSwitchToLanding }) => {
  const [currentView, setCurrentView] = useState<DashboardViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('30d');

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardMainView />;
      case 'artists':
        return <ArtistsView />;
      case 'tracks':
        return <TracksView />;
      case 'playlists':
        return <PlaylistsView />;
      case 'ai':
        return <AiInsightsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardMainView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-[#1DB954] selection:text-black">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSwitchToLanding={onSwitchToLanding}
      />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        collapsed={sidebarCollapsed}
      />

      {/* Main Content View Canvas */}
      <main
        className={`pt-24 pb-16 px-4 sm:px-8 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};
