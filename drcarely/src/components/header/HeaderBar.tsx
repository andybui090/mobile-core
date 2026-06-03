// import { ScreenWidth, images, screenStyles } from '@/configs';
// import { mainRoute } from '@/constants/route_key';
// import { AppContext } from '@/contexts';
// import { UserTypes } from '@/navigation/root-store';
// import { useAppSelector } from '@/redux/store/customReduxHook';
// import { CText, Row } from '@/utils';
// import { useNavigation } from '@react-navigation/native';
// import { makeStyles, useTheme } from '@rneui/themed';
// import React, { useContext, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, Platform, Pressable, View } from 'react-native';
// import { ICON_TYPE, IconX } from '..';
// import CHeader from './CHeader';

// const useStyles = makeStyles(({colors}) => ({
//   rightWrapper: {
//     position: 'absolute',
//     right: 16,
//     ...screenStyles.rowCenter,
//   },
//   leftWrapper: {
//     position: 'absolute',
//     left: 16,
//     ...screenStyles.rowCenter,
//     alignItems: 'center',
//   },
//   row: {
//     maxWidth: ScreenWidth / 1.7,
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
// }));

// type HeaderProps = {
//   isBorderBottom?: boolean;
// };

// const HeaderBar: React.FC<HeaderProps> = props => {
//   const navigation = useNavigation();
//   const {isBorderBottom = true} = props;

//   const {
//     theme: {colors},
//   } = useTheme();
//   const styles = useStyles();

//   const {t} = useTranslation();
//   const {user, showModalAuth, userType} = useContext(AppContext);

//   const [totalUnread, setTotalUnread] = useState(0);

//   //PROPS
//   const {totalNotifyUnRead} = useAppSelector(state => state.notifyReducer);

//   const [txtHeader, setTxtHeader] = useState<string>(
//     t('greetings.goodMorning', 'Good morning'),
//   );

//   const [showBtnCreateVideo, setShowBtnCreateVideo] = useState(false);

//   useEffect(() => {
//     const checkShowBtnChat = () => {
//       if (userType == UserTypes.doctor || userType == UserTypes.nurse) {
//         setShowBtnCreateVideo(true);
//       }
//     };
//     checkShowBtnChat();
//   }, [user.personalization]);

//   useEffect(() => {
//     const processAPITotalNotify = () => {
//       const {loading, data, error} = totalNotifyUnRead;
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

//   useEffect(() => {
//     const initWelcome = () => {
//       let txt: string = t('common.welcome', 'Hi');
//       if (user.id && user.full_name) {
//         txt = txt + ', ' + user.full_name + '!';
//       }
//       setTxtHeader(txt);
//     };
//     initWelcome();
//   }, [user]);

//   const handleNotify = () => {
//     if (user.id) {
//       navigation.navigate(mainRoute.notifyScreen as never);
//     } else {
//       showModalAuth();
//     }
//   };

//   const handleSearch = () => {
//     if (user.id) {
//       navigation.navigate(mainRoute.searchScreen as never);
//     } else {
//       showModalAuth();
//     }
//   };

//   const handleUploadVideoApp = async () => {
//     navigation.navigate(mainRoute.upvideoScreen as never);
//   };

//   const handleOpenProfile = () => {
//     if (userType == UserTypes.doctor || userType == UserTypes.nurse) {
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
//         <Pressable
//           hitSlop={screenStyles.hitSlop20}
//           onPress={handleUploadVideoApp}
//           style={styles.btnUpVideo}>
//           <IconX
//             origin={ICON_TYPE.OCTICONS}
//             name="plus"
//             color={colors.primary}
//             size={16}
//           />
//         </Pressable>
//       )}
//       <Pressable
//         hitSlop={screenStyles.hitSlop20}
//         onPress={handleNotify}
//         style={screenStyles.mL16}>
//         <Image
//           source={images.global.ico_notify}
//           style={screenStyles.box22}
//           resizeMode="contain"
//         />
//         {totalUnread != 0 && <View style={styles.hasNoti} />}
//       </Pressable>
//       <Pressable
//         hitSlop={screenStyles.hitSlop20}
//         onPress={handleSearch}
//         style={screenStyles.mL16}>
//         <Image
//           source={images.global.ico_search}
//           style={screenStyles.box22}
//           resizeMode="contain"
//         />
//       </Pressable>
//     </View>
//   );

//   const renderLeftHead = () => (
//     <Pressable style={styles.leftWrapper} onPress={handleOpenProfile}>
//       <Image
//         source={images.global.logo_hear}
//         style={screenStyles.box26}
//         resizeMode="contain"
//       />
//       <View style={[screenStyles.rowStart, screenStyles.flex1]}>
//         <Row style={styles.row}>
//           <CText
//             h5
//             w600
//             color={colors.black}
//             style={screenStyles.mL10}
//             numberOfLines={1}>
//             {txtHeader}
//           </CText>
//         </Row>
//       </View>
//     </Pressable>
//   );

//   return (
//     <CHeader
//       isBorderBottom={isBorderBottom}
//       leftComponent={renderLeftHead()}
//       rightComponent={renderRightHead()}
//     />
//   );
// };

// export default HeaderBar;
