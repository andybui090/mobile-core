import {
  APILoading,
  BottomSheetReport,
  CHeader,
  ConfirmModal,
  IconType,
  IconX,
  ImageHelper,
  Toast,
  Wrapper,
} from '@/components';
import {
  ScreenWidth,
  changeAlias,
  conventUserNameChat,
  fonts,
  getBottomSpace,
  ifIphoneX,
  images,
  isEmptyArray,
  isIOS,
  randomIntFromInterval,
  replaceSpace,
  screenStyles,
  setMomentLocale,
  showNotiLocal,
  showToast,
  timeDifferenceV2,
} from '@/configs';
import { CHAT_THEME, PAGINATION, STORAGEKEY } from '@/constants';
import { AppContext } from '@/contexts';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import {
  getListEmoji,
  getListHistoryChat,
  getListMemberGroup,
  getRequestFriendInviteds,
  getRequestFriendWaitings,
  getRequestFriends,
  postMessageSeen,
  resetHistoryChat,
  setAppChatBg,
} from '@/redux/slices/communitySlice';
import { getListReport } from '@/redux/slices/globalSlice';
import {
  resetCheckErorrRemoveRoom,
  resetMessages,
  resetPinMessage,
  resetRoomDetal,
  resetSocketjoinRoom,
  resetTransferRoom,
  resetUserDisconnect,
  resetbotTyping,
  resetlistRoom,
  updateLocalListRoomChat,
} from '@/redux/slices/socketioSlice';
import { store } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import APIUpload from '@/services/api-upload';
import socketService from '@/socketio';
import { getObjectData, storeObjectData, storeStringData } from '@/storages';
import { CLoading, CText, Row } from '@/utils';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
// import {Clipboard} from '@react-native-clipboard/clipboard/dist/Clipboard';
import { readFile } from '@dr.pogodin/react-native-fs';
import { pick, types } from '@react-native-documents/picker';
import { makeStyles, useTheme } from '@rneui/themed';
import { Buffer } from 'buffer';
import moment from 'moment';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Message,
  Send,
} from 'react-native-gifted-chat';
import ParsedText from 'react-native-parsed-text';
import { URL } from 'react-native-url-polyfill';
import ChatFooter from './components/ChatFooter';
import AddFriend from './components/addFriend';
import { tagUser } from './components/convertTagUser';
import AudioSelect from './components/history/AudioSelect';
import FileSelect from './components/history/FileSelect';
import MediaSelect from './components/history/MediaSelect';
import ReplyMessage from './components/history/ReplyMessage';
import VideoImgSelect from './components/history/VideoImgSelect';
import VideoSelect from './components/history/VideoSelect';
import AudioLocal from './components/local/AudioLocal';
import { DetailFile } from './components/local/DetailFile';
import { DetailImgVideo } from './components/local/DetailImgVideo';
import FileLocal from './components/local/FileLocal';
import ImgLocal from './components/local/ImgLocal';
import MediaImgVideoLocal from './components/local/MediaImgVideoLocal';
import ReplyMessageLocal from './components/local/ReplyMessageLocal';
import VideoLocal from './components/local/VideoLocal';
import MessagePin from './components/messagePin';
import { MessageModal } from './modal/MessageModal';
import ModalLike from './modal/ModalLike';
import { EditRoom } from './modal/editRoom';
import { ErrorRoom } from './modal/errorRoom';
import { BottomSheetListEmojji } from './modal/listEmoji';
import { ModalListMember } from './modal/listMember';
import { ModalListPin } from './modal/listPin';
import { MediaLocal } from './modal/mediaLocal';
import { OwnerDeleteMessage } from './modal/ownerDeleteMessage';
import { ModalSettingChat } from './modal/settingChat';
import { ShareMessage } from './modal/shareMessage';
import { TitleLiveChat } from './modal/titleLiveChat';
import { BottomSheetVoice } from './modal/voice';

const ChatScreen: React.FC<any> = ({ navigation, route }: any) => {
  const {
    theme: { colors },
  } = useTheme();

  const { i18n } = useTranslation();

  useEffect(() => {
    setMomentLocale(i18n.language); // e.g., 'ja', 'en', 'fr'
  }, [i18n.language]);

  const { user, isDoctor, isNurse } = useContext(AppContext);
  const { firebaseConfig } = useAppSelector(state => state.globalReducer);
  const [isOnlyView, setIsOnlyView] = useState(true);

  const { t } = useTranslation();
  const styles = useStyles();

  const toastEl = useRef<any>(null);
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<any>(null);
  const bottomSheetRef = useRef<any>(null);
  const bottomSheetEmojiRef = useRef<any>(null);
  const bottomSheetReportRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  const _badWords = t('common.badwords').split(',');

  const [height] = useKeyboardHeight();

  //PROPS
  const {
    socketmessage,
    isTyping,
    uploadFile,
    recallMess,
    removeRoom,
    socketUserOnline,
    socketuserDisconnect,
    socketuserSeenMessage,
    socketjoinRoom,
    socketdeleteRoom,
    socketOwnerDeleteMessage,
    socketPinMessage,
    socketAddFriends,
    socketleaveRoom,
    editRoom,
    checkErorrRemoveRoom,
    botResponse,
    botTyping,
    likeEmoji,
    recallEmoji,
    liveEnd,
    liveVodReady,
    liveContinue,
    detailRoom,
    getViewerLive,
    dataEndRoomChat,
  } = useAppSelector(state => state.socketioReducer);

  const {
    listHistoryChat,
    listMemberGroup,
    getRequestFriendInvited,
    getRequestFriendWaiting,
    getRequestFriend,
    appBgChat,
    listEmoji,
    currentToChatInfo,
    dataCompleteChatPremium,
  } = useAppSelector(state => state.communityReducer);

  const { appStateStatus, reloadConnectSocket } = useAppSelector(
    state => state.globalReducer,
  );

  const [listHistoryChatRoom, setListHistoryChatRoom] = useState<any[]>([]);

  const [offset, setOffset] = useState(0);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [finalLoad, setFinalLoad] = useState(false);

  const params = route?.params || {};
  const [item, setItem] = useState<any>(params.item || {});
  const [itemRoomId, setItemRoomId] = useState<any>(
    params.roomId || params.item?.id,
  );
  const [checkCreateRoom, setCheckCreateRoom] = useState<any>(
    params.checkCreateRoom,
  );
  const [listCreateRoom, setlistCreateRoom] = useState<any[]>(
    params.listCreateRoom || [],
  );
  const [listTotalMember, setListTotalMember] = useState<any[]>([]);
  const [listTotalMemberChat, setListTotalMemberChat] = useState<any>('');

  const [listUserOnline, setListUserOnline] = useState<any[]>([]);
  const [checTimekUserOnl, setcheckTimeUserOnl] = useState<number>(0);

  const [isOnline, setIsOnline] = useState<boolean>(false);

  const [fileUriFNS, setFileUriFNS] = useState<any>('');
  const [fileTypeFNS, setFileTypeFNS] = useState<any>('');
  const [fileNameFNS, setFileNameFNS] = useState<any>('');
  const [fileSizeFNS, setFileSizeFNS] = useState<any>('');

  const [heightLocalImg, setheightLocalImg] = useState<any>('');

  const [listimage, setListimage] = useState<any>([]);
  const [imageUri, setImageUri] = useState<any>([]);

  const [imageUriMedia, setImageUriMedia] = useState<any>([]);
  const [listimageLocal, setListimageLocal] = useState<any>([]);

  const [mediaLocalSocket, setMediaLocalSocket] = useState<any>([]);

  const [upDateVideoIsLoading, setUpDateVideoIsLoading] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);

  // useEffect(() => {
  //   console.log("======== ",messages);
  // }, [messages]);


  const [messagesPin, setMessagesPin] = useState<any>([]);

  const [textMessages, setTextMessages] = useState<any>('');
  const [uriVoice, setUriVoice] = useState<any>('');
  const [timeVoice, setTimeVoice] = useState<any>('');

  const [replyArrId, setReplyArrId] = useState<any>([]);

  const [clientMsgIdVoice, setClientMsgIdVoice] = useState<any>('');
  const [clientMsgIdImg, setClientMsgIdImg] = useState<any>('');
  const [clientMsgIdFile, setClientMsgIdFile] = useState<any>('');
  const [clientMsgIdMedia, setClientMsgIdMedia] = useState<any>('');

  const [idMessageAll, setIdMessageAll] = useState<any>('');
  const [seenMessage, setSeenMessage] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalMedia, setShowModalMedia] = useState<boolean>(false);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [showModalDetailV2, setShowModalDetailV2] = useState<boolean>(false);

  const [showModalDetailFile, setShowModalDetailFile] =
    useState<boolean>(false);

  const [imgDetail, setImgDetail] = useState<any>([]);
  const [fileUriDetail, setFileUriDetail] = useState<any>('');

  const [type, setType] = useState<boolean>(false);

  const [isgoBack, setIsgoBack] = useState(false);

  const [apiLoading, setApiLoading] = useState(false);
  const [showMessModal, setShowMessModal] = useState<boolean>(false);
  const [showMessReply, setShowMessReply] = useState<boolean>(false);
  const [showShareMess, setShowShareMess] = useState<boolean>(false);
  const [showOwnerMess, setShowOwnerMess] = useState<boolean>(false);
  const [checkisPaste, setCheckisPaste] = useState<boolean>(false);

  const [showModalNotiMess, setshowModalNotiMess] = useState<boolean>(false);
  const [showEditRoom, setShowEditRoom] = useState<boolean>(false);

  const [showErrorRoom, setShowErrorRoom] = useState<boolean>(false);

  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [itemChooseEmoji, setItemChooseEmoji] = useState<any[]>([]);

  const [showListPin, setShowListPin] = useState<boolean>(false);
  const [showModalListMember, setShowModalListMember] =
    useState<boolean>(false);
  const [listOwner, setListOwner] = useState<any>({});

  const [checkOnlyDelete, setCheckOnlyDelete] = useState<boolean>(false);

  const [idMessText, setidMessText] = useState<any>('');
  const [textCoppy, setTextCoppy] = useState<any>('');
  const [userNameCoppy, setUserNameCoppy] = useState<any>('');
  const [typeMessage, setTypeMessage] = useState<any>('');

  const [checkMessageDelete, setCheckMessageDelete] = useState<boolean>(false);
  const [checkUser, setCheckUser] = useState<boolean>(false);
  const [checIsPin, setCheckIsPin] = useState<boolean>(false);

  const [checkOwner, setCheckOwner] = useState<boolean>(false);

  const [listFriends, setListFriends] = useState<any[]>([]);
  const [listFriendsInvited, setListFriendsInvited] = useState<any[]>([]);
  const [listFriendsWaiting, setListFriendsWaiting] = useState<any[]>([]);

  const [checkShowAddTab, setcheckShowAddTab] = useState<boolean>(false);
  const [userTag, setUserTag] = useState<any[]>([]);

  const [checkTypingBot, setCheckTypingBot] = useState<boolean>(false);
  const [nameBot, setNameBot] = useState<any>('');

  const [yOffset, setYOffset] = useState(0);
  const [xOffset, setXOffset] = useState(0);
  const [idMessageLikeEmoji, setIdMessageLikeEmoji] = useState<any>('');
  const [arrLikeEmoji, setArrLikeEmoji] = useState<any[]>([]);
  const [textEmoji, setTextEmoji] = useState<any>('');
  const [textReplyEmoji, setReplyTextEmoji] = useState<any>('');

  const [listLikeEmoji, setlistLikeEmoji] = useState<any[]>([]);
  const [checkLikeCount, setCheckLikeCount] = useState<boolean>(false);
  const [listViewEmoji, setListViewEmoji] = useState<any[]>([]);

  const [checkErrorRoom, setCheckErrorRoom] = useState<boolean>(false);

  //@ tag
  const [textTag, setTextTag] = useState<any>('');

  //livestream
  const [textTilteLive, setTextTilteLive] = useState<any>('');
  const [listIdMember, setListIdMember] = useState<any>([]);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  // const [showPlayLiveStream, setPlayShowLiveStream] = useState<boolean>(false);
  const [isLiveStream, setIsLiveStream] = useState<boolean>(false);
  const [adaptor, setAdaptor] = useState<any>({});
  const [showtitleRoom, setShowTitleRoom] = useState<boolean>(false);
  const [countViewer, setCountViewer] = useState<number>(0);

  const [modalConfirm, setModalConfirm] = React.useState({
    isVisible: false,
    message: '',
    onCancel: () => {},
    onConfirm: () => {},
  });

  const generateRandomNumber = () => {
    return moment().unix();
  };

  const getListRequestFriends = () => {
    dispatch(getRequestFriends({}));
    dispatch(getRequestFriendWaitings({}));
    dispatch(getRequestFriendInviteds({}));
  };

  const getListMemberApi = async () => {
    const data = {};
    dispatch(
      getListMemberGroup({
        id: itemRoomId,
        data: data,
      }),
    );
    await storeStringData(STORAGEKEY.CHECK_GROUP_PRIVATE, 'false');
    // await storeObjectData(STORAGEKEY.AVATAR_LOCAL, {
    //   items: listDialogLocal,
    // });
  };

  //
  useEffect(() => {
    const processSocketEndroom = () => {
      if (item.id == dataEndRoomChat.room_id) {
        const itemClone = { ...item };
        itemClone.status = 2;
        setItem(itemClone);
        setIsOnlyView(true);
        return;
      }
    };
    if (dataEndRoomChat.room_id) {
      processSocketEndroom();
    }
  }, [dataEndRoomChat]);

  useEffect(() => {
    const checkPermisionUser = () => {
      // console.log("🚀 ~ checkPermisionUser ~ item.status:", item);
      if (item.status == 2) {
        setIsOnlyView(true);
        return;
      }
      const status = user.personalization?.status;
      if (isDoctor) {
        if (status == 1 || isNurse) {
          setIsOnlyView(false);
        }
      } else {
        if (item.is_chat == 1) {
          setIsOnlyView(false);
        }
      }
    };
    checkPermisionUser();
  }, [user.personalization, item]);

  //   useEffect(() => {
  //     setAdjustResize();
  //     return () => {
  //       setAdjustPan();
  //     };
  //   }, []);

  //kiem tra nhóm private hay kh, nếu là nhóm private thì gửi yêu càu đén owner
  useEffect(() => {
    if (item.invite_status === -1) {
      socketService.emitRoomShare(itemRoomId, user.id);
    } else {
      if (item.private !== 1) {
        socketService.emitJoinSocket(itemRoomId, 1);
      }
    }
  }, []);

  useEffect(() => {
    getListMemberApi();
  }, [socketjoinRoom, removeRoom, socketleaveRoom]);

  useEffect(() => {
    if (item.type === '1-1') {
      getListRequestFriends();
    }
  }, [socketAddFriends]);

  useEffect(() => {
    if (!textMessages.includes('mp4')) {
      setTextMessages('');
      checkScrollBottom();
    }
  }, [checkisPaste]);

  useEffect(() => {
    const processAPIListRoom = () => {
      dispatch(getListEmoji({}));
    };
    processAPIListRoom();
  }, []);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = listEmoji;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            setlistLikeEmoji(newItems);
          } else {
            setlistLikeEmoji([]);
          }
        } else if (error) {
        }
      }
    };
    processAPIListRoom();
  }, [listEmoji]);

  useEffect(() => {
    const processAPIListRoom = async () => {
      const { loading, data, error } = listMemberGroup;

      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let arr = JSON.parse(JSON.stringify(newItems));
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === user.id) {
                setListOwner(arr[i].role);
              }
            }
          } else {
            setListOwner([]);
          }
        } else if (error) {
          console.log('🚀 ~ processAPIListRoom ~ error:', error);
        }
      }
    };
    processAPIListRoom();
  }, [listMemberGroup]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = getRequestFriend;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let sizeResponse = newItems.length;
            if (offset === 0) {
              setListFriends(newItems);
            } else {
              setListFriends([...listFriends, ...newItems]);
            }
          } else {
          }
        } else if (error) {
          // setFirstRender(false);
        }
      }
    };
    processAPIListRoom();
  }, [getRequestFriend]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = getRequestFriendInvited;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let sizeResponse = newItems.length;
            if (offset === 0) {
              setListFriendsInvited(newItems);
            } else {
              setListFriendsInvited([...listFriendsInvited, ...newItems]);
            }
          } else {
          }
        } else if (error) {
        }
      }
    };
    processAPIListRoom();
  }, [getRequestFriendInvited]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = getRequestFriendWaiting;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let sizeResponse = newItems.length;
            if (offset === 0) {
              setListFriendsWaiting(newItems);
            } else {
              setListFriendsWaiting([...listFriendsWaiting, ...newItems]);
            }
          } else {
          }
        } else if (error) {
        }
      }
    };
    processAPIListRoom();
  }, [getRequestFriendWaiting]);

  useEffect(() => {
    const processAPIListRoom = async () => {
      const { loading, data, error } = uploadFile;
      if (!loading) {
        if (data) {
          if (data && data.resources) {
            if (fileUriFNS) {
              let newItems = data.resources || [];
              let signedUrl = newItems.split(',');
              let parse = JSON.parse(signedUrl);
              const contentType = coverntFile(
                decodeURIComponent(fileUriFNS).split('.').pop(),
              );
              const base64 = await readFile(
                isIOS ? decodeURIComponent(fileUriFNS) : fileUriFNS,
                'base64',
              );
              const buffer = Buffer.from(base64, 'base64');
              await fetch(parse[0].signedUrl, {
                method: 'PUT',
                headers: {
                  accept: 'application/json',
                  'x-amz-acl': 'public-read',
                  'Content-Type':
                    contentType !== undefined
                      ? contentType.toString()
                      : fileTypeFNS,
                },
                body: buffer,
              })
                .then(async data => {
                  let items = {
                    filename: replaceSpace(fileNameFNS),
                    data: parse[0].src,
                    type: 'file',
                  };
                  if (item.type === '1-1') {
                    socketService.emitMessageSocketFile(
                      items,
                      'file',
                      item.id,
                      item.id,
                      clientMsgIdFile + '.file',
                    );
                    setFileUriFNS('');
                  } else {
                    socketService.emitMessageSocketFileGroup(
                      items,
                      'file',
                      item.id,
                      clientMsgIdFile + '.file',
                    );
                    setFileUriFNS('');
                  }
                  await storeStringData(STORAGEKEY.CHECK_FILE, 'false');
                })
                .catch(async e => {
                  console.log('data', e);
                  await storeStringData(STORAGEKEY.CHECK_FILE, 'false');
                });
            } else if (listimage.length > 0) {
              let arr: { filename: any; data: any; type: any }[] = [];
              let arrBuffer = [];
              const newItems = data.resources || [];
              const signedUrl = newItems.split(',');
              const parse = JSON.parse(signedUrl);
              const resultImage = await Promise.all(
                parse.map(
                  (v: any, i: number) =>
                    new Promise(async reslove => {
                      const contentType = handleImgContentType(
                        listimage[i].contentType,
                      );
                      const buffer = Buffer.from(imageUri[i], 'base64');
                      await fetch(v.signedUrl, {
                        method: 'PUT',
                        headers: {
                          'x-amz-acl': 'public-read',
                          'Content-Type': contentType,
                        },
                        body: buffer,
                      })
                        .then(data => {
                          console.log('data ====== ');
                          reslove(true);
                          let items = {
                            filename: listimage[i].name,
                            data: parse[i].src,
                            type: parse[i].type,
                          };
                          arr.push(items);
                        })
                        .catch(e => {
                          console.log('data', e), reslove(false);
                        });
                    }),
                ),
              );
              if (item.type === '1-1') {
                socketService.emitMessageSocketImage(
                  arr,
                  'image',
                  item.id,
                  item.id,
                  clientMsgIdImg + '.image',
                );
                setListimage([]);
              } else {
                socketService.emitMessageSocketGroupImage(
                  arr,
                  'image',
                  item.id,
                  clientMsgIdImg + '.image',
                );
                setListimage([]);
              }
              // }
            } else if (uriVoice !== '') {
              let newItems = data.resources || [];
              let signedUrl = newItems.split(',');
              let parse = JSON.parse(signedUrl);
              const base64 = await readFile(uriVoice, 'base64');
              const buffer = Buffer.from(base64, 'base64');
              await fetch(parse[0].signedUrl, {
                method: 'PUT',
                headers: {
                  'x-amz-acl': 'public-read',
                  'Content-Type':
                    Platform.OS === 'android' ? 'audio/mpeg' : 'audio/m4a',
                },
                body: buffer,
              })
                .then(data => {
                  let items = {
                    filename: uriVoice,
                    data: parse[0].src,
                    type: 'voice',
                    time: timeVoice,
                  };
                  if (item.type === '1-1') {
                    socketService.emitMessageSocketFile(
                      items,
                      'voice',
                      item.id,
                      item.id,
                      clientMsgIdVoice + '.voice',
                    );
                    setUriVoice('');
                  } else {
                    socketService.emitMessageSocketFileGroup(
                      items,
                      'voice',
                      item.id,
                      clientMsgIdVoice + '.voice',
                    );
                    setUriVoice('');
                  }
                })
                .catch(e => console.log('e', e));
            } else if (listimageLocal.length > 0) {
              console.log('------------------------');
              let arr: { filename: any; data: any; type: any }[] = [];
              let arrBuffer = [];
              const newItems = data.resources || [];
              const signedUrl = newItems.split(',');
              const parse = JSON.parse(signedUrl);
              const resultImage = await Promise.all(
                parse.map(
                  (v: any, i: number) =>
                    new Promise(async reslove => {
                      const contentType = handleImgContentType(
                        listimageLocal[i].contentType,
                      );
                      const buffer = Buffer.from(imageUriMedia[i], 'base64');
                      await fetch(v.signedUrl, {
                        method: 'PUT',
                        headers: {
                          'x-amz-acl': 'public-read',
                          'Content-Type': contentType,
                        },
                        body: buffer,
                      })
                        .then(data => {
                          reslove(true);
                          let items = {
                            filename: listimageLocal[i].name,
                            data: parse[i].src,
                            type: parse[i].type,
                          };
                          arr.push(items);
                        })
                        .catch(e => {
                          console.log('data', e), reslove(false);
                        });
                    }),
                ),
              );
              setMediaLocalSocket([...mediaLocalSocket, ...arr]);
              if (mediaLocalSocket.length > 0) {
                if (item.type === '1-1') {
                  socketService.emitMessageSocketImage(
                    [...mediaLocalSocket, ...arr],
                    'media',
                    item.id,
                    item.id,
                    clientMsgIdMedia + '.media',
                  );
                  setListimageLocal([]);
                } else {
                  socketService.emitMessageSocketGroupImage(
                    [...mediaLocalSocket, ...arr],
                    'media',
                    item.id,
                    clientMsgIdMedia + '.media',
                  );
                  setListimageLocal([]);
                }
              }
            }
          }
        }
      }
    };
    processAPIListRoom();
  }, [uploadFile]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = listMemberGroup;
      setListTotalMemberChat('');
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems: any = data.items || [];
            let arr = JSON.parse(JSON.stringify(newItems));
            let isFoundId = false;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].role === 'Owner') {
                if (arr[i].id === user.id) {
                  setCheckOwner(true);
                }
              }
              if (arr[i].status === 0) {
                arr.splice(i, 1);
              }
              //tracking lan dau tham gia nhom
              if (arr[i].id === user.id) {
                isFoundId = true;
              }
            }
            if (!isFoundId) {
              const params = {
                method: 'Group join',
                group_id: itemRoomId ? itemRoomId.toString() : '',
                group_name: item.title ? item.title.toString() : '',
                user_id: user.id ? user.id.toString() : '',
                timestamp: moment().unix().toString(),
              };
            } else {
              const params = {
                method: 'Group content viewed',
                group_id: itemRoomId ? itemRoomId.toString() : '',
                group_name: item.title ? item.title.toString() : '',
                user_id: user.id ? user.id.toString() : '',
                timestamp: moment().unix().toString(),
              };
            }
            setListTotalMemberChat(arr.length);
            setListTotalMember(arr);
          } else {
            setListTotalMember([]);
          }
          // setFirstRender(false);
          setRefreshing(false);
        }
      }
    };
    processAPIListRoom();
  }, [listMemberGroup]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = socketUserOnline;
      if (!loading) {
        if (data) {
          if (data && data.users) {
            const newItems = data.users || [];
            const userOnline = newItems.filter(
              (el: any) => el.userId == item.to,
            );
            if (userOnline.length > 0) {
              setIsOnline(true);
            }
            setListUserOnline(newItems);
            store.dispatch(resetUserDisconnect(null));
          }
          // setFirstRender(false);
          setRefreshing(false);
        } else {
          setListUserOnline([]);
        }
      }
    };
    processAPIListRoom();
  }, [socketUserOnline]);

  useEffect(() => {
    const processAPIListRoom = async () => {
      const { loading, data, error } = socketuserDisconnect;
      let arr = [...listUserOnline];
      if (!loading) {
        if (data) {
          if (data && data.disconnects) {
            const newItems = data.disconnects || [];
            let userOnline = newItems.filter((el: any) => el.id == item.to);
            if (userOnline.length > 0) {
              setcheckTimeUserOnl(userOnline[0].time);
              setIsOnline(false);
            }
          } else {
            setListUserOnline([]);
          }
          // setFirstRender(false);
          setRefreshing(false);
        }
      }
    };
    processAPIListRoom();
  }, [socketuserDisconnect]);

  useEffect(() => {
    const processAPIListRoom = async () => {
      const { loading, data, error } = socketuserSeenMessage;
      if (!loading) {
        if (data) {
        }
      }
      store.dispatch(resetMessages(null));
    };
    processAPIListRoom();
  }, [socketuserSeenMessage]);

  // send message chính mình
  useEffect(() => {
    const processAPIrecallMess = () => {
      const { loading, data, error } = socketmessage;
      if (data) {
        if (socketmessage?.data?.from === user.id) {
          if (item.id === socketmessage?.data?.room_id) {
            if (socketmessage?.data?.content) {
              let arr = [...messages];
              let isFound = false;
              let type = socketmessage?.data?.clientMsgId.split('.').pop();
              for (let i = messages.length - 1; i >= 0; i--) {
                if (
                  messages[i]._id + '.text' ===
                    socketmessage?.data?.clientMsgId ||
                  messages[i]._id === socketmessage?.data?.clientMsgId
                ) {
                  arr[i] = {
                    ...arr[i],
                    _id: socketmessage?.data?.id,
                    is_pin: null,
                    name: socketmessage?.data?.full_name,
                  };
                  isFound = true;
                  break;
                }
              }
              if (!isFound) {
                let items = {
                  _id: socketmessage?.data?.id,
                  text: socketmessage?.data?.content,
                  createdAt: new Date(),
                  avatar:
                    socketmessage?.data?.avatar !== ''
                      ? socketmessage?.data?.avatar
                      : '',
                  name: socketmessage?.data?.full_name,
                  type: type,
                  reply_id: socketmessage?.data?.reply_id,
                  is_pin: null,
                  user: {
                    _id: user.id,
                    name: user?.full_name,
                    // avatar: item.thumbnail,
                    avatar: user.personalization.avatar,
                  },
                };
                arr.unshift(items);
              }
              if (
                socketmessage?.data?.clientMsgId !==
                'DoctorNetwork_Chat_NETDEV_PIN'
              ) {
                setMessages(JSON.parse(JSON.stringify(arr)));
              }
            } else {
              if (socketmessage?.data?.resources) {
                const typeLive =
                  socketmessage?.data?.clientMsgId.split('.').pop() === 'live';
                let arr = JSON.parse(JSON.stringify(messages));
                let isFound = false;
                const i = 0;
                if (!typeLive) {
                  if (messages[i]._id === socketmessage?.data?.clientMsgId) {
                    arr[i]._id = socketmessage?.data?.id;
                    arr[i]._idCdn = socketmessage?.data?.id;
                    arr[i].is_pin = null;
                    arr[i].name = socketmessage?.data?.full_name;
                    arr[i].imageCdn = stripslashes(
                      socketmessage?.data?.resources,
                    );
                    if (
                      socketmessage?.data?.clientMsgId.split('.').pop() ===
                        'video' ||
                      socketmessage?.data?.clientMsgId.split('.').pop() ===
                        'media'
                    ) {
                      arr[i].videoCdn = stripslashes(
                        socketmessage?.data?.resources,
                      );
                    }
                    if (
                      socketmessage?.data?.clientMsgId.split('.').pop() ===
                      'voice'
                    ) {
                      arr[i].voice = stripslashes(
                        socketmessage?.data?.resources,
                      );
                    }
                    if (
                      socketmessage?.data?.clientMsgId.split('.').pop() ===
                      'file'
                    ) {
                      arr[i].file = stripslashes(
                        socketmessage?.data?.resources,
                      );
                    }
                    isFound = true;
                  } else {
                    getListHistoryChatApi(0);
                  }
                  if (!isFound) {
                    let items = {
                      _id: socketmessage?.data?.id,
                      text: stripslashes(socketmessage?.data?.resources),
                      createdAt: new Date(),
                      avatar:
                        socketmessage?.data?.avatar !== ''
                          ? socketmessage?.data?.avatar
                          : '',
                      name: socketmessage?.data?.full_name,
                      type:
                        socketmessage?.data?.clientMsgId ===
                        'DoctorNetwork_Chat_NETDEV_PIN'
                          ? 'pin'
                          : socketmessage?.data?.clientMsgId.split('.').pop(),
                      reply_id: socketmessage?.data?.reply_id,
                      is_pin: null,
                      user: {
                        _id: user.id,
                        avatar: user.personalization.avatar,
                      },
                    };
                    arr.unshift(items);
                  }
                  if (
                    socketmessage?.data?.clientMsgId !==
                    'DoctorNetwork_Chat_NETDEV_PIN'
                  ) {
                    setMessages(JSON.parse(JSON.stringify(arr)));
                  }
                }
              }
            }
          }
        }
        //pop noto local
        const handlegoChat = () => {
          let item = {
            created_at: Date.now(),
            description: null,
            id: socketmessage.data?.room_id,
            invite_status: 1,
            is_deleted: 0,
            owner_id: user.id,
            status: 1,
            thumbnail: socketmessage?.data?.avatar,
            // thumbnail: null,
            title: socketmessage?.data?.room_title,
            to:
              socketmessage?.data?.type === '1-1'
                ? socketmessage?.data?.from
                : null,
            type: socketmessage?.data?.type,
            updated_at: Date.now(),
            user_id: null,
          };
          navigation.goBack();
          // navigation.navigate(mainRoute.communityChat, {
          //   item: item,
          //   roomId: item.id,
          //   ownerId: item.owner_id,
          //   checkCreateRoom: true,
          // });
          store.dispatch(resetPinMessage(null));
          store.dispatch(resetMessages(null));
        };
        if (socketmessage.data) {
          if (
            !socketmessage?.data?.content.includes('DoctorNetwork_Chat_NETDEV ')
          ) {
            if (itemRoomId !== socketmessage?.data?.room_id) {
              if (socketmessage?.data?.type === '1-1') {
                if (socketmessage?.data?.content === '') {
                  if (
                    JSON.parse(socketmessage?.data?.resources)?.type !==
                    undefined
                  ) {
                    // showNotiLocal(
                    //   socketmessage?.data?.room_title,
                    //   JSON.parse(socketmessage?.data?.resources).type,
                    //   handlegoChat,
                    //   socketmessage?.data?.avatar,
                    // );
                  } else {
                    // showNotiLocal(
                    //   socketmessage?.data?.room_title,
                    //   JSON.parse(socketmessage?.data?.resources)[0].type,
                    //   handlegoChat,
                    //   socketmessage?.data?.avatar,
                    // );
                  }
                } else {
                  //   showNotiLocal(
                  //     socketmessage?.data?.room_title,
                  //     socketmessage?.data?.content.replaceAll(
                  //       'DoctorNetwork_Chat_NETDEV ',
                  //       '',
                  //     ),
                  //     handlegoChat,
                  //     socketmessage?.data?.avatar,
                  //   );
                }
              } else {
                if (socketmessage?.data?.content === '') {
                  if (
                    JSON.parse(socketmessage?.data?.resources)?.type !==
                    undefined
                  ) {
                    showNotiLocal(
                      `${socketmessage?.data?.full_name} ${t(
                        'communityChat.voice.buttonSend',
                      )} ${socketmessage?.data?.room_title}`,
                      JSON.parse(socketmessage?.data?.resources)?.type,
                      handlegoChat,
                      socketmessage?.data?.avatar,
                    );
                  } else {
                    showNotiLocal(
                      `${socketmessage?.data?.full_name} ${t(
                        'communityChat.voice.buttonSend',
                      )} ${socketmessage?.data?.room_title}`,
                      JSON.parse(socketmessage?.data?.resources)[0]?.type,
                      handlegoChat,
                      socketmessage?.data?.avatar,
                    );
                  }
                } else {
                  showNotiLocal(
                    `${socketmessage?.data?.full_name} ${t(
                      'communityChat.voice.buttonSend',
                    )} ${socketmessage?.data?.room_title}`,
                    socketmessage?.data?.content.replaceAll(
                      'DoctorNetwork_Chat_NETDEV ',
                      '',
                    ),
                    handlegoChat,
                    socketmessage?.data?.avatar,
                  );
                }
              }
            }
          }
        }
      }
    };
    processAPIrecallMess();
  }, [socketmessage]);

  //send message cho ng khác
  useEffect(() => {
    if (!checkErrorRoom) {
      if (socketmessage.data) {
        if (socketmessage?.data?.clientMsgId.split('.').pop() !== 'live') {
          if (socketmessage.data.from !== user.id) {
            if (item.id === socketmessage?.data?.room_id) {
              if (socketmessage?.data?.content) {
                const typePin =
                  socketmessage?.data?.clientMsgId ===
                  'DoctorNetwork_Chat_NETDEV_PIN';
                const typeTag =
                  socketmessage?.data?.clientMsgId.split('.').pop() === 'tag';
                setMessages([
                  {
                    _id: socketmessage?.data?.id,
                    text: socketmessage?.data?.content,
                    createdAt: new Date(),
                    avatar: typePin
                      ? ''
                      : socketmessage?.data?.avatar !== ''
                      ? socketmessage?.data?.avatar
                      : '',
                    name: socketmessage?.data?.full_name,
                    type: typePin
                      ? 'pin'
                      : typeTag
                      ? 'tag'
                      : socketmessage?.data?.clientMsgId.split('.').pop(),
                    reply_id: socketmessage?.data?.reply_id,
                    is_pin: null,
                    user: {
                      _id: generateRandomNumber(),
                      // name: user?.full_name?.charAt(0),
                      // avatar: item.thumbnail,
                      avatar:
                        user.personalization.avatar === ''
                          ? user.personalization.avatar
                          : user?.full_name?.split(' ').pop(),
                    },
                  },
                ]);
              } else {
                const typePin =
                  socketmessage?.data?.clientMsgId ===
                  'DoctorNetwork_Chat_NETDEV_PIN';
                setMessages([
                  {
                    _id: socketmessage?.data?.id,
                    text: stripslashes(socketmessage?.data?.resources),
                    createdAt: new Date(),
                    avatar: typePin
                      ? ''
                      : socketmessage?.data?.avatar !== ''
                      ? socketmessage?.data?.avatar
                      : '',
                    name: socketmessage?.data?.full_name,
                    type: typePin
                      ? 'pin'
                      : socketmessage?.data?.clientMsgId.split('.').pop(),
                    reply_id: socketmessage?.data?.reply_id,
                    is_pin: null,
                    user: {
                      _id: generateRandomNumber(),
                      avatar:
                        user.personalization.avatar === ''
                          ? user.personalization.avatar
                          : user?.full_name?.split(' ').pop(),
                    },
                  },
                ]);
              }
              setMessages((previousMessages: IMessage[] | undefined) =>
                GiftedChat.append(previousMessages, messages, false),
              );
            }
            const date = Date.now();
            dispatch(
              postMessageSeen({
                room_id: item.id,
                time: date,
              }),
            );
            const fetchData = async () => {
              storeObjectData(STORAGEKEY.LIST_MESSAGES, {
                items: socketmessage?.data?.content,
              });
            };
            fetchData();
          }
        }
      }
    }
  }, [socketmessage]);

  const handleImgContentType = (arr: any) => {
    switch (arr) {
      case 'image/png':
        return 'image/png';
      case 'image/jpeg':
        return 'image/jpeg';
      case 'image/jpg':
        return 'image/jpeg';
      case 'video/mp4':
        return 'video/mp4';
      default:
        return '';
    }
  };

  const getListHistoryChatApi = (_offset: number) => {
    const data = {
      // start: 1712730477270,
      offset: _offset,
      limit: PAGINATION.ITEMS_100,
    };
    dispatch(
      getListHistoryChat({
        id: item.id,
        data: data,
      }),
    );
  };

  useEffect(() => {
    if (item?.background) {
      let obj = {
        bgLeftColor: '#EAECF0',
        bgRightColor: '#D0F0FF',
        id: moment().unix(),
        inviteLeft: '#81bcd6',
        inviteRight: '#EAECF0',
        path: item?.background,
        txtLeftColor: '#101828',
        txtRightColor: '#101828',
      };
      dispatch(setAppChatBg(obj));
    } else {
      let arr = CHAT_THEME['white'];
      dispatch(setAppChatBg(arr));
    }
  }, []);

  useEffect(() => {
    getListHistoryChatApi(0);
    console.log('reload connect');
    const date = Date.now();
    socketService.emitSeenMessage(itemRoomId, date);
    store.dispatch(resetbotTyping(null));
    store.dispatch(resetRoomDetal(null));
  }, [appBgChat, appStateStatus, recallEmoji, reloadConnectSocket]);

  useEffect(() => {
    const { loading, data, error } = editRoom;
    let obj: any = {};
    if (!loading) {
      if (editRoom.room_id === itemRoomId) {
        if (editRoom?.background) {
          if (
            editRoom?.background.includes(
              'https://cdn-chat.doctornetwork.us/backgrounds/2025/04/pN0M0Y2l5PJbwcTtO7KfC.png',
            )
          ) {
            obj = {
              bgLeftColor: '#40A2D8',
              bgRightColor: '#84CAFF',
              id: moment().unix(),
              inviteLeft: '#40A2D8',
              inviteRight: '#84CAFF',
              path: editRoom?.background,
              txtLeftColor: '#FFFFFF',
              txtRightColor: '#FFFFFF',
            };
          } else if (
            editRoom?.background.includes(
              'https://cdn-chat.doctornetwork.us/backgrounds/2025/04/fh_WE1K52GZi5SzwWWdJG.png',
            )
          ) {
            obj = {
              bgLeftColor: '#55AD9B',
              bgRightColor: '#95D2B3',
              id: moment().unix(),
              inviteLeft: '#55AD9B',
              inviteRight: '#95D2B3',
              path: editRoom?.background,
              txtLeftColor: '#FFFFFF',
              txtRightColor: '#FFFFFF',
            };
          } else {
            obj = {
              bgLeftColor: '#EAECF0',
              bgRightColor: '#D0F0FF',
              id: moment().unix(),
              inviteLeft: '#81bcd6',
              inviteRight: '#EAECF0',
              path: editRoom?.background,
              txtLeftColor: '#101828',
              txtRightColor: '#101828',
            };
          }
          dispatch(setAppChatBg(obj));
        } else {
          let arr = CHAT_THEME['white'];
          dispatch(setAppChatBg(arr));
        }
      }
    }
    store.dispatch(resetMessages(null));
  }, [editRoom]);

  useEffect(() => {
    const { loading, data, error } = likeEmoji;
    let arr = JSON.parse(JSON.stringify(messages));
    if (!loading) {
      if (data && data.userId) {
        if (user.id !== data.userId) {
          let item = {
            emoji_id: data.emojiId,
            message_id: data.messageId,
            user_id: data.userId,
          };
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].emotions === undefined) {
              let arrPush = [];
              arrPush.push(item);
              if (arr[i]._id === data.messageId) {
                arr[i].is_emoji = item;
                arr[i].emotions = arrPush;
              }
            } else if (!isEmptyArray(arr[i].emotions)) {
              let arrPush = [...arr[i].emotions];
              arrPush.push(item);
              if (arr[i]._id === data.messageId) {
                arr[i].is_emoji = item;
                arr[i].emotions = arrPush;
              }
            } else {
              let arrPush = [];
              arrPush.push(item);
              if (arr[i]._id === data.messageId) {
                arr[i].is_emoji = item;
                arr[i].emotions = arrPush;
              }
            }
          }
        }
        setMessages(arr);
      }
    }
    store.dispatch(resetMessages(null));
  }, [likeEmoji]);

  useEffect(() => {
    let arr = [...messages];
    if (botResponse.room_id !== undefined) {
      if (botResponse.room_id === itemRoomId) {
        if (botResponse.resources.includes('{"idTag":["bot')) {
          let items = {
            _id: generateRandomNumber(),
            avatar: botResponse.avatar,
            createdAt: new Date(),
            is_pin: null,
            name: botResponse.full_name,
            reply_id: botResponse.reply_id,
            room_id: botResponse.room_id,
            text: botResponse.content,
            type: 'text',
            user: {
              _id: JSON.parse(botResponse.resources).idTag[0],
              name: JSON.parse(botResponse.resources).content,
              type: 'text',
            },
          };
          arr.unshift(items);
          setMessages(arr);
          const fetchData = async () => {
            storeObjectData(STORAGEKEY.LIST_MESSAGES, {
              items: botResponse.content,
            });
          };
          fetchData();
          setCheckTypingBot(false);
          store.dispatch(resetbotTyping(null));
          const date = Date.now();
          socketService.emitSeenMessage(item.id, date);
        } else {
          setCheckTypingBot(false);
        }
      } else {
        setCheckTypingBot(false);
      }
    }
  }, [botResponse]);

  useEffect(() => {
    const { loading, data, error } = botTyping;
    if (!loading) {
      if (data) {
        if (data.room_id === itemRoomId) {
          setCheckTypingBot(true);
          setNameBot(data.full_name);
        }
      } else {
        setCheckTypingBot(false);
        setNameBot('');
      }
    }
  }, [botTyping]);

  useEffect(() => {
    const processAPIPinMess = () => {
      const { loading, data, error } = socketPinMessage;
      let arr = JSON.parse(JSON.stringify(messagesPin));
      if (!loading) {
        if (data) {
          if (data.pin_status === false) {
            for (let i = 0; i < messages.length; i++) {
              if (messages[i]._id === data.id) {
                messages[i].is_pin = 0;
                arr.unshift(messages[i]);
              }
            }
          } else {
            for (let i = 0; i < messages.length; i++) {
              if (messages[i]._id === data.id) {
                messages[i].is_pin = null;
                const newArr = messagesPin.filter(
                  (item: any) => item._id !== data.id,
                );
                arr = newArr;
              }
            }
          }
          setMessages(messages);
          setMessagesPin(arr);
        }
      }
    };
    processAPIPinMess();
  }, [socketPinMessage]);

  useEffect(() => {
    const processAPIrecallMess = () => {
      const { loading, data, error } = recallMess;
      let arr = JSON.parse(JSON.stringify(messages));
      if (!checkOnlyDelete) {
        if (!loading) {
          if (data) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i]._id === data.id || arr[i]._idCdn === data.id) {
                arr[i].text = data.content;
              }
            }
            setMessages(arr);
          }
        }
      }
    };
    processAPIrecallMess();
  }, [recallMess]);

  useEffect(() => {
    const processAPIrecallMess = () => {
      const { loading, data, error } = socketOwnerDeleteMessage;
      let arr = JSON.parse(JSON.stringify(messages));
      if (!loading) {
        if (data && data.content) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i]._id === data.id || arr[i]._idCdn === data.id) {
              arr[i].text = data.content;
              arr[i].image = '';
            }
          }
          setMessages(arr);
        }
      }
    };
    processAPIrecallMess();
  }, [socketOwnerDeleteMessage]);

  useEffect(() => {
    const processAPIrecallMess = () => {
      const { loading, data, error } = removeRoom;
      if (!loading) {
        if (data) {
          if (user.id === data.to) {
            socketService.emitListRoom(PAGINATION.ITEMS_100, 0);
            navigation.goBack();
          }
          store.dispatch(resetMessages(null));
          store.dispatch(resetPinMessage(null));
          store.dispatch(resetHistoryChat(null));
        }
      }
    };
    processAPIrecallMess();
  }, [removeRoom]);

  useEffect(() => {
    const processAPIrecallMess = () => {
      const { loading, data, error } = socketdeleteRoom;
      if (!loading) {
        if (data) {
          if (data.room_id) {
            socketService.emitListRoom(PAGINATION.ITEMS_100, 0);
            navigation.goBack();
          }
          store.dispatch(resetMessages(null));
          store.dispatch(resetPinMessage(null));
          store.dispatch(resetHistoryChat(null));
        }
      }
    };
    processAPIrecallMess();
  }, [socketdeleteRoom]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = listHistoryChat;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let sizeResponse = newItems.length;
            if (offset === 0) {
              setListHistoryChatRoom(newItems);
              let arr = [...newItems];
              let coverntArr = [];
              let replyIdArr = [];
              let arrMessPin = [];
              let idChat = [];
              let idChatuser = [];
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].type !== 'live') {
                  if (arr[i].user_id === user.id) {
                    idChatuser = arr[i].user_id;
                  } else {
                    idChat = arr[i].user_id;
                  }
                  let itemUser = {
                    _id: arr[i].id,
                    text: arr[i].content,
                    createdAt: arr[i].created_at,
                    avatar: arr[i].avatar !== null ? arr[i].avatar : '',
                    room_id: arr[i].room_id,
                    name: arr[i].full_name,
                    type: arr[i].type,
                    reply_id: arr[i].reply_id,
                    is_pin: arr[i].is_pin,
                    // is_emoji: arr[i].emotions[arr[i].emotions.length - 1],
                    // emotions: arr[i].emotions,
                    is_emoji: arr[i].emotions
                      ? arr[i]?.emotions[arr[i]?.emotions?.length - 1]
                      : undefined,
                    emotions: arr[i]?.emotions ?? [],
                    count_emoji: 0,
                    // system: true,
                    user: {
                      _id: arr[i].user_id === user.id ? idChatuser : idChat,
                      name: user.full_name,
                      // avatar: arr[i].avatar !== null ? arr[i].avatar : '',
                      // text: arr[i].content,
                      type: arr[i].type,
                    },
                  };
                  if (arr[i].reply_id !== null) {
                    replyIdArr.push(arr[i]);
                  }
                  coverntArr.push(itemUser);
                  if (
                    arr[i].is_pin === 0 &&
                    arr[i].content !== '{community.chat.recall}'
                  ) {
                    arrMessPin.push(itemUser);
                  }
                }
              }
              setMessagesPin(removeDuplicates(arrMessPin));
              // setReplyArrId(replyIdArr);
              // if (item.type === '1-1') {
              //   if (user.id === arr[0].user_id) {
              //     setMessages(removeDuplicates(coverntArr.reverse()));
              //   } else {
              //     setMessages(removeDuplicates(coverntArr).reverse());
              //   }
              // } else {
              //   setMessages(removeDuplicates(coverntArr));
              // }
              setMessages(
                removeDuplicates(coverntArr).sort(
                  (a: IMessage, b: IMessage) =>
                    moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
                ),
              );
              const result = coverntArr.filter(itemA =>
                replyIdArr.some(itemB => itemA._id === itemB.reply_id),
              );
              setReplyArrId(result);
            } else {
              setListHistoryChatRoom([
                ...listHistoryChatRoom,
                ...newItems,
                ...messages,
              ]);
              let arr = [...listHistoryChatRoom, ...newItems];
              let coverntArr = [];
              let replyIdArr = [];
              let arrMessPin = [];
              let idChat = [];
              let idChatuser = [];
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].type !== 'live') {
                  if (arr[i].user_id === user.id) {
                    idChatuser = arr[i].user_id;
                  } else {
                    idChat = arr[i].user_id;
                  }
                  let itemUser = {
                    _id: arr[i].id,
                    text: arr[i].content,
                    createdAt: arr[i].created_at,
                    avatar: arr[i].avatar !== null ? arr[i].avatar : '',
                    room_id: arr[i].room_id,
                    name: arr[i].full_name,
                    type: arr[i].type,
                    reply_id: arr[i].reply_id,
                    is_pin: arr[i].is_pin,
                    // is_emoji: arr[i].emotions[arr[i].emotions.length - 1],
                    // emotions: arr[i].emotions,
                    is_emoji: arr[i].emotions
                      ? arr[i]?.emotions[arr[i]?.emotions?.length - 1]
                      : undefined,
                    emotions: arr[i]?.emotions ?? [],
                    count_emoji: 0,
                    user: {
                      _id: arr[i].user_id === user.id ? idChatuser : idChat,
                      name: user.full_name,
                      // avatar: item.thumbnail,
                      // avatar: "https://cdn-ai.doctornetwork.us/assistant-staging/attachments/dGc3e97nXQXq7vuEbbssYy-C2S_8iN.png",
                      text: arr[i].content,
                      type: arr[i].type,
                    },
                  };
                  if (arr[i].id !== undefined) {
                    coverntArr.push(itemUser);
                  }
                  if (arr[i].reply_id !== null) {
                    replyIdArr.push(arr[i]);
                  }
                  if (
                    arr[i].is_pin === 0 &&
                    arr[i].content !== '{community.chat.recall}'
                  ) {
                    arrMessPin.push(itemUser);
                  }
                  if (arr[i].type === 'live') {
                    coverntArr.splice(i, 1);
                  }
                }
              }
              setMessagesPin(removeDuplicates(arrMessPin));
              // if (item.type === '1-1') {
              //   if (user.id === arr[0].user_id) {
              //     setMessages(removeDuplicates(coverntArr.reverse()));
              //   } else {
              //     setMessages(removeDuplicates(coverntArr.reverse()));
              //   }
              // } else {
              //   setMessages(removeDuplicates(coverntArr));
              // }
              setMessages(
                removeDuplicates(coverntArr).sort(
                  (a: IMessage, b: IMessage) =>
                    moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
                ),
              );
              const result = coverntArr.filter(itemA =>
                replyIdArr.some(itemB => itemA._id === itemB.reply_id),
              );
              setReplyArrId(result);
              // store.dispatch(listMessagesLocal(coverntArr))
            }
            setFinalLoad(sizeResponse < PAGINATION.ITEMS_100);
          } else {
            // setFinalLoad(false);
            setMessages([]);
          }
          setFirstRender(false);
          setRefreshing(false);
        } else if (error) {
          setFirstRender(false);
          setRefreshing(false);
        }
      }
    };
    processAPIListRoom();
  }, [listHistoryChat]);

  useEffect(() => {
    const processAPIrecallMess = () => {
      const { loading, data, error } = checkErorrRemoveRoom;
      let bool = true;
      if (!loading) {
        if (data) {
          console.log('🚀 ~ processAPIrecallMess ~ error:', data);
          bool = false;
          if (
            data.errors &&
            data.errors[0]?.key === 'room_id' &&
            data.errors[0]?.msg === 'Permission denied'
          ) {
            // if (
            //   navigationRef.current?.getCurrentRoute()?.name == 'CommunityChat'
            // ) {
            //   // if (item.room_is_live.media !== null) {
            //   setCheckErrorRoom(true);
            //   Alert.alert(
            //     t('communityChat.private.title'),
            //     t('communityChat.private.content'),
            //     [
            //       {
            //         text: t('common.ok'),
            //         onPress: () => handleSubmitPrivate(),
            //         style: 'default',
            //       },
            //     ],
            //   );
            // }
          } else if (data.errors && data.errors.msg === 'wait_approve') {
            // if (
            //   navigationRef.current?.getCurrentRoute()?.name == 'CommunityChat'
            // ) {
            //   // if (listRoomLivePlayChat.media !== 'livechat') {
            //   setCheckErrorRoom(true);
            //   Alert.alert(item.title, t('communityChat.listMember.approve'), [
            //     {
            //       text: t('common.ok'),
            //       onPress: () => handleSubmitPrivate(),
            //       style: 'default',
            //     },
            //   ]);
            // }
          }
        }
      }
    };
    processAPIrecallMess();
  }, [checkErorrRemoveRoom]);

  useEffect(() => {
    const processAPIrecallMess = async () => {
      const { loading, data, error } = detailRoom;
      if (!loading) {
        if (data) {
          const itemRoom: any = data.result;
          if (itemRoom.id === item.room_is_live && itemRoom.is_live === 1) {
            item.room_is_live = itemRoom.id;
            item.livestream_key = itemRoom.livestream_key;
            item.room_live_title = itemRoom.title;
            setItem(item);
            setIsLiveStream(true);
            store.dispatch(updateLocalListRoomChat(item));
          }
        } else if (error) {
        }
      }
      store.dispatch(resetRoomDetal(null));
    };
    processAPIrecallMess();
  }, [detailRoom]);

  useEffect(() => {
    const processAPICourse = () => {
      const { loading, data, error } = liveVodReady;
      let obj = { ...item };
      if (!loading) {
        if (data) {
          if (data.room_id === obj.room_is_live) {
            if (checkOwner) {
              let content: { filename: any; data: any; type: any }[] = [];
              let items = {
                filename: data.url,
                data: data.url,
                type: 'video',
              };
              content.push(items);
              socketService.emitMessageSocketGroupVideo(
                content,
                'video',
                obj.id,
                generateRandomNumber() + '.video',
              );
            }
          }
        } else if (error) {
        }
      }
    };
    processAPICourse();
  }, [liveVodReady]);

  useEffect(() => {
    const processActionEmoji = () => {
      if (item?.room_is_live === 'undefined') {
        setIsLiveStream(false);
      } else {
        if (item?.room_is_live) {
          setIsLiveStream(true);
        } else {
          setIsLiveStream(false);
        }
      }
    };
    processActionEmoji();
  }, []);

  useEffect(() => {
    const processAPICourse = () => {
      const { loading, data, error } = liveContinue;
      let obj = { ...item };
      if (!loading) {
        if (data && data.room_id) {
          obj.room_is_live = data.room_id;
          setItem(obj);
          store.dispatch(resetSocketjoinRoom(null));
          socketService.emitDetailRoom(obj.room_is_live);
        } else if (error) {
        }
      }
    };
    processAPICourse();
  }, [liveContinue]);

  useEffect(() => {
    const processActionEmoji = () => {
      const { loading, data, error } = liveEnd;
      let obj = { ...item };
      if (!loading) {
        if (data) {
          if (data.room_id === obj.room_is_live) {
            setIsLiveStream(false);
            // setPlayShowLiveStream(false);
            setShowLiveStream(false);
            // obj.room_is_live = null;
            // setItem(obj);
            store.dispatch(updateLocalListRoomChat(null));
          }
          store.dispatch(resetlistRoom(null));
        }
      }
    };
    processActionEmoji();
  }, [liveEnd]);

  useEffect(() => {
    const processAPIListCreate = async () => {
      const { data } = getViewerLive;
      let obj = { ...item };
      if (data && data.room_id === obj.room_is_live) {
        setCountViewer(data.total);
      }
    };
    processAPIListCreate();
  }, [getViewerLive]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = listMemberGroup;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let arrId = [];
            arrId = newItems.map((item: any) => item.id);
            setListIdMember(arrId);
          } else {
          }
        }
      }
    };
    processAPIListRoom();
  }, [listMemberGroup]);

  // useEffect(() => {
  //   const { loading, data, error } = dataCompleteChatPremium;
  //   const processAPICompleteChat = () => {
  //     if (!loading) {
  //       if (data) {
  //         setApiLoading(false);
  //         console.log("🚀 ~ processAPICompleteChat ~ data:", data);
  //         navigation.goBack();
  //         // nho goi resetRoomID
  //         dispatch(resetDataUpdateChat(null));
  //       } else if (error) {
  //         setApiLoading(false);
  //         console.log("🚀 ~ processAPICompleteChat ~ error:", error);
  //         showToast(toastEl, logError(error, '', true));
  //         dispatch(resetDataUpdateChat(null));
  //       }
  //     }
  //   }
  //   processAPICompleteChat();
  // }, [dataCompleteChatPremium]);

  //ACTION
  const handleSubmitPrivate = async () => {
    await storeStringData(STORAGEKEY.CHECK_GROUP_PRIVATE, 'false');
    store.dispatch(resetCheckErorrRemoveRoom(null));
    store.dispatch(resetPinMessage(null));
    store.dispatch(resetMessages(null));
    store.dispatch(resetHistoryChat(null));
    navigation.goBack();
  };

  const findMatchingElements = (a: any) => {
    const result = a.some(
      (e: any) => e.friend_id === item.to || e.user_id === item.to,
    );
    return result;
  };

  const handleResquestFriends = () => {
    if (!findMatchingElements(listFriends)) {
      if (!findMatchingElements(listFriendsInvited)) {
        socketService.emitFriendRequest(item.to);
        showToast(toastEl, t('communityChat.contact.suggestFriend'), 2000);
        getListRequestFriends();
      } else {
        socketService.emitFriendAppectReject(1, item.to);
        showToast(toastEl, t('communityChat.contact.appect'), 2000);
        getListRequestFriends();
      }
    }
  };

  const handlePhoto = async () => {
    if (!isOnlyView) {
      setShowModalMedia(true);
    }
  };

  function removeDuplicates(arr: any) {
    return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
  }

  const handlePickerError = (err: unknown) => {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as any).code === 'DOCUMENT_PICKER_CANCELED'
    ) {
      // user bấm cancel → bỏ qua
      console.warn('Document picker cancelled');
      return;
    }

    // lỗi thật → throw để crash log / Sentry bắt
    throw err;
  };

  const coverntFile = (typeFile: any) => {
    switch (typeFile) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'aapplication/vnd.openxmlformats-officedocument.wordprocessingml.document; charset=UTF-8';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
  };

  const handleFile = async () => {
    storeStringData(STORAGEKEY.CHECK_FILE, 'true');

    if (isOnlyView) return;

    try {
      const results = await pick({
        type: [types.pdf, types.doc, types.docx, types.xlsx, types.xls],
        allowMultiSelection: false,
      });

      if (!results || results.length === 0) return;

      const document = results[0];
      if (!document.size) return;

      const mbSize = document.size / (1024 * 1024);
      if (mbSize > 10) {
        showToast(toastEl, 'File can not be larger than 10MB', 1500);
        return;
      }

      const items = [
        {
          type: 'file',
          contentType: document.type,
          name: document.name,
          // size: document.size,
        },
      ];

      const msgId = generateRandomNumber();

      setClientMsgIdFile(msgId);
      setIdMessageAll(`${msgId}.file`);

      socketService.emitUploadFile(items);

      // lưu state file
      setFileUriFNS(document.uri); // ✅ chỉ dùng uri
      setFileNameFNS(document.name);
      setFileSizeFNS(document.size);
      setFileTypeFNS(document.type);

      const message = [
        {
          _id: `${msgId}.file`,
          text: '',
          createdAt: new Date(),
          image: document.uri,
          type: 'file',
          user: {
            _id: user.id,
          },
        },
      ];

      setMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, message),
      );
    } catch (err) {
      handlePickerError(err);
    }
  };

  const handleVoice = () => {
    if (!isOnlyView) {
      //   if (item.type === '1-1') {
      //     try {
      //       const GAParams = {
      //         doctor_id: item.owner_id?.toString() || '',
      //         specialty: '',
      //         screen_name: 'Chat Screen',
      //         user_id: user.id ? user.id.toString() : '',
      //         timestamp: moment().unix().toString(),
      //         method: 'App chat start conversation',
      //       };
      //       GALogEvent(GAEvents.start_conversation, GAParams);
      //     } catch (err) {}
      //   }
      Keyboard.dismiss();
      bottomSheetRef.current?.present();
    }
  };

  const handleEmoji = (arr: any) => {
    if (!isOnlyView) {
      Keyboard.dismiss();
      bottomSheetEmojiRef.current?.present();
      setListViewEmoji(arr);
    }
  };

  const handleVoiceSendMess = (uri: any, time: any) => {
    setTimeVoice(time);
    setUriVoice(uri);
    let items = [
      {
        type: 'voice',
        contentType: Platform.OS === 'android' ? 'audio/mpeg' : 'audio/m4a',
        name: uri,
      },
    ];
    setClientMsgIdVoice(generateRandomNumber());
    setIdMessageAll(generateRandomNumber() + '.voice');
    socketService.emitUploadFile(items);
    let message = [
      {
        _id: generateRandomNumber() + '.voice',
        text: '',
        createdAt: new Date(),
        image: uri,
        type: 'voice',
        user: {
          _id: user.id,
        },
      },
    ];
    setMessages((previousMessages: IMessage[] | undefined) =>
      GiftedChat.append(previousMessages, message),
    );
  };

  const filterBadWords = (inputString: string, badWordsArray: string[]) => {
    badWordsArray.forEach(badWord => {
      const regex = new RegExp(badWord.trim(), 'gi');
      inputString = inputString.replace(regex, '*'.repeat(badWord.length));
    });
    return inputString;
  };

  // console.log(filterBadWords());

  function stripslashes(str: any) {
    return (str + '').replace(/\\(.?)/g, function (s, n1) {
      switch (n1) {
        case '\\':
          return '\\';
        case '0':
          return '\u0000';
        case '':
          return '';
        default:
          return n1;
      }
    });
  }

  const onViewableItemsChanged = (viewableItems: any) => {
    if (viewableItems.changed[0].index >= 29) {
      setIsgoBack(true);
    } else {
      setIsgoBack(false);
    }
  };

  // const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

  const checkScrollBottom = () => {
    if (messages.length > 0) {
      if (scrollViewRef?.current) {
        scrollViewRef?.current?.scrollToIndex({ index: 0 });
        setIsgoBack(false);
      }
    }
  };

  const onSend = async (mess: any) => {
    // if (item.type === '1-1') {
    //   try {
    //     const GAParams = {
    //       doctor_id: item.owner_id?.toString() || '',
    //       specialty: '',
    //       screen_name: 'Chat Screen',
    //       user_id: user.id ? user.id.toString() : '',
    //       timestamp: moment().unix().toString(),
    //       method: 'App chat send clicked',
    //     };
    //     GALogEvent(GAEvents.send_clicked, GAParams);
    //   } catch (err) {}
    // }
    // Kiem tra khong cho trung voi msg da gui truoc do
    if (mess[0]?.text.toString() === messages[0]?.text.toString()) {
      showToast(
        toastEl,
        t(
          'communityChat.message.duplicate',
          'Nội dung chat bị trùng, vui lòng nhập nội dung khác',
        ),
        1500,
      );
      return;
    }
    const _badWords = t('common.badwords').split(',');
    if (mess) {
      mess[0].text = filterBadWords(mess[0].text, _badWords);
    }
    setIdMessageAll(mess[0]._id);
    if (showMessReply) {
      let message = [
        {
          _id: mess[0]._id,
          text: mess[0].text,
          createdAt: new Date(),
          image: mess[0].text,
          name: userNameCoppy,
          reply_id: idMessText,
          type: 'reply',
          user: {
            _id: user.id,
          },
        },
      ];
      setMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, message),
      );
      socketService.emitMessageSocketReply(
        mess[0].text,
        'text',
        item.id,
        item.to,
        mess[0]._id + '.text',
        idMessText,
      );
      setShowMessReply(false);
    } else if (
      mess[0].text.includes('@') &&
      userTag.length > 0 &&
      listOwner === 'Owner'
    ) {
      const obj = {
        idTag: userTag,
        content: mess[0].text,
      };
      setUserTag([]);
      if (item.type === '1-1') {
        setMessages((previousMessages: IMessage[] | undefined) =>
          GiftedChat.append(previousMessages, mess),
        );
        socketService.emitMessageSocketUser(
          mess[0].text,
          'text',
          item.id,
          item.id,
          mess[0]._id + '.text',
        );
      } else {
        socketService.emitMessageSocketGroup(
          JSON.stringify(obj),
          'tag',
          item.id,
          mess[0]._id + '.tag',
        );
      }
      // checkScrollBottom();
    } else {
      setMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, mess),
      );
      if (item.type === '1-1') {
        // checkScrollBottom();
        socketService.emitMessageSocketUser(
          mess[0].text,
          'text',
          item.id,
          item.id,
          mess[0]._id + '.text',
        );
        store.dispatch(resetMessages(null));
      } else {
        // checkScrollBottom();
        socketService.emitMessageSocketGroup(
          mess[0].text,
          'text',
          item.id,
          mess[0]._id + '.text',
        );
        //
        store.dispatch(resetMessages(null));
      }
    }
    store.dispatch(resetTransferRoom(null));
  };

  //covenrt video cdn
  const convenrtVideoCDN = async (
    selectedImg: any,
    contentImg: any,
    updateItem: any,
  ) => {
    let arr = [];
    let content: { filename: any; data: any; type: any }[] = [];
    for (let i = 0; i < selectedImg.length; i++) {
      const _filename = 'video' + moment().unix().toString() + '.mp4';
      //**** dung sua cho nay, se bi loi do
      // setIsLoading(false);
      const _video = {
        uri: selectedImg[i],
        type: 'video/mp4',
        name: _filename,
      } as unknown as Blob;
      const _body = new FormData();
      _body.append('file', _video);
      const res = await APIUpload.api.post('upload', _body, {
        onUploadProgress: progressEvent => {
          // console.log("🚀 ~ const_onSubmit= ~ progressEvent:", progressEvent)
          const { loaded, total } = progressEvent;
          if (total) {
            let bar = Math.round((loaded * 100) / total);
            if (bar > 80) {
              bar = randomIntFromInterval(80, 90);
            }
          }
        },
      });
      const { problem, data, status }: any = res;
      let cdn = `${Config.CDN_URL}/${data?.url}`;
      arr.push(cdn);
      let filenameRamdom = (Math.random() + 1).toString(36).substring(7);
      let items = {
        filename: selectedImg[i],
        data: arr[i],
        type: 'video',
        // type: Platform.OS === 'ios' ? selectedItemImg[i].type : selectedItemImg[i].type.split('/').shift(),
        // contentType: Platform.OS === 'ios' ? `${selectedItemImg[i].type}/${selectedItemImg[i].image.filename.split('.').pop()}` : selectedItemImg[i].type,
        // name: Platform.OS === 'ios' ? selectedItemImg[i].image.filename : `${filenameRamdom}.${selectedItemImg[i].type.split('/').pop()}`,
      };
      updateItem[i].isLoading = true;
      content.push(items);
      // return content.push(items)
    }
    setMediaLocalSocket(content);
    socketService.emitUploadFile(contentImg);
  };

  //covenrt video cdn
  const convenrtOnlyVideo = async (
    selectedImg: any,
    updateItem: any,
    clientMsgIdVideo: any,
  ) => {
    let arr = [];
    // let arrV2 = [...messages];
    let content: { filename: any; data: any; type: any }[] = [];
    for (let i = 0; i < updateItem.length; i++) {
      const _filename = 'video' + moment().unix().toString() + '.mp4';
      //**** dung sua cho nay, se bi loi do
      const _video = {
        uri: selectedImg[i],
        type: 'video/mp4',
        name: _filename,
      } as unknown as Blob;
      const _body = new FormData();
      _body.append('file', _video);
      const res = await APIUpload.api.post('upload', _body, {
        onUploadProgress: progressEvent => {
          const { loaded, total } = progressEvent;
          if (total) {
            let bar = Math.round((loaded * 100) / total);
            if (bar > 80) {
              bar = randomIntFromInterval(80, 90);
            }
          }
        },
      });
      // if()
      const { problem, data, status }: any = res;
      console.log('🚀 ~ convenrtOnlyVideo ~ res:', res);
      let cdn = `${Config.CDN_URL}/${data?.url}`;
      arr.push(cdn);
      let items = {
        filename: selectedImg[i],
        data: arr[i],
        type: 'video',
        // type: Platform.OS === 'ios' ? selectedItemImg[i].type : selectedItemImg[i].type.split('/').shift(),
        // contentType: Platform.OS === 'ios' ? `${selectedItemImg[i].type}/${selectedItemImg[i].image.filename.split('.').pop()}` : selectedItemImg[i].type,
        // name: Platform.OS === 'ios' ? selectedItemImg[i].image.filename : `${filenameRamdom}.${selectedItemImg[i].type.split('/').pop()}`,
      };
      content.push(items);
      updateItem[i].isLoading = true;
    }

    if (item.type === '1-1') {
      socketService.emitMessageSocketVideo(
        content,
        'video',
        item.id,
        item.id,
        clientMsgIdVideo + '.video',
      );
    } else {
      socketService.emitMessageSocketGroupVideo(
        content,
        'video',
        item.id,
        clientMsgIdVideo + '.video',
      );
    }
  };

  //send img/video
  const onSendImgVideo = (
    content: any,
    selectedImg: any,
    type: any,
    base64: any,
    checkType: any,
    contentVideo: any,
    selectedItemImg: any,
  ) => {
    if (checkType === 1) {
      setShowModalMedia(false);
      setListimage(content);
      setImageUri(base64);
      setIdMessageAll(generateRandomNumber() + '.image');
      setClientMsgIdImg(generateRandomNumber());
      let message = [
        {
          _id: generateRandomNumber() + '.image',
          text: '',
          createdAt: new Date(),
          image: selectedImg.join(','),
          type: 'image',
          user: {
            _id: user.id,
          },
        },
      ];
      // console.log("🚀 ~ useEffect ~ message:", selectedItemImg);
      setMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, message),
      );
      if (selectedItemImg && selectedItemImg.length) {
        setheightLocalImg(selectedItemImg[0].image?.height || 0);
      }
      socketService.emitUploadFile(content);
    } else if (checkType === 2) {
      setShowModalMedia(false);
      setIdMessageAll(generateRandomNumber() + '.video');
      const updateItem = selectedItemImg.map((item: any) => ({
        ...item,
        isLoading: false,
      }));
      let message = [
        {
          _id: generateRandomNumber() + '.video',
          text: '',
          createdAt: new Date(),
          // video: selectedImg.join(','),
          video: updateItem,
          type: 'video',
          user: {
            _id: user.id,
          },
        },
      ];
      setMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, message),
      );
      setUpDateVideoIsLoading(updateItem);
      convenrtOnlyVideo(content, updateItem, generateRandomNumber());
    } else if (checkType === 3) {
      setShowModalMedia(false);
      setImageUriMedia(base64);
      setListimageLocal(content);
      setIdMessageAll(generateRandomNumber() + '.media');
      setClientMsgIdMedia(generateRandomNumber());
      const updateItem = selectedItemImg.map((item: any) => ({
        ...item,
        isLoading: false,
      }));
      let message = [
        {
          _id: generateRandomNumber() + '.media',
          text: '',
          createdAt: new Date(),
          image: updateItem,
          type: 'media',
          user: {
            _id: user.id,
          },
        },
      ];
      setMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, message),
      );
      convenrtVideoCDN(contentVideo, content, updateItem);
    }
  };

  //detail img/video
  const onDetailImgVideo = (item: any, type: any) => {
    setType(type);
    setImgDetail(item);
    setShowModalDetail(true);
    setcheckShowAddTab(false);
  };

  //detail file
  const onDetailFile = (item: any) => {
    setShowModalDetailFile(true);
    setFileUriDetail(item);
    setcheckShowAddTab(false);
  };

  //xoa message all trừ text
  const onDeleteMessage = (itemRoomId: any, idMess: any) => {
    let arr = [...messages];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === idMess) {
        console.log('🚀 ~ onDeleteMessage ~ arr:', arr[i]._id);
        arr.splice(i, 1);
        break;
      } else if (arr[i]._idCdn === idMess) {
        console.log('🚀 ~ onDeleteMessage ~ arr[i]._idCdn:', arr[i]._idCdn);
        arr.splice(i, 1);
        break;
      }
    }
    setMessages(arr);
    socketService.emitMessageSocketDelete(itemRoomId, idMess);
  };

  //thu hồi tin nhắn all trừ text
  const onRecallMessage = (itemRoomId: any, idMess: any) => {
    let arr = JSON.parse(JSON.stringify(messages));
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === idMess || arr[i]._idCdn === idMess) {
        arr[i].text = t('community.chat.recall');
      }
    }
    bottomSheetRef.current?.close();
    setMessages(arr);
    if (item.type === '1-1') {
      socketService.emitMessageSocketRecall(item.id, idMess);
    } else {
      socketService.emitMessageSocketRecall(itemRoomId, idMess);
    }
  };

  //thu hoi tin nhan dang text
  const onRecallMessageText = () => {
    let arr = JSON.parse(JSON.stringify(messages));
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === idMessText || arr[i]._idCdn === idMessText) {
        arr[i].text = t('community.chat.recall');
      }
    }
    setShowMessModal(false);
    setMessages(arr);
    socketService.emitMessageSocketRecall(itemRoomId, idMessText);
  };

  //xoa tin nhan dang text
  const onDeleteMessageText = async () => {
    let arr = [...messages];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === idMessText || arr[i]._idCdn === idMessText) {
        arr.splice(i, 1);
        break;
      }
    }
    storeObjectData(STORAGEKEY.LIST_MESSAGES, {
      items: '',
    });
    setShowMessModal(false);
    setMessages(arr);
    socketService.emitMessageSocketDelete(itemRoomId, idMessText);
  };

  //coppy tin nhan
  const onCoppyMessage = () => {
    setShowMessModal(false);
    // setShowCoppyImage(true);
    // Clipboard.setString(textCoppy);
  };

  //tra loi tin nhan
  const onReplyMessage = () => {
    setShowMessModal(false);
    setShowMessReply(true);
    checkScrollBottom();
  };

  //chia sẻ tin nhan
  const onShareMessage = () => {
    setShowMessModal(false);
    setShowShareMess(true);
  };

  //pin tin nhan
  const onPinMessage = () => {
    setShowMessModal(false);
    onSendPinMessage(textCoppy);
    if (checIsPin) {
      socketService.emitPinMessage(idMessText, itemRoomId, true);
      console.log('ghim');
    } else {
      socketService.emitPinMessage(idMessText, itemRoomId, false);
      console.log('bỏ');
    }
  };

  //tin nhắn thông báo ghim tin nhắn
  const onSendPinMessage = (content: any) => {
    if (typeMessage === 'text') {
      content = content;
    } else if (typeMessage === 'file') {
      content = t('communityChat.home.lastMessageFile');
    } else if (typeMessage === 'image') {
      content = t('communityChat.home.lastMessageImage');
    } else if (typeMessage === 'video') {
      content = t('communityChat.home.lastMessageVideo');
    } else if (typeMessage === 'media') {
      content = t('communityChat.listPin.imgVideo');
    } else if (typeMessage === 'voice') {
      content = t('communityChat.home.lastMessageVoice');
    }
    const obj = [
      {
        content: content,
        title: `DoctorNetwork_Chat_NETDEV ${user.full_name} ${
          !checIsPin
            ? '{communityChat.chat.pinMessage}'
            : '{communityChat.chat.unPinMessage}'
        }`,
      },
    ];
    setMessages([
      {
        _id: generateRandomNumber(),
        text: JSON.stringify(obj),
        createdAt: new Date(),
        avatar: '',
        type: 'pin',
        user: {
          _id: generateRandomNumber(),
          name: item.title,
          avatar: '',
        },
      },
    ]);
    setMessages((previousMessages: IMessage[] | undefined) =>
      GiftedChat.append(previousMessages, messages, false),
    );
    if (item.type === '1-1') {
      socketService.emitMessageSocketUser(
        JSON.stringify(obj),
        'pin',
        item.id,
        item.id,
        'DoctorNetwork_Chat_NETDEV_PIN',
      );
      store.dispatch(resetMessages(null));
    } else {
      socketService.emitMessageSocketGroup(
        JSON.stringify(obj),
        'pin',
        item.id,
        'DoctorNetwork_Chat_NETDEV_PIN',
      );
      store.dispatch(resetMessages(null));
    }
  };

  //gui loi moi // xoa nhom // roi nhom
  const onSendInvite = useCallback(
    (userName: any) => {
      if (item.type === '1-1') {
        socketService.emitMessageSocketUser(
          `DoctorNetwork_Chat_NETDEV ${userName.join(
            ', ',
          )} {communityChat.chat.addMember}`,
          'text',
          item.id,
          item.id,
          'DoctorNetwork_Chat_NETDEV_INVITE_ROOM',
        );
        store.dispatch(resetMessages(null));
      } else {
        socketService.emitMessageSocketGroup(
          `DoctorNetwork_Chat_NETDEV ${userName.join(
            ', ',
          )} {communityChat.chat.addMember}`,
          'text',
          item.id,
          'DoctorNetwork_Chat_NETDEV_INVITE_ROOM',
        );
        store.dispatch(resetMessages(null));
      }
      // setMessages([
      //   {
      //     _id: 'DoctorNetwork_Chat_NETDEV_INVITE_ROOM',
      //     text: `DoctorNetwork_Chat_NETDEV ${userName.join(', ')} được mời vào nhóm`,
      //     createdAt: new Date(),
      //     avatar: user.personalization.avatar,
      //     type: 'text',
      //     user: {
      //       _id: generateRandomNumber(),
      //       name: item.title,
      //       avatar: item.thumbnail,
      //     },
      //   },
      // ])
      // setMessages((previousMessages: IMessage[] | undefined) =>
      //   GiftedChat.append(previousMessages, messages, false),
      // )
    },
    [messages],
  );

  //gui loi moi // xoa nhom // roi nhom
  const onSendLeave = useCallback(
    (userChosseId: any) => {
      socketService.emitMessageSocketGroup(
        `DoctorNetwork_Chat_NETDEV ${user.full_name} {communityChat.chat.memberLeveaGroup}`,
        'text',
        item.id,
        generateRandomNumber() + '.text',
      );
      setMessages([
        {
          _id: generateRandomNumber(),
          text: `DoctorNetwork_Chat_NETDEV ${user.full_name} {communityChat.chat.memberLeveaGroup}`,
          createdAt: new Date(),
          avatar: user.personalization.avatar,
          type: 'text',
          user: {
            _id: generateRandomNumber(),
            name: item.title,
            avatar: item.thumbnail,
          },
        },
      ]);
      setMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, messages, false),
      );
      setApiLoading(true);
      store.dispatch(resetMessages(null));
      socketService.emitLeaveSocket(item.id);
      setTimeout(() => {
        setApiLoading(true);
        socketService.emitListRoom(PAGINATION.ITEMS_100, 0);
        store.dispatch(resetMessages(null));
        setTimeout(() => {
          setApiLoading(false);
          navigation.goBack();
          store.dispatch(resetPinMessage(null));
          store.dispatch(resetHistoryChat(null));
        }, 1500);
      }, 1000);
      setShowModal(false);
      //   const params = {
      //     method: 'Leave group',
      //     group_id: itemRoomId ? itemRoomId.toString() : '',
      //     group_name: item.title ? item.title.toString() : '',
      //     user_id: user.id ? user.id.toString() : '',
      //     timestamp: moment().unix().toString(),
      //   };
      //   GALogEvent(GAEvents.GROUP_LEFT, params);
    },
    [messages],
  );

  //admin chuyển quyền khi rời đi
  const onAdminLeave = useCallback(
    async (userChosseId: any) => {
      socketService.emitChangeAdmin(item.id, userChosseId);
      setShowModal(false);
      setTimeout(() => {
        setApiLoading(true);
      }, 500);
      setTimeout(() => {
        socketService.emitMessageSocketGroup(
          `DoctorNetwork_Chat_NETDEV ${user.full_name} {communityChat.chat.memberLeveaGroup}`,
          'text',
          item.id,
          generateRandomNumber() + '.text',
        );
        socketService.emitLeaveSocket(item.id);
        setMessages([
          {
            _id: generateRandomNumber(),
            text: `DoctorNetwork_Chat_NETDEV ${user.full_name} {communityChat.chat.memberLeveaGroup}`,
            createdAt: new Date(),
            avatar: user.personalization.avatar,
            type: 'text',
            user: {
              _id: generateRandomNumber(),
              name: item.title,
              avatar: item.thumbnail,
            },
          },
        ]);
        setMessages((previousMessages: IMessage[] | undefined) =>
          GiftedChat.append(previousMessages, messages, false),
        );
        setApiLoading(true);
        store.dispatch(resetMessages(null));
        setTimeout(() => {
          setApiLoading(false);
          navigation.goBack();
          store.dispatch(resetPinMessage(null));
          store.dispatch(resetHistoryChat(null));
        }, 1500);
      }, 1000);
    },
    [messages],
  );

  //gui loi moi // xoa nhom // roi nhom
  const onSendDelete = () => {
    showModalDelete();
    setShowModal(false);
  };

  //xoá khỏi nhóm
  const onSendDeleteMember = useCallback(
    async (name: any) => {
      socketService.emitMessageSocketGroup(
        `DoctorNetwork_Chat_NETDEV ${name} {communityChat.chat.deleteMember}`,
        'text',
        item.id,
        'DoctorNetwork_Chat_NETDE_DELETE_ROOM',
      );
      setMessages([
        {
          _id: 'DoctorNetwork_Chat_NETDE_DELETE_ROOM',
          text: `DoctorNetwork_Chat_NETDEV ${name} {communityChat.chat.deleteMember}`,
          createdAt: new Date(),
          avatar: user.personalization.avatar,
          type: 'text',
          user: {
            _id: generateRandomNumber(),
            name: item.title,
            avatar: item.thumbnail,
          },
        },
      ]);
      setMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, messages, false),
      );
      checkScrollBottom();
      socketService.emitMessageSocketGroup(
        `DoctorNetwork_Chat_NETDEV ${name} ${t(
          'communityChat.chat.deleteMember',
        )}`,
        'text',
        item.id,
        'DoctorNetwork_Chat_NETDE_DELETE_ROOM',
      );
      store.dispatch(resetMessages(null));
    },
    [messages],
  );

  const hanldeDeleteChat = async () => {
    if (item.type === 'Room') {
      socketService.emitDeleteSocket(item.id);
      setShowModal(false);
      setApiLoading(true);
      setTimeout(() => {
        setApiLoading(false);
        socketService.emitListRoom(PAGINATION.ITEMS_100, 0);
        store.dispatch(resetPinMessage(null));
        store.dispatch(resetHistoryChat(null));
        // navigation.goBack()
      }, 500);
    } else {
      // const deleteRoomHistory = await getObjectData(STORAGEKEY.DELETE_CHAT);
      // let arr = [...deleteRoomHistory.room_id]
      // arr.push(itemRoomId)
      if (messages.length > 0) {
        socketService.emitDeleteSocketHistory(item.id, messages[0]._id);
      }
      setShowModal(false);
      setApiLoading(true);
      storeObjectData(STORAGEKEY.DELETE_CHAT, {
        room_id: item.id,
        deleteRoom: 'true',
      });
      setTimeout(() => {
        setApiLoading(false);
        socketService.emitListRoom(PAGINATION.ITEMS_100, 0);
        store.dispatch(resetPinMessage(null));
        store.dispatch(resetHistoryChat(null));
        navigation.goBack();
      }, 500);
    }
  };

  const handleLoadMore = () => {
    if (listHistoryChatRoom.length > 0) {
      if (!finalLoad) {
        let nextOffset = offset + PAGINATION.ITEMS_100;
        setOffset(nextOffset);
        getListHistoryChatApi(nextOffset);
      }
    }
  };

  const renderLoadEarlier = (props: any) => {
    return !finalLoad && listHistoryChatRoom.length > 0 ? (
      <Row style={screenStyles.mT5}>
        <ActivityIndicator size="small" color={colors.primary} />
      </Row>
    ) : null;
  };

  const handleGoback = () => {
    // socketService.emitListRoom(PAGINATION.ITEMS_20, 0);
    // if (showPlayLiveStream || showLiveStream) {
    //   adaptor.stop(item.room_is_live);
    //   adaptor.closeWebSocket();
    //   socketService.emitViewerLive(item.room_is_live, 0);
    //   store.dispatch(resetSocketjoinRoom(null));
    //   store.dispatch(deleteRoomLive(item.room_is_live));
    //   setPlayShowLiveStream(false);
    //   if (showLiveStream) {
    //     socketService.emitRoomLive(item.room_is_live, 2, 1);
    //   }
    // }
    navigation.goBack();
    const date = Date.now();
    socketService.emitSeenMessage(item.id, date);
    store.dispatch(resetMessages(null));
    store.dispatch(resetPinMessage(null));
    store.dispatch(resetHistoryChat(null));
    store.dispatch(resetRoomDetal(null));
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const checkString = (str: any) => {
    const hasStandaloneAt = /\B@\B/.test(str); // Check for standalone @
    const hasAtWithText = /@\w+/.test(str); // Check for @ followed by text

    if (hasStandaloneAt) {
      return true;
    } else if (hasAtWithText) {
      return false;
    }
    return null; // Or any default value or action you want to take if neither condition is met
  };

  function convertTextToColors(_text: any) {
    //define delimiter
    const delimiter = /\s+/;
    let token,
      index,
      parts = [];
    while (_text) {
      delimiter.lastIndex = 0;
      token = delimiter.exec(_text);
      if (token === null) {
        break;
      }
      index = token.index;
      if (token[0].length === 0) {
        index = 1;
      }
      parts.push(_text.substr(0, index));
      parts.push(token[0]);
      index = index + token[0].length;
      _text = _text.slice(index);
    }
    parts.push(_text);
    //highlight hashtags
    let i = 0;
    parts = parts.map(text => {
      i++;
      if (/^@/.test(text)) {
        return (
          <Text key={text + i} style={{ color: 'blue' }}>
            {conventUserNameChat(
              listOwner,
              text,
              firebaseConfig.isReviewApp,
              item.is_name,
            )}
          </Text>
        );
      } else if (/^#/.test(text)) {
        return (
          <Text key={text + i} style={{ color: 'black' }}>
            {conventUserNameChat(
              listOwner,
              text,
              firebaseConfig.isReviewApp,
              item.is_name,
            )}
          </Text>
        );
      } else {
        return text;
      }
    });
    return parts;
  }

  const handleChangeMessageChat = async (e: any) => {
    setTextMessages(e);
    // setTextMessages(e);
    // const isPasted = textCoppy.includes(copiedContent);
    // setCheckisPaste(isPasted);
    if (
      e.includes('.jpg') ||
      e.includes('.png') ||
      e.includes('.jpeg') ||
      e.includes('.mp4')
    ) {
      const date = new Date();
      const currentYear = date.getFullYear(); // Get the current year
      const currentMonth = String(date.getMonth() + 1).padStart(2, '0'); // Get the current month and pad with 0 if necessary
      setCheckisPaste(true);
      const regexPattern = new RegExp(
        `https://cdn-global\\.doctornetwork\\.us/videos-chat/${currentYear}/${currentMonth}/e_[\\w-]+\\.mp4`,
      );
      const regexPatternV2 = new RegExp(
        `https://cdn-global\\.doctornetwork\\.us/videos/${currentYear}/${currentMonth}/e_[\\w-]+\\.mp4`,
      );
      let match = e.match(regexPattern);
      let matchV2 = e.match(regexPatternV2);
      if (match) {
        let a = match[0];
        setTextCoppy(a);
      } else if (matchV2) {
        let a = matchV2[0];
        setTextCoppy(a);
      } else {
        console.log('No match found');
      }
    }
    //xét quyền tag
    if (listOwner === 'Owner' || listOwner === 'Admin' || item.is_name !== 1) {
      if (e.includes('@')) {
        const newData = listMemberGroup?.data?.items.filter(function (
          item: any,
        ) {
          const itemData = changeAlias(item.full_name);
          let textData: any = [];
          return itemData.indexOf(tagUser(e, textData)) > -1;
        });
        setListTotalMember(newData || []);
        // setcheckShowAddTab(true);
      } else {
        if (item.type === 'Room' && listMemberGroup?.data?.items) {
          let arr = JSON.parse(JSON.stringify(listMemberGroup?.data?.items));
          arr.sort((a: any, b: any) => {
            if (a.role === 'Owner') {
              return -1;
            }
            if (b.role === 'Owner') {
              return 1;
            }
            return 0;
          });
          const targetIndex = arr.findIndex((item: { id: any }) =>
            item.id.includes('bot'),
          );
          if (targetIndex !== -1) {
            // Remove the target element from its current position
            const [targetElement] = arr.splice(targetIndex, 1);
            // Insert the target element at index 2
            arr.splice(1, 0, targetElement);
          }
          setListTotalMember(arr);
          setcheckShowAddTab(false);
        }
      }
      if (e === '') {
        setcheckShowAddTab(false);
        socketService.emitTypingTo(itemRoomId, 'false');
      } else {
        if (checkString(e)) {
          if (item.type === 'Room') {
            let arr = JSON.parse(JSON.stringify(listMemberGroup?.data?.items));
            arr.sort((a: any, b: any) => {
              if (a.role === 'Owner') {
                return -1;
              }
              if (b.role === 'Owner') {
                return 1;
              }
              return 0;
            });
            const targetIndex = arr.findIndex((item: { id: any }) =>
              item.id.includes('bot'),
            );
            if (targetIndex !== -1) {
              // Remove the target element from its current position
              const [targetElement] = arr.splice(targetIndex, 1);
              // Insert the target element at index 2
              arr.splice(1, 0, targetElement);
            }
            setListTotalMember(arr);
            setcheckShowAddTab(true);
          }
          // setListTotalMember(newData || []);
        }
        socketService.emitTypingTo(itemRoomId, 'true');
      }
    }
  };

  //hanalde profile doctor
  const handleProfileDoctor = () => {
    // if (!isOnlyView) {
    //   if (item.type === '1-1') {
    //     navigation.navigate(mainRoute.expertProfileScreen, {
    //       doctorId: item.to,
    //     });
    //   } else {
    //     setShowEditRoom(true);
    //   }
    // }
  };

  // const handlePlayLiveStream = () => {
  //   if (listOwner !== 'Owner') {
  //     setPlayShowLiveStream(true);
  //   }
  // };

  //RENDER
  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  const renderErrorImageMember = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box10}
        resizeMode="contain"
      />
    );
  };

  const renderRightHeader = () => (
    <View style={styles.rightWrapper}>
      <Row>
        {/* {isLiveStream && (
          <>
            <Pressable
              style={{ position: 'absolute', right: 50, top: 6 }}
              onPress={() => handlePlayLiveStream()}
            >
              <CText h56 color={colors.cF04438} numberOfLines={2}>
                {t('course.lesson.doingLive')}
              </CText>
            </Pressable>
            <Pressable
              style={{ position: 'absolute', right: 15, top: 0 }}
              onPress={() => handlePlayLiveStream()}
            >
              <Image
                style={{
                  height: 30,
                  width: 30,
                }}
                source={images.course.ico_livetime}
              />
            </Pressable>
          </>
        )} */}
        <Pressable
          onPress={() => {
            setShowModal(true);
          }}
        >
          <IconX
            style={styles.iconBack}
            type={IconType.ENTYPO}
            name={'dots-three-horizontal'}
            size={22}
            color={colors.black}
          />
        </Pressable>
      </Row>
    </View>
  );

  const renderLeftHead = () => {
    return (
      <View style={styles.leftWrapper}>
        <Row start>
          <Pressable
            hitSlop={screenStyles.hitSlop20}
            onPress={() => handleGoback()}
          >
            <IconX
              type={IconType.ENTYPO}
              name={'chevron-thin-left'}
              size={24}
              color={colors.black}
            />
          </Pressable>
          <Pressable onPress={() => handleProfileDoctor()}>
            {item.thumbnail === null && item.type === 'Room' ? (
              <View style={[styles.avatarListMember40]}>
                {listTotalMemberChat === '' ? (
                  <>
                    <View style={[styles.avatar40Member]}>
                      <ImageHelper
                        source={{ uri: item.avata }}
                        renderErrorImage={renderErrorImage}
                      />
                    </View>
                  </>
                ) : (
                  <View>
                    {listTotalMemberChat === 1 ? (
                      <View style={[styles.avatar40Member]}>
                        <ImageHelper
                          source={{ uri: item.avatar }}
                          renderErrorImage={renderErrorImage}
                        />
                      </View>
                    ) : (
                      <View>
                        {listTotalMemberChat === 2 ? (
                          <>
                            <View
                              style={[
                                styles.avatar25,
                                { position: 'absolute', top: 7 },
                              ]}
                            >
                              <ImageHelper
                                source={{ uri: listTotalMember[0]?.avatar }}
                                renderErrorImage={renderErrorImageMember}
                              />
                            </View>
                            <View
                              style={[
                                styles.avatar25,
                                { position: 'absolute', top: 7, left: 15 },
                              ]}
                            >
                              <ImageHelper
                                source={{ uri: listTotalMember[1]?.avatar }}
                                renderErrorImage={renderErrorImageMember}
                              />
                            </View>
                          </>
                        ) : (
                          <>
                            {listTotalMemberChat === 3 ? (
                              <View>
                                <View
                                  style={[
                                    styles.avatar20,
                                    { position: 'absolute' },
                                  ]}
                                >
                                  <ImageHelper
                                    source={{ uri: listTotalMember[0]?.avatar }}
                                    renderErrorImage={renderErrorImageMember}
                                  />
                                </View>
                                <View
                                  style={[
                                    styles.avatar20,
                                    { position: 'absolute', top: 20 },
                                  ]}
                                >
                                  <ImageHelper
                                    source={{ uri: listTotalMember[1]?.avatar }}
                                    renderErrorImage={renderErrorImageMember}
                                  />
                                </View>
                                <View
                                  style={[
                                    styles.avatar20,
                                    { position: 'absolute', top: 10, left: 20 },
                                  ]}
                                >
                                  <ImageHelper
                                    source={{ uri: listTotalMember[2]?.avatar }}
                                    renderErrorImage={renderErrorImageMember}
                                  />
                                </View>
                              </View>
                            ) : (
                              <>
                                {item.private === 1 ? (
                                  <>
                                    <View
                                      style={[
                                        styles.avatar20,
                                        { position: 'absolute', left: 5 },
                                      ]}
                                    >
                                      <ImageHelper
                                        source={{
                                          uri: listTotalMember[0]?.avatar,
                                        }}
                                        renderErrorImage={
                                          renderErrorImageMember
                                        }
                                      />
                                    </View>
                                    <View
                                      style={[
                                        styles.avatar20,
                                        {
                                          position: 'absolute',
                                          top: 15,
                                          left: 5,
                                        },
                                      ]}
                                    >
                                      <ImageHelper
                                        source={{
                                          uri: listTotalMember[1]?.avatar,
                                        }}
                                        renderErrorImage={
                                          renderErrorImageMember
                                        }
                                      />
                                    </View>
                                    <View
                                      style={[
                                        styles.avatar20,
                                        { position: 'absolute', left: 18 },
                                      ]}
                                    >
                                      <ImageHelper
                                        source={{
                                          uri: listTotalMember[2]?.avatar,
                                        }}
                                        renderErrorImage={
                                          renderErrorImageMember
                                        }
                                      />
                                    </View>
                                    <View
                                      style={[
                                        styles.avatar22,
                                        {
                                          position: 'absolute',
                                          left: 16,
                                          top: 13,
                                        },
                                      ]}
                                    >
                                      <CText
                                        h7
                                        color={colors.c33353A}
                                        style={{ top: 4, left: 2 }}
                                      >{`+${listTotalMemberChat - 3}`}</CText>
                                    </View>
                                  </>
                                ) : (
                                  <View style={[styles.avatar40Member]}>
                                    <ImageHelper
                                      source={{ uri: item.avatar }}
                                      renderErrorImage={renderErrorImage}
                                    />
                                  </View>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.avatar40}>
                <ImageHelper
                  source={{
                    uri: item.thumbnail || cheatUserToInfo.userToAvatar,
                  }}
                  renderErrorImage={renderErrorImage}
                />
              </View>
            )}
            {isOnline ? <View style={styles.avatarDot}></View> : null}
          </Pressable>
          <Pressable
            onPress={() => {
              if (item.type === 'Room' && listTotalMemberChat !== '') {
                setShowModalListMember(true);
              }
            }}
            style={[screenStyles.pH16]}
          >
            <CText
              h3
              w700
              color={colors.black}
              numberOfLines={1}
              style={{
                width: isLiveStream ? ScreenWidth / 3 : ScreenWidth / 2,
              }}
            >
              {item.title}
            </CText>
            {item.type === 'Room' ? (
              <CText h56 color={colors.c33353A}>
                {`${listTotalMemberChat} ${t('communityChat.chat.titleRoom')}`}
              </CText>
            ) : (
              <>
                {isOnline ? (
                  <CText h56 color={colors.c33353A}>
                    {t('communityChat.chat.title1vs1')}
                  </CText>
                ) : (
                  <>
                    {checTimekUserOnl > 0 ? (
                      <CText h56 color={colors.c33353A}>
                        {`${t('communityChat.chat.titleOnline')} ` +
                          timeDifferenceV2(t, checTimekUserOnl)}
                      </CText>
                    ) : null}
                  </>
                )}
              </>
            )}
          </Pressable>
        </Row>
      </View>
    );
  };

  const handleDeleteOnly = () => {
    setCheckOnlyDelete(true);
    setShowOwnerMess(false);
    setShowMessModal(false);
    onDeleteMessageText();
  };

  const handleDeleteAll = () => {
    let arr = [...messages];
    setShowOwnerMess(false);
    setShowMessModal(false);
    setMessages(arr);
    socketService.emitMessageSocketOwnerDelete(itemRoomId, idMessText);
  };

  function extractAndValidateURI(string: any) {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = string.toLowerCase().match(urlPattern);
    if (urls) {
      for (let url of urls) {
        try {
          new URL(url);
          return true;
        } catch (e) {
          continue;
        }
      }
    }
    return false;
  }

  const handleGoProfile = (item: any, coverntId: any) => {
    const id = extractTagsWithIDs(coverntId.content, coverntId.idTag)[item];
    if (id !== undefined) {
      if (!id.includes('bot')) {
        // navigation.navigate(mainRoute.expertProfileScreen, {
        //   doctorId: id,
        // });
      }
    }
  };

  const showModalDelete = () => {
    Alert.alert(
      `${t('communityChat.chat.deleteMessageChattilte')} ${item.title}`,
      '',
      [
        {
          text: t('communityChat.mediaLocal.titleLeft'),
          onPress: () => {},
          style: 'default',
        },
        {
          text: t('communityChat.voice.buttonDelete'),
          onPress: () => {
            hanldeDeleteChat();
          },
          style: 'destructive',
        },
      ],
    );
  };

  const showModalOwnerDelete = () => {
    if (checkOwner) {
      setShowOwnerMess(true);
    } else {
      setShowMessModal(false);
      Alert.alert(
        t('communityChat.chat.deleteOnlyMessageTitle'),
        checkUser ? t('communityChat.chat.deleteOnlyMessageTitleContent') : '',
        [
          {
            text: t('communityChat.mediaLocal.titleLeft'),
            onPress: () => {},
            style: 'default',
          },
          {
            text: t('communityChat.messageModal.buttonDelete'),
            onPress: () => {
              onDeleteMessageText();
            },
            style: 'destructive',
          },
        ],
      );
    }
    setShowMessModal(false);
  };

  const handleShowModalText = (
    id: any,
    text: any,
    name: any,
    idUser: any,
    checkDeleteMess: any,
    isPin: any,
    typeChat: any,
  ) => {
    console.log('🚀 ~ handleShowModalText ~ id:', id);
    console.log('🚀 ~ handleShowModalText ~ text:', text);
    if (!isOnlyView) {
      setCheckUser(idUser === user.id);
      setShowMessModal(true);
      setidMessText(id);
      setTextCoppy(text);
      setUserNameCoppy(name);
      setCheckMessageDelete(checkDeleteMess);
      setTypeMessage(typeChat);
      setCheckisPaste(false);
      setcheckShowAddTab(false);
      setTextMessages('');
      if (isPin === 0) {
        setCheckIsPin(true);
      } else {
        setCheckIsPin(false);
      }
    }
  };

  const handleUnlike = () => {
    setItemChooseEmoji([]);
    setShowEmoji(false);
    socketService.emitRecalEmoji(itemRoomId, idMessageLikeEmoji);
  };

  const handleLikePost = (id: any, idMess: any, currentMessage: any) => {
    let arr = JSON.parse(JSON.stringify(messages));
    let itemEmoji = {
      emoji_id: id,
      message_id: idMess,
      user_id: user.id,
    };
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].emotions === undefined) {
        let arrPush = [];
        arrPush.push(itemEmoji);
        if (arr[i]._id === idMess) {
          arr[i].is_emoji = itemEmoji;
          arr[i].emotions = arrPush;
        }
      } else if (!isEmptyArray(arr[i].emotions)) {
        let arrPush = [...arr[i].emotions];
        arrPush.push(itemEmoji);
        if (arr[i]._id === idMess) {
          arr[i].is_emoji = itemEmoji;
          arr[i].emotions = arrPush;
        }
      } else {
        let arrPush = [];
        arrPush.push(itemEmoji);
        if (arr[i]._id === idMess) {
          arr[i].is_emoji = itemEmoji;
          arr[i].emotions = arrPush;
        }
      }
    }
    setMessages(arr);
    setCheckLikeCount(true);
    socketService.emitLikeEmoji(itemRoomId, idMess, id);
    //tracking
    // if (item.owner_id && item.owner_id == currentMessage.user?._id) {
      // let arrAdjustParams = [
      //   { key: "group_id", value: itemRoomId ? itemRoomId.toString() : "" },
      //   { key: "content_id", value: idMess ? idMess.toString() : "" },
      //   { key: "group_name", value: item.title ? item.title.toString() : "" },
      //   { key: "reaction_type", value: id ? id.toString() : "" },
      //   { key: "user_id", value: user.id ? user.id.toString() : "" },
      //   { key: "timestamp", value: moment().unix().toString() }
      // ];
      // console.log("🚀 ~ handleLikePost ~ arrAdjustParams:", arrAdjustParams)
      // adjustTractEventParams(ADJUST_EVENT.group_reaction_added, arrAdjustParams);
      //   const params = {
      //     method: 'Group reaction added (to own message)',
      //     group_id: itemRoomId ? itemRoomId.toString() : '',
      //     content_id: idMess ? idMess.toString() : '',
      //     group_name: item.title ? item.title.toString() : '',
      //     reaction_type: id ? id.toString() : '',
      //     user_id: user.id ? user.id.toString() : '',
      //     timestamp: moment().unix().toString(),
      //   };
      //   GALogEvent(GAEvents.GROUP_REACTION_ADDED, params);
    // }
  };

  const handleHideEditRoom = () => {
    setShowEditRoom(false);
  };

  const handleShowReply = () => {
    setShowMessReply(false);
  };

  const handleOnIndex = (item: any) => {
    let arr = [...messages];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === item._id) {
        if (scrollViewRef?.current) {
          if (!textMessages.includes('@')) {
            scrollViewRef?.current?.scrollToIndex({ index: i });
          } else {
            setcheckShowAddTab(false);
          }
        }
        setIsgoBack(false);
        setShowListPin(false);
      }
    }
  };

  const handleSendCoppyImage = () => {
    if (checkisPaste) {
      if (textCoppy.includes('https://cdn-global.doctornetwork.us/videos')) {
        if (textMessages !== '') {
          if (item.type === '1-1') {
            checkScrollBottom();
            socketService.emitMessageSocketUser(
              textMessages,
              'text',
              item.id,
              item.id,
              generateRandomNumber() + '.text',
            );
            store.dispatch(resetMessages(null));
          } else {
            checkScrollBottom();
            socketService.emitMessageSocketGroup(
              textMessages,
              'text',
              item.id,
              generateRandomNumber() + '.text',
            );
            //
            store.dispatch(resetMessages(null));
          }
        }
        setTextMessages('');
        setListimage([]);
        setCheckisPaste(false);
      } else {
        let items = [
          {
            filename: textCoppy,
            data: textCoppy,
            type: 'image',
          },
        ];
        if (textMessages !== '') {
          if (item.type === '1-1') {
            checkScrollBottom();
            socketService.emitMessageSocketUser(
              textMessages,
              'text',
              item.id,
              item.id,
              generateRandomNumber() + '.text',
            );
            store.dispatch(resetMessages(null));
          } else {
            checkScrollBottom();
            socketService.emitMessageSocketGroup(
              textMessages,
              'text',
              item.id,
              generateRandomNumber() + '.text',
            );
            //
            store.dispatch(resetMessages(null));
          }
        }
        if (item.type === '1-1') {
          socketService.emitMessageSocketImage(
            items,
            'image',
            item.id,
            item.id,
            clientMsgIdImg + '.image',
          );
          setListimage([]);
          setCheckisPaste(false);
        } else {
          socketService.emitMessageSocketGroupImage(
            items,
            'image',
            item.id,
            clientMsgIdImg + '.image',
          );
          setListimage([]);
          setCheckisPaste(false);
        }
      }
    }
  };

  const handleShowEmoji = (
    evt: any,
    id: any,
    type: any,
    checkUser: any,
    arrItem: any,
    text: any,
    reply: any,
  ) => {
    setIdMessageLikeEmoji(id);
    setYOffset(evt.nativeEvent.pageY + height);
    setXOffset(evt.nativeEvent.pageX + height);
    setShowEmoji(true);
    setTypeMessage(type);
    setCheckUser(checkUser);
    setArrLikeEmoji(arrItem);
    setTextEmoji(text);
    setReplyTextEmoji(reply);
    // setMessages(arr);
  };

  const converntIconLassMessage = (type: any, bool: any, reply: any) => {
    if (type === 'file') {
      if (bool) {
        return 27;
      } else {
        return 20;
      }
    } else if (type === 'tag') {
      if (bool) {
        return 16;
      } else {
        return 8;
      }
    } else if (type === 'voice') {
      if (bool) {
        return 15;
      } else {
        return 17;
      }
    } else if (type === 'text' || type === undefined) {
      if (bool) {
        return 0;
      } else {
        return 3;
      }
    } else if (reply !== null) {
      if (bool) {
        return 20;
      } else {
        return 15;
      }
    } else {
      if (bool) {
        return 15;
      } else {
        return 18;
      }
    }
  };

  const converntCountEmoji = (count: any) => {
    if (count > 99) {
      return '99+';
    } else {
      return count;
    }
  };

  const converntEmoji = (id: any) => {
    let arr = [...listLikeEmoji];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id.emoji_id) {
        return arr[i].icon;
      }
    }
    // setMessages(arr);
  };

  const converntWidtdEmoji = (width: any, count: any) => {
    if (width >= 3) {
      return count > 9 ? (count > 99 ? 80 : 70) : 65;
    } else if (width >= 2) {
      return count > 9 ? (count > 99 ? 65 : 55) : 50;
    } else {
      return count > 9 ? (count > 99 ? 55 : 45) : 35;
    }
  };

  const converntMarginLeftdEmoji = (width: any, count: any) => {
    if (width >= 3) {
      return count > 99 ? -80 : -75;
    } else if (width >= 2) {
      return count > 9 ? -55 : -50;
    } else {
      return count > 9 ? (count > 99 ? -55 : -45) : -35;
    }
  };

  const converntLeftdEmoji = (width: any, count: any) => {
    if (width >= 3) {
      return 40;
    } else if (width >= 2) {
      return count > 9 ? 60 : 55;
    } else {
      return count > 9 ? (count > 99 ? 60 : 50) : 40;
    }
  };

  const converntWidthEmoji = (
    type: any,
    reply: any,
    checkUser: any,
    text: any,
  ) => {
    if (type === 'text' && reply === null && !extractAndValidateURI(text)) {
      if (text.length < 20) {
        return checkUser ? ScreenWidth / 2.3 - 5 : ScreenWidth / 3.8;
      } else {
        return checkUser ? ScreenWidth / 1.3 - 5 : ScreenWidth / 8;
      }
    } else if (type === 'image' || type === 'video' || type === 'media') {
      return checkUser ? ScreenWidth / 1.3 - 5 : ScreenWidth / 8;
    } else if (type === 'text' && reply !== null) {
      return checkUser ? ScreenWidth / 1.3 - 5 : ScreenWidth / 8;
    } else if (type === 'file') {
      return checkUser ? ScreenWidth / 2.6 : ScreenWidth / 2.2;
    } else if (type === 'voice') {
      return checkUser ? ScreenWidth / 3.6 : ScreenWidth / 1.8;
    } else if (type === 'tag') {
      return checkUser ? ScreenWidth / 1.3 - 5 : ScreenWidth / 8;
    } else if (
      type === 'text' &&
      reply === null &&
      extractAndValidateURI(text)
    ) {
      return checkUser ? ScreenWidth / 1.3 - 5 : ScreenWidth / 8;
    } else if (type === undefined && extractAndValidateURI(text)) {
      if (text.length < 20) {
        return checkUser ? ScreenWidth / 2.3 - 5 : ScreenWidth / 3.8;
      } else {
        return checkUser ? ScreenWidth / 1.3 - 5 : ScreenWidth / 3.8;
      }
    } else if (type === undefined && !extractAndValidateURI(text)) {
      if (text.length < 20) {
        return checkUser ? ScreenWidth / 2.3 - 5 : ScreenWidth / 3.8;
      } else {
        return checkUser ? ScreenWidth / 1.3 - 5 : ScreenWidth / 3.8;
      }
    } else if (type === undefined) {
      return checkUser ? ScreenWidth / 2.3 - 5 : ScreenWidth / 3.7;
    } else {
      return checkUser ? ScreenWidth / 1.3 - 5 : ScreenWidth / 3.7;
    }
  };

  const extractTagsWithIDs = (
    content: string,
    idTags: string[],
  ): Record<string, string> => {
    const tagPattern = /@\S+/g;
    const tags = content.match(tagPattern);
    const tagIDMapping: Record<string, string> = {};
    if (tags) {
      tags.forEach((tag, index) => {
        tagIDMapping[tag] = idTags[index];
      });
    }
    return tagIDMapping;
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderWidth: 0,
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: colors.cF9FAFB,
        }}
        primaryStyle={{ borderWidth: 0 }}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        disabled={!props.text.trim() || props.text === '@AI-Helper '}
        containerStyle={{
          paddingBottom: getBottomSpace() + ifIphoneX(-22, 12),
          paddingRight: 4,
          paddingLeft: 6,
        }}
        children={
          checkisPaste ? (
            <Pressable onPress={() => handleSendCoppyImage()}>
              <Image
                source={
                  textMessages !== '' || checkisPaste
                    ? images.community.send_button
                    : images.community.send_button_dis
                }
                style={
                  Platform.OS === 'android'
                    ? screenStyles.box42
                    : screenStyles.box48
                }
              />
            </Pressable>
          ) : (
            <Image
              source={
                textMessages !== ''
                  ? props.text !== '@AI-Helper '
                    ? images.community.send_button
                    : images.community.send_button_dis
                  : images.community.send_button_dis
              }
              style={
                Platform.OS === 'android'
                  ? screenStyles.box42
                  : screenStyles.box48
              }
            />
          )
        }
      ></Send>
    );
  };

  const renderActions = (props: any) => {
    if (textMessages === '') {
      return (
        <Pressable
          onPress={handleVoice}
          style={{
            paddingLeft: 16,
            paddingRight: 6,
            paddingBottom: getBottomSpace() + ifIphoneX(-20, 14),
          }}
        >
          <Image
            source={images.community.voice_button}
            style={screenStyles.box40}
          />
        </Pressable>
      );
    }
  };

  const [cheatUserToInfo, setCheatUserToInfo] = useState<any>({
    userToAvatar: '',
    sayHello: '',
  });

  useEffect(() => {
    const cheatUserFromOther = async () => {
      const userTemp = await getObjectData(STORAGEKEY.LIST_ROOM_PACKAGE);
      if (
        currentToChatInfo.roomChatId == item.id &&
        item.is_premium == 1 &&
        currentToChatInfo.userToId == item.to
      ) {
        setCheatUserToInfo(currentToChatInfo);
      } else if (
        userTemp &&
        userTemp.roomChatId == item.id &&
        item.is_premium == 1 &&
        userTemp.userToId == item.to
      ) {
        setCheatUserToInfo(userTemp);
      } else {
      }
    };
    cheatUserFromOther();
  }, [currentToChatInfo]);

  const renderChatEmpty = useCallback(() => {
    return (
      <View
        style={{
          transform:
            Platform.OS === 'android'
              ? [{ rotate: '180deg' }]
              : [{ scaleY: -1 }],
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 100,
          paddingHorizontal: 13,
          paddingVertical: 13,
        }}
      >
        <View style={styles.avatar60}>
          <ImageHelper
            source={{ uri: item.thumbnail || cheatUserToInfo.userToAvatar }}
            renderErrorImage={renderErrorImage}
          />
        </View>
        <CText
          h4
          w500
          center
          numberOfLines={2}
          color={colors.c101828}
          style={screenStyles.mT5}
        >
          {item.title}
        </CText>
        {cheatUserToInfo.sayHello != '' && (
          <CText
            h5
            center
            numberOfLines={2}
            color={colors.c33353A}
            style={screenStyles.mT5}
          >
            {cheatUserToInfo.sayHello}
          </CText>
        )}
      </View>
    );
  }, [item, cheatUserToInfo]);

  function getRandomColor(props: any) {
    let a = props?.currentMessage?.name
      ?.split(' ')
      .pop()
      .charAt(0)
      .toUpperCase();
    if (a === 'A') {
      return '#E0F2FE';
    } else if (a === 'B') {
      return '#F3E8FF';
    } else if (a === 'checkuser') {
      return '#FEE2E2';
    } else if (a === 'D') {
      return '#CFFAFE';
    } else if (a === 'N') {
      return '#F3F4F6';
    } else if (a === 'T') {
      return '#FEF3C7';
    } else if (a === 'H') {
      return '#FEF334';
    } else if (a === 'L') {
      return '#CCCCFF';
    }
    return '#E0F2FE';
  }

  function getRandomColorText(props: any) {
    let a = props?.currentMessage?.name
      ?.split(' ')
      .pop()
      .charAt(0)
      .toUpperCase();
    if (a === 'A') {
      return '#0284C7';
    } else if (a === 'B') {
      return '#9333EA';
    } else if (a === 'C') {
      return '#DC2626';
    } else if (a === 'D') {
      return '#0891B2';
    } else if (a === 'N') {
      return '#4B5563';
    } else if (a === 'T') {
      return '#D97706';
    } else if (a === 'H') {
      return colors.c344054;
    } else if (a === 'L') {
      return colors.c344054;
    }
    return '#0284C7';
  }

  function getRandomColorUserName(props: any) {
    let a = props.split(' ').pop().charAt(0).toUpperCase();
    if (appBgChat.id === 1) {
      if (a === 'A' || a === 'E' || a === 'Q' || a === 'N') {
        return '#0080F6';
      } else if (a === 'B' || a === 'R' || a === 'U' || a === 'M') {
        return '#12B76A';
      } else if (a === 'C' || a === 'T' || a === 'Y' || a === 'X') {
        return '#5F04F2';
      } else if (a === 'D' || a === 'Y' || a === 'P' || a === 'V') {
        return '#B215FB';
      }
      return '#F79009';
    } else {
      return colors.c101828;
    }
  }

  const renderAvatar = (props: any) => {
    let textGroup =
      props?.currentMessage?.text?.slice(0, 25) === 'DoctorNetwork_Chat_NETDEV';
    let typeChat = props?.currentMessage?.type;
    let userName = props?.currentMessage?.name;
    return (
      <View style={{ paddingVertical: 10 }}>
        {typeChat !== 'pin' ? (
          !textGroup ? (
            props.currentMessage?.avatar !== '' ? (
              <>
                {item.type === '1-1' ? (
                  <View style={styles.avatar36}>
                    <ImageHelper
                      source={{ uri: props.currentMessage.avatar }}
                      renderErrorImage={renderErrorImage}
                    />
                  </View>
                ) : (
                  <>
                    {/* <View style={{ top: typeChat === 'text' ? 0 : 5 }}>
                      <CText h6 center color={colors.c98A2B3}>{userName.split(' ').pop()}</CText>
                    </View> */}
                    <View
                      style={[
                        styles.avatar36,
                        { top: typeChat === 'text' ? 0 : 10 },
                      ]}
                    >
                      <ImageHelper
                        source={{ uri: props.currentMessage.avatar }}
                        renderErrorImage={renderErrorImage}
                      />
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                {item.type === '1-1' ? (
                  <View
                    style={{
                      height: 36,
                      width: 36,
                      borderRadius: 18,
                      backgroundColor: getRandomColor(props),
                      justifyContent: 'center',
                    }}
                  >
                    <CText h6 center color={getRandomColorText(props)}>
                      {props?.currentMessage?.name
                        ?.split(' ')
                        .pop()
                        .charAt(0)
                        .toUpperCase()}
                    </CText>
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        height: 36,
                        width: 36,
                        borderRadius: 18,
                        top: typeChat === 'text' ? 0 : 10,
                        backgroundColor: getRandomColor(props),
                        justifyContent: 'center',
                      }}
                    >
                      <CText h6 center color={getRandomColorText(props)}>
                        {props?.currentMessage?.name
                          ?.split(' ')
                          .pop()
                          .charAt(0)
                          .toUpperCase()}
                      </CText>
                    </View>
                  </>
                )}
              </>
            )
          ) : null
        ) : null}
      </View>
    );
  };

  const renderMessage = (props: any) => {
    let typeChat = props?.currentMessage?.type;
    let checkUser = props.currentMessage.user._id === user.id;
    let reply = props?.currentMessage?.reply_id;
    let text = props?.currentMessage?.text;
    let arrTemp = props?.currentMessage?.emotions;
    let uniqueArray = [];
    if (arrTemp !== undefined) {
      const reversedArray = [...arrTemp].reverse();
      uniqueArray = reversedArray.filter(
        (item: any, index: any, self: any) =>
          index ===
          self.findIndex(
            (t: any) =>
              t.emoji_id === item.emoji_id && t.message_id === item.message_id,
          ),
      );
    }
    let boolLassMeesage = false;
    if (messages[0]?._id === props?.currentMessage?._id) {
      boolLassMeesage = true;
    }
    return (
      <View>
        <Message {...props} renderBubble={customSystemMessage} />
        {props?.currentMessage?.text.includes('{community.chat.remove}') ||
        props?.currentMessage?.text.includes('{community.chat.recall}') ||
        props?.currentMessage?.text.includes('DoctorNetwork_Chat_NETDEV') ||
        props?.currentMessage?.text.includes(
          '{communityChat.chat.pinMessage}',
        ) ? null : (
          <View
            style={[
              !checkUser ? styles.iconEmojiLeft : styles.iconEmojiRight,
              {
                bottom: converntIconLassMessage(
                  typeChat,
                  boolLassMeesage,
                  reply,
                ),
                flexDirection: 'row',
                right: converntWidthEmoji(typeChat, reply, checkUser, text),
              },
            ]}
          >
            {!checkUser && props?.currentMessage?.emotions?.length > 0 ? (
              <Pressable
                onPress={() => handleEmoji(props?.currentMessage?.emotions)}
              >
                <View
                  style={[
                    styles.shadowEmoji,
                    {
                      width: converntWidtdEmoji(
                        uniqueArray.length,
                        props.currentMessage.emotions.length,
                      ),
                      height: 20,
                      borderRadius: 20,
                      paddingHorizontal: 5,
                      zIndex: 200,
                      top: 3,
                      marginRight: converntMarginLeftdEmoji(
                        uniqueArray.length,
                        props.currentMessage.emotions.length,
                      ),
                      right:
                        uniqueArray.length >= 3
                          ? 80
                          : converntLeftdEmoji(
                              uniqueArray.length,
                              props.currentMessage.emotions.length,
                            ),
                    },
                  ]}
                >
                  <Row start style={{ top: isIOS ? 2 : 0.5 }}>
                    <CText h6 color={colors.primary}>
                      {converntCountEmoji(props.currentMessage.emotions.length)}
                    </CText>
                    <View style={[screenStyles.box14, { left: 3 }]}>
                      <Row start style={{ width: 40 }}>
                        {uniqueArray.map((item: any, index: any) =>
                          _renderNumberLike(item, index),
                        )}
                      </Row>
                    </View>
                  </Row>
                </View>
              </Pressable>
            ) : null}
            <Pressable
              onPress={() =>
                handleLikePost(
                  props.currentMessage.is_emoji === undefined
                    ? listLikeEmoji[1]?.id
                    : props.currentMessage.is_emoji.emoji_id,
                  props?.currentMessage?._id,
                  props.currentMessage,
                )
              }
              onLongPress={(evt: any) =>
                handleShowEmoji(
                  evt,
                  props?.currentMessage?._id,
                  typeChat,
                  checkUser,
                  props.currentMessage.emotions,
                  text,
                  reply,
                )
              }
            >
              <View
                style={[
                  styles.shadowEmoji,
                  {
                    backgroundColor: 'white',
                    width: 25,
                    height: 25,
                    borderRadius: 15,
                    ...screenStyles.centerWrap,
                  },
                ]}
              >
                {props.currentMessage.is_emoji === undefined ? (
                  <Image
                    source={images.community.icon_emoji}
                    style={screenStyles.box30}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={[screenStyles.box18, { marginBottom: 1 }]}>
                    <FastImage
                      style={screenStyles.box18 as any}
                      source={{
                        uri: converntEmoji(props.currentMessage.is_emoji),
                      }}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
            </Pressable>
            {checkUser && props?.currentMessage?.emotions?.length > 0 ? (
              <Pressable
                onPress={() => handleEmoji(props?.currentMessage?.emotions)}
              >
                <View
                  style={[
                    styles.shadowEmoji,
                    {
                      width: converntWidtdEmoji(
                        uniqueArray.length,
                        props.currentMessage.emotions.length,
                      ),
                      height: 20,
                      borderRadius: 20,
                      paddingHorizontal: 5,
                      zIndex: 200,
                      top: 2,
                      marginLeft: converntMarginLeftdEmoji(
                        uniqueArray.length,
                        props.currentMessage.emotions.length,
                      ),
                      left:
                        uniqueArray.length >= 3
                          ? 85
                          : converntLeftdEmoji(
                              uniqueArray.length,
                              props.currentMessage.emotions.length,
                            ),
                    },
                  ]}
                >
                  <Row start style={{ alignItems: 'center', top: 2 }}>
                    <CText h6 color={colors.primary}>
                      {converntCountEmoji(props.currentMessage.emotions.length)}
                    </CText>
                    <View style={[screenStyles.box14, { left: 3 }]}>
                      <Row start style={{ width: 40 }}>
                        {uniqueArray.map((item: any, index: any) =>
                          _renderNumberLike(item, index),
                        )}
                      </Row>
                    </View>
                  </Row>
                </View>
              </Pressable>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  const _renderNumberLike = (item: any, index: any) => {
    // converntEmoji
    if (index === 0 || index === 1 || index === 2) {
      return (
        <View
          key={index}
          // onLayout={e => onLayoutLike(e, item)}
        >
          <View style={[screenStyles.box14, { top: 0 }]}>
            <FastImage
              style={screenStyles.box14 as any}
              source={{ uri: converntEmoji(item) }}
              resizeMode="contain"
            />
            {/* <ImageHelper
              // style={{width: 22, height: 22, marginHorizontal: 4,}}
              source={{ uri: converntEmoji(item) }}
            /> */}
          </View>
        </View>
      );
    }
  };

  const customSystemMessage = (props: any) => {
    let typeChat = props?.currentMessage?.type;
    // let backgroundChatRight = typeChat === 'text' ? colors.cD0F0FF : typeChat === undefined ? colors.cD0F0FF : null
    // let backgroundChatLeft = typeChat === 'text' ? colors.cEAECF0 : typeChat === undefined ? colors.cEAECF0 : null
    const backgroundChatRight =
      typeChat === 'text'
        ? appBgChat.bgRightColor
        : typeChat === undefined
        ? appBgChat.bgRightColor
        : null;
    // console.log("🚀 ~ customSystemMessage ~ appBgChat:", appBgChat)
    const backgroundChatLeft =
      typeChat === 'text'
        ? appBgChat.bgLeftColor
        : typeChat === undefined
        ? appBgChat.bgLeftColor
        : null;
    let textGroup =
      props?.currentMessage?.text?.slice(0, 25) === 'DoctorNetwork_Chat_NETDEV';
    let checkDeleteMess = props?.currentMessage?.text.includes(
      '{community.chat.remove}',
    );
    let checkUser = props.currentMessage.user._id === user.id;
    return (
      <View>
        <Bubble
          wrapperStyle={{
            right: {
              backgroundColor: textGroup ? null : backgroundChatRight,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
            left: {
              backgroundColor: textGroup ? null : backgroundChatLeft,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
          containerStyle={{
            left: {
              alignItems:
                typeChat === 'pin'
                  ? 'center'
                  : textGroup
                  ? 'center'
                  : 'flex-start',
              left: typeChat === 'pin' ? 25 : textGroup ? 25 : 0,
              paddingVertical: 8,
            },
            right: {
              alignItems:
                typeChat === 'pin'
                  ? 'center'
                  : textGroup
                  ? 'center'
                  : 'flex-end',
              right: typeChat === 'pin' ? 25 : textGroup ? 25 : 0,
              paddingVertical: 8,
            },
          }}
          onLongPress={() => {
            if (!isOnlyView) {
              if (
                typeChat !== 'pin' &&
                props?.currentMessage?.text.includes(
                  'DoctorNetwork_Chat_NETDEV',
                ) !== true
              ) {
                handleShowModalText(
                  props?.currentMessage?._id,
                  props?.currentMessage?.text,
                  props?.currentMessage?.name,
                  props?.currentMessage?.user?._id,
                  checkDeleteMess,
                  props?.currentMessage?.is_pin,
                  props?.currentMessage?.type,
                );
              }
            }
          }}
          renderMessageImage={renderMessageImage}
          renderMessageVideo={renderMessageVideo}
          {...props}
        ></Bubble>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <ChatFooter
        checkErrorRoom={checkErrorRoom}
        isTyping={isTyping}
        itemRoomId={itemRoomId}
        showMessReply={showMessReply}
        typeMessage={typeMessage}
        textCoppy={textCoppy}
        userNameCoppy={userNameCoppy}
        height={height}
        handleShowReply={handleShowReply}
        listTotalMember={listTotalMember}
        handleChosseUserTab={handleChosseUserTab}
        textMessages={textMessages}
        checkShowAddTab={checkShowAddTab}
        item={item}
        checkisPaste={checkisPaste}
        checkTypingBot={checkTypingBot}
        nameBot={nameBot}
        setCheckisPaste={setCheckisPaste}
        setTextMessages={setTextMessages}
        listOwner={listOwner}
      />
    );
  };

  const renderDay = (props: any) => {
    const { currentMessage } = props;
    if (!currentMessage || !currentMessage.createdAt) {
      return null; // Don't render if there's no date
    }
    const dateText = moment(currentMessage.createdAt).format(
      'dddd, DD MMMM YYYY',
    );
    return (
      <View style={{ alignItems: 'center', marginVertical: 5 }}>
        <CText h5 w500 color={colors.cb2b2b2}>
          {dateText}
        </CText>
      </View>
    );
  };

  const renderTime = (props: any) => {
    let typeChat = props?.currentMessage?.type;
    let checkUser = props.currentMessage.user._id === user.id;
    let textColor =
      props?.currentMessage?.text?.slice(0, 25) !== 'DoctorNetwork_Chat_NETDEV'
        ? colors.c667085
        : 'white';
    let formatTime = moment(props.currentMessage.createdAt).format('hh:mm A');
    let time = moment(formatTime, ['h:mm A']).format('HH:mm');
    return (
      <>
        {typeChat !== 'pin' && typeChat !== 'tag' && typeChat !== 'reply' ? (
          props?.currentMessage?.text !== '{community.chat.recall}' &&
          props?.currentMessage?.text?.slice(0, 25) !==
            'DoctorNetwork_Chat_NETDEV' &&
          !props?.currentMessage?.text?.includes('{community.chat.remove}') ? (
            <View
              style={{
                paddingHorizontal: 10,
                paddingTop: 3,
                bottom: typeChat === 'text' || typeChat === undefined ? 5 : 0,
                flexDirection: 'row',
              }}
            >
              <CText
                w500
                h7
                color={
                  props.currentMessage.user._id === user.id
                    ? typeChat === 'image'
                      ? colors.c667085
                      : typeChat === 'video'
                      ? colors.c667085
                      : colors.c667085
                    : textColor
                }
              >
                {`${time}  `}
              </CText>
              {checkUser ? (
                props?.currentMessage?._idCdn === idMessageAll ? (
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
            </View>
          ) : null
        ) : null}
      </>
    );
  };

  const conventNameChat = (text: any) => {
    return conventUserNameChat(
      listOwner,
      text,
      firebaseConfig.isReviewApp,
      item.is_name,
    );
  };

  const renderText = (matchingString: any, matches: any) => {
    // console.log("🚀 ~ renderText ~ matches:", matches)
    let pattern = /(?:\*\*)([^*]*)(?:\*\*)/;
    let match = matchingString.match(pattern);
    return `${match[1]}`;
  };

  // function getFromParameter(url: any) {
  //   const urlObject = new URL(url.replace('?', '&'));
  //   return urlObject.searchParams.get('from');
  // }

  const handleLink = async (url: any) => {
    if (url.includes('rooms?id=')) {
      const match = url.toLowerCase().match(/([a-f0-9\-]{36})/);
      const userShareId = new URL(url).searchParams.get('from') ?? '';
      socketService.emitDetailRoom(match[0]);
      socketService.emitRoomShare(match[0], userShareId);
      storeStringData(STORAGEKEY.CHECK_GROUP_PRIVATE, 'true');
      store.dispatch(resetPinMessage(null));
      store.dispatch(resetMessages(null));
      store.dispatch(resetHistoryChat(null));
      navigation.goBack();
    } else if (url.includes('us/video/')) {
      let str = url.toLowerCase().match(/https:\/\/[^\s]+/)[0];
      let videoId = str.split('/').pop();
      //   if (videoId) {
      //     axios
      //       .get(`${Config.BASE_API_URL}/videos?fqin=id:${videoId}`)
      //       .then(response => {
      //         console.log(response.data);
      //         navigation.navigate(mainRoute.videoPlayStaticScreen, {
      //           firstIndex: 0,
      //           data: response.data.items ?? [],
      //           type: 'shareLink',
      //         });
      //       })
      //       .catch(error => {
      //         console.error('Error fetching data: ', error);
      //       });
      //   }
    } else if (url.includes('us/courses')) {
      let str = url.toLowerCase().match(/https:\/\/[^\s]+/)[0];
      const urlParams = new URL(str).searchParams;
      const id = urlParams.get('id');
    } else {
      let str = url.match(/https:\/\/[^\s]+/)[0];
      Linking.canOpenURL(str).then(() => {
        Linking.openURL(str);
      });
    }
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

  const handleShowTitleLiveChat = () => {
    if (listOwner === 'Owner') {
      setShowLiveStream(false);
      setShowModal(false);
      setTimeout(() => {
        setShowTitleRoom(true);
      }, 300);
    }
  };

  const handleReport = () => {
    dispatch(getListReport(null));
    setTimeout(() => {
      bottomSheetReportRef.current?.present();
    }, 500);
    setShowModal(false);
  };

  // Block msg user
  const [isBlockMsg, setIsBlockMsg] = useState(false);
  const [listUserBlock, setListUserBlock] = useState<any>([]);
  useEffect(() => {
    const checkListUserBlock = async () => {
      const listBlock = await getObjectData(STORAGEKEY.LIST_USER_BLOCK);
      if (listBlock) {
        if (item.type == '1-1') {
          if (listBlock.indexOf(item?.to) !== -1) {
            setIsBlockMsg(true);
          }
        }
        setListUserBlock(listBlock);
      } else {
        setListUserBlock([]);
      }
    };
    checkListUserBlock();
  }, [item?.to]);

  const handleBlockUserMsg = (userId: string) => {
    if (!isBlockMsg) {
      const exists = listUserBlock.indexOf(userId) !== -1;
      if (!exists) {
        const newListUserBlock = [...listUserBlock, userId];
        setListUserBlock(newListUserBlock);
        storeObjectData(STORAGEKEY.LIST_USER_BLOCK, newListUserBlock);
        setIsBlockMsg(true);
      }
    } else {
      setIsBlockMsg(false);
      // Remove first occurrence of 'banana'
      const index = listUserBlock.indexOf(userId);
      let newListUserBlock = [...listUserBlock];
      if (index !== -1) {
        newListUserBlock.splice(index, 1);
      }
      setListUserBlock(newListUserBlock);
      storeObjectData(STORAGEKEY.LIST_USER_BLOCK, newListUserBlock);
    }
  };

  const handleLiveStream = (e: any, isPush: any) => {
    if (listOwner === 'Owner' && e !== '') {
      if (listIdMember.length > 1) {
        setShowLiveStream(true);
        setShowTitleRoom(false);
        setTextTilteLive(e);
        socketService.emitCreateSocketGroupNoImagePrivateChat(
          e,
          listIdMember.join(','),
          itemRoomId,
          isPush,
        );
      } else {
        showToast(toastEl, t('community.liveChat.member'), 1500);
        setShowModal(false);
        setShowTitleRoom(false);
      }
    }
  };

  const handleMarkChatPremiumComplete = () => {
    // if (item.type === '1-1') {
    //   try {
    //     const GAParams = {
    //       doctor_id: item.owner_id?.toString() || '',
    //       specialty: '',
    //       screen_name: 'Chat Screen',
    //       user_id: user.id ? user.id.toString() : '',
    //       timestamp: moment().unix().toString(),
    //       method: 'App chat ended',
    //     };
    //     GALogEvent(GAEvents.chat_ended, GAParams);
    //   } catch (err) {}
    // }
    // setShowModal(false);
    // const payload = {
    //   id: itemRoomId,
    //   dataUpdate: {
    //     status: 2
    //   }
    // }
    // setTimeout(() => {
    //   setApiLoading(true);
    // }, 300)
    // setTimeout(() => {
    //   dispatch(markCompleteChat(payload));
    // }, 600);
    // end socket
    setShowModal(false);
    socketService.emitEndroom(itemRoomId);
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  // Render
  const convertUser = (text: any) => {
    if (text === '[User deleted]') {
      text = t('communityChat.user.delete');
    } else {
      text;
    }
    return text;
  };

  const renderTextLink = (props: any) => {
    return (
      <View>
        <CText numberOfLines={2} h46 color={appBgChat.txtRightColor}>
          {renderParseText(props)}
        </CText>
      </View>
    );
  };

  const renderTitleLink = (props: any) => {
    return (
      <View>
        <CText numberOfLines={2} h5 color={appBgChat.txtRightColor}>
          {renderParseText(props)}
        </CText>
      </View>
    );
  };

  const renderDescriptionLink = (props: any) => {
    return (
      <View>
        <CText numberOfLines={2} h5 color={appBgChat.txtRightColor}>
          {renderParseText(props)}
        </CText>
      </View>
    );
  };

  const renderMessageText = (props: any) => {
    let typeChat = props?.currentMessage?.type;
    let checkUser = props.currentMessage.user._id === user.id;
    let textGroup =
      props?.currentMessage?.text?.slice(0, 25) === 'DoctorNetwork_Chat_NETDEV';
    let colorText =
      props.currentMessage.user._id === user.id
        ? textGroup
          ? colors.cb2b2b2
          : appBgChat.txtLeftColor
        : textGroup
        ? colors.cb2b2b2
        : appBgChat.txtLeftColor;
    let formatTime = moment(props.currentMessage.createdAt).format('hh:mm A');
    let time = moment(formatTime, ['h:mm A']).format('HH:mm');
    let reply = props?.currentMessage?.reply_id;
    let checkDeleteMess = props?.currentMessage?.text.includes(
      '{community.chat.remove}',
    );
    let checkPinMess = props?.currentMessage?.text.includes(
      t('{communityChat.chat.pinMessage}'),
    );
    let userName = conventUserNameChat(
      listOwner,
      props?.currentMessage?.name,
      firebaseConfig.isReviewApp,
      item.is_name,
    );
    return (
      <View style={{ paddingTop: 8 }}>
        {props?.currentMessage?.text === '{community.chat.recall}' ? (
          typeChat !== 'text' ? (
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: checkUser
                  ? appBgChat.bgRightColor
                  : appBgChat.bgLeftColor,
                borderRadius: 10,
              }}
            >
              {!checkUser && item.type === 'Room' ? (
                <View style={{ paddingVertical: 2 }}>
                  <CText h56 color={getRandomColorUserName(userName ?? '')}>
                    {convertUser(userName) ?? ''}
                  </CText>
                </View>
              ) : null}
              <View
                style={{
                  width: !checkUser ? ScreenWidth / 1.7 : ScreenWidth / 2,
                  paddingVertical: 10,
                }}
              >
                <CText h46 color={appBgChat.txtRightColor}>
                  {t('community.chat.recall')}
                </CText>
              </View>
              <View
                style={{ alignItems: checkUser ? 'flex-end' : 'flex-start' }}
              >
                <CText
                  style={{ paddingHorizontal: 10 }}
                  w500
                  h7
                  color={colors.c667085}
                >
                  {time}
                </CText>
              </View>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
              {!checkUser && item.type === 'Room' ? (
                <View style={{ paddingVertical: 2 }}>
                  <CText h56 color={getRandomColorUserName(userName ?? '')}>
                    {convertUser(userName) ?? ''}
                  </CText>
                </View>
              ) : null}
              <View
                style={{
                  width: !checkUser ? ScreenWidth / 1.7 : ScreenWidth / 2,
                  paddingVertical: 10,
                }}
              >
                <CText h46 color={appBgChat.txtRightColor}>
                  {t('community.chat.recall')}
                </CText>
              </View>
              <View
                style={{ alignItems: checkUser ? 'flex-end' : 'flex-start' }}
              >
                <CText
                  style={{ paddingHorizontal: 10, paddingBottom: 4 }}
                  w500
                  h7
                  color={colors.c667085}
                >
                  {time}
                </CText>
              </View>
            </View>
          )
        ) : checkDeleteMess ? (
          typeChat !== 'text' ? (
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: checkUser
                  ? appBgChat.bgRightColor
                  : appBgChat.bgLeftColor,
                borderRadius: 10,
              }}
            >
              {!checkUser && item.type === 'Room' ? (
                <View style={{ paddingVertical: 2 }}>
                  <CText h56 color={getRandomColorUserName(userName ?? '')}>
                    {convertUser(userName) ?? ''}
                  </CText>
                </View>
              ) : null}
              <View
                style={{
                  width: !checkUser ? ScreenWidth / 1.7 : ScreenWidth / 2,
                  paddingVertical: 10,
                }}
              >
                <CText h46 color={appBgChat.txtRightColor}>{`${conventNameChat(
                  props?.currentMessage?.text,
                )}${t('community.chat.remove')}`}</CText>
              </View>
              <View
                style={{ alignItems: checkUser ? 'flex-end' : 'flex-start' }}
              >
                <CText
                  style={{ paddingHorizontal: 10 }}
                  w500
                  h7
                  color={colors.c667085}
                >
                  {time}
                </CText>
              </View>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
              {!checkUser && item.type === 'Room' ? (
                <View style={{ paddingVertical: 2 }}>
                  <CText h56 color={getRandomColorUserName(userName ?? '')}>
                    {convertUser(userName) ?? ''}
                  </CText>
                </View>
              ) : null}
              <View
                style={{
                  width: !checkUser ? ScreenWidth / 1.7 : ScreenWidth / 2,
                  paddingVertical: 10,
                }}
              >
                <CText h46 color={appBgChat.txtRightColor}>{`${conventNameChat(
                  props?.currentMessage?.text,
                )}${t('community.chat.remove')}`}</CText>
              </View>
              <View
                style={{ alignItems: checkUser ? 'flex-end' : 'flex-start' }}
              >
                <CText
                  style={{ paddingHorizontal: 10, paddingBottom: 4 }}
                  w500
                  h7
                  color={colors.c667085}
                >
                  {time}
                </CText>
              </View>
            </View>
          )
        ) : typeChat === 'image' ? (
          <Pressable>
            {!checkUser && item.type === 'Room' ? (
              <View style={{ paddingVertical: 2, bottom: 2, left: 2 }}>
                <CText h56 color={getRandomColorUserName(userName ?? '')}>
                  {convertUser(userName) ?? ''}
                </CText>
              </View>
            ) : null}
            <VideoImgSelect
              list={props.currentMessage.text}
              onDetailImgVideo={onDetailImgVideo}
              itemRoomId={itemRoomId}
              checkUser={checkUser}
              idMessage={props.currentMessage._id}
              titleName={props?.currentMessage?.name}
              userId={props?.currentMessage?.user?._id}
              checkDeleteMess={checkDeleteMess}
              isPin={props?.currentMessage?.is_pin}
              onDeleteMessage={onDeleteMessage}
              onRecallMessage={onRecallMessage}
              handleShowModalText={handleShowModalText}
            />
          </Pressable>
        ) : typeChat === 'media' ? (
          <Pressable>
            {!checkUser && item.type === 'Room' ? (
              <View style={{ paddingVertical: 2, bottom: 2, left: 2 }}>
                <CText h56 color={getRandomColorUserName(userName ?? '')}>
                  {convertUser(userName) ?? ''}
                </CText>
              </View>
            ) : null}
            <MediaSelect
              list={props.currentMessage.text}
              onDetailImgVideo={onDetailImgVideo}
              itemRoomId={itemRoomId}
              checkUser={checkUser}
              idMessage={props.currentMessage._id}
              titleName={props?.currentMessage?.name}
              userId={props?.currentMessage?.user?._id}
              checkDeleteMess={checkDeleteMess}
              isPin={props?.currentMessage?.is_pin}
              onDeleteMessage={onDeleteMessage}
              onRecallMessage={onRecallMessage}
              handleShowModalText={handleShowModalText}
              checkLoading={props?.currentMessage?._id === idMessageAll}
            />
          </Pressable>
        ) : (
          <>
            {typeChat === 'video' ? (
              <Pressable>
                {!checkUser && item.type === 'Room' ? (
                  <View style={{ paddingVertical: 2, bottom: 2, left: 2 }}>
                    <CText h56 color={getRandomColorUserName(userName ?? '')}>
                      {convertUser(userName) ?? ''}
                    </CText>
                  </View>
                ) : null}
                <VideoSelect
                  list={props.currentMessage.text}
                  // isFocusScreen={isFocusScreen}
                  onDetailImgVideo={onDetailImgVideo}
                  itemRoomId={itemRoomId}
                  checkUser={checkUser}
                  idMessage={props.currentMessage._id}
                  titleName={props?.currentMessage?.name}
                  userId={props?.currentMessage?.user?._id}
                  checkDeleteMess={checkDeleteMess}
                  isPin={props?.currentMessage?.is_pin}
                  handleShowModalText={handleShowModalText}
                  onDeleteMessage={onDeleteMessage}
                  onRecallMessage={onRecallMessage}
                />
              </Pressable>
            ) : typeChat === 'file' ? (
              <Pressable>
                {!checkUser && item.type === 'Room' ? (
                  <View style={{ paddingVertical: 2, bottom: 2, left: 2 }}>
                    <CText h56 color={getRandomColorUserName(userName ?? '')}>
                      {convertUser(userName) ?? ''}
                    </CText>
                  </View>
                ) : null}
                <FileSelect
                  list={props.currentMessage.text}
                  onDetailFile={onDetailFile}
                  itemRoomId={itemRoomId}
                  checkUser={checkUser}
                  idMessage={props.currentMessage._id}
                  titleName={props?.currentMessage?.name}
                  userId={props?.currentMessage?.user?._id}
                  checkDeleteMess={checkDeleteMess}
                  isPin={props?.currentMessage?.is_pin}
                  onDeleteMessage={onDeleteMessage}
                  onRecallMessage={onRecallMessage}
                  handleShowModalText={handleShowModalText}
                  checkLoading={props?.currentMessage?._id === idMessageAll}
                />
              </Pressable>
            ) : typeChat === 'voice' ? (
              <Pressable>
                {!checkUser && item.type === 'Room' ? (
                  <View style={{ paddingVertical: 2, bottom: 2, left: 2 }}>
                    <CText h56 color={getRandomColorUserName(userName ?? '')}>
                      {convertUser(userName) ?? ''}
                    </CText>
                  </View>
                ) : null}
                <AudioSelect
                  list={props?.currentMessage?.text}
                  itemRoomId={itemRoomId}
                  checkUser={checkUser}
                  idMessage={props.currentMessage._id}
                  titleName={props?.currentMessage?.name}
                  userId={props?.currentMessage?.user?._id}
                  checkDeleteMess={checkDeleteMess}
                  isPin={props?.currentMessage?.is_pin}
                  messages={messages}
                  handleShowModalText={handleShowModalText}
                  onDeleteMessage={onDeleteMessage}
                  onRecallMessage={onRecallMessage}
                />
              </Pressable>
            ) : typeChat === 'text' && reply !== null && !textGroup ? (
              <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                <Pressable>
                  {!checkUser && item.type === 'Room' ? (
                    <View style={{ bottom: 2, left: 2 }}>
                      <CText h56 color={getRandomColorUserName(userName ?? '')}>
                        {convertUser(userName) ?? ''}
                      </CText>
                    </View>
                  ) : null}
                  <ReplyMessage
                    messages={messages}
                    list={props?.currentMessage}
                    replyArrId={replyArrId}
                    onDetailFile={onDetailFile}
                    itemRoomId={itemRoomId}
                    checkUser={checkUser}
                    idMessage={props.currentMessage._id}
                    titleName={props?.currentMessage?.name}
                    userId={props?.currentMessage?.user?._id}
                    checkDeleteMess={checkDeleteMess}
                    isPin={props?.currentMessage?.is_pin}
                    onDeleteMessage={onDeleteMessage}
                    onRecallMessage={onRecallMessage}
                    onCoppyMessage={onCoppyMessage}
                    handleShowModalText={handleShowModalText}
                    item={item}
                    handleOnIndex={handleOnIndex}
                    listOwner={listOwner}
                    itemChat={item}
                  />
                </Pressable>
              </View>
            ) : typeChat === 'pin' ? (
              <View style={{ width: ScreenWidth / 1.2, alignItems: 'center' }}>
                <View
                  style={{
                    backgroundColor: '#FFFCF5',
                    paddingHorizontal: 13,
                    paddingVertical: 4,
                    borderRadius: 20,
                    marginBottom: 10,
                  }}
                >
                  <Row center>
                    {checkPinMess ? (
                      <Image
                        source={images.community.icon_pin}
                        style={screenStyles.box24}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={images.community.icon_unPin}
                        style={screenStyles.box24}
                        resizeMode="contain"
                      />
                    )}
                    <CText numberOfLines={1} center h6 color={'black'}>
                      <CText numberOfLines={1} w500 center h6 color={'#F79009'}>
                        {!checkPinMess
                          ? conventNameChat(
                              JSON.parse(
                                props.currentMessage.text,
                              )[0].title.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.unPinMessage'),
                            )
                          : conventNameChat(
                              JSON.parse(
                                props?.currentMessage?.text,
                              )[0].title.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.pinMessage'),
                            )}
                      </CText>
                      {props.currentMessage.text.includes('idTag')
                        ? ` ${
                            JSON.parse(
                              JSON.parse(props.currentMessage.text)[0].content,
                            ).content
                          }`
                        : ` ${
                            JSON.parse(props.currentMessage.text)[0].content
                          }`}
                    </CText>
                  </Row>
                </View>
              </View>
            ) : extractAndValidateURI(props?.currentMessage?.text) ? (
              <View>
                <View
                  style={{
                    width: checkUser
                      ? ScreenWidth / 1.2 - 10
                      : ScreenWidth / 1.3 - 3,
                  }}
                >
                  {!checkUser && item.type === 'Room' ? (
                    <View style={{ top: 4, left: 10 }}>
                      <CText h56 color={getRandomColorUserName(userName ?? '')}>
                        {convertUser(userName) ?? ''}
                      </CText>
                    </View>
                  ) : null}
                  <Pressable
                    onPress={() => handleLink(props?.currentMessage?.text)}
                    onLongPress={() =>
                      handleShowModalText(
                        props?.currentMessage?._id,
                        props?.currentMessage?.text,
                        props?.currentMessage?.name,
                        props?.currentMessage?.user?._id,
                        checkDeleteMess,
                        props?.currentMessage?.is_pin,
                        typeChat,
                      )
                    }
                  >
                    <Pressable
                      onLongPress={() =>
                        handleShowModalText(
                          props?.currentMessage?._id,
                          props?.currentMessage?.text,
                          props?.currentMessage?.name,
                          props?.currentMessage?.user?._id,
                          checkDeleteMess,
                          props?.currentMessage?.is_pin,
                          typeChat,
                        )
                      }
                    >
                      {!props?.currentMessage?.text.includes(
                        'https://cdn-global.doctornetwork.us/videos',
                      ) ? (
                        <LinkPreview
                          renderText={renderTextLink}
                          renderTitle={renderTitleLink}
                          renderDescription={renderDescriptionLink}
                          // renderImage={renderImage}
                          // renderLinkPreview={renderImage2}
                          enableAnimation={false}
                          // onPreviewDataFetched={(e: any)=> {console.log('====', e)}}
                          textContainerStyle={{
                            marginHorizontal: 10,
                            marginVertical: 5,
                          }}
                          text={props.currentMessage.text}
                          touchableWithoutFeedbackProps={{
                            onPress: () =>
                              handleLink(props?.currentMessage?.text),
                            onLongPress: () =>
                              handleShowModalText(
                                props?.currentMessage?._id,
                                props?.currentMessage?.text,
                                props?.currentMessage?.name,
                                props?.currentMessage?.user?._id,
                                checkDeleteMess,
                                props?.currentMessage?.is_pin,
                                typeChat,
                              ),
                          }}
                        />
                      ) : (
                        <View
                          style={{ paddingVertical: 5, paddingHorizontal: 10 }}
                        >
                          <CText
                            style={{ textDecorationLine: 'underline' }}
                            h46
                            color={colorText}
                          >
                            {filterBadWords(
                              props.currentMessage.text,
                              _badWords,
                            )}
                          </CText>
                          <VideoSelect
                            list={props.currentMessage.text}
                            // isFocusScreen={isFocusScreen}
                            onDetailImgVideo={onDetailImgVideo}
                            itemRoomId={itemRoomId}
                            checkUser={checkUser}
                            idMessage={props.currentMessage._id}
                            titleName={props?.currentMessage?.name}
                            userId={props?.currentMessage?.user?._id}
                            checkDeleteMess={checkDeleteMess}
                            isPin={props?.currentMessage?.is_pin}
                            handleShowModalText={handleShowModalText}
                            onDeleteMessage={onDeleteMessage}
                            onRecallMessage={onRecallMessage}
                          />
                        </View>
                      )}
                      <View style={{ paddingVertical: 3 }} />
                    </Pressable>
                  </Pressable>
                </View>
              </View>
            ) : typeChat === 'tag' ? (
              <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                <Pressable
                  onLongPress={() =>
                    handleShowModalText(
                      props?.currentMessage?._id,
                      props?.currentMessage?.text,
                      props?.currentMessage?.name,
                      props?.currentMessage?.user?._id,
                      checkDeleteMess,
                      props?.currentMessage?.is_pin,
                      typeChat,
                    )
                  }
                >
                  <View
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                      backgroundColor: checkUser
                        ? appBgChat.bgRightColor
                        : appBgChat.bgLeftColor,
                      borderRadius: 10,
                      left: checkUser ? 10 : -8,
                    }}
                  >
                    <Pressable
                      onLongPress={() =>
                        handleShowModalText(
                          props?.currentMessage?._id,
                          props?.currentMessage?.text,
                          props?.currentMessage?.name,
                          props?.currentMessage?.user?._id,
                          checkDeleteMess,
                          props?.currentMessage?.is_pin,
                          typeChat,
                        )
                      }
                    >
                      {!checkUser && item.type === 'Room' ? (
                        <View style={{ paddingVertical: 4, top: 4 }}>
                          <CText
                            h56
                            color={getRandomColorUserName(userName ?? '')}
                          >
                            {convertUser(userName) ?? ''}
                          </CText>
                        </View>
                      ) : null}
                      <View
                        style={{
                          width: !checkUser
                            ? ScreenWidth / 1.4
                            : props.currentMessage.text.length < 20
                            ? ScreenWidth / 2.3
                            : ScreenWidth / 1.3,
                          paddingVertical: 10,
                        }}
                      >
                        <CText h56 color={colors.black}>
                          {props?.currentMessage?.text.includes('@')
                            ? JSON.parse(props.currentMessage.text)
                                ?.content?.split(/(@\S+)/g)
                                .map((item: any, index: any) => {
                                  return (
                                    <Pressable
                                      key={index}
                                      style={{ paddingTop: 5 }}
                                      onPress={() =>
                                        handleGoProfile(
                                          item,
                                          JSON.parse(props.currentMessage.text),
                                        )
                                      }
                                    >
                                      <CText h46 color={appBgChat.txtLeftColor}>
                                        {convertTextToColors(item)}
                                      </CText>
                                    </Pressable>
                                  );
                                })
                            : null}
                        </CText>
                      </View>
                    </Pressable>
                    <View
                      style={{
                        alignItems: checkUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <CText style={{}} w500 h7 color={colors.c667085}>
                        {time}
                      </CText>
                    </View>
                  </View>
                </Pressable>
              </View>
            ) : textGroup ? (
              <View style={{ width: ScreenWidth / 1.2 }}>
                <View style={{ alignItems: 'center' }}>
                  {props.currentMessage.text.includes(
                    '{communityChat.chat.memberLeveaGroup}',
                  ) ? (
                    <CText w500 center h56 color={colorText}>
                      {conventNameChat(
                        props.currentMessage.text.replaceAll(
                          'DoctorNetwork_Chat_NETDEV ',
                          '',
                        ),
                      ) + t('communityChat.chat.memberLeveaGroup')}
                    </CText>
                  ) : props.currentMessage.text.includes(
                      '{communityChat.chat.addMember}',
                    ) ? (
                    <CText w500 center h56 color={colorText}>
                      {conventNameChat(
                        props.currentMessage.text.replaceAll(
                          'DoctorNetwork_Chat_NETDEV ',
                          '',
                        ),
                      ) + t('communityChat.chat.addMember')}
                    </CText>
                  ) : props.currentMessage.text.includes(
                      '{communityChat.chat.deleteMember}',
                    ) ? (
                    <CText w500 center h56 color={colorText}>
                      {conventNameChat(
                        props.currentMessage.text.replaceAll(
                          'DoctorNetwork_Chat_NETDEV ',
                          '',
                        ),
                      ) + t('communityChat.chat.deleteMember')}
                    </CText>
                  ) : props.currentMessage.text.includes(
                      '{communityChat.chat.startLivestream}',
                    ) ? (
                    <CText w500 center h56 color={colorText}>{`${t(
                      'communityChat.listMember.owner',
                    )} ${t('communityChat.chat.startLivestream')}`}</CText>
                  ) : props.currentMessage.text.includes(
                      '{communityChat.chat.endLivestream}',
                    ) ? (
                    <CText w500 center h56 color={colorText}>{`${t(
                      'communityChat.listMember.owner',
                    )} ${t('communityChat.chat.endLivestream')}`}</CText>
                  ) : props.currentMessage.text.includes(
                      '{communityChat.listMember.changeRole}',
                    ) ? (
                    <CText w500 center h56 color={colorText}>
                      {conventNameChat(
                        props.currentMessage.text.replaceAll(
                          'DoctorNetwork_Chat_NETDEV ',
                          '',
                        ),
                      ) + t('communityChat.chat.changeRole')}
                    </CText>
                  ) : null}
                </View>
              </View>
            ) : (
              <>
                {typeChat !== 'reply' ? (
                  <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                    {!checkUser && item.type === 'Room' ? (
                      <View style={{ paddingVertical: 2, bottom: 2 }}>
                        <CText
                          h56
                          color={getRandomColorUserName(userName ?? '')}
                        >
                          {convertUser(userName) ?? ''}
                        </CText>
                      </View>
                    ) : null}
                    <View
                      style={{
                        width: !checkUser
                          ? props.currentMessage.text.length < 20
                            ? ScreenWidth / 1.7
                            : ScreenWidth / 1.4
                          : props.currentMessage.text.length < 20
                          ? ScreenWidth / 2.3
                          : ScreenWidth / 1.3 - 5,
                        paddingVertical: 5,
                      }}
                    >
                      <CText h46 color={colorText}>
                        {filterBadWords(props.currentMessage.text, _badWords)}
                      </CText>
                    </View>
                  </View>
                ) : null}
              </>
            )}
          </>
        )}
      </View>
    );
  };

  const renderMessageImage = (props: any) => {
    let checkDeleteMess = props?.currentMessage?.text.includes(
      '{community.chat.remove}',
    );
    let checkUser = props.currentMessage.user._id === user.id;
    let formatTime = moment(props.currentMessage.createdAt).format('hh:mm A');
    let time = moment(formatTime, ['h:mm A']).format('HH:mm');
    if (props.currentMessage.type === 'image') {
      let arr = [];
      let img = props.currentMessage.image.split(',');
      for (let i = 0; i < img.length; i++) {
        arr.push({ type: 'image', src: img[i] });
      }
      if (props.currentMessage.text === '{community.chat.recall}') {
        return null;
      } else {
        return (
          <Pressable>
            <ImgLocal
              listImages={arr}
              heightLocalImg={heightLocalImg}
              onDetailImgVideo={onDetailImgVideo}
              itemRoomId={itemRoomId}
              idMessage={props.currentMessage._idCdn}
              uriCdn={props.currentMessage.imageCdn}
              titleName={props?.currentMessage?.name}
              userId={props?.currentMessage?.user?._id}
              checkDeleteMess={checkDeleteMess}
              isPin={props?.currentMessage?.is_pin}
              onDeleteMessage={onDeleteMessage}
              onRecallMessage={onRecallMessage}
              onCoppyMessage={onCoppyMessage}
              handleShowModalText={handleShowModalText}
            />
          </Pressable>
        );
      }
    } else if (props.currentMessage.type === 'media') {
      if (props.currentMessage.text === '{community.chat.recall}') {
        return null;
      } else {
        return (
          <Pressable>
            <MediaImgVideoLocal
              list={props.currentMessage.image}
              uriCdn={props.currentMessage.imageCdn}
              onDetailImgVideo={onDetailImgVideo}
              itemRoomId={itemRoomId}
              checkUser={checkUser}
              idMessage={props.currentMessage._idCdn}
              onDeleteMessage={onDeleteMessage}
              onRecallMessage={onRecallMessage}
              titleName={props?.currentMessage?.name}
              userId={props?.currentMessage?.user?._id}
              checkDeleteMess={checkDeleteMess}
              isPin={props?.currentMessage?.is_pin}
              handleShowModalText={handleShowModalText}
            />
          </Pressable>
        );
      }
    } else if (props.currentMessage.type === 'file') {
      let arrFile = [];
      let file = props.currentMessage.image.split(',');
      for (let i = 0; i < file.length; i++) {
        const fileName = file[i].split('/').pop();
        arrFile.push({
          type: 'file',
          src: file[i],
          filename: isIOS ? fileName : fileNameFNS,
        });
        break;
      }
      if (props.currentMessage.text === '{community.chat.recall}') {
        return null;
      } else {
        return (
          <Pressable>
            {props?.currentMessage?._id === idMessageAll ? (
              <FileLocal
                list={arrFile}
                onDetailFile={onDetailFile}
                itemRoomId={itemRoomId}
                checkUser={checkUser}
                idMessage={props.currentMessage._id}
                titleName={props?.currentMessage?.name}
                userId={props?.currentMessage?.user?._id}
                checkDeleteMess={checkDeleteMess}
                isPin={props?.currentMessage?.is_pin}
                appBgChat={appBgChat}
                onDeleteMessage={onDeleteMessage}
                onRecallMessage={onRecallMessage}
                onCoppyMessage={onCoppyMessage}
                handleShowModalText={handleShowModalText}
              />
            ) : (
              <FileSelect
                list={props.currentMessage.file}
                onDetailFile={onDetailFile}
                itemRoomId={itemRoomId}
                checkUser={checkUser}
                idMessage={props.currentMessage._id}
                titleName={props?.currentMessage?.name}
                userId={props?.currentMessage?.user?._id}
                checkDeleteMess={checkDeleteMess}
                isPin={props?.currentMessage?.is_pin}
                appBgChat={appBgChat}
                onDeleteMessage={onDeleteMessage}
                onRecallMessage={onRecallMessage}
                handleShowModalText={handleShowModalText}
                checkLoading={props?.currentMessage?._id === idMessageAll}
              />
            )}
          </Pressable>
        );
      }
    } else if (props.currentMessage.type === 'voice') {
      if (props.currentMessage.text === '{community.chat.recall}') {
        return null;
      } else {
        return (
          <Pressable>
            {props?.currentMessage?._id === idMessageAll ? (
              <AudioLocal
                list={uriVoice}
                timeVoice={timeVoice}
                itemRoomId={itemRoomId}
                checkUser={checkUser}
                idMessage={props.currentMessage._id}
                titleName={props?.currentMessage?.name}
                userId={props?.currentMessage?.user?._id}
                checkDeleteMess={checkDeleteMess}
                isPin={props?.currentMessage?.is_pin}
                appBgChat={appBgChat}
                onDeleteMessage={onDeleteMessage}
                onRecallMessage={onRecallMessage}
                onCoppyMessage={onCoppyMessage}
                handleShowModalText={handleShowModalText}
              />
            ) : (
              <AudioSelect
                list={props?.currentMessage?.voice}
                itemRoomId={itemRoomId}
                checkUser={checkUser}
                idMessage={props.currentMessage._id}
                titleName={props?.currentMessage?.name}
                userId={props?.currentMessage?.user?._id}
                checkDeleteMess={checkDeleteMess}
                isPin={props?.currentMessage?.is_pin}
                appBgChat={appBgChat}
                handleShowModalText={handleShowModalText}
                onDeleteMessage={onDeleteMessage}
                onRecallMessage={onRecallMessage}
              />
            )}
          </Pressable>
        );
      }
    } else if (
      props.currentMessage.type === 'reply' ||
      props.currentMessage.reply_id !== null
    ) {
      if (props.currentMessage.text === '{community.chat.recall}') {
        return null;
      } else {
        return (
          <Pressable style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
            <ReplyMessageLocal
              messages={messages}
              list={props?.currentMessage}
              replyArrId={replyArrId}
              onDetailFile={onDetailFile}
              itemRoomId={itemRoomId}
              checkUser={checkUser}
              idMessage={props.currentMessage._id}
              onDeleteMessage={onDeleteMessage}
              onRecallMessage={onRecallMessage}
              titleName={props?.currentMessage?.name}
              userId={props?.currentMessage?.user?._id}
              checkDeleteMess={checkDeleteMess}
              isPin={props?.currentMessage?.is_pin}
              handleShowModalText={handleShowModalText}
              idMessText={idMessText}
              textCoppy={textCoppy}
              handleOnIndex={handleOnIndex}
              idMessageAll={idMessageAll}
              seenMessage={seenMessage}
              time={time}
              listOwner={listOwner}
              itemChat={item}
            />
          </Pressable>
        );
      }
    }
  };

  const renderMessageVideo = (props: any) => {
    let checkDeleteMess = props?.currentMessage?.text.includes(
      '{community.chat.remove}',
    );
    let arr = [];
    let video = props.currentMessage.video;

    if (props.currentMessage.type === 'video') {
      if (props.currentMessage.text === '{community.chat.recall}') {
        return null;
      } else {
        return (
          <Pressable>
            <VideoLocal
              listVideo={video}
              onDetailImgVideo={onDetailImgVideo}
              itemRoomId={itemRoomId}
              checkUser={checkUser}
              idMessage={props.currentMessage._idCdn}
              uriCdn={props.currentMessage.videoCdn}
              titleName={props?.currentMessage?.name}
              userId={props?.currentMessage?.user?._id}
              checkDeleteMess={checkDeleteMess}
              isPin={props?.currentMessage?.is_pin}
              onDeleteMessage={onDeleteMessage}
              onRecallMessage={onRecallMessage}
              onCoppyMessage={onCoppyMessage}
              handleShowModalText={handleShowModalText}
              upDateVideoIsLoading={upDateVideoIsLoading}
            />
          </Pressable>
        );
      }
    }
  };

  const renderComposer = (props: any) => {
    const lines = textMessages.split('\n');
    return (
      <Row
        style={{
          paddingVertical: 10,
          flex: 1,
        }}
      >
        {textMessages.length > 50 || lines.length > 2 ? (
          <Composer
            {...props}
            textInputStyle={{
              borderRadius: 25,
              borderWidth: 0.5,
              borderColor: colors.cD0D5DD,
              paddingTop: 7,
              paddingHorizontal: 14,
              color: colors.c101828,
            }}
          />
        ) : (
          <Composer
            {...props}
            textInputStyle={{
              borderRadius: 25,
              borderWidth: 0.5,
              borderColor: colors.cD0D5DD,
              paddingTop: 7,
              paddingHorizontal: 14,
              color: colors.c101828,
            }}
            composerHeight={40}
          />
        )}
        {textMessages === '' ? (
          <View
            style={{ position: 'absolute', right: 8, top: isIOS ? 24 : 17 }}
          >
            <Row>
              <Pressable
                style={{
                  paddingHorizontal: 10,
                }}
                onPress={handlePhoto}
              >
                <Image
                  source={images.community.img_button}
                  style={screenStyles.box20}
                />
              </Pressable>
              <Pressable
                style={{
                  paddingRight: 10,
                }}
                onPress={handleFile}
              >
                <Image
                  source={images.community.file_button}
                  style={screenStyles.box24}
                />
              </Pressable>
            </Row>
          </View>
        ) : null}
      </Row>
    );
  };

  const handleChosseUserTab = (item: any) => {
    let arr = [...userTag];
    arr.push(item.id);
    let uniqueArray = arr.filter((item, index) => arr.indexOf(item) === index);
    const words = textMessages.split(' ');
    const str =
      textMessages.replaceAll(words[words.length - 1], '@') +
      `${item.full_name.replace(/\s/g, '')} `;
    setTextMessages(str);
    // setTextMessages(textMessages.replaceAll('@', `@${item.full_name} `).substring(0, startIndex + 1) + `${item.full_name.replace(/\s/g, "")} `)
    setcheckShowAddTab(false);
    setUserTag(uniqueArray);
    setTextTag('');
  };

  const renderAddFriend = () => (
    <>
      <AddFriend
        listFriends={listFriends}
        listFriendsWaiting={listFriendsWaiting}
        listFriendsInvited={listFriendsInvited}
        item={item}
        handleResquestFriends={() => handleResquestFriends()}
      />
    </>
  );

  const renderItemAddTab = (item: any, index: any) => {
    return (
      <ScrollView
        ref={scrollViewRef}
        key={index}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => handleChosseUserTab(item)}>
          <Row start style={{ paddingVertical: 5, paddingHorizontal: 8 }}>
            <View style={styles.avatar40}>
              <ImageHelper
                source={{ uri: item.avatar }}
                renderErrorImage={renderErrorImage}
              />
            </View>
            {item.role === 'Owner' && (
              <View style={styles.avatarKey}>
                <IconX
                  style={{ top: 2, right: 0 }}
                  name={'key'}
                  type={IconType.IONICONS}
                  color={colors.cFECD5D}
                  size={8}
                />
              </View>
            )}
            <View style={{ marginLeft: 10 }}>
              <CText color={colors.c101828} h5>
                {item.full_name}
              </CText>
            </View>
          </Row>
        </Pressable>
      </ScrollView>
    );
  };

  const renderTag = () => (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{
          position: 'absolute',
          bottom: isIOS ? height + 60 : 60,
          height: 120,
          width: ScreenWidth,
          zIndex: 200,
          backgroundColor: colors.cF2F4F7,
        }}
      >
        <View>
          {listTotalMember.map((item: any, index: any) =>
            renderItemAddTab(item, index),
          )}
        </View>
      </ScrollView>
    </>
  );

  const renderPin = () => (
    <>
      <MessagePin
        messagesPin={messagesPin}
        fileNameFNS={fileNameFNS}
        handleShowPin={() => {
          setShowListPin(true), setCheckIsPin(true);
        }}
      />
    </>
  );

  // const renderLiveStream = () => {
  //   return (
  //     <>
  //       {/* {showLiveStream && (
  //         <LiveStream
  //           itemRoomChat={item}
  //           listIdMember={listIdMember}
  //           onhandleClose={() => setShowLiveStream(false)}
  //           onhandleStop={(e: any) => setAdaptor(e)}
  //           height={height}
  //           textTilteLive={textTilteLive}
  //           setIsLiveStream={setIsLiveStream}
  //           setItem={setItem}
  //           countViewer={countViewer}
  //           handleCreateRoom={handleLiveStream}
  //         />
  //       )} */}
  //       {/* {showPlayLiveStream && (
  //         <PlayLiveStream
  //           itemLiveStream={item}
  //           onhandleClose={() => setPlayShowLiveStream(false)}
  //           onhandleStop={(e: any) => setAdaptor(e)}
  //           height={height}
  //         />
  //       )} */}
  //     </>
  //   );
  // };

  const renderChatContent = () => {
    return (
      <GiftedChat
        locale={i18n.language}
        textInputRef={textRef}
        bottomOffset={isOnlyView ? 0 : isIOS ? -20 : 0}
        messages={messages}
        onSend={messages => onSend(messages)}
        alwaysShowSend={true}
        placeholder={`${t('communityChat.chat.input')}`}
        keyboardShouldPersistTaps="handled"
        isScrollToBottomEnabled={true}
        scrollToBottomStyle={[styles.bottomgoback]}
        listViewProps={
          {
            showsVerticalScrollIndicator: false,
          } as any
        }
        scrollToBottomComponent={() => (
          <View style={styles.shadowGoback}>
            <View style={{ height: 30, width: 30 }}>
              <IconX
                style={styles.iconBack}
                type={IconType.FEATHER}
                name={'chevrons-down'}
                size={22}
                color={colors.black}
              />
            </View>
          </View>
        )}
        user={{
          _id: user?.id,
          name: user?.full_name,
          avatar: user?.personalization?.avatar,
        }}
        onPress={() => setcheckShowAddTab(false)}
        renderAvatarOnTop
        showUserAvatar={false}
        showAvatarForEveryMessage={item.type === '1-1' ? false : true}
        minInputToolbarHeight={
          isOnlyView ? 0 : getBottomSpace() + ifIphoneX(-19, 0)
        }
        minComposerHeight={isOnlyView ? 0 : undefined}
        renderMessage={renderMessage}
        renderMessageText={renderMessageText}
        renderComposer={props => (isOnlyView ? null : renderComposer(props))}
        renderInputToolbar={props =>
          isOnlyView ? null : renderInputToolbar(props)
        }
        renderSend={renderSend}
        renderActions={renderActions}
        renderChatEmpty={renderChatEmpty}
        renderAvatar={renderAvatar}
        renderTime={renderTime}
        renderDay={renderDay}
        text={textMessages}
        onInputTextChanged={text => {
          handleChangeMessageChat(text);
        }}
        onLoadEarlier={handleLoadMore}
        loadEarlier={true}
        isLoadingEarlier={finalLoad}
        infiniteScroll={true}
        renderLoadEarlier={props => renderLoadEarlier(props)}
        renderFooter={renderFooter}
      />
    );
  };

  const renderList = () => {
    if (firstRender) {
      return <CLoading />;
    } else {
      const bgPath = { uri: appBgChat.path };
      return (
        <View
          style={{
            flex: 1,
            paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
          }}
        >
          {item.type === '1-1' && item.is_premium != 1
            ? renderAddFriend()
            : null}
          {renderPin()}
          {/* {renderLiveStream()} */}
          {checkShowAddTab && item.type === 'Room' ? renderTag() : null}
          {appBgChat.path != '' ? (
            <View style={screenStyles.flex1}>
              <Image
                source={bgPath}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                pointerEvents="none"
              />
              {renderChatContent()}
            </View>
          ) : (
            renderChatContent()
          )}
        </View>
      );
    }
  };

  return (
    <Wrapper>
      <CHeader
        leftComponent={renderLeftHead()}
        isBorderBottom
        rightComponent={renderRightHeader()}
      />
      {renderList()}

      {showModal && (
        <ModalSettingChat
          isVisible={showModal}
          hideModal={() => setShowModal(false)}
          itemRoomId={itemRoomId}
          item={item}
          handleHideModal={handleHideModal}
          handleSendInvite={onSendInvite}
          handleSendLeave={onSendLeave}
          handleAdminLeave={onAdminLeave}
          handleSendDelete={onSendDelete}
          handleRemoveMember={onSendDeleteMember}
          navigation={navigation}
          listCreateRoom={listCreateRoom}
          listHistoryChatRoom={listHistoryChatRoom}
          checkUser={checkUser}
          isOnlyView={isOnlyView}
          listOwner={listOwner}
          handleLiveStream={handleShowTitleLiveChat}
          handleReport={handleReport}
          onBlockUserMsg={handleBlockUserMsg}
          isBlockMsg={isBlockMsg}
          onMarkChatComplete={handleMarkChatPremiumComplete}
        />
      )}

      {showModalMedia && (
        <MediaLocal
          isVisible={showModalMedia}
          hideModal={() => setShowModalMedia(false)}
          onSendImgVideo={onSendImgVideo}
        />
      )}
      {(showModalDetail || showModalDetailV2) && (
        <DetailImgVideo
          isVisible={showModalDetail}
          hideModal={() => {
            setShowModalDetail(false);
            setShowModalDetailV2(true);
          }}
          imgDetail={imgDetail}
          type={type}
        />
      )}
      {(showModalDetailFile || showModalDetailV2) && (
        <DetailFile
          isVisible={showModalDetailFile}
          hideModal={() => {
            setShowModalDetailFile(false);
            setShowModalDetailV2(true);
          }}
          fileUriDetail={fileUriDetail}
        />
      )}
      <BottomSheetVoice
        bottomSheetRef={bottomSheetRef}
        hideModal={() => bottomSheetRef.current?.close()}
        handleVoiceSendMess={handleVoiceSendMess}
      />
      
      {showMessModal && (
        <MessageModal
          isVisible={showMessModal}
          hideModal={() => setShowMessModal(false)}
          itemRoomId={itemRoomId}
          checkUser={checkUser}
          textCoppy={textCoppy}
          checkMessageDelete={checkMessageDelete}
          checIsPin={checIsPin}
          typeMessage={typeMessage}
          handleDeleteMess={showModalOwnerDelete}
          handleRecallMess={onRecallMessageText}
          handleCoppyMess={onCoppyMessage}
          handleReplyMessage={onReplyMessage}
          handleShareMessage={onShareMessage}
          handlePinMessage={onPinMessage}
        />
      )}

      {showShareMess && (
        <ShareMessage
          isVisible={showShareMess}
          hideModal={() => setShowShareMess(false)}
          textCoppy={textCoppy}
          typeMessage={typeMessage}
        />
      )}
      
      {showOwnerMess && (
        <OwnerDeleteMessage
          isVisible={showOwnerMess}
          hideModal={() => setShowOwnerMess(false)}
          handleDeleteOnly={handleDeleteOnly}
          handleDeleteAll={handleDeleteAll}
        />
      )}
      
      {showListPin && (
        <ModalListPin
          isVisible={showListPin}
          hideModal={() => setShowListPin(false)}
          listPin={messagesPin}
          idMessText={idMessText}
          itemRoomId={itemRoomId}
          onSendPinMessage={onSendPinMessage}
          handleOnIndex={handleOnIndex}
          navigation={navigation}
        />
      )}

      {showModalListMember && (
        <ModalListMember
          isVisible={showModalListMember}
          hideModal={() => setShowModalListMember(false)}
          itemRoomId={itemRoomId}
          itemChat={item}
          handleRemoveMember={onSendDeleteMember}
          listOwner={listOwner}
          listTotalMember={listTotalMember}
          navigation={navigation}
          isOnlyView={isOnlyView}
        />
      )}

      {showModalNotiMess && (
        <ModalListMember
          isVisible={showModalNotiMess}
          hideModal={() => setshowModalNotiMess(false)}
        />
      )}

      {showEditRoom && (
        <EditRoom
          isVisible={showEditRoom}
          hideModal={() => setShowEditRoom(false)}
          item={item}
          handleHideEditRoom={handleHideEditRoom}
          setShowEditRoom={setShowEditRoom}
          setItem={setItem}
        />
      )}

      {showtitleRoom && (
        <TitleLiveChat
          isVisible={showtitleRoom}
          hideModal={() => setShowTitleRoom(false)}
          handleSubmit={handleLiveStream}
        />
      )}

      {showEmoji && (
        <ModalLike
          showModalLike={showEmoji}
          hideModal={() => setShowEmoji(false)}
          yOffset={yOffset}
          xOffset={xOffset}
          listLikeEmoji={listLikeEmoji}
          idMessageLikeEmoji={idMessageLikeEmoji}
          onLikePost={handleLikePost}
          handleUnlike={handleUnlike}
          typeMessage={typeMessage}
          checkUser={checkUser}
          arrLikeEmoji={arrLikeEmoji}
          user={user}
          textEmoji={textEmoji}
          textReplyEmoji={textReplyEmoji}
          scrollViewRef={scrollViewRef}
        />
      )}

      {showErrorRoom && (
        <ErrorRoom
          isVisible={showErrorRoom}
          hideModal={() => setShowErrorRoom(false)}
          item={item}
          handleHideEditRoom={handleHideEditRoom}
        />
      )}

      <BottomSheetListEmojji
        bottomSheetRef={bottomSheetEmojiRef}
        hideModal={() => bottomSheetEmojiRef.current?.close()}
        listViewEmoji={listViewEmoji}
        listLikeEmoji={listLikeEmoji}
        listTotalMember={listTotalMember}
      />
      <BottomSheetReport
        t={t}
        bottomSheetReportRef={bottomSheetReportRef}
        videoChoose={item}
      />
      {apiLoading ? (
        <APILoading showAlert={apiLoading} isLoadingAPI={apiLoading} />
      ) : null}
      <ConfirmModal
        visible={modalConfirm.isVisible}
        message={modalConfirm.message}
        onCancel={modalConfirm.onCancel}
        onConfirm={modalConfirm.onConfirm}
      />
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  avatarDot: {
    position: 'absolute' as const,
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 25,
    left: 32,
    backgroundColor: colors.c12B76A,
  },
  avatarKey: {
    position: 'absolute' as const,
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 30,
    left: 42,
    backgroundColor: colors.c344054,
  },
  leftWrapper: {
    position: 'absolute' as const,
    left: 16,
    ...screenStyles.rowCenter,
    alignItems: 'center' as const,
  },
  avatar20: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  avatar22: {
    width: 22,
    height: 22,
    borderRadius: 12,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  avatar25: {
    width: 25,
    height: 25,
    borderRadius: 12,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  avatar30: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  avatar36: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  avatar40: {
    width: 40,
    height: 40,
    left: 4,
    borderRadius: 20,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },

  avatar40Member: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  avatarListMember40: {
    width: 40,
    height: 40,
    left: 4,
    overflow: 'hidden' as const,
  },
  avatar60: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  imgCoppy: {
    width: 52,
    height: 52,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
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
  bottomgoback: {
    position: 'absolute' as const,
    bottom: 120,
    right: 8,
  },
  shadowGoback: {
    borderRadius: 15,
    borderColor: '#d3dadb',
    ...screenStyles.shadow,
    overflow: 'hidden' as const,
  },
  shadowEmoji: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d3dadb',
    ...screenStyles.shadow,
    overflow: 'hidden' as const,
  },
  iconBack: { left: 4, top: 4, position: 'absolute' as const, zIndex: 100 },
  iconEmoji: {
    // left: isIOS ? 1 : 0.5,
    // top: isIOS ? 3 : 1,
    // position: 'absolute',
    // zIndex: 100
  },
  iconEmojiLeft: {
    position: 'absolute' as const,
    zIndex: 1,
  },
  iconEmojiRight: {
    position: 'absolute' as const,
    zIndex: 1,
  },
  rightWrapper: {
    right: 40,
    top: 6,
    position: 'absolute' as const,
    ...screenStyles.rowCenter,
  },
  wrapperTyping: {
    opacity: 0.5,
    marginBottom: 10,
  },
  txtTyping: {
    marginLeft: 30,
  },
  TextStyle: {
    fontStyle: 'italic' as const,
    fontSize: 13,
    color: colors.c1D2939,
  },
  backgroundViewTextLeft: {
    height: 50,
    justifyContent: 'center' as const,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderStartEndRadius: 10,
    borderStartStartRadius: 10,
    backgroundColor: colors.cD0D5DD,
  },
  backgroundViewTextRight: {
    height: 50,
    justifyContent: 'center' as const,
    paddingHorizontal: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.cEAECF0,
  },
  backgroundViewTextLeftText: {
    height: 42,
    justifyContent: 'center' as const,
    borderBottomLeftRadius: 10,
    borderStartEndRadius: 10,
    borderStartStartRadius: 10,
    backgroundColor: colors.cD0F0FF,
  },
  backgroundViewTextRightText: {
    height: 42,
    justifyContent: 'center' as const,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.cEAECF0,
  },
  shadow: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#C4C4C4',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  styleBold: {
    fontWeight: '700' as const,
    fontFamily: fonts.inter,
  },
  url: {
    color: colors.c101828,
    fontFamily: fonts.inter,
    textDecorationLine: 'underline' as const,
  },
}));

export default ChatScreen;
