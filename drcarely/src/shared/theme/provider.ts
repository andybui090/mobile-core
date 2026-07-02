import React, { createContext, ReactNode, useContext } from 'react';
import { StyleSheet } from 'react-native';

import { lightTheme, type AppTheme } from './theme';

export const theme = lightTheme;

export type ThemeType = AppTheme;

const ThemeContext = createContext<ThemeType>(theme);

export const ThemeProvider = ({
  theme: themeValue,
  children,
}: {
  theme?: AppTheme;
  children: ReactNode;
}) => {
  return React.createElement(
    ThemeContext.Provider,
    { value: themeValue ?? theme },
    children,
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return {
    theme: context,
    mode: context.mode,
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
