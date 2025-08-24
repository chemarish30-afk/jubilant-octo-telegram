# Netlify Deployment Setup

## Prerequisites

1. **Netlify Account**: Create an account at [netlify.com](https://netlify.com)
2. **GitHub Repository**: Your code should be in a GitHub repository

## Setup Steps

### 1. Create a New Site on Netlify

1. Go to your Netlify dashboard
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select your repository

### 2. Configure Build Settings

**Important**: Since we're using GitHub Actions for building, configure Netlify as follows:

- **Build command**: Leave empty (we build in GitHub Actions)
- **Publish directory**: `build`
- **Node version**: `18`
- **NPM version**: `9`

### 3. Set Up GitHub Secrets

In your GitHub repository, go to Settings → Secrets and variables → Actions, and add:

- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_SITE_ID`: Your Netlify site ID

#### Getting Netlify Auth Token:
1. Go to Netlify → User Settings → Applications → Personal access tokens
2. Create a new token with appropriate permissions

#### Getting Site ID:
1. Go to your site in Netlify dashboard
2. Site ID is shown in the site overview or in the URL

### 4. Environment Variables (Optional)

If you need to configure environment variables for your frontend:

1. Go to your Netlify site → Site settings → Environment variables
2. Add any required environment variables

### 5. Custom Domain (Optional)

1. Go to your Netlify site → Domain settings
2. Add your custom domain
3. Configure DNS settings as instructed

## Deployment Flow

1. **GitHub Actions** builds the React app
2. **GitHub Actions** uploads build artifacts
3. **GitHub Actions** downloads artifacts and deploys to Netlify
4. **Netlify** serves the static files

## Troubleshooting

### Build Command Not Found
- Ensure `netlify.toml` doesn't have a build command (we build in GitHub Actions)
- Check that the publish directory is set to `build`

### Missing Dependencies
- The build happens in GitHub Actions, not Netlify
- Check GitHub Actions logs for build issues

### API Proxy Issues
- Ensure your backend URL is correctly configured in `netlify.toml`
- Update the redirect rule to point to your actual backend URL

### Environment Variables
- Frontend environment variables should be set in Netlify dashboard
- Backend environment variables should be set in your backend hosting platform

## Security Headers

The `netlify.toml` includes security headers:
- Content Security Policy
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy

These help secure your application against common web vulnerabilities.
