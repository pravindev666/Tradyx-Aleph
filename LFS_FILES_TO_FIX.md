# 🚨 Files in Git LFS That Need to Be Fixed

## ❌ CRITICAL - Must Fix (Build-Breaking)

These files are in Git LFS and will break Vercel builds:

### 1. `tradyx-options-dashboard/tsconfig.json` ⚠️ **CURRENTLY BREAKING**
- **Status:** Still in LFS on GitHub
- **Error:** `tsconfig is not parseable: invalid JSON`
- **Fix:** Manual edit on GitHub (same as package.json)

### 2. `tradyx-options-dashboard/package-lock.json` ⚠️ **WILL BREAK**
- **Status:** Still in LFS on GitHub
- **Error:** `Error while parsing config file: package-lock.json`
- **Fix:** Manual edit on GitHub OR regenerate locally and push

### 3. `tradyx-options-dashboard/.eslintrc.json` ⚠️ **MIGHT BREAK**
- **Status:** Still in LFS on GitHub
- **Error:** Could cause linting/build issues
- **Fix:** Manual edit on GitHub

---

## ✅ OK to Keep in LFS (Data Files)

These are data files and can stay in LFS:
- `tradyx-options-dashboard/data/chain_meta.json` ✅
- `tradyx-options-dashboard/data/chain_raw.json` ✅
- `tradyx-options-dashboard/data/dashboard.json` ✅
- `tradyx-options-dashboard/data/metrics.json` ✅
- `tradyx-options-dashboard/data/yf.json` ✅
- `tradyx-options-dashboard/public/data/dashboard.json` ✅

---

## 🔧 How to Fix Each File

### Fix 1: tsconfig.json
1. Go to: https://github.com/pravindev666/Tradyx/blob/main/tradyx-options-dashboard/tsconfig.json
2. Click Edit
3. Replace with actual JSON content (see FIX_TSCONFIG_ON_GITHUB.md)
4. Commit

### Fix 2: package-lock.json
**Option A - Regenerate locally:**
```powershell
cd tradyx-options-dashboard
Remove-Item package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json (remove from LFS)"
git push origin main
```

**Option B - Manual edit on GitHub:**
1. Go to: https://github.com/pravindev666/Tradyx/blob/main/tradyx-options-dashboard/package-lock.json
2. Click Edit
3. Copy content from local file: `Get-Content "tradyx-options-dashboard\package-lock.json" -Raw`
4. Paste and commit

### Fix 3: .eslintrc.json
1. Go to: https://github.com/pravindev666/Tradyx/blob/main/tradyx-options-dashboard/.eslintrc.json
2. Click Edit
3. Replace with:
```json
{
  "extends": "next/core-web-vitals"
}
```
4. Commit

---

## 📋 Priority Order

1. **tsconfig.json** - Fix NOW (currently breaking builds)
2. **package-lock.json** - Fix next (causing parse errors)
3. **.eslintrc.json** - Fix last (might not break build but should fix)

---

## ✅ After Fixing

Update `.gitattributes` to exclude these files (already done):
- ✅ package.json
- ✅ package-lock.json
- ✅ tsconfig.json
- ⚠️ Need to add: `.eslintrc.json`

