import React, { useState } from 'react';
import { BarChart2, PieChart, Calendar, TrendingUp } from 'lucide-react';

export const ChartsGrid: React.FC = () => {
  const [metricTab, setMetricTab] = useState<'hours' | 'bpm' | 'valence'>('hours');
  const [barChartMode, setBarChartMode] = useState<'artists' | 'genres'>('artists');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getHeatmapColor = (dayIndex: number, hourIndex: number) => {
    const isLateNight = hourIndex >= 20 && hourIndex <= 23;
    const isAfternoon = hourIndex >= 14 && hourIndex <= 17;

    if (isLateNight && (dayIndex === 3 || dayIndex === 4)) {
      return 'bg-[#1DB954] shadow-[0_0_8px_rgba(29,185,84,0.6)]';
    } else if (isLateNight) {
      return 'bg-[#1DB954]/80';
    } else if (isAfternoon) {
      return 'bg-purple-500/70';
    } else if (hourIndex >= 8 && hourIndex <= 19) {
      return 'bg-blue-500/40';
    } else {
      return 'bg-[#181818]';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Line Chart */}
      <div className="lg:col-span-8 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Listening Telemetry Over Time</h3>
              <p className="text-[11px] text-spotify-muted">Playback trends across 30 days history</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#181818] p-1 rounded-lg border border-white/5">
            {[
              { id: 'hours', label: 'HOURS LISTENED' },
              { id: 'bpm', label: 'BPM TEMPO' },
              { id: 'valence', label: 'VALENCE' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMetricTab(tab.id as any)}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-colors ${
                  metricTab === tab.id
                    ? 'bg-[#1DB954] text-black shadow'
                    : 'text-spotify-muted hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-56 w-full relative pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={metricTab === 'hours' ? '#1DB954' : metricTab === 'bpm' ? '#A855F7' : '#3B82F6'}
                  stopOpacity="0.45"
                />
                <stop
                  offset="100%"
                  stopColor={metricTab === 'hours' ? '#1DB954' : metricTab === 'bpm' ? '#A855F7' : '#3B82F6'}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

            <path
              d={
                metricTab === 'hours'
                  ? "M0,110 Q70,40 140,80 T280,30 T420,90 T500,20 L500,150 L0,150 Z"
                  : metricTab === 'bpm'
                  ? "M0,60 Q70,120 140,40 T280,70 T420,30 T500,80 L500,150 L0,150 Z"
                  : "M0,80 Q70,30 140,90 T280,50 T420,20 T500,60 L500,150 L0,150 Z"
              }
              fill="url(#lineGradient)"
            />

            <path
              d={
                metricTab === 'hours'
                  ? "M0,110 Q70,40 140,80 T280,30 T420,90 T500,20"
                  : metricTab === 'bpm'
                  ? "M0,60 Q70,120 140,40 T280,70 T420,30 T500,80"
                  : "M0,80 Q70,30 140,90 T280,50 T420,20 T500,60"
              }
              fill="none"
              stroke={metricTab === 'hours' ? '#1DB954' : metricTab === 'bpm' ? '#A855F7' : '#3B82F6'}
              strokeWidth="3.5"
            />

            <circle cx="280" cy={metricTab === 'hours' ? 30 : metricTab === 'bpm' ? 70 : 50} r="6" fill="#FFFFFF" stroke={metricTab === 'hours' ? '#1DB954' : metricTab === 'bpm' ? '#A855F7' : '#3B82F6'} strokeWidth="3" />
            <circle cx="500" cy={metricTab === 'hours' ? 20 : metricTab === 'bpm' ? 80 : 60} r="6" fill="#FFFFFF" stroke={metricTab === 'hours' ? '#1DB954' : metricTab === 'bpm' ? '#A855F7' : '#3B82F6'} strokeWidth="3" />
          </svg>

          <div className="absolute top-4 left-[240px] bg-[#181818]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono text-spotify-muted shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
            <span>Peak Day: 24.8 Hrs | 128 BPM Synthwave</span>
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-spotify-subtle pt-2 border-t border-white/5">
          <span>Day 01</span>
          <span>Day 07</span>
          <span>Day 14</span>
          <span>Day 21</span>
          <span>Day 30 (Today)</span>
        </div>
      </div>

      {/* 2. Donut Chart */}
      <div className="lg:col-span-4 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-purple-400 border border-white/5">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Genre Spectrum</h3>
              <p className="text-[11px] text-spotify-muted">Catalog breakdown</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-[#1DB954]/10 text-[#1DB954] px-2 py-0.5 rounded border border-[#1DB954]/20">
            5 GENRES
          </span>
        </div>

        <div className="flex items-center justify-center py-2 relative">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-[#181818]" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-[#1DB954]" strokeDasharray="34, 100" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-purple-500" strokeDasharray="24, 100" strokeDashoffset="-34" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-blue-500" strokeDasharray="18, 100" strokeDashoffset="-58" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-amber-500" strokeDasharray="14, 100" strokeDashoffset="-76" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-pink-500" strokeDasharray="10, 100" strokeDashoffset="-90" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold font-heading text-white">34%</span>
            <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider">Synthwave</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]"></span>
            <span className="text-spotify-muted text-[11px]">Synthwave (34%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span className="text-spotify-muted text-[11px]">Indie Rock (24%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-spotify-muted text-[11px]">Post-Punk (18%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-spotify-muted text-[11px]">Ambient (14%)</span>
          </div>
        </div>
      </div>

      {/* 3. Bar Chart */}
      <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-blue-400 border border-white/5">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Streaming Leaderboard</h3>
              <p className="text-[11px] text-spotify-muted">Top creators rank</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setBarChartMode('artists')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded ${barChartMode === 'artists' ? 'bg-[#1DB954] text-black' : 'text-spotify-muted'}`}
            >
              ARTISTS
            </button>
            <button
              onClick={() => setBarChartMode('genres')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded ${barChartMode === 'genres' ? 'bg-[#1DB954] text-black' : 'text-spotify-muted'}`}
            >
              GENRES
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {[
            { rank: '#1', name: barChartMode === 'artists' ? 'Kavinsky' : 'Synthwave', streams: '412 streams', percent: 92, color: 'bg-[#1DB954]' },
            { rank: '#2', name: barChartMode === 'artists' ? 'The Midnight' : 'Indie Rock', streams: '389 streams', percent: 84, color: 'bg-purple-500' },
            { rank: '#3', name: barChartMode === 'artists' ? 'M83' : 'Post-Punk', streams: '340 streams', percent: 76, color: 'bg-blue-500' },
            { rank: '#4', name: barChartMode === 'artists' ? 'GUNSHIP' : 'Ambient Focus', streams: '290 streams', percent: 64, color: 'bg-amber-500' },
            { rank: '#5', name: barChartMode === 'artists' ? 'Tycho' : 'Deep House', streams: '245 streams', percent: 52, color: 'bg-pink-500' },
          ].map((item) => (
            <div key={item.rank} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#1DB954]">{item.rank}</span>
                  <span className="text-white">{item.name}</span>
                </div>
                <span className="text-spotify-muted font-mono text-[11px]">{item.streams}</span>
              </div>
              <div className="w-full h-2.5 bg-[#181818] rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Heatmap */}
      <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-amber-400 border border-white/5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">7x24 Activity Heatmap</h3>
              <p className="text-[11px] text-spotify-muted">Weekly listening hour intensity</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded">
            PEAK: 11 PM
          </span>
        </div>

        <div className="space-y-1.5 pt-1 overflow-x-auto">
          {days.map((day, dIdx) => (
            <div key={day} className="flex items-center gap-1.5">
              <span className="w-8 text-[10px] font-mono text-spotify-muted font-semibold">{day}</span>
              <div className="flex gap-1 flex-1">
                {Array.from({ length: 24 }).map((_, hIdx) => (
                  <div
                    key={hIdx}
                    className={`h-4 flex-1 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${getHeatmapColor(dIdx, hIdx)}`}
                    title={`${day} ${hIdx}:00 — Listening Activity`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-spotify-subtle pt-2 border-t border-white/5">
          <span>00:00 (Midnight)</span>
          <span>12:00 (Noon)</span>
          <span>23:00 (Night)</span>
        </div>
      </div>

    </div>
  );
};
