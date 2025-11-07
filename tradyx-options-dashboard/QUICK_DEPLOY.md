# ⚡ Quick Deploy Guide

## 🎯 5-Minute Setup

### 1️⃣ Vercel (2 minutes)
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **"Deploy"** (uses defaults)
5. ✅ Done! Your site is live

### 2️⃣ GitHub Secrets (2 minutes)
1. GitHub repo → **Settings** → **Secrets** → **Actions**
2. Get from Vercel Dashboard → Settings:
   - **VERCEL_TOKEN** (Settings → Tokens → Create)
   - **VERCEL_ORG_ID** (Settings → General)
   - **VERCEL_PROJECT_ID** (Settings → General)
3. Add all 3 as secrets
4. ✅ Done! GitHub Actions will work

### 3️⃣ Test (1 minute)
1. Push any change to `main` branch
2. Check GitHub Actions tab → Should see workflow running
3. ✅ Done! Everything is automated

---

## 📋 What Happens Next

**UI Deployment:**
- Every code push → Vercel auto-deploys

**Data Updates:**
- Every 15 min (9:15 AM - 3:30 PM IST) → GitHub Actions updates data
- Vercel serves updated file automatically

---

## 🔗 Important Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Actions:** Your repo → Actions tab
- **Vercel Settings:** Dashboard → Settings

---

**That's it! Your dashboard is production-ready! 🚀**

