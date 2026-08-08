import React from 'react';
import { Cpu, Code2, Database, Shield, Zap, Layers, Server, Cloud } from 'lucide-react';

export const TechStack: React.FC = () => {
  const technologies = [
    { name: 'React 18', role: 'Frontend UI Framework', category: 'Frontend', icon: Code2, highlight: 'Component Architecture' },
    { name: 'TypeScript', role: 'Type Safety Layer', category: 'Frontend', icon: Shield, highlight: 'Strict Telemetry Schemas' },
    { name: 'Tailwind CSS', role: 'Design System Tokens', category: 'Frontend', icon: Layers, highlight: 'Vercel / Linear Aesthetic' },
    { name: 'Node.js & Express', role: 'Telemetry API Backend', category: 'Backend', icon: Server, highlight: 'Asynchronous Ingestion' },
    { name: 'PostgreSQL & Prisma', role: 'Relational Database', category: 'Database', icon: Database, highlight: 'High-Throughput Analytics' },
    { name: 'Spotify Web API', role: 'Official Music Telemetry', category: 'API Provider', icon: Zap, highlight: 'OAuth 2.0 Auth Protocol' },
    { name: 'Gemini 2.0 AI', role: 'LLM Taste Summaries', category: 'AI Intelligence', icon: Cpu, highlight: 'Natural Language Eras' },
    { name: 'Vercel & Render', role: 'Cloud Infrastructure', category: 'Deployment', icon: Cloud, highlight: 'Edge Telemetry CDN' },
  ];

  return (
    <section id="techstack" className="py-24 bg-[#181818] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242424] border border-white/10 text-[#1DB954] text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Production Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Built With Modern Developer Technologies
          </h2>

          <p className="text-base text-spotify-muted">
            Engineered using industry-standard tools to deliver real-time telemetry processing, type safety, and sub-100ms response times.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {technologies.map((tech) => {
            const IconComponent = tech.icon;
            return (
              <div
                key={tech.name}
                className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-xl border border-white/10 hover:border-[#1DB954]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 text-spotify-muted">
                      {tech.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-heading">{tech.name}</h3>
                    <p className="text-xs text-spotify-muted mt-0.5">{tech.role}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-[#1DB954]">
                  ✦ {tech.highlight}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
