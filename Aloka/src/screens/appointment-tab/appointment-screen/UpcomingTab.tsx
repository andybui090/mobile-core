import { APILoading } from '@/components';
import { keyExtractor, screenStyles } from '@/configs';
import { PAGINATION } from '@/constants';
import { AppContext } from '@/contexts';
// import {appStateStatus} from '@/redux/slices/globalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CLoading, Container, EmptyBooking } from '@/utils';
import { isIOS } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl } from 'react-native';
import { statusAppoinment } from '.';
import BookingItem from './BookingItem';
import ConfirmModal from './ConfirmModal';
// import EmptyBooking from './EmptyBooking';
import {
  getUpcomingBooking,
  putCancelBooking,
  putCompleteBooking,
  putRejectBooking,
  putStatusBooking,
  resetHistoryBooking,
  updateLocalBookingStatus,
} from '@/redux/slices/bookingSlice';

const useStyles = makeStyles(({ colors }) => ({}));

const UpcomingTab = ({
  navigation,
  refreshIdx,
  onChatNurse,
  onContactSupport,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { user } = useContext(AppContext);

  const {
    upcomingBookingData,
    completeBooking,
    localBooking,
    cancelBooking,
    rejectBooking,
    statusBooking,
  } = useAppSelector(state => state.bookingReducer);

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
    status: '',
    onCancel: () => {},
    onConfirm: () => {},
    confirmText: t('common.ok', 'OK'),
  });

  const callAPIBookingConfirm = (_offset: number) => {
    const param: any = {
      limit: PAGINATION.ITEMS_10,
      offset: _offset,
      fq: 'type:OFFLINE',
      fqin: 'status:CONFIRMED,ON_THE_WAY,ARRIVED',
      // sort: '-created_at',
      sort: 'date',
    };
    dispatch(getUpcomingBooking(param));
  };

  useEffect(() => {
    if (refreshIdx == 0) {
      setOffset(0);
      setRefreshing(true);
      callAPIBookingConfirm(0);
    }
  }, [refreshIdx]);

  useEffect(() => {
    const initFirstData = () => {
      callAPIBookingConfirm(0);
    };
    initFirstData();
  }, []);

  useEffect(() => {
    const processLocalBooking = () => {
      // console.log("🚀 ~ processLocalBooking ~ localBooking:", localBooking)
      if (localBooking && localBooking.status === statusAppoinment.CONFIRMED) {
        setOffset(0);
        callAPIBookingConfirm(0);
        // dispatch(appStateStatus({localBooking: null}));
        dispatch(updateLocalBookingStatus({ localBooking: null }));
      }
    };
    processLocalBooking();
  }, [localBooking]);

  // Lọc chỉ lấy item có đủ thông tin user và doctor
  const filterList = (arr: any[]) =>
    arr.filter(item => item?.user && item?.doctor);

  useEffect(() => {
    const processAPIUpcomingBooking = () => {
      const { loading, data, error } = upcomingBookingData;
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
    processAPIUpcomingBooking();
  }, [upcomingBookingData]);

  useEffect(() => {
    const processCompleteBooking = () => {
      const { loading, data, error } = completeBooking;
      if (!loading) {
        if (data) {
          setIsLoadingAPI(false);
          setShowAlert(false);
          if (data.status === 'success') {
            // Cap nhat lai danh sach booking
            if (modalConfirm.bookingId) {
              const arrClone = listData.filter(
                item => item.id !== modalConfirm.bookingId,
              );
              setListData(arrClone);
              setModalConfirm({ ...modalConfirm, bookingId: null });
              dispatch(
                updateLocalBookingStatus({
                  status: statusAppoinment.COMPLETED,
                }),
              );
            }
          }
          dispatch(resetHistoryBooking(null));
        } else if (error) {
          setIsLoadingAPI(false);
          setShowAlert(false);
          dispatch(resetHistoryBooking(null));
        }
      }
    };
    processCompleteBooking();
  }, [completeBooking]);

  useEffect(() => {
    const processCancelBooking = () => {
      const { loading, data, error } = cancelBooking;
      if (!loading) {
        if (data) {
          if (data.status === 'success') {
            // Cap nhat lai danh sach booking
            if (modalConfirm.bookingId) {
              // console.log("🚀 ~ processCancelBooking ~ modalConfirm.bookingId:", modalConfirm.bookingId);
              const arrClone = listData.filter(
                item => item.id !== modalConfirm.bookingId,
              );
              setListData(arrClone);
              setModalConfirm({ ...modalConfirm, bookingId: null });
              dispatch(
                updateLocalBookingStatus({ status: statusAppoinment.CANCELED }),
              );
            }
          }
          setIsLoadingAPI(false);
          setShowAlert(false);
          dispatch(resetHistoryBooking(null));
        } else if (error) {
          setIsLoadingAPI(false);
          setShowAlert(false);
          dispatch(resetHistoryBooking(null));
        }
      }
    };
    processCancelBooking();
  }, [cancelBooking]);

  useEffect(() => {
    const processRejectBooking = () => {
      const { loading, data, error } = rejectBooking;
      if (!loading) {
        if (data) {
          // Cap nhat lai danh sach booking
          setIsLoadingAPI(false);
          setShowAlert(false);
          if (data.status === 'success') {
            // Cap nhat lai danh sach booking
            if (modalConfirm.bookingId) {
              const arrClone = listData.filter(
                item => item.id !== modalConfirm.bookingId,
              );
              setListData(arrClone);
              setModalConfirm({ ...modalConfirm, bookingId: null });
              dispatch(
                updateLocalBookingStatus({ status: statusAppoinment.REJECTED }),
              );
            }
          }
          dispatch(resetHistoryBooking(null));
        } else if (error) {
          setIsLoadingAPI(false);
          setShowAlert(false);
          dispatch(resetHistoryBooking(null));
        }
      }
    };
    processRejectBooking();
  }, [rejectBooking]);

  useEffect(() => {
    const processUpdateStatusBooking = () => {
      const { loading, data, error } = statusBooking;
      if (!loading) {
        if (data) {
          setIsLoadingAPI(false);
          setShowAlert(false);
          console.log('🚀 ~ processUpdateStatusBooking ~ data:', data);
          if (data.status === 'success') {
            // Cap nhat lai danh sach booking, cap nhat lai trang thai cho id == modalConfirm.bookingId
            if (modalConfirm.bookingId && modalConfirm.status) {
              const updatedList = listData.map(item =>
                item.id === modalConfirm.bookingId
                  ? { ...item, status: modalConfirm.status }
                  : item,
              );
              setListData(updatedList);
              setModalConfirm({
                ...modalConfirm,
                bookingId: null,
              });
              dispatch(
                updateLocalBookingStatus({
                  bookingId: modalConfirm.bookingId,
                  status: modalConfirm.status,
                }),
              );
            }
          }
          dispatch(resetHistoryBooking(null));
        } else if (error) {
          console.log('🚀 ~ processUpdateStatusBooking ~ error:', error);
          setIsLoadingAPI(false);
          setShowAlert(false);
          dispatch(resetHistoryBooking(null));
        }
      }
    };
    processUpdateStatusBooking();
  }, [statusBooking]);

  //ACTION
  const handleConfirmCompleteBooking = (bookingId: any) => {
    setModalConfirm({
      isVisible: false,
      message: '',
      bookingId,
      status: '',
      onCancel: () => {},
      onConfirm: () => {},
      confirmText: t('common.ok', 'OK'),
    });
    setTimeout(() => {
      setShowAlert(true);
      setIsLoadingAPI(true);
    }, 250);
    setTimeout(() => {
      const data = {
        id: bookingId,
        status: statusAppoinment.COMPLETED,
      };
      dispatch(putCompleteBooking(data));
    }, 500);
  };

  const handleComplete = (bookingId: any) => {
    // Chi cho bac si hoan thanh cuoc hen, goi them api tru luot cho nay
    if (!bookingId) return;
    setModalConfirm({
      isVisible: true,
      message: t(
        'booking.requestComplete',
        'Are you sure you want to mark this appointment as completed?',
      ),
      bookingId,
      status: '',
      confirmText: t('common.ok', 'OK'),
      onCancel: () =>
        setModalConfirm({
          isVisible: false,
          message: '',
          bookingId: null,
          status: '',
          onCancel: () => {},
          onConfirm: () => {},
          confirmText: t('common.ok', 'OK'),
        }),
      onConfirm: () => handleConfirmCompleteBooking(bookingId),
    });
  };

  const onRefresh = React.useCallback(() => {
    setOffset(0);
    setRefreshing(true);
    callAPIBookingConfirm(0);
  }, [refreshing]);

  const handleLoadMore = () => {
    if (!finalLoad && !onEndReached) {
      const newOffset = _offset + PAGINATION.ITEMS_10;
      setOffset(newOffset);
      callAPIBookingConfirm(newOffset);
    }
  };

  const handleConfirmRejectBooking = (bookingId: any) => {
    setModalConfirm({
      isVisible: false,
      message: '',
      bookingId,
      status: '',
      onCancel: () => {},
      onConfirm: () => {},
      confirmText: t('common.ok', 'OK'),
    });
    setTimeout(() => {
      setShowAlert(true);
      setIsLoadingAPI(true);
    }, 250);
    setTimeout(() => {
      const data = {
        id: bookingId,
        status: statusAppoinment.REJECTED,
      };
      dispatch(putRejectBooking(data));
    }, 500);
  };

  const handleConfirmCancelBooking = (bookingId: any) => {
    setModalConfirm({
      isVisible: false,
      message: '',
      bookingId,
      status: '',
      onCancel: () => {},
      onConfirm: () => {},
      confirmText: t('common.ok', 'OK'),
    });
    setTimeout(() => {
      setShowAlert(true);
      setIsLoadingAPI(true);
    }, 250);
    setTimeout(() => {
      const data = {
        id: bookingId,
        status: statusAppoinment.CANCELED,
      };
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
      status: '',
      confirmText: t('common.ok', 'OK'),
      onCancel: () =>
        setModalConfirm({
          isVisible: false,
          message: '',
          bookingId: null,
          status: '',
          onCancel: () => {},
          onConfirm: () => {},
          confirmText: t('common.ok', 'OK'),
        }),
      onConfirm: isViewByDoctor
        ? () => handleConfirmRejectBooking(bookingId)
        : () => handleConfirmCancelBooking(bookingId),
    });
  };

  const handleConfirmGotoLocation = (bookingId: any) => {
    setModalConfirm({
      isVisible: false,
      message: '',
      bookingId,
      status: statusAppoinment.ON_THE_WAY,
      onCancel: () => {},
      onConfirm: () => {},
      confirmText: t('common.ok', 'OK'),
    });
    setTimeout(() => {
      setShowAlert(true);
      setIsLoadingAPI(true);
    }, 250);
    setTimeout(() => {
      const data = {
        id: bookingId,
        status: statusAppoinment.ON_THE_WAY,
      };
      dispatch(putStatusBooking(data));
    }, 500);
  };

  const handleConfirmGoEndLocation = (bookingId: any) => {
    setModalConfirm({
      isVisible: false,
      message: '',
      bookingId,
      status: statusAppoinment.ARRIVED,
      onCancel: () => {},
      onConfirm: () => {},
      confirmText: t('common.ok', 'OK'),
    });
    setTimeout(() => {
      setShowAlert(true);
      setIsLoadingAPI(true);
    }, 250);
    setTimeout(() => {
      const data = {
        id: bookingId,
        status: statusAppoinment.ARRIVED,
      };
      dispatch(putStatusBooking(data));
    }, 500);
  };

  const handleGotoLocation = (bookingId: any) => {
    if (!bookingId) return;
    setModalConfirm({
      isVisible: true,
      message: t(
        'booking.goToAppointmentConfirm',
        'Thao tác này sẽ đánh dấu trạng thái của bạn là "Đang di chuyển đến điểm hẹn“.',
      ),
      bookingId,
      status: statusAppoinment.ON_THE_WAY,
      confirmText: t('common.ok', 'OK'),
      onCancel: () =>
        setModalConfirm({
          isVisible: false,
          message: '',
          bookingId: null,
          status: '',
          onCancel: () => {},
          onConfirm: () => {},
          confirmText: t('common.ok', 'OK'),
        }),
      onConfirm: () => handleConfirmGotoLocation(bookingId),
    });
  };

  const handleGoEndLocation = (bookingId: any) => {
    if (!bookingId) return;
    setModalConfirm({
      isVisible: true,
      message: t(
        'booking.goEndAppointmentConfirm',
        'Thao tác này sẽ đánh dấu trạng thái của bạn là “Đã đến điểm hẹn“',
      ),
      bookingId,
      status: statusAppoinment.ARRIVED,
      confirmText: t('common.ok', 'OK'),
      onCancel: () =>
        setModalConfirm({
          isVisible: false,
          message: '',
          bookingId: null,
          status: '',
          onCancel: () => {},
          onConfirm: () => {},
          confirmText: t('common.ok', 'OK'),
        }),
      onConfirm: () => handleConfirmGoEndLocation(bookingId),
    });
  };

  // RENDER
  const renderItem = ({ item }: any) => {
    return (
      <BookingItem
        item={item}
        user={user}
        onCompleteRoom={() => handleComplete(item.id)}
        onCancelBooking={handleCancelBooking}
        onChatNurse={onChatNurse}
        onGoToLocation={handleGotoLocation}
        onGoEnd={handleGoEndLocation}
        onContactSupport={onContactSupport}
      />
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
          onMomentumScrollBegin={() => {
            setOnEndReached(false);
          }}
          onEndReached={handleLoadMore}
        />
        {showAlert ? (
          <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
        ) : null}
        <ConfirmModal
          visible={modalConfirm.isVisible}
          message={modalConfirm.message}
          onCancel={modalConfirm.onCancel}
          onConfirm={modalConfirm.onConfirm}
          confirmText={modalConfirm.confirmText}
        />
      </Container>
    );
  }
};

export default UpcomingTab;
