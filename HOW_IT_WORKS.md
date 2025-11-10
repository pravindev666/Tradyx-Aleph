# 🔄 How Your Dashboard Updates Every 15 Minutes with yfinance Data

## Understanding the Architecture

### Your Current Setup
- **Frontend**: Next.js (serves UI)
- **Backend**: Python scripts (run in GitHub Actions, no server)
- **Data Source**: yfinance API (fetches live NIFTY/VIX data)
- **Update Frequency**: Every 15 minutes (9:15 AM - 3:30 PM IST)

---

## 🎯 How It Works: Static Site with Periodic Rebuilds

### The Key Concept

**Your site is static, but we rebuild it every 15 minutes with fresh yfinance data!**

This is called **"Static Site Generation with Periodic Rebuilds"** - a common pattern for data-driven sites.

### Complete Flow (Every 15 Minutes)

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions Triggered (Cron: 9:15 AM, 9:30 AM...)   │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Step 1: Fetch LIVE Data from yfinance                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Python: fetch_yf.py                              │ │
│  │   ├─→ yf.Ticker("^NSEI").info                    │ │
│  │   │   └─→ Gets CURRENT NIFTY price (real-time)   │ │
│  │   ├─→ yf.Ticker("^INDIAVIX").info                │ │
│  │   │   └─→ Gets CURRENT VIX (real-time)            │ │
│  │   └─→ Fetches historical series data             │ │
│  │       └─→ Stores in: data/yf.json                │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Step 2: Process & Calculate Metrics                   │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Python: Other scripts                             │ │
│  │   ├─→ Fetch NSE chain data                        │ │
│  │   ├─→ Calculate volatility indicators             │ │
│  │   ├─→ Generate ML predictions                     │ │
│  │   └─→ Store in: data/*.json                        │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Step 3: Generate dashboard.json                        │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Python: build_dashboard_json.py                  │ │
│  │   ├─→ Reads: data/yf.json (FRESH yfinance data)  │ │
│  │   ├─→ Reads: data/metrics.json                    │ │
│  │   ├─→ Combines all data                           │ │
│  │   └─→ Creates: public/data/dashboard.json        │ │
│  │       └─→ Contains FRESH data from yfinance! ✅    │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Step 4: Build Next.js (Static Export)                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ npm run build                                      │ │
│  │   ├─→ Next.js reads: public/data/dashboard.json   │ │
│  │   │   └─→ This file has FRESH yfinance data!      │ │
│  │   ├─→ Copies to: out/data/dashboard.json          │ │
│  │   ├─→ Generates all static HTML/JS files           │ │
│  │   └─→ Creates: /out directory (complete static site)││
│  │       └─→ Includes FRESH dashboard.json ✅          │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Step 5: Deploy to Cloudflare Pages                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Upload /out directory                             │ │
│  │   ├─→ Contains: out/data/dashboard.json (FRESH!)   │ │
│  │   ├─→ Contains: All static HTML/JS files          │ │
│  │   └─→ NO BUILD on Cloudflare (0 build minutes!)   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Step 6: Visitors See Fresh Data                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Frontend fetches: /data/dashboard.json            │ │
│  │   ├─→ This is a STATIC file                      │ │
│  │   ├─→ But it was just built with FRESH data!     │ │
│  │   └─→ Contains latest yfinance prices ✅          │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Points

### 1. Data is Fresh Because We Rebuild
- ✅ **Every 15 minutes**: GitHub Actions runs
- ✅ **Fetches live data**: Python calls yfinance API (real-time)
- ✅ **Rebuilds entire site**: Next.js build includes fresh data
- ✅ **Deploys new build**: Fresh data goes live

### 2. Site is Static But Always Fresh
- ✅ **Static at any moment**: Site is pre-built static files
- ✅ **Rebuilt frequently**: Every 15 minutes with fresh data
- ✅ **No server needed**: All static files served from CDN
- ✅ **Fast performance**: Static files = fastest loading

### 3. Why This Works
- ✅ **yfinance data is fetched**: Python scripts call yfinance API every 15 mins
- ✅ **Data is fresh**: Each build includes latest yfinance data
- ✅ **No stale data**: Site is rebuilt before data gets old
- ✅ **Completely free**: All within free tier limits

---

## 📊 Timeline Example

### 9:15 AM IST
```
GitHub Actions runs
  → Python fetches yfinance (NIFTY: ₹24,500, VIX: 14.5)
  → Generates dashboard.json with this data
  → Builds Next.js (includes fresh data)
  → Deploys to Cloudflare
  → Visitors see: NIFTY ₹24,500, VIX 14.5 ✅
```

### 9:30 AM IST (15 minutes later)
```
GitHub Actions runs again
  → Python fetches yfinance (NIFTY: ₹24,520, VIX: 14.8) ← NEW DATA!
  → Generates dashboard.json with NEW data
  → Builds Next.js (includes NEW data)
  → Deploys to Cloudflare
  → Visitors see: NIFTY ₹24,520, VIX 14.8 ✅ (UPDATED!)
```

### Result
- ✅ **Data updates every 15 minutes** (fresh from yfinance)
- ✅ **Site is always current** (rebuilt with latest data)
- ✅ **No server needed** (all static files)

---

## 🎯 Why This Solution is Perfect

### For Your Use Case
1. ✅ **yfinance data updates**: Python fetches live data every 15 mins
2. ✅ **Fresh data in UI**: Site rebuilt with latest data
3. ✅ **No build limits**: Build in GitHub Actions (unlimited)
4. ✅ **0 build minutes**: Deploy pre-built (no build on Cloudflare)
5. ✅ **Completely free**: All within free tiers

### Benefits
- ✅ **Unlimited visitors**: Cloudflare unlimited bandwidth
- ✅ **Fast loading**: Static files = fastest performance
- ✅ **Ads allowed**: No restrictions on Cloudflare
- ✅ **Clean URLs**: `*.pages.dev` or custom domain
- ✅ **Always fresh**: Rebuilt every 15 mins with yfinance data

---

## 🔧 Technical Details

### How dashboard.json Gets Fresh Data

1. **Python fetches from yfinance**:
   ```python
   # fetch_yf.py
   nifty_ticker = yf.Ticker("^NSEI")
   current_spot = nifty_ticker.info.get("regularMarketPrice")  # LIVE PRICE!
   ```

2. **Stored in dashboard.json**:
   ```json
   {
     "spot": 24500,  // ← Fresh from yfinance
     "vix": 14.5,    // ← Fresh from yfinance
     "updatedAt": "2025-01-XX 09:15:00"
   }
   ```

3. **Baked into static build**:
   - Next.js build copies `public/data/dashboard.json` → `out/data/dashboard.json`
   - This file is included in the static site
   - Frontend fetches it as a static file

4. **Next rebuild (15 mins later)**:
   - Python fetches NEW data from yfinance
   - Generates NEW dashboard.json
   - Builds NEW static site
   - Deploys NEW build
   - Fresh data is live! ✅

---

## ✅ Summary

**Question**: How does static site get fresh yfinance data every 15 mins?

**Answer**: 
- We rebuild the entire static site every 15 minutes!
- Python fetches fresh data from yfinance API
- Next.js build includes the fresh data
- Deploy the new build
- Visitors see fresh data ✅

**This is a valid and common pattern** - many data-driven sites use "Static Site Generation with Periodic Rebuilds" to get fresh data without needing a server.

---

**Your setup is perfect for this approach!** 🚀

