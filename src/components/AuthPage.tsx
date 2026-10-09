import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Gamepad2,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogobroAvatar, LOGOBRO_THEMES } from './LogobroAvatar';
import { sounds } from '../lib/soundEffects';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInAsGuest,
    resetPassword,
    error,
    clearError,
    savedAccounts,
    switchAccount,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('rainbow');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [avatarMood, setAvatarMood] = useState<
    'happy' | 'laughing' | 'typing' | 'peeking' | 'wink' | 'cool' | 'shocked' | 'sleepy'
  >('happy');

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playPop();
  };

  const handleInputFocus = (field: 'email' | 'password' | 'name') => {
    if (field === 'password') {
      setAvatarMood(showPassword ? 'shocked' : 'peeking');
    } else {
      setAvatarMood('typing');
    }
  };

  const handleInputBlur = () => {
    setAvatarMood('happy');
  };

  const triggerCelebration = () => {
    sounds.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff7875', '#6fe4f8', '#fff066', '#67e76d', '#f578e8'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        setAvatarMood('laughing');
        triggerCelebration();
        onSuccess?.();
      } else if (mode === 'signup') {
        if (!displayName.trim()) {
          throw new Error('Please enter a display name for your Logo Bro profile.');
        }
        await signUpWithEmail(email, password, displayName, selectedTheme);
        setAvatarMood('laughing');
        triggerCelebration();
        onSuccess?.();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
        sounds.playPop();
      }
    } catch (err) {
      setAvatarMood('shocked');
      sounds.playGlitch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      setAvatarMood('laughing');
      triggerCelebration();
      onSuccess?.();
    } catch (err) {
      setAvatarMood('shocked');
      sounds.playGlitch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    clearError();
    setIsSubmitting(true);
    try {
      await signInAsGuest();
      setAvatarMood('wink');
      sounds.playLaugh();
      onSuccess?.();
    } catch (err) {
      setAvatarMood('shocked');
      sounds.playGlitch();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength helper
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-zinc-700' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between relative overflow-hidden text-zinc-100">
      {/* Dynamic Background Stripes Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header bar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <LogobroAvatar size={36} themeId={selectedTheme} mood="happy" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              Logobro <span className="rainbow-text">20236</span>
            </h1>
            <p className="text-xs text-zinc-400">Official Character Studio & Arcade</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            type="button"
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title={audioEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-400" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl transition-all">
          
          {/* Reactive Mascot Hero */}
          <div className="flex flex-col items-center text-center mb-6">
            <div
              className="cursor-pointer group relative"
              onClick={() => {
                setAvatarMood((m) => (m === 'laughing' ? 'happy' : 'laughing'));
                sounds.playLaugh();
              }}
              title="Click Logo Bro to tickle!"
            >
              <LogobroAvatar
                size={96}
                themeId={selectedTheme}
                mood={avatarMood}
                className="transition-transform group-hover:scale-110 active:scale-95 duration-200"
              />
              <span className="absolute -bottom-2 -right-1 bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 px-1.5 py-0.5 rounded-full font-mono">
                Click me!
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold font-display text-white">
              {mode === 'login' && 'Welcome Back, Bro!'}
              {mode === 'signup' && 'Join Logo Bro Club'}
              {mode === 'forgot' && 'Account Recovery'}
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xs">
              {mode === 'login' && 'Enter your credentials to access your skins & high scores.'}
              {mode === 'signup' && 'Create your account to design custom avatars and compete.'}
              {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearError();
                sounds.playPop();
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                clearError();
                sounds.playPop();
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                clearError();
                sounds.playPop();
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'forgot'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Reset
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 flex items-start gap-3 text-red-200 text-xs sm:text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Reset Confirmation */}
          {mode === 'forgot' && resetSent && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 flex items-start gap-3 text-emerald-200 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>Password reset link dispatched! Please check your email inbox.</div>
            </div>
          )}

          {/* Quick Switch to Saved Account (if any) */}
          {mode === 'login' && savedAccounts.length > 0 && (
            <div className="mb-5 p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
                <span>Saved Accounts</span>
                <span className="text-[10px] text-zinc-500 font-mono">{savedAccounts.length} saved</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {savedAccounts.map((acc) => (
                  <button
                    key={acc.uid}
                    type="button"
                    onClick={() => {
                      if (acc.email) setEmail(acc.email);
                      if (acc.isGuest) {
                        switchAccount(acc);
                        onSuccess?.();
                      }
                      sounds.playPop();
                    }}
                    className="w-full p-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <LogobroAvatar size={26} themeId={acc.selectedTheme || 'rainbow'} mood="happy" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {acc.displayName}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate">
                          {acc.email || 'Guest Profile'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-medium px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/60 shrink-0">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name (Only in Sign Up) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Display Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onFocus={() => handleInputFocus('name')}
                    onBlur={handleInputBlur}
                    placeholder="e.g. MasterLogobro"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleInputFocus('email')}
                  onBlur={handleInputBlur}
                  placeholder="bro@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field (Login & Sign Up) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleInputFocus('password')}
                    onBlur={handleInputBlur}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = !showPassword;
                      setShowPassword(next);
                      setAvatarMood(next ? 'shocked' : 'peeking');
                      sounds.playPop();
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength indicator for signup */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-zinc-800'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-zinc-800'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-zinc-800'}`} />
                    </div>
                    <span className="text-[11px] text-zinc-400 font-medium">{strength.label}</span>
                  </div>
                )}
              </div>
            )}

            {/* Mascot Starting Theme Picker (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">
                  Pick Your Logo Bro Vibe
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(LOGOBRO_THEMES).slice(0, 6).map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => {
                        setSelectedTheme(thm.id);
                        sounds.playPop();
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        selectedTheme === thm.id
                          ? 'border-pink-500 bg-pink-500/10 shadow-sm'
                          : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                      }`}
                    >
                      <LogobroAvatar size={34} themeId={thm.id} />
                      <span className="text-[10px] text-zinc-300 font-medium truncate w-full text-center">
                        {thm.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-zinc-950 rainbow-gradient hover:opacity-95 active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 font-display disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Rolling into Logo Bro...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Create Account</span>
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Send Reset Email</span>
                  <KeyRound className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500 font-mono">Or continue with</span>
            </div>
          </div>

          {/* Alternative Auth Actions */}
          <div className="space-y-2.5">
            {/* Google Sign-in */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs sm:text-sm font-medium text-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Guest Arcade Mode */}
            <button
              type="button"
              onClick={handleGuestSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-zinc-950/60 hover:bg-zinc-800/80 border border-dashed border-zinc-700/80 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-pink-400" />
              <span>Instant Guest Mode (No Account Required)</span>
            </button>
          </div>

          {/* Privacy & Anti-Hack Assurance */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-zinc-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Logobro Anti-Hack Protection · 20236 Edition</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs text-zinc-500 border-t border-zinc-900 bg-zinc-950/40">
        Logobro Studio & Arcade · Designed for fans of the iconic rainbow-striped smile.
      </footer>
    </div>
  );
};
