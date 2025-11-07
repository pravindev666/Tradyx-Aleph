# ✅ Simplified Setup Guide

## What You Need (Minimal)

### 1. Vercel (UI Deployment)
- Connect GitHub repo → Auto-deploys on push
- **No GitHub Actions needed for UI**

### 2. GitHub Actions (Data Updates Only)
- **Only 1 workflow:** `data-update.yml`
- Runs Python scripts every 15 minutes
- Updates `public/data/dashboard.json`
- Vercel serves it automatically

---

## Files You DON'T Need

❌ **Deleted:**
- `deploy.yml` - Vercel handles this
- `ci.yml` - Not needed
- `build-data.yml` - Duplicate
- `python-lint.yml` - Optional
- `Dockerfile` - Not needed
- `.dockerignore` - Not needed

✅ **Kept:**
- `data-update.yml` - **ONLY ONE YOU NEED**

---

## Architecture

```
┌─────────────────┐
│  Vercel         │  ← Deploys UI automatically
│  (UI)           │
└────────┬────────┘
         │
         │ Serves static files
         │
┌────────▼────────┐
│  GitHub Repo    │
│  public/data/   │  ← Updated by GitHub Actions
└────────┬────────┘
         │
         │ Commits data
         │
┌────────▼────────┐
│  GitHub Actions │  ← Runs Python scripts
│  (Cron Job)     │
└─────────────────┘
```

---

## Setup Steps

### Step 1: Vercel
1. Go to vercel.com
2. Import your GitHub repository
3. Click "Deploy"
4. ✅ Done! UI auto-deploys on every push

### Step 2: GitHub Actions
1. Go to GitHub repo → Actions tab
2. `data-update.yml` is already configured
3. ✅ Done! Runs automatically every 15 minutes

---

## What Happens

**UI Changes:**
- Push code → Vercel auto-deploys (no GitHub Actions)

**Data Updates:**
- Every 15 min → GitHub Actions runs Python scripts
- Updates `public/data/dashboard.json`
- Vercel serves updated file (no redeploy needed)

---

## No Docker Needed

- Vercel handles Next.js build
- GitHub Actions handles Python scripts
- No containers needed

---

## No npm ci in GitHub Actions

- Vercel runs `npm install` automatically
- GitHub Actions only needs Python
- No Node.js setup in workflows

---

**That's it! Simple and clean.** 🎉

