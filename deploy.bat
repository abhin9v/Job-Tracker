@echo off
REM Job Tracker - Vercel Deployment Script (Windows)

echo.
echo 🚀 Job Tracker - Vercel Deployment Helper
echo ==========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Backend Deployment
echo.
echo 📦 Backend Deployment
echo =====================
cd backend

echo ✅ Installing backend dependencies...
call npm install

echo.
echo 🔐 Setting up environment variables on Vercel...
echo Please enter the following securely on Vercel dashboard:
echo   - MONGO_URI: Your MongoDB connection string
echo   - JWT_SECRET: Generate with 'openssl rand -base64 32' or similar
echo   - CRON_SECRET: Generate with 'openssl rand -base64 32' or similar
echo   - FRONTEND_URL: Your frontend Vercel URL
echo   - NODE_ENV: production

pause

echo.
echo 🚀 Deploying backend...
call vercel --prod

REM Frontend Deployment
echo.
echo 🎨 Frontend Deployment
echo =====================
cd ..\frontend

echo ✅ Installing frontend dependencies...
call npm install

echo 🔧 Building frontend...
call npm run build

echo.
echo 📝 Creating .env.production...
(
    echo VITE_API_URL=https://YOUR_BACKEND_URL_HERE
) > .env.production

echo Please update .env.production with your backend URL from above!
pause

echo.
echo 🚀 Deploying frontend...
call vercel --prod

echo.
echo ✅ DEPLOYMENT COMPLETE!
echo ========================
echo.
echo 📊 Next Steps:
echo 1. Verify backend health: Visit https://YOUR_BACKEND_URL/api/health
echo 2. Test login at frontend URL
echo 3. Cron job will run automatically at 9 AM UTC daily
echo 4. Monitor at: https://vercel.com/dashboard
echo.
echo 📚 Documentation:
echo - See DEPLOYMENT.md for detailed setup
echo - See FIXES_SUMMARY.md for what was fixed
echo.
pause
