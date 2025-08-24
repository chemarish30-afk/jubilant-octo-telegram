#!/bin/bash

echo "📚 Secure Book Reader - Unix/Linux/Mac Startup"
echo "==============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ from https://python.org"
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not available"
    echo "Please ensure pip is installed with Python"
    exit 1
fi

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Python dependencies"
        exit 1
    fi
    echo "✅ Python dependencies installed"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed or not in PATH"
    echo "Please install Node.js 16+ from https://nodejs.org"
    echo ""
    echo "Starting backend only..."
    echo ""
else
    # Check if npm is available
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not available"
        echo "Please ensure npm is installed with Node.js"
        exit 1
    fi
    
    # Install React dependencies if package.json exists
    if [ -f "package.json" ]; then
        if [ ! -d "node_modules" ]; then
            echo "Installing React dependencies..."
            npm install
            if [ $? -ne 0 ]; then
                echo "❌ Failed to install React dependencies"
                exit 1
            fi
            echo "✅ React dependencies installed"
        fi
        
        echo ""
        echo "🚀 Starting React frontend in background..."
        npm start &
        FRONTEND_PID=$!
        echo "Frontend will be available at: http://localhost:3000"
        echo "Frontend PID: $FRONTEND_PID"
        echo ""
    fi
fi

echo "🚀 Starting Flask backend server..."
echo "Backend will be available at: http://localhost:5000"
echo ""
echo "Default admin credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "👋 Shutting down..."
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "Stopping React frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the Flask backend
python3 app.py

# Cleanup on exit
cleanup
