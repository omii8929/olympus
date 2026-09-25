import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '../types';
import { api } from '../services/api';
import {
  loginWithFirebase,
  logoutWithFirebase,
  resetPasswordWithFirebase,
  sendEmailVerificationToUser,
  subscribeToFirebaseAuthState,
  getCurrentIdToken,
} from '../services/firebaseAuth';
import { isFirebaseConfigured } from '../config/firebase';

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  sendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('olympus_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize user profile from backend with token
  const syncUserProfile = async (idToken: string) => {
    try {
      localStorage.setItem('olympus_token', idToken);
      setToken(idToken);

      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      } else {
        localStorage.removeItem('olympus_token');
        setToken(null);
        setUser(null);
        return null;
      }
    } catch (err) {
      console.warn('Profile sync notice:', err);
      // If server returned 401 or 403, clear stale session
      localStorage.removeItem('olympus_token');
      setToken(null);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (isFirebaseConfigured) {
      unsubscribe = subscribeToFirebaseAuthState(async (fbUser) => {
        if (fbUser) {
          try {
            const idToken = await fbUser.getIdToken();
            await syncUserProfile(idToken);
          } catch {
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('olympus_token');
        }
        setIsLoading(false);
      });
    } else {
      // Local development or non-Firebase fallback: check stored token
      const storedToken = localStorage.getItem('olympus_token');
      if (storedToken) {
        syncUserProfile(storedToken).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const authResult = await loginWithFirebase(email, password);

      if (!authResult.success || !authResult.token) {
        setIsLoading(false);
        return { success: false, error: authResult.error || 'Invalid admin credentials.' };
      }

      // Sync with PostgreSQL backend using the Firebase ID token
      const dbUser = await syncUserProfile(authResult.token);
      setIsLoading(false);

      if (!dbUser) {
        return { success: false, error: 'Authentication verified, but unable to load admin role from database.' };
      }

      return { success: true };
    } catch (error: any) {
      setIsLoading(false);
      return { success: false, error: error.message || 'Authentication error occurred.' };
    }
  };

  const logout = async () => {
    await logoutWithFirebase();
    localStorage.removeItem('olympus_token');
    setToken(null);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return await resetPasswordWithFirebase(email);
  };

  const sendVerificationEmail = async () => {
    return await sendEmailVerificationToUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        resetPassword,
        sendVerificationEmail,
        isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        isFirebaseActive: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
