import { readFile } from 'fs/promises';
import { join } from 'path';

const SOFT = Number(process.env.NEXT_PUBLIC_STALE_SOFT_MIN ?? 6);
const HARD = Number(process.env.NEXT_PUBLIC_STALE_HARD_MIN ?? 20);
const URL  = process.env.NEXT_PUBLIC_DASHBOARD_URL!;

// small helper
function withTimeout<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

// Read local JSON file from public folder (server-side)
async function readLocalDashboard(): Promise<any | null> {
  try {
    const publicPath = join(process.cwd(), 'public', 'data', 'dashboard.json');
    const content = await readFile(publicPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export type FetchState<T> = {
  data?: T;
  error?: string;
  stale: 'fresh' | 'soft' | 'hard';
  updatedAt?: string;
};

export async function fetchDashboard<T = any>(): Promise<FetchState<T>> {
  // If URL is not configured, try local fallback first
  if (!URL) {
    const localData = await readLocalDashboard();
    if (localData) {
      return { data: localData, stale: 'hard', updatedAt: localData.updatedAt };
    }
    return { stale: 'hard', error: 'Dashboard URL not configured and local data not found' };
  }

  try {
    const r = await withTimeout(fetch(URL, { cache: 'no-store' }), 8000);
    if (!r.ok) throw new Error(`http ${r.status}`);
    const data = (await r.json()) as T & { updatedAt?: string };

    // stale classification
    const updatedAt = (data as any)?.updatedAt;
    let stale: FetchState<T>['stale'] = 'fresh';
    if (updatedAt) {
      const ageMin = Math.max(0, (Date.now() - Date.parse(updatedAt)) / 60000);
      if (ageMin >= HARD) stale = 'hard';
      else if (ageMin >= SOFT) stale = 'soft';
    }

    return { data, stale, updatedAt };
  } catch (e: any) {
    // If network fails, try a last-known local fallback (optional)
    const localData = await readLocalDashboard();
    if (localData) {
      return { data: localData, stale: 'hard', updatedAt: localData.updatedAt, error: String(e?.message ?? 'fetch failed') };
    }
    return { stale: 'hard', error: String(e?.message ?? 'fetch failed') };
  }
}