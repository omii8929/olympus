# 🚀 OLYMPUS 2026 — Production Deployment & Universal QR Guide

Department of Electronics and Computer Engineering  
**Venue:** Idea Lab, SVERI's College of Engineering  
**Event Date:** 02 October 2026, 09:00 AM IST  

---

## 📋 1. Is the Site Ready to Deploy?
**YES! The site is 100% production-ready.**
- ✅ **Frontend Build:** Verified `tsc -b && vite build` completes with zero errors (`dist/` generated).
- ✅ **Backend Build:** Verified `tsc` completes with zero errors (`dist/` generated).
- ✅ **Database Schema:** Synchronized via Prisma with PostgreSQL (`Event`, `Registration`, `EventPaymentAudit`, `User`).
- ✅ **Multi-Tier Role Management:** `SUPER_ADMIN`, `ADMIN` (Staff), and `PARTICIPANT`.
- ✅ **Mandatory Registration Flow:** Arena 01 & Arena 02 registration with live payment QR, UPI copying, mandatory UTR verification, and screenshot upload & preview.
- ✅ **Full Admin Platform:** Payment Settings Tab, Audit History Tab, Staff Management Tab, Payment Verification with screenshot viewer.
- ✅ **Universal Non-Expiring QR Code Portal:** Live at `/qr` with one-click printable poster download.
- ✅ **Universal In-Browser Camera Scanner:** Live at `/scanner` with live camera video scan, laser HUD sweep, and image file upload scanner.

---

## 📱 2. Non-Expiring QR Code & Scanner Architecture

### Why This QR Code NEVER Expires:
1. **Direct Canonical URL Encoding:**  
   Most commercial QR generators use temporary dynamic redirect links that expire after 14 days or require paid subscriptions. The OLYMPUS QR Portal (`/qr`) encodes the **direct HTTPS domain URL** of your deployed site using the industry-standard `qrcode.react` with high-error-correction level (`Level H`).
2. **Works on ANY Network:**  
   Because it is a direct web URL, anyone on **Airtel 4G/5G, Jio, Vi, BSNL, College Wi-Fi, or home broadband** scanning with:
   - Native iPhone Camera
   - Android Native Camera
   - Google Lens
   - WhatsApp Camera / Web Scanner
   - Paytm / PhonePe Scanner  
   will immediately open the live OLYMPUS portal.
3. **Printable High-Res Poster Generator:**  
   From `/qr`, coordinators can click **"Download Printable Event Poster"** to generate a 1200×1600 px high-res graphic complete with OLYMPUS branding, ECE Department title, Idea Lab venue, and event date (02 October 2026).
4. **Built-In In-Browser Camera Scanner (`/scanner`):**  
   - Allows students and organizers to scan QR codes directly inside the browser using their device camera (front or back) or by uploading a saved screenshot.
   - Automatically detects OLYMPUS Team Passes (`OLYMPUS-...`) and opens the pass verification screen for gate check-in at Idea Lab.

---

## 🌐 3. Deployment Options

### Option A: Standard Cloud Deployment (Recommended & Free Tier Friendly)
1. **Database:** Create a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
   - Copy the connection string to `DATABASE_URL`.
2. **Backend (Express + Prisma):** Deploy on [Render](https://render.com) or [Railway](https://railway.app):
   - Root directory: `server`
   - Build Command: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - Start Command: `node dist/index.js`
   - Environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: Random 32+ character key
     - `PORT`: `5050` (or leave default assigned by platform)
     - `NODE_ENV`: `production`
   - Run seed once: `npm run prisma:seed`
3. **Frontend (Vite + React):** Deploy on [Vercel](https://vercel.com) or [Netlify](https://netlify.com):
   - Root directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment variable:
     - `VITE_API_URL`: Your deployed backend URL (e.g. `https://olympus-server.onrender.com/api`)

---

### Option B: All-in-One VPS / Single Instance (DigitalOcean / EC2 / Render Docker)
The backend Express server is already configured to serve the frontend `client/dist` bundle automatically if present!
1. Build both client and server:
   ```bash
   cd client && npm install && npm run build
   cd ../server && npm install && npx prisma generate && npx prisma db push && npm run prisma:seed && npm run build
   ```
2. Start the unified server:
   ```bash
   cd server && npm start
   ```
3. The whole platform (Frontend UI + API Backend + Static Uploads) will run on port `5050`!

---

## 🔑 4. Default Seeded Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@olympus.ece` | `Admin@123` |
| **Super Admin** | `omupotalkar25@coep.sveri.ac.in` | `Admin@123` |
| **Staff Admin** | `staff@olympus.ece` | `Staff@123` |

*(Note: Change passwords immediately in production via the Admin Dashboard Management tab).*
