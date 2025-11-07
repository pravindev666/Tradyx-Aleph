export const fmtn = (n:number, digits=2)=> isFinite(n) ? n.toFixed(digits) : '—';
export const lakh = (n:number)=> (n/100000).toFixed(2) + 'L';