import React, {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { colors, ThemeColors, ThemeMode } from '../theme/colors';
import { AppThemeMode } from '../theme/themeMode';

type ThemeContextValue = {
    mode: AppThemeMode;
    colors: ThemeColors;
    setMode: (mode: AppThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const systemScheme = useColorScheme();

    const normalizedSystemMode: ThemeMode =
        systemScheme === 'dark' ? 'dark' : 'light';

    const [mode, setMode] = useState<AppThemeMode>('system');

    const resolvedMode: ThemeMode =
        mode === 'system' ? normalizedSystemMode : mode;

    const palette = useMemo(
        () => colors[resolvedMode],
        [resolvedMode]
    );

    return (
        <ThemeContext.Provider
            value={{
                mode,
                colors: palette,
                setMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return ctx;
};