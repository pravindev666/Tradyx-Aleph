'use client';
import React from 'react';

export type Mood = {
  mmi: number;                            // 0..100
  regime: 'Extreme Fear'|'Fear'|'Neutral'|'Greed'|'Extreme Greed';
  tooltip?: React.ReactNode;              // optional: z-score breakdown
};

export default function MarketMoodGauge({ mood, darkMode, onOpenModal }: { mood: Mood; darkMode: boolean; onOpenModal?: (title: string, description: string, decision: string) => void }) {
  const pct = Math.max(0, Math.min(100, mood.mmi));
  const rotation = (pct / 100) * 180 - 90;

  const color =
    pct >= 75 ? '#22c55e' :
    pct >= 55 ? '#84cc16' :
    pct >  45 ? '#eab308' :
    pct >  25 ? '#f97316' : '#ef4444';

  return (
    <div 
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4 sm:p-5 md:p-6 tile-hover-gold cursor-pointer`}
      onClick={() => {
        if (onOpenModal) {
          onOpenModal(
            'Market Mood Index (MMI)',
            'Composite indicator combining VIX, PCR, IVR, Advance/Decline ratio, FII flows, and Realized/Implied Volatility ratio. Provides a holistic view of market sentiment.',
            'MMI < 35 → Fear regime. Avoid tight naked short gamma. Prefer credit spreads or small directional debits. 35–65 → Neutral. With GEX positive and IVR 40–60, classic short strangles outside Expected Move make sense. > 65 → Greed. Trend extension likely; if IVR is low, debit spreads beat premium shorts; if IVR high, short premium still OK but watch squeezes. MMI ≠ trade signal. It\'s a context filter. Confirm with GEX, Expected Move, Top OI walls, and OI momentum.'
          );
        }
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Market Mood</h3>
        {mood.tooltip && (
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{mood.tooltip}</div>
        )}
      </div>

      <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
        Composite of VIX, PCR, IVR, Breadth, FII flows, RV/IV
      </p>

      <div className="relative w-64 h-32 mx-auto" aria-label="Market Mood Gauge">
        <svg viewBox="0 0 200 100" className="w-full">
          <defs>
            <linearGradient id="moodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"  stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#moodGrad)"
            strokeWidth="20"
            strokeLinecap="round"
            aria-hidden="true"
          />
          <line
            x1="100" y1="90" x2="100" y2="30"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation} 100 90)`}
          />
          <circle cx="100" cy="90" r="8" fill={color} />
        </svg>
      </div>

      <div className="text-center mt-4">
        <div className="text-2xl sm:text-3xl font-bold" style={{ color }}>{pct.toFixed(0)}</div>
        <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mood.regime}</div>
      </div>
    </div>
  );
}

