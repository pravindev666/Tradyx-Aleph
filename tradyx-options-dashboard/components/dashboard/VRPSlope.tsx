'use client';
import React from 'react';

interface VRPSlopeProps {
  value: number | null | undefined;
  darkMode: boolean;
  onOpenModal?: (title: string, description: string, decision: string) => void;
}

export default function VRPSlope({ value, darkMode, onOpenModal }: VRPSlopeProps) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  // Helper to create horizontal divergence bar
  const DivergenceBar = ({ value, colorPositive = '#22c55e', colorNegative = '#ef4444', center = 0 }: { value: number | null; colorPositive?: string; colorNegative?: string; center?: number }) => {
    if (value === null || value === undefined) return <div className="text-xs text-gray-500">—</div>;
    const isPositive = value > center;
    const absValue = Math.abs(value - center);
    // Scale for display - VRP slope can be -1 to +1 typically, scale to 0-50%
    const pct = Math.min(50, absValue * 50);
    return (
      <div className="flex items-center gap-2 w-full">
        <div className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 relative overflow-hidden`}>
          {/* Center marker */}
          <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ transform: 'translateX(-50%)' }} />
          {/* Value bar */}
          <div 
            className={`absolute h-full transition-all duration-300 ${isPositive ? 'right-1/2' : 'left-1/2'}`}
            style={{ 
              width: `${pct}%`, 
              backgroundColor: isPositive ? colorNegative : colorPositive, // Rising = red (sell vol), Falling = green (buy vol)
              transform: isPositive ? 'translateX(0)' : 'translateX(-100%)'
            }}
          />
        </div>
        <span className={`text-xs font-semibold font-mono min-w-[70px] text-right ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
          {value > center ? '+' : ''}{value.toFixed(4)}
        </span>
      </div>
    );
  };

  // Get interpretation
  const getInterpretation = (): string => {
    if (value === null || value === undefined) return '—';
    if (value > 0.1) return 'Rising (Sell Vol)';
    if (value < -0.1) return 'Falling (Buy Vol)';
    return 'Neutral';
  };

  const getInterpretationColor = (): string => {
    if (value === null || value === undefined) return 'text-gray-500';
    if (value > 0.1) return 'text-red-500';
    if (value < -0.1) return 'text-green-500';
    return 'text-yellow-500';
  };

  return (
    <div 
      className={`${cardBg} rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-cyan-500 tile-hover-gold cursor-pointer`}
      onClick={() => onOpenModal?.(
        'Volatility Risk Premium Slope',
        'Measures the change in richness of implied volatility vs realized volatility over the last 5 days. Formula: (VRPₜ – VRPₜ₋₅) / |VRPₜ₋₅|',
        'Rising VRP (slope > 0) → IV getting richer vs RV → Sell Vol opportunity (credit spreads, condors). Falling VRP (slope < 0) → IV getting cheaper vs RV → Buy Vol window (straddles, long gamma). Neutral slope (near 0) → VRP stable, no clear edge.'
      )}
    >
      <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>VRP Slope</div>
      <div className={`text-2xl sm:text-3xl font-bold font-mono ${textPrimary} mb-1`}>
        {value !== null && value !== undefined
          ? `${value > 0 ? '+' : ''}${value.toFixed(4)}`
          : '—'}
      </div>
      <div className={`text-sm font-semibold mb-2 ${getInterpretationColor()}`}>
        {getInterpretation()}
      </div>
      <DivergenceBar 
        value={value} 
        center={0}
        colorPositive="#22c55e" // Green for falling (buy vol)
        colorNegative="#ef4444" // Red for rising (sell vol)
      />
    </div>
  );
}

