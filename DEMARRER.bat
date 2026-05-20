@echo off
title ZenBook
color 0A
echo.
echo  ================================
echo    ZenBook - Demarrage en cours
echo  ================================
echo.

cd /d "%~dp0"

echo [1/3] Verification Node.js...
node --version >nul 2>&1
if errorlevel 1 (
  echo ERREUR : Node.js non installe. Visitez https://nodejs.org
  pause
  exit /b
)

echo [2/3] Installation des dependances...
cd backend && call npm install --silent 2>nul && cd ..
cd frontend && call npm install --silent 2>nul && cd ..

echo [3/3] Demarrage des serveurs...
echo.
start "ZenBook API" cmd /k "cd /d "%~dp0backend" && node src/index.js"
timeout /t 2 /nobreak >nul
start "ZenBook App" cmd /k "cd /d "%~dp0frontend" && npx vite"
timeout /t 3 /nobreak >nul

echo  API    : http://localhost:5000
echo  App    : http://localhost:5173
echo.
echo  Ouverture du navigateur...
start http://localhost:5173

echo.
echo  Appuyez sur une touche pour fermer cette fenetre.
pause >nul
