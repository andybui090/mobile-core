import { images, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import { makeStyles, normalize, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import Modal from '@gadhiyamanan/react-native-modal';

export const MessageModal = ({
  isVisible,
  hideModal,
  textCoppy,
  checkUser,
  checkMessageDelete,
  handleDeleteMess,
  handleRecallMess,
  handleCoppyMess,
  handleReplyMessage,
  handleShareMessage,
  handlePinMessage,
  checIsPin,
  typeMessage,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const { listMemberGroup } = useAppSelector(
    (state: { communityReducer: any }) => state.communityReducer,
  );

  const styles = useStyles();
  const { user } = useContext(AppContext);
  const [checkOwner, setCheckOwner] = useState<boolean>(false);

  const [typeMessageLocal, settypeMessageLocal] = useState<any>(typeMessage);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = listMemberGroup;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            for (let i = 0; i < newItems.length; i++) {
              if (newItems[i].role === 'Owner') {
                if (newItems[i].id === user.id) {
                  setCheckOwner(true);
                }
              }
            }
          } else {
          }
        }
      }
    };
    processAPIListRoom();
  }, [listMemberGroup]);

  useEffect(() => {
    const processAPIListRoom = () => {
      if (typeMessage === undefined) {
        settypeMessageLocal('text');
      }
    };
    processAPIListRoom();
  }, []);

  //RENDER

  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      onBackdropPress={hideModal}
      backdropOpacity={0.5}
      swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.view}
    >
      <View
        style={[
          styles.viewContainPopup1,
          {
            borderRadius: 10,
            paddingBottom: normalize(5),
          },
        ]}
      >
        {textCoppy !== '{community.chat.recall}' && !checkMessageDelete ? (
          <>
            <View style={{ flexWrap: 'wrap', paddingVertical: 2 }}>
              <Row start>
                <TouchableOpacity
                  style={{ alignItems: 'center', width: '33%' }}
                  onPress={handleReplyMessage}
                >
                  <Image
                    source={images.community.reply_mess}
                    style={screenStyles.box30}
                    resizeMode="contain"
                  />
                  <CText h4 style={{ color: colors.c667085 }}>
                    {t('communityChat.messageModal.buttonReply')}
                  </CText>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={{ alignItems: 'center', width: '33%' }}
                  onPress={handleShareMessage}
                >
                  <Image
                    source={images.community.icon_share}
                    style={screenStyles.box30}
                    resizeMode="contain"
                  />
                  <CText h4 style={{ color: colors.c667085 }}>
                    {t('communityChat.messageModal.buttonShare')}
                  </CText>
                </TouchableOpacity> */}

                {typeMessageLocal === 'text' || typeMessageLocal === 'image' ? (
                  <TouchableOpacity
                    style={{ alignItems: 'center', width: '33%' }}
                    onPress={handleCoppyMess}
                  >
                    <Image
                      source={images.community.coopy_mess}
                      style={screenStyles.box30}
                      resizeMode="contain"
                    />
                    <CText h4 style={{ color: colors.c667085 }}>
                      {t('communityChat.messageModal.buttonCoppy')}
                    </CText>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ alignItems: 'center', width: '33%' }}
                    onPress={handlePinMessage}
                  >
                    {checIsPin ? (
                      <Image
                        source={images.community.icon_unPin}
                        style={screenStyles.box30}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={images.community.icon_pin}
                        style={screenStyles.box30}
                        resizeMode="contain"
                      />
                    )}
                    <CText h4 style={{ color: colors.c667085 }}>
                      {checIsPin
                        ? `${t('communityChat.messageModal.buttonUnpin')}`
                        : `${t('communityChat.messageModal.buttonPin')}`}
                    </CText>
                  </TouchableOpacity>
                )}
              </Row>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#D0D5DD',
                width: '90%',
                marginLeft: '5%',
                paddingVertical: 6,
              }}
            />

            <View style={{ width: '100%', paddingVertical: 10 }}>
              <Row start>
                {typeMessageLocal === 'text' || typeMessageLocal === 'image' ? (
                  <TouchableOpacity
                    style={{ alignItems: 'center', width: '33%' }}
                    onPress={handlePinMessage}
                  >
                    {checIsPin ? (
                      <Image
                        source={images.community.icon_unPin}
                        style={screenStyles.box30}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={images.community.icon_pin}
                        style={screenStyles.box30}
                        resizeMode="contain"
                      />
                    )}
                    <CText h4 style={{ color: colors.c667085 }}>
                      {checIsPin
                        ? `${t('communityChat.messageModal.buttonUnpin')}`
                        : `${t('communityChat.messageModal.buttonPin')}`}
                    </CText>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={{ alignItems: 'center', width: '33%' }}
                  onPress={handleDeleteMess}
                >
                  <Image
                    source={images.community.delete_mess}
                    style={screenStyles.box30}
                    resizeMode="contain"
                  />
                  <CText h4 style={{ color: colors.c667085 }}>
                    {t('communityChat.messageModal.buttonDelete')}
                  </CText>
                </TouchableOpacity>
                {/* {checkOwner ? (
                  <TouchableOpacity style={{ alignItems: 'center', width: '33%' }} onPress={handleRecallMess}>
                    <Image source={images.community.recall_mess} style={screenStyles.box30} resizeMode="contain" />
                    <CText w500 h4 style={{ color: colors.c667085 }}>
                      {'Thu hồi'}
                    </CText>
                  </TouchableOpacity>
                ) :
                  <>
                    {checkUser ? (
                      <TouchableOpacity style={{ alignItems: 'center', width: '33%' }} onPress={handleRecallMess}>
                        <Image source={images.community.recall_mess} style={screenStyles.box30} resizeMode="contain" />
                        <CText w500 h4 style={{ color: colors.c667085 }}>
                          {'Thu hồi'}
                        </CText>
                      </TouchableOpacity>
                    ) : null}
                  </>
                } */}
                {checkUser ? (
                  <TouchableOpacity
                    style={{ alignItems: 'center', width: '33%' }}
                    onPress={handleRecallMess}
                  >
                    <Image
                      source={images.community.recall_mess}
                      style={screenStyles.box30}
                      resizeMode="contain"
                    />
                    <CText w500 h4 style={{ color: colors.c667085 }}>
                      {t('communityChat.messageModal.buttonRecall')}
                    </CText>
                  </TouchableOpacity>
                ) : null}
              </Row>
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={handleDeleteMess}
          >
            <Image
              source={images.community.delete_mess}
              style={screenStyles.box30}
              resizeMode="contain"
            />
            <CText h4 style={{ color: colors.c667085 }}>
              {'Xoá'}
            </CText>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  ...screenStyles,
  view: {
    justifyContent: 'flex-end' as const,
    margin: 0,
    paddingHorizontal: 20,
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
    paddingTop: 10,
    // paddingHorizontal: normalize(15),
    // paddingBottom: normalize(20),
    top: -30,
  },
}));

function dispatch(arg0: {
  payload: any;
  type: 'community/getListMemberGroup';
}) {
  throw new Error('Function not implemented.');
}
