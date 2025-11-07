'use client';
export default function Sparkline({ data, up='#22c55e', dn='#ef4444' }:{ data:number[]; up?:string; dn?:string }){
  if (!data || data.length<2) return <svg width={90} height={28}/>;
  const w=90,h=28; const max=Math.max(...data), min=Math.min(...data), range=(max-min)||1;
  const points = data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(' ');
  const color = (data.at(-1)! - data[0])>=0 ? up : dn;
  return <svg width={w} height={h}><polyline points={points} fill="none" stroke={color} strokeWidth="2"/></svg>;
}
