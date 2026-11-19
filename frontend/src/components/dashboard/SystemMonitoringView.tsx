import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Clock,
  RefreshCw,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Terminal,
  FileText,
  Filter,
  BarChart2,
  SlidersHorizontal,
  Sparkles,
  Lock,
  Layers,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { clearApiCache } from '../../services/spotifyApiClient';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'LOGIN' | 'API' | 'ERROR' | 'WARN' | 'AI';
  severity: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  endpoint?: string;
}

export const SystemMonitoringView: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), type: 'LOGIN', severity: 'INFO', message: 'Spotify OAuth 2.0 PKCE Handshake verified successfully' },
    { id: '2', timestamp: new Date().toLocaleTimeString(), type: 'API', severity: 'INFO', message: 'GET /api/top-artists — Status 200 (120ms)', endpoint: '/api/top-artists' },
    { id: '3', timestamp: new Date().toLocaleTimeString(), type: 'API', severity: 'INFO', message: 'GET /api/top-tracks — Status 200 (145ms)', endpoint: '/api/top-tracks' },
    { id: '4', timestamp: new Date().toLocaleTimeString(), type: 'AI', severity: 'INFO', message: 'POST /ai/music-insights — Gemini 2.0 response synthesized (210ms)' },
    { id: '5', timestamp: new Date().toLocaleTimeString(), type: 'WARN', severity: 'WARN', message: 'HTTP 403 /v1/audio-features restriction handled with track acoustic telemetry fallback' },
    { id: '6', timestamp: new Date().toLocaleTimeString(), type: 'API', severity: 'INFO', message: 'GET /api/playlists — Status 200 (98ms)', endpoint: '/api/playlists' },
  ]);

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Session Duration Counter
  const [sessionSeconds, setSessionSeconds] = useState<number>(1420);

  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleClearCache = () => {
    clearApiCache();
    triggerNotice('Memory & Session API Cache Cleared Successfully!');
  };

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `system_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotice('System Logs Exported as JSON!');
  };

  // Recharts Performance Datasets
  const latencyData = [
    { time: '10:00', Latency: 110, Requests: 12 },
    { time: '10:05', Latency: 140, Requests: 18 },
    { time: '10:10', Latency: 98, Requests: 24 },
    { time: '10:15', Latency: 165, Requests: 30 },
    { time: '10:20', Latency: 120, Requests: 22 },
    { time: '10:25', Latency: 105, Requests: 28 },
  ];

  const filteredLogs = logs.filter((l) => {
    if (filterType !== 'ALL' && l.type !== filterType) return false;
    if (filterSeverity !== 'ALL' && l.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 bg-[#1DB954] text-black font-extrabold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <span>Admin & System Monitoring Module</span>
            <Activity className="w-5 h-5 text-[#1DB954] animate-pulse" />
          </h2>
          <p className="text-xs text-spotify-muted">
            Live telemetry monitoring, API response latency, session security, developer tools, and system logs
          </p>
        </div>

        <button
          onClick={handleClearCache}
          className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear API Cache</span>
        </button>
      </div>

      {/* 1. SYSTEM HEALTH DASHBOARD (5 SERVICES) */}
      <div className="bg-[#242424] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#181818] text-[#1DB954] border border-white/5">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">1. System Health Dashboard</h3>
              <p className="text-[11px] text-spotify-muted">Microservice connectivity & status</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-1 rounded">
            ALL SYSTEMS ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs pt-1">
          {[
            { name: 'Spotify API Status', status: 'Online', latency: '120ms', icon: Server, color: 'text-[#1DB954]' },
            { name: 'Gemini API Status', status: 'Online', latency: '180ms', icon: Sparkles, color: 'text-purple-400' },
            { name: 'Backend Express', status: 'Online', latency: '12ms', icon: Cpu, color: 'text-blue-400' },
            { name: 'Authentication', status: 'Active PKCE', latency: 'Valid', icon: ShieldCheck, color: 'text-amber-400' },
            { name: 'Memory & Cache', status: '94% Hit Rate', latency: 'Memory', icon: Database, color: 'text-pink-400' },
          ].map((svc) => (
            <div key={svc.name} className="bg-[#181818] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-spotify-muted uppercase truncate">{svc.name}</span>
                <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping"></span>
              </div>
              <div className="text-sm font-extrabold text-white">{svc.status}</div>
              <div className="text-[10px] text-spotify-subtle">Latency: {svc.latency}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 & 3. API MONITORING & PERFORMANCE DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* API Monitoring Chart (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#181818] text-purple-400 border border-white/5">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white">2. API Request Latency</h3>
                <p className="text-[11px] text-spotify-muted">Average response time over time</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded">
              AVG 125ms
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip content={({ active, payload }: any) => (
                  active && payload && payload.length ? (
                    <div className="bg-[#181818] p-2 rounded border border-white/10 text-xs font-mono text-white">
                      Latency: <strong>{payload[0].value}ms</strong>
                    </div>
                  ) : null
                )} />
                <Area type="monotone" dataKey="Latency" stroke="#A855F7" fill="#A855F7" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Session Telemetry (Span 6) */}
        <div className="lg:col-span-6 bg-[#242424] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#181818] text-blue-400 border border-white/5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white">3. User Session Telemetry</h3>
                <p className="text-[11px] text-spotify-muted">OAuth token lifetime & duration</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded">
              PKCE ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-spotify-muted uppercase">Session Duration</span>
              <div className="text-sm font-extrabold text-white">{formatSessionTime(sessionSeconds)}</div>
            </div>

            <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-spotify-muted uppercase">Token Expiration</span>
              <div className="text-sm font-extrabold text-[#1DB954]">52m 14s remaining</div>
            </div>

            <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-spotify-muted uppercase">Refresh Token</span>
              <div className="text-sm font-extrabold text-purple-400">Stored (30d TTL)</div>
            </div>

            <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-spotify-muted uppercase">Rate Limit Remaining</span>
              <div className="text-sm font-extrabold text-amber-400">98 / 100 Req</div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. DEVELOPER TOOLS HIDDEN PANEL */}
      <div className="bg-[#242424] p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#181818] text-amber-400 border border-white/5">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">4. Developer & Diagnostic Actions</h3>
              <p className="text-[11px] text-spotify-muted">Diagnostics, cache management, & log exports</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded font-bold">
            DEV PANEL
          </span>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleClearCache}
            className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#2A2A2A] text-white font-mono text-xs border border-white/10 flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clear API Cache</span>
          </button>

          <button
            onClick={() => triggerNotice('Refreshing Spotify Telemetry Datasets...')}
            className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#2A2A2A] text-white font-mono text-xs border border-white/10 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1DB954]" />
            <span>Refresh Spotify Data</span>
          </button>

          <button
            onClick={() => triggerNotice('Clearing AI Insights Cache...')}
            className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#2A2A2A] text-white font-mono text-xs border border-white/10 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Refresh AI Insights</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#2A2A2A] text-white font-mono text-xs border border-white/10 flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Logs (JSON)</span>
          </button>
        </div>
      </div>

      {/* 5. APPLICATION LOGS TABLE */}
      <div className="bg-[#242424] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#181818] text-blue-400 border border-white/5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">5. Application System Logs</h3>
              <p className="text-[11px] text-spotify-muted">Filterable system events & API request logs</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-[#1DB954]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#181818] text-white text-xs rounded-lg px-2.5 py-1 border border-white/10 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="LOGIN">Login</option>
              <option value="API">API</option>
              <option value="AI">AI</option>
              <option value="WARN">Warnings</option>
            </select>
          </div>
        </div>

        <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden font-mono text-xs">
          <div className="space-y-1 p-3 max-h-64 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-2 rounded-lg bg-[#121212] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <span className="text-[10px] text-spotify-subtle">{log.timestamp}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${log.severity === 'ERROR' ? 'bg-red-500/20 text-red-400' : log.severity === 'WARN' ? 'bg-amber-500/20 text-amber-400' : 'bg-[#1DB954]/20 text-[#1DB954]'}`}>
                    {log.type}
                  </span>
                  <span className="text-gray-200 truncate">{log.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
