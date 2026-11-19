import React from 'react';
import { KpiCards } from './KpiCards';
import { ChartsGrid } from './ChartsGrid';
import { AiInsightsPanel } from './AiInsightsPanel';
import { RecentlyPlayedTable } from './RecentlyPlayedTable';

interface DashboardMainViewProps {
  accessToken?: string;
}

export const DashboardMainView: React.FC<DashboardMainViewProps> = ({ accessToken }) => {
  return (
    <div className="space-y-6">
      {/* 10 Calculated Real-Time Spotify Telemetry Metrics */}
      <KpiCards accessToken={accessToken} />

      {/* 6 Recharts Live Interactive Visualizations */}
      <ChartsGrid accessToken={accessToken} />

      {/* Gemini AI Insights Panel */}
      <AiInsightsPanel />

      {/* Recently Played Streams Log */}
      <RecentlyPlayedTable accessToken={accessToken} />
    </div>
  );
};
