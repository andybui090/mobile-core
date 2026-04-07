import React from 'react';
import {
  Pressable as RNPressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useThemeContext } from '@/shared/theme/ThemeProvider';

type Props = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;

  // 👇 custom
  disabled?: boolean;
  opacity?: number; // pressed opacity
  scale?: number; // pressed scale
};

export const Pressable: React.FC<Props> = ({
  children,
  style,
  disabled,
  opacity = 0.7,
  scale = 0.97,
  ...rest
}) => {
  const { theme } = useThemeContext();

  return (
    <RNPressable
      android_ripple={{ color: theme.colors.border }}
      hitSlop={10}
      disabled={disabled}
      style={({ pressed }) => [
        style,
        {
          opacity: pressed ? opacity : 1,
          transform: [{ scale: pressed ? scale : 1 }],
        },
      ]}
      {...rest}
    >
      {children}
    </RNPressable>
  );
};
