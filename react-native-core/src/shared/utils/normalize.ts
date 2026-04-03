import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BASE_WIDTH = 375;

// 👇 clamp theo scale
// 👇 clamp nhẹ hơn vì chỉ phone
const MIN_SCALE = 0.95;
const MAX_SCALE = 1.1;

export const normalize = (size: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;

  const clampedScale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);

  const newSize = size * clampedScale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};