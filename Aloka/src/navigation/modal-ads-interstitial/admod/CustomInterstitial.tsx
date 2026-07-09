// import { useEffect, useState } from 'react';
// import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

// let interstitial: any;
// export const CustomInterstitial = ({ adUnitId, hideModal }: any) => {

//     const [loaded, setLoaded] = useState(false);

//     useEffect(() => {
//         if (adUnitId) {
//             interstitial = InterstitialAd.createForAdRequest(adUnitId, {});

//             const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
//                 setLoaded(true);
//             });
//             const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
//                 console.log("===== AdEventType.OPENED here");
//                 // if (Platform.OS === 'ios') {
//                 //     // Prevent the close button from being unreachable by hiding the status bar on iOS
//                 //     StatusBar.setHidden(true)
//                 // }
//                 // hideModal();
//             });
//             const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
//                 console.log("===== AdEventType.CLOSED here");
//                 // if (Platform.OS === 'ios') {
//                 //     StatusBar.setHidden(false)
//                 // }
//                 hideModal();
//             });

//             const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
//                 console.log("=====AdEventType.ERROR here");
//                 hideModal();
//             });

//             const unsubscribeClick = interstitial.addAdEventListener(AdEventType.CLICKED, () => {
//                 console.log("====AdEventType.CLICKED here");
//                 hideModal();
//             });

//             // Start loading the interstitial straight away
//             interstitial.load();

//             // Unsubscribe from events on unmount
//             return () => {
//                 unsubscribeLoaded();
//                 unsubscribeOpened();
//                 unsubscribeClosed();
//                 unsubscribeError();
//                 unsubscribeClick();
//             };
//         }

//     }, [adUnitId]);

//     useEffect(() => {
//         if (loaded) {
//             interstitial.show();
//         }
//     }, [loaded]);

//     // No advert ready to show yet
//     if (!loaded) {
//         return null;
//     }
//     return null;
// };