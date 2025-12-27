graph TD
    subgraph "ZETAX (The Executive)"
        Z_DATA[Data Fetcher] --> Z_FE[68 Features]
        Z_FE --> Z_COUNCIL[Council: 8 Models\nHMM, BERT, LSTM, etc.]
        Z_COUNCIL --> Z_META[Meta-Judge]
        Z_META --> Z_UI[Dashboard]
        
        %% ZetaX Learning Loop
        Z_UI --> Z_LEARN["Online Learner (Living Brain)\nUpdates Weights DYNAMICALLY"]
        Z_LEARN -.->|Weight Injection| Z_META
    end

    subgraph "APEX (The Sniper)"
        A_DATA[Data Vault] --> A_FE[13 Pillars]
        A_FE --> A_ENSEMBLE[Ensemble: 3 Main Models\nXGB, LGBM, RF]
        A_ENSEMBLE --> A_BRAIN["SENTIENT BRAIN\n(Bayesian Self-Correction)"]
        A_BRAIN --> A_UI[Dashboard]
        
        %% ApeX Learning Loop
        A_UI --> A_NIGHT["Nightly Review\nChecks Yesterday's Win/Loss"]
        A_NIGHT -->|Updates Streak| A_BRAIN
        A_NIGHT -->|Weekly Trigger| A_TRAIN[Full Retrain]
    end

    style Z_LEARN fill:#ff9999,stroke:#333
    style A_BRAIN fill:#99ff99,stroke:#333
    style A_NIGHT fill:#99ff99,stroke:#333
