'use client';
export default function OITable({ side, rows }:{ side:'Calls'|'Puts'; rows:{strike:number; oi:number; oiChangePct?:number; liquidity?:number}[] }){
  return (
    <div className="card p-4">
      <div className="text-sm text-zinc-500 mb-2">Top {side} OI</div>
      <div className="space-y-2">
        {rows?.map((r,i)=>(
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="text-zinc-300 font-medium w-24">{r.strike}</div>
            <div className="text-zinc-400 flex-1">OI: {(r.oi/100000).toFixed(2)}L</div>
            <div className="text-zinc-400 w-20">{r.oiChangePct!=null ? `${r.oiChangePct.toFixed(1)}%` : ''}</div>
            <div className="w-20"><span className={`px-2 py-0.5 rounded text-xs ${liqClass(r.liquidity)}`}>{r.liquidity!=null ? (r.liquidity*100).toFixed(0)+'%' : ''}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function liqClass(s?:number){
  if (s==null) return 'bg-zinc-700/40';
  if (s>=0.66) return 'bg-emerald-500/20 text-emerald-300';
  if (s>=0.33) return 'bg-amber-500/20 text-amber-300';
  return 'bg-rose-500/20 text-rose-300';
}
