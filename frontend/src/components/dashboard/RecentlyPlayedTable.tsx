import React from 'react';
import { History, Play } from 'lucide-react';

export const RecentlyPlayedTable: React.FC = () => {
  const tracks = [
    {
      id: '1',
      title: 'Resonance',
      artist: 'HOME',
      album: 'Odyssey',
      playedAt: '12 mins ago',
      duration: '3:32',
      popularity: 88,
      bpm: 124,
      valence: 'High Valence',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&crop=faces',
    },
    {
      id: '2',
      title: 'Midnight City',
      artist: 'M83',
      album: "Hurry Up, We're Dreaming",
      playedAt: '45 mins ago',
      duration: '4:03',
      popularity: 92,
      bpm: 128,
      valence: 'Energetic',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&h=120&fit=crop&crop=faces',
    },
    {
      id: '3',
      title: 'Tech Noir',
      artist: 'GUNSHIP',
      album: 'GUNSHIP',
      playedAt: '2 hours ago',
      duration: '4:57',
      popularity: 76,
      bpm: 118,
      valence: 'Focused',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=120&h=120&fit=crop&crop=faces',
    },
    {
      id: '4',
      title: 'Sunset',
      artist: 'The Midnight',
      album: 'Endless Summer',
      playedAt: '3 hours ago',
      duration: '5:26',
      popularity: 82,
      bpm: 126,
      valence: 'Euphoric',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop&crop=faces',
    },
    {
      id: '5',
      title: 'Nightcall',
      artist: 'Kavinsky',
      album: 'OutRun',
      playedAt: '5 hours ago',
      duration: '4:18',
      popularity: 95,
      bpm: 120,
      valence: 'Atmospheric',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&h=120&fit=crop&crop=faces',
    },
  ];

  return (
    <div className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#181818] text-[#1DB954] border border-white/5">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">Recently Played Streams</h3>
            <p className="text-[11px] text-spotify-muted">Real-time telemetry stream log</p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-spotify-subtle bg-[#181818] px-2.5 py-1 rounded border border-white/5">
          Live Sync Active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-spotify-muted border-b border-white/5 text-[10px] uppercase font-mono tracking-wider">
              <th className="pb-3 font-semibold pl-2"># Track</th>
              <th className="pb-3 font-semibold">Album</th>
              <th className="pb-3 font-semibold">Telemetry Features</th>
              <th className="pb-3 font-semibold">Popularity</th>
              <th className="pb-3 font-semibold text-right pr-2">Played / Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tracks.map((track, index) => (
              <tr
                key={track.id}
                className="group hover:bg-[#2A2A2A] transition-colors"
              >
                <td className="py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <span className="text-spotify-subtle font-mono text-[11px] w-4">{index + 1}</span>
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 group">
                      <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-4 h-4 text-[#1DB954] fill-[#1DB954]" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-[#1DB954] transition-colors">
                        {track.title}
                      </div>
                      <div className="text-[11px] text-spotify-muted">{track.artist}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3 text-spotify-muted">
                  <span className="truncate max-w-[140px] block">{track.album}</span>
                </td>

                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30">
                      {track.bpm} BPM
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30">
                      {track.valence}
                    </span>
                  </div>
                </td>

                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#181818] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1DB954] rounded-full" style={{ width: `${track.popularity}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono text-spotify-muted">{track.popularity}%</span>
                  </div>
                </td>

                <td className="py-3 text-right pr-2">
                  <div className="text-white font-mono text-[11px]">{track.playedAt}</div>
                  <div className="text-[10px] text-spotify-subtle font-mono">{track.duration}</div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
