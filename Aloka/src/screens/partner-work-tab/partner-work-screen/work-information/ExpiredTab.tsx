import {
  APILoading,
  IconType,
  IconX,
  ImageHelper,
  ModalAgreeForm,
} from '@/components';
import {
  formatISOToVietnameseDate,
  formatTimeRangeWithDurationFromISO,
  images,
  keyExtractor,
  logError,
  screenStyles,
} from '@/configs';
import { PAGINATION } from '@/constants';
import { AppContext } from '@/contexts';
import i18n from '@/i18n';
// import { appStateStatus } from '@/redux/slices/globalSlice';
import {
  getExpiredBooking,
  putCancelBooking,
  resetHistoryBooking,
  updateLocalBookingStatus,
} from '@/redux/slices/bookingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CLoading, Container, CText, EmptyBooking, Row } from '@/utils';
import { Divider, isIOS, ScreenWidth } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, RefreshControl, View } from 'react-native';
import { STATUS_COLORS, statusAppoinment } from '.';
import ConfirmModal from './ConfirmModal';
// import EmptyBooking from './EmptyBooking';

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
    paddingVertical: 8,
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

// Chi show dich vu carely, type offline
const ExpiredTab = ({ refreshIdx, onChatNurse, onContactSupport }: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { user } = useContext(AppContext);

  const { dataExpiredBooking, localBooking, cancelBooking } = useAppSelector(
    state => state.bookingReducer,
  );

  const [listData, setListData] = useState<any[]>([]);
  const [_offset, setOffset] = useState<number>(0);
  const [finalLoad, setFinalLoad] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);
  const [firstRender, setFirstRender] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const [modalConfirm, setModalConfirm] = React.useState({
    isVisible: false,
    message: '',
    bookingId: null,
    onCancel: () => {},
    onConfirm: () => {},
  });

  const callAPIExpiredBooking = (_offset: number) => {
    const param: any = {
      limit: PAGINATION.ITEMS_10,
      offset: _offset,
      fq: 'status:EXPIRED,type:OFFLINE',
      sort: 'date',
    };
    // console.log('🚀 ~ callAPIExpiredBooking ~ param:', param);
    dispatch(getExpiredBooking(param));
  };

  useEffect(() => {
    const initFirstData = () => {
      callAPIExpiredBooking(0);
    };
    initFirstData();
  }, []);

  useEffect(() => {
    if (refreshIdx == 4) {
      setOffset(0);
      setRefreshing(true);
      callAPIExpiredBooking(0);
    }
  }, [refreshIdx]);

  useEffect(() => {
    const processLocalBooking = () => {
      if (
        localBooking &&
        (localBooking.status === statusAppoinment.CANCELED ||
          localBooking.status === statusAppoinment.REJECTED)
      ) {
        setOffset(0);
        callAPIExpiredBooking(0);
        // dispatch(appStateStatus({localBooking: null}));
      }
    };
    processLocalBooking();
  }, [localBooking]);

  // Lọc chỉ lấy item có đủ thông tin user và doctor
  const filterList = (arr: any[]) =>
    arr.filter(item => item?.user && item?.doctor);

  useEffect(() => {
    const processAPIExpiredBooking = () => {
      const { loading, data, error } = dataExpiredBooking;
      if (!loading) {
        if (data) {
          console.log('🚀 ~ processAPIExpiredBooking ~ data:', data);
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
    processAPIExpiredBooking();
  }, [dataExpiredBooking]);

  const [agreePopup, setAgreePopup] = useState({
    isShow: false,
    title: '',
    msg: '',
  });

  const showAgreeForm = (title: string, msg: string) => {
    setAgreePopup({
      isShow: true,
      title,
      msg,
    });
  };

  useEffect(() => {
    const processCancelBooking = () => {
      const { loading, data, error } = cancelBooking;
      if (!loading) {
        if (data) {
          if (data.status === 'success') {
            // Cap nhat lai danh sach booking
            if (modalConfirm.bookingId) {
              const arrClone = listData.filter(
                item => item.id !== modalConfirm.bookingId,
              );
              setListData(arrClone);
              setModalConfirm({ ...modalConfirm, bookingId: null });
              dispatch(
                updateLocalBookingStatus({ status: statusAppoinment.CANCELED }),
              );
            }

            const r = data?.result?.refund_result;
            if (!r) {
              setIsLoadingAPI(false);
              setShowAlert(false);
              dispatch(resetHistoryBooking(null));
              showAgreeForm(
                t('booking.cancelRefund', 'Huỷ lịch/Hoàn tiền'),
                t('booking.cancelSuccess', 'Hủy lịch thành công'),
              );
              return;
            }
            const isSuccess =
              r.resultCode == '0' || r.vnp_ResponseCode === '00';
            showAgreeForm(
              t('booking.cancelRefund', 'Huỷ lịch/Hoàn tiền'),
              isSuccess
                ? t(
                    'booking.refundSuccess',
                    'Hoàn tiền thành công! Số tiền sẽ được hoàn về tài khoản của bạn trong vòng 7 - 14 ngày làm việc.',
                  )
                : t(
                    'booking.refundFailed',
                    'Yêu cầu hoàn tiền của bạn đã bị từ chối. Vui lòng liên hệ bộ phận chăm sóc khách hàng để được hỗ trợ',
                  ),
            );
          }
          setIsLoadingAPI(false);
          setShowAlert(false);
          dispatch(resetHistoryBooking(null));
        } else if (error) {
          console.log('🚀 ~ processCancelBooking ~ error:', error);
          showAgreeForm(
            t('booking.cancelRefund', 'Huỷ lịch/Hoàn tiền'),
            logError(error),
          );
          setIsLoadingAPI(false);
          setShowAlert(false);
          dispatch(resetHistoryBooking(null));
        }
      }
    };
    processCancelBooking();
  }, [cancelBooking]);

  //ACTION
  const onRefresh = React.useCallback(() => {
    setOffset(0);
    setRefreshing(true);
    callAPIExpiredBooking(0);
  }, [refreshing]);

  const handleLoadMore = () => {
    if (!finalLoad && !onEndReached) {
      const newOffset = _offset + PAGINATION.ITEMS_10;
      setOffset(newOffset);
      callAPIExpiredBooking(newOffset);
    }
  };

  const handleConfirmCancelBooking = (bookingId: any) => {
    console.log('🚀 ~ handleConfirmCancelBooking ~ bookingId:', bookingId);
    setModalConfirm({
      isVisible: false,
      message: '',
      bookingId,
      onCancel: () => {},
      onConfirm: () => {},
    });
    setTimeout(() => {
      setShowAlert(true);
      setIsLoadingAPI(true);
    }, 250);
    setTimeout(() => {
      const data = {
        id: bookingId,
        status: statusAppoinment.CANCELED,
        isExpired: 1, // bo sung de bo qua buoc rang buoc 12h
      };
      console.log('🚀 ~ handleConfirmCancelBooking ~ data:', data);
      dispatch(putCancelBooking(data));
    }, 500);
  };

  const handleCancelBooking = (bookingId: any, isViewByDoctor: boolean) => {
    if (!bookingId) return;
    setModalConfirm({
      isVisible: true,
      message: t(
        'booking.requestCancel',
        'Are you sure you want to cancel this appointment?',
      ),
      bookingId,
      onCancel: () =>
        setModalConfirm({
          isVisible: false,
          message: '',
          bookingId: null,
          onCancel: () => {},
          onConfirm: () => {},
        }),
      onConfirm: () => handleConfirmCancelBooking(bookingId),
    });
  };

  // RENDER
  const renderErrorImage = (isOffline: boolean) => {
    return (
      <Image
        source={
          isOffline ? images.bottomTab.carely : images.bottomTab.drnetwork
        }
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  const renderItem = ({ item }: any) => {
    // if (!item.user || !item.doctor) return null;
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
    // console.log("🚀 ~ renderItem ~ item:", item);
    const isViewByDoctor = doctor_id == user.id;
    // console.log("🚀 ~ BookingItem ~ date:", date)
    const dateShow = formatISOToVietnameseDate(
      date,
      i18n.language === 'vi' ? 'vi' : 'en',
      t,
    );
    const timeShow1 =
      formatTimeRangeWithDurationFromISO(date, duration || 0) || '';
    const showChat =
      !isViewByDoctor && doctor?.id && packageInfo?.id && item?.id;
    const isOffline = type === 'OFFLINE';
    const consultationLabel = isOffline
      ? t('carely.service', 'Dịch vụ')
      : t('booking.call11', 'Gọi online');
    return (
      <View style={styles.card}>
        <View style={styles.page1TopWrap}>
          <View style={styles.topWrap}>
            {/* Top */}
            <Row start style={[{ alignItems: 'flex-start' }]}>
              <View style={styles.thumn}>
                <ImageHelper
                  source={{ uri: packageInfo?.thumbnail || '' }}
                  renderErrorImage={() => renderErrorImage(isOffline)}
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
                <CText
                  h6
                  w500
                  color={colors.c667085}
                  style={[screenStyles.mT2, { flexShrink: 1 }]}
                  numberOfLines={2}
                >
                  {consultationLabel}
                </CText>
                <Row start>
                  <CText
                    h56
                    color={STATUS_COLORS.request}
                    style={screenStyles.mT5}
                  >
                    {t('booking.expired', 'Expired')}
                  </CText>
                </Row>
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
                    {!isOffline
                      ? t('profile.chatNow', 'Chat now')
                      : t('carely.contactNurse', 'Liên hệ điều dưỡng')}
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
            {!isViewByDoctor ? (
              <View style={screenStyles.pV12}>
                <Row end>
                  {isOffline ? (
                    <Pressable
                      style={[
                        styles.btnBasic,
                        {
                          backgroundColor: colors.white,
                          borderWidth: 1,
                          borderColor: colors.c19A2A7,
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}
                      onPress={onContactSupport}
                    >
                      <IconX
                        type={IconType.MATERIAL_ICONS}
                        name={'support-agent'}
                        size={16}
                        color={colors.c19A2A7}
                      />
                      <CText
                        h56
                        w500
                        color={colors.c19A2A7}
                        style={screenStyles.mL5}
                      >
                        {t('appointment.contactSupport', 'Liên hệ CSKH')}
                      </CText>
                    </Pressable>
                  ) : null}
                  <Pressable
                    style={[
                      styles.btnBasic,
                      {
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.cF04438,
                        flex: 1,
                        marginLeft: isOffline ? 12 : 0,
                      },
                    ]}
                    onPress={() => handleCancelBooking(id, isViewByDoctor)}
                  >
                    <CText h56 w500 color={colors.cF04438}>
                      {isOffline
                        ? t('booking.cancelRefund', 'Huỷ lịch/Hoàn tiền')
                        : t('booking.cancel')}
                    </CText>
                  </Pressable>
                </Row>
              </View>
            ) : (
              <View style={screenStyles.pV8} />
            )}
          </View>
        </View>
      </View>
    );
  };

  if (firstRender) {
    return <CLoading />;
  } else {
    return (
      <Container>
        <FlatList
          contentContainerStyle={[screenStyles.flexGrowBottom]}
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
        />
        <ConfirmModal
          visible={modalConfirm.isVisible}
          message={modalConfirm.message}
          onCancel={modalConfirm.onCancel}
          onConfirm={modalConfirm.onConfirm}
        />
        <ModalAgreeForm
          visible={agreePopup.isShow}
          msg={agreePopup.msg}
          title={agreePopup.title}
          onClose={() =>
            setAgreePopup({
              isShow: false,
              title: '',
              msg: '',
            })
          }
        />
        {showAlert ? (
          <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
        ) : null}
      </Container>
    );
  }
};

export default ExpiredTab;
