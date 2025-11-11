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
        'Drift Direction (Which Way Is The Market Moving?)',
        'This tool shows you which direction the market is "drifting" - like which way a river is flowing! It compares two moving averages (EMA20 and EMA50) - think of them as "short-term trend" vs "long-term trend". When the short-term is above the long-term (green arrow up), the market is drifting UP (bullish). When short-term is below long-term (red arrow down), the market is drifting DOWN (bearish). When they\'re close together, there\'s no clear direction (neutral).',
        'Bullish (green up) = favor calls/upward strategies; Bearish (red down) = favor puts/downward strategies; Neutral (—) = use balanced strategies.'
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
            <div className={`text-2xl font-bold font-mono ${isBullish ? 'text-green-500' : isBearish ? 'text-red-500' : textSecondary}`}>
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
            <span className={`text-xs font-semibold font-mono ${isBullish ? 'text-green-500' : 'text-red-500'}`}>
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

