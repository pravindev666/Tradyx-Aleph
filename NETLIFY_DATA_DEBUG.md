# 🔍 Netlify Data Loading Debug Guide

## Problem

Netlify shows all "—" (no data loaded).

---

## 🔍 Step-by-Step Debugging

### Step 1: Check Browser Console

1. Visit your Netlify site
2. Open **DevTools** (F12)
3. Go to **Console** tab
4. Look for errors:
   - `❌ Failed to fetch dashboard data: HTTP 404` → File not found
   - `❌ Failed to fetch dashboard data: HTTP 500` → Server error
   - `❌ Empty response` → File exists but is empty
   - `❌ Invalid JSON` → File is corrupted

### Step 2: Check Network Tab

1. In DevTools, go to **Network** tab
2. Reload page
3. Find `/data/dashboard.json` request
4. Check:
   - **Status:** Should be `200` (not `404` or `500`)
   - **Response:** Should show JSON data
   - **Headers:** Check response headers

### Step 3: Test Data File Directly

**Visit this URL in your browser:**
```
https://your-netlify-site.netlify.app/data/dashboard.json
```

**Expected:**
- Should see JSON data
- Should have `updatedAt` field
- Should have `spot`, `vix`, etc.

**If 404:**
- Data file not in build output
- Check build logs

**If empty/corrupted:**
- Data file exists but is invalid
- Check repository data file

### Step 4: Check Build Logs

1. Netlify Dashboard → **Deploys**
2. Click latest deploy
3. Check build logs for:
   - `✅ Data file found: out/data/dashboard.json`
   - `Updated at: [timestamp]`
   - `Spot: [value], VIX: [value]`

**If you see:**
- `❌ Error: Data file not found` → Data file missing from repo
- No data file message → Build script didn't run

### Step 5: Check Repository Data File

1. Go to GitHub repository
2. Navigate to: `tradyx-options-dashboard/public/data/dashboard.json`
3. Check:
   - File exists ✅
   - `updatedAt` is recent (within last 15-20 min)
   - Has data (spot, vix, etc.)

**If old:**
- GitHub Actions didn't run
- Manually trigger: **Actions** → **Update Dashboard Data** → **Run workflow**

---

## 🐛 Common Issues & Fixes

### Issue 1: 404 Error (File Not Found)

**Symptoms:**
- Console: `HTTP 404`
- Network tab: Status `404`
- Direct URL: 404 page

**Causes:**
1. Data file not in `out/data/` after build
2. Build script didn't copy file
3. File path is wrong

**Fix:**
1. Check build logs for data file verification
2. The updated script should copy it automatically
3. If still missing, check `public/data/dashboard.json` exists in repo

### Issue 2: Empty Response

**Symptoms:**
- Console: `Empty response`
- Network tab: Status `200` but empty body

**Causes:**
1. Data file is empty
2. File exists but has no content

**Fix:**
1. Check repository data file has content
2. Re-run GitHub Actions workflow
3. Verify data file is valid JSON

### Issue 3: Invalid JSON

**Symptoms:**
- Console: `Invalid JSON response`
- Network tab: Response is not valid JSON

**Causes:**
1. Data file is corrupted
2. File has syntax errors
3. File is HTML error page instead of JSON

**Fix:**
1. Check repository data file is valid JSON
2. Validate JSON syntax
3. Re-run GitHub Actions workflow

### Issue 4: CORS Error

**Symptoms:**
- Console: `CORS policy` error
- Network tab: CORS error

**Causes:**
- Unlikely for same-origin requests
- But could happen if URL is wrong

**Fix:**
- Ensure URL is relative: `/data/dashboard.json`
- Not absolute: `https://...`

---

## ✅ Quick Fixes

### Fix 1: Verify Data File in Repo

```bash
# Check if file exists and is recent
git log -1 --format="%ai" -- tradyx-options-dashboard/public/data/dashboard.json
```

### Fix 2: Manually Trigger GitHub Actions

1. GitHub → **Actions** → **Update Dashboard Data**
2. Click **Run workflow**
3. Wait for completion
4. Check if `dashboard.json` was updated

### Fix 3: Clear Netlify Cache

1. Netlify Dashboard → **Site settings**
2. **Build & deploy** → **Post processing**
3. Click **Clear cache and retry deploy**

### Fix 4: Hard Refresh Browser

- `Ctrl+Shift+R` (Windows)
- `Cmd+Shift+R` (Mac)
- Or use Incognito mode

---

## 📋 Verification Checklist

After fixes, verify:

- [ ] Browser console: No errors
- [ ] Network tab: `/data/dashboard.json` returns `200`
- [ ] Direct URL: Shows JSON data
- [ ] Build logs: Shows data file verification
- [ ] Repository: Data file is recent
- [ ] Site: Shows data (not "—")

---

## 🎯 Expected Console Output

**Success:**
```
📊 Dashboard data fetched: { updatedAt: "...", fetchedAt: "...", forceRefresh: false }
✅ Dashboard data loaded successfully: { spot: ..., vix: ..., ... }
```

**Failure:**
```
❌ Failed to fetch dashboard data: HTTP 404
💡 Debug info: { feedUrl: "/data/dashboard.json", ... }
```

---

**Last Updated**: January 2025

