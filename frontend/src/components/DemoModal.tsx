import React, { useState } from 'react';
import { X, Sparkles, Disc, CheckCircle } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSpotify: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onConnectSpotify }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'ai' | 'recommendations'>('analytics');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#181818] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#242424]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
              <Disc className="w-4 h-4 text-black animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">Spotify Intelligence Studio Demo</h3>
              <p className="text-xs text-spotify-muted">Simulated Sandbox Telemetry & Insights</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-spotify-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5 bg-[#181818]">
          {[
            { id: 'analytics', label: '📊 Telemetry Analytics' },
            { id: 'ai', label: '🪄 AI Taste Summaries' },
            { id: 'recommendations', label: '🎵 Smart Recommendations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#1DB954] text-[#1DB954] bg-[#242424]'
                  : 'border-transparent text-spotify-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#242424] p-4 rounded-xl border border-white/5">
                  <span className="text-xs text-spotify-muted">Energy Index</span>
                  <div className="text-2xl font-bold font-heading text-[#1DB954] mt-1">86 / 100</div>
                  <p className="text-[10px] text-spotify-subtle mt-1">High workout & study rhythm</p>
                </div>
                <div className="bg-[#242424] p-4 rounded-xl border border-white/5">
                  <span className="text-xs text-spotify-muted">Danceability Rate</span>
                  <div className="text-2xl font-bold font-heading text-purple-400 mt-1">74%</div>
                  <p className="text-[10px] text-spotify-subtle mt-1">Upbeat groove consistency</p>
                </div>
                <div className="bg-[#242424] p-4 rounded-xl border border-white/5">
                  <span className="text-xs text-spotify-muted">Acousticness Ratio</span>
                  <div className="text-2xl font-bold font-heading text-blue-400 mt-1">18%</div>
                  <p className="text-[10px] text-spotify-subtle mt-1">Predominantly synthetic production</p>
                </div>
              </div>

              <div className="bg-[#242424] p-5 rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-white mb-3">Top Streaming Eras Breakdown</h4>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-spotify-muted">2020s Synthwave & Indie</span>
                      <span className="text-white font-bold">58%</span>
                    </div>
                    <div className="w-full h-2 bg-[#181818] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1DB954] rounded-full w-[58%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-spotify-muted">1980s New Wave & Post-Punk</span>
                      <span className="text-white font-bold">24%</span>
                    </div>
                    <div className="w-full h-2 bg-[#181818] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full w-[24%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-spotify-muted">Ambient & Lo-Fi Focus</span>
                      <span className="text-white font-bold">18%</span>
                    </div>
                    <div className="w-full h-2 bg-[#181818] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[18%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#242424] to-[#181818] p-5 rounded-xl border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini 2.0 Architectural Taste Analysis</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  "Your listening profile reflects a <strong className="text-[#1DB954]">High-Focus Deep Flow</strong> state. You consistently gravitate toward mid-to-high tempo instrumental tracks (120-128 BPM) during late evening work sessions. Your emotional valence remains steadily optimistic with low harmonic dissonance."
                </p>
              </div>

              <div className="bg-[#242424] p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                <div className="font-bold text-white">Key Musical Traits Discovered:</div>
                <ul className="space-y-1.5 text-spotify-muted list-disc list-inside">
                  <li><strong className="text-white">Late Night Productivity:</strong> Peak listening hours between 10 PM – 1 AM.</li>
                  <li><strong className="text-white">Sonic Cohesion:</strong> 82% overlap in frequency spectrum across top 50 tracks.</li>
                  <li><strong className="text-white">Uniqueness Rating:</strong> Top 3% rare indie electronic listener nationwide.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">AI Algorithmic Recommendations</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Neon Horizon', artist: 'Kavinsky & Lorn', score: '99% Sonic Match' },
                  { title: 'Parallel Digital Flow', artist: 'Tycho', score: '97% Sonic Match' },
                  { title: 'Midnight City Skyline', artist: 'M83', score: '95% Sonic Match' },
                  { title: 'Deep Focus Spectrum', artist: 'Solar Fields', score: '92% Sonic Match' },
                ].map((track, i) => (
                  <div key={i} className="bg-[#242424] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{track.title}</div>
                      <div className="text-[11px] text-spotify-muted">{track.artist}</div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#1DB954]/20 text-[#1DB954]">
                      {track.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#242424]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-spotify-muted">
            <CheckCircle className="w-4 h-4 text-[#1DB954]" />
            <span>Ready to unlock your personalized live data?</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onConnectSpotify();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold text-xs shadow-lg transition-all duration-200 hover:scale-105"
          >
            Connect Spotify Now
          </button>
        </div>

      </div>
    </div>
  );
};
