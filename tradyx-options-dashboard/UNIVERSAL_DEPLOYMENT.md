# 🌐 Universal Deployment Guide

**Works on Netlify, Vercel, and Cloudflare Pages**

This guide ensures your dashboard works on all three platforms with the same codebase.

---

## ✅ Configuration Files Created

### 1. `next.config.js`
- ✅ `output: 'export'` - Static export (works on all platforms)
- ✅ `images.unoptimized: true` - Required for static export
- ✅ Security headers configured
- ✅ CSP allows Adsterra ads

### 2. `netlify.toml`
- ✅ Netlify-specific configuration
- ✅ Build settings
- ✅ Redirects for client-side routing
- ✅ Headers configuration

### 3. `vercel.json`
- ✅ Vercel-specific configuration
- ✅ Output directory: `out`
- ✅ Rewrites for routing
- ✅ Headers configuration

### 4. `_headers` (Cloudflare Pages)
- ✅ Cloudflare Pages headers file
- ✅ Security headers
- ✅ Cache control

### 5. `_redirects` (Netlify + Cloudflare)
- ✅ Client-side routing support
- ✅ SPA fallback to index.html

---

## 🚀 Deployment Instructions

### Netlify Deployment

#### Build Settings:
```
Base directory:     tradyx-options-dashboard
Package directory:  tradyx-options-dashboard/
Build command:      npm run build
Publish directory: tradyx-options-dashboard/out
Functions:         (empty)
```

#### Steps:
1. Go to [netlify.com](https://netlify.com)
2. Add new site → Import from Git
3. Select your repository
4. Netlify will auto-detect `netlify.toml` ✅
5. Click "Deploy site"
6. Your site: `yourproject.netlify.app`

**Note**: Netlify reads `netlify.toml` automatically, so settings are pre-configured!

---

### Vercel Deployment

#### Build Settings:
```
Framework Preset:  Next.js
Root Directory:     tradyx-options-dashboard
Build Command:     npm run build (auto-detected)
Output Directory:  out (auto-detected from vercel.json)
```

#### Steps:
1. Go to [vercel.com](https://vercel.com)
2. Add new project → Import Git repository
3. Select your repository
4. Vercel will auto-detect `vercel.json` ✅
5. Click "Deploy"
6. Your site: `yourproject.vercel.app`

**Note**: 
- ⚠️ **Vercel Free tier doesn't allow ads** (commercial use prohibited)
- ✅ Use Vercel Pro ($20/month) if you want Vercel with ads
- ✅ Or use Netlify/Cloudflare for free with ads

---

### Cloudflare Pages Deployment

#### Option 1: Auto-Deploy from GitHub (Recommended)

**Build Settings:**
```
Framework Preset:  Next.js (Static HTML Export)
Build command:     npm run build
Build output directory: out
Root directory:    tradyx-options-dashboard
```

**Steps:**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → Pages → Create a project
3. Connect to Git → Select repository
4. Configure:
   - Project name: `tradyx-dashboard`
   - Production branch: `main`
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `tradyx-options-dashboard`
5. Click "Save and Deploy"
6. Your site: `tradyx-dashboard.pages.dev`

#### Option 2: Deploy from GitHub Actions (Bypass Build Limits)

**Steps:**
1. Create Cloudflare Pages project (same as above)
2. **Disable auto-deploy** (deploy only from GitHub Actions)
3. Update GitHub Actions workflow to deploy pre-built files
4. 0 build minutes used on Cloudflare ✅

---

## 📋 Platform Comparison

| Feature | Netlify | Vercel | Cloudflare Pages |
|---------|---------|--------|------------------|
| **Static Export** | ✅ Works | ✅ Works | ✅ Works |
| **Build Command** | `npm run build` | `npm run build` | `npm run build` |
| **Output Directory** | `out` | `out` | `out` |
| **Config File** | `netlify.toml` | `vercel.json` | `wrangler.toml` (optional) |
| **Headers File** | `netlify.toml` | `vercel.json` | `_headers` |
| **Redirects File** | `_redirects` | `vercel.json` | `_redirects` |
| **Ads Allowed** | ✅ Yes | ❌ No (free) | ✅ Yes |
| **Clean URL** | `*.netlify.app` | `*.vercel.app` | `*.pages.dev` |

---

## 🔧 Configuration Details

### next.config.js (Universal)

```javascript
{
  output: 'export',              // Static export (all platforms)
  images: {
    unoptimized: true,          // Required for static export
  },
  trailingSlash: false,         // Better compatibility
  // ... security headers
}
```

**Why this works:**
- ✅ `output: 'export'` creates static files (works everywhere)
- ✅ `images.unoptimized: true` disables Next.js image optimization (not available in static export)
- ✅ All platforms can serve static files

### Platform-Specific Files

#### Netlify (`netlify.toml`)
- Defines build settings
- Configures redirects
- Sets headers

#### Vercel (`vercel.json`)
- Defines output directory
- Configures rewrites
- Sets headers

#### Cloudflare (`_headers` + `_redirects`)
- `_headers`: Custom headers file
- `_redirects`: Client-side routing

---

## ✅ Verification Checklist

After deploying to any platform, verify:

- [ ] Site loads at platform URL
- [ ] Dashboard displays correctly
- [ ] Data loads: `/data/dashboard.json` accessible
- [ ] Client-side routing works (try `/about`, `/legal/privacy`)
- [ ] Ads display (Adsterra banners)
- [ ] No console errors
- [ ] Security headers present (check in browser DevTools → Network)

---

## 🐛 Troubleshooting

### Issue: "Page not found" or 404

**All Platforms:**
1. ✅ Check `output: 'export'` in `next.config.js`
2. ✅ Verify `out` directory exists after build
3. ✅ Check publish/output directory is `out`
4. ✅ Ensure redirects/rewrites are configured

**Platform-Specific:**
- **Netlify**: Check `netlify.toml` and `_redirects` file
- **Vercel**: Check `vercel.json` rewrites
- **Cloudflare**: Check `_redirects` file

### Issue: Images not loading

**Solution:**
- ✅ `images.unoptimized: true` is set (required for static export)
- ✅ Images should be in `public/` folder
- ✅ Reference as `/image.png` (not `/public/image.png`)

### Issue: Data not loading

**Check:**
1. `dashboard.json` exists in `public/data/`
2. Build copies it to `out/data/`
3. Frontend fetches from `/data/dashboard.json`
4. File is accessible at platform URL + `/data/dashboard.json`

### Issue: Client-side routing doesn't work

**Solution:**
- ✅ Check redirects/rewrites file exists
- ✅ All routes should redirect to `/index.html` with 200 status
- ✅ Next.js router handles client-side routing

---

## 🎯 Recommended Platform

### For Free + Ads: **Cloudflare Pages** ⭐
- ✅ Unlimited bandwidth
- ✅ Ads allowed
- ✅ 0 build minutes (if deploying from GitHub Actions)
- ✅ Best performance (300+ edge locations)

### For Easy Setup: **Netlify**
- ✅ Easiest UI/UX
- ✅ Ads allowed
- ✅ 100GB bandwidth (100K-250K visitors)
- ✅ Good free tier

### For Best Next.js Support: **Vercel Pro**
- ✅ Best Next.js integration
- ✅ Ads allowed (Pro plan only)
- ⚠️ Costs $20/month (~₹1,650/month)

---

## 📝 Quick Deploy Commands

### Test Build Locally
```bash
cd tradyx-options-dashboard
npm run build
ls out/  # Should see index.html, _next/, data/
```

### Netlify CLI
```bash
npx netlify deploy --prod --dir=tradyx-options-dashboard/out
```

### Vercel CLI
```bash
cd tradyx-options-dashboard
npx vercel --prod
```

### Cloudflare Pages CLI
```bash
cd tradyx-options-dashboard
npx wrangler pages deploy out --project-name=tradyx-dashboard
```

---

## ✅ Summary

**Your code now works on:**
- ✅ **Netlify** (via `netlify.toml`)
- ✅ **Vercel** (via `vercel.json`)
- ✅ **Cloudflare Pages** (via `_headers` + `_redirects`)

**All use the same:**
- ✅ `next.config.js` with `output: 'export'`
- ✅ Static build output in `out/` directory
- ✅ Same security headers
- ✅ Same ad support

**Deploy to any platform - it will work!** 🚀

---

**Last Updated**: January 2025

