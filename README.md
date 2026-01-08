# ApeX V8.0 Master Architecture Documentation

## 1. Codebase Structure Mindmap

```mermaid
mindmap
  root((Tradyxa ApeX))
    src
      app
        layout.tsx
        page.tsx
      components
        LegalModal.tsx["LegalModal.tsx<br/>(Developer Vault)"]
        Dashboard.tsx
    backtests_v7
      data
        CSV_Hist["(Historical CSVs)"]
        Results["backtest_results.csv"]
      models_extended
        PKL["(XGB/LGB/RF .pkl files)"]
      trainer.py["trainer.py<br/>(Model Creator)"]
      engine.py["engine.py<br/>(Backtest Simulator)"]
      visualizer.py["visualizer.py<br/>(Chart/JSON Generator)"]
    engine
      main_inference.py["main_inference.py<br/>(Live Signals)"]
      scripts
        accuracy_tracker.py["accuracy_tracker.py<br/>(Self-Correction)"]
        prediction_logger.py
    public
      assets
        backtests
          vault_stats.json["vault_stats.json<br/>(Live Data Source)"]
          Charts["(Charts.png)"]
    .github
      workflows
        apex_inference.yml["apex_inference.yml<br/>(Automation Pipeline)"]
```

## 2. CI/CD Pipeline Architecture (GitHub Actions)
**Frequency**: Daily (Market Hours)
**File**: `.github/workflows/apex_inference.yml`

```mermaid
graph TD
    Start["Trigger: Cron Schedule"] --> Checkout["Checkout Repo"]
    Checkout --> Install["Install Deps<br/>(Pandas, XGBoost, Matplotlib)"]
    Install --> Inf["Run Inference<br/>(Global Sentinel)"]
    Inf --> Log["Log Predictions<br/>(prediction_logger.py)"]
    Log --> Acc["Self-Correction<br/>(accuracy_tracker.py)"]
    Acc --> BT["Run Backtest Engine<br/>(engine.py --start 2024)"]
    BT --> Vis["Run Visualizer<br/>(visualizer.py)"]
    Vis --> Commit["Commit Results<br/>(JSON + PNGs)"]
    Commit --> Deploy["Deploy to Frontend"]
    
    style Start fill:#f9f,stroke:#333
    style Deploy fill:#9f9,stroke:#333
```

## 3. Algorithmic Logic Architecture

### A. The Trainer (Knowledge Base)
**File**: `backtests_v7/trainer.py`
```mermaid
flowchart LR
    Raw["Raw Stock Data<br/>(2005-2023)"] --> Eng["Feature Engineer"]
    Eng --> Feats["Technical Features<br/>(RSI, MACD, Volatility)"]
    Feats --> Split["Train/Test Split"]
    Split --> XGB["XGBoost Training"]
    Split --> LGB["LightGBM Training"]
    Split --> RF["Random Forest Training"]
    XGB & LGB & RF --> Models["Saved Models<br/>(.pkl)"]
```

### B. The Engine (Decision Maker)
**File**: `backtests_v7/engine.py`
```mermaid
flowchart TD
    Models[("Trained Models")] --> Loop
    Live[("Live Daily Data")] --> Loop
    
    subgraph Daily Loop
        Step1{"Large Trend?<br/>(SMA50 > 200)"}
        Step1 -- "Bullish Trend" --> Trend["Force LONG<br/>(Trend Following)"]
        Step1 -- "Bearish/Neutral" --> CheckML{"ML Score > 0.6?"}
        CheckML -- Yes --> Bottom["Bottom Fishing<br/>(ML Contrarian Buy)"]
        CheckML -- No --> Cash["Stay in CASH<br/>(Defensive)"]
    end
    
    Loop --> Rec["Record Equity"]
    Rec --> CSV["backtest_results.csv"]
```

### C. The Visualizer (Translator)
**File**: `backtests_v7/visualizer.py`
```mermaid
flowchart LR
    CSV["backtest_results.csv"] --> Load["Load Data"]
    Load --> Calc["Calculate Stats<br/>(Returns, Drawdowns)"]
    Calc --> Plot["Generate Plots<br/>(Matplotlib)"]
    Calc --> JSON["Generate JSON<br/>(vault_stats.json)"]
    
    Plot --> Assets[("PNG Assets")]
    JSON --> Assets
```

## 4. Self-Correction Architecture
**Concept**: The system adapts its weights based on recent performance.

```mermaid
stateDiagram-v2
    [*] --> Monitor
    Monitor --> Check: Weekly Review
    state "Accuracy Tracker" as Check {
        [*] --> Compare
        Compare --> WinRate: Calculate Last 10 Trades
        WinRate --> Threshold: Adjust Threshold
        Threshold --> Weights: Re-balance Model Weights
    }
    Weights --> Engine: Update Logic
    Engine --> Monitor: Generate New Data
```
