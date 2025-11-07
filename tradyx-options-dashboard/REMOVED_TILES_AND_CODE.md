# Removed Tiles and Supporting Code

## Tiles Removed from Dashboard

The following tiles have been completely removed from the UI:

1. ✅ **PCR (Put-Call Ratio)** - Tile removed
2. ✅ **Max Pain** - Tile removed  
3. ✅ **OI Momentum** - Tile removed
4. ✅ **Expected Move** - Tile removed
5. ✅ **Straddle Cost** - Tile removed
6. ✅ **Quick Stats** (Total Call OI / Total Put OI) - Tile removed
7. ✅ **FII/DII Flow** - Tile removed (previously)
8. ✅ **Gamma Exposure Heatmap** - Tile removed (previously)
9. ✅ **IV Skew / Smile** - Tile removed (previously)
10. ✅ **Whale Alerts** - Tile removed (previously)

## What Data/Code Can Be Removed

### ⚠️ IMPORTANT: Some data is still used by other features!

**DO NOT REMOVE these calculations** - they're used by other tiles:
- **PCR** - Still used in MMI (Market Mood Index) calculation
- **Max Pain** - Still used in "Max Pain Magnet" tile calculation
- **Straddle** - Still used in "Expected Move" calculation (if needed elsewhere)

### ✅ Safe to Remove/Simplify

#### 1. From `compute_metrics.py`:

**Can be removed:**
- `calculate_oi_momentum()` function - No longer displayed
- `gamma_exposure()` function - No longer displayed
- `iv_skew()` function - No longer displayed
- `whale_alerts()` function - No longer displayed
- `top_oi()` function - Only used for OI momentum display

**Keep but can simplify:**
- `pcr_from_chain()` - Keep (used in MMI)
- `max_pain()` - Keep (used in Max Pain Magnet)
- `straddle_cost()` - Keep (might be used in predictions)

**Simplified `compute_metrics.py` would look like:**
```python
def main():
    chain = json.load(open("data/chain_raw.json", encoding="utf-8"))
    recs = chain["records"]["data"]
    spot = chain["records"]["underlyingValue"]
    
    # Get VIX for IV Rank
    try:
        yf_data = json.load(open("data/yf.json", encoding="utf-8"))
        vix = yf_data.get("vix")
        vix_52w_high = yf_data.get("vix52wHigh")
        vix_52w_low = yf_data.get("vix52wLow")
    except:
        vix = None
        vix_52w_high = None
        vix_52w_low = None

    max_pain_val = max_pain(recs)
    atm_strike_val = atm_strike(spot, recs)
    straddle = straddle_cost(atm_strike_val, recs)

    out = {
      "spot": spot,
      "pcr": pcr_from_chain(recs),  # Keep for MMI
      "maxPain": max_pain_val,       # Keep for Max Pain Magnet
      "atmStrike": atm_strike_val,
      "straddle": straddle,          # Keep if needed
      "ivRank": calculate_iv_rank(vix, vix_52w_high, vix_52w_low),
      "magnetPct": calculate_magnet_pct(spot, max_pain_val),
    }
    json.dump(out, open("data/metrics.json", "w", encoding="utf-8"), indent=2)
```

#### 2. From `build_dashboard_json.py`:

**Can be removed from output:**
- `gammaExposure` - No longer displayed
- `ivSkew` - No longer displayed
- `whaleAlerts` - No longer displayed
- `oi.momentum` - No longer displayed
- `oi.callsTop` / `oi.putsTop` - Only used for OI momentum (can remove if not needed)

**Keep:**
- `pcr` - Used in MMI
- `maxPain` - Used in Max Pain Magnet
- `straddle` - Might be needed
- `ivRank` - Still displayed
- `magnetPct` - Still displayed

#### 3. From `useDashboard.ts` (TypeScript):

**Can be removed from types:**
- `gammaExposure` field
- `ivSkew` field
- `whaleAlerts` field
- `oiMomentum` field (if not used elsewhere)
- `totals.callOI`, `totals.putOI`, `totals.cpRatio` - No longer displayed

**Keep:**
- `pcr` - Used in MMI calculation
- `maxPain` - Used in Max Pain Magnet
- `straddle` - Might be needed
- `ivRank` - Still displayed
- `magnetPct` - Still displayed

#### 4. From `OptionsDashboard.tsx`:

**Already removed:**
- `BarGraph` component
- `getSentiment()` function
- `weightedPCR` usage
- All tile components listed above

## Current Dashboard Layout

After removals, the dashboard now shows:

### Main Area:
1. **Spot Price** (with sparkline)
2. **India VIX** (with sparkline)
3. **IV Rank** (single tile)
4. **Max Pain Magnet** (single tile)
5. **Expiry Countdowns** (4 tiles)
6. **Advertisement Slot** (728x90)
7. **Prediction Models** (4 gauges in 2x2 grid)

### Sidebar:
1. **Market Mood Gauge** (MMI)
2. **Market Sentiment** (MMI-based)
3. **Risk Zones Legend**
4. **Ad Sidebar** (2 slots)

## Data Still Required

Even though tiles are removed, these calculations are still needed:

1. **PCR** - For MMI calculation (Market Mood Index)
2. **Max Pain** - For Max Pain Magnet tile
3. **Straddle** - Might be used in predictions
4. **IV Rank** - Still displayed
5. **Magnet %** - Still displayed

## Optional Cleanup

If you want to fully remove unused code:

1. **Remove from `compute_metrics.py`:**
   - `top_oi()` function
   - `calculate_oi_momentum()` function
   - `gamma_exposure()` function
   - `iv_skew()` function
   - `whale_alerts()` function

2. **Remove from `build_dashboard_json.py`:**
   - Remove `gammaExposure`, `ivSkew`, `whaleAlerts`, `oiMomentum` from output

3. **Remove from TypeScript types:**
   - Remove unused fields from `DashboardJson` type

4. **Keep minimal data:**
   - Only calculate what's needed for remaining tiles
   - PCR, Max Pain, Straddle, IV Rank, Magnet %

## Summary

**Removed Tiles:** 10 tiles
**Removed Components:** BarGraph, getSentiment, GammaHeatmap, IVSkewSmile, WhaleAlerts
**Data Still Needed:** PCR (for MMI), Max Pain (for Magnet), Straddle (optional), IV Rank, Magnet %

The dashboard is now streamlined with only essential metrics and prediction models.

