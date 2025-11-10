'use client';
import React from 'react';

interface VolatilityIndicatorsProps {
  data: any;
  darkMode: boolean;
  onOpenModal: (title: string, description: string, decision: string) => void;
}

export default function VolatilityIndicators({ data, darkMode, onOpenModal }: VolatilityIndicatorsProps) {
  const indicators = data || {};
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Helper to create sparkline
  const MiniSparkline = ({ values, color = '#3b82f6', height = 30 }: { values: number[]; color?: string; height?: number }) => {
    if (!values || values.length === 0) return null;
    
    // Filter out invalid values (NaN, null, undefined)
    const validData = values.filter(val => typeof val === 'number' && !isNaN(val) && isFinite(val));
    if (validData.length === 0) return null;
    
    const max = Math.max(...validData);
    const min = Math.min(...validData);
    const range = max - min || 1;
    const width = 80;
    const dataLength = validData.length;
    
    const points = validData.map((val, i) => {
      const x = dataLength > 1 ? (i / (dataLength - 1)) * width : width / 2;
      const y = height - ((val - min) / range) * height;
      // Ensure valid numbers
      if (!isFinite(x) || !isFinite(y)) return `0,${height}`;
      return `${x},${y}`;
    }).filter(p => p && !p.includes('NaN')).join(' ');
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="opacity-70">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  };

  // Helper to create gauge
  const Gauge = ({ value, min = 0, max = 1, color = '#3b82f6', size = 40 }: { value: number; min?: number; max?: number; color?: string; size?: number }) => {
    // Ensure value is valid and finite
    const validValue = (typeof value === 'number' && isFinite(value)) ? value : min;
    const pct = Math.max(0, Math.min(100, ((validValue - min) / (max - min)) * 100));
    const rotation = isFinite(pct) ? (pct / 100) * 180 - 90 : 0;
    return (
      <div className="relative" style={{ width: size, height: size / 2 }}>
        <svg viewBox="0 0 200 100" className="w-full">
          <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="8" />
          <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${pct * 2.51} 251`} />
          <line x1="100" y1="90" x2="100" y2="40" stroke={color} strokeWidth="2" transform={`rotate(${rotation} 100 90)`} />
          <circle cx="100" cy="90" r="4" fill={color} />
        </svg>
      </div>
    );
  };

  // Helper to create progress bar
  const ProgressBar = ({ value, max = 1, color = '#3b82f6', height = 8 }: { value: number; max?: number; color?: string; height?: number }) => {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return (
      <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`} style={{ height }}>
        <div className="rounded-full transition-all" style={{ width: `${pct}%`, height, backgroundColor: color }} />
      </div>
    );
  };

  // Helper to create horizontal divergence bar
  const DivergenceBar = ({ value, colorPositive = '#22c55e', colorNegative = '#ef4444', center = 0 }: { value: number | null; colorPositive?: string; colorNegative?: string; center?: number }) => {
    if (value === null || value === undefined) return <div className="text-xs text-gray-500">—</div>;
    const isPositive = value > center;
    const absValue = Math.abs(value - center);
    const pct = Math.min(50, absValue * 1000); // Scale for display (0-50% on each side)
    return (
      <div className="flex items-center gap-2 w-full">
        <div className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 relative overflow-hidden`}>
          {/* Center marker */}
          <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ transform: 'translateX(-50%)' }} />
          {/* Value bar */}
          <div 
            className={`absolute h-full transition-all duration-300 ${isPositive ? 'right-1/2' : 'left-1/2'}`}
            style={{ 
              width: `${pct}%`, 
              backgroundColor: isPositive ? colorNegative : colorPositive,
              transform: isPositive ? 'translateX(0)' : 'translateX(-100%)'
            }}
          />
        </div>
        <span className={`text-xs font-semibold min-w-[60px] text-right ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
          {value > center ? '+' : ''}{value.toFixed(4)}
        </span>
      </div>
    );
  };

  // Helper to get interpretation (Bullish/Bearish/Neutral)
  const getInterpretation = (indicator: string, value: number | null | undefined): string => {
    if (value === null || value === undefined) return '—';
    
    switch (indicator) {
      case 'realizedVol':
        return value > 20 ? 'Bearish' : value < 12 ? 'Bullish' : 'Neutral';
      case 'hvIvSpread':
        return value > 0 ? 'Bearish' : value < -2 ? 'Bullish' : 'Neutral';
      case 'volatilityRatio':
        return value > 1 ? 'Bullish' : value < 0.8 ? 'Bearish' : 'Neutral';
      case 'parkinsonVol20d':
        return value > 20 ? 'Bearish' : value < 12 ? 'Bullish' : 'Neutral';
      case 'vixNiftyCorrelation':
        return value > -0.3 ? 'Bearish' : value < -0.7 ? 'Bullish' : 'Neutral';
      case 'trendConsistencyIndex':
        return value > 0.65 ? 'Bullish' : value < 0.35 ? 'Bearish' : 'Neutral';
      case 'returnQuantilePosition':
        return value > 85 ? 'Bearish' : value < 15 ? 'Bullish' : 'Neutral';
      case 'rangeCompressionIndex':
        return value < 0.6 ? 'Bullish' : value > 1.2 ? 'Bearish' : 'Neutral';
      case 'volatilityRiskPremium':
        return value > 0 ? 'Bearish' : value < -0.002 ? 'Bullish' : 'Neutral';
      default:
        return 'Neutral';
    }
  };

  const getInterpretationColor = (interpretation: string): string => {
    if (interpretation === 'Bullish') return 'text-green-500';
    if (interpretation === 'Bearish') return 'text-red-500';
    return 'text-yellow-500';
  };

  return (
    <div className="space-y-4">
      <h3 className={`text-lg sm:text-xl font-semibold ${textPrimary} mb-2 sm:mb-3`}>Volatility Indicators</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* 1. Realized Volatility (RV) - Sparkline + Numeric */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-blue-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'Realized Volatility (RV)',
            'True daily movement; benchmark for comparing with VIX. Measures actual volatility from price movements.',
            '↑ RV = trend/chaos; ↓ RV = range. High RV suggests directional moves, low RV suggests range-bound trading.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Realized Volatility</div>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
                {indicators.realizedVol ? `${indicators.realizedVol.toFixed(2)}%` : '—'}
              </div>
              <div className={`text-sm font-semibold mt-1 ${getInterpretationColor(getInterpretation('realizedVol', indicators.realizedVol))}`}>
                {getInterpretation('realizedVol', indicators.realizedVol)}
              </div>
            </div>
            <div className="w-20 h-8">
              <MiniSparkline values={[indicators.realizedVol || 0]} color="#3b82f6" height={30} />
            </div>
          </div>
        </div>

        {/* 2. HV–IV Spread - Horizontal Divergence Bar */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-green-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'HV–IV Spread',
            'Shows whether options are overpriced or underpriced vs realized moves. Positive = VIX > RV (rich IV), Negative = RV > VIX (cheap IV).',
            '> 0 = sell vol (IV rich); < 0 = buy vol (IV cheap). Use this to time volatility trades.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>HV–IV Spread</div>
          <div className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>
            {indicators.hvIvSpread !== null && indicators.hvIvSpread !== undefined 
              ? `${indicators.hvIvSpread > 0 ? '+' : ''}${indicators.hvIvSpread.toFixed(2)}`
              : '—'}
          </div>
          <div className={`text-sm font-semibold mb-2 ${getInterpretationColor(getInterpretation('hvIvSpread', indicators.hvIvSpread))}`}>
            {getInterpretation('hvIvSpread', indicators.hvIvSpread)}
          </div>
          <DivergenceBar value={indicators.hvIvSpread} />
        </div>

        {/* 3. Volatility Ratio (VR) - Gauge */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-yellow-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'Volatility Ratio (VR)',
            'Ratio form of HV–IV spread — cleaner for thresholds. RV/VIX ratio.',
            '< 0.8 = short vol zone (IV rich); > 1 = long vol zone (IV cheap). Center (1.0) is neutral.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Volatility Ratio</div>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
                {indicators.volatilityRatio ? indicators.volatilityRatio.toFixed(3) : '—'}
              </div>
              <div className={`text-sm font-semibold mt-1 ${getInterpretationColor(getInterpretation('volatilityRatio', indicators.volatilityRatio))}`}>
                {getInterpretation('volatilityRatio', indicators.volatilityRatio)}
              </div>
            </div>
            <div className="w-16">
              <Gauge value={indicators.volatilityRatio || 0.5} min={0.6} max={1.2} color={indicators.volatilityRatio && indicators.volatilityRatio < 0.8 ? '#ef4444' : indicators.volatilityRatio && indicators.volatilityRatio > 1 ? '#22c55e' : '#eab308'} size={50} />
            </div>
          </div>
        </div>

        {/* 4. Parkinson Volatility (σₚ) - Mini Line Chart */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-purple-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'Parkinson Volatility (σₚ)',
            'Intraday range volatility — early warning of compression/expansion. Uses high/low prices to measure true range.',
            'Rising σₚ = breakout risk. High σₚ suggests volatility expansion, low σₚ suggests compression before move.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Parkinson Volatility</div>
          <div className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>
            {indicators.parkinsonVol20d ? `${indicators.parkinsonVol20d.toFixed(2)}%` : '—'}
          </div>
          <div className={`text-sm font-semibold mb-2 ${getInterpretationColor(getInterpretation('parkinsonVol20d', indicators.parkinsonVol20d))}`}>
            {getInterpretation('parkinsonVol20d', indicators.parkinsonVol20d)}
          </div>
          <div className="h-8">
            <MiniSparkline values={[indicators.parkinsonVol20d || 0]} color="#a855f7" height={30} />
          </div>
        </div>

        {/* 5. VIX–NIFTY Correlation - Dual Gauge */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-red-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'VIX–NIFTY Correlation (30d)',
            'Tests if fear–price inverse relation holds. Measures correlation between VIX changes and NIFTY returns.',
            '–0.8 = normal (inverse relation); > –0.3 = stress (correlation breaking down). Negative correlation is healthy.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>VIX–NIFTY Correlation</div>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
                {indicators.vixNiftyCorrelation !== null && indicators.vixNiftyCorrelation !== undefined
                  ? indicators.vixNiftyCorrelation.toFixed(3)
                  : '—'}
              </div>
              <div className={`text-sm font-semibold mt-1 ${getInterpretationColor(getInterpretation('vixNiftyCorrelation', indicators.vixNiftyCorrelation))}`}>
                {getInterpretation('vixNiftyCorrelation', indicators.vixNiftyCorrelation)}
              </div>
            </div>
            <div className="w-16">
              <Gauge 
                value={indicators.vixNiftyCorrelation !== null ? indicators.vixNiftyCorrelation : -0.5} 
                min={-1} 
                max={1} 
                color={indicators.vixNiftyCorrelation !== null && indicators.vixNiftyCorrelation < -0.3 ? '#22c55e' : '#ef4444'} 
                size={50} 
              />
            </div>
          </div>
        </div>

        {/* 6. Trend Consistency Index (TCI) - Vertical Progress Bar */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-indigo-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'Trend Consistency Index (TCI)',
            'Measures drift persistence. Fraction of positive closes in last 20 days.',
            '> 0.65 = bullish (consistent uptrend); < 0.35 = bearish (consistent downtrend). Measures trend strength.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Trend Consistency</div>
          <div className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>
            {indicators.trendConsistencyIndex ? (indicators.trendConsistencyIndex * 100).toFixed(1) + '%' : '—'}
          </div>
          <div className={`text-sm font-semibold mb-2 ${getInterpretationColor(getInterpretation('trendConsistencyIndex', indicators.trendConsistencyIndex))}`}>
            {getInterpretation('trendConsistencyIndex', indicators.trendConsistencyIndex)}
          </div>
          <ProgressBar value={indicators.trendConsistencyIndex || 0} max={1} color={indicators.trendConsistencyIndex && indicators.trendConsistencyIndex > 0.65 ? '#22c55e' : indicators.trendConsistencyIndex && indicators.trendConsistencyIndex < 0.35 ? '#ef4444' : '#eab308'} />
        </div>

        {/* 7. Return Quantile Position (QP) - Percentile Gauge */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-pink-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'Return Quantile Position (QP)',
            'Probabilistic location of current move. Shows where today\'s return sits in historical distribution.',
            '> 85 = overbought (extreme positive); < 15 = oversold (extreme negative). Helps identify extremes.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Return Quantile Position</div>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
                {indicators.returnQuantilePosition ? `${indicators.returnQuantilePosition.toFixed(1)}%` : '—'}
              </div>
              <div className={`text-sm font-semibold mt-1 ${getInterpretationColor(getInterpretation('returnQuantilePosition', indicators.returnQuantilePosition))}`}>
                {getInterpretation('returnQuantilePosition', indicators.returnQuantilePosition)}
              </div>
            </div>
            <div className="w-16">
              <Gauge 
                value={indicators.returnQuantilePosition || 50} 
                min={0} 
                max={100} 
                color={indicators.returnQuantilePosition && indicators.returnQuantilePosition > 85 ? '#ef4444' : indicators.returnQuantilePosition && indicators.returnQuantilePosition < 15 ? '#22c55e' : '#eab308'} 
                size={50} 
              />
            </div>
          </div>
        </div>

        {/* 8. Volatility Regime Classifier - State Indicator */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-orange-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'Volatility Regime Classifier',
            'Condenses vol context for strategy choice. Classifies market into Calm, Normal, or Stress regimes.',
            '"Calm" → sell vol (low volatility, premium selling works); "Stress" → buy vol (high volatility, defensive).'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Volatility Regime</div>
          <div className={`text-2xl sm:text-3xl font-bold mb-2 ${
            indicators.volatilityRegime === 'Calm' ? 'text-green-500' :
            indicators.volatilityRegime === 'Stress' ? 'text-red-500' :
            'text-yellow-500'
          }`}>
            {indicators.volatilityRegime || '—'}
          </div>
          <div className={`text-sm ${textSecondary}`}>
            {indicators.volatilityRegime === 'Calm' ? 'Low vol, sell premium' :
             indicators.volatilityRegime === 'Stress' ? 'High vol, buy protection' :
             'Normal conditions'}
          </div>
        </div>

        {/* 9. Range Compression Index (RCI) - Dynamic Gauge + Pulse */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-teal-500 tile-hover-gold cursor-pointer ${
            indicators.rangeCompressionIndex && indicators.rangeCompressionIndex < 0.6 ? 'ring-2 ring-red-500/50' : ''
          }`}
          onClick={() => onOpenModal(
            'Range Compression Index (RCI)',
            'Detects volatility squeezes before expansion. Ratio of short-term to long-term Parkinson volatility.',
            '< 0.6 = coiled spring → incoming move. Low RCI suggests compression before breakout.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Range Compression Index</div>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
                {indicators.rangeCompressionIndex ? indicators.rangeCompressionIndex.toFixed(3) : '—'}
              </div>
              <div className={`text-sm font-semibold mt-1 ${getInterpretationColor(getInterpretation('rangeCompressionIndex', indicators.rangeCompressionIndex))}`}>
                {getInterpretation('rangeCompressionIndex', indicators.rangeCompressionIndex)}
              </div>
            </div>
            <div className="w-16">
              <Gauge 
                value={indicators.rangeCompressionIndex || 0.7} 
                min={0} 
                max={1.5} 
                color={indicators.rangeCompressionIndex && indicators.rangeCompressionIndex < 0.6 ? '#ef4444' : '#22c55e'} 
                size={50} 
              />
            </div>
          </div>
        </div>

        {/* 10. Volatility Risk Premium (VRP) - Horizontal Divergence Bar */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-cyan-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal(
            'Volatility Risk Premium (VRP)',
            'VRP = VIX² - RV². Shows whether implied volatility is rich or cheap relative to realized volatility.',
            'VRP > 0 = sell vol (credit spreads); VRP < 0 = buy vol (straddles, long gamma).'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Volatility Risk Premium</div>
          <div className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>
            {indicators.volatilityRiskPremium !== null && indicators.volatilityRiskPremium !== undefined
              ? `${indicators.volatilityRiskPremium > 0 ? '+' : ''}${indicators.volatilityRiskPremium.toFixed(4)}`
              : '—'}
          </div>
          <div className={`text-sm font-semibold mb-2 ${getInterpretationColor(getInterpretation('volatilityRiskPremium', indicators.volatilityRiskPremium))}`}>
            {getInterpretation('volatilityRiskPremium', indicators.volatilityRiskPremium)}
          </div>
          <DivergenceBar 
            value={indicators.volatilityRiskPremium} 
            center={0}
            colorPositive="#22c55e" 
            colorNegative="#ef4444" 
          />
        </div>
      </div>
    </div>
  );
}

