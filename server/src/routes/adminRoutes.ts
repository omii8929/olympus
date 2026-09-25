import { Router } from 'express';
import {
  getAdminStats,
  getAdminRegistrations,
  exportRegistrationsCSV,
  updateRegistrationPaymentStatus,
} from '../controllers/adminController';
import {
  getAdminEventsPayment,
  getAdminEventPayment,
  updateEventPayment,
  uploadEventQR,
  removeEventQR,
  getPaymentAuditHistory,
  getAdminUsers,
  createAdminUser,
  updateAdminRole,
  toggleAdminStatus,
  deleteAdminUser,
} from '../controllers/eventPaymentController';
import { authenticateToken, requireAdmin, requireSuperAdmin } from '../middleware/auth';

const router = Router();

// Protect all admin routes
router.use(authenticateToken, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/registrations', getAdminRegistrations);
router.get('/export-csv', exportRegistrationsCSV);
router.patch('/registrations/:id/payment-status', updateRegistrationPaymentStatus);

// Event Payment Settings (SUPER_ADMIN for writes, ADMIN for reads)
router.get('/events/payment', getAdminEventsPayment);
router.get('/events/:eventId/payment', getAdminEventPayment);
router.put('/events/:eventId/payment', requireSuperAdmin, updateEventPayment);
router.patch('/events/:eventId/payment', requireSuperAdmin, updateEventPayment);
router.post('/events/:eventId/payment/qr', requireSuperAdmin, uploadEventQR);
router.delete('/events/:eventId/payment/qr', requireSuperAdmin, removeEventQR);

// Payment Audit History
router.get('/events/payment/history', getPaymentAuditHistory);
router.get('/events/:eventId/payment/history', getPaymentAuditHistory);

// Admin User Management (SUPER_ADMIN only)
router.get('/users', requireSuperAdmin, getAdminUsers);
router.post('/users', requireSuperAdmin, createAdminUser);
router.patch('/users/:id/role', requireSuperAdmin, updateAdminRole);
router.patch('/users/:id/status', requireSuperAdmin, toggleAdminStatus);
router.delete('/users/:id', requireSuperAdmin, deleteAdminUser);

export default router;
