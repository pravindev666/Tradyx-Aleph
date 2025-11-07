'use client';
export default function IVSkewChart({ points }:{ points:{k:number; iv:number}[] }){
  if (!points?.length) return null;
  const w=420,h=160;
  const xs = points.map(p=>p.k), ys=points.map(p=>p.iv);
  const xmin=Math.min(...xs), xmax=Math.max(...xs), ymin=Math.min(...ys), ymax=Math.max(...ys);
  const x=(k:number)=> ( (k - xmin) / ((xmax-xmin)||1) ) * w;
  const y=(v:number)=> h - ( (v - ymin) / ((ymax-ymin)||1) ) * h;
  const d = points.map((p,i)=>`${i?'L':'M'}${x(p.k)},${y(p.iv)}`).join(' ');
  return (
    <div className="card p-4">
      <div className="text-sm text-zinc-500 mb-2">IV Skew (smile)</div>
      <svg width={w} height={h}><path d={d} fill="none" stroke="#06b6d4" strokeWidth="2"/></svg>
    </div>
  );
}
