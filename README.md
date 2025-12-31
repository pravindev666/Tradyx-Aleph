# 🗺️ ApeX v7.0: Comprehensive Codebase Map (Deep Dive)

This document provides a high-fidelity mapping of the **Tradyxa-ApeX v7.0** architecture, specifically highlighting the **Strategic Isolation** firewall and the disconnected nature of the **Shadow Research Layers**.

---

## 🔱 The Universal Architecture & Shadow Firewall

```mermaid
graph TD
    subgraph "1. INPUT LAYER (The Ingestion Vault)"
        A["yfinance_fetcher.py"] -->|OHLCV Snapshot| B["main_inference.py"]
        A -->|Historical Payload| C["vault.py"]
        C -->|Archive Backup| D[(".csv Archive")]
    end

    subgraph "2. FEATURE FOUNDRY (The 13 Pillars)"
        B -->|Raw History| E["engineer.py (FeatureEngineer)"]
        E -->|11 Trained Features| F["Ensemble ML (XGB/LGB/RF)"]
        B -->|History| G["calculators.py (PillarEngine)"]
        G -->|13-Pillar UI Data| H["JSON UI Tiles"]
    end

    subgraph "3. LIVE EXECUTION ORBIT (The Active Brain)"
        F -->|Probabilistic Beliefs| K["Sentient Synthesis"]
        B -->|Vol Detection| I["volatility_guard.py"]
        B -->|Cycle Detection| J["cyclical_oracle.py"]
        I -->|Regime Score| K
        J -->|Cycle Bias| K
        K --> L["brain.py (SentientBrain)"]
        L -->|Veto/Suppression| P["🎯 FINAL SYSTEM VERDICT"]
    end

    subgraph "4. THE SHADOW FIREWALL (Disconnected R&D)"
        direction TB
        subgraph "Shadow Layer (Experimental)"
            M["PPO Research (PPO.load)"] -.->|Evaluates| N["Action Policy"]
            O["Angel Council (Genetic Engine)"] -.->|Evolves| Q["Elite 12 Formulas"]
        end
        B -->|Isolated T-1 Stream| M
        E -->|Lab Seed Data| O
        N -.- x|BLOCKED| P
        Q -.- x|BLOCKED| P
    end

    subgraph "5. TELEMETRY & FEEDBACK (The Loop)"
        P --> W["prediction_logger.py"]
        W --> X["predictions.csv"]
        X --> Y["accuracy_tracker.py"]
        Y --> Z["online_learner.py"]
        Z -->|Confidence Adjustments| AA["brain_state.json"]
        AA -->|Load State| L
    end

    %% JSON Convergence
    P --> T["JSON Payload"]
    H --> T
    N -->|Shadow Metadata| T
    T -->|"public/data/apex.json"| AB["(ApeX UI Dashboard)"]
```

---

## � Feature & Indicator Mapping

ApeX v7.0 distinguishes between **Trained Model Inputs** and **UI Contextual Pillars**.

### �️ ML Ensemble Features (Trained & Active)
Used by XGBoost, LightGBM, and Random Forest for core probability generation:
*   `body_size`: Absolute (Close - Open)
*   `upper_wick` / `lower_wick`: Shadow length
*   `RSI`: 14-period momentum
*   `SMA_20` / `SMA_50` / `SMA_200`: Trend structural baselines
*   `Above_200`: Binary indicator (Price > 200 SMA)
*   `ATR`: Volatility range
*   `BB_Width`: Bollinger Band squeeze factor
*   `OBV`: On-Balance Volume (Trend confirmation)

### 🕹️ Shadow PPO Features (Reinforcement Learning)
A restricted set for the agent's observation space to minimize overfitting:
*   `body_size`, `RSI`, `SMA_20`, `SMA_50`, `SMA_200`, `ATR`, `BB_Width`, `OBV`.

### 🔱 The 13 Sentient Pillars (UI Facing)
The logic defined in `calculators.py` for the dashboard tiles:
1.  **Price Action**: Candle color & score.
2.  **Momentum**: RSI-based strength.
3.  **CPR**: Pivot Point width/structural narrowness.
4.  **Volume Profile**: Relative volume against 20-day mean.
5.  **Volatility Regime**: ATR-based regime classification.
6.  **Intermarket Sync**: (Experimental) Global market correlation.
7.  **Mean Reversion**: Percentage Deviation from 20 SMA.
8.  **Seasonality**: Day of Week bias.
9.  **Gap Analysis**: Overnight gap percentage.
10. **Fibonacci Levels**: Current price relative to 20-day 50% retracement.
11. **Trend Regime**: SMA-slope analysis.
12. **Event Volatility**: Macro-economic calendar status.
13. **Moving Averages**: Fast (20) SMA structural position.

---

## 🔬 The Shadow Lab (Disconnected Components)

### 1. PPO Grandmaster (`engine/models/`)
*   **Role**: Evaluates if a Reinforcement Learning policy can outperform the Supervised Ensemble.
*   **Connectivity**: **None.** Its output (`ppo_strategy`) is recorded in JSON metadata for research but is physically unable to alter the `FINAL VERDICT` due to the SentientBrain logic.
*   **Environment**: Custom `TradyxaApeXEnv` (Gymnasium).

### 2. Angel Council (`experimental_omni/genetic_engine.py`)
*   **Role**: Symbolic Regression. It attempts to "discover" new indicators by mathematically combining OHLCV terminals.
*   **Method**: Genetic Programming (Crossover, Mutation, Evolution).
*   **Fitness**: Correlation to "Tomorrow's Direction."
*   **Connectivity**: **Zero.** It runs in a separate process/module to feed into future architectural blueprints.

---

> [!IMPORTANT]
> **The v7.0 Invariant**: All "learning" (Online Learner) is applied as a **conviction multiplier** to the final verdict, NEVER as an update to the underlying model weights during live rounds. This ensures the engine remains stable and defensible against "learning drift."
