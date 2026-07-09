import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

const RADIUS = 24; // 👈 PHẢI trùng với sheet

export const CustomBackdrop = ({
  animatedIndex,
  animatedPosition,
}: BottomSheetBackdropProps) => {
  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 0.25],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      height: animatedPosition.value,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrapper, containerStyle]}
    >
      {/* backdrop */}
      <Animated.View style={styles.backdrop} />

      {/* mask bo góc */}
      <Animated.View style={styles.mask} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: -RADIUS,
    left: 0,
    right: 0,
    overflow: 'hidden', // 👈 QUAN TRỌNG
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  mask: {
    position: 'absolute',
    bottom: -RADIUS,
    left: 0,
    right: 0,
    height: RADIUS * 2,
    backgroundColor: '#fff', // cùng màu background app
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
});
