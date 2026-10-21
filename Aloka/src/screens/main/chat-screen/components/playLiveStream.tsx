import { CLoading, CText, Row } from '@/utils';
import { useContext, useEffect, useState } from 'react';
import { Image, Keyboard, Platform, Pressable, View } from 'react-native';
// import BWVideoPlayer from './BWVideoPlayer';
import { APILoading, ICON_TYPE, IconX } from '@/components';
import { images, ScreenHeight, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { deleteRoomLive } from '@/redux/slices/globalSlice';
import { resetActionEmoji, resetSocketjoinRoom } from '@/redux/slices/socketioSlice';
import { store } from '@/redux/store';
import { useAppSelector } from '@/redux/store/customReduxHook';
import socketService from '@/socketio';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import { default as inCallManager } from 'react-native-incall-manager';
import { rtc_view, useAntMedia } from '../../liveStream';

const PlayLiveStream = ({ itemLiveStream, onhandleClose, onhandleStop, height }: any) => {
    const styles = useStyles();
    const {
        theme: { colors },
    } = useTheme();
    const { t } = useTranslation();
    const { user, isDoctor } = useContext(AppContext);

    const { socketmessage, getViewerLive, socketjoinRoom, actionEmoji, getRoomLive, checkErorrRemoveRoom, listRoomLiveStreamChat, socketCreatRoom, localVolumeLive } = useAppSelector(state => state.socketioReducer);

    const [isWaitingWebsocketInit, setIsWaitingWebsocketInit] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [localMedia, setLocalMedia] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState<any>(true);
    const [isMuted, setIsMuted] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [isLoadingAPI, setIsLoadingAPI] = useState(false);

    const [remoteMedia, setRemoteStream] = useState<string>('');
    const [countViewer, setCountViewer] = useState<number>(0);
    const [loadingLive, setLoadingLive] = useState<boolean>(false);
    const [checkBackground, setCheckBackground] = useState<boolean>(false);

    const { appStateStatus, reloadConnectSocket } = useAppSelector(state => state.globalReducer);

    const webSocketUrl: any = Config.SOCKET_LIVESTREAM;

    const adaptor = useAntMedia({
        url: webSocketUrl,
        mediaConstraints: {
            video: false,
        },
        callback(command: any, data: any) {
            switch (command) {
                case 'pong':
                    break;
                case 'play_started':
                    inCallManager.setSpeakerphoneOn(true);
                    inCallManager.setForceSpeakerphoneOn(true);
                    setIsPlaying(true);
                    setLoadingLive(true);
                    break;
                case 'play_finished':
                    console.log('play_finished');
                    setIsPlaying(false);
                    // if (!checkBackground) {
                    //   setTimeout(() => {
                    //     setShowModalDisconnect(true);
                    //   }, 5000);
                    // }
                    setLoadingLive(false);
                    break;
                case "data_channel_closed":
                    break;
                case "newStreamAvailable":
                    // if (data.streamId == streamNameRef.current)
                    console.log("🚀 ~ callback ~ data:", data)
                    setRemoteStream(data.stream.toURL());
                    break;
                case 'websocket_not_initialized':
                    setIsPlaying(false);
                default:
                    console.log(command);
                    break;
            }
        },
        callbackError: (err: any, data: any) => {
            console.error('callbackError', err, data);
            if (err == 'no_stream_exist') {
                onhandleClose(adaptor);
            } else if (err === 'already_playing') {
            }
        },
        peer_connection_config: {
            iceServers: [
                {
                    url: 'stun:stun.l.google.com:19302',
                },
            ],
        },
        debug: true,
        playMode: true
    });

    useEffect(() => {
        const date = Date.now();
        socketService.emitViewerLive(itemLiveStream.room_is_live, 1);
        socketService.emitSeenMessage(itemLiveStream.room_is_live, date);
        socketService.emitActionEmoji(itemLiveStream.room_is_live, 'changeCameraPlay');
        setTimeout(() => {
            setLoadingLive(true);
        }, 1000);
        setTimeout(() => {
            handlePlay();
        }, 500);
        onhandleStop(adaptor);
    }, []);

      useEffect(() => {
        if (appStateStatus === 'background') {
          if (!adaptor) {
            return;
          }
          adaptor.muteRemoteAudio(itemLiveStream.room_is_live, itemLiveStream.room_live_title);
          if (itemLiveStream.owner_id === user.id) {
            setLoadingLive(true);
          }
          setCheckBackground(true);
        } else {
          if (checkBackground) {
            if (isMuted) {
              adaptor.muteRemoteAudio(itemLiveStream.room_is_live, itemLiveStream.room_live_title);
              setIsMuted(true);
            } else {
              adaptor.unmuteRemoteAudio(itemLiveStream.room_is_live, itemLiveStream.room_live_title)
              setIsMuted(false);
            }
          }
        }
      }, [appStateStatus]);

    useEffect(() => {
        const processAPIListCreate = async () => {
            const { data } = getViewerLive;
            if (data && data.room_id === itemLiveStream.room_is_live) {
                setCountViewer(data.total)
            }

        };
        processAPIListCreate();
    }, [getViewerLive, isPlaying]);

    // useEffect(() => {
    //     if (localMedia) {
    //         setTimeout(() => {
    //            inCallManager.start({ media: 'video' });
    //         }, 1000);
    //         DeviceEventEmitter.addListener("onAudioDeviceChanged", (event) => {
    //             console.log("onAudioDeviceChanged", event.availableAudioDeviceList);
    //         });
    //     }
    // }, [localMedia]);

    useEffect(() => {
        const processActionEmoji = () => {
            const { loading, data, error } = actionEmoji;
            if (!loading) {
                if (data) {
                    if (data.room_id === itemLiveStream.room_is_live) {
                        if (data.emoji === 'changeCameraFront') {
                            setIsCameraOpen(false);
                        } else if (data.emoji === 'changeCameraBack') {
                            setIsCameraOpen(true);
                        } else if (data.emoji === 'changeCameraPlay') {
                            if (isCameraOpen) {
                                socketService.emitActionEmoji(itemLiveStream.room_is_live, 'changeCameraBack');
                            } else {
                                socketService.emitActionEmoji(itemLiveStream.room_is_live, 'changeCameraFront');
                            }
                        }
                    }
                    store.dispatch(resetActionEmoji(null));
                }
            }
        };
        processActionEmoji();
    }, [actionEmoji]);

    const handlePlay = async () => {
        if (!adaptor) {
            return;
        }
        adaptor.getDevices();
        adaptor.play(itemLiveStream.room_is_live, itemLiveStream.livestream_key, itemLiveStream.room_live_title);
    };

    const handleStop = async () => {
        if (!adaptor) {
            return;
        }
        adaptor.stop(itemLiveStream.room_is_live);
        adaptor.closeWebSocket();
        socketService.emitViewerLive(itemLiveStream.room_is_live, 0);
        store.dispatch(resetSocketjoinRoom(null));
        store.dispatch(deleteRoomLive(itemLiveStream));
        onhandleClose(adaptor);
    };

    const handleVoulume = () => {
        if (adaptor) {
            (isMuted) ? adaptor.unmuteRemoteAudio(itemLiveStream.room_is_live, itemLiveStream.room_live_title) : adaptor.muteRemoteAudio(itemLiveStream.room_is_live, itemLiveStream.room_live_title);
            setIsMuted(!isMuted);
        }
    };


    const renderErrorImage = () => {
        return <Image source={images.global.no_avatar} style={screenStyles.box30} resizeMode="contain" />;
    };

    const renderButton = () => {
        return (
            !isPlaying ? (
                <>
                </>
            ) : (
                <>
                    <View style={[styles.iconMicCameraV2, { flexDirection: 'row' }]}>
                        <Pressable onPress={handleStop} >
                            <View style={{ marginLeft: 20, bottom: 2, backgroundColor: '#F04438', width: 52, height: 52, borderRadius: 27, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={"white"} size={22} />
                            </View>
                        </Pressable>
                    </View>

                </>
            )
        )
    }

    const renderViewer = () => {
        return (
            !isPlaying ? (
                <>
                </>
            ) : (
                <>
                <View style={{ position: 'absolute', zIndex: 200, paddingHorizontal: 10, paddingVertical: 8}}>
                <CText numberOfLines={1} h4 w500 color={'white'} style={styles.heading}>
                    {itemLiveStream.room_live_title.replaceAll('DoctorNetwork_Chat_NETDEV ', '')}
                </CText>
                </View>
                    <Row start style={{ position: 'absolute', zIndex: 200, top: 30}}>
                    <View style={{ position: 'absolute', top: 10, backgroundColor: 'transparent', height: 28, justifyContent: 'center', marginLeft: 10, borderRadius: 5, paddingHorizontal: 13, overflow: 'hidden', zIndex: 200 }}>
                        <View style={{
                            position: 'absolute',
                            backgroundColor: "#262626",
                            opacity: 0.5,
                            width: 200,
                            height: 28,
                        }} />
                        <Row>
                            <Image source={images.community.icon_viewlive} style={screenStyles.box14} resizeMode="contain" />
                            <CText h5 color={'white'} w500 style={styles.heading}>
                                {countViewer}
                            </CText>
                        </Row>
                    </View>
                    <View style={{ position: 'absolute', top: 10, backgroundColor: 'transparent', height: 28, justifyContent: 'center', marginLeft: 80, borderRadius: 5, paddingHorizontal: 13, overflow: 'hidden', zIndex: 200 }}>
                        <View style={{
                            position: 'absolute',
                            backgroundColor: "#262626",
                            opacity: 0.5,
                            width: 200,
                            height: 28,
                        }} />
                        <Pressable onPress={() => handleVoulume()} style={[screenStyles.box28, { marginLeft: 5, marginRight: 5 }]}>
                            <Image
                                source={isMuted ? images.community.icon_unvolume : images.community.icon_volume}
                                style={screenStyles.fillParent}
                            />
                        </Pressable>
                    </View>
                </Row>
                </>

            )
        )
    }

    return (
        <>
            <View style={[styles.viewPin, styles.shadow, {height: height > 0 ? ScreenHeight / 2.2 : ScreenHeight / 1.8}]}>
                <Row start>
                    <View style={{ width: '99%' }}>
                        {renderViewer()}
                        {remoteMedia ? <Pressable onPress={() => { Keyboard.dismiss() }}>
                            <View style={{ borderRadius: 10, overflow: 'hidden', width: '98%', marginLeft: 6, height:height > 0 ? ScreenHeight / 2.2 - 10 :  ScreenHeight / 1.8 - 10, }}>
                                {
                                    rtc_view(
                                        remoteMedia,
                                        styles.streamPlayer,
                                        'cover',
                                        0,
                                        isCameraOpen)
                                }
                            </View>
                        </Pressable>
                            : <></>}
                        {renderButton()}
                    </View>
                </Row>
                {!loadingLive &&
                    <View style={{ position: 'absolute', height: '100%', alignContent: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                        <CLoading />
                    </View>
                }
            </View>
            {showAlert ? <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} /> : null}

        </>
    )
}

export default PlayLiveStream;
const useStyles = makeStyles(({ colors }) => ({
    viewPin: { position: 'absolute', zIndex: 200,  justifyContent: 'center', borderRadius: 10, borderColor: colors.black, marginLeft: 5 },
    showListPin: { borderWidth: 1, borderColor: colors.primary, paddingVertical: 6 },
    shadow: {
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#C4C4C4',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.5,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    streamPlayer: {
        width: '100%',
        height: '100%',
    },
    iconMicCamera: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 90,
        marginBottom: 10,
        width: '90%',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: "5%",
        zIndex: 100,
    },
    iconMicCameraV2: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: 10,
        width: '90%',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: "5%",
        zIndex: 100,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#0080F6',
        position: 'absolute',
        bottom: 20,
        marginBottom: 10,
        width: '90%',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: "5%",
        zIndex: 100,
    },
    heading: {
        alignSelf: 'center',
        marginLeft: 5,
    },
}));