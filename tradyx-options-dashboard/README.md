# Tradyx Quant Dashboard

**Advanced NIFTY Options Analytics & Machine Learning Forecasts**

A real-time options trading dashboard with volatility analysis, ML predictions, and comprehensive market indicators for NIFTY options traders.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites & Installation](#prerequisites--installation)
- [Tech Stack & Versions](#tech-stack--versions)
- [Project Structure](#project-structure)
- [Development](#development)
- [Data Generation](#data-generation)
- [Deployment](#deployment)
- [Git Commands](#git-commands)
- [Problems Faced & Solutions](#problems-faced--solutions)
- [Ad Integration (Adsterra)](#ad-integration-adsterra)
- [GitHub Actions & CI/CD](#github-actions--cicd)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed:

```bash
# Node.js (v20.9.0 or higher)
node --version  # Should be >= 20.9.0

# npm (comes with Node.js)
npm --version

# Python (v3.12 or higher)
python --version  # Should be >= 3.12

# Git
git --version
```

### 2. Clone Repository

```bash
git clone <your-repository-url>
cd Tradyx/tradyx-options-dashboard
```

### 3. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd scripts
pip install -r requirements.txt
cd ..
```

### 4. Generate Initial Data

```bash
# Run all data generation scripts
cd scripts
python run_all.py
cd ..
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Prerequisites & Installation

### Required Tools

1. **Node.js & npm**
   ```bash
   # Install Node.js from https://nodejs.org/
   # Or using nvm (Node Version Manager)
   nvm install 20.9.0
   nvm use 20.9.0
   ```

2. **Python 3.12+**
   ```bash
   # Install Python from https://www.python.org/
   # Or using pyenv
   pyenv install 3.12.0
   pyenv local 3.12.0
   ```

3. **Git**
   ```bash
   # Install Git from https://git-scm.com/
   ```

### Installation Steps

```bash
# 1. Create Next.js project (if starting fresh)
npx create-next-app@latest tradyx-options-dashboard --typescript --tailwind --app

# 2. Navigate to project directory
cd tradyx-options-dashboard

# 3. Install Node.js dependencies
npm install

# 4. Install Python dependencies
cd scripts
pip install -r requirements.txt
cd ..

# 5. Verify installation
npm run type-check  # TypeScript type checking
python --version    # Should show Python 3.12+
```

---

## 🛠️ Tech Stack & Versions

### Frontend Framework

- **Next.js**: `^16.0.0` (App Router)
- **React**: `^18.2.0`
- **TypeScript**: `^5.6.2`
- **Node.js**: `>=20.9.0`

### Styling & UI

- **Tailwind CSS**: `^3.4.18`
- **Framer Motion**: `^11.18.2` (Animations)
- **Lucide React**: `^0.446.0` (Icons)
- **next-themes**: `^0.4.6` (Dark mode)

### Data Fetching & State

- **SWR**: `^2.3.6` (Data fetching)
- **Axios**: `^1.13.2` (HTTP client)
- **Zod**: `^3.23.8` (Schema validation)

### Backend & Data Processing

- **Python**: `3.12+`
- **NumPy**: `>=1.24.0`
- **Pandas**: `>=2.0.0`
- **scikit-learn**: `>=1.3.0` (Machine Learning)
- **TensorFlow**: `>=2.13.0` (Deep Learning)
- **statsmodels**: `>=0.14.0` (Statistical Models)
- **yfinance**: `>=0.2.0` (Market Data)
- **beautifulsoup4**: `>=4.12.0` (Web Scraping)
- **requests**: `>=2.31.0` (HTTP Requests)

### Deployment & DevOps

- **Vercel**: Hosting & CI/CD
- **GitHub Actions**: Automated data updates
- **Git**: Version control

### Programming Languages

- **TypeScript** (Frontend)
- **Python** (Backend/Data Processing)
- **JavaScript** (Configuration files)
- **JSON** (Data storage)

---

## 📁 Project Structure

```
tradyx-options-dashboard/
├── app/                          # Next.js App Router
│   ├── about/                   # About page
│   ├── api/                     # API routes
│   ├── components/              # App-specific components
│   │   ├── AnimatedMeshBackground.tsx
│   │   ├── SEOHead.tsx
│   │   └── visual/             # Visual components
│   ├── fonts/                   # Custom fonts
│   ├── legal/                   # Legal pages (Privacy, Terms, etc.)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main dashboard page
│   └── sitemap.ts               # Sitemap generator
│
├── components/                   # Shared React components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── OptionsDashboard.tsx # Main dashboard component
│   │   ├── MarketMoodGauge.tsx
│   │   ├── VolatilityIndicators.tsx
│   │   └── ...                  # Other dashboard tiles
│   ├── HighPerformanceAd.tsx    # Adsterra ad component
│   ├── HighPerformanceAdSidebar.tsx
│   ├── ConsentBanner.tsx        # Cookie consent
│   └── layout/                  # Layout components
│
├── hooks/                        # React hooks
│   └── useDashboard.ts          # Dashboard data hook
│
├── lib/                          # Utility libraries
│   ├── fetcher.ts               # Data fetching utilities
│   ├── fmt.ts                   # Formatting utilities
│   ├── types.ts                 # TypeScript types
│   └── schema.ts                # Zod schemas
│
├── scripts/                      # Python data generation scripts
│   ├── data/                    # Generated JSON data
│   ├── fetch_nse_chain.py       # Fetch NSE option chain
│   ├── fetch_yf.py              # Fetch yfinance data
│   ├── fetch_predictions.py     # Fetch OHLC and sector data
│   ├── compute_metrics.py       # Compute option metrics
│   ├── compute_volatility_indicators.py
│   ├── compute_ml_predictions.py # ML predictions
│   ├── compute_breadth_momentum.py
│   ├── build_dashboard_json.py  # Build final dashboard.json
│   ├── run_all.py               # Master script (runs all)
│   ├── validate_production.py   # Data validation
│   ├── requirements.txt         # Python dependencies
│   └── README.md                # Scripts documentation
│
├── public/                       # Static assets
│   ├── data/                    # Dashboard JSON (served by Vercel)
│   │   └── dashboard.json       # Main data file
│   ├── ads/                     # Ad-related files
│   │   ├── dashboard.json
│   │   └── placeholder-300x250.png
│   ├── ads.txt                  # Ad network declarations
│   └── robots.txt               # SEO robots file
│
├── .github/                      # GitHub Actions workflows
│   └── workflows/
│       └── data-update.yml      # Automated data updates
│
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

---

## 💻 Development

### Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# TypeScript type checking
npm run type-check

# Validate data (Python)
npm run data:validate

# Update data (Python)
npm run data:update
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Custom dashboard URL
NEXT_PUBLIC_DASHBOARD_URL=/data/dashboard.json

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
```

### Development Workflow

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Update data (if needed)**
   ```bash
   cd scripts
   python run_all.py
   cd ..
   ```

3. **Type check before committing**
   ```bash
   npm run type-check
   ```

---

## 📊 Data Generation

### Overview

The dashboard uses Python scripts to fetch market data, compute metrics, and generate ML predictions. The data is stored in `public/data/dashboard.json` and served as a static file by Vercel.

### Data Pipeline

```
Market Data Sources
    ↓
Python Scripts (scripts/)
    ↓
JSON Data (public/data/dashboard.json)
    ↓
Next.js Frontend (app/page.tsx)
    ↓
Dashboard Display
```

### Running Data Scripts

```bash
# Run all scripts in sequence
cd scripts
python run_all.py

# Run individual scripts
python fetch_nse_chain.py      # Fetch NSE option chain
python fetch_yf.py              # Fetch yfinance data
python fetch_predictions.py     # Fetch OHLC and sector data
python compute_metrics.py       # Compute option metrics
python compute_volatility_indicators.py
python compute_ml_predictions.py
python compute_breadth_momentum.py
python build_dashboard_json.py  # Build final JSON
```

### Data Update Schedule

- **Automated**: GitHub Actions runs every 15 minutes during market hours (9:15 AM - 3:30 PM IST, Monday-Friday)
- **Manual**: Run `python scripts/run_all.py` locally

---

## 🚢 Deployment

### Deployment Architecture

```
┌─────────────────────┐
│   GitHub Repository │
│                     │
│   ┌───────────────┐ │
│   │  Frontend Code│ │──┐
│   └───────────────┘ │  │
│                     │  │ Auto-deploy on push
│   ┌───────────────┐ │  │
│   │  Data Updates │ │  │
│   │ (GitHub Actions)│  │
│   └───────────────┘ │  │
└─────────────────────┘  │
         │               │
         │               │
         ▼               ▼
┌─────────────────────────────┐
│      Vercel Platform        │
│                             │
│  • Next.js UI Deployment    │
│  • Serves static files      │
│  • Auto-updates on push     │
└─────────────────────────────┘
```

### Vercel Deployment

#### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `tradyx-options-dashboard`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Step 2: Environment Variables

Add environment variables in Vercel dashboard (Settings → Environment Variables):

```env
NODE_ENV=production
NEXT_PUBLIC_DASHBOARD_URL=/data/dashboard.json
```

#### Step 3: Deploy

- **Automatic**: Vercel automatically deploys on every push to `main` branch
- **Manual**: Click "Deploy" in Vercel dashboard

#### Step 4: Verify Deployment

1. Check Vercel deployment logs
2. Visit your deployed URL
3. Verify data is loading correctly

### Deployment Process

1. **Frontend Deployment (Vercel)**
   - Push code to GitHub → Vercel auto-deploys
   - Build time: ~2-3 minutes
   - Zero-downtime deployments

2. **Data Updates (GitHub Actions)**
   - Runs every 15 minutes during market hours
   - Updates `public/data/dashboard.json`
   - Commits and pushes to repository
   - Vercel serves updated file automatically (no redeploy needed)

### Vercel Configuration

The project uses Next.js standalone output for optimal deployment:

```javascript
// next.config.js
output: 'standalone'
```

This creates a minimal production build optimized for Vercel's serverless functions.

---

## 🔀 Git Commands

### Common Git Workflow

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "feat: add new feature"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/new-feature

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Git Commands Used in This Project

```bash
# Initial setup
git init
git remote add origin <repository-url>
git branch -M main

# First commit
git add .
git commit -m "initial commit"
git push -u origin main

# Regular workflow
git add .
git commit -m "chore: update data"
git push origin main

# Fix merge conflicts
git pull origin main
# Resolve conflicts manually
git add .
git commit -m "fix: resolve merge conflicts"
git push origin main

# Update data only (skip CI)
git add public/data/dashboard.json
git commit -m "chore: update dashboard data [skip ci]"
git push origin main
```

### GitHub Actions Git Commands

The `data-update.yml` workflow uses these commands:

```bash
# Configure git user
git config --local user.email "github-actions[bot]@users.noreply.github.com"
git config --local user.name "github-actions[bot]"

# Add data file
git add public/data/dashboard.json

# Commit (skip CI to avoid redeploy)
git commit -m "chore: update dashboard data [skip ci]"

# Push to repository
git push origin HEAD:main
```

---

## 🐛 Problems Faced & Solutions

### 1. Multiple Ads Not Rendering

**Problem**: Only one Adsterra ad was showing on the deployed site, even though all ad slots were configured.

**Root Cause**: Multiple ads were loading simultaneously and overwriting the global `window.atOptions` variable, causing conflicts.

**Solution**: Implemented a sequential loading queue system in `HighPerformanceAd.tsx`:
- Ads load one at a time with a 100ms delay between each
- Each ad's configuration is isolated using IIFE (Immediately Invoked Function Expression)
- Ensures `atOptions` is set before the invoke script loads

**Files Modified**:
- `components/HighPerformanceAd.tsx` - Added queue system

### 2. Vercel Build Errors

**Problem**: Build failures due to TypeScript errors, missing dependencies, or CSP (Content Security Policy) issues.

**Solutions**:
- Fixed TypeScript strict mode issues by setting `strict: false` in `tsconfig.json`
- Added all required dependencies to `package.json`
- Updated CSP headers in `next.config.js` to allow Adsterra scripts and iframes
- Set `output: 'standalone'` for optimal Vercel deployment

**Files Modified**:
- `tsconfig.json` - Disabled strict mode
- `next.config.js` - Updated CSP headers
- `package.json` - Added missing dependencies

### 3. GitHub Actions Data Update Failures

**Problem**: GitHub Actions workflow failing to commit and push updated data.

**Solutions**:
- Added proper git configuration in workflow
- Used `[skip ci]` in commit message to avoid triggering redeploy
- Added error handling with `continue-on-error: true`
- Verified repository permissions for GitHub Actions

**Files Modified**:
- `.github/workflows/data-update.yml` - Fixed git configuration

### 4. CSP Blocking Ad Scripts

**Problem**: Content Security Policy (CSP) headers were blocking Adsterra ad scripts and iframes.

**Solution**: Updated CSP in `next.config.js` to allow:
- `script-src 'self' 'unsafe-inline' 'unsafe-eval' https:`
- `frame-src https: data:`
- `connect-src 'self' https:`

**Files Modified**:
- `next.config.js` - Updated CSP headers

### 5. Data Not Updating in Production

**Problem**: Data updates from GitHub Actions weren't reflecting on the deployed site.

**Root Cause**: Vercel wasn't serving updated files without a redeploy.

**Solution**: 
- Store data in `public/data/dashboard.json` (Vercel serves `public/` as static files)
- GitHub Actions commits updated file
- Vercel automatically serves the updated file without redeploy

**Files Modified**:
- `.github/workflows/data-update.yml` - Updated to commit to `public/data/dashboard.json`
- `scripts/build_dashboard_json.py` - Updated output path

### 6. Ad Container Sizing Issues

**Problem**: Ad containers collapsing or not displaying correctly on different screen sizes.

**Solution**: Added fixed `minWidth` and `minHeight` to all ad containers:
- Wrapper divs have explicit `minWidth` and `minHeight` styles
- Ad components have fixed dimensions in inline styles
- Responsive breakpoints for mobile/tablet/desktop

**Files Modified**:
- `components/HighPerformanceAd.tsx` - Fixed container sizing
- `components/HighPerformanceAdSidebar.tsx` - Fixed sidebar ad sizing
- `components/dashboard/OptionsDashboard.tsx` - Updated wrapper divs

### 7. TypeScript Type Errors

**Problem**: TypeScript errors in ad components and dashboard components.

**Solution**:
- Added proper type definitions for ad props
- Used `suppressHydrationWarning` for client-side only components
- Added `'use client'` directive to all client components

**Files Modified**:
- `components/HighPerformanceAd.tsx` - Added proper types
- `components/dashboard/OptionsDashboard.tsx` - Fixed type errors

---

## 📢 Ad Integration (Adsterra)

### Overview

The dashboard uses **Adsterra HighPerformanceFormat** ads for monetization. Ads are integrated using custom React components that handle script loading and configuration.

### Ad Components

#### 1. `HighPerformanceAd.tsx`

Main ad component that handles ad loading and configuration.

**Features**:
- Sequential loading queue to prevent conflicts
- Isolated script execution for each ad
- Error handling and logging
- Fixed container sizing

**Usage**:
```tsx
<HighPerformanceAd 
  adKey="your-ad-key"
  width={728}
  height={90}
/>
```

#### 2. `HighPerformanceAdSidebar.tsx`

Wrapper component for sidebar ads with styling.

**Usage**:
```tsx
<HighPerformanceAdSidebar 
  adKey="your-ad-key"
  width={300}
  height={250}
/>
```

### Ad Placements

The dashboard has **4 ad slots**:

1. **Top Horizontal Banner** (728×90)
   - Location: Below expiry countdown
   - Ad Key: `b4903cf5635d652e019f9cf30ea1cd88`

2. **Middle Horizontal Banner** (468×60)
   - Location: Before prediction models
   - Ad Key: `d8c93074244d311adc394f3a309c3118`

3. **Sidebar Rectangle** (300×250)
   - Location: Right sidebar, after VRP Slope
   - Ad Key: `2f370fd28cbdeb2108926fba77c70947`

4. **Sidebar Banner** (320×50)
   - Location: Right sidebar, after Drift Direction
   - Ad Key: `35bb5972176687c2571d4f6e436e1f71`

### Ad Configuration

#### Adsterra Setup

1. **Create Ad Zones** in Adsterra dashboard
2. **Get Ad Keys** for each zone
3. **Update Ad Keys** in `components/dashboard/OptionsDashboard.tsx`

#### Code Integration

Ads are integrated in `components/dashboard/OptionsDashboard.tsx`:

```tsx
// Top horizontal ad
<HighPerformanceAd 
  adKey="b4903cf5635d652e019f9cf30ea1cd88"
  width={728}
  height={90}
/>

// Sidebar ad
<HighPerformanceAdSidebar 
  adKey="2f370fd28cbdeb2108926fba77c70947"
  width={300}
  height={250}
/>
```

### How Ads Work

1. **Component Mounts**: `HighPerformanceAd` component mounts on client side
2. **Queue System**: Ad loading is queued to prevent conflicts
3. **Script Injection**: Ad configuration script is injected into DOM
4. **Ad Loading**: Adsterra invoke script loads asynchronously
5. **Ad Display**: Ad renders in the container

### Sequential Loading Queue

To prevent `window.atOptions` conflicts, ads load sequentially:

```typescript
// Global queue system
window.adsterraQueue = [];
window.adsterraLoading = false;

// Load ads one at a time
loadAdSequentially(() => {
  // Set atOptions
  // Load invoke script
});
```

### CSP Configuration

Content Security Policy allows Adsterra scripts:

```javascript
// next.config.js
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
"frame-src https: data:",
"connect-src 'self' https:",
```

### Troubleshooting Ads

**Ads not showing?**
1. Check ad blockers (disable for testing)
2. Verify ad keys are correct
3. Check browser console for errors
4. Verify CSP headers allow Adsterra scripts
5. Test on production domain (not localhost)
6. Check Adsterra dashboard for zone status

**Only one ad showing?**
- This was fixed with the sequential loading queue
- Ensure all ad keys are unique
- Check that all ad components are mounted

**Ad container collapsing?**
- Verify `minWidth` and `minHeight` are set
- Check parent container has proper sizing
- Verify responsive breakpoints

---

## 🤖 GitHub Actions & CI/CD

### Overview

GitHub Actions automates data updates every 15 minutes during market hours. Vercel handles frontend deployment automatically.

### Workflow: `data-update.yml`

**Purpose**: Update dashboard data automatically during market hours

**Schedule**:
- **IST**: 9:15 AM - 3:30 PM (Monday to Friday)
- **UTC**: 3:45 AM - 10:00 AM (Monday to Friday)
- **Frequency**: Every 15 minutes

**Steps**:
1. Checkout code
2. Setup Python 3.12
3. Install Python dependencies
4. Run data generation scripts
5. Commit and push updated data

### Workflow Configuration

```yaml
# .github/workflows/data-update.yml
name: Update Dashboard Data

on:
  schedule:
    - cron: '15,30,45 3-9 * * 1-5'  # Every 15 min, 3-9 UTC, Mon-Fri
    - cron: '0,15 10 * * 1-5'        # 10:00, 10:15 UTC (3:30 PM IST)
  workflow_dispatch:  # Manual trigger

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: pip install -r scripts/requirements.txt
      - run: python scripts/run_all.py
      - run: git commit -m "chore: update dashboard data [skip ci]"
      - run: git push origin HEAD:main
```

### How It Works

```
GitHub Actions (Every 15 min)
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

### Manual Trigger

You can manually trigger the workflow:

1. Go to GitHub repository → Actions tab
2. Select "Update Dashboard Data" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Frontend Deployment (Vercel)

Vercel automatically deploys the frontend on every push to `main`:

1. **Push code** → Vercel detects changes
2. **Build** → Runs `npm run build`
3. **Deploy** → Deploys to Vercel platform
4. **Serve** → Serves Next.js app and static files

**No GitHub Actions needed for frontend deployment!**

### CI/CD Pipeline

```
Developer
    ↓
Push to GitHub
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
Vercel          GitHub Actions
(Auto-deploy)   (Data updates)
    │                 │
    │                 │
    ▼                 ▼
Frontend          Data File
Deployment        Updates
    │                 │
    └────────┬────────┘
             │
             ▼
    Production Site
```

---

## 🔧 Troubleshooting

### Development Issues

**Port already in use**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

**TypeScript errors**
```bash
# Check types
npm run type-check

# Fix strict mode issues (if needed)
# Set strict: false in tsconfig.json
```

**Python script errors**
```bash
# Check Python version
python --version  # Should be 3.12+

# Reinstall dependencies
cd scripts
pip install -r requirements.txt --upgrade
```

### Deployment Issues

**Vercel build fails**
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Check TypeScript errors locally
- Verify environment variables

**Data not updating**
- Check GitHub Actions workflow runs
- Verify Python scripts execute successfully
- Check if `public/data/dashboard.json` is being committed
- Verify file path is correct

**Ads not showing**
- Disable ad blockers
- Check browser console for errors
- Verify ad keys are correct
- Check CSP headers allow Adsterra scripts
- Test on production domain (not localhost)

### Data Issues

**Data not loading**
- Verify `public/data/dashboard.json` exists
- Check file path in `useDashboard.ts`
- Verify data format matches schema
- Check browser network tab for 404 errors

**Stale data**
- Run data scripts manually: `python scripts/run_all.py`
- Check GitHub Actions workflow status
- Verify data update schedule is correct

---

## 📝 Additional Resources

### Documentation

- **Scripts**: `scripts/README.md` - Data generation guide
- **Data Structure**: `scripts/DATA_STRUCTURE.md` - Data schema
- **Data Sources**: `scripts/DATA_SOURCE_PRIORITY.md` - Data source information

### External Links

- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs
- **GitHub Actions**: https://docs.github.com/en/actions
- **Adsterra**: https://adsterra.com

---

## 📄 License

All Rights Reserved. See `LICENSE` for details.

---

## 👤 Author

**Pravin A. Mathew**

Built with ❤️ for NIFTY options traders.

---

## 📧 Support

For issues, questions, or contributions, please contact:
- **Email**: support@tradyx.in
- **GitHub**: [Your GitHub Profile]

---

**Last Updated**: December 2024
