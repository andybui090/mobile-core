import React, { createContext, useContext, useMemo, useState } from 'react';
import { PixelRatio } from 'react-native';
import { AppFontScale, appFontScaleMap } from '../theme/appFontScale';

type FontScaleContextValue = {
  appScale: AppFontScale;
  setAppScale: (v: AppFontScale) => void;
  finalScale: number;
};

const FontScaleContext = createContext<FontScaleContextValue | null>(null);

export const FontScaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 1️⃣ Font scale từ OS
  const systemScale = PixelRatio.getFontScale();
  const clampedSystemScale = Math.min(Math.max(systemScale, 0.9), 1.2);

  // 2️⃣ Font scale user chọn trong app
  const [appScale, setAppScale] = useState<AppFontScale>('default');

  // 3️⃣ Scale cuối cùng
  const finalScale = useMemo(() => {
    return clampedSystemScale * appFontScaleMap[appScale];
  }, [clampedSystemScale, appScale]);

  return (
    <FontScaleContext.Provider
      value={{ appScale, setAppScale, finalScale }}
    >
      {children}
    </FontScaleContext.Provider>
  );
};

export const useFontScale = () => {
  const ctx = useContext(FontScaleContext);
  if (!ctx) {
    throw new Error('useFontScale must be used inside FontScaleProvider');
  }
  return ctx;
};