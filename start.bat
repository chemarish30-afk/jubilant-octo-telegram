@echo off
echo 📚 Secure Book Reader - Windows Startup
echo ========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if pip is available
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip is not available
    echo Please ensure pip is installed with Python
    pause
    exit /b 1
)

REM Install Python dependencies if requirements.txt exists
if exist requirements.txt (
    echo Installing Python dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Failed to install Python dependencies
        pause
        exit /b 1
    )
    echo ✅ Python dependencies installed
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    echo.
    echo Starting backend only...
    echo.
) else (
    REM Check if npm is available
    npm --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ npm is not available
        echo Please ensure npm is installed with Node.js
        pause
        exit /b 1
    )
    
    REM Install React dependencies if package.json exists
    if exist package.json (
        if not exist node_modules (
            echo Installing React dependencies...
            npm install
            if errorlevel 1 (
                echo ❌ Failed to install React dependencies
                pause
                exit /b 1
            )
            echo ✅ React dependencies installed
        )
        
        echo.
        echo 🚀 Starting React frontend in new window...
        start "React Frontend" cmd /k "npm start"
        echo Frontend will be available at: http://localhost:3000
        echo.
    )
)

echo 🚀 Starting Flask backend server...
echo Backend will be available at: http://localhost:5000
echo.
echo Default admin credentials:
echo Username: admin
echo Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the Flask backend
python app.py

pause
