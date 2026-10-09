import React, { useState, useEffect, useRef } from 'react';
import { Shield, Trophy, RefreshCw, Zap, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogobroAvatar } from './LogobroAvatar';
import { sounds } from '../lib/soundEffects';

interface GlitchBug {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  size: number;
  hp: number;
  label: string;
}

export const ArcadeGame: React.FC = () => {
  const { userProfile, saveHighScore } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);

  const bugsRef = useRef<GlitchBug[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const nextBugIdRef = useRef<number>(1);

  const activeTheme = userProfile?.selectedTheme || 'rainbow';

  const startGame = () => {
    setScore(0);
    setHealth(3);
    setCombo(0);
    setGameOver(false);
    bugsRef.current = [];
    setIsPlaying(true);
    sounds.playVictory();
  };

  const handleBugClick = (bugId: number) => {
    sounds.playLaser();
    bugsRef.current = bugsRef.current.filter((b) => b.id !== bugId);
    setCombo((c) => c + 1);
    setScore((prev) => {
      const added = 100 + combo * 20;
      return prev + added;
    });
  };

  useEffect(() => {
    if (!isPlaying) return;

    let mounted = true;

    const gameLoop = (timestamp: number) => {
      if (!mounted) return;

      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Center is Logobro's position
      const centerX = width / 2;
      const centerY = height / 2;

      // Spawn bugs towards center
      if (timestamp - lastSpawnRef.current > Math.max(600, 1500 - score * 0.8)) {
        lastSpawnRef.current = timestamp;

        // Random edge angle
        const angle = Math.random() * Math.PI * 2;
        const spawnDist = Math.max(width, height) / 2 + 30;
        const startX = centerX + Math.cos(angle) * spawnDist;
        const startY = centerY + Math.sin(angle) * spawnDist;

        // Vector pointing to center
        const dx = centerX - startX;
        const dy = centerY - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 1.6 + Math.min(3.5, score / 2000);

        const labels = ['BUG.exe', 'HACK_01', 'GLITCH', 'VIRUS', 'NULL_PTR'];

        bugsRef.current.push({
          id: nextBugIdRef.current++,
          x: startX,
          y: startY,
          vx: (dx / dist) * speed,
          vy: (dy / dist) * speed,
          speed,
          size: 34,
          hp: 1,
          label: labels[Math.floor(Math.random() * labels.length)],
        });
      }

      // Update positions
      const remainingBugs: GlitchBug[] = [];
      for (const bug of bugsRef.current) {
        bug.x += bug.vx;
        bug.y += bug.vy;

        // Check collision with central Logobro (radius ~ 55)
        const distToCenter = Math.hypot(bug.x - centerX, bug.y - centerY);
        if (distToCenter < 55) {
          // Hit Logo Bro!
          sounds.playGlitch();
          setHealth((h) => {
            const nextH = h - 1;
            if (nextH <= 0) {
              setGameOver(true);
              setIsPlaying(false);
              saveHighScore(score);
            }
            return nextH;
          });
          setCombo(0);
        } else {
          remainingBugs.push(bug);
        }
      }
      bugsRef.current = remainingBugs;

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      mounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, score, combo, saveHighScore]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Don't Hack Logobro! <span className="text-xs text-zinc-400 font-mono">20236 Firewall</span>
          </h3>
          <p className="text-xs text-zinc-400">Click & zap incoming glitch viruses before they reach Logobro!</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[11px] text-zinc-400 block font-mono">SCORE</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{score}</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heartIdx) => (
              <Heart
                key={heartIdx}
                className={`w-5 h-5 ${
                  heartIdx <= health ? 'text-pink-500 fill-pink-500' : 'text-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Game Stage Area */}
      <div
        ref={containerRef}
        className="relative w-full h-80 sm:h-96 my-4 bg-zinc-950/80 rounded-xl border border-zinc-800/80 overflow-hidden select-none flex items-center justify-center cursor-crosshair"
      >
        {/* Radar concentric circles */}
        <div className="absolute w-48 h-48 border border-zinc-800/40 rounded-full pointer-events-none" />
        <div className="absolute w-72 h-72 border border-zinc-800/20 rounded-full pointer-events-none" />

        {/* Center Logobro */}
        <div className="relative z-10 pointer-events-none">
          <LogobroAvatar
            size={100}
            themeId={activeTheme}
            mood={health <= 1 ? 'shocked' : isPlaying ? 'wink' : 'happy'}
            accessory="hacker"
            className="animate-pulse"
          />
        </div>

        {/* Dynamic Bugs */}
        {isPlaying &&
          bugsRef.current.map((bug) => (
            <button
              key={bug.id}
              onClick={() => handleBugClick(bug.id)}
              style={{
                left: bug.x - 24,
                top: bug.y - 24,
              }}
              className="absolute z-20 w-12 h-12 bg-red-600/90 hover:bg-red-500 text-white font-mono text-[9px] font-bold rounded-lg border-2 border-red-400 shadow-lg shadow-red-500/30 flex flex-col items-center justify-center transform active:scale-90 transition-transform cursor-pointer"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>{bug.label}</span>
            </button>
          ))}

        {/* Overlay when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {gameOver ? (
              <>
                <h4 className="text-2xl font-bold font-display text-red-400 mb-1">FIREWALL BREACHED!</h4>
                <p className="text-sm text-zinc-300 mb-4">
                  Logobro was overloaded by glitches. Final score: <strong className="text-cyan-400 font-mono">{score}</strong>
                </p>
                <button
                  onClick={startGame}
                  className="py-2.5 px-6 rounded-xl font-bold text-zinc-950 rainbow-gradient hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer font-display"
                >
                  <RefreshCw className="w-4 h-4" />
                  Play Again
                </button>
              </>
            ) : (
              <>
                <Trophy className="w-12 h-12 text-yellow-400 mb-3 animate-bounce" />
                <h4 className="text-2xl font-bold font-display text-white mb-1">Defense Arcade</h4>
                <p className="text-sm text-zinc-400 max-w-sm mb-5">
                  Protect Logo Bro from getting hacked! Tap viruses as they approach to charge your high score.
                </p>
                <button
                  onClick={startGame}
                  className="py-3 px-8 rounded-xl font-bold text-zinc-950 rainbow-gradient hover:opacity-90 shadow-lg text-base transition-all flex items-center gap-2 cursor-pointer font-display"
                >
                  <Zap className="w-5 h-5" />
                  Start Defense Run
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between text-xs text-zinc-400">
        <div>High Score: <span className="font-mono text-white font-semibold">{userProfile?.highScore || 0}</span></div>
        <div>Combo Multiplier: <span className="font-mono text-cyan-400">+{combo * 20} pts</span></div>
      </div>
    </div>
  );
};
