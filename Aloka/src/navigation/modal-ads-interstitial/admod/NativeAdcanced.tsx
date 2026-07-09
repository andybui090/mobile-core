// import { ImageHelper } from '@/components';
// import { ScreenWidth, fonts, images, screenStyles } from '@/configs';
// import { CText, Row } from '@/utils';
// import { makeStyles, useTheme } from '@rneui/themed';
// import { useEffect, useRef, useState } from 'react';
// import { Image, Platform, Pressable, View } from 'react-native';
// import NativeAdView, { CallToActionView } from "react-native-admob-native-ads";
// import { MediaView } from './MediaView';

// const useStyles = makeStyles(({ colors }) => ({
//     avatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 50,
//         overflow: 'hidden',
//         backgroundColor: colors.cEAECF0,
//         borderWidth: 1,
//         borderColor: colors.cF2F4F7
//     },
//     adWrapper: {
//         width: "100%",
//         height: "100%",
//         alignItems: "center",
//     },
//     btnOpen: {
//         minHeight: 36,
//         paddingHorizontal: 24,
//         justifyContent: "center",
//         alignItems: "center",
//         elevation: 10,
//         maxWidth: 120,
//         width: 120,
//     },
//     btnWrapper: {
//         width: "100%", paddingHorizontal: 20, position: "absolute", top: 10, zIndex: 1
//     },
//     titleOpen: {
//         fontSize: 10,
//         flexWrap: "wrap",
//         textAlign: "center",
//         color: "white",
//         fontFamily: fonts.inter
//     }
// }));

// export const NativeAdcanced = ({ adUnitID, callBackFailed, callBackLoaded }: any) => {
//     const styles = useStyles();
//     const {
//         theme: { colors },
//     } = useTheme();

//     const nativeAdRef = useRef<any>(null);
//     const [aspectRatio, setAspectRatio] = useState<number>(1.5);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [loaded, setLoaded] = useState<boolean>(false);
//     const [error, setError] = useState<boolean>(false);

//     //
//     const [isVideo, setIsVideo] = useState<boolean>(false);
//     const [eventData, setEventData] = useState<any>({});
//     //


//     const onAdFailedToLoad = (event: any) => {
//         setError(true);
//         setLoading(false);
//         // callBackFailed();
//         /**
//          * Sometimes when you try to load an Ad, it will keep failing
//          * and you will recieve this error: "The ad request was successful,
//          * but no ad was returned due to lack of ad inventory."
//          *
//          * This error is not a bug or issue with our Library.
//          * Just remove the app from your phone & clean your build
//          * folders by running ./gradlew clean in /android folder
//          * and for iOS clean the project in xcode. Hopefully the error will
//          * be gone.
//          *
//          * [iOS] If you get this error: "Cannot find an ad network adapter with
//          * the name(s): com.google.DummyAdapter". The ad inventory is empty in your
//          * location. Try using a vpn to get ads in a different location.
//          *
//          * If you have recently created AdMob IDs for your ads, it might take
//          * a few days until the ads will start showing.
//          */
//         console.log("============== onAdFailedToLoad", event);
//     };

//     const onAdLoaded = () => {
//         // console.log("============== onAdLoaded");
//     };

//     const onAdClicked = () => {
//         // console.log("============== onAdClicked");
//     };

//     const onNativeAdLoaded = (event: any) => {
//         // console.log("============== onNativeAdLoaded", event);
//         setLoading(false);
//         setLoaded(true);
//         setError(false);
//         setAspectRatio(event.aspectRatio);
//         console.log("============== event?.video", event?.video);
//         if (event?.video) {
//             setIsVideo(true);
//         }
//         setEventData(event);
//         callBackLoaded();
//     };

//     const onAdLeftApplication = () => {
//         console.log("============== onAdLeftApplication");
//     };

//     const onAdImpression = () => {
//         console.log("============== onAdImpression");
//     };

//     useEffect(() => {
//         if (!loaded) {
//             nativeAdRef.current?.loadAd();
//         } else {
//             // console.log("============== LOADED ALREADY");
//             // callBackLoaded();
//         }
//     }, [loaded]);

//     const renderErrorImage = () => {
//         return <Image source={images.global.no_avatar} style={screenStyles.box26} resizeMode="contain" />;
//     };

//     const handlePressAd = () => {
//         // console.log("============== LOADED ALREADY", nativeAdRef?.current);
//     }

//     const onAdClosed = () => {
//         console.log("============== onAdClosed ALREADY");
//     }
    
//     const renderHeader = () => {
//         if (eventData?.icon) {
//             return (
//                 <Row
//                     between
//                     style={[screenStyles.pH12, screenStyles.pV8]}
//                 >
//                     <Pressable
//                         style={[screenStyles.flex1, screenStyles.rowStart]}
//                         onPress={handlePressAd}
//                     >
//                         <View style={styles.avatar}>
//                             <ImageHelper source={{ uri: eventData?.icon || '' }} renderErrorImage={renderErrorImage} />
//                         </View>
//                         <View style={[screenStyles.pH10, screenStyles.flex1]}>
//                             <CText color={colors.white} numberOfLines={2} h5 w600>
//                                 {eventData?.headline || ''}
//                             </CText>
//                             {eventData?.tagline && (
//                                 <CText color={colors.white} h56>
//                                     {eventData?.tagline}
//                                 </CText>
//                             )}
//                         </View>
//                     </Pressable>
//                 </Row>
//             )
//         }
//         return null;
//     }

//     const renderImgBanner = () => {
//         if (eventData?.images) {
//             return (
//                 <ImageHelper source={{ uri: eventData?.images[0]?.url }} resizeMode={"contain"} />
//             )
//         }
//         return null;
//     }

//     return !error && (
//         <View>
//             {renderHeader()}
//             <NativeAdView
//                 ref={nativeAdRef}
//                 onAdLoaded={onAdLoaded}
//                 onAdFailedToLoad={onAdFailedToLoad}
//                 onAdLeftApplication={onAdLeftApplication}
//                 onAdClicked={onAdClicked}
//                 onAdImpression={onAdImpression}
//                 onNativeAdLoaded={onNativeAdLoaded}
//                 refreshInterval={60000 * 2}
//                 onAdClosed={onAdClosed}
//                 style={{
//                     width: ScreenWidth,
//                     alignSelf: 'center',
//                     height: loaded ? (aspectRatio ? ScreenWidth / aspectRatio : ScreenWidth) : 0,
//                     backgroundColor: colors.c1D2939,
//                 }}
//                 videoOptions={{
//                     clickToExpand: true,
//                     customControlsRequested: true,
//                     muted: false
//                 }}
//                 mediationOptions={{
//                     nativeBanner: true,
//                 }}
//                 adUnitID={adUnitID}
//                 enableSwipeGestureOptions={{
//                     tapsAllowed: true,
//                     swipeGestureDirection: 'right',
//                 }}
//             >
//                 <View
//                     style={styles.adWrapper}
//                 >
//                     <View
//                         style={{
//                             width: "100%",
//                             height: "100%",
//                             position: "absolute",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             opacity: !loading && !error && loaded ? 0 : 1,
//                             zIndex: !loading && !error && loaded ? 0 : 10,
//                         }}
//                     >
//                         {/* {loading && <ActivityIndicator size={28} color={colors.primary} />} */}
//                         {error && <CText h5 color={colors.white}>{":-("}</CText>}
//                     </View>
//                     {!loading && <Row end style={styles.btnWrapper}>
//                         <CallToActionView
//                             style={[
//                                 styles.btnOpen,
//                                 Platform.OS === "ios"
//                                     ? {
//                                         backgroundColor: "#FFA500",
//                                         borderRadius: 8,
//                                     }
//                                     : {},
//                             ]}
//                             buttonAndroidStyle={{
//                                 backgroundColor: "#FFA500",
//                                 borderRadius: 10,
//                             }}
//                             allCaps
//                             textStyle={styles.titleOpen}
//                         />
//                     </Row>}
//                     {eventData?.video ? <MediaView aspectRatio={aspectRatio} onEndVideoAd={callBackFailed}/> : renderImgBanner()}
//                 </View>
//             </NativeAdView>
//         </View>
//     )
// }