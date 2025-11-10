# 🚀 Netlify Setup Guide for Tradyx Dashboard

## ✅ Fixed Configuration

### Netlify Build Settings

Fill in these values in Netlify dashboard:

```
Base directory: /tradyx-options-dashboard
Package directory: /tradyx-options-dashboard/
Build command: npm run build
Publish directory: /tradyx-options-dashboard/out
Functions directory: (leave empty or use default)
```

### Important Changes Made

1. ✅ **Updated `next.config.js`**: Changed `output: 'standalone'` → `output: 'export'`
2. ✅ **Created `netlify.toml`**: Automatic configuration file
3. ✅ **Removed API route**: `/api/ping` (not supported in static export)

---

## 📋 Step-by-Step Netlify Configuration

### 1. Build Settings

In Netlify dashboard → Site settings → Build & deploy → Build settings:

| Field | Value |
|-------|-------|
| **Base directory** | `tradyx-options-dashboard` |
| **Package directory** | `tradyx-options-dashboard/` |
| **Build command** | `npm run build` |
| **Publish directory** | `tradyx-options-dashboard/out` |
| **Functions directory** | (leave empty) |

### 2. Environment Variables (if needed)

If your app uses environment variables, add them in:
- Site settings → Environment variables

Example:
```
NEXT_PUBLIC_DASHBOARD_URL = /data/dashboard.json
```

### 3. Deploy Settings

- **Deploy log visibility**: Public logs (or Private if you prefer)
- **Build status**: Active builds ✅

---

## 🔧 What Was Fixed

### Problem: "Page not found"

**Cause**: 
- `output: 'standalone'` creates server build (not static)
- Netlify was looking in wrong directory
- API routes don't work with static export

**Solution**:
1. ✅ Changed to `output: 'export'` (static export)
2. ✅ Set publish directory to `out` (where Next.js exports)
3. ✅ Removed API route (not needed for static site)
4. ✅ Created `netlify.toml` for automatic configuration

---

## 📁 File Structure After Build

```
tradyx-options-dashboard/
  ├─ out/                    ← This is what Netlify serves
  │  ├─ index.html
  │  ├─ _next/
  │  │  └─ static/
  │  └─ data/
  │     └─ dashboard.json   ← Your data file
  └─ ...
```

**Publish directory**: `tradyx-options-dashboard/out`

---

## 🧪 Test Locally First

Before deploying, test the build locally:

```bash
cd tradyx-options-dashboard
npm run build
```

This should create an `out` directory. Check if it exists:
```bash
ls out/
```

You should see:
- `index.html`
- `_next/` folder
- `data/` folder with `dashboard.json`

---

## 🚀 Deploy to Netlify

### Option 1: Automatic Deploy (Recommended)

1. **Connect GitHub**:
   - Netlify dashboard → Add new site → Import from Git
   - Select your repository
   - Netlify will read `netlify.toml` automatically ✅

2. **Verify Settings**:
   - Base directory: `tradyx-options-dashboard`
   - Build command: `npm run build`
   - Publish directory: `tradyx-options-dashboard/out`

3. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `yourproject.netlify.app` ✅

### Option 2: Manual Deploy

If you want to deploy manually:

```bash
# Build locally
cd tradyx-options-dashboard
npm run build

# Deploy using Netlify CLI
npx netlify deploy --prod --dir=out
```

---

## ✅ Verification Checklist

After deployment, check:

- [ ] Site loads at `yourproject.netlify.app`
- [ ] Dashboard displays correctly
- [ ] Data file loads: `yourproject.netlify.app/data/dashboard.json`
- [ ] Ads display (Adsterra banners)
- [ ] No console errors

---

## 🐛 Troubleshooting

### Issue: "Page not found" or 404

**Solutions**:
1. ✅ Check publish directory is `tradyx-options-dashboard/out`
2. ✅ Verify `out` folder exists after build
3. ✅ Check `netlify.toml` is in root (or `tradyx-options-dashboard/`)
4. ✅ Ensure `output: 'export'` in `next.config.js`

### Issue: Build fails

**Check**:
1. Node version: Should be 20.x
2. Dependencies: Run `npm install` first
3. Build logs: Check Netlify deploy logs for errors

### Issue: Data not loading

**Check**:
1. `dashboard.json` exists in `public/data/`
2. Build copies it to `out/data/`
3. Frontend fetches from `/data/dashboard.json`

---

## 📊 Netlify Configuration Summary

### Correct Settings

```
Base directory:     tradyx-options-dashboard
Package directory:  tradyx-options-dashboard/
Build command:      npm run build
Publish directory:  tradyx-options-dashboard/out  ← KEY!
Functions:          (empty)
```

### Why `out` directory?

- Next.js with `output: 'export'` creates `/out` folder
- This contains all static files (HTML, JS, CSS, data)
- Netlify serves from this directory

---

## 🎯 Next Steps

1. ✅ Update Netlify settings (use values above)
2. ✅ Trigger a new deploy
3. ✅ Check if site loads correctly
4. ✅ Verify data updates work

Your site should now work! 🚀

