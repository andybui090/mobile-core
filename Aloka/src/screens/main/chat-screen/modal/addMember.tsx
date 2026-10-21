import {
  APILoading,
  CSearchBar,
  ICON_TYPE,
  IconX,
  ImageHelper,
} from '@/components';
import {images, keyExtractor, removeExtraSpaces, screenStyles} from '@/configs';
import {PAGINATION} from '@/constants';
import {mainRoute} from '@/constants/route_key';
import {AppContext} from '@/contexts';
import {photoSingleCropLauncher} from '@/permissions';
import {showPhotoLibrary} from '@/permissions/picker';
import {resetHistoryChat} from '@/redux/slices/communitySlice';
import {
  listFriends,
  resetMessages,
  resetPinMessage,
} from '@/redux/slices/socketioSlice';
import {store} from '@/redux/store';
import {useAppSelector} from '@/redux/store/customReduxHook';
import socketService from '@/socketio';
import {CEmptyData, CLoading, CText, Row} from '@/utils';
import {Divider, isIOS} from '@rneui/base';
import {makeStyles, useTheme} from '@rneui/themed';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import Modal from 'react-native-modal';

export const ModalAddMember = ({
  isVisible,
  hideModal,
  itemRoomId,
  itemChat,
  handleSendInvite,
  handleHideModal,
  navigation,
  listCreateRoom,
  listHistoryChatRoom,
}: any) => {
  //a5e01b34-bf52-498f-8830-5fee6a3d0cff
  const {
    theme: {colors},
  } = useTheme();
  const {t} = useTranslation();

  const styles = useStyles();
  const {user} = useContext(AppContext);

  const {listMemberGroup} = useAppSelector(state => state.communityReducer);
  const {socketCreatRoom, listFriend} = useAppSelector(
    state => state.socketioReducer,
  );

  const [listCreateRoomFriend, setlistCreateRoomFriends] = useState<any[]>([]);
  const [listMember, setListMember] = useState<any[]>([]);

  const [offset, setOffset] = useState(0);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);
  const [finalLoad, setFinalLoad] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedUserId, setSelectedUserId] = useState<any>([]);
  const [selectedUserAddId, setSelectedUserAddId] = useState<any>([]);

  const [selectedUserName, setSelectedUserName] = useState<any>([]);
  const [selectedUserIdChosse, setSelectedUserIdChosse] = useState<any>([]);

  const [valueNameGroup, onChangeText] = useState('');

  const [searchValue, setSearchValue] = useState<string>('');

  const [avatarbase64, setAvatarbase64] = useState('');
  const [avatarName, setAvatarName] = useState('');

  const getListRoomApi = (_offset: number, limt: any) => {
    axios
      .get(`${Config.BASE_API_URL}/doctors`, {
        params: {
          offset: _offset,
          limit: PAGINATION.ITEMS_20,
        },
      })
      .then(response => {
        store.dispatch(listFriends(response.data));
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  };

  useEffect(() => {
    getListRoomApi(0, PAGINATION.ITEMS_20);
  }, []);

  useEffect(() => {
    const arr = [...selectedUserId];
    const arr2 = [...selectedUserName];
    if (itemChat.type === '1-1') {
      arr.push(itemChat.to);
      arr2.push(itemChat.title);
    } else {
      for (let i = 0; i < listMember.length; i++) {
        arr.push(listMember[i].id);
      }
    }
    setSelectedUserId(removeDuplicates(arr));
    setSelectedUserName(removeDuplicates(arr2));
    setSelectedUserIdChosse(removeDuplicates(arr));
  }, [listFriend]);

  useEffect(() => {
    const processAPIListRoom = () => {
      const {loading, data, error} = listFriend;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let sizeResponse = newItems.length;
            if (offset === 0) {
              setlistCreateRoomFriends(newItems);
            } else {
              setlistCreateRoomFriends([...listCreateRoomFriend, ...newItems]);
            }
            setFinalLoad(sizeResponse < PAGINATION.ITEMS_20);
          } else {
            setFinalLoad(true);
            setlistCreateRoomFriends([]);
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
  }, [listFriend]);

  useEffect(() => {
    const processAPIListMember = () => {
      const {loading, data, error} = listMemberGroup;
      if (!loading) {
        if (data) {
          if (data && data.items) {
            let newItems = data.items || [];
            let sizeResponse = newItems.length;
            if (offset === 0) {
              setListMember(newItems);
            } else {
              setListMember([...listMember, ...newItems]);
            }
            setFinalLoad(sizeResponse < PAGINATION.ITEMS_20);
          } else {
            setFinalLoad(true);
            setListMember([]);
          }
          setFirstRender(false);
          setRefreshing(false);
        } else if (error) {
          setFirstRender(false);
          setRefreshing(false);
        }
      }
    };
    processAPIListMember();
  }, [listMemberGroup]);

  useEffect(() => {
    const name =
      valueNameGroup != '' ? valueNameGroup : selectedUserName.join(', ');
    const processAPIListCreate = () => {
      const {data} = socketCreatRoom;
      if (data) {
        let item = {
          created_at: Date.now(),
          description: null,
          id: socketCreatRoom.data?.room_id,
          invite_status: selectedUserAddId.length > 1 ? 0 : 1,
          is_deleted: 0,
          owner_id: user.id,
          status: 1,
          thumbnail:
            selectedUserAddId.length > 1
              ? avatarbase64
              : selectedItems[0]?.avatar,
          // thumbnail: null,
          title: name,
          to: selectedUserAddId.length > 1 ? null : selectedUserAddId[0],
          type: selectedUserAddId.length > 1 ? 'Room' : '1-1',
          updated_at: Date.now(),
          user_id: user.id,
        };
        for (let i = 0; i < listCreateRoom.length; i++) {
          if (listCreateRoom[i].id === socketCreatRoom.data?.room_id) {
            navigation.navigate(mainRoute.communityChat, {
              item: item,
              roomId: listCreateRoom[i].id,
              ownerId: user.id,
              checkCreateRoom: true,
            });
          }
        }
        socketService.emitListRoom(PAGINATION.ITEMS_100, 0);
        navigation.goBack();
        navigation.navigate(mainRoute.communityChat, {
          item: item,
          roomId: socketCreatRoom.data?.room_id,
          ownerId: user.id,
          checkCreateRoom: true,
        });
        store.dispatch(resetPinMessage(null));
        store.dispatch(resetMessages(null));
        store.dispatch(resetHistoryChat(null));
      }
    };
    processAPIListCreate();
  }, [socketCreatRoom]);

  //ACTION

  function removeDuplicates(arr: any) {
    return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
  }

  const handleClearSearch = () => {
    setFirstRender(true);
    setSearchValue('');
    getListRoomApi(0, PAGINATION.ITEMS_20);
  };

  const handleChangeTextSearch = (value: string) => {
    let valueParse = removeExtraSpaces(value);
    setSearchValue(valueParse);
  };

  const getAPISearch = (keyword: string) => {
    axios
      .get(`${Config.BASE_API_URL}/doctors`, {
        params: {
          offset: 0,
          limit: PAGINATION.ITEMS_20,
          s: keyword,
        },
      })
      .then(response => {
        store.dispatch(listFriends(response.data));
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  };

  const handleSearch = () => {
    setFirstRender(true);
    setTimeout(() => {
      getAPISearch(searchValue);
    }, 300);
    setOffset(0);
  };

  const onRefresh = () => {
    setOffset(0);
    setRefreshing(true);
    getListRoomApi(0, PAGINATION.ITEMS_20);
  };

  const handleLoadMore = () => {
    if (!finalLoad && !onEndReached) {
      const _offset = offset + PAGINATION.ITEMS_20;
      setOffset(_offset);
      getListRoomApi(_offset, PAGINATION.ITEMS_20);
    }
  };

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box40}
        resizeMode="contain"
      />
    );
  };

  const handleCheckBox = (item: any, index: any) => {
    let arr = [...selectedItems];
    let arr2 = [...selectedUserId];
    let arr3 = [...selectedUserName];
    let arr4 = [...selectedUserAddId, ...selectedUserIdChosse];

    if (selectedItems.includes(item)) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].user_id === item.user_id) {
          arr.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i] === item.user_id) {
          arr2.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < arr3.length; i++) {
        if (arr3[i] === item.full_name) {
          arr3.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < arr4.length; i++) {
        if (arr4[i] === item.user_id) {
          arr4.splice(i, 1);
          break;
        }
      }
    } else {
      if (!selectedUserId.includes(item.user_id)) {
        arr.push(item);
        arr2.push(item.user_id);
        arr3.push(item.full_name);
        arr4.push(item.user_id);
      }
    }
    setSelectedItems(arr);
    setSelectedUserId(arr2);
    setSelectedUserName(removeDuplicates(arr3));
    setSelectedUserAddId(arr4);
  };

  const handleRemoveAvatar = (item: any) => {
    let arr = [...selectedItems];
    let arr2 = [...selectedUserId];
    if (selectedUserId.includes(item.user_id)) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === item.user_id) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    if (selectedUserId.includes(item.user_id)) {
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i] === item.user_id) {
          arr2.splice(i, 1);
          break;
        }
      }
    }
    setSelectedItems(arr);
    setSelectedUserId(arr2);
  };

  const handleAddMember = async () => {
    const name =
      valueNameGroup != '' ? valueNameGroup : selectedUserName.join(', ');
    if (itemChat.type === '1-1') {
      if (selectedUserAddId.length > 0) {
        if (avatarbase64 != '') {
          socketService.emitCreateSocketGroup(
            name,
            selectedUserAddId.join(','),
            avatarName,
            avatarbase64,
            false,
            false,
          );
        } else {
          socketService.emitCreateSocketGroupNoImage(
            name,
            selectedUserAddId.join(','),
            false,
            false,
          );
        }
        setApiLoading(true);
        setTimeout(() => {
          hideModal();
          handleHideModal();
          setApiLoading(false);
        }, 1000);
      }
    } else {
      if (selectedUserAddId.length > 0) {
        socketService.emitInviteSocket(itemRoomId, selectedUserAddId.join(','));
        setApiLoading(true);
        handleSendInvite(selectedUserName);
      }
      setTimeout(() => {
        hideModal();
        handleHideModal();
        setApiLoading(false);
      }, 1000);
    }
    store.dispatch(resetMessages(null));
    store.dispatch(resetPinMessage(null));
    store.dispatch(resetHistoryChat(null));
  };

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
        setAvatarName(checkPhoto.imgRes.path);
      }
    } else if (checkPhoto.msg) {
      // showToast(toastEl, checkPhoto.msg);
    }
  };

  //RENDER
  const renderInput = () => {
    return (
      <View style={[screenStyles.pH24, screenStyles.pV12]}>
        {itemChat.type === '1-1' ? (
          <Row start>
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
                <IconX
                  name={'camera'}
                  origin={ICON_TYPE.FEATHER_ICONS}
                  color={colors.black}
                  size={24}
                />
              )}
            </TouchableOpacity>
            <View>
              <TextInput
                onChangeText={text => onChangeText(text)}
                numberOfLines={1}
                value={valueNameGroup}
                placeholder={t('communityChat.CreateGroup.Name')}
                placeholderTextColor={colors.c667085}
                style={{paddingTop: 5, paddingHorizontal: 13}}
              />
            </View>
          </Row>
        ) : null}
        <View style={{paddingTop: 16}} />
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

  const _renderLoadingFooter = () => {
    return !finalLoad && !onEndReached ? (
      <Row style={screenStyles.mT5}>
        <ActivityIndicator size="small" color={colors.primary} />
      </Row>
    ) : null;
  };

  const renderItemSelectAvatar = (item: any, index: number) => {
    return (
      <View key={index}>
        <View style={screenStyles.pH12}>
          <View style={styles.avatar50}>
            <ImageHelper
              source={{uri: item.avatar}}
              renderErrorImage={renderErrorImage}
            />
          </View>
          <Pressable
            style={styles.avatarDot}
            onPress={() => handleRemoveAvatar(item)}>
            <View>
              <IconX
                name={'closecircle'}
                origin={ICON_TYPE.ANT_ICON}
                color={colors.c344054}
                size={12}
              />
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderItemRoomFriend = ({item, index}: any) => {
    const {full_name, avatar, user_id} = item;
    return (
      <Row
        start
        style={[
          screenStyles.pV10,
          screenStyles.pH10,
          {borderBottomWidth: 1, borderBottomColor: colors.cF2F4F7},
        ]}>
        <Pressable
          style={[screenStyles.rowStart, screenStyles.flex1]}
          onPress={() => {
            handleCheckBox(item, index);
          }}>
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
              source={{uri: avatar}}
              renderErrorImage={renderErrorImage}
            />
          </View>
          <View style={[screenStyles.pH10, screenStyles.flex1]}>
            <CText h5 w600 color={colors.black}>
              {full_name || ''}
            </CText>
          </View>
          {!selectedUserId?.includes(user_id) ? (
            <IconX
              name={'check-box-outline-blank'}
              origin={ICON_TYPE.MATERIAL_ICONS}
              color={colors.black}
              size={26}
            />
          ) : (
            <IconX
              name={'checkbox'}
              origin={ICON_TYPE.ICONICONS}
              color={colors.primary}
              size={26}
            />
          )}
        </Pressable>
      </Row>
    );
  };

  const renderBody = () => {
    if (firstRender) {
      return <CLoading />;
    } else {
      return (
        <FlatList
          contentContainerStyle={screenStyles.flexGrowBottom}
          keyboardDismissMode="on-drag"
          data={listCreateRoomFriend}
          extraData={listCreateRoomFriend}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.grey4}
            />
          }
          ListFooterComponent={_renderLoadingFooter}
        />
      );
    }
  };

  const renderList = () => {
    return (
      <View style={[screenStyles.pV10]}>
        <ScrollView
          horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {selectedItems.map(renderItemSelectAvatar)}
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    let textTitle =
      itemChat.type === '1-1'
        ? `${t('communityChat.addMember.title1vs1')}`
        : `${t('communityChat.addMember.titleRoom')}`;
    let textAdd =
      itemChat.type === '1-1'
        ? `${t('communityChat.addMember.textAdd1vs1')}`
        : `${t('communityChat.addMember.textAddRoom')}`;
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX
              name={'close'}
              origin={ICON_TYPE.ANT_ICON}
              color={colors.black}
              size={24}
            />
          </Pressable>
          <CText h4 w600 color={colors.black}>
            {textTitle}
          </CText>
          <Pressable onPress={handleAddMember}>
            <CText
              h4
              w600
              color={
                selectedItems.length > 0 ? colors.primary : colors.c667085
              }>
              {textAdd}
            </CText>
          </Pressable>
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        {renderInput()}
        {renderList()}
        <View style={screenStyles.mL15}>
          <CText w700 h5 color={colors.c101828}>
            {t('communityChat.addMember.suggest')}
          </CText>
        </View>
        {renderBody()}
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={hideModal}
      style={screenStyles.containerModalTop}>
      {renderContent()}
      {apiLoading ? (
        <APILoading showAlert={apiLoading} isLoadingAPI={apiLoading} />
      ) : null}
    </Modal>
  );
};

const useStyles = makeStyles(({colors}) => ({
  avatarDot: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 6,
    top: 2,
    left: 47,
  },
  avatar50: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
}));
