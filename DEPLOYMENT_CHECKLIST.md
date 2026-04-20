# ✅ DEPLOYMENT CHECKLIST

## Pre-Deployment Phase

### Local Setup
- [ ] Navigate to project directory
- [ ] Run `cd backend && npm install`
- [ ] Run `cd ../frontend && npm install`
- [ ] Create `.env` in backend (copy from `.env.example`)
- [ ] Verify MongoDB URI is valid
- [ ] Test backend: `npm run dev` (should show ✅ Database connected)
- [ ] Test frontend: `npm run dev` from frontend directory

### Credentials & Secrets
- [ ] Generate JWT_SECRET: `openssl rand -base64 32`
  - Save as: `JWT_SECRET = <output>`
- [ ] Generate CRON_SECRET: `openssl rand -base64 32`
  - Save as: `CRON_SECRET = <output>`
- [ ] Have MongoDB URI ready: `mongodb+srv://...`
- [ ] Have Frontend URL ready (or use temporary)

---

## Vercel Setup Phase

### Account & CLI
- [ ] Create Vercel account (if needed)
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Verify installation: `vercel --version`

### Link Project
- [ ] Run `vercel link` in project root
- [ ] Authorize with Vercel account
- [ ] Confirm project linking

---

## Backend Deployment Phase

### Project Structure
- [ ] Backend located in `backend/` folder
- [ ] `package.json` has `"type": "module"`
- [ ] `vercel.json` exists and is configured
- [ ] `api/index.js` exists

### Deploy
- [ ] Navigate to `cd backend`
- [ ] Run `npm install` again to refresh
- [ ] Run `vercel --prod`
- [ ] Wait for deployment to complete
- [ ] **IMPORTANT**: Copy the backend URL shown

### Environment Variables
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Select your backend project
- [ ] Go to Settings > Environment Variables
- [ ] Add `MONGO_URI` = `mongodb+srv://...`
- [ ] Add `JWT_SECRET` = (from openssl)
- [ ] Add `CRON_SECRET` = (from openssl)
- [ ] Add `FRONTEND_URL` = (your frontend URL or temp)
- [ ] Add `NODE_ENV` = `production`
- [ ] Save changes
- [ ] Trigger redeploy: Settings > Deployment > More > Redeploy
- [ ] Wait for deployment to complete

### Verify Backend
- [ ] Open browser to: `https://your-backend-url.vercel.app/api/health`
- [ ] Should see: `{"status":"ok","timestamp":"..."}`
- [ ] If error: Check env variables and redeploy

---

## Frontend Deployment Phase

### Configuration
- [ ] Navigate to `cd frontend`
- [ ] Create `.env.production` file
- [ ] Add: `VITE_API_URL=https://your-backend-url.vercel.app`
- [ ] **IMPORTANT**: Use EXACT backend URL from previous step
- [ ] Verify no trailing slashes in URL

### Build Test
- [ ] Run `npm run build`
- [ ] Should complete without errors
- [ ] Check for warnings (fix if critical)

### Deploy
- [ ] Run `vercel --prod`
- [ ] Wait for deployment to complete
- [ ] **IMPORTANT**: Copy the frontend URL shown

---

## Post-Deployment Testing Phase

### Backend Health Check
- [ ] Test health: `curl https://your-backend.vercel.app/api/health`
- [ ] Should return status: `ok`

### Authentication Test
- [ ] Open frontend in browser
- [ ] Go to login page
- [ ] No CORS errors should appear in console

### Login Test
- [ ] Try to register new account
- [ ] Email should be accepted
- [ ] Should redirect to dashboard after login
- [ ] Check browser console for errors

### Application CRUD Test
- [ ] Create a new job application
- [ ] Should save successfully
- [ ] Can edit the application
- [ ] Can delete the application
- [ ] List view shows all applications

### Dashboard Test
- [ ] View dashboard
- [ ] Statistics should load
- [ ] Charts should render
- [ ] Follow-up reminders should display

### CSV Export Test
- [ ] Go to applications list
- [ ] Try export to CSV (if feature available)
- [ ] File should download successfully

### Cron Job Test (Optional)
- [ ] Test with curl:
  ```bash
  curl -X GET \
    -H "Authorization: Bearer YOUR_CRON_SECRET" \
    https://your-backend.vercel.app/api/crons/followUpReminders
  ```
- [ ] Should return success message
- [ ] Should show reminder count

---

## Troubleshooting Checklist

### If Backend Won't Deploy
- [ ] Check `vercel.json` is properly formatted (JSON syntax)
- [ ] Verify `package.json` has `"type": "module"`
- [ ] Check all imports end with `.js`
- [ ] Run `npm install` in backend directory
- [ ] Check Vercel logs: `vercel logs`

### If Database Connection Fails
- [ ] Verify `MONGO_URI` is correct in Vercel env
- [ ] Check MongoDB IP whitelist includes Vercel IPs
  - Add: `0.0.0.0/0` (or specific Vercel IPs)
- [ ] Test URI locally first
- [ ] Redeploy after changing env variables

### If Frontend Shows CORS Error
- [ ] Check `VITE_API_URL` in `.env.production` is correct
- [ ] Verify URL matches deployed backend exactly
- [ ] No trailing slashes in URL
- [ ] Redeploy frontend after fixing

### If Login Fails
- [ ] Check browser console for error messages
- [ ] Verify backend health endpoint works
- [ ] Check JWT_SECRET is set in Vercel
- [ ] Try creating account in login form

### If Cron Job Doesn't Run
- [ ] Verify `CRON_SECRET` is set in Vercel
- [ ] Check schedule in `vercel.json`: `"0 9 * * *"`
- [ ] Monitor: Vercel Dashboard > Crons tab
- [ ] Check function logs for errors

---

## Final Verification

### Before Signing Off
- [ ] ✅ Backend health check passes
- [ ] ✅ Frontend loads without errors
- [ ] ✅ Login/Register works
- [ ] ✅ Can create applications
- [ ] ✅ Can edit applications
- [ ] ✅ Can view dashboard
- [ ] ✅ No console errors in browser
- [ ] ✅ Cron job test passes (optional)
- [ ] ✅ All env variables set
- [ ] ✅ Fully tested workflow complete

### Optional - Performance Check
- [ ] Dashboard loads in <2 seconds
- [ ] List applications <1 second
- [ ] API health check <500ms

---

## 🎉 DEPLOYMENT COMPLETE!

Your Job Tracker is now live! 

### Next Steps
1. Share the frontend URL with users
2. Monitor Vercel dashboard for errors
3. Check cron job execution daily
4. Set up email notifications (optional)
5. Consider adding Sentry for error tracking

### Support
- Deployment Issues: Check `DEPLOYMENT.md`
- Technical Details: Check `FIXES_SUMMARY.md`
- Quick Commands: Check `QUICK_REFERENCE.md`
- Project Status: Check `STATUS.md`

---

**Deployment Time Target**: 15-20 minutes  
**Testing Time Target**: 5-10 minutes  
**Total**: 20-30 minutes to live ✅

---

**Print this checklist and check off as you go! 📋**
