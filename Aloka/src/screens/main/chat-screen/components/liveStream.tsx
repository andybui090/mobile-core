// import { CButton, CLoading, CText, Row } from '@/utils';
// import { useCallback, useContext, useEffect, useState } from 'react';
// import { Alert, DeviceEventEmitter, Image, Keyboard, Platform, Pressable, View } from 'react-native';
// // import BWVideoPlayer from './BWVideoPlayer';
// import { APILoading, ICON_TYPE, IconX } from '@/components';
// import { alertForCameraPermission, alertForMicrophonePermission, checkPermissionCamera, checkPermissionMicrophone, images, ScreenHeight, screenStyles } from '@/configs';
// import { AppContext } from '@/contexts';
// import { deleteRoomLive } from '@/redux/slices/globalSlice';
// import { resetActionEmoji, resetMessages, resetSocketjoinRoom } from '@/redux/slices/socketioSlice';
// import { store } from '@/redux/store';
// import { useAppSelector } from '@/redux/store/customReduxHook';
// import socketService from '@/socketio';
// import { makeStyles, useTheme } from '@rneui/themed';
// import moment from 'moment';
// import { useTranslation } from 'react-i18next';
// import Config from 'react-native-config';
// import { default as InCallManager, default as inCallManager } from 'react-native-incall-manager';
// import { rtc_view, useAntMedia } from '../../liveStream';

// const LiveStream = ({ itemRoomChat, listIdMember, onhandleClose, onhandleStop, height, textTilteLive, setIsLiveStream, setItem, countViewer }: any) => {
//   const styles = useStyles();
//   const {
//     theme: { colors },
//   } = useTheme();
//   const { t } = useTranslation();
//   const { user, isDoctor } = useContext(AppContext);

//   const { socketmessage, getViewerLive, socketjoinRoom, actionEmoji, getRoomLive, checkErorrRemoveRoom, listRoomLiveStreamChat, socketCreatRoom } = useAppSelector(state => state.socketioReducer);

//   const [isWaitingWebsocketInit, setIsWaitingWebsocketInit] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [localMedia, setLocalMedia] = useState('');
//   const [isCameraOpen, setIsCameraOpen] = useState<any>(true);
//   const [isMuted, setIsMuted] = useState(false);

//   const [showAlert, setShowAlert] = useState(false);
//   const [isLoadingAPI, setIsLoadingAPI] = useState(false);

//   const [loadingLive, setLoadingLive] = useState<boolean>(false);

//   const [title, setTilte] = useState<any>('');
//   const [itemCreateRoom, setItemCreateRoom] = useState<any>({});


//   const webSocketUrl: any = Config.SOCKET_LIVESTREAM;
//   useEffect(() => {
//     setTimeout(() => {
//       setLoadingLive(true);
//     }, 500);
//   }, []);

//   const adaptor = useAntMedia({
//     url: webSocketUrl || '',
//     mediaConstraints: {
//       audio: true,
//       video: {
//         width: 1080,
//         height: 720,
//         frameRate: 30,
//         facingMode: 'user',
//       },
//     },

//     callback(command: any, data: any) {
//       switch (command) {
//         case 'pong':
//           break;
//         case 'publish_started':
//           console.log('publish_started');
//           onhandleStop(adaptor);
//           adaptor.setLocalMicVolume(5);
//           adaptor.setRemoteAudioVolume(5, itemRoomChat.room_is_live, title);
//                       setTimeout(() => {
//                         InCallManager.setSpeakerphoneOn(true);
//                         InCallManager.setForceSpeakerphoneOn(true);
//                       }, 500);
//           socketService.emitMessageSocketGroup(`DoctorNetwork_Chat_NETDEV ${itemCreateRoom.title}`, 'live', itemRoomChat.id, moment().unix() + '.live', `${itemCreateRoom.id}`);
//           socketService.emitMessageSocketGroup(`DoctorNetwork_Chat_NETDEV ${itemCreateRoom.id} {communityChat.chat.startLivestream}`, 'text', itemRoomChat.id, 'DoctorNetwork_Chat_NETDEV_INVITE_ROOM');
//           socketService.emitRoomLiveChat(itemCreateRoom.id, 1, 1, itemRoomChat.id);
//           setTimeout(() => {
//           setShowAlert(false);
//           setIsLoadingAPI(false);
//           }, 700);
//           setIsPlaying(true);
//           break;
//         case 'publish_finished':
//           console.log('publish_finished');
//           inCallManager.stop();
//           setIsPlaying(false);
//           adaptor.closeWebSocket();
//           break;
//         case 'local_stream_updated':
//           console.log('local_stream_updated');
//           verify();
//           break;
//         case 'websocket_not_initialized':
//           setIsWaitingWebsocketInit(true);
//           adaptor.initialiseWebSocket();
//           break;
//         case 'websocket_closed':
//           console.log('websocket_closed');
//           adaptor.stopLocalStream();
//           break;
//         default:
//           console.log(command);
//           break;
//       }
//     },

//     callbackError: (err: any, data: any) => {
//       if (err == 'license_suspended_please_renew_license') {
//         Alert.alert(
//           title,
//           t('communityChat.livestream.errorMaintenance'),
//           [
//             {
//               text: 'Ok',
//               onPress: () => { },
//               style: 'default',
//             },
//           ],
//         );
//       }
//     },
//     peer_connection_config: {
//       iceServers: [
//         {
//           url: 'stun:stun.l.google.com:19302',
//         },
//       ],
//     },
//     debug: true,
//   });


//   const verify = async () => {
//     console.log('in verify');
//     if (adaptor.localStream.current && adaptor.localStream.current.toURL()) {
//       if (isWaitingWebsocketInit) {
//         setIsWaitingWebsocketInit(false);
//         // adaptor.publish(itemRoomChat.room_is_live);
//       }
//       return setLocalMedia(adaptor.localStream.current.toURL());
//     }
//     setTimeout(verify, 5000);
//   };

//   useEffect(() => {
//     const verify = () => {
//       if (adaptor.localStream.current && adaptor.localStream.current.toURL()) {
//         let videoTrack = adaptor.localStream.current.getVideoTracks()[0];
//         // @ts-ignore
//         return setLocalMedia(videoTrack);
//       }
//       setTimeout(verify, 5000);
//     };
//     verify();
//   }, [adaptor.localStream]);

//     useEffect(() => {
//       if (localMedia) {
//         inCallManager.start({ media: 'video' });
//         DeviceEventEmitter.addListener("onAudioDeviceChanged", (event) => {
//           console.log("onAudioDeviceChanged", event.availableAudioDeviceList);
//         });
//       }
//     }, [localMedia]);

//   // useEffect(() => {
//   //   const processAPIListCreate = async () => {
//   //     const { data } = getViewerLive;
//   //     console.log("🚀 ~ processAPIListCreate ~ data:", data)
//   //     console.log("🚀 ~ processAPIListCreate ~ room_is_live:", itemRoomChat.room_is_live)
//   //     if (data && data.room_id === itemRoomChat.room_is_live) {
//   //       setCountViewer(data.total)
//   //     }
//   //   };
//   //   processAPIListCreate();
//   // }, [getViewerLive, isPlaying]);

//   useEffect(() => {
//     const processAPIListCreate = () => {
//       const { loading, data, error } = socketCreatRoom;
//       if (!loading) {
//         if (data) {
//           let itemCreateRoom = {
//             created_at: Date.now(),
//             description: null,
//             id: socketCreatRoom?.data?.room_id,
//             invite_status: socketCreatRoom?.data?.type === 'Room' ? 0 : null,
//             is_deleted: 0,
//             is_chat: socketCreatRoom?.data?.is_chat,
//             is_record: socketCreatRoom?.data?.is_record,
//             owner_id: user.id,
//             stream_key: socketCreatRoom?.data?.stream_key,
//             status: 1,
//             thumbnail: socketCreatRoom?.data?.thumbnail,
//             title: socketCreatRoom?.data?.title,
//             to: null,
//             type: socketCreatRoom?.data?.type,
//             updated_at: Date.now(),
//             user_id: null,
//             room_is_live: null,
//           };
//           setTilte(itemCreateRoom.title);
//           setItemCreateRoom(itemCreateRoom);
//           setShowAlert(false);
//           setIsLoadingAPI(false);
//           // adaptor.publish(itemCreateRoom.id, itemCreateRoom.stream_key);
//           // socketService.emitMessageSocketGroup(`${itemCreateRoom.title}`, 'live', itemRoomChat.id, moment().unix() + '.live', `${itemCreateRoom.id}`);
//           // socketService.emitMessageSocketGroup(`DoctorNetwork_Chat_NETDEV ${itemCreateRoom.id} {communityChat.chat.startLivestream}`, 'text', itemRoomChat.id, 'DoctorNetwork_Chat_NETDEV_INVITE_ROOM');
//         }
//         store.dispatch(resetMessages(null));
//       }
//     };
//     processAPIListCreate();
//   }, [socketCreatRoom]);


//   useEffect(() => {
//     const processActionEmoji = () => {
//       const { loading, data, error } = actionEmoji;
//       if (!loading) {
//         if (data) {
//           if (data.room_id === itemRoomChat.room_is_live) {
//             if (data.emoji === 'changeCameraFront') {
//               setIsCameraOpen(false);
//             } else if (data.emoji === 'changeCameraBack') {
//               setIsCameraOpen(true);
//             } else if (data.emoji === 'changeCameraPlay') {
//               if (isCameraOpen) {
//                 socketService.emitActionEmoji(itemRoomChat.room_is_live, 'changeCameraBack');
//               } else {
//                 socketService.emitActionEmoji(itemRoomChat.room_is_live, 'changeCameraFront');
//               }
//             }
//           }
//           store.dispatch(resetActionEmoji(null));
//         }
//       }
//     };
//     processActionEmoji();
//   }, [actionEmoji]);

//   const handleCamera = useCallback(() => {
//     if (adaptor) {
//       socketService.emitActionEmoji(itemRoomChat.room_is_live, !isCameraOpen ? 'changeCameraBack' : 'changeCameraFront');
//       adaptor.switchCamera();
//       if (!isCameraOpen) {
//         setTimeout(() => {
//           setIsCameraOpen(true);
//         }, 1000);
//       } else {
//         setIsCameraOpen(false);
//       }
//     }
//   }, [adaptor, isCameraOpen]);

//   const handleMic = useCallback(() => {
//     if (adaptor) {
//       (isMuted) ? adaptor.unmuteLocalMic() : adaptor.muteLocalMic();
//       adaptor.setLocalMicVolume(1);
//       adaptor.setRemoteAudioVolume(1, itemRoomChat.room_is_live, title);
//       setIsMuted(!isMuted);
//     }
//   }, [adaptor, isMuted]);

//   const handlePublish = useCallback(async () => {
//     const resultCheckCamera = await checkPermissionCamera();
//     const resultCheckMicrophone = await checkPermissionMicrophone();
//     if (!adaptor) {
//       return;
//     }
//     if (resultCheckCamera !== 'granted') {
//       alertForCameraPermission();
//     } else if (resultCheckMicrophone !== 'granted') {
//       alertForMicrophonePermission();
//     } else {
//       setShowAlert(true);
//       setIsLoadingAPI(true);
//       adaptor.publish(itemCreateRoom.id, itemCreateRoom.stream_key);
//       // socketService.emitCreateSocketGroupNoImagePrivateChat(textTilteLive, listIdMember.join(','));
//     }
//   }, [adaptor]);

//   const handleStop = async () => {
//     if (!adaptor) {
//       return;
//     }
//     let obj = itemRoomChat;
//     adaptor.stop(itemRoomChat.room_is_live);
//     adaptor.closeWebSocket();
//     if (isPlaying) {
//       socketService.emitRoomLive(itemRoomChat.room_is_live, 2, 1);
//     }
//     socketService.emitViewerLive(itemRoomChat.room_is_live, 0);
//     store.dispatch(resetSocketjoinRoom(null));
//     store.dispatch(deleteRoomLive(itemRoomChat));
//     socketService.emitMessageSocketGroup(`DoctorNetwork_Chat_NETDEV {communityChat.chat.endLivestream}`, 'text', itemRoomChat.id, 'DoctorNetwork_Chat_NETDEV_INVITE_ROOM');
//     onhandleClose();
//     setIsLiveStream(false);
//     obj.room_is_live = null;
//     setItem(obj);
//   };

//   const handleDeleteRoom = () => {
//     // socketService.emitDeleteSocket(itemCreateRoom.id, 'livechat');
//     onhandleClose();
//   }


//   const renderErrorImage = () => {
//     return <Image source={images.global.no_avatar} style={screenStyles.box30} resizeMode="contain" />;
//   };

//     const renderRTC = () => {
//           return <View style={{ borderRadius: 10, overflow: 'hidden', width: '98%', marginLeft: 6, height: height > 0 ? ScreenHeight / 2.2 - 10 : ScreenHeight / 1.8 - 10, }}>
//                 {
//                   rtc_view(
//                     localMedia,
//                     styles.streamPlayer,
//                     'cover',
//                     0,
//                     isCameraOpen)
//                 }
//               </View>
//     };

//   const renderButton = () => {
//     return (
//       !isPlaying ? (
//         <>
//           <View style={[styles.iconMicCamera, { flexDirection: 'row' }]}>
//             <Pressable onPress={handleMic} >
//               <Image source={isMuted ? images.community.buttonUnMic : images.community.buttonMic} style={screenStyles.box52} resizeMode="contain" />
//             </Pressable>
//             <Pressable onPress={()=> handleDeleteRoom()} >
//               <View style={{ marginLeft: 20, bottom: 2, backgroundColor: '#F04438', width: 52, height: 52, borderRadius: 27, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
//                 <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={"white"} size={22} />
//               </View>
//             </Pressable>
//             <Pressable onPress={handleCamera} >
//               <View style={{ marginLeft: 20, bottom: 2 }}>
//                 <Image source={images.community.buttonCamera} style={screenStyles.box52} resizeMode="contain" />
//               </View>
//             </Pressable>
//           </View>
//           <View style={styles.button}>
//             <CButton title={t('communityChat.livestream.buttonPublish')} onPress={handlePublish} />
//           </View>
//         </>
//       ) : (
//         <>
//           <View style={[styles.iconMicCameraV2, { flexDirection: 'row' }]}>
//             <Pressable onPress={handleMic} >
//               <Image source={isMuted ? images.community.buttonUnMic : images.community.buttonMic} style={screenStyles.box52} resizeMode="contain" />
//             </Pressable>
//             <Pressable onPress={handleStop} >
//               <View style={{ marginLeft: 20, bottom: 2, backgroundColor: '#F04438', width: 52, height: 52, borderRadius: 27, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
//                 <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={"white"} size={22} />
//               </View>
//             </Pressable>
//             <Pressable onPress={handleCamera} >
//               <View style={{ marginLeft: 20, bottom: 2 }}>
//                 <Image source={images.community.buttonCamera} style={screenStyles.box52} resizeMode="contain" />
//               </View>
//             </Pressable>
//           </View>

//         </>
//       )
//     )
//   }

//   const renderViewer = () => {
//     return (
//       !isPlaying ? (
//         <>
//         </>
//       ) : (
//         <>
//           <View style={{ position: 'absolute', zIndex: 200, paddingHorizontal: 10, paddingVertical: 8 }}>
//             <CText numberOfLines={1} h4 w500 color={'white'} style={styles.heading}>
//               {title}
//             </CText>
//           </View>
//           <Row start style={{ position: 'absolute', zIndex: 200, top: 30 }}>
//             <View style={{ position: 'absolute', top: 10, backgroundColor: 'transparent', height: 28, justifyContent: 'center', marginLeft: 10, borderRadius: 5, paddingHorizontal: 13, overflow: 'hidden', zIndex: 200 }}>
//               <View style={{
//                 position: 'absolute',
//                 backgroundColor: "#262626",
//                 opacity: 0.5,
//                 width: 200,
//                 height: 28,
//               }} />
//               <Row>
//                 <Image source={images.community.icon_viewlive} style={screenStyles.box14} resizeMode="contain" />
//                 <CText h5 color={'white'} w500 style={styles.heading}>
//                   {countViewer}
//                 </CText>
//               </Row>
//             </View>
//           </Row>
//         </>
//       )
//     )
//   }

//   return (
//     <>
//       <View style={[styles.viewPin, styles.shadow, { height: height > 0 ? ScreenHeight / 2.2 : ScreenHeight / 1.8 }]}>
//         <Row start>
//           <View style={{ width: '99%' }}>
//             {renderViewer()}
//             {localMedia ? <Pressable onPress={() => { Keyboard.dismiss() }}>
//               {renderRTC()}
//             </Pressable>
//               : <></>}
//             {loadingLive && renderButton()}
//           </View>
//         </Row>
//         {!loadingLive &&
//           <View style={{ position: 'absolute', height: '100%', alignContent: 'center', justifyContent: 'center', alignSelf: 'center', zIndex: 200 }}>
//             <CLoading />
//           </View>
//         }
//       </View>
//       {showAlert ? <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} /> : null}

//     </>
//   )
// }

// export default LiveStream;
// const useStyles = makeStyles(({ colors }) => ({
//   viewPin: { position: 'absolute', zIndex: 200, height: ScreenHeight / 2.2, justifyContent: 'center', borderRadius: 10, borderColor: colors.black, },
//   showListPin: { borderWidth: 1, borderColor: colors.primary, paddingVertical: 6 },
//   shadow: {
//     backgroundColor: '#fff',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#C4C4C4',
//         shadowOffset: {
//           width: 0,
//           height: 1,
//         },
//         shadowOpacity: 0.5,
//         shadowRadius: 3.84,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   streamPlayer: {
//     width: '100%',
//     height: '100%',
//   },
//   iconMicCamera: {
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 90,
//     marginBottom: 10,
//     width: '90%',
//     alignContent: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     marginLeft: "5%",
//     zIndex: 100,
//   },
//   iconMicCameraV2: {
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 0,
//     marginBottom: 10,
//     width: '90%',
//     alignContent: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     marginLeft: "5%",
//     zIndex: 100,
//   },
//   button: {
//     alignItems: 'center',
//     backgroundColor: '#0080F6',
//     position: 'absolute',
//     bottom: 20,
//     marginBottom: 10,
//     width: '90%',
//     alignContent: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     marginLeft: "5%",
//     zIndex: 100,
//   },
//   heading: {
//     alignSelf: 'center',
//     marginLeft: 5,
//   },
// }));