'use client';
import React from 'react';

interface MLPredictionsData {
  nextDayBias?: number;
  nextDayBiasDirection?: 'Bullish' | 'Neutral' | 'Bearish';
  marketProbability?: number;
  marketProbabilityRegime?: 'Bullish' | 'Neutral' | 'Bearish';
  volatilityForecast?: number;
  volatilityForecastRegime?: 'Calm' | 'Normal' | 'Stress';
  predictedRangeUpper?: number;
  predictedRangeLower?: number;
  predictedRangeRegime?: 'Bullish' | 'Neutral' | 'Bearish';
  volatilityRegimeForecast?: number;
  volatilityRegimeForecastCategory?: 'Calm' | 'Normal' | 'Stress';
}

interface PredictionModelsProps {
  data?: MLPredictionsData;
  darkMode: boolean;
  onOpenModal?: (title: string, description: string, decision: string) => void;
}

export default function PredictionModels({ data, darkMode, onOpenModal }: PredictionModelsProps) {
  const predictions = data || {};
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Helper to create circular probability gauge with animation
  const ProbabilityGauge = ({ value, size = 80 }: { value: number; size?: number }) => {
    const pct = Math.max(0, Math.min(100, value));
    const rotation = (pct / 100) * 360;
    const color = pct >= 60 ? '#22c55e' : pct <= 40 ? '#ef4444' : '#eab308';
    const circumference = 2 * Math.PI * 40;
    const offset = circumference * (1 - pct / 100);
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={darkMode ? '#374151' : '#e5e7eb'}
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{
              transition: 'stroke-dashoffset 1s ease-out, stroke 0.3s ease',
              filter: `drop-shadow(0 0 3px ${color}40)`
            }}
          />
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
            style={{
              transition: 'opacity 0.3s ease'
            }}
          >
            {pct.toFixed(0)}%
          </text>
        </svg>
      </div>
    );
  };

  // Helper to create sparkline with forward projection
  const SparklineWithProjection = ({ current, forecast, color = '#3b82f6' }: { current: number; forecast: number; color?: string }) => {
    const values = [current * 0.9, current * 0.95, current, forecast];
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const width = 100;
    const height = 40;
    
    const points = values.map((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="opacity-70">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
        <circle cx={width} cy={height - ((forecast - min) / range) * height} r="3" fill={color} />
      </svg>
    );
  };

  // Helper to create state transition indicator
  const StateTransition = ({ current, forecast }: { current: string; forecast: string }) => {
    const getColor = (state: string) => {
      if (state === 'Calm') return '#22c55e';
      if (state === 'Stress') return '#ef4444';
      return '#eab308';
    };
    
    return (
      <div className="flex items-center gap-2">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold`} style={{ backgroundColor: getColor(current) + '20', color: getColor(current) }}>
          {current}
        </div>
        <span className="text-gray-400">→</span>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold`} style={{ backgroundColor: getColor(forecast) + '20', color: getColor(forecast) }}>
          {forecast}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className={`text-lg sm:text-xl font-semibold ${textPrimary} mb-2 sm:mb-3`}>Prediction Machine Learning Models</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* First row: 2 tiles */}
        {/* 1. Linear Regression - Next-Day Bias */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-blue-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal?.(
            'Next-Day Direction Bias',
            'This is like a crystal ball that tries to predict if the NIFTY index (the main Indian stock market) will go up or down tomorrow. It looks at what happened today, how scared or calm investors are (VIX), and past patterns to make a guess. Think of it like predicting if it will rain tomorrow by looking at today\'s weather and past rain patterns.',
            'Positive (green) = market likely to go up, use bullish strategies; Negative (red) = market likely to go down, use bearish strategies.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Next-Day Bias</div>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>
                {predictions.nextDayBias !== null && predictions.nextDayBias !== undefined && Number.isFinite(predictions.nextDayBias)
                  ? predictions.nextDayBias === 0 
                    ? '0.00%'
                    : `${predictions.nextDayBias > 0 ? '+' : ''}${predictions.nextDayBias.toFixed(2)}%`
                  : '—'}
              </div>
              {predictions.nextDayBias !== null && predictions.nextDayBias !== undefined && predictions.nextDayBias === 0 && (
                <div className={`text-sm ${textSecondary} mt-0.5`}>Neutral prediction</div>
              )}
              <div className={`text-sm font-semibold ${
                predictions.nextDayBiasDirection === 'Bullish' ? 'text-green-500' :
                predictions.nextDayBiasDirection === 'Bearish' ? 'text-red-500' :
                'text-yellow-500'
              }`}>
                {predictions.nextDayBiasDirection || 'Neutral'}
              </div>
            </div>
            <div className="text-2xl">
              {predictions.nextDayBias && predictions.nextDayBias > 0 ? '📈' : predictions.nextDayBias && predictions.nextDayBias < 0 ? '📉' : '➡️'}
            </div>
          </div>
        </div>

        {/* 2. Logistic Regression - Market Probability Gauge */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-green-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal?.(
            'Market Probability Gauge',
            'This tool predicts whether the market will go up or down tomorrow. Think of it like a weather forecast, but for stock prices! It uses a special math technique called "Logistic Regression" that looks at patterns from the past to guess what might happen next.',
            '>60% (green) = bullish, expect up move; <40% (red) = bearish, expect down move; 40-60% (yellow) = neutral, uncertain.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Market Probability</div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`text-base font-semibold mb-1 ${
                predictions.marketProbabilityRegime === 'Bullish' ? 'text-green-500' :
                predictions.marketProbabilityRegime === 'Bearish' ? 'text-red-500' :
                'text-yellow-500'
              }`}>
                {predictions.marketProbabilityRegime || 'Neutral'}
              </div>
              {predictions.marketProbability !== null && predictions.marketProbability !== undefined && (
                <div className={`text-sm ${textSecondary}`}>
                  {predictions.marketProbability.toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              {predictions.marketProbability !== null && predictions.marketProbability !== undefined ? (
                <ProbabilityGauge value={predictions.marketProbability} size={70} />
              ) : (
                <div className="text-gray-500">—</div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Random Forest - Volatility Forecast */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-purple-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal?.(
            'Volatility Forecast',
            'Volatility means how much prices are jumping around - like a calm sea vs choppy waves! This tool predicts how "choppy" the market will be over the next 3 days. It looks at how jumpy the market has been recently and uses a smart computer program (Random Forest) to guess what might happen. High volatility = big price swings (scary but can be profitable). Low volatility = calm, steady prices (safer but less exciting).',
            'High (Stress/red) = big moves coming, be cautious; Low (Calm/green) = stable prices, safer trading; Normal (yellow) = regular movements.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Volatility Forecast</div>
          <div className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-1`}>
            {predictions.volatilityForecast ? `${predictions.volatilityForecast.toFixed(2)}%` : '—'}
          </div>
          <div className={`text-sm font-semibold mb-2 ${
            predictions.volatilityForecastRegime === 'Calm' ? 'text-green-500' :
            predictions.volatilityForecastRegime === 'Stress' ? 'text-red-500' :
            'text-yellow-500'
          }`}>
            {predictions.volatilityForecastRegime || 'Normal'} (3-day)
          </div>
          {predictions.volatilityForecast && (
            <div className="h-10">
              <SparklineWithProjection 
                current={predictions.volatilityForecast * 0.9} 
                forecast={predictions.volatilityForecast} 
                color="#a855f7" 
              />
            </div>
          )}
        </div>

        {/* 4. Quantile Regression - 5-day Predicted Range */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-cyan-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal?.(
            '5-day Predicted Range',
            'This tool shows you where the market price might go over the next 5 days. Think of it like a weather forecast that says "temperature will be between 20°C and 30°C" - but for stock prices! It gives you an upper limit (how high prices might go) and a lower limit (how low prices might go). The model is pretty confident (95% sure) that prices will stay within this range.',
            'Wide range = big swings expected, use wider strikes; Narrow range = consolidation, tighter strikes work; Upper >1.5% = bullish, Lower <-1.5% = bearish.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>5-day Predicted Range</div>
          {predictions.predictedRangeUpper !== null && predictions.predictedRangeUpper !== undefined &&
           predictions.predictedRangeLower !== null && predictions.predictedRangeLower !== undefined ? (
            <>
              <div className="space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>Upper (95%)</span>
                  <span className={`text-xl font-bold text-green-500`}>
                    +{predictions.predictedRangeUpper.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>Lower (5%)</span>
                  <span className={`text-xl font-bold text-red-500`}>
                    {predictions.predictedRangeLower.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className={`text-sm font-semibold ${
                predictions.predictedRangeRegime === 'Bullish' ? 'text-green-500' :
                predictions.predictedRangeRegime === 'Bearish' ? 'text-red-500' :
                'text-yellow-500'
              }`}>
                {predictions.predictedRangeRegime || 'Neutral'}
              </div>
            </>
          ) : (
            <div className={`text-base ${textSecondary}`}>—</div>
          )}
        </div>
      </div>
      
      {/* Second row: LSTM tile (spans 1 column) */}
      <div className="grid grid-cols-2 gap-4">
        {/* 5. LSTM - Volatility Regime Forecaster */}
        <div 
          className={`${cardBg} rounded-lg shadow-lg p-4 border-l-4 border-orange-500 tile-hover-gold cursor-pointer`}
          onClick={() => onOpenModal?.(
            'Volatility Regime Forecast',
            'This tool predicts what "mood" the market will be in 3 days from now - will it be calm and peaceful, normal and steady, or stressed and jumpy? It uses a super smart AI system (LSTM - like a computer brain that remembers patterns) to look at the last 30 days of market data and guess what\'s coming. Think of it like predicting if you\'ll have a calm week or a stressful week based on your recent schedule!',
            'Calm (green) = peaceful market, good for beginners; Stress (red) = wild swings, be extra careful; Normal (yellow) = regular behavior.'
          )}
        >
          <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Vol Regime Forecast</div>
          {predictions.volatilityRegimeForecast !== null && predictions.volatilityRegimeForecast !== undefined ? (
            <>
              <div className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-2`}>
                {predictions.volatilityRegimeForecast.toFixed(2)}%
              </div>
              <div className="mb-2">
                <StateTransition 
                  current={predictions.volatilityRegimeForecastCategory || 'Normal'}
                  forecast={predictions.volatilityRegimeForecastCategory || 'Normal'}
                />
              </div>
              <div className={`text-xs ${textSecondary}`}>
                3-day VIX forecast
              </div>
            </>
          ) : (
            <div className={`text-sm ${textSecondary}`}>—</div>
          )}
        </div>
        <div></div> {/* Empty space to maintain grid */}
      </div>
    </div>
  );
}
