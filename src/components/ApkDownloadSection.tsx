import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Terminal,
  Cpu,
  Github,
  Sparkles,
  Info,
} from 'lucide-react';
import { sounds } from '../lib/soundEffects';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const ApkDownloadSection: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const REPO_NAME = 'logobrodonothack2025-cyber/logobrodonothack20236-apk';
  const GITHUB_REPO_URL = `https://github.com/${REPO_NAME}`;
  const RELEASES_URL = `https://github.com/${REPO_NAME}/releases`;
  const DIRECT_APK_URL = `https://github.com/${REPO_NAME}/releases/latest/download/logobrodonothack20236-release.apk`;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallWebApk = async () => {
    sounds.playVictory();
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleCopyRepo = () => {
    navigator.clipboard.writeText(GITHUB_REPO_URL);
    setCopiedLink(true);
    sounds.playPop();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background neon glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-display text-white">
              Logobro Android APK & Mobile Release
            </h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
              v20236.1.0
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Official Android package from repository{' '}
            <strong className="text-zinc-300 font-mono">{REPO_NAME}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyRepo}
            className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied URL' : 'Copy Repo'}</span>
          </button>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Main Download Actions Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Card 1: Direct Android APK */}
        <div className="p-5 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-zinc-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Release APK
              </span>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                ARM64 / Universal
              </span>
            </div>

            <h4 className="text-base font-bold text-white font-display">
              logobrodonothack20236.apk
            </h4>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Standalone native Android APK with full offline mode, local high scores, and anti-hack firewall engine.
            </p>

            <div className="mt-3 space-y-1 text-[11px] font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Package:</span>
                <span className="text-zinc-200 truncate ml-2">com.logobrodonothack2025cyber.apk</span>
              </div>
              <div className="flex justify-between">
                <span>Architecture:</span>
                <span className="text-zinc-200">Universal Android (API 26+)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-zinc-950 rainbow-gradient hover:opacity-90 flex items-center justify-center gap-2 shadow-md transition-all font-display"
            >
              <Download className="w-4 h-4" />
              <span>Download APK</span>
            </a>

            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              title="View all release notes and builds"
            >
              <span>Releases</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>

        {/* Card 2: Instant WebAPK / PWA Install */}
        <div className="p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-zinc-950 to-zinc-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Instant WebAPK (PWA)
              </span>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                Zero Download Size
              </span>
            </div>

            <h4 className="text-base font-bold text-white font-display">
              Add to Android Home Screen
            </h4>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Install Logobro directly from your mobile browser into your app drawer with fullscreen immersion and automatic updates.
            </p>

            <div className="mt-3 space-y-1 text-[11px] font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Display:</span>
                <span className="text-zinc-200">Standalone App Window</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 font-semibold">
                  {isInstalled ? 'Installed on device' : 'Ready to install'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-800/80">
            {deferredPrompt ? (
              <button
                onClick={handleInstallWebApk}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-zinc-950 flex items-center justify-center gap-2 shadow-md transition-all font-display cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install WebAPK on Device</span>
              </button>
            ) : isInstalled ? (
              <div className="py-2.5 px-4 rounded-xl bg-zinc-800/80 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Installed on Home Screen</span>
              </div>
            ) : (
              <div className="py-2.5 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs text-center">
                Tap your mobile browser menu (⋮) & select <strong>"Add to Home Screen"</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Android Installation Instructions */}
      <div className="mt-6 pt-5 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
          <div className="font-bold text-white mb-1 flex items-center gap-2 font-display">
            <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 text-[11px] flex items-center justify-center font-mono">1</span>
            Download APK
          </div>
          <p className="text-zinc-400">
            Get the APK file from GitHub repository releases on your Android device.
          </p>
        </div>

        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
          <div className="font-bold text-white mb-1 flex items-center gap-2 font-display">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] flex items-center justify-center font-mono">2</span>
            Allow Install
          </div>
          <p className="text-zinc-400">
            If prompted, tap Settings and allow "Install unknown apps" for your browser.
          </p>
        </div>

        <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
          <div className="font-bold text-white mb-1 flex items-center gap-2 font-display">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-center font-mono">3</span>
            Play & Create
          </div>
          <p className="text-zinc-400">
            Tap Install and launch Logobro 20236 with anti-hack protection enabled!
          </p>
        </div>
      </div>
    </section>
  );
};
