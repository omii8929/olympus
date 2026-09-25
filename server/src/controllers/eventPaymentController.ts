import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { isFirebaseConfigured, firebaseApp, setUserRoleClaim, getFirebaseAuth } from '../config/firebase';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const QR_DIR = path.join(UPLOADS_DIR, 'qr');

if (!fs.existsSync(QR_DIR)) {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

// Map event key (ID, slug, or eventType code) to Event record
export const resolveEvent = async (eventKey: string) => {
  const normalized = eventKey.trim().toUpperCase();

  // Try direct code match or UUID match
  let event = await prisma.event.findFirst({
    where: {
      OR: [
        { id: eventKey.trim() },
        { code: normalized },
      ],
    },
  });

  if (event) return event;

  // Handle category / track aliases
  if (normalized === 'DRONE_VIDEO' || normalized === 'DRONE_POSTER' || normalized === 'ENGINEERS_GOT_TALENT' || normalized === 'EVENT_2') {
    event = await prisma.event.findFirst({
      where: { code: 'DRONE_EVENT' },
    });
  } else if (normalized === 'FULL_STACK' || normalized === 'FULL_STACK_AI' || normalized === 'EVENT_1') {
    event = await prisma.event.findFirst({
      where: { code: 'FULL_STACK_AI' },
    });
  }

  return event;
};

// 1. PUBLIC: Get all events payment summary
export const getAllEventsPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        category: true,
        registrationFee: true,
        paymentMobile: true,
        upiId: true,
        qrCodeUrl: true,
        paymentInstructions: true,
        paymentEnabled: true,
      },
    });

    res.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve events payment configuration.', error: error.message });
  }
};

// 2. PUBLIC: Get payment details for a specific event
export const getEventPaymentPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventKey } = req.params;
    if (!eventKey) {
      res.status(400).json({ success: false, message: 'Event identifier is required.' });
      return;
    }

    const event = await resolveEvent(eventKey);

    if (!event) {
      res.status(404).json({ success: false, message: `Event not found for '${eventKey}'.` });
      return;
    }

    res.json({
      success: true,
      data: {
        id: event.id,
        code: event.code,
        name: event.name,
        category: event.category,
        registrationFee: event.registrationFee,
        paymentMobile: event.paymentMobile,
        upiId: event.upiId,
        qrCodeUrl: event.qrCodeUrl,
        paymentInstructions: event.paymentInstructions,
        paymentEnabled: event.paymentEnabled,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve event payment info.', error: error.message });
  }
};

// 3. ADMIN: Get all event payment settings with audit summaries
export const getAdminEventsPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: {
            teams: true,
            registrations: true,
            auditLogs: true,
          },
        },
      },
    });

    res.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin payment settings.', error: error.message });
  }
};

// 4. ADMIN: Get single event payment settings
export const getAdminEventPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving event payment.', error: error.message });
  }
};

// 5. SUPER_ADMIN: Update payment details for ONLY that event
export const updateEventPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const {
      registrationFee,
      paymentMobile,
      upiId,
      paymentInstructions,
      paymentEnabled,
      qrCodeUrl,
    } = req.body;

    const existing = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    const adminEmail = req.user?.email || 'admin@olympus.ece';
    const adminId = req.user?.id;
    const adminFirebaseUid = req.user?.firebaseUid || null;

    // Detect changes and generate audit records
    const auditEntries: Array<{
      eventId: string;
      adminId?: string;
      adminFirebaseUid?: string | null;
      adminEmail: string;
      changedField: string;
      previousValue?: string;
      newValue?: string;
    }> = [];

    if (registrationFee !== undefined && Number(registrationFee) !== existing.registrationFee) {
      auditEntries.push({
        eventId,
        adminId,
        adminFirebaseUid,
        adminEmail,
        changedField: 'Registration Fee',
        previousValue: `₹${existing.registrationFee}`,
        newValue: `₹${registrationFee}`,
      });
    }

    if (paymentMobile !== undefined && paymentMobile.trim() !== existing.paymentMobile) {
      auditEntries.push({
        eventId,
        adminId,
        adminFirebaseUid,
        adminEmail,
        changedField: 'Payment Mobile Number',
        previousValue: existing.paymentMobile,
        newValue: paymentMobile.trim(),
      });
    }

    if (upiId !== undefined && upiId.trim() !== existing.upiId) {
      auditEntries.push({
        eventId,
        adminId,
        adminFirebaseUid,
        adminEmail,
        changedField: 'UPI ID',
        previousValue: existing.upiId,
        newValue: upiId.trim(),
      });
    }

    if (paymentInstructions !== undefined && paymentInstructions.trim() !== (existing.paymentInstructions || '')) {
      auditEntries.push({
        eventId,
        adminId,
        adminFirebaseUid,
        adminEmail,
        changedField: 'Payment Instructions',
        previousValue: existing.paymentInstructions || '(empty)',
        newValue: paymentInstructions.trim(),
      });
    }

    if (paymentEnabled !== undefined && Boolean(paymentEnabled) !== existing.paymentEnabled) {
      auditEntries.push({
        eventId,
        adminId,
        adminFirebaseUid,
        adminEmail,
        changedField: 'Payment Status',
        previousValue: existing.paymentEnabled ? 'ACTIVE (ON)' : 'DISABLED (OFF)',
        newValue: paymentEnabled ? 'ACTIVE (ON)' : 'DISABLED (OFF)',
      });
    }

    if (qrCodeUrl !== undefined && qrCodeUrl !== existing.qrCodeUrl) {
      auditEntries.push({
        eventId,
        adminId,
        adminFirebaseUid,
        adminEmail,
        changedField: 'QR Code Reference',
        previousValue: existing.qrCodeUrl || '(none)',
        newValue: qrCodeUrl || '(removed)',
      });
    }

    // Execute update and audit insert inside a single database transaction
    const updated = await prisma.$transaction(async (tx) => {
      if (auditEntries.length > 0) {
        await tx.eventPaymentAudit.createMany({
          data: auditEntries,
        });
      }

      return await tx.event.update({
        where: { id: eventId },
        data: {
          ...(registrationFee !== undefined && { registrationFee: Math.max(0, Number(registrationFee)) }),
          ...(paymentMobile !== undefined && { paymentMobile: paymentMobile.trim() }),
          ...(upiId !== undefined && { upiId: upiId.trim() }),
          ...(paymentInstructions !== undefined && { paymentInstructions: paymentInstructions.trim() }),
          ...(paymentEnabled !== undefined && { paymentEnabled: Boolean(paymentEnabled) }),
          ...(qrCodeUrl !== undefined && { qrCodeUrl: qrCodeUrl ? qrCodeUrl.trim() : null }),
          lastUpdatedBy: adminEmail,
        },
      });
    });

    res.json({
      success: true,
      message: `Payment configuration for ${updated.name} updated successfully.`,
      data: updated,
      changesCount: auditEntries.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update payment settings.', error: error.message });
  }
};

// 6. SUPER_ADMIN: Replace QR Code Image with file upload / base64 validation
export const uploadEventQR = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { imageBase64, filename } = req.body;

    if (!imageBase64) {
      res.status(400).json({ success: false, message: 'Image data is required.' });
      return;
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    // Validate MIME type
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({
        success: false,
        message: 'Invalid base64 image format. Must be data URL (e.g. data:image/png;base64,...).',
      });
      return;
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];
    const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

    if (!allowedMime.includes(mimeType)) {
      res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPG, JPEG, PNG, WEBP, and SVG are accepted.',
      });
      return;
    }

    // Validate size (max 10MB)
    const buffer = Buffer.from(base64Data, 'base64');
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (buffer.length > MAX_SIZE) {
      res.status(400).json({
        success: false,
        message: `File size exceeds the 10 MB limit (File size: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB).`,
      });
      return;
    }

    // Determine extension
    let ext = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('svg')) ext = 'svg';

    const safeFilename = `qr-${event.code.toLowerCase()}-${Date.now()}.${ext}`;
    const filePath = path.join(QR_DIR, safeFilename);

    fs.writeFileSync(filePath, buffer);
    const newQrUrl = `/uploads/qr/${safeFilename}`;

    // Clean up previous custom uploaded file if applicable
    if (event.qrCodeUrl && event.qrCodeUrl.startsWith('/uploads/qr/qr-') && !event.qrCodeUrl.includes('qr-event-1') && !event.qrCodeUrl.includes('qr-event-2')) {
      const oldPath = path.join(__dirname, '../../', event.qrCodeUrl);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('Could not remove previous QR file:', e);
        }
      }
    }

    const adminEmail = req.user?.email || 'admin@olympus.ece';
    const adminId = req.user?.id;
    const adminFirebaseUid = req.user?.firebaseUid || null;

    // Update event record and add audit entry
    const updated = await prisma.$transaction(async (tx) => {
      await tx.eventPaymentAudit.create({
        data: {
          eventId,
          adminId,
          adminFirebaseUid,
          adminEmail,
          changedField: 'Payment QR Code',
          previousValue: event.qrCodeUrl || '(none)',
          newValue: newQrUrl,
        },
      });

      return await tx.event.update({
        where: { id: eventId },
        data: {
          qrCodeUrl: newQrUrl,
          lastUpdatedBy: adminEmail,
        },
      });
    });

    res.json({
      success: true,
      message: `QR code successfully replaced for ${updated.name}.`,
      data: {
        qrCodeUrl: updated.qrCodeUrl,
        event: updated,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to upload QR code.', error: error.message });
  }
};

// 7. SUPER_ADMIN: Remove QR Code
export const removeEventQR = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    // Clean up file if custom uploaded
    if (event.qrCodeUrl && event.qrCodeUrl.startsWith('/uploads/qr/') && !event.qrCodeUrl.includes('qr-event-1') && !event.qrCodeUrl.includes('qr-event-2')) {
      const oldPath = path.join(__dirname, '../../', event.qrCodeUrl);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('Could not remove QR file:', e);
        }
      }
    }

    const adminEmail = req.user?.email || 'admin@olympus.ece';
    const adminId = req.user?.id;
    const adminFirebaseUid = req.user?.firebaseUid || null;

    const updated = await prisma.$transaction(async (tx) => {
      await tx.eventPaymentAudit.create({
        data: {
          eventId,
          adminId,
          adminFirebaseUid,
          adminEmail,
          changedField: 'Payment QR Code',
          previousValue: event.qrCodeUrl || '(none)',
          newValue: '(removed)',
        },
      });

      return await tx.event.update({
        where: { id: eventId },
        data: {
          qrCodeUrl: null,
          lastUpdatedBy: adminEmail,
        },
      });
    });

    res.json({
      success: true,
      message: `QR code removed for ${updated.name}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to remove QR code.', error: error.message });
  }
};

// 8. ADMIN / SUPER_ADMIN: Get Payment Audit History
export const getPaymentAuditHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const whereClause: any = {};

    if (eventId && eventId !== 'all') {
      whereClause.eventId = eventId;
    }

    const history = await prisma.eventPaymentAudit.findMany({
      where: whereClause,
      include: {
        event: {
          select: { id: true, code: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ success: true, count: history.length, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve payment audit history.', error: error.message });
  }
};

// 9. SUPER_ADMIN: Manage Admins (list & add)
// 9. SUPER_ADMIN: Manage Admins (list, add, update role, deactivate, delete)
export const getAdminUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['SUPER_ADMIN', 'ADMIN'] },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        firebaseUid: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to list admin users.', error: error.message });
  }
};

export const createAdminUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;
    const bcrypt = await import('bcryptjs');

    if (!email || !password || !name) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      res.status(400).json({ success: false, message: 'An admin or user with this email already exists.' });
      return;
    }

    const assignedRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';
    let firebaseUid: string | null = null;

    // Create in Firebase Auth if Admin SDK is configured
    const auth = getFirebaseAuth();
    if (auth) {
      try {
        const fbUser = await auth.createUser({
          email: normalizedEmail,
          password: password,
          displayName: name.trim(),
          emailVerified: true,
        });
        firebaseUid = fbUser.uid;
        await setUserRoleClaim(firebaseUid, assignedRole);
      } catch (fbErr: any) {
        console.warn('Firebase Auth user creation notice:', fbErr.message);
        if (fbErr.code === 'auth/email-already-exists') {
          try {
            const existingFb = await auth.getUserByEmail(normalizedEmail);
            firebaseUid = existingFb.uid;
            await setUserRoleClaim(firebaseUid, assignedRole);
          } catch {
            // ignore
          }
        } else {
          res.status(400).json({ success: false, message: `Firebase Auth error: ${fbErr.message}` });
          return;
        }
      }
    }

    const passwordHash = await bcrypt.default.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        passwordHash,
        firebaseUid,
        role: assignedRole,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        firebaseUid: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `Admin account for ${newUser.email} created successfully with role ${newUser.role}.`,
      data: newUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create admin user.', error: error.message });
  }
};

export const updateAdminRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role. Must be ADMIN or SUPER_ADMIN.' });
      return;
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'Admin user not found.' });
      return;
    }

    // Update role in PostgreSQL
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true, isActive: true, firebaseUid: true },
    });

    // Update Firebase Custom Claims
    if (updated.firebaseUid) {
      await setUserRoleClaim(updated.firebaseUid, role);
    }

    res.json({ success: true, message: `Admin role updated to ${role}.`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update admin role.', error: error.message });
  }
};

export const toggleAdminStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'Admin user not found.' });
      return;
    }

    // Prevent deactivating own account
    if (req.user?.id === id) {
      res.status(400).json({ success: false, message: 'You cannot deactivate your own admin account.' });
      return;
    }

    // Prevent deactivating initial admin
    if (targetUser.email.toLowerCase() === 'omupotalkar25@coep.sveri.ac.in') {
      res.status(400).json({ success: false, message: 'The primary Super Admin account cannot be deactivated.' });
      return;
    }

    const newStatus = !targetUser.isActive;

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: newStatus },
      select: { id: true, email: true, name: true, role: true, isActive: true, firebaseUid: true },
    });

    // Update Firebase Auth disabled state if configured
    const auth = getFirebaseAuth();
    if (updated.firebaseUid && auth) {
      try {
        await auth.updateUser(updated.firebaseUid, { disabled: !newStatus });
      } catch (fbErr: any) {
        console.warn('Firebase updateUser disabled warning:', fbErr.message);
      }
    }

    res.json({
      success: true,
      message: `Admin account has been ${newStatus ? 'activated' : 'deactivated'}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to toggle admin status.', error: error.message });
  }
};

export const deleteAdminUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'Admin user not found.' });
      return;
    }

    if (req.user?.id === id) {
      res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
      return;
    }

    if (targetUser.email.toLowerCase() === 'omupotalkar25@coep.sveri.ac.in') {
      res.status(400).json({ success: false, message: 'The primary Super Admin account cannot be deleted.' });
      return;
    }

    // Delete from Firebase Auth
    const auth = getFirebaseAuth();
    if (targetUser.firebaseUid && auth) {
      try {
        await auth.deleteUser(targetUser.firebaseUid);
      } catch (fbErr: any) {
        console.warn('Firebase deleteUser warning:', fbErr.message);
      }
    }

    // Delete from PostgreSQL
    await prisma.user.delete({ where: { id } });

    res.json({ success: true, message: `Admin ${targetUser.email} has been deleted successfully.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete admin user.', error: error.message });
  }
};
