////////
import { CHeader, IconType, IconX, ImageHelper } from '@/components';
import {
  ScreenWidth,
  images,
  isIOS,
  keyExtractor,
  screenStyles,
} from '@/configs';
import { PAGINATION, STORAGEKEY } from '@/constants';
import { resetMessages, resetlistRoom } from '@/redux/slices/socketioSlice';
import { store } from '@/redux/store';
import { useAppSelector } from '@/redux/store/customReduxHook';
import socketService from '@/socketio';
import {
  getObjectData,
  getStringData,
  storeObjectData,
  storeStringData,
} from '@/storages';
import { CEmptyData, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  RefreshControl,
  TextInput,
  View,
} from 'react-native';
import Modal from '@gadhiyamanan/react-native-modal';
import Video from 'react-native-video';

export const ShareMessage = ({
  isVisible,
  hideModal,
  textCoppy,
  typeMessage,
}: any) => {
  //a5e01b34-bf52-498f-8830-5fee6a3d0cff
  const {
    theme: { colors },
  } = useTheme();
  const { listRoomCreate } = useAppSelector(state => state.socketioReducer);

  const { reloadConnectSocket } = useAppSelector(state => state.globalReducer);

  const { t } = useTranslation();
  const fbEl = useRef<any>(null);

  const styles = useStyles();

  const [textChange, setTextChange] = useState<any>('');

  const [listCreateRoom, setlistCreateRoom] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);
  const [finalLoad, setFinalLoad] = useState(false);

  const [selectedItems, setSelectedItems] = useState<any>([]);

  const getListRoomApi = (_offset: number) => {
    socketService.emitListRoom(PAGINATION.ITEMS_100, _offset);
  };

  useEffect(() => {
    const processAPIListCreate = async () => {
      const listRoom = await getObjectData(STORAGEKEY.LIST_ROOM);
      getListRoomApi(0);
      if (listRoom?.items.length > 0) {
        for (let i = 0; i < listRoom.items.length; i++) {
          if (listRoom.items[i].type === 'Room') {
            socketService.emitRejoinRoom();
          }
        }
        // setlistCreateRoom(removeDuplicates(listRoom.items))
      }
    };
    processAPIListCreate();
  }, [reloadConnectSocket]);

  useEffect(() => {
    const processAPIListRoom = async () => {
      const { loading, data, error } = listRoomCreate;
      const checkFirst = getStringData(STORAGEKEY.CHECKLOCAL_FIRST);
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let total = data.total || 0;
            let newItems = data.items || [];
            // setTotalListRoom(data.total)
            let sizeResponse = newItems.length;
            let arr = JSON.parse(JSON.stringify(newItems));
            if (offset === 0) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].invite_status === 1 && arr[i].is_autojoin === 0) {
                  socketService.emitJoinSocketAuto(arr[i].id, 1);
                }
              }
              setlistCreateRoom(arr);
              if (checkFirst !== 'true') {
                await storeObjectData(STORAGEKEY.LIST_ROOM, {
                  items: arr,
                });
              }
            } else {
              if (checkFirst !== 'true') {
                await storeObjectData(STORAGEKEY.LIST_ROOM, {
                  items: [...listCreateRoom, ...newItems],
                });
              }
              setlistCreateRoom(
                removeDuplicates([...listCreateRoom, ...newItems]),
              );
            }
            setFinalLoad(sizeResponse < PAGINATION.ITEMS_20);
            if (total === [...listCreateRoom, ...newItems].length) {
              storeStringData(STORAGEKEY.CHECKLOCAL_FIRST, 'true');
            }
          } else {
            setFinalLoad(true);
          }
          setFirstRender(false);
          setRefreshing(false);
          store.dispatch(resetlistRoom(null));
        } else if (error) {
          setFirstRender(false);
          setRefreshing(false);
          store.dispatch(resetlistRoom(null));
        }
      }
    };
    processAPIListRoom();
  }, [listRoomCreate]);

  // useEffect(() => {
  //     const processAPIListRoom = async () => {
  //         const { loading, data, error } = listRoomCreate;
  //         console.log("🚀 ~ processAPIListRoom ~ data:", data)
  //         if (!loading) {
  //             if (data) {
  //                 if (data && data.items) {
  //                     let newItems = data.items || [];
  //                     let sizeResponse = newItems.length;
  //                     let arr = JSON.parse(JSON.stringify(newItems))
  //                     if (offset === 0) {
  //                         for (let i = 0; i < arr.length; i++) {
  //                             if (arr[i].id === itemRoomId) {
  //                                 arr.splice(i, 1);
  //                             }
  //                         }
  //                         setlistCreateRoom(arr);
  //                     } else {
  //                         setlistCreateRoom(removeDuplicates([...listCreateRoom, ...newItems]));
  //                     }
  //                     setFinalLoad(sizeResponse < PAGINATION.ITEMS_20);
  //                 } else {
  //                     setFinalLoad(true);
  //                 }

  //                 setFirstRender(false);
  //                 setRefreshing(false);
  //             } else if (error) {
  //                 setFirstRender(false);
  //                 setRefreshing(false);
  //             }
  //         }
  //     };
  //     processAPIListRoom();
  // }, [listRoomCreate]);

  //ACTION

  function removeDuplicates(arr: any) {
    return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
  }

  const handleCheckBox = (item: any) => {
    let arr = [...selectedItems];
    if (selectedItems.includes(item)) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === item.id) {
          arr.splice(i, 1);
          break;
        }
      }
    } else {
      arr.push(item);
    }
    setSelectedItems(arr);
  };

  const handleSendMessage = () => {
    let arr = [...selectedItems];
    if (arr.length > 0) {
      if (textChange !== '') {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type === '1-1') {
            socketService.emitMessageSocketUser(
              textChange,
              'text',
              arr[i].id,
              arr[i].to,
              moment().unix() + '.text',
            );
            store.dispatch(resetMessages(null));
          } else {
            socketService.emitMessageSocketGroup(
              textChange,
              'text',
              arr[i].id,
              moment().unix() + '.text',
            );
            //
            store.dispatch(resetMessages(null));
          }
        }
      }
      if (typeMessage === 'text') {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type === '1-1') {
            socketService.emitMessageSocketUser(
              textCoppy,
              'text',
              arr[i].id,
              arr[i].to,
              moment().unix() + '.text',
            );
            store.dispatch(resetMessages(null));
          } else {
            socketService.emitMessageSocketGroup(
              textCoppy,
              'text',
              arr[i].id,
              moment().unix() + '.text',
            );
            store.dispatch(resetMessages(null));
          }
        }
      } else if (typeMessage === 'image') {
        let arrImage: { filename: any; data: any; type: any }[] = [];
        let items = {
          filename: moment().unix(),
          data: textCoppy,
          type: 'image',
        };
        arrImage.push(items);
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type === '1-1') {
            socketService.emitMessageSocketImage(
              arrImage,
              'image',
              arr[i].id,
              arr[i].id,
              moment().unix() + '.image',
            );
            store.dispatch(resetMessages(null));
          } else {
            socketService.emitMessageSocketGroupImage(
              arrImage,
              'image',
              arr[i].id,
              moment().unix() + '.image',
            );
            store.dispatch(resetMessages(null));
          }
        }
      } else if (typeMessage === 'video') {
        let arrVideo: { filename: any; data: any; type: any }[] = [];
        let items = {
          filename: moment().unix(),
          data: textCoppy,
          type: 'video',
        };
        arrVideo.push(items);
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type === '1-1') {
            socketService.emitMessageSocketVideo(
              arrVideo,
              'video',
              arr[i].id,
              arr[i].id,
              moment().unix() + '.video',
            );
            store.dispatch(resetMessages(null));
          } else {
            socketService.emitMessageSocketGroupVideo(
              arrVideo,
              'video',
              arr[i].id,
              moment().unix() + '.video',
            );
            store.dispatch(resetMessages(null));
          }
        }
      } else if (typeMessage === 'file') {
        let items = {
          filename: textCoppy.filename,
          data: textCoppy.data,
          type: 'file',
        };
        // arrFile.push(items);
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type === '1-1') {
            socketService.emitMessageSocketFile(
              items,
              'file',
              arr[i].id,
              arr[i].id,
              moment().unix() + '.file',
            );
            store.dispatch(resetMessages(null));
          } else {
            socketService.emitMessageSocketFileGroup(
              items,
              'file',
              arr[i].id,
              moment().unix() + '.file',
            );
            store.dispatch(resetMessages(null));
          }
        }
      } else if (typeMessage === 'voice') {
        let items = {
          filename: textCoppy.filename,
          data: textCoppy.data,
          type: 'voice',
          time: textCoppy.time,
        };
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type === '1-1') {
            socketService.emitMessageSocketFile(
              items,
              'voice',
              arr[i].id,
              arr[i].id,
              moment().unix() + '.voice',
            );
            store.dispatch(resetMessages(null));
          } else {
            socketService.emitMessageSocketFileGroup(
              items,
              'voice',
              arr[i].id,
              moment().unix() + '.voice',
            );
            store.dispatch(resetMessages(null));
          }
        }
      } else if (typeMessage === 'media') {
        let items = [
          {
            filename: textCoppy.filename,
            data: textCoppy.data,
            type: textCoppy.type,
            time: textCoppy.time,
          },
        ];
        if (textCoppy.type === 'image') {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].type === '1-1') {
              socketService.emitMessageSocketImage(
                items,
                'image',
                arr[i].id,
                arr[i].id,
                moment().unix() + '.image',
              );
              store.dispatch(resetMessages(null));
            } else {
              socketService.emitMessageSocketGroupImage(
                items,
                'image',
                arr[i].id,
                moment().unix() + '.image',
              );
              store.dispatch(resetMessages(null));
            }
          }
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].type === '1-1') {
              socketService.emitMessageSocketFile(
                items,
                'video',
                arr[i].id,
                arr[i].id,
                moment().unix() + '.video',
              );
              store.dispatch(resetMessages(null));
            } else {
              socketService.emitMessageSocketFileGroup(
                items,
                'video',
                arr[i].id,
                moment().unix() + '.video',
              );
              store.dispatch(resetMessages(null));
            }
          }
        }
      }
      setSelectedItems([]);
      hideModal();
    }
  };

  const handleLoadMore = async () => {
    if (!finalLoad && !onEndReached) {
      const _offset = offset + PAGINATION.ITEMS_20;
      setOffset(_offset);
      getListRoomApi(_offset);
    } else {
      // await storeStringData(STORAGEKEY.CHECKLOCAL_FIRST, 'true');
      // if(listCreateRoom.length === ){
      // }
    }
  };

  const _renderLoadingFooter = () => {
    return !finalLoad && !onEndReached ? (
      <Row style={screenStyles.mT5}>
        <ActivityIndicator size="small" color={colors.primary} />
      </Row>
    ) : null;
  };

  const onRefresh = () => {
    setOffset(0);
    setRefreshing(true);
    getListRoomApi(0);
  };

  const handleFileContentType = (name: any) => {
    switch (name) {
      case 'pdf':
        return images.community.file_pdf;
      case 'doc':
        return images.community.file_doc;
      case 'docx':
        return images.community.file_docx;
      case 'xls':
        return images.community.file_xsl;
      case 'xlsx':
        return images.community.file_xsl;
      default:
        return images.community.file_pdf;
    }
  };

  //RENDER
  const renderLeftHead = () => (
    <Pressable onPress={hideModal} style={styles.leftWrapper}>
      <Row>
        <IconX
          type={IconType.ANT_DESIGN}
          name={'close'}
          size={24}
          color={colors.c667085}
          style={{ marginLeft: 3 }}
        />
        <View style={{ paddingHorizontal: 13 }}>
          <CText h3 w500 color={colors.c101828}>
            {t('communityChat.shareMessage.title')}
          </CText>
          <CText h56 color={colors.cb2b2b2}>{`${t(
            'communityChat.shareMessage.chosse',
          )}: ${selectedItems.length}`}</CText>
        </View>
      </Row>
    </Pressable>
  );

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  const renderItemRoom = ({ item, index }: any) => {
    const date = Date.now();
    const { title, thumbnail, invite_status } = item;
    return (
      <>
        {/* {invite_status !== 2 ? (
                    invite_status === 1 ? */}
        <Pressable
          onPress={() => {
            handleCheckBox(item);
          }}
        >
          <Row
            start
            style={[
              screenStyles.pH12,
              screenStyles.pV10,
              { borderBottomWidth: 1, borderBottomColor: colors.cF2F4F7 },
            ]}
          >
            {!selectedItems.includes(item) ? (
              <IconX
                name={'check-box-outline-blank'}
                type={IconType.MATERIAL_ICONS}
                color={colors.black}
                size={26}
              />
            ) : (
              <IconX
                name={'checkbox'}
                type={IconType.IONICONS}
                color={colors.primary}
                size={26}
              />
            )}
            {/* <IconX name={'circle'} origin={ICON_TYPE.FEATHER_ICONS} color={'#CCCCCC'} size={26} /> */}
            <Pressable
              style={[
                screenStyles.rowStart,
                screenStyles.flex1,
                { paddingHorizontal: 13 },
              ]}
              onPress={() => {
                handleCheckBox(item);
              }}
            >
              <View style={[styles.avatar, screenStyles.centerWrap]}>
                <ImageHelper
                  source={{ uri: thumbnail }}
                  renderErrorImage={renderErrorImage}
                />
              </View>
              <View style={[screenStyles.pH10, screenStyles.flex1]}>
                <CText h5 w600 numberOfLines={2} color={colors.black}>
                  {title || ''}
                </CText>
              </View>
            </Pressable>
          </Row>
        </Pressable>
        {/* : null ) : null} */}
      </>
    );
  };

  const renderBody = () => {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={screenStyles.flexGrowBottom}
          data={listCreateRoom}
          extraData={listCreateRoom}
          keyExtractor={keyExtractor}
          renderItem={renderItemRoom}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return <CEmptyData />;
          }}
          scrollEventThrottle={isIOS ? 160 : 16}
          onMomentumScrollBegin={() => {
            setOnEndReached(false);
          }}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.grey4}
            />
          }
          ListFooterComponent={_renderLoadingFooter}
        />

        <View style={styles.bottomgoback}></View>
        <View style={styles.backgroundbottom}>
          <Row between>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 15,
                width: '80%',
              }}
            >
              {typeMessage === 'image' ? (
                <Row start style={{ paddingHorizontal: 20 }}>
                  <View style={styles.imgPin}>
                    <ImageHelper
                      source={{ uri: textCoppy }}
                      renderErrorImage={renderErrorImage}
                    />
                  </View>
                  <CText numberOfLines={1} color={colors.c101828}>
                    {t('communityChat.home.lastMessageImage')}
                  </CText>
                </Row>
              ) : (
                <>
                  {typeMessage === 'video' ? (
                    <Row start style={{ paddingHorizontal: 20 }}>
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
                      <CText numberOfLines={1} h5 color={colors.c101828}>
                        {'Video'}
                      </CText>
                    </Row>
                  ) : typeMessage === 'file' ? (
                    <Row start>
                      <View style={{ paddingHorizontal: 13 }}>
                        <Row start>
                          <Image
                            source={handleFileContentType(
                              textCoppy.filename.split('.').pop(),
                            )}
                            style={{ height: 38, width: 34 }}
                          />
                          <View style={{ paddingHorizontal: 7 }}>
                            <CText numberOfLines={1} h56 color={colors.c101828}>
                              {textCoppy.filename}
                            </CText>
                          </View>
                        </Row>
                      </View>
                    </Row>
                  ) : typeMessage === 'voice' ? (
                    <Row start>
                      <View
                        style={{
                          paddingHorizontal: 13,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Row start>
                          <Image
                            source={images.community.share_voice}
                            style={screenStyles.box36}
                          />
                          <View style={{ paddingHorizontal: 7 }}>
                            <CText numberOfLines={1} h56 color={colors.c101828}>
                              {t('communityChat.home.lastMessageVoice')}
                            </CText>
                          </View>
                        </Row>
                      </View>
                    </Row>
                  ) : typeMessage === 'media' ? (
                    textCoppy.type === 'image' ? (
                      <Row start style={{ paddingHorizontal: 20 }}>
                        <View style={styles.imgPin}>
                          <ImageHelper
                            source={{ uri: textCoppy.data }}
                            renderErrorImage={renderErrorImage}
                          />
                        </View>
                        <CText numberOfLines={1} color={colors.c101828} h5>
                          {t('communityChat.home.lastMessageImage')}
                        </CText>
                      </Row>
                    ) : (
                      <Row start style={{ paddingHorizontal: 20 }}>
                        <View style={styles.imgPin}>
                          <Video
                            style={[screenStyles.fillParent]}
                            source={{ uri: textCoppy.data }}
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
                        <CText numberOfLines={1} color={colors.c101828} h5>
                          {t('communityChat.home.lastMessageVideo')}
                        </CText>
                      </Row>
                    )
                  ) : (
                    <CText numberOfLines={1}>{textCoppy}</CText>
                  )}
                </>
              )}
              <View>
                <TextInput
                  ref={fbEl}
                  style={styles.input}
                  onChangeText={value => {
                    setTextChange(value);
                  }}
                  value={textChange}
                  multiline={true}
                  placeholder={t('communityChat.shareMessage.description')}
                  returnKeyType={'next'}
                />
              </View>
            </View>
            <View style={styles.bottomgoback}>
              <Pressable
                onPress={() => {
                  handleSendMessage();
                }}
              >
                <View style={styles.shadowGoback}>
                  {/* {selectedItems.length > 0 ? ( */}
                  <View
                    style={[
                      styles.view40,
                      {
                        backgroundColor: selectedItems.length
                          ? colors.primary
                          : colors.cF2F4F7,
                      },
                    ]}
                  >
                    <IconX
                      style={styles.iconBack}
                      type={IconType.IONICONS}
                      name={'send'}
                      size={22}
                      color={colors.white}
                    />
                  </View>
                  {/* ):null} */}
                </View>
              </Pressable>
              {/* } */}
            </View>
          </Row>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <CHeader
          leftComponentOnPress={hideModal}
          leftComponent={renderLeftHead()}
          isBorderBottom
          rightComponentDisable
          // rightComponent={renderRightHead()}
        />

        {/* <Divider color={colors.cD0D5DD} width={1} /> */}
        <KeyboardAvoidingView behavior={'padding'} style={screenStyles.flex1}>
          {renderBody()}
        </KeyboardAvoidingView>

        {/* {renderButton()} */}
      </View>
    );
  };

  return (
    <Modal
      animationIn={'fadeInUp'}
      animationOut={'zoomOut'}
      isVisible={isVisible}
      onBackdropPress={hideModal}
      style={screenStyles.modalFullScreen}
    >
      {renderContent()}
    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  leftWrapper: {
    position: 'absolute' as const,
    left: 16,
    ...screenStyles.rowCenter,
    alignItems: 'center' as const,
  },
  bottomgoback: {
    width: '20%' as const,
    alignItems: 'center' as const,
  },
  backgroundbottom: {
    bottom: 0,
    width: ScreenWidth,
    borderStartEndRadius: 10,
    borderStartStartRadius: 10,
    height: 128,
    borderColor: colors.black,
    ...screenStyles.shadow,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  shadowGoback: {
    borderRadius: 20,
    ...screenStyles.shadow,
    overflow: 'hidden' as const,
  },
  iconBack: { left: 10, top: 9, zIndex: 100 },
  view40: {
    height: 40,
    width: 40,
  },
  input: {
    height: 40,
    margin: 12,
    color: colors.c101828,
  },
  imgPin: {
    width: 40,
    height: 40,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderRadius: 10,
    right: 10,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
}));
