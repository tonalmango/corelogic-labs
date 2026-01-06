# 🚀 New Features Setup Guide - CoreLogic Labs

## Overview
This guide will help you set up the newly added features:
1. Project Management System
2. File Upload System
3. Stripe Payment Integration
4. Advanced Analytics Dashboard
5. Favicon

---

## 📋 Prerequisites

Before setting up, ensure you have:
- ✅ Node.js v18+ installed
- ✅ MongoDB Atlas account (already configured)
- ✅ Render.com account (backend already deployed)
- ✅ Gmail or SendGrid for emails (already configured)

---

## 🆕 What's New

### 1. Project Management System ✅
**Purpose:** Track ongoing client projects with milestones, progress, and status updates.

**New API Endpoints:**
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/milestones` - Add milestones
- `POST /api/projects/:id/notes` - Add project notes

**Models Created:**
- `backend/models/Project.js`

**Features:**
- Project status tracking (planning, in-progress, review, completed)
- Progress percentage (0-100%)
- Budget tracking with deposits
- Milestone management
- Project notes/comments
- File attachments

---

### 2. File Upload System ✅
**Purpose:** Allow clients to upload design assets, documents, and images.

**New API Endpoints:**
- `POST /api/upload/project/:projectId` - Upload files to project
- `POST /api/upload/quote/:quoteId` - Upload files to quote
- `GET /api/upload/file/:filename` - Download file
- `DELETE /api/upload/project/:projectId/file/:fileId` - Delete file

**Files Created:**
- `backend/middleware/uploadMiddleware.js`
- `backend/routes/uploadRoutes.js`

**Configuration:**
- Max file size: 10MB per file
- Max files per upload: 10
- Allowed types: images, PDFs, docs, archives, design files (AI, PSD, SVG)
- Storage: Local `/uploads` folder (auto-created)

**Production Note:**
For production, consider upgrading to cloud storage (AWS S3, Cloudinary) for better scalability.

---

### 3. Stripe Payment Integration ✅
**Purpose:** Accept deposits and payments via Stripe.

**New API Endpoints:**
- `POST /api/payments/create-intent` - Create payment
- `POST /api/payments/webhook` - Stripe webhook (auto-updates)
- `GET /api/payments` - List all payments
- `POST /api/payments/manual` - Record manual payments

**Models Created:**
- `backend/models/Payment.js`

**Setup Required:**

#### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Sign up for a free account
3. Complete account verification

#### Step 2: Get API Keys
1. Visit https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (pk_test_...)
3. Copy your **Secret key** (sk_test_...)

#### Step 3: Add to Environment Variables
Update your `.env` file on Render.com:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Step 4: Configure Webhook (Optional - for automatic updates)
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://corelogic-labs.onrender.com/api/payments/webhook`
4. Events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret → Add to `.env` as `STRIPE_WEBHOOK_SECRET`

#### Step 5: Install Stripe Package
```bash
cd backend
npm install stripe
```

---

### 4. Advanced Analytics Dashboard ✅
**Purpose:** Comprehensive metrics and reporting for business insights.

**New API Endpoints:**
- `GET /api/analytics/dashboard` - Complete dashboard data
- `GET /api/analytics/performance` - Performance metrics
- `GET /api/analytics/clients` - Client insights
- `GET /api/analytics/export` - Export data (JSON/CSV)

**Files Created:**
- `backend/controllers/analyticsController.js`
- `backend/routes/analyticsRoutes.js`

**Features:**
- Overview metrics (quotes, projects, revenue, conversion rate)
- Quote analytics by status and service
- Monthly trends and charts
- Revenue tracking
- Client acquisition metrics
- Performance KPIs
- Data export

**Query Parameters:**
```http
GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31
GET /api/analytics/export?format=csv
```

---

### 5. Favicon ✅
**Purpose:** Display custom icon in browser tabs.

**Files Created:**
- `frontend/favicon.svg` - Custom SVG icon

**What Changed:**
- Added `<link rel="icon" type="image/svg+xml" href="favicon.svg">` to:
  - `frontend/index.html`
  - `frontend/admin.html`

**Icon Design:**
- Purple circle background (#6366f1)
- White "CL" letters (CoreLogic Labs)

---

## 🔧 Deployment Steps

### Step 1: Install New Dependencies
```bash
cd backend
npm install @paypal/checkout-server-sdk
```

### Step 2: Update Environment Variables on Render
1. Go to https://dashboard.render.com
2. Select your `corelogic-labs` service
3. Click **Environment** tab
4. Add these new variables:

```
PAYPAL_CLIENT_ID = your_actual_client_id
PAYPAL_CLIENT_SECRET = your_actual_client_secret
PAYPAL_MODE = sandbox
```

### Step 3: Deploy Updated Code
```bash
# Commit all changes
git add .
git commit -m "feat: add project management, file uploads, payments, analytics"
git push origin main
```

Render will automatically redeploy your backend.

### Step 4: Deploy Frontend Updates
1. Go to your frontend Static Site on Render
2. Click **Manual Deploy** → **Clear build cache & deploy**

---

## 🧪 Testing New Features

### Test Project Management
```bash
# Create a new project
curl -X POST https://corelogic-labs.onrender.com/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Test Project",
    "client": {
      "name": "John Doe",
      "email": "john@test.com"
    },
    "services": ["Custom Website Design"],
    "budget": { "total": 5000 }
  }'
```

### Test File Upload
```bash
# Upload a file to project
curl -X POST https://corelogic-labs.onrender.com/api/upload/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@/path/to/file.pdf"
```

### Test Payment Intent
```bash
# Create payment
curl -X POST https://corelogic-labs.onrender.com/api/payments/create-order \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "projectId": "PROJECT_ID",
    "customerEmail": "test@example.com"
  }'
```

### Test Analytics
```bash
# Get dashboard analytics
curl https://corelogic-labs.onrender.com/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 File Structure Updates

```
Agency/
├── backend/
│   ├── controllers/
│   │   ├── projectController.js        ← NEW
│   │   ├── paymentController.js        ← NEW
│   │   └── analyticsController.js      ← NEW
│   ├── middleware/
│   │   └── uploadMiddleware.js         ← NEW
│   ├── models/
│   │   ├── Project.js                  ← NEW
│   │   └── Payment.js                  ← NEW
│   ├── routes/
│   │   ├── projectRoutes.js            ← NEW
│   │   ├── uploadRoutes.js             ← NEW
│   │   ├── paymentRoutes.js            ← NEW
│   │   └── analyticsRoutes.js          ← NEW
│   ├── uploads/                        ← NEW (auto-created)
│   ├── package.json                    ← UPDATED (added PayPal)
│   ├── server.js                       ← UPDATED (added routes)
│   └── .env.example                    ← UPDATED (added PayPal vars)
├── frontend/
│   ├── favicon.svg                     ← NEW
│   ├── index.html                      ← UPDATED (added favicon)
│   └── admin.html                      ← UPDATED (added favicon)
├── API_DOCUMENTATION.md                ← NEW
└── SETUP_GUIDE.md                      ← NEW (this file)
```

---

## 🔑 Important Notes

### Security
- ✅ All file uploads are protected by JWT authentication
- ✅ File size limited to 10MB per file
- ✅ File type validation (only safe types allowed)
- ✅ PayPal order signature verification

### Payments
- 🧪 Currently using **PayPal Sandbox Mode**
- 💳 Can test with real PayPal test accounts
- 🚀 For production: Switch to live mode in PayPal dashboard

### File Storage
- 📁 Files stored locally in `/uploads` folder
- ⚠️ For production: Consider AWS S3 or Cloudinary for:
  - Better scalability
  - Automatic backups
  - CDN delivery
  - Persistent storage (Render may clear uploads on redeploy)

### Database
- 📊 New collections will be auto-created:
  - `projects`
  - `payments`
- 🔄 Existing data (quotes, contacts, users) remains unchanged

---

## 🐛 Troubleshooting

### File uploads not working?
1. Check folder permissions: `uploads/` folder should be writable
2. Verify file size is under 10MB
3. Check file type is in allowed list

### Stripe payments failing?
1. Verify API keys are correct (test mode: pk_test_/sk_test_)
2. Check amount is in cents (multiply by 100)
3. Verify webhook secret if using webhooks

### Analytics showing no data?
1. Create some test quotes and projects first
2. Check date range in query parameters
3. Verify JWT token has admin access

---

## 📊 Next Steps

### Optional Enhancements

1. **Frontend Integration**
   - Add project management UI to admin panel
   - Create file upload dropzone
   - Integrate Stripe Checkout UI
   - Add analytics charts (Chart.js)

2. **Upgrade Storage**
   - Set up AWS S3 for file storage
   - Update `uploadMiddleware.js` to use S3

3. **Payment Methods**
   - Add PayPal integration
   - Support multiple currencies
   - Recurring billing

4. **Notifications**
   - Email notifications on payment success
   - Project milestone reminders
   - Weekly analytics reports

---

## ✅ Checklist

- [ ] Install `stripe` npm package
- [ ] Add Stripe environment variables to Render
- [ ] Create Stripe account and get API keys
- [ ] Set up Stripe webhook (optional)
- [ ] Deploy updated code to Render
- [ ] Test project creation
- [ ] Test file upload
- [ ] Test payment intent
- [ ] Test analytics dashboard
- [ ] Verify favicon displays in browser

---

## 🆘 Need Help?

### Resources
- Stripe Documentation: https://stripe.com/docs
- Multer Documentation: https://github.com/expressjs/multer
- MongoDB Aggregation: https://docs.mongodb.com/manual/aggregation/

### Contact
For issues, create a GitHub issue or contact support.

---

**Last Updated:** January 2024  
**Version:** 2.0.0
