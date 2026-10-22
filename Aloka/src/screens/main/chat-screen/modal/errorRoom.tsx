import {APILoading, ImageHelper} from '@/components';
import {images, screenStyles} from '@/configs';
import {photoSingleCropLauncher} from '@/permissions';
import {showPhotoLibrary} from '@/permissions/picker';
import socketService from '@/socketio';
import {CText, Row} from '@/utils';
import {makeStyles, normalize, useTheme} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Platform, Pressable, TouchableOpacity, View} from 'react-native';
import Modal from '@gadhiyamanan/react-native-modal';

export const ErrorRoom = ({
  isVisible,
  hideModal,
  item,
  handleHideEditRoom,
  setShowEditRoom,
  setItem,
}: any) => {
  const {
    theme: {colors},
  } = useTheme();
  const {t} = useTranslation();
  const inputRef = useRef<any>(null);

  const styles = useStyles();

  const [valueNameGroup, onChangeText] = useState('');

  const [avatarbase64, setAvatarbase64] = useState('');
  const [avatarName, setAvatarName] = useState('');

  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const processAPIListRoom = () => {
      if (inputRef.current) {
        inputRef.current?.focus();
      }
    };
    processAPIListRoom();
  }, []);

  const handlePhoto = async () => {
    // const checkPhoto: any = await photoSingleCropLauncher();
    let checkPhoto: any = {};
    if (Platform.OS == 'android') {
      checkPhoto = await showPhotoLibrary();
    } else {
      checkPhoto = await photoSingleCropLauncher();
    }
    if (checkPhoto.isSuccess) {
      if (checkPhoto.imgRes) {
        setAvatarbase64(`data:image/jpeg;base64,${checkPhoto.imgRes.data}`);
        setAvatarName(checkPhoto.imgRes.filename);
      }
    } else if (checkPhoto.msg) {
      // showToast(toastEl, checkPhoto.msg);
    }
  };

  const handleEditRoom = () => {
    setShowEditRoom(false);
    if (avatarbase64 === '') {
      socketService.emitEditRoomNoAvatart(item.id, valueNameGroup);
      const itemChat = {
        ...item,
        title: valueNameGroup === '' ? item.title : valueNameGroup,
      };
      setItem(itemChat);
    } else if (valueNameGroup === '') {
      socketService.emitEditNoTitle(item.id, avatarName, avatarbase64);
      const itemChat = {
        ...item,
        thumbnail: avatarbase64,
      };
      setItem(itemChat);
    } else {
      socketService.emitEditRoom(
        item.id,
        valueNameGroup,
        avatarName,
        avatarbase64,
      );
      const itemChat = {
        ...item,
        thumbnail: avatarbase64,
        title: valueNameGroup,
      };
      setItem(itemChat);
    }
  };

  //RENDER
  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box40}
        resizeMode="contain"
      />
    );
  };

  const renderInput = () => {
    return (
      <View
        style={[screenStyles.pH24, screenStyles.pV12, {alignItems: 'center'}]}>
        <TouchableOpacity onPress={handlePhoto}>
          {avatarbase64 != '' ? (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.cF2F4F7,
                backgroundColor: colors.cEAECF0,
              }}>
              <ImageHelper
                source={{uri: avatarbase64}}
                renderErrorImage={renderErrorImage}
              />
            </View>
          ) : (
            <>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: colors.cF2F4F7,
                  backgroundColor: colors.cEAECF0,
                }}>
                <ImageHelper
                  source={{uri: item.thumbnail}}
                  renderErrorImage={renderErrorImage}
                />
              </View>
              {/* <View style={{position:'absolute', bottom: 0, right: 0, backgroundColor: colors.c98A2B3, borderRadius: 13, width: 20, height: 20}}>
                        <IconX style={{top: 3, left: 4}} name={'camera'} origin={ICON_TYPE.FEATHER_ICONS} color={item.thumbnail !== '' ? 'black' : colors.c98A2B3} size={14} />
                    </View> */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  borderRadius: 13,
                  width: 20,
                  height: 20,
                }}>
                <Image
                  source={images.community.icon_camera}
                  style={screenStyles.box20}
                  resizeMode="contain"
                />
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      onBackdropPress={hideModal}
      backdropOpacity={0.5}
      swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.view}>
      <View
        style={[
          styles.viewContainPopup1,
          {
            borderRadius: 5,
          },
        ]}>
        <View style={{alignItems: 'center'}}>{renderInput()}</View>
        <Row center>
          <Pressable
            onPress={() => handleHideEditRoom()}
            style={{
              width: '50%',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.cEAECF0,
              paddingVertical: 10,
            }}>
            <CText w500 color={colors.c101828} h5>
              {t('communityChat.editRoom.cancel')}
            </CText>
          </Pressable>
          <Pressable
            onPress={() => handleEditRoom()}
            style={{
              width: '50%',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.cEAECF0,
              paddingVertical: 10,
            }}>
            <CText w500 color={colors.primary} h5>
              {t('communityChat.editRoom.save')}
            </CText>
          </Pressable>
        </Row>
      </View>
      {apiLoading ? (
        <APILoading showAlert={apiLoading} isLoadingAPI={apiLoading} />
      ) : null}
    </Modal>
  );
};

const useStyles = makeStyles(({colors}) => ({
  ...screenStyles,
  view: {
    justifyContent: 'center' as const,
    margin: 0,
    paddingHorizontal: 60,
  },
  viewContainPopup: {
    backgroundColor: colors.cFCFCFD,
    display: 'flex' as const,
    width: '100%' as const,
    //   paddingTop: normalize(10),
    top: -40,
    // paddingHorizontal: normalize(15),
    // paddingBottom: normalize(20),
  },
  viewContainPopup1: {
    backgroundColor: 'white' as const,
    display: 'flex' as const,
    width: '100%' as const,
    paddingTop: normalize(10),
    // paddingHorizontal: normalize(15),
    // paddingBottom: normalize(20),
  },
}));

function dispatch(arg0: {payload: any; type: 'community/getListMemberGroup'}) {
  throw new Error('Function not implemented.');
}
