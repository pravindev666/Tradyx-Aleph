# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

1. **Environment Variables**
   - Copy `.env.example` to `.env.production`
   - Update all placeholder values (AdSense IDs, API keys, etc.)
   - Set `NODE_ENV=production`
   - Set `NEXT_PUBLIC_APP_URL` to your production domain

2. **Python Dependencies**
   ```bash
   cd scripts
   pip install -r requirements.txt
   ```

3. **Node.js Dependencies**
   ```bash
   npm ci  # Use ci for production (clean install)
   ```

4. **Build Test**
   ```bash
   npm run build
   ```

### Deployment Architecture

**UI Deployment (Vercel):**
- The Next.js UI is automatically deployed to Vercel when code changes are pushed
- Vercel serves static files from the `public/` directory
- No redeployment needed when data files update (Vercel serves them as static assets)

**Data Updates (GitHub Actions):**
- Python scripts run in GitHub Actions every 15 minutes during market hours
- Generated `dashboard.json` is committed back to the repository
- Vercel automatically serves the updated file from `public/data/dashboard.json`

### GitHub Actions Workflows

The repository includes these GitHub Actions workflows:

1. **`.github/workflows/deploy.yml`** - UI Deployment to Vercel
   - Runs on push to main/master (ignores data file changes)
   - Builds Next.js app
   - Deploys to Vercel
   - **Note:** Does NOT run Python scripts (handled separately)

2. **`.github/workflows/data-update.yml`** - Automated Data Updates
   - Runs every 15 minutes during market hours (IST: 9:15 AM - 3:30 PM)
   - Executes Python scripts to fetch and compute data
   - Commits `public/data/dashboard.json` back to repository
   - Vercel serves the updated file automatically (no redeploy needed)

3. **`.github/workflows/ci.yml`** - Continuous Integration
   - Runs on pull requests
   - Type checks TypeScript
   - Builds Next.js app
   - Validates Python scripts

### Required GitHub Secrets

Add these secrets in your GitHub repository settings:

- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Vercel Deployment

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm ci`

2. **Environment Variables**
   - Add all variables from `.env.example` to Vercel dashboard
   - Set production values for AdSense IDs, API keys, etc.

3. **Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `./` (or `tradyx-options-dashboard` if in subdirectory)

### Data Generation

**Automated (Recommended):**
- GitHub Actions automatically runs Python scripts every 15 minutes during market hours
- No manual intervention needed
- Data is committed to `public/data/dashboard.json` which Vercel serves automatically

**Manual (If needed):**
```bash
cd scripts
python run_all.py
```

This updates:
- `scripts/data/dashboard.json` (intermediate)
- `public/data/dashboard.json` (served by Vercel)

### Monitoring

1. **Error Tracking**
   - Monitor Vercel logs for build errors
   - Check GitHub Actions workflow runs
   - Monitor browser console for runtime errors

2. **Data Freshness**
   - Check `updatedAt` timestamp in `dashboard.json`
   - Ensure scheduled workflows are running
   - Monitor data update workflow logs

### Post-Deployment

1. **Verify Deployment**
   - Check production URL loads correctly
   - Verify all tiles display data
   - Test refresh button functionality
   - Check mobile responsiveness

2. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Monitor bundle size

3. **SEO**
   - Verify meta tags are correct
   - Check sitemap.xml is accessible
   - Verify robots.txt is correct

### Rollback Procedure

If deployment fails:

1. Revert the last commit
2. Or redeploy previous successful build from Vercel dashboard
3. Check GitHub Actions logs for errors
4. Fix issues and redeploy

### Production URLs

- Production: `https://tradyx.vercel.app` (update with your domain)
- Staging: `https://tradyx-staging.vercel.app` (optional)

### Support

For deployment issues:
- Check GitHub Actions logs
- Review Vercel deployment logs
- Check `scripts/UPDATE_GUIDE.md` for data issues
- Contact: support@tradyx.in

