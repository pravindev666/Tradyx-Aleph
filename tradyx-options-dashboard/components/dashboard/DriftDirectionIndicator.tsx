'use client';
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DriftDirectionIndicatorProps {
  value: number | null | undefined; // EMA20 - EMA50 (can be positive or negative)
  darkMode: boolean;
  onOpenModal?: (title: string, description: string, decision: string) => void;
}

export default function DriftDirectionIndicator({ value, darkMode, onOpenModal }: DriftDirectionIndicatorProps) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  // Determine direction and magnitude
  const isBullish = value !== null && value !== undefined && value > 0;
  const isBearish = value !== null && value !== undefined && value < 0;
  const isNeutral = value === null || value === undefined || Math.abs(value) < 0.01;
  
  // Calculate magnitude as percentage (normalize by spot price - approximate)
  const magnitude = value !== null && value !== undefined ? Math.abs(value) : 0;
  const magnitudePct = Math.min(100, (magnitude / 100) * 100); // Scale for display

  const color = isBullish ? '#22c55e' : isBearish ? '#ef4444' : '#6b7280';
  const bgColor = isBullish 
    ? (darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200')
    : isBearish 
    ? (darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200')
    : (darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-300');

  const getDirection = (): string => {
    if (isNeutral) return 'Neutral';
    return isBullish ? 'Bullish Drift' : 'Bearish Drift';
  };

  return (
    <div 
      className={`${cardBg} rounded-lg shadow-lg p-3 sm:p-4 border-l-4 ${isBullish ? 'border-green-500' : isBearish ? 'border-red-500' : 'border-gray-500'} tile-hover-gold cursor-pointer`}
      onClick={() => onOpenModal?.(
        'Drift Direction Indicator',
        'Measures the directional bias of the market using the sign of (EMA20 − EMA50). Positive value indicates bullish drift (EMA20 above EMA50), negative indicates bearish drift (EMA20 below EMA50).',
        'Bullish drift (↑ Green): EMA20 > EMA50 → Market trending up → Bias short strikes slightly OTM on call side, prefer put spreads. Bearish drift (↓ Red): EMA20 < EMA50 → Market trending down → Bias short strikes slightly OTM on put side, prefer call spreads. Neutral: EMAs close together → No clear drift → Use symmetric strangles/straddles. Helps short option traders bias their strike placement in the drift direction.'
      )}
    >
      <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-3`}>Drift Direction</div>
      
      {/* Arrow and Value */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {isNeutral ? (
          <div className={`text-4xl ${textSecondary}`}>—</div>
        ) : isBullish ? (
          <TrendingUp size={56} className="text-green-500" strokeWidth={3} />
        ) : (
          <TrendingDown size={56} className="text-red-500" strokeWidth={3} />
        )}
        
        {value !== null && value !== undefined && (
          <div className="text-center">
            <div className={`text-2xl font-bold ${isBullish ? 'text-green-500' : isBearish ? 'text-red-500' : textSecondary}`}>
              {isBullish ? '+' : ''}{value.toFixed(2)}
            </div>
            <div className={`text-sm ${textSecondary}`}>
              EMA20 − EMA50
            </div>
          </div>
        )}
      </div>

      {/* Magnitude Gauge */}
      {!isNeutral && (
        <div className="w-full">
          <div className={`flex items-center justify-between mb-1`}>
            <span className={`text-xs ${textSecondary}`}>Magnitude</span>
            <span className={`text-xs font-semibold ${isBullish ? 'text-green-500' : 'text-red-500'}`}>
              {magnitudePct.toFixed(1)}%
            </span>
          </div>
          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 relative overflow-hidden`}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${magnitudePct}%`, 
                backgroundColor: color
              }}
            />
          </div>
        </div>
      )}

      {/* Direction Label */}
      <div className={`text-center mt-3 p-2 rounded ${bgColor} border`}>
        <div className={`text-base font-semibold ${isBullish ? 'text-green-500' : isBearish ? 'text-red-500' : textSecondary}`}>
          {getDirection()}
        </div>
      </div>
    </div>
  );
}

