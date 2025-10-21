@echo off
echo ========================================
echo Starting Doctor Directories (Stable)
echo ========================================
echo.
echo Starting server on port 5000...
start "Doctor-Server" cmd /c "cd /d %~dp0 && npm run server"
timeout /t 2 /nobreak > nul
echo.
echo Starting client on port 5173...
start "Doctor-Client" cmd /c "cd /d %~dp0\client && npm run dev"
echo.
echo ========================================
echo Both services started in separate windows
echo Server: http://localhost:5000
echo Client: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit (services will keep running)...
pause > nul
