# GitHub Actions Workflows

## Architecture

**Simple Setup:**
- **UI Deployment:** Handled by Vercel (automatic on push)
- **Data Updates:** Handled by GitHub Actions (scheduled cron jobs)

## Workflows

### 1. `data-update.yml` - **ONLY WORKFLOW NEEDED** ✅

**Purpose:** Update dashboard data every 15 minutes during market hours

**Schedule:**
- IST: 9:15 AM - 3:30 PM (Monday to Friday)
- UTC: 3:45 AM - 10:00 AM (Monday to Friday)
- Frequency: Every 15 minutes

**What it does:**
1. Runs Python scripts to fetch/compute data
2. Generates `public/data/dashboard.json`
3. Commits and pushes to repository
4. Vercel automatically serves the updated file (no redeploy needed)

**Manual trigger:** Available via `workflow_dispatch`

---

## What's NOT Needed

❌ **No `deploy.yml`** - Vercel handles UI deployment automatically  
❌ **No `ci.yml`** - Not needed if Vercel builds UI  
❌ **No `build-data.yml`** - Duplicate of `data-update.yml`  
❌ **No `python-lint.yml`** - Optional, can add later if needed  
❌ **No Docker** - Not needed for this setup  
❌ **No npm ci in workflows** - Vercel handles Node.js dependencies  

---

## How It Works

```
GitHub Actions (Every 15 min, 9:15 AM - 3:30 PM IST)
    ↓
Runs Python Scripts
    ↓
Generates public/data/dashboard.json
    ↓
Commits to Repository
    ↓
Vercel Serves File (Automatic, no redeploy)
    ↓
UI Displays Updated Data
```

---

## Setup

1. **Vercel:** Connect your GitHub repo → Auto-deploys UI on push
2. **GitHub Actions:** `data-update.yml` runs automatically on schedule
3. **That's it!** No other configuration needed.

---

## Troubleshooting

**Data not updating?**
- Check `data-update.yml` workflow runs in Actions tab
- Verify Python scripts execute successfully
- Check if `public/data/dashboard.json` is being committed

**UI not deploying?**
- Check Vercel dashboard
- Verify repository is connected
- Check Vercel build logs

---

**Keep it simple! Only one workflow needed for data updates.** 🚀
