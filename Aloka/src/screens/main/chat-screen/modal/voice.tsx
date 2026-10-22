import {
  ScreenWidth,
  alertForMicrophonePermission,
  checkPermissionMicrophone,
  getBottomSpace,
  ifIphoneX,
  images,
  screenStyles,
} from '@/configs';
import { CText, Row } from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { makeStyles, useTheme } from '@rneui/themed';
import {
  Waveform,
  type IWaveformRef,
} from '@simform_solutions/react-native-audio-waveform';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  View,
} from 'react-native';
import audioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AudioEncoderAndroidType,
  type AudioSet,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-nitro-sound';
import { CachesDirectoryPath, unlink } from '@dr.pogodin/react-native-fs';
import { openSettings } from 'react-native-permissions';
import Pulse from '../components/local/Pulse';

const useStyles = makeStyles(({ colors }) => ({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0,
  },
  pulseWrapper: {
    width: 40,
    height: 40,
    position: 'absolute' as const,
    zIndex: -1,
  },
}));

export const BottomSheetVoice = ({
  bottomSheetRef,
  hideModal,
  handleVoiceSendMess,
}: any) => {
  const ref = useRef<IWaveformRef>(null);
  const busyRef = useRef(false);
  const recorderActiveRef = useRef(false);
  const closingRef = useRef(false);
  const sentRef = useRef(false);
  const filePathRef = useRef('');
  const startPromiseRef = useRef<Promise<void> | null>(null);
  const cleanupPromiseRef = useRef<Promise<void> | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const { t } = useTranslation();

  const [snapPoints] = useState([175, 175]);
  const [recording, setRecording] = useState<any>({
    recordSecs: '00:00:00',
    recordTime: '00:00:00',
  });
  const [isPulse, setIsPulse] = useState<boolean>(false);
  const [isCheckIcon, setisCheckIcon] = useState<boolean>(false);
  const [isStop, setIsStop] = useState<boolean>(false);
  const [uriVoice, setUriVoice] = useState<any>('');
  const [isCheckIconVoice, setIsCheckIconVoice] = useState<boolean>(false);

  const [ischeckPlay, setIscheckPlay] = useState<any>('');

  const {
    theme: { colors },
  } = useTheme();

  const styles = useStyles();

  useEffect(() => {
    const checkPermission = async () => {
      const resultCheckMicrophone = await checkPermissionMicrophone();
      if (resultCheckMicrophone === 'blocked') {
        alertForMicrophonePermission();
      }
    };
    checkPermission();
  }, [isPulse]);

  const convertTime = (time: any) => {
    const parts = time.split(':');
    const result = parts[0] + ':' + parts[1];
    return result;
  };

  const showModalPermission = useCallback(() => {
    Alert.alert(
      'Microphone Access Required',
      'To record and send voice messages, allow Aloka to access your microphone in Settings.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            hideModal();
            openSettings();
          },
          style: 'default',
        },
      ],
    );
  }, [hideModal]);

  const stopPlayback = useCallback(async () => {
    await Promise.allSettled([
      audioRecorderPlayer.stopPlayer(),
      ref.current?.stopPlayer(),
    ]);
    audioRecorderPlayer.removePlayBackListener();
    audioRecorderPlayer.removePlaybackEndListener();
  }, []);

  const stopRecording = useCallback(async () => {
    if (recorderActiveRef.current) {
      await audioRecorderPlayer.stopRecorder();
      recorderActiveRef.current = false;
    }
    audioRecorderPlayer.removeRecordBackListener();
  }, []);

  const onStartRecord = useCallback(() => {
    if (
      busyRef.current ||
      recorderActiveRef.current ||
      cleanupPromiseRef.current
    ) {
      return;
    }
    busyRef.current = true;
    closingRef.current = false;
    sentRef.current = false;
    setIsBusy(true);

    const start = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            hideModal();
            showModalPermission();
            return;
          }
        }
        if (closingRef.current) {
          return;
        }

        // Keep AAC audio in an MPEG-4 container on both platforms.
        const path = `${CachesDirectoryPath}/voice-${Date.now()}.m4a`;
        const audioSet: AudioSet = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVModeIOS: 'measurement',
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: 'aac',
          OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
        };
        filePathRef.current = path;
        const result = await audioRecorderPlayer.startRecorder(
          path,
          audioSet,
          false,
        );
        recorderActiveRef.current = true;
        if (closingRef.current) {
          return;
        }

        setUriVoice(result);
        setRecording({ recordSecs: 0, recordTime: '00:00:00' });
        setIsStop(false);
        setIsPulse(true);
        setisCheckIcon(true);
        setIsCheckIconVoice(true);
        audioRecorderPlayer.addRecordBackListener(e => {
          if (!closingRef.current) {
            setRecording({
              recordSecs: e.currentPosition,
              recordTime: audioRecorderPlayer.mmssss(
                Math.floor(e.currentPosition),
              ),
            });
          }
        });
      } catch (error) {
        console.error('Error starting the recording:', error);
      } finally {
        busyRef.current = false;
        setIsBusy(false);
        startPromiseRef.current = null;
      }
    };
    startPromiseRef.current = start();
  }, [hideModal, showModalPermission]);

  const onStopRecord = useCallback(async () => {
    if (busyRef.current || !recorderActiveRef.current) {
      return;
    }
    busyRef.current = true;
    setIsBusy(true);
    try {
      await stopRecording();
      setIsPulse(false);
      setIsStop(true);
    } catch (error) {
      console.error('Error stopping the recording:', error);
    } finally {
      busyRef.current = false;
      setIsBusy(false);
    }
  }, [stopRecording]);

  // Dismissal cleans up once; it never closes the sheet again.
  const cleanupRecording = useCallback(() => {
    if (cleanupPromiseRef.current) {
      return cleanupPromiseRef.current;
    }
    closingRef.current = true;
    const cleanup = async () => {
      try {
        await startPromiseRef.current;
        await stopPlayback();
        await stopRecording();
        if (!sentRef.current && filePathRef.current) {
          await unlink(filePathRef.current);
        }
      } catch (error) {
        console.error('Error cleaning up the recording:', error);
      } finally {
        filePathRef.current = '';
        setUriVoice('');
        setRecording({ recordSecs: 0, recordTime: '00:00:00' });
        setIsPulse(false);
        setIsStop(false);
        setisCheckIcon(false);
        setIsCheckIconVoice(false);
        setIscheckPlay('stopped');
        cleanupPromiseRef.current = null;
      }
    };
    cleanupPromiseRef.current = cleanup();
    return cleanupPromiseRef.current;
  }, [stopPlayback, stopRecording]);

  const handleSend = useCallback(
    async (uri: string, time: string) => {
      if (busyRef.current || closingRef.current || !uri || sentRef.current) {
        return;
      }
      busyRef.current = true;
      setIsBusy(true);
      try {
        await stopPlayback();
        await stopRecording();
        setIsPulse(false);
        setIsStop(true);
        // The upload may still need this file after the sheet closes.
        sentRef.current = true;
        await handleVoiceSendMess(uri, time);
        bottomSheetRef.current?.close();
      } catch (error) {
        sentRef.current = false;
        console.error('Error sending the recording:', error);
      } finally {
        busyRef.current = false;
        setIsBusy(false);
      }
    },
    [bottomSheetRef, handleVoiceSendMess, stopPlayback, stopRecording],
  );

  const deleteRecoder = useCallback(async () => {
    if (busyRef.current || closingRef.current) {
      return;
    }
    await cleanupRecording();
    bottomSheetRef.current?.close();
  }, [bottomSheetRef, cleanupRecording]);

  const togglePlayback = useCallback(async () => {
    if (busyRef.current || closingRef.current) {
      return;
    }
    busyRef.current = true;
    setIsBusy(true);
    try {
      if (ischeckPlay === 'playing') {
        await ref.current?.stopPlayer();
      } else {
        await ref.current?.startPlayer();
      }
    } catch (error) {
      console.error('Error playing the recording:', error);
    } finally {
      busyRef.current = false;
      setIsBusy(false);
    }
  }, [ischeckPlay]);

  const hanldeRecordVoice = useCallback(async (item: any) => {
    setIscheckPlay(item);
  }, []);

  return (
    <BottomSheetModal
      onDismiss={() => {
        if (filePathRef.current || startPromiseRef.current) {
          cleanupRecording();
        }
      }}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={!isBusy}
      handleIndicatorStyle={{
        backgroundColor: colors.white,
      }}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior={isBusy ? 'none' : 'close'}
          appearsOnIndex={1}
        />
      )}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: 20,
          paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
        }}
      >
        <View style={{ alignItems: 'center' }}>
          {!isStop ? (
            <CText center numberOfLines={4} h4 color={colors.c98A2B3}>
              {!isPulse
                ? `${t('communityChat.voice.buttonRecording')}`
                : `${t('communityChat.voice.textRecording')}...`}
            </CText>
          ) : (
            <Pressable disabled={isBusy} onPress={togglePlayback}>
              <Row
                style={{
                  backgroundColor: '#EFF8FF',
                  borderRadius: 30,
                  paddingHorizontal: 13,
                }}
              >
                <View style={{ left: 5 }}>
                  {ischeckPlay !== 'playing' ? (
                    <Image
                      source={images.community.icon_carbon_play_filled}
                      style={screenStyles.box24}
                    />
                  ) : (
                    <Image
                      source={images.community.icon_carbon_stop_filled}
                      style={screenStyles.box24}
                    />
                  )}
                </View>
                <Waveform
                  containerStyle={{
                    width: ScreenWidth / 2.5,
                    height: 45,
                    paddingHorizontal: 20,
                  }}
                  mode="static"
                  key={uriVoice}
                  ref={ref}
                  path={uriVoice}
                  candleSpace={2}
                  candleWidth={4}
                  scrubColor={colors.primary}
                  waveColor={'#757575'}
                  onPlayerStateChange={playerState =>
                    hanldeRecordVoice(playerState)
                  }
                  onPanStateChange={isMoving => console.log(isMoving)}
                  onError={error => {
                    console.log(error, 'we are in example');
                  }}
                />
                <View style={{ right: 10 }}>
                  <CText color={'#757575'}>
                    {convertTime(recording.recordTime ?? '')}
                  </CText>
                </View>
              </Row>
            </Pressable>
          )}

          <View style={{ width: ScreenWidth / 1.5 }}>
            <Row
              between
              style={{
                justifyContent: isCheckIconVoice ? 'space-between' : 'center',
                paddingVertical: !isStop ? 35 : 13,
              }}
            >
              {isCheckIcon ? (
                <Pressable disabled={isBusy} onPress={deleteRecoder}>
                  <View
                    style={{
                      width: ScreenWidth / 1.5 / 3,
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={images.community.icon_remove}
                      style={screenStyles.box40}
                      resizeMode="contain"
                    />
                    <CText
                      h5
                      color={colors.c101828}
                      center
                      style={screenStyles.mT5}
                    >
                      {t('communityChat.voice.buttonDelete')}
                    </CText>
                  </View>
                </Pressable>
              ) : null}
              {isCheckIconVoice ? (
                <Pressable
                  disabled={isBusy}
                  onPress={() => {
                    handleSend(uriVoice, recording.recordTime);
                  }}
                >
                  <View
                    style={{
                      width: ScreenWidth / 1.5 / 3,
                      alignItems: 'center',
                    }}
                  >
                    <View style={styles.pulseWrapper}>
                      {isPulse ? (
                        <Pulse
                          color={colors.primary}
                          numPulses={3}
                          diameter={80}
                          speed={30}
                          duration={2000}
                        />
                      ) : null}
                    </View>
                    <Image
                      source={images.community.icon_send}
                      style={screenStyles.box40}
                      resizeMode="contain"
                    />
                    <CText h5 color={colors.c101828} style={screenStyles.mT5}>
                      {t('communityChat.voice.buttonSend')}
                    </CText>
                  </View>
                </Pressable>
              ) : (
                <Pressable
                  disabled={isBusy}
                  style={{ paddingHorizontal: 33 }}
                  onPress={() => {
                    onStartRecord();
                  }}
                >
                  <Image
                    source={images.community.icon_voiceText}
                    style={screenStyles.box40}
                    resizeMode="contain"
                  />
                </Pressable>
              )}

              {isCheckIcon ? (
                <Pressable disabled={isBusy || isStop} onPress={onStopRecord}>
                  <View
                    style={{
                      width: ScreenWidth / 1.5 / 3,
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={images.community.icon_listen}
                      style={screenStyles.box40}
                      resizeMode="contain"
                    />
                    <CText
                      h5
                      color={colors.c101828}
                      center
                      style={screenStyles.mT5}
                    >
                      {t('communityChat.voice.buttonListenagain')}
                    </CText>
                  </View>
                </Pressable>
              ) : null}
            </Row>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
