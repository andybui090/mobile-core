import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

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

const DIMENSIONS: Record<
  ToggleSize,
  { width: number; height: number; thumbSize: number; translateX: number }
> = {
  small: { width: 42, height: 24, thumbSize: 20, translateX: 18 },
  basic: { width: 50, height: 28, thumbSize: 24, translateX: 22 },
  large: { width: 62, height: 34, thumbSize: 28, translateX: 28 },
  default: { width: 48, height: 26, thumbSize: 22, translateX: 22 },
};

const ToggleSwitchComponent: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  label,
  labelStyle,
  onColor = '#19A2A7',
  offColor = '#D0D5DD',
  size = 'basic',
  trackOnStyle,
  trackOffStyle,
  thumbOnStyle,
  thumbOffStyle,
  icon,
  disabled = false,
}) => {
  const dim = DIMENSIONS[size] || DIMENSIONS.basic;
  const offsetX = useRef(new Animated.Value(isOn ? dim.translateX : 0)).current;

  useEffect(() => {
    Animated.timing(offsetX, {
      toValue: isOn ? dim.translateX : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isOn, dim.translateX, offsetX]);

  return (
    <View style={styles.container}>
      {label ? (
        <Text allowFontScaling={false} style={[styles.label, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        onPress={() => !disabled && onToggle?.(!isOn)}
        style={[
          styles.track,
          {
            width: dim.width,
            height: dim.height,
            borderRadius: dim.height / 2,
            backgroundColor: isOn ? onColor : offColor,
          },
          isOn ? trackOnStyle : trackOffStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: dim.thumbSize,
              height: dim.thumbSize,
              borderRadius: dim.thumbSize / 2,
              transform: [{ translateX: offsetX }],
            },
            isOn ? thumbOnStyle : thumbOffStyle,
          ]}
        >
          {icon}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export const ToggleSwitch = memo(ToggleSwitchComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginRight: 10,
  },
  track: {
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 2.5,
    elevation: 3,
  },
});

export default ToggleSwitch;
