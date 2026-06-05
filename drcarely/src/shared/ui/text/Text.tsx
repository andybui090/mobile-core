import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from 'react-native';

import { useTheme } from '@/shared/theme';
import { typography } from '@/shared/theme/typography';

type Variant = keyof typeof typography;
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

export const Text = ({
  variant = 'bodyMedium',
  color,
  weight = 'regular',
  align = 'left',
  allowScaling,
  style,
  ...rest
}: Props) => {
  const { colors, typography, fonts } = useTheme();
  const scale = typography[variant];

  return (
    <RNText
      allowFontScaling={allowScaling ?? false}
      style={[
        {
          fontSize: scale.fontSize,
          lineHeight: scale.lineHeight,
          color: color ?? colors.txtPrimary,
          fontFamily: fonts.inter[weight],
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    />
  );
};
