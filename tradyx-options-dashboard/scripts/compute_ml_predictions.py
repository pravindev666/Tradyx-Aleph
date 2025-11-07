"""
ML-Based Prediction Models
Uses Linear Regression, Logistic Regression, Random Forest, Quantile Regression, and LSTM
"""
import json
import math
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone
import warnings
warnings.filterwarnings('ignore', category=UserWarning)  # Suppress sklearn feature name warnings

try:
    from sklearn.linear_model import LinearRegression, LogisticRegression
    from sklearn.ensemble import RandomForestRegressor
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("⚠ sklearn not available. Install with: pip install scikit-learn")

try:
    import statsmodels.api as sm
    from statsmodels.regression.quantile_regression import QuantReg
    STATSMODELS_AVAILABLE = True
except ImportError:
    STATSMODELS_AVAILABLE = False
    print("⚠ statsmodels not available. Install with: pip install statsmodels")

try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("⚠ tensorflow not available. LSTM model will be skipped. Install with: pip install tensorflow")

def read(path, fallback={}):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return fallback

def build_sequences(data, target, seq_length=30):
    """Build sequences for LSTM"""
    X, y = [], []
    for i in range(len(data) - seq_length):
        if i + seq_length < len(target):
            X.append(data[i:i+seq_length])
            y.append(target[i+seq_length])
    return np.array(X), np.array(y)

def main():
    Path("data").mkdir(exist_ok=True)
    
    print("=" * 70)
    print("Computing ML-Based Prediction Models")
    print("=" * 70)
    
    # Read prediction data
    pred_data = read("data/prediction_data.json", {})
    
    if not pred_data:
        print("[ERROR] No prediction data found. Run fetch_predictions.py first.")
        return
    
    ohlc = pred_data.get("ohlc", {})
    vix_series = pred_data.get("vix_series", [])
    spot = pred_data.get("spot")
    vix = pred_data.get("vix")
    
    closes = ohlc.get("close", [])
    vix_closes = vix_series
    
    if len(closes) < 30:
        print(f"[ERROR] Insufficient data (only {len(closes)} days, need at least 30)")
        print("   Run fetch_predictions.py with a longer period (e.g., period='2y')")
        return
    
    print(f"\n[OK] Data loaded: {len(closes)} days")
    
    # Create DataFrame
    df = pd.DataFrame({
        'Close': closes,
        'VIX': vix_closes[:len(closes)] if len(vix_closes) >= len(closes) else vix_closes + [vix] * (len(closes) - len(vix_closes))
    })
    
    # Calculate features with adaptive window sizes
    df['Return'] = np.log(df['Close'] / df['Close'].shift(1))
    df['VIX_Change'] = df['VIX'].diff()
    
    # Use adaptive rolling windows based on available data
    available_days = len(df)
    rv_window = min(20, max(10, available_days // 3))  # Use 20 if available, else adaptive
    corr_window = min(30, max(15, available_days // 2))  # Use 30 if available, else adaptive
    
    df['RV20'] = df['Return'].rolling(rv_window, min_periods=max(5, rv_window//2)).std() * np.sqrt(252) * 100  # Annualized %
    df['Corr30'] = df['Return'].rolling(corr_window, min_periods=max(10, corr_window//2)).corr(df['VIX'])
    
    # Remove NaN rows
    df = df.dropna()
    
    if len(df) < 10:
        print(f"[ERROR] Insufficient data after cleaning (only {len(df)} days available)")
        print(f"   Need at least 10 days. Try fetching more historical data.")
        return
    
    print(f"[OK] After feature calculation: {len(df)} days available")
    
    predictions = {}
    
    # 1. Linear Regression - Next-Day Bias
    if SKLEARN_AVAILABLE:
        print("\n1. Computing Linear Regression (Next-Day Bias)...")
        try:
            X = df[['VIX', 'VIX_Change', 'RV20', 'Corr30']].iloc[:-1]
            y = df['Return'].shift(-1).iloc[:-1].dropna()
            
            # Align X and y
            min_len = min(len(X), len(y))
            if min_len > 0:
                X_aligned = X.iloc[:min_len]
                y_aligned = y.iloc[:min_len]
                
                if len(X_aligned) >= 5:  # Need at least 5 samples
                    model = LinearRegression()
                    model.fit(X_aligned, y_aligned)
                    
                    # Predict next day
                    last_X = df[['VIX', 'VIX_Change', 'RV20', 'Corr30']].iloc[-1:].values
                    pred_return = float(model.predict(last_X)[0])
                    pred_pct = pred_return * 100
                    
                    predictions["nextDayBias"] = round(pred_pct, 2)
                    # Treat values very close to zero as Neutral
                    predictions["nextDayBiasDirection"] = "Bullish" if pred_pct > 0.01 else "Bearish" if pred_pct < -0.01 else "Neutral"
                    
                    print(f"   Next-Day Bias: {pred_pct:+.2f}% ({predictions['nextDayBiasDirection']})")
                else:
                    print(f"   [ERROR] Insufficient samples ({len(X_aligned)} < 5)")
            else:
                print("   [ERROR] No aligned data")
        except Exception as e:
            print(f"   [ERROR] Error: {e}")
    
    # 2. Logistic Regression - Market Probability
    if SKLEARN_AVAILABLE:
        print("\n2. Computing Logistic Regression (Market Probability)...")
        try:
            df['Direction'] = (df['Return'].shift(-1) > 0).astype(int)
            X = df[['VIX', 'VIX_Change', 'RV20', 'Corr30']].iloc[:-1]
            y = df['Direction'].iloc[:-1].dropna()
            
            # Align X and y
            min_len = min(len(X), len(y))
            if min_len > 0:
                X_aligned = X.iloc[:min_len]
                y_aligned = y.iloc[:min_len]
                
                if len(X_aligned) >= 5:  # Need at least 5 samples
                    clf = LogisticRegression(random_state=42, max_iter=1000)
                    clf.fit(X_aligned, y_aligned)
                    
                    # Predict probability
                    last_X = df[['VIX', 'VIX_Change', 'RV20', 'Corr30']].iloc[-1:].values
                    prob_up = float(clf.predict_proba(last_X)[0][1])
                    prob_pct = prob_up * 100
                    
                    predictions["marketProbability"] = round(prob_pct, 1)
                    predictions["marketProbabilityRegime"] = "Bullish" if prob_pct > 60 else "Bearish" if prob_pct < 40 else "Neutral"
                    
                    print(f"   Market Probability: {prob_pct:.1f}% ({predictions['marketProbabilityRegime']})")
                else:
                    print(f"   [ERROR] Insufficient samples ({len(X_aligned)} < 5)")
            else:
                print("   [ERROR] No aligned data")
        except Exception as e:
            print(f"   [ERROR] Error: {e}")
    
    # 3. Random Forest - Volatility Forecast
    if SKLEARN_AVAILABLE:
        print("\n3. Computing Random Forest (Volatility Forecast)...")
        try:
            df['RV3'] = df['Return'].rolling(3).std().shift(-3) * np.sqrt(252) * 100
            features = ['VIX', 'RV20', 'VIX_Change', 'Corr30']
            X = df[features].iloc[:-3]
            y = df['RV3'].iloc[:-3].dropna()
            
            # Align X and y
            min_len = min(len(X), len(y))
            X = X.iloc[:min_len]
            y = y.iloc[:min_len]
            
            if len(X) >= 10 and len(y) >= 10:  # Reduced minimum requirement
                rf = RandomForestRegressor(n_estimators=50, random_state=42, max_depth=5)  # Reduced complexity for smaller datasets
                rf.fit(X, y)
                
                # Predict next 3-day volatility
                last_X = df[features].iloc[-1:].values
                pred_vol = float(rf.predict(last_X)[0])
                
                predictions["volatilityForecast"] = round(pred_vol, 2)
                predictions["volatilityForecastRegime"] = "Stress" if pred_vol > 20 else "Calm" if pred_vol < 12 else "Normal"
                
                print(f"   Volatility Forecast (3-day): {pred_vol:.2f}% ({predictions['volatilityForecastRegime']})")
            else:
                print(f"   [ERROR] Insufficient data ({len(X)} samples, need at least 10)")
        except Exception as e:
            print(f"   [ERROR] Error: {e}")
    
    # 4. Quantile Regression - 5-day Predicted Range
    if STATSMODELS_AVAILABLE:
        print("\n4. Computing Quantile Regression (5-day Range)...")
        try:
            X = sm.add_constant(df[['VIX', 'RV20', 'VIX_Change']].iloc[:-5])
            y = df['Return'].shift(-5).iloc[:-5].dropna()
            
            # Align
            min_len = min(len(X), len(y))
            X = X.iloc[:min_len]
            y = y.iloc[:min_len]
            
            if len(X) >= 15:  # Reduced minimum requirement
                # Upper quantile (95%)
                mod_upper = QuantReg(y, X).fit(q=0.95)
                # Lower quantile (5%)
                mod_lower = QuantReg(y, X).fit(q=0.05)
                
                # Make sure last_X has the same structure as X (with constant)
                # X already has constant added, so last_X should match
                last_row = df[['VIX', 'RV20', 'VIX_Change']].iloc[-1:].values
                last_X = sm.add_constant(last_row, has_constant='add')
                
                # Ensure dimensions match
                if last_X.shape[1] != X.shape[1]:
                    # If mismatch, rebuild X without constant and re-add
                    X_no_const = df[['VIX', 'RV20', 'VIX_Change']].iloc[:-5].iloc[:min_len]
                    X = sm.add_constant(X_no_const, has_constant='add')
                    mod_upper = QuantReg(y, X).fit(q=0.95)
                    mod_lower = QuantReg(y, X).fit(q=0.05)
                    last_X = sm.add_constant(last_row, has_constant='add')
                
                upper = float(mod_upper.predict(last_X)[0]) * 100
                lower = float(mod_lower.predict(last_X)[0]) * 100
                
                predictions["predictedRangeUpper"] = round(upper, 2)
                predictions["predictedRangeLower"] = round(lower, 2)
                predictions["predictedRangeRegime"] = "Bullish" if upper > 1.5 else "Bearish" if lower < -1.5 else "Neutral"
                
                print(f"   5-day Range: {upper:+.2f}% / {lower:+.2f}% ({predictions['predictedRangeRegime']})")
            else:
                print(f"   [ERROR] Insufficient data ({len(X)} samples, need at least 15)")
        except Exception as e:
            print(f"   [ERROR] Error: {e}")
            import traceback
            traceback.print_exc()  # Print full traceback for debugging
    
    # 5. LSTM - Volatility Regime Forecaster
    if TENSORFLOW_AVAILABLE and len(df) >= 40:  # Reduced from 60 to 40
        print("\n5. Computing LSTM (Volatility Regime Forecast)...")
        try:
            # Prepare sequences
            features_lstm = df[['VIX', 'RV20', 'VIX_Change']].values
            target_vix = df['VIX'].shift(-3).values
            
            # Normalize
            from sklearn.preprocessing import MinMaxScaler
            scaler_X = MinMaxScaler()
            scaler_y = MinMaxScaler()
            
            features_scaled = scaler_X.fit_transform(features_lstm)
            target_scaled = scaler_y.fit_transform(target_vix.reshape(-1, 1)).flatten()
            
            X_seq, y_seq = build_sequences(features_scaled, target_scaled, seq_length=30)
            
            if len(X_seq) >= 10:  # Reduced minimum requirement
                # Simple LSTM model with reduced complexity
                model = Sequential([
                    LSTM(16, input_shape=(30, 3), return_sequences=False),  # Reduced from 32
                    Dense(8, activation='relu'),  # Reduced from 16
                    Dense(1)
                ])
                model.compile(optimizer='adam', loss='mse')
                
                # Train (use smaller epochs and batch size for speed)
                train_size = max(5, len(X_seq) - 3)  # Leave at least 3 for validation
                model.fit(X_seq[:train_size], y_seq[:train_size], epochs=5, batch_size=4, verbose=0)
                
                # Predict
                pred_vix_scaled = model.predict(X_seq[-1:].reshape(1, 30, 3), verbose=0)
                pred_vix = float(scaler_y.inverse_transform(pred_vix_scaled)[0][0])
                
                # Classify regime
                if pred_vix < 13:
                    regime = "Calm"
                elif pred_vix > 20:
                    regime = "Stress"
                else:
                    regime = "Normal"
                
                predictions["volatilityRegimeForecast"] = round(pred_vix, 2)
                predictions["volatilityRegimeForecastCategory"] = regime
                
                print(f"   3-day VIX Forecast: {pred_vix:.2f}% ({regime})")
            else:
                print(f"   [ERROR] Insufficient sequence data ({len(X_seq)} sequences, need at least 10)")
        except Exception as e:
            print(f"   [ERROR] Error: {e}")
            import traceback
            traceback.print_exc()
    
    # Add metadata
    predictions["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    # Save
    with open("data/ml_predictions.json", "w", encoding="utf-8") as f:
        json.dump(predictions, f, indent=2)
    
    print("\n" + "=" * 70)
    print("[OK] ML Predictions calculated and saved to data/ml_predictions.json")
    print("=" * 70)

if __name__ == "__main__":
    main()

