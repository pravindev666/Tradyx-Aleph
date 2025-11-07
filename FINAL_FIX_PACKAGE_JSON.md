# ✅ Final Fix: package.json in Git LFS

## Problem
`package.json` is stored as a Git LFS pointer in the repository, causing Vercel to see:
```
Error: Unexpected token 'v', "version ht"... is not valid JSON.
```
(The "version ht" is from the LFS pointer: `version https://git-lfs.github.com/spec/v1`)

## ✅ Solution: Manual Fix on GitHub

Since the file is already committed as LFS, we need to manually fix it on GitHub:

### Step 1: Delete package.json from GitHub
1. Go to: https://github.com/pravindev666/Tradyx
2. Navigate to: `tradyx-options-dashboard/package.json`
3. Click the **trash icon** (Delete file)
4. Commit the deletion with message: `"chore: delete package.json to remove from LFS"`

### Step 2: Re-add package.json
1. On the same page, click **"Add file"** → **"Create new file"**
2. Path: `tradyx-options-dashboard/package.json`
3. Copy the content from your local file:
   ```powershell
   Get-Content "tradyx-options-dashboard\package.json" -Raw
   ```
4. Paste into GitHub editor
5. Commit with message: `"fix: re-add package.json as regular file (not LFS)"`

### Step 3: Verify
1. On GitHub, click on `package.json`
2. You should see actual JSON content, NOT:
   ```
   version https://git-lfs.github.com/spec/v1
   oid sha256:...
   ```

### Step 4: Pull Changes Locally
```powershell
git pull origin main
```

### Step 5: Redeploy on Vercel
Vercel should now be able to read `package.json` correctly!

---

## Alternative: Use GitHub CLI (if installed)

```powershell
# Delete file
gh api repos/pravindev666/Tradyx/contents/tradyx-options-dashboard/package.json \
  -X DELETE \
  -f message="chore: delete package.json from LFS" \
  -f sha="$(gh api repos/pravindev666/Tradyx/contents/tradyx-options-dashboard/package.json | ConvertFrom-Json).sha"

# Re-add file
$content = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content "tradyx-options-dashboard\package.json" -Raw)))
gh api repos/pravindev666/Tradyx/contents/tradyx-options-dashboard/package.json \
  -X PUT \
  -f message="fix: re-add package.json as regular file" \
  -f content="$content"
```

---

## ✅ What We've Already Done

1. ✅ Updated `.gitattributes` to exclude `package.json` from LFS
2. ✅ Created root `.gitattributes` file
3. ✅ Pushed changes to GitHub

**Now you just need to manually delete and re-add the file on GitHub!**

