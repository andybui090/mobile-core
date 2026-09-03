import { HeaderBar, Toast, Wrapper } from '@/components';
import { images, isEmptyArray, screenStyles, ScreenWidth } from '@/configs';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  BannerLoading,
  CarelyBookings,
  CarelyServices,
  CarelyServicesSearch,
  CSearchBarTrigger,
  SlideShow,
} from './components';
import { Row, CText, Container, CScrollView } from '@/utils';
import { onLinkBanner } from './function';
import { getBanner, getUpcomingBookingHome } from '@/redux/slices/homeSlice';
import { PAGINATION } from '@/constants';
import {
  getCarelySearchServices,
  getCarelyServices,
} from '@/redux/slices/carelySlice';

const useStyles = makeStyles(() => ({
  imgBg: {
    position: 'absolute' as const,
    top: 0,
    width: ScreenWidth,
    height: (ScreenWidth / 1500) * 960,
    zIndex: 0,
  },
  tab: {
    marginRight: 10,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)', // 👈 chỉnh 0.3–0.5 tuỳ bạn
    zIndex: 10,
  },
}));

const HomeScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const toastEl = useRef<any>(null);

  const dispatch = useAppDispatch();

  const { topBannerData, upcomingBookingData } = useAppSelector(
    state => state.homeReducer,
  );

  const { carelyServiceData, carelySearchData } = useAppSelector(
    state => state.carelyReducer,
  );

  // const { dataUpcomingBookingHome } = useAppSelector(
  //   state => state.profileReducer,
  // );

  // -------------------------------
  // STATE
  // -------------------------------
  const [listTopFilter, setListTopFilter] = useState<any[]>([
    { id: 0, name: t('common.all') },
  ]);

  const [serviceFilterId, setServiceFilterId] = useState<number>(0);

  const [listBanner, setListBanner] = useState<any>([]);
  const [firstCallTopBanner, setFirstCallTopBanner] = useState(true);

  const [listServices, setListServices] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);
  const [finalLoad, setFinalLoad] = useState(false);

  const [loadingServicesSearch, setLoadingServicesSearch] =
    useState<boolean>(true);
  const [listServicesSearch, setListServiceSearch] = useState<any[]>([]);
  const [offsetSearch, setOffsetSearch] = useState(0);
  const [onEndReachedSearch, setOnEndReachedSearch] = useState(true);
  const [finalLoadSearch, setFinalLoadSearch] = useState(false);
  const [refreshingSearch, setRefreshingSearch] = useState(false);
  const [isSubmitSearch, setIsSubmitSearch] = useState(false);

  const [searchValue, setSearchValue] = useState<string>('');

  const [listUpcoming, setListUpcoming] = useState<any[]>([]);
  const [offsetUpcoming, setOffsetUpcoming] = useState(0);
  const [loadingUpcoming, setLoadingUpcoming] = useState<boolean>(true);
  const [refreshingUpcoming, setRefreshingUpcoming] = useState(false);
  const [onEndReachedUpcoming, setOnEndReachedUpcoming] = useState(true);
  const [finalLoadUpcoming, setFinalLoadUpcoming] = useState(false);

  // -------------------------------
  // EFFECT
  // -------------------------------
  const callAPICarelyServices = (_offset: number) => {
    const param: any = {
      limit: PAGINATION.ITEMS_50,
      offset: _offset,
      fq: `status:1,is_deleted:0,parent_id:0,is_book_service:1'`,
      s: '',
    };
    console.log('🚀 ~ callAPICarelyServices ~ param:', param);
    dispatch(getCarelyServices(param));
  };

  const callAPICarelyServicesSearch = (
    _offset: number,
    filterId: number = 0,
    searchTxt: string = '',
  ) => {
    const param: any = {
      limit: PAGINATION.ITEMS_50,
      offset: _offset,
      fq: `status:1,is_deleted:0,parent_id:${filterId},is_book_service:1'`,
      s: `${searchTxt}|name`,
    };
    console.log('🚀 ~ callAPICarelyServicesSearch ~ param:', param);
    dispatch(getCarelySearchServices(param));
  };

  const callAPIBookingConfirm = (_offset: number) => {
    const param: any = {
      limit: PAGINATION.ITEMS_50,
      offset: _offset,
      fq: 'status:CONFIRMED,type:OFFLINE',
      // sort: '-created_at',
      sort: 'date',
    };
    dispatch(getUpcomingBookingHome(param));
  };

  useEffect(() => {
    const initData = () => {
      if (!topBannerData.data) {
        dispatch(getBanner({ fq: 'type:banner,status:1' }));
      }
      callAPICarelyServices(0);
      callAPIBookingConfirm(0);
    };
    initData();
  }, []);

  useEffect(() => {
    const processAPITopBanner = () => {
      const { loading, data, error } = topBannerData;
      if (!loading) {
        if (data) {
          if (!isEmptyArray(data.items)) {
            let arrClone = [...data.items];
            for (let i = 0; i < data.items.length; i++) {
              if (data.items[i].status === 0) {
                arrClone.splice(i, 1);
              }
            }
            // const filteredArray = arrClone.filter(item => item.show_on_page.includes('newsfeed'));
            setListBanner(arrClone);
          }
          setFirstCallTopBanner(false);
        } else if (error) {
          setFirstCallTopBanner(false);
        }
      }
    };
    processAPITopBanner();
  }, [topBannerData]);

  useEffect(() => {
    const processAPIListService = () => {
      const { loading, data, error } = carelyServiceData;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          console.log('🚀 ~ processAPIListService ~ newItems:', newItems);
          if (offset === 0) {
            setListServices(newItems);
          } else {
            setListServices([...listServices, ...newItems]);
          }
          setListTopFilter([
            ...[{ id: 0, name: t('common.all') }],
            ...newItems,
          ]);
          setFinalLoad(newItems.length < PAGINATION.ITEMS_50);
          setLoadingServices(false);
          setRefreshing(false);
        } else if (error) {
          setLoadingServices(false);
          setRefreshing(false);
        }
      }
    };
    processAPIListService();
  }, [carelyServiceData]);

  //Filter them theo keywork search
  const filterList = (arr: any[]) => {
    const keyword = searchValue?.toLowerCase();
    return arr.filter(item => item?.name?.toLowerCase().includes(keyword));
  };

  useEffect(() => {
    const processAPIListSearchService = () => {
      const { loading, data, error } = carelySearchData;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          if (offset === 0) {
            setListServiceSearch(filterList(newItems));
          } else {
            const newArr = [...listServicesSearch, ...newItems];
            setListServiceSearch(filterList(newArr));
          }
          setFinalLoadSearch(newItems.length < PAGINATION.ITEMS_50);
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

  const filterListBook = (arr: any[]) =>
    arr.filter(item => item?.user && item?.doctor);

  useEffect(() => {
    const processAPIUpcomingBooking = () => {
      const { loading, data, error } = upcomingBookingData;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          const sizeResponse: any = newItems.length;
          const arrFilter = filterListBook(newItems);
          if (offsetUpcoming == 0) {
            setListUpcoming(arrFilter);
          } else {
            setListUpcoming([...listUpcoming, ...arrFilter]);
          }
          setFinalLoadUpcoming(sizeResponse < PAGINATION.ITEMS_50);
          setRefreshingUpcoming(false);
          setLoadingUpcoming(false);
          // dispatch(resetHistoryBooking(null));
        } else if (error) {
          setRefreshing(false);
          setLoadingUpcoming(false);
          // dispatch(resetHistoryBooking(null));
        }
      }
    };
    processAPIUpcomingBooking();
  }, [upcomingBookingData]);

  // -------------------------------
  // ACTION
  // -------------------------------

  const handlePressSearch = () => {
    // navigation.navigate(carelyHomeTabRoute.carelySearchScreen);
  };

  const handleChooseFilterService = (item: any) => {
    if (item?.id != serviceFilterId) {
      setServiceFilterId(item?.id);
      setLoadingServicesSearch(true);
      setTimeout(() => {
        callAPICarelyServicesSearch(0, item?.id, searchValue);
      }, 250);
    }
  };

  const handleLinkBanner = (item: any, idx: number) => {
    onLinkBanner(item, navigation);
  };

  const handlePressDetailService = (item: any) => {
    // navigation.navigate(mainRoute.carelyServiceDetailScreen, { service: item });
  };

  const _handleLoadMoreSearch = () => {
    if (!finalLoadSearch && !onEndReachedSearch) {
      const newOffsetSearch = offsetSearch + PAGINATION.ITEMS_50;
      setOffsetSearch(newOffsetSearch);
      callAPICarelyServicesSearch(
        newOffsetSearch,
        serviceFilterId,
        searchValue,
      );
    }
  };

  const handlePressItemService = (item: any) => {
    // navigation.navigate(carelyHomeTabRoute.carelyServiceScreen, {
    //   parentService: item,
    // });
  };

  const _handleLoadMore = () => {
    if (!finalLoad && !onEndReached) {
      const newOffset = offset + PAGINATION.ITEMS_50;
      setOffset(newOffset);
      callAPICarelyServices(newOffset);
    }
  };

  const handlePressBookingDetail = () => {
    // navigation.navigate('CarelyAppointmentTab', { idxTab: 0 });
  };

  const _handleLoadMoreUpcoming = () => {
    if (!finalLoadUpcoming && !onEndReachedUpcoming) {
      const newOffsetUpcoming = offsetUpcoming + PAGINATION.ITEMS_50;
      setOffsetUpcoming(newOffsetUpcoming);
      callAPIBookingConfirm(newOffsetUpcoming);
    }
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------
  const renderSearch = () => {
    return (
      <View style={[screenStyles.pH14, screenStyles.mT8, { zIndex: 2 }]}>
        <CSearchBarTrigger
          placeholder={t('search.searchPlaceholder', 'Search...')}
          onPress={handlePressSearch}
        />
      </View>
    );
  };

  const renderListFilter = () => {
    return (
      <Row style={screenStyles.pV12}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH10]}
        >
          {listTopFilter.map((item: any, index: number) => (
            <Pressable
              key={index}
              onPress={() => handleChooseFilterService(item)}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    serviceFilterId === item?.id
                      ? colors.primary
                      : colors.cF2F4F7,
                },
              ]}
            >
              <CText
                h5
                w400
                color={
                  serviceFilterId === item?.id ? colors.white : colors.c667085
                }
              >
                {item?.name}
              </CText>
            </Pressable>
          ))}
        </ScrollView>
      </Row>
    );
  };

  const renderTopBanner = useMemo(() => {
    if (firstCallTopBanner) {
      return <BannerLoading />;
    } else if (listBanner.length > 0) {
      return (
        <SlideShow
          DATABANNER={listBanner || []}
          onViewDetail={handleLinkBanner}
          onChangeImgIndex={() => {}}
          page={'HomeScreen'}
        />
      );
    }
  }, [firstCallTopBanner, listBanner]);

  const renderListData = () => {
    if (serviceFilterId != 0) {
      return (
        <Container>
          <CarelyServicesSearch
            listData={listServicesSearch}
            loading={loadingServicesSearch}
            onPressItem={handlePressDetailService}
            finalLoad={finalLoadSearch}
            onEndReached={onEndReachedSearch}
            setOnEndReached={setOnEndReachedSearch}
            onLoadMore={_handleLoadMoreSearch}
          />
        </Container>
      );
    } else {
      return (
        <CScrollView contentContainerStyle={screenStyles.pT8}>
          <Container>
            <CarelyServices
              listData={listServices}
              loading={loadingServices}
              onPressItem={handlePressItemService}
              finalLoad={finalLoad}
              onEndReached={onEndReached}
              setOnEndReached={setOnEndReached}
              onLoadMore={_handleLoadMore}
            />
            <CarelyBookings
              listData={listUpcoming}
              loading={loadingUpcoming}
              onPressItem={handlePressBookingDetail}
              finalLoad={finalLoadUpcoming}
              onEndReached={onEndReachedUpcoming}
              setOnEndReached={setOnEndReachedUpcoming}
              onLoadMore={_handleLoadMoreUpcoming}
            />
          </Container>
        </CScrollView>
      );
    }
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.flex1}>
        {renderSearch()}
        {renderListFilter()}
        {renderTopBanner}
        {renderListData()}
      </View>
    );
  };

  return (
    <Wrapper>
      <Image
        source={images.global.bg_header}
        style={styles.imgBg}
        resizeMode="cover"
      />
      <HeaderBar isBorderBottom />
      {renderContent()}
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

export default HomeScreen;
