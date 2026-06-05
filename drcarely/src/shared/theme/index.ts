import React, { createContext, ReactNode, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { lightColors } from './colors';
import { fonts } from './fonts';
import { typography } from './typography';

export const theme = {
  mode: 'light' as const,
  colors: lightColors,
  fonts,
  typography,
};

export type ThemeType = typeof theme;

const ThemeContext = createContext<ThemeType>(theme);

export const ThemeProvider = ({
  theme: themeValue = theme,
  children,
}: {
  theme?: ThemeType;
  children: ReactNode;
}) =>
  React.createElement(ThemeContext.Provider, { value: themeValue }, children);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return {
    theme: context,
    colors: context.colors,
    fonts: context.fonts,
    typography: context.typography,
  };
};

export const makeStyles = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
  stylesCreator: (params: {
    colors: ThemeType['colors'];
    theme: ThemeType;
  }) => T,
) => {
  return () => {
    const { theme: themeContext, colors } = useTheme();
    return StyleSheet.create(
      stylesCreator({ colors, theme: themeContext }) as any,
    ) as T;
  };
};
