# 🚀 Quick Reference - New Features

## Installation

```bash
cd backend
npm install @paypal/checkout-server-sdk
```

## Environment Variables

Add to your `.env` file or Render environment:

```env
# PayPal Payment (Required for payment features)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

## API Quick Reference

### Projects

```bash
# Create Project
POST /api/projects
Authorization: Bearer <token>
{
  "projectName": "Website Redesign",
  "client": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "services": ["Custom Website Design"],
  "budget": { "total": 5000 }
}

# List All Projects
GET /api/projects
Authorization: Bearer <token>

# Get Project Stats
GET /api/projects/stats
Authorization: Bearer <token>
```

### File Uploads

```bash
# Upload Files to Project
POST /api/upload/project/:projectId
Authorization: Bearer <token>
Content-Type: multipart/form-data
FormData: files=[file1, file2, ...]

# Download File
GET /api/upload/file/:filename
Authorization: Bearer <token>
```

### Payments

```bash
# Create PayPal Order
POST /api/payments/create-order
Authorization: Bearer <token>
{
  "amount": 1500,
  "projectId": "project_id",
  "customerEmail": "client@example.com"
}

# Capture PayPal Payment
POST /api/payments/capture
Authorization: Bearer <token>
{
  "orderId": "paypal_order_id"
}

# Record Manual Payment
POST /api/payments/manual
Authorization: Bearer <token>
{
  "projectId": "project_id",
  "amount": 2500,
  "paymentMethod": "bank_transfer",
  "transactionId": "TXN123"
}
```

### Analytics

```bash
# Get Dashboard Data
GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>

# Export Data
GET /api/analytics/export?format=csv
Authorization: Bearer <token>
```

## File Types Allowed

- **Images:** jpg, jpeg, png, gif, svg
- **Documents:** pdf, doc, docx, xls, xlsx, ppt, pptx, txt
- **Archives:** zip, rar
- **Design:** ai, psd

## Project Status Options

- `planning` - Project in planning phase
- `in-progress` - Active development
- `review` - Under review
- `revisions` - Revision requests
- `completed` - Finished
- `on-hold` - Temporarily paused

## Payment Methods Supported

- `paypal` - PayPal online payment
- `bank_transfer` - Wire transfer
- `check` - Check payment
- `other` - Other payment methods

## Payment Status Flow

```
pending → processing → completed
          completed
efunded
```

## Quick Test Commands

```bash
# 1. Create a project
curl -X POST https://corelogic-labs.onrender.com/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectName":"Test","client":{"name":"John","email":"john@test.com"},"services":["Custom Website Design"],"budget":{"total":5000}}'

# 2. Upload a file
curl -X POST https://corelogic-labs.onrender.com/api/upload/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@file.pdf"

# 3. Create PayPal order
curl -X POST https://corelogic-labs.onrender.com/api/payments/create-order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":1500,"projectId":"PROJECT_ID","customerEmail":"test@test.com"}'

# 4. Get analytics
curl https://corelogic-labs.onrender.com/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## PayPal Test Accounts

You can use real PayPal accounts in sandbox mode. Create test accounts in your PayPal Developer dashboard.

## Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

## Troubleshooting

### File upload fails
- Check file size < 10MB
- Verify file type is allowed
- Ensure JWT token is valid

### Payment fails
- Verify Stripe keys are correct
- Check amount is positive number
- Ensure projectId exists

### Analytics returns no data
- Create PayPal credentialdata first
- Check date range parameters
- Verify JWT token has admin access

## Documentation Links

- Full API Docs: `API_DOCUMENTATION.md`
- Setup Guide: `SETUP_GUIDE.md`
- Implementation Summary: `IMPLEMENTATION_SUMMARY.md`

## Support

For issues or questions:
- Check documentation files
- Review error messages in response
- Verify environment variables
- Test with curl/Postman first

---

**Version:** 2.0.0  
**Last Updated:** January 2024
