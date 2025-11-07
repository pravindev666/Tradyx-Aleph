# Data Verification Guide

## Quick Check: Is Data Flowing to Dashboard?

### Step 1: Run All Data Fetch Scripts
```bash
cd scripts
python fetch_nse_chain.py
python fetch_yf.py
python fetch_fii_dii.py
python compute_metrics.py
python build_dashboard_json.py
```

### Step 2: Verify Files Exist
Check these files exist and have recent timestamps:
- `scripts/data/chain_raw.json` - Should have ~788 strikes
- `scripts/data/yf.json` - Should have spot/vix series
- `scripts/data/fii_dii.json` - Should have fiiNet/diiNet
- `scripts/data/metrics.json` - Should have PCR, maxPain, etc.
- `public/data/dashboard.json` - **THIS IS THE KEY FILE** - Dashboard reads from here

### Step 3: Check Dashboard JSON Contains All Fields
Open `public/data/dashboard.json` and verify it has:
- `spot`, `vix`, `pcr`, `maxPain`
- `fiiNet`, `diiNet`, `netFlow` (FII/DII data)
- `gammaExposure`, `ivSkew`, `whaleAlerts` (arrays)
- `ivRank`, `magnetPct`, `oiMomentum`

### Step 4: Check Browser Console
1. Open dashboard in browser
2. Open Developer Tools (F12)
3. Check Console tab
4. Look for: `✅ Dashboard data loaded successfully:`
5. Verify it shows `fiiNet` and `diiNet` values

### Step 5: Hard Refresh Dashboard
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or click the Refresh button in the dashboard header
- This forces a fresh fetch of `dashboard.json`

## Common Issues

### Issue: Data shows "—" or 0
**Solution**: 
1. Check `public/data/dashboard.json` exists and is recent
2. Check browser console for errors
3. Verify the JSON structure matches what the hook expects

### Issue: FII/DII shows 0.0
**Solution**:
1. Run `python fetch_fii_dii.py` again
2. Check `scripts/data/fii_dii.json` has real values
3. Run `python build_dashboard_json.py` to rebuild
4. Hard refresh the dashboard

### Issue: Old data showing
**Solution**:
1. Clear browser cache
2. Check `public/data/dashboard.json` timestamp
3. The dashboard uses cache-busting, but browser may cache the file

## Data Flow Diagram

```
fetch_nse_chain.py  →  scripts/data/chain_raw.json
fetch_yf.py         →  scripts/data/yf.json
fetch_fii_dii.py    →  scripts/data/fii_dii.json
                     ↓
compute_metrics.py  →  scripts/data/metrics.json
                     ↓
build_dashboard_json.py  →  public/data/dashboard.json  ←  Dashboard reads from here
```

## Quick Test Command

```bash
# Run all scripts in sequence
cd scripts
python fetch_nse_chain.py && python fetch_yf.py && python fetch_fii_dii.py && python compute_metrics.py && python build_dashboard_json.py
```

Then check `public/data/dashboard.json` exists and has recent `updatedAt` timestamp.

