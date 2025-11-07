# ✅ Complete Vercel Setup Guide

## 📁 Your Repository Structure

```
Tradyx-Test/                          ← GitHub Repository
│
├── .git/                             ← Git repository (root only)
│
├── .github/
│   └── workflows/
│       └── data-update.yml           ← Python scripts run here
│
└── tradyx-options-dashboard/         ← Next.js Application
    │
    ├── app/                          ← Next.js app directory
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   └── ...
    │
    ├── components/                   ← React components
    │   ├── dashboard/
    │   └── ...
    │
    ├── public/                       ← Static files
    │   ├── data/
    │   │   └── dashboard.json        ← Updated by GitHub Actions
    │   ├── ads.txt
    │   └── robots.txt
    │
    ├── scripts/                      ← Python scripts
    │   ├── fetch_yf.py
    │   ├── compute_metrics.py
    │   ├── run_all.py
    │   └── ...
    │
    ├── package.json                  ← ✅ Vercel reads this!
    ├── next.config.js
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## ⚙️ Vercel Configuration

### Step 1: Import Repository
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import `zetaaztra/Tradyx-Test`

### Step 2: Configure Settings

**In Vercel Dashboard → Settings → General:**

1. **Root Directory:**
   - Click **"Edit"**
   - Enter: `tradyx-options-dashboard`
   - Click **"Save"**

2. **Framework Preset:**
   - Should auto-detect: **Next.js**
   - If not, select **Next.js**

3. **Build Command:**
   - Default: `npm run build`
   - Keep as is

4. **Output Directory:**
   - Default: `.next`
   - Keep as is

5. **Install Command:**
   - Default: `npm install`
   - Keep as is

### Step 3: Environment Variables

**In Vercel Dashboard → Settings → Environment Variables:**

Add these (minimum):
```
NEXT_PUBLIC_DASHBOARD_URL=/data/dashboard.json
```

Optional (add later):
```
NEXT_PUBLIC_STALE_SOFT_MIN=6
NEXT_PUBLIC_STALE_HARD_MIN=20
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_728x90=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_300x250=XXXXXXXXXX
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build
3. ✅ Your site is live!

---

## 🔄 How It Works

### Deployment Flow:
```
GitHub Repo (Tradyx-Test)
    ↓
Vercel Clones
    ↓
Vercel Checks Root Directory Setting
    ↓
Vercel Looks in: tradyx-options-dashboard/
    ↓
Finds: package.json ✅
    ↓
Runs: npm install
    ↓
Runs: npm run build
    ↓
Deploys: ✅ Success!
```

### Data Update Flow:
```
GitHub Actions (Every 15 min)
    ↓
Runs Python Scripts
    ↓
Generates: public/data/dashboard.json
    ↓
Commits to GitHub
    ↓
Vercel Serves Updated File (no redeploy needed)
```

---

## ✅ Final Checklist

- [ ] Repository structure matches example above
- [ ] Only ONE `.git` folder (in root)
- [ ] `package.json` only in `tradyx-options-dashboard/`
- [ ] Vercel Root Directory = `tradyx-options-dashboard`
- [ ] Environment variables set in Vercel
- [ ] Deployed successfully

---

**Follow this structure and Vercel will work perfectly!** 🎯

