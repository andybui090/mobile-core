import { lightColors, darkColors } from './colors';
import { fonts } from './fonts';
import { fontScale } from './fontScale';
import { sizes } from './tokens/sizes';
import { spacing } from './tokens/spacing';

export const lightTheme = {
  colors: lightColors,
  fonts,
  fontScale,
  sizes,
  spacing,
};

export const darkTheme = {
  colors: darkColors,
  fonts,
  fontScale,
  sizes,
  spacing,
};

export type AppTheme = {
  colors: typeof lightColors;
  fonts: typeof fonts;
  fontScale: typeof fontScale;
  sizes: typeof sizes;
  spacing: typeof spacing;
};
