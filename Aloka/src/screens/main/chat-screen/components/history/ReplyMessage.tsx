import { ImageHelper } from '@/components';
import {
  ScreenWidth,
  conventUserNameChat,
  fonts,
  images,
  screenStyles,
} from '@/configs';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import { makeStyles } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, Pressable, View } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import Video from 'react-native-video';
import { MessageModal } from '../../modal/MessageModal';

const ReplyMessage = (props: any) => {
  const {
    messages,
    list = {},
    replyArrId = [],
    onDetailFile,
    itemRoomId,
    checkUser,
    idMessage,
    onDeleteMessage,
    onRecallMessage,
    showMessReply,
    handleShowModalText,
    titleName,
    userId,
    checkDeleteMess,
    isPin,
    handleOnIndex,
    listOwner,
    itemChat,
  } = props;
  const styles = useStyles();
  const { t } = useTranslation();

  const [listMessReply, setlistMessReply] = useState<any>([]);
  const [showMessModal, setShowMessModal] = useState<boolean>(false);
  const [checkContentReply, setCheckContentReply] = useState<boolean>(false);
  const { appBgChat } = useAppSelector(state => state.communityReducer);
  const { firebaseConfig } = useAppSelector(state => state.globalReducer);

  useEffect(() => {
    let arr = [...messages];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i]._id === list.reply_id) {
        arr = messages.map((item: any) => ({ ...item, contentReply: list }));
        setCheckContentReply(true);
      } else {
        arr = messages.map((item: any) => ({ ...item, contentReply: list }));
        setCheckContentReply(true);
      }
    }
    setlistMessReply(arr);
  }, []);

  const handleFileFetail = () => {
    // onDetailFile(listMessReply.data)
  };

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  const showModalMess = () => {
    setShowMessModal(true);
  };

  const handleDeleteMess = () => {
    onDeleteMessage(itemRoomId, idMessage);
  };

  const handleRecallMess = () => {
    onRecallMessage(itemRoomId, idMessage);
  };

  const formatMsgPartern = (txt: string) => {
    let str = txt.replace(/[\"\"]/g, '');
    str = txt.replace('\\*\\*', '\\*\\*[^\\*]+\\*\\*');
    // console.log("🚀 ~ formatMsgPartern ~ str:", str)
    return str;
  };

  const renderText = (matchingString: any, matches: any) => {
    // console.log("🚀 ~ renderText ~ matches:", matches)
    let pattern = /(?:\*\*)([^*]*)(?:\*\*)/;
    let match = matchingString.match(pattern);
    return `${match[1]}`;
  };

  const handleLink = (url: any, matchIndex: any) => {
    const str = url.replace(/\%5D$|\]$/i, '');
    // console.log("🚀 ~ handleLink ~ str:", str)
    Linking.canOpenURL(str).then(() => {
      Linking.openURL(str);
    });
  };

  const renderParseText = (txt: string) => {
    // console.log("🚀 ~ renderParseText ~ txt:", txt)
    return (
      <ParsedText
        style={{
          fontFamily: fonts.inter,
          fontSize: 16,
          color: appBgChat.txtLeftColor,
        }}
        parse={[
          {
            type: 'url',
            style: {
              color: appBgChat.txtLeftColor,
              fontFamily: fonts.inter,
              textDecorationLine: 'underline',
            },
            onPress: handleLink,
          },
          {
            pattern: /(?:\*\*)([^*]*)(?:\*\*)/,
            style: styles.styleBold,
            renderText: renderText,
          },
        ]}
        childrenProps={{ allowFontScaling: false }}
      >
        {txt}
      </ParsedText>
    );
  };

  const convertUser = (text: any) => {
    if (text === '[User deleted]') {
      text = t('communityChat.user.delete');
    } else {
      text;
    }
    return conventUserNameChat(
      listOwner,
      text,
      firebaseConfig.isReviewApp,
      itemChat.is_name,
    );
  };

  const renderMessageReply = (item: any, index: number) => {
    return (
      <View key={index}>
        {item.contentReply.reply_id !== undefined ? (
          item._id === item.contentReply.reply_id ? (
            <Pressable
              onPress={() => handleOnIndex(item)}
              onLongPress={() =>
                handleShowModalText(
                  idMessage,
                  list.text.replace(/[\[\]]/g, ''),
                  titleName,
                  userId,
                  checkDeleteMess,
                  isPin,
                  'text',
                )
              }
            >
              <>
                <Row start>
                  <Row style={screenStyles.pH5}>
                    <View
                      style={{
                        height: 44,
                        width: 3,
                        backgroundColor: '#0080F6',
                      }}
                    />
                    {item.type === 'image' ? (
                      <>
                        <View style={styles.imgRepLy}>
                          <ImageHelper
                            source={{ uri: JSON.parse(item.text)[0].data }}
                            renderErrorImage={renderErrorImage}
                          />
                        </View>
                        <View style={screenStyles.pH8}>
                          <View style={screenStyles.pV4}>
                            <View style={{ paddingVertical: 4 }}>
                              <CText
                                color={appBgChat.txtLeftColor}
                                style={{ width: 150 }}
                                numberOfLines={1}
                                h4
                                w500
                              >
                                {convertUser(item.name)}
                              </CText>
                            </View>
                            <CText numberOfLines={1} h46 color="#667085">
                              {t('communityChat.home.lastMessageImage')}
                            </CText>
                          </View>
                        </View>
                      </>
                    ) : item.type === 'video' ? (
                      <>
                        <View style={styles.imgRepLy}>
                          <Video
                            style={[screenStyles.fillParent]}
                            source={{ uri: JSON.parse(item.text)[0].data }}
                            controls={false}
                            paused={true}
                            muted={true}
                            repeat={false}
                            volume={0.0}
                            fullscreen={false}
                            playWhenInactive={false}
                            useTextureView={false}
                            playInBackground={false}
                            disableFocus={true}
                            ignoreSilentSwitch={'ignore'}
                          />
                        </View>
                        <View style={screenStyles.pH8}>
                          <View style={screenStyles.pV4}>
                            <View style={{ paddingVertical: 4 }}>
                              <CText
                                color={appBgChat.txtLeftColor}
                                style={{ width: 150 }}
                                numberOfLines={1}
                                h4
                                w500
                              >
                                {convertUser(item.name)}
                              </CText>
                            </View>
                            <CText numberOfLines={1} h46 color="#667085">
                              {t('communityChat.home.lastMessageVideo')}
                            </CText>
                          </View>
                        </View>
                      </>
                    ) : item.type === 'media' ? (
                      <>
                        <View style={screenStyles.pH8}>
                          <View style={screenStyles.pV4}>
                            <View style={{ paddingVertical: 4 }}>
                              <CText
                                color={appBgChat.txtLeftColor}
                                numberOfLines={1}
                                h4
                                w500
                              >
                                {convertUser(item.name)}
                              </CText>
                            </View>
                            <CText numberOfLines={1} h46 color="#667085">
                              {t('communityChat.listPin.imgVideo')}
                            </CText>
                          </View>
                        </View>
                      </>
                    ) : item.type === 'file' ? (
                      <>
                        <View style={screenStyles.pH8}>
                          <View style={screenStyles.pV4}>
                            <View style={{ paddingVertical: 4 }}>
                              <CText
                                color={appBgChat.txtLeftColor}
                                numberOfLines={1}
                                h4
                                w500
                              >
                                {convertUser(item.name)}
                              </CText>
                            </View>
                            <CText numberOfLines={1} h46 color="#667085">
                              {'[File]'}
                            </CText>
                          </View>
                        </View>
                      </>
                    ) : item.type === 'voice' ? (
                      <>
                        <View style={screenStyles.pH8}>
                          <View style={screenStyles.pV4}>
                            <View style={{ paddingVertical: 4 }}>
                              <CText
                                color={appBgChat.txtLeftColor}
                                numberOfLines={1}
                                h4
                                w500
                              >
                                {convertUser(item.name)}
                              </CText>
                            </View>
                            <CText numberOfLines={1} h46 color="#667085">
                              {t('communityChat.home.lastMessageVoice')}
                            </CText>
                          </View>
                        </View>
                      </>
                    ) : (
                      <View style={screenStyles.pH8}>
                        <View style={screenStyles.pV4}>
                          <View style={{ paddingVertical: 4 }}>
                            <CText
                              color={appBgChat.txtLeftColor}
                              numberOfLines={1}
                              h4
                              w500
                            >
                              {convertUser(item.name)}
                            </CText>
                          </View>
                          {item.text.includes('idTag') ? (
                            <CText numberOfLines={1} h46 color="#667085">
                              {JSON.parse(item.text).content}
                            </CText>
                          ) : (
                            <CText numberOfLines={1} h46 color="#667085">
                              {item.text}
                            </CText>
                          )}
                        </View>
                      </View>
                    )}

                    {/* <CText h46 color='black'>{item.name}</CText> */}
                  </Row>
                </Row>
                <View style={{ paddingHorizontal: 6, paddingVertical: 4 }}>
                  {/* <CText h4 color={appBgChat.txtLeftColor}>{item.contentReply.text.replace(/[\"\"]/g, '')}</CText> */}
                  {/* <CText h4 color={appBgChat.txtLeftColor}>{formatMsgPartern(item.contentReply.text || "")}</CText> */}
                  {renderParseText(
                    item.contentReply.text.replace(/[\"\"]/g, ''),
                  )}
                </View>
              </>
            </Pressable>
          ) : null
        ) : null}
      </View>
    );
  };

  return (
    <Pressable
      onLongPress={() =>
        handleShowModalText(
          idMessage,
          list.text.replace(/[\[\]]/g, ''),
          titleName,
          userId,
          checkDeleteMess,
          isPin,
          'text',
        )
      }
    >
      {listMessReply.length > 0 && checkContentReply ? (
        <View
          style={{
            width: checkUser ? ScreenWidth / 1.3 : ScreenWidth / 1.4,
            borderRadius: 10,
            justifyContent: 'center',
          }}
        >
          {listMessReply.map(renderMessageReply)}
        </View>
      ) : (
        <>
          <CText>{list.text.replace(/[\[\]]/g, '')}</CText>
        </>
      )}
      {showMessModal && (
        <MessageModal
          isVisible={showMessModal}
          hideModal={() => setShowMessModal(false)}
          handleDeleteMess={handleDeleteMess}
          handleRecallMess={handleRecallMess}
          itemRoomId={itemRoomId}
          checkUser={checkUser}
        />
      )}
    </Pressable>
  );
};

export default ReplyMessage;

const useStyles = makeStyles(({ colors }) => ({
  imgRepLy: {
    width: 42,
    height: 42,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 10,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  styleBold: {
    fontWeight: '700' as const,
    fontFamily: fonts.inter,
  },
  url: {
    color: colors.c101828,
    fontFamily: fonts.inter,
    textDecorationLine: 'underline',
    // fontWeight: "500",
  },
}));
