import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { useThemeContext } from '@/shared/theme/ThemeProvider';
import { fontScale as baseFontScale } from '@/shared/theme/fontScale';
import { fontSizeMultiplier } from '@/shared/theme/fontSizeSetting';

// =========================
// TYPES
// =========================
type Variant = keyof typeof baseFontScale;
type Weight = 'regular' | 'medium' | 'semibold' | 'bold';
type Align = 'left' | 'center' | 'right';

interface Props extends RNTextProps {
  variant?: Variant;
  color?: string;
  weight?: Weight;
  align?: Align;
  allowScaling?: boolean;
  style?: StyleProp<TextStyle>;
}

// =========================
// COMPONENT
// =========================
export const Text = ({
  variant = 'body',
  color,
  weight = 'regular',
  align = 'left',
  allowScaling,
  style,
  ...rest
}: Props) => {
  const { colors, fontScale, fonts } = useTheme(); // theme
  const { fontSizeMode } = useThemeContext(); // 👈 lấy multiplier

  const multiplier = fontSizeMultiplier[fontSizeMode];
  const scale = fontScale[variant];

  return (
    <RNText
      allowFontScaling={allowScaling ?? false}
      style={[
        {
          fontSize: scale.fontSize * multiplier,
          lineHeight: scale.lineHeight * multiplier,
          color: color ?? colors.text,
          fontFamily: fonts.inter[weight],
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    />
  );
};