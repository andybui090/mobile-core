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
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, Pressable, View } from 'react-native';
import Video from 'react-native-video';
import ParsedText from 'react-native-parsed-text';
import { MessageModal } from '../../modal/MessageModal';

const ReplyMessageLocal = (props: any) => {
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
    textCoppy,
    idMessText,
    handleShowModalText,
    titleName,
    userId,
    checkDeleteMess,
    isPin,
    handleOnIndex,
    idMessageAll,
    seenMessage,
    time,
    listOwner,
    itemChat,
  } = props;
  const [listMessReply, setlistMessReply] = useState<any>([]);
  const [showMessModal, setShowMessModal] = useState<boolean>(false);
  const [checkContentReply, setCheckContentReply] = useState<boolean>(false);
  const styles = useStyles();
  const { appBgChat } = useAppSelector(state => state.communityReducer);
  const { t } = useTranslation();
  const { firebaseConfig } = useAppSelector(state => state.globalReducer);

  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    let arr = [...messages];
    for (let i = 0; i < messages.length; i++) {
      if (idMessText === messages[i]._id || idMessText === messages[i]._idCdn) {
        arr = messages.map((item: any) => ({
          ...item,
          contentReply: messages[i],
        }));
        setCheckContentReply(true);
      }
    }
    setlistMessReply(arr);
  }, []);

  const handleDeleteMess = () => {
    onDeleteMessage(itemRoomId, idMessage);
  };

  const handleRecallMess = () => {
    onRecallMessage(itemRoomId, idMessage);
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

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  const renderParseText = (txt: string) => {
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

  const renderMessageReply = (item: any, index: number) => {
    return (
      <View key={index}>
        {item._id === item.contentReply._id ? (
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
            style={{ paddingVertical: 8 }}
          >
            <>
              <Row start>
                <Row style={screenStyles.pH5}>
                  <View
                    style={{
                      height: 44,
                      width: 3,
                      backgroundColor: '#0080F6',
                      marginLeft: 10,
                    }}
                  />
                  {item.type === 'image' ? (
                    <>
                      <View style={styles.imgRepLy}>
                        <ImageHelper
                          source={{ uri: textCoppy }}
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
                              h46
                              w500
                            >
                              {convertUser(item.name)}
                            </CText>
                          </View>
                          <CText numberOfLines={1} h46 color={colors.c667085}>
                            {t('communityChat.home.lastMessageImage')}
                          </CText>
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      {item.type === 'video' ? (
                        <>
                          <View style={styles.imgPin}>
                            <Video
                              style={[screenStyles.fillParent]}
                              source={{ uri: textCoppy }}
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
                                  h46
                                  w500
                                >
                                  {convertUser(item.name)}
                                </CText>
                              </View>
                              <CText
                                numberOfLines={1}
                                h46
                                color={colors.c667085}
                              >
                                {'[Video]'}
                              </CText>
                            </View>
                          </View>
                        </>
                      ) : (
                        <>
                          {item.type === 'media' ? (
                            <View style={screenStyles.pH8}>
                              <View style={screenStyles.pV4}>
                                <View style={{ paddingVertical: 4 }}>
                                  <CText
                                    numberOfLines={1}
                                    h46
                                    w500
                                    color={appBgChat.txtLeftColor}
                                  >
                                    {convertUser(item.name)}
                                  </CText>
                                </View>
                                <CText
                                  numberOfLines={1}
                                  h46
                                  color={colors.c667085}
                                >
                                  {t('communityChat.listPin.imgVideo')}
                                </CText>
                              </View>
                            </View>
                          ) : (
                            <>
                              {item.type === 'file' ? (
                                <View style={screenStyles.pH8}>
                                  <View style={screenStyles.pV4}>
                                    <View style={{ paddingVertical: 4 }}>
                                      <CText
                                        numberOfLines={1}
                                        h46
                                        w500
                                        color={appBgChat.txtLeftColor}
                                      >
                                        {convertUser(item.name)}
                                      </CText>
                                    </View>
                                    <CText
                                      numberOfLines={1}
                                      h46
                                      color={colors.c667085}
                                    >
                                      {'[File]'}
                                    </CText>
                                  </View>
                                </View>
                              ) : (
                                <>
                                  {item.type === 'voice' ? (
                                    <View style={screenStyles.pH8}>
                                      <View style={screenStyles.pV4}>
                                        <View style={{ paddingVertical: 4 }}>
                                          <CText
                                            numberOfLines={1}
                                            h46
                                            w500
                                            color={appBgChat.txtLeftColor}
                                          >
                                            {convertUser(item.name)}
                                          </CText>
                                        </View>
                                        <CText
                                          numberOfLines={1}
                                          h46
                                          color={colors.c667085}
                                        >
                                          {t(
                                            'communityChat.home.lastMessageVoice',
                                          )}
                                        </CText>
                                      </View>
                                    </View>
                                  ) : (
                                    <View style={screenStyles.pH8}>
                                      <View style={screenStyles.pV4}>
                                        <View style={{ paddingVertical: 4 }}>
                                          <CText
                                            numberOfLines={1}
                                            h46
                                            w500
                                            color={appBgChat.txtLeftColor}
                                          >
                                            {convertUser(item.name)}
                                          </CText>
                                        </View>
                                        {item.contentReply.text.includes(
                                          'idTag',
                                        ) ? (
                                          <CText
                                            numberOfLines={1}
                                            h46
                                            color="#667085"
                                          >
                                            {
                                              JSON.parse(item.contentReply.text)
                                                .content
                                            }
                                          </CText>
                                        ) : (
                                          <CText
                                            numberOfLines={1}
                                            h46
                                            color="#667085"
                                          >
                                            {item.contentReply.text}
                                          </CText>
                                        )}
                                      </View>
                                    </View>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* <CText h46 color='black'>{item.name}</CText> */}
                </Row>
              </Row>
              <View
                style={{ paddingTop: 5, paddingHorizontal: 6, marginLeft: 12 }}
              >
                {renderParseText(listMessReply[0]?.text.replace(/[\"\"]/g, ''))}
                <View style={{ right: 5 }}>
                  <Row end style={{ paddingBottom: 4, top: 5 }}>
                    <CText style={{ right: 4 }} w500 h7 color={colors.c667085}>
                      {time}
                    </CText>
                    {checkUser ? (
                      idMessage === idMessageAll ? (
                        <Image
                          source={images.community.icon_sent}
                          style={screenStyles.box16}
                          resizeMode="contain"
                        />
                      ) : seenMessage ? (
                        <Image
                          source={images.community.seenMessage}
                          style={screenStyles.box16}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={images.community.icon_received}
                          style={screenStyles.box16}
                          resizeMode="contain"
                        />
                      )
                    ) : null}
                  </Row>
                </View>
              </View>
            </>
          </Pressable>
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
            width: ScreenWidth / 1.3 + 20,
            borderRadius: 13,
            justifyContent: 'center',
            backgroundColor: appBgChat.bgRightColor,
            left: 10,
          }}
        >
          {listMessReply.map(renderMessageReply)}
        </View>
      ) : null}
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

export default ReplyMessageLocal;

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
  imgPin: {
    width: 40,
    height: 40,
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
    textDecorationLine: 'underline' as const,
    // fontWeight: "500",
  },
}));
