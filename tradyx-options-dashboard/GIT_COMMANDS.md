# 🔧 Git Commands Guide

## Step-by-Step: Add, Commit, and Push

### Step 1: Navigate to Your Git Repository

Your git repository is likely in `tradyx-options-dashboard/` folder.

```powershell
cd "C:\Users\hp\Desktop\Desktop Placed\Tradyx\tradyx-options-dashboard"
```

### Step 2: Check Git Status

```powershell
git status
```

This shows what files have changed.

### Step 3: Add All Changes

```powershell
git add .
```

This stages all changes for commit.

### Step 4: Commit Changes

```powershell
git commit -m "chore: update files for Vercel deployment"
```

Replace the message with what you changed.

### Step 5: Push to GitHub

```powershell
git push origin main
```

Or if your branch is `master`:
```powershell
git push origin master
```

---

## If Git Repository is in Root

If your `.git` folder is in the root (`C:\Users\hp\Desktop\Desktop Placed\Tradyx`):

### Step 1: Navigate to Root
```powershell
cd "C:\Users\hp\Desktop\Desktop Placed\Tradyx"
```

### Step 2: Initialize Git (if not already)
```powershell
git init
```

### Step 3: Add Remote (if not already)
```powershell
git remote add origin https://github.com/zetaaztra/Tradyx-Test.git
```

### Step 4: Add, Commit, Push
```powershell
git add .
git commit -m "chore: update files for Vercel deployment"
git push origin main
```

---

## Quick Commands Summary

```powershell
# Navigate to repository
cd "C:\Users\hp\Desktop\Desktop Placed\Tradyx\tradyx-options-dashboard"

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "your message here"

# Push
git push origin main
```

---

## Troubleshooting

### "fatal: not a git repository"
- You're not in a git repository
- Navigate to the folder with `.git` directory
- Or initialize git: `git init`

### "fatal: remote origin already exists"
- Remote is already set, skip that step

### "error: failed to push"
- Check if you're authenticated: `git config --global user.name` and `git config --global user.email`
- Or use GitHub Desktop or GitHub CLI

---

**Run these commands in PowerShell from the correct directory!** 🚀

