import { CHeader, ImageHeader, ImageHelper, Wrapper } from '@/components';
import {
  ifIphoneX,
  images,
  isIOS,
  keyExtractor,
  screenStyles,
} from '@/configs';
import { mainRoute, PAGINATION } from '@/constants';
import { AppContext } from '@/contexts';
import { goBack } from '@/navigation/RootNavigation';
import { getListChannel, resetChannelList } from '@/redux/slices/channelSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CEmptyData, CLoading, Container, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';

const useStyles = makeStyles(() => ({}));

const MySpecialistScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const flatListRef = useRef<FlatList>(null);

  const dispatch = useAppDispatch();

  const { user } = useContext(AppContext);

  // -------------------------------
  // STATE
  // -------------------------------
  const { channelList } = useAppSelector(state => state.channelReducer);
  //list channel
  const [listChannel, setListChannel] = useState<Array<any>>([]);
  const [offset, setOffset] = useState<number>(0);
  const [finalLoad, setFinalLoad] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);

  const callAPIlistChannel = (_offset: number) => {
    const param: any = {
      limit: PAGINATION.ITEMS_15,
      offset: _offset,
      fqin: `user_id:${user.id}`,
    };
    console.log('🚀 ~ callAPIlistChannel ~ param:', param);
    dispatch(getListChannel(param));
  };

  useEffect(() => {
    callAPIlistChannel(0);
  }, []);

  useEffect(() => {
    const processAPIListChannel = () => {
      const { loading, data, error } = channelList;
      if (!loading) {
        if (data) {
          const { items }: any = data;
          // console.log("🚀 ~ processAPIListChannel ~ items:", items[0]);
          if (items) {
            const newItems = items || [];
            if (offset == 0) {
              setListChannel(newItems);
            } else {
              setListChannel([...listChannel, ...newItems]);
            }
            let sizeResponse = newItems.length;
            setFinalLoad(sizeResponse < PAGINATION.ITEMS_15);
          }
          setFirstRender(false);
          setRefreshing(false);
          dispatch(resetChannelList());
        } else if (error) {
          setFirstRender(false);
          setRefreshing(false);
          dispatch(resetChannelList());
        }
      }
    };
    processAPIListChannel();
  }, [channelList]);

  // -------------------------------
  // ACTION
  // -------------------------------
  const onRefresh = React.useCallback(() => {
    setOffset(0);
    setRefreshing(true);
    callAPIlistChannel(0);
  }, [refreshing]);

  const handleLoadMore = () => {
    if (!finalLoad && !onEndReachedCalledDuringMomentum) {
      const newOffset = offset + PAGINATION.ITEMS_15;
      setOffset(newOffset);
      callAPIlistChannel(newOffset);
    }
  };

  const handleViewChannelDetail = (channelId: any) => {
    if (channelId) {
      navigation.navigate(mainRoute.channelDetailScreen, {
        channelId: channelId,
      });
    }
  };
  // -------------------------------
  // RENDER UI
  // -------------------------------
  const renderErrorImage = () => {
    return (
      <Image
        source={images.channel.channel_default}
        style={screenStyles.box36}
        resizeMode="contain"
      />
    );
  };

  const _renderItem = ({ item, index }: any) => {
    const { name, avatar, id } = item;
    return (
      <Pressable
        onPress={() => handleViewChannelDetail(id || '')}
        style={{
          borderRadius: 12,
          marginTop: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.cF2F4F7,
        }}
      >
        <View
          // source={images.global.bg_package}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            // backgroundColor:colors.c006BD5
          }}
        >
          <Row start>
            <View
              style={[
                screenStyles.round40R,
                { borderWidth: 1, borderColor: colors.cAAAAAA },
              ]}
            >
              <ImageHelper
                source={{ uri: avatar || '' }}
                renderErrorImage={renderErrorImage}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <CText h5 w500 color={colors.c101828} numberOfLines={2}>
                {name || ''}
              </CText>
            </View>
          </Row>
        </View>
      </Pressable>
    );
  };

  const _renderLoadMoreFooter = () => {
    return !finalLoad && !onEndReachedCalledDuringMomentum ? (
      <View
        style={[
          screenStyles.centerWrap,
          { paddingBottom: ifIphoneX(20, 10), paddingTop: 5 },
        ]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    ) : null;
  };

  const renderContent = () => {
    if (firstRender) {
      return <CLoading />;
    }
    return (
      <FlatList
        contentContainerStyle={[screenStyles.flexGrowBottom, screenStyles.pH12]}
        data={listChannel}
        extraData={listChannel}
        keyExtractor={keyExtractor}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false} //dont change true get leak memory
        ListEmptyComponent={<CEmptyData />}
        scrollEventThrottle={isIOS ? 160 : 16}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          setOnEndReachedCalledDuringMomentum(false);
        }}
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        scrollsToTop={false}
        ListFooterComponent={_renderLoadMoreFooter}
      />
    );
  };

  return (
    <Wrapper>
      {/* <ImageHeader /> */}
      <CHeader
        leftComponentOnPress={goBack}
        rightComponentDisable
        isBorderBottom
        title={t('expert.mySpecialistPage')}
      />
      {renderContent()}
    </Wrapper>
  );
};

export default MySpecialistScreen;
