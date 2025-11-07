# Data Source Priority

## Primary Data Source: yfinance

**All spot prices and VIX values come from yfinance (Yahoo Finance API), NOT from NSE chain data.**

### Why yfinance?
- Consistent data source for spot price and VIX
- Reliable historical data
- Standardized format
- Spot price: 25492 (from yfinance)

### Data Flow:

1. **`fetch_yf.py`** - Fetches NIFTY spot price and VIX from yfinance
   - Spot price: `^NSEI` (NIFTY 50)
   - VIX: `^INDIAVIX`
   - Output: `data/yf.json`

2. **`fetch_predictions.py`** - Fetches OHLC data from yfinance
   - Uses yfinance spot price for calculations
   - Output: `data/prediction_data.json`

3. **`compute_metrics.py`** - Uses yfinance spot price
   - **DOES NOT** use NSE chain `underlyingValue` for spot price
   - Only uses NSE chain data for option chain calculations (PCR, Max Pain, etc.)
   - Spot price comes from `yf.json` (yfinance)

4. **`build_dashboard_json.py`** - Uses yfinance spot and VIX
   - Primary source: `yf.json`
   - **DOES NOT** fall back to NSE chain spot

### NSE Chain Data Usage:

NSE chain data (`fetch_nse_chain.py`) is ONLY used for:
- Option chain data (strikes, OI, PCR)
- Max Pain calculation
- ATM strike calculation
- Straddle costs
- Gamma exposure
- IV Skew

**NSE chain spot price (`underlyingValue`) is NOT used anywhere in calculations.**

### Error Handling:

If yfinance data is not available:
- Scripts will fail with clear error messages
- **NO fallback to NSE chain spot price**
- User must run `fetch_yf.py` first

### Summary:

✅ **Use yfinance for:** Spot price, VIX, OHLC data, historical series  
✅ **Use NSE chain for:** Option chain data, OI, PCR, Max Pain  
❌ **DO NOT use:** NSE chain `underlyingValue` for spot price calculations

