#!/bin/bash

# Job Tracker - Quick Deployment Script
# This script helps deploy the Job Tracker app to Vercel

echo "🚀 Job Tracker - Vercel Deployment Helper"
echo "=========================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Backend Deployment
echo ""
echo "📦 Backend Deployment"
echo "====================="
cd backend || exit 1

echo "✅ Installing backend dependencies..."
npm install

echo ""
echo "🔐 Setting up environment variables on Vercel..."
echo "Please enter the following securely on Vercel dashboard:"
echo "  - MONGO_URI: Your MongoDB connection string"
echo "  - JWT_SECRET: $(openssl rand -base64 32)"
echo "  - CRON_SECRET: $(openssl rand -base64 32)"
echo "  - FRONTEND_URL: Your frontend Vercel URL"
echo "  - NODE_ENV: production"

read -p "Press Enter to continue with deployment..."

echo ""
echo "🚀 Deploying backend..."
vercel --prod --cwd=.

BACKEND_URL=$(vercel list --cwd=. | grep "backend" | awk '{print $2}')
echo "✅ Backend deployed to: $BACKEND_URL"

# Frontend Deployment
echo ""
echo "🎨 Frontend Deployment"
echo "====================="
cd ../frontend || exit 1

echo "✅ Installing frontend dependencies..."
npm install

echo "🔧 Building frontend..."
npm run build

echo ""
echo "📝 Creating .env.production..."
cat > .env.production << EOF
VITE_API_URL=${BACKEND_URL}
EOF

read -p "Press Enter to continue with frontend deployment..."

echo ""
echo "🚀 Deploying frontend..."
vercel --prod --cwd=.

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "========================"
echo ""
echo "📊 Next Steps:"
echo "1. Verify backend health: curl $BACKEND_URL/api/health"
echo "2. Test login at frontend URL"
echo "3. Cron job will run automatically at 9 AM UTC daily"
echo "4. Monitor at: https://vercel.com/dashboard"
echo ""
echo "📚 Documentation:"
echo "- See DEPLOYMENT.md for detailed setup"
echo "- See FIXES_SUMMARY.md for what was fixed"
