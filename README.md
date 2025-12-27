# 🌌 X-SERIES UNIVERSAL STRATEGY ENCYCLOPEDIA [ULTRA-DETAILED]
## The Architectural Colosseum: Loops, Models, and Recursive Intelligence

This document provides the "Minute-Level" technical breakdown of the entire Tradyxa X-Series.

---

## 🏛️ 1. ARCHITECTURAL DEEP-DIVE (The Gear-Mechanism)

### 🥉 BetaX: The Pattern Replicator (v2.1)
**Models:** XGBoost (Momentum), Random Forest (Patterns).
**Loop:** Weekly Static Refresh.

```mermaid
graph TD
    subgraph "SENSING (The Archive)"
        B_LIVE[⚡ 30-Min Live Spot] --> B_ENG
        B_YF[yfinance OHLCV Archive] --> B_DB[(brain/archive.csv)]
        B_DB --> B_ENG[Feature Builder]
    end

    subgraph "INTELLIGENCE (The Council)"
        B_ENG --> B_13[13-Pillar Vector]
        B_13 --> B_XGB[XGBoost Momentum]
        B_13 --> B_RF[RF Trend]
        B_XGB & B_RF --> B_VOTE{Voter Engine}
    end

    subgraph "OUTPUT"
        B_VOTE --> B_JSON[betax.json]
    end

    subgraph "LOOP (Weekly)"
        B_JSON -.-> B_REFRESH[Weekly Retrain]
        B_REFRESH -.-> B_XGB & B_RF
    end
```

---

### 🥈 DeltaX: The H-Orbital Living Brain (v3.0)
**Models:** SGD (Stochastic), Passive Aggressive (Dynamic), XGB (Base).
**Loop:** Daily Incremental Learning.

```mermaid
graph TD
    subgraph "SENSING (High Velocity)"
        D_LIVE[⚡ 30-Min Live Ticks] --> D_POL
        D_YF[Historical Streams] --> D_POL[engineer_polars.py]
    end

    subgraph "CORE (H-Orbital)"
        D_POL --> D_SGD[SGD Learner]
        D_POL --> D_PA[Passive Aggressive Classifier]
        D_POL --> D_BASE[XGB Baseline]
    end

    subgraph "THE LIVING BRAIN (Feedback)"
        D_SGD & D_PA & D_BASE --> D_WE[Weighted Ensemble]
        D_WE --> D_OUT[deltax.json]
        
        D_OUT --> D_LOG[prediction_logger.py]
        D_LOG --> D_ACC[accuracy_tracker.py]
        D_ACC --> D_LEARN[online_learner.py]
        
        D_LEARN -->|Update Model Weights| D_SGD
        D_LEARN -->|Update Model Weights| D_PA
    end
```

---

### 🥇 ZetaX: The Multi-Agent Council (v3.5)
**Models:** HMM (Regime), RF (Reversal), XGB (Momentum), QR (Range), RL (Strategy), LSTM (Sequence Brain), AE (Anomaly Radar), BERT (Public Pulse).
**Loop:** Recursive Confidence Calibration.

```mermaid
graph TD
    subgraph "SENSING (Contextual)"
        Z_LIVE[⚡ 30-Min Live Price] --> Z_FETCH
        Z_DATA[Macro/Archive Data] --> Z_FETCH[data_fetcher.py]
        Z_SENT[RSS/ET News] --> Z_BERT[BERT Sentiment]
    end

    subgraph "COG-1: Experts"
        Z_FETCH --> HMM[HMM]
        Z_FETCH --> RF[RF]
        Z_FETCH --> XGB[XGB]
        Z_FETCH --> QR[QR]
        Z_FETCH --> RL[RL]
        Z_FETCH --> LSTM[LSTM]
    end

    subgraph "META: Meta-Cognition"
        HMM & RF & XGB & QR & RL & LSTM --> META[Meta-Judge]
        META --> CAL[Confidence Calibrator]
        CAL --> JUDGE[Confidence Score]
    end

    subgraph "EXEC: Executive"
        AE[Anomaly Radar] & Z_BERT & JUDGE --> INF[infer.py]
        INF --> RED[Red Team Protocol]
        RED --> Z_JSON[rubix.json]
    end

    subgraph "RECURSIVE LOOP"
        Z_JSON --> LOG[logger.py]
        LOG --> ACC[tracker.py]
        ACC --> LEARN[online_learner.py]
        LEARN --> BRAIN[brain_state.json]
        BRAIN -.->|Weight Adjustment| META
    end
```

---

### 💎 4. ApeX: The High-Precision Sniper (v4.0)
**Philosophy:** Strategic Perfection.
**Mechanism:** Reinforcement Learning (PPO) + AQL Risk Guards.

```mermaid
graph TD
    subgraph "SENSING (The Accelerator)"
        A_LIVE[⚡ 30-Min Live Tick] --> A_POL
        A_ARCH[yfinance 20Y Archive] --> A_POL
        A_POL[engineer_polars.py] --> A_REF[The Refinery]
    end

    subgraph "ENGINE (The Sniper)"
        A_REF --> A_XGB[XGB Ensemble v2.0]
        A_REF --> A_PPO[PPO Grandmaster v3.0]
        A_XGB & A_PPO --> A_RISK[GARCH Risk Guard]
    end

    subgraph "AQL GUARD (The Oracle)"
        A_RISK --> A_DAR[Darts Cycle Oracle]
        A_DAR --> A_SNIP[Sniper Verdict]
    end

    subgraph "BAYESIAN LOOP (Self-Healing)"
        A_SNIP --> A_OUT[apex_nifty.json]
        A_OUT --> A_NIGHT[nightly_review.py]
        A_NIGHT --> A_MEM[sentient_memory.json]
        
        A_MEM -.->|Adjust Bayesian Confidence| A_SNIP
        A_MEM -.->|Update Streak Penalties| A_XGB
    end
```

---

## 📖 PART 2: THE 4-STAGE STRATEGY MANUAL

### 1. THE FOUNDATION (BetaX & DeltaX)
**When to use:** Market Opening (9:15 AM - 10:30 AM).
*   Check if BetaX and DeltaX agree on the **Direction**.
*   If both say BULLISH, the "Daily Base" is set.

### 2. THE CONTEXT (ZetaX)
**When to use:** Mid-Day Volatility (11:00 AM - 1:00 PM).
*   Read the **Executive Narrative**. 
*   If ZetaX says "Anomaly Detected" (via Anomaly Radar), **HALT TRADING**.
*   If ZetaX says "Sentiment Convergence," increase your conviction.

### 3. THE PRECISION (ApeX)
**When to use:** Reversals & Scalping (1:30 PM - 3:30 PM).
*   Wait for the **ApeX Sniper** to give a **SCALE IN** signal.
*   Cross-reference with GARCH. If GARCH is "Red," use 25% capital. If GARCH is "Green," use 100% capital.

### 4. THE CONVERGENCE (The "God Trade")
**When to use:** Only 2-3 times per week.
*   **BETA:** Bullish.
*   **DELTA:** Weights favoring Longs.
*   **ZETA:** 5+ Council members agree + Narrative is optimistic.
*   **APEX:** Grandmaster gives **SCALE IN (LONG)** with 80%+ Confidence.

**This is the "Institutional Order Flow" pattern.**

---
© 2025 Zeta Aztra Technologies. All Rights Reserved.
