# 🚀 Deploy CoreLogic Labs to Render.com (Production)

## Prerequisites
- GitHub account (free)
- MongoDB Atlas account (free)
- Your code pushed to GitHub repository

---

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Create a **FREE** cluster:
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select closest region
   - Click "Create Cluster"
4. Create database user:
   - Go to "Database Access" → "Add New Database User"
   - Username: `corelogic`
   - Password: Click "Autogenerate Secure Password" → **SAVE THIS PASSWORD**
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
5. Allow connections:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
6. Get connection string:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your saved password
   - Replace `<dbname>` with `corelogiclabs`
   - **SAVE THIS** - it looks like:
     ```
     mongodb+srv://corelogic:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/corelogiclabs?retryWrites=true&w=majority
     ```

---

## Step 2: Deploy Backend to Render (5 minutes)

1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository:
   - Click "Connect account" if needed
   - Find your repository
   - Click "Connect"
4. Configure service:
   ```
   Name: corelogic-labs-api
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```
5. Add **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = mongodb+srv://corelogic:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/corelogiclabs?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-random-string-min-32-chars-abcdefghijklmnop
   FRONTEND_URL = https://corelogic-labs.onrender.com
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = your-gmail@gmail.com
   EMAIL_PASSWORD = your-gmail-app-password
   EMAIL_FROM = noreply@corelogiclabs.com
   API_RATE_LIMIT = 100
   LOG_LEVEL = info
   ```

   **IMPORTANT:**
   - Replace `MONGODB_URI` with your Atlas connection string from Step 1
   - Replace `JWT_SECRET` - generate with PowerShell:
     ```powershell
     [System.Guid]::NewGuid().ToString().Replace("-", "") + [System.Guid]::NewGuid().ToString().Replace("-", "")
     ```
   - For Gmail: Enable 2FA → Generate App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

6. Click "Create Web Service"
7. Wait 3-5 minutes for deployment
8. Your API URL will be: `https://corelogic-labs-api.onrender.com`
9. Test it: `https://corelogic-labs-api.onrender.com/api/health`

---

## Step 3: Deploy Frontend to Render (3 minutes)

1. In Render dashboard, click "New +" → "Static Site"
2. Connect same repository
3. Configure:
   ```
   Name: corelogic-labs
   Branch: main
   Root Directory: frontend
   Build Command: (leave empty)
   Publish Directory: .
   ```
4. Click "Create Static Site"
5. Wait 2-3 minutes
6. Your site URL will be: `https://corelogic-labs.onrender.com`

---

## Step 4: Update API URL in Frontend (1 minute)

**IMPORTANT:** Update the backend API URL now that you know it:

1. Open `frontend/index.html` (line 13)
2. Change:
   ```javascript
   : window.location.protocol + '//corelogic-labs-api.onrender.com/api';
   ```

3. Open `frontend/login.html` (line 12)
4. Change the same line:
   ```javascript
   : window.location.protocol + '//corelogic-labs-api.onrender.com/api';
   ```

5. Commit changes:
   ```bash
   git add .
   git commit -m "Update API URL to Render domain"
   git push
   ```

6. Render will auto-deploy in 1-2 minutes

---

## Step 5: Create Admin User (2 minutes)

Once backend is deployed, create your admin account:

```bash
# Replace with your actual Render API URL
curl -X POST https://corelogic-labs-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@corelogiclabs.com\",\"password\":\"Admin123!SecurePass\",\"name\":\"Admin User\"}"
```

Or use PowerShell:
```powershell
$body = @{
    email = "admin@corelogiclabs.com"
    password = "Admin123!SecurePass"
    name = "Admin User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://corelogic-labs-api.onrender.com/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

---

## ✅ Your Sites Are Live!

- **Frontend:** https://corelogic-labs.onrender.com
- **Admin Panel:** https://corelogic-labs.onrender.com/login.html
- **API Health:** https://corelogic-labs-api.onrender.com/api/health

**Admin Credentials:**
- Email: `admin@corelogiclabs.com`
- Password: `Admin123!SecurePass`

---

## 🎯 What You Get (All FREE):

✅ **Free domains** from Render:
- `corelogic-labs.onrender.com` (frontend)
- `corelogic-labs-api.onrender.com` (backend)

✅ **Free MongoDB** from Atlas (512MB storage)

✅ **Free SSL/HTTPS** automatically

✅ **Auto-deploy** on every git push

✅ **750 hours/month** free on Render

---

## ⚠️ Important Notes:

1. **Free tier sleeps after 15 min of inactivity**
   - First request after sleep takes ~30 seconds
   - Upgrade to $7/month for always-on

2. **Custom domains** (optional):
   - You can add your own domain later in Render settings
   - No need to change code - just update DNS

3. **Environment variables** are already set
   - Don't commit `.env` to git
   - All secrets are in Render dashboard

4. **Monitoring:**
   - Check logs in Render dashboard
   - View metrics and uptime
   - Get email alerts on failures

---

## 🔄 Making Updates:

```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push

# Render automatically deploys in 2-3 minutes!
```

---

## 🆘 Troubleshooting:

**Backend won't start:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0

**Frontend can't reach API:**
- Verify API URL in `index.html` and `login.html`
- Check backend is running: visit `/api/health`
- Check browser console for CORS errors

**Can't login:**
- Make sure you created admin user (Step 5)
- Check credentials are correct
- Verify JWT_SECRET is set in backend environment

---

## 🚀 Next Steps:

1. Test all features on your live site
2. Share URL with team/clients
3. Monitor usage in Render dashboard
4. Upgrade when you need always-on ($7/month)
5. Add custom domain when ready (optional)

---

**Total Setup Time:** ~15 minutes  
**Monthly Cost:** $0 (Free tier)  
**Your URLs:**
- Frontend: https://corelogic-labs.onrender.com
- API: https://corelogic-labs-api.onrender.com
