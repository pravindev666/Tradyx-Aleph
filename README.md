# 🌌 Tradyxa RubiX: OmegaX Master Blueprint
## H-ORBITAL Integration & The Living Brain 4.0

> [!IMPORTANT]
> **Tradyxa RubiX** is an **Autonomous Intelligence System** designed for high-frequency volatility analysis in NIFTY and BANKNIFTY. It leverages institutional-grade mathematics and self-correcting neural loops to quantify market uncertainty.

---

## 🏗️ The Dual-Channel Intelligence

RubiX communicates through two distinct channels to ensure both mathematical precision and actionable intuition. If you feel the text is redundant, understand that they serve two different cognitive roles:

### 1. The "AI Consensus" (Math Channel)
- **Goal**: Quantitative "Engine Room" output.
- **Components**: `Ultimate ML Conf`, `Sequence Brain`, and `Reliability Score`.
- **Logic**: Counts "votes" (Bullish vs Bearish) from all 23 tiles.
- **Usage**: Used for **Risk Management**. If the Consensus is mixed, you reduce position size.

### 2. The "Llama Executive Analyst" (Voice Channel)
- **Goal**: Qualitative "Intelligence Officer" synthesis.
- **Function**: Takes the mathematical summary from the Consensus and merges it with **BERT News Sentiment** and **Macro Cues** (GIFT Nifty).
- **Necessity**: It explains **WHY** the math is leaning a certain way. (e.g., "Momentum is high, but we are in a Chaotic regime, so scalp quickly").

---

## 🛰️ H-ORBITAL Architecture: "The Living Brain" 4.0

The "Living Brain" is an active feedback loop (`online_learner.py`) that executes daily to ensure the AI learns from its mistakes.

### 🧠 The Learning Cycle
1. **Prediction**: `infer.py` logs every choice to `predictions_log.csv`.
2. **Outcome Fetch**: Daily at market close, the system fetches actual yfinance data.
3. **Evaluation**: If the "Llama" was Bullish but the market crashed, a **Negative Reward (-1.0)** is issued.
4. **Self-Correction**: The `brain_state.json` is updated. This modifies the weights in the **Ultimate ML Meta-Model**, effectively "penalizing" the models that were wrong.
5. **Reliability Score**: This reflects the system's "Trust" level in its recent performance.

---

## 🎨 Dashboard Architecture (Standard 23-Tile Grid)

| # | Tile Name | Backend Script | Mathematical Model |
|---|-----------|----------------|--------------------|
| 1 | **Spot Price Reference** | `data_fetcher.py` | Real-time Spot Integration |
| 2 | **India VIX Monitor** | `data_fetcher.py` | Implied Volatility Surface |
| 3 | **Hurst Compass** | `risk_calculator.py` | Fractal Dimension (Rescaled Range) |
| 4 | **Momentum Pulse** | `xgb_momentum.py` | XGBoost Gradient Boosting |
| 5 | **Market Regime** | `hmm_regime.py` | Hidden Markov Model (HMM) |
| 6 | **Streak Reversal** | `rf_reversal.py` | Random Forest Classifier |
| 7 | **Max Daily Loss (VaR)** | `risk_calculator.py` | Parametric Value-at-Risk (95% CI) |
| 8 | **Volatility Term** | `data_fetcher.py` | VIX Term Structure Analysis |
| 9 | **Weekend Risk** | `friday_fear.py` | Empirical Distribution of Gaps |
| 10 | **Expiry Pin** | `data_fetcher.py` | Max Pain Theory / OI Clustering |
| 11 | **Key Support (S1)** | `data_fetcher.py` | Dealer GEX (Gamma Exposure) |
| 12 | **Option Skew** | `probability_models.py` | Put/Call Skew Normalization |
| 13 | **Time Decay (Theta)** | `risk_calculator.py` | BSM Partial Derivative (Theta) |
| 14 | **Bet Size (Kelly)** | `risk_calculator.py` | Regime-Adjusted Kelly Criterion |
| 15 | **Touch Probability** | `probability_models.py` | Binary Barrier Option Modeling |
| 16 | **System Status** | `infer.py` | Weighted Multi-Factor Score |
| 17 | **Greed Meter (FOMO)** | `infer.py` | RSI + Volume Breakout Detection |
| 18 | **Next Event** | `data_fetcher.py` | Volatility Calendar Impact |
| 19 | **Global Sentinel** | `data_fetcher.py` | Gift Nifty - US Market Spillover |
| 20 | **Public Pulse** | `sentiment_engine.py` | FinBERT Sentiment Analysis |
| 21 | **Expected Range** | `qr_range.py` | Quantile Regression (Q10/Q90) |
| 22 | **Monte Carlo Cones** | `probability_models.py` | Merton Jump-Diffusion Simulation |
| 23 | **Anomaly Radar** | `anomaly_detector.py` | Deep Neural Auto-Encoder (AE) |

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| **Backend** | Python 3.12, yfinance, Pandas, NumPy, Scikit-learn, XGBoost, hmmlearn |
| **H-ORBITAL** | PyTorch (CPU), FinBERT (Sentiment), Quantized Llama-3 (Synthesis) |

---

## 🛡️ SEBI Compliance & Disclaimer

**Tradyxa RubiX** is a statistical analysis tool for educational purposes. 
1. **No Recommendations**: All outputs are mathematical probabilities.
2. **Educational Use**: Designed for cognitive augmentation, not signal automation.
3. **Risk Warning**: F&O trading involves substantial risk of capital loss.

**Build Version:** 4.2.0-HORBITAL  
**Last Updated:** December 2025 (H-ORBITAL Refit)  
*Tradyxa: Mastering the Probabilities.*
