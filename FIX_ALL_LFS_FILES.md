# 🚨 All Files in Git LFS That Need Fixing

## ❌ CRITICAL - Must Fix (Will Break Builds)

### 1. `tsconfig.json` ⚠️ **CURRENTLY BREAKING**
- **Status:** Still in LFS on GitHub
- **Error:** `tsconfig is not parseable: invalid JSON`
- **Action:** Fix manually on GitHub (see below)

### 2. `package-lock.json` ⚠️ **CAUSING ERRORS**
- **Status:** Still in LFS on GitHub  
- **Error:** `Error while parsing config file: package-lock.json`
- **Action:** Fix manually on GitHub OR regenerate locally

### 3. `.eslintrc.json` ⚠️ **MIGHT BREAK**
- **Status:** Still in LFS on GitHub
- **Action:** Fix manually on GitHub

---

## ✅ OK to Keep in LFS (Data Files)

These are data files - safe to keep in LFS:
- ✅ `data/chain_meta.json`
- ✅ `data/chain_raw.json`
- ✅ `data/dashboard.json`
- ✅ `data/metrics.json`
- ✅ `data/yf.json`
- ✅ `public/data/dashboard.json`

---

## 🔧 How to Fix Each File on GitHub

### Fix 1: tsconfig.json (PRIORITY 1)
1. Go to: https://github.com/pravindev666/Tradyx/blob/main/tradyx-options-dashboard/tsconfig.json
2. Click **Edit** (pencil icon)
3. Delete all content
4. Paste this:
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]},
    "target": "ES2017"
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
5. Commit: `"fix: replace tsconfig.json LFS pointer with actual content"`

### Fix 2: package-lock.json (PRIORITY 2)
**Option A - Regenerate (Recommended):**
```powershell
cd tradyx-options-dashboard
Remove-Item package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json (remove from LFS)"
git push origin main
```

**Option B - Manual on GitHub:**
1. Go to: https://github.com/pravindev666/Tradyx/blob/main/tradyx-options-dashboard/package-lock.json
2. Click **Edit**
3. Copy entire content from local: `Get-Content "tradyx-options-dashboard\package-lock.json" -Raw`
4. Paste and commit

### Fix 3: .eslintrc.json (PRIORITY 3)
1. Go to: https://github.com/pravindev666/Tradyx/blob/main/tradyx-options-dashboard/.eslintrc.json
2. Click **Edit**
3. Replace with:
```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": "warn",
    "react/no-unescaped-entities": "off"
  }
}
```
4. Commit: `"fix: replace .eslintrc.json LFS pointer with actual content"`

---

## 📋 Fix Order

1. **tsconfig.json** - Fix FIRST (currently breaking)
2. **package-lock.json** - Fix SECOND (causing parse errors)
3. **.eslintrc.json** - Fix LAST (preventive)

---

## ✅ After All Fixed

All config files will be regular files (not LFS), and Vercel builds will work! 🎯

