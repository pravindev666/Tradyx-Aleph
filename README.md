# ApeX: Sentient Evolution Blueprint

**Version:** 4.0 (AQL - Autonomous Quantitative Laboratory)  
**Last Updated:** 2025-12-26

---

## 🧬 The Evolution Matrix

```mermaid
graph LR
    V20["v2.0\nML Ensemble"] --> V21["v2.1\nDefense & XAI"]
    V21 --> V30["v3.0\nRL Strategy"]
    V30 --> V40["v4.0\nAutonomous Lab"]
    style V40 fill:#10b981,color:#000
```

| Version | Core Engine | Key Philosophy |
| :--- | :--- | :--- |
| **2.0** | XGBoost + LightGBM + RF | Pattern Recognition |
| **2.1** | PyOD + ELI5 | Contrarian Intelligence + AI Defense |
| **3.0** | Stable-Baselines3 (PPO) | Action Optimization (Reinforcement Learning) |
| **4.0** | Polars + GARCH + Darts | Autonomous Quantitative Laboratory |

---

## 🏗️ Sentient 4.0 Architecture

```mermaid
graph TD
    subgraph "DATA LAYER"
        YF["yfinance: Spot, VIX, History"]
        NSE["NSE Scraper: Options Chain"]
    end

    subgraph "FEATURE LAYER"
        Polars["Polars Engine (10x Speed)"]
        Darts["Darts: Seasonal Cycles"]
    end

    subgraph "DEFENSE LAYER (Sentinel 2.1)"
        Chaos["PyOD: Isolation Forest Anomaly"]
        GARCH["Statsmodels: GARCH Volatility Regime"]
    end

    subgraph "ML LAYER (The Brain)"
        XGB["XGBoost"]
        LGB["LightGBM"]
        RF["Random Forest"]
        RL["PPO Agent (Sentient 3.0)"]
    end

    subgraph "SENTIENT LAYER (The Soul)"
        Mem["Memory Systems"]
        Bayes["Bayesian Updater"]
        XAI["ELI5 Explainer"]
    end

    YF --> Polars
    NSE --> Polars
    Polars --> Darts --> GARCH
    Polars --> XGB & LGB & RF
    XGB & LGB & RF --> RL
    GARCH --> Chaos
    RL --> Mem --> Bayes --> XAI
    XAI --> VERDICT["🎯 FINAL VERDICT + STRATEGY + RISK"]
```

---

## 📦 Tech Stack

| Category | Library | Purpose |
| :--- | :--- | :--- |
| **Machine Learning** | XGBoost, LightGBM, Scikit-Learn | Ensemble Prediction |
| **Reinforcement Learning** | Stable-Baselines3, Gymnasium | PPO Strategy Agent |
| **High-Speed Data** | Polars | Rust-based 10x processing |
| **Volatility Defense** | Statsmodels, arch | GARCH(1,1) Regime Detection |
| **Anomaly Detection** | PyOD | Isolation Forest Chaos Filter |
| **Explainability** | ELI5 | Feature Weight Narratives |
| **Seasonality** | Darts | Neural Forecasting |
| **Web Scraping** | BeautifulSoup | NSE Options Chain |
| **Frontend** | React, Framer Motion, TailwindCSS | Dashboard UI |

---

## 🎯 UI Tiles

### Sentient 3.0: Strategy Tile
Displays the optimal RL action: *Scale In (Long)*, *Scale Out (Short)*, or *Hold*.

### Sentient 4.0: Risk Regime Tile
Displays the GARCH volatility regime (*Normal*, *Stressed*, *Quiet*) and the Darts cyclical phase (*Positive*, *Corrective*, *Neutral*).

---

## 📡 JSON Telemetry (`apex_nifty.json`)

```json
{
    "metadata": { "engine_version": "Sentient 4.0 (AQL)" },
    "oracle": {
        "verdict": "LEAN_BULLISH",
        "confidence": 55,
        "narrative": "...",
        "rl_strategy": "SCALE IN (LONG)",
        "risk_regime": "QUIET (18% Stress)",
        "cycle_signal": "Positive Cycle Phase"
    }
}
```

---

## ✅ Verification

- [x] Sentient 2.1 (PyOD + ELI5) integrated
- [x] Sentient 3.0 (PPO Agent) training & inference wired
- [x] Sentient 4.0 (Polars + GARCH) volatility guard active
- [x] UI Tiles (StrategyTile, RiskRegimeTile) deployed
