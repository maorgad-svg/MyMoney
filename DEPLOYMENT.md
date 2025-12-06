# MyMoney - Deployment Guide

## Overview

This guide covers deploying MyMoney to production. The app is a static single-page application that can be hosted on any static hosting service.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] App builds successfully: `npm run build`
- [ ] You have tested locally: `npm run preview`
- [ ] Your Airtable base is set up correctly
- [ ] You have your Airtable credentials ready
- [ ] You understand the app will be publicly accessible (secure your API key!)

## Build for Production

```bash
# Build the production bundle
npm run build

# Test the production build locally
npm run preview
```

The build creates a `dist/` folder with:
- `index.html` - Entry point
- `assets/` - Optimized CSS and JavaScript bundles

## Deployment Options

### Option 1: Google Cloud Storage (Recommended)

#### Step 1: Create a Cloud Storage Bucket

```bash
# Install Google Cloud SDK if needed
# https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Create a bucket
gsutil mb gs://mymoney-app

# Make bucket public for website hosting
gsutil iam ch allUsers:objectViewer gs://mymoney-app

# Set up website configuration
gsutil web set -m index.html -e index.html gs://mymoney-app
```

#### Step 2: Upload Your Build

```bash
# Build the app
npm run build

# Upload to Cloud Storage
gsutil -m rsync -r -d dist/ gs://mymoney-app

# Set cache control
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://mymoney-app/**
```

#### Step 3: Configure Environment Variables

**Important**: Never include your `.env` file in the build!

For Vite apps, environment variables are embedded at build time:

```bash
# Set environment variables before building
export VITE_AIRTABLE_API_KEY="your_key"
export VITE_AIRTABLE_BASE_ID="your_base_id"
export VITE_AIRTABLE_TABLE_NAME="Assets"

# Build with environment variables
npm run build

# Deploy
gsutil -m rsync -r -d dist/ gs://mymoney-app
```

#### Step 4: Access Your App

Your app will be available at:
```
https://storage.googleapis.com/mymoney-app/index.html
```

### Option 2: Vercel (Easiest)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Deploy

```bash
# From your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? mymoney-app
# - Directory? ./
# - Override settings? No
```

#### Step 3: Set Environment Variables

```bash
# Add environment variables
vercel env add VITE_AIRTABLE_API_KEY
vercel env add VITE_AIRTABLE_BASE_ID
vercel env add VITE_AIRTABLE_TABLE_NAME

# Redeploy with environment variables
vercel --prod
```

Your app will be live at: `https://mymoney-app.vercel.app`

### Option 3: Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Deploy

```bash
# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Team: Your team
# - Site name: mymoney-app
# - Build command: npm run build
# - Publish directory: dist
```

#### Step 3: Set Environment Variables

```bash
# Set environment variables
netlify env:set VITE_AIRTABLE_API_KEY "your_key"
netlify env:set VITE_AIRTABLE_BASE_ID "your_base_id"
netlify env:set VITE_AIRTABLE_TABLE_NAME "Assets"

# Trigger a new build
netlify build
netlify deploy --prod
```

Your app will be live at: `https://mymoney-app.netlify.app`

### Option 4: GitHub Pages

#### Step 1: Update vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mymoney-app/', // Replace with your repo name
})
```

#### Step 2: Build and Deploy

```bash
# Build
npm run build

# Create gh-pages branch and deploy
npm install -g gh-pages

# Deploy to GitHub Pages
gh-pages -d dist
```

#### Step 3: Configure GitHub Repository

1. Go to your repo settings
2. Navigate to Pages
3. Select `gh-pages` branch
4. Save

Your app will be live at: `https://yourusername.github.io/mymoney-app/`

**Note**: Environment variables need to be set before building locally, as GitHub Pages doesn't support server-side environment variables.

## Security Considerations

### ⚠️ Important: API Key Security

Your Airtable API key will be embedded in the JavaScript bundle and visible to anyone who views the page source!

**For personal use only:**
- This is acceptable if you're the only user
- Keep the URL private
- Don't share your deployment URL publicly

**For better security:**
- Consider creating a backend API proxy
- Use Airtable's OAuth instead of API keys
- Implement authentication before accessing the app

### Recommendations

1. **Use a read-only API key** if possible (though this limits adding assets)
2. **Restrict Airtable base permissions** to only the Assets table
3. **Don't share your deployment URL** publicly
4. **Rotate your API key** periodically
5. **Consider adding authentication** (Auth0, Firebase Auth, etc.)

## Custom Domain (Optional)

### For Google Cloud Storage

```bash
# Verify domain ownership in Google Search Console
# Then point your domain to Google Cloud Storage

# Example DNS settings:
# CNAME: www.yourdomain.com -> c.storage.googleapis.com
```

### For Vercel/Netlify

```bash
# Vercel
vercel domains add yourdomain.com

# Netlify
netlify domains:add yourdomain.com
```

Follow the DNS configuration instructions provided.

## Continuous Deployment with Git

### Setup Git Repository

```bash
# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/yourusername/mymoney-app.git

# Commit and push
git add .
git commit -m "Initial commit - MyMoney v1"
git push -u origin main
```

### Auto-Deploy on Push

**Vercel:**
- Connect your GitHub repo in the Vercel dashboard
- Every push to main will auto-deploy

**Netlify:**
- Connect your GitHub repo in the Netlify dashboard
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- Every push to main will auto-deploy

**GitHub Actions (for Google Cloud Storage):**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Google Cloud Storage

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        env:
          VITE_AIRTABLE_API_KEY: ${{ secrets.VITE_AIRTABLE_API_KEY }}
          VITE_AIRTABLE_BASE_ID: ${{ secrets.VITE_AIRTABLE_BASE_ID }}
          VITE_AIRTABLE_TABLE_NAME: ${{ secrets.VITE_AIRTABLE_TABLE_NAME }}
        run: npm run build
      
      - name: Deploy to GCS
        uses: google-github-actions/upload-cloud-storage@v0
        with:
          credentials: ${{ secrets.GCP_CREDENTIALS }}
          path: dist
          destination: mymoney-app
```

Add secrets in GitHub repo settings:
- `VITE_AIRTABLE_API_KEY`
- `VITE_AIRTABLE_BASE_ID`
- `VITE_AIRTABLE_TABLE_NAME`
- `GCP_CREDENTIALS`

## Monitoring and Maintenance

### Check Build Size

```bash
npm run build

# Check bundle size
# CSS: ~9 KB (gzipped: 2 KB)
# JS: ~202 KB (gzipped: 63 KB)
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Test after updating
npm run build
npm run preview
```

### Rollback

If something goes wrong:

**Vercel/Netlify:**
- Use the dashboard to rollback to a previous deployment

**Google Cloud Storage:**
```bash
# Restore from a previous build
gsutil -m rsync -r -d old-dist/ gs://mymoney-app
```

## Performance Optimization

The app is already optimized, but for even better performance:

### Enable Compression

Most hosting services enable gzip/brotli automatically. Verify:
```bash
curl -H "Accept-Encoding: gzip" -I https://your-app-url.com
```

### Add Cache Headers

For Google Cloud Storage:
```bash
# Cache static assets for 1 year
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" \
  gs://mymoney-app/assets/**

# Cache HTML for 1 hour
gsutil setmeta -h "Cache-Control:public, max-age=3600" \
  gs://mymoney-app/index.html
```

### Use a CDN

For Google Cloud Storage, enable Cloud CDN:
```bash
gcloud compute backend-buckets create mymoney-backend \
  --gcs-bucket-name=mymoney-app \
  --enable-cdn
```

## Troubleshooting

### Build Fails
- Check Node.js version (v16+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for syntax errors: `npm run lint`

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Rebuild after changing environment variables
- Check that variables are set before build time

### App Loads But Shows Errors
- Check browser console for errors
- Verify Airtable credentials are correct
- Test API connection directly

### CORS Errors
- Airtable API should allow CORS from any origin
- If issues persist, check Airtable API status

## Cost Estimates

### Google Cloud Storage
- Storage: ~$0.02/GB/month
- Network: ~$0.12/GB (first 1GB free)
- Estimated: < $1/month for personal use

### Vercel
- Free tier: 100GB bandwidth/month
- Estimated: Free for personal use

### Netlify
- Free tier: 100GB bandwidth/month
- Estimated: Free for personal use

## Next Steps After Deployment

1. Test the deployed app thoroughly
2. Add the URL to your bookmarks
3. Share with family (if desired)
4. Set up monitoring (optional)
5. Plan for regular data backups from Airtable

## Support

For deployment issues:
- Check the hosting provider's documentation
- Review error logs in the provider's dashboard
- Ensure all environment variables are set correctly

Enjoy your deployed MyMoney app! 🚀



