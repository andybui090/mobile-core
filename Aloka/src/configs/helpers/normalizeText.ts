/**
 *
 * Credits :
 * https://github.com/react-native-training/react-native-elements/blob/master/src/helpers/normalizeText.js
 *
 * Thank you so much for awesome normalization methods.
 * All Credits are going for @xiaoneng & RN Elements Team
 *
 */

import { PixelRatio, Dimensions } from "react-native";

export const pixelRatio = PixelRatio.get();
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

// ? -- Testing Only --
// const fontScale = PixelRatio.getFontScale();
// const layoutSize = PixelRatio.getPixelSizeForLayoutSize(14);
// console.log('normalizeText getPR ->', pixelRatio);
// console.log('normalizeText getFS ->', fontScale);
// console.log('normalizeText getDH ->', deviceHeight);
// console.log('normalizeText getDW ->', deviceWidth);
// console.log('normalizeText getPSFLS ->', layoutSize);

const normalize = (size: number) => {
  if (pixelRatio >= 2 && pixelRatio < 3) {
    // iPhone 5s and older Androids
    if (deviceWidth < 360) {
      return size * 0.95;
    }

    // iPhone 5
    if (deviceHeight < 667) {
      return size;
    }

    // iPhone 6-6s
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.15;
    }
    // Older Phablets
    return size * 1.25;
  }

  if (pixelRatio >= 3 && pixelRatio < 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
    }

    // Catch other weird android width sizings
    if (deviceHeight < 667) {
      return size * 1.15;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.2;
    }

    // catch larger devices
    // ie iPhone 6s plus / 7 plus / mi note 等等
    return size * 1.27;
  }

  if (pixelRatio >= 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
      // Catch other smaller android height sizings
    }

    if (deviceHeight < 667) {
      return size * 1.2;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.25;
    }

    // catch larger Phablet devices
    return size * 1.4;
  }

  return size;
};

export const widthPercentageToDP = (widthPercent: any) => {
  // const {width} = Dimensions.get('window');
  // Parse string percentage input and convert it to number.
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((deviceWidth * elemWidth) / 100);
};

export const heightPercentageToDP = (heightPercent: any) => {
  // const {height} = Dimensions.get('window');
  // Parse string percentage input and convert it to number.
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((deviceHeight * elemHeight) / 100);
};

export default normalize;