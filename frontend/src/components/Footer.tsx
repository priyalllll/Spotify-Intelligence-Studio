import React from 'react';
import { Disc, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121212] border-t border-white/10 pt-16 pb-12 text-xs text-spotify-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center shadow-[0_0_15px_rgba(29,185,84,0.4)]">
                <Disc className="w-4 h-4 text-black animate-spin-slow" />
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Spotify Intelligence Studio
              </span>
            </div>

            <p className="text-spotify-muted max-w-sm leading-relaxed">
              Transforming raw Spotify playback streams into interactive telemetry dashboards, AI-generated taste summaries, and smart music recommendations.
            </p>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181818] border border-white/10 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></span>
              <span className="text-white font-medium">Spotify API Status:</span>
              <span className="text-[#1DB954]">100% Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-white uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Features & Capabilities</a></li>
              <li><a href="#dashboards" className="hover:text-white transition-colors">Interactive Dashboards</a></li>
              <li><a href="#timeline" className="hover:text-white transition-colors">4-Step Pipeline</a></li>
              <li><a href="#techstack" className="hover:text-white transition-colors">Developer Tech Stack</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ & Support</a></li>
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-white uppercase tracking-wider text-[11px]">Connect & Links</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/priyalllll/Spotify-Intelligence-Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#242424] border border-white/10 text-white transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current text-[#1DB954]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub Repository</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#242424] border border-white/10 text-white transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
              </a>

              <a
                href="https://portfolio.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#242424] border border-white/10 text-white transition-all hover:scale-105"
              >
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Developer Portfolio</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-spotify-subtle">
          <p>© 2026 Spotify Intelligence Studio. Built with React, TypeScript & Gemini AI.</p>
          <p className="text-[11px]">Not affiliated with or endorsed by Spotify AB.</p>
        </div>

      </div>
    </footer>
  );
};
