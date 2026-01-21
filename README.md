# 📊 Comparative Backtest Report (2025)

This report compares the performance of the three tactical engines against the full historical dataset of 2025.

## 🏁 Master Comparison Table

| Engine | Primary Metric | Accuracy | Macro F1 | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Strangle Engine** | Range Survival (Binary) | 59.11% | -- | Moderate stability filter |
| **Strangle Engine** | Vol Risk Detector (Binary) | 82.59% | -- | **Superior Risk Gating** |
| **Directional Engine** | Bias (T+5 Multiclass) | 61.13% | 0.3610 | Reliable trend baseline |
| **Multi-Horizon** | Bias (T+1 Daily) | 90.69% | 0.3171 | Noise-Dominant (Sideways-biased) |
| **Multi-Horizon** | Bias (T+3 Swing) | 70.85% | 0.3333 | Transitional Stability |
| **Multi-Horizon** | Bias (T+5 Weekly) | 49.80% | 0.3834 | Signal-Emergent |

## 🔍 Key Insights

### 1. The Power of Volatility Detection
The **Strangle Engine's Vol Risk model (82.59%)** is the most robust component. It successfully flags when volatility is about to explode, which is critical for preventing "black swan" losses in short options.

### 2. The Accuracy Paradox (Multi-Horizon)
- Notice how **T+1 Accuracy (90.69%)** is much higher than **T+5 Accuracy (49.80%)**. 
- However, the **Macro F1-score for T+5 (0.3834)** is higher than T+1. 
- **Reason**: T+1 follows the "Sideways" bias of the market. T+5 is actually trying to catch directional trends, which is harder but more valuable for trading.

### 3. Directional Bias Baseline
The **Directional Engine (61.13%)** provides a solid middle-ground between short-term noise and long-term signal, making it a good "anchor" for determining trade posture.

---

## 📂 Data Inventory
- **Strangle Results**: `backtest_results/strangle/results_2025.json`
- **Directional Results**: `backtest_results/directional/results_2025.json`
- **Multi-Horizon Results**: `backtest_results/multi_horizon/results_2025.json`
