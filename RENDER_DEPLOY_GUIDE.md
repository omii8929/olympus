# 🚀 Deploying OLYMPUS Backend to Render

This guide explains how to deploy the OLYMPUS Express backend and PostgreSQL database to Render for free, and connect it to your live AWS Amplify frontend.

---

## ⚡ Quick 1-Click Blueprint Deployment

1. Go to **[Render Dashboard](https://dashboard.render.com/)** and log in.
2. Click the blue **"New +"** button in the top right, then select **"Blueprint"**.
3. Connect your GitHub repository: **`omii8929/olympus`**.
4. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **`olympus-backend-api`**: Node Web Service running `server`
   - **`olympus-db`**: Free PostgreSQL database (automatically sets `DATABASE_URL`)
5. Click **"Apply"** and wait 2-3 minutes for the build and deployment to complete.

---

## 🔑 Step 2: Seed Admin Accounts in Render

Once the backend service shows **"Live"**:
1. In the Render dashboard, click on your **`olympus-backend-api`** service.
2. Click the **"Shell"** tab on the left menu.
3. Run the seed command to create the default Super Admin and Staff accounts:
   ```bash
   npm run prisma:seed
   ```
4. Verify you see:
   ```
   Verified Super Admin: admin@olympus.ece [SUPER_ADMIN]
   Verified Staff Admin: staff@olympus.ece [ADMIN]
   ```

---

## 🔗 Step 3: Link Backend to AWS Amplify

Copy your live Render backend URL from the top of the service page (e.g. `https://olympus-backend-api.onrender.com`).

### Option A: Via Local Deploy Command (Instant)
1. Add the Render URL to your local `.env`:
   ```bash
   VITE_API_URL=https://olympus-backend-api.onrender.com/api
   ```
2. Run the deployment command:
   ```bash
   npm run deploy:amplify
   ```

### Option B: Via AWS Amplify Console
1. Go to **[AWS Amplify Console](https://console.aws.amazon.com/amplify/)**.
2. Open your `olympus-2026` app.
3. Navigate to **Rewrites and redirects** > **Edit**.
4. Add a rule above the catch-all rule:
   - **Source:** `/api/<*>`
   - **Target:** `https://olympus-backend-api.onrender.com/api/<*>`
   - **Type:** `200 (Rewrite)`
5. Save. All `/api` traffic from AWS Amplify is now automatically routed to Render!
