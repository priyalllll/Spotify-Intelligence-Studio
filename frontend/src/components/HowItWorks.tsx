import React from 'react';
import { ShieldCheck, Cpu, BarChart3, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Connect Spotify',
      subtitle: 'OAuth 2.0 Secure Handshake',
      description: 'Single-click authentication using Spotify’s official OAuth 2.0 protocol. Zero passwords stored, completely read-only telemetry access.',
      icon: ShieldCheck,
      badge: 'SECURE AUTH',
    },
    {
      step: '02',
      title: 'Analyze Data',
      subtitle: 'Acoustic Feature Extraction',
      description: 'Real-time ETL pipeline ingests your top tracks, listening timestamps, BPM tempos, and emotional valence metrics.',
      icon: Cpu,
      badge: 'ETL PIPELINE',
    },
    {
      step: '03',
      title: 'Explore Insights',
      subtitle: 'Gemini AI & Telemetry Suite',
      description: 'Interact with dynamic charts, filterable matrices, and natural language AI summaries explaining your shifting musical taste eras.',
      icon: BarChart3,
      badge: 'AI ANALYTICS',
    },
    {
      step: '04',
      title: 'Discover Music',
      subtitle: 'Personalized Playlist Sync',
      description: 'Receive precision algorithmic track recommendations cross-referencing your sonic fingerprint, exported directly back to your Spotify account.',
      icon: Compass,
      badge: '1-CLICK EXPORT',
    },
  ];

  return (
    <section id="timeline" className="py-24 bg-[#121212] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-white/10 text-[#1DB954] text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>4-Step Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            How Spotify Intelligence Studio Works
          </h2>

          <p className="text-base text-spotify-muted">
            From raw playback history to actionable AI insights in four seamless steps.
          </p>
        </div>

        {/* 4-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1DB954]/10 via-[#1DB954]/50 to-[#1DB954]/10 -translate-y-6 -z-0"></div>

          {steps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#242424] hover:bg-[#2A2A2A] p-6 rounded-2xl border border-white/10 hover:border-[#1DB954]/40 transition-all duration-300 hover:-translate-y-2 shadow-xl z-10 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold font-mono text-[#1DB954]">
                      {item.step}
                    </span>
                    <div className="p-3 rounded-xl bg-[#181818] border border-white/10 text-[#1DB954]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold font-heading text-white">
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-mono text-[#1DB954] block mt-0.5">
                    {item.subtitle}
                  </span>

                  {/* Description */}
                  <p className="text-xs text-spotify-muted leading-relaxed mt-3">
                    {item.description}
                  </p>
                </div>

                {/* Footer Badge */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-spotify-subtle">
                    {item.badge}
                  </span>
                  {index < 3 && (
                    <ArrowRight className="w-4 h-4 text-spotify-muted hidden lg:block" />
                  )}
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
