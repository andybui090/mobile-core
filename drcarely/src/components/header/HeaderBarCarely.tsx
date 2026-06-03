// import { ScreenWidth, images, screenStyles } from '@/configs';
// import { mainRoute } from '@/constants/route_key';
// import { AppContext } from '@/contexts';
// import { useAppSelector } from '@/redux/store/customReduxHook';
// import { CText, Row } from '@/utils';
// import { useNavigation } from '@react-navigation/native';
// import { makeStyles, useTheme } from '@rneui/themed';
// import React, { useContext, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, Pressable, View } from 'react-native';
// import { ICON_TYPE, IconX } from '../Icons';
// import CHeader from './CHeader';

// const useStyles = makeStyles(({ colors }) => ({
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

// const HeaderBarCarely: React.FC<HeaderProps> = props => {
//   const navigation = useNavigation();
//   const { isBorderBottom = false } = props;

//   const {
//     theme: { colors },
//   } = useTheme();
//   const styles = useStyles();

//   const { t } = useTranslation();
//   const { user } = useContext(AppContext);

//   const [totalUnread, setTotalUnread] = useState(0);

//   //PROPS
//   const { totalNotifyUnRead } = useAppSelector(state => state.notifyReducer);

//   const [txtHeader, setTxtHeader] = useState<string>(t('common.welcome', 'Hi'));

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
//     }
//   };

//   // const handleOpenProfile = () => {
//   //   if (userType == UserTypes.doctor) {
//   //     navigation.navigate(mainRoute.doctorAccountScreen as never);
//   //   } else if (userType == UserTypes.student) {
//   //     navigation.navigate(mainRoute.studentAccountScreen as never);
//   //   } else {
//   //     navigation.navigate(mainRoute.accountScreen as never);
//   //   }
//   // };

//   //render
//   const renderRightHead = () => (
//     <View style={styles.rightWrapper}>
//       <Pressable hitSlop={screenStyles.hitSlop20} onPress={handleNotify} style={screenStyles.mL16}>
//         <Image source={images.global.ico_notify} style={screenStyles.box22} resizeMode="contain" />
//         {totalUnread != 0 && <View style={styles.hasNoti} />}
//       </Pressable>
//     </View>
//   );

//   const renderLeftHead = () => {
//     return (
//       <View style={styles.leftWrapper}>
//         <Row start>
//           <Pressable hitSlop={24} onPress={navigation.goBack} style={{
//             // backgroundColor: 'red',
//             paddingRight: 8,
//             paddingVertical: 4,
//           }}>
//             <IconX origin={ICON_TYPE.ICONICONS} name={'arrow-back'} color={colors.c101828} size={24} />
//           </Pressable>
//           <View style={screenStyles.mL3}>
//             <Image source={images.bottomTab.carely} style={screenStyles.box26} resizeMode="contain" />
//           </View>
//           <View style={screenStyles.flex1}>
//             <Row start style={styles.row}>
//               <CText h5 w600 color={colors.black} style={screenStyles.mL10} numberOfLines={1}>
//                 {txtHeader}
//               </CText>
//             </Row>
//           </View>
//         </Row>
//       </View>)
//   }

//   // const renderLeftHead = () => (
//   //   <Pressable style={styles.leftWrapper} onPress={handleOpenProfile}>
//   //     <Image source={images.bottomTab.carely} style={screenStyles.box26} resizeMode="contain" />
//   //     <View style={screenStyles.flex1}>
//   //       <Row start style={styles.row}>
//   //         <CText h5 w600 color={colors.black} style={screenStyles.mL10} numberOfLines={1}>
//   //           {txtHeader}
//   //         </CText>
//   //       </Row>
//   //     </View>
//   //   </Pressable>
//   // );

//   return (
//     <CHeader isBorderBottom={isBorderBottom} leftComponent={renderLeftHead()} rightComponent={renderRightHead()} />
//   );
// };

// export default HeaderBarCarely;