import { IconType, IconX, 
    // ToggleSwitch, 
    ConfirmModal } from '@/components';
import { images, screenStyles } from '@/configs';
import { STORAGEKEY } from '@/constants';
import { AppContext } from '@/contexts';
import { getListBackground } from '@/redux/slices/communitySlice';
import { getPinLocal } from '@/redux/slices/socketioSlice';
import { store } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { getObjectData, storeObjectData } from '@/storages';
import { CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { makeStyles, normalize, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Pressable, TouchableOpacity, View } from 'react-native';
import Modal from '@gadhiyamanan/react-native-modal';
import { ModalAddMember } from './addMember';
import { ModalChangeAdmin } from './changeAdmin';
import { ModalListMember } from './listMember';
import ModalChangeBackground from './ModalChangeBackground';
// import ModalInviteLink from './ModalInviteLink';
// import ConfirmModal from '../../myAppointment/ConfirmModal';
// import ApiService from '@/services/api-base';

export const ModalSettingChat = ({
  isVisible,
  hideModal,
  item,
  itemRoomId,
  handleHideModal,
  handleSendInvite,
  handleSendLeave,
  handleAdminLeave,
  handleSendDelete,
  navigation,
  listCreateRoom,
  listHistoryChatRoom,
  handleRemoveMember,
  isOnlyView,
  listOwner,
  handleLiveStream,
  handleReport,
  onBlockUserMsg,
  isBlockMsg,
  onMarkChatComplete,
}: any) => {
  const { user } = useContext(AppContext);
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const styles = useStyles();
  const { firebaseConfig } = useAppSelector(state => state.globalReducer);

  const dispatch = useAppDispatch();

  const [showModalAddMember, setShowModalAddMember] = useState<boolean>(false);
  const [showModalChangeAdmin, setShowModalChangeAdmin] =
    useState<boolean>(false);
  const [showModalListMember, setShowModalListMember] =
    useState<boolean>(false);
  const [showModalChangeBackground, setShowModalChangeBackground] =
    useState<boolean>(false);
  const [showModalInviteLink, setShowModalInviteLink] =
    useState<boolean>(false);

  const [isEnabledNotify, setIsEnabledNotify] = useState<boolean>(false);

  const [modalConfirm, setModalConfirm] = React.useState({
    isVisible: false,
    message: '',
    onCancel: () => {},
    onConfirm: () => {},
  });

  useEffect(() => {
    dispatch(getListBackground({ room_id: itemRoomId }));
  }, []);

  useEffect(() => {
    const processAPIListRoom = async () => {
      const pinLocal = await getObjectData(STORAGEKEY.PIN_LOCAL);
      if (pinLocal !== null) {
        for (let i = 0; i < pinLocal.length; i++) {
          if (item.id === pinLocal[i].id) {
            pinLocal.splice(i, 1);
            setIsEnabledNotify(true);
          }
        }
      }
    };
    processAPIListRoom();
  }, []);

  //Action
  const handleLevaeGroup = () => {
    if (listOwner === 'Owner') {
      setShowModalChangeAdmin(true);
    } else {
      handleSendLeave();
    }
  };

  const handleBlock = (title: string) => {
    Alert.alert(title, '', [
      {
        text: t('communityChat.mediaLocal.titleLeft'),
        onPress: () => {},
        style: 'default',
      },
      {
        text: t('communityChat.contact.appect'),
        onPress: () => {
          onBlockUserMsg(item.to || '');
          hideModal();
        },
        style: 'destructive',
      },
    ]);
  };

  const handleNotify = async () => {
    const pinLocal = await getObjectData(STORAGEKEY.PIN_LOCAL);
    let arrEmpty: any = [];
    setIsEnabledNotify(!isEnabledNotify);
    if (pinLocal !== null) {
      let arr: any = [...pinLocal];
      if (isEnabledNotify) {
        for (let i = 0; i < arr.length; i++) {
          if (item.id === arr[i].id) {
            arr.splice(i, 1);
            storeObjectData(STORAGEKEY.PIN_LOCAL, arr);
            break;
          }
        }
      } else {
        arr.push(item);
        storeObjectData(STORAGEKEY.PIN_LOCAL, arr);
      }
    } else {
      if (isEnabledNotify) {
        for (let i = 0; i < arrEmpty.length; i++) {
          if (item.id === arrEmpty[i].id) {
            arrEmpty.splice(i, 1);
            storeObjectData(STORAGEKEY.PIN_LOCAL, arrEmpty);
            break;
          }
        }
      } else {
        arrEmpty.push(item);
        storeObjectData(STORAGEKEY.PIN_LOCAL, arrEmpty);
      }
    }
    store.dispatch(getPinLocal(arrEmpty));
  };

  const handleCompleteChatPremium = async () => {
    setModalConfirm({
      isVisible: true,
      message: t(
        'chat.markCompleteConfirm',
        'Mark as resolved and end chat? You’ll have to open a new session to chat again.',
      ),
      onCancel: () =>
        setModalConfirm({
          isVisible: false,
          message: '',
          onCancel: () => {},
          onConfirm: () => {},
        }),
      onConfirm: () => {
        setModalConfirm({
          isVisible: false,
          message: '',
          onCancel: () => {},
          onConfirm: () => {},
        });
        onMarkChatComplete();
      },
    });
  };

  //RENDER
  const renderBody = () => {
    if (!isOnlyView) {
      return (
        <View style={[screenStyles.pH16, { paddingBottom: 22 }]}>
          {listOwner === 'Owner' && (
            <TouchableOpacity
              onPress={() => setShowModalChangeBackground(true)}
            >
              <Row start style={{ marginTop: 15 }}>
                <IconX
                  type={IconType.FOUNDATION}
                  name="paint-bucket"
                  size={24}
                  color={colors.c667085}
                />
                <View style={screenStyles.mL16}>
                  <CText h5 w400 color={colors.c101828}>
                    {t('communityChat.setting.background')}
                  </CText>
                </View>
              </Row>
            </TouchableOpacity>
          )}
          {item.is_premium == 1 && item.type === '1-1' && (
            <TouchableOpacity onPress={handleCompleteChatPremium}>
              <Row start style={{ marginTop: 15 }}>
                <IconX
                  type={IconType.MATERIAL_DESIGN_ICONS}
                  name="chat-remove-outline"
                  size={22}
                  color={colors.c667085}
                />
                <View style={screenStyles.mL12}>
                  <CText h5 w400 color={colors.black}>
                    {t('chat.markResolved', 'Marked as resolved')}
                  </CText>
                </View>
              </Row>
            </TouchableOpacity>
          )}
          {item.is_premium !== 1 && (
            <TouchableOpacity onPress={() => setShowModalAddMember(true)}>
              <Row start style={{ marginTop: 15 }}>
                <Image
                  source={images.community.icon_chat_addUser}
                  style={screenStyles.box24}
                  resizeMode="contain"
                />
                <View style={screenStyles.mL12}>
                  {item.type === '1-1' ? (
                    <CText h5 w400 color={colors.black}>{`${t(
                      'communityChat.setting.create1vs1',
                    )} ${item.title}`}</CText>
                  ) : (
                    <CText h5 w400 color={colors.black}>
                      {t('communityChat.setting.addFriend')}
                    </CText>
                  )}
                </View>
              </Row>
            </TouchableOpacity>
          )}
          {item.type === 'Room' ? (
            <>
              <View style={screenStyles.pV10} />
              <TouchableOpacity onPress={() => setShowModalListMember(true)}>
                <Row start>
                  <Image
                    source={images.community.icon_chat_group}
                    style={screenStyles.box24}
                    resizeMode="contain"
                  />
                  <View style={screenStyles.mL12}>
                    <CText h5 w400 color={colors.black}>
                      {t('communityChat.setting.viewFriend')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          ) : null}
          {item.type === 'Room' ? (
            <>
              <View style={screenStyles.pV10} />
              <TouchableOpacity onPress={() => setShowModalInviteLink(true)}>
                <Row start>
                  <IconX
                    type={IconType.FEATHER}
                    name="link"
                    size={20}
                    color={colors.c667085}
                  />
                  <View style={screenStyles.mL16}>
                    <CText h5 w400 color={colors.c101828}>
                      {t('communityChat.setting.link')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          ) : null}
          {/* {item.is_pin !== 1 ? (
            <>
              <View style={screenStyles.pV10} />
              <TouchableOpacity onPress={handleNotify}>
                <Row between>
                  <Row>
                    <IconX
                      type={IconType.ANT_DESIGN}
                      name="pushpino"
                      size={20}
                      color={colors.c667085}
                    />
                    <View style={screenStyles.mL16}>
                      <CText h5 w400 color={colors.c101828}>
                        {t('communityChat.setting.pin')}
                      </CText>
                    </View>
                  </Row>
                  <View style={{ top: 3 }}>
                    <ToggleSwitch
                      size="small"
                      isOn={isEnabledNotify}
                      onToggle={handleNotify}
                      onColor={colors.primary}
                      offColor={colors.c98A2B3}
                    />
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          ) : null} */}
          {item.type === 'Room' && listOwner === 'Owner' ? (
            <>
              <View style={screenStyles.pV10} />
              <TouchableOpacity onPress={() => handleLiveStream()}>
                <Row start>
                  <IconX
                    type={IconType.MATERIAL_ICONS}
                    name={'live-tv'}
                    size={26}
                    color={colors.c667085}
                  />
                  <View style={screenStyles.mL12}>
                    <CText h5 w400 color={colors.c101828}>
                      {t('Livestream')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          ) : null}
          <>
            <View style={screenStyles.pV10} />
            <TouchableOpacity onPress={() => handleReport()}>
              <Row start>
                <IconX
                  type={IconType.OCTICONS}
                  name={'report'}
                  size={20}
                  color={colors.c667085}
                />
                <View style={screenStyles.mL16}>
                  <CText h5 w400 color={colors.c101828}>
                    {t('common.report')}
                  </CText>
                </View>
              </Row>
            </TouchableOpacity>
          </>
          {item.type == '1-1' && firebaseConfig.isReviewApp && (
            <>
              <View style={screenStyles.pV10} />
              <TouchableOpacity
                onPress={() =>
                  handleBlock(
                    isBlockMsg
                      ? t('communityChat.setting.unblock')
                      : t('communityChat.setting.block'),
                  )
                }
              >
                <Row start>
                  <IconX
                    type={IconType.ENTYPO}
                    name={'block'}
                    size={20}
                    color={colors.c667085}
                  />
                  <View style={screenStyles.mL16}>
                    <CText h5 w400 color={colors.c101828}>
                      {isBlockMsg
                        ? t('communityChat.setting.unblock')
                        : t('communityChat.setting.block')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          )}
          {item.type === 'Room' ? (
            <>
              <View style={screenStyles.pV10} />
              <TouchableOpacity onPress={() => handleLevaeGroup()}>
                <Row start>
                  <Image
                    source={images.community.icon_chat_out}
                    style={screenStyles.box24}
                    resizeMode="contain"
                  />
                  <View style={screenStyles.mL12}>
                    <CText h5 w400 color={colors.cF04438}>
                      {t('communityChat.setting.leaveRoom')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          ) : null}
          {item.type === '1-1' ? (
            user.id === item.owner_id ? (
              <TouchableOpacity onPress={() => handleSendDelete()}>
                <View style={screenStyles.pV10} />
                <Row start>
                  <Image
                    source={images.community.delete}
                    style={screenStyles.box24}
                    resizeMode="contain"
                  />
                  <View style={screenStyles.mL12}>
                    <CText h5 w400 color={colors.cF04438}>
                      {t('communityChat.setting.Delete1vs1')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            ) : null
          ) : null}
          {listOwner === 'Owner' ? (
            <TouchableOpacity onPress={() => handleSendDelete()}>
              <View style={screenStyles.pV10} />
              <Row start>
                <Image
                  source={images.community.delete}
                  style={screenStyles.box24}
                  resizeMode="contain"
                />
                <View style={screenStyles.mL12}>
                  <CText h5 w400 color={colors.cF04438}>
                    {t('communityChat.setting.deleteRoom')}
                  </CText>
                </View>
              </Row>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else {
      return (
        <>
          {listOwner === 'Owner' && (
            <TouchableOpacity
              onPress={() => setShowModalChangeBackground(true)}
            >
              <Row start style={{ paddingHorizontal: 16, padding: 10 }}>
                <IconX
                  type={IconType.FOUNDATION}
                  name="paint-bucket"
                  size={24}
                  color={colors.c667085}
                />
                <View style={screenStyles.mL16}>
                  <CText h5 w400 color={colors.c101828}>
                    {t('communityChat.setting.background')}
                  </CText>
                </View>
              </Row>
            </TouchableOpacity>
          )}
          {item.type === 'Room' ? (
            <>
              <View />
              <TouchableOpacity onPress={() => setShowModalListMember(true)}>
                <Row start style={{ paddingHorizontal: 16, padding: 10 }}>
                  <Image
                    source={images.community.icon_chat_group}
                    style={screenStyles.box24}
                    resizeMode="contain"
                  />
                  <View style={screenStyles.mL12}>
                    <CText h5 w400 color={colors.black}>
                      {t('communityChat.setting.viewFriend')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          ) : null}
          {item.type === 'Room' ? (
            <>
              <View />
              <TouchableOpacity onPress={() => setShowModalInviteLink(true)}>
                <Row start style={{ paddingHorizontal: 16, padding: 10 }}>
                  <IconX
                    type={IconType.FEATHER}
                    name="link"
                    size={20}
                    color={colors.c667085}
                  />
                  <View style={screenStyles.mL16}>
                    <CText h5 w400 color={colors.c101828}>
                      {t('communityChat.setting.link')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          ) : null}
          <>
            <TouchableOpacity onPress={() => handleReport()}>
              <Row start style={{ paddingHorizontal: 16, padding: 10 }}>
                <IconX
                  type={IconType.OCTICONS}
                  name={'report'}
                  size={20}
                  color={colors.c667085}
                />
                <View style={screenStyles.mL16}>
                  <CText h5 w400 color={colors.c101828}>
                    {t('common.report')}
                  </CText>
                </View>
              </Row>
            </TouchableOpacity>
          </>
          <>
            {item.type == '1-1' && firebaseConfig.isReviewApp && (
              <TouchableOpacity
                onPress={() =>
                  handleBlock(
                    isBlockMsg
                      ? t('communityChat.setting.unblock')
                      : t('communityChat.setting.block'),
                  )
                }
              >
                <Row start style={{ paddingHorizontal: 16, padding: 10 }}>
                  <IconX
                    type={IconType.ENTYPO}
                    name={'block'}
                    size={20}
                    color={colors.c667085}
                  />
                  <View style={screenStyles.mL16}>
                    <CText h5 w400 color={colors.c101828}>
                      {isBlockMsg
                        ? t('communityChat.setting.unblock')
                        : t('communityChat.setting.block')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            )}
          </>
          {item.type === 'Room' ? (
            <>
              <TouchableOpacity onPress={() => handleLevaeGroup()}>
                <Row start style={{ paddingHorizontal: 16, padding: 10 }}>
                  <Image
                    source={images.community.icon_chat_out}
                    style={screenStyles.box24}
                    resizeMode="contain"
                  />
                  <View style={screenStyles.mL12}>
                    <CText h5 w400 color={colors.cF04438}>
                      {t('communityChat.setting.leaveRoom')}
                    </CText>
                  </View>
                </Row>
              </TouchableOpacity>
            </>
          ) : null}
          <View style={screenStyles.pV10} />
        </>
      );
    }
  };

  const renderContent = () => {
    return (
      <View>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable>
            <CText h4 w600 color={colors.c101828}>
              <IconX
                name={'close'}
                type={IconType.ANT_DESIGN}
                color={colors.white}
                size={24}
              />
            </CText>
          </Pressable>
          <CText h4 w600 color={colors.black}>
            {t('communityChat.setting.title')}
          </CText>
          <Pressable onPress={hideModal}>
            <IconX
              name={'close'}
              type={IconType.ANT_DESIGN}
              color={colors.black}
              size={24}
            />
          </Pressable>
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        {renderBody()}
      </View>
    );
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      onBackdropPress={hideModal}
      backdropOpacity={0.5}
      style={styles.view}
    >
      <View
        style={[
          styles.viewContainPopup,
          {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingBottom: normalize(10),
          },
        ]}
      >
        {renderContent()}
        {showModalAddMember && (
          <ModalAddMember
            isVisible={showModalAddMember}
            hideModal={() => setShowModalAddMember(false)}
            itemRoomId={itemRoomId}
            itemChat={item}
            handleHideModal={handleHideModal}
            handleSendInvite={handleSendInvite}
            navigation={navigation}
            listCreateRoom={listCreateRoom}
          />
        )}
        {showModalChangeAdmin && (
          <ModalChangeAdmin
            isVisible={showModalChangeAdmin}
            hideModal={() => setShowModalChangeAdmin(false)}
            itemRoomId={itemRoomId}
            handleAdminLeave={handleAdminLeave}
          />
        )}
        {showModalListMember && (
          <ModalListMember
            isVisible={showModalListMember}
            hideModal={() => setShowModalListMember(false)}
            itemRoomId={itemRoomId}
            itemChat={item}
            handleRemoveMember={handleRemoveMember}
            listOwner={listOwner}
            navigation={navigation}
          />
        )}
        {showModalChangeBackground && (
          <ModalChangeBackground
            isVisible={showModalChangeBackground}
            hideModal={() => {
              setShowModalChangeBackground(false);
              hideModal();
            }}
            item={item}
          />
        )}
        {/* {showModalInviteLink &&
                    <ModalInviteLink
                        isVisible={showModalInviteLink}
                        hideModal={() => {
                            setShowModalInviteLink(false);
                            hideModal();
                        }}
                        itemRoomId={itemRoomId}
                        isOnlyView={isOnlyView}
                    />
                } */}
        <ConfirmModal
          visible={modalConfirm.isVisible}
          message={modalConfirm.message}
          onCancel={modalConfirm.onCancel}
          onConfirm={modalConfirm.onConfirm}
        />
      </View>
    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  ...screenStyles,
  view: {
    justifyContent: 'flex-end' as const,
    margin: 0,
  },
  viewContainPopup: {
    backgroundColor: colors.cFCFCFD,
    display: 'flex' as const,
    width: '100%' as const,
  },
}));
