'use client';
export default function FearGreedGauge({ score }:{ score:number }){
  const s = Math.max(0, Math.min(100, score));
  return (
    <div className="card p-4">
      <div className="text-sm text-zinc-500 mb-2">Fear & Greed</div>
      <div className="h-3 bg-zinc-200/40 dark:bg-zinc-800 rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-rose-500/80 via-amber-500/80 to-emerald-500/80" style={{width:`${s}%`}}/>
      </div>
      <div className="mt-2 text-sm text-zinc-300">{s}</div>
    </div>
  );
}
