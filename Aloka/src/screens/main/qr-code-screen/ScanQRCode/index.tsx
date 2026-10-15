// import { ScreenHeight, ScreenWidth, images, showToast } from '@/configs';
// import { mainRoute } from '@/constants/route_key';
// import { cameraPermission } from '@/permissions';
// import { CText } from '@/utils';
// import { useIsFocused } from '@react-navigation/native';
// import { useTheme } from '@rneui/themed';
// import React, { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, StyleSheet, View } from 'react-native';
// import { Camera as VisionCamera, useCameraDevice } from 'react-native-vision-camera';
// import { useBarcodeScannerOutput } from 'react-native-vision-camera-barcode-scanner';

// export default function ScanQRCode({ navigation }: any) {
//   const {
//     theme: { colors },
//   } = useTheme();
//   const { t } = useTranslation();
//   const toastEl = useRef(null);
//   const isFocussed = useIsFocused();

//   //PROPS & STATE
//   const [isActiveCam, setIsActiveCam] = useState(false);
//   const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
//   let device = useCameraDevice(cameraPosition);

//   const checkPermisstion = async () => {
//     const resultCheckPermission = await cameraPermission();
//     if (resultCheckPermission?.isSuccess) {
//       setIsActiveCam(true);
//     } else if (resultCheckPermission?.msg) {
//       showToast(toastEl, resultCheckPermission?.msg);
//     }
//   };

//   useEffect(() => {
//     if (isFocussed) {
//       checkPermisstion();
//     }
//   }, [isFocussed]);

//   //ACTION
//   const barcodeOutput = useBarcodeScannerOutput({
//     barcodeFormats: ['qr-code', 'ean-13'],
//     onBarcodeScanned: (codes:any) => {
//       if (!isFocussed || !isActiveCam) return;
//       console.log('code ====', codes);
//       try {
//         const stringData = codes[0]?.rawValue;
//         if (!stringData) return;
//         const _data = JSON.parse(stringData);
//         if (_data?.type !== 'drNetworK_profile' || !_data?.userId) {
//           showToast(toastEl, t('error.barCodeInvalid'));
//           return;
//         }
//         if (_data?.role === 'Doctor') {
//           navigation.navigate(mainRoute.channelDetailScreen, {
//             channelId:_data?.userId,
//           });
//           return;
//         }
//       } catch (error) {
//         console.log('🚀 ~ ScanQRCode ~ error:', error);
//         showToast(toastEl, t('error.barCodeInvalid'));
//       }
//     },
//     onError: error => {
//       console.log('Cannot scan QR code:', error);
//     },
//   });

//   return (
//     <View style={styles.container}>
//       {device && isActiveCam ? (
//         <VisionCamera
//           style={StyleSheet.absoluteFill}
//           isActive={isFocussed && isActiveCam}
//           device={device}
//           outputs={[barcodeOutput]}
//         />
//       ) : (
//         <CText h4 color={colors.cAAAAAA} w600>
//           {'Camera unavaliable'}
//         </CText>
//       )}
//       <View>
//         <Image source={images.global.ic_frame} style={styles.framStyle} resizeMode="contain" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: ScreenWidth,
//     backgroundColor: 'black',
//   },
//   framStyle: {
//     height: ScreenHeight / 3,
//     width: ScreenWidth - 121,
//   },
// });
