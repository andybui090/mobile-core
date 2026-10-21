// import { APILoading, IconType, IconX, Toast } from '@/components';
// import {
//   images,
//   isIOS,
//   keyExtractor,
//   ScreenHeight,
//   screenStyles,
//   showToast,
// } from '@/configs';
// import { PAGINATION, STORAGEKEY } from '@/constants';
// import { cameraChatLauncher } from '@/permissions';
// import { storeStringData } from '@/storages';
// import { CEmptyData, CText, Row } from '@/utils';
// import { BottomSheetModal } from '@gorhom/bottom-sheet';
// import { CameraRoll } from '@react-native-camera-roll/camera-roll';
// import { Divider, ScreenWidth } from '@rneui/base';
// import { makeStyles, useTheme } from '@rneui/themed';
// import { debounce } from 'lodash';
// import { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { Image as Img } from 'react-native-compressor';
// import RNFS from 'react-native-fs';
// import { launchImageLibrary } from 'react-native-image-picker';
// import Modal from 'react-native-modal';
// import { openPhotoPicker, openSettings, RESULTS } from 'react-native-permissions';
// import { MediaDetail } from './mediaDetail';
// import { PermissionLimit } from './permissionLimit';
// import { checkPermissionPhoto } from '@/permissions/checkPermissions';

// const DATA = [
//   {
//     node: {
//       group_name: [],
//       id: '123',
//       image: {
//         extension: 'jpg',
//         fileSize: 2604768,
//         filename: 'IMG_0002.JPG',
//         height: 2848,
//         playableDuration: null,
//         uri: 'https://cdn-global.doctornetwork.us/rooms/2024/04/xoFA_UXou_VCgG-9ULGuz.jpg',
//         width: 4288,
//       },
//       location: null,
//       modificationTimestamp: 1441224147,
//       sourceType: 'UserLibrary',
//       subTypes: [],
//       timestamp: 1255122560,
//       type: 'camera',
//     },
//   },
// ];

// const pickerItem = {
//   node: {
//     id: 'picker',
//     type: 'picker',
//     image: {
//       uri: 'picker_icon', // bạn dùng icon gallery
//     },
//   },
// };

// export const MediaLocal = ({
//   isVisible,
//   hideModal,
//   itemRoomId,
//   onSendImgVideo,
// }: any) => {
//   const {
//     theme: {colors},
//   } = useTheme();
//   const {t} = useTranslation();
//   const toastEl = useRef<any>(null);

//   const styles = useStyles();
//   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

//   const [listImageShow, setListImageShow] = useState<any>(DATA);
//   const [selectedUserId, setSelectedUserId] = useState<any>([]);

//   const [selectedImg, setSelectedImg] = useState<any>([]);
//   const [selectedItemImg, setSelectedItemImg] = useState<any>([]);

//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [showModalLimit, setShowModalLimit] = useState<boolean>(false);

//   const [itemModal, setItemModal] = useState<any>({});
//   const [checkIcon, setCheckIcon] = useState<boolean>(false);
//   const [type, setType] = useState<any>([]);
//   const [apiLoading, setApiLoading] = useState(false);

//   const [isloading, setIsloading] = useState<boolean>(false);
//   const [firstRender, setFirstRender] = useState<boolean>(true);
//   const [loadMoreImg, setLoadMoreImage] = useState(false);

//   const [endLoadImage, setEndLoadImage] = useState({
//     nextPage: true,
//     startCursor: '',
//     endCursor: '',
//   });

//   const [permission, setPermission] = useState<any>('');

//   useEffect(() => {
//     const checkPermisionDevice = async () => {
//       if (Platform.OS === 'android') {
//         // 🔥 LOAD LẦN ĐẦU Ở ĐÂY
//         setListImageShow([DATA[0], pickerItem]);
//       } else {
//         const resultCheckPhoto = await checkPermissionPhoto();
//         setPermission(resultCheckPhoto);
//         loadPhotoVideo();
//       }
//     };

//     checkPermisionDevice();
//   }, []);

//   const loadPhotoVideoAndroid = async () => {
//     try {
//       const res = await launchImageLibrary({
//         mediaType: 'mixed',
//         selectionLimit: 0,
//       });

//       if (!res.didCancel && res.assets) {
//         const mapped = res.assets.map((item, index) => ({
//           node: {
//             id: item.uri || `${index}`,
//             type: item.type?.split('/')[0] || 'image',
//             image: {
//               uri: item.uri,
//               filename: item.fileName || `file_${index}`,
//               playableDuration: item.duration || 0,
//               width: item.width,
//               height: item.height,
//             },
//           },
//         }));

//         const cameraItem = DATA[0];

//         const newList = [
//           cameraItem,
//           pickerItem, // 🔥 thêm vào đây
//           ...mapped,
//           ...listImageShow.filter(
//             (i: any) => i.node.type !== 'camera' && i.node.type !== 'picker',
//           ),
//         ];

//         setListImageShow(newList);
//       }
//     } catch (err) {
//       console.log('🔥 Android picker error:', err);
//     }
//   };

//   const loadPhotoVideo = async () => {
//     if (Platform.OS === 'android') return;
//     if (endLoadImage.endCursor === '') {
//       await CameraRoll.getPhotos(
//         isIOS
//           ? {
//               first: PAGINATION.ITEMS_20,
//               assetType: 'All',
//             }
//           : {
//               first: PAGINATION.ITEMS_20,
//               assetType: 'All',
//               include: ['playableDuration'],
//             },
//       )
//         .then(async (img: any) => {
//           setListImageShow([...listImageShow, ...img.edges]);
//           setEndLoadImage({
//             nextPage: img.page_info.has_next_page,
//             startCursor: img.page_info.start_cursor ?? '',
//             endCursor: img.page_info.end_cursor ?? '',
//           });
//         })
//         .catch((err: any) => {
//           console.log('error load image', err);
//         });
//     }
//     setFirstRender(false);
//   };

//   const handlePhotoLoadMore = async () => {
//     if (Platform.OS === 'android') return; // 🔥 disable Android
//     if (!firstRender && !loadMoreImg) {
//       setLoadMoreImage(true);
//       if (endLoadImage.nextPage) {
//         // console.log("🚀 ~ handlePhotoLoadMore ~ endLoadImage:", endLoadImage)
//         await CameraRoll.getPhotos(
//           isIOS
//             ? {
//                 first: PAGINATION.ITEMS_20,
//                 assetType: 'All',
//                 after: endLoadImage.endCursor,
//               }
//             : {
//                 first: PAGINATION.ITEMS_20,
//                 assetType: 'All',
//                 after: endLoadImage.endCursor,
//                 include: ['playableDuration'],
//               },
//         )
//           .then(img => {
//             setEndLoadImage({
//               nextPage: img.page_info.has_next_page,
//               startCursor: img.page_info.start_cursor ?? '',
//               endCursor: img.page_info.end_cursor ?? '',
//             });
//             setListImageShow([...listImageShow, ...img.edges]);
//           })
//           .catch(err => {
//             console.log('error load image', err);
//           });
//       }
//       setLoadMoreImage(false);
//     }
//   };

//   //ACTION

//   const handlePermission = () => {
//     setShowModalLimit(true);
//   };

//   const handleChooseImage = () => {
//     openPhotoPicker().then(() => {
//       setShowModalLimit(false);
//     });
//   };

//   const handleChooseSettings = () => {
//     openSettings();
//     setShowModalLimit(false);
//   };

//   const convertBase64 = async (localUri: any) => {
//     const data = await RNFS.readFile(
//       decodeURIComponent(localUri),
//       'base64',
//     ).then(res => {
//       return res;
//     });
//     return data;
//   };

//   const convertDuration = (duration: number) => {
//     try {
//       const h = Math.floor(duration / 3600);
//       const m = '0' + Math.floor((duration % 3600) / 60);
//       const s = '0' + Math.floor((duration % 3600) % 60);

//       const _baseTimer = `${m.slice(-2)}:${s.slice(-2)}`;
//       if (h === 0) return _baseTimer;

//       return `${('0' + h).slice(-2)}:${_baseTimer}`;
//     } catch (error) {
//       return '00:00';
//     }
//   };

//   const handleCheckBox = (item: any) => {
//     if (item.node?.type === 'camera' || item.node?.type === 'picker') {
//       return; // 🔥 không cho select
//     }
//     let arr2 = [...selectedUserId];
//     let arr3 = [...selectedImg];
//     let arrItem = [...selectedItemImg];
//     let arrType = [...type];
//     if (selectedUserId.includes(item?.node?.id)) {
//       for (let i = 0; i < arr2.length; i++) {
//         if (arr2[i] === item.node.id) {
//           arr2.splice(i, 1);
//           break;
//         }
//       }
//       for (let i = 0; i < arr3.length; i++) {
//         if (arr3[i] === item?.node?.image.uri) {
//           arr3.splice(i, 1);
//           break;
//         }
//       }
//       for (let i = 0; i < arrType.length; i++) {
//         if (arrType[i] === item?.node?.type) {
//           arrType.splice(i, 1);
//           break;
//         }
//       }
//       for (let i = 0; i < arrItem.length; i++) {
//         if (arrItem[i] === item?.node) {
//           arrItem.splice(i, 1);
//           break;
//         }
//       }
//     } else {
//       arr2.push(item.node.id);
//       arr3.push(item?.node?.image.uri);
//       arrType.push(item?.node?.type);
//       arrItem.push(item.node);
//     }
//     setSelectedUserId(arr2);
//     setSelectedImg(arr3);
//     setType(arrType);
//     setSelectedItemImg(arrItem);
//   };

//   const handleCamera = async () => {
//     await storeStringData(STORAGEKEY.CHECK_FILE, 'true');
//     bottomSheetModalRef.current?.close();
//     setApiLoading(true);
//     setTimeout(() => {
//       setApiLoading(false);
//     }, 1000);
//     const checkCamera: any = await cameraChatLauncher();
//     let content = [];
//     let arr = [];
//     let filename = [...selectedImg];
//     let typecamera = ['image/jpeg', 'image'];
//     let filenameRamdom = (Math.random() + 1).toString(36).substring(7);
//     if (checkCamera.isSuccess) {
//       if (checkCamera.imgRes) {
//         const result = await Img.compress(checkCamera.imgRes.path, {
//           compressionMethod: 'manual',
//           maxWidth: 1000,
//           quality: 0.8,
//         });
//         let base64 = await convertBase64(result);

//         arr.push(base64);
//         let items = {
//           type: 'image',
//           contentType: 'image/png',
//           name: filenameRamdom,
//         };
//         content.push(items);
//         filename.push(checkCamera.imgRes.path);
//         // console.log("🚀 ~ handleCamera ~ base64:", checkCamera.imgRes.path);
//         onSendImgVideo(content, filename, typecamera, arr, 1);
//         // onSendImgVideo(contentImg, selectedImg, type, arr, checkType, contentVideo, selectedItemImg);
//         await storeStringData(STORAGEKEY.CHECK_FILE, 'false');
//       }
//     } else if (checkCamera.msg) {
//       showToast(toastEl, checkCamera.msg);
//       await storeStringData(STORAGEKEY.CHECK_FILE, 'false');
//     }
//   };

//   const handleChosse = (item: any) => {
//     if (item.node?.type === 'camera') {
//       handleCamera(); // 📸
//     } else if (item.node?.type === 'picker') {
//       loadPhotoVideoAndroid(); // 🖼️
//     } else {
//       setItemModal(item);
//       setShowModal(true);
//     }
//   };

//   const handleSend = async () => {
//     //IOS
//     if (Platform.OS === 'ios') {
//       setIsloading(true);
//       let arr = [];
//       let content = [];
//       let checkType = 0;
//       let isImage = false;
//       let isVideo = false;
//       let check = 0;
//       for (let i = 0; i < selectedItemImg.length; i++) {
//         if (selectedItemImg[i].type === 'video') {
//           isVideo = true;
//           check = 2;
//         } else if (selectedItemImg[i].type === 'image') {
//           isImage = true;
//           check = 1;
//         }
//       }
//       if (isVideo && isImage && !isloading) {
//         setIsloading(true);
//         let contentImg = [];
//         let contentVideo = [];
//         for (let i = 0; i < selectedItemImg.length; i++) {
//           if (selectedItemImg[i].type === 'image') {
//             const result = await Img.compress(selectedImg[i], {
//               compressionMethod: 'manual',
//               maxWidth: 1000,
//               quality: 0.8,
//             });
//             let base64 = await convertBase64(result);
//             arr.push(base64);
//             let filenameRamdom = (Math.random() + 1).toString(36).substring(7);
//             let items = {
//               // filename: selectedImg[i],
//               // data: arr[i],
//               // type: 'image',
//               type:
//                 Platform.OS === 'ios'
//                   ? selectedItemImg[i].type
//                   : selectedItemImg[i].type.split('/').shift(),
//               contentType:
//                 Platform.OS === 'ios'
//                   ? `${selectedItemImg[i].type}/${selectedItemImg[
//                       i
//                     ].image.filename
//                       .split('.')
//                       .pop()}`
//                   : selectedItemImg[i].type,
//               name:
//                 Platform.OS === 'ios'
//                   ? selectedItemImg[i].image.filename
//                   : `${filenameRamdom}.${selectedItemImg[i].type
//                       .split('/')
//                       .pop()}`,
//             };
//             contentImg.push(items);
//           } else if (selectedItemImg[i].type === 'video') {
//             contentVideo.push(selectedImg[i]);
//           }
//         }
//         checkType = 3;
//         onSendImgVideo(
//           contentImg,
//           selectedImg,
//           type,
//           arr,
//           checkType,
//           contentVideo,
//           selectedItemImg,
//         );
//         setIsloading(false);
//       } else if (check === 1 && !isloading) {
//         setIsloading(true);
//         for (let i = 0; i < selectedItemImg.length; i++) {
//           const result = await Img.compress(selectedImg[i], {
//             compressionMethod: 'manual',
//             maxWidth: 1000,
//             quality: 0.8,
//           });
//           let base64 = await convertBase64(result);
//           arr.push(base64);
//           let filenameRamdom = (Math.random() + 1).toString(36).substring(7);
//           let items = {
//             // filename: selectedImg[i],
//             // data: arr[i],
//             // type: 'image',
//             type:
//               Platform.OS === 'ios'
//                 ? selectedItemImg[i].type
//                 : selectedItemImg[i].type.split('/').shift(),
//             contentType:
//               Platform.OS === 'ios'
//                 ? `${selectedItemImg[i].type}/${selectedItemImg[
//                     i
//                   ].image.filename
//                     .split('.')
//                     .pop()}`
//                 : selectedItemImg[i].type,
//             name:
//               Platform.OS === 'ios'
//                 ? selectedItemImg[i].image.filename
//                 : `${filenameRamdom}.${selectedItemImg[i].type
//                     .split('/')
//                     .pop()}`,
//           };
//           content.push(items);
//         }
//         checkType = 1;
//         onSendImgVideo(
//           content,
//           selectedImg,
//           type,
//           arr,
//           checkType,
//           [],
//           selectedItemImg,
//         );
//         setIsloading(false);
//       } else if (check === 2 && !isloading) {
//         setIsloading(true);
//         for (let i = 0; i < selectedItemImg.length; i++) {
//           content.push(selectedImg[i]);
//         }
//         checkType = 2;
//         onSendImgVideo(
//           content,
//           selectedImg,
//           [],
//           type,
//           checkType,
//           [],
//           selectedItemImg,
//         );
//         setIsloading(false);
//       }
//       //android
//     } else {
//       setIsloading(true);
//       let arr = [];
//       let content = [];
//       let checkType = 0;
//       let isImage = false;
//       let isVideo = false;
//       let check = 0;
//       for (let i = 0; i < selectedItemImg.length; i++) {
//         if (selectedItemImg[i].type.split('/').shift() === 'video') {
//           isVideo = true;
//           check = 2;
//         } else if (selectedItemImg[i].type.split('/').shift() === 'image') {
//           isImage = true;
//           check = 1;
//         }
//       }
//       if (isVideo && isImage && !isloading) {
//         setIsloading(true);
//         let contentImg = [];
//         let contentVideo = [];
//         for (let i = 0; i < selectedItemImg.length; i++) {
//           if (selectedItemImg[i].type.split('/').shift() === 'image') {
//             const result = await Img.compress(selectedImg[i], {
//               compressionMethod: 'manual',
//               maxWidth: 1000,
//               quality: 0.8,
//             });
//             let base64 = await convertBase64(result);
//             arr.push(base64);
//             let filenameRamdom = (Math.random() + 1).toString(36).substring(7);
//             let items = {
//               // filename: selectedImg[i],
//               // data: arr[i],
//               // type: 'image',
//               type: selectedItemImg[i].type.split('/').shift(),
//               contentType: selectedItemImg[i].type,
//               name: `${filenameRamdom}.${selectedItemImg[i].type
//                 .split('/')
//                 .pop()}`,
//             };
//             contentImg.push(items);
//           } else if (selectedItemImg[i].type.split('/').shift() === 'video') {
//             contentVideo.push(selectedImg[i]);
//           }
//         }
//         checkType = 3;
//         onSendImgVideo(
//           contentImg,
//           selectedImg,
//           type,
//           arr,
//           checkType,
//           contentVideo,
//           selectedItemImg,
//         );
//         setIsloading(false);
//       } else if (check === 1 && !isloading) {
//         setIsloading(true);
//         for (let i = 0; i < selectedItemImg.length; i++) {
//           const result = await Img.compress(selectedImg[i], {
//             compressionMethod: 'manual',
//             maxWidth: 1000,
//             quality: 0.8,
//           });
//           let base64 = await convertBase64(result);
//           arr.push(base64);
//           let filenameRamdom = (Math.random() + 1).toString(36).substring(7);
//           let items = {
//             // filename: selectedImg[i],
//             // data: arr[i],
//             // type: 'image',
//             type: selectedItemImg[i].type.split('/').shift(),
//             contentType: selectedItemImg[i].type,
//             name: `${filenameRamdom}.${selectedItemImg[i].type
//               .split('/')
//               .pop()}`,
//           };
//           content.push(items);
//         }
//         checkType = 1;
//         onSendImgVideo(content, selectedImg, type, arr, checkType);
//         setIsloading(false);
//       } else if (check === 2 && !isloading) {
//         setIsloading(true);
//         for (let i = 0; i < selectedItemImg.length; i++) {
//           content.push(selectedImg[i]);
//         }
//         checkType = 2;
//         onSendImgVideo(
//           content,
//           selectedImg,
//           [],
//           type,
//           checkType,
//           [],
//           selectedItemImg,
//         );
//         setIsloading(false);
//       }
//     }
//   };

//   const showModalPermission = () => {
//     Alert.alert(
//       `"Doctor Network" Would Like to Access Your Photo Library`,
//       'Need to access your camera to take a photo then update profile picture and other support in the application',
//       [
//         {
//           text: t('communityChat.listPin.reject'),
//           onPress: () => {},
//           style: 'default',
//         },
//         {
//           text: t('communityChat.contact.appect'),
//           onPress: () => {
//             hideModal();
//             openSettings();
//           },
//           style: 'destructive',
//         },
//       ],
//     );
//   };

//   //RENDER

//   const renderItemImageShow = ({item, index}: any) => {
//     let check = isIOS ? 'video' : 'video/mp4';
//     // console.log("🚀 ~ renderItemImageShow ~ check:", item)
//     if (item.node?.type === 'picker') {
//       return (
//         <Pressable onPress={() => handleChosse(item)}>
//           <View
//             style={[
//               styles.viewCotainer,
//               {
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 backgroundColor: colors.cEAECF0, // nền xám đậm đẹp
//                 marginTop:2
//               },
//             ]}>
//             {/* Icon */}
//             <IconX
//               type={IconType.FEATHER}
//               name="image"
//               size={28}
//               color={colors.c101828}
//             />
//           </View>
//         </Pressable>
//       );
//     }
//     return (
//       <View>
//         {item.node?.type === check ? (
//           <View style={styles.viewCotainer}>
//             <View style={styles.duration}>
//               <CText color={colors.white} h5>{` ${convertDuration(
//                 item?.node?.image.playableDuration,
//               )} `}</CText>
//             </View>
//             <View style={styles.chosseImgCheck}>
//               {!selectedUserId.includes(item?.node?.id) ? (
//                 <Pressable
//                   hitSlop={screenStyles.hitSlop30}
//                   style={styles.chosseVideos}
//                   onPress={() => {
//                     handleCheckBox(item);
//                   }}>
//                   <Image
//                     source={images.community.check_img}
//                     style={screenStyles.box24}
//                     resizeMode="contain"
//                   />
//                 </Pressable>
//               ) : (
//                 <>
//                   <View
//                     style={{
//                       position: 'absolute',
//                       zIndex: 200,
//                       left: 8,
//                       top: 4,
//                     }}>
//                     <CText h6 color={colors.white}>
//                       {'√'}
//                     </CText>
//                   </View>
//                   <Pressable
//                     hitSlop={screenStyles.hitSlop30}
//                     onPress={() => {
//                       handleCheckBox(item);
//                     }}>
//                     <Image
//                       source={images.community.check_img_chosse}
//                       style={screenStyles.box24}
//                       resizeMode="contain"
//                     />
//                   </Pressable>
//                 </>
//               )}
//             </View>
//             <Pressable onPress={() => handleChosse(item)}>
//               <Image
//                 source={{uri: item?.node?.image.uri}}
//                 style={styles.viewCotainer}
//               />
//             </Pressable>
//           </View>
//         ) : (
//           <View style={styles.viewCotainer}>
//             {item.node?.type !== 'camera' && item.node?.type !== 'picker' ? (
//               !selectedUserId.includes(item?.node?.id) ? (
//                 <Pressable
//                   hitSlop={screenStyles.hitSlop30}
//                   style={styles.chosseImg}
//                   onPress={() => {
//                     handleCheckBox(item);
//                   }}>
//                   <Image
//                     source={images.community.check_img}
//                     style={screenStyles.box24}
//                     resizeMode="contain"
//                   />
//                 </Pressable>
//               ) : (
//                 <Pressable
//                   hitSlop={screenStyles.hitSlop30}
//                   style={styles.chosseImg}
//                   onPress={() => {
//                     handleCheckBox(item);
//                   }}>
//                   <View
//                     style={{
//                       position: 'absolute',
//                       zIndex: 200,
//                       left: 8,
//                       top: 4,
//                     }}>
//                     <CText h6 color={colors.white}>
//                       {'√'}
//                     </CText>
//                   </View>
//                   <Image
//                     source={images.community.check_img_chosse}
//                     style={screenStyles.box24}
//                     resizeMode="contain"
//                   />
//                 </Pressable>
//               )
//             ) : null}
//             <Pressable onPress={() => handleChosse(item)}>
//               <Image
//                 source={{uri: item?.node?.image.uri}}
//                 style={styles.viewCotainer}
//               />
//             </Pressable>
//           </View>
//         )}
//       </View>
//     );
//   };

//   const _renderSearchResultsFooter = () => {
//     return loadMoreImg ? (
//       <ActivityIndicator size="small" color={colors.primary} />
//     ) : null;
//   };

//   const renderBody = () => {
//     return (
//       <View style={{flex: 1}}>
//         {permission === RESULTS.LIMITED ||
//         (Platform.OS == 'android' && permission == RESULTS.LIMITED) ? (
//           <Pressable
//             style={[screenStyles.pH10, screenStyles.pV12]}
//             onPress={() => handlePermission()}>
//             <CText color={colors.c101828} h5>
//               {`${t('communityChat.mediaLocal.permissionLimit')} `}
//               <CText h5 w500 color={colors.primary}>
//                 {t('communityChat.mediaLocal.permissionLimitButton')}
//               </CText>
//             </CText>
//           </Pressable>
//         ) : null}
//         <FlatList
//           contentContainerStyle={screenStyles.flexGrowBottom}
//           keyboardDismissMode="on-drag"
//           numColumns={3}
//           data={listImageShow}
//           extraData={listImageShow}
//           keyExtractor={keyExtractor}
//           renderItem={renderItemImageShow}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={() => {
//             return <CEmptyData />;
//           }}
//           onEndReachedThreshold={0.5}
//           scrollEventThrottle={isIOS ? 160 : 16}
//           onEndReached={handlePhotoLoadMore}
//           ListFooterComponent={_renderSearchResultsFooter}
//         />
//         <View style={styles.bottomgoback}>
//           <TouchableOpacity onPress={() => {}}>
//             {selectedUserId.length === 0 ? (
//               <View style={styles.shadowGoback}>
//                 <View
//                   style={[styles.view40, {backgroundColor: colors.c98A2B3}]}>
//                   <IconX
//                     style={styles.iconBack}
//                     origin={ICON_TYPE.ICONICONS}
//                     name={'send'}
//                     size={22}
//                     color={colors.white}
//                   />
//                 </View>
//               </View>
//             ) : (
//               <Pressable onPress={debounce(handleSend, 50)}>
//                 <View style={styles.shadowGoback}>
//                   <View
//                     style={[styles.view40, {backgroundColor: colors.primary}]}>
//                     <IconX
//                       style={styles.iconBack}
//                       origin={ICON_TYPE.ICONICONS}
//                       name={'send'}
//                       size={22}
//                       color={colors.white}
//                     />
//                   </View>
//                 </View>
//                 <View style={styles.totalChosse}>
//                   <CText center color={colors.white}>
//                     {selectedUserId.length}
//                   </CText>
//                 </View>
//               </Pressable>
//             )}
//           </TouchableOpacity>
//         </View>
//         <Pressable
//           onPress={() => setCheckIcon(!checkIcon)}
//           style={styles.bottomChosse}>
//           {!checkIcon ? (
//             <IconX
//               style={styles.iconBack}
//               type={IconType.FEATHER}
//               name={'circle'}
//               size={22}
//               color={colors.white}
//             />
//           ) : (
//             <IconX
//               style={styles.iconBack}
//               type={IconType.FONTISTO}
//               name={'check-circle'}
//               size={24}
//               color={colors.primary}
//             />
//           )}
//           <View style={{left: 50, top: 13}}>
//             <CText center color={colors.white}>
//               {t('communityChat.mediaLocal.hd')}
//             </CText>
//           </View>
//         </Pressable>
//         <View style={styles.backgroundbottom} />
//       </View>
//     );
//   };

//   const renderContent = () => {
//     return (
//       <View style={screenStyles.wrapModalTop}>
//         <View style={screenStyles.modalTopHeader}>
//           <Row between>
//             <Pressable onPress={() => hideModal()}>
//               <CText center h4 w600 color={colors.primary}>
//                 {t('communityChat.mediaLocal.titleLeft')}
//               </CText>
//             </Pressable>
//             <CText center h4 w600 color={colors.black}>
//               {t('communityChat.mediaLocal.title')}
//             </CText>
//             <Pressable>
//               <IconX
//                 style={{top: 2, left: 2}}
//                 name={'close'}
//                 origin={ICON_TYPE.ICONICONS}
//                 color={colors.white}
//                 size={24}
//               />
//             </Pressable>
//           </Row>
//         </View>
//         <Divider color={colors.cD0D5DD} width={1} />
//         {renderBody()}
//       </View>
//     );
//   };

//   return (
//     <Modal
//       isVisible={isVisible}
//       onBackdropPress={hideModal}
//       style={screenStyles.containerModalTop}>
//       {renderContent()}
//       {showModal && (
//         <MediaDetail
//           isVisible={showModal}
//           hideModal={() => setShowModal(false)}
//           itemModal={itemModal}
//         />
//       )}
//       {showModalLimit && (
//         <PermissionLimit
//           isVisible={showModalLimit}
//           hideModal={() => setShowModalLimit(false)}
//           handleChooseImage={handleChooseImage}
//           handleChooseSettings={handleChooseSettings}
//         />
//       )}
//       {apiLoading ? (
//         <APILoading showAlert={apiLoading} isLoadingAPI={apiLoading} />
//       ) : null}
//       <Toast ref={toastEl} position={'center'} />
//     </Modal>
//   );
// };

// const useStyles = makeStyles(({colors}) => ({
//   viewCotainer: {
//     width: ScreenWidth / 3,
//     height: ScreenHeight / 6,
//     margin: 1,
//   },
//   duration: {
//     position: 'absolute' as const,
//     bottom: 10,
//     right: 10,
//     zIndex: 100,
//     backgroundColor: colors.c33353A,
//     borderRadius: 3,
//   },
//   chosseImg: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 100,
//     backgroundColor: 'rgba(0,0,19)',
//     borderRadius: 20,
//   },
//   chosseVideos: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     zIndex: 100,
//     backgroundColor: 'rgba(0,0,19)',
//     borderRadius: 20,
//   },
//   chosseImgCheck: {
//     position: 'absolute' as const,
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
//   bottomChosse: {
//     position: 'absolute',
//     bottom: 60,
//     left: 30,
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
//     position: 'absolute' as const,
//     bottom: 0,
//     backgroundColor: 'black' as const,
//     width: ScreenWidth,
//     height: 100,
//     opacity: 0.5,
//   },
// }));
