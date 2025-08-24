#!/usr/bin/env python3
"""
Test script to debug registration issues
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:5000"  # Change this to your backend URL

def test_registration():
    """Test the registration endpoint"""
    
    # Test data
    test_user = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    print("Testing registration endpoint...")
    print(f"URL: {BASE_URL}/api/register")
    print(f"Data: {json.dumps(test_user, indent=2)}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/register",
            json=test_user,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
        else:
            print("❌ Registration failed!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - Is the backend running?")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def test_backend_health():
    """Test if the backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Backend health check: {response.status_code}")
        return True
    except:
        print("Backend is not running or not accessible")
        return False

if __name__ == "__main__":
    print("=== Registration Debug Test ===\n")
    
    # First check if backend is running
    if test_backend_health():
        test_registration()
    else:
        print("Please start the backend first:")
        print("python app.py")
