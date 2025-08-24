# Troubleshooting Guide

## Registration Issues

### Common Registration Problems

1. **"Registration failed" error**
   - Check if the backend is running: `python app.py`
   - Verify database is created: Check for `instance/app.db` file
   - Check browser console for detailed error messages

2. **"Username already exists" error**
   - Try a different username
   - Check if you've registered before

3. **"Email already exists" error**
   - Try a different email address
   - Check if you've registered before

4. **Network/Connection errors**
   - Ensure backend is running on `http://localhost:5000`
   - Check if frontend proxy is configured correctly
   - Verify CORS settings

### Debugging Steps

1. **Test Backend Health**
   ```bash
   curl http://localhost:5000/
   # Should return: {"status": "ok", "message": "Backend is running"}
   ```

2. **Test Registration API**
   ```bash
   python test_registration.py
   ```

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Try registering and check for error messages

4. **Check Backend Logs**
   - Look at the terminal where `python app.py` is running
   - Check for error messages during registration

### Database Issues

1. **Database not created**
   ```bash
   python -c "from app import app, db; app.app_context().push(); db.create_all()"
   ```

2. **Database locked**
   - Stop the backend (`Ctrl+C`)
   - Delete `instance/app.db` file
   - Restart backend: `python app.py`

3. **Permission issues**
   - Ensure write permissions in the project directory
   - Check if `instance/` directory exists

### Frontend Issues

1. **Proxy not working**
   - Check `package.json` has `"proxy": "http://localhost:5000"`
   - Restart frontend: `npm start`

2. **CORS errors**
   - Ensure backend has CORS enabled
   - Check if frontend is running on correct port

3. **Axios errors**
   - Check network tab in browser dev tools
   - Verify request URL and data format

### Environment Issues

1. **Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Node dependencies**
   ```bash
   npm install
   ```

3. **Port conflicts**
   - Check if port 5000 is available
   - Change port in `app.py` if needed

## Login Issues

### Common Login Problems

1. **"Invalid credentials" error**
   - Verify username and password
   - Check if user was registered successfully
   - Try the demo admin account: `admin` / `admin123`

2. **Session issues**
   - Clear browser cookies
   - Check if backend is running

## File Upload Issues

### Common Upload Problems

1. **"Only PDF files are allowed"**
   - Ensure file has `.pdf` extension
   - Check file is actually a PDF

2. **File size too large**
   - Maximum file size is 16MB
   - Compress PDF if needed

3. **Upload directory issues**
   - Check if `uploads/` directory exists
   - Verify write permissions

## General Debugging

### Backend Debugging

1. **Enable debug mode**
   ```python
   app.run(debug=True, host='0.0.0.0', port=5000)
   ```

2. **Check logs**
   - Look for error messages in terminal
   - Check for database errors

3. **Test endpoints**
   ```bash
   curl -X POST http://localhost:5000/api/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@test.com","password":"test123"}'
   ```

### Frontend Debugging

1. **Check console errors**
   - Open browser dev tools
   - Look for JavaScript errors

2. **Check network requests**
   - Go to Network tab in dev tools
   - Check request/response data

3. **Test API calls**
   ```javascript
   // In browser console
   fetch('/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

## Quick Fixes

### Reset Everything
```bash
# Stop all processes
# Delete database
rm -f instance/app.db

# Restart backend
python app.py

# In another terminal, restart frontend
npm start
```

### Test Registration
```bash
# Run test script
python test_registration.py
```

### Check All Services
```bash
# Backend health
curl http://localhost:5000/

# Frontend (should show React app)
curl http://localhost:3000/
```

## Getting Help

If you're still having issues:

1. **Check the logs** - Look for specific error messages
2. **Test step by step** - Use the test script
3. **Verify setup** - Ensure all dependencies are installed
4. **Check versions** - Ensure Python 3.9+ and Node 18+

Common error patterns:
- `Connection refused` → Backend not running
- `Module not found` → Dependencies not installed
- `Permission denied` → File permission issues
- `Database locked` → Multiple instances running
