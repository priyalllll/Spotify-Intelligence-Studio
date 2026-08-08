import React from 'react';
import { Music, Users, Library, Clock, Disc, Flame, ArrowUpRight } from 'lucide-react';

export const KpiCards: React.FC = () => {
  const kpiData = [
    {
      id: 'total-tracks',
      title: 'Total Tracks',
      value: '1,482',
      change: '+12.4%',
      period: 'vs last month',
      icon: Music,
      accentColor: 'text-[#1DB954]',
      bgGlow: 'from-[#1DB954]/15 to-transparent',
    },
    {
      id: 'artists',
      title: 'Artists Ingested',
      value: '348',
      change: '+8.1%',
      period: 'unique creators',
      icon: Users,
      accentColor: 'text-purple-400',
      bgGlow: 'from-purple-500/15 to-transparent',
    },
    {
      id: 'playlists',
      title: 'Playlists In Library',
      value: '24',
      change: '+2',
      period: 'synced lists',
      icon: Library,
      accentColor: 'text-blue-400',
      bgGlow: 'from-blue-500/15 to-transparent',
    },
    {
      id: 'listening-hours',
      title: 'Listening Hours',
      value: '714 hrs',
      subValue: '42,840 mins',
      change: '+18.5%',
      period: 'this period',
      icon: Clock,
      accentColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/15 to-transparent',
    },
    {
      id: 'favorite-genre',
      title: 'Favorite Genre',
      value: 'Synthwave',
      subValue: '34% of streams',
      change: 'Top 1',
      period: 'dominant genre',
      icon: Disc,
      accentColor: 'text-pink-400',
      bgGlow: 'from-pink-500/15 to-transparent',
    },
    {
      id: 'average-popularity',
      title: 'Average Popularity',
      value: '78 / 100',
      change: '+4.2%',
      period: 'mainstream index',
      icon: Flame,
      accentColor: 'text-amber-400',
      bgGlow: 'from-amber-500/15 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData.map((kpi) => {
        const IconComponent = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="group relative bg-[#242424] hover:bg-[#2A2A2A] p-4.5 rounded-2xl border border-white/10 hover:border-[#1DB954]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden flex flex-col justify-between"
          >
            {/* Background Ambient Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${kpi.bgGlow} rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`}></div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-spotify-muted font-semibold tracking-tight">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl bg-[#181818] border border-white/5 ${kpi.accentColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
                  {kpi.value}
                </div>
                {kpi.subValue && (
                  <span className="text-[10px] text-spotify-subtle font-mono block mt-0.5">
                    {kpi.subValue}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] relative z-10">
              <span className="text-[#1DB954] font-mono font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.change}
              </span>
              <span className="text-spotify-subtle font-mono text-[10px] truncate max-w-[90px]">
                {kpi.period}
              </span>
            </div>

          </div>
        );
      })}
    </div>
  );
};
