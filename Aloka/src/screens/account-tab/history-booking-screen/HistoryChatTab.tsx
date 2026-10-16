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
// import { navigationRef } from '@/navigation/RootNavigation';
// import { resetHistoryChat } from '@/redux/slices/communitySlice';
// import { setHistoryChatName } from '@/redux/slices/globalSlice';
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

  const {
    firebaseConfig,
    // historyChatName
  } = useAppSelector(state => state.globalReducer);

  const dispatch = useAppDispatch();

  const { listRoomCreate } = useAppSelector(state => state.socketioReducer);
  // const { socketmessage,
  //     socketCreatRoom, listRoomCreate, editRoom,
  //     socketleaveRoom, socketdeleteRoom, socketinviteRoom,
  //     socketOwnerDeleteMessage, recallMess,
  //     botResponse, detailRoom, getPinLocal, checkErorrRemoveRoom, updateLocalListRoomChat, liveEnd, liveContinue,
  //     dataEndRoomChat
  // } = useAppSelector(state => state.socketioReducer);

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

  // EFFECT
  useEffect(() => {
    const processAPIListCreate = () => {
      setOffset(0);
      getListRoomApi(0);
    };
    processAPIListCreate();
    //   }, [getPinLocal, editRoom, socketleaveRoom]);
  }, []);

  useEffect(() => {
    const processAPIListRoom = () => {
      const { loading, data, error } = listRoomCreate;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          const sizeResponse = newItems.length;
          if (offset === 0) {
            setlistCreateRoom(newItems);
          } else {
            setlistCreateRoom([...listCreateRoom, ...newItems]);
          }
          setFinalLoad(sizeResponse < PAGINATION.ITEMS_10);
          setFirstRender(false);
          setRefreshing(false);
        } else if (error) {
          setFirstRender(false);
          setRefreshing(false);
        }
      }
    };
    processAPIListRoom();
  }, [listRoomCreate]);

  // ACTION
  const getListRoomApi = (_offset: number) => {
    socketService.emitListRoom(PAGINATION.ITEMS_10, _offset, 'text', 1);
  };

  const handleChangeTextSearch = (value: string) => {
    // if(listRoomCreate?.data?.items !== undefined){
    let arr = [...listCreateRoom];
    // if (value !== '') {
    //     if (listRoomCreate?.data?.items !== undefined) {
    //         const newData = arr.filter(function (item: any) {
    //             const itemData = changeAlias(item.title);
    //             const textData = changeAlias(value);
    //             return itemData.includes(textData);
    //         });
    //         setlistCreateRoom(newData || []);
    //         setSearchValue(value);
    //     }
    // } else {
    //     setOffset(0);
    //     getListRoomApi(0);
    //     setFirstRender(true);
    // }
    setSearchValue(value);
  };

  const handleSearch = () => {
    if (searchValue != '') {
      Keyboard.dismiss();
    }
  };

  const handleClearSearch = () => {
    // setFirstRender(true)
    setSearchValue('');
    getListRoomApi(0);
    setFirstRender(true);
  };

  const handleLoadMore = () => {
    if (!finalLoad && !onEndReached) {
      const _offset = offset + PAGINATION.ITEMS_10;
      setOffset(_offset);
      getListRoomApi(_offset);
    }
  };

  const onRefresh = React.useCallback(() => {
    setOffset(0);
    setRefreshing(true);
    getListRoomApi(0);
  }, [refreshing]);

  const handleGoChat = (item: any) => {
    const { id, owner_id } = item;
    navigation.navigate(mainRoute.chatScreen, {
      item: item,
      listCreateRoom: listCreateRoom,
      roomId: id,
      ownerId: owner_id,
      checkCreateRoom: false,
    });
  };

  // RENDER
  const _renderLoadingFooter = () => {
    return !finalLoad && !onEndReached ? (
      <Row style={screenStyles.mT5}>
        <ActivityIndicator size="small" color={colors.primary} />
      </Row>
    ) : null;
  };

  const renderInput = () => {
    return (
      <View style={[screenStyles.pH14, screenStyles.pV14]}>
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
    return (
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
          //   onLongPress={() => {
          //     bottomSheetRef.current?.present();
          //   }}
          //   onPress={() => handleGoChat(item)}
          onPress={() => handleGoChat(item)}
        >
          <View style={[styles.avatar, screenStyles.centerWrap]}>
            <ImageHelper
              source={{ uri: thumbnail }}
              renderErrorImage={renderErrorImage}
            />
          </View>
          <View style={[screenStyles.pH10, screenStyles.flex1]}>
            <CText h5 w500 numberOfLines={2} color={colors.c101828}>
              {title || ''}
            </CText>
            <CText
              h5
              numberOfLines={2}
              color={colors.c667085}
              style={{ paddingTop: 5 }}
            >
              {last_message?.content}
            </CText>
          </View>
        </Pressable>
      </Row>
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
