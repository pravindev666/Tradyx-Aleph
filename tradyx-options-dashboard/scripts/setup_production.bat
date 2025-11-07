@echo off
REM Production setup script for Windows

echo ==========================================
echo Tradyx Dashboard - Production Setup
echo ==========================================

REM Check Python version
echo Checking Python version...
python --version
if errorlevel 1 (
    echo Python 3.12+ required
    exit /b 1
)

REM Check Node.js version
echo Checking Node.js version...
node --version
if errorlevel 1 (
    echo Node.js 20+ required
    exit /b 1
)

REM Install Python dependencies
echo Installing Python dependencies...
cd scripts
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install Python dependencies
    exit /b 1
)

REM Install Node.js dependencies
echo Installing Node.js dependencies...
cd ..
call npm ci
if errorlevel 1 (
    echo Failed to install Node.js dependencies
    exit /b 1
)

REM Validate data
echo Validating data files...
cd scripts
python validate_production.py
if errorlevel 1 (
    echo Warning: Some data files may be missing
)

echo.
echo ==========================================
echo Setup complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Copy .env.example to .env.local
echo 2. Configure environment variables
echo 3. Run: npm run build
echo 4. Run: npm start

pause

