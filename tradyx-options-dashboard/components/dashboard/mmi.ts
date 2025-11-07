export type MMIInputs = {
  vix: number;        // India VIX (%)
  pcr: number;        // Put/Call OI ratio
  ivr: number;        // IV Rank (0-100)
  adr: number;        // Advance/Decline ratio (>1 bullish)
  rvOverIv: number;   // realized(20d)/implied(ATM), <1 bullish for sellers
  means?: Partial<Record<string, number>>;
  stds?: Partial<Record<string, number>>;
};

const DEF_MEAN = { vix: 14, pcr: 1.0, ivr: 40, adr: 1.0, rvOverIv: 0.9 };
const DEF_STD  = { vix: 3.0, pcr: 0.2, ivr: 20, adr: 0.3, rvOverIv: 0.2 };

function z(x: number, mu: number, sd: number) {
  const s = sd > 1e-6 ? sd : 1;
  return (x - mu) / s;
}

export function computeMMI(inp: MMIInputs) {
  const m = { ...DEF_MEAN, ...(inp.means || {}) } as Record<string, number>;
  const s = { ...DEF_STD,  ...(inp.stds  || {}) } as Record<string, number>;

  // Flip signs so "positive = bullish"
  const zvix   = -z(inp.vix, m.vix, s.vix);
  const zpcr   =  z(inp.pcr, m.pcr, s.pcr);
  const zivr   = -z(inp.ivr, m.ivr, s.ivr);
  const zadr   =  z(inp.adr, m.adr, s.adr);
  const zrviv  = -z(inp.rvOverIv, m.rvOverIv, s.rvOverIv);

  const weights = { vix:0.25, pcr:0.25, ivr:0.20, adr:0.20, rviv:0.10 };
  const Z =
    weights.vix * zvix +
    weights.pcr * zpcr +
    weights.ivr * zivr +
    weights.adr * zadr +
    weights.rviv * zrviv;

  // Squash to 0–100
  const k = 0.75;
  const logistic = 1 / (1 + Math.exp(-k * Z));
  const mmi = Math.max(0, Math.min(100, 100 * logistic));

  let regime: 'Extreme Fear'|'Fear'|'Neutral'|'Greed'|'Extreme Greed' = 'Neutral';
  if (mmi < 25) regime = 'Extreme Fear';
  else if (mmi < 45) regime = 'Fear';
  else if (mmi <= 55) regime = 'Neutral';
  else if (mmi <= 75) regime = 'Greed';
  else regime = 'Extreme Greed';

  return { mmi, regime, z: { zvix, zpcr, zivr, zadr, zrviv }, Z };
}

