# 🗑️ Workflows to Delete

Since you're deploying UI directly from Vercel, you only need **ONE** workflow.

## ✅ KEEP THIS ONE:
- **`data-update.yml`** - Updates data every 15 minutes

## ❌ DELETE THESE (Not Needed):

1. **`deploy.yml`** - Vercel handles UI deployment
2. **`ci.yml`** - Not needed (Vercel builds UI)
3. **`build-data.yml`** - Duplicate of data-update.yml
4. **`python-lint.yml`** - Optional (can add later)
5. **`tests.yml`** - Optional (can add later)

## How to Delete:

```bash
# From your repository root
rm .github/workflows/deploy.yml
rm .github/workflows/ci.yml
rm .github/workflows/build-data.yml
rm .github/workflows/python-lint.yml
rm .github/workflows/tests.yml
```

Or delete them from GitHub web interface:
1. Go to `.github/workflows/` folder
2. Delete the files listed above
3. Keep only `data-update.yml`

---

## Final Setup:

**Only 1 workflow needed:**
- `data-update.yml` - Runs Python scripts every 15 minutes

**That's it!** 🎉

