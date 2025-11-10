# 🌐 Platform Compatibility Guide

**Works on Netlify, Vercel, and Cloudflare Pages**

This document ensures your project works perfectly on all three platforms with:
- ✅ yfinance data fetching (via GitHub Actions)
- ✅ Automatic data updates every 15 minutes
- ✅ Static site generation
- ✅ Ad monetization support

---

## ✅ Configuration Summary

### Universal Settings (All Platforms)

**`next.config.js`:**
- ✅ `output: 'export'` - Static export
- ✅ `images.unoptimized: true` - Required for static export
- ✅ Security headers configured
- ✅ CSP allows Adsterra ads

**Data Flow:**
```
GitHub Actions (Python + yfinance)
    ↓
Updates public/data/dashboard.json
    ↓
Commits to GitHub
    ↓
Platforms auto-deploy (or via build hook)
    ↓
Static site serves fresh data
```

---

## 🚀 Platform-Specific Setup

### Netlify

**Configuration File:** `netlify.toml`

**Build Settings:**
```
Base directory:     tradyx-options-dashboard
Build command:      npm run build
Publish directory:  out
Functions:         (empty)
```

**Auto-Deploy:**
- ✅ Auto-deploys on git push
- ✅ Build hook available for manual triggers
- ✅ `.build-trigger` file ensures rebuild detection

**Features:**
- ✅ Unlimited bandwidth (Pro plan)
- ✅ 100GB bandwidth (Free plan)
- ✅ Ads allowed ✅
- ✅ Build minutes: 300/month (Free)

**Setup:**
1. Connect GitHub repo
2. Netlify auto-detects `netlify.toml`
3. Deploy!

---

### Vercel

**Configuration File:** `vercel.json`

**Build Settings:**
```
Framework:          Next.js
Root Directory:     tradyx-options-dashboard
Build Command:      npm run build (auto)
Output Directory:   out (auto)
```

**Auto-Deploy:**
- ✅ Auto-deploys on git push
- ✅ Ignores `[skip ci]` (always rebuilds)

**Features:**
- ✅ Unlimited bandwidth
- ✅ Ads allowed (Pro plan only - $20/month)
- ❌ Ads NOT allowed (Free plan)
- ✅ Build minutes: Unlimited

**Setup:**
1. Connect GitHub repo
2. Vercel auto-detects `vercel.json`
3. Deploy!

**Note:** Free tier doesn't allow ads. Use Pro for ad monetization.

---

### Cloudflare Pages

**Configuration Files:** `_headers`, `_redirects`, `wrangler.toml`

**Build Settings:**
```
Framework:          Next.js (Static HTML Export)
Build Command:      npm run build
Output Directory:   out
Root Directory:     tradyx-options-dashboard
```

**Auto-Deploy:**
- ✅ Auto-deploys on git push
- ✅ Or deploy from GitHub Actions (0 build minutes)

**Features:**
- ✅ Unlimited bandwidth
- ✅ Ads allowed ✅
- ✅ Build minutes: 500/month (Free)
- ✅ Best performance (300+ edge locations)

**Setup:**
1. Connect GitHub repo
2. Configure build settings
3. Deploy!

---

## 🔄 Data Update Workflow

### GitHub Actions Workflow

**File:** `.github/workflows/data-update.yml`

**Schedule:**
- Every 15 minutes during market hours (9:15 AM - 3:30 PM IST)
- Monday to Friday

**What it does:**
1. ✅ Runs Python scripts (yfinance API)
2. ✅ Generates `public/data/dashboard.json`
3. ✅ Creates `.build-trigger` file (forces Netlify rebuild)
4. ✅ Commits and pushes to GitHub
5. ✅ Triggers platform rebuilds

**Platform Detection:**
- **Vercel:** Auto-deploys on push ✅
- **Netlify:** Auto-deploys on push + `.build-trigger` ensures rebuild ✅
- **Cloudflare:** Auto-deploys on push ✅

---

## 📋 Platform Comparison

| Feature | Netlify | Vercel | Cloudflare Pages |
|---------|---------|--------|------------------|
| **Static Export** | ✅ | ✅ | ✅ |
| **Auto-Deploy** | ✅ | ✅ | ✅ |
| **Build Hook** | ✅ | ✅ | ✅ |
| **Ads Allowed** | ✅ Free | ❌ Free / ✅ Pro | ✅ Free |
| **Bandwidth** | 100GB (Free) | Unlimited | Unlimited |
| **Build Minutes** | 300/month | Unlimited | 500/month |
| **Performance** | Good | Excellent | Best (Edge) |
| **Cost** | Free | Free / $20/mo | Free |

---

## ✅ Verification Checklist

After deploying to any platform:

- [ ] Site loads correctly
- [ ] Dashboard displays data
- [ ] `/data/dashboard.json` accessible
- [ ] Data updates every 15 minutes
- [ ] Ads display (Adsterra)
- [ ] Client-side routing works
- [ ] No console errors
- [ ] Security headers present

---

## 🐛 Troubleshooting

### Issue: Netlify not rebuilding

**Solution:**
- ✅ `.build-trigger` file is created on each data update
- ✅ Commit message includes `[data refresh]`
- ✅ Build hook configured (optional)

### Issue: Data not updating

**Check:**
1. GitHub Actions workflow runs successfully
2. `public/data/dashboard.json` is committed
3. Platform auto-deploys after push
4. Browser cache (hard refresh: Ctrl+Shift+R)

### Issue: Build fails

**Check:**
1. `output: 'export'` in `next.config.js`
2. `images.unoptimized: true` set
3. Node version: 20.x
4. Build logs for errors

---

## 🎯 Recommended Setup

### For Free + Ads: **Cloudflare Pages** ⭐
- ✅ Unlimited bandwidth
- ✅ Ads allowed on free tier
- ✅ Best performance
- ✅ 500 build minutes/month

### For Easy Setup: **Netlify**
- ✅ Easiest UI/UX
- ✅ Good free tier
- ✅ Ads allowed
- ✅ 300 build minutes/month

### For Best Next.js: **Vercel Pro**
- ✅ Best Next.js integration
- ✅ Unlimited everything
- ⚠️ Costs $20/month

---

## 📝 Key Files

### Universal (All Platforms)
- `next.config.js` - Next.js config
- `package.json` - Dependencies
- `public/data/dashboard.json` - Data file

### Platform-Specific
- `netlify.toml` - Netlify config
- `vercel.json` - Vercel config
- `_headers` - Cloudflare headers
- `_redirects` - Cloudflare/Netlify redirects

### Workflow
- `.github/workflows/data-update.yml` - Data update workflow
- `.build-trigger` - Forces Netlify rebuilds

---

## ✅ Summary

**Your project is now:**
- ✅ Compatible with Netlify, Vercel, and Cloudflare Pages
- ✅ Uses yfinance via GitHub Actions (no compromise)
- ✅ Auto-updates data every 15 minutes
- ✅ Supports ad monetization
- ✅ Fully static (fast, reliable)

**Deploy to any platform - it will work!** 🚀

---

**Last Updated**: January 2025

