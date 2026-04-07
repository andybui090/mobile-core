import {
    DefaultTheme,
    Theme as NavigationTheme
} from '@react-navigation/native';

export const createNavigationTheme = (colors:any): NavigationTheme => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    text: colors.text,
  },
})