import React, { useState } from 'react';
import { Layout, Activity, Sparkles, Music, BarChart2 } from 'lucide-react';

export const DashboardPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audio' | 'ai' | 'tracks'>('overview');
  const [timeFilter, setTimeFilter] = useState<'7d' | '4w' | '1y'>('4w');

  return (
    <section id="dashboards" className="py-24 bg-[#181818] border-y border-white/5 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#1DB954]/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242424] border border-white/10 text-[#1DB954] text-xs font-semibold uppercase tracking-wider">
            <Layout className="w-3.5 h-3.5" />
            <span>Interactive Telemetry Suite</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Explore Your Dashboard in Real Time
          </h2>

          <p className="text-base text-spotify-muted">
            Toggle views to experience how Spotify Intelligence Studio breaks down your sonic fingerprint with precision charts and AI models.
          </p>
        </div>

        {/* Studio Window Frame */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Studio Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-[#181818]">
            
            {/* Left Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {[
                { id: 'overview', label: '📈 Telemetry Overview', icon: BarChart2 },
                { id: 'audio', label: '⚡ Audio Features Matrix', icon: Activity },
                { id: 'ai', label: '🪄 AI Taste Summaries', icon: Sparkles },
                { id: 'tracks', label: '🎵 Top Tracks Network', icon: Music },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#1DB954] text-black shadow-[0_0_15px_rgba(29,185,84,0.3)]'
                        : 'text-spotify-muted hover:text-white bg-[#242424]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Time Filters */}
            <div className="flex items-center gap-1.5 bg-[#242424] p-1 rounded-lg border border-white/5">
              {[
                { id: '7d', label: '7 Days' },
                { id: '4w', label: '4 Weeks' },
                { id: '1y', label: '1 Year' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded transition-colors ${
                    timeFilter === filter.id
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-spotify-muted hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

          </div>

          {/* Studio Body View Content */}
          <div className="p-6 sm:p-8 min-h-[380px]">
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-[#181818] p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-spotify-muted">Total Stream Minutes</span>
                    <div className="text-2xl font-bold font-heading text-white mt-1">42,850 min</div>
                    <span className="text-[10px] text-[#1DB954] font-mono">+18% vs last cycle</span>
                  </div>
                  <div className="bg-[#181818] p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-spotify-muted">Unique Artists</span>
                    <div className="text-2xl font-bold font-heading text-purple-400 mt-1">1,240</div>
                    <span className="text-[10px] text-spotify-subtle font-mono">Top 5% Diversity</span>
                  </div>
                  <div className="bg-[#181818] p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-spotify-muted">Average Energy</span>
                    <div className="text-2xl font-bold font-heading text-blue-400 mt-1">78 / 100</div>
                    <span className="text-[10px] text-spotify-subtle font-mono">Upbeat & Focused</span>
                  </div>
                  <div className="bg-[#181818] p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-spotify-muted">Discovery Rate</span>
                    <div className="text-2xl font-bold font-heading text-[#1DB954] mt-1">64%</div>
                    <span className="text-[10px] text-spotify-subtle font-mono">High Exploration</span>
                  </div>
                </div>

                <div className="bg-[#181818] p-5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-white">Daily Listening Distribution</span>
                    <span className="text-xs text-spotify-muted font-mono">Peak: 11:00 PM</span>
                  </div>
                  <div className="h-28 flex items-end gap-2 pt-4">
                    {[35, 20, 15, 10, 25, 45, 60, 85, 90, 70, 50, 65, 80, 95, 100, 88, 72, 60, 80, 95, 100, 85, 60, 40].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div 
                          className="w-full bg-[#1DB954]/40 group-hover:bg-[#1DB954] rounded-t transition-all duration-300"
                          style={{ height: `${h}%` }}
                        ></div>
                        <span className="text-[8px] font-mono text-spotify-subtle hidden sm:block">{i}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                  <h4 className="text-sm font-bold text-white">Acoustic Radar Profile</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Danceability', value: 76, color: 'bg-[#1DB954]' },
                      { name: 'Energy', value: 82, color: 'bg-purple-500' },
                      { name: 'Valence (Happiness)', value: 68, color: 'bg-blue-500' },
                      { name: 'Speechiness', value: 24, color: 'bg-amber-500' },
                      { name: 'Acousticness', value: 18, color: 'bg-pink-500' },
                    ].map((metric) => (
                      <div key={metric.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-spotify-muted">{metric.name}</span>
                          <span className="text-white font-bold">{metric.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden">
                          <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#181818] p-5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">Tempo Spectrum Breakdown</h4>
                    <p className="text-xs text-spotify-muted leading-relaxed">
                      Your dominant tempo sits between <strong className="text-white">120 BPM and 128 BPM</strong>, matching standard synthwave, house, and deep focus electronica.
                    </p>
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-[#121212] border border-white/5 flex items-center justify-around text-center">
                    <div>
                      <span className="text-[10px] text-spotify-muted uppercase block">Slow (&lt;90 BPM)</span>
                      <span className="text-lg font-bold text-white">14%</span>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div>
                      <span className="text-[10px] text-spotify-muted uppercase block">Mid (90-120 BPM)</span>
                      <span className="text-lg font-bold text-white">32%</span>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div>
                      <span className="text-[10px] text-spotify-muted uppercase block">Fast (120+ BPM)</span>
                      <span className="text-lg font-bold text-[#1DB954]">54%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#181818] via-[#242424] to-[#181818] p-6 rounded-xl border border-purple-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini 2.0 Architectural Summary</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    "Your listening fingerprint highlights a distinct preference for high-energy synth instrumentation coupled with euphoric harmonic resolutions. Your playback history reveals a consistent pattern of switching to deep focus instrumental tracks during late night coding and creative writing sessions."
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-[#1DB954] block">✦ Genre Evolution Trend</span>
                    <p className="text-spotify-muted">Shifted from Indie Rock (+12%) to Retrowave and Deep Electronic over the past 6 months.</p>
                  </div>
                  <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="font-bold text-purple-400 block">✦ Mood Stability Score</span>
                    <p className="text-spotify-muted">High emotional valence resilience with zero abrupt mood drops during weeknights.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracks' && (
              <div className="space-y-3">
                {[
                  { rank: '#1', title: 'Resonance', artist: 'HOME', album: 'Odyssey', time: '3:32', plays: '412 streams' },
                  { rank: '#2', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', time: '4:03', plays: '389 streams' },
                  { rank: '#3', title: 'Tech Noir', artist: 'GUNSHIP', album: 'GUNSHIP', time: '4:57', plays: '310 streams' },
                  { rank: '#4', title: 'Sunset', artist: 'The Midnight', album: 'Endless Summer', time: '5:26', plays: '284 streams' },
                ].map((track) => (
                  <div key={track.rank} className="bg-[#181818] p-3.5 rounded-xl border border-white/5 flex items-center justify-between hover:bg-[#242424] transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-[#1DB954] w-6">{track.rank}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{track.title}</div>
                        <div className="text-[11px] text-spotify-muted">{track.artist} • <span className="text-spotify-subtle">{track.album}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-xs font-mono text-spotify-muted">
                      <span>{track.plays}</span>
                      <span className="hidden sm:inline">{track.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
