# 🚀 Complete Business Setup Guide - CoreLogic Labs

This guide covers everything needed to make your agency website **fully functional** for client quotations, payments, and project management.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup (.env file)

Create a `.env` file in the `backend/` directory with these variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL for CORS
FRONTEND_URL=https://your-domain.com
# If using Render: FRONTEND_URL=https://your-app-name.onrender.com

# MongoDB Configuration (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/corelogiclabs?retryWrites=true&w=majority

# JWT Configuration (Generate a strong random key)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Email Service (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-from-google
EMAIL_FROM=noreply@yourdomain.com

# PayPal Payment Configuration
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_MODE=sandbox
# Change to PAYPAL_MODE=live when ready for production
```

---

## 📧 Email Setup Instructions

### Using Gmail (Recommended for Testing)

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** (left sidebar)
3. Scroll to **App passwords**
4. Select **Mail** and **Windows Computer**
5. Google will generate a 16-character app password
6. Copy this password to `EMAIL_PASSWORD` in your `.env` file

### Using SendGrid (Recommended for Production)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key: **Settings** → **API Keys**
3. Use the API key as `EMAIL_PASSWORD`
4. Set `EMAIL_HOST=smtp.sendgrid.net`
5. Set `EMAIL_USER=apikey`

---

## 🗄️ MongoDB Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Sign up for free account
3. Create a new project
4. Create a cluster
5. Get connection string:
   - Click **Connect**
   - Choose **Drivers**
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database credentials
6. Paste into `MONGODB_URI` in `.env`

### Option 2: Local MongoDB

```bash
# Install MongoDB
# Then connect with:
MONGODB_URI=mongodb://localhost:27017/corelogiclabs
```

---

## 💳 PayPal Payment Setup

### Step 1: Create PayPal Business Account

1. Go to [paypal.com/business](https://paypal.com/business)
2. Sign up for **PayPal Business Account**
3. Verify your email and phone

### Step 2: Get API Credentials

1. Go to [developer.paypal.com/dashboard](https://developer.paypal.com/dashboard)
2. Sign in with your PayPal account
3. Navigate to **Apps & Credentials**
4. **IMPORTANT**: Make sure you're on the **Sandbox** tab (for testing)
5. Under **REST API apps**, you'll see your default app
6. Copy:
   - **Client ID** → `PAYPAL_CLIENT_ID`
   - **Secret** → `PAYPAL_CLIENT_SECRET`

### Step 3: Test with Sandbox

- Set `PAYPAL_MODE=sandbox` in `.env`
- Use PayPal test credentials for testing
- Create test buyers at [sandbox.paypal.com](https://sandbox.paypal.com)

### Step 4: Switch to Live (Production)

When ready for real payments:

1. Go back to [developer.paypal.com/dashboard](https://developer.paypal.com/dashboard)
2. Switch to **Live** tab
3. Copy your live credentials
4. Update `.env`:
   ```env
   PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_client_secret
   PAYPAL_MODE=live
   ```

---

## 🔐 JWT Secret Generation

Generate a strong random JWT secret:

### Windows PowerShell:
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Mac/Linux:
```bash
openssl rand -base64 32
```

---

## 🌐 API Endpoints - Quick Reference

### Quote Management (Public)
```
POST   /api/quotes              - Submit quote request
GET    /api/quotes              - Admin: Get all quotes (requires auth)
GET    /api/quotes/:id          - Admin: Get quote details
PATCH  /api/quotes/:id          - Admin: Update quote status
DELETE /api/quotes/:id          - Admin: Delete quote
```

### Contact Messages
```
POST   /api/contacts            - Submit contact message
GET    /api/contacts            - Admin: Get all messages
GET    /api/contacts/:id        - Admin: Get message details
```

### Projects
```
GET    /api/projects            - Admin: List projects
POST   /api/projects            - Admin: Create project
GET    /api/projects/:id        - Admin: Get project details
PATCH  /api/projects/:id        - Admin: Update project
DELETE /api/projects/:id        - Admin: Delete project
GET    /api/projects/:id/stats  - Admin: Get project statistics
```

### File Uploads
```
POST   /api/upload              - Upload files
GET    /api/upload/:fileId      - Download file
DELETE /api/upload/:fileId      - Delete file
```

### Payments
```
POST   /api/payments/create-order   - Create PayPal order
POST   /api/payments/capture        - Capture approved payment
GET    /api/payments                - Admin: List payments
GET    /api/payments/stats          - Admin: Payment statistics
```

### Analytics
```
GET    /api/analytics/dashboard     - Overall metrics
GET    /api/analytics/performance   - KPIs
GET    /api/analytics/clients       - Top clients
GET    /api/analytics/export        - Export data (JSON/CSV)
```

### Authentication
```
POST   /api/auth/register       - Create admin account
POST   /api/auth/login          - Login
POST   /api/auth/logout         - Logout
```

---

## 🧪 Testing the Quote Form

### Step 1: Verify Frontend Connection

1. Open developer console: **F12**
2. In the console, run:
```javascript
console.log(API_BASE_URL);
```
3. It should show: `http://localhost:5000/api` (or your deployed URL)

### Step 2: Test Quote Submission

1. Go to [http://localhost:3000](http://localhost:3000) or your deployed site
2. Scroll to **"Request a Custom Quote"** section
3. Fill out the form:
   - Name: Test Name
   - Agency: Test Agency
   - Email: test@example.com
   - Phone: (555) 123-4567
   - Services: Select at least one
   - Budget: Select a range
   - Details: Test details
4. Click **"Request Quote"**

### Step 3: Check for Confirmation

- You should see a **success notification**
- Check your email inbox for confirmation
- Check `/api/quotes` endpoint to see saved data

### Step 4: Verify Admin Access

1. Create admin account at `/api/auth/register`:
```json
{
  "email": "admin@yoursite.com",
  "password": "SecurePassword123",
  "name": "Admin User"
}
```

2. Login at `/api/auth/login`:
```json
{
  "email": "admin@yoursite.com",
  "password": "SecurePassword123"
}
```

3. View all quotes at `/api/quotes` (requires login token)

---

## 🚀 Deployment to Render.com

### Step 1: Prepare Your Code

```bash
cd your-project
git add .
git commit -m "Setup: Complete business configuration"
git push origin main
```

### Step 2: Create Render Service

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name**: corelogic-labs (or your name)
   - **Environment**: Node
   - **Build command**: `npm install`
   - **Start command**: `node server.js`
   - **Instance Type**: Free (or paid for better performance)

### Step 3: Set Environment Variables

1. In Render dashboard, go to your service
2. Click **Environment** tab
3. Add all variables from `.env` file:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`
   - `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE`
   - `FRONTEND_URL` (set to your Render URL)
   - Etc.

### Step 4: Update Frontend URL

1. Update `index.html`:
```javascript
window.API_BASE_URL = 'https://your-service-name.onrender.com/api'
```

2. Or use the auto-detection (if domain matches):
```javascript
window.API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : window.location.protocol + '//your-service-name.onrender.com/api';
```

### Step 5: Deploy Frontend

For hosting frontend, you have options:

**Option A: GitHub Pages (Free)**
- Push frontend to GitHub
- Enable GitHub Pages in repo settings

**Option B: Vercel (Free, Recommended)**
- Go to [vercel.com](https://vercel.com)
- Connect your GitHub repo
- Deploy in one click

**Option C: Render (Same as Backend)**
- Create another Render service for frontend
- Set build command: `npm build` (if using build tool)
- Or serve static files

---

## ✅ Full Functionality Checklist

After setup, verify all features work:

### Quote System ✅
- [ ] Quote form visible on homepage
- [ ] Form submission works without errors
- [ ] Admin receives notification email
- [ ] Submitter receives confirmation email
- [ ] Quote saved to database
- [ ] Admin can view all quotes
- [ ] Admin can update quote status

### Payment System ✅
- [ ] PayPal credentials configured
- [ ] Create order endpoint returns approval link
- [ ] Payment can be captured after approval
- [ ] Payment saved with correct status
- [ ] Project budget updates on successful payment

### Project Management ✅
- [ ] Admin can create projects
- [ ] Projects linked to quotes/payments
- [ ] Can add milestones to projects
- [ ] Can update project status
- [ ] Project statistics working

### File Upload ✅
- [ ] Can upload files (max 10MB)
- [ ] Files attached to projects
- [ ] Can download uploaded files
- [ ] Can delete files

### Analytics ✅
- [ ] Dashboard shows metrics
- [ ] Charts display data correctly
- [ ] Can export data as JSON/CSV
- [ ] Performance KPIs showing

### Email System ✅
- [ ] Quote confirmations sent
- [ ] Admin notifications working
- [ ] Contact form emails sending
- [ ] No email errors in logs

---

## 🔧 Troubleshooting

### Quote Form Not Submitting

**Check:**
1. Open console (F12)
2. Look for red errors
3. Verify `API_BASE_URL` is correct
4. Confirm backend is running

**Fix:**
```bash
cd backend
npm start
```

### Emails Not Sending

**Possible causes:**
1. Gmail: Enable "Less secure app access" (or use App Password)
2. Missing EMAIL_* variables in .env
3. Firewall blocking SMTP port 587

**Fix:**
1. Verify email credentials
2. Check logs: `npm start --verbose`
3. Ensure port 587 is open

### MongoDB Connection Error

**Fix:**
1. Check `MONGODB_URI` in .env
2. Verify database user credentials
3. Ensure IP whitelist includes your IP (MongoDB Atlas)

### PayPal Not Working

**Fix:**
1. Verify `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
2. Ensure `PAYPAL_MODE=sandbox` for testing
3. Check network tab for API errors

---

## 📞 Support URLs

- **PayPal Developer**: https://developer.paypal.com
- **MongoDB**: https://www.mongodb.com/docs/
- **Render Docs**: https://render.com/docs
- **SendGrid**: https://sendgrid.com/docs

---

## 🎉 You're Ready!

Your CoreLogic Labs agency website is now **fully functional** for:
- ✅ Quote requests with email notifications
- ✅ Customer payments via PayPal
- ✅ Project management and tracking
- ✅ File uploads and management
- ✅ Analytics and reporting
- ✅ Admin dashboard

**Next Steps:**
1. Test all features in sandbox/development
2. Configure live payment credentials when ready
3. Add your contact information to footer
4. Customize branding and colors
5. Launch and start accepting quotes!

---

**Last Updated**: January 6, 2026
**Status**: Production Ready ✅
