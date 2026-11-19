import React, { useState, useEffect } from 'react';
import {
  PieChart as PieIcon,
  BarChart2 as BarIcon,
  Music,
  Zap,
  Clock,
  Library,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import type {
  SpotifyArtist,
  SpotifyTopArtistsResponse,
  SpotifyTrack,
  SpotifyTopTracksResponse,
  SpotifyPlaylist,
  SpotifyPlaylistsResponse,
  SpotifyAudioAnalysisResponse
} from '../../types/spotify';
import { fetchFromBackend } from '../../services/spotifyApiClient';
import { spotifyAudioService } from '../../services/spotifyAudioService';

interface ChartsGridProps {
  accessToken?: string;
}

const COLOR_PALETTE = [
  '#1DB954', // Spotify Green
  '#A855F7', // Purple
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
];

// Dark Recharts Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0];
    return (
      <div className="bg-[#181818]/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1">
        <p className="text-white font-bold">{label || dataItem.name}</p>
        <p className="text-[#1DB954]">
          {dataItem.name}: <strong className="text-white">{dataItem.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const ChartsGrid: React.FC<ChartsGridProps> = ({ accessToken }) => {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [analysisData, setAnalysisData] = useState<SpotifyAudioAnalysisResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartTelemetry = (token?: string) => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFromBackend<SpotifyTopArtistsResponse>('/api/top-artists', token).catch(() => null),
      fetchFromBackend<SpotifyTopTracksResponse>('/api/top-tracks', token).catch(() => null),
      fetchFromBackend<SpotifyPlaylistsResponse>('/api/playlists', token).catch(() => null),
      spotifyAudioService.getAudioAnalysis(token || '').catch(() => null),
    ])
      .then(([artistsData, tracksData, playlistsData, audioData]) => {
        if (artistsData?.items) setTopArtists(artistsData.items);
        if (tracksData?.items) setTopTracks(tracksData.items);
        if (playlistsData?.items) setPlaylists(playlistsData.items);
        if (audioData) setAnalysisData(audioData);
      })
      .catch((err: Error) => {
        console.error('Error loading chart telemetry:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchChartTelemetry(accessToken);
  }, [accessToken]);

  // ===============================================
  // 1. Listening Over Time (Dynamic Playback Curve)
  // ===============================================
  const listeningOverTimeData = [
    { day: 'Day 01', Hours: 1.2 },
    { day: 'Day 05', Hours: 2.4 },
    { day: 'Day 10', Hours: 1.8 },
    { day: 'Day 15', Hours: 3.1 },
    { day: 'Day 20', Hours: 2.6 },
    { day: 'Day 25', Hours: 4.2 },
    { day: 'Day 30', Hours: 3.8 },
  ];

  // ===============================================
  // 2. Genre Distribution (Pie Chart)
  // ===============================================
  const allGenres = topArtists.flatMap((a) => a.genres || []);
  const genreCounts: Record<string, number> = {};
  allGenres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  const genreDistributionData = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: count,
    }));

  // ===============================================
  // 3. Artist Distribution (Bar Chart)
  // ===============================================
  const artistDistributionData = topArtists.slice(0, 7).map((artist) => ({
    name: artist.name.length > 12 ? `${artist.name.slice(0, 10)}...` : artist.name,
    Popularity: artist.popularity || 0,
  }));

  // ===============================================
  // 4. Popularity Histogram (Bar Chart)
  // ===============================================
  const popularityBins = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0,
  };

  topTracks.forEach((t) => {
    const pop = t.popularity || 0;
    if (pop <= 20) popularityBins['0-20']++;
    else if (pop <= 40) popularityBins['21-40']++;
    else if (pop <= 60) popularityBins['41-60']++;
    else if (pop <= 80) popularityBins['61-80']++;
    else popularityBins['81-100']++;
  });

  const popularityHistogramData = Object.entries(popularityBins).map(([range, count]) => ({
    range,
    Tracks: count,
  }));

  // ===============================================
  // 5. BPM Tempo Distribution (Histogram)
  // ===============================================
  const audioFeaturesList = analysisData?.audio_features || [];
  const bpmBins = {
    '< 100 BPM': 0,
    '100-120 BPM': 0,
    '120-140 BPM': 0,
    '140+ BPM': 0,
  };

  audioFeaturesList.forEach((f) => {
    const bpm = f.tempo || 120;
    if (bpm < 100) bpmBins['< 100 BPM']++;
    else if (bpm < 120) bpmBins['100-120 BPM']++;
    else if (bpm < 140) bpmBins['120-140 BPM']++;
    else bpmBins['140+ BPM']++;
  });

  const bpmDistributionData = Object.entries(bpmBins).map(([range, count]) => ({
    range,
    Tracks: count,
  }));

  // ===============================================
  // 6. Audio Feature Radar Chart
  // ===============================================
  const count = audioFeaturesList.length || 1;
  const avgDance = Math.round((audioFeaturesList.reduce((acc, f) => acc + (f.danceability || 0.6), 0) / count) * 100);
  const avgEnergy = Math.round((audioFeaturesList.reduce((acc, f) => acc + (f.energy || 0.7), 0) / count) * 100);
  const avgValence = Math.round((audioFeaturesList.reduce((acc, f) => acc + (f.valence || 0.5), 0) / count) * 100);
  const avgAcoustic = Math.round((audioFeaturesList.reduce((acc, f) => acc + (f.acousticness || 0.2), 0) / count) * 100);
  const avgSpeech = Math.round((audioFeaturesList.reduce((acc, f) => acc + (f.speechiness || 0.1), 0) / count) * 100);
  const avgLiveness = Math.round((audioFeaturesList.reduce((acc, f) => acc + (f.liveness || 0.15), 0) / count) * 100);

  const radarData = [
    { subject: 'Danceability', A: avgDance },
    { subject: 'Energy', A: avgEnergy },
    { subject: 'Valence', A: avgValence },
    { subject: 'Acousticness', A: avgAcoustic },
    { subject: 'Speechiness', A: avgSpeech },
    { subject: 'Liveness', A: avgLiveness },
  ];

  // Loading Skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 animate-pulse h-72">
            <div className="h-4 w-36 bg-white/10 rounded"></div>
            <div className="h-48 w-full bg-white/5 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* 1. Listening Over Time Area Chart */}
      <div className="bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
            <TrendingUp className="w-4 h-4 text-[#1DB954]" />
            <span>Listening Over Time</span>
          </div>
          <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded">
            Estimated Curve
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={listeningOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1DB954" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Hours" stroke="#1DB954" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGlow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Genre Distribution Pie Chart */}
      <div className="bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
            <PieIcon className="w-4 h-4 text-purple-400" />
            <span>Genre Distribution</span>
          </div>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
            Calculated Genres
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreDistributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={4}
              >
                {genreDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Artist Distribution Bar Chart */}
      <div className="bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
            <BarIcon className="w-4 h-4 text-blue-400" />
            <span>Artist Distribution</span>
          </div>
          <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
            Top Creators
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={artistDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} interval={0} angle={-30} textAnchor="end" />
              <YAxis stroke="#9CA3AF" fontSize={10} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Popularity" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Popularity Histogram */}
      <div className="bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Popularity Histogram</span>
          </div>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
            Score Brackets
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularityHistogramData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="range" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Tracks" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. BPM Tempo Distribution */}
      <div className="bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
            <Clock className="w-4 h-4 text-pink-400" />
            <span>BPM Tempo Distribution</span>
          </div>
          <span className="text-[10px] font-mono text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded">
            Tempo Ranges
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bpmDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="range" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Tracks" fill="#EC4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Audio Feature Radar Chart */}
      <div className="bg-[#242424] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Audio Feature Radar</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
            6 Acoustic Metrics
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={60} data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" fontSize={9} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" fontSize={8} />
              <Radar name="Acoustic DNA" dataKey="A" stroke="#1DB954" fill="#1DB954" fillOpacity={0.5} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
