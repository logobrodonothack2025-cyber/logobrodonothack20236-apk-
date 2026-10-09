import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  UserPlus,
  ArrowRightLeft,
  Trash2,
  ShieldCheck,
  User,
  Save,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  Smartphone,
  Download,
  Star,
} from 'lucide-react';
import { useAuth, SavedAccount } from '../context/AuthContext';
import { LogobroAvatar, LOGOBRO_THEMES } from './LogobroAvatar';
import { ApkDownloadModal } from './ApkDownloadModal';
import { sounds } from '../lib/soundEffects';

interface SocialPlatform {
  id: string;
  name: string;
  handle: string;
  url: string;
  description: string;
  color: string;
  bgGradient: string;
  iconSvg: React.ReactNode;
}

const SOCIAL_LINKS: SocialPlatform[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@logobrodonothack20236',
    url: 'https://youtube.com/@logobrodonothack20236?si=ZO5YJWGRlodhKQNl',
    description: 'Official animations, logo parodies & gaming videos',
    color: 'text-red-500',
    bgGradient: 'from-red-600/20 to-red-950/40 border-red-500/30 hover:border-red-500/60',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@logobrodonothack20236',
    url: 'https://www.tiktok.com/@logobrodonothack20236?_r=1&_t=ZS-9APYWxG26h0',
    description: 'Quick animations, memes & arcade clips',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-950/40 to-pink-950/30 border-cyan-500/30 hover:border-cyan-500/60',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.41a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 15.69a6.34 6.34 0 0 0 10.82 4.48c1.77-1.77 2.76-4.17 2.76-6.67V8.76a8.28 8.28 0 0 0 4.91 1.6V6.91a4.84 4.84 0 0 1-2-.22z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@logobrodonothack20236',
    url: 'https://www.instagram.com/logobrodonothack20236?mdxt=NjFyYm5idW5zcDZz',
    description: 'Behind the scenes artwork & community highlights',
    color: 'text-pink-400',
    bgGradient: 'from-pink-950/40 via-purple-950/30 to-amber-950/20 border-pink-500/30 hover:border-pink-500/60',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'threads',
    name: 'Threads',
    handle: '@logobrodonothack20236',
    url: 'https://www.threads.com/@logobrodonothack20236',
    description: 'Community chatter & live creator updates',
    color: 'text-zinc-200',
    bgGradient: 'from-zinc-900 to-zinc-950 border-zinc-700/50 hover:border-zinc-500/80',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 2.457 0 4.717-.89 6.473-2.368l-1.398-1.443A7.95 7.95 0 0 1 12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8c0 1.583-.437 3.064-1.206 4.337l1.523 1.258A9.948 9.948 0 0 0 22 12c0-5.523-4.477-10-10-10zm2.25 10c0 1.242-1.008 2.25-2.25 2.25s-2.25-1.008-2.25-2.25 1.008-2.25 2.25-2.25 2.25 1.008 2.25 2.25z" />
      </svg>
    ),
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    handle: '@logobrodono2023',
    url: 'https://x.com/logobrodono2023',
    description: 'Real-time announcements & teasers',
    color: 'text-zinc-100',
    bgGradient: 'from-zinc-900 via-zinc-950 to-black border-zinc-800 hover:border-zinc-600',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Logobro Official Page',
    url: 'https://www.facebook.com/share/1EsA68KYst/',
    description: 'Connect with fellow Logo Bro community fans',
    color: 'text-blue-500',
    bgGradient: 'from-blue-950/40 to-zinc-950 border-blue-500/30 hover:border-blue-500/60',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'github',
    name: 'GitHub (Android APK)',
    handle: 'logobrodonothack2025-cyber / logobrodonothack20236-apk',
    url: 'https://github.com/logobrodonothack2025-cyber/logobrodonothack20236-apk',
    description: 'Official Android APK package, releases & mobile app source code',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-950/50 via-zinc-900 to-black border-emerald-500/30 hover:border-emerald-500/60',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

interface SettingsPageProps {
  onOpenAuth: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenAuth }) => {
  const {
    user,
    userProfile,
    isGuest,
    savedAccounts,
    switchAccount,
    removeSavedAccount,
    startAddAccount,
    logOut,
    updateProfileDetails,
  } = useAuth();

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  const [apkModalOpen, setApkModalOpen] = useState(false);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    sounds.playPop();
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateProfileDetails(displayName, bio);
    setIsSavingProfile(false);
    setProfileSavedMsg(true);
    sounds.playVictory();
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleSwitch = async (account: SavedAccount) => {
    sounds.playPop();
    await switchAccount(account);
    if (!account.isGuest) {
      onOpenAuth();
    }
  };

  const handleAddAccount = async () => {
    sounds.playPop();
    await startAddAccount();
    onOpenAuth();
  };

  // Other accounts that are not currently active
  const otherAccounts = savedAccounts.filter(
    (acc) => acc.uid !== (user?.uid || userProfile?.uid)
  );

  return (
    <div className="space-y-10">
      {/* Page Title Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight flex items-center gap-3">
          <span>Settings & Community Hub</span>
          <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
            20236
          </span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Follow official Logobro social media channels, manage other accounts, and update your profile.
        </p>
      </div>

      {/* SECTION 1: SOCIAL MEDIA FOLLOW & APK REPOSITORY */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-zinc-800 gap-2">
          <div>
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-pink-400" />
              Follow Logobro on Social Media & GitHub
            </h3>
            <p className="text-xs text-zinc-400">
              Join millions of fans across official channels for animations, APK downloads, gameplay & memes
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 font-semibold">7 Verified Links</span>
        </div>

        {/* Featured Android APK Card */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-950 to-zinc-900 border border-emerald-500/40 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-950 border border-emerald-500/30 rounded-2xl shrink-0 shadow-inner">
              <Smartphone className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold font-display text-white">
                  Official Logobro Android APK
                </h4>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-mono font-bold">
                  v20236
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-mono mt-0.5">
                github.com/logobrodonothack2025-cyber/logobrodonothack20236-apk
              </p>
              <p className="text-xs text-zinc-400 mt-1 max-w-md">
                Download the mobile release directly to install Logobro Arcade & Soundboard on your Android smartphone or tablet.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-center">
            <button
              type="button"
              onClick={() => {
                setApkModalOpen(true);
                sounds.playPop();
              }}
              className="flex-1 md:flex-initial py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all font-display cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Get APK Guide</span>
            </button>

            <a
              href="https://github.com/logobrodonothack2025-cyber/logobrodonothack20236-apk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
            >
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>
        </div>

        {/* 7 Social Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {SOCIAL_LINKS.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border bg-gradient-to-br ${item.bgGradient} transition-all duration-200 flex flex-col justify-between group shadow-sm`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-zinc-950/80 ${item.color} shadow-sm`}>
                    {item.iconSvg}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="p-1.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Link"
                  >
                    {copiedUrl === item.url ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors font-display">
                  {item.name}
                </h4>
                <div className="text-xs font-mono text-zinc-300 mt-0.5">{item.handle}</div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  {copiedUrl === item.url ? 'Link copied!' : 'Official Channel'}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Follow</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: ACCOUNTS & SWITCHING */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-zinc-800 gap-4">
          <div>
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
              Switch Account & Manage Profiles
            </h3>
            <p className="text-xs text-zinc-400">
              Easily toggle between accounts or add new player profiles on this device
            </p>
          </div>

          <button
            onClick={handleAddAccount}
            className="py-2.5 px-4 rounded-xl font-bold text-xs text-zinc-950 rainbow-gradient hover:opacity-90 flex items-center gap-1.5 shadow-md cursor-pointer font-display shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>

        {/* Current Active Account Box */}
        <div className="mt-6">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
            Active Account
          </label>
          <div className="p-4 bg-zinc-950/70 border border-cyan-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <LogobroAvatar
                  size={52}
                  themeId={userProfile?.selectedTheme || 'rainbow'}
                  mood="happy"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white font-display">
                    {userProfile?.displayName || 'Active Bro'}
                  </h4>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-mono">
                    Current
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  {isGuest ? 'Guest Session' : user?.email || 'Logged In'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  logOut();
                  onOpenAuth();
                  sounds.playPop();
                }}
                className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Other Accounts Section */}
        <div className="mt-8">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
            Other Accounts on this Device ({otherAccounts.length})
          </label>

          {otherAccounts.length === 0 ? (
            <div className="p-6 bg-zinc-950/40 border border-dashed border-zinc-800 rounded-xl text-center">
              <User className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-400 font-medium">No other accounts saved yet.</p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Click <strong>"Add Account"</strong> above to log into a second profile and switch anytime!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {otherAccounts.map((acc) => (
                <div
                  key={acc.uid}
                  className="p-3.5 bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogobroAvatar
                      size={44}
                      themeId={acc.selectedTheme || 'rainbow'}
                      mood="happy"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-white font-display">{acc.displayName}</h5>
                      <span className="text-xs text-zinc-400 font-mono">
                        {acc.isGuest ? 'Guest Profile' : acc.email || 'Saved Member'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSwitch(acc)}
                      className="py-1.5 px-3 bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Switch</span>
                    </button>
                    <button
                      onClick={() => {
                        removeSavedAccount(acc.uid);
                        sounds.playPop();
                      }}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                      title="Remove from saved accounts"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: EDIT PROFILE SETTINGS */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="pb-5 border-b border-zinc-800">
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <User className="w-5 h-5 text-yellow-400" />
            Profile & Security Preferences
          </h3>
          <p className="text-xs text-zinc-400">Update how your Logo Bro appears in the arcade</p>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Player Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Logo Bro handle"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Motto / Bio
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Logobro never gets hacked!"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="py-2.5 px-6 rounded-xl font-bold text-xs text-zinc-950 rainbow-gradient hover:opacity-90 flex items-center gap-2 shadow-md cursor-pointer font-display disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>

            {profileSavedMsg && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Updated successfully!
              </span>
            )}
          </div>
        </form>

        {/* Security badge */}
        <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Firewall Protocol Active · ID: logobrodonothack20236</span>
        </div>
      </section>

      {/* APK Download & Release Modal */}
      <ApkDownloadModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />
    </div>
  );
};
