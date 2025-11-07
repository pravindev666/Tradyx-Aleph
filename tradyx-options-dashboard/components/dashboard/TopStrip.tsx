'use client';
import Sparkline from '@/components/visual/Sparkline';

export default function TopStrip({
  spot, vix, pcr, pcrWeighted, maxPain, magnetPct, ivRank, spotSeries, vixSeries
}:{
  spot:number; vix:number; pcr:number; pcrWeighted?:number|null; maxPain:number;
  magnetPct?:number|null; ivRank?:number|null; spotSeries:number[]; vixSeries:number[];
}){
  const box = "card p-4 relative overflow-hidden";
  return (
    <div className="grid md:grid-cols-5 gap-3">
      <div className={box}>
        <div className="text-xs text-zinc-500">Spot</div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold">₹{spot?.toFixed?.(2) ?? '—'}</div>
          <Sparkline data={spotSeries||[]} />
        </div>
      </div>
      <div className={box}>
        <div className="text-xs text-zinc-500">India VIX</div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold">{vix?.toFixed?.(2) ?? '—'}</div>
          <Sparkline data={vixSeries||[]} />
        </div>
      </div>
      <div className={box}>
        <div className="text-xs text-zinc-500">PCR (OI) / Δ-PCR</div>
        <div className="text-xl font-semibold">{pcr?.toFixed?.(2) ?? '—'} <span className="text-zinc-400 text-sm">({pcrWeighted ?? '—'})</span></div>
      </div>
      <div className={box}>
        <div className="text-xs text-zinc-500">Max Pain / Magnet%</div>
        <div className="text-xl font-semibold">{maxPain ?? '—'} <span className="text-cyan-400 text-sm ml-2">{magnetPct!=null ? `${magnetPct.toFixed(2)}%` : '—'}</span></div>
      </div>
      <div className={box}>
        <div className="text-xs text-zinc-500">IV Rank</div>
        <div className="text-xl font-semibold">{ivRank!=null ? `${ivRank.toFixed(1)}` : '—'}</div>
      </div>
    </div>
  );
}
