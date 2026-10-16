import { IconType, IconX, ImageHelper } from '@/components';
import { images, keyExtractor, screenStyles } from '@/configs';
import { PAGINATION } from '@/constants';
import { mainRoute } from '@/constants/route_key';
import { getMyPackages, resetPackagesSlice } from '@/redux/slices/profileSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CEmptyData, CLoading, Container, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  cardWrapper: {
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
  },
}));

const PackageTab = ({ navigation, refreshIdx, isFocusScreen }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    dataMyPackages,
    // refreshPackage
  } = useAppSelector(state => state.profileReducer);

  const [firstRender, setFirstRender] = useState(true);
  const [listPackages, setListPackages] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);
  const [finalLoad, setFinalLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  //ACTION
  function getAPIListPackages(_offset: number) {
    const data = {
      offset: _offset ?? offset,
      limit: PAGINATION.ITEMS_20,
    };
    dispatch(getMyPackages(data));
  }

  // useEffect(() => {
  //   if (isFocusScreen || refreshPackage.isRefresh) {
  //     setOffset(0);
  //     getAPIListPackages(0);
  //   }
  // }, [isFocusScreen, refreshPackage]);

  // useEffect(() => {
  //   if (refreshIdx == 1) {
  //     setOffset(0);
  //     setRefreshing(true);
  //     getAPIListPackages(0);
  //   }
  // }, [refreshIdx]);

  useEffect(() => {
    setOffset(0);
    getAPIListPackages(0);
  }, []);

  // Kiem tra thong tin package phai day du
  const filterList = (arr: any[]) => arr.filter(item => item?.channel?.id);

  useEffect(() => {
    const processAPIMyPackage = () => {
      const { loading, data, error } = dataMyPackages;
      if (!loading) {
        if (data) {
          let newItems = data.items || [];
          // console.log('🚀 ~ processAPIMyPackage ~ newItems:', newItems);
          let sizeResponse = newItems.length;
          // const newArr = newItems;
          const newArr = filterList(newItems);
          if (offset === 0) {
            setListPackages(newArr);
          } else {
            setListPackages([...listPackages, ...newArr]);
          }
          setFinalLoad(sizeResponse < PAGINATION.ITEMS_20);
          setRefreshing(false);
          setFirstRender(false);
          dispatch(resetPackagesSlice(null));
        } else if (error) {
          setRefreshing(false);
          setFirstRender(false);
          dispatch(resetPackagesSlice(null));
        }
      }
    };
    processAPIMyPackage();
  }, [dataMyPackages]);

  //ACTION
  const onRefresh = React.useCallback(() => {
    setOffset(0);
    setRefreshing(true);
    getAPIListPackages(0);
  }, [refreshing]);

  const handleLoadMore = () => {
    if (!finalLoad && !onEndReachedCalledDuringMomentum) {
      const _offset = offset + PAGINATION.ITEMS_20;
      setOffset(_offset);
      getAPIListPackages(_offset);
    }
  };

  const formatDate = (expired_at: unknown) => {
    if (!expired_at || !moment(expired_at).isValid()) {
      return ''; // hoặc 'N/A'
    }
    return moment(expired_at).format('DD/MM/YYYY');
  };

  const handleViewChannelDetail = (item: any) => {
    if (item?.channel_id && item?.package_id) {
      if (item.is_book_service == 1) {
        navigation.navigate(mainRoute.serviceDetailScreen, {
          channelId: item.channel_id,
          packageId: item.package_id,
        });
      } else {
        // navigation.navigate(mainRoute.packageDetailScreen, {
        //   channelId: item.channel_id,
        //   packageId: item.package_id,
        // });
      }
    }
  };

  //RENDER
  const renderErrorImage = () => {
    return (
      <Image
        source={images.channel.channel_default}
        style={screenStyles.box36}
        resizeMode="contain"
      />
    );
  };

  const renderOption = (value: string) => {
    return (
      <Row start style={screenStyles.mT10}>
        <IconX
          name={'medical-services'}
          type={IconType.MATERIAL_ICONS}
          color={colors.c33353A}
          size={16}
        />
        <CText
          h5
          color={colors.c33353A}
          style={[screenStyles.mL5, { flexShrink: 1 }]}
        >
          {value}
        </CText>
      </Row>
    );
  };

  const _renderItem = ({ item }: any) => {
    const {
      name,
      channel_id,
      channel,
      chat_1vs1,
      is_newsfeed,
      remain_call,
      remain_chat,
      call_1vs1,
      option1,
      option2,
      option3,
      option4,
      option5,
      created_at,
      expired_at,
      is_book_service,
    } = item;
    const dateFormat =
      is_book_service == 1
        ? ''
        : `${t('package.ExpiresOn')}: ` + formatDate(expired_at);
    return (
      <Pressable
        onPress={() => handleViewChannelDetail(item)}
        style={styles.cardWrapper}
      >
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
          }}
        >
          <Image
            source={images.global.bg_package}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            accessible={false}
          />
          <Row start>
            <View
              style={[
                screenStyles.round40R,
                { borderWidth: 1, borderColor: colors.cAAAAAA },
              ]}
            >
              <ImageHelper
                source={{ uri: channel?.avatar || '' }}
                renderErrorImage={renderErrorImage}
              />
            </View>
            <View style={screenStyles.flex1}>
              <CText
                h4
                w500
                color={colors.c101828}
                numberOfLines={2}
                style={screenStyles.mL10}
              >
                {channel?.name || ''}
              </CText>
            </View>
          </Row>
          <Row start style={[screenStyles.mT10, { alignItems: 'flex-start' }]}>
            <View style={{ marginRight: 10, flex: 1 }}>
              <CText h4 w500 color={colors.c101828} numberOfLines={2}>
                {name || ''}
              </CText>
            </View>
            <CText h5 w400 color={colors.c33353A}>
              {dateFormat}
            </CText>
          </Row>
          {/* {is_book_service === 1 ? (
            <Row start style={screenStyles.mT10}>
              <IconX
                name={'health-and-safety'}
                type={IconType.MATERIAL_ICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText
                h5
                w400
                color={colors.c33353A}
                style={screenStyles.mL5}
              >{`${t(
                'package.serviceHome',
                'Dịch vụ chăm sóc sức khoẻ tại nhà',
              )}`}</CText>
            </Row>
          ) : (
            <Row start style={screenStyles.mT10}>
              <IconX
                name={'health-and-safety'}
                type={IconType.MATERIAL_ICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText
                h5
                w400
                color={colors.c33353A}
                style={screenStyles.mL5}
              >{`${t(
                'package.serviceOnline',
                'Dịch vụ tư vấn trực tuyến',
              )}`}</CText>
            </Row>
          )} */}
          {/* {is_newsfeed === 1 && (
            <Row start style={screenStyles.mT10}>
              <IconX
                name={'newspaper-outline'}
                type={IconType.IONICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText
                h5
                color={colors.c33353A}
                style={[screenStyles.mL5, { flexShrink: 1 }]}
              >{`${t('package.newsfeed')}`}</CText>
            </Row>
          )} */}
          {/* {chat_1vs1 === 1 && (
            <Row start style={[screenStyles.mT10]}>
              <IconX
                name={'chatbox-ellipses-outline'}
                type={IconType.IONICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText
                h5
                color={colors.c33353A}
                style={[screenStyles.mL5, { flexShrink: 1 }]}
              >{`${t('package.chat')}`}</CText>
              {typeof remain_chat === 'number' &&
                !isNaN(remain_chat) &&
                remain_chat >= 0 && (
                  <CText
                    h5
                    color={colors.c33353A}
                    style={[screenStyles.mL5, { flexShrink: 1 }]}
                  >
                    {remain_chat === 0
                      ? `(${t('package.noRemaining', 'Out of sessions')})`
                      : `(${t('package.remaining', { count: remain_chat })})`}
                  </CText>
                )}
            </Row>
          )} */}
          {/* {call_1vs1 === 1 && (
            <Row start style={screenStyles.mT10}>
              <IconX
                name={'call-outline'}
                type={IconType.IONICONS}
                color={colors.c33353A}
                size={16}
              />
              <CText
                h5
                color={colors.c33353A}
                style={[screenStyles.mL5, { flexShrink: 1 }]}
              >{`${t(
                'package.call1vs1',
                'Allow making private calls',
              )}`}</CText>
              {typeof remain_call === 'number' &&
                !isNaN(remain_call) &&
                remain_call >= 0 && (
                  <CText
                    h5
                    color={colors.c33353A}
                    style={[screenStyles.mL5, { flexShrink: 1 }]}
                  >
                    {remain_call === 0
                      ? `(${t('package.noRemaining', 'Out of sessions')})`
                      : `(${t('package.remaining', { count: remain_call })})`}
                  </CText>
                )}
            </Row>
          )} */}
          {option1 ? renderOption(option1) : null}
          {option2 ? renderOption(option2) : null}
          {option3 ? renderOption(option3) : null}
          {option4 ? renderOption(option4) : null}
          {option5 ? renderOption(option5) : null}
        </View>
      </Pressable>
    );
  };

  if (firstRender) {
    return <CLoading />;
  } else {
    return (
      <Container>
        <FlatList
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={[
            screenStyles.flexGrowBottom,
            screenStyles.pH12,
          ]}
          data={listPackages}
          extraData={listPackages}
          keyExtractor={keyExtractor}
          renderItem={_renderItem}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false} //dont change true get leak memory
          ListEmptyComponent={<CEmptyData />}
          scrollEventThrottle={16}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            setOnEndReachedCalledDuringMomentum(false);
          }}
          onEndReached={handleLoadMore}
          refreshControl={
            <RefreshControl
              style={{ width: '100%' }}
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          scrollsToTop={false}
        />
      </Container>
    );
  }
};

export default PackageTab;
