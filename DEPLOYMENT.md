# 🚀 Vercel Deployment Guide - Job Tracker

## ✅ Issues Fixed

### 1. **Module System Mismatch** ✓
- **Problem**: server.js used ES6 modules while all routes/models used CommonJS
- **Fix**: Converted all files to ES6 modules for consistency
  - Updated: `routes/auth.js`, `routes/applications.js`, `routes/stats.js`
  - Updated: `middleware/auth.js`, `models/User.js`, `models/Application.js`
  - Updated: `config/db.js`, `package.json` (added `"type": "module"`)

### 2. **Vercel Serverless Incompatibility** ✓
- **Problem**: Used `app.listen()` which doesn't work on Vercel serverless
- **Fix**: 
  - Updated `server.js` to export Express app
  - Created `api/index.js` as Vercel entry point
  - App now handles requests as serverless functions

### 3. **Database Connection Management** ✓
- **Problem**: DB connection logic at top-level with potential race conditions
- **Fix**: 
  - Implemented connection pooling with caching in `config/db.js`
  - Added middleware in `api/index.js` to ensure connection before each request
  - Added proper timeout and error handling

### 4. **Missing Environment Configuration** ✓
- **Fix**: Created `.env.example` with all required variables

### 5. **Cron Jobs for Follow-up Reminders** ✓
- **Added**: `api/crons/followUpReminders.js` - Daily job that:
  - ✅ Sends reminders for applications with follow-up dates in next 3 days
  - ✅ Groups reminders by user
  - ✅ Tracks reminder history with `lastReminderSent` field
  - ✅ Skips apps with status "Offer"
  - ✅ Ready for email service integration (SendGrid, Mailgun)
  - Schedule: Daily at 9 AM UTC (configurable)

### 6. **Updated Configuration Files** ✓
- `vercel.json`: Now properly configured for serverless + cron jobs
- `package.json`: Added ES6 module support
- `models/Application.js`: Added `lastReminderSent` field

---

## 📋 Pre-Deployment Checklist

### Backend Setup
- [ ] All dependencies installed: `npm install`
- [ ] `.env` file configured with:
  - `MONGO_URI` - MongoDB connection string
  - `JWT_SECRET` - Your JWT secret (minimum 32 chars)
  - `CRON_SECRET` - Secret key for cron endpoints (minimum 32 chars)
  - `FRONTEND_URL` - Your deployed frontend URL
  - `NODE_ENV=production`
- [ ] Test locally: `npm run dev` (should connect to DB and start without errors)

### Frontend Setup
- [ ] `.env` or `.env.production` configured with:
  - `VITE_API_URL=https://your-api.vercel.app`
- [ ] Build test: `npm run build` (should complete without errors)
- [ ] Test build: `npm run preview`

---

## 🚀 Deployment Steps

### Backend Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Set Environment Variables on Vercel**:
   ```bash
   cd backend
   vercel env add MONGO_URI
   vercel env add JWT_SECRET
   vercel env add CRON_SECRET
   vercel env add FRONTEND_URL
   vercel env add NODE_ENV
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Verify Deployment**:
   - Health check: `https://your-api.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

### Frontend Deployment

1. **Update API Base URL**:
   - In `.env.production`:
     ```
     VITE_API_URL=https://your-backend-api.vercel.app
     ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Verify**: Open app in browser, login should work with backend API

---

## 🔧 Testing Cron Jobs Locally

### Test Follow-up Reminder Cron:

```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/crons/followUpReminders
```

**Expected Response**:
```json
{
  "success": true,
  "message": "X follow-up reminders processed",
  "usersNotified": Y
}
```

---

## 🔑 Important Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Generate with: `openssl rand -base64 32` |
| `CRON_SECRET` | Cron endpoint authorization | Generate with: `openssl rand -base64 32` |
| `FRONTEND_URL` | Deployed frontend URL | `https://job-tracker.vercel.app` |
| `NODE_ENV` | Environment | `production` |

---

## 📊 Cron Job Configuration

The cron job in `vercel.json`:
```json
"crons": [
  {
    "path": "/api/crons/followUpReminders",
    "schedule": "0 9 * * *"
  }
]
```

**Schedule Explanation**: `0 9 * * *`
- Runs daily at **9:00 AM UTC**
- To change: Use cron syntax (minute, hour, day, month, weekday)
- Examples:
  - `0 9 * * 1` = Every Monday at 9 AM UTC
  - `0 */6 * * *` = Every 6 hours

---

## 🔧 Troubleshooting

### Database Connection Failed
- Verify `MONGO_URI` is correct
- Check MongoDB IP whitelist includes Vercel IPs
- Test locally first with same MongoDB URI

### Module Not Found Errors
- Ensure all file paths in imports use `.js` extension
- Check `package.json` has `"type": "module"`
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

### CORS Errors
- Frontend URL must be in `allowedOrigins` in `server.js`
- Add URL to `FRONTEND_URL` env variable

### Health Check Fails
- Backend might not be running
- Check logs: `vercel logs`
- Verify MongoDB connection with env variables

### Cron Job Not Running
- Verify `CRON_SECRET` is set as environment variable
- Check function logs in Vercel dashboard
- Ensure schedule syntax is valid

---

## 📝 Files Modified/Created

### Modified Files:
- ✅ `backend/server.js` - Converted to serverless, export app
- ✅ `backend/package.json` - Added `"type": "module"`
- ✅ `backend/config/db.js` - Enhanced connection pooling
- ✅ `backend/vercel.json` - Added cron configuration
- ✅ `backend/routes/*.js` - Converted to ES6 modules
- ✅ `backend/models/*.js` - Converted to ES6 modules
- ✅ `backend/middleware/auth.js` - Converted to ES6 modules

### New Files:
- ✅ `backend/api/index.js` - Vercel serverless entry point
- ✅ `backend/api/crons/followUpReminders.js` - Follow-up reminder cron job
- ✅ `backend/.env.example` - Environment variables reference

---

## 🎯 Next Steps for Production

### Recommended Integrations:

1. **Email Service** (for cron reminders):
   - SendGrid: `npm install @sendgrid/mail`
   - Mailgun: `npm install mailgun.js`
   - Configure in `api/crons/followUpReminders.js`

2. **Error Tracking**:
   - Sentry: `npm install @sentry/node`

3. **Analytics**:
   - Vercel Analytics: Enable in project settings

4. **Monitoring**:
   - Set up Vercel alerts for failed cron jobs

---

## ✨ Features Implemented

✅ Serverless-ready Express app for Vercel  
✅ Daily cron job for follow-up reminders  
✅ Proper error handling and logging  
✅ MongoDB connection pooling  
✅ JWT authentication  
✅ CORS properly configured  
✅ Environment variable management  
✅ Health check endpoint `/api/health`  

---

**Your Job Tracker is now Vercel-ready! 🎉**
