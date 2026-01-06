# ✅ Production Deployment Checklist

## Before Deployment

### Backend Configuration
- [ ] `.env` set to `NODE_ENV=production`
- [ ] MongoDB Atlas connection string configured
- [ ] Strong JWT_SECRET generated (32+ chars)
- [ ] Email service credentials configured
- [ ] FRONTEND_URL updated to production domain
- [ ] All sensitive data in environment variables (not hardcoded)

### Frontend Configuration  
- [ ] API URL points to production backend in `index.html` and `login.html`
- [ ] Company branding updated (CoreLogic Labs)
- [ ] Contact email updated to your business email
- [ ] All console.log statements removed (already done)

### Security Checks
- [ ] `.env` file NOT committed to git
- [ ] `.gitignore` properly configured
- [ ] Default admin password changed after first login
- [ ] CORS restricted to production domain only
- [ ] Rate limiting enabled
- [ ] Helmet security headers configured

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0 for Render)
- [ ] Automatic backups enabled

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Production ready deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy Backend to Render
- Sign up at render.com
- Create new Web Service
- Connect GitHub repo
- Configure:
  - Name: `corelogic-labs-api`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- Add environment variables from `.env`
- Deploy

### 3. Deploy Frontend to Render
- Create new Static Site
- Connect same GitHub repo  
- Configure:
  - Name: `corelogic-labs`
  - Root Directory: `frontend`
  - Build Command: (leave empty)
  - Publish Directory: `.`
- Deploy

### 4. Update API URLs
- Update `frontend/index.html` with actual backend URL
- Update `frontend/login.html` with actual backend URL
- Commit and push changes

### 5. Create Admin User
```bash
curl -X POST https://corelogic-labs-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@corelogiclabs.com","password":"SecurePassword123!","name":"Admin"}'
```

## Post-Deployment

### Verify Everything Works
- [ ] Frontend loads without errors
- [ ] API health check responds: `/api/health`
- [ ] Admin login works
- [ ] Dashboard displays correctly
- [ ] Quote submission works
- [ ] Contact form works
- [ ] Email notifications send
- [ ] Mobile responsive design works
- [ ] HTTPS enabled automatically

### Monitor
- [ ] Check Render dashboard logs for errors
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor MongoDB Atlas metrics
- [ ] Check error.log for issues

### Security Final Check
- [ ] Admin password changed from default
- [ ] JWT_SECRET is unique and strong
- [ ] No sensitive data exposed in client-side code
- [ ] All API endpoints require authentication (except public ones)
- [ ] CORS properly restricted

## Your Live URLs

After deployment, your sites will be:

- **Frontend**: https://corelogic-labs.onrender.com
- **API**: https://corelogic-labs-api.onrender.com
- **Admin Panel**: https://corelogic-labs.onrender.com/login.html

## Maintenance

### Regular Updates
- Update dependencies monthly: `npm audit fix`
- Review logs weekly for errors
- Backup MongoDB database regularly (Atlas does this automatically)
- Keep Node.js version updated

### Scaling
- Monitor free tier limits (750 hours/month)
- Upgrade to paid plan ($7/month) for:
  - Always-on service (no sleep)
  - Faster performance
  - More resources

---

**Status**: ✅ Production Ready  
**Cost**: Free (with Render.com free tier)  
**SSL**: Automatic HTTPS  
**Domains**: Free .onrender.com subdomains
