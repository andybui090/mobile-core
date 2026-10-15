// import { images, screenStyles } from '@/configs';
// import { spacings } from '@/theme';
// import { CText, Row } from '@/utils';
// import { makeStyles, useTheme } from '@rneui/themed';
// import { memo, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, Linking, Pressable, View } from 'react-native';

// type Props = {
//   socials?: any[];
// };

// const SOCIAL_CONFIG: Record<
//   string,
//   {
//     icon: any;
//     label: string;
//   }
// > = {
//   Facebook: {
//     icon: images.nearby.ico_face,
//     label: 'Facebook',
//   },
//   Youtube: {
//     icon: images.nearby.ico_youtube,
//     label: 'Youtube',
//   },
//   Tiktok: {
//     icon: images.nearby.ico_tiktok,
//     label: 'Tiktok',
//   },
//   Website: {
//     icon: images.nearby.ico_website,
//     label: 'Website',
//   },
//   Customlink: {
//     icon: images.nearby.ico_link,
//     label: 'Custom Link',
//   },
// };

// const ListSocials = ({ socials = [] }: Props) => {
//   const styles = useStyles();
//   const {
//     theme: { colors },
//   } = useTheme();
//   const { t } = useTranslation();

//   // ================= ACTION =================
//   const handleOpenLink = useCallback(async (url: string) => {
//     if (!url) return;

//     try {
//       const supported = await Linking.canOpenURL(url);
//       if (supported) {
//         Linking.openURL(url);
//       }
//     } catch (error) {
//       console.log('Open URL error:', error);
//     }
//   }, []);

//   // ================= RENDER ITEM =================
//   const renderSocialItem = useCallback(
//     (type: string, id: any, link: string, index: number) => {
//       const config = SOCIAL_CONFIG[type];
//       if (!config || !link) return null;

//       return (
//         <Pressable
//           key={`${id}-${index}`}
//           onPress={() => handleOpenLink(link)}
//           style={styles.itemWrapper}>
//           <View style={styles.bgExpert}>
//             <Row start>
//               <Image
//                 source={config.icon}
//                 style={[screenStyles.box24, screenStyles.mR8]}
//                 resizeMode="contain"
//               />
//               <View style={screenStyles.flex1}>
//                 <CText w500 color={colors.c344054}>
//                   {link}
//                 </CText>
//               </View>
//             </Row>
//           </View>
//         </Pressable>
//       );
//     },
//     [handleOpenLink, colors],
//   );

//   // ================= RENDER =================
//   if (!socials.length) return null;

//   return (
//     <View style={styles.container}>
//       <View style={styles.line} />

//       <CText color={colors.black} h5 w600 style={styles.title}>
//         {t('doctorProfile.links')}
//       </CText>

//       {socials.map((item: any) => {
//         const { type, links = [], id } = item || {};

//         if (!links.length) return null;

//         return links.map((link: string, index: number) =>
//           renderSocialItem(type, id, link, index),
//         );
//       })}
//     </View>
//   );
// };

// const useStyles = makeStyles(({ colors }) => ({
//   container: {
//     flex: 1,
//     paddingLeft: spacings.md,
//   },
//   line: {
//     backgroundColor: colors.cF9FAFB,
//     height: 8,
//     marginBottom: 12,
//   },
//   title: {
//     marginBottom: 12,
//   },
//   itemWrapper: {
//     marginBottom: 12,
//   },
//   bgExpert: {
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: colors.cF9FAFB,
//     padding: spacings.md,
//   },
// }));

// export default memo(ListSocials);