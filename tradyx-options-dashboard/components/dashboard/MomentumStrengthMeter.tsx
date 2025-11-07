'use client';
import React from 'react';

interface MomentumStrengthMeterProps {
  value: number | null | undefined;
  darkMode: boolean;
  onOpenModal?: (title: string, description: string, decision: string) => void;
}

export default function MomentumStrengthMeter({ value, darkMode, onOpenModal }: MomentumStrengthMeterProps) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  // Value is already scaled 0-100
  const scaledValue = value !== null && value !== undefined ? Math.max(0, Math.min(100, value)) : 0;

  // Color based on momentum strength
  const color =
    scaledValue >= 70 ? '#22c55e' :  // Strong momentum (green)
    scaledValue >= 40 ? '#eab308' :  // Moderate momentum (yellow)
    '#ef4444';                        // Weak momentum (red)

  const getInterpretation = (): string => {
    if (value === null || value === undefined) return '—';
    if (scaledValue >= 70) return 'Strong Momentum';
    if (scaledValue >= 40) return 'Moderate Momentum';
    return 'Weak Momentum';
  };

  return (
    <div 
      className={`${cardBg} rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-purple-500 tile-hover-gold cursor-pointer`}
      onClick={() => onOpenModal?.(
        'Momentum / Trend Strength Meter',
        'Measures spot-level momentum intensity using performance and volatility. Formula: MS = (Perf(6M) + Perf(3M) + Perf(9M)) / (Vol(3M) + Vol(1M)). Combines multiple timeframe performances normalized by volatility.',
        'High momentum (70+) → Strong directional trend, avoid short straddles/strangles, prefer directional trades or wide strangles. Moderate momentum (40-70) → Mixed signals, trade with trend but use wider strikes. Low momentum (<40) → Weak trend, range-bound likely, short strangles/straddles more viable. Helps short straddlers avoid fighting strong directional momentum.'
      )}
    >
      <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Momentum Strength</div>
      <div className={`text-2xl sm:text-3xl font-bold ${textPrimary} mb-3`}>
        {value !== null && value !== undefined
          ? `${scaledValue.toFixed(1)}`
          : '—'}
      </div>
      
      {/* Horizontal bar 0-100 scale */}
      <div className="w-full mb-2">
        <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 relative overflow-hidden`}>
          {/* Value bar */}
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${scaledValue}%`, 
              backgroundColor: color
            }}
          />
          {/* Scale markers */}
          <div className="absolute inset-0 flex items-center justify-between px-1">
            <div className={`w-0.5 h-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
            <div className={`w-0.5 h-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
            <div className={`w-0.5 h-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
            <div className={`w-0.5 h-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
            <div className={`w-0.5 h-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
          </div>
        </div>
        {/* Scale labels */}
        <div className="flex justify-between text-xs mt-1">
          <span className={textSecondary}>0</span>
          <span className={textSecondary}>25</span>
          <span className={textSecondary}>50</span>
          <span className={textSecondary}>75</span>
          <span className={textSecondary}>100</span>
        </div>
      </div>
      
      <div className={`text-sm font-semibold ${textSecondary} mt-2`}>
        {getInterpretation()}
      </div>
    </div>
  );
}

