// import { screenStyles, ScreenWidth } from '@/configs';
// import { useTheme } from '@rneui/themed';
// import { useRef, useState } from 'react';
// import { View } from 'react-native';
// import {
//     BannerAd,
//     BannerAdSize,
//     GAMBannerAd,
// } from 'react-native-google-mobile-ads';

// export const BannerAds = ({ adUnitID, callBackFailed, callBackLoaded }: any) => {
//     const {
//         theme: { colors },
//     } = useTheme();

//     const bannerRef = useRef<BannerAd>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [loaded, setLoaded] = useState<boolean>(false);
//     const [error, setError] = useState<boolean>(false);
//     const [heightAd, setHeightAd] = useState<number>(0);

//     const onAdLoaded = (dimensions: { width: number; height: number }) => {
//         setLoaded(true);
//         setHeightAd(dimensions.height);
//         callBackLoaded();
//         // console.log("============== BannerAds onAdLoaded", dimensions);
//     };

//     const onAdFailedToLoad = (event: any) => {
//         setError(true);
//         setLoading(false);
//         console.log("============== onAdFailedToLoad", event);
//         callBackFailed();
//         // callBackFailed();
//     };

//     const onAppEvent = (event: any) => {
//         // console.log("============== onNativeAdLoaded", event);
//     };

//     return !error &&
//         <View>
//             <View style={[screenStyles.centerWrap, {
//                 width: ScreenWidth,
//                 height: heightAd,
//                 backgroundColor: colors.c1D2939,
//             }]}>
//                 <GAMBannerAd
//                     unitId={adUnitID}
//                     onAdLoaded={onAdLoaded}
//                     sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER, BannerAdSize.LARGE_BANNER, BannerAdSize.FULL_BANNER]} // pass the correct size(s) here
//                     onAdFailedToLoad={onAdFailedToLoad}
//                     onAppEvent={onAppEvent}
//                 />
//             </View>
//         </View>
// }