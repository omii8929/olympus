import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { verifyFirebaseIdToken } from '../config/firebase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    firebaseUid?: string;
  };
}

/**
 * Authenticates incoming requests using Firebase Authentication ID Token
 * Sent in header: Authorization: Bearer <Firebase_ID_Token>
 */
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No Firebase ID token provided.' });
    return;
  }

  try {
    const verified = await verifyFirebaseIdToken(token);

    if (!verified || !verified.email) {
      res.status(401).json({ success: false, message: 'Invalid, malformed, or expired Firebase ID token.' });
      return;
    }

    // Query user record in PostgreSQL by firebaseUid or email
    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(verified.uid ? [{ firebaseUid: verified.uid }] : []),
          { email: verified.email.toLowerCase() },
        ],
      },
    });

    if (dbUser) {
      // Check if user is active
      if (!dbUser.isActive) {
        res.status(403).json({ success: false, message: 'Access denied: This admin account has been deactivated.' });
        return;
      }

      // Link firebaseUid if missing
      if (!dbUser.firebaseUid && verified.uid) {
        try {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { firebaseUid: verified.uid },
          });
        } catch {
          // ignore concurrent update collision
        }
      }

      req.user = {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.name,
        firebaseUid: verified.uid,
      };
    } else {
      // If user is verified in Firebase Auth but not yet stored in PostgreSQL,
      // create a synchronized record if they have admin claims or initial admin email
      const isInitialAdmin = verified.email.toLowerCase() === 'omupotalkar25@coep.sveri.ac.in';
      const role = isInitialAdmin || verified.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : verified.role === 'ADMIN' ? 'ADMIN' : 'PARTICIPANT';

      const newUser = await prisma.user.create({
        data: {
          email: verified.email.toLowerCase(),
          name: verified.name || verified.email.split('@')[0],
          firebaseUid: verified.uid,
          role: role as any,
          isActive: true,
        },
      });

      req.user = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        firebaseUid: verified.uid,
      };
    }

    next();
  } catch (err: any) {
    console.error('Authentication middleware error:', err);
    res.status(403).json({ success: false, message: 'Forbidden: Token verification failed.' });
    return;
  }
};

/**
 * Requires ADMIN or SUPER_ADMIN role. Normal participants are rejected.
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  const role = req.user.role;
  const isSuper = role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN';

  if (!isSuper && !isAdmin) {
    res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
    return;
  }

  next();
};

/**
 * Requires SUPER_ADMIN role. Standard admins and normal users are rejected.
 */
export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    res.status(403).json({ success: false, message: 'Access denied: Super Admin privileges required.' });
    return;
  }

  next();
};
