export const typography = {
  displayLarge: { fontSize: 26, lineHeight: 34 },
  headlineLarge: { fontSize: 22, lineHeight: 30 },
  headlineMedium: { fontSize: 18, lineHeight: 26 },
  titleLarge: { fontSize: 16, lineHeight: 24 },

  bodyLarge: { fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontSize: 14, lineHeight: 20 },
  bodySmall: { fontSize: 13, lineHeight: 18 },

  labelMedium: { fontSize: 12, lineHeight: 16 },
  labelSmall: { fontSize: 10, lineHeight: 14 },
} as const;

export type TypographyVariant = keyof typeof typography;
