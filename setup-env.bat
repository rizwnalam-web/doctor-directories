@echo off
echo ========================================
echo Doctor Directories - Environment Setup
echo ========================================
echo.

echo Step 1: Setting up development environment...
if not exist .env (
    echo Copying development environment file...
    copy .env.development .env
    echo ✅ Development environment file created as .env
) else (
    echo ✅ .env file already exists
)

echo.
echo Step 2: Please update your .env file with:
echo - Your PostgreSQL database credentials
echo - Your Gmail address and app password
echo - Any other configuration needed
echo.

echo Step 3: Install dependencies...
npm install

echo.
echo Step 4: Start development servers...
echo Run: npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.

echo ========================================
echo Setup Complete!
echo ========================================
pause
