import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export interface CSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
}

export const CSwitch: React.FC<CSwitchProps> = ({
  value,
  onValueChange,
  activeColor = '#4E9B8F',
  inactiveColor = '#E4E7EC',
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View style={[styles.track, { backgroundColor }, style]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 25,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  thumb: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    backgroundColor: '#FFFFFF',
  },
});

export default CSwitch;
