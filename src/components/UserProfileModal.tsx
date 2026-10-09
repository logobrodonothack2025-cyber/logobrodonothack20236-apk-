import React, { useState } from 'react';
import { X, User, Mail, Shield, Trophy, LogOut, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogobroAvatar } from './LogobroAvatar';
import { sounds } from '../lib/soundEffects';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSettings?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onNavigateToSettings }) => {
  const { userProfile, user, isGuest, logOut } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyId = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      sounds.playPop();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-zinc-800">
          <div className="relative mb-3">
            <LogobroAvatar
              size={84}
              themeId={userProfile?.selectedTheme || 'rainbow'}
              mood="happy"
            />
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            {userProfile?.displayName || 'Logobro Member'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isGuest ? 'Guest Player' : user?.email || 'Authenticated User'}
          </p>

          {isGuest && (
            <span className="mt-2 text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-full font-mono">
              Guest Session (Scores saved locally)
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl text-center">
            <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold font-mono text-white">{userProfile?.highScore || 0}</div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Arcade High Score</div>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl text-center">
            <Shield className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-bold font-mono text-white">SECURE</div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">20236 Anti-Hack</div>
          </div>
        </div>

        {/* Account Info Details */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-500" /> Email
            </span>
            <span className="font-mono text-zinc-200 truncate max-w-[200px]">
              {user?.email || (isGuest ? 'guest@logobro.local' : 'None')}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-500" /> Account ID
            </span>
            <button
              onClick={handleCopyId}
              className="font-mono text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              {copied ? 'Copied!' : `${user?.uid ? user.uid.slice(0, 10) + '...' : 'Guest'}`}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          {onNavigateToSettings && (
            <button
              onClick={() => {
                onClose();
                onNavigateToSettings();
                sounds.playPop();
              }}
              className="flex-1 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Manage Accounts</span>
            </button>
          )}

          <button
            onClick={() => {
              logOut();
              onClose();
              sounds.playPop();
            }}
            className="flex-1 py-2.5 px-4 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
