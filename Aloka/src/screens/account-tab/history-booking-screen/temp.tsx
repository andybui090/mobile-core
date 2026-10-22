import { CSearchBar, IconType, IconX, ImageHelper } from '@/components';
import {
  changeAlias,
  images,
  isIOS,
  keyExtractor,
  screenStyles,
  showToast,
  timeDifferenceV2,
} from '@/configs';
import { PAGINATION, STORAGEKEY } from '@/constants';
import { mainRoute } from '@/constants/route_key';
import { AppContext } from '@/contexts';
import { resetHistoryChat } from '@/redux/slices/communitySlice';
import {
  resetCheckErorrRemoveRoom,
  resetMessages,
  resetPinLocal,
  resetPinMessage,
  resetRoomDetal,
  updateLocalChatFirstTime,
} from '@/redux/slices/socketioSlice';
import { store } from '@/redux/store';
// import { navigationRef } from '@/navigation/RootNavigation';
// import { resetHistoryChat } from '@/redux/slices/communitySlice';
import { setHistoryChatName } from '@/redux/slices/globalSlice';
// import { resetCheckErorrRemoveRoom, resetMessages, resetPinLocal, resetPinMessage, resetRoomDetal } from '@/redux/slices/socketioSlice';
// import { store } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import socketService from '@/socketio';
import {
  getObjectData,
  getStringData,
  storeObjectData,
  storeStringData,
} from '@/storages';
import { CEmptyData, CLoading, CText, Row } from '@/utils';
import { useIsFocused } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  textAppcet: {
    backgroundColor: colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden' as const,
    borderColor: colors.primary,
    textAlign: 'center' as const,
  },
  textReject: {
    backgroundColor: colors.white,
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden' as const,
    borderColor: colors.c667085,
    textAlign: 'center' as const,
    marginLeft: 10,
  },
}));

const HistoryChatTab = ({ navigation, refreshIdx }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const isFocusScreen = useIsFocused();
  const { t } = useTranslation();
  const styles = useStyles();
  const toastEl = useRef(null);
  const bottomSheetRef = useRef<any>(null);
  const { user } = useContext(AppContext);
  const { firebaseConfig, historyChatName } = useAppSelector(
    state => state.globalReducer,
  );
  const dispatch = useAppDispatch();
  const {
    socketmessage,
    socketCreatRoom,
    listRoomCreate,
    editRoom,
    socketleaveRoom,
    socketdeleteRoom,
    socketinviteRoom,
    socketOwnerDeleteMessage,
    recallMess,
    botResponse,
    detailRoom,
    getPinLocal,
    checkErorrRemoveRoom,
    updateLocalListRoomChat,
    liveEnd,
    liveContinue,
    dataEndRoomChat,
    dataFirstRoomChat,
  } = useAppSelector(state => state.socketioReducer);

  const [listCreateRoom, setlistCreateRoom] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);
  const [finalLoad, setFinalLoad] = useState(false);

  const [listMessageLocal, setListMessageLocal] = useState<any[]>([]);
  const [listLastMess, setListLastMess] = useState<any[]>([]);
  const [listLastMessFile, setListLastMessFile] = useState<any>('');

  const [searchValue, setSearchValue] = useState<string>('');

  const [timeLocal, setTimeLocal] = useState<string>('');
  const [idLocal, setIdLocal] = useState<string>('');

  const getListRoomApi = (_offset: number) => {
    socketService.emitListRoom(PAGINATION.ITEMS_100, _offset, 'text', 1);
  };

  useEffect(() => {
    const processSocketEndroom = () => {
      let arrClone = [...listCreateRoom];
      for (let i = 0; i < listCreateRoom.length; i++) {
        if (listCreateRoom[i].id == dataEndRoomChat?.room_id) {
          arrClone[i].status = 2;
          break;
        }
      }
      setlistCreateRoom(arrClone);
    };
    if (dataEndRoomChat?.room_id) {
      processSocketEndroom();
    }
  }, [dataEndRoomChat]);

  useEffect(() => {
    const processSocketNewMsgIfNewRoom = () => {
      let isFound = false;
      for (let i = 0; i < listCreateRoom.length; i++) {
        if (listCreateRoom[i].id == dataFirstRoomChat?.roomId) {
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        setOffset(0);
        getListRoomApi(0);
      }
      dispatch(
        updateLocalChatFirstTime({
          roomId: null,
        }),
      );
    };
    if (dataFirstRoomChat?.roomId) {
      processSocketNewMsgIfNewRoom();
    }
  }, [dataFirstRoomChat]);

  useEffect(() => {
    if (historyChatName != 'HistoryChat') {
      dispatch(setHistoryChatName('HistoryChat'));
    }
    return () => {
      dispatch(resetMessages(null));
    };
  }, [historyChatName]);

  useEffect(() => {
    const processAPIListCreate = () => {
      setOffset(0);
      getListRoomApi(0);
    };
    processAPIListCreate();
  }, [getPinLocal, editRoom, socketleaveRoom]);

  useEffect(() => {
    if (listMessageLocal.length > 0) {
      const date: any = Date.now();
      setTimeLocal(date);
      if (
        listMessageLocal[listMessageLocal?.length - 1]?.items?.resources !== ''
      ) {
        if (
          listMessageLocal[
            listMessageLocal?.length - 1
          ]?.items?.resources?.slice(0, 26) === 'DoctorNetwork_Chat_NETDEV '
        ) {
          setListLastMessFile('text');
        } else if (
          listMessageLocal[
            listMessageLocal?.length - 1
          ]?.items?.resources?.includes('livestream')
        ) {
          setListLastMessFile('text');
        } else {
          if (
            listMessageLocal[listMessageLocal?.length - 1]?.items?.content ===
            ''
          ) {
            if (
              !listMessageLocal[
                listMessageLocal?.length - 1
              ]?.items?.resources.includes('NetDEV_emoji') &&
              !listMessageLocal[
                listMessageLocal?.length - 1
              ]?.items?.resources.includes('communityChat.livestream') &&
              !listMessageLocal[
                listMessageLocal?.length - 1
              ]?.items?.clientMsgId?.includes('live')
            ) {
              const covenrtName = JSON.parse(
                listMessageLocal[listMessageLocal?.length - 1]?.items
                  ?.resources,
              );
              setListLastMess(covenrtName);
              if (covenrtName.type === 'file') {
                setListLastMessFile(covenrtName.type);
              } else if (covenrtName.type === 'voice') {
                setListLastMessFile(covenrtName.type);
              } else if (covenrtName?.content?.includes('@')) {
                setListLastMessFile('tag');
              }
            } else {
              setListLastMessFile('');
            }
          }
        }
      } else {
        setIdLocal(
          listMessageLocal[listMessageLocal?.length - 1]?.items?.room_id,
        );
      }
    }
  }, [listMessageLocal]);

  useEffect(() => {
    const processAPIListCreate = async () => {
      const { loading, data, error } = socketmessage;
      const deleteRoomHistory = await getObjectData(STORAGEKEY.DELETE_CHAT);
      let array = JSON.parse(JSON.stringify(listCreateRoom));
      if (!loading) {
        if (data && !data?.clientMsgId?.includes('.live')) {
          if (
            socketmessage.data?.content.includes(
              '{communityChat.chat.memberLeveaGroup}',
            )
          ) {
            getListRoomApi(0);
          }
          if (deleteRoomHistory !== null) {
            if (socketmessage?.data?.room_id === deleteRoomHistory?.room_id) {
              storeObjectData(STORAGEKEY.DELETE_CHAT, {
                room_id: socketmessage?.data?.room_id,
                deleteRoom: 'false',
              });
            }
          }
          if (
            socketmessage?.data?.clientMsgId ===
            'DoctorNetwork_Chat_NETDE_DELETE_ROOM'
          ) {
            for (let i = 0; i < array.length; i++) {
              if (array[i].id === socketmessage?.data?.room_id) {
                array.splice(i, 1);
              }
              // break;
            }
          }
          const index = array.findIndex(
            (chat: any) => chat.id === socketmessage?.data?.room_id,
          );
          if (index !== -1) {
            // Remove the object from its current position
            const [chat] = array.splice(index, 1);
            // Add the object to the beginning of the array
            array.unshift(chat);
          }
          // }
          const fetchData = async () => {
            const date = Date.now();
            const localMessages = await getObjectData(STORAGEKEY.LIST_MESSAGES);
            let arr: any = [listMessageLocal];
            arr.push(localMessages);
            for (let i = 0; i < array.length; i++) {
              if (socketmessage?.data?.room_id === array[i]?.id) {
                if (
                  socketmessage?.data?.clientMsgId ===
                  'DoctorNetwork_Chat_NETDEV_PIN'
                ) {
                  // if (
                  //   navigationRef.current?.getCurrentRoute()?.name ==
                  //   'CommunityScreen'
                  // ) {
                    if (socketmessage.data?.from !== user.id) {
                      // if (
                      //   navigationRef.current?.getCurrentRoute()?.name ==
                      //   'CommunityScreen'
                      // ) {
                        if (
                          !socketmessage.data?.content.includes(
                            'DoctorNetwork_Chat_NETDEV',
                          )
                        ) {
                          array[i].unread_messages =
                            array[i].unread_messages ||
                            array[i].unread_messages == 0
                              ? array[i].unread_messages + 1
                              : 0;
                        }
                      // }
                    }
                    array[i].updated_at = date;
                    array[i].created_at = date;
                    array[i].last_message = socketmessage?.data?.resources;
                    console.log('1111');
                  // }
                } else {
                  // if (
                  //   navigationRef.current?.getCurrentRoute()?.name ==
                  //   'CommunityScreen'
                  // ) {
                    if (socketmessage.data?.content) {
                      if (socketmessage.data?.from !== user.id) {
                        if (
                          !socketmessage.data?.content.includes(
                            'DoctorNetwork_Chat_NETDEV',
                          )
                        ) {
                          array[i].unread_messages =
                            array[i].unread_messages ||
                            array[i].unread_messages == 0
                              ? array[i].unread_messages + 1
                              : 0;
                        }
                      }
                      array[i].updated_at = date;
                      array[i].created_at = date;
                      array[i].last_message = socketmessage?.data?.content;
                      console.log('222');
                    } else {
                      let content = JSON.parse(
                        stripslashes(socketmessage?.data?.resources),
                      );
                      if (socketmessage.data?.from !== user.id) {
                        // if (
                        //   navigationRef.current?.getCurrentRoute()?.name ==
                        //   'CommunityScreen'
                        // ) {
                          if (
                            !socketmessage.data?.content.includes(
                              'DoctorNetwork_Chat_NETDEV',
                            )
                          ) {
                            array[i].unread_messages =
                              array[i].unread_messages ||
                              array[i].unread_messages == 0
                                ? array[i].unread_messages + 1
                                : 0;
                          }
                          console.log('333');
                        // }
                      }
                      array[i].updated_at = date;
                      array[i].created_at = date;
                      array[i].last_message = content[0]?.src;
                    }
                  // }
                }
              }
            }
            setListLastMess([]);
            setListLastMessFile('');
            setListMessageLocal(arr);
          };
          fetchData();
        }
      }
      const uniqueArray = array.filter(
        (item: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.id === item.id),
      );
      setlistCreateRoom(uniqueArray);
    };

    processAPIListCreate();
  }, [socketmessage, socketOwnerDeleteMessage, recallMess, botResponse]);

  //cap nhat room_is_live
  useEffect(() => {
    const processAPIListCreate = () => {
      const { loading, data, error } = updateLocalListRoomChat;
      // let arr = JSON.parse(JSON.stringify(listCreateRoom))
      let arr = [...listCreateRoom];
      if (!loading) {
        if (data) {
          for (let i = 0; i < listCreateRoom.length; i++) {
            if (listCreateRoom[i].id === data.id) {
              arr[i].room_is_live = data.room_is_live;
              arr[i].livestream_key = data.livestream_key;
              arr[i].room_live_title = data.room_live_title;
            }
            break;
          }
          setlistCreateRoom(arr);
        }
      }
    };
    processAPIListCreate();
  }, [updateLocalListRoomChat, updateLocalListRoomChat.data]);

  useEffect(() => {
    const processAPICourse = () => {
      const { loading, data, error } = liveContinue;
      let arr = [...listCreateRoom];
      if (!loading) {
        if (data) {
          setOffset(0);
          getListRoomApi(0);
        }
      }
    };
    processAPICourse();
  }, [liveContinue]);

  useEffect(() => {
    const processActionEmoji = () => {
      const { loading, data, error } = liveEnd;
      let arr = [...listCreateRoom];
      if (!loading) {
        if (data) {
          for (let i = 0; i < listCreateRoom.length; i++) {
            if (listCreateRoom[i].room_is_live === data.room_id) {
              console.log('13123123123213131');
              arr[i].room_is_live = null;
              arr[i].livestream_key = null;
            }
          }
          setlistCreateRoom(arr);
        }
      }
    };
    processActionEmoji();
  }, [liveEnd, updateLocalListRoomChat]);

  useEffect(() => {
    const processAPIListCreate = () => {
      const { loading, data, error } = socketOwnerDeleteMessage;
      if (!loading) {
        if (data) {
          setListMessageLocal([]);
          setListLastMess([]);
          setListLastMessFile('');
        }
      }
    };
    processAPIListCreate();
  }, [socketOwnerDeleteMessage]);

  useEffect(() => {
    const processAPIListCreate = () => {
      const { loading, data, error } = socketCreatRoom;
      let array = JSON.parse(JSON.stringify(listCreateRoom));
      if (!loading) {
        if (data) {
          const itemCreateRoom = {
            created_at: Date.now(),
            description: null,
            id: socketCreatRoom?.data?.room_id,
            invite_status: socketCreatRoom?.data?.type === 'Room' ? 0 : null,
            is_deleted: 0,
            owner_id: user.id,
            status: 1,
            thumbnail: socketCreatRoom?.data?.thumbnail,
            title: socketCreatRoom?.data?.title,
            to: null,
            type: socketCreatRoom?.data?.type,
            updated_at: Date.now(),
            user_id: null,
          };
          if (array[0]?.id !== itemCreateRoom.id) {
            if (data.media !== 'livestream' && data.media !== 'livechat') {
              array.unshift(itemCreateRoom);
            }
          }
        }
      }
      setlistCreateRoom(array);
    };
    if (socketCreatRoom?.data?.type === '1-1') {
      socketService.emitJoinSocket(socketCreatRoom?.data?.room_id, 1);
    }
    if (historyChatName == 'Community') {
      processAPIListCreate();
    }
  }, [socketCreatRoom, historyChatName]);

  useEffect(() => {
    const processAPIListRoom = async () => {
      const { loading, data, error } = socketdeleteRoom;
      let array = [...listCreateRoom];
      if (!loading) {
        if (data) {
          if (data && data.room_id) {
            for (let i = 0; i < array.length; i++) {
              if (array[i].id === data.room_id) {
                array.splice(i, 1);
              }
            }
            setlistCreateRoom(array);
          }
          setRefreshing(false);
        } else {
          setlistCreateRoom([]);
        }
      }
    };
    processAPIListRoom();
  }, [socketdeleteRoom]);

  useEffect(() => {
    const processAPIListRoom = async () => {
      const { loading, data, error } = socketinviteRoom;
      let array = JSON.parse(JSON.stringify(listCreateRoom));
      if (!loading) {
        if (data) {
          if (data && data.room_id) {
            for (let i = 0; i < array.length; i++) {
              if (array[i].id !== data.room_id) {
                let itemCreate = {
                  created_at: Date.now(),
                  description: null,
                  id: data.room_id,
                  invite_status: 0,
                  is_deleted: 0,
                  owner_id: data.owner_id,
                  status: 1,
                  thumbnail: data.thumbnail,
                  title: data.title,
                  to: null,
                  type: 'Room',
                  updated_at: Date.now(),
                  user_id: null,
                };
                array.unshift(itemCreate);
              }
            }
          }
          setlistCreateRoom(array);
          setRefreshing(false);
        } else {
          // setlistCreateRoom([])
        }
      }
    };
    processAPIListRoom();
  }, [socketinviteRoom, isFocusScreen]);

  useEffect(() => {
    const processAPIrecallMess = async () => {
      const { loading, data, error } = checkErorrRemoveRoom;
      const checkPrivate = await getStringData(STORAGEKEY.CHECK_GROUP_PRIVATE);
      if (!loading) {
        if (data) {
          if (data.errors && data.errors[0]?.key === 'room_id') {
            if (checkPrivate === 'true') {
              showToast(toastEl, t('communityChat.home.removeRoom'), 2000);
            }
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
          store.dispatch(resetCheckErorrRemoveRoom(null));
          const item: any = data.result;
          if (item.private == 0) {
            let str = (await getStringData(STORAGEKEY.JOIN_PUBLIC_CHAT)) || '';
            let arrParse = str ? str.split(',') : [];
            let isFound = false;
            for (let i = 0; i < arrParse.length; i++) {
              if (arrParse[i].toString() == item.id) {
                isFound = true;
              }
            }
            if (!isFound) {
              arrParse.push(item.id);
              await storeStringData(
                STORAGEKEY.JOIN_PUBLIC_CHAT,
                arrParse.toString(),
              );
              socketService.emitRejoinRoom();
            }
            let arrRoom: any = JSON.parse(JSON.stringify(listCreateRoom));
            if (item.invite_status !== 0) {
              if (item.media === 'livestream') {
                // if (item.owner_id === user.id) {
                //   if (item.is_live === 1) {
                //     navigation.navigate(mainRoute.playStream, { item: item });
                //   } else {
                //     navigation.navigate(mainRoute.publishStream, {
                //       item: item,
                //       isBack: false,
                //     });
                //   }
                // } else {
                //   navigation.navigate(mainRoute.playStream, { item: item });
                // }
              } else if (item.media === 'text') {
                navigation.navigate(mainRoute.chatScreen, {
                  item: item,
                  listCreateRoom: listCreateRoom,
                  roomId: item.id,
                  ownerId: item.owner_id,
                  checkCreateRoom: false,
                });
                for (let i = 0; i < arrRoom.length; i++) {
                  if (arrRoom[i].id === item.id) {
                    arrRoom[i].unread_messages = 0;
                  }
                }
              }
            }
            setlistCreateRoom(arrRoom);
          } else {
            let arrRoom: any = JSON.parse(JSON.stringify(listCreateRoom));
            if (item.invite_status !== 0) {
              if (item.media === 'livestream') {
                // if (item.owner_id === user.id) {
                //   if (item.is_live === 1) {
                //     navigation.navigate(mainRoute.playStream, { item: item });
                //   } else {
                //     navigation.navigate(mainRoute.publishStream, {
                //       item: item,
                //       isBack: false,
                //     });
                //   }
                // } else {
                //   navigation.navigate(mainRoute.playStream, { item: item });
                // }
              } else if (item.media === 'text') {
                navigation.navigate(mainRoute.chatScreen, {
                  item: item,
                  listCreateRoom: listCreateRoom,
                  roomId: item.id,
                  ownerId: item.owner_id,
                  checkCreateRoom: false,
                });
                for (let i = 0; i < arrRoom.length; i++) {
                  if (arrRoom[i].id === item.id) {
                    arrRoom[i].unread_messages = 0;
                  }
                }
              }
            }
            setlistCreateRoom(arrRoom);
          }
          store.dispatch(resetPinMessage(null));
          store.dispatch(resetMessages(null));
          store.dispatch(resetHistoryChat(null));
          store.dispatch(resetRoomDetal(null));
        } else if (error) {
          console.log('err---', error);
        }
        store.dispatch(resetRoomDetal(null));
      }
    };
    processAPIrecallMess();
  }, [detailRoom]);

  //
  useEffect(() => {
    const processAPIListRoom = async () => {
      const { loading, data, error } = listRoomCreate;
      const deleteRoomHistory = await getObjectData(STORAGEKEY.DELETE_CHAT);
      const pinLocal = await getObjectData(STORAGEKEY.PIN_LOCAL);
      if (!loading) {
        if (data) {
          if (listRoomCreate.data) {
            if (data && data.items) {
              let newItems = data.items || [];
              let sizeResponse = newItems.length;
              let arr = JSON.parse(JSON.stringify(newItems));
              arr = arr.filter(
                (item: any, index: any, self: any) =>
                  index === self.findIndex((t: any) => t.id === item.id),
              );
              if (offset === 0) {
                for (let i = 0; i < arr.length; i++) {
                  if (arr[i].invite_status === 1 && arr[i].is_autojoin === 0) {
                    socketService.emitJoinSocketAuto(arr[i].id, 1);
                  }
                  if (arr[i].type === 'Room') {
                    socketService.emitRejoinRoom();
                  }
                  if (deleteRoomHistory !== null) {
                    if (deleteRoomHistory.room_id === arr[i].id) {
                      if (deleteRoomHistory.deleteRoom === 'true') {
                        arr.splice(i, 1);
                      }
                    }
                    break;
                  }
                  if (arr[i].is_pin === 1) {
                    arr.sort((x: any, y: any) => y.is_pin - x.is_pin);
                  }
                }
                if (pinLocal !== null) {
                  const bSet = new Set(pinLocal.map((item: any) => item.id));
                  const inB = arr.filter((item: any) => bSet.has(item.id));
                  const notInB = arr.filter((item: any) => !bSet.has(item.id));
                  const updatedinB = inB.map((item: any) => ({
                    ...item,
                    isPin_local: true,
                  }));
                  const result = [...updatedinB, ...notInB];
                  setlistCreateRoom(result);
                } else {
                  setlistCreateRoom(arr);
                }
              } else {
                if (pinLocal !== null) {
                  const bSet = new Set(pinLocal.map((item: any) => item.id));
                  const inB = [...listCreateRoom, ...arr].filter((item: any) =>
                    bSet.has(item.id),
                  );
                  const notInB = [...listCreateRoom, ...arr].filter(
                    (item: any) => !bSet.has(item.id),
                  );
                  const updatedinB = inB.map((item: any) => ({
                    ...item,
                    isPin_local: true,
                  }));
                  const result = [...updatedinB, ...notInB];
                  setlistCreateRoom(result);
                } else {
                  arr = [...listCreateRoom, ...arr].filter(
                    (item: any, index: any, self: any) =>
                      index === self.findIndex((t: any) => t.id === item.id),
                  );
                  setlistCreateRoom(arr);
                }
              }
              setFinalLoad(sizeResponse < PAGINATION.ITEMS_100);
            } else {
              setFinalLoad(true);
            }
          } else {
            console.log('----');
          }
          setFirstRender(false);
          setRefreshing(false);
        } else if (error) {
          setFirstRender(false);
          setRefreshing(false);
        }
      }
    };
    if (historyChatName == 'HistoryChat') {
      processAPIListRoom();
    }
  }, [listRoomCreate]);

  //ACTION
  const onRefresh = () => {
    setOffset(0);
    setRefreshing(true);
    getListRoomApi(0);
  };

  const handleLoadMore = () => {
    if (!finalLoad && !onEndReached) {
      const _offset = offset + PAGINATION.ITEMS_100;
      setOffset(_offset);
      getListRoomApi(_offset);
    }
  };

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

  const handleGoChat = async (item: any) => {
    store.dispatch(resetPinLocal(null));
    store.dispatch(resetMessages(null));
    store.dispatch(resetCheckErorrRemoveRoom(null));
    if (item.private == 0) {
      let str = getStringData(STORAGEKEY.JOIN_PUBLIC_CHAT) || '';
      let arrParse = str ? str.split(',') : [];
      let isFound = false;
      for (let i = 0; i < arrParse.length; i++) {
        if (arrParse[i].toString() == item.id) {
          isFound = true;
        }
      }
      if (!isFound) {
        arrParse.push(item.id);
        storeStringData(STORAGEKEY.JOIN_PUBLIC_CHAT, arrParse.toString());
        socketService.emitRejoinRoom();
      }
      let arrRoom: any = JSON.parse(JSON.stringify(listCreateRoom));
      if (item.invite_status !== 0) {
        navigation.navigate(mainRoute.chatScreen, {
          item: item,
          listCreateRoom: listCreateRoom,
          roomId: item.id,
          ownerId: item.owner_id,
          checkCreateRoom: false,
        });
        for (let i = 0; i < arrRoom.length; i++) {
          if (arrRoom[i].id === item.id) {
            arrRoom[i].unread_messages = 0;
          }
        }
      }
      setlistCreateRoom(arrRoom);
    } else {
      let arrRoom: any = JSON.parse(JSON.stringify(listCreateRoom));
      if (item.invite_status !== 0) {
        navigation.navigate(mainRoute.chatScreen, {
          item: item,
          listCreateRoom: listCreateRoom,
          roomId: item.id,
          ownerId: item.owner_id,
          checkCreateRoom: false,
        });
        for (let i = 0; i < arrRoom.length; i++) {
          if (arrRoom[i].id === item.id) {
            arrRoom[i].unread_messages = 0;
          }
        }
      }
      setlistCreateRoom(arrRoom);
    }
  };

  const handleAppect = (item: any) => {
    let arr = JSON.parse(JSON.stringify(listCreateRoom));
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === item.id) {
        if (item.invite_status === 0) {
          arr[i].invite_status = 1;
        }
      }
    }
    setlistCreateRoom(arr);
    socketService.emitJoinSocket(item.id, 1);
  };

  const handleReject = (item: any) => {
    let arr = [...listCreateRoom];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === item.id) {
        if (item.invite_status === 0) {
          arr.splice(i, 1);
        }
        break;
      }
    }
    setlistCreateRoom(arr);
    socketService.emitJoinSocket(item.id, 2);
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

  const conventMessageLeaveGroup = (text: any) => {
    const result = text.replace('{communityChat.chat.memberLeveaGroup}', '');
    return result;
  };

  const conventMessageAddGroup = (text: any) => {
    const result = text.replace('{communityChat.chat.addMember}', '');
    return result;
  };

  const conventMessageDeleteMemberGroup = (text: any) => {
    const result = text.replace('{communityChat.chat.deleteMember}', '');
    return result;
  };

  const conventMessageChangeAdmin = (text: any) => {
    const result = text.replace('{communityChat.listMember.changeRole}', '');
    return result;
  };

  const handleClearSearch = () => {
    // setFirstRender(true)
    setSearchValue('');
    getListRoomApi(0);
    setFirstRender(true);
  };

  const handleChangeTextSearch = (value: string) => {
    // if(listRoomCreate?.data?.items !== undefined){
    let arr = [...listCreateRoom];
    if (value !== '') {
      if (listRoomCreate?.data?.items !== undefined) {
        // let arr = JSON.parse(JSON.stringify(listRoomCreate?.data?.items))
        const newData = arr.filter(function (item: any) {
          const itemData = changeAlias(item.title);
          const textData = changeAlias(value);
          return itemData.includes(textData);
        });
        setlistCreateRoom(newData || []);
        setSearchValue(value);
      }
    } else {
      setOffset(0);
      getListRoomApi(0);
      setFirstRender(true);
    }
    setSearchValue(value);
  };

  const handleSearch = () => {
    if (searchValue != '') {
      Keyboard.dismiss();
    }
  };

  //REDDER
  const renderItemRoom = ({ item, index }: any) => {
    const {
      title,
      thumbnail,
      updated_at,
      invite_status,
      id,
      unread_messages,
      last_message,
      type,
      isPin_local,
      is_pin,
    } = item;
    if (index == 0) {
      return (
        <>
          {invite_status !== 2 ? (
            <Row
              start
              style={[
                screenStyles.pH12,
                screenStyles.pV10,
                { borderBottomWidth: 1, borderBottomColor: colors.cF2F4F7 },
              ]}
            >
              <Pressable
                style={[screenStyles.rowStart, screenStyles.flex1]}
                onLongPress={() => {
                  bottomSheetRef.current?.present();
                }}
                onPress={() => handleGoChat(item)}
              >
                <View style={[styles.avatar, screenStyles.centerWrap]}>
                  <ImageHelper
                    source={{ uri: thumbnail }}
                    renderErrorImage={renderErrorImage}
                  />
                </View>
                <View style={[screenStyles.pH10, screenStyles.flex1]}>
                  {invite_status === 0 ? (
                    <>
                      <CText h5 w600 numberOfLines={2} color={colors.black}>
                        {`${t('communityChat.home.inviteRoom')} ${title}`}
                      </CText>
                      <Row start style={[screenStyles.pV10]}>
                        <Pressable
                          onPress={() => {
                            handleAppect(item);
                          }}
                        >
                          <Row style={styles.textAppcet}>
                            <IconX
                              name={'check'}
                              type={IconType.ANT_DESIGN}
                              color={colors.white}
                              size={22}
                            />
                            <CText
                              h5
                              w600
                              numberOfLines={2}
                              color={colors.white}
                            >
                              {` ${t('communityChat.contact.appect')}`}
                            </CText>
                          </Row>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            handleReject(item);
                          }}
                        >
                          <Row style={styles.textReject}>
                            <IconX
                              name={'close'}
                              type={IconType.ANT_DESIGN}
                              color={colors.c667085}
                              size={22}
                            />
                            <CText
                              h5
                              w600
                              numberOfLines={2}
                              color={colors.c667085}
                            >
                              {` ${t('communityChat.contact.reject')}`}
                            </CText>
                          </Row>
                        </Pressable>
                      </Row>
                    </>
                  ) : (
                    <CText h5 w600 numberOfLines={2} color={colors.black}>
                      {title || ''}
                      {/* {item?.room_is_live !== 'undefined' &&
                        item?.room_is_live !== null && (
                          <>
                            <View>
                              <Image
                                style={{
                                  height: 20,
                                  width: 20,
                                  top: 5,
                                  marginLeft: 5,
                                }}
                                source={images.course.ico_livetime}
                              />
                            </View>
                          </>
                        )} */}
                    </CText>
                  )}
                  {invite_status === 1 ||
                  item.private === 0 ||
                  type === '1-1' ? (
                    listMessageLocal[listMessageLocal?.length - 1]?.items
                      ?.room_id === id ? (
                      listLastMess[0]?.type?.slice(0, 16) === 'video' ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessageVideo')}
                        </CText>
                      ) : listLastMess[0]?.type?.slice(0, 16) === 'image' ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessageImage')}
                        </CText>
                      ) : listLastMessFile === 'file' ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessageFile')}
                        </CText>
                      ) : listLastMessFile === 'voice' ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessageVoice')}
                        </CText>
                      ) : listLastMessFile === 'tag' ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {
                            JSON.parse(
                              listMessageLocal[listMessageLocal?.length - 1]
                                ?.items.resources,
                            ).content
                          }
                        </CText>
                      ) : listMessageLocal[
                          listMessageLocal?.length - 1
                        ]?.items?.resources.includes('[{"content":') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessagePin')}
                        </CText>
                      ) : (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {listMessageLocal[
                            listMessageLocal?.length - 1
                          ]?.items?.content.includes(
                            '{communityChat.chat.addMember}',
                          ) ? (
                            conventMessageAddGroup(
                              listMessageLocal[
                                listMessageLocal?.length - 1
                              ]?.items?.content.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.addMember'),
                            )
                          ) : listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.includes(
                              '{communityChat.chat.memberLeveaGroup}',
                            ) ? (
                            conventMessageLeaveGroup(
                              listMessageLocal[
                                listMessageLocal?.length - 1
                              ]?.items?.content.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.memberLeveaGroup'),
                            )
                          ) : listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.includes(
                              '{communityChat.chat.deleteMember}',
                            ) ? (
                            conventMessageDeleteMemberGroup(
                              listMessageLocal[
                                listMessageLocal?.length - 1
                              ]?.items?.content.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.deleteMember'),
                            )
                          ) : listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.includes(
                              '{communityChat.listMember.changeRole}',
                            ) ? (
                            conventMessageChangeAdmin(
                              listMessageLocal[
                                listMessageLocal?.length - 1
                              ]?.items?.content.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.changeRole'),
                            )
                          ) : listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.includes(
                              '{communityChat.chat.startLivestream}',
                            ) ? (
                            `[${t('communityChat.chat.tilteLivestream')}]`
                          ) : listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.includes(
                              '{communityChat.chat.endLivestream}',
                            ) ? (
                            `[${t('communityChat.chat.endLivestream')}]`
                          ) : (
                            <CText
                              h5
                              numberOfLines={2}
                              color={colors.c667085}
                              style={{ paddingTop: 5 }}
                            >
                              {listMessageLocal[
                                listMessageLocal?.length - 1
                              ]?.items?.content.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              )}
                            </CText>
                          )}
                        </CText>
                      )
                    ) : (
                      <CText
                        h5
                        numberOfLines={2}
                        color={colors.c667085}
                        style={{ paddingTop: 5 }}
                      >
                        {last_message !== undefined &&
                        last_message.includes('"type":"video"') ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {t('communityChat.home.lastMessageVideo')}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes('"type":"image"') ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {t('communityChat.home.lastMessageImage')}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes('"type":"file"') ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {t('communityChat.home.lastMessageFile')}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes('"type":"voice"') ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {t('communityChat.home.lastMessageVoice')}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes('[{"content":') ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {t('communityChat.home.lastMessagePin')}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes('idTag') ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {JSON.parse(last_message).content}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes('{community.chat.remove}') ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {t('community.chat.remove')}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes('{community.chat.recall}') ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {t('community.chat.recall')}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes(
                            '{communityChat.chat.addMember}',
                          ) ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {conventMessageAddGroup(
                              last_message.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.addMember'),
                            )}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes(
                            '{communityChat.chat.memberLeveaGroup}',
                          ) ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {conventMessageLeaveGroup(
                              last_message.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.memberLeveaGroup'),
                            )}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes(
                            '{communityChat.chat.deleteMember}',
                          ) ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {conventMessageDeleteMemberGroup(
                              last_message.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.deleteMember'),
                            )}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes(
                            '{communityChat.listMember.changeRole}',
                          ) ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {conventMessageChangeAdmin(
                              last_message.replaceAll(
                                'DoctorNetwork_Chat_NETDEV ',
                                '',
                              ) + t('communityChat.chat.changeRole'),
                            )}
                          </CText>
                        ) : last_message !== undefined &&
                          last_message.includes(
                            '{communityChat.chat.startLivestream}',
                          ) ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >{`[${t(
                            'communityChat.chat.tilteLivestream',
                          )}]`}</CText>
                        ) : last_message !== undefined &&
                          last_message.includes(
                            '{communityChat.chat.endLivestream}',
                          ) ? (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >{`[${t(
                            'communityChat.chat.endLivestream',
                          )}]`}</CText>
                        ) : (
                          last_message?.replaceAll(
                            'DoctorNetwork_Chat_NETDEV ',
                            '',
                          )
                        )}
                      </CText>
                    )
                  ) : null}
                </View>
                <Pressable>
                  <CText h5 color={colors.c667085}>
                    {idLocal === item.id
                      ? timeDifferenceV2(t, timeLocal)
                      : timeDifferenceV2(t, updated_at)}
                  </CText>
                  <Row end>
                    {isPin_local || is_pin === 1 ? (
                      <View style={{ paddingTop: 5, marginRight: 5 }}>
                        <IconX
                          type={IconType.ANT_DESIGN}
                          name="pushpino"
                          size={16}
                          color={colors.c667085}
                        />
                      </View>
                    ) : null}
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        alignContent: 'center',
                        top: 5,
                      }}
                    >
                      {unread_messages > 5 ? (
                        <CText
                          center
                          h5
                          color={'white'}
                          style={{
                            backgroundColor: colors.cF04438,
                            width: 25,
                            height: isIOS ? 18 : 20,
                            borderRadius: isIOS ? 9 : 11,
                            overflow: 'hidden',
                          }}
                        >
                          {`5+`}
                        </CText>
                      ) : (
                        <>
                          {unread_messages ? (
                            <CText
                              center
                              h5
                              color={'white'}
                              style={{
                                backgroundColor: colors.cF04438,
                                width: 18,
                                height: isIOS ? 18 : 20,
                                borderRadius: isIOS ? 9 : 11,
                                overflow: 'hidden',
                              }}
                            >
                              {unread_messages}
                            </CText>
                          ) : null}
                        </>
                      )}
                    </View>
                  </Row>
                </Pressable>
              </Pressable>
            </Row>
          ) : null}
        </>
      );
    }
    return (
      <>
        {invite_status !== 2 ? (
          <Row
            start
            style={[
              screenStyles.pH12,
              screenStyles.pV10,
              { borderBottomWidth: 1, borderBottomColor: colors.cF2F4F7 },
            ]}
          >
            <Pressable
              style={[screenStyles.rowStart, screenStyles.flex1]}
              onLongPress={() => {
                bottomSheetRef.current?.present();
              }}
              onPress={() => handleGoChat(item)}
            >
              <View style={[styles.avatar, screenStyles.centerWrap]}>
                <ImageHelper
                  source={{ uri: thumbnail }}
                  renderErrorImage={renderErrorImage}
                />
              </View>
              <View style={[screenStyles.pH10, screenStyles.flex1]}>
                {invite_status === 0 ? (
                  <>
                    <CText h5 w600 numberOfLines={2} color={colors.black}>
                      {`${t('communityChat.home.inviteRoom')} ${title}`}
                    </CText>
                    <Row start style={[screenStyles.pV10]}>
                      <Pressable
                        onPress={() => {
                          handleAppect(item);
                        }}
                      >
                        <Row style={styles.textAppcet}>
                          <IconX
                            name={'check'}
                            type={IconType.ANT_DESIGN}
                            color={colors.white}
                            size={22}
                          />
                          <CText h5 w600 numberOfLines={2} color={colors.white}>
                            {` ${t('communityChat.contact.appect')}`}
                          </CText>
                        </Row>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          handleReject(item);
                        }}
                      >
                        <Row style={styles.textReject}>
                          <IconX
                            name={'close'}
                            type={IconType.ANT_DESIGN}
                            color={colors.c667085}
                            size={22}
                          />
                          <CText
                            h5
                            w600
                            numberOfLines={2}
                            color={colors.c667085}
                          >
                            {` ${t('communityChat.contact.reject')}`}
                          </CText>
                        </Row>
                      </Pressable>
                    </Row>
                  </>
                ) : (
                  <CText h5 w600 numberOfLines={2} color={colors.black}>
                    {title || ''}
                    {/* {item?.room_is_live !== 'undefined' &&
                      item?.room_is_live !== null && (
                        <>
                          <View>
                            <Image
                              style={{
                                height: 20,
                                width: 20,
                                top: 5,
                                marginLeft: 5,
                              }}
                              source={images.course.ico_livetime}
                            />
                          </View>
                        </>
                      )} */}
                  </CText>
                )}
                {invite_status === 1 || item.private === 0 || type === '1-1' ? (
                  listMessageLocal[listMessageLocal?.length - 1]?.items
                    ?.room_id === id ? (
                    listLastMess[0]?.type?.slice(0, 16) === 'video' ? (
                      <CText
                        h5
                        numberOfLines={2}
                        color={colors.c667085}
                        style={{ paddingTop: 5 }}
                      >
                        {t('communityChat.home.lastMessageVideo')}
                      </CText>
                    ) : listLastMess[0]?.type?.slice(0, 16) === 'image' ? (
                      <CText
                        h5
                        numberOfLines={2}
                        color={colors.c667085}
                        style={{ paddingTop: 5 }}
                      >
                        {t('communityChat.home.lastMessageImage')}
                      </CText>
                    ) : listLastMessFile === 'file' ? (
                      <CText
                        h5
                        numberOfLines={2}
                        color={colors.c667085}
                        style={{ paddingTop: 5 }}
                      >
                        {t('communityChat.home.lastMessageFile')}
                      </CText>
                    ) : listLastMessFile === 'voice' ? (
                      <CText
                        h5
                        numberOfLines={2}
                        color={colors.c667085}
                        style={{ paddingTop: 5 }}
                      >
                        {t('communityChat.home.lastMessageVoice')}
                      </CText>
                    ) : listLastMessFile === 'tag' ? (
                      <CText
                        h5
                        numberOfLines={2}
                        color={colors.c667085}
                        style={{ paddingTop: 5 }}
                      >
                        {
                          JSON.parse(
                            listMessageLocal[listMessageLocal?.length - 1]
                              ?.items.resources,
                          ).content
                        }
                      </CText>
                    ) : listMessageLocal[
                        listMessageLocal?.length - 1
                      ]?.items?.resources.includes('[{"content":') ? (
                      <CText
                        h5
                        numberOfLines={2}
                        color={colors.c667085}
                        style={{ paddingTop: 5 }}
                      >
                        {t('communityChat.home.lastMessagePin')}
                      </CText>
                    ) : (
                      <CText
                        h5
                        numberOfLines={2}
                        color={colors.c667085}
                        style={{ paddingTop: 5 }}
                      >
                        {listMessageLocal[
                          listMessageLocal?.length - 1
                        ]?.items?.content.includes(
                          '{communityChat.chat.addMember}',
                        ) ? (
                          conventMessageAddGroup(
                            listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            ) + t('communityChat.chat.addMember'),
                          )
                        ) : listMessageLocal[
                            listMessageLocal?.length - 1
                          ]?.items?.content.includes(
                            '{communityChat.chat.memberLeveaGroup}',
                          ) ? (
                          conventMessageLeaveGroup(
                            listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            ) + t('communityChat.chat.memberLeveaGroup'),
                          )
                        ) : listMessageLocal[
                            listMessageLocal?.length - 1
                          ]?.items?.content.includes(
                            '{communityChat.chat.deleteMember}',
                          ) ? (
                          conventMessageDeleteMemberGroup(
                            listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            ) + t('communityChat.chat.deleteMember'),
                          )
                        ) : listMessageLocal[
                            listMessageLocal?.length - 1
                          ]?.items?.content.includes(
                            '{communityChat.listMember.changeRole}',
                          ) ? (
                          conventMessageChangeAdmin(
                            listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            ) + t('communityChat.chat.changeRole'),
                          )
                        ) : listMessageLocal[
                            listMessageLocal?.length - 1
                          ]?.items?.content.includes(
                            '{communityChat.chat.startLivestream}',
                          ) ? (
                          `[${t('communityChat.chat.tilteLivestream')}]`
                        ) : listMessageLocal[
                            listMessageLocal?.length - 1
                          ]?.items?.content.includes(
                            '{communityChat.chat.endLivestream}',
                          ) ? (
                          `[${t('communityChat.chat.endLivestream')}]`
                        ) : (
                          <CText
                            h5
                            numberOfLines={2}
                            color={colors.c667085}
                            style={{ paddingTop: 5 }}
                          >
                            {listMessageLocal[
                              listMessageLocal?.length - 1
                            ]?.items?.content.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            )}
                          </CText>
                        )}
                      </CText>
                    )
                  ) : (
                    <CText
                      h5
                      numberOfLines={2}
                      color={colors.c667085}
                      style={{ paddingTop: 5 }}
                    >
                      {last_message !== undefined &&
                      last_message.includes('"type":"video"') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessageVideo')}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes('"type":"image"') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessageImage')}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes('"type":"file"') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessageFile')}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes('"type":"voice"') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessageVoice')}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes('[{"content":') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('communityChat.home.lastMessagePin')}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes('idTag') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {JSON.parse(last_message).content}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes('{community.chat.remove}') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('community.chat.remove')}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes('{community.chat.recall}') ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {t('community.chat.recall')}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes(
                          '{communityChat.chat.addMember}',
                        ) ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {conventMessageAddGroup(
                            last_message.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            ) + t('communityChat.chat.addMember'),
                          )}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes(
                          '{communityChat.chat.memberLeveaGroup}',
                        ) ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {conventMessageLeaveGroup(
                            last_message.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            ) + t('communityChat.chat.memberLeveaGroup'),
                          )}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes(
                          '{communityChat.chat.deleteMember}',
                        ) ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {conventMessageDeleteMemberGroup(
                            last_message.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            ) + t('communityChat.chat.deleteMember'),
                          )}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes(
                          '{communityChat.listMember.changeRole}',
                        ) ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >
                          {conventMessageChangeAdmin(
                            last_message.replaceAll(
                              'DoctorNetwork_Chat_NETDEV ',
                              '',
                            ) + t('communityChat.chat.changeRole'),
                          )}
                        </CText>
                      ) : last_message !== undefined &&
                        last_message.includes(
                          '{communityChat.chat.startLivestream}',
                        ) ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >{`[${t(
                          'communityChat.chat.tilteLivestream',
                        )}]`}</CText>
                      ) : last_message !== undefined &&
                        last_message.includes(
                          '{communityChat.chat.endLivestream}',
                        ) ? (
                        <CText
                          h5
                          numberOfLines={2}
                          color={colors.c667085}
                          style={{ paddingTop: 5 }}
                        >{`[${t('communityChat.chat.endLivestream')}]`}</CText>
                      ) : (
                        last_message?.replaceAll(
                          'DoctorNetwork_Chat_NETDEV ',
                          '',
                        )
                      )}
                    </CText>
                  )
                ) : null}
              </View>
              <Pressable>
                <CText h5 color={colors.c667085}>
                  {idLocal === item.id
                    ? timeDifferenceV2(t, timeLocal)
                    : timeDifferenceV2(t, updated_at)}
                </CText>
                <Row end>
                  {isPin_local || is_pin === 1 ? (
                    <View style={{ paddingTop: 5, marginRight: 5 }}>
                      <IconX
                        type={IconType.ANT_DESIGN}
                        name="pushpino"
                        size={16}
                        color={colors.c667085}
                      />
                    </View>
                  ) : null}
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      alignContent: 'center',
                      top: 5,
                    }}
                  >
                    {unread_messages > 5 ? (
                      <CText
                        center
                        h5
                        color={'white'}
                        style={{
                          backgroundColor: colors.cF04438,
                          width: 25,
                          height: isIOS ? 18 : 20,
                          borderRadius: isIOS ? 9 : 11,
                          overflow: 'hidden',
                        }}
                      >
                        {`5+`}
                      </CText>
                    ) : (
                      <>
                        {unread_messages ? (
                          <CText
                            center
                            h5
                            color={'white'}
                            style={{
                              backgroundColor: colors.cF04438,
                              width: 18,
                              height: isIOS ? 18 : 20,
                              borderRadius: isIOS ? 9 : 11,
                              overflow: 'hidden',
                            }}
                          >
                            {unread_messages}
                          </CText>
                        ) : null}
                      </>
                    )}
                  </View>
                </Row>
              </Pressable>
            </Pressable>
          </Row>
        ) : null}
      </>
    );
  };

  const _renderLoadingFooter = () => {
    return !finalLoad && !onEndReached ? (
      <Row style={screenStyles.mT5}>
        <ActivityIndicator size="small" color={colors.primary} />
      </Row>
    ) : null;
  };

  const renderInput = () => {
    return (
      <View style={[screenStyles.pH24, screenStyles.pV12]}>
        <CSearchBar
          value={searchValue}
          placeholder={t('search.searchPlaceholder', 'Search...')}
          onChangeText={handleChangeTextSearch}
          onSubmitEditing={handleSearch}
          onClear={handleClearSearch}
          returnKeyType="search"
        />
      </View>
    );
  };

  if (firstRender) {
    return <CLoading />;
  } else {
    return (
      <>
        {renderInput()}
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
          ListFooterComponent={_renderLoadingFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      </>
    );
  }
};

export default HistoryChatTab;
