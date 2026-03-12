import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { CText } from './CText';
import { useTheme } from '@/ui/providers/ThemeProvider';
import {
  ButtonVariant,
  ButtonSize,
  buttonHeights,
  buttonPaddingHorizontal,
} from '../theme/button';

type Props = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export const CButton = ({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onPress,
  style,
}: Props) => {
  const { colors } = useTheme();

  const backgroundColor = disabled
    ? colors.buttonPrimaryDisabled
    : colors[`button${capitalize(variant)}`];

  /**
   * Button tự quyết text color
   * - primary / danger → chữ inverse
   * - disabled → textDisabled
   */
  const textColor = disabled
    ? 'textDisabled'
    : 'textInverse';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        {
          height: buttonHeights[size],
          paddingHorizontal: buttonPaddingHorizontal[size],
          backgroundColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <CText
        variant="button"
        weight="medium"
        color={textColor}
        center
      >
        {title}
      </CText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function capitalize<T extends string>(v: T) {
  return (v.charAt(0).toUpperCase() + v.slice(1)) as Capitalize<T>;
}