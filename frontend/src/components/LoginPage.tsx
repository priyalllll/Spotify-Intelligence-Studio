import React, { useState } from 'react';
import { Disc, Sparkles, ShieldCheck, Lock, Activity, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSpotifyAuth = () => {
    setIsAuthenticating(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#1DB954', '#1ED760', '#FFFFFF', '#A855F7'],
    });

    // Redirect to Express backend
    window.location.href = "http://localhost:5000/auth/login";
  };



  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between selection:bg-[#1DB954] selection:text-black relative overflow-hidden">

      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#1DB954]/15 rounded-full blur-[150px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-0"></div>

      {/* Top Header Bar */}
      <header className="px-6 py-5 flex items-center justify-between relative z-10">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#181818] hover:bg-[#242424] border border-white/10 text-xs font-semibold text-spotify-muted hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-spotify-subtle">
          <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping"></span>
          <span>Spotify OAuth 2.0 Service Active</span>
        </div>
      </header>

      {/* Split-Screen Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Panel: Branding & Telemetry Showcase */}
          <div className="lg:col-span-6 space-y-8 text-left">

            {/* Logo Mark */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-[0_0_20px_rgba(29,185,84,0.5)]">
                <Disc className="w-6 h-6 text-black animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                  Spotify Intelligence
                </span>
                <span className="text-xs font-mono text-[#1DB954] font-semibold uppercase tracking-widest">
                  Studio Workspace
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#1DB954]/30 text-[#1DB954] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>AI-Powered Telemetry Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Know Your Music <br />
                <span className="bg-gradient-to-r from-white via-gray-100 to-[#1DB954] bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>

              <p className="text-base text-spotify-muted max-w-lg leading-relaxed">
                Connect your Spotify account to unlock enterprise-grade listening telemetry, Gemini AI habit summaries, and custom audio feature scatter plots.
              </p>
            </div>

            {/* Floating Telemetry Showcase Cards */}
            <div className="space-y-3 pt-2">

              <div className="bg-[#181818]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-start gap-3 shadow-xl hover:border-[#1DB954]/40 transition-colors">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Gemini 2.0 Focus Summary</span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 font-mono px-1.5 py-0.2 rounded">AI Model</span>
                  </div>
                  <p className="text-spotify-muted text-[11px]">
                    "Your peak productivity flow occurs at 11:00 PM with 120–130 BPM Synthwave."
                  </p>
                </div>
              </div>

              <div className="bg-[#181818]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between shadow-xl hover:border-[#1DB954]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#1DB954]/20 text-[#1DB954]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">42,850 Listening Minutes</div>
                    <div className="text-[10px] text-spotify-muted">Top 1% Synthwave Listener Nationwide</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded border border-[#1DB954]/20">
                  84% Valence
                </span>
              </div>

            </div>

          </div>

          {/* Right Panel: Centered Glassmorphic Login Card */}
          <div className="lg:col-span-6 flex justify-center">

            <div className="relative w-full max-w-md">

              {/* Outer Card Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#1DB954]/30 to-purple-600/30 blur-xl opacity-60"></div>

              {/* Login Card Container */}
              <div className="relative bg-[#181818] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">

                {/* Header */}
                <div className="text-center space-y-3">

                  {/* Spotify Green Logo Icon */}
                  <div className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(29,185,84,0.4)]">
                    <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
                      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C13.56 8.4 7.56 8.16 4.14 9.18c-.6.18-1.26-.18-1.44-.78-.18-.6.18-1.26.78-1.44C7.38 5.76 14.04 6 18.48 8.64c.54.3.72 1.02.42 1.56-.24.48-.96.72-1.5.42z" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold font-heading text-white">
                    Welcome to Spotify Intelligence Studio
                  </h2>

                  <p className="text-xs text-spotify-muted leading-relaxed">
                    Connect your Spotify account to inspect interactive telemetry, genre spectrums, and AI taste summaries.
                  </p>
                </div>

                {/* Primary CTA: Continue with Spotify */}
                <div className="space-y-3">
                  <button
                    onClick={handleSpotifyAuth}
                    disabled={isAuthenticating}
                    className="w-full py-4 px-6 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-sm tracking-wide shadow-[0_8px_30px_rgba(29,185,84,0.4)] hover:shadow-[0_10px_35px_rgba(30,215,96,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-80"
                  >
                    {isAuthenticating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Authenticating PKCE Handshake...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
                          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C13.56 8.4 7.56 8.16 4.14 9.18c-.6.18-1.26-.18-1.44-.78-.18-.6.18-1.26.78-1.44C7.38 5.76 14.04 6 18.48 8.64c.54.3.72 1.02.42 1.56-.24.48-.96.72-1.5.42z" />
                        </svg>
                        <span>Continue with Spotify</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onLoginSuccess}
                    className="w-full py-3 px-6 rounded-full bg-[#242424] hover:bg-[#2A2A2A] text-white border border-white/10 hover:border-white/20 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Try Demo Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" />
                  </button>
                </div>

                {/* OAuth Security Info Pill */}
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-spotify-muted bg-[#242424] p-2.5 rounded-xl border border-white/5">
                  <Lock className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>Spotify OAuth 2.0 PKCE Handshake</span>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="p-3.5 rounded-xl bg-[#121212]/80 border border-white/5 space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-[#1DB954]" />
                    <span>Privacy Assurance</span>
                  </div>
                  <p className="text-[11px] text-spotify-subtle leading-relaxed">
                    We only request read-only access to your listening history. Your password is never stored or accessed.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Clean Footer */}
      <footer className="px-6 py-4 border-t border-white/5 text-center text-xs text-spotify-subtle relative z-10">
        © 2026 Spotify Intelligence Studio. Powered by Spotify Web API & Gemini 2.0. Not affiliated with Spotify AB.
      </footer>

    </div>
  );
};
