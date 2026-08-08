import React, { useState } from 'react';
import { Library, Music, Clock, Heart, Disc, Layers, Sparkles, RefreshCw, BarChart2, PieChart, TrendingUp, Plus } from 'lucide-react';

export const PlaylistsView: React.FC = () => {
  const [chartMetric, setMetric] = useState<'songs' | 'duration'>('songs');

  // KPI Data
  const kpis = [
    { title: 'Total Playlists', value: '24', change: '+2 this month', sub: 'synced with Spotify', icon: Library, color: 'text-[#1DB954]' },
    { title: 'Total Songs Catalog', value: '1,482', change: '+12.4%', sub: 'across all lists', icon: Music, color: 'text-purple-400' },
    { title: 'Average Playlist Size', value: '61.7 Songs', change: '3.4 hrs avg', sub: 'optimal length', icon: Clock, color: 'text-[#1DB954]' },
    { title: 'Favorite Playlist', value: 'Midnight Flow', change: '142 hrs streamed', sub: 'top listened list', icon: Heart, color: 'text-pink-400' },
  ];

  // Playlists Table Data
  const playlists = [
    { id: '1', name: 'Midnight Flow 128 BPM', songs: 25, duration: '1h 32m', genres: 'Synthwave, Focus', updated: '2 hours ago', streams: '142 hrs', coverBg: 'from-[#1DB954] to-emerald-800' },
    { id: '2', name: 'Ultimate Retrowave Collection', songs: 180, duration: '11h 12m', genres: 'Retrowave, Cyberpunk', updated: 'Yesterday', streams: '128 hrs', coverBg: 'from-purple-600 to-[#181818]' },
    { id: '3', name: 'Late Night Coding Flow', songs: 40, duration: '2h 45m', genres: 'Ambient, Electronica', updated: '3 days ago', streams: '98 hrs', coverBg: 'from-blue-600 to-[#181818]' },
    { id: '4', name: 'Post-Punk Retrospective', songs: 32, duration: '2h 10m', genres: '80s New Wave, Post-Punk', updated: '4 days ago', streams: '84 hrs', coverBg: 'from-pink-600 to-[#181818]' },
    { id: '5', name: 'Cross-Genre Exploration', songs: 95, duration: '6h 18m', genres: 'Indie, House, Ambient', updated: '1 week ago', streams: '76 hrs', coverBg: 'from-amber-500 to-[#181818]' },
    { id: '6', name: 'High Valence Uplift', songs: 18, duration: '1h 05m', genres: 'Indie Pop, Disco', updated: '2 weeks ago', streams: '62 hrs', coverBg: 'from-emerald-500 to-[#181818]' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Smart Playlists & Catalog Telemetry</h2>
          <p className="text-xs text-spotify-muted">24 active playlists synchronized with Spotify Web API & Gemini 2.0 AI models</p>
        </div>

        <button className="px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
          <Plus className="w-4 h-4" />
          <span>Generate AI Playlist</span>
        </button>
      </div>

      {/* 1. Four KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 hover:border-[#1DB954]/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-spotify-muted font-semibold">{kpi.title}</span>
                <div className={`p-2 rounded-xl bg-[#181818] border border-white/5 ${kpi.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-extrabold font-heading text-white tracking-tight">{kpi.value}</div>
                <div className="flex items-center justify-between text-[11px] font-mono mt-1">
                  <span className="text-[#1DB954] font-bold">{kpi.change}</span>
                  <span className="text-spotify-subtle">{kpi.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Four Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Largest Playlist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-4.5 rounded-2xl border border-purple-500/30 shadow-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-400 font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              LARGEST PLAYLIST
            </span>
            <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded">
              180 SONGS
            </span>
          </div>

          <div className="pt-1">
            <h4 className="text-sm font-bold font-heading text-white truncate">Ultimate Retrowave Collection</h4>
            <p className="text-xs text-spotify-muted truncate">11h 12m • Synthwave & Cyberpunk</p>
          </div>

          <div className="text-[10px] font-mono text-purple-300 border-t border-white/5 pt-2 flex justify-between">
            <span>128 Listening Hrs</span>
            <span>Comprehensive</span>
          </div>
        </div>

        {/* Most Diverse Playlist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-4.5 rounded-2xl border border-amber-500/30 shadow-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              MOST DIVERSE
            </span>
            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
              86 DIVERSITY
            </span>
          </div>

          <div className="pt-1">
            <h4 className="text-sm font-bold font-heading text-white truncate">Cross-Genre Exploration</h4>
            <p className="text-xs text-spotify-muted truncate">95 Songs • 14 Sub-Genres</p>
          </div>

          <div className="text-[10px] font-mono text-amber-300 border-t border-white/5 pt-2 flex justify-between">
            <span>High Breadth</span>
            <span>Indie/House/Ambient</span>
          </div>
        </div>

        {/* Recently Updated Playlist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-4.5 rounded-2xl border border-[#1DB954]/30 shadow-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#1DB954] font-bold flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              RECENTLY UPDATED
            </span>
            <span className="text-[9px] font-mono bg-[#1DB954]/20 text-[#1DB954] px-1.5 py-0.2 rounded">
              2 HRS AGO
            </span>
          </div>

          <div className="pt-1">
            <h4 className="text-sm font-bold font-heading text-white truncate">Midnight Flow 128 BPM</h4>
            <p className="text-xs text-spotify-muted truncate">25 Songs • AI Sync Active</p>
          </div>

          <div className="text-[10px] font-mono text-[#1DB954] border-t border-white/5 pt-2 flex justify-between">
            <span>142 Listening Hrs</span>
            <span>Focus Flow</span>
          </div>
        </div>

        {/* Longest Listening Time */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-4.5 rounded-2xl border border-blue-500/30 shadow-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              LONGEST TIME
            </span>
            <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded">
              164 HRS
            </span>
          </div>

          <div className="pt-1">
            <h4 className="text-sm font-bold font-heading text-white truncate">Deep Focus Electronica</h4>
            <p className="text-xs text-spotify-muted truncate">40 Songs • 2h 45m Length</p>
          </div>

          <div className="text-[10px] font-mono text-blue-300 border-t border-white/5 pt-2 flex justify-between">
            <span>Workplace Choice</span>
            <span>Ambient</span>
          </div>
        </div>

      </div>

      {/* 3. Interactive Data Visualizations Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Horizontal Bar Chart: Playlist Size Comparison (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Playlist Size & Capacity Ranking</h3>
                <p className="text-[11px] text-spotify-muted">Track count breakdown</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setMetric('songs')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded ${chartMetric === 'songs' ? 'bg-[#1DB954] text-black' : 'text-spotify-muted'}`}
              >
                SONGS
              </button>
              <button
                onClick={() => setMetric('duration')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded ${chartMetric === 'duration' ? 'bg-[#1DB954] text-black' : 'text-spotify-muted'}`}
              >
                HOURS
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { rank: '#1', name: 'Ultimate Retrowave Collection', val: chartMetric === 'songs' ? '180 songs' : '11.2 hrs', percent: 95, color: 'bg-purple-500' },
              { rank: '#2', name: 'Cross-Genre Exploration', val: chartMetric === 'songs' ? '95 songs' : '6.3 hrs', percent: 65, color: 'bg-[#1DB954]' },
              { rank: '#3', name: 'Late Night Coding Flow', val: chartMetric === 'songs' ? '40 songs' : '2.8 hrs', percent: 35, color: 'bg-blue-500' },
              { rank: '#4', name: 'Post-Punk Retrospective', val: chartMetric === 'songs' ? '32 songs' : '2.2 hrs', percent: 28, color: 'bg-pink-500' },
              { rank: '#5', name: 'Midnight Flow 128 BPM', val: chartMetric === 'songs' ? '25 songs' : '1.5 hrs', percent: 22, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.rank} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#1DB954]">{item.rank}</span>
                    <span className="text-white truncate max-w-[200px]">{item.name}</span>
                  </div>
                  <span className="text-spotify-muted font-mono text-[11px]">{item.val}</span>
                </div>
                <div className="w-full h-2.5 bg-[#181818] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart: Genre Distribution Across Playlists (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-purple-400 border border-white/5">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Playlist Genre Spectrum</h3>
                <p className="text-[11px] text-spotify-muted">Genre distribution across 24 lists</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-[#1DB954]/10 text-[#1DB954] px-2 py-0.5 rounded">
              24 PLAYLISTS
            </span>
          </div>

          <div className="flex items-center justify-center py-2 relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#181818]" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#1DB954]" strokeDasharray="35, 100" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-purple-500" strokeDasharray="25, 100" strokeDashoffset="-35" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-blue-500" strokeDasharray="18, 100" strokeDashoffset="-60" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500" strokeDasharray="12, 100" strokeDashoffset="-78" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-pink-500" strokeDasharray="10, 100" strokeDashoffset="-90" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold font-heading text-white">35%</span>
              <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider">Synthwave</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]"></span>
              <span className="text-spotify-muted text-[11px]">Synthwave (35%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-spotify-muted text-[11px]">Indie Rock (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-spotify-muted text-[11px]">Post-Punk (18%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-spotify-muted text-[11px]">Ambient (12%)</span>
            </div>
          </div>
        </div>

        {/* Playlist Activity Timeline Line Chart (Span 12) */}
        <div className="lg:col-span-12 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Playlist Activity & Modification Timeline</h3>
                <p className="text-[11px] text-spotify-muted">Track addition & sync history velocity</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-1 rounded">
              24 ACTIVE LISTS
            </span>
          </div>

          <div className="h-44 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="playlistTimelineGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1DB954" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d="M0,100 Q50,40 100,80 T200,30 T300,70 T400,20 T500,10 L500,120 L0,120 Z" fill="url(#playlistTimelineGlow)" />
              <path d="M0,100 Q50,40 100,80 T200,30 T300,70 T400,20 T500,10" fill="none" stroke="#1DB954" strokeWidth="3" />
              <circle cx="500" cy="10" r="5" fill="#FFFFFF" stroke="#1DB954" strokeWidth="3" />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-spotify-subtle pt-2 border-t border-white/5">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

      </div>

      {/* 4. Detailed Playlists Table */}
      <div className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Synced Playlist Catalog Roster</h3>
              <p className="text-[11px] text-spotify-muted">Detailed playlist telemetry stats</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
            Live Sync Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-spotify-muted border-b border-white/5 text-[10px] uppercase font-mono tracking-wider">
                <th className="pb-3 font-semibold pl-2"># Playlist Name</th>
                <th className="pb-3 font-semibold">Track Count</th>
                <th className="pb-3 font-semibold">Total Duration</th>
                <th className="pb-3 font-semibold">Primary Genres</th>
                <th className="pb-3 font-semibold">Stream Volume</th>
                <th className="pb-3 font-semibold text-right pr-2">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {playlists.map((playlist, idx) => (
                <tr key={playlist.id} className="group hover:bg-[#2A2A2A] transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#1DB954] w-5">#{idx + 1}</span>
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${playlist.coverBg} flex items-center justify-center text-white shrink-0`}>
                        <Disc className="w-5 h-5 animate-spin-slow" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-[#1DB954] transition-colors">{playlist.name}</div>
                        <div className="text-[11px] text-spotify-muted font-mono">Spotify Synced</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-mono font-bold text-[#1DB954]">{playlist.songs} tracks</td>
                  <td className="py-3 font-mono text-white">{playlist.duration}</td>
                  <td className="py-3 text-spotify-muted">{playlist.genres}</td>
                  <td className="py-3 font-mono text-purple-300">{playlist.streams}</td>
                  <td className="py-3 text-right pr-2 font-mono text-spotify-subtle">{playlist.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
