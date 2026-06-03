import { normalize } from '@/shared/utils/normalize';

export const fontScale = {
  h1: { fontSize: normalize(28), lineHeight: 36 },
  h2: { fontSize: normalize(24), lineHeight: 32 },
  h3: { fontSize: normalize(20), lineHeight: 28 },
  h4: { fontSize: normalize(18), lineHeight: 26 },

  bodyLg: { fontSize: normalize(16), lineHeight: 24 },
  body: { fontSize: normalize(14), lineHeight: 20 },
  bodySm: { fontSize: normalize(13), lineHeight: 18 },

  caption: { fontSize: normalize(12), lineHeight: 16 },
  tiny: { fontSize: normalize(10), lineHeight: 14 },
} as const;