import { normalize } from '@/shared/utils/normalize';

export const fontScale = {
  h1: { fontSize: normalize(26), lineHeight: normalize(34) },
  h2: { fontSize: normalize(22), lineHeight: normalize(30) },
  h3: { fontSize: normalize(18), lineHeight: normalize(26) },
  h4: { fontSize: normalize(16), lineHeight: normalize(24) },

  bodyLg: { fontSize: normalize(15), lineHeight: normalize(22) },
  body: { fontSize: normalize(14), lineHeight: normalize(20) },
  bodySm: { fontSize: normalize(13), lineHeight: normalize(18) },

  caption: { fontSize: normalize(12), lineHeight: normalize(16) },
  tiny: { fontSize: normalize(10), lineHeight: normalize(14) },
} as const;