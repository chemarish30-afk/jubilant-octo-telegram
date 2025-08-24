#!/usr/bin/env python3
"""
Secure Book Reader - Startup Script
This script starts the Flask backend and provides instructions for the React frontend.
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed."""
    try:
        import flask
        import flask_sqlalchemy
        import flask_login
        import flask_cors
        import PyPDF2
        import PIL
        import bcrypt
        import jwt
        print("✅ All Python dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def create_directories():
    """Create necessary directories if they don't exist."""
    directories = ['uploads', 'static', 'static/pages']
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
    print("✅ Directories created/verified")

def start_backend():
    """Start the Flask backend server."""
    print("\n🚀 Starting Flask backend server...")
    print("Backend will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server\n")
    
    try:
        # Import and run the Flask app
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Backend server stopped")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return False
    
    return True

def main():
    """Main startup function."""
    print("📚 Secure Book Reader - Startup")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Check if React dependencies are installed
    if not Path("node_modules").exists():
        print("\n⚠️  React dependencies not found!")
        print("To install React dependencies, run:")
        print("  npm install")
        print("\nAfter installing, start the React frontend with:")
        print("  npm start")
        print("\nThe frontend will be available at: http://localhost:3000")
    
    # Start backend
    start_backend()

if __name__ == "__main__":
    main()
