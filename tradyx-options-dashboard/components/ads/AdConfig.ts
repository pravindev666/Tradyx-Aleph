// Centralized Ad Configuration
// Single source of truth for all ad keys and sizes

export const AD_KEYS = {
  BANNER_728x90: 'b4903cf5635d652e019f9cf30ea1cd88',
  BANNER_468x60: 'd8c93074244d311adc394f3a309c3118',
  RECTANGLE_300x250: '2f370fd28cbdeb2108926fba77c70947',
  MOBILE_320x50: '35bb5972176687c2571d4f6e436e1f71',
} as const;

export const AD_SIZES = {
  BANNER_728x90: { width: 728, height: 90 },
  BANNER_468x60: { width: 468, height: 60 },
  RECTANGLE_300x250: { width: 300, height: 250 },
  MOBILE_320x50: { width: 320, height: 50 },
} as const;

export type AdKeyType = typeof AD_KEYS[keyof typeof AD_KEYS];
export type AdSizeType = typeof AD_SIZES[keyof typeof AD_SIZES];

