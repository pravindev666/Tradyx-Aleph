# 🔧 Vercel Environment Variables Setup

## Required Environment Variables

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these variables:

### 1. Dashboard Data URL (Required)
```
NEXT_PUBLIC_DASHBOARD_URL=/data/dashboard.json
```
**Why:** Tells the UI where to fetch data from

---

### 2. Data Freshness Thresholds (Optional - has defaults)
```
NEXT_PUBLIC_STALE_SOFT_MIN=6
NEXT_PUBLIC_STALE_HARD_MIN=20
```
**Why:** Defines when data is considered "stale" (in minutes)

---

### 3. AdSense Configuration (Required if using ads)
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_728x90=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_300x250=XXXXXXXXXX
```
**Why:** Your AdSense publisher ID and ad slot IDs
**Note:** Replace `XXXXXXXXXX` with your actual values from AdSense dashboard

---

### 4. Google Analytics (Optional)
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
**Why:** Google Analytics tracking ID (if you use GA4)
**Note:** Only add if you're using Google Analytics

---

### 5. App URL (Optional - for SEO)
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```
**Why:** Used in meta tags and schema markup
**Note:** Replace with your actual Vercel domain

---

### 6. Node Environment (Optional - Vercel sets this automatically)
```
NODE_ENV=production
```
**Why:** Tells Next.js it's in production mode
**Note:** Vercel usually sets this automatically, but you can add it

---

## Step-by-Step in Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Navigate to Settings**
   - Click on your project
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in the left sidebar

3. **Add Each Variable**
   - Click **"Add New"**
   - Enter **Key** (e.g., `NEXT_PUBLIC_DASHBOARD_URL`)
   - Enter **Value** (e.g., `/data/dashboard.json`)
   - Select **Environment**: 
     - ✅ Production
     - ✅ Preview (optional)
     - ✅ Development (optional)
   - Click **"Save"**

4. **Repeat for All Variables**
   - Add all variables listed above
   - Make sure to replace placeholder values with real ones

5. **Redeploy (if needed)**
   - After adding variables, Vercel may auto-redeploy
   - Or go to **"Deployments"** → Click **"Redeploy"**

---

## Minimum Required Variables

**For basic functionality, you only need:**
```
NEXT_PUBLIC_DASHBOARD_URL=/data/dashboard.json
```

**Everything else is optional** and depends on what features you're using.

---

## Important Notes

### ✅ Variables Starting with `NEXT_PUBLIC_`
- These are exposed to the browser
- Safe to use in client-side code
- All your variables should start with this prefix

### ❌ Don't Add These
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` if you're not using AdSense yet
- `NEXT_PUBLIC_GA_ID` if you're not using Google Analytics
- Any secrets or API keys (unless they're public)

### 🔄 After Adding Variables
- Vercel will automatically redeploy
- Or manually trigger redeploy from Deployments tab
- Changes take effect immediately

---

## Quick Checklist

- [ ] `NEXT_PUBLIC_DASHBOARD_URL` = `/data/dashboard.json`
- [ ] `NEXT_PUBLIC_STALE_SOFT_MIN` = `6` (optional)
- [ ] `NEXT_PUBLIC_STALE_HARD_MIN` = `20` (optional)
- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = Your AdSense ID (if using ads)
- [ ] `NEXT_PUBLIC_ADSENSE_SLOT_728x90` = Your slot ID (if using ads)
- [ ] `NEXT_PUBLIC_ADSENSE_SLOT_300x250` = Your slot ID (if using ads)
- [ ] `NEXT_PUBLIC_GA_ID` = Your GA ID (if using analytics)
- [ ] `NEXT_PUBLIC_APP_URL` = Your Vercel URL (optional)

---

**That's it! Set these in Vercel and you're good to go!** 🚀

