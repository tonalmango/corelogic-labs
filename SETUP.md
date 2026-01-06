# 📋 Setup & Configuration Guide

## Prerequisites

- **Node.js** v20+
- **MongoDB** v8.2+ (Local or MongoDB Atlas)
- **PayPal Business Account** (for payments)
- **Gmail Account** (for email notifications)

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone <your-repo>
cd Agency/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 2. Environment Variables

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/corelogiclabs

# Security
JWT_SECRET=<generate-strong-32-char-random-string>

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<google-app-password>
EMAIL_FROM=noreply@yourdomain.com

# PayPal
PAYPAL_CLIENT_ID=<from-developer.paypal.com>
PAYPAL_CLIENT_SECRET=<from-developer.paypal.com>
PAYPAL_MODE=sandbox
```

### 3. Start Development Server

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 4. Create Admin Account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@yourdomain.com",
    "password": "SecurePassword123!"
  }'
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. Visit [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create free account and cluster
3. Get connection string: **Connect** → **Drivers**
4. Replace `<username>` and `<password>` with your DB user credentials
5. Add to `.env` as `MONGODB_URI`

### Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/corelogiclabs
```

---

## 📧 Email Configuration

### Gmail (Testing)

1. Enable 2-Step Verification at [myaccount.google.com](https://myaccount.google.com/security)
2. Go to **App Passwords**
3. Select **Mail** and **Windows Computer**
4. Copy generated 16-char password
5. Add to `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=<16-char-app-password>
   ```

### SendGrid (Production)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key: **Settings** → **API Keys**
3. Add to `.env`:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_USER=apikey
   EMAIL_PASSWORD=<your-sendgrid-api-key>
   ```

---

## 💳 PayPal Setup

### Get Credentials

1. Visit [developer.paypal.com/dashboard](https://developer.paypal.com/dashboard)
2. Sign in with PayPal account
3. Go to **Apps & Credentials**
4. Ensure you're on **Sandbox** tab (for testing)
5. Copy:
   - **Client ID** → `PAYPAL_CLIENT_ID`
   - **Secret** → `PAYPAL_CLIENT_SECRET`

### Test Mode (Sandbox)

```env
PAYPAL_MODE=sandbox
```

### Production Mode

When ready for live payments:
1. Switch to **Live** tab in developer dashboard
2. Copy live credentials
3. Update `.env`:
   ```env
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=<live-client-id>
   PAYPAL_CLIENT_SECRET=<live-client-secret>
   ```

---

## 🔐 JWT Secret Generation

### Windows PowerShell

```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Mac/Linux

```bash
openssl rand -base64 32
```

---

## 📦 Project Structure

```
Agency/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── logger.js
│   ├── controllers/
│   │   ├── quoteController.js
│   │   ├── contactController.js
│   │   ├── projectController.js
│   │   ├── paymentController.js
│   │   ├── analyticsController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Quote.js
│   │   ├── Contact.js
│   │   ├── Project.js
│   │   ├── Payment.js
│   │   └── User.js
│   ├── routes/
│   │   ├── quoteRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── authRoutes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── admin.html
│   ├── script.js
│   ├── styles.css
│   └── favicon.svg
├── README.md
├── SETUP.md (this file)
└── API.md
```

---

## 🧪 Testing the System

### Test Quote Submission

1. Open [http://localhost:5000](http://localhost:5000)
2. Scroll to **"Request a Custom Quote"** section
3. Fill form and submit
4. Check console for success notification
5. Verify confirmation email arrived

### Test Admin Login

1. Go to [http://localhost:5000/admin.html](http://localhost:5000/admin.html)
2. Login with admin credentials created earlier
3. View submitted quotes
4. Update quote status

### Test Payment Flow

1. In admin panel, create a project
2. Submit quote request
3. Link quote to project
4. Click "Pay Now"
5. Approve PayPal order
6. Verify payment captured and saved

---

## 🚀 Deployment (Render.com)

### Step 1: Push to GitHub

```bash
cd Agency
git add .
git commit -m "Deploy: CoreLogic Labs v1.0"
git push origin main
```

### Step 2: Create Render Service

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click **New** → **Web Service**
4. Connect your repository
5. Configure:
   - **Name**: corelogic-labs
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

### Step 3: Add Environment Variables

In Render dashboard → **Environment**:
- Copy all variables from `.env` file
- Ensure `FRONTEND_URL` matches your Render domain
- Save and redeploy

### Step 4: Deploy Frontend

**Option A: GitHub Pages**
- Push frontend to GitHub
- Enable Pages in repo settings

**Option B: Vercel** (Recommended)
- Visit [vercel.com](https://vercel.com)
- Import your GitHub repo
- Deploy in one click

**Option C: Render Static Site**
- Create another Render service for frontend
- Build command: `npm run build` (if applicable)

---

## 📱 Frontend Configuration

Update API base URL in `frontend/index.html`:

```javascript
// Auto-detect (recommended)
window.API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : window.location.protocol + '//corelogic-labs.onrender.com/api';

// Or hardcode for production
window.API_BASE_URL = 'https://your-domain.com/api';
```

---

## ✅ Pre-Launch Checklist

- [ ] Create `.env` file with all variables
- [ ] Test quote form locally
- [ ] Verify confirmation emails sending
- [ ] Create admin account
- [ ] Test admin login and quote viewing
- [ ] Update footer with your contact info
- [ ] Customize colors and branding
- [ ] Deploy backend to Render
- [ ] Deploy frontend (Vercel/GitHub Pages)
- [ ] Configure live PayPal credentials
- [ ] Test entire flow on production domain
- [ ] Set up database backups

---

## 🆘 Troubleshooting

### Quote Form Not Submitting
- Check browser console (F12) for errors
- Verify `API_BASE_URL` is correct
- Ensure backend is running

### Emails Not Sending
- Verify Gmail app password (not regular password)
- Check EMAIL_* variables in `.env`
- Ensure port 587 is accessible
- Check spam folder

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env`
- Check database credentials
- Whitelist your IP in MongoDB Atlas

### PayPal Not Working
- Ensure you're using Sandbox credentials for testing
- Verify `PAYPAL_MODE=sandbox`
- Check network tab for API errors

---

## 📞 Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PayPal Developer](https://developer.paypal.com/)
- [Render Documentation](https://render.com/docs)

---

**Version**: 1.0  
**Last Updated**: January 6, 2026  
**Status**: ✅ Production Ready
