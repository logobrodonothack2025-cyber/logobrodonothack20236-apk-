/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Palette,
  Volume2,
  Gamepad2,
  User,
  LogOut,
  Sparkles,
  Trophy,
  ArrowRightLeft,
  VolumeX,
  Settings,
  Share2,
  Smartphone,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { LogobroAvatar } from './components/LogobroAvatar';
import { ArcadeGame } from './components/ArcadeGame';
import { LogobroStudio } from './components/LogobroStudio';
import { Soundboard } from './components/Soundboard';
import { SettingsPage } from './components/SettingsPage';
import { UserProfileModal } from './components/UserProfileModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { sounds } from './lib/soundEffects';

const MainAppContent: React.FC = () => {
  const { user, userProfile, loading, isGuest, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'studio' | 'arcade' | 'soundboard' | 'settings'>('studio');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [apkModalOpen, setApkModalOpen] = useState(false);
  const [forceShowAuth, setForceShowAuth] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    sounds.enabled = next;
    if (next) sounds.playPop();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100">
        <div className="animate-bounce">
          <LogobroAvatar size={84} mood="laughing" />
        </div>
        <p className="mt-4 text-sm font-mono text-zinc-400">Loading Logobro 20236 Engine...</p>
      </div>
    );
  }

  // If user is not authenticated and hasn't selected guest, or requested auth view
  if ((!user && !userProfile) || forceShowAuth) {
    return <AuthPage onSuccess={() => setForceShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-pink-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            onClick={() => sounds.playLaugh()}
            title="Tickle Logobro!"
          >
            <LogobroAvatar
              size={40}
              themeId={userProfile?.selectedTheme || 'rainbow'}
              mood="happy"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display text-white tracking-tight">
                Logobro <span className="rainbow-text">20236</span>
              </h1>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono px-1.5 py-0.5 rounded border border-zinc-700 hidden sm:inline-block">
                STUDIO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Official Character & Arcade Hub</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => {
              setActiveTab('studio');
              sounds.playPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Skin Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('arcade');
              sounds.playPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'arcade'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Firewall Arcade</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('soundboard');
              sounds.playPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'soundboard'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">Soundboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              sounds.playPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Settings & Social</span>
          </button>
        </nav>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-2">
          {/* Get APK Quick Action */}
          <button
            onClick={() => {
              setApkModalOpen(true);
              sounds.playPop();
            }}
            className="hidden md:flex items-center gap-1.5 py-1.5 px-3 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Download Official Android APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Get APK</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            title={soundActive ? 'Mute' : 'Unmute'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* User Profile Capsule */}
          <button
            onClick={() => {
              setProfileModalOpen(true);
              sounds.playPop();
            }}
            className="flex items-center gap-2 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <LogobroAvatar
              size={24}
              themeId={userProfile?.selectedTheme || 'rainbow'}
              mood="happy"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-white leading-none">
                {userProfile?.displayName || 'Player'}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono leading-none mt-0.5">
                {isGuest ? 'Guest' : userProfile?.highScore ? `${userProfile.highScore} pts` : 'Member'}
              </div>
            </div>
          </button>

          {/* Switch Account / Auth Page Button */}
          <button
            onClick={() => {
              setForceShowAuth(true);
              sounds.playPop();
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Switch User / Open Auth Page"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Banner with user info & quick stats */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900/60 border border-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              onClick={() => sounds.playLaugh()}
            >
              <LogobroAvatar
                size={80}
                themeId={userProfile?.selectedTheme || 'rainbow'}
                mood="happy"
                className="drop-shadow-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-display text-white">
                  Hey, {userProfile?.displayName || 'Logobro Fan'}!
                </h2>
                {isGuest && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                    Guest Mode
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-400 mt-1 max-w-lg">
                Official home of Logobro. Customize character skins, defend the firewall in the arcade, or follow official channels!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setApkModalOpen(true);
                sounds.playPop();
              }}
              className="py-2.5 px-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/70 text-xs font-semibold text-emerald-300 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Android APK</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                sounds.playPop();
              }}
              className="py-2.5 px-3.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-pink-400" />
              <span>Social & Accounts</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('arcade');
                sounds.playPop();
              }}
              className="py-2.5 px-4 rounded-xl font-bold text-xs text-zinc-950 rainbow-gradient hover:opacity-90 transition-all font-display shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Play Arcade</span>
            </button>
          </div>
        </div>

        {/* Tab View Selection */}
        {activeTab === 'studio' && <LogobroStudio />}
        {activeTab === 'arcade' && <ArcadeGame />}
        {activeTab === 'soundboard' && <Soundboard />}
        {activeTab === 'settings' && (
          <SettingsPage onOpenAuth={() => setForceShowAuth(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-6 text-center text-xs text-zinc-500 mt-auto space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
          <a
            href="https://youtube.com/@logobrodonothack20236?si=ZO5YJWGRlodhKQNl"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors"
          >
            YouTube
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.tiktok.com/@logobrodonothack20236?_r=1&_t=ZS-9APYWxG26h0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            TikTok
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.instagram.com/logobrodonothack20236?mdxt=NjFyYm5idW5zcDZz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors"
          >
            Instagram
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.threads.com/@logobrodonothack20236"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Threads
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://x.com/logobrodono2023"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-200 transition-colors"
          >
            X (Twitter)
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.facebook.com/share/1EsA68KYst/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            Facebook
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/logobrodonothack2025-cyber/logobrodonothack20236-apk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 font-semibold transition-colors flex items-center gap-1"
          >
            GitHub (APK)
          </a>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-zinc-400">Logobrodonothack20236 Security Framework</span>
        </div>
        <p>Built for the Logobro community · Persistent data powered by Firebase & Firestore</p>
      </footer>

      {/* Profile & Account Details Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onNavigateToSettings={() => setActiveTab('settings')}
      />

      {/* Official Android APK Modal */}
      <ApkDownloadModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
