import React from 'react';
import { Sparkles, Lightbulb, Zap, ArrowUpRight } from 'lucide-react';

export const AiInsightsPanel: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#242424] via-[#181818] to-[#242424] p-6 rounded-2xl border border-purple-500/30 shadow-2xl space-y-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-heading text-white">Gemini AI Listening Intelligence</h3>
              <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                v2.0 Flash
              </span>
            </div>
            <p className="text-xs text-spotify-muted">Real-time acoustic fingerprint analysis</p>
          </div>
        </div>

        <button className="px-3 py-1.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Refresh Analysis</span>
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="p-4 rounded-xl bg-[#181818]/90 border border-white/5 text-xs text-gray-200 leading-relaxed font-sans shadow-inner">
          "Your current listening fingerprint reflects a <strong className="text-[#1DB954]">High-Focus Deep Flow State</strong>. You consistently gravitate toward mid-to-high tempo instrumental tracks (120–128 BPM) during late-evening coding sessions between 10 PM and 1 AM. Your emotional valence remains steadily optimistic with low harmonic dissonance across 84% of played tracks."
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        <div className="bg-[#181818] p-3.5 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider font-semibold block">Focus Flow Window</span>
          <span className="text-sm font-bold text-white block">10:00 PM – 1:00 AM</span>
          <span className="text-[10px] text-[#1DB954] font-mono">124 BPM Synthwave</span>
        </div>

        <div className="bg-[#181818] p-3.5 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider font-semibold block">Harmonic Valence</span>
          <span className="text-sm font-bold text-purple-400 block">82 / 100 Optimistic</span>
          <span className="text-[10px] text-spotify-subtle font-mono">High Energy Resilience</span>
        </div>

        <div className="bg-[#181818] p-3.5 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] text-spotify-muted uppercase font-mono tracking-wider font-semibold block">Rarity Index</span>
          <span className="text-sm font-bold text-blue-400 block">Top 3% Rare Listener</span>
          <span className="text-[10px] text-spotify-subtle font-mono">High Indie Affinity</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#181818] to-[#242424] border border-[#1DB954]/30 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-2.5">
          <Lightbulb className="w-4 h-4 text-[#1DB954] shrink-0" />
          <span className="text-gray-200">
            <strong>AI Recommendation:</strong> We've created a custom 25-track <strong>"Midnight Flow 128 BPM"</strong> playlist for your next focus session.
          </span>
        </div>

        <button className="px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2A2A2A] text-[#1DB954] font-semibold text-xs border border-[#1DB954]/40 hover:border-[#1DB954] transition-all shrink-0 flex items-center gap-1">
          <span>Export Playlist</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
