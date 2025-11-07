import { z } from 'zod';

export const ZDashboard = z.object({
  updatedAt: z.string(),
  spot: z.number().nullable(),
  vix: z.number().nullable(),
  spotSeries: z.array(z.number()),
  vixSeries: z.array(z.number()),
  pcr: z.number().nullable(),
  maxPain: z.number().nullable(),
  pcrWeighted: z.number().nullable().optional(),
  magnetPct: z.number().nullable().optional(),
  atmStrike: z.number().nullable().optional(),
  straddle: z.object({
    call: z.number(), put: z.number(), total: z.number(), expMovePts: z.number(),
    eff30d: z.number().optional()
  }).optional(),
  oi: z.object({
    callsTop: z.array(z.object({
      strike: z.number(), oi: z.number(),
      oiChangePct: z.number().nullable().optional(),
      liquidity: z.number().nullable().optional()
    })),
    putsTop: z.array(z.object({
      strike: z.number(), oi: z.number(),
      oiChangePct: z.number().nullable().optional(),
      liquidity: z.number().nullable().optional()
    }))
  }),
  gex: z.object({
    byStrike: z.array(z.object({ strike:z.number(), gex:z.number() })),
    peaks: z.array(z.number()).optional()
  }).optional(),
  ivRank: z.number().nullable().optional(),
  skewCurve: z.array(z.object({ k:z.number(), iv:z.number() })).optional(),
  whaleAlerts: z.array(z.object({
    ts:z.string(), side: z.enum(['CE','PE']), strike:z.number(), deltaOiPct:z.number(), volume:z.number().optional()
  })).optional(),
  fearGreed: z.object({
    score: z.number(),
    parts: z.object({ vix:z.number(), pcr:z.number(), breadth:z.number(), fii:z.number() })
  }).optional(),
  breadth: z.object({ advances:z.number(), declines:z.number() }).optional()
});
