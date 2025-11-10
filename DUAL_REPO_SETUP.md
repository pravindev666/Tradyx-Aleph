# 🔄 Dual Repository Setup Guide

## Problem

You have **two separate GitHub repositories**:
- ✅ **Vercel repo** - Gets data updates (works perfectly)
- ❌ **Netlify repo** - Not getting updates (shows old data)

**Root Cause:** GitHub Actions workflow only pushes to the current repository (Vercel).

---

## ✅ Solution: Push to Both Repositories

The workflow now pushes to **both repositories** automatically.

---

## 🚀 Setup Instructions

### Step 1: Get Netlify Repository URL

1. Go to your **Netlify GitHub repository**
2. Click the green **Code** button
3. Copy the **HTTPS URL**
   - Example: `https://github.com/your-username/netlify-repo.git`
   - Or: `https://github.com/your-org/netlify-repo.git`

### Step 2: Add GitHub Secret

1. Go to your **Vercel GitHub repository** (where the workflow runs)
2. Go to: **Settings** → **Secrets and variables** → **Actions**
3. Click: **New repository secret**
4. **Name:** `NETLIFY_REPO_URL`
5. **Value:** Paste the Netlify repository URL you copied
6. Click: **Add secret**

### Step 3: Configure Access Token (If Needed)

If your Netlify repo is **private** or in a **different account**, you need a Personal Access Token:

1. Go to: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click: **Generate new token (classic)**
3. **Note:** `Netlify Repo Push Access`
4. **Expiration:** Choose duration (or no expiration)
5. **Scopes:** Check `repo` (full control of private repositories)
6. Click: **Generate token**
7. **Copy the token** (you won't see it again!)

8. Go back to your **Vercel repository** → **Secrets**
9. Add secret: `NETLIFY_REPO_TOKEN` = (paste the token)

10. Update the workflow to use the token (see below)

---

## 📋 Updated Workflow

The workflow now:
1. ✅ Updates data in Vercel repo (as before)
2. ✅ Pushes to Vercel repository
3. ✅ **NEW:** Pushes to Netlify repository (if `NETLIFY_REPO_URL` is set)

---

## 🔧 Advanced: Using Access Token

If your Netlify repo requires authentication, update the workflow:

**In `.github/workflows/data-update.yml`, change:**
```yaml
# Push to Netlify repository if configured
if [ -n "${{ secrets.NETLIFY_REPO_URL }}" ]; then
  echo "🔄 Pushing to Netlify repository..."
  # Add Netlify remote with token
  NETLIFY_URL="${{ secrets.NETLIFY_REPO_URL }}"
  if [ -n "${{ secrets.NETLIFY_REPO_TOKEN }}" ]; then
    # Insert token into URL
    NETLIFY_URL=$(echo "${{ secrets.NETLIFY_REPO_URL }}" | sed "s|https://|https://${{ secrets.NETLIFY_REPO_TOKEN }}@|")
  fi
  git remote add netlify "$NETLIFY_URL" || git remote set-url netlify "$NETLIFY_URL"
  # Push to Netlify repository
  git push netlify HEAD:main || git push netlify HEAD:master
  echo "✅ Data updated and pushed to Netlify repository"
fi
```

---

## ✅ Verification

### After Setup:

1. **Wait for next GitHub Actions run** (or trigger manually)

2. **Check Vercel repo:**
   - Should see new commit with data update
   - Vercel should auto-deploy ✅

3. **Check Netlify repo:**
   - Should see new commit with data update
   - Netlify should auto-deploy ✅

4. **Check both sites:**
   - Vercel: Should show fresh data ✅
   - Netlify: Should show fresh data ✅
   - "Last Updated" should match (within 1-2 minutes)

---

## 🐛 Troubleshooting

### Issue: "Permission denied" when pushing to Netlify repo

**Solution:**
- Add `NETLIFY_REPO_TOKEN` secret (Personal Access Token)
- Update workflow to use token (see Advanced section above)

### Issue: "Repository not found"

**Solution:**
- Check `NETLIFY_REPO_URL` is correct
- Ensure URL is HTTPS format
- If private repo, add `NETLIFY_REPO_TOKEN`

### Issue: Netlify repo still not updating

**Check:**
1. GitHub Actions workflow logs
2. Should see: "✅ Data updated and pushed to Netlify repository"
3. If not, check `NETLIFY_REPO_URL` secret is set correctly

### Issue: Netlify not auto-deploying

**Solution:**
1. Check Netlify is connected to the correct GitHub repo
2. Check Netlify Deploys tab for new deployments
3. If not auto-deploying, check Netlify build settings

---

## 📝 Summary

**What Changed:**
- ✅ Workflow now pushes to both repositories
- ✅ Vercel repo: Updated (as before)
- ✅ Netlify repo: **NEW** - Gets updates automatically

**Setup Required:**
1. Add `NETLIFY_REPO_URL` secret to Vercel repo
2. (Optional) Add `NETLIFY_REPO_TOKEN` if repo is private

**Result:**
- ✅ Both repositories get data updates
- ✅ Both sites show fresh data
- ✅ No manual intervention needed

---

**Last Updated**: January 2025

