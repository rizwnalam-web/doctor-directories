@echo off
echo ========================================
echo Doctor Directories - Render Deployment
echo ========================================
echo.

echo Step 1: Push to GitHub (if needed)
echo git add .
echo git commit -m "Prepare for Render deployment"
echo git push origin main
echo.

echo Step 2: Create PostgreSQL Database
echo 1. Go to https://render.com
echo 2. Click "New +" -^> "PostgreSQL"
echo 3. Name: doctor-directories-db
echo 4. Copy DATABASE_URL for next step
echo.

echo Step 3: Deploy Backend Service
echo 1. Click "New +" -^> "Web Service" -^> Connect GitHub repo
echo 2. Name: doctor-directories-backend
echo 3. Runtime: Node
echo 4. Build Command: npm run deploy:backend
echo 5. Start Command: npm start
echo.

echo Step 4: Backend Environment Variables
echo NODE_ENV=production
echo PORT=5000
echo DATABASE_URL=postgresql://... ^(from Step 2^)
echo JWT_SECRET=your-secure-secret-here
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=your-email@gmail.com
echo EMAIL_PASS=your-app-password
echo CLIENT_URL=https://doctor-directories-frontend.onrender.com
echo.

echo Step 5: Deploy Frontend Service
echo 1. Click "New +" -^> "Static Site" -^> Connect GitHub repo
echo 2. Name: doctor-directories-frontend
echo 3. Build Command: npm run build
echo 4. Publish Directory: client/dist
echo.

echo Step 6: Frontend Environment Variables
echo REACT_APP_API_URL=https://doctor-directories-backend.onrender.com
echo NODE_ENV=production
echo.

echo Step 7: Update URLs
echo 1. Update CLIENT_URL in backend to your frontend URL
echo 2. Redeploy if needed
echo.

echo Expected Results:
echo Frontend: https://doctor-directories-frontend.onrender.com
echo Backend:  https://doctor-directories-backend.onrender.com
echo Database: Auto-connected
echo.

echo Deployment Complete!
echo Test your application at the frontend URL above.
pause
