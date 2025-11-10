# 🔄 Netlify Auto-Deploy Setup

## Problem
- ✅ Vercel: Auto-deploys when GitHub Actions updates data
- ❌ Netlify: Doesn't rebuild when data updates

## Why?
The GitHub Actions workflow commits with `[skip ci]` which tells Netlify to skip builds.

---

## ✅ Solution Options

### Option 1: Remove `[skip ci]` (Simplest) ⭐

**Pros:**
- ✅ Netlify will rebuild automatically
- ✅ Vercel will still work (ignores `[skip ci]` or rebuilds anyway)
- ✅ No extra configuration needed

**Cons:**
- ⚠️ Netlify will rebuild every 15 minutes (uses build minutes)

**Action:** Update `.github/workflows/data-update.yml` to remove `[skip ci]`

---

### Option 2: Trigger Netlify Build via API (Recommended) ⭐⭐

**Pros:**
- ✅ Only rebuilds when data actually changes
- ✅ Saves build minutes
- ✅ More control

**Cons:**
- ⚠️ Requires Netlify build hook token

**Action:** Add Netlify build trigger to GitHub Actions workflow

---

### Option 3: Configure Netlify to Ignore `[skip ci]`

**Pros:**
- ✅ Keeps `[skip ci]` in commit message
- ✅ Netlify still rebuilds

**Cons:**
- ⚠️ Still rebuilds even when no changes
- ⚠️ Uses more build minutes

**Action:** Configure Netlify build settings

---

## 🚀 Recommended: Option 2 (Build Hook)

### Step 1: Get Netlify Build Hook

1. Go to **Netlify Dashboard** → Your site
2. Go to **Site settings** → **Build & deploy** → **Build hooks**
3. Click **Add build hook**
4. Name: `GitHub Actions Data Update`
5. Branch: `main` (or your branch)
6. Click **Save**
7. **Copy the build hook URL** (looks like: `https://api.netlify.com/build_hooks/xxxxx`)

### Step 2: Add Secret to GitHub

1. Go to your **GitHub repository**
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NETLIFY_BUILD_HOOK`
5. Value: Paste the build hook URL
6. Click **Add secret**

### Step 3: Update GitHub Actions Workflow

Add a step to trigger Netlify build after data update:

```yaml
- name: Trigger Netlify rebuild
  if: success() && steps.commit.outputs.changed == 'true'
  run: |
    curl -X POST -d {} "${{ secrets.NETLIFY_BUILD_HOOK }}"
  continue-on-error: true
```

---

## 📋 Quick Fix: Option 1 (Remove `[skip ci]`)

If you want the simplest solution, just remove `[skip ci]` from the commit message.

**Current:**
```yaml
git commit -m "chore: update dashboard data [skip ci]"
```

**Change to:**
```yaml
git commit -m "chore: update dashboard data"
```

This will make Netlify rebuild automatically, but it will use build minutes.

---

## 🔧 Option 3: Configure Netlify Settings

1. Go to **Netlify Dashboard** → Your site
2. Go to **Site settings** → **Build & deploy** → **Build settings**
3. Scroll to **Deploy contexts**
4. Under **Skip builds**, make sure it's set to:
   - **Skip builds only for commits with `[skip ci]` or `[ci skip]` in the commit message**
   - Or disable skip builds entirely

---

## ✅ Recommended Solution

**Use Option 2 (Build Hook)** because:
- ✅ Only rebuilds when data changes
- ✅ Saves build minutes
- ✅ More efficient
- ✅ Better control

---

**Last Updated**: January 2025

