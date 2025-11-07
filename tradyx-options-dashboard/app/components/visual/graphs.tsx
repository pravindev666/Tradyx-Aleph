import React from 'react';
import './styles.css';

// Helper types
type BarRowProps = {
  dark: boolean;
  label: string;
  value: string;
  pct: number;
  positive: boolean;
};

type GammaHeatProps = {
  dark: boolean;
  rows: Array<{ strike: number; gex: number }>;
};

type IVSmileProps = {
  dark: boolean;
  rows: Array<{ strike: number; iv: number }>;
};

type SparklineProps = {
  series: number[];
  stroke?: string;
  height?: number;
  width?: number;
};

function SparklineInner(props: SparklineProps) {
  const { series, stroke = '#3b82f6', height = 36, width = 120 } = props;
  const { points, min, max } = React.useMemo(() => {
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const pts = series.map((v, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    return { points, pts, min, max };
  }, [series, height, width]);

  const lastY = React.useMemo(() => {
    const range = (max - min) || 1;
    const v = series[series.length - 1];
    return height - ((v - min) / range) * height;
  }, [series, min, max, height]);

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#sparkFill)" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" />
      <circle cx={width} cy={lastY} r="3" fill={stroke} />
    </svg>
  );
}

function BarRowInner({ dark, label, value, pct, positive }: BarRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{label}</span>
        <span className={`text-sm font-semibold ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>{value}</span>
      </div>
      <div className={`${dark ? 'bg-gray-700' : 'bg-gray-200'} h-3 rounded-full overflow-hidden`}>
        <div
          className={`h-full bar-progress ${positive ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'}`}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  );
}

export function GammaHeat({ dark, rows }: { dark: boolean; rows: { strike: number; gex: number }[]; }) {
  const maxAbs = Math.max(1, ...rows.map(r => Math.abs(r.gex)));
  return (
    <div className="space-y-2">
      {rows.map((r, i) => {
        const intensity = Math.min(1, Math.abs(r.gex) / maxAbs);
        const isPos = r.gex >= 0;
        const colorClass = isPos ? 'bg-emerald-500' : 'bg-rose-500';
        const opacityClass = `opacity-${Math.round(intensity * 60)}`;
        
        return (
          <div key={i} className="flex items-center gap-3">
            <div className={`${dark ? 'text-gray-300' : 'text-gray-700'} w-16 text-sm font-semibold`}>{r.strike}</div>
            <div className={`flex-1 h-8 rounded-lg overflow-hidden relative ${colorClass} ${opacityClass}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {(r.gex / 1e6).toFixed(0)}M
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function IVSmile({ dark, rows }: { dark: boolean; rows: { strike: number; iv: number }[] }) {
  const maxIV = Math.max(...rows.map(r => r.iv));
  const minIV = Math.min(...rows.map(r => r.iv));
  const range = Math.max(0.0001, maxIV - minIV);
  return (
    <div className="h-48">
      <svg viewBox="0 0 420 180" className="w-full h-full">
        {rows.map((r, i) => {
          const x = 10 + (i / (rows.length - 1)) * 400;
          const y = 160 - ((r.iv - minIV) / range) * 130;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#8b5cf6" />
              <text x={x} y="175" textAnchor="middle" fontSize="10" fill={dark ? '#9ca3af' : '#6b7280'}>
                {r.strike}
              </text>
              <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#8b5cf6" fontWeight="bold">
                {r.iv.toFixed(1)}%
              </text>
            </g>
          );
        })}
        <polyline
          points={rows.map((r, i) => {
            const x = 10 + (i / (rows.length - 1)) * 400;
            const y = 160 - ((r.iv - minIV) / range) * 130;
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}

export function Sparkline({ series, stroke = '#3b82f6', height = 36, width = 120 }: { series: number[]; stroke?: string; height?: number; width?: number; }) {
  const { points, min, max } = React.useMemo(() => {
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const pts = series.map((v, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    return { points: pts, min, max };
  }, [series, height, width]);

  const lastY = React.useMemo(() => {
    const range = (max - min) || 1;
    const v = series[series.length - 1];
    return height - ((v - min) / range) * height;
  }, [series, min, max, height]);

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#sparkFill)" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" />
      <circle cx={width} cy={lastY} r="3" fill={stroke} />
    </svg>
  );
}

export function BarRow({ dark, label, value, pct, positive }: { dark: boolean; label: string; value: string; pct: number; positive: boolean; }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{label}</span>
        <span className={`text-sm font-semibold ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>{value}</span>
      </div>
      <div className={`${dark ? 'bg-gray-700' : 'bg-gray-200'} h-3 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${positive ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'}`}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  );
}