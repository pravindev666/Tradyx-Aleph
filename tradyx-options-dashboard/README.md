# Tradyx Quant Dashboard

Advanced NIFTY Options Analytics & Machine Learning Forecasts

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate dashboard data
cd scripts
pip install -r requirements.txt
python run_all.py
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
tradyx-options-dashboard/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── legal/             # Legal pages (Privacy, Terms, etc.)
│   └── page.tsx           # Main dashboard page
├── components/             # Shared React components
│   └── dashboard/         # Dashboard-specific components
├── scripts/               # Python data generation scripts
│   ├── data/              # Generated JSON data
│   └── run_all.py         # Master script to run all
├── public/                # Static assets
│   └── data/              # Dashboard JSON (for Next.js)
└── hooks/                 # React hooks
    └── useDashboard.ts    # Dashboard data hook
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_DASHBOARD_URL` - Path to dashboard.json
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` - Your AdSense client ID
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)

### Python Dependencies

Install Python dependencies:

```bash
cd scripts
pip install -r requirements.txt
```

## 📊 Data Generation

### Run All Scripts

```bash
cd scripts
python run_all.py
```

### Individual Scripts

1. `fetch_nse_chain.py` - Fetch NSE option chain
2. `fetch_yf.py` - Fetch yfinance data (spot, VIX)
3. `fetch_predictions.py` - Fetch OHLC and sector data
4. `compute_metrics.py` - Compute option metrics
5. `compute_volatility_indicators.py` - Compute volatility indicators
6. `compute_ml_predictions.py` - Compute ML predictions
7. `compute_breadth_momentum.py` - Compute drift and momentum
8. `build_dashboard_json.py` - Build final dashboard.json

## 🚢 Deployment

### GitHub Actions

The repository includes automated workflows:

- **Deploy** (`.github/workflows/deploy.yml`) - Full deployment pipeline
- **Data Update** (`.github/workflows/data-update.yml`) - Automated data updates
- **CI/CD** (`.github/workflows/ci.yml`) - Continuous integration

### Vercel Deployment

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📝 Documentation

- `scripts/README.md` - Data generation guide
- `scripts/UPDATE_GUIDE.md` - Troubleshooting guide
- `scripts/DATA_SOURCE_PRIORITY.md` - Data source information
- `DEPLOYMENT.md` - Production deployment guide

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS
- **Backend**: Python 3.12
- **Data Sources**: yfinance, NSE India API
- **ML Models**: scikit-learn, statsmodels, TensorFlow
- **Deployment**: Vercel, GitHub Actions

## 📄 License

All Rights Reserved. See `LICENSE` for details.

## 📧 Support

Contact: support@tradyx.in

---

Built with ❤️ By Pravin A. Mathew

