import { darkColors, lightColors } from './colors';
import { createTheme } from '@rneui/themed';

export const theme = createTheme({
  darkColors: darkColors,
  lightColors: lightColors,
  mode: 'light',
});

export { spacings } from './spacings';