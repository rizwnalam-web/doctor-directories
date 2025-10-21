#!/bin/bash
# Quick Fix for Render Deployment Error
# This script fixes the "concurrently not found" error

echo "🔧 Fixing Render Deployment Error..."
echo "===================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this in the project root."
    exit 1
fi

echo "✅ Moving concurrently to dependencies..."
# This should already be fixed, but let's verify
if grep -q '"concurrently":' package.json; then
    echo "✅ concurrently is in dependencies"
else
    echo "❌ concurrently not found in package.json"
fi

echo ""
echo "🚀 Deployment Instructions:"
echo "=========================="
echo ""
echo "1. Go to Render Dashboard: https://render.com"
echo ""
echo "2. Create Database:"
echo "   - New + → PostgreSQL"
echo "   - Name: doctor-directories-db"
echo "   - Copy DATABASE_URL"
echo ""
echo "3. Create Backend Service:"
echo "   - New + → Web Service"
echo "   - Connect GitHub repository"
echo "   - Name: doctor-directories-backend"
echo "   - Runtime: Node"
echo "   - Build Command: npm run deploy:backend"
echo "   - Start Command: npm start"
echo ""
echo "4. Backend Environment Variables:"
echo "   NODE_ENV=production"
echo "   PORT=5000"
echo "   DATABASE_URL=postgresql://... (from database)"
echo "   JWT_SECRET=your-secret-here"
echo "   EMAIL_USER=your-email@gmail.com"
echo "   EMAIL_PASS=your-app-password"
echo "   CLIENT_URL=https://doctor-directories-frontend.onrender.com"
echo ""
echo "5. Create Frontend Service:"
echo "   - New + → Static Site"
echo "   - Connect GitHub repository"
echo "   - Name: doctor-directories-frontend"
echo "   - Build Command: npm run build"
echo "   - Publish Directory: client/dist"
echo ""
echo "6. Frontend Environment Variables:"
echo "   REACT_APP_API_URL=https://doctor-directories-backend.onrender.com"
echo "   NODE_ENV=production"
echo ""
echo "🎯 Final URLs:"
echo "   Frontend: https://doctor-directories-frontend.onrender.com"
echo "   Backend:  https://doctor-directories-backend.onrender.com"
echo ""
echo "✅ This configuration avoids the concurrently error!"
echo "Each service is deployed separately with appropriate build commands."
