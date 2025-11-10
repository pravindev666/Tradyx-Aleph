import json, os
from datetime import datetime, timezone

def read(path, fallback={}):
    try:
        with open(path) as f: return json.load(f)
    except Exception: return fallback

def main():
    yf = read("data/yf.json", {})
    metrics = read("data/metrics.json", {})
    meta = read("data/chain_meta.json", {})
    predictions = read("data/predictions.json", {})
    ml_predictions = read("data/ml_predictions.json", {})
    vol_indicators = read("data/volatility_indicators.json", {})
    pred_data = read("data/prediction_data.json", {})
    breadth_momentum = read("data/breadth_momentum.json", {})
    
    # Extract latest OHLC values for NIFTY
    ohlc_data = pred_data.get("ohlc", {})
    ohlc_latest = {}
    if ohlc_data:
        opens = ohlc_data.get("open", [])
        highs = ohlc_data.get("high", [])
        lows = ohlc_data.get("low", [])
        closes = ohlc_data.get("close", [])
        if opens and highs and lows and closes:
            current_close = closes[-1] if closes else None
            previous_close = closes[-2] if len(closes) >= 2 else None
            ohlc_latest = {
                "open": opens[-1] if opens else None,
                "high": highs[-1] if highs else None,
                "low": lows[-1] if lows else None,
                "close": current_close,
                "previousClose": previous_close,
                "changePct": ((current_close - previous_close) / previous_close * 100) if (current_close and previous_close and previous_close > 0) else None
            }
    
    # Extract VIX OHLC from yf data
    vix_ohlc = yf.get("vixOhlc", {})
    vix_change_pct = None
    if vix_ohlc.get("close") and vix_ohlc.get("previousClose"):
        vix_change_pct = ((vix_ohlc["close"] - vix_ohlc["previousClose"]) / vix_ohlc["previousClose"]) * 100
    
    # Ensure yfinance data is available (primary source)
    if not yf.get("spot"):
        print("[ERROR] yfinance spot price not found. Run fetch_yf.py first.")
        return
    
    out = {
      "updatedAt": datetime.now(timezone.utc).isoformat(),  # Always use current timestamp
      "spot": yf.get("spot"),  # Use yfinance spot price (primary source - do not use NSE chain spot)
      "vix": yf.get("vix"),  # Use yfinance VIX (primary source)
      "spotSeries": yf.get("spotSeries", []),
      "vixSeries": yf.get("vixSeries", []),
      "pcr": metrics.get("pcr"),
      "maxPain": metrics.get("maxPain"),
      "atmStrike": metrics.get("atmStrike"),
      "oi": metrics.get("oi", {}),
      "straddle": metrics.get("straddle", {}),
      "gammaExposure": metrics.get("gammaExposure", []),
      "ivSkew": metrics.get("ivSkew", []),
      "whaleAlerts": metrics.get("whaleAlerts", []),
      "ivRank": metrics.get("ivRank"),
      "magnetPct": metrics.get("magnetPct"),
      "oiMomentum": metrics.get("oiMomentum"),
      "predictions": predictions,
      "mlPredictions": ml_predictions,
      "volatilityIndicators": vol_indicators,
      "ohlc": ohlc_latest,
      "vixOhlc": vix_ohlc,
      "spotChangePct": ohlc_latest.get("changePct"),
      "vixChangePct": vix_change_pct,
      "driftDirection": breadth_momentum.get("driftDirection"),
      "momentumStrength": breadth_momentum.get("momentumStrength", {}).get("scaled") if isinstance(breadth_momentum.get("momentumStrength"), dict) else breadth_momentum.get("momentumStrength"),
      # VRP Slope is included in volatilityIndicators, but also extract for direct access if needed
      "vrpSlope": vol_indicators.get("vrpSlope")
    }
    # Write to both locations: scripts/data for processing and public/data for Next.js
    os.makedirs("data", exist_ok=True)
    public_data_dir = os.path.join("..", "public", "data")
    os.makedirs(public_data_dir, exist_ok=True)
    
    # Get absolute paths for better error messages
    data_file = os.path.abspath("data/dashboard.json")
    public_file = os.path.abspath(os.path.join(public_data_dir, "dashboard.json"))
    
    try:
        # Write to scripts/data
        with open("data/dashboard.json", "w", encoding="utf-8") as f:
            json.dump(out, f, indent=2)
        print(f"[OK] Saved to: {data_file}")
        
        # Write to public/data (for Next.js)
        with open(os.path.join(public_data_dir, "dashboard.json"), "w", encoding="utf-8") as f:
            json.dump(out, f, indent=2)
        print(f"[OK] Saved to: {public_file}")
        
        # Verify files were written
        if not os.path.exists("data/dashboard.json"):
            print(f"[ERROR] File not found after write: {data_file}")
            return
        if not os.path.exists(os.path.join(public_data_dir, "dashboard.json")):
            print(f"[ERROR] File not found after write: {public_file}")
            return
        
        # Get file sizes
        data_size = os.path.getsize("data/dashboard.json")
        public_size = os.path.getsize(os.path.join(public_data_dir, "dashboard.json"))
        
        print(f"[OK] Dashboard JSON built successfully")
        print(f"  - data/dashboard.json: {data_size} bytes")
        print(f"  - public/data/dashboard.json: {public_size} bytes")
        print(f"  - updatedAt: {out.get('updatedAt', 'MISSING')}")
        print(f"  - spot: {out.get('spot', 'MISSING')}, vix: {out.get('vix', 'MISSING')}")
        print(f"  - Volatility Indicators: {'[OK]' if vol_indicators else '[MISSING]'}")
        print(f"  - Predictions: {'[OK]' if predictions else '[MISSING]'}")
        
    except Exception as e:
        print(f"[ERROR] Failed to write dashboard.json: {e}")
        import traceback
        traceback.print_exc()
        return
if __name__ == "__main__":
    main()