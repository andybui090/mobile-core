import { Dimensions, ScaledSize, Platform, StatusBar } from 'react-native';
const DEFAULT_STATUSBAR_HEIGHT = 30;
// ? iPhone X Family
// iPhone X Dimension
const iPhoneX_HEIGHT = 812;
// iPhone Xr Dimension
const iPhoneXr_HEIGHT = 896;
// iPhone XS Dimension
const iPhoneXs_HEIGHT = 896;
// iPhone XsMax Dimension
const iPhoneXsMax_HEIGHT = 896;
// iPhone SE Dimension
const iPhoneSE_HEIGHT = 568;
// ? iPhone 11 Family
// iPhone 11 Dimension
const iPhone11_HEIGHT = 896;
// iPhone 11 Pro Dimension
const iPhone11Pro_HEIGHT = 812;
// iPhone 11 Pro Max Dimension
const iPhone11ProMax_HEIGHT = 896;
// ? iPhone 12 Family
// iPhone 12 Dimension
const iPhone12_HEIGHT = 844;
// iPhone 12 Pro Dimension
const iPhone12Pro_HEIGHT = 844;
// iPhone 12 Pro Max Dimension
const iPhone12ProMax_HEIGHT = 926;
// iPhone 12 Mini Dimension
const iPhone12Mini_HEIGHT = 812;
// iPhone 13 Dimension
const iPhone13_HEIGHT = 844;
// iPhone 13 Pro Dimension
const iPhone13Pro_HEIGHT = 844;
// iPhone 13 Pro Max Dimension
const iPhone13ProMax_HEIGHT = 926;
// iPhone 13 Mini Dimension
const iPhone13Mini_HEIGHT = 812;
// {14: "fontScale": 1, "height": 844, "scale": 3, "width": 390}
const iPhone14_HEIGHT = 844;
// {14 plus: "fontScale": 1, "height": 926, "scale": 3, "width": 428}
const iPhone14Plus_HEIGHT = 926;
// {14 pro :"fontScale": 1, "height": 852, "scale": 3, "width": 393}
const iPhone14Pro_HEIGHT = 852;
//{14 proMax: "fontScale": 1, "height": 932, "scale": 3, "width": 430}
const iPhone14ProMax_HEIGHT = 932;
// {14 plus: "fontScale": 1, "height": 926, "scale": 3, "width": 428}
const iPhone15_HEIGHT = 852;
const iPhone15Plus_HEIGHT = 932;
const iPhone15Pro_HEIGHT = 852;
const iPhone15ProMax_HEIGHT = 932;
// 16 Pro {"fontScale": 1, "height": 874, "scale": 3, "width": 402}
// 16 {"fontScale": 1, "height": 852, "scale": 3, "width": 393}
// 16 plus {"fontScale": 1, "height": 932, "scale": 3, "width": 430}
// 16 Pro max {"fontScale": 1, "height": 956, "scale": 3, "width": 440}
const iPhone16_HEIGHT = 852;
const iPhone16Plus_HEIGHT = 932;
const iPhone16Pro_HEIGHT = 874;
const iPhone16ProMax_HEIGHT = 956;
/**
 * This and hasNotch functions are the same,
 * just want to make two functions with different names
 * hasNotch is more accurate name
 */

// iPhone 17 series (points)
const iPhone17_HEIGHT = 874;
const iPhone17Plus_HEIGHT = 1000;       // dự đoán chính xác theo pattern 16 → 17
const iPhone17Pro_HEIGHT = 874;
const iPhone17ProMax_HEIGHT = 1000;

const isIPhoneNotchFamily = (): boolean => {
  return detection();
};

const isIPhoneXFamily = (): boolean => {
  return detection() || detectIPhone14Pro();
};

const hasNotch = (): boolean => {
  return detection();
};

const isIPhoneSE = (dim: ScaledSize) => dim.height === iPhoneSE_HEIGHT;
// ? iPhone X Family
const isIPhoneX = (dim: ScaledSize) => dim.height === iPhoneX_HEIGHT;
const isIPhoneXr = (dim: ScaledSize) => dim.height === iPhoneXr_HEIGHT;
const isIPhoneXs = (dim: ScaledSize) => dim.height === iPhoneXs_HEIGHT;
const isIPhoneXsMax = (dim: ScaledSize) => dim.height === iPhoneXsMax_HEIGHT;
// ? iPhone 11 Family
const isIPhone11 = (dim: ScaledSize) => dim.height === iPhone11_HEIGHT;
const isIPhone11Pro = (dim: ScaledSize) => dim.height === iPhone11Pro_HEIGHT;
const isIPhone11ProMax = (dim: ScaledSize) =>
  dim.height === iPhone11ProMax_HEIGHT;
// ? iPhone 12 Family
const isIPhone12 = (dim: ScaledSize) => dim.height === iPhone12_HEIGHT;
const isIPhone12Pro = (dim: ScaledSize) => dim.height === iPhone12Pro_HEIGHT;
const isIPhone12ProMax = (dim: ScaledSize) =>
  dim.height === iPhone12ProMax_HEIGHT;
const isIPhone12Mini = (dim: ScaledSize) => dim.height === iPhone12Mini_HEIGHT;
//bo sung them
const isIPhone13 = (dim: ScaledSize) => dim.height === iPhone13_HEIGHT;
const isIPhone13Pro = (dim: ScaledSize) => dim.height === iPhone13Pro_HEIGHT;
const isIPhone13ProMax = (dim: ScaledSize) =>
  dim.height === iPhone13ProMax_HEIGHT;
const isIPhone13Mini = (dim: ScaledSize) => dim.height === iPhone13Mini_HEIGHT;
//iphone 14
const isIPhone14 = (dim: ScaledSize) => dim.height === iPhone14_HEIGHT;
const isIPhone14Plus = (dim: ScaledSize) => dim.height === iPhone14Plus_HEIGHT;
const isIPhone14Pro = (dim: ScaledSize) => dim.height === iPhone14Pro_HEIGHT;
const isIPhone14ProMax = (dim: ScaledSize) =>
  dim.height === iPhone14ProMax_HEIGHT;

const isIPhone15 = (dim: ScaledSize) => dim.height === iPhone15_HEIGHT;
const isIPhone15Plus = (dim: ScaledSize) => dim.height === iPhone15Plus_HEIGHT;
const isIPhone15Pro = (dim: ScaledSize) => dim.height === iPhone15Pro_HEIGHT;
const isIPhone15ProMax = (dim: ScaledSize) =>
  dim.height === iPhone15ProMax_HEIGHT;

//iphone 16
const isIPhone16 = (dim: ScaledSize) => dim.height === iPhone16_HEIGHT;
const isIPhone16Plus = (dim: ScaledSize) => dim.height === iPhone16Plus_HEIGHT;
const isIPhone16Pro = (dim: ScaledSize) => dim.height === iPhone16Pro_HEIGHT;
const isIPhone16ProMax = (dim: ScaledSize) =>
  dim.height === iPhone16ProMax_HEIGHT;

const isIPhone17 = (dim: ScaledSize) => dim.height === iPhone17_HEIGHT;
const isIPhone17Plus = (dim: ScaledSize) => dim.height === iPhone17Plus_HEIGHT;
const isIPhone17Pro = (dim: ScaledSize) => dim.height === iPhone17Pro_HEIGHT;
const isIPhone17ProMax = (dim: ScaledSize) => {
  return dim.height === iPhone17ProMax_HEIGHT;
};

const detection = (): boolean => {
  const dim = Dimensions.get('window');
  // console.log("🚀 ~ detection ~ dim:", dim)
  return (
    (Platform.OS === 'ios' &&
      // !Platform.isPad &&
      // !Platform.isTV &&
      (isIPhoneX(dim) ||
        isIPhoneXr(dim) ||
        isIPhoneXs(dim) ||
        isIPhoneXsMax(dim) ||
        isIPhone11(dim) ||
        isIPhone11Pro(dim) ||
        isIPhone11ProMax(dim) ||
        isIPhone12(dim) ||
        isIPhone12Pro(dim) ||
        isIPhone12ProMax(dim))) ||
    isIPhone12Mini(dim) ||
    isIPhone13(dim) ||
    isIPhone13Pro(dim) ||
    isIPhone13ProMax(dim) ||
    isIPhone13Mini(dim) ||
    isIPhone14(dim) ||
    isIPhone14Plus(dim) ||
    isIPhone14Pro(dim) ||
    isIPhone14ProMax(dim) ||
    isIPhone15(dim) ||
    isIPhone15Plus(dim) ||
    isIPhone15Pro(dim) ||
    isIPhone15ProMax(dim) ||
    isIPhone16(dim) ||
    isIPhone16Plus(dim) ||
    isIPhone16Pro(dim) ||
    isIPhone16ProMax(dim) ||
    isIPhone17(dim) ||
    isIPhone17Plus(dim) ||
    isIPhone17Pro(dim) ||
    isIPhone17ProMax(dim)
  );
};

const detectIPhone14Pro = () => {
  const dim = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    // !Platform.isPad &&
    // !Platform.isTV &&
    (isIPhone14Pro(dim) || isIPhone14ProMax(dim))
  );
};

const getStatusBarHeight = (): number => {
  return (
    Platform.select({
      ios: hasNotch()
        ? detectIPhone14Pro()
          ? 44
          : 40
        : DEFAULT_STATUSBAR_HEIGHT,
      android: StatusBar.currentHeight || DEFAULT_STATUSBAR_HEIGHT,
    }) || DEFAULT_STATUSBAR_HEIGHT
  );
};

const isAndroid15 = Platform.OS == 'android' && Platform.Version == 35;

const getBottomSpace = (): number => {
  return isIPhoneXFamily() ? 34 : 0;
};

const ifIphoneX = (iphoneXValue: number, regularValue: number): number => {
  if (isIPhoneXFamily()) {
    return iphoneXValue;
  }
  return regularValue;
};

export {
  getStatusBarHeight,
  getBottomSpace,
  hasNotch,
  isIPhoneNotchFamily,
  isIPhoneXFamily,
  isIPhoneSE,
  isIPhoneX,
  isIPhoneXr,
  isIPhoneXs,
  isIPhoneXsMax,
  isIPhone11,
  isIPhone11Pro,
  isIPhone11ProMax,
  isIPhone12,
  isIPhone12Pro,
  isIPhone12ProMax,
  isIPhone12Mini,
  isIPhone13,
  isIPhone13Pro,
  isIPhone13ProMax,
  isIPhone13Mini,
  isIPhone14,
  isIPhone14Plus,
  isIPhone14Pro,
  isIPhone14ProMax,
  isIPhone15,
  isIPhone15Plus,
  isIPhone15Pro,
  isIPhone15ProMax,
  ifIphoneX,
  isAndroid15,
};
