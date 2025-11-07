# 🔐 Git Authentication Guide

## The Issue

You're trying to push to `zetaaztra/Tradyx-Test` but getting authentication errors.

## Which Account to Use?

**Check which GitHub account has access to the repository:**

1. **Go to GitHub:** [github.com/zetaaztra/Tradyx-Test](https://github.com/zetaaztra/Tradyx-Test)
2. **Check if you can access it:**
   - If you see the repo → Use `zetaaztra` account
   - If you get 404 → Use `pravindev666` account (or the account that owns it)

## Solution: Use Personal Access Token

### Step 1: Create Personal Access Token

1. **Go to GitHub** → Sign in with the account that has access
2. **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. **Name:** `Tradyx-Push`
5. **Select scope:** `repo` (full control)
6. **Generate token**
7. **Copy the token** (you'll only see it once!)

### Step 2: Use Token in Git

**If using `zetaaztra` account:**
```powershell
git remote set-url origin https://YOUR_TOKEN@github.com/zetaaztra/Tradyx-Test.git
git push origin main
```

**If using `pravindev666` account:**
```powershell
git remote set-url origin https://YOUR_TOKEN@github.com/pravindev666/Tradyx.git
git push origin main
```

Replace `YOUR_TOKEN` with the actual token you copied.

---

## Alternative: Use GitHub Desktop

**Easiest method:**

1. **Download GitHub Desktop:** [desktop.github.com](https://desktop.github.com)
2. **Install and sign in** with the account that has repository access
3. **File** → **Add Local Repository**
4. **Select:** `C:\Users\hp\Desktop\Desktop Placed\Tradyx`
5. **Click "Push origin"**

GitHub Desktop handles authentication automatically!

---

## Check Repository Access

**To find which account has access:**

1. Try accessing: `https://github.com/zetaaztra/Tradyx-Test`
   - If you can see it → Use `zetaaztra` account
   - If 404 → Try `https://github.com/pravindev666/Tradyx`

2. **Or check your GitHub account:**
   - Go to your GitHub profile
   - Check "Repositories" tab
   - See which repo exists: `Tradyx-Test` or `Tradyx`

---

## Quick Fix

**Use the account that owns the repository:**

1. **Create Personal Access Token** from that account
2. **Update remote URL:**
   ```powershell
   git remote set-url origin https://YOUR_TOKEN@github.com/ACCOUNT/REPO.git
   ```
3. **Push:**
   ```powershell
   git push origin main
   ```

---

**Use GitHub Desktop for easiest authentication, or create a Personal Access Token from the account that owns the repository!** 🎯

