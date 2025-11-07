'use client';
import { getThisMonthExpiries, formatCountdown } from '@/lib/expiry';

export default function ExpiryBoard(){
  const items = getThisMonthExpiries();
  return (
    <div className="grid md:grid-cols-4 gap-3">
      {items.map((e,i)=>(
        <div key={i} className="card p-4">
          <div className="text-xs text-zinc-500">{e.label}</div>
          <div className="text-lg font-semibold text-cyan-400">{formatCountdown(e.date)}</div>
          <div className="text-xs text-zinc-500 mt-1">{e.date.toLocaleDateString('en-IN')}</div>
        </div>
      ))}
    </div>
  );
}
