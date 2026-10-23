import {
  CHeader,
  IconType,
  IconX,
  ImageHelper,
  Toast,
  Wrapper,
} from '@/components';
import CSearchBarCarelyFilter from '@/components/CSearchBarCarelyFilter';
import {
  calculateDistance,
  formatMoneyVND,
  images,
  isEmptyObj,
  isIOS,
  keyExtractor,
  parsePricePackage,
  removeExtraSpaces,
  ScreenHeight,
  screenStyles,
  ScreenWidth,
} from '@/configs';
import { PAGINATION, STORAGEKEY } from '@/constants';
import { homeTabRoute, mainRoute } from '@/constants/route_key';
import { getCarelySearchServices } from '@/redux/slices/carelySlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { getObjectData, removeValue, storeObjectData } from '@/storages';
import { CEmptyData, CScrollView, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  LayoutAnimation,
  Pressable,
  RefreshControl,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import { Rating } from 'react-native-ratings';
import FilterDropdownV2 from './FilterDropdownV2';
import { ServiceLoading } from './ServiceLoading';
import { AppContext } from '@/contexts';

const SearchServiceScreen: React.FC<any> = ({ navigation, route }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const styles = useStyles();
  const toastEl = useRef(null);

  const dispatch = useAppDispatch();

  const { carelySearchData } = useAppSelector(state => state.carelyReducer);
  const { currentLocation } = useContext(AppContext);

  //PROPS & STATE

  const [searchValue, setSearchValue] = useState<string>('');
  const [isSubmitSearch, setIsSubmitSearch] = useState(false);
  const [isApplyFilter, setIsApplyFilter] = useState<boolean>(false);

  const [searchHistory, setSearchHistory] = useState<any>([]);
  const [sizeHistory, setSizeHistory] = useState<number>(PAGINATION.ITEMS_3);

  const [loadingServicesSearch, setLoadingServicesSearch] = useState(false);
  const [listServicesSearch, setListServiceSearch] = useState<any[]>([]);
  const [offsetSearch, setOffsetSearch] = useState(0);
  const [onEndReachedSearch, setOnEndReachedSearch] = useState(true);
  const [finalLoadSearch, setFinalLoadSearch] = useState(false);
  const [refreshingSearch, setRefreshingSearch] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const [filters, setFilters] = useState<any>(null);

  useEffect(() => {
    if (showFilter) {
      Animated.timing(animatedHeight, {
        toValue: ScreenHeight * 0.6,
        duration: 350,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      }).start();
    }
  }, [showFilter]);

  useEffect(() => {
    const initHistorySearchData = async () => {
      const searchH = await getObjectData(STORAGEKEY.SEARCH_HISTORY_CARELY);
      if (searchH) {
        setSearchHistory(searchH);
      }
      if (isIOS) {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
      }
    };
    initHistorySearchData();
  }, []);

  useEffect(() => {
    const processAPIListSearchService = () => {
      const { loading, data, error } = carelySearchData;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          // console.log('🚀 ~ processAPIListSearchService ~ newItems:', newItems[1], offsetSearch);
          if (offsetSearch === 0) {
            setListServiceSearch(newItems);
          } else {
            setListServiceSearch([...listServicesSearch, ...newItems]);
          }
          setFinalLoadSearch(newItems.length < PAGINATION.ITEMS_20);
          setRefreshingSearch(false);
          setLoadingServicesSearch(false);
        } else if (error) {
          setRefreshingSearch(false);
          setLoadingServicesSearch(false);
        }
      }
    };
    processAPIListSearchService();
  }, [carelySearchData]);

  // ACTION
  const callAPICarelyServicesSearch = (
    _offset: number = 0,
    searchTxt: string = '',
    filters: any = null,
  ) => {
    const keyword = searchTxt.trim();
    let params: any = {
      limit: PAGINATION.ITEMS_20,
      offset: _offset,
      fq: `status:1,is_deleted:0,is_book_service:1`,
      fqnot: 'parent_id:0',
      s: `${keyword}|name`,
    };
    if (filters) {
      const { sortBy, lat, lng, rating } = filters;
      if (sortBy) {
        params.sort_by = sortBy;
        if (sortBy === 'distance') {
          params.lat = lat;
          params.lng = lng;
        }
      }
      if (rating) {
        params.rating = rating;
      }
    }
    console.log('🚀 ~ callAPICarelyServicesSearch ~ param:', params);
    dispatch(getCarelySearchServices(params));
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    if (searchValue.trim() != '') {
      let time = moment().unix();
      let objectSave = {
        searchTime: time,
        value: searchValue,
      };
      //them vao dau mang
      let arrClone = [...searchHistory];
      arrClone.unshift(objectSave);
      setSearchHistory(arrClone);
      storeObjectData(STORAGEKEY.SEARCH_HISTORY_CARELY, arrClone);
      setIsSubmitSearch(true);
      setLoadingServicesSearch(true);
      //dispatch search here
      setOffsetSearch(0);
      callAPICarelyServicesSearch(0, searchValue, filters);
    }
  };

  const onChangeTextSearch = (value: string) => {
    const valueParse = removeExtraSpaces(value);
    setSearchValue(valueParse);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setIsSubmitSearch(false);
  };

  const handleClearHistorySearch = () => {
    setSearchHistory([]);
    removeValue(STORAGEKEY.SEARCH_HISTORY_CARELY);
  };

  const handleSearchFromHistory = (value: string) => {
    Keyboard.dismiss();
    setSearchValue(value);
    setIsSubmitSearch(true);
    setLoadingServicesSearch(true);
    //dispatch search here
    setOffsetSearch(0);
    callAPICarelyServicesSearch(0, value, filters);
  };

  const deleteItemSearchHistory = (idx: number) => {
    let arrClone = [...searchHistory];
    arrClone.splice(idx, 1);
    storeObjectData(STORAGEKEY.SEARCH_HISTORY_CARELY, arrClone);
    setSearchHistory(arrClone);
  };

  const handleViewMore = () => {
    LayoutAnimation.easeInEaseOut();
    setSizeHistory(searchHistory.length);
  };

  const handleFilterPress = () => {
    Keyboard.dismiss();
    setShowFilter(v => !v);
  };

  const handleViewDetail = (item: any) => {
    navigation.navigate(mainRoute.serviceDetailScreen, {
      service: item,
    });
  };

  const onRefresh = React.useCallback(() => {
    setOffsetSearch(0);
    setRefreshingSearch(true);
    callAPICarelyServicesSearch(0, searchValue, filters);
  }, [searchValue, filters]);

  const handleLoadMore = () => {
    if (!finalLoadSearch && !onEndReachedSearch) {
      const newOffset = offsetSearch + PAGINATION.ITEMS_20;
      setOffsetSearch(newOffset);
      callAPICarelyServicesSearch(newOffset, searchValue, filters);
    }
  };

  const handleOpenNearbyFacilities = () => {
    navigation.navigate(homeTabRoute.nearbyFacilitiesScreen);
  };

  //RENDER
  const renderSearch = () => {
    return (
      <View style={[screenStyles.pH14, screenStyles.pV12]}>
        <CSearchBarCarelyFilter
          value={searchValue}
          placeholder={t('search.searchAndDiscover', 'Search & discover')}
          onChangeText={onChangeTextSearch}
          onClear={handleClearSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          onFilterPress={handleFilterPress}
          isApplyFilter={isApplyFilter}
        />
      </View>
    );
  };

  const renderHistorySearch = (item: any, idx: number) => {
    if (idx < sizeHistory) {
      const { value } = item;
      return (
        <Row
          key={idx + 'History'}
          between
          style={[screenStyles.pH16, screenStyles.pV8]}
        >
          <Pressable
            style={[screenStyles.rowStart, screenStyles.flex1]}
            onPress={() => handleSearchFromHistory(value)}
          >
            <IconX
              type={IconType.MATERIAL_ICONS}
              name="access-time"
              size={20}
              color={colors.c98A2B3}
            />
            <CText h5 w500 style={screenStyles.mL5} color={colors.c101828}>
              {value}
            </CText>
          </Pressable>
          <Pressable
            onPress={() => deleteItemSearchHistory(idx)}
            hitSlop={screenStyles.hitSlop20}
          >
            <IconX
              type={IconType.MATERIAL_ICONS}
              name="close"
              size={22}
              color={colors.c667085}
            />
          </Pressable>
        </Row>
      );
    }
    return (
      <Pressable
        key={idx + 'History'}
        style={screenStyles.rowCenter}
        hitSlop={screenStyles.hitSlop20}
        onPress={handleViewMore}
      >
        <CText h5 w500 color={colors.c98A2B3} style={screenStyles.mR5}>
          {t('video.more', 'View more')}
        </CText>
        <IconX
          type={IconType.IONICONS}
          name={'chevron-down'}
          color={colors.c98A2B3}
          size={16}
          style={screenStyles.mT2}
        />
      </Pressable>
    );
  };

  const renderSearchNear = () => {
    if (searchHistory.length > 0) {
      return (
        <>
          <Row
            between
            style={[screenStyles.pH16, screenStyles.pV8, screenStyles.mT10]}
          >
            <CText color={colors.black} h5 w600>
              {t('search.recentSearches', 'Recent searches')}
            </CText>
            {sizeHistory == searchHistory.length ? (
              <Pressable onPress={handleClearHistorySearch}>
                <CText h5 w400 color={colors.error}>
                  {t('search.deleteAll', 'Xoá tất cả')}
                </CText>
              </Pressable>
            ) : (
              <View />
            )}
          </Row>
          {searchHistory.slice(0, sizeHistory + 1).map(renderHistorySearch)}
        </>
      );
    }
  };

  const renderViewSearch = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: 'white',
        }}
      >
        <CScrollView contentContainerStyle={screenStyles.flexGrowBottom}>
          {searchValue.trim() == '' && renderSearchNear()}
        </CScrollView>
      </View>
    );
  };

  const renderErrorImage = () => {
    return (
      <Image
        source={images.bottomTab.carely}
        style={{ width: '80%', height: '80%' }}
        resizeMode="contain"
      />
    );
  };

  const ServiceCard = ({ item }: any) => {
    const {
      name,
      price,
      discount,
      thumbnail,
      avg_value,
      total_ratings,
      distance,
      latitude,
      longitude,
    } = item;
    const priceFormat = parsePricePackage(price, discount);
    const numRating = avg_value ? avg_value : 0;
    const totalRating = total_ratings ? total_ratings : 0;
    const distanceKm = distance
      ? distance
      : calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          latitude,
          longitude,
        );
    return (
      <Pressable style={styles.card} onPress={() => handleViewDetail(item)}>
        <View style={styles.image}>
          <ImageHelper
            source={{ uri: thumbnail }}
            renderErrorImage={renderErrorImage}
          />
        </View>
        <View style={styles.content}>
          <CText w500 h5 numberOfLines={2} color={colors.c101828}>
            {name || ''}
          </CText>
          {numRating > 0 && (
            <Row start style={screenStyles.mT3}>
              <Rating
                startingValue={5}
                readonly
                showRating={false}
                imageSize={14}
                jumpValue={0.5}
                ratingColor={'#FDB022'}
                ratingCount={1}
              />
              <CText style={screenStyles.mL5} color={'#FDB022'} h56>
                {numRating || 0}
              </CText>
              <CText style={screenStyles.mL5} color={colors.cEAECF0} h56 w500>
                {'|'}
              </CText>
              <CText color={'#374151'} h56 style={screenStyles.mL5}>
                {`${t('course.review', 'Review')} (${totalRating})`}
              </CText>
            </Row>
          )}
          {distanceKm != null && distanceKm > 0 && (
            <Row start style={screenStyles.mT3}>
              <CText color={'#374151'} h56>
                {`${distanceKm}km`}
              </CText>
            </Row>
          )}
          <View style={screenStyles.mT3}>
            {priceFormat.discountPrice > 0 ? (
              <Row start style={{ flex: 1, flexWrap: 'wrap' }}>
                <CText
                  color={'#999'}
                  h5
                  w400
                  style={{ textDecorationLine: 'line-through' }}
                >
                  {`${formatMoneyVND(priceFormat.rootPrice, '.')}`}
                </CText>
                <CText h4 w600 color={'#ff3b30'} style={[screenStyles.mL5]}>
                  {`${formatMoneyVND(priceFormat.discountPrice, '.')}`}
                </CText>
              </Row>
            ) : (
              <Row start style={{ flex: 1, flexWrap: 'wrap' }}>
                <CText h4 w600 color={'#ff3b30'}>
                  {`${formatMoneyVND(priceFormat.rootPrice, '.')}`}
                </CText>
              </Row>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const renderSearchResult = () => {
    if (loadingServicesSearch) {
      return <ServiceLoading />;
    } else {
      return (
        <FlatList
          contentContainerStyle={[
            screenStyles.flexGrowBottom,
            screenStyles.pH12,
          ]}
          data={listServicesSearch}
          extraData={listServicesSearch}
          keyExtractor={keyExtractor}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <ServiceCard item={item} />}
          scrollEventThrottle={isIOS ? 160 : 16}
          ListEmptyComponent={<CEmptyData />}
          refreshControl={
            <RefreshControl
              refreshing={refreshingSearch}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            setOnEndReachedSearch(false);
          }}
          onEndReached={handleLoadMore}
        />
      );
    }
  };

  const renderContent = () => {
    return (
      <View style={{ flex: 1 }}>
        {/* CONTENT */}
        {searchValue.trim() == '' && !isApplyFilter && renderViewSearch()}
        {(isSubmitSearch || isApplyFilter) && renderSearchResult()}

        {/* OVERLAY */}
        {showFilter && (
          <Pressable
            style={styles.overlay}
            onPress={() => setShowFilter(false)}
          />
        )}

        {/* FILTER PANEL */}
        {showFilter && (
          <Animated.View
            style={[styles.filterWrapper, { height: animatedHeight }]}
          >
            <FilterDropdownV2
              onApply={(filters: any) => {
                setShowFilter(false);
                setOffsetSearch(0);
                setLoadingServicesSearch(true);
                setFilters(filters);
                if (!isEmptyObj(filters)) {
                  setIsApplyFilter(true);
                } else {
                  setIsApplyFilter(false);
                }
                callAPICarelyServicesSearch(0, searchValue, filters);
              }}
              onClose={() => setShowFilter(false)}
              filters={filters}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  const renderFacilities = () => {
    return (
      <Pressable
        style={styles.nearByWrapper}
        onPress={handleOpenNearbyFacilities}
      >
        <Row start>
          <View style={styles.locationWrapper}>
            <IconX
              type="ionicons"
              name={'location'}
              size={20}
              color="#0D9488"
            />
          </View>
          <View style={[screenStyles.flex1, screenStyles.mL10]}>
            <CText h56 w600 color="#0F766E">
              {t('search.findHealthcare', 'Find healthcare facilities nearby?')}
            </CText>
            <CText h6 color="#115E59" style={screenStyles.mT5}>
              {t('search.discoverPartnerNear', 'Discover partner hospitals and clinics near you.')}
            </CText>
          </View>
        </Row>
      </Pressable>
    );
  };

  return (
    <Wrapper>
      <CHeader
        isBorderBottom={true}
        title={t('search.searchAndDiscover', 'Search & discover')}
        rightComponentDisable
        leftComponentOnPress={navigation.goBack}
      />
      <Divider color={'#F7F7F7'} width={6} />
      {renderSearch()}
      {renderFacilities()}
      {renderContent()}
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    paddingBottom: 8,
  },
  image: {
    width: '100%' as const,
    height: ScreenWidth / 2,
    borderRadius: 10,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
  },
  content: {
    paddingVertical: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff3b30',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  filterWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end' as const, // 👈 panel từ dưới lên
    zIndex: 20,
  },
  nearByWrapper: {
    backgroundColor: '#F0FDFA',
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  locationWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    ...screenStyles.centerWrap,
  },
}));

export default SearchServiceScreen;
