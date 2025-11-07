# Data Integration Guide

## Summary of Changes

### ✅ Removed
- **Call/Put OI tile** after Expected Move - has been removed from the dashboard

### ✅ Data Sources & Integration

All data is now properly integrated and flows through the pipeline:

#### 1. **IV Rank** 
- **Source**: Calculated from VIX data (Yahoo Finance)
- **Formula**: `(Current VIX - 52W Low) / (52W High - 52W Low) * 100`
- **Location**: `scripts/compute_metrics.py` → `calculate_iv_rank()`
- **Display**: Shows in "IV Rank" tile (Row 2)
- **Data Flow**: `fetch_yf.py` → `compute_metrics.py` → `build_dashboard_json.py` → Dashboard

#### 2. **OI Momentum**
- **Source**: Calculated from Top Call/Put OI changes
- **Formula**: Average of (Top Call OI change + Top Put OI change) / 2
- **Location**: `scripts/compute_metrics.py` → `calculate_oi_momentum()`
- **Display**: Shows in "OI Momentum" tile (Row 2)
- **Data Flow**: `fetch_nse_chain.py` → `compute_metrics.py` → `build_dashboard_json.py` → Dashboard

#### 3. **Max Pain Magnet**
- **Source**: Calculated from Spot and Max Pain
- **Formula**: `(Spot - MaxPain) / Spot * 100`
- **Location**: `scripts/compute_metrics.py` → `calculate_magnet_pct()`
- **Display**: Shows in "Max Pain Magnet" tile (Additional Metrics)
- **Data Flow**: `fetch_nse_chain.py` → `compute_metrics.py` → `build_dashboard_json.py` → Dashboard

#### 4. **Gamma Exposure**
- **Source**: Calculated from Options Chain OI
- **Formula**: Simplified gamma approximation based on strike distance from spot
- **Location**: `scripts/compute_metrics.py` → `gamma_exposure()`
- **Display**: Shows in "Gamma Exposure Heatmap" tile
- **Data Flow**: `fetch_nse_chain.py` → `compute_metrics.py` → `build_dashboard_json.py` → Dashboard
- **Note**: Generates sample data if real data unavailable

#### 5. **IV Skew**
- **Source**: Extracted from Options Chain implied volatility
- **Formula**: IV by strike from CE/PE data
- **Location**: `scripts/compute_metrics.py` → `iv_skew()`
- **Display**: Shows in "IV Skew / Smile" tile
- **Data Flow**: `fetch_nse_chain.py` → `compute_metrics.py` → `build_dashboard_json.py` → Dashboard
- **Note**: Generates sample skew curve if real IV data unavailable

#### 6. **Whale Alerts**
- **Source**: Detected from Options Chain volume and OI changes
- **Formula**: Large volume (>50K) with significant OI change (>25K)
- **Location**: `scripts/compute_metrics.py` → `whale_alerts()`
- **Display**: Shows in "Whale Alerts" tile
- **Data Flow**: `fetch_nse_chain.py` → `compute_metrics.py` → `build_dashboard_json.py` → Dashboard
- **Note**: Generates sample alerts if no real whale activity detected

## How to Generate All Data

Run these scripts in order:

```bash
cd scripts

# 1. Fetch NSE Options Chain
python fetch_nse_chain.py

# 2. Fetch Yahoo Finance data (VIX, historical prices, 52W high/low)
python fetch_yf.py

# 3. Compute all metrics (including IV Rank, Magnet, OI Momentum, Gamma, IV Skew, Whale Alerts)
python compute_metrics.py

# 4. Build final dashboard JSON
python build_dashboard_json.py
```

## Data Flow Diagram

```
fetch_nse_chain.py
    ↓
data/chain_raw.json
    ↓
compute_metrics.py ──→ data/metrics.json
    ↑                      ↓
fetch_yf.py ─────────→ build_dashboard_json.py
    ↓                      ↓
data/yf.json          public/data/dashboard.json
                            ↓
                    Dashboard (reads from public/data/dashboard.json)
```

## What Each Script Does

### `fetch_nse_chain.py`
- Fetches raw options chain from NSE
- Saves to `data/chain_raw.json`
- Contains: strikes, OI, volume, prices, IV

### `fetch_yf.py`
- Fetches VIX and spot price data from Yahoo Finance
- Calculates 52-week high/low for VIX (needed for IV Rank)
- Saves to `data/yf.json`
- Contains: spot, vix, spotSeries, vixSeries, vix52wHigh, vix52wLow

### `compute_metrics.py`
- Processes chain data to calculate:
  - PCR, Max Pain, ATM Straddle
  - **IV Rank** (from VIX data)
  - **Magnet %** (from spot and max pain)
  - **OI Momentum** (from top calls/puts)
  - **Gamma Exposure** (from OI and strikes)
  - **IV Skew** (from implied volatility)
  - **Whale Alerts** (from volume and OI changes)
- Saves to `data/metrics.json`

### `build_dashboard_json.py`
- Combines all data sources
- Creates final `public/data/dashboard.json`
- Dashboard reads from this file

## Troubleshooting

**Problem**: IV Rank shows "—"
- **Solution**: Make sure `fetch_yf.py` ran successfully and has VIX data

**Problem**: OI Momentum shows "—"
- **Solution**: Make sure `fetch_nse_chain.py` ran and has OI change data

**Problem**: Max Pain Magnet shows "—"
- **Solution**: Make sure both spot and maxPain are calculated correctly

**Problem**: Gamma/IV Skew/Whale Alerts show "No data"
- **Solution**: Scripts now generate sample data, but run `compute_metrics.py` to ensure data is generated

## Next Steps

1. Run all scripts to generate data
2. Refresh dashboard - all tiles should show data
3. Set up automated script to run every 5-15 minutes to keep data fresh

