'use client';
export default function GammaHeatmap({ rows }:{ rows:{strike:number; gex:number}[] }){
  if (!rows?.length) return null;
  const max = Math.max(...rows.map(r=>Math.abs(r.gex))) || 1;
  return (
    <div className="card p-4">
      <div className="text-sm text-zinc-500 mb-2">Gamma Exposure by Strike</div>
      <div className="space-y-2">
        {rows.slice(0,20).map((r,i)=>(
          <div key={i} className="flex items-center gap-2">
            <div className="w-16 text-xs text-zinc-400">{r.strike}</div>
            <div className="flex-1 h-3 bg-zinc-200/40 dark:bg-zinc-800 rounded">
              <div className={`h-3 ${r.gex>=0?'bg-emerald-500/80':'bg-rose-500/80'}`} style={{width:`${Math.min(100, Math.abs(r.gex)/max*100)}%`}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
