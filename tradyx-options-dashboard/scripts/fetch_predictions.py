"""
Enhanced data fetcher for volatility prediction models
Collects: OHLC, Returns, Sector data for all prediction models
"""
import yfinance as yf
import json
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone

# Sector index symbols
SECTOR_SYMBOLS = {
    "BANKNIFTY": "^NSEBANK",
    "FINNIFTY": "NIFTY_FIN_SERVICE.NS",
    "IT": "^CNXIT",
    "PHARMA": "^CNXPHARMA",
    "AUTO": "^CNXAUTO",
    "METAL": "^CNXMETAL",
    "FMCG": "^CNXFMCG",
    "ENERGY": "^CNXENERGY"
}

def fetch_ohlc(symbol, period="2y", interval="1d"):  # Changed to 2y for more historical data
    """Fetch OHLC data with error handling"""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval, auto_adjust=False)
        
        if hist.empty:
            print(f"[WARN] No data for {symbol}")
            return None
        
        # Clean data
        hist = hist[['Open', 'High', 'Low', 'Close', 'Volume']].copy()
        hist.columns = ['open', 'high', 'low', 'close', 'volume']
        
        return hist
    except Exception as e:
        print(f"[ERROR] Error fetching {symbol}: {e}")
        return None

def calculate_returns(prices):
    """Calculate percentage returns from price series"""
    if len(prices) < 2:
        return []
    
    returns = []
    for i in range(1, len(prices)):
        ret = (prices[i] - prices[i-1]) / prices[i-1] * 100
        returns.append(ret)
    
    return returns

def main():
    """Main execution"""
    Path("data").mkdir(exist_ok=True)
    
    print("=" * 70)
    print("Fetching Data for Prediction Models")
    print("=" * 70)
    
    # 1. Fetch NIFTY OHLC (2 years for ML models)
    print("\n1. Fetching NIFTY OHLC data...")
    nifty_hist = fetch_ohlc("^NSEI", period="2y", interval="1d")
    
    if nifty_hist is None or nifty_hist.empty:
        print("[ERROR] Failed to fetch NIFTY data")
        return
    
    print(f"[OK] Fetched {len(nifty_hist)} days of NIFTY data")
    
    # 2. Fetch VIX data
    print("\n2. Fetching VIX data...")
    vix_hist = fetch_ohlc("^INDIAVIX", period="2y", interval="1d")
    
    if vix_hist is None or vix_hist.empty:
        print("[WARN] VIX data unavailable, using default")
        vix_current = 15.0
        vix_series = [15.0] * 60
    else:
        vix_current = float(vix_hist['close'].iloc[-1])
        vix_series = vix_hist['close'].tolist()
        print(f"[OK] Current VIX: {vix_current:.2f}")
    
    # 3. Fetch Sector indices
    print("\n3. Fetching Sector indices...")
    sectors_data = {}
    
    for name, symbol in SECTOR_SYMBOLS.items():
        print(f"   Fetching {name}...", end=" ")
        hist = fetch_ohlc(symbol, period="2y", interval="1d")
        
        if hist is not None and not hist.empty:
            sectors_data[name] = hist
            print(f"[OK] ({len(hist)} days)")
        else:
            print("[FAILED]")
    
    print(f"\n[OK] Successfully fetched {len(sectors_data)}/{len(SECTOR_SYMBOLS)} sector indices")
    
    # 4. Calculate returns
    print("\n4. Calculating returns...")
    
    nifty_returns = calculate_returns(nifty_hist['close'].values)
    print(f"[OK] NIFTY returns: {len(nifty_returns)} days")
    
    sector_returns = {}
    for name, hist in sectors_data.items():
        returns = calculate_returns(hist['close'].values)
        sector_returns[name] = returns
    
    # 5. Extract key metrics
    spot = float(nifty_hist['close'].iloc[-1])
    highs = nifty_hist['high'].values
    lows = nifty_hist['low'].values
    
    print(f"\n[OK] Current Spot: Rs {spot:,.2f}")
    print(f"[OK] Data range: {nifty_hist.index[0].date()} to {nifty_hist.index[-1].date()}")
    
    # 6. Prepare output
    output = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "spot": spot,
        "vix": vix_current,
        
        # OHLC data (for Parkinson volatility)
        "ohlc": {
            "dates": [str(d.date()) for d in nifty_hist.index],
            "open": nifty_hist['open'].tolist(),
            "high": highs.tolist(),
            "low": lows.tolist(),
            "close": nifty_hist['close'].tolist(),
            "volume": nifty_hist['volume'].tolist()
        },
        
        # Returns (for Quantile bands & Beta)
        "returns": {
            "nifty": nifty_returns,
            "dates": [str(d.date()) for d in nifty_hist.index[1:]]  # Returns start from 2nd day
        },
        
        # VIX data
        "vix_series": vix_series,
        
        # Sector data (for Beta calculation)
        "sectors": {}
    }
    
    # Add sector data
    for name, hist in sectors_data.items():
        output["sectors"][name] = {
            "close": hist['close'].tolist(),
            "returns": sector_returns[name],
            "current": float(hist['close'].iloc[-1])
        }
    
    # Save full data
    with open("data/prediction_data.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)
    
    print(f"\n[OK] Data saved to data/prediction_data.json")
    
    # Print summary
    print("\n" + "=" * 70)
    print("Data Summary")
    print("=" * 70)
    print(f"Spot Price: Rs {output['spot']:,.2f}")
    print(f"VIX: {output['vix']:.2f}")
    print(f"OHLC Days: {len(output['ohlc']['dates'])}")
    print(f"Returns Days: {len(output['returns']['nifty'])}")
    print(f"Sectors Available: {len(output['sectors'])}")
    
    if output['sectors']:
        print("\nSector Details:")
        for name, sector in output['sectors'].items():
            print(f"  {name:12s}: Rs {sector['current']:,.2f}")
    
    print("=" * 70)

if __name__ == "__main__":
    main()

