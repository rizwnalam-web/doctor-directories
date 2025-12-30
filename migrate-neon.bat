@echo off
echo ========================================
echo Simple Neon Database Migration
echo ========================================
echo.

echo Navigating to server directory...
cd server
if %ERRORLEVEL% NEQ 0 (
    echo Error: Could not find server directory
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Running database migration...
call node migrate-neon.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration completed successfully!
    echo ========================================
    echo.
    echo Your Neon database is ready to use.
    echo Console: https://console.neon.tech/app/projects/restless-sound-17286421
    echo.
    set /p seed="Do you want to seed the database? (y/N): "
    if /i "%seed%"=="y" (
        echo Running seed script...
        call node seed.js
        if %ERRORLEVEL% EQU 0 (
            echo Database seeded successfully!
        ) else (
            echo Warning: Seeding failed or incomplete
        )
    )
) else (
    echo.
    echo Migration failed. Please check:
    echo 1. DATABASE_URL in .env file
    echo 2. Network connection to Neon
    echo 3. Database credentials
    pause
    exit /b 1
)

cd ..
echo.
echo Press any key to exit...
pause > NUL