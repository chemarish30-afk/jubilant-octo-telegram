# Deployment Guide

This guide will help you set up CI/CD with GitHub Actions and deploy your Secure Book Reader application to Netlify.

## Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Backend Hosting**: Choose a platform for your Flask backend (Render, Railway, Heroku, etc.)

## Step 1: Set Up Backend Deployment

### Option A: Deploy to Render (Recommended)

1. **Sign up for Render**: Go to [render.com](https://render.com) and create an account
2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Choose the repository
   - Set the following:
     - **Name**: `secure-book-reader-backend`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app`
3. **Add Environment Variables**:
   - `SECRET_KEY`: Generate a secure random string
   - `DATABASE_URL`: Use the provided PostgreSQL URL or keep SQLite for development
4. **Deploy**: Click "Create Web Service"

### Option B: Deploy to Railway

1. **Sign up for Railway**: Go to [railway.app](https://railway.app)
2. **Create a new project** and connect your GitHub repository
3. **Add environment variables** in the Railway dashboard
4. **Deploy**: Railway will automatically deploy when you push to main

### Option C: Deploy to Heroku

1. **Install Heroku CLI** and login
2. **Create a new Heroku app**:
   ```bash
   heroku create your-app-name
   ```
3. **Set environment variables**:
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   ```
4. **Deploy**:
   ```bash
   git push heroku main
   ```

## Step 2: Configure GitHub Secrets

In your GitHub repository, go to **Settings > Secrets and variables > Actions** and add the following secrets:

### For Netlify Deployment:
- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_SITE_ID`: Your Netlify site ID

### For Backend Deployment (choose one):

#### Render:
- `RENDER_API_KEY`: Your Render API key
- `RENDER_SERVICE_ID`: Your Render service ID

#### Railway:
- `RAILWAY_TOKEN`: Your Railway token
- `RAILWAY_SERVICE`: Your Railway service name

#### Heroku:
- `HEROKU_API_KEY`: Your Heroku API key
- `HEROKU_APP_NAME`: Your Heroku app name
- `HEROKU_EMAIL`: Your Heroku email

## Step 3: Set Up Netlify

### Method 1: Automatic Deployment via GitHub Actions

1. **Create a new site in Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Set build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `build`
   - Click "Deploy site"

2. **Get your site credentials**:
   - Go to **Site settings > General**
   - Copy your **Site ID**
   - Go to **User settings > Applications > Personal access tokens**
   - Create a new token and copy it

3. **Add secrets to GitHub** (as mentioned in Step 2)

### Method 2: Manual Deployment

1. **Build your project locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `build` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=build
   ```

## Step 4: Configure Environment Variables

### Frontend Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend Environment Variables

Set these in your backend hosting platform:

```env
SECRET_KEY=your-very-secure-secret-key
DATABASE_URL=your-database-url
FLASK_ENV=production
```

## Step 5: Update Configuration Files

### Update netlify.toml

Replace `https://your-backend-url.com` with your actual backend URL:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-backend-url.com/api/:splat"
  status = 200
  force = true
```

### Update public/_redirects

```plaintext
# Handle client-side routing
/*    /index.html   200

# API proxy
/api/*  https://your-actual-backend-url.com/api/:splat  200
```

## Step 6: Test Your Deployment

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Configure deployment"
   git push origin main
   ```

2. **Check GitHub Actions**:
   - Go to your repository's Actions tab
   - Verify that the CI/CD pipeline runs successfully

3. **Test your application**:
   - Visit your Netlify URL
   - Test login, registration, and book upload functionality
   - Verify that API calls work correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your backend allows requests from your Netlify domain
   - Update CORS configuration in `app.py`

2. **API Proxy Issues**:
   - Verify the backend URL in `netlify.toml` and `_redirects`
   - Check that your backend is accessible

3. **Build Failures**:
   - Check the build logs in Netlify
   - Ensure all dependencies are properly installed

4. **Database Issues**:
   - For production, use a proper database (PostgreSQL, MySQL)
   - SQLite is not suitable for production deployments

### Debugging Steps

1. **Check Netlify Function Logs**:
   - Go to your Netlify dashboard
   - Check the Functions tab for any errors

2. **Test API Endpoints**:
   - Use tools like Postman or curl to test your backend directly
   - Verify that all endpoints return expected responses

3. **Check Browser Console**:
   - Open browser developer tools
   - Look for any JavaScript errors or failed network requests

## Security Considerations

1. **Environment Variables**:
   - Never commit sensitive data to your repository
   - Use environment variables for all secrets

2. **HTTPS**:
   - Netlify provides HTTPS by default
   - Ensure your backend also uses HTTPS

3. **CORS**:
   - Configure CORS to only allow your Netlify domain
   - Don't use wildcard (*) in production

4. **Database**:
   - Use a production-grade database
   - Implement proper backup strategies

## Monitoring and Maintenance

1. **Set up monitoring**:
   - Use Netlify Analytics
   - Set up error tracking (Sentry, LogRocket)
   - Monitor backend performance

2. **Regular updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Regular backups

3. **Performance optimization**:
   - Optimize images and assets
   - Implement caching strategies
   - Monitor Core Web Vitals

## Support

If you encounter issues:

1. Check the [Netlify documentation](https://docs.netlify.com/)
2. Review [GitHub Actions documentation](https://docs.github.com/en/actions)
3. Check your chosen backend platform's documentation
4. Open an issue in your GitHub repository

## Next Steps

After successful deployment:

1. **Set up a custom domain** (optional)
2. **Configure SSL certificates** (usually automatic)
3. **Set up monitoring and analytics**
4. **Implement backup strategies**
5. **Plan for scaling**
