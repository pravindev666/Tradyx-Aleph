# 🚀 Step-by-Step Deployment Guide

## Prerequisites

- GitHub account with your repository
- Vercel account (free tier works)
- All code pushed to GitHub repository

---

## Part 1: Deploy to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub (recommended for easy integration)

### Step 2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Select your GitHub repository (`tradyx-options-dashboard`)
4. Click **"Import"**

### Step 3: Configure Project Settings
1. **Project Name:** `tradyx-options-dashboard` (or your preferred name)
2. **Framework Preset:** Next.js (should auto-detect)
3. **Root Directory:** `./` (or `tradyx-options-dashboard` if repo is in subdirectory)
4. **Build Command:** `npm run build` (default)
5. **Output Directory:** `.next` (default)
6. **Install Command:** `npm ci` (recommended for production)

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add these (from `.env.example`):

```
NEXT_PUBLIC_DASHBOARD_URL=/data/dashboard.json
NEXT_PUBLIC_STALE_SOFT_MIN=6
NEXT_PUBLIC_STALE_HARD_MIN=20
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_728x90=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_300x250=XXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NODE_ENV=production
```

**Note:** Replace placeholder values (XXXXXXXXXX) with your actual IDs.

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Your site will be live at `https://your-project.vercel.app`

### Step 6: Get Vercel Credentials (for GitHub Actions)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Settings"** → **"Tokens"**
3. Click **"Create Token"**
4. Name it: `github-actions-deploy`
5. Copy the token (you'll need it for GitHub Secrets)
6. Go to **"Settings"** → **"General"**
7. Copy your **"Organization ID"** and **"Project ID"**

---

## Part 2: Setup GitHub Actions

### Step 7: Configure GitHub Secrets
1. Go to your GitHub repository
2. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Click **"New repository secret"** and add these 3 secrets:

**Secret 1: VERCEL_TOKEN**
- Name: `VERCEL_TOKEN`
- Value: (Paste the token from Step 6)

**Secret 2: VERCEL_ORG_ID**
- Name: `VERCEL_ORG_ID`
- Value: (Paste Organization ID from Step 6)

**Secret 3: VERCEL_PROJECT_ID**
- Name: `VERCEL_PROJECT_ID`
- Value: (Paste Project ID from Step 6)

### Step 8: Enable GitHub Actions
1. Go to your repository → **"Actions"** tab
2. If prompted, click **"I understand my workflows, go ahead and enable them"**
3. You should see 4 workflows:
   - ✅ Deploy to Vercel
   - ✅ Update Dashboard Data
   - ✅ CI/CD Pipeline
   - ✅ Python Linting

### Step 9: Test UI Deployment
1. Make a small change to any file (e.g., add a comment)
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   ```
3. Go to **"Actions"** tab in GitHub
4. You should see **"Deploy to Vercel"** workflow running
5. Wait for it to complete (green checkmark)
6. Check your Vercel dashboard - new deployment should appear

### Step 10: Test Data Update Workflow
1. Go to **"Actions"** tab
2. Click **"Update Dashboard Data"** workflow
3. Click **"Run workflow"** → **"Run workflow"** (manual trigger)
4. Wait for it to complete
5. Check if `public/data/dashboard.json` was updated in your repository

---

## Part 3: Verify Everything Works

### Step 11: Check Vercel Deployment
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Verify:
   - ✅ Dashboard loads
   - ✅ All tiles display data
   - ✅ Dark/light mode toggle works
   - ✅ Refresh button works
   - ✅ Mobile responsive

### Step 12: Check Data Updates
1. Wait for scheduled run (or trigger manually)
2. Check GitHub repository → `public/data/dashboard.json`
3. Verify `updatedAt` timestamp is recent
4. Refresh your Vercel site - data should update

### Step 13: Monitor Workflows
1. Go to **"Actions"** tab regularly
2. Check workflow runs are successful
3. **Data Update** should run every 15 minutes during market hours:
   - IST: 9:15 AM - 3:30 PM (Monday to Friday)
   - UTC: 3:45 AM - 10:00 AM (Monday to Friday)

---

## Part 4: Production Checklist

### ✅ Pre-Launch
- [ ] Vercel deployment successful
- [ ] GitHub Actions workflows enabled
- [ ] All secrets configured
- [ ] Environment variables set
- [ ] Test deployment works
- [ ] Test data update works

### ✅ Post-Launch
- [ ] Production URL accessible
- [ ] All tiles show data
- [ ] Data updates automatically
- [ ] Mobile responsive
- [ ] Legal pages accessible
- [ ] No console errors

---

## Troubleshooting

### Vercel Deployment Fails
1. Check build logs in Vercel dashboard
2. Verify `package.json` has correct scripts
3. Check environment variables are set
4. Verify Node.js version (should be 20.x)

### GitHub Actions Fails
1. Check workflow logs in **"Actions"** tab
2. Verify secrets are correct
3. Check Python scripts run locally
4. Verify `public/data/dashboard.json` exists

### Data Not Updating
1. Check `data-update.yml` workflow runs
2. Verify Python dependencies install correctly
3. Check `public/data/dashboard.json` is committed
4. Verify cron schedule is correct

### UI Shows Old Data
1. Hard refresh browser (Ctrl+F5)
2. Check `updatedAt` in `dashboard.json`
3. Verify data file is in `public/data/`
4. Check browser console for errors

---

## Quick Reference

### Manual Data Update
```bash
cd scripts
python run_all.py
git add public/data/dashboard.json
git commit -m "chore: update data"
git push
```

### Check Workflow Status
- GitHub → Actions tab → View workflow runs

### Check Deployment Status
- Vercel Dashboard → Deployments tab

### View Logs
- Vercel: Dashboard → Deployment → View Function Logs
- GitHub: Actions → Workflow run → View logs

---

## Support

If you encounter issues:
1. Check workflow logs in GitHub Actions
2. Check deployment logs in Vercel
3. Verify all secrets are set correctly
4. Contact: support@tradyx.in

---

**🎉 Congratulations! Your dashboard is now live!**

