# Code Cleanup Guide - Removed Tiles

## Summary of Removed Tiles

The following tiles have been removed from the dashboard:
1. ✅ PCR (Put-Call Ratio)
2. ✅ Max Pain
3. ✅ OI Momentum
4. ✅ Expected Move
5. ✅ Straddle Cost
6. ✅ Quick Stats (Total Call/Put OI)
7. ✅ FII/DII Flow
8. ✅ Gamma Exposure Heatmap
9. ✅ IV Skew / Smile
10. ✅ Whale Alerts

## What Supporting Code Can Be Removed

### ⚠️ IMPORTANT NOTES

**DO NOT remove these calculations** - they're still used:
- **PCR** (`pcr_from_chain`) - Used in MMI calculation
- **Max Pain** (`max_pain`) - Used in Max Pain Magnet tile
- **Straddle** (`straddle_cost`) - May be used in predictions

### ✅ Safe to Remove from Python Scripts

#### From `compute_metrics.py`:

**Functions that can be removed:**
```python
# These functions are no longer needed:
- top_oi()  # Only used for OI momentum display
- calculate_oi_momentum()  # No longer displayed
- gamma_exposure()  # No longer displayed
- iv_skew()  # No longer displayed
- whale_alerts()  # No longer displayed
```

**Simplified `compute_metrics.py` should only include:**
```python
def main():
    # Load chain data
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

    # Calculate only what's needed
    out = {
      "spot": spot,
      "pcr": pcr_from_chain(recs),  # Keep for MMI
      "maxPain": max_pain(recs),     # Keep for Max Pain Magnet
      "atmStrike": atm_strike(spot, recs),
      "straddle": straddle_cost(atm_strike(spot, recs), recs),  # Keep if needed
      "ivRank": calculate_iv_rank(vix, vix_52w_high, vix_52w_low),
      "magnetPct": calculate_magnet_pct(spot, max_pain(recs)),
    }
    json.dump(out, open("data/metrics.json", "w", encoding="utf-8"), indent=2)
```

#### From `build_dashboard_json.py`:

**Can be removed from output:**
```python
# Remove these fields:
"gammaExposure": metrics.get("gammaExposure", []),  # Remove
"ivSkew": metrics.get("ivSkew", []),                # Remove
"whaleAlerts": metrics.get("whaleAlerts", []),      # Remove
"oiMomentum": metrics.get("oiMomentum"),            # Remove
"oi": metrics.get("oi", {}),                       # Remove if not needed
```

**Keep:**
```python
"pcr": metrics.get("pcr"),          # Used in MMI
"maxPain": metrics.get("maxPain"),  # Used in Max Pain Magnet
"straddle": metrics.get("straddle", {}),  # May be needed
"ivRank": metrics.get("ivRank"),
"magnetPct": metrics.get("magnetPct"),
```

#### From TypeScript Types (`useDashboard.ts`):

**Can be removed from `DashboardJson` type:**
```typescript
// Remove these optional fields:
whaleAlerts?: Array<...>;      // Remove
ivSkew?: Array<...>;           // Remove
gammaExposure?: Array<...>;    // Remove
oiMomentum?: number;           // Remove
totals?: {                     // Remove entire object
  callOI?: number;
  putOI?: number;
  cpRatio?: number;
};
topCalls?: Array<...>;         // Remove if not needed
topPuts?: Array<...>;          // Remove if not needed
oi?: {                         // Remove if not needed
  callsTop?: Array<...>;
  putsTop?: Array<...>;
};
```

**Keep:**
```typescript
pcr?: number;                  // Used in MMI
maxPain?: number;              // Used in Max Pain Magnet
straddle?: {                   // Keep if needed
  call: number;
  put: number;
  total: number;
  expMovePts: number;
};
ivRank?: number;               // Still displayed
magnetPct?: number;            // Still displayed
```

## Current Dashboard Layout

### Main Area:
1. **Spot Price** (with sparkline)
2. **India VIX** (with sparkline)
3. **IV Rank** (single tile)
4. **Max Pain Magnet** (single tile)
5. **Expiry Countdowns** (4 tiles)
6. **Advertisement Slot** (728x90)
7. **Prediction Models** (4 gauges: Parkinson Vol, Expected Move, Quantile Bands, ML Beta)

### Sidebar:
1. **Market Mood Gauge** (MMI)
2. **Market Sentiment** (MMI-based)
3. **Risk Zones Legend**
4. **Ad Sidebar** (2 slots)

## Data Flow After Cleanup

```
fetch_nse_chain.py → chain_raw.json
     ↓
compute_metrics.py → metrics.json (simplified: only PCR, Max Pain, Straddle, IV Rank, Magnet %)
     ↓
build_dashboard_json.py → dashboard.json (removed: gammaExposure, ivSkew, whaleAlerts, oiMomentum)
     ↓
Dashboard displays: Spot, VIX, IV Rank, Max Pain Magnet, Expiry, Predictions
```

## Optional: Full Cleanup Script

If you want to fully clean up `compute_metrics.py`, you can remove:

1. `top_oi()` function (lines ~12-26)
2. `calculate_oi_momentum()` function (lines ~201-208)
3. `gamma_exposure()` function (lines ~54-102)
4. `iv_skew()` function (lines ~104-142)
5. `whale_alerts()` function (lines ~144-183)

And simplify `main()` to only calculate:
- `pcr_from_chain()`
- `max_pain()`
- `atm_strike()`
- `straddle_cost()`
- `calculate_iv_rank()`
- `calculate_magnet_pct()`

## Files Modified

✅ **Already cleaned:**
- `OptionsDashboard.tsx` - Removed all tile components
- `useDashboard.ts` - Removed unused data transformations
- Removed `BarGraph` component
- Removed `getSentiment()` function

⏳ **Can be cleaned (optional):**
- `compute_metrics.py` - Remove unused functions
- `build_dashboard_json.py` - Remove unused fields from output
- TypeScript types - Remove unused field definitions

## Testing After Cleanup

After removing code, verify:
1. ✅ Dashboard loads without errors
2. ✅ IV Rank tile displays correctly
3. ✅ Max Pain Magnet tile displays correctly
4. ✅ Prediction Models tile displays correctly
5. ✅ MMI calculation still works (uses PCR)
6. ✅ No console errors

