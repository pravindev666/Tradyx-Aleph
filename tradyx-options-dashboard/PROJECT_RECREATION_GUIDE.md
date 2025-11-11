# Tradyxa Options Dashboard - Complete Project Recreation Guide

A comprehensive step-by-step guide to recreate the entire Tradyxa Options Dashboard project with all its themes, fonts, architecture, formulas, ad placements, and configurations.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Setup](#project-setup)
4. [Theme System](#theme-system)
5. [Fonts Configuration](#fonts-configuration)
6. [Architecture & Data Flow](#architecture--data-flow)
7. [Mathematical Formulas](#mathematical-formulas)
8. [Ad Integration System](#ad-integration-system)
9. [Component Structure](#component-structure)
10. [Deployment Configuration](#deployment-configuration)
11. [Step-by-Step Recreation](#step-by-step-recreation)
12. [Testing & Validation](#testing--validation)

---

## 🎯 Project Overview

The Tradyxa Options Dashboard is a real-time financial analytics platform built with Next.js, React, TypeScript, and Python. It provides:

- **Real-time NIFTY Options Data** from NSE
- **Volatility Indicators** (10+ metrics)
- **Machine Learning Predictions**
- **Market Mood Index (MMI)** calculation
- **Ad Integration** with Adsterra
- **Dark/Light Theme** support
- **Responsive Design** for all devices

### Key Features

- 📊 Real-time options chain data
- 📈 Volatility forecasting
- 🤖 ML-based predictions
- 🎨 Modern glass morphism UI
- 🌓 Dark/Light mode
- 📱 Mobile responsive
- 🚀 Fast performance (Next.js SSR)
- 🔒 Security headers (CSP, etc.)
- 📢 Ad monetization integration

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.0 | React framework with App Router |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.6.2 | Type safety |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS |
| **Framer Motion** | 11.18.2 | Animations |
| **Lucide React** | 0.446.0 | Icons |
| **SWR** | 2.3.6 | Data fetching & caching |
| **Zod** | 3.23.8 | Schema validation |
| **Axios** | 1.13.2 | HTTP client |

### Backend/Data Processing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.12+ | Data processing |
| **NumPy** | >=1.24.0 | Numerical computations |
| **Pandas** | >=2.0.0 | Data manipulation |
| **scikit-learn** | >=1.3.0 | Machine learning |
| **yfinance** | >=0.2.0 | Market data |

### Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **GitHub Actions** | CI/CD & data updates |
| **GitHub** | Version control |

---

## 🚀 Project Setup

### Step 1: Initialize Next.js Project

```bash
# Create Next.js project with TypeScript and Tailwind
npx create-next-app@latest tradyx-options-dashboard --typescript --tailwind --app
cd tradyx-options-dashboard

# Install required dependencies
npm install framer-motion lucide-react next-themes swr axios zod class-variance-authority clsx tailwind-merge yahoo-finance2
npm install -D @types/node @types/react @types/react-dom autoprefixer postcss
```

### Step 2: Install Python Dependencies

```bash
# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python packages
cd scripts
pip install -r requirements.txt
```

**File**: `scripts/requirements.txt`

```txt
numpy>=1.24.0
pandas>=2.0.0
scikit-learn>=1.3.0
yfinance>=0.2.0
requests>=2.31.0
```

---

## 🎨 Theme System

### Theme Architecture

The project uses a sophisticated dark/light theme system with blue-cyan accents and glass morphism effects.

### Color Palette

#### Light Mode
- **Background**: White/Gray gradients (`#ffffff`, `#f8fafc`)
- **Primary**: Blue (`#3b82f6`, `#60a5fa`, `#93c5fd`)
- **Accent**: Cyan (`#06b6d4`, `#22d3ee`)
- **Text**: Dark gray/Black (`#1e293b`, `#0f172a`)
- **Cards**: White with glass effect (`rgba(255, 255, 255, 0.6)`)

#### Dark Mode
- **Background**: Dark gray/Black (`#0f172a`, `#1e293b`, `#334155`)
- **Primary**: Blue (`#3b82f6`, `#60a5fa`, `#93c5fd`)
- **Accent**: Cyan (`#06b6d4`, `#22d3ee`)
- **Text**: Light gray/White (`#f1f5f9`, `#e2e8f0`)
- **Cards**: Dark with glass effect (`rgba(39, 39, 42, 0.5)`)

### Tailwind Configuration

**File**: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: { 
        brand: { 
          400: '#22d3ee', 
          500: '#06b6d4' 
        } 
      },
      boxShadow: {
        glass: '0 1px 0 rgba(255,255,255,.08) inset, 0 10px 30px -12px rgba(2,6,23,.45)'
      }
    },
  },
  plugins: [],
};
```

### Global Styles

**File**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: var(--font-inter, system-ui), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

@layer components {
  .card {
    @apply rounded-2xl border border-white/10 bg-white/60 dark:bg-zinc-900/50 backdrop-blur dark:border-white/5;
    box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 10px 30px -12px rgba(2,6,23,.45);
  }
}

.card-gradient::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(34,211,238,.55), rgba(6,182,212,.15), rgba(255,255,255,0));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1px;
  pointer-events: none;
}

.electric-glow {
  filter: drop-shadow(0 0 6px rgba(34,211,238,.9));
}

/* Blue backlit hover effect for tiles */
.tile-hover-gold {
  transition: all 0.3s ease;
  position: relative;
  isolation: isolate;
}

.tile-hover-gold:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 0 2px rgba(59, 130, 246, 0.8),
    0 0 15px rgba(59, 130, 246, 0.6),
    0 0 30px rgba(59, 130, 246, 0.4),
    0 0 45px rgba(59, 130, 246, 0.2);
}

/* Ad container - transparent */
.ad-container-transparent {
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

/* Infinity Loader Animation */
@keyframes electricFlow {
  0% {
    stroke-dashoffset: 80;
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0.6;
  }
}

.infinity-path-left,
.infinity-path-right,
.infinity-glow-left,
.infinity-glow-right {
  animation: electricFlow 2s linear infinite;
}

.infinity-path-right {
  animation-delay: 1s;
}

.infinity-glow-left {
  animation-delay: 0.5s;
}

.infinity-glow-right {
  animation-delay: 1.5s;
}
```

### Theme Toggle Component

**File**: `components/layout/ThemeToggle.tsx`

```typescript
'use client';

import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function ThemeToggle({ darkMode, setDarkMode }: ThemeToggleProps) {
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white/10 dark:bg-zinc-800/50 hover:bg-white/20 dark:hover:bg-zinc-700/50 transition-colors"
      aria-label="Toggle theme"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
```

---

## 🔤 Fonts Configuration

### Google Fonts Setup

The project uses three Google Fonts optimized for different purposes:

1. **Inter** - Primary UI font (optimized for dashboards)
2. **JetBrains Mono** - Numeric/Value areas (perfect alignment for volatility metrics)
3. **Manrope** - Brand/Logo font (high-tech premium edge)

**File**: `app/layout.tsx`

```typescript
import { Inter, JetBrains_Mono, Manrope } from 'next/font/google';

// Inter - Primary UI font (optimized for dashboards)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

// JetBrains Mono - Numeric/Value areas (perfect alignment for volatility metrics)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['monospace', 'Courier New', 'mono'],
});

// Manrope - Brand/Logo font (high-tech premium edge)
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${manrope.variable}`}>
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950`}>
        {children}
      </body>
    </html>
  );
}
```

### Font Usage

- **Inter (font-sans)**: Default UI text, body content
- **JetBrains Mono (font-mono)**: Numbers, prices, percentages, volatility metrics
- **Manrope (font-brand)**: Brand name, headings, premium UI elements

### Font Licenses

- **Inter**: SIL Open Font License (Free)
- **JetBrains Mono**: Apache 2.0 (Free)
- **Manrope**: SIL Open Font License (Free)

All fonts are loaded via Next.js font optimization for optimal performance.

### Alternative Font Setup

If you prefer different fonts:

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950`}>
        {children}
      </body>
    </html>
  );
}
```

---

## 🏗️ Architecture & Data Flow

### System Architecture

```
┌─────────────────┐
│   Data Sources  │
│  NSE API, YF    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Python Scripts  │
│  Data Processing│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  dashboard.json │
│  (Static JSON)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js App   │
│  React Components│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   User Browser  │
│   (Dashboard)   │
└─────────────────┘
```

### Data Flow

1. **Data Collection**: Python scripts fetch data from NSE API and Yahoo Finance
2. **Data Processing**: Scripts compute metrics, indicators, and ML predictions
3. **JSON Generation**: Processed data is written to `public/data/dashboard.json`
4. **Frontend Fetching**: Next.js app fetches JSON using SWR
5. **UI Rendering**: React components render the dashboard

### Project Structure

```
tradyx-options-dashboard/
├── app/                          # Next.js App Router
│   ├── fonts/                   # Font directory (Google Fonts: Inter, JetBrains Mono, Manrope)
│   ├── globals.css              # Global styles & theme
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main dashboard page
│   └── components/              # App-specific components
│
├── components/                   # React components
│   ├── ads/                     # Ad components
│   ├── dashboard/               # Dashboard components
│   ├── layout/                  # Layout components
│   └── ui/                      # UI components
│
├── hooks/                        # React hooks
│   └── useDashboard.ts          # Dashboard data hook
│
├── lib/                          # Utility libraries
│   ├── fetcher.ts               # Data fetching
│   ├── fmt.ts                   # Formatting
│   ├── types.ts                 # TypeScript types
│   └── schema.ts                # Zod schemas
│
├── scripts/                      # Python data generation
│   ├── fetch_nse_chain.py      # Fetch NSE data
│   ├── fetch_yf.py              # Fetch Yahoo Finance data
│   ├── compute_metrics.py       # Compute metrics
│   ├── compute_volatility_indicators.py
│   ├── compute_ml_predictions.py
│   └── build_dashboard_json.py  # Build final JSON
│
├── public/                       # Static assets
│   └── data/
│       └── dashboard.json       # Main data file
│
├── .github/                      # GitHub Actions
│   └── workflows/
│       └── data-update.yml      # Automated data updates
│
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── package.json                  # Dependencies
```

---

## 📐 Mathematical Formulas

### 1. IV Rank (Implied Volatility Rank)

**Formula**: `IV Rank = ((Current IV - 52W Low IV) / (52W High IV - 52W Low IV)) × 100`

**Implementation**: `scripts/compute_metrics.py`

```python
def calculate_iv_rank(vix, vix_52w_high, vix_52w_low):
    """Calculate IV Rank from VIX values"""
    if not vix_52w_high or not vix_52w_low or vix_52w_high <= vix_52w_low:
        return None
    ivr = ((vix - vix_52w_low) / (vix_52w_high - vix_52w_low)) * 100
    return round(max(0, min(100, ivr)), 1)
```

### 2. Realized Volatility (RV)

**Formula**: `RV = √252 × stdev(ln(Pₜ/Pₜ₋₁), N=20)`

**Implementation**: `scripts/compute_volatility_indicators.py`

```python
def calculate_realized_volatility(closes, window=20):
    """Calculate Realized Volatility from closing prices"""
    if len(closes) < window + 1:
        return None
    
    # Calculate log returns
    log_returns = []
    for i in range(1, len(closes)):
        if closes[i-1] > 0 and closes[i] > 0:
            log_ret = math.log(closes[i] / closes[i-1])
            log_returns.append(log_ret)
    
    if len(log_returns) < window:
        return None
    
    # Use last N returns
    recent_returns = log_returns[-window:]
    
    # Calculate standard deviation
    mean_ret = np.mean(recent_returns)
    variance = np.mean([(r - mean_ret) ** 2 for r in recent_returns])
    std_dev = math.sqrt(variance)
    
    # Annualize: √252 × std_dev
    rv = std_dev * math.sqrt(252) * 100  # Convert to percentage
    return round(rv, 2)
```

### 3. HV-IV Spread

**Formula**: `HV-IV Spread = VIX - RV`

**Implementation**: `scripts/compute_volatility_indicators.py`

```python
def calculate_hv_iv_spread(rv, vix):
    """Calculate HV-IV Spread"""
    if rv is None or vix is None:
        return None
    spread = vix - rv
    return round(spread, 2)
```

### 4. Parkinson Volatility

**Formula**: `σ_p = √((1/(4×ln(2))) × mean((ln(H/L))²))`

**Implementation**: `scripts/compute_volatility_indicators.py`

```python
def calculate_parkinson_volatility(highs, lows, window=20):
    """Calculate Parkinson Volatility from high/low data"""
    if len(highs) < window or len(lows) < window:
        return None
    
    # Use last N days
    recent_highs = highs[-window:]
    recent_lows = lows[-window:]
    
    # Calculate ln(H/L)²
    log_hl_sq = []
    for h, l in zip(recent_highs, recent_lows):
        if h > 0 and l > 0 and h >= l:
            log_hl = math.log(h / l)
            log_hl_sq.append(log_hl ** 2)
    
    if len(log_hl_sq) < window:
        return None
    
    # Parkinson formula: σ_p = sqrt((1/(4*ln(2))) * mean((ln(H/L))²))
    variance = (1 / (4 * math.log(2))) * np.mean(log_hl_sq)
    volatility = math.sqrt(variance)
    
    # Annualize (multiply by sqrt(252) for daily data)
    annualized_vol = volatility * math.sqrt(252) * 100  # Convert to percentage
    return round(annualized_vol, 2)
```

### 5. Expected Move (1-Day)

**Formula**: `EM = Spot × (VIX/100) × √(1/365)`

**Implementation**: `scripts/compute_volatility_indicators.py`

```python
def calculate_expected_move_1day(spot, vix):
    """Calculate Expected Move (1-Day)"""
    if not spot or not vix or spot <= 0:
        return None
    em = spot * (vix / 100) * math.sqrt(1 / 365)
    return round(em, 2)
```

### 6. Expected Move (Weekly)

**Formula**: `EM Weekly = Spot × (VIX/100) × √(7/365)`

**Implementation**: `scripts/compute_predictions.py`

```python
def calculate_expected_move(spot, iv, days=1):
    """Calculate Expected Move from IV"""
    if not spot or not iv or spot <= 0:
        return None
    iv_decimal = iv / 100  # Convert percentage to decimal
    expected_move = spot * iv_decimal * math.sqrt(days / 365)
    expected_move_pct = (expected_move / spot) * 100
    return {
        "value": round(expected_move, 2),
        "valuePct": round(expected_move_pct, 2),
    }
```

### 7. VIX-NIFTY Correlation

**Formula**: `Correlation = corr(ΔVIX, ΔNIFTY)`

**Implementation**: `scripts/compute_volatility_indicators.py`

```python
def calculate_vix_nifty_correlation(vix_series, nifty_returns, window=30):
    """Calculate VIX-NIFTY Correlation"""
    if len(vix_series) < window + 1 or len(nifty_returns) < window:
        return None
    
    # Calculate VIX changes
    vix_changes = []
    for i in range(1, len(vix_series)):
        if vix_series[i-1] > 0:
            vix_change = (vix_series[i] - vix_series[i-1]) / vix_series[i-1]
            vix_changes.append(vix_change)
    
    # Align lengths
    min_len = min(len(vix_changes), len(nifty_returns))
    vix_changes = vix_changes[-min_len:]
    nifty_returns = nifty_returns[-min_len:]
    
    if min_len < window:
        return None
    
    # Calculate correlation
    correlation = np.corrcoef(vix_changes, nifty_returns)[0, 1]
    return round(correlation, 3)
```

### 8. Volatility Risk Premium (VRP)

**Formula**: `VRP = (IV - RV) / IV`

**Implementation**: `scripts/compute_volatility_indicators.py`

```python
def calculate_volatility_risk_premium(vix, rv):
    """Calculate Volatility Risk Premium"""
    if not vix or not rv or vix <= 0:
        return None
    vrp = (vix - rv) / vix
    return round(vrp, 4)
```

### 9. Market Mood Index (MMI)

**Formula**: `MMI = 100 × (1 / (1 + exp(-k × Z)))`

Where:
- `Z = w₁×z₁ + w₂×z₂ + w₃×z₃ + w₄×z₄ + w₅×z₅`
- `z₁ = -z(VIX, μ_VIX, σ_VIX)` (flipped for bullish)
- `z₂ = z(PCR, μ_PCR, σ_PCR)`
- `z₃ = -z(IVR, μ_IVR, σ_IVR)` (flipped for bullish)
- `z₄ = z(ADR, μ_ADR, σ_ADR)`
- `z₅ = -z(RV/IV, μ_RV/IV, σ_RV/IV)` (flipped for bullish)

**Weights**: `w₁=0.25, w₂=0.25, w₃=0.20, w₄=0.20, w₅=0.10`
**Squash Factor**: `k = 0.75`

**Implementation**: `components/dashboard/mmi.ts`

```typescript
export function computeMMI(inp: MMIInputs) {
  const m = { ...DEF_MEAN, ...(inp.means || {}) } as Record<string, number>;
  const s = { ...DEF_STD,  ...(inp.stds  || {}) } as Record<string, number>;

  // Flip signs so "positive = bullish"
  const zvix   = -z(inp.vix, m.vix, s.vix);
  const zpcr   =  z(inp.pcr, m.pcr, s.pcr);
  const zivr   = -z(inp.ivr, m.ivr, s.ivr);
  const zadr   =  z(inp.adr, m.adr, s.adr);
  const zrviv  = -z(inp.rvOverIv, m.rvOverIv, s.rvOverIv);

  const weights = { vix:0.25, pcr:0.25, ivr:0.20, adr:0.20, rviv:0.10 };
  const Z =
    weights.vix * zvix +
    weights.pcr * zpcr +
    weights.ivr * zivr +
    weights.adr * zadr +
    weights.rviv * zrviv;

  // Squash to 0–100
  const k = 0.75;
  const logistic = 1 / (1 + Math.exp(-k * Z));
  const mmi = Math.max(0, Math.min(100, 100 * logistic));

  let regime: 'Extreme Fear'|'Fear'|'Neutral'|'Greed'|'Extreme Greed' = 'Neutral';
  if (mmi < 25) regime = 'Extreme Fear';
  else if (mmi < 45) regime = 'Fear';
  else if (mmi <= 55) regime = 'Neutral';
  else if (mmi <= 75) regime = 'Greed';
  else regime = 'Extreme Greed';

  return { mmi, regime, z: { zvix, zpcr, zivr, zadr, zrviv }, Z };
}
```

### 10. Range Compression Index

**Formula**: `RCI = (Current Range / Average Range)`

**Implementation**: Calculated from high-low data over a rolling window.

### 11. Momentum Strength

**Formula**: `Momentum = (Current Price - Price N days ago) / Price N days ago × 100`

**Implementation**: Calculated from closing prices over various timeframes.

### 12. Drift Direction

**Formula**: `Drift = EMA(20) - EMA(50)`

**Implementation**: Calculated using exponential moving averages.

---

## 📢 Ad Integration System

### Ad Configuration

**File**: `components/ads/AdConfig.ts`

```typescript
// Centralized Ad Configuration
export const AD_KEYS = {
  BANNER_728x90: 'b4903cf5635d652e019f9cf30ea1cd88',
  BANNER_468x60: 'd8c93074244d311adc394f3a309c3118',
  RECTANGLE_300x250: '2f370fd28cbdeb2108926fba77c70947',
  MOBILE_320x50: '35bb5972176687c2571d4f6e436e1f71',
} as const;

export const AD_SIZES = {
  BANNER_728x90: { width: 728, height: 90 },
  BANNER_468x60: { width: 468, height: 60 },
  RECTANGLE_300x250: { width: 300, height: 250 },
  MOBILE_320x50: { width: 320, height: 50 },
} as const;
```

### Ad Placements

1. **728x90 Banner** - Below Volatility Indicators (hidden until ad loads)
2. **468x60 Banner** - Above Prediction Models
3. **300x250 Rectangle** - Sidebar (top)
4. **320x50 Mobile** - Sidebar (bottom, mobile)

### Ad Component Structure

**File**: `components/ads/AdsterraBanner.tsx`

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';

interface AdsterraBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
  label?: string;
  loadDelay?: number;
}

export default function AdsterraBanner({ 
  adKey, 
  width, 
  height, 
  className = '',
  label = 'Advertisement',
  loadDelay
}: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ad loading logic
    // 1. Create options script with atOptions
    // 2. Create invoke script
    // 3. Append to container
    // 4. Check for iframe
    // 5. Mark as loaded when iframe appears
  }, [adKey, width, height, label, loadDelay]);

  return (
    <div className="w-full" style={{ minHeight: `${height}px`, position: 'relative' }}>
      <div 
        ref={containerRef}
        className={`ad-container-transparent rounded-lg ${className}`}
        style={{ 
          minHeight: `${height}px`, 
          width: '100%',
          maxWidth: `${width}px`,
          margin: '0 auto',
        }}
      >
        {/* Ad scripts injected here */}
      </div>
    </div>
  );
}
```

### Ad Placement in Dashboard

**File**: `components/dashboard/OptionsDashboard.tsx`

```typescript
{/* 728x90 Ad - Hidden initially, shows automatically when ad loads */}
<div 
  id="ad-728x90-container"
  style={{ 
    display: 'none', // Hidden initially
    position: 'relative',
    width: '100%',
    minHeight: '110px',
    margin: '1rem 0'
  }}
>
  <div className="flex justify-center w-full">
    <div className="w-full max-w-full sm:max-w-[800px]">
      <AdsterraBanner 
        adKey={AD_KEYS.BANNER_728x90}
        width={AD_SIZES.BANNER_728x90.width}
        height={AD_SIZES.BANNER_728x90.height}
        label="Banner 728x90"
        loadDelay={2000}
      />
    </div>
  </div>
</div>

{/* 468x60 Ad */}
<SafeAdWrapper>
  <div className="w-full flex justify-center my-4">
    <div className="w-full max-w-[550px]">
      <div className="ad-container-transparent p-3 sm:p-4 md:p-5 rounded-xl text-center" style={{ minHeight: '80px' }}>
        <AdsterraBanner 
          adKey={AD_KEYS.BANNER_468x60}
          width={AD_SIZES.BANNER_468x60.width}
          height={AD_SIZES.BANNER_468x60.height}
          label="Banner 468x60"
          loadDelay={0}
        />
      </div>
    </div>
  </div>
</SafeAdWrapper>
```

### CSP Headers for Ads

**File**: `next.config.js`

```javascript
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self' https: data: blob:;",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://www.highperformanceformat.com https://*.adsterra.com https://pl28016046.effectivegatecpm.com;",
            "connect-src 'self' https:;",
            "img-src 'self' https: data: blob:;",
            "style-src 'self' 'unsafe-inline' https:;",
            "frame-src https: data: https://www.highperformanceformat.com https://*.adsterra.com https://pl28016046.effectivegatecpm.com blob:;",
            "font-src 'self' data: https:"
          ].join(' ')
        },
      ]
    }
  ]
}
```

---

## 🧩 Component Structure

### Main Dashboard Component

**File**: `components/dashboard/OptionsDashboard.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import VolatilityIndicators from './VolatilityIndicators';
import PredictionModels from './PredictionModels';
import MarketMoodGauge from './MarketMoodGauge';
import AdsterraBanner from '@/components/ads/AdsterraBanner';
import { AD_KEYS, AD_SIZES } from '@/components/ads/AdConfig';

const OptionsDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const { data, loading } = useDashboard();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Dashboard content */}
      <VolatilityIndicators data={data?.volatilityIndicators} darkMode={darkMode} />
      <AdsterraBanner adKey={AD_KEYS.BANNER_728x90} width={728} height={90} />
      <PredictionModels data={data?.mlPredictions} darkMode={darkMode} />
    </div>
  );
};

export default OptionsDashboard;
```

### Component Props Pattern

All dashboard components follow this pattern:

```typescript
interface ComponentProps {
  data?: DataType;
  darkMode: boolean;
  onOpenModal?: (title: string, description: string, decision: string) => void;
}

export default function Component({ data, darkMode, onOpenModal }: ComponentProps) {
  return (
    <div className="card theme-card">
      {/* Component content */}
    </div>
  );
}
```

---

## 🚀 Deployment Configuration

### Next.js Configuration

**File**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [],
  },
  
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { 
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https: data: blob:;",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://www.highperformanceformat.com https://*.adsterra.com https://pl28016046.effectivegatecpm.com;",
              "connect-src 'self' https:;",
              "img-src 'self' https: data: blob:;",
              "style-src 'self' 'unsafe-inline' https:;",
              "frame-src https: data: https://www.highperformanceformat.com https://*.adsterra.com https://pl28016046.effectivegatecpm.com blob:;",
              "font-src 'self' data: https:"
            ].join(' ')
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains"
          }
        ]
      }
    ]
  },
  
  output: 'standalone',
  
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

### GitHub Actions Workflow

**File**: `.github/workflows/data-update.yml`

```yaml
name: Update Dashboard Data

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
          cache: 'pip'
          cache-dependency-path: 'tradyx-options-dashboard/scripts/requirements.txt'
      
      - name: Install dependencies
        run: |
          cd tradyx-options-dashboard/scripts
          pip install --cache-dir ~/.cache/pip -r requirements.txt
      
      - name: Run data update
        run: |
          cd tradyx-options-dashboard/scripts
          python run_all.py
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add tradyx-options-dashboard/public/data/dashboard.json
          git commit -m "Update dashboard data [skip ci]" || exit 0
          git push
```

---

## 📝 Step-by-Step Recreation

### Step 1: Initialize Project

```bash
# Create Next.js project
npx create-next-app@latest tradyx-options-dashboard --typescript --tailwind --app
cd tradyx-options-dashboard

# Install dependencies
npm install framer-motion lucide-react next-themes swr axios zod class-variance-authority clsx tailwind-merge
npm install -D @types/node @types/react @types/react-dom
```

### Step 2: Setup Theme

1. Copy `tailwind.config.js` (see [Theme System](#theme-system))
2. Copy `app/globals.css` (see [Global Styles](#global-styles))
3. Create `components/layout/ThemeToggle.tsx` (see [Theme Toggle](#theme-toggle-component))

### Step 3: Setup Fonts

1. Fonts are automatically loaded from Google Fonts via Next.js (no files needed)
2. Update `app/layout.tsx` (see [Fonts Configuration](#fonts-configuration))

### Step 4: Create Component Structure

1. Create `components/dashboard/` directory
2. Create `components/ads/` directory
3. Create `components/ui/` directory
4. Create `components/layout/` directory

### Step 5: Setup Data Layer

1. Create `hooks/useDashboard.ts`
2. Create `lib/fetcher.ts`
3. Create `lib/types.ts`
4. Create `lib/schema.ts`

### Step 6: Setup Python Scripts

1. Create `scripts/` directory
2. Install Python dependencies
3. Create data fetching scripts
4. Create metric computation scripts
5. Create JSON building script

### Step 7: Setup Ad Integration

1. Create `components/ads/AdConfig.ts`
2. Create `components/ads/AdsterraBanner.tsx`
3. Create `components/ads/SafeAdWrapper.tsx`
4. Update `next.config.js` with CSP headers

### Step 8: Create Dashboard Components

1. Create `components/dashboard/OptionsDashboard.tsx`
2. Create `components/dashboard/VolatilityIndicators.tsx`
3. Create `components/dashboard/PredictionModels.tsx`
4. Create other dashboard components

### Step 9: Setup Deployment

1. Create `.github/workflows/data-update.yml`
2. Configure Vercel deployment
3. Test deployment pipeline

### Step 10: Test & Validate

1. Test theme toggle
2. Test ad loading
3. Test data fetching
4. Test responsive design
5. Validate all formulas

---

## ✅ Testing & Validation

### Testing Checklist

- [ ] Theme toggle works (light/dark)
- [ ] All ads load correctly
- [ ] Data fetching works
- [ ] All formulas calculate correctly
- [ ] Responsive design works
- [ ] CSP headers don't block resources
- [ ] Fonts load correctly
- [ ] Animations work smoothly
- [ ] Error handling works
- [ ] Loading states display correctly

### Validation Scripts

**File**: `scripts/validate_production.py`

```python
import json
from pathlib import Path

def validate_dashboard_json():
    """Validate dashboard.json structure"""
    json_path = Path("public/data/dashboard.json")
    if not json_path.exists():
        print("ERROR: dashboard.json not found")
        return False
    
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    # Validate required fields
    required_fields = ['spot', 'vix', 'pcr', 'volatilityIndicators', 'mlPredictions']
    for field in required_fields:
        if field not in data:
            print(f"ERROR: Missing field: {field}")
            return False
    
    print("✅ dashboard.json is valid")
    return True

if __name__ == "__main__":
    validate_dashboard_json()
```

---

## 📚 Additional Resources

### Documentation

- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **TypeScript**: https://www.typescriptlang.org/docs
- **SWR**: https://swr.vercel.app/

### Formula References

- **IV Rank**: https://www.investopedia.com/terms/i/ivrank.asp
- **Realized Volatility**: https://www.investopedia.com/terms/r/realizedvolatility.asp
- **Parkinson Volatility**: https://en.wikipedia.org/wiki/Parkinson_volatility
- **Expected Move**: https://www.investopedia.com/terms/e/expectedmove.asp

### Ad Network Documentation

- **Adsterra**: https://publishers.adsterra.com/
- **CSP Headers**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

---

## 🎉 Summary

This guide provides everything you need to recreate the Tradyxa Options Dashboard:

1. ✅ **Complete Technology Stack** - All dependencies and versions
2. ✅ **Theme System** - Dark/light mode with glass morphism
3. ✅ **Fonts Configuration** - Google Fonts setup (Inter, JetBrains Mono, Manrope)
4. ✅ **Architecture** - Data flow and component structure
5. ✅ **Mathematical Formulas** - All 12+ formulas with implementations
6. ✅ **Ad Integration** - Complete ad system with placements
7. ✅ **Deployment** - GitHub Actions and Vercel setup
8. ✅ **Step-by-Step Guide** - Complete recreation process

### Key Takeaways

- **Theme**: Centralized, reusable, easy to customize
- **Formulas**: All formulas are documented with implementations
- **Ads**: Complete ad integration system with error handling
- **Architecture**: Clean separation of concerns
- **Deployment**: Automated data updates with GitHub Actions

---

**Last Updated**: December 2024

**Version**: 1.0.0

**License**: All Rights Reserved

---

## 🔗 Quick Links

- [Architecture Document](./ARCHITECTURE.md)
- [README](./README.md)
- [Scripts Documentation](./scripts/README.md)

---

**Happy Coding! 🚀**

