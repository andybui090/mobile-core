
// import { ICON_TYPE, IconX } from '@/components';
// import { ScreenHeight, getBottomSpace, getStatusBarHeight, images, screenStyles, showToast } from '@/configs';
// import { cameraPermission } from '@/permissions';
// import { CText, Row } from '@/utils';
// import { useIsFocused } from '@react-navigation/native';
// import { ScreenWidth } from '@rneui/base';
// import { makeStyles, useTheme } from '@rneui/themed';
// import React, { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Image, Pressable, StyleSheet, View } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import Modal from 'react-native-modal';
// import { CameraDevice, Camera as VisionCamera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
// import RNQRGenerator from 'rn-qr-generator';

// export const useStyles = makeStyles(({ colors }) => ({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: ScreenWidth,
//         backgroundColor: colors.black,
//     },
//     framStyle: {
//         height: ScreenHeight / 3,
//         width: ScreenWidth - 121,
//     },
//     iconStyle: {
//         flex: 1, alignItems: 'center', position: 'absolute', top: getStatusBarHeight() - 16, left: 0, padding: 16
//         , backgroundColor: '#111111',
//     },
//     btnChooseImg: {
//         flex: 1, alignItems: 'center', position: 'absolute', bottom: 40 + getBottomSpace(),
//         borderRadius: 4,
//         borderWidth: 1,
//         borderColor: '#34322F',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//     },
//     cameraStyle: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: ScreenWidth,
//         marginTop: getStatusBarHeight() + 50,
//     }
// }));

// const ModalQrVoucher = ({ isVisible, hideModal, qrCode }: any) => {
//     const {
//         theme: { colors },
//     } = useTheme();
//     const { t } = useTranslation();
//     const styles = useStyles();

//     const [isActiveCam, setIsActiveCam] = useState(false);
//     const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
//     let device = useCameraDevice(cameraPosition);
//     const toastEl = useRef(null);
//     const _cameraRef = React.useRef<VisionCamera>(null);
//     const isFocussed = useIsFocused();

//     const checkPermisstion = async () => {
//         const resultCheckPermission = await cameraPermission();
//         if (resultCheckPermission?.isSuccess) {
//             setIsActiveCam(true);
//         } else if (resultCheckPermission?.msg) {
//             showToast(toastEl, resultCheckPermission?.msg);
//         }
//     };

//     useEffect(() => {
//         if (isFocussed) {
//             checkPermisstion();
//         }
//     }, [isFocussed]);

//     //ACTION
//     const codeScanner = useCodeScanner({
//         codeTypes: ['qr', 'ean-13'],
//         onCodeScanned: codes => {
//             try {
//                 const stringData: any = codes[0]?.value;
//                 qrCode(stringData)
//                 hideModal();
//             } catch (error) {
//                 // console.log('🚀 ~ ScanQRCode ~ error:', error);
//                 showToast(toastEl, t('error.barCodeInvalid'));
//             }
//         },
//     });

//     const handleSelectImage = async () => {
//         const result = await launchImageLibrary({
//             mediaType: 'photo',
//             includeBase64: false, // Không cần base64 khi sử dụng rn-qr-generator
//         });

//         if (result.didCancel || !result.assets || result.assets.length === 0) {
//             console.log('No image selected');
//             return;
//         }
//         const image = result.assets[0];
//         // Thực hiện quét QR từ hình ảnh
//         try {
//             const qrData = await RNQRGenerator.detect({ uri: image.uri });
//             if (qrData.values && qrData.values.length > 0) {
//                 // console.log('QR Code Data:', qrData.values[0]);
//                 const stringData: any = qrData.values[0];
//                 qrCode(stringData)
//                 hideModal();
//             } else {
//                 showToast(toastEl, t('error.barCodeInvalid'));
//             }
//         } catch (error) {
//             console.error('Error scanning QR code:', error);
//             showToast(toastEl, t('error.barCodeInvalid'));
//         }
//     };

//     const renderContent = () => {
//         return (
//             <View style={styles.container}>
//                 <Pressable onPress={hideModal} style={styles.iconStyle}>
//                     <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={'white'} size={24} />
//                 </Pressable>
//                 <View style={{
//                     flex: 1, alignItems: 'center', position: 'absolute', top: getStatusBarHeight(),
//                 }}>
//                     <CText h5 w600 color={'white'}>{t('myProfile.scanQrCode')}</CText>
//                 </View>
//                 {/* quét mã QR */}
//                 <View style={styles.cameraStyle}>
//                     {device && isActiveCam ? (
//                         <VisionCamera
//                             ref={_cameraRef}
//                             style={StyleSheet.absoluteFill}
//                             video={false}
//                             audio={false}
//                             photo={false}
//                             isActive={isFocussed && isActiveCam}
//                             device={device as CameraDevice}
//                             codeScanner={codeScanner}
//                         />
//                     ) : (
//                         <CText h4 color={colors.cAAAAAA} w600>
//                             {'Camera unavaliable'}
//                         </CText>
//                     )}
//                     <View >
//                         <Image source={images.setting.iconFram} style={styles.framStyle} resizeMode="contain" />
//                     </View>
//                 </View>
//                 {/* chọn ảnh mã QR từ thư viện */}
//                 <Pressable style={styles.btnChooseImg} onPress={handleSelectImage}>
//                     <Row >
//                         <Image source={images.course.ico_addImage}
//                             style={[screenStyles.box24, { marginRight: 8 }]}
//                             resizeMode="contain" />
//                         <CText h5 w600 color={'#FFFFFF'}>{t('course.chooseQr')}</CText>
//                     </Row>
//                 </Pressable>
//             </View>
//         )
//     }

//     return (
//         <Modal isVisible={isVisible} onBackdropPress={hideModal} style={{
//             marginHorizontal: 0,
//             marginBottom: 0,
//         }}>
//             {renderContent()}
//         </Modal>
//     );
// }

// export default ModalQrVoucher;