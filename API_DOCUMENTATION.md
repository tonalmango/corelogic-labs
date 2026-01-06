# CoreLogic Labs - API Documentation

## Base URL
```
Production: https://corelogic-labs.onrender.com/api
Development: http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Routes

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

---

## 💼 Project Management Routes

### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

### Get Single Project
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

### Create New Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectName": "Website Redesign",
  "client": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0123",
    "agencyName": "ABC Corp"
  },
  "services": ["Custom Website Design", "SEO Services"],
  "budget": {
    "total": 5000,
    "depositPaid": 1500
  },
  "timeline": {
    "startDate": "2024-01-15",
    "estimatedCompletion": "2024-03-15"
  },
  "status": "planning"
}
```

### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "progress": 35
}
```

### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### Add Milestone
```http
POST /api/projects/:id/milestones
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Design Mockups",
  "description": "Complete initial design mockups",
  "dueDate": "2024-02-01",
  "status": "pending"
}
```

### Update Milestone
```http
PUT /api/projects/:id/milestones/:milestoneId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "completedDate": "2024-01-28"
}
```

### Add Note to Project
```http
POST /api/projects/:id/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Client requested logo changes"
}
```

### Get Project Statistics
```http
GET /api/projects/stats
Authorization: Bearer <token>
```

---

## 📁 File Upload Routes

### Upload Files to Project
```http
POST /api/upload/project/:projectId
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  files: [file1, file2, ...]  // Max 10 files, 10MB each
```

**Allowed file types:**
- Images: jpeg, jpg, png, gif, svg
- Documents: pdf, doc, docx, xls, xlsx, ppt, pptx, txt
- Archives: zip, rar
- Design files: ai, psd

### Upload Files to Quote
```http
POST /api/upload/quote/:quoteId
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  files: [file1, file2, ...]
```

### Delete File from Project
```http
DELETE /api/upload/project/:projectId/file/:fileId
Authorization: Bearer <token>
```

### Download File
```http
GET /api/upload/file/:filename
Authorization: Bearer <token>
```

---

## 💳 Payment Routes

### Create PayPal Order
```http
POST /api/payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1500,
  "projectId": "60d5ec49f1b2c72b8c8e4f1a",
  "description": "Deposit payment for website redesign",
  "customerEmail": "client@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "7QH90123456789A",
    "approvalLink": "https://sandbox.paypal.com/...",
    "paymentId": "60d5ec49f1b2c72b8c8e4f1b"
  }
}
```

### Capture PayPal Payment
```http
POST /api/payments/capture
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "7QH90123456789A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment captured successfully",
  "data": {
    "transactionId": "TRANSACTION_ID"
  }
}
```

### Get All Payments
```http
GET /api/payments
Authorization: Bearer <token>
```

### Get Payments by Project
```http
GET /api/payments/project/:projectId
Authorization: Bearer <token>
```

### Record Manual Payment
```http
POST /api/payments/manual
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "60d5ec49f1b2c72b8c8e4f1a",
  "amount": 2500,
  "paymentMethod": "bank_transfer",
  "transactionId": "TXN123456",
  "description": "Final payment via wire transfer",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Payment Statistics
```http
GET /api/payments/stats
Authorization: Bearer <token>
```

---

## 📊 Analytics Routes

### Get Dashboard Analytics
```http
GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response includes:**
- Total quotes, active projects, revenue
- Quote statistics by status and service
- Monthly trends
- Project status breakdown
- Revenue metrics
- Contact statistics
- Conversion rate

### Get Performance Metrics
```http
GET /api/analytics/performance
Authorization: Bearer <token>
```

**Returns:**
- Average quote response time
- Project completion rate
- Average project duration

### Get Client Insights
```http
GET /api/analytics/clients
Authorization: Bearer <token>
```

**Returns:**
- Top clients by spending
- Client acquisition over time

### Export Analytics Report
```http
GET /api/analytics/export?format=json
Authorization: Bearer <token>
```

Supported formats: `json`, `csv`

---

## 📝 Quote Routes (Existing)

### Submit Quote Request
```http
POST /api/quotes
Content-Type: application/json

{
  "name": "Jane Smith",
  "agencyName": "XYZ Agency",
  "email": "jane@xyz.com",
  "phone": "555-0199",
  "services": ["Custom Website Design", "SEO Services"],
  "budget": "$5,000-$10,000",
  "details": "Need a complete website redesign"
}
```

### Get All Quotes
```http
GET /api/quotes
Authorization: Bearer <token>
```

### Update Quote
```http
PUT /api/quotes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted",
  "quoteAmount": 7500,
  "notes": "Client approved proposal"
}
```

---

## 📧 Contact Routes (Existing)

### Submit Contact Form
```http
POST /api/contacts
Content-Type: application/json

{
  "name": "Mike Johnson",
  "email": "mike@example.com",
  "phone": "555-0155",
  "subject": "General Inquiry",
  "message": "I'd like to learn more about your services"
}
```

### Get All Contacts
```http
GET /api/contacts
Authorization: Bearer <token>
```

---

## ⚡ Health Check

### Check API Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "success",
  "message": "CoreLogic Labs API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345.67
}
```

---

## 📌 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🔒 Environment Variables Required

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/corelogiclabs

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@corelogiclabs.com

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

---

## 🚀 Quick Start

### Install Dependencies
```bash
cd backend
npm install @paypal/checkout-server-sdk
```

### Run Development Server
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

---

## 📦 New Features Added

### 1. ✅ Project Management System
- Track ongoing client projects
- Milestones and progress tracking
- Project notes and file attachments
- Budget tracking with deposits

### 2. ✅ File Upload System
- Upload design assets, documents, images
- 10MB file size limit per file
- Support for 15+ file types
- Automatic file management

### 3. ✅ Payment Integration
- PayPal payment processing
- Manual payment recording
- Payment history tracking
- Automatic project budget updates
- Webhook support for real-time updates

### 4. ✅ Advanced Analytics Dashboard
- Comprehensive dashboard metrics
- Performance tracking
- Client insights
- Revenue analytics
- Data export (JSON/CSV)

### 5. ✅ Favicon
- Custom SVG favicon for browser tab icon
- Added to both index.html and admin.html

---

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **@paypal/checkout-server-sdk** - Payment processing
- **Nodemailer** - Email notifications
- **Winston** - Logging

---

## 📞 Support

For issues or questions, contact: support@corelogiclabs.com
