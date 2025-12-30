@echo off
echo ========================================
echo Neon Database Setup and Migration Script
echo ========================================
echo.

REM Extract database details from Neon URL
echo Step 1: Setting up Neon Database Environment
echo Neon Project: restless-sound-17286421
echo Branch: br-restless-smoke-ah1mx7fi
echo.

REM Check if .env exists in server directory
if not exist "server\.env" (
    echo Creating server\.env file...
    copy NUL "server\.env" > NUL
) else (
    echo Found existing server\.env file
)

echo Step 2: Configuring Database URL
echo Please ensure your server\.env file contains:
echo DATABASE_URL="postgresql://[username]:[password]@[host]/[database]?sslmode=require"
echo.
echo For Neon, your DATABASE_URL should look like:
echo DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
echo.

REM Navigate to server directory
cd server

echo Step 3: Installing dependencies...
call npm install

echo.
echo Step 4: Generating Prisma client...
call npx prisma generate

echo.
echo Step 5: Checking database connection...
call npx prisma db pull --schema=./prisma/schema.prisma 2>NUL
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Could not connect to database. Please verify your DATABASE_URL
    echo.
    pause
    exit /b 1
)

echo Connection successful!
echo.

echo Step 6: Applying database migrations...
call npx prisma migrate deploy

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Migration failed. Attempting to reset and migrate...
    echo This will recreate your database schema.
    set /p confirm="Continue? (y/N): "
    if /i "%confirm%" NEQ "y" (
        echo Migration cancelled.
        pause
        exit /b 1
    )
    
    echo Resetting database...
    call npx prisma migrate reset --force
    call npx prisma migrate deploy
)

echo.
echo Step 7: Seeding database with initial data...
set /p seed="Do you want to seed the database with sample data? (y/N): "
if /i "%seed%"=="y" (
    call node seed.js
    if %ERRORLEVEL% EQU 0 (
        echo Database seeded successfully!
    ) else (
        echo Warning: Database seeding failed or was skipped.
    )
)

echo.
echo Step 8: Verification
echo Running database introspection to verify setup...
call npx prisma db pull --print 2>NUL
if %ERRORLEVEL% EQU 0 (
    echo Database schema verified successfully!
) else (
    echo Warning: Could not verify database schema.
)

echo.
echo ========================================
echo Neon Database Setup Complete!
echo ========================================
echo.
echo Your database is ready at:
echo https://console.neon.tech/app/projects/restless-sound-17286421/branches/br-restless-smoke-ah1mx7fi/tables
echo.
echo Next steps:
echo 1. Your server can now connect to Neon database
echo 2. Update your production environment variables
echo 3. Deploy your application
echo.

REM Navigate back to root
cd ..

echo Press any key to exit...
pause > NUL