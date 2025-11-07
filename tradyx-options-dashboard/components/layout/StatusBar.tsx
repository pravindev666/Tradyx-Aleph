'use client';
export default function StatusBar({ updatedAt, stale }:{ updatedAt?:string; stale:'fresh'|'soft'|'hard' }){
  const when = updatedAt ? new Date(updatedAt).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',day:'2-digit',month:'short'}) : '—';
  const cls = stale==='fresh'?'bg-emerald-500/15 text-emerald-400': stale==='soft'?'bg-amber-500/15 text-amber-400':'bg-rose-500/15 text-rose-400';
  const label = stale==='fresh'?'FRESH':'STALE';
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`px-2 py-0.5 rounded ${cls}`}>{label}</span>
      <span className="text-zinc-500">Last Updated:</span>
      <span className="text-zinc-300">{when}</span>
    </div>
  );
}
