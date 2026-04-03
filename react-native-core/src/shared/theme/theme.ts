import { lightColors, darkColors } from './colors';
import { fonts } from './fonts';
import { fontScale } from './fontScale';

export const lightTheme = {
  colors: lightColors,
  fonts,
  fontScale,
};

export const darkTheme = {
  colors: darkColors,
  fonts,
  fontScale,
};

export type AppTheme = typeof lightTheme;