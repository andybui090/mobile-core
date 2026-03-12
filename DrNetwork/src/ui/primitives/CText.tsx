import React, { memo } from 'react';
import {
  Text as RNText,
  TextProps,
  StyleSheet,
} from 'react-native';

import { typography, TextVariant } from '../theme/typography';
import { TextColor } from '../theme/colors';
import { fontFamilies, FontWeight } from '../theme/fonts';
import { TextScale, textScaleMap } from '../theme/textScale';
import { useFontScale } from '../providers/FontScaleProvider';
import { useTheme } from '../providers/ThemeProvider';

type Props = TextProps & {
  variant?: TextVariant;
  color?: TextColor;
  center?: boolean;
  weight?: FontWeight;
  scale?: TextScale; // xs | sm | md | lg | xl
};

export const CText = memo(
  ({
    variant = 'body',
    color = 'textPrimary',
    center,
    weight,
    scale = 'md',
    style,
    ...rest
  }: Props) => {
    const { colors } = useTheme();           // ✅ theme override
    const { finalScale } = useFontScale();   // ✅ app font scale

    const baseStyle = typography[variant];
    const localScale = textScaleMap[scale];

    const fontSize = Math.round(
      baseStyle.fontSize * finalScale * localScale
    );

    const lineHeight = Math.round(
      baseStyle.lineHeight * finalScale * localScale
    );

    return (
      <RNText
        {...rest}
        allowFontScaling={false}
        style={[
          styles.base,
          {
            fontSize,
            lineHeight,
            fontFamily: baseStyle.fontFamily,
          },
          weight && { fontFamily: fontFamilies[weight] },
          { color: colors[color] },
          center && styles.center,
          style,
        ]}
      />
    );
  }
);

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false, // Android fix
  },
  center: {
    textAlign: 'center',
  },
});