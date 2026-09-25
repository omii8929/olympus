import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';

export interface FirebaseAuthResult {
  success: boolean;
  token?: string;
  email?: string;
  uid?: string;
  emailVerified?: boolean;
  error?: string;
}

/**
 * Sign in admin using Firebase Authentication email/password
 */
export async function loginWithFirebase(email: string, password: string): Promise<FirebaseAuthResult> {
  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const idToken = await userCredential.user.getIdToken(true);
      return {
        success: true,
        token: idToken,
        email: userCredential.user.email || cleanEmail,
        uid: userCredential.user.uid,
        emailVerified: userCredential.user.emailVerified,
      };
    } catch (err: any) {
      console.error('Firebase Auth sign-in error:', err);
      let message = 'Invalid admin credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please reset your password or try again later.';
      } else if (err.code === 'auth/user-disabled') {
        message = 'This admin account has been deactivated by Super Admin.';
      } else if (err.message) {
        message = err.message;
      }
      return { success: false, error: message };
    }
  }

  // Fallback for development/testing when Firebase environment variables are not yet configured
  // Calls the backend /api/auth/login directly
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password }),
    });
    const data = await response.json();
    if (data.success && data.token) {
      return {
        success: true,
        token: data.token,
        email: data.user?.email || cleanEmail,
        uid: data.user?.id || `dev-${cleanEmail}`,
      };
    }
    return { success: false, error: data.message || 'Authentication failed.' };
  } catch (netErr: any) {
    return { success: false, error: 'Network error communicating with authentication service.' };
  }
}

/**
 * Log out from Firebase Authentication
 */
export async function logoutWithFirebase(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign-out error:', err);
    }
  }
}

/**
 * Send password reset email via Firebase Auth
 */
export async function resetPasswordWithFirebase(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `Password reset link has been dispatched to ${cleanEmail}. Please check your inbox.`,
      };
    } catch (err: any) {
      console.error('Firebase password reset error:', err);
      let msg = 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No registered admin account found with this email.';
      } else if (err.message) {
        msg = err.message;
      }
      return { success: false, message: msg };
    }
  }

  return {
    success: true,
    message: `(Dev Mode) Password reset requested for ${cleanEmail}. In production with Firebase configured, a password reset link will be sent to your email.`,
  };
}

/**
 * Send email verification link to current authenticated user
 */
export async function sendEmailVerificationToUser(): Promise<{ success: boolean; message: string }> {
  if (isFirebaseConfigured && auth?.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
      return { success: true, message: 'Verification email sent. Please check your inbox.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send verification email.' };
    }
  }
  return { success: false, message: 'User not currently signed into Firebase Auth.' };
}

/**
 * Get current ID token (with optional force refresh)
 */
export async function getCurrentIdToken(forceRefresh = false): Promise<string | null> {
  if (isFirebaseConfigured && auth?.currentUser) {
    try {
      return await auth.currentUser.getIdToken(forceRefresh);
    } catch (err) {
      console.error('Failed to retrieve fresh Firebase ID token:', err);
      return null;
    }
  }
  return localStorage.getItem('olympus_token');
}

/**
 * Listen to Firebase Auth state transitions
 */
export function subscribeToFirebaseAuthState(callback: (user: FirebaseUser | null) => void) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
}
