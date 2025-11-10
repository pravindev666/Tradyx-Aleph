# ☁️ Cloudflare Pages Setup Guide

## ❌ Current Issue

Cloudflare is trying to use `wrangler deploy` (Workers) instead of Pages deployment.

**Error:**
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

## ✅ Solution: Use Cloudflare Pages (Not Workers)

Cloudflare Pages is different from Workers. Pages is for static sites (like your Next.js export).

---

## 🚀 Setup Instructions

### Option 1: Auto-Deploy from GitHub (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Go to: **Workers & Pages** → **Pages** → **Create a project**

2. **Connect to Git**
   - Click: **Connect to Git**
   - Select your GitHub repository
   - Authorize Cloudflare

3. **Configure Build Settings**

   **Project name:** `tradyx-dashboard`
   
   **Production branch:** `main`
   
   **Framework preset:** `Next.js (Static HTML Export)`
   
   **Build command:** `cd tradyx-options-dashboard && npm run build`
   
   **Build output directory:** `tradyx-options-dashboard/out`
   
   **Root directory:** `tradyx-options-dashboard`
   
   **Node.js version:** `20`

4. **Environment Variables** (if needed)
   - Add any environment variables your app needs
   - Usually none needed for static export

5. **Save and Deploy**
   - Click: **Save and Deploy**
   - Wait for build to complete
   - Your site: `tradyx-dashboard.pages.dev`

---

### Option 2: Deploy from GitHub Actions (Bypass Build Limits)

If you want to use 0 Cloudflare build minutes:

1. **Create Cloudflare Pages Project** (same as Option 1, but don't build)

2. **Disable Auto-Deploy**
   - Go to: **Settings** → **Builds & deployments**
   - Disable: **Automatic deployments**

3. **Get API Token**
   - Go to: **My Profile** → **API Tokens**
   - Create token with: **Cloudflare Pages:Edit** permission
   - Copy token

4. **Add to GitHub Secrets**
   - Go to: GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Add secret: `CLOUDFLARE_API_TOKEN` = (your token)
   - Add secret: `CLOUDFLARE_ACCOUNT_ID` = (from Cloudflare dashboard)
   - Add secret: `CLOUDFLARE_PROJECT_NAME` = `tradyx-dashboard`

5. **Update GitHub Actions Workflow**

   Add this step after data update:

   ```yaml
   - name: Deploy to Cloudflare Pages
     if: steps.commit.outputs.changed == 'true'
     uses: cloudflare/pages-action@v1
     with:
       apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
       accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
       projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME }}
       directory: tradyx-options-dashboard/out
       gitHubToken: ${{ secrets.GITHUB_TOKEN }}
   ```

---

## 📋 Correct Build Settings

```
Framework preset:     Next.js (Static HTML Export)
Build command:         cd tradyx-options-dashboard && npm run build
Build output dir:      tradyx-options-dashboard/out
Root directory:        tradyx-options-dashboard
Node.js version:       20
```

---

## ✅ Verification

After setup:

1. **Check Deploy Logs**
   - Should see: "Building Next.js app"
   - Should see: "Deploying to Cloudflare Pages"
   - Should NOT see: "wrangler deploy" error

2. **Visit Site**
   - URL: `yourproject.pages.dev`
   - Should load dashboard correctly

3. **Check Data**
   - Should fetch from `/data/dashboard.json`
   - Should show fresh data

---

## 🐛 Troubleshooting

### Issue: Still seeing wrangler error

**Solution:**
- Make sure you're using **Cloudflare Pages**, not **Workers**
- Check build settings match above
- Remove any `wrangler.toml` file (we deleted it)

### Issue: Build fails

**Check:**
1. Node version: Should be 20
2. Build command: Should include `cd tradyx-options-dashboard`
3. Output directory: Should be `tradyx-options-dashboard/out`

### Issue: 404 errors

**Solution:**
- Ensure `_redirects` file is in `out/` directory
- Check root directory is set correctly

---

## 📝 Summary

**Key Points:**
- ✅ Use **Cloudflare Pages** (not Workers)
- ✅ Framework: **Next.js (Static HTML Export)**
- ✅ Build output: `tradyx-options-dashboard/out`
- ✅ No `wrangler.toml` needed (we deleted it)

**Your site will work on Cloudflare Pages!** 🚀

---

**Last Updated**: January 2025

