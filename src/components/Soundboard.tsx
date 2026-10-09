import React from 'react';
import { Volume2, Play, Music, Sparkles } from 'lucide-react';
import { sounds } from '../lib/soundEffects';

export const Soundboard: React.FC = () => {
  const soundTracks = [
    { name: 'Logo Bro Laugh', desc: 'Signature cheerful chuckle', action: () => sounds.playLaugh(), color: 'border-pink-500/40 hover:bg-pink-500/10' },
    { name: 'Rainbow Pop', desc: 'Bubble jump click', action: () => sounds.playPop(), color: 'border-cyan-500/40 hover:bg-cyan-500/10' },
    { name: 'Firewall Zap', desc: 'Laser blast wave', action: () => sounds.playLaser(), color: 'border-yellow-500/40 hover:bg-yellow-500/10' },
    { name: 'Arcade Chomp', desc: 'Crunchy snack eat', action: () => sounds.playChomp(), color: 'border-emerald-500/40 hover:bg-emerald-500/10' },
    { name: 'Glitch Warning', desc: 'Hacker virus alarm', action: () => sounds.playGlitch(), color: 'border-red-500/40 hover:bg-red-500/10' },
    { name: 'Victory Fanfare', desc: 'Stage clear celebration', action: () => sounds.playVictory(), color: 'border-purple-500/40 hover:bg-purple-500/10' },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-yellow-400" />
            Logo Bro Soundboard & SFX
          </h3>
          <p className="text-xs text-zinc-400">Play real synthesized 8-bit sound effects</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
          <Music className="w-4 h-4 text-pink-400" />
          <span>Web Audio Synth</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-5">
        {soundTracks.map((item, idx) => (
          <button
            key={idx}
            onClick={() => item.action()}
            className={`p-4 rounded-xl border text-left bg-zinc-950/60 transition-all active:scale-95 cursor-pointer flex flex-col justify-between group ${item.color}`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-mono text-zinc-500">#0{idx + 1}</span>
              <Play className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-200 group-hover:text-white font-display">
                {item.name}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
