# 🆕 Fresh Start Guide - New GitHub Repository

## Option 1: Delete and Create New Repo (Recommended)

### Step 1: Prepare Local Repository

```powershell
# Make sure you're in the root directory
cd "C:\Users\hp\Desktop\Desktop Placed\Tradyx"

# Remove Git LFS completely
git lfs uninstall

# Remove .gitattributes (we'll create a clean one)
Remove-Item .gitattributes -ErrorAction SilentlyContinue
Remove-Item "tradyx-options-dashboard\.gitattributes" -ErrorAction SilentlyContinue

# Remove all LFS tracking
git lfs untrack "*"

# Remove git history (start fresh)
Remove-Item -Recurse -Force .git

# Initialize new git repo
git init

# Create clean .gitattributes (NO LFS for config files)
@"
# Exclude ALL config files from LFS
*.json -filter -diff -merge -text
!tradyx-options-dashboard/data/*.json filter=lfs diff=lfs merge=lfs -text
!tradyx-options-dashboard/public/data/*.json filter=lfs diff=lfs merge=lfs -text
!tradyx-options-dashboard/scripts/data/*.json filter=lfs diff=lfs merge=lfs -text

*.ts -filter -diff -merge -text
*.tsx -filter -diff -merge -text
*.js -filter -diff -merge -text
*.jsx -filter -diff -merge -text
*.config.* -filter -diff -merge -text
*.lock -filter -diff -merge -text
*.rc -filter -diff -merge -text

# Only large data files use LFS
*.h5 filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
*.csv filter=lfs diff=lfs merge=lfs -text
"@ | Out-File -FilePath .gitattributes -Encoding utf8

# Add all files
git add .

# Initial commit
git commit -m "Initial commit - Tradyx Quant Dashboard"

# Add remote (NEW REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git

# Push to new repo
git branch -M main
git push -u origin main
```

### Step 2: Create New GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `Tradyx-Quant-Dashboard` (or any name)
3. **DO NOT** initialize with README, .gitignore, or license
4. Click **"Create repository"**

### Step 3: Connect and Push

```powershell
# Update remote URL (replace with your new repo URL)
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git

# Push
git push -u origin main
```

---

## Option 2: Clean Existing Repo (No Delete Needed)

If you want to keep the same repo but clean it:

```powershell
# Remove LFS
git lfs uninstall

# Remove all LFS files from tracking
git lfs untrack "*"

# Remove .gitattributes
Remove-Item .gitattributes -ErrorAction SilentlyContinue

# Create clean .gitattributes (no LFS for configs)
# (Use the content from Option 1)

# Force push (rewrites history - be careful!)
git add .
git commit -m "chore: remove all Git LFS, start fresh"
git push origin main --force
```

---

## ✅ Recommended: Option 1 (Fresh Start)

**Why?**
- ✅ No LFS history baggage
- ✅ Clean git history
- ✅ No manual file fixes needed
- ✅ Everything works from day 1

**Steps:**
1. Delete old repo on GitHub (Settings → Delete this repository)
2. Create new repo
3. Follow Step 1 above to prepare local repo
4. Push to new repo

---

## ⚠️ Important Notes

- **Backup first:** Make sure you have all your code locally
- **Update Vercel:** After creating new repo, update Vercel project to point to new repo
- **Update GitHub Actions:** If you have workflows, update the repo URL

---

**I recommend Option 1 - it's cleaner and faster!** 🚀

