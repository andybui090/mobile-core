// import { ScreenWidth, alertForMicrophonePermission, checkPermissionMicrophone, getBottomSpace, ifIphoneX, images, screenStyles } from '@/configs';
// import { CText, Row } from '@/utils';
// import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
// import { makeStyles, useTheme } from '@rneui/themed';
// import { Waveform, type IWaveformRef } from '@simform_solutions/react-native-audio-waveform';
// import moment from 'moment';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Alert, Image, PermissionsAndroid, Platform, Pressable, View } from 'react-native';
// import AudioRecorderPlayer, {
//     AVEncoderAudioQualityIOSType, AVEncodingOption,
//     AVModeIOSOption, AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType,
//     OutputFormatAndroidType
// } from 'react-native-audio-recorder-player';
// import RNFS from 'react-native-fs';
// import { openSettings } from 'react-native-permissions';
// // import ReactNativeBlobUtil from 'rn-fetch-blob';
// import Pulse from '../chat/components/local/Pulse';


// const useStyles = makeStyles(({ colors }) => ({
//     line: {
//         borderBottomWidth: 1,
//         borderBottomColor: colors.cEAECF0,
//     },
//     pulseWrapper: {
//         width: 40,
//         height: 40,
//         // top: 17,
//         // left: 23,
//         position: 'absolute',
//         zIndex: -1,
//     },
// }));

// export const BottomSheetVoice = ({ bottomSheetRef, hideModal, handleVoiceSendMess }: any) => {

//     const ref = useRef<IWaveformRef>(null);
//     const { t } = useTranslation();

//     // const DELAY_TIME = 0

//     const [snapPoints, setSnapPoints] = useState([175, 175]);
//     const [recording, setRecording] = useState<any>({
//         recordSecs: "00:00:00", recordTime: "00:00:00"
//     });
//     const [isPulse, setIsPulse] = useState<boolean>(false);
//     const [isCheckIcon, setisCheckIcon] = useState<boolean>(false);
//     const [isStop, setIsStop] = useState<boolean>(false);
//     const [uriVoice, setUriVoice] = useState<any>('');
//     const [isCheckIconVoice, setIsCheckIconVoice] = useState<boolean>(false);

//     const [ischeckPlay, setIscheckPlay] = useState<any>('');

//     // const [timerCount, setTimer] = useState(DELAY_TIME); //3ph

//     const {
//         theme: { colors },
//     } = useTheme();

//     const styles = useStyles();

//     const audioRecorderPlayer = new AudioRecorderPlayer();

//     useEffect(() => {
//         const checkPermission = async () => {
//             const resultCheckMicrophone = await checkPermissionMicrophone();
//             if (resultCheckMicrophone === 'blocked') {
//                 alertForMicrophonePermission();
//             }
//         }
//         checkPermission();
//     }, [isPulse]);

//     const convertTime = (time: any) => {
//         const parts = time.split(":");
//         const result = parts[0] + ":" + parts[1];
//         console.log(result);
//         return result;
//     }

//     const showModalPermission = () => {
//         Alert.alert(
//             `"Doctor Network" Would Like to Access Your Micro`,
//             'The app uses speech recognition to listen for and understand your voice responses to notifications and prompts.',
//             [
//                 {
//                     text: t('communityChat.listPin.reject'),
//                     onPress: () => { },
//                     style: 'default',
//                 },
//                 {
//                     text: t('communityChat.contact.appect'),
//                     onPress: () => {
//                         hideModal();
//                         openSettings();
//                     },
//                     style: 'destructive',
//                 },
//             ],
//         );
//     }

//     const loopRecord = useCallback(async () => {
//         try {
//             try {
//                 await audioRecorderPlayer.stopRecorder();
//                 audioRecorderPlayer.removeRecordBackListener();
//             } catch (_) { }

//             const folder = RNFS.CachesDirectoryPath;
//             const files = await RNFS.readDir(folder);
//             for (const file of files) {
//                 if (file.name.endsWith('.m4a')) {
//                     try {
//                         await RNFS.unlink(file.path);
//                     } catch (e) {
//                         console.warn('Failed to delete file:', file.path, e);
//                     }
//                 }
//             }

//             // Đường dẫn chuẩn
//             const fileName = `${Date.now()}.m4a`;
//             const path = Platform.select({
//                 ios: `file://${folder}/${fileName}`, // ✅ fix `file://`
//             });

//             console.log("🚀 File path:", path);
//             const audioSet: AudioSet = {
//                 AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
//                 AudioSourceAndroid: AudioSourceAndroidType.MIC,
//                 AVModeIOS: AVModeIOSOption.measurement,
//                 AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
//                 AVNumberOfChannelsKeyIOS: 2,
//                 AVFormatIDKeyIOS: AVEncodingOption.aac,
//                 OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
//             };

//             const result = await audioRecorderPlayer.startRecorder(path, audioSet, false);
//             console.log("🚀 ~ onStartRecord ~ result:", result)
//             audioRecorderPlayer.addRecordBackListener((e) => {
//                 setRecording(
//                     {
//                         recordSecs: e.currentPosition,
//                         recordTime: audioRecorderPlayer.mmssss(
//                             Math.floor(e.currentPosition),
//                         ),

//                     }
//                 )
//                 setIsPulse(true);
//                 setisCheckIcon(true);
//                 setIsCheckIconVoice(true);
//                 setUriVoice(result)
//                 return;
//             });
//         } catch (e) {
//             console.log("🚀 ~ onStartRecord ~ e:", JSON.stringify(e, null, 2));
//         }
//     }, []);


//     const onStartRecord = useCallback(async () => {
//         if (Platform.OS === 'android') {
//             try {
//                 const grants = await PermissionsAndroid.requestMultiple([
//                     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//                     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//                     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//                 ]);
//                 if (
//                     grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
//                     PermissionsAndroid.RESULTS.GRANTED &&
//                     grants['android.permission.READ_EXTERNAL_STORAGE'] ===
//                     PermissionsAndroid.RESULTS.GRANTED &&
//                     grants['android.permission.RECORD_AUDIO'] ===
//                     PermissionsAndroid.RESULTS.GRANTED
//                 ) {
//                     console.log('Permissions granted');
//                 } else {
//                     if (
//                         grants['android.permission.RECORD_AUDIO'] !==
//                         PermissionsAndroid.RESULTS.GRANTED
//                     ) {
//                         hideModal();
//                         showModalPermission();
//                         return;
//                     }
//                 }
//                 const audioSet: AudioSet = {
//                     AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
//                     AudioSourceAndroid: AudioSourceAndroidType.MIC,
//                     AVModeIOS: AVModeIOSOption.measurement,
//                     AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
//                     AVNumberOfChannelsKeyIOS: 2,
//                     AVFormatIDKeyIOS: AVEncodingOption.aac,
//                     OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,   // <-- this line
//                 };
//                 const path = `${RNFS.DocumentDirectoryPath}/${moment().unix()}.mp3`;
//                 // const path = Platform.select({
//                 //     // ios: moment().unix() + '.m4a',
//                 //     android:  moment().unix() + '.mp3',
//                 // });
//                 const result = await audioRecorderPlayer.startRecorder(path, audioSet, false);
//                 audioRecorderPlayer.addRecordBackListener((e) => {
//                     setRecording(
//                         {
//                             recordSecs: e.currentPosition,
//                             recordTime: audioRecorderPlayer.mmssss(
//                                 Math.floor(e.currentPosition),
//                             ),
//                         }
//                     )
//                     setIsPulse(true);
//                     setisCheckIcon(true);
//                     setIsCheckIconVoice(true);
//                     setUriVoice(result)
//                     return;
//                 });
//             } catch (err) {
//                 console.log(err);
//                 return;
//             }

//         } else {
//             loopRecord();
//         }
//     }, []);


//     const onStopRecord = useCallback(async () => {
//         try {
//             const result = await audioRecorderPlayer.stopRecorder();
//             audioRecorderPlayer.removeRecordBackListener();
//             // const msg = await audioRecorderPlayer.startPlayer();
//             // setRecording({
//             //     recordSecs: 0,
//             //     recordTime: 0
//             // })
//             setIsPulse(false);
//             setIsStop(true);
//             setisCheckIcon(true);
//             // setUriVoice(msg);
//             return result;
//         } catch (error) {
//             console.error("Error stopping the recording:", error);
//         }
//     }, []);

//     const handleSend = useCallback(async (uri: any, time: any) => {
//         try {
//             const result = await audioRecorderPlayer.stopRecorder();
//             audioRecorderPlayer.removeRecordBackListener();
//             // const msg = await audioRecorderPlayer.startPlayer();
//             setIsPulse(false);
//             setIsCheckIconVoice(false);
//             setIsStop(false);
//             setIsPulse(false);
//             setisCheckIcon(false);
//             handleVoiceSendMess(uri, time);
//             bottomSheetRef.current?.close();
//             return result;
//         } catch (error) {
//             console.error("Error stopping the recording:", error);
//         }
//     }, []);

//     const onStartPlay = useCallback(async () => {
//         console.log('onStartPlay');
//         const msg = await audioRecorderPlayer.startPlayer();
//         console.log(msg);
//         audioRecorderPlayer.addPlayBackListener((e) => {
//             setRecording({
//                 currentPositionSec: e.currentPosition,
//                 currentDurationSec: e.duration,
//                 playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
//                 duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
//             })
//             return;
//         });
//         setUriVoice(msg);
//         onStopRecord();
//     }, []);

//     const deleteRecoder = useCallback(async () => {
//         console.log('delete');
//         const result = await audioRecorderPlayer.stopRecorder();
//         audioRecorderPlayer.removeRecordBackListener();
//         // setRecording({
//         //     recordSecs: 0,
//         //     recordTime: 0
//         // })
//         setIsPulse(false);
//         setIsStop(true);
//         setIsCheckIconVoice(false);
//         // setUriVoice('');
//         setIsStop(false);
//         setIsPulse(false);
//         setisCheckIcon(false);
//         bottomSheetRef.current?.close();
//         return result;
//     }, []);

//     const hanldeRecordVoice = useCallback(async (item: any) => {
//         setIscheckPlay(item)
//     }, []);

//     return (
//         <BottomSheetModal
//             onDismiss={() => { bottomSheetRef.current?.close(); deleteRecoder() }}
//             ref={bottomSheetRef}
//             index={0}
//             snapPoints={snapPoints}
//             //   onChange={onActionChange}
//             enablePanDownToClose
//             handleIndicatorStyle={{
//                 backgroundColor: colors.white,
//             }}
//             backdropComponent={props => (
//                 <BottomSheetBackdrop {...props} onPress={() => { bottomSheetRef.current?.close(); deleteRecoder() }} appearsOnIndex={1} />
//             )}
//         // backdropComponent={hideModal}
//         >
//             <BottomSheetView
//                 style={{
//                     paddingHorizontal: 20,
//                     paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
//                 }}>

//                 <View style={{ alignItems: 'center' }}>
//                     {!isStop ? (
//                         <CText center numberOfLines={4} h4 color={colors.c98A2B3}>{!isPulse ? `${t('communityChat.voice.buttonRecording')}` : `${t('communityChat.voice.textRecording')}...`}</CText>
//                     ) :
//                         <Pressable onPress={() => { ref.current?.startPlayer() }}>
//                             <Row style={{ backgroundColor: '#EFF8FF', borderRadius: 30, paddingHorizontal: 13 }}>
//                                 <View style={{ left: 5 }}>
//                                     {ischeckPlay === 'stopped' ? (
//                                         <Image source={images.community.icon_carbon_play_filled} style={screenStyles.box24} />
//                                     ) :
//                                         <Image source={images.community.icon_carbon_stop_filled} style={screenStyles.box24} />
//                                     }
//                                 </View>
//                                 <Waveform
//                                     containerStyle={{ width: ScreenWidth / 2.5, height: 45, paddingHorizontal: 20 }}
//                                     mode="static"
//                                     key={uriVoice}
//                                     ref={ref}
//                                     path={uriVoice}
//                                     candleSpace={2}
//                                     candleWidth={4}
//                                     scrubColor={colors.primary}
//                                     waveColor={"#757575"}
//                                     onPlayerStateChange={playerState => hanldeRecordVoice(playerState)}
//                                     onPanStateChange={isMoving => console.log(isMoving)}
//                                     onError={error => {
//                                         console.log(error, 'we are in example');
//                                     }}
//                                 />
//                                 <View style={{ right: 10 }}>
//                                     <CText color={'#757575'}>{convertTime(recording.recordTime ?? "")}</CText>
//                                 </View>
//                             </Row>
//                         </Pressable>
//                     }

//                     <View style={{ width: ScreenWidth / 1.5 }}>
//                         <Row between style={{ justifyContent: isCheckIconVoice ? 'space-between' : 'center', paddingVertical: !isStop ? 35 : 13 }}>
//                             {isCheckIcon ? (
//                                 <Pressable onPress={() => deleteRecoder()}>
//                                     <View style={{ width: ScreenWidth / 1.5 / 3, alignItems: 'center' }}>
//                                         <Image source={images.community.icon_remove} style={screenStyles.box40} resizeMode="contain" />
//                                         <CText h5 color={colors.c101828} center style={screenStyles.mT5}>{t('communityChat.voice.buttonDelete')}</CText>
//                                     </View>
//                                 </Pressable>
//                             ) : null}
//                             {isCheckIconVoice ? (
//                                 <Pressable onPress={() => { handleSend(uriVoice, recording.recordTime) }}>
//                                     <View style={{ width: ScreenWidth / 1.5 / 3, alignItems: 'center' }}>
//                                         <View style={styles.pulseWrapper}>
//                                             {isPulse ? (
//                                                 <Pulse
//                                                     color={colors.primary}
//                                                     numPulses={3}
//                                                     diameter={80}
//                                                     speed={30}
//                                                     duration={2000}
//                                                 />
//                                             ) : null}
//                                         </View>
//                                         <Image source={images.community.icon_send} style={screenStyles.box40} resizeMode="contain" />
//                                         <CText h5 color={colors.c101828} style={screenStyles.mT5}>{t('communityChat.voice.buttonSend')}</CText>
//                                     </View>
//                                 </Pressable>
//                             ) :
//                                 <Pressable style={{ paddingHorizontal: 33 }} onPress={() => { onStartRecord() }}>
//                                     <Image source={images.community.icon_voiceText} style={screenStyles.box40} resizeMode="contain" />
//                                 </Pressable>
//                             }

//                             {isCheckIcon ? (
//                                 <Pressable onPress={() => onStopRecord()}>
//                                     <View style={{ width: ScreenWidth / 1.5 / 3, alignItems: 'center' }}>
//                                         <Image source={images.community.icon_listen} style={screenStyles.box40} resizeMode="contain" />
//                                         <CText h5 color={colors.c101828} center style={screenStyles.mT5}>{t('communityChat.voice.buttonListenagain')}</CText>
//                                     </View>
//                                 </Pressable>
//                             ) : null}
//                         </Row>
//                     </View>
//                 </View>
//             </BottomSheetView>
//         </BottomSheetModal>
//     );
// };




