# Data Generation Scripts

## Quick Start

**Easiest way**: Run all scripts automatically:
```bash
cd scripts
python run_all.py
```

This will run all scripts in the correct order and update all dashboard data.

## Individual Scripts

### 1. Fetch NSE Options Chain Data
```bash
python fetch_nse_chain.py
```
- Fetches raw options chain data from NSE
- Output: `data/chain_raw.json`, `data/chain_meta.json`
- Includes retry logic and error handling

### 2. Fetch Yahoo Finance Data
```bash
python fetch_yf.py
```
- Fetches NIFTY and VIX data, historical series
- Fetches VIX OHLC for daily change calculation
- Output: `data/yf.json`

### 3. Fetch Prediction Data
```bash
python fetch_predictions.py
```
- Fetches 2 years of OHLC data for ML models
- Fetches sector indices data
- Output: `data/prediction_data.json`
- **Requires**: `numpy`, `pandas`, `yfinance`

### 4. Compute Metrics
```bash
python compute_metrics.py
```
- Computes option chain metrics from NSE data
- Calculates: PCR, Max Pain, ATM Strike, Straddle, IV Rank, OI Momentum
- Output: `data/metrics.json`

### 5. Compute ML Predictions
```bash
python compute_ml_predictions.py
```
- Computes 5 ML-based prediction models:
  1. Linear Regression (Next-Day Bias)
  2. Logistic Regression (Market Probability)
  3. Random Forest (Volatility Forecast)
  4. Quantile Regression (5-day Predicted Range)
  5. LSTM (Volatility Regime Forecast)
- Output: `data/ml_predictions.json`
- **Requires**: `scikit-learn`, `statsmodels`, `tensorflow`

### 6. Compute Volatility Indicators
```bash
python compute_volatility_indicators.py
```
- Computes 10 volatility indicators:
  1. Realized Volatility (RV)
  2. HV–IV Spread
  3. Volatility Ratio
  4. Parkinson Volatility
  5. VIX–NIFTY Correlation
  6. Trend Consistency Index
  7. Return Quantile Position
  8. Volatility Regime Classifier
  9. Range Compression Index
  10. Volatility Risk Premium (VRP)
- Output: `data/volatility_indicators.json`
- **Requires**: `numpy`

### 7. Compute Breadth & Momentum
```bash
python compute_breadth_momentum.py
```
- Computes Drift Direction (EMA20 - EMA50)
- Computes Momentum Strength
- Output: `data/breadth_momentum.json`
- **Requires**: `pandas`, `numpy`

### 8. Build Dashboard JSON
```bash
python build_dashboard_json.py
```
- Consolidates all data into final dashboard.json
- Output: 
  - `data/dashboard.json` (for scripts)
  - `../public/data/dashboard.json` (for Next.js frontend)

## Complete Workflow

Run all scripts in sequence:
```bash
cd scripts
python fetch_nse_chain.py
python fetch_yf.py
python fetch_predictions.py
python compute_metrics.py
python compute_ml_predictions.py
python compute_volatility_indicators.py
python compute_breadth_momentum.py
python build_dashboard_json.py
```

Or use the automated script:
```bash
cd scripts
python run_all.py
```

## Dependencies

Install all required packages:
```bash
pip install -r requirements.txt
```

Required packages:
- `requests` - NSE API calls
- `yfinance` - Yahoo Finance data
- `numpy` - Numerical computations
- `pandas` - Data manipulation
- `scikit-learn` - ML models
- `statsmodels` - Quantile regression
- `tensorflow` - LSTM model (optional but recommended)

## Data Structure

All scripts output JSON files with `updatedAt` timestamps in UTC ISO format.

The final `dashboard.json` structure matches the UI requirements defined in `hooks/useDashboard.ts`.

## Notes

- All scripts include error handling and retry logic
- Scripts handle missing data gracefully with fallbacks
- Data is saved to both `scripts/data/` and `public/data/` directories
- Internet connection required for fetching data from NSE and Yahoo Finance
- ML models require sufficient historical data (2 years minimum)

## Troubleshooting

See `UPDATE_GUIDE.md` for detailed troubleshooting steps.

