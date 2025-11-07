"""
Calculate Momentum Strength and Drift Direction Indicator
"""
import json
import math
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone

def read(path, fallback={}):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return fallback

def calculate_drift_direction(closes):
    """
    Drift Direction = sign of (EMA20 − EMA50)
    
    Positive = Bullish drift (EMA20 > EMA50)
    Negative = Bearish drift (EMA20 < EMA50)
    """
    if not closes or len(closes) < 50:
        return None
    
    try:
        # Convert to pandas Series for EMA calculation
        series = pd.Series(closes)
        
        # Calculate EMAs
        ema20 = series.ewm(span=20, adjust=False).mean().iloc[-1]
        ema50 = series.ewm(span=50, adjust=False).mean().iloc[-1]
        
        # Drift = EMA20 - EMA50
        drift = float(ema20 - ema50)
        
        return round(drift, 2)
    except Exception as e:
        print(f"   Error calculating drift direction: {e}")
        import traceback
        traceback.print_exc()
        return None

def calculate_momentum_strength(closes):
    """
    Momentum Strength = (Perf(6M) + Perf(3M) + Perf(9M)) / (Vol(3M) + Vol(1M))
    
    Where:
    - Perf(NM) = (Price_today - Price_N_months_ago) / Price_N_months_ago
    - Vol(NM) = Standard deviation of returns over N months
    """
    if not closes or len(closes) < 30:
        return None
    
    try:
        # Approximate trading days per month = 21
        days_1m = 21
        days_3m = 63
        days_6m = 126
        days_9m = 189
        
        current_price = closes[-1]
        
        # Calculate performances
        perf_6m = None
        perf_3m = None
        perf_9m = None
        
        if len(closes) >= days_6m + 1:
            price_6m_ago = closes[-(days_6m + 1)]
            if price_6m_ago > 0:
                perf_6m = ((current_price - price_6m_ago) / price_6m_ago) * 100
        elif len(closes) >= days_3m + 1:
            # Use available data
            price_6m_ago = closes[0]
            if price_6m_ago > 0:
                perf_6m = ((current_price - price_6m_ago) / price_6m_ago) * 100
        
        if len(closes) >= days_3m + 1:
            price_3m_ago = closes[-(days_3m + 1)]
            if price_3m_ago > 0:
                perf_3m = ((current_price - price_3m_ago) / price_3m_ago) * 100
        
        if len(closes) >= days_9m + 1:
            price_9m_ago = closes[-(days_9m + 1)]
            if price_9m_ago > 0:
                perf_9m = ((current_price - price_9m_ago) / price_9m_ago) * 100
        elif len(closes) >= days_6m + 1:
            # Use available data
            price_9m_ago = closes[0]
            if price_9m_ago > 0:
                perf_9m = ((current_price - price_9m_ago) / price_9m_ago) * 100
        
        # Calculate volatilities (standard deviation of returns)
        def calculate_volatility(prices, days):
            if len(prices) < days + 1:
                return None
            
            returns = []
            for i in range(len(prices) - days, len(prices)):
                if i > 0 and prices[i-1] > 0:
                    ret = (prices[i] - prices[i-1]) / prices[i-1]
                    returns.append(ret)
            
            if len(returns) < 2:
                return None
            
            mean_ret = sum(returns) / len(returns)
            variance = sum((r - mean_ret) ** 2 for r in returns) / len(returns)
            std_dev = math.sqrt(variance)
            
            # Annualize: √252 × std_dev
            vol = std_dev * math.sqrt(252) * 100  # Convert to percentage
            return vol
        
        vol_3m = calculate_volatility(closes, min(days_3m, len(closes) - 1))
        vol_1m = calculate_volatility(closes, min(days_1m, len(closes) - 1))
        
        # Calculate numerator and denominator
        numerator = 0
        perf_count = 0
        
        if perf_6m is not None:
            numerator += perf_6m
            perf_count += 1
        if perf_3m is not None:
            numerator += perf_3m
            perf_count += 1
        if perf_9m is not None:
            numerator += perf_9m
            perf_count += 1
        
        if perf_count == 0 or vol_3m is None or vol_1m is None:
            return None
        
        denominator = vol_3m + vol_1m
        
        if denominator == 0:
            return None
        
        momentum_strength = numerator / denominator
        
        # Scale to 0-100 for display
        # Typical range: -2 to +2, so we scale: (value + 2) / 4 * 100
        scaled_ms = ((momentum_strength + 2) / 4) * 100
        scaled_ms = max(0, min(100, scaled_ms))  # Clamp to 0-100
        
        return {
            "raw": round(momentum_strength, 4),
            "scaled": round(scaled_ms, 1)
        }
    except Exception as e:
        print(f"Error calculating momentum strength: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    Path("data").mkdir(exist_ok=True)
    
    print("=" * 70)
    print("Calculating Momentum Strength and Drift Direction")
    print("=" * 70)
    
    # Read prediction data (has OHLC data)
    pred_data = read("data/prediction_data.json", {})
    
    if not pred_data:
        print("[ERROR] No prediction data found. Run fetch_predictions.py first.")
        return
    
    closes = pred_data.get("ohlc", {}).get("close", [])
    
    if not closes or len(closes) < 50:
        print("[ERROR] Insufficient OHLC data (need at least 50 days)")
        return
    
    # Calculate Drift Direction
    print("\n1. Calculating Drift Direction Indicator...")
    drift = calculate_drift_direction(closes)
    if drift is not None:
        direction = "Bullish" if drift > 0 else "Bearish" if drift < 0 else "Neutral"
        print(f"   Drift: {drift:+.2f} ({direction})")
        print(f"   EMA20 - EMA50 = {drift:.2f}")
    else:
        print("   Drift Direction: N/A")
    
    # Calculate Momentum Strength
    print("\n2. Calculating Momentum Strength...")
    momentum = calculate_momentum_strength(closes)
    if momentum:
        print(f"   Momentum Strength (raw): {momentum['raw']}")
        print(f"   Momentum Strength (scaled 0-100): {momentum['scaled']}")
    else:
        print("   Momentum Strength: N/A")
    
    # Save results with current timestamp
    output = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "driftDirection": drift,
        "momentumStrength": momentum
    }
    
    with open("data/breadth_momentum.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)
    
    print("\n" + "=" * 70)
    print("[OK] Momentum Strength and Drift Direction calculated")
    print(f"  Saved to data/breadth_momentum.json")
    print("=" * 70)

if __name__ == "__main__":
    main()

