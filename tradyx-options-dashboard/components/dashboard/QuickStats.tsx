'use client';
export default function QuickStats({ stats }:{ stats:{label:string; value:number; max?:number}[] }){
  const maxW = (v:number, max?:number)=> Math.min(100, Math.round( (max? (v/max)*100 : 100) ));
  return (
    <div className="card p-4">
      <div className="grid gap-3">
        {stats.map((s,i)=>(
          <div key={i}>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{s.label}</span><span className="text-zinc-300 font-medium">{Number.isFinite(s.value)? s.value.toFixed(2) : '—'}</span>
            </div>
            <div className="h-2 bg-zinc-200/40 dark:bg-zinc-800 rounded overflow-hidden mt-1">
              <div className="h-full bg-cyan-500/80" style={{width:`${maxW(s.value, s.max)}%`}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
