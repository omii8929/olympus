import { initializeApp, cert, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import { prisma } from './db';

dotenv.config();

let isFirebaseConfigured = false;
let firebaseApp: App | null = null;

try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0]!;
    isFirebaseConfigured = true;
  } else {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      const formattedKey = privateKey.replace(/\\n/g, '\n');

      firebaseApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
      isFirebaseConfigured = true;
      console.log('✅ Firebase Admin SDK initialized with service account credentials.');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const keyInput = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      let serviceAccount: any;
      if (keyInput.startsWith('{')) {
        serviceAccount = JSON.parse(keyInput);
      } else {
        serviceAccount = require(keyInput);
      }

      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
      });
      isFirebaseConfigured = true;
      console.log('✅ Firebase Admin SDK initialized from service account JSON.');
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firebaseApp = initializeApp({
        credential: applicationDefault(),
      });
      isFirebaseConfigured = true;
      console.log('✅ Firebase Admin SDK initialized from application default credentials.');
    } else {
      console.warn(
        '⚠️ Firebase Admin credentials not found in environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).'
      );
      console.warn('⚠️ Server will operate with dev token verification until Firebase credentials are configured in .env.');
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
}

export { isFirebaseConfigured, firebaseApp };

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  role?: string;
  name?: string;
  emailVerified?: boolean;
}

/**
 * Verify Firebase ID Token
 */
export async function verifyFirebaseIdToken(token: string): Promise<VerifiedFirebaseUser | null> {
  if (!token) return null;

  if (isFirebaseConfigured && firebaseApp) {
    try {
      const auth = getAuth(firebaseApp);
      const decoded = await auth.verifyIdToken(token);
      return {
        uid: decoded.uid,
        email: decoded.email || '',
        role: (decoded.role as string) || (decoded.superAdmin ? 'SUPER_ADMIN' : decoded.admin ? 'ADMIN' : undefined),
        name: decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'Admin User'),
        emailVerified: decoded.email_verified || false,
      };
    } catch (err: any) {
      console.error('Firebase token verification failed:', err.message || err);
      return null;
    }
  }

  // Fallback for development/testing when Firebase cloud credentials are not yet set in .env
  try {
    const jwt = await import('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'olympus_ece_secret_jwt_key_2026_super_secure';
    const decoded = jwt.default.verify(token, secret) as any;
    if (decoded && decoded.email) {
      return {
        uid: decoded.firebaseUid || decoded.id || `dev-${decoded.email}`,
        email: decoded.email,
        role: decoded.role || 'ADMIN',
        name: decoded.name || decoded.email.split('@')[0],
      };
    }
  } catch {
    // Check if token is a base64 encoded JSON mock for integration testing
    try {
      const decodedJson = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (decodedJson && decodedJson.email && decodedJson.uid) {
        return decodedJson;
      }
    } catch {
      // Invalid token
    }
  }

  return null;
}

/**
 * Set custom claims for role-based authorization in Firebase Auth
 */
export async function setUserRoleClaim(uid: string, role: 'SUPER_ADMIN' | 'ADMIN'): Promise<void> {
  if (!isFirebaseConfigured || !firebaseApp || !uid) return;

  try {
    const auth = getAuth(firebaseApp);
    await auth.setCustomUserClaims(uid, {
      role,
      admin: true,
      superAdmin: role === 'SUPER_ADMIN',
    });
    console.log(`Custom claims set for UID ${uid}: role=${role}`);
  } catch (error) {
    console.error(`Failed to set custom claim for UID ${uid}:`, error);
  }
}

/**
 * Get Firebase Auth instance safely
 */
export function getFirebaseAuth() {
  if (isFirebaseConfigured && firebaseApp) {
    return getAuth(firebaseApp);
  }
  return null;
}

/**
 * Initialize / Seed the Temporary Initial Super Admin:
 * Email: omupotalkar25@coep.sveri.ac.in
 * Temporary Password: Sveri@123
 */
export async function seedInitialAdmin(): Promise<void> {
  const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL || 'omupotalkar25@coep.sveri.ac.in';
  const initialAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Sveri@123';
  const initialAdminName = 'Omu Potalkar (Super Admin)';

  console.log(`🔧 Ensuring initial Super Admin account exists: ${initialAdminEmail}`);

  let firebaseUid: string | null = null;

  // 1. Ensure user exists in Firebase Auth if Admin SDK is configured
  if (isFirebaseConfigured && firebaseApp) {
    try {
      const auth = getAuth(firebaseApp);
      try {
        const existingFirebaseUser = await auth.getUserByEmail(initialAdminEmail);
        firebaseUid = existingFirebaseUser.uid;
        await setUserRoleClaim(firebaseUid, 'SUPER_ADMIN');
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          const newFirebaseUser = await auth.createUser({
            email: initialAdminEmail,
            password: initialAdminPassword,
            displayName: initialAdminName,
            emailVerified: true,
          });
          firebaseUid = newFirebaseUser.uid;
          await setUserRoleClaim(firebaseUid, 'SUPER_ADMIN');
          console.log(`✅ Created initial admin in Firebase Auth: UID=${firebaseUid}`);
        } else {
          console.warn('Firebase getUser error:', err.message);
        }
      }
    } catch (fbErr) {
      console.warn('Could not provision initial admin in Firebase Auth directly:', fbErr);
    }
  }

  // 2. Ensure initial admin exists in PostgreSQL
  try {
    const bcrypt = await import('bcryptjs');
    const existingDbUser = await prisma.user.findUnique({
      where: { email: initialAdminEmail.toLowerCase() },
    });

    const passwordHash = await bcrypt.default.hash(initialAdminPassword, 10);

    if (existingDbUser) {
      await prisma.user.update({
        where: { id: existingDbUser.id },
        data: {
          role: 'SUPER_ADMIN',
          isActive: true,
          passwordHash,
          ...(firebaseUid ? { firebaseUid } : {}),
        },
      });
      console.log(`✅ Synchronized initial Super Admin in PostgreSQL (role=SUPER_ADMIN).`);
    } else {
      await prisma.user.create({
        data: {
          email: initialAdminEmail.toLowerCase(),
          name: initialAdminName,
          passwordHash,
          role: 'SUPER_ADMIN',
          isActive: true,
          ...(firebaseUid ? { firebaseUid } : {}),
        },
      });
      console.log(`✅ Provisioned initial Super Admin in PostgreSQL.`);
    }
  } catch (dbErr) {
    console.error('Failed to sync initial admin in PostgreSQL:', dbErr);
  }
}
