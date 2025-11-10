# ✅ Netlify Build Settings - Correct Configuration

## 📋 Exact Settings to Use

Fill in these values in **Netlify Dashboard → Site Settings → Build & deploy → Build settings**:

| Setting | Value | Notes |
|----------|-------|-------|
| **Base directory** | `tradyx-options-dashboard` | No leading slash `/` |
| **Package directory** | `tradyx-options-dashboard/` | Optional, can leave empty |
| **Build command** | `npm run build` | Runs Next.js build |
| **Publish directory** | `out` | Relative to base directory |
| **Functions directory** | *(leave empty)* | Not needed for static site |

---

## 🎯 Step-by-Step Instructions

### 1. Go to Netlify Dashboard
- Visit: https://app.netlify.com
- Select your site

### 2. Navigate to Build Settings
- Click: **Site settings** (gear icon)
- Click: **Build & deploy** (left sidebar)
- Click: **Build settings** (under "Build & deploy")

### 3. Fill in the Settings

#### Base directory
```
tradyx-options-dashboard
```
- ✅ **Correct**: `tradyx-options-dashboard`
- ❌ **Wrong**: `/tradyx-options-dashboard` (no leading slash)
- ❌ **Wrong**: `./tradyx-options-dashboard` (no dot-slash)

#### Build command
```
npm run build
```
- ✅ This is correct
- Runs: `next build` (from package.json)

#### Publish directory
```
out
```
- ✅ **Correct**: `out` (relative to base directory)
- ❌ **Wrong**: `tradyx-options-dashboard/out` (already in base)
- ❌ **Wrong**: `/out` (no leading slash)

**Why `out`?**
- Base directory is `tradyx-options-dashboard`
- Next.js builds to `tradyx-options-dashboard/out/`
- So publish is just `out` (relative to base)

#### Functions directory
```
(leave empty or blank)
```
- ✅ **Correct**: Empty/blank
- ❌ **Wrong**: `/tradyx-options-dashboard/netlify/functions`
- ❌ **Wrong**: Any path

**Why empty?**
- We're using static export (`output: 'export'`)
- No serverless functions needed
- Static sites don't use Netlify Functions

---

## 📸 Visual Guide

```
Netlify Build Settings
├─ Base directory:        tradyx-options-dashboard
├─ Package directory:      (empty or tradyx-options-dashboard/)
├─ Build command:          npm run build
├─ Publish directory:     out
└─ Functions directory:   (empty)
```

---

## ✅ Verification

After saving, your settings should look like:

```
Base directory:     tradyx-options-dashboard
Build command:      npm run build
Publish directory:  out
Functions:         (not set / empty)
```

---

## 🔍 How It Works

### Build Process:
1. **Netlify checks out your repo**
2. **Changes to base directory**: `cd tradyx-options-dashboard`
3. **Runs build command**: `npm run build`
   - This creates `tradyx-options-dashboard/out/` folder
4. **Serves from publish directory**: `out` (relative to base)
   - Netlify serves: `tradyx-options-dashboard/out/` → Your site

### File Structure:
```
Repository Root
└─ tradyx-options-dashboard/     ← Base directory
   ├─ package.json
   ├─ next.config.js
   ├─ app/
   ├─ components/
   └─ out/                         ← Publish directory (created by build)
      ├─ index.html
      ├─ _next/
      └─ data/
         └─ dashboard.json
```

---

## 🐛 Common Mistakes

### ❌ Mistake 1: Leading Slash
```
Base directory: /tradyx-options-dashboard  ❌
```
**Fix**: Remove leading slash
```
Base directory: tradyx-options-dashboard  ✅
```

### ❌ Mistake 2: Wrong Publish Directory
```
Publish directory: tradyx-options-dashboard/out  ❌
```
**Fix**: Just `out` (relative to base)
```
Publish directory: out  ✅
```

### ❌ Mistake 3: Functions Directory Set
```
Functions directory: /tradyx-options-dashboard/netlify/functions  ❌
```
**Fix**: Leave empty
```
Functions directory: (empty)  ✅
```

---

## 🚀 After Saving

1. **Save settings** in Netlify
2. **Trigger a new deploy**:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
3. **Watch the build logs**
4. **Verify**:
   - Build succeeds ✅
   - Site loads at `yourproject.netlify.app` ✅
   - Dashboard displays correctly ✅

---

## 📝 Summary

**Correct Settings:**
```
Base directory:     tradyx-options-dashboard
Build command:      npm run build
Publish directory:  out
Functions:         (empty)
```

**That's it!** These settings match your `netlify.toml` file, so Netlify will auto-detect them if you connect via Git. But if you're setting manually, use the values above.

---

**Last Updated**: January 2025

