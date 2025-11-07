# Data Generation Guide

## How to Generate Data for Dashboard

The dashboard requires data from NSE (National Stock Exchange) and Yahoo Finance to display:
- **Spot Price & VIX**: Real-time index levels and volatility
- **PCR, Max Pain, IV Rank**: Options metrics
- **Volatility Indicators**: 10 advanced volatility metrics
- **Prediction Models**: Parkinson Volatility, Expected Move, Quantile Bands, ML Beta

### Step-by-Step Instructions

1. **Navigate to the scripts directory:**
   ```bash
   cd tradyx-options-dashboard/scripts
   ```

2. **Fetch NSE Options Chain Data:**
   ```bash
   python fetch_nse_chain.py
   ```
   This creates `data/chain_raw.json` with the latest options chain data.

3. **Fetch Yahoo Finance Data (for VIX and historical data):**
   ```bash
   python fetch_yf.py
   ```
   This creates `data/yf.json` with VIX and historical price data.

4. **Fetch Prediction Data (OHLC and Sector data):**
   ```bash
   python fetch_predictions.py
   ```
   This creates `data/prediction_data.json` with OHLC data and sector returns for prediction models.
   **Note**: Requires `numpy` and `pandas` - install with `pip install numpy pandas`

5. **Compute Metrics:**
   ```bash
   python compute_metrics.py
   ```
   This processes the chain data and creates `data/metrics.json` with:
   - PCR, Max Pain, ATM Straddle
   - IV Rank, Magnet %, OI Momentum

6. **Compute ML Predictions:**
   ```bash
   python compute_ml_predictions.py
   ```
   This calculates ML-based prediction models and creates `data/ml_predictions.json` with:
   - **Linear Regression** (Next-Day Bias)
   - **Logistic Regression** (Market Probability)
   - **Random Forest** (Volatility Forecast)
   - **Quantile Regression** (5-day Predicted Range)
   - **LSTM** (Volatility Regime Forecast)
   **Note**: Requires `scikit-learn`, `statsmodels`, and optionally `tensorflow` - install with `pip install scikit-learn statsmodels tensorflow`

7. **Compute Volatility Indicators:**
   ```bash
   python compute_volatility_indicators.py
   ```
   This calculates 10 volatility indicators and creates `data/volatility_indicators.json` with:
   - Realized Volatility (RV)
   - HV–IV Spread
   - Volatility Ratio (VR)
   - Parkinson Volatility (σₚ)
   - Expected Move (1-Day)
   - VIX–NIFTY Correlation
   - Trend Consistency Index (TCI)
   - Return Quantile Position (QP)
   - Volatility Regime Classifier
   - Range Compression Index (RCI)
   **Note**: Requires `numpy` - install with `pip install numpy`

8. **Build Final Dashboard JSON:**
   ```bash
   python build_dashboard_json.py
   ```
   This combines all data sources into `public/data/dashboard.json` which the dashboard reads.

### Notes

- **If you see "No data available"**: Run the scripts above to generate the data
- **Sample Data**: The scripts now generate sample data if real data is not available, so you should see data even if the NSE API is unavailable
- **Update Frequency**: Run these scripts periodically (every 5-15 minutes) to keep data fresh
- **Data Location**: Final data is in `public/dashboard.json` - the dashboard reads from this file

### Troubleshooting

**Problem**: Prediction Models show "Neutral" or no data
- **Solution**: Run `python fetch_predictions.py` then `python compute_predictions.py` to generate prediction data

**Problem**: Volatility Indicators show no data
- **Solution**: Run `python fetch_predictions.py` then `python compute_volatility_indicators.py` to generate volatility indicator data

**Problem**: Data not updating in dashboard
- **Solution**: Run `python build_dashboard_json.py` to rebuild, then hard refresh browser (Ctrl+Shift+R)

### Quick Start (All Commands)

```bash
cd tradyx-options-dashboard/scripts

# Install dependencies (first time only)
pip install -r requirements.txt

# Fetch all data
python fetch_nse_chain.py
python fetch_yf.py
   python fetch_predictions.py
   python compute_metrics.py
   python compute_ml_predictions.py
   python compute_volatility_indicators.py
   python build_dashboard_json.py
```

After running these commands, refresh your dashboard and you should see data in all tiles, including volatility indicators and prediction models.

### Python Dependencies

Install required Python packages:
```bash
pip install requests beautifulsoup4 yfinance
```

Or use the requirements file:
```bash
pip install -r scripts/requirements.txt
```

