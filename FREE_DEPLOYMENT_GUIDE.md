# 🆓 Complete Free Deployment Guide for Tradyx Dashboard

**Zero-cost end-to-end setup with ads, clean URLs, and unlimited visitors**

---

## 🏗️ Your Architecture (Confirmed)

### Current Setup
```
┌─────────────────────────────────────┐
│   GitHub Repository (Public)       │
│   - Next.js Frontend Code           │
│   - Python Scripts (Backend)        │
│   - dashboard.json (Data File)     │
└─────────────────────────────────────┘
              │
              │
              ▼
┌─────────────────────────────────────┐
│   GitHub Actions (Free)              │
│   - Runs Python Scripts             │
│   - Generates dashboard.json        │
│   - Commits & Pushes to Repo        │
│   - 26 times/day (9:15 AM-3:30 PM)  │
└─────────────────────────────────────┘
              │
              │
              ▼
┌─────────────────────────────────────┐
│   Hosting Platform (Free)           │
│   - Serves Next.js Frontend         │
│   - Serves dashboard.json           │
│   - Displays Ads (Adsterra)         │
│   - Clean URL (yourproject.app)     │
└─────────────────────────────────────┘
```

### Key Points
- ✅ **No dedicated Python server** - Python runs in GitHub Actions
- ✅ **Data fetched from yfinance** - Python scripts fetch live data every 15 mins
- ✅ **Static site with periodic rebuilds** - We rebuild the entire site every 15 mins with fresh data
- ✅ **dashboard.json baked into build** - Fresh data is included in each static build
- ✅ **Frontend fetches JSON** - Next.js reads `dashboard.json` from static files (always fresh)

### How It Works (Every 15 Minutes)

```
1. GitHub Actions Triggered (Cron: 9:15 AM, 9:30 AM, etc.)
   ↓
2. Run Python Scripts
   ├─→ fetch_yf.py: Fetches LIVE data from yfinance API
   │   ├─→ NIFTY spot price (real-time)
   │   ├─→ VIX data (real-time)
   │   └─→ Historical series data
   ├─→ Other scripts: Process NSE data, calculate metrics
   └─→ build_dashboard_json.py: Combines all data
       └─→ Generates: public/data/dashboard.json (FRESH DATA)
   ↓
3. Build Next.js
   ├─→ npm run build
   ├─→ Next.js copies public/data/dashboard.json → out/data/dashboard.json
   └─→ Creates static site with FRESH dashboard.json baked in
   ↓
4. Deploy to Cloudflare Pages
   ├─→ Upload /out directory (contains fresh dashboard.json)
   └─→ Site goes live with NEW data
   ↓
5. Visitors See Fresh Data
   └─→ Frontend fetches /data/dashboard.json (static file, but freshly built!)
```

**Key Insight**: The site is static at any moment, but we rebuild it every 15 minutes with fresh yfinance data. This is called "Static Site Generation with Periodic Rebuilds" - a common pattern for data-driven static sites.

---

## 🎯 Your Requirements

1. ✅ **Free hosting** (₹0/month)
2. ✅ **Clean URLs** (like `yourproject.netlify.app` or `yourproject.pages.dev`)
3. ✅ **Ads allowed** (Adsterra monetization)
4. ✅ **Handle 1,716 build minutes/month** (572 deployments)
5. ✅ **Unlimited visitors** (or high limit)

---

## 🏆 Best Solution: Cloudflare Pages

### ✅ Yes, Cloudflare Pages Provides Clean URLs!

**Free URLs:**
- Default: `yourproject.pages.dev`
- Custom domain: `yourproject.com` (free SSL included)
- Both are clean, professional URLs ✅

**Examples:**
- `tradyx-dashboard.pages.dev` (free subdomain)
- `tradyx.in` (your custom domain - free SSL)

### Why Cloudflare Pages is Perfect

| Feature | Cloudflare Pages | Netlify | Vercel Free |
|---------|------------------|---------|-------------|
| **Clean URL** | ✅ `*.pages.dev` | ✅ `*.netlify.app` | ✅ `*.vercel.app` |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free |
| **Ads Allowed** | ✅ Yes | ✅ Yes | ❌ No |
| **Build Limit** | 500 builds/month | 300 min/month | 6,000 min/month |
| **Bandwidth** | **Unlimited** | 100 GB | 100 GB |
| **Visitors** | **Unlimited** | 100K-250K | 100K-250K |
| **Cost** | **₹0/month** | **₹0/month** | ₹0/month (ads not allowed) |

---

## 🔧 Solution: Deploy Pre-Built from GitHub Actions

### The Problem
- **Cloudflare Pages**: 500 builds/month limit
- **Your need**: 572 deployments/month (every 15 mins)
- **Netlify**: 300 build minutes/month
- **Your need**: 1,716 build minutes/month (572 × 3 min)

### The Solution: Build in GitHub Actions, Deploy Pre-Built Files

**Complete Flow (Every 15 Minutes):**
```
GitHub Actions (Free - Unlimited)
    ├─→ Step 1: Fetch LIVE data from yfinance
    │   └─→ Python: fetch_yf.py (calls yfinance API)
    │       ├─→ Gets current NIFTY price
    │       ├─→ Gets current VIX
    │       └─→ Gets historical series
    ├─→ Step 2: Process & Calculate
    │   └─→ Python: Other scripts process NSE data
    │       └─→ Calculate metrics, predictions, etc.
    ├─→ Step 3: Generate dashboard.json
    │   └─→ Python: build_dashboard_json.py
    │       └─→ Creates: public/data/dashboard.json (FRESH DATA)
    ├─→ Step 4: Build Next.js
    │   └─→ npm run build
    │       ├─→ Next.js reads public/data/dashboard.json
    │       ├─→ Copies it to out/data/dashboard.json
    │       └─→ Creates static site with FRESH data baked in
    └─→ Step 5: Deploy Pre-Built Files
        └─→ Upload /out directory to Cloudflare Pages
            └─→ NO BUILD on Cloudflare (0 build minutes!)
            └─→ Site goes live with FRESH yfinance data ✅
```

**Why This Works:**
- ✅ **Fresh data every 15 mins**: We rebuild the entire site with new yfinance data
- ✅ **0 build minutes on Cloudflare**: Build happens in GitHub Actions (unlimited)
- ✅ **Static but always fresh**: Site is static, but rebuilt frequently with live data
- ✅ **Completely free**: All within free tier limits

**Benefits:**
- ✅ **0 build minutes used** on Cloudflare Pages
- ✅ **Unlimited deployments** (no build limit)
- ✅ **Build happens in GitHub Actions** (unlimited for public repos)
- ✅ **Completely free** ✅

---

## 📝 Step-by-Step Setup

### Step 1: Convert Next.js to Static Export

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  // ... existing headers config ...
  
  // CHANGE THIS:
  output: 'export',  // Changed from 'standalone' to 'export'
  
  // Remove experimental features for static export
  // experimental: {
  //   optimizeCss: true,
  // },
}

module.exports = nextConfig
```

### Step 2: Update GitHub Actions Workflow

**Important**: Your workflow already fetches from yfinance every 15 mins. We just need to add build + deploy steps.

Update `.github/workflows/data-update.yml`:

```yaml
name: Update Dashboard Data

on:
  schedule:
    - cron: '45 3 * * 1-5'                # 9:15 IST
    - cron: '0,15,30,45 4-9 * * 1-5'      # Every 15 min
    - cron: '0 10 * * 1-5'                # 3:30 IST
  workflow_dispatch:

env:
  PYTHON_VERSION: '3.12'
  TZ: Asia/Kolkata

jobs:
  update-and-deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    concurrency:
      group: update-dashboard-data
      cancel-in-progress: false
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0
      
      # Step 1: Setup Python
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: 'pip'
          cache-dependency-path: 'tradyx-options-dashboard/scripts/requirements.txt'
      
      # Step 2: Generate dashboard.json
      - name: Install Python dependencies
        run: |
          cd tradyx-options-dashboard/scripts
          pip install --cache-dir ~/.cache/pip -r requirements.txt
      
      - name: Run data generation scripts
        run: |
          cd tradyx-options-dashboard/scripts
          python run_all.py
        env:
          TZ: Asia/Kolkata
      
      # Step 3: Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: 'tradyx-options-dashboard/package-lock.json'
      
      # Step 4: Install Node dependencies
      - name: Install dependencies
        run: |
          cd tradyx-options-dashboard
          npm ci
      
      # Step 5: Build Next.js (creates /out directory)
      - name: Build Next.js
        run: |
          cd tradyx-options-dashboard
          npm run build
      
      # Step 6: Commit and push (for backup)
      - name: Commit and push updated data
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add tradyx-options-dashboard/public/data/dashboard.json
          if git diff --staged --quiet; then
            echo "No changes to commit"
          else
            git commit -m "chore: update dashboard data [skip ci]"
            git push origin HEAD:main || git push origin HEAD:master
          fi
        continue-on-error: true
      
      # Step 7: Deploy to Cloudflare Pages (NO BUILD - uses pre-built files)
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: tradyx-dashboard
          directory: tradyx-options-dashboard/out
          # Skip build - we already built in GitHub Actions
          wranglerVersion: '3'
```

### Step 3: Get Cloudflare API Credentials

1. **Get API Token:**
   - Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Or create custom token with:
     - **Permissions**: Account → Cloudflare Pages → Edit
     - **Account Resources**: Include → Your Account
   - Copy the token

2. **Get Account ID:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Click on your domain (or any domain)
   - Right sidebar shows "Account ID"
   - Copy it

3. **Add to GitHub Secrets:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add:
     - `CLOUDFLARE_API_TOKEN` = Your API token
     - `CLOUDFLARE_ACCOUNT_ID` = Your Account ID

### Step 4: Create Cloudflare Pages Project

1. **Go to Cloudflare Dashboard:**
   - Visit [dash.cloudflare.com](https://dash.cloudflare.com)
   - Click "Workers & Pages" → "Pages"
   - Click "Create a project"

2. **Connect GitHub:**
   - Click "Connect to Git"
   - Authorize Cloudflare to access your GitHub
   - Select your repository

3. **Configure Project:**
   - **Project name**: `tradyx-dashboard` (or your choice)
   - **Production branch**: `main`
   - **Build command**: Leave empty (we build in GitHub Actions)
   - **Build output directory**: `out` (or leave empty, we deploy from GitHub Actions)
   - **Framework preset**: None (or Next.js Static)

4. **Save:**
   - Click "Save and Deploy"
   - Your site will be available at: `tradyx-dashboard.pages.dev` ✅

### Step 5: Configure Auto-Deploy (Optional)

Since you're deploying from GitHub Actions, you can:
- **Option A**: Disable auto-deploy in Cloudflare (deploy only from GitHub Actions)
- **Option B**: Keep auto-deploy enabled (backup, but won't trigger if you use `[skip ci]`)

**Recommended**: Disable auto-deploy, deploy only from GitHub Actions (more control)

---

## 🌐 URL Structure

### Cloudflare Pages URLs

**Free Subdomain:**
- Format: `yourproject.pages.dev`
- Example: `tradyx-dashboard.pages.dev`
- ✅ Clean, professional URL
- ✅ Free SSL (automatic)
- ✅ No setup needed

**Custom Domain (Optional):**
- Format: `yourdomain.com`
- Example: `tradyx.in`
- ✅ Free SSL (automatic)
- ✅ Professional URL
- ✅ Just add DNS records

### Comparison

| Platform | Free URL | Custom Domain | SSL |
|----------|----------|---------------|-----|
| **Cloudflare Pages** | `*.pages.dev` | ✅ Free | ✅ Free |
| **Netlify** | `*.netlify.app` | ✅ Free | ✅ Free |
| **Vercel** | `*.vercel.app` | ✅ Free | ✅ Free |

**All provide clean URLs!** ✅

---

## 💰 Cost Breakdown

### Complete Free Setup

| Service | Cost | Usage |
|---------|------|-------|
| **GitHub (Public Repo)** | ₹0 | Unlimited Actions minutes |
| **Cloudflare Pages** | ₹0 | Unlimited bandwidth, 0 build minutes |
| **Total** | **₹0/month** | ✅ Completely free |

### Why 0 Build Minutes?

- ✅ **Build happens in GitHub Actions** (unlimited for public repos)
- ✅ **Deploy pre-built files** to Cloudflare Pages
- ✅ **No build on Cloudflare** = 0 build minutes used
- ✅ **Unlimited deployments** (no build limit)

---

## 📊 Deployment Flow

### Every 15 Minutes (9:15 AM - 3:30 PM IST)

```
1. GitHub Actions Triggered (Cron)
   ↓
2. Run Python Scripts
   ├─→ Fetch NSE data
   ├─→ Calculate metrics
   └─→ Generate dashboard.json
   ↓
3. Build Next.js
   ├─→ npm run build
   └─→ Output: /out directory (static files)
   ↓
4. Commit dashboard.json (backup)
   └─→ git commit -m "chore: update dashboard data [skip ci]"
   ↓
5. Deploy to Cloudflare Pages
   ├─→ Upload /out directory
   ├─→ No build needed (pre-built)
   └─→ Instant deployment
   ↓
6. Live Site Updated
   └─→ Visitors see fresh data ✅
```

**Time per deployment**: ~2-3 minutes
**Build minutes used on Cloudflare**: **0** ✅

---

## 🎯 Alternative: Netlify Setup

If you prefer Netlify (but has bandwidth limit):

### Setup Steps
1. **Connect GitHub** to Netlify
2. **Configure build**:
   - Build command: Leave empty (build in GitHub Actions)
   - Publish directory: `out`
3. **Deploy from GitHub Actions**:
   ```yaml
   - name: Deploy to Netlify
     uses: nwtgck/actions-netlify@v2.0
     with:
       publish-dir: './tradyx-options-dashboard/out'
       production-branch: main
     env:
       NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
       NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
   ```

### Netlify Limits
- ⚠️ **100GB bandwidth/month** (100K-250K visitors)
- ✅ **0 build minutes** (if you deploy pre-built)
- ✅ **Clean URL**: `yourproject.netlify.app`

---

## 🏆 Final Recommendation

### **Best Choice: Cloudflare Pages**

**Why:**
1. ✅ **Unlimited bandwidth** (no visitor limits)
2. ✅ **Clean URLs** (`*.pages.dev` or custom domain)
3. ✅ **Ads allowed** (no restrictions)
4. ✅ **0 build minutes** (deploy pre-built from GitHub Actions)
5. ✅ **Completely free** (₹0/month)
6. ✅ **Best performance** (300+ edge locations)

### Setup Summary

1. ✅ Convert Next.js to static export (`output: 'export'`)
2. ✅ Update GitHub Actions to build + deploy
3. ✅ Get Cloudflare API credentials
4. ✅ Deploy pre-built files (0 build minutes)
5. ✅ Enjoy unlimited visitors + ads ✅

### Your URLs

- **Free**: `tradyx-dashboard.pages.dev`
- **Custom**: `tradyx.in` (if you have a domain)

Both are clean, professional URLs! ✅

---

## 📈 Expected Performance

### Deployment
- **Frequency**: 26 times/day (every 15 minutes)
- **Build time**: ~2-3 minutes (in GitHub Actions)
- **Deploy time**: ~30 seconds (to Cloudflare)
- **Total**: ~3 minutes per update
- **Build minutes on Cloudflare**: **0** ✅

### Visitors
- **Capacity**: **Unlimited** (no bandwidth cap)
- **Performance**: Fast (300+ edge locations)
- **Ads**: Allowed ✅
- **Revenue**: ₹400-9,000/month (depending on traffic)

---

## ✅ Checklist

- [ ] Convert `next.config.js` to `output: 'export'`
- [ ] Remove API routes (or convert to static)
- [ ] Update GitHub Actions workflow (add build + deploy steps)
- [ ] Get Cloudflare API token
- [ ] Get Cloudflare Account ID
- [ ] Add secrets to GitHub
- [ ] Create Cloudflare Pages project
- [ ] Test deployment
- [ ] Add custom domain (optional)
- [ ] Monitor first few deployments

---

## 🎉 Result

**Complete Free Setup:**
- ✅ **Hosting**: Cloudflare Pages (unlimited bandwidth)
- ✅ **CI/CD**: GitHub Actions (unlimited for public repos)
- ✅ **URL**: Clean (`*.pages.dev` or custom domain)
- ✅ **Ads**: Allowed (Adsterra)
- ✅ **Visitors**: Unlimited
- ✅ **Cost**: **₹0/month**

**You get everything you need, completely free!** 🚀

---

**Last Updated**: January 2025

