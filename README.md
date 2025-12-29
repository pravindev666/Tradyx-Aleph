# ApeX Living Brain 7.0: The Complete Master Flow

## 🌐 End-to-End System Architecture
This diagram represents the full logic flow of the current **ApeX System (v6.5+)**, from the initial data fetch to the final pixel on the user's screen.

---

```mermaid
graph TD
    %% --- STEP 1: DATA INGESTION ---
    subgraph INGESTION [1. Data Ingestion Layer]
        NSE[NSE/Yahoo Feed] -->|Live tick| Fetcher[Fetcher Engine]
        NSE -->|Option Chain| OptScraper[Options Scraper]
        
        Fetcher -->|OHLCV History| RawData[Raw Market Data]
        OptScraper -->|OI/PCR| RawData
    end

    %% --- STEP 2: PILLAR ANALYTICS ---
    subgraph ANALYTICS [2. Analytics Layer]
        RawData --> Engine[Pillar Engine]
        Engine -->|Calculates| Pillars[Trend / Vol / Struct Pillars]
        
        %% Regime Context
        RawData --> VolGuard[Volatility Guard]
        VolGuard -->|Stress Score %| Context[Market Context]
        
        %% Drift Feedback (Drift++)
        Logs[(predictions.csv)] -.->|Read Hit-Rate/MAE| Drift[Drift Monitor]
        Drift -->|Self-Correction| Context
    end

    %% --- STEP 3: THE STRATEGIC SPLIT (Level 5) ---
    subgraph SPLIT [3. The Strategic Fork]
        RawData -->|Slice: T-1 (Yesterday)| Data_S[Strategic Data]
        RawData -->|Slice: T (Current)| Data_T[Tactical Data]
        
        %% Feature Engineering
        Data_S --> Feat_S[Feature Eng (Daily)]
        Data_T --> Feat_T[Feature Eng (Intraday)]
    end

    %% --- STEP 4: DUAL INFERENCE ---
    subgraph INFERENCE [4. Inference Engine]
        %% Path A: Strategic
        Feat_S --> XGB_D[XGBoost Daily]
        XGB_D -->|Raw Prob| Sig_S(Strategic Signal)
        
        %% Path B: Tactical
        Feat_T --> XGB_M[XGBoost Momentum]
        XGB_M -->|Raw Prob| Sig_T(Tactical Signal)
        
        %% PPO (Shadow Mode)
        Feat_S -.-> PPO[PPO Agent]
        PPO -.->|Action| Sig_PPO(RL Strategy)
    end

    %% --- STEP 5: THE SENTIENT BRAIN (Level 6.5) ---
    subgraph BRAIN [5. Sentient Brain Logic]
        Sig_S & Sig_T --> Processor
        Context --> Processor
        
        %% Logic Blocks
        subgraph LOGIC [Meta-Cognition]
            Immunity[1. Strategic Immunity <br/> (No Decay for Daily)]
            RegimeDecay[2. Regime-Weighted Decay <br/> (Factor * Stress%)]
            Abstain[3. Abstain Filter <br/> (Conf < 55% = Neutral)]
        end
        
        Processor --- Immunity
        Processor --- RegimeDecay
        RegimeDecay --> Abstain
    end

    %% --- STEP 6: OUTPUT & UI ---
    subgraph UI [6. User Interface]
        Abstain -->|Daily Verdict| Tile1[Tile: TOMORROW'S DIRECTION]
        Abstain -->|Momentum Verdict| Tile2[Tile: LIVE MOMENTUM]
        Sig_PPO -->|Strategy| Tile3[Tile: GRANDMASTER]
        
        %% Logging Loop
        Tile1 & Tile2 -->|Log Result| Logs
    end

    %% Styles
    linkStyle default stroke:#666,stroke-width:1px
    style BRAIN fill:#1e1e2e,stroke:#8b5cf6,stroke-width:3px
    style SPLIT fill:#0f172a,stroke:#3b82f6,stroke-width:2px
    style INFERENCE fill:#18181b,stroke:#22c55e,stroke-width:2px
    style UI fill:#000,stroke:#f59e0b,stroke-width:2px
    style Logs fill:#4a0404,stroke:#ef4444
    style Context fill:#4338ca,stroke:#818cf8
```

---

## 🏗️ Technical Pipeline Summary

1.  **Ingestion:** Fetches standard `yfinance` data + Option Chain.
2.  **Context Building:** Calculates `Volatility Stress` (for decay) and `Drift Error` (for self-awareness).
3.  **The Split:**
    *   **Strategic Path:** Cuts data at `Index[-2]` (Yesterday). **Immune** to today's noise.
    *   **Tactical Path:** Uses `Index[-1]` (Today). **Exposed** to live volatility.
4.  **Inference:** Runs separated XGBoost models for each path.
5.  **The Brain (v6.5):**
    *   Applies **Strategic Immunity** (Daily signal stays strong).
    *   Applies **Regime Decay** (Tactical signal rots faster if Stress is high).
    *   Applies **Abstain Logic** (Vetoes weak signals < 55%).
6.  **Display:** Renders the final cleansed verdict to the specific tiles.
