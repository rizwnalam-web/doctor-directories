@echo off
echo ========================================
echo Production Database Migration for Render
echo ========================================

echo.
echo Step 1: Update DATABASE_URL in your .env file
echo Replace with your actual Render PostgreSQL URL
echo.

echo Step 2: Generate Prisma client
npx prisma generate

echo.
echo Step 3: Deploy database schema
npx prisma migrate deploy

echo.
echo Step 4: Seed database (optional)
node server/seed.js

echo.
echo Step 5: Verify connection
npx prisma studio --browser none

echo.
echo Migration complete!
pause
