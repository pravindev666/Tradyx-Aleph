export type StrikeDatum = { strike: number; oi: number; oiChangePct?: number; iv?: number; bid?: number; ask?: number; volume?: number; gex?: number; };

export type DashboardData = {
  updatedAt: string;
  spot: number;
  vix: number;
  spotSeries: number[];
  vixSeries: number[];
  pcr: number;
  pcrWeighted?: number;          // Delta-weighted PCR
  maxPain: number;
  magnetPct?: number;            // (spot-maxPain)/spot*100
  atmStrike: number;
  straddle?: { call: number; put: number; total: number; expMovePts: number; eff30d?: number; };
  oi: {
    callsTop: { strike: number; oi: number; oiChangePct?: number; liquidity?: number }[];
    putsTop:  { strike: number; oi: number; oiChangePct?: number; liquidity?: number }[];
    momentum?: { callPct?: number; putPct?: number };
  };
  gex?: { byStrike: { strike:number; gex:number }[]; peaks?: number[] };
  ivRank?: number;               // proxy from VIX 52w
  skewCurve?: { k:number; iv:number }[];   // IV smile
  liquidityMap?: { strike:number; spreadPct:number; score:number }[];
  whaleAlerts?: { ts:string; side:'CE'|'PE'; strike:number; deltaOiPct:number; volume?:number }[];
  fearGreed?: { score:number; parts:{ vix:number; pcr:number; breadth:number; fii:number } };
  breadth?: { advances:number; declines:number };
  fii?: number; dii?: number;
};