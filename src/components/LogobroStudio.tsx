import React, { useState, useRef } from 'react';
import { Download, Save, Check, Palette, Smile, Sparkles, RefreshCcw } from 'lucide-react';
import { LogobroAvatar, LOGOBRO_THEMES } from './LogobroAvatar';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../lib/soundEffects';

export const LogobroStudio: React.FC = () => {
  const { userProfile, updateTheme } = useAuth();
  const [selectedThemeId, setSelectedThemeId] = useState(userProfile?.selectedTheme || 'rainbow');
  const [customColors, setCustomColors] = useState<string[]>([
    '#ff7875',
    '#6fe4f8',
    '#fff066',
    '#67e76d',
    '#f578e8',
  ]);
  const [useCustomPalette, setUseCustomPalette] = useState(false);
  const [mood, setMood] = useState<'happy' | 'laughing' | 'typing' | 'peeking' | 'wink' | 'cool' | 'shocked' | 'sleepy'>('happy');
  const [accessory, setAccessory] = useState<'none' | 'sunglasses' | 'party' | 'crown' | 'headphones' | 'hacker'>('none');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleColorChange = (idx: number, hex: string) => {
    setUseCustomPalette(true);
    const updated = [...customColors];
    updated[idx] = hex;
    setCustomColors(updated);
    sounds.playPop();
  };

  const handleApplyPreset = (themeKey: string) => {
    setSelectedThemeId(themeKey);
    setUseCustomPalette(false);
    const thm = LOGOBRO_THEMES[themeKey];
    if (thm) setCustomColors([...thm.colors]);
    sounds.playPop();
  };

  const handleSaveToProfile = async () => {
    await updateTheme(selectedThemeId);
    setSavedSuccess(true);
    sounds.playVictory();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportPNG = () => {
    sounds.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 512;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Save context for clipping circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.clip();

    // Rotate context 45 degrees
    ctx.translate(size / 2, size / 2);
    ctx.rotate((-45 * Math.PI) / 180);
    ctx.translate(-size / 2, -size / 2);

    // Draw diagonal stripes
    const colors = useCustomPalette ? customColors : (LOGOBRO_THEMES[selectedThemeId]?.colors || customColors);
    const stripeW = 34;
    const gapW = 12;
    const step = stripeW + gapW;

    let cIdx = 0;
    for (let pos = -size; pos <= size * 2; pos += step) {
      ctx.fillStyle = colors[cIdx % colors.length];
      ctx.fillRect(-size, pos, size * 3, stripeW);
      cIdx++;
    }

    ctx.restore();

    // Outer circle border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
    ctx.stroke();

    // Crescent smiling mouth
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    // Mouth coordinates scaled to 512
    ctx.moveTo(size * 0.24, size * 0.62);
    ctx.quadraticCurveTo(size * 0.49, size * 0.88, size * 0.92, size * 0.58);
    ctx.quadraticCurveTo(size * 0.6, size * 0.94, size * 0.24, size * 0.62);
    ctx.fill();
    ctx.restore();

    // Download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `logobro_${selectedThemeId}_20236.png`;
    a.click();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-400" />
            Logo Bro Skin Studio
          </h3>
          <p className="text-xs text-zinc-400">Design and export your customized high-res Logo Bro avatar</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToProfile}
            className="py-2 px-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save to Profile</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportPNG}
            className="py-2 px-4 rounded-xl font-bold text-xs text-zinc-950 rainbow-gradient hover:opacity-90 flex items-center gap-1.5 shadow-md cursor-pointer font-display"
          >
            <Download className="w-4 h-4" />
            <span>Export PNG (512px)</span>
          </button>
        </div>
      </div>

      {/* Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left: Interactive Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl">
          <div className="relative group cursor-pointer" onClick={() => sounds.playLaugh()}>
            <LogobroAvatar
              size={220}
              themeId={selectedThemeId}
              customColors={useCustomPalette ? customColors : undefined}
              mood={mood}
              accessory={accessory}
              isInteractive={true}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-4 text-center">
            Click Logo Bro to hear signature laugh!
          </p>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Palette Presets */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
              Theme Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(LOGOBRO_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleApplyPreset(key)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedThemeId === key && !useCustomPalette
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex -space-x-1 shrink-0">
                    {theme.colors.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-black"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-200 font-medium truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Stripe Color Pickers */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Stripe Color Palette
              </label>
              {useCustomPalette && (
                <button
                  onClick={() => handleApplyPreset('rainbow')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCcw className="w-3 h-3" /> Reset to Classic
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {customColors.map((col, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <input
                    type="color"
                    value={col}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="w-full h-9 rounded-lg cursor-pointer bg-zinc-800 border border-zinc-700 p-0.5"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono">{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Expression */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-yellow-400" />
              Mouth & Expression
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'happy', label: 'Classic Grin' },
                  { id: 'laughing', label: 'Big Laugh' },
                  { id: 'wink', label: 'Playful Wink' },
                  { id: 'shocked', label: 'Shocked / Pog' },
                  { id: 'sleepy', label: 'Chill / Sleepy' },
                  { id: 'peeking', label: 'Curious Peeking' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMood(m.id);
                    sounds.playPop();
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    mood === m.id
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Accessories
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'none', label: 'None' },
                  { id: 'sunglasses', label: 'Sunglasses 😎' },
                  { id: 'party', label: 'Party Hat 🥳' },
                  { id: 'crown', label: 'Golden Crown 👑' },
                  { id: 'headphones', label: 'DJ Headphones 🎧' },
                  { id: 'hacker', label: 'Anti-Hack Visor 🛡️' },
                ] as const
              ).map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setAccessory(acc.id);
                    sounds.playPop();
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    accessory === acc.id
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-200'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for high-res PNG generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
