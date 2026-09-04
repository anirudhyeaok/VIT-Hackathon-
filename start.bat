@echo off
title GigWallet - Starting All Services
echo.
echo  ========================================
echo   GigWallet - Starting All Services
echo  ========================================
echo.

echo [1/3] Starting Mock Platform APIs (port 3001)...
cd mock-platforms
start /B cmd /c "npm start 2>nul || node server.js"
cd ..
timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend API (port 3000)...
cd backend
start /B cmd /c "npm run start:dev 2>nul || npm start"
cd ..
timeout /t 3 /nobreak >nul

echo [3/3] Starting Admin Dashboard (port 5173)...
cd admin-dashboard
start /B cmd /c "npm run dev"
cd ..
timeout /t 3 /nobreak >nul

echo.
echo  ========================================
echo   All services started!
echo   Admin Dashboard: http://localhost:5173
echo   Backend API:     http://localhost:3000
echo   Mock Platforms:  http://localhost:3001
echo  ========================================
echo.
echo Press any key to stop all services...
start http://localhost:5173
pause >nul
taskkill /F /IM node.exe >nul 2>&1
echo Services stopped.
