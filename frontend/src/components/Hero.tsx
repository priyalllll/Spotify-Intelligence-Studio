import React, { useState } from 'react';
import { Play, Sparkles, Zap, ShieldCheck, Activity, Disc } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroProps {
  onOpenDemo: () => void;
  onConnectSpotify: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo, onConnectSpotify }) => {
  const [activeChartTab, setActiveChartTab] = useState<'tempo' | 'valence'>('tempo');

  const handleConnect = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.2 },
      colors: ['#1DB954', '#1ED760', '#FFFFFF']
    });
    onConnectSpotify();
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#1DB954]/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#1DB954]/30 shadow-[0_0_20px_rgba(29,185,84,0.15)]">
              <Sparkles className="w-4 h-4 text-[#1DB954] animate-pulse" />
              <span className="text-xs font-semibold tracking-wide uppercase text-gray-200">
                AI-Powered Music Telemetry Studio
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Know Your Music <br />
              <span className="bg-gradient-to-r from-white via-gray-100 to-[#1DB954] bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-spotify-muted max-w-xl font-normal leading-relaxed">
              Transform your Spotify listening history into beautiful interactive dashboards, AI-powered taste summaries, and personalized track recommendations.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={handleConnect}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold text-sm tracking-wide shadow-[0_8px_30px_rgba(29,185,84,0.4)] hover:shadow-[0_10px_35px_rgba(30,215,96,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <Disc className="w-5 h-5 text-black" />
                <span>Connect with Spotify</span>
              </button>

              <button
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#242424] hover:bg-[#2A2A2A] text-white border border-white/10 font-semibold text-sm hover:border-white/25 transition-all duration-300 flex items-center justify-center gap-2.5 hover:scale-105 group"
              >
                <Play className="w-4 h-4 text-[#1DB954] fill-[#1DB954] group-hover:scale-110 transition-transform" />
                <span>View Live Demo</span>
              </button>
            </div>

            {/* Social Proof & Security */}
            <div className="flex items-center gap-6 pt-4 text-xs text-spotify-muted border-t border-white/5 w-full">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1DB954]" />
                <span>Spotify OAuth 2.0 Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Gemini 2.0 AI Models</span>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Dashboard Preview */}
          <div className="lg:col-span-6 relative">
            
            {/* Ambient Card Background Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#1DB954]/30 to-purple-600/30 blur-xl opacity-50"></div>

            {/* Dashboard Container Card */}
            <div className="relative rounded-2xl bg-[#181818] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-5">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="ml-2 text-xs font-mono text-spotify-muted">
                    studio.spotify-intelligence.ai/telemetry
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping"></span>
                  LIVE STREAM
                </div>
              </div>

              {/* KPI Mini Cards Grid */}
              <div className="grid grid-cols-3 gap-3">
                
                <div className="bg-[#242424] p-3 sm:p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-spotify-muted uppercase tracking-wider font-semibold">Listening Time</span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-lg sm:text-xl font-bold font-heading text-white">42,850</span>
                    <span className="text-[10px] text-[#1DB954] font-medium">+22%</span>
                  </div>
                  <span className="text-[9px] text-spotify-subtle">Mins this year</span>
                </div>

                <div className="bg-[#242424] p-3 sm:p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-spotify-muted uppercase tracking-wider font-semibold">Top Genre</span>
                  <div className="mt-1">
                    <span className="text-sm sm:text-base font-bold font-heading text-[#1DB954] truncate block">Synthwave</span>
                  </div>
                  <span className="text-[9px] text-spotify-subtle">34% of library</span>
                </div>

                <div className="bg-[#242424] p-3 sm:p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-spotify-muted uppercase tracking-wider font-semibold">Valence Score</span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-lg sm:text-xl font-bold font-heading text-purple-400">82 / 100</span>
                  </div>
                  <span className="text-[9px] text-spotify-subtle">High Mood Index</span>
                </div>

              </div>

              {/* SVG Trend Vector Chart */}
              <div className="bg-[#242424] p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#1DB954]" />
                    <span className="font-semibold text-white">Audio Feature Telemetry</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveChartTab('tempo')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        activeChartTab === 'tempo' ? 'bg-[#1DB954] text-black font-bold' : 'text-spotify-muted hover:text-white'
                      }`}
                    >
                      BPM TEMPO
                    </button>
                    <button
                      onClick={() => setActiveChartTab('valence')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        activeChartTab === 'valence' ? 'bg-purple-500 text-white font-bold' : 'text-spotify-muted hover:text-white'
                      }`}
                    >
                      VALENCE
                    </button>
                  </div>
                </div>

                {/* Vector Curve */}
                <div className="h-32 w-full relative pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={activeChartTab === 'tempo' ? '#1DB954' : '#A855F7'} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={activeChartTab === 'tempo' ? '#1DB954' : '#A855F7'} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={activeChartTab === 'tempo' 
                        ? "M0,70 Q50,20 100,50 T200,30 T300,60 T400,15 L400,100 L0,100 Z" 
                        : "M0,40 Q60,80 120,30 T240,65 T340,25 T400,45 L400,100 L0,100 Z"}
                      fill="url(#chartGlow)"
                    />
                    <path
                      d={activeChartTab === 'tempo' 
                        ? "M0,70 Q50,20 100,50 T200,30 T300,60 T400,15" 
                        : "M0,40 Q60,80 120,30 T240,65 T340,25 T400,45"}
                      fill="none"
                      stroke={activeChartTab === 'tempo' ? '#1DB954' : '#A855F7'}
                      strokeWidth="3"
                    />
                    <circle cx="300" cy={activeChartTab === 'tempo' ? 60 : 25} r="5" fill="#FFFFFF" stroke={activeChartTab === 'tempo' ? '#1DB954' : '#A855F7'} strokeWidth="3" />
                  </svg>
                  
                  {/* Tooltip Overlay */}
                  <div className="absolute top-2 right-16 bg-[#181818]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[10px] font-mono text-spotify-muted flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                    <span>128 BPM | Midnight Flow</span>
                  </div>
                </div>
              </div>

              {/* Glassmorphic Floating AI Insight Card */}
              <div className="bg-gradient-to-r from-[#181818] via-[#242424] to-[#181818] p-3.5 rounded-xl border border-[#1DB954]/30 shadow-lg flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#1DB954]/20 text-[#1DB954] shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                    <span>AI Habit Summary</span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">Gemini 2.0</span>
                  </div>
                  <p className="text-spotify-muted text-[11px] leading-snug">
                    "Your peak focus flow occurs at <strong className="text-white">11:00 PM on Thursdays</strong> listening to 120–130 BPM Instrumental Synthwave."
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
