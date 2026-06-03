import { sizes } from './sizes';

// 👉 base spacing scale (reuse sizes)
export const spacing = {
  none: 0,

  xs: sizes.xs,   // 12
  sm: sizes.sm,   // 16
  md: sizes.md,   // 20
  lg: sizes.lg,   // 24
  xl: sizes.xl,   // 32
  xxl: sizes.xxl, // 40

  // 👉 semantic (optional nhưng rất hữu ích)
  screenPadding: sizes.lg,
  cardPadding: sizes.md,
  sectionGap: sizes.xl,
} as const;

export type SpacingKey = keyof typeof spacing;