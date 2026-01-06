# 🚀 CoreLogic Labs - Agency Management Platform

> Complete full-stack solution for managing client quotes, projects, payments, and analytics. Production-ready with JWT authentication, PayPal integration, and secure admin dashboard.

## � Documentation

- **[SETUP.md](SETUP.md)** - Complete setup and configuration guide
- **[API.md](API.md)** - API endpoints reference documentation

## �🚀 Features

### Core Features
- **JWT Authentication** - Secure user authentication with bcrypt password hashing
- **Admin Dashboard** - Real-time quote and contact management interface
- **Rate Limiting** - 5 attempts/15min on auth, 100/15min on general API
- **Security Hardening** - Helmet CSP headers, CORS restrictions, input validation
- **Logging & Monitoring** - Winston logger with file rotation and request tracking
- **Graceful Shutdown** - Proper SIGTERM/SIGINT handlers for zero-downtime deployments

### ✨ New Features (v2.0)
- **📊 Project Management** - Track ongoing projects with milestones, progress, and status updates
- **📁 File Upload System** - Client file uploads for design assets (images, PDFs, docs, archives)
- **💳 Payment Integration** - PayPal payment processing with automatic budget tracking
- **📈 Advanced Analytics** - Comprehensive dashboard with metrics, trends, and data export
- **🎨 Custom Favicon** - Professional browser tab icon

## 📋 Tech Stack

**Backend:**
- Node.js v20+ / Express.js
- MongoDB with Mongoose ODM
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- **@paypal/checkout-server-sdk** for payment processing ✨ NEW
- **Multer** for file uploads ✨ NEW
- Winston v3.10.0 for logging
- Helmet, express-rate-limit, CORS for security

**Frontend:**
- Vanilla JavaScript with runtime API detection
- Responsive admin dashboard
- Auto-refresh data tables
- **Custom SVG favicon** ✨ NEW

## 🛠️ Quick Start (Development)

### Prerequisites
- Node.js v20+ installed
- MongoDB v8.2+ running (localhost:27017 or Atlas)
- **PayPal account** (for payment features) ✨ NEW

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Agency

# Install backend dependencies
cd backend
npm install

# Create environment file
cp .env.example .env

# Update .env with your values (see Environment Variables section)
```
# At minimum, set JWT_SECRET and MONGODB_URI

# Start the development server
npm run dev
```

The backend API will run on `http://localhost:5000`  
Frontend is at `http://localhost:5500` (using Live Server)

### Create First Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@corelogiclabs.com",
    "password": "AdminPassword123!",
    "name": "Admin User"
  }'
```

**Default Credentials:**
- Email: `admin@corelogiclabs.com`
- Password: `AdminPassword123!`

## 🔐 Environment Variables

Create a `.env` file in the `/backend` directory:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | Environment mode (`development` or `production`) |
| `PORT` | No | `5000` | Server port |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | JWT signing secret (min 32 chars, random string) |
| `FRONTEND_URL` | Yes | `http://localhost:3000` | Frontend domain for CORS |
| `EMAIL_HOST` | Yes | `smtp.gmail.com` | SMTP server hostname |
| `EMAIL_PORT` | Yes | `587` | SMTP port |
| `EMAIL_USER` | Yes | - | Email account username |
| `EMAIL_PASSWORD` | Yes | - | Email account password or app password |
| `EMAIL_FROM` | No | `noreply@corelogiclabs.com` | Sender email address |
| `API_RATE_LIMIT` | No | `100` | General API rate limit (requests per 15min) |
| `LOG_LEVEL` | No | `info` | Logging level (`error`, `warn`, `info`, `debug`) |
| ✨ `PAYPAL_CLIENT_ID` | Yes* | - | PayPal client ID (for payments) |
| ✨ `PAYPAL_CLIENT_SECRET` | Yes* | - | PayPal client secret |
| ✨ `PAYPAL_MODE` | No | `sandbox` | PayPal mode (sandbox or live) |

*Required only if using payment features

### Example .env File

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://corelogic-labs.onrender.com

# MongoDB - Production: MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/corelogiclabs?retryWrites=true&w=majority

# Email Service (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@corelogiclabs.com

# JWT Secret - Generate with: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-random-string

# ✨ NEW: PayPal Payment Integration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

API_RATE_LIMIT=100
LOG_LEVEL=info
```

### Generate Secure JWT Secret

```bash
# Windows PowerShell
$random = [System.Guid]::NewGuid().ToString().Replace("-", "") + [System.Guid]::NewGuid().ToString().Replace("-", "")
Write-Host $random

# Linux/Mac
openssl rand -base64 32
```

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── logger.js            # Winston logging configuration
├── controllers/
│   ├── authController.js    # Authentication logic (register, login, JWT)
│   ├── quoteController.js   # Quote CRUD operations
│   └── contactController.js # Contact CRUD operations
├── routes/
│   ├── authRoutes.js        # Auth endpoints (/api/auth/*)
│   ├── quoteRoutes.js       # Quote endpoints (/api/quotes/*)
│   └── contactRoutes.js     # Contact endpoints (/api/contacts/*)
├── models/
│   ├── User.js              # User schema with bcrypt
│   ├── Quote.js             # Quote schema
│   └── Contact.js           # Contact schema
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   └── errorMiddleware.js   # Global error handler
├── logs/                    # Winston log files (auto-created)
├── server.js                # Express app entry point
├── package.json
└── .env                     # Environment configuration

frontend/
├── login.html               # Admin login page
├── admin.html               # Admin dashboard
├── admin.js                 # Dashboard API integration
├── index.html               # Public landing page
├── script.js                # Quote form logic
└── styles.css               # Styling
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login and receive JWT token
- `POST /logout` - Logout
- `GET /me` - Get current user (protected)
- `PATCH /updatePassword` - Change password (protected)

### Quotes (`/api/quotes`) - All protected except POST
- `POST /` - Submit quote request (public)
- `GET /` - List all quotes (admin only)
- `GET /stats` - Get quote statistics (admin)
- `GET /:id` - Get quote details (admin)
- `PATCH /:id` - Update quote (admin)
- `DELETE /:id` - Delete quote (admin)

### Contacts (`/api/contacts`) - All protected except POST
- `POST /` - Submit contact message (public)
- `GET /` - List all contacts (admin)
- `GET /:id` - Get contact details (admin)
- `PATCH /:id` - Mark contact as read (admin)
- `DELETE /:id` - Delete contact (admin)

### ✨ Projects (`/api/projects`) - NEW - All protected
- `GET /` - List all projects
- `POST /` - Create new project
- `GET /stats` - Get project statistics
- `GET /:id` - Get project details
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `POST /:id/milestones` - Add milestone
- `PUT /:id/milestones/:milestoneId` - Update milestone
- `POST /:id/notes` - Add project note

### ✨ File Uploads (`/api/upload`) - NEW - All protected
- `POST /project/:projectId` - Upload files to project (max 10 files, 10MB each)
- `POST /quote/:quoteId` - Upload files to quote
- `GET /file/:filename` - Download file
- `DELETE /project/:projectId/file/:fileId` - Delete file

### ✨ Payments (`/api/payments`) - NEW
- `POST /create-order` - Create PayPal order (protected)
- `POST /capture` - Capture PayPal payment (protected)
- `GET /` - List all payments (protected)
- `GET /project/:projectId` - Get payments by project (protected)
- `POST /manual` - Record manual payment (protected)
- `GET /stats` - Payment statistics (protected)

### ✨ Analytics (`/api/analytics`) - NEW - All protected
- `GET /dashboard?startDate=&endDate=` - Complete dashboard metrics
- `GET /performance` - Performance KPIs
- `GET /clients` - Client insights
- `GET /export?format=json|csv` - Export analytics data

### Health Check
- `GET /api/health` - API health status

**📖 Full API documentation:** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🔒 Security Features

- **JWT Authentication** - 7-day token expiration with Bearer token format
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - 5 attempts/15min on auth endpoints, 100/15min general
- **CORS** - Restricted to frontend domain only
- **Helmet** - Security headers (CSP, XSS protection, no unsafe-inline)
- **Body Size Limit** - 10MB maximum request size
- **Input Validation** - Express-validator on all endpoints
- **Error Sanitization** - No stack traces or sensitive info in production
- **Graceful Shutdown** - SIGTERM/SIGINT handlers for cleanup

## 🚀 Production Deployment

### Recommended Platforms

**API Backend:**
- **Render** - Easy Node.js deployment with free tier
- **Railway** - Simple deployment with auto-scaling
- **Fly.io** - Global edge deployment

**Database:**
- **MongoDB Atlas** - Free tier available, auto-backups

**Static Frontend:**
- **Cloudflare Pages** - Fast CDN, free tier
- **Netlify** - Auto-deploy from git
- **Vercel** - Optimized for frontend

### Deployment Steps

#### 1. Set Up MongoDB Atlas

```bash
# 1. Create cluster at mongodb.com/cloud
# 2. Create database user
# 3. Whitelist IP addresses (or 0.0.0.0/0 for all)
# 4. Get connection string:
mongodb+srv://username:password@cluster.mongodb.net/whiteLabelAgency?retryWrites=true&w=majority
```

#### 2. Configure Production Environment

Update your platform's environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/whiteLabelAgency
JWT_SECRET=<your-generated-32-char-random-string>
FRONTEND_URL=https://yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

#### 3. Deploy Backend

**Using Render:**
```bash
# 1. Connect GitHub repo to Render
# 2. Set Build Command: cd backend && npm install
# 3. Set Start Command: node server.js
# 4. Add environment variables from dashboard
# 5. Deploy
```

**Using Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
EXPOSE 5000
CMD ["node", "server.js"]
```

```bash
docker build -t white-label-api .
docker run -e NODE_ENV=production -p 5000:5000 white-label-api
```

**Using PM2 (Linux Server):**
```bash
# Install PM2
npm install -g pm2

# Start application
cd backend
pm2 start server.js --name "white-label-api"

# Save PM2 config for auto-restart
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs white-label-api
```

#### 4. Configure Nginx Reverse Proxy (Optional)

```nginx
upstream api {
    server localhost:5000;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/ssl/cert.crt;
    ssl_certificate_key /path/to/ssl/key.key;

    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

#### 5. Deploy Frontend

Upload the `frontend/` folder to your hosting platform. Update the API base URL in [index.html](frontend/index.html):

```html
<script>
  if (window.location.hostname === 'localhost') {
    window.API_BASE_URL = 'http://localhost:5000/api';
  } else {
    window.API_BASE_URL = 'https://api.yourdomain.com/api';
  }
</script>
```

### SSL/TLS Certificates

```bash
# Using Let's Encrypt (free)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

## 📊 Admin Dashboard

Access the admin panel at `/login.html` or `/admin.html`

**Features:**
- Real-time quote statistics
- Quote management (view, edit, delete, update status)
- Contact message management
- Auto-refresh every 30 seconds
- Responsive tables with action buttons

**Admin Credentials:**
- Email: `admin@whiteLabelAgency.com`
- Password: `AdminPassword123!`

⚠️ **Change default credentials immediately in production!**

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "success",
  "message": "White-Label Agency API is running",
  "timestamp": "2026-01-04T...",
  "uptime": 1234.56
}
```

### Test Authentication Flow
```bash
# 1. Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# 2. Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 3. Access protected route with token
curl -X GET http://localhost:5000/api/quotes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Quote Submission
```bash
curl -X POST http://localhost:5000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "email": "test@company.com",
    "phone": "555-1234",
    "message": "Need website redesign"
  }'
```

## 📈 Monitoring & Logging

### View Logs

```bash
# Error logs only
tail -f backend/logs/error.log

# All logs
tail -f backend/logs/combined.log

# With PM2
pm2 logs white-label-api
pm2 monit
```

### Log Files
- `logs/error.log` - Error-level logs only
- `logs/combined.log` - All log levels (info, warn, error)

### Metrics Tracked
- Request duration (ms)
- HTTP method and path
- Status codes
- MongoDB connection events
- Unhandled promise rejections

## 🔧 Operations

### Useful Commands

```bash
# Development mode
npm run dev

# Production mode
npm run prod

# Check server status
curl http://localhost:5000/api/health

# View active Node processes
Get-Process -Name node          # Windows
ps aux | grep node              # Linux/Mac

# Stop all Node processes
Stop-Process -Name node -Force  # Windows
killall node                     # Linux/Mac

# PM2 operations
pm2 status
pm2 restart white-label-api
pm2 stop white-label-api
pm2 delete white-label-api
```

### Database Backups

```bash
# MongoDB Atlas - Enable automatic backups in dashboard
# Local MongoDB - Use mongodump
mongodump --uri="mongodb://localhost:27017/whiteLabelAgency" --out=/backup/$(date +%Y%m%d)
```

## ⚠️ Security Checklist (Production)

- [ ] Change `JWT_SECRET` to strong random string (32+ chars)
- [ ] Update `FRONTEND_URL` to actual production domain
- [ ] Use MongoDB Atlas with strong password
- [ ] Configure email service with real credentials
- [ ] Enable HTTPS only (no HTTP)
- [ ] Set `NODE_ENV=production` in environment
- [ ] Configure IP whitelist in MongoDB Atlas
- [ ] Never commit `.env` files to git (use `.gitignore`)
- [ ] Set up automated database backups
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Use strong admin passwords
- [ ] Implement backup strategy for logs

### .gitignore (Required)
```
.env
.env.local
.env.*.local
logs/
node_modules/
*.log
```

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac

# Kill process on port 5000
Stop-Process -Id <PID> -Force  # Windows
kill -9 <PID>                  # Linux/Mac
```

### MongoDB connection failed
```bash
# Check if MongoDB is running
Get-Service MongoDB            # Windows
sudo systemctl status mongod   # Linux

# Start MongoDB
Start-Service MongoDB          # Windows
sudo systemctl start mongod    # Linux
```

### JWT token expired
- Tokens expire after 7 days
- User must log in again to get new token
- Check `JWT_SECRET` matches across restarts

### CORS errors
- Verify `FRONTEND_URL` in `.env` matches frontend domain
- Check browser console for specific CORS error
- Ensure frontend sends requests to correct API URL

## 📝 License

MIT License - feel free to use for commercial projects

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

**Status**: ✅ Production Ready  
**Last Updated**: January 4, 2026  
**Admin Login**: http://localhost:3000/login.html  
**API Health**: http://localhost:5000/api/health
