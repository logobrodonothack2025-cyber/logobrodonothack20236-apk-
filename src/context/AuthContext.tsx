import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string;
  bio?: string;
  selectedTheme?: string;
  highScore: number;
  createdAt?: any;
  updatedAt?: any;
  isGuest?: boolean;
}

export interface SavedAccount {
  uid: string;
  email: string | null;
  displayName: string;
  selectedTheme?: string;
  photoURL?: string;
  isGuest?: boolean;
  lastActive: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  error: string | null;
  savedAccounts: SavedAccount[];
  clearError: () => void;
  signUpWithEmail: (email: string, pass: string, name: string, theme?: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateTheme: (theme: string) => Promise<void>;
  updateProfileDetails: (name: string, bio: string) => Promise<void>;
  saveHighScore: (score: number) => Promise<void>;
  switchAccount: (account: SavedAccount) => Promise<void>;
  removeSavedAccount: (uid: string) => void;
  startAddAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SAVED_ACCOUNTS_KEY = 'logobro_saved_accounts_20236';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_ACCOUNTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const clearError = () => setError(null);

  const persistSavedAccounts = (accounts: SavedAccount[]) => {
    setSavedAccounts(accounts);
    try {
      localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save accounts to storage:', e);
    }
  };

  const registerSavedAccount = (profile: UserProfile) => {
    setSavedAccounts((prev) => {
      const filtered = prev.filter((a) => a.uid !== profile.uid);
      const updated: SavedAccount[] = [
        {
          uid: profile.uid,
          email: profile.email,
          displayName: profile.displayName,
          selectedTheme: profile.selectedTheme || 'rainbow',
          photoURL: profile.photoURL,
          isGuest: profile.isGuest,
          lastActive: Date.now(),
        },
        ...filtered,
      ];
      try {
        localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage save error:', e);
      }
      return updated;
    });
  };

  // Sync user profile from Firestore or initialize
  const syncUserProfile = async (firebaseUser: User) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        setUserProfile(data);
        registerSavedAccount(data);
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Logobro Fan',
          photoURL: firebaseUser.photoURL || 'classic',
          bio: 'Logobro never gets hacked!',
          selectedTheme: 'rainbow',
          highScore: 0,
          createdAt: serverTimestamp(),
          isGuest: firebaseUser.isAnonymous,
        };

        try {
          await setDoc(userRef, newProfile);
        } catch (writeErr) {
          console.warn('Firestore profile write warning:', writeErr);
        }
        setUserProfile(newProfile);
        registerSavedAccount(newProfile);
      }
    } catch (err) {
      console.warn('Profile fetch warning:', err);
      const fallback: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Logobro Player',
        photoURL: firebaseUser.photoURL || 'classic',
        bio: 'Ready to roll!',
        selectedTheme: 'rainbow',
        highScore: 0,
        isGuest: firebaseUser.isAnonymous,
      };
      setUserProfile(fallback);
      registerSavedAccount(fallback);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(currentUser.isAnonymous);
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
        setIsGuest(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, pass: string, name: string, theme: string = 'rainbow') => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, {
        displayName: name,
      });
      const initialProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        photoURL: theme,
        bio: 'Protect Logobro from glitches!',
        selectedTheme: theme,
        highScore: 0,
        createdAt: serverTimestamp(),
        isGuest: false,
      };
      try {
        await setDoc(doc(db, 'users', cred.user.uid), initialProfile);
      } catch (e) {
        console.warn('Set initial user profile:', e);
      }
      setUserProfile(initialProfile);
      registerSavedAccount(initialProfile);
    } catch (err: any) {
      console.error('Sign up error:', err);
      let message = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') message = 'This email is already registered. Try logging in!';
      else if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      else if (err.code === 'auth/invalid-email') message = 'Please enter a valid email address.';
      else if (err.message) message = err.message;
      setError(message);
      throw new Error(message);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      console.error('Sign in error:', err);
      let message = 'Failed to sign in.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password combination.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later or reset password.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
      throw new Error(message);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      let message = 'Google sign in could not be completed.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign in cancelled by user.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Google Sign-in is being enabled. You can log in with Email or Guest Mode!';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
      throw new Error(message);
    }
  };

  const signInAsGuest = async () => {
    setError(null);
    try {
      const cred = await signInAnonymously(auth);
      setIsGuest(true);
      await updateProfile(cred.user, {
        displayName: 'Guest Bro #' + Math.floor(1000 + Math.random() * 9000),
      });
      await syncUserProfile(cred.user);
    } catch (err: any) {
      console.error('Guest sign in error:', err);
      const mockGuest: UserProfile = {
        uid: 'guest-' + Date.now(),
        email: null,
        displayName: 'Guest Bro #' + Math.floor(1000 + Math.random() * 9000),
        bio: 'Visiting Logobro Arcade',
        selectedTheme: 'rainbow',
        highScore: 0,
        isGuest: true,
      };
      setIsGuest(true);
      setUserProfile(mockGuest);
      registerSavedAccount(mockGuest);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Reset password error:', err);
      let message = 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') message = 'No account found with this email.';
      else if (err.code === 'auth/invalid-email') message = 'Invalid email format.';
      else if (err.message) message = err.message;
      setError(message);
      throw new Error(message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setUser(null);
    setUserProfile(null);
    setIsGuest(false);
  };

  const startAddAccount = async () => {
    // Retain saved accounts list, but sign out of current session so user can sign in/up to another account
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setUser(null);
    setUserProfile(null);
    setIsGuest(false);
  };

  const switchAccount = async (targetAccount: SavedAccount) => {
    // If switching to a guest account
    if (targetAccount.isGuest) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn(e);
      }
      setUserProfile({
        uid: targetAccount.uid,
        email: null,
        displayName: targetAccount.displayName,
        selectedTheme: targetAccount.selectedTheme || 'rainbow',
        highScore: 0,
        bio: 'Visiting Logobro Arcade',
        isGuest: true,
      });
      setIsGuest(true);
      return;
    }

    // If target has email, sign out and prompt user with prefilled email on auth page
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setUser(null);
    setUserProfile(null);
    setIsGuest(false);
  };

  const removeSavedAccount = (uid: string) => {
    const updated = savedAccounts.filter((a) => a.uid !== uid);
    persistSavedAccounts(updated);
  };

  const updateTheme = async (theme: string) => {
    if (userProfile) {
      setUserProfile((prev) => (prev ? { ...prev, selectedTheme: theme } : null));
    }
    if (user && !user.isAnonymous) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          selectedTheme: theme,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Update theme err:', e);
      }
    }
  };

  const updateProfileDetails = async (name: string, bio: string) => {
    if (userProfile) {
      const updated = { ...userProfile, displayName: name, bio };
      setUserProfile(updated);
      registerSavedAccount(updated);
    }
    if (user && !user.isAnonymous) {
      try {
        await updateProfile(user, { displayName: name });
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: name,
          bio,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Update profile err:', e);
      }
    }
  };

  const saveHighScore = async (score: number) => {
    if (userProfile && score > (userProfile.highScore || 0)) {
      setUserProfile((prev) => (prev ? { ...prev, highScore: score } : null));
      if (user && !user.isAnonymous) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            highScore: score,
            updatedAt: serverTimestamp(),
          });
          await addDoc(collection(db, 'leaderboard'), {
            userId: user.uid,
            displayName: userProfile.displayName || 'Logobro',
            score,
            gameMode: 'Arcade Defense',
            characterSkin: userProfile.selectedTheme || 'rainbow',
            createdAt: serverTimestamp(),
          });
        } catch (e) {
          console.warn('Save score err:', e);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isGuest,
        error,
        savedAccounts,
        clearError,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signInAsGuest,
        resetPassword,
        logOut,
        updateTheme,
        updateProfileDetails,
        saveHighScore,
        switchAccount,
        removeSavedAccount,
        startAddAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
