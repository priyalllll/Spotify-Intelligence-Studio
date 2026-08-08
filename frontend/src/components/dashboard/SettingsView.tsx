import React, { useState } from 'react';
import { Sliders, Moon, Globe, Bell, ShieldCheck, RefreshCw, LogOut, Download, FileText, Sparkles, Cpu, Info, Lock, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  // State variables for interactive controls
  const [theme, setTheme] = useState<'dark' | 'midnight' | 'cyberpunk'>('dark');
  const [language, setLanguage] = useState<string>('en-US');
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [emailDigest, setEmailDigest] = useState<boolean>(true);
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);
  const [aiModel, setAiModel] = useState<string>('gemini-2.0-flash');
  const [aiFrequency, setAiFrequency] = useState<string>('daily');
  const [weeklyReportEmail, setWeeklyReportEmail] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#1DB954] text-black font-extrabold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Workspace & Telemetry Settings</h2>
          <p className="text-xs text-spotify-muted">Configure preferences, OAuth connections, AI models, and data export options</p>
        </div>

        <button
          onClick={() => triggerToast('Settings saved successfully!')}
          className="px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* 1. General Settings Section */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
          <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">General Preferences</h3>
            <p className="text-[11px] text-spotify-muted">Appearance, language, and system notification controls</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-[#1DB954]" />
              Appearance Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
            >
              <option value="dark">Spotify Dark Theme (#121212) — Default</option>
              <option value="midnight">Spotify Midnight Black (#000000)</option>
              <option value="cyberpunk">Cyberpunk Neon Theme</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Interface Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
            >
              <option value="en-US">English (United States)</option>
              <option value="es-ES">Spanish (Español)</option>
              <option value="fr-FR">French (Français)</option>
              <option value="de-DE">German (Deutsch)</option>
            </select>
          </div>

          {/* Push Notifications Toggle */}
          <div className="bg-[#181818] p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-purple-400" />
                Push Notifications
              </span>
              <span className="text-[10px] text-spotify-muted block">Real-time listening pattern alerts</span>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`w-11 h-6 rounded-full transition-colors relative ${pushNotifications ? 'bg-[#1DB954]' : 'bg-[#242424]'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${pushNotifications ? 'right-1' : 'left-1'}`}></span>
            </button>
          </div>

          {/* Email Digest Toggle */}
          <div className="bg-[#181818] p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                Weekly Telemetry Email Digest
              </span>
              <span className="text-[10px] text-spotify-muted block">Receive weekly Wrapped style reports</span>
            </div>
            <button
              onClick={() => setEmailDigest(!emailDigest)}
              className={`w-11 h-6 rounded-full transition-colors relative ${emailDigest ? 'bg-[#1DB954]' : 'bg-[#242424]'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${emailDigest ? 'right-1' : 'left-1'}`}></span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Spotify Connection Section */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Spotify Integration & OAuth Status</h3>
              <p className="text-[11px] text-spotify-muted">Manage Spotify API connection & permissions</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-[#1DB954]/15 text-[#1DB954] px-2.5 py-1 rounded border border-[#1DB954]/30 font-bold">
            CONNECTED AS @PRIYALLLLL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <div className="space-y-3">
            <p className="text-xs text-spotify-muted leading-relaxed">
              Your workspace is securely connected via Spotify OAuth 2.0 PKCE. We only read your listening history and playlist metadata.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => triggerToast('Re-initiating Spotify OAuth PKCE Handshake...')}
                className="px-4 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 transition-transform hover:scale-105"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reconnect Spotify</span>
              </button>

              <button
                onClick={() => triggerToast('Spotify account disconnected.')}
                className="px-4 py-2.5 rounded-full bg-[#181818] hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-xs flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>

          {/* Granted Permissions List */}
          <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-white block">Granted OAuth Scopes:</span>
            <div className="space-y-1 font-mono text-[11px] text-spotify-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>user-read-recently-played</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>user-top-read</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>playlist-read-private</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Reports & Data Export Section */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
          <div className="p-2 rounded-lg bg-[#181818] text-purple-400 border border-white/5">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">Reports & Telemetry Data Export</h3>
            <p className="text-[11px] text-spotify-muted">Export raw listening logs or generated PDF summaries</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-3">
            <span className="text-xs font-semibold text-white block">Export Actions:</span>
            <div className="flex gap-3">
              <button
                onClick={() => triggerToast('Exporting Telemetry Data as CSV...')}
                className="px-4 py-2.5 rounded-full bg-[#181818] hover:bg-[#2A2A2A] text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => triggerToast('Generating Executive PDF Report...')}
                className="px-4 py-2.5 rounded-full bg-[#181818] hover:bg-[#2A2A2A] text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-[#181818] p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white">Automated Weekly Email Report</span>
              <span className="text-[10px] text-spotify-muted block">Send executive PDF to primary email every Monday</span>
            </div>
            <button
              onClick={() => setWeeklyReportEmail(!weeklyReportEmail)}
              className={`w-11 h-6 rounded-full transition-colors relative ${weeklyReportEmail ? 'bg-[#1DB954]' : 'bg-[#242424]'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${weeklyReportEmail ? 'right-1' : 'left-1'}`}></span>
            </button>
          </div>

        </div>
      </div>

      {/* 4. AI Preferences Section */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-purple-400 border border-white/5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Gemini AI Model Preferences</h3>
              <p className="text-[11px] text-spotify-muted">Configure natural language intelligence synthesis</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
            GEMINI 2.0 ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Toggle AI */}
          <div className="bg-[#181818] p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white">Enable AI Insights</span>
              <span className="text-[10px] text-spotify-muted block">Synthesize listening habits</span>
            </div>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${aiEnabled ? 'bg-[#1DB954]' : 'bg-[#242424]'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${aiEnabled ? 'right-1' : 'left-1'}`}></span>
            </button>
          </div>

          {/* Preferred AI Model */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Preferred AI Model
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="local-llama">Local Llama 3 (Self-hosted)</option>
            </select>
          </div>

          {/* Insight Frequency */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#1DB954]" />
              Synthesis Frequency
            </label>
            <select
              value={aiFrequency}
              onChange={(e) => setAiFrequency(e.target.value)}
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
            >
              <option value="daily">Real-time Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
              <option value="monthly">Monthly Retrospective</option>
            </select>
          </div>

        </div>
      </div>

      {/* 5. About & Legal Section */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
          <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">About Spotify Intelligence Studio</h3>
            <p className="text-[11px] text-spotify-muted">Architecture version & legal compliance</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-spotify-muted pt-1">
          <div>
            <span className="text-white font-bold block">Spotify Intelligence Studio v1.4.2 Enterprise</span>
            <span>Built by Google DeepMind Agentic Suite • React, TypeScript, Tailwind v4</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-white">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#1DB954] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
            <a href="#privacy" className="flex items-center gap-1 hover:text-[#1DB954] transition-colors">
              <Lock className="w-4 h-4" />
              <span>Privacy Policy</span>
            </a>
            <a href="#terms" className="flex items-center gap-1 hover:text-[#1DB954] transition-colors">
              <span>Terms of Service</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
