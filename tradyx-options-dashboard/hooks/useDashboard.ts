'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Stale = 'fresh' | 'soft' | 'hard';

type DashboardJson = {
  updatedAt?: string;
  spot?: number;
  vix?: number;
  spotSeries?: number[];
  vixSeries?: number[];
  pcr?: number;
  maxPain?: number;
  atmStrike?: number;
  straddle?: {
    call: number;
    put: number;
    total: number;
    expMovePts: number;
  };
  oi?: {
    callsTop?: Array<{ strike: number; oi: number; change?: number }>;
    putsTop?: Array<{ strike: number; oi: number; change?: number }>;
  };
  // Extended fields for UI compatibility
  fearGreed?: number;
  totals?: { callOI?: number; putOI?: number; cpRatio?: number };
  topCalls?: Array<{ strike: number; oi: number; change?: number }>;
  topPuts?: Array<{ strike: number; oi: number; change?: number }>;
  whaleAlerts?: Array<{ time: string; strike: number; type: string; volume: number; premium: number; action: 'BUY' | 'SELL' }>;
  ivSkew?: Array<{ strike: number; iv: number }>;
  gammaExposure?: Array<{ strike: number; gamma: number; label?: string }>;
  ivRank?: number;
  oiMomentum?: number;
  predictions?: {
    parkinsonVol?: number;
    expectedMove?: number;
    quantileUpper?: number;
    quantileLower?: number;
    mlBeta?: number;
    parkinsonRegime?: 'Bullish' | 'Neutral' | 'Bearish';
    expectedMoveRegime?: 'Bullish' | 'Neutral' | 'Bearish';
    quantileRegime?: 'Bullish' | 'Neutral' | 'Bearish';
    betaRegime?: 'Bullish' | 'Neutral' | 'Bearish';
  };
  mlPredictions?: {
    nextDayBias?: number;
    nextDayBiasDirection?: 'Bullish' | 'Neutral' | 'Bearish';
    marketProbability?: number;
    marketProbabilityRegime?: 'Bullish' | 'Neutral' | 'Bearish';
    volatilityForecast?: number;
    volatilityForecastRegime?: 'Calm' | 'Normal' | 'Stress';
    predictedRangeUpper?: number;
    predictedRangeLower?: number;
    predictedRangeRegime?: 'Bullish' | 'Neutral' | 'Bearish';
    volatilityRegimeForecast?: number;
    volatilityRegimeForecastCategory?: 'Calm' | 'Normal' | 'Stress';
  };
  volatilityIndicators?: {
    realizedVol?: number;
    hvIvSpread?: number;
    volatilityRatio?: number;
    parkinsonVol20d?: number;
    parkinsonVol60d?: number;
    vixNiftyCorrelation?: number;
    trendConsistencyIndex?: number;
    returnQuantilePosition?: number;
    volatilityRegime?: 'Calm' | 'Normal' | 'Stress';
    rangeCompressionIndex?: number;
    volatilityRiskPremium?: number;
    vrpSlope?: number;
  };
  ohlc?: {
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    previousClose?: number;
    changePct?: number;
  };
  vixOhlc?: {
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    previousClose?: number;
  };
    spotChangePct?: number;
    vixChangePct?: number;
    driftDirection?: number;
    momentumStrength?: number;
};

type Expiry = { label: string; date: Date };

const SOFT_MIN = Number(process.env.NEXT_PUBLIC_STALE_SOFT_MIN ?? 6);
const HARD_MIN = Number(process.env.NEXT_PUBLIC_STALE_HARD_MIN ?? 20);
const FEED_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || '/data/dashboard.json';

function istDateFromUTC(d: Date): Date {
  // Just return Date instance; .toLocale* will format in local tz. We store 15:30 local IST target as fixed wall time by adding offset via Intl is complex; for UI countdown seconds precision is fine using local clock.
  return new Date(d.getTime());
}

function getNextTuesday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay(); // 0..6, Tue = 2
  const delta = (9 - day) % 7 || 7; // days to next Tuesday
  d.setDate(d.getDate() + delta);
  d.setHours(15, 30, 0, 0);
  return istDateFromUTC(d);
}

function getLastTuesdayOfMonth(year: number, month0: number): Date {
  // month0 0..11, find last Tuesday
  const lastDay = new Date(year, month0 + 1, 0); // last day of month
  const day = lastDay.getDay();
  const offset = (day - 2 + 7) % 7; // how many days since Tuesday
  lastDay.setDate(lastDay.getDate() - offset);
  lastDay.setHours(15, 30, 0, 0);
  return istDateFromUTC(lastDay);
}

function buildExpiries(now: Date): Expiry[] {
  const weekly = getNextTuesday(now);
  const nextWeekly = getNextTuesday(new Date(weekly.getTime() + 24 * 3600 * 1000));

  const monthly = getLastTuesdayOfMonth(now.getFullYear(), now.getMonth());
  const nextMonthBase = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthly = getLastTuesdayOfMonth(nextMonthBase.getFullYear(), nextMonthBase.getMonth());

  return [
    { label: 'Weekly', date: weekly },
    { label: 'Next Week', date: nextWeekly },
    { label: 'Monthly', date: monthly },
    { label: 'Next Month', date: nextMonthly },
  ];
}

function computeStale(updatedAt?: string): Stale {
  if (!updatedAt) return 'hard';
  const ageMin = Math.max(0, (Date.now() - Date.parse(updatedAt)) / 60000);
  if (ageMin >= HARD_MIN) return 'hard';
  if (ageMin >= SOFT_MIN) return 'soft';
  return 'fresh';
}

function round(num: number, decimals: number): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function useDashboard() {
  const [data, setData] = useState<DashboardJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState<Stale>('hard');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Add timestamp to bust cache on refresh - use random to force reload
      const timestamp = Date.now();
      const url = `${FEED_URL}?t=${timestamp}&_=${Math.random()}`;
      const r = await fetch(url, { 
        cache: 'no-store', 
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } 
      });
      if (!r.ok) throw new Error(`http ${r.status}`);
      const j = (await r.json()) as DashboardJson;
      
      // Transform Python data to match expected format
      const transformed: DashboardJson = {
        ...j,
        fearGreed: 50, // Default value since Python doesn't provide this yet
        // Pass through calculated fields (only what's needed)
        ivRank: j.ivRank,
        // Pass through predictions
        predictions: j.predictions,
        // Pass through ML predictions
        mlPredictions: j.mlPredictions,
        // Pass through volatility indicators
        volatilityIndicators: j.volatilityIndicators,
        // Pass through OHLC data
        ohlc: j.ohlc,
        // Pass through VIX OHLC and change percentages
        vixOhlc: j.vixOhlc,
        spotChangePct: j.spotChangePct,
        vixChangePct: j.vixChangePct,
        // Pass through drift direction and momentum strength
        driftDirection: j.driftDirection,
        momentumStrength: j.momentumStrength,
      };
      
      // Debug: log data (only in development)
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Dashboard data loaded successfully:', {
          spot: transformed.spot,
          vix: transformed.vix,
          pcr: transformed.pcr, // Used in MMI
          ivRank: transformed.ivRank,
          predictions: transformed.predictions ? 'loaded' : 'missing',
          volatilityIndicators: transformed.volatilityIndicators ? 'loaded' : 'missing'
        });
      }
      
      setData(transformed);
      setStale(computeStale(j.updatedAt));
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
      setData(null);
      setStale('hard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived
  const spotSeries = data?.spotSeries ?? [];
  const vixSeries = data?.vixSeries ?? [];

  // Extract advanced metrics from data
  const ivRank: number | null = data?.ivRank ?? null;

  const expiries = useMemo(() => buildExpiries(new Date()), []);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    stale,
    ivRank,
    spotSeries,
    vixSeries,
    expiries,
    refresh,
  } as const;
}


