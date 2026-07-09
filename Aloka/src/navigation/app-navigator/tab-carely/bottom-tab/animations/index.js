import {initializeRegistryWithDefinitions} from 'react-native-animatable';

export const ANIMATIONS = {
  ZOOM_IN_OUT: 'zoomInOut',
};

export default function register() {
  initializeRegistryWithDefinitions({
    [ANIMATIONS.ZOOM_IN_OUT]: {
      0: {
        scale: 1,
      },
      0.25: {
        scale: 1.1,
      },
      0.5: {
        scale: 1.2,
      },
      0.8: {
        scale: 1.1,
      },
      1: {
        scale: 1,
      },
    },
  });
}
