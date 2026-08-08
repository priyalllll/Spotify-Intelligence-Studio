import React, { useState } from 'react';
import { Users, Heart, Flame, Globe, Crown, Gem, TrendingUp, BarChart2, PieChart, Star } from 'lucide-react';

export const ArtistsView: React.FC = () => {
  const [chartMetric, setChartMetric] = useState<'streams' | 'hours'>('streams');

  // KPI Data
  const kpis = [
    { title: 'Total Artists Ingested', value: '348', change: '+8.1%', sub: 'unique creators', icon: Users, color: 'text-[#1DB954]' },
    { title: 'Favorite Artist', value: 'Kavinsky', change: '412 Streams', sub: '28.4 listening hrs', icon: Heart, color: 'text-pink-400' },
    { title: 'Average Popularity', value: '78 / 100', change: '+4.2%', sub: 'mainstream affinity', icon: Flame, color: 'text-amber-400' },
    { title: 'Genre Diversity Index', value: '86 / 100', change: 'High Breadth', sub: 'across 32 sub-genres', icon: Globe, color: 'text-purple-400' },
  ];

  // Top 10 Artists Table Data
  const top10Artists = [
    { rank: '#1', name: 'Kavinsky', genre: 'Synthwave / Electro House', streams: '412', hours: '28.4 hrs', popularity: 88, topTrack: 'Nightcall', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#2', name: 'The Midnight', genre: 'Retrowave / Synthpop', streams: '389', hours: '24.1 hrs', popularity: 82, topTrack: 'Sunset', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#3', name: 'M83', genre: 'Indie Electronic / Shoegaze', streams: '340', hours: '21.0 hrs', popularity: 90, topTrack: 'Midnight City', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#4', name: 'GUNSHIP', genre: 'Cyberpunk Synthwave', streams: '290', hours: '18.2 hrs', popularity: 76, topTrack: 'Tech Noir', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#5', name: 'Tycho', genre: 'Ambient Chillwave', streams: '245', hours: '15.6 hrs', popularity: 80, topTrack: 'Awake', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#6', name: 'The Weeknd', genre: 'Contemporary R&B / Pop', streams: '228', hours: '14.2 hrs', popularity: 98, topTrack: 'Blinding Lights', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#7', name: 'Solar Fields', genre: 'Deep Psybient / Downtempo', streams: '195', hours: '12.8 hrs', popularity: 42, topTrack: 'Parallel Life', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#8', name: 'Lorn', genre: 'Experimental Dark Ambient', streams: '182', hours: '11.5 hrs', popularity: 68, topTrack: 'Acid Rain', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#9', name: 'HOME', genre: 'Chillwave / Synthwave', streams: '170', hours: '10.2 hrs', popularity: 84, topTrack: 'Resonance', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&h=150&fit=crop&crop=faces' },
    { rank: '#10', name: 'Daft Punk', genre: 'French Touch / Disco House', streams: '162', hours: '9.8 hrs', popularity: 95, topTrack: 'One More Time', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&h=150&fit=crop&crop=faces' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Artist Telemetry & Affinity Intelligence</h2>
          <p className="text-xs text-spotify-muted">Analyzing 348 creators across stream volume, listening time distribution, and popularity index</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] bg-[#181818] px-3.5 py-1.5 rounded-full border border-white/5 shadow-md">
          <Star className="w-4 h-4" />
          <span>Spotify for Artists Telemetry Active</span>
        </div>
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

      {/* 2. Three Special Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Most Played Artist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-5 rounded-2xl border border-[#1DB954]/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1DB954] font-bold text-xs">
              <Crown className="w-4 h-4" />
              <span>MOST PLAYED ARTIST</span>
            </div>
            <span className="text-[10px] font-mono bg-[#1DB954]/20 text-[#1DB954] px-2 py-0.5 rounded">
              #1 RANK
            </span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <img src={top10Artists[0].image} alt="Kavinsky" className="w-14 h-14 rounded-full object-cover border-2 border-[#1DB954]" />
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Kavinsky</h3>
              <p className="text-xs text-spotify-muted">Synthwave / Electro House</p>
              <div className="text-[11px] font-mono text-[#1DB954] mt-0.5">412 streams • 28.4 hrs</div>
            </div>
          </div>

          <div className="text-[11px] text-spotify-subtle border-t border-white/5 pt-2 font-mono">
            Top Track: <strong className="text-white">Nightcall</strong> (88 Popularity)
          </div>
        </div>

        {/* Hidden Gem Artist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-5 rounded-2xl border border-purple-500/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Gem className="w-4 h-4" />
              <span>HIDDEN GEM ARTIST</span>
            </div>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
              94% MATCH
            </span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <img src={top10Artists[6].image} alt="Solar Fields" className="w-14 h-14 rounded-full object-cover border-2 border-purple-500" />
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Solar Fields</h3>
              <p className="text-xs text-spotify-muted">Deep Ambient / Downtempo</p>
              <div className="text-[11px] font-mono text-purple-300 mt-0.5">195 streams • 42 Popularity</div>
            </div>
          </div>

          <div className="text-[11px] text-spotify-subtle border-t border-white/5 pt-2 font-mono">
            Underrated sonic gem in your late night focus flow
          </div>
        </div>

        {/* Most Popular Artist */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Flame className="w-4 h-4" />
              <span>MOST POPULAR ARTIST</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
              98 POPULARITY
            </span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <img src={top10Artists[5].image} alt="The Weeknd" className="w-14 h-14 rounded-full object-cover border-2 border-amber-500" />
            <div>
              <h3 className="text-lg font-bold font-heading text-white">The Weeknd</h3>
              <p className="text-xs text-spotify-muted">Contemporary R&B / Pop</p>
              <div className="text-[11px] font-mono text-amber-300 mt-0.5">228 streams • Global Star</div>
            </div>
          </div>

          <div className="text-[11px] text-spotify-subtle border-t border-white/5 pt-2 font-mono">
            Top Track: <strong className="text-white">Blinding Lights</strong> (98 Popularity)
          </div>
        </div>

      </div>

      {/* 3. Interactive Data Visualizations Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Horizontal Bar Chart: Top Artists Stream Count (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Top Artists Stream Ranking</h3>
                <p className="text-[11px] text-spotify-muted">Stream volume comparison</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setChartMetric('streams')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded ${chartMetric === 'streams' ? 'bg-[#1DB954] text-black' : 'text-spotify-muted'}`}
              >
                STREAMS
              </button>
              <button
                onClick={() => setChartMetric('hours')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded ${chartMetric === 'hours' ? 'bg-[#1DB954] text-black' : 'text-spotify-muted'}`}
              >
                HOURS
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { rank: '#1', name: 'Kavinsky', val: chartMetric === 'streams' ? '412 streams' : '28.4 hrs', percent: 95, color: 'bg-[#1DB954]' },
              { rank: '#2', name: 'The Midnight', val: chartMetric === 'streams' ? '389 streams' : '24.1 hrs', percent: 88, color: 'bg-purple-500' },
              { rank: '#3', name: 'M83', val: chartMetric === 'streams' ? '340 streams' : '21.0 hrs', percent: 78, color: 'bg-blue-500' },
              { rank: '#4', name: 'GUNSHIP', val: chartMetric === 'streams' ? '290 streams' : '18.2 hrs', percent: 66, color: 'bg-amber-500' },
              { rank: '#5', name: 'Tycho', val: chartMetric === 'streams' ? '245 streams' : '15.6 hrs', percent: 55, color: 'bg-pink-500' },
            ].map((item) => (
              <div key={item.rank} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#1DB954]">{item.rank}</span>
                    <span className="text-white">{item.name}</span>
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

        {/* Pie / Donut Chart: Listening Time Distribution by Artist (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-purple-400 border border-white/5">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Listening Time Distribution</h3>
                <p className="text-[11px] text-spotify-muted">Artist percentage share</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-[#1DB954]/10 text-[#1DB954] px-2 py-0.5 rounded">
              TOP 5 SHARE
            </span>
          </div>

          <div className="flex items-center justify-center py-2 relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#181818]" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#1DB954]" strokeDasharray="32, 100" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-purple-500" strokeDasharray="26, 100" strokeDashoffset="-32" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-blue-500" strokeDasharray="20, 100" strokeDashoffset="-58" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500" strokeDasharray="12, 100" strokeDashoffset="-78" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-pink-500" strokeDasharray="10, 100" strokeDashoffset="-90" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold font-heading text-white">32%</span>
              <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider">Kavinsky</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]"></span>
              <span className="text-spotify-muted text-[11px]">Kavinsky (32%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-spotify-muted text-[11px]">The Midnight (26%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-spotify-muted text-[11px]">M83 (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-spotify-muted text-[11px]">GUNSHIP (12%)</span>
            </div>
          </div>
        </div>

        {/* Monthly Listening Trend Line Chart (Span 12) */}
        <div className="lg:col-span-12 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">12-Month Artist Listening Accumulation</h3>
                <p className="text-[11px] text-spotify-muted">Monthly stream trajectory comparison across top creators</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-1 rounded">
              714 TOTAL HOURS
            </span>
          </div>

          <div className="h-44 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="artistTrendGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1DB954" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d="M0,90 Q40,70 80,85 T160,50 T240,40 T320,60 T400,25 T500,10 L500,120 L0,120 Z" fill="url(#artistTrendGlow)" />
              <path d="M0,90 Q40,70 80,85 T160,50 T240,40 T320,60 T400,25 T500,10" fill="none" stroke="#1DB954" strokeWidth="3" />
              <circle cx="500" cy="10" r="5" fill="#FFFFFF" stroke="#1DB954" strokeWidth="3" />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-spotify-subtle pt-2 border-t border-white/5">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

      </div>

      {/* 4. Detailed Top 10 Artists Table */}
      <div className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Top 10 Ingested Artists Roster</h3>
              <p className="text-[11px] text-spotify-muted">Detailed telemetry stream metrics</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
            Updated Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-spotify-muted border-b border-white/5 text-[10px] uppercase font-mono tracking-wider">
                <th className="pb-3 font-semibold pl-2"># Artist</th>
                <th className="pb-3 font-semibold">Primary Genre</th>
                <th className="pb-3 font-semibold">Stream Volume</th>
                <th className="pb-3 font-semibold">Listening Hours</th>
                <th className="pb-3 font-semibold">Popularity Index</th>
                <th className="pb-3 font-semibold text-right pr-2">Top Streamed Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {top10Artists.map((artist) => (
                <tr key={artist.rank} className="group hover:bg-[#2A2A2A] transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#1DB954] w-6">{artist.rank}</span>
                      <img src={artist.image} alt={artist.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" />
                      <span className="font-bold text-white group-hover:text-[#1DB954] transition-colors">{artist.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-spotify-muted">{artist.genre}</td>
                  <td className="py-3 font-mono font-bold text-[#1DB954]">{artist.streams} streams</td>
                  <td className="py-3 font-mono text-white">{artist.hours}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#181818] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1DB954] rounded-full" style={{ width: `${artist.popularity}%` }}></div>
                      </div>
                      <span className="text-[10px] font-mono text-spotify-muted">{artist.popularity}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right pr-2 font-semibold text-white">{artist.topTrack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
