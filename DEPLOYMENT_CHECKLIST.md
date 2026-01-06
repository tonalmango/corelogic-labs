# ✅ Deployment Checklist - CoreLogic Labs v2.0

## Pre-Deployment

### 1. Code Verification
- [x] All new files created
- [x] Dependencies added to package.json
- [x] Environment variables documented
- [x] API routes registered in server.js
- [x] Models created and exported
- [x] Controllers implemented
- [x] Documentation complete

### 2. Local Testing (Optional)
- [ ] Install dependencies: `npm install`
- [ ] Start local server: `npm run dev`
- [ ] Test project creation endpoint
- [ ] Test file upload endpoint
- [ ] Test payment intent creation (Stripe test mode)
- [ ] Test analytics dashboard endpoint
- [ ] Verify favicon displays

## Deployment Steps

### Step 1: Stripe Account Setup
- [ ] Create Stripe account at https://stripe.com
- [ ] Verify email address
- [ ] Complete account setup
- [ ] Navigate to https://dashboard.stripe.com/apikeys
- [ ] Copy **Publishable key** (starts with `pk_test_`)
- [ ] Copy **Secret key** (starts with `sk_test_`)
- [ ] Save keys securely

### Step 2: Environment Variables Configuration
- [ ] Go to https://dashboard.render.com
- [ ] Select `corelogic-labs` web service
- [ ] Click **Environment** tab
- [ ] Add the following variables:

```
STRIPE_SECRET_KEY = sk_test_your_actual_key_here
STRIPE_PUBLISHABLE_KEY = pk_test_your_actual_key_here
```

Optional (for webhook support):
```
STRIPE_WEBHOOK_SECRET = whsec_your_webhook_secret
```

- [ ] Click **Save Changes**

### Step 3: Stripe Webhook Setup (Optional)
Only needed for automatic payment status updates:

- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Click **Add endpoint**
- [ ] Endpoint URL: `https://corelogic-labs.onrender.com/api/payments/webhook`
- [ ] Select events to listen for:
  - [x] `payment_intent.succeeded`
  - [x] `payment_intent.payment_failed`
- [ ] Click **Add endpoint**
- [ ] Copy the **Signing secret** (starts with `whsec_`)
- [ ] Add to Render environment: `STRIPE_WEBHOOK_SECRET = whsec_xxx`

### Step 4: Code Deployment
- [ ] Ensure all files are saved
- [ ] Open terminal in project directory
- [ ] Run the following commands:

```bash
git add .
git commit -m "feat: add project management, file uploads, payments, and analytics"
git push origin main
```

- [ ] Render will automatically detect the push and start deploying
- [ ] Wait for deployment to complete (~2-5 minutes)
- [ ] Check Render logs for any errors

### Step 5: Frontend Deployment (If Applicable)
If you have a separate frontend deployment:

- [ ] Navigate to your frontend service on Render
- [ ] Click **Manual Deploy** → **Clear build cache & deploy**
- [ ] Wait for deployment to complete
- [ ] Verify favicon displays on frontend

## Post-Deployment Verification

### Health Check
- [ ] Visit: `https://corelogic-labs.onrender.com/api/health`
- [ ] Expected response:
```json
{
  "status": "success",
  "message": "CoreLogic Labs API is running",
  "timestamp": "...",
  "uptime": ...
}
```

### Authentication Test
- [ ] Test login endpoint
- [ ] Verify JWT token is returned
- [ ] Save token for further testing

### Project Management Test
- [ ] Create a test project:
```bash
curl -X POST https://corelogic-labs.onrender.com/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Test Project",
    "client": {
      "name": "Test User",
      "email": "test@example.com"
    },
    "services": ["Custom Website Design"],
    "budget": { "total": 5000 }
  }'
```
- [ ] Verify project created successfully
- [ ] Save the returned project ID

### File Upload Test
- [ ] Upload a test file:
```bash
curl -X POST https://corelogic-labs.onrender.com/api/upload/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@testfile.pdf"
```
- [ ] Verify file uploaded successfully
- [ ] Check response includes file metadata

### Payment Test (Stripe Test Mode)
- [ ] Create a payment intent:
```bash
curl -X POST https://corelogic-labs.onrender.com/api/payments/create-intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "projectId": "PROJECT_ID",
    "customerEmail": "test@example.com"
  }'
```
- [ ] Verify payment intent created
- [ ] Check Stripe dashboard for the payment intent
- [ ] Note the `clientSecret` returned

### Analytics Test
- [ ] Get dashboard analytics:
```bash
curl https://corelogic-labs.onrender.com/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] Verify response contains overview, quotes, projects, revenue data
- [ ] Check calculations are correct

### Manual Payment Test
- [ ] Record a manual payment:
```bash
curl -X POST https://corelogic-labs.onrender.com/api/payments/manual \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "PROJECT_ID",
    "amount": 500,
    "paymentMethod": "bank_transfer",
    "transactionId": "TEST123",
    "customerInfo": {
      "name": "Test User",
      "email": "test@example.com"
    }
  }'
```
- [ ] Verify payment recorded
- [ ] Check project budget updated

### Favicon Test
- [ ] Open frontend URL in browser
- [ ] Check browser tab for CoreLogic Labs icon
- [ ] Verify icon displays properly

## Error Checking

### Common Issues and Solutions

#### Issue: Stripe keys not working
- [ ] Verify keys are copied correctly (no extra spaces)
- [ ] Ensure using test keys (pk_test_ and sk_test_)
- [ ] Check Stripe dashboard for API key status
- [ ] Restart Render service after adding env vars

#### Issue: File uploads failing
- [ ] Check file size < 10MB
- [ ] Verify file type is in allowed list
- [ ] Ensure `/uploads` folder is created (automatic)
- [ ] Check Render logs for permission errors

#### Issue: Analytics returns empty data
- [ ] Create test data first (quotes, projects, payments)
- [ ] Verify MongoDB connection is active
- [ ] Check date range parameters
- [ ] Review aggregation pipeline in logs

#### Issue: 401 Unauthorized errors
- [ ] Verify JWT token is valid
- [ ] Check token is included in Authorization header
- [ ] Format: `Authorization: Bearer <token>`
- [ ] Re-login to get fresh token

## Production Readiness

### Security Review
- [ ] Stripe keys are in environment variables (not hardcoded)
- [ ] JWT_SECRET is strong and random (32+ characters)
- [ ] CORS is configured for frontend domain only
- [ ] Rate limiting is active
- [ ] File upload validation is enabled
- [ ] Webhook signature verification is enabled (if using webhooks)

### Performance Review
- [ ] MongoDB indexes are created (automatic via Mongoose)
- [ ] File size limits are set (10MB)
- [ ] Request body size limits are set (10MB)
- [ ] API rate limits are configured

### Monitoring Setup
- [ ] Enable Render email alerts for deployments
- [ ] Set up uptime monitoring (Render provides this)
- [ ] Review Winston logs regularly
- [ ] Monitor Stripe dashboard for payment activity

## Optional Enhancements

### Immediate (Can Do Now)
- [ ] Test Stripe payment with test card: 4242 4242 4242 4242
- [ ] Create multiple test projects
- [ ] Upload different file types
- [ ] Export analytics data as CSV
- [ ] Add project milestones
- [ ] Record various payment types

### Future (Requires Frontend Work)
- [ ] Add project management UI to admin panel
- [ ] Create file upload dropzone interface
- [ ] Integrate Stripe Checkout on frontend
- [ ] Add Chart.js for analytics visualization
- [ ] Implement payment success/failure pages

### Production Upgrades (Recommended)
- [ ] Upgrade to AWS S3 for file storage
- [ ] Switch Stripe to live mode (production keys)
- [ ] Set up automated backups for MongoDB
- [ ] Add email notifications for payments
- [ ] Implement PayPal integration
- [ ] Add recurring billing support

## Documentation Review

### Verify Documentation is Accessible
- [ ] `README.md` - Updated with new features
- [ ] `API_DOCUMENTATION.md` - Complete API reference
- [ ] `SETUP_GUIDE.md` - Step-by-step setup instructions
- [ ] `IMPLEMENTATION_SUMMARY.md` - Feature implementation details
- [ ] `QUICK_REFERENCE.md` - Quick command reference
- [ ] `DEPLOYMENT_CHECKLIST.md` - This file

## Final Verification

### Smoke Test - All Features
- [ ] Authentication works (login/register)
- [ ] Projects CRUD operations work
- [ ] File upload/download works
- [ ] Payment intent creation works
- [ ] Manual payment recording works
- [ ] Analytics dashboard works
- [ ] Webhooks work (if configured)
- [ ] Favicon displays correctly

### Rollback Plan (If Needed)
If something goes wrong:
1. [ ] Check Render deployment logs
2. [ ] Review recent commits on GitHub
3. [ ] Revert to previous working commit if needed:
   ```bash
   git revert HEAD
   git push origin main
   ```
4. [ ] Contact support if issues persist

## Success Criteria

✅ **Deployment is successful when:**
- All API endpoints respond correctly
- Stripe test payment can be created
- Files can be uploaded and downloaded
- Analytics dashboard returns data
- No errors in Render logs
- Favicon displays in browser
- All tests pass

## Next Steps After Deployment

1. **Share API Documentation**
   - Send `API_DOCUMENTATION.md` to frontend team
   - Share Stripe publishable key for frontend integration
   - Provide API base URL

2. **Monitor Initial Usage**
   - Watch Render logs for errors
   - Check Stripe dashboard for test payments
   - Verify file uploads are storing correctly

3. **Plan Frontend Integration**
   - Design project management UI
   - Create file upload interface
   - Implement Stripe Checkout flow
   - Add analytics charts

4. **Production Migration (When Ready)**
   - Switch to Stripe live keys
   - Upgrade to AWS S3 for file storage
   - Set up production monitoring
   - Enable automated backups

---

## Sign-Off

**Deployed By:** _________________  
**Date:** _________________  
**Version:** 2.0.0  
**Deployment Status:** ⬜ Success  ⬜ Issues Found  
**Notes:** _________________________________

---

**Congratulations on deploying CoreLogic Labs v2.0! 🎉**

All new features are now live and ready to use. Happy coding!
