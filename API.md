# 📚 API Documentation

**Base URL**: 
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

**Authentication**: JWT token in `Authorization: Bearer <token>` header (required for admin endpoints)

---

## 🔐 Authentication Endpoints

### Register Admin User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "Admin Name",
      "email": "admin@example.com"
    }
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## 💬 Quote Endpoints

### Submit Quote Request (Public)
```http
POST /api/quotes
Content-Type: application/json

{
  "name": "John Smith",
  "agencyName": "ABC Agency",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "services": ["website", "chatbot"],
  "budget": "5-10k",
  "details": "Need a custom website with AI chatbot..."
}
```

**Response** (201):
```json
{
  "status": "success",
  "message": "Quote request submitted successfully",
  "data": {
    "quote": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "John Smith",
      "agencyName": "ABC Agency",
      "services": ["website", "chatbot"],
      "status": "pending",
      "createdAt": "2024-01-06T10:30:00Z"
    }
  }
}
```

### Get All Quotes (Admin)
```http
GET /api/quotes
Authorization: Bearer <token>

# Query Parameters:
# ?page=1&limit=10&status=pending&sort=-createdAt
```

### Get Quote Details (Admin)
```http
GET /api/quotes/:id
Authorization: Bearer <token>
```

### Update Quote (Admin)
```http
PATCH /api/quotes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "contacted",
  "quoteAmount": 2500,
  "notes": "Client approved the proposal"
}
```

### Delete Quote (Admin)
```http
DELETE /api/quotes/:id
Authorization: Bearer <token>
```

### Get Quote Statistics (Admin)
```http
GET /api/quotes/stats
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "totalQuotes": 42,
    "byStatus": {
      "pending": 15,
      "contacted": 10,
      "quoted": 12,
      "accepted": 5
    },
    "conversionRate": 11.9,
    "averageBudget": 3500
  }
}
```

---

## 📞 Contact Endpoints

### Submit Contact Message (Public)
```http
POST /api/contacts
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Partnership Inquiry",
  "message": "I'd like to discuss a partnership opportunity..."
}
```

### Get All Messages (Admin)
```http
GET /api/contacts
Authorization: Bearer <token>
```

### Get Message Details (Admin)
```http
GET /api/contacts/:id
Authorization: Bearer <token>
```

### Update Message (Admin)
```http
PATCH /api/contacts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "responded"
}
```

### Delete Message (Admin)
```http
DELETE /api/contacts/:id
Authorization: Bearer <token>
```

---

## 📁 Project Endpoints

### Get All Projects (Admin)
```http
GET /api/projects
Authorization: Bearer <token>
```

### Create Project (Admin)
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
  "services": ["Web Design", "Development"],
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

### Get Project Details (Admin)
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

### Update Project (Admin)
```http
PATCH /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "notes": "Started development phase"
}
```

### Delete Project (Admin)
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### Add Milestone (Admin)
```http
POST /api/projects/:id/milestones
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design Approval",
  "description": "Get client approval on design mockups",
  "dueDate": "2024-01-20",
  "status": "pending"
}
```

### Update Milestone (Admin)
```http
PATCH /api/projects/:id/milestones/:milestoneId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

### Get Project Statistics (Admin)
```http
GET /api/projects/:id/stats
Authorization: Bearer <token>
```

---

## 💳 Payment Endpoints

### Create PayPal Order (Admin)
```http
POST /api/payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "projectId": "60d5ec49f1b2c72b8c8e4f1a",
  "description": "Project deposit",
  "customerEmail": "client@example.com"
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "orderId": "5O190127949628532",
    "approvalLink": "https://sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=...",
    "paymentId": "60d5ec49f1b2c72b8c8e4f1a"
  }
}
```

### Capture Payment (Admin)
```http
POST /api/payments/capture
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "5O190127949628532",
  "paymentId": "60d5ec49f1b2c72b8c8e4f1a",
  "projectId": "60d5ec49f1b2c72b8c8e4f1a"
}
```

### Get All Payments (Admin)
```http
GET /api/payments
Authorization: Bearer <token>
```

### Get Payment Details (Admin)
```http
GET /api/payments/:id
Authorization: Bearer <token>
```

### Get Payment Statistics (Admin)
```http
GET /api/payments/stats
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "totalPayments": 25,
    "totalAmount": 12500,
    "byStatus": {
      "completed": 20,
      "pending": 3,
      "failed": 2
    },
    "byMethod": {
      "paypal": 20,
      "bank_transfer": 3,
      "check": 2
    }
  }
}
```

---

## 📁 File Upload Endpoints

### Upload Files (Admin)
```http
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Send files as form data with key "files"
```

**Allowed File Types**: jpg, jpeg, png, gif, svg, pdf, doc, docx, xls, xlsx, ppt, pptx, txt, zip, rar, ai, psd  
**Max File Size**: 10MB per file  
**Max Files**: 10 per upload

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "files": [
      {
        "id": "60d5ec49f1b2c72b8c8e4f1a",
        "filename": "design.pdf",
        "fileType": "pdf",
        "fileSize": 2048000,
        "uploadedAt": "2024-01-06T10:30:00Z"
      }
    ]
  }
}
```

### Download File (Admin)
```http
GET /api/upload/:fileId
Authorization: Bearer <token>
```

### Delete File (Admin)
```http
DELETE /api/upload/:fileId
Authorization: Bearer <token>
```

---

## 📊 Analytics Endpoints

### Dashboard Metrics (Admin)
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalQuotes": 42,
      "totalProjects": 15,
      "totalRevenue": 45000,
      "totalClients": 12
    },
    "trends": {
      "monthly": [
        { "month": "January", "quotes": 8, "revenue": 5000 },
        { "month": "February", "quotes": 6, "revenue": 4500 }
      ]
    }
  }
}
```

### Performance KPIs (Admin)
```http
GET /api/analytics/performance
Authorization: Bearer <token>
```

### Top Clients (Admin)
```http
GET /api/analytics/clients
Authorization: Bearer <token>
```

### Export Data (Admin)
```http
GET /api/analytics/export?format=json
Authorization: Bearer <token>
```

**Query Parameters**:
- `format`: `json` or `csv`

---

## ✅ Health Check

### Check API Status
```http
GET /api/health
```

**Response** (200):
```json
{
  "status": "success",
  "message": "CoreLogic Labs API is running",
  "timestamp": "2024-01-06T10:30:00.000Z",
  "uptime": 3600
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Description of the error",
  "errors": [
    {
      "field": "email",
      "msg": "Please provide a valid email"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 login attempts per 15 minutes

---

## Webhook Events (Future)

Payment completion webhooks will be implemented in v2.0 for automatic order status updates.

---

**API Version**: 1.0  
**Last Updated**: January 6, 2026
