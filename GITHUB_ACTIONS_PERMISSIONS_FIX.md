# Fix GitHub Actions 403 Permission Error

## Problem
GitHub Actions workflow is failing with:
```
remote: Permission to pravindev666/Tradyx-Aleph.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/pravindev666/Tradyx-Aleph/': The requested URL returned error: 403
```

## Solution Applied
✅ Added explicit `permissions` to the workflow:
```yaml
permissions:
  contents: write  # Required to push commits
  pull-requests: read
```

## Additional Steps to Check

### 1. Repository Settings
1. Go to your repository: `https://github.com/pravindev666/Tradyx-Aleph`
2. Click **Settings** → **Actions** → **General**
3. Under **Workflow permissions**, ensure:
   - ✅ **Read and write permissions** is selected (not "Read repository contents and packages permissions")
   - ✅ **Allow GitHub Actions to create and approve pull requests** (optional)

### 2. Branch Protection Rules
If your `main` branch has protection rules:
1. Go to **Settings** → **Branches**
2. Check if `main` has branch protection
3. If yes, either:
   - Add `github-actions[bot]` as an exception, OR
   - Disable "Require pull request reviews" for automated commits

### 3. Alternative: Use Personal Access Token (PAT)
If the above doesn't work, create a PAT:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Create a token with `repo` scope
3. Add it as a secret: `GITHUB_TOKEN_PAT`
4. Update workflow to use:
   ```yaml
   - name: Checkout code
     uses: actions/checkout@v4
     with:
       token: ${{ secrets.GITHUB_TOKEN_PAT }}
   ```

## Test
After making changes, manually trigger the workflow:
1. Go to **Actions** tab
2. Select **Update Dashboard Data**
3. Click **Run workflow** → **Run workflow**

The workflow should now successfully push commits and trigger Netlify/Cloudflare deployments.

