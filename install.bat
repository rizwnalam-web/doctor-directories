
@echo off
echo ========================================
echo Doctor Directories - Installation
echo ========================================
echo.

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed successfully!
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy .env.example to .env and configure your database
echo 2. Run: npm run prisma:generate
echo 3. Run: npm run prisma:migrate
echo 4. Run: npm run seed
echo 5. Run: npm run dev
echo.
pause
