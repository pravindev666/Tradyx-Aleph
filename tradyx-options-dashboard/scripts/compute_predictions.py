"""
Calculate prediction models: Parkinson Volatility, Expected Move, Quantile Bands, ML Beta
"""
import json
import math
import numpy as np
from pathlib import Path
from datetime import datetime, timezone

def calculate_parkinson_volatility(highs, lows):
    """Calculate Parkinson Volatility from high/low data"""
    if not highs or not lows or len(highs) != len(lows) or len(highs) < 20:
        return None
    
    try:
        # Convert to numpy arrays
        h = np.array(highs)
        l = np.array(lows)
        
        # Filter out invalid data
        valid = (h > 0) & (l > 0) & (h >= l)
        h = h[valid]
        l = l[valid]
        
        if len(h) < 20:
            return None
        
        # Calculate ln(H/L)²
        log_hl = np.log(h / l)
        log_hl_sq = log_hl ** 2
        
        # Parkinson formula: σ_p = sqrt( (1/4ln2) × mean((ln(H/L))²) )
        variance = (1 / (4 * np.log(2))) * np.mean(log_hl_sq)
        volatility = np.sqrt(variance)
        
        # Annualize (multiply by sqrt(252) for daily data)
        annualized_vol = volatility * np.sqrt(252) * 100  # Convert to percentage
        
        # Determine regime
        if annualized_vol > 20:
            regime = 'Bearish'  # High volatility = uncertainty
        elif annualized_vol < 10:
            regime = 'Bullish'  # Low volatility = stability
        else:
            regime = 'Neutral'
        
        return {
            "value": round(annualized_vol, 2),
            "regime": regime
        }
    except Exception as e:
        print(f"Error calculating Parkinson Vol: {e}")
        return None

def calculate_expected_move(spot, iv, days=1):
    """Calculate next-day expected move from IV"""
    if not spot or not iv or spot <= 0:
        return None
    
    try:
        # Formula: EM = Spot × IV × sqrt(days/365)
        iv_decimal = iv / 100  # Convert percentage to decimal
        expected_move = spot * iv_decimal * math.sqrt(days / 365)
        expected_move_pct = (expected_move / spot) * 100
        
        # Determine regime based on expected move percentage
        if expected_move_pct > 1.0:
            regime = 'Bearish'  # High expected move = volatility risk
        elif expected_move_pct < 0.4:
            regime = 'Bullish'  # Low expected move = calm market
        else:
            regime = 'Neutral'
        
        return {
            "value": round(expected_move, 2),
            "valuePct": round(expected_move_pct, 2),
            "regime": regime
        }
    except Exception as e:
        print(f"Error calculating Expected Move: {e}")
        return None

def calculate_quantile_bands(returns):
    """Calculate quantile regression bands from returns"""
    if not returns or len(returns) < 30:
        return None
    
    try:
        returns_array = np.array(returns)
        
        # Calculate quantiles
        q05 = np.percentile(returns_array, 5)
        q25 = np.percentile(returns_array, 25)
        q50 = np.percentile(returns_array, 50)
        q75 = np.percentile(returns_array, 75)
        q95 = np.percentile(returns_array, 95)
        
        # Determine regime based on current position in distribution
        # If most recent returns are positive and above median, bullish
        recent_returns = returns_array[-5:] if len(returns_array) >= 5 else returns_array
        avg_recent = np.mean(recent_returns)
        
        if avg_recent > q75:
            regime = 'Bullish'
        elif avg_recent < q25:
            regime = 'Bearish'
        else:
            regime = 'Neutral'
        
        return {
            "q05": round(q05, 2),
            "q25": round(q25, 2),
            "q50": round(q50, 2),
            "q75": round(q75, 2),
            "q95": round(q95, 2),
            "regime": regime
        }
    except Exception as e:
        print(f"Error calculating Quantile Bands: {e}")
        return None

def calculate_ml_beta(nifty_returns, sector_returns):
    """Calculate simple ML Beta using linear regression"""
    if not nifty_returns or not sector_returns:
        return None
    
    if len(nifty_returns) != len(sector_returns) or len(nifty_returns) < 30:
        return None
    
    try:
        # Simple linear regression: Y = α + βX + ε
        # where X = NIFTY returns, Y = Sector returns
        x = np.array(nifty_returns)
        y = np.array(sector_returns)
        
        # Calculate beta: β = Cov(X,Y) / Var(X)
        cov_xy = np.cov(x, y)[0, 1]
        var_x = np.var(x)
        
        if var_x == 0:
            return None
        
        beta = cov_xy / var_x
        
        # Calculate alpha: α = mean(Y) - β × mean(X)
        alpha = np.mean(y) - beta * np.mean(x)
        
        # Calculate R²
        y_pred = alpha + beta * x
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        # Determine regime
        # Beta > 1.2 = high sensitivity (volatile), Beta < 0.8 = low sensitivity (stable)
        if beta > 1.2:
            regime = 'Bearish'  # High beta = more volatile
        elif beta < 0.8:
            regime = 'Bullish'  # Low beta = less volatile
        else:
            regime = 'Neutral'
        
        return {
            "beta": round(beta, 3),
            "alpha": round(alpha, 3),
            "rSquared": round(r_squared, 3),
            "regime": regime
        }
    except Exception as e:
        print(f"Error calculating ML Beta: {e}")
        return None

def main():
    """Main calculation function"""
    Path("data").mkdir(exist_ok=True)
    
    # Load required data
    try:
        # Load prediction data (OHLC, returns, sectors)
        with open("data/prediction_data.json", "r", encoding="utf-8") as f:
            pred_data = json.load(f)
    except FileNotFoundError:
        print("[WARN] prediction_data.json not found. Run fetch_predictions.py first.")
        return
    
    try:
        # Load current metrics for spot and IV
        with open("data/metrics.json", "r", encoding="utf-8") as f:
            metrics = json.load(f)
    except FileNotFoundError:
        print("[WARN] metrics.json not found. Run compute_metrics.py first.")
        return
    
    try:
        # Load VIX for IV if not in metrics
        with open("data/yf.json", "r", encoding="utf-8") as f:
            yf_data = json.load(f)
    except FileNotFoundError:
        yf_data = {}
    
    # Extract data
    spot = metrics.get("spot") or pred_data.get("spot")
    vix = yf_data.get("vix") or metrics.get("vix") or 15.0
    highs = pred_data.get("ohlc", {}).get("high", [])
    lows = pred_data.get("ohlc", {}).get("low", [])
    returns = pred_data.get("returns", {}).get("nifty", [])
    sectors = pred_data.get("sectors", {})
    
    # Calculate predictions
    predictions = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    
    # 1. Parkinson Volatility
    parkinson = calculate_parkinson_volatility(highs, lows)
    if parkinson:
        predictions["parkinsonVol"] = parkinson["value"]
        predictions["parkinsonRegime"] = parkinson["regime"]
    
    # 2. Expected Move
    expected_move = calculate_expected_move(spot, vix, days=1)
    if expected_move:
        predictions["expectedMove"] = expected_move["value"]
        predictions["expectedMovePct"] = expected_move["valuePct"]
        predictions["expectedMoveRegime"] = expected_move["regime"]
    
    # 3. Quantile Bands
    quantile = calculate_quantile_bands(returns)
    if quantile:
        predictions["quantileUpper"] = quantile["q95"]
        predictions["quantileLower"] = quantile["q05"]
        predictions["quantileRegime"] = quantile["regime"]
    
    # 4. ML Beta (use BANKNIFTY as primary sector)
    if "BANKNIFTY" in sectors and sectors["BANKNIFTY"].get("returns"):
        bank_returns = sectors["BANKNIFTY"]["returns"]
        beta = calculate_ml_beta(returns, bank_returns)
        if beta:
            predictions["mlBeta"] = beta["beta"]
            predictions["mlBetaAlpha"] = beta["alpha"]
            predictions["mlBetaRSquared"] = beta["rSquared"]
            predictions["betaRegime"] = beta["regime"]
    
    # Save predictions
    with open("data/predictions.json", "w", encoding="utf-8") as f:
        json.dump(predictions, f, indent=2)
    
    print("[OK] Predictions calculated successfully")
    print(f"  - Parkinson Vol: {predictions.get('parkinsonVol', 'N/A')} ({predictions.get('parkinsonRegime', 'N/A')})")
    print(f"  - Expected Move: Rs {predictions.get('expectedMove', 'N/A')} ({predictions.get('expectedMoveRegime', 'N/A')})")
    print(f"  - Quantile Bands: {predictions.get('quantileLower', 'N/A')} to {predictions.get('quantileUpper', 'N/A')} ({predictions.get('quantileRegime', 'N/A')})")
    print(f"  - ML Beta: {predictions.get('mlBeta', 'N/A')} ({predictions.get('betaRegime', 'N/A')})")

if __name__ == "__main__":
    main()

