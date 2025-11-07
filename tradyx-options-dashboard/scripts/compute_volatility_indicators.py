"""
Calculate 10 Volatility Indicators
Inputs: NIFTY OHLC + VIX
"""
import json
import math
import numpy as np
from pathlib import Path
from datetime import datetime, timezone

def read(path, fallback={}):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return fallback

def calculate_realized_volatility(closes, window=20):
    """1. Realized Volatility (RV): √252 × stdev(ln(Pₜ/Pₜ₋₁), N=20)"""
    if len(closes) < window + 1:
        return None
    
    try:
        # Calculate log returns
        log_returns = []
        for i in range(1, len(closes)):
            if closes[i-1] > 0 and closes[i] > 0:
                log_ret = math.log(closes[i] / closes[i-1])
                log_returns.append(log_ret)
        
        if len(log_returns) < window:
            return None
        
        # Use last N returns
        recent_returns = log_returns[-window:]
        
        # Calculate standard deviation
        mean_ret = np.mean(recent_returns)
        variance = np.mean([(r - mean_ret) ** 2 for r in recent_returns])
        std_dev = math.sqrt(variance)
        
        # Annualize: √252 × std_dev
        rv = std_dev * math.sqrt(252) * 100  # Convert to percentage
        
        return round(rv, 2)
    except Exception as e:
        print(f"Error calculating RV: {e}")
        return None

def calculate_hv_iv_spread(rv, vix):
    """2. HV–IV Spread: VIX – RV"""
    if rv is None or vix is None:
        return None
    return round(vix - rv, 2)

def calculate_volatility_ratio(rv, vix):
    """3. Volatility Ratio (VR): RV / VIX"""
    if rv is None or vix is None or vix == 0:
        return None
    return round(rv / vix, 3)

def calculate_parkinson_volatility(highs, lows, window=20):
    """4. Parkinson Volatility: √(1/4ln2 × mean(ln(H/L)²))"""
    if len(highs) < window or len(lows) < window:
        return None
    
    try:
        # Use last N days
        recent_highs = highs[-window:]
        recent_lows = lows[-window:]
        
        # Calculate ln(H/L)²
        log_hl_sq = []
        for h, l in zip(recent_highs, recent_lows):
            if h > 0 and l > 0 and h >= l:
                log_hl = math.log(h / l)
                log_hl_sq.append(log_hl ** 2)
        
        if len(log_hl_sq) < window:
            return None
        
        # Parkinson formula
        variance = (1 / (4 * math.log(2))) * np.mean(log_hl_sq)
        volatility = math.sqrt(variance)
        
        # Annualize
        annualized = volatility * math.sqrt(252) * 100
        
        return round(annualized, 2)
    except Exception as e:
        print(f"Error calculating Parkinson Vol: {e}")
        return None

def calculate_expected_move_1day(spot, vix):
    """5. Expected Move (1-Day): Spot × (VIX/100) × √(1/365)"""
    if not spot or not vix or spot <= 0:
        return None
    try:
        em = spot * (vix / 100) * math.sqrt(1 / 365)
        return round(em, 2)
    except Exception:
        return None

def calculate_vix_nifty_correlation(vix_series, nifty_returns, window=30):
    """6. VIX–NIFTY Correlation: corr(ΔVIX, ΔNIFTY)"""
    if len(vix_series) < window + 1 or len(nifty_returns) < window:
        return None
    
    try:
        # Calculate VIX changes
        vix_changes = []
        for i in range(1, len(vix_series)):
            if vix_series[i-1] > 0:
                vix_change = (vix_series[i] - vix_series[i-1]) / vix_series[i-1]
                vix_changes.append(vix_change)
        
        # Align with NIFTY returns (both should have same length)
        min_len = min(len(vix_changes), len(nifty_returns), window)
        if min_len < 10:
            return None
        
        recent_vix_changes = vix_changes[-min_len:]
        recent_nifty_returns = nifty_returns[-min_len:]
        
        # Calculate correlation
        correlation = np.corrcoef(recent_vix_changes, recent_nifty_returns)[0, 1]
        
        if np.isnan(correlation):
            return None
        
        return round(correlation, 3)
    except Exception as e:
        print(f"Error calculating correlation: {e}")
        return None

def calculate_trend_consistency_index(closes, window=20):
    """7. Trend Consistency Index: #positive closes / 20 days"""
    if len(closes) < window:
        return None
    
    try:
        recent_closes = closes[-window:]
        positive_closes = sum(1 for i in range(1, len(recent_closes)) 
                            if recent_closes[i] > recent_closes[i-1])
        
        tci = positive_closes / (window - 1)
        return round(tci, 3)
    except Exception:
        return None

def calculate_return_quantile_position(returns, window=30):
    """8. Return Quantile Position: percentile(current return, last 30d)"""
    if len(returns) < window:
        return None
    
    try:
        recent_returns = returns[-window:]
        if len(recent_returns) == 0:
            return None
        
        # Current return (last one)
        current_return = recent_returns[-1]
        
        # Calculate percentile
        sorted_returns = sorted(recent_returns)
        rank = sum(1 for r in sorted_returns if r <= current_return)
        percentile = (rank / len(sorted_returns)) * 100
        
        return round(percentile, 1)
    except Exception:
        return None

def calculate_volatility_regime(vix, rv):
    """9. Volatility Regime Classifier: z(VIX), z(RV) → {Calm, Normal, Stress}"""
    if vix is None or rv is None:
        return None
    
    # Simple classification based on thresholds
    # Calm: VIX < 13, RV < 15
    # Stress: VIX > 20 or RV > 25
    # Normal: otherwise
    
    if vix < 13 and rv < 15:
        return "Calm"
    elif vix > 20 or rv > 25:
        return "Stress"
    else:
        return "Normal"

def calculate_range_compression_index(parkinson_vol_20d, parkinson_vol_60d_avg):
    """10. Range Compression Index: Parkinson(20d) / Parkinson(60d avg)"""
    if parkinson_vol_20d is None or parkinson_vol_60d_avg is None or parkinson_vol_60d_avg == 0:
        return None
    return round(parkinson_vol_20d / parkinson_vol_60d_avg, 3)

def calculate_volatility_risk_premium(vix, rv):
    """11. Volatility Risk Premium: VIX² - RV²"""
    if vix is None or rv is None:
        return None
    try:
        # Convert percentages to decimals for calculation
        vix_decimal = vix / 100
        rv_decimal = rv / 100
        vrp = (vix_decimal ** 2) - (rv_decimal ** 2)
        return round(vrp, 4)
    except Exception:
        return None

def calculate_vrp_slope(vix_series, closes, window=5):
    """12. VRP Slope: (VRP_t - VRP_t-5) / |VRP_t-5|"""
    if not vix_series or not closes or len(vix_series) < window + 1 or len(closes) < window + 1:
        return None
    
    try:
        # Need at least window+1 days of data
        if len(vix_series) < window + 1 or len(closes) < window + 1:
            return None
        
        # Calculate VRP for current day (t)
        vix_t = vix_series[-1]
        rv_t = calculate_realized_volatility(closes, window=20)
        vrp_t = calculate_volatility_risk_premium(vix_t, rv_t)
        
        # Calculate VRP for 5 days ago (t-5)
        if len(vix_series) < window + 1 or len(closes) < window + 1:
            return None
        
        vix_t_minus_5 = vix_series[-(window + 1)]
        # For RV 5 days ago, use closes up to that point
        closes_t_minus_5 = closes[:-(window)]
        if len(closes_t_minus_5) < 20:
            # Use available data if less than 20 days
            rv_t_minus_5 = calculate_realized_volatility(closes_t_minus_5, window=min(20, len(closes_t_minus_5)))
        else:
            rv_t_minus_5 = calculate_realized_volatility(closes_t_minus_5, window=20)
        
        vrp_t_minus_5 = calculate_volatility_risk_premium(vix_t_minus_5, rv_t_minus_5)
        
        if vrp_t is None or vrp_t_minus_5 is None:
            return None
        
        if abs(vrp_t_minus_5) < 1e-6:  # Avoid division by zero
            return None
        
        # Calculate slope: (VRP_t - VRP_t-5) / |VRP_t-5|
        slope = (vrp_t - vrp_t_minus_5) / abs(vrp_t_minus_5)
        return round(slope, 4)
    except Exception as e:
        print(f"   Error calculating VRP slope: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    Path("data").mkdir(exist_ok=True)
    
    print("=" * 70)
    print("Calculating Volatility Indicators")
    print("=" * 70)
    
    # Read prediction data (has OHLC and returns)
    pred_data = read("data/prediction_data.json", {})
    
    if not pred_data:
        print("[ERROR] No prediction data found. Run fetch_predictions.py first.")
        return
    
    ohlc = pred_data.get("ohlc", {})
    returns = pred_data.get("returns", {})
    spot = pred_data.get("spot")  # From yfinance (primary source)
    vix = pred_data.get("vix")  # From yfinance (primary source)
    vix_series = pred_data.get("vix_series", [])
    
    closes = ohlc.get("close", [])
    highs = ohlc.get("high", [])
    lows = ohlc.get("low", [])
    nifty_returns = returns.get("nifty", [])
    
    if not closes or not spot or not vix:
        print("[ERROR] Insufficient data")
        return
    
    print(f"\n[OK] Data loaded: {len(closes)} days of OHLC, Spot: Rs {spot:,.2f}, VIX: {vix:.2f}%")
    
    # Calculate indicators
    indicators = {}
    
    # 1. Realized Volatility
    print("\n1. Calculating Realized Volatility...")
    rv = calculate_realized_volatility(closes, window=20)
    indicators["realizedVol"] = rv
    print(f"   RV: {rv}%" if rv else "   RV: N/A")
    
    # 2. HV–IV Spread
    print("\n2. Calculating HV–IV Spread...")
    hv_iv_spread = calculate_hv_iv_spread(rv, vix)
    indicators["hvIvSpread"] = hv_iv_spread
    print(f"   HV–IV Spread: {hv_iv_spread}" if hv_iv_spread is not None else "   HV–IV Spread: N/A")
    
    # 3. Volatility Ratio
    print("\n3. Calculating Volatility Ratio...")
    vr = calculate_volatility_ratio(rv, vix)
    indicators["volatilityRatio"] = vr
    print(f"   VR: {vr}" if vr else "   VR: N/A")
    
    # 4. Parkinson Volatility
    print("\n4. Calculating Parkinson Volatility...")
    parkinson_20d = calculate_parkinson_volatility(highs, lows, window=20)
    parkinson_60d = calculate_parkinson_volatility(highs, lows, window=60) if len(highs) >= 60 else None
    indicators["parkinsonVol20d"] = parkinson_20d
    indicators["parkinsonVol60d"] = parkinson_60d
    print(f"   Parkinson Vol (20d): {parkinson_20d}%" if parkinson_20d else "   Parkinson Vol (20d): N/A")
    
    # 5. Expected Move (1-Day)
    print("\n5. Calculating Expected Move...")
    em_1day = calculate_expected_move_1day(spot, vix)
    indicators["expectedMove1Day"] = em_1day
    print(f"   EM (1-Day): ±{em_1day} points" if em_1day else "   EM (1-Day): N/A")
    
    # 6. VIX–NIFTY Correlation
    print("\n6. Calculating VIX–NIFTY Correlation...")
    correlation = calculate_vix_nifty_correlation(vix_series, nifty_returns, window=30)
    indicators["vixNiftyCorrelation"] = correlation
    print(f"   Correlation: {correlation}" if correlation is not None else "   Correlation: N/A")
    
    # 7. Trend Consistency Index
    print("\n7. Calculating Trend Consistency Index...")
    tci = calculate_trend_consistency_index(closes, window=20)
    indicators["trendConsistencyIndex"] = tci
    print(f"   TCI: {tci}" if tci else "   TCI: N/A")
    
    # 8. Return Quantile Position
    print("\n8. Calculating Return Quantile Position...")
    qp = calculate_return_quantile_position(nifty_returns, window=30)
    indicators["returnQuantilePosition"] = qp
    print(f"   QP: {qp}%" if qp else "   QP: N/A")
    
    # 9. Volatility Regime
    print("\n9. Calculating Volatility Regime...")
    regime = calculate_volatility_regime(vix, rv)
    indicators["volatilityRegime"] = regime
    print(f"   Regime: {regime}" if regime else "   Regime: N/A")
    
    # 10. Range Compression Index
    print("\n10. Calculating Range Compression Index...")
    if parkinson_60d:
        # Calculate 60d average
        parkinson_60d_avg = parkinson_60d
    else:
        # Use 20d as fallback
        parkinson_60d_avg = parkinson_20d
    
    rci = calculate_range_compression_index(parkinson_20d, parkinson_60d_avg)
    indicators["rangeCompressionIndex"] = rci
    print(f"   RCI: {rci}" if rci else "   RCI: N/A")
    
    # 11. Volatility Risk Premium
    print("\n11. Calculating Volatility Risk Premium...")
    vrp = calculate_volatility_risk_premium(vix, rv)
    indicators["volatilityRiskPremium"] = vrp
    print(f"   VRP: {vrp}" if vrp is not None else "   VRP: N/A")
    
    # 12. VRP Slope
    print("\n12. Calculating VRP Slope...")
    vrp_slope = calculate_vrp_slope(vix_series, closes, window=5)
    indicators["vrpSlope"] = vrp_slope
    print(f"   VRP Slope: {vrp_slope}" if vrp_slope is not None else "   VRP Slope: N/A")
    
    # Add metadata with current timestamp
    indicators["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    # Save
    with open("data/volatility_indicators.json", "w", encoding="utf-8") as f:
        json.dump(indicators, f, indent=2)
    
    print("\n" + "=" * 70)
    print("[OK] Volatility indicators calculated and saved to data/volatility_indicators.json")
    print("=" * 70)

if __name__ == "__main__":
    main()

