# Experiment: Historical Backtest (2024-2025)

## 🎯 Objective
Determine the performance of the ZetaX 7-Layer Ensemble model when trained on historical data up to **December 31, 2023**, and tested against the unseen market regimes of **2024 and 2025**.

## 📊 Methodology
1.  **Selection**: BTC-USD, ETH-USD, LTC-USD, XRP-USD.
2.  **Training Window**: Max historical data available -> 2023-12-31.
3.  **Testing Window**: 2024-01-01 -> Present (2025).
4.  **Engine**: Specialized `backtest_engine.py` using the main project's `FeatureGenerator`.
5.  **Metrics**:
    - Directional Accuracy (Hit Rate).
    - Cumulative Returns vs Buy & Hold.
    - Max Drawdown.
    - Sharpe Ratio.

## 📁 Structure
- `backtest_engine.py`: Core logic for data splitting, training, and simulation.
- `results/`: Directory for performance plots and CSV logs.
- `BACKTEST_REPORT.md`: This file (to be updated with results).

## 🚀 Execution
Run the following from the project root:
```bash
python experiments/backtest_2024_2025/backtest_engine.py
```

## Performance Results (Finalized)

| Symbol | Accuracy | Strategy Return | Market Return | Outperformance |
| :--- | :--- | :--- | :--- | :--- |
| BTC-USD | 50.34% | 97.02% | 107.80% | -10.78% |
| ETH-USD | 49.39% | 75.98% | 33.08% | +42.90% |
| LTC-USD | 53.43% | 231.58% | 2.10% | +229.48% |
| XRP-USD | 50.47% | 16.38% | 227.71% | -211.33% |

*Backtest generated on 2026-01-13 11:14:18*

### Visual Evidence
#### BTC-USD Performance
![BTC-USD Chart](results/BTC-USD_performance.png)
#### ETH-USD Performance
![ETH-USD Chart](results/ETH-USD_performance.png)
#### LTC-USD Performance
![LTC-USD Chart](results/LTC-USD_performance.png)
#### XRP-USD Performance
![XRP-USD Chart](results/XRP-USD_performance.png)

