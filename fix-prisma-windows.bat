@echo off
echo ========================================
echo Prisma Client Generation Fix for Windows
echo ========================================
echo.

echo This script helps resolve EPERM errors when generating Prisma client
echo Common causes: Antivirus software, file permissions, locked processes
echo.

echo Step 1: Stopping potentially conflicting processes...
taskkill /f /im node.exe 2>NUL
taskkill /f /im Code.exe 2>NUL
echo Processes stopped (if they were running)
echo.

echo Step 2: Navigating to server directory...
cd server
if %ERRORLEVEL% NEQ 0 (
    echo Error: Could not find server directory
    pause
    exit /b 1
)

echo Step 3: Cleaning Prisma cache and node_modules...
set /p cleanup="Remove node_modules and reinstall? This may take a few minutes (y/N): "
if /i "%cleanup%"=="y" (
    echo Removing node_modules...
    if exist node_modules (
        rmdir /s /q node_modules
        if %ERRORLEVEL% NEQ 0 (
            echo Warning: Could not fully remove node_modules
        )
    )
    
    echo Removing package-lock.json...
    if exist package-lock.json (
        del package-lock.json
    )
    
    echo Reinstalling dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Step 4: Clearing Prisma client cache...
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma" 2>NUL
    echo Prisma cache cleared
)

echo.
echo Step 5: Generating Prisma client...
echo Attempt 1: Standard generation
call npx prisma generate
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Success! Prisma client generated successfully
    goto :success
)

echo.
echo Attempt 2: With force flag
call npx prisma generate --force
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Success! Prisma client generated with force flag
    goto :success
)

echo.
echo Attempt 3: Reinstalling Prisma packages
call npm uninstall @prisma/client prisma
call npm install @prisma/client prisma@latest
call npx prisma generate
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Success! Prisma client generated after reinstall
    goto :success
)

echo.
echo ========================================
echo All automatic attempts failed
echo ========================================
echo.
echo Manual solutions to try:
echo 1. Run this script as Administrator
echo 2. Temporarily disable antivirus software
echo 3. Close all VS Code/editor windows
echo 4. Restart your computer and try again
echo 5. Add your project folder to antivirus exclusions
echo.
echo If the issue persists, try:
echo   - npm run prisma:generate
echo   - npx prisma db pull
echo   - npx prisma db push
echo.
goto :end

:success
echo.
echo ========================================
echo Prisma Client Generation Successful!
echo ========================================
echo.
echo You can now continue with your database setup:
echo   1. npx prisma migrate deploy
echo   2. node seed.js (optional)
echo   3. npx prisma studio (to verify)
echo.

:end
cd ..
pause