export type ExpiryInfo = { label: string; date: Date };

const TUESDAY = 2; // 0=Sun … 2=Tue

export function getThisMonthExpiries(now = new Date()): ExpiryInfo[] {
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  const tuesdays: Date[] = [];
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === TUESDAY) tuesdays.push(new Date(d));
  }

  // next 3 weekly Tuesdays from TODAY (this month only)
  const nextWeeklies = tuesdays.filter(d => strip(d) >= strip(now)).slice(0, 3);
  const monthly = tuesdays[tuesdays.length - 1];

  const out: ExpiryInfo[] = nextWeeklies.map((d, i) => ({ label: `Weekly ${i + 1}`, date: d }));
  out.push({ label: 'Monthly', date: monthly });
  return out;
}

function strip(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }

export function formatCountdown(target: Date, now = new Date()) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${d}d ${h}h ${m}m`;
}