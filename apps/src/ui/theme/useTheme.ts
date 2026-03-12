import { useColorScheme } from 'react-native';
import { colors, ThemeMode, ThemeColors } from './colors';

export const useTheme = () => {
  const scheme = (useColorScheme() ?? 'light') as ThemeMode;
  const palette: ThemeColors = colors[scheme];

  return {
    mode: scheme,
    colors: palette,
  };
};