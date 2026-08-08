import React from 'react';
import { KpiCards } from './KpiCards';
import { ChartsGrid } from './ChartsGrid';
import { AiInsightsPanel } from './AiInsightsPanel';
import { RecentlyPlayedTable } from './RecentlyPlayedTable';

export const DashboardMainView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 6 KPI Cards */}
      <KpiCards />

      {/* Interactive Data Visualizations (Line, Bar, Donut, Heatmap) */}
      <ChartsGrid />

      {/* Gemini AI Insights Panel */}
      <AiInsightsPanel />

      {/* Recently Played Streams Log */}
      <RecentlyPlayedTable />
    </div>
  );
};
