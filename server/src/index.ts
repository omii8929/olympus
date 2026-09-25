import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import registrationRoutes from './routes/registrationRoutes';
import announcementRoutes from './routes/announcementRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import submissionRoutes from './routes/submissionRoutes';
import resultRoutes from './routes/resultRoutes';
import adminRoutes from './routes/adminRoutes';
import path from 'path';
import fs from 'fs';
import eventRoutes from './routes/eventRoutes';
import { errorHandler } from './middleware/error';
import { seedInitialAdmin } from './config/firebase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Initialize initial super admin asynchronously
seedInitialAdmin().catch((err) => {
  console.error('Initial admin seeding notice:', err);
});

// Ensure upload folders exist
const uploadsDir = path.join(__dirname, '../uploads');
const qrDir = path.join(uploadsDir, 'qr');
const screenshotsDir = path.join(uploadsDir, 'screenshots');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Security and middleware
app.use(
  cors({
    origin: '*', // Allow frontend Vite during development/production
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    event: 'OLYMPUS 2026',
    department: 'ECE DEPARTMENT',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend client build in production if available
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`⚡ [OLYMPUS Backend] Running on http://localhost:${PORT}`);
  console.log(`⚡ [Database] PostgreSQL connected via Prisma`);
});

export default app;
