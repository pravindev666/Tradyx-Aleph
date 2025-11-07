import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import './styles.css';

export default function OIBlock({ dark, title, rows, spot, isCall }: { dark: boolean; title: string; rows: any[]; spot: number; isCall: boolean; }) {
  const maxOI = Math.max(...rows.map((r: any) => r.oi));
  return (
    <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm p-4`}>
      <div className={`${dark ? 'bg-transparent' : 'bg-transparent'} mb-2`}>
        <div className={`text-xs font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wide mb-2`}>{title}</div>
      </div>
      <div className="space-y-3">
        {rows.map((r: any, i: number) => {
          const bar = (r.oi / maxOI) * 100;
          const diffPct = Math.abs((r.strike - spot) / spot) * 100;
          let band = dark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200';
          if (diffPct < 1) band = dark ? 'bg-rose-900/20 border-rose-700' : 'bg-rose-50 border-rose-200';
          else if (diffPct < 2) band = dark ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200';

          return (
            <div key={i} className={`border ${band} rounded-lg p-3`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className={`${dark ? 'text-white' : 'text-gray-900'} font-semibold text-lg`}>{r.strike} {isCall ? 'CE' : 'PE'}</div>
                  <div className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>OI: {(r.oi / 100000).toFixed(2)}L</div>
                </div>
                <div className={`${r.change >= 0 ? 'text-emerald-500' : 'text-rose-500'} text-right`}>
                  <div className="font-semibold flex items-center gap-1">
                    {r.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {r.change >= 0 ? '+' : ''}{r.change}%
                  </div>
                  <div className="text-[11px] opacity-70">OI Δ%</div>
                </div>
              </div>
              <div className={`${dark ? 'bg-gray-700' : 'bg-gray-200'} h-3 rounded-full overflow-hidden`}>
                <div
                  className={`h-full ${isCall ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'}`}
                  style={{ width: `${bar}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}