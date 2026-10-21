import {APILoading, ICON_TYPE, IconX, ImageHelper, Toast} from '@/components';
import {
  getURLExtension,
  keyExtractor,
  screenStyles,
  ScreenWidth,
  showToast,
} from '@/configs';
import {CHAT_THEME} from '@/constants';
import {photoChangBackgroundLauncher} from '@/permissions';
import {showPhotoLibraryChangBackground} from '@/permissions/picker';
import {
  getCreateBackground,
  getListBackground,
  setAppChatBg,
} from '@/redux/slices/communitySlice';
import {useAppDispatch, useAppSelector} from '@/redux/store/customReduxHook';
import socketService from '@/socketio';
import {CButton, CText, Row} from '@/utils';
import {Divider} from '@rneui/base';
import {useTheme} from '@rneui/themed';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Platform, Pressable, View} from 'react-native';
import Modal from 'react-native-modal';

const ModalChangeBackground = ({isVisible, hideModal, item}: any) => {
  const {
    theme: {colors},
  } = useTheme();
  const {t} = useTranslation();
  const toastEl = useRef<any>(null);
  const dispatch = useAppDispatch();
  const [showAlertAi, setShowAlertAi] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const {appBgChat, listBackground, createBackground} = useAppSelector(
    state => state.communityReducer,
  );

  const [bgLocal, setBgLocal] = useState(appBgChat);

  const [bgData, setBgData] = useState([CHAT_THEME['white']]);

  const [listMediaChoose, setListMediaChoose] = useState<Array<any>>([]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const {loading, data, error} = createBackground;
      let arr = [...bgData];
      if (!loading) {
        if (data && listMediaChoose.length > 0) {
          dispatch(getListBackground({room_id: item.id}));
        } else if (error && listMediaChoose.length > 0) {
          setShowAlertAi(false);
          setIsLoadingAPI(false);
          showToast(toastEl, error?.errors[0]?.msg, 2000);
        }
      }
    };
    processAPIListRoom();
  }, [createBackground]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const {loading, data, error} = listBackground;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          let arr = [...bgData];
          let obj: any = {};
          for (let i = 0; i < newItems.length; i++) {
            obj = {
              bgLeftColor: '#EAECF0',
              bgRightColor: '#D0F0FF',
              id: newItems[i].id,
              inviteLeft: '#81bcd6',
              inviteRight: '#EAECF0',
              path: newItems[i].link,
              txtLeftColor: '#101828',
              txtRightColor: '#101828',
            };
            arr.push(obj);
            setShowAlertAi(false);
            setIsLoadingAPI(false);
          }
          const unique = Array.from(
            new Map(arr.map(item => [item.id, item])).values(),
          );
          setBgData(unique);
        }
      }
    };
    processAPIListRoom();
  }, [listBackground]);

  const handleChangeBg = (item: any) => {
    setBgLocal(item);
  };

  const handleSubmit = () => {
    dispatch(setAppChatBg(bgLocal));
    if (bgLocal.path) {
      socketService.emitEditRoomChangeBackground(
        item.id,
        item.title,
        bgLocal.path,
      );
    } else {
      socketService.emitEditRoomNoAvatart(item.id, item.title);
    }
    hideModal();
  };

  const handleChooseMedia = async () => {
    let resultCheckPhoto: any = {};
    if (Platform.OS == 'android') {
      resultCheckPhoto = await showPhotoLibraryChangBackground();
    } else {
      resultCheckPhoto = await photoChangBackgroundLauncher();
    }

    if (resultCheckPhoto.isSuccess) {
      if (resultCheckPhoto.imgRes) {
        // loc danh sach anh hoac video
        const media = resultCheckPhoto.imgRes || {};
        setListMediaChoose([media]);
        let arr = [...bgData];
        // console.log("🚀 ~ handleChooseMedia ~ listMedia:", listMedia)
        let ext: string = getURLExtension(media.path);
        if (media.mime !== 'image/gif') {
          if (ext == 'img') {
            const data = {
              room_id: item.id,
              image: media.data,
            };
            dispatch(getCreateBackground(data));
            setShowAlertAi(true);
            setIsLoadingAPI(true);
          }
        }
        setBgData(arr);
      }
    } else if (resultCheckPhoto.msg) {
    }
  };

  const renderErrorImage = () => {
    return null;
  };

  const renderItem = ({item, index}: any) => {
    return (
      <Pressable
        onPress={() => handleChangeBg(item)}
        style={{
          width: ScreenWidth / 2 - 30,
          height: ((ScreenWidth / 2 - 30) * 2500) / 1500,
          marginLeft: 20,
          borderRadius: 4,
          overflow: 'hidden',
          borderColor:
            bgLocal.path == item.path ? colors.primary : colors.cEAECF0,
          borderWidth: 1,
          marginTop: 16,
          backgroundColor: colors.white,
        }}>
        <ImageHelper
          source={{uri: item.path}}
          renderErrorImage={renderErrorImage}
        />
      </Pressable>
    );
  };

  const renderListBg = () => {
    return (
      <FlatList
        contentContainerStyle={screenStyles.flexGrow1}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={bgData}
        extraData={bgData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <View style={screenStyles.modalTopHeader}>
          <Row between>
            <Pressable onPress={() => hideModal()}>
              <IconX
                style={{top: 2, left: 2}}
                name={'close'}
                origin={ICON_TYPE.ICONICONS}
                color={colors.black}
                size={24}
              />
            </Pressable>
            <CText center h4 w600 color={colors.black}>
              {t('community.chat.changeBackground', 'Change background')}
            </CText>
            <Pressable onPress={() => handleChooseMedia()}>
              <IconX
                style={{top: 2, left: 2}}
                name={'plus'}
                origin={ICON_TYPE.ANT_ICON}
                color={colors.black}
                size={24}
              />
            </Pressable>
          </Row>
        </View>
        <Divider color={colors.cD0D5DD} width={1} />
        {renderListBg()}
        <View style={screenStyles.modalTopBtn}>
          <CButton
            title={t('common.choose', 'Choose')}
            btnWidth={'100%'}
            onPress={handleSubmit}
            isBottom
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={hideModal}
      style={screenStyles.containerModalTop}>
      {renderContent()}
      {showAlertAi ? (
        <APILoading showAlert={showAlertAi} isLoadingAPI={isLoadingAPI} />
      ) : null}
      <Toast ref={toastEl} position={'center'} />
    </Modal>
  );
};

export default ModalChangeBackground;
