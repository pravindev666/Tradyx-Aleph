# ZetaX vs DeltaX Architecture Audit

This document provides a comprehensive comparison of the **Tradyxa-ZetaX** and **Tradyxa-DeltaX** projects after the Sentient v2.0 integration.

---

## Executive Summary

| Aspect | ZetaX | DeltaX |
|--------|-------|--------|
| **App.tsx Size** | 91KB (1430 lines) | 54KB (922 lines) |
| **Package Name** | `tradyxa-rubix` | `tradyxa-deltax` |
| **Version** | `0.0.0` | `6.0.0-SENTIENT` |
| **Primary Script** | `engine/scripts/infer.py` (1317 lines) | `scripts/predict.py` (458 lines) |
| **Engine Scripts** | 26 Python modules | 5 Python modules |
| **Data Service** | `services/marketData.ts` | Direct JSON fetch |
| **Components** | 2 files (`charts.tsx`, `ui.tsx`) | 5 files (Modals, Tiles, etc.) |

---

## Key Differences

### 1. Frontend Architecture

#### ZetaX
- **Design Pattern**: Data service-driven (`services/marketData.ts`)
- **UI Components**: Generic reusable components in `charts.tsx` and `ui.tsx`
- **State Management**: Single `MarketDataState` interface with 25+ tiles
- **Legal Pages**: Embedded inline in `App.tsx`

#### DeltaX
- **Design Pattern**: Direct JSON consumption from `public/data/auztinx_data.json`
- **UI Components**: Purpose-built components (`KineticTiles.tsx`, `Modals.tsx`, `LegalOverlay.tsx`)
- **State Management**: Separate `AuztinXData` interface focused on core metrics
- **Legal Pages**: Extracted to `LegalOverlay.tsx` component

### 2. Backend / ML Engine

#### ZetaX Engine (`engine/scripts/`)
Contains **26 specialized scripts**:
- `infer.py` (1317 lines) - Main inference pipeline
- `accuracy_tracker.py`, `confidence_calibrator.py`, `online_learner.py` - Self-learning
- `lstm_sequence.py`, `tcn_regime.py`, `xgb_momentum.py` - Deep learning models
- `rf_reversal.py`, `hmm_regime.py` - Statistical models
- `anomaly_detector.py`, `red_team_protocol.py` - Risk validators
- `gbm_divergence.py`, `friday_fear.py`, `qr_range.py` - Custom indicators
- `sentiment_engine.py`, `llm_synthesizer.py` - NLP components
- `data_fetcher.py`, `feature_builder.py` - Data engineering

#### DeltaX Engine (`scripts/`)
Contains **5 core scripts**:
- `predict.py` (458 lines) - Simplified inference
- `train_models.py` (22KB) - Model training
- `data_manager.py` - Historical data sync
- `executive_synthesis_llama.py` - LLM narrative
- `red_team_veto.py` - Risk veto logic

### 3. Sentient v2.0 (SHARED)

Both projects now share the **same cognitive architecture**:

```
engine/cognitive/
├── __init__.py
├── bayesian_hypothesis.py   # Hypothesis testing
├── memory_systems.py        # Short/Long term memory
├── meta_cognition.py        # Self-awareness layer
└── sentient_pipeline.py     # Main orchestrator
```

> **Key Insight**: The Sentient v2.0 module is the ONLY component that is nearly identical between both projects. File sizes differ slightly due to index-specific adaptations.

### 4. TypeScript Interfaces

| Interface | ZetaX | DeltaX |
|-----------|-------|--------|
| **Lines** | 113 | 53 |
| **Tiles** | 25+ (embedded in `MarketDataState.tiles`) | 16 (via `MLTileData[]`) |
| **Sentient Fields** | `hero.sentientVerdict`, `hero.ultimateMl` | `sentient_data` object |
| **Categories** | N/A | `SNAPSHOT`, `INTRADAY`, `SWING`, `OPTIONS` |

### 5. Model Storage

| Folder | ZetaX | DeltaX |
|--------|-------|--------|
| `engine/models/` | 24 pre-trained models | N/A |
| `models/` | N/A | 8 models (RF, LSTM, XGB) |
| Learning | `engine/learning/` (5 files) | Integrated in `engine/logs/` |

---

## What's Different (Beyond Sentient 2.0)

1. **Dashboard Philosophy**
   - ZetaX: Research lab with 25+ indicators, deep analytics
   - DeltaX: Executive dashboard with 16 tiles, simplified view

2. **ML Pipeline Depth**
   - ZetaX: Full ML stack (LSTM, TCN, XGBoost, HMM, GBM, RF, QR)
   - DeltaX: Lightweight ensemble (RF, LSTM, XGBoost only)

3. **Data Sourcing**
   - ZetaX: `services/marketData.ts` with async fetching and local caching
   - DeltaX: Python-generated JSON consumed at build time

4. **Component Strategy**
   - ZetaX: 2 files with many inline components
   - DeltaX: 5 files with dedicated modal/overlay architecture

5. **Branding & Versioning**
   - ZetaX: `tradyxa-rubix` v0.0.0 (no sentient version tag)
   - DeltaX: `tradyxa-deltax` v6.0.0-SENTIENT (explicit versioning)

---

## What's the Same (Sentient 2.0 Core)

| Component | Both Projects |
|-----------|---------------|
| `bayesian_hypothesis.py` | Hypothesis testing with Bayesian priors |
| `memory_systems.py` | Short-Term and Long-Term memory |
| `meta_cognition.py` | Self-awareness and confidence recalibration |
| `sentient_pipeline.py` | Main Cognitive Auditor orchestration |
| Sentient Verdict | BULLISH/BEARISH/NEUTRAL with confidence % |
| Conflict Detection | "AGREES" or "CONFLICT DETECTED" |

---

## Conclusion

ZetaX and DeltaX are **fundamentally different products** that share only the **Sentient v2.0 Cognitive module**.

- **ZetaX** is a **research-grade platform** with 26+ ML models, deep feature engineering, and extensive analytics.
- **DeltaX** is a **streamlined decision engine** with fewer models but a more focused executive-style dashboard.

The Sentient v2.0 integration provides a **unified cognitive overlay** that can be applied to both architectures, ensuring consistent decision logic despite the underlying complexity differences.

---
*Audit generated: 2025-12-24*
