# 📁 GitHub Repository Structure Example

## ✅ Correct Structure for Vercel

Here's exactly how your GitHub repository should look:

```
Tradyx-Test/                          ← GitHub repo root
│
├── .github/
│   └── workflows/
│       └── data-update.yml           ← Only workflow needed
│
├── tradyx-options-dashboard/         ← Your Next.js app (Vercel looks here)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── ...
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── OptionsDashboard.tsx
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── public/
│   │   ├── data/
│   │   │   └── dashboard.json        ← Data file (updated by GitHub Actions)
│   │   ├── ads.txt
│   │   └── robots.txt
│   │
│   ├── scripts/
│   │   ├── fetch_yf.py
│   │   ├── compute_metrics.py
│   │   ├── run_all.py
│   │   └── ...
│   │
│   ├── package.json                  ← ✅ Vercel finds this!
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── ...
│
└── README.md                          ← Optional
```

---

## ⚠️ What NOT to Have

### ❌ Don't have package.json in root:
```
Tradyx-Test/
├── package.json                      ← ❌ Remove this!
└── tradyx-options-dashboard/
    └── package.json                  ← ✅ Keep this!
```

### ❌ Don't have multiple git repos:
```
Tradyx-Test/                          ← Git repo here
└── tradyx-options-dashboard/
    └── .git/                         ← ❌ Remove this!
```

---

## ✅ Correct Setup

### 1. Repository Structure:
```
Tradyx-Test/                          ← ONE git repository
├── .git/                             ← Git repo in root only
├── .github/
│   └── workflows/
│       └── data-update.yml
└── tradyx-options-dashboard/         ← All Next.js files here
    ├── package.json                  ← Vercel reads this
    ├── app/
    ├── components/
    ├── public/
    └── scripts/
```

### 2. Vercel Settings:
- **Root Directory:** `tradyx-options-dashboard`
- **Framework:** Next.js (auto-detected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

---

## 📋 Checklist

- [ ] Only ONE `.git` folder (in root)
- [ ] `package.json` ONLY in `tradyx-options-dashboard/`
- [ ] NO `package.json` in root
- [ ] All Next.js files in `tradyx-options-dashboard/`
- [ ] Vercel Root Directory set to `tradyx-options-dashboard`

---

## 🎯 Summary

**Your structure should be:**
```
Tradyx-Test/ (GitHub repo)
└── tradyx-options-dashboard/ (Next.js app)
    └── package.json (Vercel reads this)
```

**Vercel Settings:**
- Root Directory = `tradyx-options-dashboard`

**That's it!** 🚀

