import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  Check,
  Copy,
  Smartphone,
  ShieldCheck,
  Star,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { LogobroAvatar } from './LogobroAvatar';
import { sounds } from '../lib/soundEffects';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const repoUrl = 'https://github.com/logobrodonothack2025-cyber/logobrodonothack20236-apk';
  const releasesUrl = 'https://github.com/logobrodonothack2025-cyber/logobrodonothack20236-apk/releases';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(repoUrl);
    setCopied(true);
    sounds.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-zinc-800">
          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner shrink-0">
            <Smartphone className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display text-white">Logobro Android APK</h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono font-semibold">
                v20236
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              logobrodonothack2025-cyber / logobrodonothack20236-apk
            </p>
          </div>
        </div>

        {/* Mascot badge */}
        <div className="my-5 p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-center gap-4">
          <LogobroAvatar size={50} mood="happy" accessory="hacker" />
          <div>
            <div className="text-sm font-bold text-white font-display">
              Play Logobro on Android Mobile!
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Official mobile package including the arcade firewall defense and customized soundboard.
            </p>
          </div>
        </div>

        {/* Quick steps */}
        <div className="space-y-2.5 my-5 text-xs text-zinc-300">
          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/40">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0 font-mono">
              1
            </span>
            <span>Open the official GitHub repository and go to the <strong>Releases</strong> section.</span>
          </div>
          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/40">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0 font-mono">
              2
            </span>
            <span>Download the latest <strong>.apk</strong> package file to your Android device.</span>
          </div>
          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/40">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px] shrink-0 font-mono">
              3
            </span>
            <span>Allow installation from your browser and tap <strong>Install</strong> to play!</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playPop()}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-zinc-950 rainbow-gradient hover:opacity-95 flex items-center justify-center gap-2 shadow-md font-display transition-transform active:scale-95 cursor-pointer text-center"
          >
            <Download className="w-4 h-4" />
            <span>Open GitHub APK Releases</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="py-3 px-4 rounded-xl font-semibold text-xs text-zinc-200 bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Repo URL</span>
              </>
            )}
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official verified build · Virus-free</span>
          </div>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-yellow-400" /> Star on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
