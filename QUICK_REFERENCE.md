# 🚀 QUICK REFERENCE - DEPLOYMENT COMMANDS

## Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Generate Secure Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -base64 32
```

## Environment Variables to Set on Vercel

```
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/
JWT_SECRET = <paste output from openssl command>
CRON_SECRET = <paste output from openssl command>
FRONTEND_URL = https://your-frontend-domain.vercel.app
NODE_ENV = production
```

## Deploy Backend

```bash
cd backend
npm install
vercel --prod
# Copy the backend URL
```

## Deploy Frontend

```bash
cd frontend
npm install
VITE_API_URL=https://your-backend-url.vercel.app 
vercel --prod
```

## Verify Deployment

```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Should return
{"status":"ok","timestamp":"2026-04-20T..."}

# Test API
curl -X GET https://your-backend-url.vercel.app/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Cron Job Testing

```bash
# Test follow-up reminder cron
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-backend-url.vercel.app/api/crons/followUpReminders
```

## Troubleshooting

### Database Connection Failed
- Check MONGO_URI is correct
- Add Vercel IPs to MongoDB IP whitelist
- Test connection locally first

### 404 on Routes
- Verify backend URL in frontend .env
- Check API routes in server.js
- Verify token in Authorization header

### Cron Job Not Running
- Check CRON_SECRET is set
- Verify schedule in vercel.json: `"0 9 * * *"`
- Check Vercel dashboard for logs

### Module Not Found
- Ensure all imports have `.js` extension
- Check package.json has `"type": "module"`
- Reinstall: `rm -rf node_modules && npm install`

## Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas Console](https://cloud.mongodb.com)
- [API Health](https://your-backend.vercel.app/api/health)
- [Frontend App](https://your-frontend.vercel.app)

## Files & Docs

- 📖 `DEPLOYMENT.md` - Full deployment guide
- 📋 `FIXES_SUMMARY.md` - All fixes explained
- ✅ `STATUS.md` - Complete status report
- 🔶 `.env.example` - Environment variables reference

---

**Deployment Time**: ~5-10 minutes  
**Post-Deployment Testing**: ~5 minutes  
**Total**: ~15 minutes from start to live
