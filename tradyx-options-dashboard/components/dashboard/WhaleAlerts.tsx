'use client';
export default function WhaleAlerts({ items }:{ items:{ts:string; side:'CE'|'PE'; strike:number; deltaOiPct:number; volume?:number}[] }){
  if (!items?.length) return null;
  return (
    <div className="card p-4">
      <div className="text-sm text-zinc-500 mb-2">Whale Alerts (15m)</div>
      <div className="space-y-1">
        {items.slice(0,10).map((a,i)=>(
          <div key={i} className="text-sm">
            <span className="text-zinc-400">{new Date(a.ts).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
            <span className={`ml-2 px-1 rounded ${a.side==='CE'?'bg-emerald-500/20 text-emerald-300':'bg-rose-500/20 text-rose-300'}`}>{a.side}</span>
            <span className="ml-2 text-zinc-300 font-medium">{a.strike}</span>
            <span className="ml-2 text-zinc-400">ΔOI {a.deltaOiPct>0?'+':''}{a.deltaOiPct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
