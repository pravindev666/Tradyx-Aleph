# ✅ Vercel Setup (No vercel.json Needed)

## Removed `vercel.json`

Vercel auto-detects Next.js projects, so you don't need a `vercel.json` file.

## Vercel Configuration

Vercel will automatically:
- ✅ Detect Next.js framework
- ✅ Use `npm run build` as build command
- ✅ Use `.next` as output directory
- ✅ Serve files from `public/` directory

## What You Need to Configure in Vercel Dashboard

1. **Framework Preset:** Next.js (auto-detected)
2. **Build Command:** `npm run build` (default)
3. **Output Directory:** `.next` (default)
4. **Install Command:** `npm install` (default)
5. **Root Directory:** `./` (or `tradyx-options-dashboard` if repo is in subdirectory)

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

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

## That's It!

Vercel will automatically:
- Build your Next.js app
- Deploy on every push
- Serve static files from `public/`
- Handle routing automatically

**No `vercel.json` needed!** 🎉

