import { IconType, IconX, ImageHelper } from '@/components';
import {
  formatISOToVietnameseDate,
  formatTimeRangeWithDurationFromISO,
  ifIphoneX,
  images,
  keyExtractor,
  screenStyles,
} from '@/configs';
import { PAGINATION } from '@/constants';
import { AppContext } from '@/contexts';
import i18n from '@/i18n';
// import { appStateStatus } from '@/redux/slices/globalSlice';
import {
  getCompletedBooking,
  resetHistoryBooking,
} from '@/redux/slices/bookingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CLoading, Container, CText, EmptyBooking, Row } from '@/utils';
import { Divider, isIOS, ScreenWidth } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import { statusAppoinment } from '.';
// import { VideoModalReplay } from './video-replay';
import { updateLocalBookingStatus } from '@/redux/slices/bookingSlice';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    paddingHorizontal: 16,
    borderTopWidth: 6,
    borderTopColor: colors.cF2F4F7,
    paddingVertical: 12,
  },
  topWrap: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.cF9FAFB,
  },
  btnBasic: {
    borderRadius: 6,
    paddingVertical: 9,
    minWidth: ScreenWidth / 3,
    alignItems: 'center' as const,
  },
  page1TopWrap: {
    borderRadius: 8,
    borderColor: colors.cEAECF0,
    borderWidth: 1,
    overflow: 'hidden' as const,
  },
  thumn: {
    width: 60,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
  },
  bodyWrap: {
    backgroundColor: colors.white,
    ...screenStyles.pH14,
  },
}));

const CompletedTab = ({
  refreshIdx,
  onReview,
  onReschedule,
  onChatNurse,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { user } = useContext(AppContext);

  const { dataCompletedBooking, localBooking } = useAppSelector(
    state => state.bookingReducer,
  );

  const [listData, setListData] = useState<any[]>([]);
  const [_offset, setOffset] = useState<number>(0);
  const [finalLoad, setFinalLoad] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);
  const [firstRender, setFirstRender] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [videoUrlSelected, setVideoUrlSelected] = useState<any>('');
  const [isVisible, setIsVisible] = useState(false);

  const callAPICompleteBooking = (_offset: number) => {
    const param: any = {
      limit: PAGINATION.ITEMS_10,
      offset: _offset,
      fq: 'status:COMPLETED,type:OFFLINE',
      // sort: '-created_at',
      sort: 'date',
    };
    dispatch(getCompletedBooking(param));
  };

  useEffect(() => {
    const initFirstData = () => {
      callAPICompleteBooking(0);
    };
    initFirstData();
  }, []);

  useEffect(() => {
    if (refreshIdx == 2) {
      setOffset(0);
      setRefreshing(true);
      callAPICompleteBooking(0);
    }
  }, [refreshIdx]);

  // Lọc chỉ lấy item có đủ thông tin user và doctor
  const filterList = (arr: any[]) => {
    return arr.filter(item => item?.user && item?.doctor);
  };

  useEffect(() => {
    const processAPICompletedBooking = () => {
      const { loading, data, error } = dataCompletedBooking;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          const sizeResponse: any = newItems.length;
          const arrFilter = filterList(newItems);
          if (_offset == 0) {
            setListData(arrFilter);
          } else {
            setListData([...listData, ...arrFilter]);
          }
          setFinalLoad(sizeResponse < PAGINATION.ITEMS_10);
          setRefreshing(false);
          setFirstRender(false);
          dispatch(resetHistoryBooking(null));
        } else if (error) {
          setRefreshing(false);
          setFirstRender(false);
          dispatch(resetHistoryBooking(null));
        }
      }
    };
    processAPICompletedBooking();
  }, [dataCompletedBooking]);

  useEffect(() => {
    const processLocalBooking = () => {
      if (localBooking && localBooking.status === statusAppoinment.COMPLETED) {
        // Thêm booking mới vào đầu danh sách
        setOffset(0);
        callAPICompleteBooking(0);
        dispatch(updateLocalBookingStatus({ localBooking: null }));
      }
    };
    processLocalBooking();
  }, [localBooking]);

  //ACTION
  const onRefresh = React.useCallback(() => {
    setOffset(0);
    setRefreshing(true);
    callAPICompleteBooking(0);
  }, [refreshing]);

  const handleLoadMore = () => {
    if (!finalLoad && !onEndReached) {
      const newOffset = _offset + PAGINATION.ITEMS_10;
      setOffset(newOffset);
      callAPICompleteBooking(newOffset);
    }
  };

  // RENDER
  const renderErrorImage = () => {
    return (
      <Image
        source={images.bottomTab.carely}
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  const renderItem = ({ item }: any) => {
    const {
      doctor,
      date,
      doctor_id,
      user: userBooking,
      id,
      note,
      type,
      package: packageInfo,
      duration,
      address,
    } = item;
    const isViewByDoctor = doctor_id == user.id;
    const dateShow = formatISOToVietnameseDate(
      date,
      i18n.language === 'vi' ? 'vi' : 'en',
      t,
    );
    const timeShow1 =
      formatTimeRangeWithDurationFromISO(date, duration || 0) || '';
    const showChat =
      !isViewByDoctor && doctor?.id && packageInfo?.id && item?.id;
    return (
      <View style={styles.card}>
        <View style={styles.page1TopWrap}>
          <View style={styles.topWrap}>
            {/* Top */}
            <Row start style={[{ alignItems: 'flex-start' }]}>
              <View style={styles.thumn}>
                <ImageHelper
                  source={{ uri: packageInfo?.thumbnail || '' }}
                  renderErrorImage={renderErrorImage}
                  resizeMode={'cover'}
                />
              </View>
              <View style={screenStyles.mL10}>
                {packageInfo?.name?.toString().trim() && (
                  <CText h4 w500 color={colors.c1D2939}>
                    {packageInfo?.name?.toString().trim()}
                  </CText>
                )}
                <CText
                  h5
                  color={colors.c98A2B3}
                  style={[screenStyles.mT2, { flexShrink: 1 }]}
                  numberOfLines={2}
                >
                  {isViewByDoctor
                    ? userBooking.full_name || ''
                    : doctor.full_name || ''}
                </CText>
              </View>
            </Row>
          </View>
          <View style={styles.bodyWrap}>
            {/* Lien he dieu duong */}
            {showChat && (
              <Row start style={screenStyles.pV10}>
                <Pressable
                  style={screenStyles.rowCenter}
                  onPress={() => onChatNurse(item)}
                >
                  <Image
                    source={images.service.ic_chat}
                    style={screenStyles.box18}
                    resizeMode="contain"
                  />
                  <CText h5 color={colors.c101828} style={screenStyles.mL5}>
                    {t('carely.contactNurse', 'Liên hệ điều dưỡng')}
                  </CText>
                </Pressable>
              </Row>
            )}
            <Divider color={colors.cF2F4F7} width={1} />
            {/* Ghi chu */}
            <Row start style={screenStyles.pV10}>
              <Row start>
                <IconX
                  type={IconType.MATERIAL_DESIGN_ICONS}
                  name={'note-outline'}
                  size={16}
                  color={colors.c101828}
                />
                <CText h5 color={colors.c101828} style={screenStyles.mL5}>{`${t(
                  'package.consultationNote',
                )}: ${note || '---'}`}</CText>
              </Row>
            </Row>
            <Divider color={colors.cF2F4F7} width={1} />
            {/* Thoi gian, dia diem */}
            <Row start style={screenStyles.mT10}>
              <Image
                source={images.service.ic_calendar}
                style={screenStyles.box16}
                resizeMode="contain"
              />
              <CText h5 color={colors.c1D2939} style={screenStyles.mL5}>
                {dateShow}
              </CText>
            </Row>
            <Row start style={screenStyles.mT10}>
              <Image
                source={images.service.ic_clock}
                style={screenStyles.box16}
                resizeMode="contain"
              />
              <CText h5 color={colors.c1D2939} style={screenStyles.mL5}>
                {timeShow1}
              </CText>
            </Row>
            <Row
              start
              style={[
                screenStyles.mT10,
                { alignItems: 'flex-start', paddingRight: 10 },
              ]}
            >
              <Image
                source={images.service.ic_location}
                style={screenStyles.box16}
                resizeMode="contain"
              />
              <CText h5 color={colors.c1D2939} style={screenStyles.mL5}>
                {address || '---'}
              </CText>
            </Row>
            {isViewByDoctor ? (
              <View style={screenStyles.pB12} />
            ) : (
              <View style={screenStyles.pV12}>
                <Row between>
                  <Pressable
                    style={[
                      styles.btnBasic,
                      {
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.c19A2A7,
                        flex: 1,
                      },
                    ]}
                    onPress={() => onReview(item)}
                  >
                    <CText h56 w500 color={colors.c19A2A7}>
                      {t('course.courseRating', 'Đánh giá')}
                    </CText>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.btnBasic,
                      {
                        backgroundColor: colors.c19A2A7,
                        borderWidth: 1,
                        borderColor: colors.c19A2A7,
                        marginLeft: 12,
                        flex: 1,
                      },
                    ]}
                    onPress={() => onReschedule(item)}
                  >
                    <CText h56 w500 color={colors.white}>
                      {t('carely.reschedule', 'Đặt lịch lại')}
                    </CText>
                  </Pressable>
                </Row>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const _renderLoadMoreFooter = () => {
    return !finalLoad && !onEndReached ? (
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

  if (firstRender) {
    return <CLoading />;
  } else {
    return (
      <Container>
        <FlatList
          contentContainerStyle={screenStyles.flexGrowBottom}
          data={listData}
          extraData={listData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={isIOS ? 160 : 16}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={<EmptyBooking />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            setOnEndReached(false);
          }}
          onEndReached={handleLoadMore}
          ListFooterComponent={_renderLoadMoreFooter}
        />
        {/* {videoUrlSelected != "" ? (
          <VideoModalReplay
            isVisible={isVisible}
            hideModal={() => {
              setVideoUrlSelected("");
              setIsVisible(false);
            }}
            videoUrl={videoUrlSelected}
          />
        ) : null} */}
      </Container>
    );
  }
};

export default CompletedTab;
