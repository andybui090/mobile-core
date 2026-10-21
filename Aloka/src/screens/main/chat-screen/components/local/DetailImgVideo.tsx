// import {ICON_TYPE, IconX} from '@/components';
// import {getMediaType, ScreenHeight, screenStyles} from '@/configs';
// import {Row} from '@/utils';
// import {ScreenWidth} from '@rneui/base';
// import {makeStyles, useTheme} from '@rneui/themed';
// import {useState} from 'react';
// import {Platform, Pressable, View, NativeModules} from 'react-native';
// import Modal from 'react-native-modal';
// // import AutoHeightImage from 'react-native-auto-height-image';
// import {videoDownloadPermission} from '@/permissions';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
// import moment from 'moment';
// import AutoHeightImage from 'react-native-auto-height-image';
// import RNFS, {
//   DownloadBeginCallbackResult,
//   DownloadProgressCallbackResult,
// } from 'react-native-fs';
// import {ModalDownloadProgress} from '../../../modal/ModalDownloadProgress';
// import CVideoLocal from './CVideoLocal';

// const { MediaStoreModule } = NativeModules;

// export const DetailImgVideo = ({
//   isVisible,
//   hideModal,
//   imgDetail,
//   type,
// }: any) => {
//   //a5e01b34-bf52-498f-8830-5fee6a3d0cff
//   const {
//     theme: {colors},
//   } = useTheme();

//   const styles = useStyles();
//   const [valueProgress, setValueProgress] = useState(0);
//   const [isShowModalProgress, setIsShowModalProgress] =
//     useState<boolean>(false);

//   //ACTION
//   const handleDownLoadVideo = async () => {
//      if (Platform.OS === 'android') {
//     const url = imgDetail;
//     const extension = url.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
//     const fileName = `${moment().unix()}.${extension}`;
//     const tempPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

//     try {
//       RNFS.downloadFile({
//         fromUrl: url,
//         toFile: tempPath,
//         background: true,
//         discretionary: true,
//         progressInterval: 100,
//         progressDivider: 10,
//         begin: () => {
//           setTimeout(() => {
//             setIsShowModalProgress(true);
//           }, 150);
//         },
//         progress: (res) => {
//           let progressPercent =
//             (res.bytesWritten / res.contentLength) * 100;
//           setValueProgress(Math.trunc(progressPercent));
//         },
//       })
//         .promise.then(async () => {
//           setValueProgress(0);
//           setTimeout(() => {
//             setIsShowModalProgress(false);
//           }, 1000);

//           // 🔥 Android dùng MediaStore
//           await MediaStoreModule.saveMedia(tempPath, fileName, getMediaType(fileName));

//           // xoá file temp
//           await RNFS.unlink(tempPath);

//           console.log('✅ Android saved image');
//         })
//         .catch(err => {
//           console.log('🔥 Android download error:', err);
//           setValueProgress(0);
//         });

//     } catch (err) {
//       console.log('🔥 Android error:', err);
//     }

//   } else {
//       //check permission photo
//       const checkVideoDownLoad: any = await videoDownloadPermission();
//       if (checkVideoDownLoad.isSuccess) {
//         const url = imgDetail;
//         const extension = url.split('.').pop().toLowerCase();
//         const filePath = `${
//           RNFS.DocumentDirectoryPath
//         }/${moment().unix()}.${extension}`; //filetype
//         // console.log("🚀 ~ handleDownLoadVideo ~ filePath:", filePath)
//         RNFS.downloadFile({
//           fromUrl: url,
//           toFile: filePath,
//           background: true,
//           discretionary: true,
//           progressInterval: 100,
//           progressDivider: 10,
//           begin: (res: DownloadBeginCallbackResult) => {
//             setTimeout(() => {
//               setIsShowModalProgress(true);
//             }, 150);
//           },
//           progress: (res: DownloadProgressCallbackResult) => {
//             let progressPercent = (res.bytesWritten / res.contentLength) * 100;
//             setValueProgress(Math.trunc(progressPercent));
//           },
//         })
//           .promise.then(res => {
//             setValueProgress(0);
//             setTimeout(() => {
//               setIsShowModalProgress(false);
//             }, 1000);
//             CameraRoll.saveAsset(filePath);
//           })
//           .catch(err => {
//             setValueProgress(0);
//           });
//       }
//     }
//   };

//   //RENDER
//   const renderBody = () => {
//     return (
//       <View style={{flex: 1, justifyContent: 'center'}}>
//         {type === 'video' ? (
//           <CVideoLocal
//             video={{uri: imgDetail}}
//             resizeMode={'center'}
//             thumbnail={{uri: imgDetail}}
//             pauseOnPress={true}
//             autoplay
//             videoHeight={ScreenHeight - 50}
//             videoWidth={ScreenWidth}
//           />
//         ) : (
//           <AutoHeightImage width={ScreenWidth} source={{uri: imgDetail}} />
//         )}
//         <></>
//       </View>
//     );
//   };

//   const renderContent = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: 'black',
//           borderTopLeftRadius: 16,
//           borderTopRightRadius: 16,
//         }}>
//         <View
//           style={{
//             position: 'absolute',
//             paddingHorizontal: 20,
//             paddingTop: 90,
//             zIndex: 100,
//           }}>
//           <Row between>
//             <View style={styles.closeIcon}>
//               <Pressable
//                 hitSlop={screenStyles.hitSlop}
//                 onPress={() => hideModal()}>
//                 <IconX
//                   name={'close'}
//                   origin={ICON_TYPE.ANT_ICON}
//                   color={colors.white}
//                   size={20}
//                 />
//               </Pressable>
//             </View>
//           </Row>
//         </View>
//         <View
//           style={{
//             position: 'absolute',
//             paddingHorizontal: 20,
//             paddingTop: 90,
//             zIndex: 100,
//             right: 0,
//           }}>
//           <Row between>
//             <View style={styles.closeIcon}>
//               <Pressable
//                 hitSlop={screenStyles.hitSlop}
//                 onPress={() => handleDownLoadVideo()}>
//                 <IconX
//                   name={'download'}
//                   origin={ICON_TYPE.ANT_ICON}
//                   color={colors.white}
//                   size={20}
//                 />
//               </Pressable>
//             </View>
//           </Row>
//         </View>
//         {/* <Divider color={colors.cD0D5DD} width={1} /> */}
//         {renderBody()}
//         {/* {renderButton()} */}
//         {isShowModalProgress && (
//           <ModalDownloadProgress
//             isVisible={isShowModalProgress}
//             progress={valueProgress}
//             onClose={() => setIsShowModalProgress(false)}
//           />
//         )}
//       </View>
//     );
//   };

//   return (
//     <Modal
//       animationIn={'zoomIn'}
//       animationOut={'zoomOut'}
//       isVisible={isVisible}
//       onBackdropPress={hideModal}
//       style={screenStyles.modalFullScreen}>
//       {renderContent()}
//     </Modal>
//   );
// };

// const useStyles = makeStyles(({colors}) => ({
//   chosseImgCheck: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 100,
//     backgroundColor: colors.primary,
//     borderRadius: 20,
//   },
//   bottomgoback: {
//     position: 'absolute',
//     bottom: 80,
//     right: 30,
//     zIndex: 100,
//   },
//   choose: {
//     position: 'absolute',
//     bottom: 105,
//     left: 30,
//     zIndex: 100,
//   },
//   chooseText: {
//     position: 'absolute',
//     bottom: 75,
//     left: 80,
//     zIndex: 100,
//   },
//   shadowGoback: {
//     borderRadius: 20,
//     ...screenStyles.shadow,
//     overflow: 'hidden',
//   },
//   iconBack: {left: 10, top: 9, position: 'absolute', zIndex: 100},
//   totalChosse: {
//     position: 'absolute',
//     zIndex: 300,
//     right: 0,
//     top: -10,
//     backgroundColor: 'red',
//     width: 20,
//     height: 20,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: colors.white,
//   },
//   view40: {
//     height: 40,
//     width: 40,
//   },
//   backgroundbottom: {
//     position: 'absolute',
//     bottom: 0,
//     backgroundColor: 'black',
//     width: ScreenWidth,
//     height: 100,
//     opacity: 0.5,
//   },
//   closeIcon: {
//     ...screenStyles.box36,
//     ...screenStyles.centerWrap,
//     borderRadius: 18,
//     backgroundColor: 'rgba(0, 0, 0, 0.2)',
//   },
// }));
