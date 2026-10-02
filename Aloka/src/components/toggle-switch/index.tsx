import React, { memo, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { screenStyles } from '@/configs';

/* ===================== TYPES ===================== */

type ToggleSize = 'small' | 'basic' | 'large' | 'default';

export interface ToggleSwitchProps {
  isOn: boolean;
  onToggle?: (value: boolean) => void;

  label?: string;
  labelStyle?: TextStyle;

  onColor?: string;
  offColor?: string;

  size?: ToggleSize;

  trackOnStyle?: ViewStyle;
  trackOffStyle?: ViewStyle;

  thumbOnStyle?: ViewStyle;
  thumbOffStyle?: ViewStyle;

  icon?: React.ReactNode;
  disabled?: boolean;
}

/* ===================== UTILS ===================== */

const calculateDimensions = (size: ToggleSize) => {
  switch (size) {
    case 'small':
      return { width: 40, padding: 10, circle: 15, translateX: 22 };
    case 'basic':
      return { width: 40, padding: 12, circle: 17, translateX: 24 };
    case 'large':
      return { width: 70, padding: 20, circle: 30, translateX: 38 };
    default:
      return { width: 46, padding: 12, circle: 18, translateX: 26 };
  }
};

/* ===================== COMPONENT ===================== */

const ToggleSwitchComponent: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,

  label,
  labelStyle,

  onColor = '#4cd137',
  offColor = '#ecf0f1',

  size = 'small',

  trackOnStyle,
  trackOffStyle,
  thumbOnStyle,
  thumbOffStyle,

  icon,
  disabled = false,
}) => {
  const offsetX = useRef(new Animated.Value(0)).current;

  const dimensions = useMemo(
    () => calculateDimensions(size),
    [size],
  );

  /* ---------- animation ---------- */
  useEffect(() => {
    const toValue = isOn
      ? dimensions.width - dimensions.translateX
      : 0;

    Animated.timing(offsetX, {
      toValue,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }, [isOn, dimensions, offsetX]);

  /* ---------- styles ---------- */

  const trackStyle = useMemo(
    () => [
      styles.track,
      {
        width: dimensions.width,
        padding: dimensions.padding,
        backgroundColor: isOn ? onColor : offColor,
      },
      isOn ? trackOnStyle : trackOffStyle,
    ],
    [dimensions, isOn, onColor, offColor, trackOnStyle, trackOffStyle],
  );

  const thumbStyle = useMemo(
    () => [
      styles.thumb,
      {
        width: dimensions.circle,
        height: dimensions.circle,
        borderRadius: dimensions.circle / 2,
        transform: [{ translateX: offsetX }],
      },
      isOn ? thumbOnStyle : thumbOffStyle,
    ],
    [dimensions, isOn, offsetX, thumbOnStyle, thumbOffStyle],
  );

  /* ---------- render ---------- */

  return (
    <View style={styles.container}>
      {label ? (
        <Text
          allowFontScaling={false}
          style={[styles.label, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <TouchableOpacity
        hitSlop={screenStyles.hitSlop20}
        activeOpacity={0.8}
        disabled={disabled}
        style={trackStyle}
        onPress={() => !disabled && onToggle?.(!isOn)}>
        <Animated.View style={thumbStyle}>
          {icon}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

/* ===================== EXPORT ===================== */

export const ToggleSwitch = memo(ToggleSwitchComponent);

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginRight: 10,
  },
  track: {
    justifyContent: 'center',
    borderRadius: 20,
  },
  thumb: {
    position: 'absolute',
    margin: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
});
