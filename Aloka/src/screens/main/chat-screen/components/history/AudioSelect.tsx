import { images, screenStyles, ScreenWidth } from '@/configs';
import { isPlayVoice } from '@/redux/slices/socketioSlice';
import { store } from '@/redux/store';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import audioRecorderPlayer from 'react-native-nitro-sound';
import { MessageModal } from '../../modal/MessageModal';

const AudioSelect = (props: any) => {
  const {
    list = {},
    itemRoomId,
    checkUser,
    idMessage,
    onDeleteMessage,
    onRecallMessage,
    handleShowModalText,
    titleName,
    userId,
    checkDeleteMess,
    isPin,
  } = props;
  const [ischeckPlay, setIscheckPlay] = useState<boolean>(false);
  const [ischeckReseum, setIscheckReseum] = useState<boolean>(true);
  const [ischeckPlayStart, setIscheckPlayStart] = useState<boolean>(false);

  const [recording, setRecording] = useState<any>({});

  const [timeVoiceDown, settimeVoiceDown] = useState<any>('00:00');

  const [timeVoicePresent, setTimeVoicePresent] = useState<any>('');
  const [showMessModal, setShowMessModal] = useState<boolean>(false);
  const { isPlayVoiceCheck } = useAppSelector(state => state.socketioReducer);
  const { appBgChat } = useAppSelector(state => state.communityReducer);

  useEffect(() => {
    if (list?.includes('{"filename"')) {
      if (recording.duration !== undefined) {
        const timeA = parseTimeString(recording.duration);
        const timeB = parseTimeString(recording.playTime);
        const totalSecondsA = timeToSeconds(
          timeA.hours,
          timeA.minutes,
          timeA.seconds,
        );
        const totalSecondsB = timeToSeconds(
          timeB.hours,
          timeB.minutes,
          timeB.seconds,
        );

        let diffSeconds = totalSecondsA - totalSecondsB;

        diffSeconds = Math.abs(diffSeconds);

        const diffTime = secondsToTime(diffSeconds);

        const result = formatTimeString(diffTime.hours, diffTime.minutes);
        if (result === '00:00') {
          setIscheckPlayStart(false);
        }
        settimeVoiceDown(result);
      } else {
        const timeA = parseTimeString(JSON.parse(list).time);
        setTimeVoicePresent(formatTimeString(timeA.hours, timeA.minutes));
      }
    }
  }, [recording]);

  useEffect(() => {
    if (list?.includes('{"filename"')) {
      if (recording.duration !== undefined) {
        const timeA = parseTimeString(recording.duration);
        const timeB = parseTimeString(recording.playTime);
        const totalSecondsA = timeToSeconds(
          timeA.hours,
          timeA.minutes,
          timeA.seconds,
        );
        const totalSecondsB = timeToSeconds(
          timeB.hours,
          timeB.minutes,
          timeB.seconds,
        );

        let diffSeconds = totalSecondsA - totalSecondsB;

        diffSeconds = Math.abs(diffSeconds);

        const diffTime = secondsToTime(diffSeconds);

        const result = formatTimeString(diffTime.hours, diffTime.minutes);
        if (result === '00:00') {
          setIscheckPlayStart(false);
        }
        settimeVoiceDown(result);
      } else {
        const timeA = parseTimeString(JSON.parse(list).time);
        setTimeVoicePresent(formatTimeString(timeA.hours, timeA.minutes));
      }
    }
  }, [recording]);

  const showModalMess = () => {
    setShowMessModal(true);
  };

  const handleDeleteMess = () => {
    onDeleteMessage(itemRoomId, idMessage);
  };

  const handleRecallMess = () => {
    onRecallMessage(itemRoomId, idMessage);
  };

  const parseTimeString = (timeString: any) => {
    // if(timeString !== undefined){
    const parts = timeString?.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return { hours, minutes, seconds };
    // }
  };

  const timeToSeconds = (hours: any, minutes: any, seconds: any) => {
    return hours * 3600 + minutes * 60 + seconds;
  };

  const secondsToTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return { hours, minutes, seconds };
  };

  const formatTimeString = (hours: any, minutes: any) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}`;
    // return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleIsPlayVoiceCheck = () => {
    store.dispatch(isPlayVoice(true));
  };

  const onStartPlay = useCallback(async () => {
    // handleVoice();
    if (!isPlayVoiceCheck) {
      store.dispatch(isPlayVoice(true));
      if (!ischeckPlay && ischeckReseum) {
        const msg = await audioRecorderPlayer.startPlayer(
          JSON.parse(list).data,
        );
        audioRecorderPlayer.addPlayBackListener(e => {
          setRecording({
            currentPositionSec: e.currentPosition,
            currentDurationSec: e.duration,
            playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
            duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
          });
          // Kiểm tra khi phát xong
          if (Math.floor(e.currentPosition) >= Math.floor(e.duration)) {
            console.log('1213123131231321321');
            store.dispatch(isPlayVoice(false));
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
          }
          return;
        });
        setIscheckPlay(true);
        setIscheckPlayStart(true);
      } else {
        resumeRecorder();
      }
    }
  }, [isPlayVoiceCheck, ischeckPlay, ischeckPlayStart]);

  const resumeRecorder = useCallback(async () => {
    const msg = await audioRecorderPlayer.resumePlayer();
    setIscheckPlayStart(true);
    store.dispatch(isPlayVoice(false));
    if (msg === 'No audio playing') {
      onStartPlay();
    }
  }, []);

  const onPausePlay = useCallback(async () => {
    const msg = await audioRecorderPlayer.pausePlayer();
    setIscheckPlay(true);
    setIscheckReseum(false);
    setIscheckPlayStart(false);
    store.dispatch(isPlayVoice(false));
  }, []);

  const handleFileColorType = (color: any) => {
    switch (color) {
      case 1:
        return '#757575';
      case 2:
        return '#FFFFFF';
      case 3:
        return '#FFFFFF';
      default:
        return '#757575';
    }
  };

  return (
    <Pressable
      style={{ width: ScreenWidth / 3 + 5 }}
      onLongPress={() =>
        handleShowModalText(
          idMessage,
          JSON.parse(list),
          titleName,
          userId,
          checkDeleteMess,
          isPin,
          'voice',
        )
      }
    >
      <Row
        style={{
          backgroundColor: checkUser
            ? appBgChat.bgRightColor
            : appBgChat.bgLeftColor,
          height: 50,
          borderRadius: 10,
          paddingHorizontal: 13,
        }}
      >
        {/* {timeVoiceDown === '00:00' ? ():null} */}
        <View style={{ left: 0 }}>
          {!ischeckPlayStart ? (
            <Pressable
              onPress={() => {
                onStartPlay();
                handleIsPlayVoiceCheck();
              }}
            >
              <Image
                source={images.community.icon_carbon_play_filled}
                style={screenStyles.box24}
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                onPausePlay();
              }}
            >
              <Image
                source={images.community.icon_carbon_stop_filled}
                style={screenStyles.box24}
              />
            </Pressable>
          )}
        </View>
        <View style={{ paddingHorizontal: 13 }}>
          {!ischeckPlayStart ? (
            <Image
              source={images.community.icon_waveform}
              style={screenStyles.box24}
            />
          ) : (
            <LottieView
              style={{
                width: 25,
                height: 40,
              }}
              source={require('../../../../../utils/lottie-json/voice.json')}
              autoPlay
              loop
            />
          )}
        </View>
        <View style={{ right: 0 }}>
          {ischeckPlayStart ? (
            <CText h46 color={handleFileColorType(appBgChat.id)}>
              {timeVoiceDown === '00:00' ? timeVoicePresent : timeVoiceDown}
            </CText>
          ) : (
            <CText h46 color={handleFileColorType(appBgChat.id)}>
              {timeVoicePresent}
            </CText>
          )}
        </View>
      </Row>
      {showMessModal && (
        <MessageModal
          isVisible={showMessModal}
          hideModal={() => setShowMessModal(false)}
          handleDeleteMess={handleDeleteMess}
          handleRecallMess={handleRecallMess}
          checkUser={checkUser}
        />
      )}
    </Pressable>
  );
};

export default AudioSelect;
