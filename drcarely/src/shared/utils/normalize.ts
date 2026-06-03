import { Dimensions, PixelRatio } from 'react-native';

const BASE_WIDTH = 375;

const MIN_SCALE = 0.95;
const MAX_SCALE = 1.1;

const { width } = Dimensions.get('window');

const SCALE = Math.min(Math.max(width / BASE_WIDTH, MIN_SCALE), MAX_SCALE);

export const normalize = (size: number): number =>
  PixelRatio.roundToNearestPixel(size * SCALE);