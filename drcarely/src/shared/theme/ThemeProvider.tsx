import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, AppTheme } from './theme';

type ThemeMode = 'light' | 'dark' | 'system';
type FontSizeMode = 'small' | 'normal' | 'large';

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;

  fontSizeMode: FontSizeMode;
  setFontSizeMode: (mode: FontSizeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();

  // =========================
  // STATE
  // =========================
  const [mode, setMode] = useState<ThemeMode>('system');
  const [fontSizeMode, setFontSizeMode] =
    useState<FontSizeMode>('normal');

  // =========================
  // THEME
  // =========================
  const theme = useMemo(() => {
    if (mode === 'light') return lightTheme;
    if (mode === 'dark') return darkTheme;
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }, [mode, systemScheme]);

  // =========================
  // CONTEXT VALUE
  // =========================
  const value = useMemo(
    () => ({
      theme,
      mode,
      setMode,
      fontSizeMode,
      setFontSizeMode,
    }),
    [theme, mode, fontSizeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// =========================
// HOOK
// =========================
export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider');
  return ctx;
};