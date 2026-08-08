import React, { useState } from 'react';
import { Music, Clock, Flame, Zap, Play, Sparkles, BarChart2, TrendingUp, Activity, Gem, Star } from 'lucide-react';

export const TracksView: React.FC = () => {
  const [metricTab, setMetricTab] = useState<'streams' | 'popularity'>('streams');

  // KPI Data
  const kpis = [
    { title: 'Total Tracks Ingested', value: '1,482', change: '+12.4%', sub: 'in library', icon: Music, color: 'text-[#1DB954]' },
    { title: 'Average Duration', value: '3:45 min', change: 'Optimal', sub: 'playback length', icon: Clock, color: 'text-purple-400' },
    { title: 'Average Popularity', value: '78 / 100', change: '+4.2%', sub: 'mainstream index', icon: Flame, color: 'text-amber-400' },
    { title: 'Average Energy', value: '82 / 100', change: 'High Valence', sub: 'acoustic intensity', icon: Zap, color: 'text-blue-400' },
  ];

  // Top Tracks Table Data
  const topTracks = [
    { rank: '#1', title: 'Resonance', artist: 'HOME', album: 'Odyssey', streams: '412', duration: '3:32', popularity: 88, bpm: 124, valence: 'High Valence', cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#2', title: 'Midnight City', artist: 'M83', album: "Hurry Up, We're Dreaming", streams: '389', duration: '4:03', popularity: 92, bpm: 128, valence: 'Energetic', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#3', title: 'Tech Noir', artist: 'GUNSHIP', album: 'GUNSHIP', streams: '340', duration: '4:57', popularity: 76, bpm: 118, valence: 'Focused', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#4', title: 'Sunset', artist: 'The Midnight', album: 'Endless Summer', streams: '290', duration: '5:26', popularity: 82, bpm: 126, valence: 'Euphoric', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#5', title: 'Nightcall', artist: 'Kavinsky', album: 'OutRun', streams: '245', duration: '4:18', popularity: 95, bpm: 120, valence: 'Atmospheric', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#6', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', streams: '228', duration: '3:20', popularity: 98, bpm: 171, valence: 'Euphoric', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#7', title: 'Parallel Life', artist: 'Solar Fields', album: 'Reflective Frequencies', streams: '195', duration: '8:12', popularity: 42, bpm: 110, valence: 'Deep Ambient', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#8', title: 'Acid Rain', artist: 'Lorn', album: 'Vessel', streams: '182', duration: '3:34', popularity: 68, bpm: 105, valence: 'Dark Flow', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#9', name: 'Awake', title: 'Awake', artist: 'Tycho', album: 'Awake', streams: '170', duration: '4:43', popularity: 80, bpm: 122, valence: 'Chilled', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=120&h=120&fit=crop&crop=faces' },
    { rank: '#10', title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', streams: '162', duration: '5:20', popularity: 95, bpm: 123, valence: 'Uplifting', cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=120&h=120&fit=crop&crop=faces' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Track Telemetry & Acoustic Feature Matrix</h2>
          <p className="text-xs text-spotify-muted">Analyzing 1,482 tracks across stream velocity, audio valence, energy index, and popularity distribution</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] bg-[#181818] px-3.5 py-1.5 rounded-full border border-white/5 shadow-md">
          <Sparkles className="w-4 h-4" />
          <span>Track Telemetry Active</span>
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

      {/* 2. Four Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Most Played Song */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-4.5 rounded-2xl border border-[#1DB954]/30 shadow-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#1DB954] font-bold flex items-center gap-1.5">
              <Music className="w-4 h-4" />
              MOST PLAYED SONG
            </span>
            <span className="text-[9px] font-mono bg-[#1DB954]/20 text-[#1DB954] px-1.5 py-0.2 rounded">
              #1 RANK
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <img src={topTracks[0].cover} alt="Resonance" className="w-11 h-11 rounded-lg object-cover border border-[#1DB954]" />
            <div className="truncate">
              <h4 className="text-sm font-bold font-heading text-white truncate">Resonance</h4>
              <p className="text-xs text-spotify-muted truncate">HOME • Odyssey</p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#1DB954] border-t border-white/5 pt-2 flex justify-between">
            <span>412 Streams</span>
            <span>124 BPM</span>
          </div>
        </div>

        {/* Longest Song */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-4.5 rounded-2xl border border-purple-500/30 shadow-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-400 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              LONGEST TRACK
            </span>
            <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded">
              8:12 MINS
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <img src={topTracks[6].cover} alt="Parallel Life" className="w-11 h-11 rounded-lg object-cover border border-purple-500" />
            <div className="truncate">
              <h4 className="text-sm font-bold font-heading text-white truncate">Parallel Life</h4>
              <p className="text-xs text-spotify-muted truncate">Solar Fields</p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-purple-300 border-t border-white/5 pt-2 flex justify-between">
            <span>Deep Ambient Journey</span>
            <span>110 BPM</span>
          </div>
        </div>

        {/* Highest Energy Track */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-4.5 rounded-2xl border border-amber-500/30 shadow-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              HIGHEST ENERGY
            </span>
            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
              96 / 100 ENERGY
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <img src={topTracks[2].cover} alt="Tech Noir" className="w-11 h-11 rounded-lg object-cover border border-amber-500" />
            <div className="truncate">
              <h4 className="text-sm font-bold font-heading text-white truncate">Tech Noir</h4>
              <p className="text-xs text-spotify-muted truncate">GUNSHIP</p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-amber-300 border-t border-white/5 pt-2 flex justify-between">
            <span>340 Streams</span>
            <span>118 BPM Synthwave</span>
          </div>
        </div>

        {/* Hidden Gem Track */}
        <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-4.5 rounded-2xl border border-blue-500/30 shadow-xl space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400 font-bold flex items-center gap-1.5">
              <Gem className="w-4 h-4" />
              HIDDEN GEM TRACK
            </span>
            <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded">
              94% SONIC MATCH
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <img src={topTracks[7].cover} alt="Acid Rain" className="w-11 h-11 rounded-lg object-cover border border-blue-500" />
            <div className="truncate">
              <h4 className="text-sm font-bold font-heading text-white truncate">Acid Rain</h4>
              <p className="text-xs text-spotify-muted truncate">Lorn • Vessel</p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-blue-300 border-t border-white/5 pt-2 flex justify-between">
            <span>182 Streams</span>
            <span>68 Popularity</span>
          </div>
        </div>

      </div>

      {/* 3. Interactive Data Visualizations Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Horizontal Bar Chart: Top Tracks Stream Ranking (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Top Tracks Stream Ranking</h3>
                <p className="text-[11px] text-spotify-muted">Stream velocity breakdown</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setMetricTab('streams')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded ${metricTab === 'streams' ? 'bg-[#1DB954] text-black' : 'text-spotify-muted'}`}
              >
                STREAMS
              </button>
              <button
                onClick={() => setMetricTab('popularity')}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded ${metricTab === 'popularity' ? 'bg-[#1DB954] text-black' : 'text-spotify-muted'}`}
              >
                POPULARITY
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { rank: '#1', name: 'Resonance — HOME', val: metricTab === 'streams' ? '412 streams' : '88 Pop', percent: 95, color: 'bg-[#1DB954]' },
              { rank: '#2', name: 'Midnight City — M83', val: metricTab === 'streams' ? '389 streams' : '92 Pop', percent: 90, color: 'bg-purple-500' },
              { rank: '#3', name: 'Tech Noir — GUNSHIP', val: metricTab === 'streams' ? '340 streams' : '76 Pop', percent: 78, color: 'bg-blue-500' },
              { rank: '#4', name: 'Sunset — The Midnight', val: metricTab === 'streams' ? '290 streams' : '82 Pop', percent: 68, color: 'bg-amber-500' },
              { rank: '#5', name: 'Nightcall — Kavinsky', val: metricTab === 'streams' ? '245 streams' : '95 Pop', percent: 58, color: 'bg-pink-500' },
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

        {/* Audio Features Radar / Acoustic Profile (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-purple-400 border border-white/5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Audio Features Radar Profile</h3>
                <p className="text-[11px] text-spotify-muted">Acoustic fingerprint averages</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-[#1DB954]/10 text-[#1DB954] px-2 py-0.5 rounded">
              4 METRICS
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { name: 'Energy Index', val: '82 / 100', percent: 82, color: 'bg-[#1DB954]' },
              { name: 'Danceability Score', val: '76 / 100', percent: 76, color: 'bg-purple-500' },
              { name: 'Valence (Optimism)', val: '68 / 100', percent: 68, color: 'bg-blue-500' },
              { name: 'Acousticness Ratio', val: '18 / 100', percent: 18, color: 'bg-amber-500' },
            ].map((feature) => (
              <div key={feature.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{feature.name}</span>
                  <span className="text-spotify-muted font-mono text-[11px]">{feature.val}</span>
                </div>
                <div className="w-full h-2 bg-[#181818] rounded-full overflow-hidden">
                  <div className={`h-full ${feature.color} rounded-full`} style={{ width: `${feature.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listening Trend Line Chart (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Track Streaming Velocity Trend</h3>
                <p className="text-[11px] text-spotify-muted">Daily streams over 30 days</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded">
              PEAK: 84 STREAMS/DAY
            </span>
          </div>

          <div className="h-40 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trackTrendGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1DB954" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d="M0,100 Q60,30 120,70 T240,40 T360,80 T500,20 L500,120 L0,120 Z" fill="url(#trackTrendGlow)" />
              <path d="M0,100 Q60,30 120,70 T240,40 T360,80 T500,20" fill="none" stroke="#1DB954" strokeWidth="3" />
              <circle cx="500" cy="20" r="5" fill="#FFFFFF" stroke="#1DB954" strokeWidth="3" />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-spotify-subtle pt-2 border-t border-white/5">
            <span>Day 01</span><span>Day 10</span><span>Day 20</span><span>Day 30 (Today)</span>
          </div>
        </div>

        {/* Popularity Distribution Histogram (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-amber-400 border border-white/5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Popularity Index Histogram</h3>
                <p className="text-[11px] text-spotify-muted">Catalog popularity distribution</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              AVG 78/100
            </span>
          </div>

          <div className="h-40 flex items-end gap-4 pt-4 px-2">
            {[
              { label: 'Low (<40)', height: 20, count: '120 tracks', color: 'bg-blue-500' },
              { label: 'Mid (40-75)', height: 50, count: '380 tracks', color: 'bg-purple-500' },
              { label: 'High (75-90)', height: 95, count: '740 tracks', color: 'bg-[#1DB954]' },
              { label: 'Top (90-100)', height: 60, count: '242 tracks', color: 'bg-amber-500' },
            ].map((bucket) => (
              <div key={bucket.label} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[9px] font-mono text-spotify-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  {bucket.count}
                </span>
                <div
                  className={`w-full ${bucket.color} rounded-t transition-all duration-500 group-hover:brightness-125`}
                  style={{ height: `${bucket.height}%` }}
                ></div>
                <span className="text-[10px] font-mono text-spotify-subtle">{bucket.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Detailed Top Tracks Table */}
      <div className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Top 10 Track Stream Roster</h3>
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
                <th className="pb-3 font-semibold pl-2"># Track</th>
                <th className="pb-3 font-semibold">Album</th>
                <th className="pb-3 font-semibold">Stream Volume</th>
                <th className="pb-3 font-semibold">Acoustic Features</th>
                <th className="pb-3 font-semibold">Popularity Index</th>
                <th className="pb-3 font-semibold text-right pr-2">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topTracks.map((track) => (
                <tr key={track.rank} className="group hover:bg-[#2A2A2A] transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#1DB954] w-6">{track.rank}</span>
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 group">
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="w-3.5 h-3.5 text-[#1DB954] fill-[#1DB954]" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-[#1DB954] transition-colors">{track.title}</div>
                        <div className="text-[11px] text-spotify-muted">{track.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-spotify-muted">{track.album}</td>
                  <td className="py-3 font-mono font-bold text-[#1DB954]">{track.streams} streams</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30">
                        {track.bpm} BPM
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30">
                        {track.valence}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#181818] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1DB954] rounded-full" style={{ width: `${track.popularity}%` }}></div>
                      </div>
                      <span className="text-[10px] font-mono text-spotify-muted">{track.popularity}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right pr-2 font-mono text-white">{track.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
