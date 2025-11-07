# Data Update Guide

This guide explains how to update all dashboard data to match the current UI requirements.

## Quick Start

Run all scripts in order:

```bash
cd scripts
python run_all.py
```

This will:
1. Fetch NSE option chain data
2. Fetch Yahoo Finance data (NIFTY, VIX, OHLC)
3. Fetch prediction data (OHLC, sectors)
4. Compute option metrics (PCR, Max Pain, IV Rank, etc.)
5. Compute 10 volatility indicators
6. Compute ML-based predictions (5 models)
7. Compute drift direction and momentum strength
8. Build final dashboard.json

## Individual Scripts

### 1. Data Fetching Scripts

#### `fetch_nse_chain.py`
- **Purpose**: Fetches NSE option chain data
- **Output**: `data/chain_raw.json`, `data/chain_meta.json`
- **Required**: Internet connection, NSE website accessible

#### `fetch_yf.py`
- **Purpose**: Fetches Yahoo Finance data (NIFTY, VIX, OHLC)
- **Output**: `data/yf.json`
- **Required**: Internet connection, yfinance library
- **Data includes**:
  - Spot price and series
  - VIX and VIX series
  - VIX OHLC (for daily change calculation)

#### `fetch_predictions.py`
- **Purpose**: Fetches OHLC and sector data for ML models
- **Output**: `data/prediction_data.json`
- **Required**: Internet connection, yfinance library
- **Data includes**:
  - NIFTY OHLC (2 years)
  - VIX series
  - Sector indices data

### 2. Computation Scripts

#### `compute_metrics.py`
- **Purpose**: Computes option chain metrics
- **Input**: `data/chain_raw.json`
- **Output**: `data/metrics.json`
- **Calculates**:
  - PCR (Put/Call Ratio)
  - Max Pain
  - ATM Strike
  - Straddle Cost
  - IV Rank
  - OI Momentum
  - Top OI strikes

#### `compute_volatility_indicators.py`
- **Purpose**: Computes 10 volatility indicators
- **Input**: `data/prediction_data.json`, `data/yf.json`
- **Output**: `data/volatility_indicators.json`
- **Calculates**:
  1. Realized Volatility (RV)
  2. HV–IV Spread
  3. Volatility Ratio (VR)
  4. Parkinson Volatility
  5. VIX–NIFTY Correlation
  6. Trend Consistency Index
  7. Return Quantile Position
  8. Volatility Regime Classifier
  9. Range Compression Index
  10. Volatility Risk Premium (VRP)

#### `compute_ml_predictions.py`
- **Purpose**: Computes 5 ML-based prediction models
- **Input**: `data/prediction_data.json`
- **Output**: `data/ml_predictions.json`
- **Models**:
  1. Linear Regression (Next-Day Bias)
  2. Logistic Regression (Market Probability)
  3. Random Forest Regressor (Volatility Forecast)
  4. Quantile Regression (5-day Predicted Range)
  5. LSTM (Volatility Regime Forecaster)

#### `compute_breadth_momentum.py`
- **Purpose**: Computes drift direction and momentum strength
- **Input**: `data/prediction_data.json`
- **Output**: `data/breadth_momentum.json`
- **Calculates**:
  - Drift Direction (EMA20 - EMA50)
  - Momentum Strength (composite indicator)

### 3. Build Script

#### `build_dashboard_json.py`
- **Purpose**: Consolidates all data into final dashboard.json
- **Input**: All data files from above scripts
- **Output**: `data/dashboard.json`, `../public/data/dashboard.json`
- **Structure**: Matches `DashboardJson` type in `hooks/useDashboard.ts`

## Data Structure

The final `dashboard.json` structure matches the UI requirements:

```json
{
  "updatedAt": "ISO timestamp",
  "spot": number,
  "vix": number,
  "spotSeries": number[],
  "vixSeries": number[],
  "pcr": number,
  "maxPain": number,
  "atmStrike": number,
  "straddle": { "call": number, "put": number, "total": number },
  "ivRank": number,
  "oiMomentum": number,
  "ohlc": { "open": number, "high": number, "low": number, "close": number, "previousClose": number },
  "vixOhlc": { "open": number, "high": number, "low": number, "close": number, "previousClose": number },
  "spotChangePct": number,
  "vixChangePct": number,
  "mlPredictions": { ... },
  "volatilityIndicators": { ... },
  "driftDirection": number,
  "momentumStrength": number
}
```

## Dependencies

Install all required packages:

```bash
pip install -r requirements.txt
```

Required packages:
- `yfinance` - Yahoo Finance data
- `requests` - NSE API calls
- `numpy` - Numerical computations
- `pandas` - Data manipulation
- `scikit-learn` - ML models
- `statsmodels` - Quantile regression
- `tensorflow` - LSTM model (optional)

## Troubleshooting

### Script fails with network error
- Check internet connection
- Verify NSE/Yahoo Finance are accessible
- Try running script again (retry logic is built-in)

### Missing data in dashboard
- Ensure all scripts ran successfully
- Check `data/` directory for intermediate JSON files
- Verify `build_dashboard_json.py` ran last

### ML predictions not working
- Ensure sufficient historical data (2 years)
- Check TensorFlow installation for LSTM
- Verify sklearn and statsmodels are installed

## Notes

- All scripts include `updatedAt` timestamps in UTC ISO format
- Scripts handle missing data gracefully with fallbacks
- Error handling and retry logic are built-in
- Data is saved to both `scripts/data/` and `public/data/` directories

