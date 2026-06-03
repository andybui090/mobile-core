import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { useThemeContext } from '@/shared/theme/ThemeProvider';
import { SpacingKey } from '@/shared/theme/tokens/spacing';

type Props = ViewProps & {
  gap?: SpacingKey | number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  style?: StyleProp<ViewStyle>;
};

export const Column: React.FC<Props> = ({
  gap,
  align = 'flex-start',
  justify = 'flex-start',
  style,
  children,
  ...rest
}) => {
  const { theme } = useThemeContext();

  const gapValue =
    typeof gap === 'number' ? gap : gap ? theme.spacing[gap] : 0;

  return (
    <View
      style={[
        {
          flexDirection: 'column',
          alignItems: align,
          justifyContent: justify,
          gap: gapValue,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};