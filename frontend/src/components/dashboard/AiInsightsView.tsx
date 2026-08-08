import React from 'react';
import { Sparkles, Brain, Clock, Calendar, Zap, Award, PieChart, Compass, CheckCircle2, Flame, Disc } from 'lucide-react';

export const AiInsightsView: React.FC = () => {
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
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Music Intelligence</h2>
          <p className="text-xs text-spotify-muted">Gemini 2.0 AI-generated listening behavior summaries, mood analytics, and habit trends</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-500/15 px-3.5 py-1.5 rounded-full border border-purple-500/30 shadow-md">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Gemini 2.0 AI Model Active</span>
        </div>
      </div>

      {/* 1. Music Personality Card (Hero Banner) */}
      <div className="bg-gradient-to-r from-[#242424] via-[#181818] to-[#242424] p-6 sm:p-8 rounded-2xl border border-purple-500/40 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1DB954] to-purple-500 flex items-center justify-center text-black font-extrabold shadow-[0_0_25px_rgba(29,185,84,0.4)] shrink-0">
              <Brain className="w-8 h-8 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">AI Archetype Profile</span>
                <span className="text-[10px] font-mono bg-[#1DB954]/20 text-[#1DB954] px-2 py-0.5 rounded font-bold">96.4% CONFIDENCE</span>
              </div>
              <h3 className="text-2xl font-extrabold font-heading text-white mt-1">Deep Flow Synthwave Specialist</h3>
              <p className="text-xs text-spotify-muted">Characterized by high late-night focus, optimistic valence stability, and electronic affinity</p>
            </div>
          </div>

          <div className="bg-[#121212]/80 px-4 py-3 rounded-xl border border-white/5 text-right font-mono shrink-0">
            <span className="text-[10px] text-spotify-muted block uppercase">AI Model Accuracy</span>
            <span className="text-lg font-bold text-[#1DB954]">96.4% Score</span>
          </div>
        </div>
      </div>

      {/* 2. Four Listening Pattern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Peak Listening Time */}
        <div className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-spotify-muted font-semibold">Peak Listening Time</span>
            <div className="p-2 rounded-xl bg-[#181818] text-[#1DB954]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-heading text-white">11:00 PM – 1:00 AM</div>
          <span className="text-[11px] font-mono text-[#1DB954] block">Late Night Focus Window</span>
        </div>

        {/* Favorite Day */}
        <div className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-spotify-muted font-semibold">Favorite Day</span>
            <div className="p-2 rounded-xl bg-[#181818] text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-heading text-white">Thursday</div>
          <span className="text-[11px] font-mono text-purple-300 block">34% of weekly stream volume</span>
        </div>

        {/* Average Session */}
        <div className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-spotify-muted font-semibold">Average Session</span>
            <div className="p-2 rounded-xl bg-[#181818] text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-heading text-white">2.8 Hours</div>
          <span className="text-[11px] font-mono text-blue-300 block">Deep focus flow sessions</span>
        </div>

        {/* Longest Streak */}
        <div className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-spotify-muted font-semibold">Longest Streak</span>
            <div className="p-2 rounded-xl bg-[#181818] text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-heading text-white">14 Days</div>
          <span className="text-[11px] font-mono text-amber-300 block">Consecutive listening streak</span>
        </div>

      </div>

      {/* 3. Mood Analysis & AI Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Mood Analysis Donut Chart (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-purple-400 border border-white/5">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Emotional Mood Valence Distribution</h3>
                <p className="text-[11px] text-spotify-muted">Psychological listening mood breakdown</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
              OPTIMISTIC
            </span>
          </div>

          <div className="flex items-center justify-center py-2 relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#181818]" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#1DB954]" strokeDasharray="42, 100" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-purple-500" strokeDasharray="34, 100" strokeDashoffset="-42" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-blue-500" strokeDasharray="14, 100" strokeDashoffset="-76" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500" strokeDasharray="10, 100" strokeDashoffset="-90" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold font-heading text-white">42%</span>
              <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider">Energetic</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]"></span>
              <span className="text-spotify-muted text-[11px]">Energetic (42%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-spotify-muted text-[11px]">Focused/Flow (34%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-spotify-muted text-[11px]">Melancholic (14%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-spotify-muted text-[11px]">Euphoric (10%)</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations for Artists & Genres (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">AI Algorithmic Match Matrix</h3>
                <p className="text-[11px] text-spotify-muted">Sonic fingerprint affinity predictions</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-[#1DB954]/10 text-[#1DB954] px-2 py-0.5 rounded">
              98% MAX MATCH
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Lorn', sub: 'Dark Ambient / Electronic', score: '98% Sonic Match' },
              { name: 'Tycho', sub: 'Chillwave / Downtempo', score: '96% Sonic Match' },
              { name: 'Solar Fields', sub: 'Psybient Focus Flow', score: '94% Sonic Match' },
              { name: 'Kavinsky', sub: 'Synthwave / Electro', score: '92% Sonic Match' },
            ].map((item) => (
              <div key={item.name} className="bg-[#181818] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{item.name}</span>
                  <span className="text-[10px] text-spotify-muted">{item.sub}</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#1DB954]/15 text-[#1DB954] px-2 py-0.5 rounded border border-[#1DB954]/30">
                  {item.score}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-spotify-muted">
            <span>Recommended Genres:</span>
            <div className="flex gap-1">
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Cyberpunk</span>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Ambient</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Weekly Listening Summary (Spotify Wrapped Aesthetic) & Gemini Text Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Spotify Wrapped Weekly Card (Span 5) */}
        <div className="lg:col-span-5 bg-gradient-to-tr from-[#1DB954] via-purple-600 to-[#181818] p-6 rounded-2xl text-white space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="text-xs font-mono font-extrabold uppercase tracking-widest">✦ YOUR WEEK IN TELEMETRY</span>
            <Disc className="w-5 h-5 text-white animate-spin-slow" />
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-[10px] text-white/70 uppercase font-mono">Top Streamed Song</span>
              <div className="text-xl font-extrabold font-heading text-white">Resonance — HOME</div>
            </div>

            <div>
              <span className="text-[10px] text-white/70 uppercase font-mono">Dominant Mood Era</span>
              <div className="text-lg font-bold font-heading text-white">Late Night Focus Flow</div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs font-mono border-t border-white/20">
              <span>Total Stream Time:</span>
              <span className="font-bold text-white">42,850 Mins</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Natural Language Text Summary (Span 7) */}
        <div className="lg:col-span-7 bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Gemini 2.0 Behavioral Listening Summary</span>
            </div>
            <span className="text-[10px] font-mono text-spotify-subtle">Updated 10m ago</span>
          </div>

          <p className="text-xs text-gray-200 leading-relaxed font-sans bg-[#181818] p-4 rounded-xl border border-white/5">
            "Your listening history exhibits a <strong className="text-[#1DB954]">Distinct Late Night Productivity Flow</strong>. You consistently switch from upbeat indie rock during afternoon work to high-focus 120–130 BPM Synthwave instrumentals past 10 PM. Your emotional valence remains steadily resilient with zero abrupt mood drops."
          </p>

          <div className="flex items-center justify-between text-xs font-mono text-[#1DB954] pt-2 border-t border-white/5">
            <span>✦ Valence Stability: 92/100</span>
            <span>✦ Acoustic Energy Index: 82/100</span>
          </div>
        </div>

      </div>

      {/* 5. Heatmap & Listening Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Heatmap (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">7x24 Activity Matrix Heatmap</h3>
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
                      title={`${day} ${hIdx}:00 — Telemetry Activity`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listening Challenges with Progress Bars (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#181818] text-amber-400 border border-white/5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white">Active Listening Challenges</h3>
                <p className="text-[11px] text-spotify-muted">Achievement milestones & progress</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded">
              2 / 3 COMPLETED
            </span>
          </div>

          <div className="space-y-3 pt-1">
            
            <div className="space-y-1 bg-[#181818] p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">Explore 5 New Indie Electronic Artists</span>
                <span className="text-[#1DB954] font-mono">4 / 5 (80%)</span>
              </div>
              <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden">
                <div className="h-full bg-[#1DB954] rounded-full w-[80%]"></div>
              </div>
            </div>

            <div className="space-y-1 bg-[#181818] p-3 rounded-xl border border-[#1DB954]/30">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                  Maintain 7-Day Focus Streak
                </span>
                <span className="text-[#1DB954] font-mono">7 / 7 (100%)</span>
              </div>
              <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden">
                <div className="h-full bg-[#1DB954] rounded-full w-[100%]"></div>
              </div>
            </div>

            <div className="space-y-1 bg-[#181818] p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">Listen to 10 Hours of High Valence BPM</span>
                <span className="text-purple-300 font-mono">8.5 / 10 hrs (85%)</span>
              </div>
              <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[85%]"></div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
