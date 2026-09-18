import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { IconX, ImageHelper, hideLoading, showLoading } from '@/components';
import { formatMoneyVND } from '@/configs/common';
import { images } from '@/configs/image';
import { PAGINATION, STORAGEKEY } from '@/constants';
import { AppContext } from '@/contexts';
import { getObjectData } from '@/storages';
import ApiService, { getApiErrorMessage, isApiSuccess } from '@/services/api-base';
import socketService from '@/socketio';
import { navigate2 } from '@/navigation/RootNavigation';
import { CText } from '@/utils';
import {
  CompleteReviewModal,
  ConfirmCancelModal,
  CskhModal,
} from '../components';

export enum StatusAppointment {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ON_THE_WAY = 'ON_THE_WAY',
  ARRIVED = 'ARRIVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

export const STATUS_COLORS = {
  completed: '#28A745',
  cancel: '#F87171',
  reject: '#DC2626',
  upcoming: '#0D6EFD',
  request: '#F59E0B',
};

const TABS = [
  {
    key: 'upcoming',
    title: 'Sắp tới',
    fq: 'type:OFFLINE',
    fqin: 'status:CONFIRMED,ON_THE_WAY,ARRIVED',
    sort: 'date',
  },
  {
    key: 'request',
    title: 'Yêu cầu',
    fq: 'status:PENDING,type:OFFLINE',
    sort: 'date',
  },
  {
    key: 'completed',
    title: 'Đã hoàn thành',
    fq: 'status:COMPLETED,type:OFFLINE',
    sort: '-date',
  },
  {
    key: 'canceled',
    title: 'Hủy',
    fq: 'status:CANCELED,type:OFFLINE',
    sort: '-date',
  },
];

const pad2 = (n: number) => n.toString().padStart(2, '0');

const formatISOToVietnameseDate = (isoString: any, lang = 'vi') => {
  if (!isoString) return '--/--/----';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return '--/--/----';
  }
  const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const labels = [
    'Chủ nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ];

  const dayName = labels[vnDate.getDay()];
  const dd = vnDate.getDate().toString().padStart(2, '0');
  const mm = (vnDate.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = vnDate.getFullYear();
  if (lang === 'vi') {
    return `${dayName}, Ngày ${dd}/${mm}/${yyyy}`;
  }
  return `${dayName}, ${dd}/${mm}/${yyyy}`;
};

const formatTimeRangeWithDurationFromISO = (
  isoString: any,
  durationMinutes: number,
) => {
  if (!isoString) return '';

  const start = new Date(isoString);

  if (isNaN(start.getTime())) return '';

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const format24hWithPeriod = (date: Date) => {
    const hh = pad2(date.getHours());
    const mm = pad2(date.getMinutes());
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${hh}:${mm} ${period}`;
  };

  return `${format24hWithPeriod(start)} \u2013 ${format24hWithPeriod(end)}`;
};

interface TabData {
  items: any[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  finalLoad: boolean;
  offset: number;
  hasLoaded: boolean;
}

const initialTabsData: Record<number, TabData> = {
  0: { items: [], loading: true, refreshing: false, loadingMore: false, finalLoad: false, offset: 0, hasLoaded: false },
  1: { items: [], loading: true, refreshing: false, loadingMore: false, finalLoad: false, offset: 0, hasLoaded: false },
  2: { items: [], loading: true, refreshing: false, loadingMore: false, finalLoad: false, offset: 0, hasLoaded: false },
  3: { items: [], loading: true, refreshing: false, loadingMore: false, finalLoad: false, offset: 0, hasLoaded: false },
};

const AppointmentScreen: React.FC<any> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width: screenWidth } = useWindowDimensions();

  const { user, isDoctor, isNurse } = useContext<any>(AppContext) || {};
  const currentUserId = user?.id || user?._id || user?.user_id;

  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    route.params?.idxTab || 0,
  );

  const [tabsData, setTabsData] = useState<Record<number, TabData>>(initialTabsData);
  const isLoadingTabRef = useRef<Record<number, boolean>>({});
  const pagerRef = useRef<any>(null);

  // Modals state
  const [showCskhModal, setShowCskhModal] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedCancelItem, setSelectedCancelItem] = useState<any>(null);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedCompleteItem, setSelectedCompleteItem] = useState<any>(null);
  const [selectedCompleteIndex, setSelectedCompleteIndex] = useState<number>(0);
  const [confirmedCompletedIds, setConfirmedCompletedIds] = useState<
    Record<string, boolean>
  >({});
  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  const isFocusScreen = useIsFocused();

  // ----------------------------------------------------
  // API LOGIC (Per Tab Cache - Không reload khi đổi tab)
  // ----------------------------------------------------
  const fetchTabAppointments = async (
    targetTab: number,
    offset: number,
    isRefresh = false,
  ) => {
    if (isLoadingTabRef.current[targetTab] && !isRefresh) return;
    isLoadingTabRef.current[targetTab] = true;

    setTabsData(prev => {
      const current = prev[targetTab] || { ...initialTabsData[targetTab] };
      return {
        ...prev,
        [targetTab]: {
          ...current,
          loading: offset === 0 && !isRefresh && !current.hasLoaded,
          refreshing: isRefresh,
          loadingMore: offset > 0,
        },
      };
    });

    try {
      let header = ApiService.getAuthorizationHeader();
      if (!header || header === 'Bearer ' || header === 'Bearer undefined') {
        const jwtToken: any = await getObjectData(STORAGEKEY.JWT_TOKEN);
        const token = jwtToken?.access_token || jwtToken?.accessToken;
        if (token) {
          ApiService.setAuthorizationHeader(token);
        }
      }

      const activeTab = TABS[targetTab];
      const param: any = {
        limit: PAGINATION.ITEMS_20 || 20,
        offset,
        fq: activeTab.fq,
        sort: (activeTab as any).sort || 'date',
      };
      if ((activeTab as any).fqin) {
        param.fqin = (activeTab as any).fqin;
      }

      let res: any = await ApiService.getHistoryBookings(param);

      if (!res?.ok && res?.status === 401) {
        const jwtToken: any = await getObjectData(STORAGEKEY.JWT_TOKEN);
        const token = jwtToken?.access_token || jwtToken?.accessToken;
        if (token) {
          ApiService.setAuthorizationHeader(token);
          res = await ApiService.getHistoryBookings(param);
        }
      }

      if (res?.ok) {
        let items: any[] = res?.data?.items || [];

        const isEnd = items.length < (PAGINATION.ITEMS_20 || 20);

        setTabsData(prev => {
          const current = prev[targetTab] || { ...initialTabsData[targetTab] };
          return {
            ...prev,
            [targetTab]: {
              ...current,
              items: offset === 0 ? items : [...current.items, ...items],
              finalLoad: isEnd,
              offset,
              hasLoaded: true,
              loading: false,
              refreshing: false,
              loadingMore: false,
            },
          };
        });
      } else {
        console.log(`fetchAppointments tab ${targetTab} error status:`, res?.status, res?.problem);
        setTabsData(prev => {
          const current = prev[targetTab] || { ...initialTabsData[targetTab] };
          return {
            ...prev,
            [targetTab]: {
              ...current,
              hasLoaded: false,
              loading: false,
              refreshing: false,
              loadingMore: false,
            },
          };
        });
      }
    } catch (error) {
      console.log(`fetchAppointments tab ${targetTab} error:`, error);
      setTabsData(prev => {
        const current = prev[targetTab] || { ...initialTabsData[targetTab] };
        return {
          ...prev,
          [targetTab]: {
            ...current,
            hasLoaded: false,
            loading: false,
            refreshing: false,
            loadingMore: false,
          },
        };
      });
    } finally {
      isLoadingTabRef.current[targetTab] = false;
    }
  };

  useEffect(() => {
    if (isFocusScreen) {
      hideLoading(true);
      // Tải song song tất cả các tab chưa có data (giống DoctorNetwork lazy={false})
      TABS.forEach((_, idx) => {
        if (!tabsData[idx]?.hasLoaded && !isLoadingTabRef.current[idx]) {
          fetchTabAppointments(idx, 0);
        }
      });
    }
  }, [isFocusScreen]);

  useEffect(() => {
    if (typeof route.params?.idxTab === 'number') {
      handleTabPress(route.params.idxTab);
    }
  }, [route.params?.idxTab]);

  const onRefresh = (targetTab: number) => {
    fetchTabAppointments(targetTab, 0, true);
  };

  const handleLoadMore = (targetTab: number) => {
    const current = tabsData[targetTab];
    if (
      !current ||
      current.finalLoad ||
      isLoadingTabRef.current[targetTab] ||
      current.loading ||
      current.refreshing ||
      current.loadingMore
    )
      return;
    const nextOffset = (current.offset || 0) + (PAGINATION.ITEMS_20 || 20);
    fetchTabAppointments(targetTab, nextOffset);
  };

  const handleTabPress = (idx: number) => {
    setActiveTabIndex(idx);
    pagerRef.current?.scrollTo({ x: idx * screenWidth, animated: true });
    if (!tabsData[idx]?.hasLoaded) {
      fetchTabAppointments(idx, 0);
    }
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    if (newIndex >= 0 && newIndex < TABS.length && newIndex !== activeTabIndex) {
      setActiveTabIndex(newIndex);
      if (!tabsData[newIndex]?.hasLoaded) {
        fetchTabAppointments(newIndex, 0);
      }
    }
  };

  const handleUpdateStatus = async (
    item: any,
    newStatus: StatusAppointment,
    successMsg?: string,
  ) => {
    showLoading();
    try {
      const id = item?.id || item?._id;
      const res: any = await ApiService.updateBookingStatus({
        id,
        status: newStatus,
      });

      if (isApiSuccess(res)) {
        if (successMsg) {
          Alert.alert('Thành công', successMsg);
        }
        onRefresh(activeTabIndex);
        // Đánh dấu các tab khác cần reload khi được xem
        setTabsData(prev => {
          const updated = { ...prev };
          TABS.forEach((_, tIdx) => {
            if (tIdx !== activeTabIndex && updated[tIdx]) {
              updated[tIdx] = { ...updated[tIdx], hasLoaded: false };
            }
          });
          return updated;
        });
      } else {
        const err = getApiErrorMessage(res, 'Không thể cập nhật trạng thái');
        Alert.alert('Thông báo', err);
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      hideLoading();
    }
  };

  const handleCancelBooking = (item: any) => {
    setSelectedCancelItem(item);
    setConfirmModalVisible(true);
  };

  const handleConfirmCancelAction = () => {
    setConfirmModalVisible(false);
    if (selectedCancelItem) {
      handleUpdateStatus(
        selectedCancelItem,
        StatusAppointment.CANCELED,
        'Đã hủy lịch hẹn thành công',
      );
      setSelectedCancelItem(null);
    }
  };

  const handleOpenCompleteModal = (item: any, index: number) => {
    setSelectedCompleteItem(item);
    setSelectedCompleteIndex(index);
    setCompleteModalVisible(true);
  };

  const getProviderNameForComplete = (item: any) => {
    if (!item) return 'Điều dưỡng';
    const doctor = item?.doctor || item?.partner || {};
    const nurse = item?.nurse || {};
    const rawName =
      doctor?.full_name ||
      doctor?.name ||
      nurse?.full_name ||
      nurse?.name ||
      item?.doctor_name ||
      item?.nurse_name ||
      '';

    if (!rawName) return 'Điều dưỡng';
    const lower = rawName.toLowerCase();
    if (
      lower.startsWith('điều dưỡng') ||
      lower.startsWith('bác sĩ') ||
      lower.startsWith('bs.')
    ) {
      return rawName;
    }
    const title =
      doctor?.title || (item?.type === 'ONLINE' ? 'Bác sĩ' : 'Điều dưỡng');
    return `${title} ${rawName}`;
  };

  const handleSkipCompleteReview = () => {
    setCompleteModalVisible(false);
  };

  const handleAcceptCompleteReview = () => {
    const itemToReview = selectedCompleteItem;
    const indexToReview = selectedCompleteIndex;
    setCompleteModalVisible(false);
    if (itemToReview) {
      handleReview(itemToReview, indexToReview);
    }
  };

  const handleReview = (item: any, index: number) => {
    navigation.navigate('CarelyReviewScreen', {
      service: item,
      onReviewSuccess: () => {
        const itemId = String(item?.id || item?._id || index);
        setConfirmedCompletedIds(prev => ({ ...prev, [itemId]: true }));
        fetchTabAppointments(2, 0, true);
      },
    });
  };

  // Doctor/Partner Action Handlers (giống Doctor Network)
  const handleGoToLocation = (item: any) => {
    Alert.alert(
      'Xác nhận di chuyển',
      'Thao tác này sẽ đánh dấu trạng thái của bạn là "Đang di chuyển đến điểm hẹn".',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: () =>
            handleUpdateStatus(
              item,
              StatusAppointment.ON_THE_WAY,
              'Đang di chuyển đến điểm hẹn',
            ),
        },
      ],
    );
  };

  const handleConfirmArrival = (item: any) => {
    Alert.alert(
      'Xác nhận đến điểm hẹn',
      'Xác nhận bạn đã đến điểm hẹn?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: () =>
            handleUpdateStatus(
              item,
              StatusAppointment.ARRIVED,
              'Đã xác nhận đến điểm hẹn',
            ),
        },
      ],
    );
  };

  const handleDoctorComplete = (item: any) => {
    Alert.alert(
      'Xác nhận hoàn thành',
      'Đánh dấu lịch hẹn này đã hoàn thành dịch vụ?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: () =>
            handleUpdateStatus(
              item,
              StatusAppointment.COMPLETED,
              'Đã hoàn thành lịch hẹn',
            ),
        },
      ],
    );
  };

  const handleAcceptBooking = (item: any) => {
    Alert.alert(
      'Tiếp nhận yêu cầu',
      'Bạn có muốn tiếp nhận yêu cầu đặt lịch này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Tiếp nhận',
          onPress: () =>
            handleUpdateStatus(
              item,
              StatusAppointment.CONFIRMED,
              'Đã tiếp nhận yêu cầu thành công',
            ),
        },
      ],
    );
  };

  const handleRejectBooking = (item: any) => {
    Alert.alert(
      'Từ chối yêu cầu',
      'Bạn có chắc chắn muốn từ chối yêu cầu đặt lịch này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Từ chối',
          style: 'destructive',
          onPress: () =>
            handleUpdateStatus(
              item,
              StatusAppointment.REJECTED,
              'Đã từ chối yêu cầu đặt lịch',
            ),
        },
      ],
    );
  };

  const handleChatPartner = async (item: any) => {
    const isDoctor =
      currentUserId &&
      (String(item?.doctor_id) === String(currentUserId) ||
        String(item?.doctor?.id) === String(currentUserId));

    const targetPerson = isDoctor
      ? item?.user || item?.customer || {}
      : item?.doctor || item?.partner || {};

    const targetName =
      targetPerson.full_name ||
      targetPerson.name ||
      (isDoctor ? 'Khách hàng' : 'Điều dưỡng');

    const targetId =
      targetPerson.id ||
      targetPerson._id ||
      (isDoctor ? item?.user_id || item?.customer_id : item?.doctor_id);

    const targetAvatar = targetPerson.avatar;

    const packageInfo = item?.package || {};
    const packageId = packageInfo?.id || packageInfo?._id || item?.package_id;
    const orderId = item?.id || item?._id;

    if (chatLoadingId) return;
    const currentLoadingKey = String(orderId || targetId || Date.now());
    setChatLoadingId(currentLoadingKey);

    try {
      // 1. Gọi Socket IO tạo hoặc join room 1-1 giống logic mobile-doctor-app
      const room = await socketService.createRoom1vs1(
        targetName,
        String(targetId || ''),
        targetAvatar,
        {
          media: 'text',
          is_premium: 1,
          is_chat: 1,
          package_id: packageId,
          order_id: orderId,
        },
      );

      const roomId = room?.id || room?.room_id;

      // 2. Chuẩn bị params đầy đủ cho ChatScreen
      const chatParams = {
        roomId,
        name: targetName,
        customerName: targetName,
        avatar: targetAvatar,
        customerAvatar: targetAvatar,
        toUserId: targetId,
        packageId,
        orderId,
        item: {
          id: roomId,
          room_id: roomId,
          title: targetName,
          thumbnail: targetAvatar,
          to: targetId,
          package_id: packageId,
          order_id: orderId,
          media: 'text',
        },
      };

      // 3. Điều hướng an toàn: ưu tiên local navigator, fallback sang RootNavigation
      try {
        navigation.navigate('BookingChat', chatParams);
      } catch {
        navigate2('BookingChat', chatParams);
      }
    } catch (error) {
      console.warn('handleChatPartner error:', error);
      const fallbackParams = {
        name: targetName,
        customerName: targetName,
        avatar: targetAvatar,
        customerAvatar: targetAvatar,
        toUserId: targetId,
        packageId,
        orderId,
      };
      try {
        navigation.navigate('BookingChat', fallbackParams);
      } catch {
        navigate2('BookingChat', fallbackParams);
      }
    } finally {
      setChatLoadingId(null);
    }
  };

  const handleReschedule = async (item: any) => {

    console.log("🚀 ---------------------------------------------------🚀");
    console.log("🚀 ~ index.tsx:663 ~ handleReschedule ~ item:", item);
    console.log("🚀 ---------------------------------------------------🚀");

    showLoading();
    try {
      const packageInfo = item?.package || {};
      const packageId = packageInfo?.id || packageInfo?._id || item?.package_id;
      const channelId =
        item?.channel_id ||
        item?.doctor?.channel_id ||
        item?.doctor?.id ||
        packageInfo?.channel_id;

      // Chuẩn bị dữ liệu dịch vụ từ API item
      let serviceData: any = {
        ...packageInfo,
        ...item,
        id: packageId || item?.package_id || item?.id,
        name: packageInfo?.name || item?.name || item?.package_name,
        price: packageInfo?.price ?? item?.price ?? 0,
        thumbnail: packageInfo?.thumbnail || item?.thumbnail,
        doctor: item?.doctor,
        channel: item?.doctor || item?.channel,
        address: item?.address,
      };

      // Lấy chi tiết gói mới nhất từ API để đảm bảo không bị thiếu thông tin
      if (packageId) {
        try {
          const res: any = await ApiService.getCarelyServices({
            fq: `id:${packageId}`,
          });
          const found =
            res?.data?.items?.[0] ||
            res?.data?.result?.items?.[0] ||
            (Array.isArray(res?.data) ? res.data[0] : null);
          if (found) {
            serviceData = {
              ...serviceData,
              ...found,
              doctor: found.doctor || item?.doctor,
              channel: found.channel || item?.doctor,
            };
          }
        } catch (e) {
          console.log('Error fetching package detail for reschedule:', e);
        }
      }

      if (packageInfo || packageId) {
        try {
          navigation.navigate('CarelyServiceDetailScreen', {
            channelId,
            packageId,
            service: serviceData,
          });
          return;
        } catch (e) {
          console.log('navigate to CarelyServiceDetailScreen error:', e);
        }
      }

      if (navigation.canGoBack()) {
        navigation.navigate('HomeTab');
      } else {
        navigation.navigate('HomeTab');
      }
    } finally {
      hideLoading();
    }
  };

  const handleFindService = () => {
    if (navigation.canGoBack()) {
      navigation.navigate('HomeTab');
    } else {
      navigation.navigate('HomeTab');
    }
  };

  // ----------------------------------------------------
  // UI RENDER (Aloka UI)
  // ----------------------------------------------------
  const renderCard = (
    { item, index }: { item: any; index: number },
    tabIdx: number = activeTabIndex,
  ) => {
    const currentTab = tabIdx;
    const doctor = item?.doctor;
    const customer = item?.user;
    const packageInfo = item?.package;

    // Kiểm tra type / vai trò của người xem: Bác sĩ / Điều dưỡng vs Khách hàng (giống Doctor Network)
    const userTypeStr = (
      user?.personalization?.type ||
      user?.type ||
      ''
    ).toLowerCase();

    const isDoctorAccount =
      Boolean(isDoctor || isNurse) ||
      (userTypeStr && userTypeStr !== 'user' && userTypeStr !== 'normal');

    const isMatchDoctorId = Boolean(
      currentUserId &&
      (String(item?.doctor_id) === String(currentUserId) ||
        String(doctor?.id) === String(currentUserId) ||
        String(doctor?._id) === String(currentUserId)),
    );

    const isMatchUserId = Boolean(
      currentUserId &&
      (String(customer?.id) === String(currentUserId) ||
        String(customer?._id) === String(currentUserId) ||
        String(item?.user_id) === String(currentUserId)),
    );

    // Nếu ID trùng với doctor_id -> Xem với vai trò Bác sĩ/Điều dưỡng
    // Nếu ID trùng với user_id -> Xem với vai trò Khách hàng
    // Nếu không khớp rõ -> Dựa vào loại tài khoản người dùng
    const isViewByDoctor = isMatchDoctorId
      ? true
      : isMatchUserId
        ? false
        : Boolean(isDoctorAccount);

    // Tên hiển thị: Nếu là Bác sĩ -> hiện tên Khách hàng; Nếu là Khách hàng -> hiện tên Bác sĩ/Điều dưỡng
    const nurseOrDoctorName = isViewByDoctor
      ? (customer?.full_name || customer?.name || customer?.username || '')
      : (doctor?.full_name || doctor?.name || '');

    // Kiểm tra loại lịch hẹn (OFFLINE dịch vụ điều dưỡng vs ONLINE tư vấn)
    const appointmentType = String(item?.type || '').toUpperCase();
    const isOffline = appointmentType !== 'ONLINE';
    const chatButtonLabel = isOffline ? 'Liên hệ điều dưỡng' : 'Chat now';

    const serviceTitle = packageInfo?.name || item?.name || '';

    const serviceImage = packageInfo?.thumbnail
      ? { uri: packageInfo.thumbnail }
      : (item?.thumbnail ? { uri: item.thumbnail } : images.common.img_default);

    const dateFormatted = formatISOToVietnameseDate(item?.date);
    const duration = Number(item?.duration || 0);
    const timeFormatted = formatTimeRangeWithDurationFromISO(item?.date, duration);
    const addressText = item?.address || '---';
    const noteText = item?.note || '---';

    const isCompletedTab = currentTab === 2;
    const itemId = String(item?.id || item?._id || index);

    // Kiểm tra trạng thái hoàn thành từ dữ liệu API:
    // Thẻ đã xác nhận hoàn thành hoặc đã đánh giá -> hiện nút Đặt lịch lại
    const isExplicitRebook =
      item?.is_rebook === true ||
      item?.type === 'completed_rebook' ||
      confirmedCompletedIds[itemId] === true ||
      item?.is_confirmed_complete === true ||
      item?.is_confirmed === true ||
      item?.is_confirmed === 1 ||
      item?.user_confirmed === 1 ||
      item?.user_confirmed === true ||
      Boolean(item?.is_rating) ||
      Boolean(item?.is_rated) ||
      Boolean(item?.rated) ||
      Boolean(item?.rating_id) ||
      Boolean(item?.order?.is_rating) ||
      Boolean(item?.order?.rated) ||
      (typeof item?.rating === 'number' && item?.rating > 0) ||
      (typeof item?.rate === 'number' && item?.rate > 0) ||
      (typeof item?.order?.rating === 'number' && item?.order?.rating > 0);

    const isPendingConfirm = !isExplicitRebook;

    // Dòng "Liên hệ điều dưỡng" (chỉ hiện cho User, ẩn khi là Bác sĩ và ẩn ở card rebook đã hoàn thành)
    const showChat =
      !isViewByDoctor &&
      Boolean(doctor?.id || doctor?._id || item?.doctor_id) &&
      Boolean(packageInfo?.id || packageInfo?._id || item?.package_id || item?.id) &&
      (!isCompletedTab || isPendingConfirm);

    const hasCardActions =
      (!isViewByDoctor &&
        (currentTab === 0 ||
          currentTab === 1 ||
          currentTab === 2 ||
          currentTab === 3)) ||
      (isViewByDoctor && (currentTab === 0 || currentTab === 1));

    return (
      <View style={styles.card}>
        <View style={styles.page1TopWrap}>
          {/* Top Section with Light Gray Background */}
          <TouchableOpacity
            style={styles.topWrap}
            activeOpacity={0.8}
            onPress={() => handleReschedule(item)}
          >
            <View style={styles.serviceHeaderRow}>
              <View style={styles.thumn}>
                <ImageHelper
                  source={serviceImage}
                  style={styles.serviceImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.serviceInfo}>
                {serviceTitle ? (
                  <CText style={styles.serviceTitle} numberOfLines={2}>
                    {serviceTitle}
                  </CText>
                ) : null}
                {nurseOrDoctorName ? (
                  <CText style={styles.nurseName} numberOfLines={2}>
                    {nurseOrDoctorName}
                  </CText>
                ) : null}
                {/* Status text */}
                {currentTab === 1 ? (
                  <View style={styles.statusRow}>
                    <CText style={styles.statusRequest}>
                      {t('bookingStatus.waitForConfirmation', 'Chờ xác nhận')}
                    </CText>
                  </View>
                ) : currentTab === 0 ? (
                  <View style={styles.statusRow}>
                    <CText style={styles.statusUpcoming}>
                      {t('bookingStatus.confirmed', 'Đã xác nhận')}
                    </CText>
                  </View>
                ) : currentTab === 3 ? (
                  <View style={styles.statusRow}>
                    <CText style={styles.statusCancel}>
                      {item?.canceled_by === item?.doctor_id
                        ? t('booking.reject', 'Từ chối')
                        : t('booking.cancel', 'Hủy')}
                    </CText>
                  </View>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>

          {/* Body Section with White Background */}
          <View style={styles.bodyWrap}>
            {/* 1. Liên hệ điều dưỡng */}
            {showChat && (
              <>
                <TouchableOpacity
                  style={styles.actionLinkRow}
                  activeOpacity={0.7}
                  onPress={() => handleChatPartner(item)}
                  disabled={Boolean(chatLoadingId)}
                >
                  {chatLoadingId === String(item?.id || item?._id || item?.doctor_id) ? (
                    <ActivityIndicator size="small" color="#14B8A6" />
                  ) : (
                    <IconX
                      type="ionicons"
                      name="chatbubble-ellipses-outline"
                      size={18}
                      color="#14B8A6"
                    />
                  )}
                  <CText style={styles.actionLinkText}>{chatButtonLabel}</CText>
                </TouchableOpacity>
                <View style={styles.divider} />
              </>
            )}

            {/* 2. Lời nhắn/Ghi chú */}
            <View style={styles.noteRow}>
              <IconX
                type="ionicons"
                name="create-outline"
                size={16}
                color="#101828"
              />
              <CText style={styles.noteText}>
                {`${t('package.consultationNote', 'Lời nhắn/Ghi chú')}: ${noteText}`}
              </CText>
            </View>

            <View style={styles.divider} />

            {/* 3. Metadata: Ngày, Giờ, Địa chỉ */}
            <View style={styles.metaContainer}>
              {dateFormatted ? (
                <View style={styles.metaRow}>
                  <IconX
                    type="ionicons"
                    name="calendar-outline"
                    size={16}
                    color="#1D2939"
                  />
                  <CText style={styles.metaText}>{dateFormatted}</CText>
                </View>
              ) : null}
              {timeFormatted ? (
                <View style={styles.metaRow}>
                  <IconX
                    type="ionicons"
                    name="time-outline"
                    size={16}
                    color="#1D2939"
                  />
                  <CText style={styles.metaText}>{timeFormatted}</CText>
                </View>
              ) : null}
              <View style={[styles.metaRow, { alignItems: 'flex-start' }]}>
                <IconX
                  type="ionicons"
                  name="location-sharp"
                  size={16}
                  color="#1D2939"
                  style={{ marginTop: 2 }}
                />
                <CText style={styles.metaText} numberOfLines={2}>
                  {addressText}
                </CText>
              </View>
            </View>

            {/* Card Actions Row */}
            {hasCardActions && (
              <View style={styles.cardActionsRow}>
                {/* Tab 0: Sắp tới */}
                {currentTab === 0 &&
                  (isViewByDoctor ? (
                    // Vai trò Bác sĩ / Điều dưỡng (giống Doctor Network)
                    item?.status === StatusAppointment.CONFIRMED || !item?.status ? (
                      <TouchableOpacity
                        style={styles.doctorActionBtn}
                        activeOpacity={0.8}
                        onPress={() => handleGoToLocation(item)}
                      >
                        <IconX
                          type="ionicons"
                          name="map-outline"
                          size={16}
                          color="#FFFFFF"
                        />
                        <CText style={styles.doctorActionBtnText}>
                          {t('booking.goToAppointment', 'Đi đến điểm hẹn')}
                        </CText>
                      </TouchableOpacity>
                    ) : item?.status === StatusAppointment.ON_THE_WAY ? (
                      <TouchableOpacity
                        style={styles.doctorActionBtn}
                        activeOpacity={0.8}
                        onPress={() => handleConfirmArrival(item)}
                      >
                        <IconX
                          type="ionicons"
                          name="location-outline"
                          size={16}
                          color="#FFFFFF"
                        />
                        <CText style={styles.doctorActionBtnText}>
                          {t('booking.confirmArrival', 'Xác nhận đã đến điểm hẹn')}
                        </CText>
                      </TouchableOpacity>
                    ) : item?.status === StatusAppointment.ARRIVED ? (
                      <TouchableOpacity
                        style={styles.doctorActionBtn}
                        activeOpacity={0.8}
                        onPress={() => handleDoctorComplete(item)}
                      >
                        <IconX
                          type="ionicons"
                          name="checkmark-done"
                          size={18}
                          color="#FFFFFF"
                        />
                        <CText style={styles.doctorActionBtnText}>
                          {t('appointment.markAsComplete', 'Hoàn thành')}
                        </CText>
                      </TouchableOpacity>
                    ) : null
                  ) : (
                    // Vai trò Khách hàng
                    <>
                      <TouchableOpacity
                        style={styles.cskhBtn}
                        activeOpacity={0.7}
                        onPress={() => setShowCskhModal(true)}
                      >
                        <IconX
                          type="materialicons"
                          name="support-agent"
                          size={17}
                          color="#19A2A7"
                        />
                        <CText style={styles.cskhBtnText}>
                          {t('appointment.contactSupport', 'Liên hệ CSKH')}
                        </CText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        activeOpacity={0.7}
                        onPress={() => handleCancelBooking(item)}
                      >
                        <CText style={styles.cancelBtnText}>
                          {t('booking.cancelRefund', 'Huỷ lịch/Hoàn tiền')}
                        </CText>
                      </TouchableOpacity>
                    </>
                  ))}

                {/* Tab 1: Yêu cầu */}
                {currentTab === 1 &&
                  (isViewByDoctor ? (
                    // Vai trò Bác sĩ: 2 nút Từ chối & Tiếp nhận
                    <>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        activeOpacity={0.7}
                        onPress={() => handleRejectBooking(item)}
                      >
                        <CText style={styles.rejectBtnText}>
                          {t('booking.reject', 'Từ chối')}
                        </CText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        activeOpacity={0.8}
                        onPress={() => handleAcceptBooking(item)}
                      >
                        <CText style={styles.acceptBtnText}>
                          {t('booking.accept', 'Tiếp nhận')}
                        </CText>
                      </TouchableOpacity>
                    </>
                  ) : (
                    // Vai trò Khách hàng: 2 nút Liên hệ CSKH & Huỷ lịch/Hoàn tiền
                    <>
                      <TouchableOpacity
                        style={styles.cskhBtn}
                        activeOpacity={0.7}
                        onPress={() => setShowCskhModal(true)}
                      >
                        <IconX
                          type="materialicons"
                          name="support-agent"
                          size={17}
                          color="#19A2A7"
                        />
                        <CText style={styles.cskhBtnText}>
                          {t('appointment.contactSupport', 'Liên hệ CSKH')}
                        </CText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        activeOpacity={0.7}
                        onPress={() => handleCancelBooking(item)}
                      >
                        <CText style={styles.cancelBtnText}>
                          {t('booking.cancelRefund', 'Huỷ lịch/Hoàn tiền')}
                        </CText>
                      </TouchableOpacity>
                    </>
                  ))}

                {/* Tab 2: Đã hoàn thành */}
                {currentTab === 2 &&
                  !isViewByDoctor && (
                    <View style={styles.completedActionsWrapper}>
                      {/* Hàng 1: Đánh giá & Xác nhận hoàn thành (chỉ hiện khi chưa confirm) */}
                      {isPendingConfirm && (
                        <View style={styles.completedTopRow}>
                          <TouchableOpacity
                            style={styles.reviewBtn}
                            activeOpacity={0.7}
                            onPress={() => handleReview(item, index)}
                          >
                            <CText style={styles.reviewBtnText}>
                              {t('common.review', 'Đánh giá')}
                            </CText>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.confirmDoneBtn}
                            activeOpacity={0.8}
                            onPress={() => handleOpenCompleteModal(item, index)}
                          >
                            <CText style={styles.confirmDoneBtnText}>
                              {t('booking.confirmComplete', 'Xác nhận hoàn thành')}
                            </CText>
                          </TouchableOpacity>
                        </View>
                      )}
                      {/* Hàng 2: Đặt lịch lại full-width (luôn hiện) */}
                      <TouchableOpacity
                        style={[styles.rebookBtn, { marginTop: isPendingConfirm ? 10 : 0 }]}
                        activeOpacity={0.7}
                        onPress={() => handleReschedule(item)}
                      >
                        <CText style={styles.rebookBtnText}>
                          {t('booking.rebook', 'Đặt lịch lại')}
                        </CText>
                      </TouchableOpacity>
                    </View>
                  )}

                {/* Tab 3: Hủy */}
                {currentTab === 3 &&
                  !isViewByDoctor && (
                    <TouchableOpacity
                      style={styles.rebookBtn}
                      activeOpacity={0.7}
                      onPress={() => handleReschedule(item)}
                    >
                      <CText style={styles.rebookBtnText}>
                        {t('booking.rebook', 'Đặt lịch lại')}
                      </CText>
                    </TouchableOpacity>
                  )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyList = (tabIdx: number = activeTabIndex) => {
    const emptyMessages = [
      'Không có lịch hẹn sắp tới',
      'Không có yêu cầu đặt lịch nào đang chờ',
      'Chưa có lịch hẹn nào đã hoàn thành',
      'Chưa có lịch hẹn nào đã hủy',
    ];

    return (
      <View style={styles.emptyContainer}>
        <IconX
          type="ionicons"
          name="calendar-outline"
          size={56}
          color="#D0D5DD"
        />
        <CText style={styles.emptyText}>
          {emptyMessages[tabIdx] || 'Chưa có lịch hẹn'}
        </CText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header - Centered title without back arrow matching Image 2 */}
      <View style={styles.header}>
        <CText style={styles.headerTitle}>
          {t('profile.appoints', 'Lịch hẹn')}
        </CText>
      </View>

      {/* Tabs - Blue active indicator and text matching Image 2 */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab, idx) => {
          const isActive = activeTabIndex === idx;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleTabPress(idx)}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <CText
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab.title}
              </CText>
              {isActive && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content List Pager (TabView - Không reload khi bấm đổi tab) */}
      <View style={styles.content}>
        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          style={styles.pager}
          scrollEventThrottle={16}
        >
          {TABS.map((tab, idx) => {
            const currentTabData = tabsData[idx] || initialTabsData[idx];
            return (
              <View key={tab.key} style={{ width: screenWidth, flex: 1 }}>
                {currentTabData.loading && !currentTabData.hasLoaded ? (
                  <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color="#19A2A7" />
                  </View>
                ) : (
                  <FlatList
                    data={currentTabData.items}
                    keyExtractor={(item, index) =>
                      String(item?.id || item?._id || index)
                    }
                    renderItem={itemInfo => renderCard(itemInfo, idx)}
                    contentContainerStyle={[
                      styles.listContent,
                      currentTabData.items.length === 0 && {
                        flexGrow: 1,
                        justifyContent: 'center',
                      },
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => renderEmptyList(idx)}
                    onEndReached={() => handleLoadMore(idx)}
                    onEndReachedThreshold={0.4}
                    refreshControl={
                      <RefreshControl
                        refreshing={currentTabData.refreshing}
                        onRefresh={() => onRefresh(idx)}
                        tintColor="#19A2A7"
                        colors={['#19A2A7']}
                      />
                    }
                    ListFooterComponent={
                      currentTabData.loadingMore ? (
                        <ActivityIndicator
                          style={{ marginVertical: 14 }}
                          color="#19A2A7"
                        />
                      ) : undefined
                    }
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Pinned Bottom Button: Tìm dịch vụ mới matching Image 2 */}
      <View style={styles.bottomBarWrap}>
        <TouchableOpacity
          style={styles.findServiceBtn}
          activeOpacity={0.8}
          onPress={handleFindService}
        >
          <CText style={styles.findServiceBtnText}>
            {t('carely.findService', 'Tìm dịch vụ mới')}
          </CText>
        </TouchableOpacity>
      </View>

      {/* CSKH Contact Modal Bottom Sheet */}
      <CskhModal
        visible={showCskhModal}
        onClose={() => setShowCskhModal(false)}
      />

      {/* Confirmation Modal Cancel Booking */}
      <ConfirmCancelModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={handleConfirmCancelAction}
      />

      {/* Complete Review Bottom Sheet Modal */}
      <CompleteReviewModal
        visible={completeModalVisible}
        providerName={getProviderNameForComplete(selectedCompleteItem)}
        onClose={() => setCompleteModalVisible(false)}
        onSkip={handleSkipCompleteReview}
        onReview={handleAcceptCompleteReview}
      />
    </SafeAreaView>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    color: '#667085',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0D6EFD',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#0D6EFD',
    borderRadius: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  pager: {
    flex: 1,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FAFAFA',
  },
  page1TopWrap: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAECF0',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  topWrap: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumn: {
    width: 60,
    height: 60,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EAECF0',
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 20,
  },
  nurseName: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusRequest: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
  },
  statusUpcoming: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0D6EFD',
  },
  statusCancel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F87171',
  },
  bodyWrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  actionLinkText: {
    fontSize: 13.5,
    color: '#101828',
    fontWeight: '500',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  noteText: {
    fontSize: 13.5,
    color: '#101828',
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F7',
  },
  metaContainer: {
    paddingTop: 10,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#1D2939',
    flex: 1,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 14,
  },
  cskhBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#19A2A7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    gap: 6,
  },
  cskhBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#19A2A7',
  },
  cancelBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F04438',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#F04438',
  },
  reviewBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  reviewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  confirmDoneBtn: {
    flex: 1.25,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDoneBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completedActionsWrapper: {
    width: '100%',
  },
  completedTopRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rebookBtn: {
    width: '100%',
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#19A2A7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  rebookBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#19A2A7',
  },
  doctorActionBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#14B8A6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  rejectBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDA29B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F04438',
  },
  acceptBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomBarWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },
  findServiceBtn: {
    backgroundColor: '#19A2A7',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  findServiceBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#667085',
  },
});
