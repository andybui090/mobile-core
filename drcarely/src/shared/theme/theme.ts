import { lightColors, darkColors } from './colors';
import { fonts } from './fonts';
import { typography } from './typography';

export type ThemeMode = 'light' | 'dark';

const baseTheme = {
  fonts,
  typography,
};

export const createTheme = (mode: ThemeMode = 'light') => ({
  mode,
  colors: mode === 'dark' ? darkColors : lightColors,
  ...baseTheme,
});

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export type AppTheme = {
  mode: ThemeMode;
  colors: typeof lightColors;
  fonts: typeof fonts;
  typography: typeof typography;
};
