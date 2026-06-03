// import { TourGuideZone } from '@/components/rn-tourguide-custom';
// import { ScreenWidth, images, screenStyles } from '@/configs';
// import { TOUR_KEY } from '@/constants';
// import { mainRoute } from '@/constants/route_key';
// import { AppContext } from '@/contexts';
// import { UserTypes } from '@/navigation/root-store';
// import { useAppSelector } from '@/redux/store/customReduxHook';
// import { CText, Row } from '@/utils';
// import { useNavigation } from '@react-navigation/native';
// import { makeStyles, useTheme } from '@rneui/themed';
// import React, { useContext, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, Platform, Pressable, TouchableOpacity, View } from 'react-native';
// import { ICON_TYPE, IconX, ImageHelper } from '..';
// import CHeader from './CHeader';

// const useStyles = makeStyles(({ colors }) => ({
//   rightWrapper: {
//     position: 'absolute',
//     right: 16,
//     ...screenStyles.rowCenter,
//   },
//   leftWrapper: {
//     position: 'absolute',
//     // left: 16,
//     left: 10,
//     ...screenStyles.rowCenter,
//     alignItems: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: "center",
//     maxWidth: ScreenWidth / 1.7,
//     marginTop: 2,
//   },
//   btnUpVideo: {
//     ...screenStyles.mL16,
//     width: 23,
//     height: 23,
//     borderRadius: 12,
//     backgroundColor: colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: colors.primary,
//         shadowOffset: {
//           width: 0,
//           height: 1,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   hasNoti: {
//     position: 'absolute',
//     right: 3,
//     top: 1,
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: colors.error,
//   },
//   warningWrapper: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// }));

// type HeaderProps = {
//   isBorderBottom?: boolean;
//   onShowRegion: any;
// };

// const HeaderBarBack: React.FC<HeaderProps> = props => {
//   const navigation = useNavigation();
//   const { isBorderBottom = true, onShowRegion } = props;

//   const {
//     theme: { colors },
//   } = useTheme();
//   const styles = useStyles();

//   const { t } = useTranslation();
//   const { user, showModalAuth, userType } = useContext(AppContext);

//   const [totalUnread, setTotalUnread] = useState(0);

//   //PROPS
//   const { totalNotifyUnRead } = useAppSelector(state => state.notifyReducer);

//   const { appRegion } = useAppSelector(state => state.globalReducer);

//   const [showBtnCreateVideo, setShowBtnCreateVideo] = useState(false);

//   useEffect(() => {
//     const checkShowBtnChat = () => {
//       if (userType == UserTypes.doctor) {
//         setShowBtnCreateVideo(true);
//       }
//     };
//     checkShowBtnChat();
//   }, [user.personalization]);

//   useEffect(() => {
//     const processAPITotalNotify = () => {
//       const { loading, data, error } = totalNotifyUnRead;
//       if (!loading) {
//         if (data) {
//           let dataP: any = data;
//           if (dataP.result) {
//             setTotalUnread(dataP.result.total || 0);
//           }
//         } else if (error) {
//         }
//       }
//     };
//     processAPITotalNotify();
//   }, [totalNotifyUnRead]);

//   const handleNotify = () => {
//     navigation.navigate(mainRoute.notifyScreen as never);
//   };

//   const handleSearch = () => {
//     if (user.id) {
//       navigation.navigate(mainRoute.searchScreen as never);
//     } else {
//       showModalAuth();
//     }
//   };

//   const handleUploadVideo = async () => {
//     navigation.navigate(mainRoute.upvideoScreen as never);
//   };

//   const handleOpenProfile = () => {
//    if (userType == UserTypes.doctor || userType == UserTypes.nurse) {
//       navigation.navigate(mainRoute.doctorAccountScreen as never);
//     } else if (userType == UserTypes.student) {
//       navigation.navigate(mainRoute.studentAccountScreen as never);
//     } else {
//       navigation.navigate(mainRoute.accountScreen as never);
//     }
//   };

//   //render
//   const renderRightHead = () => (
//     <View style={styles.rightWrapper}>
//       {showBtnCreateVideo && (
//         <Pressable hitSlop={screenStyles.hitSlop20} onPress={handleUploadVideo} style={styles.btnUpVideo}>
//           <IconX origin={ICON_TYPE.OCTICONS} name="plus" color={colors.primary} size={16} />
//         </Pressable>
//       )}
//       <Pressable hitSlop={screenStyles.hitSlop20} onPress={handleNotify} style={screenStyles.mL16}>
//         <TourGuideZone
//           zone={2}
//           text={t("tourguide.home.step2")}
//           borderRadius={8}
//           tourKey={TOUR_KEY.home}
//           maskOffset={10}
//         >
//           <Image source={images.global.ico_notify} style={screenStyles.box22} resizeMode="contain" />
//           {totalUnread != 0 && <View style={styles.hasNoti} />}
//         </TourGuideZone>
//       </Pressable>
//       <Pressable hitSlop={screenStyles.hitSlop20} onPress={handleSearch} style={screenStyles.mL16}>
//         <TourGuideZone
//           zone={3}
//           text={t("tourguide.home.step3")}
//           borderRadius={8}
//           tourKey={TOUR_KEY.home}
//           maskOffset={10}
//         >
//           <Image source={images.global.ico_search} style={screenStyles.box22} resizeMode="contain" />
//         </TourGuideZone>
//       </Pressable>
//     </View>
//   );


//   // Refactor 
//   const renderErrorImage = () => {
//     return <Image source={images.global.no_avatar} style={screenStyles.box22} resizeMode="contain" />;
//   };

//   const renderRequireVerify = () => {
//     if (showBtnCreateVideo) {
//       const status = user.personalization?.status;
//       // console.log("🚀 ~ renderRequireVerify ~ status:", status)
//       if (status != 1) {
//         return (
//           <View
//             style={[
//               styles.warningWrapper, {
//                 backgroundColor: status == 2 ? colors.error : colors.warning,
//               }]}>
//             <CText h7 w700 color={colors.white} style={screenStyles.mL1}>
//               {'!'}
//             </CText>
//           </View>
//         );
//       }
//     }
//   }

//   const renderLeftHead = () => {
//     return (
//       <View style={styles.leftWrapper}>
//         <TourGuideZone
//           zone={1}
//           text={t("tourguide.home.step1")}
//           borderRadius={25}
//           tourKey={TOUR_KEY.home}
//           maskOffset={10}
//         >
//           <Row start>
//             <Pressable hitSlop={24} onPress={navigation.goBack} style={{
//               // backgroundColor: 'red',
//               paddingRight: 8,
//               paddingVertical: 4,
//             }}>
//               <IconX origin={ICON_TYPE.ICONICONS} name={'chevron-back'} color={colors.c667085} size={26} />
//             </Pressable>
//             <View>
//               <Pressable
//                 onPress={handleOpenProfile}
//                 style={[
//                   screenStyles.round36,
//                   { borderWidth: 1, borderColor: colors.cF9FAFB, backgroundColor: colors.cEAECF0 },
//                 ]}>
//                 <ImageHelper source={{ uri: user.personalization?.avatar }} renderErrorImage={renderErrorImage} />
//               </Pressable>
//               {renderRequireVerify()}
//             </View>
//             <Row start style={screenStyles.mL8}>
//               <CText color={colors.c98A2B3} h5>{t('home.region', 'Region') + ": "}</CText>
//               <TouchableOpacity
//                 onPress={onShowRegion}
//                 style={styles.row}>
//                 <CText color={colors.c101828} h5 w500 numberOfLines={1}>{appRegion["name"] || ""}</CText>
//                 <IconX
//                   origin={ICON_TYPE.OCTICONS}
//                   name={'triangle-down'}
//                   size={24}
//                   color={colors.c101828}
//                   style={screenStyles.mL5}
//                 />
//               </TouchableOpacity>
//             </Row>
//           </Row>
//         </TourGuideZone>
//       </View>
//     )
//   };

//   return (
//     <CHeader isBorderBottom={isBorderBottom} leftComponent={renderLeftHead()} rightComponent={renderRightHead()} />
//   );
// };

// export default HeaderBarBack;
