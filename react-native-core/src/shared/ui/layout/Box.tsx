import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { useThemeContext } from '@/shared/theme/ThemeProvider';
import { SpacingKey } from '@/shared/theme/tokens/spacing';

type Props = ViewProps & {
  p?: SpacingKey | number;
  px?: SpacingKey | number;
  py?: SpacingKey | number;
  pt?: SpacingKey | number;
  pb?: SpacingKey | number;
  pl?: SpacingKey | number;
  pr?: SpacingKey | number;

  m?: SpacingKey | number;
  mx?: SpacingKey | number;
  my?: SpacingKey | number;

  bg?: string;
  radius?: number;

  style?: StyleProp<ViewStyle>;
};

export const Box: React.FC<Props> = ({
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  bg,
  radius,
  style,
  children,
  ...rest
}) => {
  const { theme } = useThemeContext();

  const get = (value?: SpacingKey | number) =>
    typeof value === 'number' ? value : value ? theme.spacing[value] : undefined;

  return (
    <View
      style={[
        {
          padding: get(p),
          paddingHorizontal: get(px),
          paddingVertical: get(py),
          paddingTop: get(pt),
          paddingBottom: get(pb),
          paddingLeft: get(pl),
          paddingRight: get(pr),

          margin: get(m),
          marginHorizontal: get(mx),
          marginVertical: get(my),

          backgroundColor: bg,
          borderRadius: radius,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};