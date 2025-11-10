# 🔍 GitHub Actions Workflow Debug Guide

## Problem

**JSON file is NOT generating when workflow runs.**

**Symptoms:**
- Cloudflare shows old data (Nov 7)
- Netlify shows no data (all "—")
- Workflow runs but `dashboard.json` not updated

---

## ✅ Fixes Applied

### 1. Enhanced Workflow Verification

**File:** `.github/workflows/data-update.yml`

**Added:**
- ✅ Verifies `dashboard.json` exists after script runs
- ✅ Shows file size and timestamp
- ✅ Lists directory if file missing
- ✅ Exits with error if file not found

**What you'll see in logs:**
```
🔍 Verifying dashboard.json was created...
✅ dashboard.json exists in public/data/
📊 File size: [number] bytes
📅 File timestamp: [timestamp]
```

### 2. Enhanced Python Script

**File:** `tradyx-options-dashboard/scripts/build_dashboard_json.py`

**Added:**
- ✅ Better error handling with try/catch
- ✅ Verifies files were written
- ✅ Shows file sizes
- ✅ Shows data preview (updatedAt, spot, vix)
- ✅ Detailed error messages with traceback

**What you'll see:**
```
[OK] Saved to: /path/to/data/dashboard.json
[OK] Saved to: /path/to/public/data/dashboard.json
[OK] Dashboard JSON built successfully
  - data/dashboard.json: [size] bytes
  - public/data/dashboard.json: [size] bytes
  - updatedAt: [timestamp]
  - spot: [value], vix: [value]
```

---

## 🔍 Debugging Steps

### Step 1: Check Workflow Logs

1. Go to GitHub → **Actions** tab
2. Click on latest `Update Dashboard Data` run
3. Check **"Run data generation scripts"** step
4. Look for:
   - `[OK] Dashboard JSON built successfully` ✅
   - `✅ dashboard.json exists in public/data/` ✅
   - OR `❌ ERROR: dashboard.json NOT FOUND` ❌

### Step 2: Check for Script Errors

In workflow logs, look for:
- `[ERROR]` messages from Python scripts
- `Failed to write dashboard.json`
- Any exceptions or tracebacks

### Step 3: Check File Paths

The script writes to:
- `tradyx-options-dashboard/scripts/data/dashboard.json`
- `tradyx-options-dashboard/public/data/dashboard.json` ⭐ (This is what we need)

**Verify in workflow logs:**
- Should see both paths in output
- Should see file sizes > 0

### Step 4: Check Commit Step

After script runs, check **"Commit and push updated data"** step:
- Should see: `✅ Data updated and pushed to Netlify repository`
- OR: `No changes to commit` (if file wasn't updated)

---

## 🐛 Common Issues

### Issue 1: Script Fails Silently

**Symptoms:**
- Workflow completes but no file created
- No error messages

**Check:**
- Look for `[ERROR]` in Python script output
- Check if any script in `run_all.py` failed
- Check if `build_dashboard_json.py` ran

**Fix:**
- Check workflow logs for Python errors
- Verify all dependencies installed
- Check if yfinance API is working

### Issue 2: File Written to Wrong Location

**Symptoms:**
- Script says "OK" but file not in `public/data/`

**Check:**
- Workflow logs show absolute paths
- Verify path: `../public/data/dashboard.json` from scripts directory

**Fix:**
- Path should be correct (relative to scripts directory)
- If wrong, check working directory in workflow

### Issue 3: Permission Errors

**Symptoms:**
- `Permission denied` errors
- File can't be written

**Check:**
- GitHub Actions has write permissions
- Directory exists and is writable

**Fix:**
- Usually not an issue in GitHub Actions
- Check if directory creation succeeds

### Issue 4: Script Returns Early

**Symptoms:**
- Script stops before writing file
- Error: `yfinance spot price not found`

**Check:**
- `fetch_yf.py` must run successfully first
- Check if yfinance API is accessible

**Fix:**
- Ensure `fetch_yf.py` completes successfully
- Check network/API issues

---

## 📋 Expected Workflow Output

**Successful run should show:**
```
Running: build_dashboard_json.py
[OK] Saved to: /path/to/data/dashboard.json
[OK] Saved to: /path/to/public/data/dashboard.json
[OK] Dashboard JSON built successfully
  - data/dashboard.json: [size] bytes
  - public/data/dashboard.json: [size] bytes
  - updatedAt: [current timestamp]
  - spot: [value], vix: [value]

🔍 Verifying dashboard.json was created...
✅ dashboard.json exists in public/data/
📊 File size: [size] bytes
📅 File timestamp: [timestamp]
```

---

## 🎯 Next Steps

1. **Commit the updated workflow:**
   ```bash
   git add .
   git commit -m "fix: add verification for dashboard.json generation"
   git push
   ```

2. **Run workflow manually:**
   - GitHub → Actions → Update Dashboard Data
   - Click "Run workflow"

3. **Check logs:**
   - Look for verification messages
   - Check if file was created
   - Check for any errors

4. **If file still not created:**
   - Check Python script errors
   - Check if `fetch_yf.py` succeeded
   - Check if all dependencies installed

---

## ✅ Summary

**What Changed:**
- ✅ Workflow verifies file exists after script runs
- ✅ Python script has better error handling
- ✅ Detailed logging shows what's happening

**What to Check:**
- Workflow logs for verification messages
- Python script output for errors
- File paths and sizes

**The enhanced logging will show exactly where it's failing!** 🔍

---

**Last Updated**: January 2025

