# 🏛️ CROSS-PROJECT ARCHITECTURE COMPARISON
## DeltaX vs ZetaX vs ApeX: Full Pipeline Analysis

This document provides a side-by-side comparison of the data flow, training loops, and self-learning mechanisms for the three Tradyxa projects.

---

## ✅ YOUR UNDERSTANDING IS CORRECT:
**ApeX has 3 distinct pipelines:**
1.  **ML Training Pipeline:** XGBoost, LightGBM, Random Forest.
2.  **PPO Grandmaster Pipeline:** Reinforcement Learning (1M Steps).
3.  **Genetic Engine Pipeline:** Alien Math Discovery (Experimental).

---

## 📊 DELTAX ARCHITECTURE (Living Brain Active)

```mermaid
graph TD
    subgraph "1. DATA FETCH (Every 30 Mins)"
        YF_D[yfinance: 30-Min Spot Price]
        HIST_D[Historical Archive: archive_nifty.csv]
    end

    subgraph "2. INFERENCE (predict.py)"
        ML_D[ML Ensemble: XGB/LGB/RF]
        TILES_D[Tile Calculators: PCR, GEX, etc.]
        JSON_D[auztinx_data.json]
    end

    subgraph "3. LOGGING (prediction_logger.py)"
        CSV_D[predictions.csv]
    end

    subgraph "4. VERIFICATION (accuracy_tracker.py - Daily)"
        VERIFY_D{Next Day Close?}
    end

    subgraph "5. SELF-LEARNING (online_learner.py - Daily)"
        BRAIN_D[brain_state.json]
        ADAPT_D[Adjust Model Weights]
    end

    YF_D -->|Live Tick| ML_D & TILES_D
    HIST_D -.->|Training Context| ML_D
    ML_D & TILES_D --> JSON_D
    JSON_D --> CSV_D
    CSV_D --> VERIFY_D
    VERIFY_D -->|Correct| BRAIN_D
    VERIFY_D -->|Wrong| ADAPT_D
    ADAPT_D --> BRAIN_D
    BRAIN_D -.->|Next Run| ML_D
```

---

## 📊 ZETAX ARCHITECTURE (Similar to DeltaX)

```mermaid
graph TD
    subgraph "1. DATA FETCH (Every 30 Mins)"
        YF_Z[yfinance: 30-Min Spot Price]
        NSE_Z[NSE Scraper: Options Chain]
        HIST_Z[Historical Archive]
    end

    subgraph "2. INFERENCE (rubix_inference.py)"
        RUBIX_Z[RubiX Engine: Bayesian + Kalman]
        ML_Z[ML Ensemble]
        SENTIENT_Z[Sentient Pipeline v2.0]
        JSON_Z[rubix_data.json]
    end

    subgraph "3. LOGGING"
        CSV_Z[predictions.csv]
    end

    subgraph "4. VERIFICATION (Daily)"
        VERIFY_Z{Next Day Close?}
    end

    subgraph "5. SELF-LEARNING (Daily)"
        BRAIN_Z[brain_state.json]
        ADAPT_Z[Adjust Weights]
    end

    YF_Z -->|Live Tick| RUBIX_Z & ML_Z
    NSE_Z -->|Options Data| RUBIX_Z
    HIST_Z -.->|Training Context| ML_Z
    RUBIX_Z & ML_Z --> SENTIENT_Z --> JSON_Z
    JSON_Z --> CSV_Z --> VERIFY_Z
    VERIFY_Z --> BRAIN_Z
    BRAIN_Z -.->|Next Run| SENTIENT_Z
```

---

## 📊 APEX ARCHITECTURE (Living Brain MISSING)

```mermaid
graph TD
    subgraph "1. DATA FETCH (Every 30 Mins)"
        YF_A[yfinance: 30-Min Spot Price]
        NSE_A[NSE Scraper: Options Chain]
        HIST_A[Historical Archive: archive_nifty.csv]
    end

    subgraph "2. ML TRAINING PIPELINE (Weekly - train_models.py)"
        POLARS_A[Polars: Feature Refinery]
        XGB_A[XGBoost]
        LGB_A[LightGBM]
        RF_A[Random Forest]
        PKL_A[.pkl Models]
    end

    subgraph "3. PPO GRANDMASTER PIPELINE (Weekly - train_rl.py)"
        GYM_A[Gymnasium Env]
        PPO_A[PPO Agent: 1M Steps]
        ZIP_A[.zip Brain]
    end

    subgraph "4. GENETIC ENGINE PIPELINE (Lab Only)"
        PARTS_A[Math Parts Bucket]
        EVOLVE_A[Genetic Evolution]
        ANGELS_A[Angel Council A1-A12]
    end

    subgraph "5. LIVE INFERENCE (Every 30 Mins - main_inference.py)"
        INF_A[Run ML + PPO]
        JSON_A[apex_nifty.json]
    end

    subgraph "6. SELF-LEARNING [MISSING]"
        MISS_A["❌ No prediction_logger.py"]
        MISS_B["❌ No accuracy_tracker.py"]
        MISS_C["❌ No online_learner.py"]
    end

    HIST_A --> POLARS_A --> XGB_A & LGB_A & RF_A --> PKL_A
    POLARS_A --> GYM_A --> PPO_A --> ZIP_A
    POLARS_A -.-> PARTS_A --> EVOLVE_A --> ANGELS_A

    YF_A -->|Live Tick| INF_A
    PKL_A & ZIP_A --> INF_A --> JSON_A
    JSON_A -.->|NO FEEDBACK LOOP| MISS_A & MISS_B & MISS_C
```

---

## 🔑 KEY DIFFERENCES

| Feature | DeltaX | ZetaX | ApeX |
| :--- | :--- | :--- | :--- |
| **ML Ensemble** | ✅ XGB/LGB/RF | ✅ XGB/LGB/RF | ✅ XGB/LGB/RF |
| **PPO Grandmaster** | ❌ | ❌ | ✅ 1M Steps |
| **Genetic Engine** | ❌ | ❌ | ✅ (Lab Only) |
| **Living Brain (Self-Learning)** | ✅ | ✅ | ❌ MISSING |
| **Sentient Pipeline** | v2.0 | v2.0 | v4.0 (Partial) |

---

## 🚀 RECOMMENDATION FOR APEX

To complete ApeX Sentient 6.0, migrate the "Living Brain" loop from DeltaX:
1.  `prediction_logger.py` → Log `apex_nifty.json` to CSV.
2.  `accuracy_tracker.py` → Verify next-day outcomes.
3.  `online_learner.py` → Adapt weights for ML, PPO, and Angels.

🔱🧬🌌🚀🦾
© 2025 Zeta Aztra Technologies.
