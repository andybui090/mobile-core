import { PixelRatio } from 'react-native';

/**
 * Lấy font scale từ hệ điều hành
 * Ví dụ:
 * 0.85 – 1.3
 */
const systemFontScale = PixelRatio.getFontScale();

/**
 * Clamp lại để UI không vỡ
 */
export const SYSTEM_FONT_SCALE = Math.min(
  Math.max(systemFontScale, 0.9),
  1.2
);