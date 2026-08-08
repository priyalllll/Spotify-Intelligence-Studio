import React from 'react';
import { Users, Globe, ShieldCheck, Clock, Music, Library, Heart, Sparkles, Award, Flame, Gem, Rocket, Activity, CheckCircle2 } from 'lucide-react';

export const ProfileView: React.FC = () => {
  // Profile Meta Data
  const profile = {
    name: 'Priya Sharma',
    handle: '@priyalllll',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    followers: '1,240',
    following: '380',
    country: 'United States 🇺🇸',
    accountType: 'Spotify Premium',
    connectedDate: 'Jan 14, 2026',
    archetype: 'Deep Flow Synthwave Specialist',
  };

  // 6 Listening Stat Cards
  const stats = [
    { title: 'Total Listening Hours', value: '714 hrs', sub: '42,840 mins total', icon: Clock, color: 'text-[#1DB954]' },
    { title: 'Total Artists Ingested', value: '348', sub: 'unique creators', icon: Users, color: 'text-purple-400' },
    { title: 'Total Tracks Catalog', value: '1,482', sub: 'ingested tracks', icon: Music, color: 'text-[#1DB954]' },
    { title: 'Total Playlists', value: '24', sub: 'synced playlists', icon: Library, color: 'text-blue-400' },
    { title: 'Favorite Genre', value: 'Synthwave', sub: '35% of overall time', icon: Sparkles, color: 'text-amber-400' },
    { title: 'Favorite Artist', value: 'Kavinsky', sub: '412 stream counts', icon: Heart, color: 'text-pink-400' },
  ];

  // Achievements List
  const achievements = [
    { id: '1', title: 'Night Owl Listener', desc: 'Streamed 100+ hours of music past 11:00 PM', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30', unlocked: true },
    { id: '2', title: 'Focus Flow Master', desc: 'Completed 14-day consecutive focus listening streak', icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', unlocked: true },
    { id: '3', title: 'Sonic Explorer', desc: 'Ingested 300+ unique creators into telemetry workspace', icon: Gem, color: 'text-[#1DB954]', bg: 'bg-[#1DB954]/15 border-[#1DB954]/30', unlocked: true },
    { id: '4', title: 'Early Adopter', desc: 'Connected Spotify OAuth 2.0 PKCE to Intelligence Studio v1.0', icon: Rocket, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30', unlocked: true },
  ];

  // Recent Activity Feed
  const recentActivities = [
    { id: '1', action: 'Streamed "Resonance" by HOME', category: 'Listening Telemetry', time: '12 mins ago', icon: Music },
    { id: '2', action: 'Generated Gemini 2.0 Weekly Focus Summary', category: 'AI Intelligence', time: '1 hour ago', icon: Sparkles },
    { id: '3', action: 'Updated "Midnight Flow 128 BPM" Playlist', category: 'Playlist Sync', time: '2 hours ago', icon: Library },
    { id: '4', action: 'Unlocked "Focus Flow Master" Achievement Badge', category: 'Milestone', time: 'Yesterday', icon: Award },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Spotify Account & Telemetry Profile</h2>
          <p className="text-xs text-spotify-muted">Connected Spotify account overview, listening achievements, and recent activity log</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] bg-[#181818] px-3.5 py-1.5 rounded-full border border-white/5 shadow-md">
          <ShieldCheck className="w-4 h-4" />
          <span>Spotify OAuth 2.0 Connected</span>
        </div>
      </div>

      {/* 1. Spotify User Profile Hero Banner */}
      <div className="bg-gradient-to-r from-[#242424] via-[#181818] to-[#242424] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1DB954]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#1DB954] shadow-2xl" />
              <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#1DB954] text-black shadow-lg">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-2xl font-extrabold font-heading text-white">{profile.name}</h3>
                <span className="text-xs font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded border border-[#1DB954]/20 font-semibold">
                  {profile.accountType}
                </span>
              </div>

              <div className="text-xs font-mono text-spotify-muted flex items-center justify-center sm:justify-start gap-3">
                <span>{profile.handle}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  {profile.country}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>✦ Archetype: {profile.archetype}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-around md:justify-end gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 text-xs font-mono">
            <div>
              <span className="text-spotify-subtle block">Community</span>
              <span className="text-white font-bold">{profile.followers} Followers • {profile.following} Following</span>
            </div>
            <div>
              <span className="text-spotify-subtle block">Connected Since</span>
              <span className="text-[#1DB954] font-bold">{profile.connectedDate}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Six Listening Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-[#242424] hover:bg-[#2A2A2A] p-5 rounded-2xl border border-white/10 hover:border-[#1DB954]/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-spotify-muted font-semibold">{stat.title}</span>
                <div className={`p-2 rounded-xl bg-[#181818] border border-white/5 ${stat.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-extrabold font-heading text-white tracking-tight">{stat.value}</div>
                <div className="text-[11px] font-mono text-spotify-subtle mt-1">{stat.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Achievements Section with Badges */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-amber-400 border border-white/5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Telemetry Milestone Achievements</h3>
              <p className="text-[11px] text-spotify-muted">Earned badges for focus consistency & listening habits</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-1 rounded">
            4 / 4 UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${item.bg} space-y-2 flex flex-col justify-between transition-transform hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-[#181818] ${item.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-[#1DB954] text-black px-2 py-0.5 rounded">
                    UNLOCKED
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-heading text-white">{item.title}</h4>
                  <p className="text-[10px] text-spotify-muted leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Activity Stream Section */}
      <div className="bg-[#242424] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Recent Activity Stream</h3>
              <p className="text-[11px] text-spotify-muted">Real-time telemetry event logging</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
            Live Stream
          </span>
        </div>

        <div className="space-y-2.5">
          {recentActivities.map((act) => {
            const IconComp = act.icon;
            return (
              <div key={act.id} className="bg-[#181818] p-3 rounded-xl border border-white/5 flex items-center justify-between hover:border-[#1DB954]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#242424] text-[#1DB954]">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{act.action}</span>
                    <span className="text-[10px] text-spotify-muted font-mono">{act.category}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-spotify-subtle">{act.time}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
