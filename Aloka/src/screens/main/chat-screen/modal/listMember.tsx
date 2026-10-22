import {
  APILoading,
  CSearchBar,
  IconType,
  IconX,
  ImageHelper,
  Toast,
} from '@/components';
import {
  changeAlias,
  conventUserNameChat,
  images,
  keyExtractor,
  screenStyles,
  showToast,
} from '@/configs';
import { PAGINATION, STORAGEKEY } from '@/constants';
import { mainRoute } from '@/constants/route_key';
import { AppContext } from '@/contexts';
import {
  getListMemberGroup,
  getRequestFriendInviteds,
  getRequestFriendWaitings,
  getRequestFriends,
  resetHistoryChat,
} from '@/redux/slices/communitySlice';
import {
  resetMessages,
  resetPinMessage,
  resetRoomDetal,
} from '@/redux/slices/socketioSlice';
import { store } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import socketService from '@/socketio';
import { getObjectData } from '@/storages';
import { CEmptyData, CLoading, CText, Row } from '@/utils';
import { Divider, isIOS } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Keyboard, Pressable, View } from 'react-native';
import Modal from '@gadhiyamanan/react-native-modal';
import { AddFriendModal } from './addFriends';
import { RemoveMember } from './removeMember';

export const ModalListMember = ({
  isVisible,
  hideModal,
  itemRoomId,
  itemChat,
  listOwner,
  listTotalMember,
  handleRemoveMember,
  navigation,
  isOnlyView,
}: any) => {
  //a5e01b34-bf52-498f-8830-5fee6a3d0cff
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const { user } = useContext(AppContext);
  const { firebaseConfig } = useAppSelector(state => state.globalReducer);

  const styles = useStyles();

  const toastEl = useRef<any>(null);

  const dispatch = useAppDispatch();
  const {
    listMemberGroup,
    getRequestFriend,
    getRequestFriendInvited,
    getRequestFriendWaiting,
  } = useAppSelector(state => state.communityReducer);
  const { socketCreatRoom, socketAddFriends } = useAppSelector(
    state => state.socketioReducer,
  );

  const [listMember, setListMember] = useState<any[]>([]);
  const [listFriends, setListFriends] = useState<any[]>([]);
  const [listFriendsInvited, setListFriendsInvited] = useState<any[]>([]);
  const [listFriendsWaiting, setListFriendsWaiting] = useState<any[]>([]);

  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);
  const [finalLoad, setFinalLoad] = useState(false);
  const [itemGoChat, setItemGoChat] = useState<any>({});

  const [itemAddFriend, setItemAddFriend] = useState<any>({});

  const [checkgoChat, setcheckgoChat] = useState(false);

  const [offset, setOffset] = useState(0);

  const [apiLoading, setApiLoading] = useState(false);

  const [itemMember, setSelectedItem] = useState<any>({});
  const [searchValue, setSearchValue] = useState<string>('');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalAddFriends, setShowModalAddFriends] =
    useState<boolean>(false);

  const [role, setRole] = useState<any>('');

  const getListMemberApi = (_offset: number) => {
    dispatch(getListMemberGroup({ id: itemRoomId }));
  };

  const getListRequestFriends = () => {
    dispatch(getRequestFriends({}));
    dispatch(getRequestFriendInviteds({}));
    dispatch(getRequestFriendWaitings({}));
  };

  useEffect(() => {
    setTimeout(() => {
      getListMemberApi(0);
      getListRequestFriends();
    }, 1000);
  }, [socketAddFriends]);

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
          setFirstRender(false);
        } else if (error) {
          setFirstRender(false);
        }
      }
    };
    processAPIListRoom();
  }, [getRequestFriend]);

  // useEffect(() => {
  //     if (listTotalMember) {
  //         let arr = JSON.parse(JSON.stringify(listTotalMember))
  //         if (offset === 0) {
  //             arr.sort((a: any, b: any) => {
  //                 if (a.role === "Owner") {
  //                     return -1;
  //                 }
  //                 if (b.role === "Owner") {
  //                     return 1;
  //                 }
  //                 return 0;
  //             });
  //             setListMember(arr)
  //           } else {
  //             setListMember([...listMember, ...arr]);
  //           }
  //     }
  // }, []);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = listMemberGroup;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let sizeResponse = newItems.length;
            let arr = JSON.parse(JSON.stringify(newItems));
            if (offset === 0) {
              arr.sort((a: any, b: any) => {
                if (a.role === 'Owner') {
                  return -1;
                }
                if (b.role === 'Owner') {
                  return 1;
                }
                if (a.role === 'Admin') {
                  return -2;
                }
                if (b.role === 'Admin') {
                  return 2;
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
              setListMember(arr);
            }
            setFinalLoad(sizeResponse < PAGINATION.ITEMS_10);
          } else {
            setListMember([]);
            setFirstRender(false);
            setRefreshing(false);
          }
          setFirstRender(false);
        } else if (error) {
          setFirstRender(false);
          setRefreshing(false);
        }
      }
    };
    processAPIListRoom();
  }, [listMemberGroup]);

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
          setFirstRender(false);
        } else if (error) {
          setFirstRender(false);
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
          setFirstRender(false);
        } else if (error) {
          setFirstRender(false);
        }
      }
    };
    processAPIListRoom();
  }, [getRequestFriendWaiting]);

  useEffect(() => {
    const processAPIListCreate = async () => {
      const listRoom = await getObjectData(STORAGEKEY.LIST_ROOM);
      const { data } = socketCreatRoom;
      if (data) {
        if (checkgoChat) {
          let item = {
            created_at: Date.now(),
            description: null,
            id: socketCreatRoom.data?.room_id,
            invite_status: 1,
            is_deleted: 0,
            owner_id: user.id,
            status: 1,
            thumbnail: itemGoChat.avatar,
            // thumbnail: null,
            title: itemGoChat.full_name,
            to: itemGoChat.id,
            type: '1-1',
            updated_at: Date.now(),
            user_id: null,
          };
          hideModal();
          navigation.goBack();
        //   setTimeout(() => {
        //     navigation.navigate(mainRoute.communityChat, {
        //       item: item,
        //       roomId: socketCreatRoom.data?.room_id,
        //       ownerId: user.id,
        //       checkCreateRoom: true,
        //     });
        //   }, 300);
          store.dispatch(resetPinMessage(null));
          store.dispatch(resetMessages(null));
          store.dispatch(resetHistoryChat(null));
        }
      }
    };
    processAPIListCreate();
  }, [socketCreatRoom]);

  //ACTION

  const handleClearSearch = () => {
    // setFirstRender(true)
    setSearchValue('');
  };

  const handleChangeTextSearch = (value: string) => {
    let arr = JSON.parse(JSON.stringify(listMemberGroup.data?.items));
    if (value !== '') {
      let newData =
        listMemberGroup.data?.items.filter(function (item: any) {
          const itemData = changeAlias(item.full_name);
          const textData = changeAlias(value);
          return itemData.indexOf(textData) > -1;
        }) || [];
      newData.sort((a: any, b: any) => {
        if (a.role === 'Owner') {
          return -1;
        }
        if (b.role === 'Owner') {
          return 1;
        }
        if (a.role === 'Admin') {
          return -2;
        }
        if (b.role === 'Admin') {
          return 2;
        }
        return 0;
      });
      setListMember(newData || []);
      setSearchValue(value);
    } else {
      arr.sort((a: any, b: any) => {
        if (a.role === 'Owner') {
          return -1;
        }
        if (b.role === 'Owner') {
          return 1;
        }
        if (a.role === 'Admin') {
          return -2;
        }
        if (b.role === 'Admin') {
          return 2;
        }
        return 0;
      });
      setListMember(arr);
      setSearchValue(value);
    }
  };

  const handleSearch = () => {
    if (searchValue != '') {
      Keyboard.dismiss();
    }
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

  const handleCheckBox = (item: any, index: any) => {
    // console.log("🚀 ~ handleCheckBox ~ item:", item)
    if (listOwner === 'Owner' || listOwner === 'Admin') {
      if (item.role !== 'Owner') {
        setShowModal(true);
        setSelectedItem(item);
        setRole(item.role);
      }
    }
  };

  const handleDeleteMember = () => {
    let arr = JSON.parse(JSON.stringify(listMember));
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === itemMember.id) {
        arr.splice(i, 1);
      }
      // break;
    }
    setShowModal(false);
    setListMember(arr);
    handleRemoveMember(itemMember.full_name);
    socketService.emitRemoveMember(itemRoomId, itemMember.id);
  };

  const handleResquestFriends = (item: any) => {
    socketService.emitFriendRequest(item.id);
    showToast(toastEl, t('communityChat.contact.suggestFriend'), 2000);
  };

  const handleGoChat = (item: any) => {
    if (!isOnlyView && item.id !== user.id && !item.id.includes('bot')) {
      socketService.emitCreateSocketUser(item.full_name, item.id);
      setcheckgoChat(true);
      setItemGoChat(item);
      setItemAddFriend(item);
      if (findMatchingElements(listMember, listFriends).includes(item)) {
        if (user.id !== item.id) {
          // setItemGoChat(item);
          // setcheckgoChat(true);
          // socketService.emitCreateSocketUser(item.full_name, item.id)
        }
      }
      if (
        findMatchingElementsInvite(listMember, listFriendsInvited).includes(
          item,
        )
      ) {
        // setShowModalAddFriends(true);
        // setItemAddFriend(item);
        // setItemGoChat(item);
        // setcheckgoChat(true);
        // socketService.emitCreateSocketUser(item.full_name, item.id)
      } else if (
        findMatchingElementsWaiting(listMember, listFriendsWaiting).includes(
          item,
        )
      ) {
        // showToast(toastEl, 'Đã gửi lời mời', 2000);
        // setItemGoChat(item);
        // setcheckgoChat(true);
        // socketService.emitCreateSocketUser(item.full_name, item.id)
      }
      store.dispatch(resetRoomDetal(null));
    }
  };

  const handleGoOrCheck = (item: any) => {
    if (
      findMatchingElementsInvite(listMember, listFriendsInvited).includes(item)
    ) {
      setShowModalAddFriends(true);
      setItemAddFriend(item);
      // setItemGoChat(item);
      // setcheckgoChat(true);
      // socketService.emitCreateSocketUser(item.full_name, item.id)
    } else if (
      findMatchingElementsWaiting(listMember, listFriendsWaiting).includes(item)
    ) {
      // showToast(toastEl, 'Đã gửi lời mời', 2000);
      setItemGoChat(item);
      setcheckgoChat(true);
      socketService.emitCreateSocketUser(item.full_name, item.id);
    }
  };

  const findMatchingElements = (a: any, b: any) => {
    let arrA = [...a];
    let arrB = [...b];
    let arrC = [];
    let arrD = [];
    for (let i = 0; i < arrB.length; i++) {
      if (user.id === arrB[i].user_id) {
        arrC = arrB
          .map((friend: any) =>
            arrA.find((user: any) => user.id === friend.friend_id),
          )
          .filter(Boolean);
      } else {
        arrD = arrB
          .map((friend: any) =>
            arrA.find((user: any) => user.id === friend.user_id),
          )
          .filter(Boolean);
      }
    }
    return [...arrC, ...arrD];
    //
  };

  const findMatchingElementsInvite = (a: any, b: any) => {
    return b
      .map((friend: any) => a.find((user: any) => user.id === friend.user_id))
      .filter(Boolean);
  };

  const findMatchingElementsWaiting = (a: any, b: any) => {
    return b
      .map((friend: any) => a.find((user: any) => user.id === friend.friend_id))
      .filter(Boolean);
  };

  const handleAppect = () => {
    setShowModalAddFriends(false);
    socketService.emitFriendAppectReject(1, itemAddFriend.id);
  };

  const handleReject = () => {
    setShowModalAddFriends(false);
    socketService.emitFriendAppectReject(2, itemAddFriend.id);
  };

  const handleApprove = (item: any) => {
    let arr = JSON.parse(JSON.stringify(listMember));
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === item.id) {
        arr[i].status = 1;
      }
    }
    setListMember(arr);
    socketService.emitApproveMember(itemRoomId, item.id, 1, itemChat.title);
  };

  const handleNoApprove = (item: any) => {
    let arr = JSON.parse(JSON.stringify(listMember));
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === item.id) {
        arr.splice(i, 1);
      }
    }
    setListMember(arr);
    socketService.emitApproveMember(itemRoomId, item.id, 2, itemChat.title);
  };

  const handleChangeAdmin = () => {
    let arr = JSON.parse(JSON.stringify(listMember));
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === itemMember.id) {
        arr[i].role = 'Admin';
      }
    }
    setListMember(arr);
    setShowModal(false);
    socketService.emitApproveAdmin(itemRoomId, itemMember.id, 'Admin');
    socketService.emitMessageSocketGroup(
      `DoctorNetwork_Chat_NETDEV ${itemMember.full_name} {communityChat.listMember.changeRole}`,
      'text',
      itemRoomId,
      'DoctorNetwork_Chat_NETDE_DELETE_ROOM',
    );
  };

  const onRefresh = () => {
    setOffset(0);
    setRefreshing(true);
    getListMemberApi(0);
  };

  const _renderLoadingFooter = () => {
    // return !finalLoad && !onEndReached ? (
    //   <Row style={screenStyles.mT5}>
    //     <ActivityIndicator size="small" color={colors.primary} />
    //   </Row>
    // ) : null;
  };

  const handleLoadMore = async () => {
    // if (!finalLoad && !onEndReached) {
    //   const _offset = offset + PAGINATION.ITEMS_10;
    //   setOffset(_offset);
    //   getListMemberApi(_offset);
    // } else {
    //   // await storeStringData(STORAGEKEY.CHECKLOCAL_FIRST, 'true');
    //   // if(listCreateRoom.length === ){
    //   // }
    // }
  };

  //RENDER
  const renderInput = () => {
    return (
      <View style={[screenStyles.pH24, screenStyles.pV12]}>
        <View style={{ paddingTop: 16 }} />
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

  const renderItemRoomFriend = ({ item, index }: any) => {
    const { full_name, avatar, id, role, status } = item;
    if (status === -1) {
      return (
        <Row
          start
          style={[
            screenStyles.pV10,
            screenStyles.pH10,
            { borderBottomWidth: 1, borderBottomColor: colors.cF2F4F7 },
          ]}
        >
          <Pressable style={[screenStyles.rowStart, screenStyles.flex1]}>
            <>
              {role === 'Owner' ? (
                <View>
                  <View style={styles.avatar50}>
                    <ImageHelper
                      source={{ uri: avatar }}
                      renderErrorImage={renderErrorImage}
                    />
                  </View>
                  <View style={styles.avatarDot}>
                    <IconX
                      style={{ top: 2, left: 2 }}
                      name={'key'}
                      type={IconType.IONICONS}
                      color={colors.cFECD5D}
                      size={12}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.avatar50}>
                  <ImageHelper
                    source={{ uri: avatar }}
                    renderErrorImage={renderErrorImage}
                  />
                </View>
              )}
            </>
            <View style={[screenStyles.pH10, screenStyles.flex1]}>
              <Row between>
                <View>
                  <CText h5 w600 color={colors.black}>
                    {conventUserNameChat(
                      listOwner,
                      full_name,
                      firebaseConfig.isReviewApp,
                      itemChat.is_name,
                    )}
                  </CText>
                  <View style={{ paddingVertical: 3 }} />
                  <CText h5 w400 color={colors.c667085}>
                    {t('communityChat.listMember.approve')}
                  </CText>
                </View>
                <Row>
                  <Pressable
                    onPress={() => handleApprove(item)}
                    style={{
                      width: 35,
                      height: 35,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconX
                      name={'check'}
                      type={IconType.ENTYPO}
                      color={colors.primary}
                      size={22}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleNoApprove(item)}
                    style={{
                      width: 35,
                      height: 35,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconX
                      name={'close'}
                      type={IconType.FONTISTO}
                      color={'red'}
                      size={22}
                    />
                  </Pressable>
                </Row>
              </Row>
            </View>
          </Pressable>
        </Row>
      );
    } else {
      return (
        <Row
          start
          style={[
            screenStyles.pV10,
            screenStyles.pH10,
            { borderBottomWidth: 1, borderBottomColor: colors.cF2F4F7 },
          ]}
        >
          <Pressable style={[screenStyles.rowStart, screenStyles.flex1]}>
            <Pressable onPress={() => handleGoChat(item)}>
              {role === 'Owner' ? (
                <View>
                  <View style={styles.avatar50}>
                    <ImageHelper
                      source={{ uri: avatar }}
                      renderErrorImage={renderErrorImage}
                    />
                  </View>
                  <View style={styles.avatarDot}>
                    <IconX
                      style={{ top: 2, left: 2 }}
                      name={'key'}
                      type={IconType.IONICONS}
                      color={colors.cFECD5D}
                      size={12}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.avatar50}>
                  <ImageHelper
                    source={{ uri: avatar }}
                    renderErrorImage={renderErrorImage}
                  />
                </View>
              )}
            </Pressable>
            <View style={[screenStyles.pH10, screenStyles.flex1]}>
              <Row between>
                <Pressable onPress={() => handleGoChat(item)}>
                  <CText h5 w600 color={colors.black}>
                    {conventUserNameChat(
                      listOwner,
                      full_name,
                      firebaseConfig.isReviewApp,
                      itemChat.is_name,
                    )}
                  </CText>
                  <View style={{ paddingVertical: 3 }} />
                  <CText h5 w400 color={colors.c667085}>
                    {role === 'Owner'
                      ? `${t('communityChat.listMember.owner')}`
                      : role === 'Admin'
                      ? t('communityChat.listMember.Admin')
                      : `${t('communityChat.listMember.member')}`}
                  </CText>
                </Pressable>
                {user.id !== id &&
                !isOnlyView &&
                listOwner !== 'Admin' &&
                !item.id.includes('bot') ? (
                  findMatchingElements(listMember, listFriends).includes(
                    item,
                  ) ? (
                    <>
                      <Row>
                        <Image
                          source={images.community.icon_addFriends}
                          style={screenStyles.box20}
                        />
                        {listOwner === 'Owner' && item.role !== 'Owner' ? (
                          <Pressable
                            style={{
                              width: 40,
                              height: 40,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => {
                              handleCheckBox(item, index);
                            }}
                          >
                            <Image
                              source={images.community.icon_dot}
                              style={screenStyles.box22}
                            />
                          </Pressable>
                        ) : null}
                      </Row>
                    </>
                  ) : (
                    <>
                      {findMatchingElementsInvite(
                        listMember,
                        listFriendsInvited,
                      ).includes(item) ||
                      findMatchingElementsWaiting(
                        listMember,
                        listFriendsWaiting,
                      ).includes(item) ? (
                        <Row end>
                          <Pressable
                            onPress={() => {
                              handleGoOrCheck(item);
                            }}
                          >
                            {/* <Image source={images.community.icon_addFriends} style={screenStyles.box20} /> */}
                          </Pressable>
                          {listOwner === 'Owner' && item.role !== 'Owner' ? (
                            <Pressable
                              style={{
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() => {
                                handleCheckBox(item, index);
                              }}
                            >
                              <Image
                                source={images.community.icon_dot}
                                style={screenStyles.box22}
                              />
                            </Pressable>
                          ) : null}
                        </Row>
                      ) : (
                        <Row end>
                          <Pressable
                            onPress={() => handleResquestFriends(item)}
                          >
                            <Image
                              source={images.community.icon_reqFriends}
                              style={screenStyles.box22}
                            />
                          </Pressable>
                          {listOwner === 'Owner' && item.role !== 'Owner' ? (
                            <Pressable
                              style={{
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() => {
                                handleCheckBox(item, index);
                              }}
                            >
                              <Image
                                source={images.community.icon_dot}
                                style={screenStyles.box22}
                              />
                            </Pressable>
                          ) : null}
                        </Row>
                      )}
                    </>
                  )
                ) : null}
                {listOwner === 'Admin' && user.id !== id && (
                  <Pressable
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      handleCheckBox(item, index);
                    }}
                  >
                    {item.role !== 'Owner' && (
                      <Image
                        source={images.community.icon_dot}
                        style={screenStyles.box22}
                      />
                    )}
                  </Pressable>
                )}
              </Row>
            </View>
          </Pressable>
        </Row>
      );
    }
  };

  const renderBody = () => {
    if (firstRender) {
      return <CLoading />;
    } else {
      return (
        <FlatList
          contentContainerStyle={screenStyles.flexGrowBottom}
          keyboardDismissMode="on-drag"
          data={listMember}
          extraData={listMember}
          keyExtractor={keyExtractor}
          renderItem={renderItemRoomFriend}
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
          // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.grey4} />}
          // ListFooterComponent={_renderLoadingFooter}
        />
      );
    }
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <View style={screenStyles.modalTopHeader}>
          <Row between>
            <Pressable onPress={() => hideModal()}>
              <IconX
                style={{ top: 2, left: 2 }}
                name={'close'}
                type={IconType.IONICONS}
                color={colors.black}
                size={24}
              />
            </Pressable>
            <CText center h4 w600 color={colors.black}>
              {t('communityChat.listMember.title')}
            </CText>
            <Pressable>
              <IconX
                style={{ top: 2, left: 2 }}
                name={'close'}
                type={IconType.IONICONS}
                color={colors.white}
                size={24}
              />
            </Pressable>
          </Row>
        </View>
        <Divider color={colors.cD0D5DD} width={1} />
        {renderInput()}
        {renderBody()}
        {/* {renderButton()} */}
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={hideModal}
      style={screenStyles.containerModalTop}
    >
      {renderContent()}
      {showModal && (
        <RemoveMember
          isVisible={showModal}
          hideModal={() => setShowModal(false)}
          role={role}
          handleDeleteMember={handleDeleteMember}
          handleChangeAdmin={handleChangeAdmin}
          itemMember={itemMember}
        />
      )}
      {showModalAddFriends && (
        <AddFriendModal
          isVisible={showModalAddFriends}
          hideModal={() => setShowModalAddFriends(false)}
          role={role}
          handleAppect={handleAppect}
          handleReject={handleReject}
        />
      )}
      {apiLoading ? (
        <APILoading showAlert={apiLoading} isLoadingAPI={apiLoading} />
      ) : null}
      <Toast ref={toastEl} position="bottom" />
    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  avatarDot: {
    position: 'absolute' as const,
    width: 16,
    height: 16,
    borderRadius: 8,
    top: 30,
    left: 37,
    backgroundColor: colors.c344054,
  },
  avatar50: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
  avatar40: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
}));
