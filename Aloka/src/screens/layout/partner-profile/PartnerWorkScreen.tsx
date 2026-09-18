import React, { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { IconX, Wrapper, hideLoading, showLoading } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import { PAGINATION, STORAGEKEY, rootRoute } from '@/constants';
import { getObjectData } from '@/storages';
import ApiService, { getApiErrorMessage, isApiSuccess } from '@/services/api-base';
import socketService from '@/socketio';
import {
  MainTab,
  RejectJobModal,
  REJECT_REASONS,
  SubStatus,
  WorkChatTab,
  WorkInfoTab,
  WorkRequestItem,
} from './components';

export * from './components/types';

export enum StatusAppointment {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ON_THE_WAY = 'ON_THE_WAY',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}

const TAB_CONFIG: Record<SubStatus, { fq: string; fqin?: string; sort: string }> = {
  REQUEST: {
    fq: 'status:PENDING,type:OFFLINE',
    sort: 'date',
  },
  SCHEDULE: {
    fq: 'type:OFFLINE',
    fqin: 'status:CONFIRMED,ON_THE_WAY,ARRIVED',
    sort: 'date',
  },
  COMPLETED: {
    fq: 'status:COMPLETED,type:OFFLINE',
    sort: '-date',
  },
  CANCELLED: {
    fq: 'type:OFFLINE',
    fqin: 'status:CANCELED,REJECTED',
    sort: '-date',
  },
};

const formatVNDate = (isoString?: string) => {
  if (!isoString) return '--/--/----';
  const m = moment(isoString);
  if (!m.isValid()) return '--/--/----';
  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return `${dayNames[m.day()]}, Ngày ${m.format('DD/MM/YYYY')}`;
};

const mapBookingToWorkItem = (item: any, currentTab: SubStatus): WorkRequestItem => {
  const startM = item?.date ? moment(item.date) : moment();
  const duration = Number(item?.duration) || 60;
  const endM = startM.clone().add(duration, 'minutes');
  const timeStr = `${startM.format('HH:mm')} - ${endM.format('HH:mm')}`;

  const customer = item?.user || item?.customer || {};
  const customerName =
    customer.full_name || customer.name || item?.customer_name || 'Khách hàng';
  const customerAvatar = customer.avatar || item?.customer_avatar;
  const customerPhone = customer.phone || customer.phone_number || item?.phone || '';
  const customerId = customer.id || customer._id || item?.user_id;

  const serviceTitle =
    item?.package?.name ||
    item?.package_name ||
    item?.name ||
    item?.title ||
    'Dịch vụ y tế';

  const note = item?.note || item?.symptom_note || item?.notes || '';
  const address =
    item?.address ||
    item?.customer_address ||
    item?.user?.address ||
    '';

  const priceNum = Number(item?.price ?? item?.amount ?? item?.package?.price ?? 0);
  const amount = priceNum > 0 ? `${priceNum.toLocaleString('vi-VN')}đ` : '0đ';

  const appointmentStatus = String(item?.status || '').toUpperCase();
  const isMoving = appointmentStatus === StatusAppointment.ON_THE_WAY;
  const isArrived = appointmentStatus === StatusAppointment.ARRIVED;

  return {
    id: String(item?.id || item?._id || Math.random()),
    rawItem: item,
    customerId: String(customerId || ''),
    customerName,
    customerAvatar,
    customerPhone,
    serviceTitle,
    note,
    date: formatVNDate(item?.date),
    time: timeStr,
    address,
    amount,
    status: currentTab,
    appointmentStatus,
    cancelReason: item?.cancel_reason || item?.reject_reason,
    isMoving,
    isArrived,
  };
};

interface TabState {
  items: WorkRequestItem[];
  loading: boolean;
  refreshing: boolean;
  offset: number;
  hasLoaded: boolean;
  finalLoad: boolean;
}

const initialTabsData: Record<SubStatus, TabState> = {
  REQUEST: { items: [], loading: true, refreshing: false, offset: 0, hasLoaded: false, finalLoad: false },
  SCHEDULE: { items: [], loading: true, refreshing: false, offset: 0, hasLoaded: false, finalLoad: false },
  COMPLETED: { items: [], loading: true, refreshing: false, offset: 0, hasLoaded: false, finalLoad: false },
  CANCELLED: { items: [], loading: true, refreshing: false, offset: 0, hasLoaded: false, finalLoad: false },
};

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    headerWrapper: {
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.cEAECF0 || '#EAECF0',
    },
    headerBar: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    headerLeftBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.c101828 || '#101828',
      textAlign: 'center',
    },
    headerRightPlaceholder: {
      width: 40,
      height: 40,
    },
    mainTabRow: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.cEAECF0 || '#EAECF0',
    },
    mainTabItem: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    mainTabText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.c667085 || '#667085',
    },
    mainTabTextActive: {
      color: colors.primary || '#19A2A7',
      fontWeight: '600',
    },
    mainTabIndicator: {
      position: 'absolute',
      bottom: -1,
      left: 20,
      right: 20,
      height: 2.5,
      backgroundColor: colors.primary || '#19A2A7',
      borderRadius: 2,
    },
    toastBanner: {
      position: 'absolute',
      bottom: 24,
      left: 20,
      right: 20,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
      zIndex: 999,
    },
    toastSuccess: {
      backgroundColor: '#039855',
    },
    toastDanger: {
      backgroundColor: '#D92D20',
    },
    toastText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
    },
  })
);

export const PartnerWorkScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const [mainTab, setMainTab] = useState<MainTab>('INFO');
  const [subStatus, setSubStatus] = useState<SubStatus>('REQUEST');
  const [tabsData, setTabsData] = useState<Record<SubStatus, TabState>>(initialTabsData);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'danger';
  } | null>(null);

  // Reject dialog state
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [selectedRejectJobId, setSelectedRejectJobId] = useState<string | null>(null);
  const [selectedReasonIndex, setSelectedReasonIndex] = useState<number | null>(null);
  const [otherReasonText, setOtherReasonText] = useState('');

  const showToast = (text: string, type: 'success' | 'danger') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchBookingsByTab = useCallback(
    async (targetTab: SubStatus, offset = 0, isRefresh = false) => {
      setTabsData(prev => {
        const current = prev[targetTab] || initialTabsData[targetTab];
        return {
          ...prev,
          [targetTab]: {
            ...current,
            loading: offset === 0 && !isRefresh && !current.hasLoaded,
            refreshing: isRefresh,
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

        const cfg = TAB_CONFIG[targetTab];
        const param: any = {
          limit: PAGINATION.ITEMS_20 || 20,
          offset,
          fq: cfg.fq,
          sort: cfg.sort,
        };
        if (cfg.fqin) {
          param.fqin = cfg.fqin;
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
          const rawItems: any[] =
            res?.data?.items ||
            res?.data?.result?.items ||
            res?.data?.result?.item ||
            (Array.isArray(res?.data) ? res.data : []) ||
            [];

          const mapped: WorkRequestItem[] = rawItems.map(item =>
            mapBookingToWorkItem(item, targetTab),
          );

          const isEnd = mapped.length < (PAGINATION.ITEMS_20 || 20);

          setTabsData(prev => {
            const current = prev[targetTab] || initialTabsData[targetTab];
            return {
              ...prev,
              [targetTab]: {
                items: offset === 0 ? mapped : [...current.items, ...mapped],
                finalLoad: isEnd,
                offset,
                hasLoaded: true,
                loading: false,
                refreshing: false,
              },
            };
          });
        } else {
          setTabsData(prev => {
            const current = prev[targetTab] || initialTabsData[targetTab];
            return {
              ...prev,
              [targetTab]: {
                ...current,
                loading: false,
                refreshing: false,
                hasLoaded: true,
              },
            };
          });
        }
      } catch (err) {
        console.warn('[PartnerWorkScreen] fetchBookingsByTab error:', err);
        setTabsData(prev => {
          const current = prev[targetTab] || initialTabsData[targetTab];
          return {
            ...prev,
            [targetTab]: {
              ...current,
              loading: false,
              refreshing: false,
              hasLoaded: true,
            },
          };
        });
      } finally {
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      hideLoading(true);
      fetchBookingsByTab(subStatus, 0, false);
    }, [subStatus, fetchBookingsByTab]),
  );

  const handleSelectSubStatus = (status: SubStatus) => {
    setSubStatus(status);
    if (!tabsData[status]?.hasLoaded) {
      fetchBookingsByTab(status, 0, false);
    }
  };

  const handleRefresh = () => {
    fetchBookingsByTab(subStatus, 0, true);
  };

  const handleCall = (phoneNumber: string) => {
    if (!phoneNumber) {
      Alert.alert(t('common.notice', 'Thông báo'), 'Không tìm thấy số điện thoại khách hàng.');
      return;
    }
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert(
        t('common.notice', 'Thông báo'),
        `${t('partnerWork.cannotCall', 'Không thể gọi tới')} ${phoneNumber}`,
      );
    });
  };

  const handleOpenChat = async (
    name: string,
    avatar?: any,
    jobId?: string,
    toUserId?: string,
    rawItem?: any,
  ) => {
    const packageInfo = rawItem?.package || {};
    const packageId = packageInfo?.id || packageInfo?._id || rawItem?.package_id;
    const orderId = rawItem?.id || rawItem?._id || jobId;
    const targetId = toUserId || rawItem?.user?.id || rawItem?.customer_id;

    try {
      showToast(`${t('partnerWork.startChatWith', 'Đang mở đoạn chat với')} ${name}...`, 'success');
      const room = await socketService.createRoom1vs1(
        name,
        String(targetId || `cust_${Date.now()}`),
        avatar,
        {
          media: 'text',
          is_premium: 1,
          is_chat: 1,
          package_id: packageId,
          order_id: orderId,
        },
      );

      const roomId = room?.id || room?.room_id;

      navigation.navigate('PartnerChatScreen', {
        roomId,
        name,
        customerName: name,
        avatar,
        customerAvatar: avatar,
        toUserId: targetId,
        packageId,
        orderId,
      });
    } catch (e) {
      navigation.navigate('PartnerChatScreen', {
        name,
        customerName: name,
        avatar,
        customerAvatar: avatar,
        toUserId: targetId,
        packageId,
        orderId,
      });
    }
  };

  // Update booking status via ApiService
  const handleUpdateBookingStatus = async (
    jobId: string,
    newStatus: StatusAppointment,
    successMsg?: string,
    cancelReason?: string,
  ) => {
    showLoading();
    try {
      const payload: any = {
        id: jobId,
        status: newStatus,
      };
      if (cancelReason) {
        payload.cancel_reason = cancelReason;
      }

      const res: any = await ApiService.updateBookingStatus(payload);

      if (isApiSuccess(res)) {
        if (successMsg) {
          showToast(successMsg, 'success');
        }
        fetchBookingsByTab(subStatus, 0, true);
        setTabsData(prev => {
          const updated: any = { ...prev };
          (['REQUEST', 'SCHEDULE', 'COMPLETED', 'CANCELLED'] as SubStatus[]).forEach(tab => {
            if (tab !== subStatus && updated[tab]) {
              updated[tab] = { ...updated[tab], hasLoaded: false };
            }
          });
          return updated;
        });
      } else {
        const err = getApiErrorMessage(res, 'Không thể cập nhật trạng thái');
        showToast(err, 'danger');
      }
    } catch (e: any) {
      showToast(e?.message || 'Có lỗi xảy ra, vui lòng thử lại', 'danger');
    } finally {
      hideLoading();
    }
  };

  const handleAcceptJob = (jobId: string) => {
    Alert.alert(
      t('partnerWork.confirmAcceptTitle', 'Tiếp nhận yêu cầu'),
      t('partnerWork.confirmAcceptMsg', 'Bạn có muốn tiếp nhận yêu cầu đặt lịch này không?'),
      [
        { text: t('common.cancel', 'Hủy'), style: 'cancel' },
        {
          text: t('partnerWork.btnAccept', 'Chấp nhận'),
          onPress: () =>
            handleUpdateBookingStatus(
              jobId,
              StatusAppointment.CONFIRMED,
              t('partnerWork.acceptSuccessToast', 'Đã nhận ca thành công! Xem trong Lịch hẹn.'),
            ),
        },
      ],
    );
  };

  const handleOpenRejectModal = (jobId: string) => {
    setSelectedRejectJobId(jobId);
    setSelectedReasonIndex(null);
    setOtherReasonText('');
    setIsRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (selectedReasonIndex === null) {
      Alert.alert(
        t('common.notice', 'Thông báo'),
        t('partnerWork.selectReasonPrompt', 'Vui lòng chọn lý do từ chối lịch hẹn'),
      );
      return;
    }

    const reason =
      selectedReasonIndex === 3
        ? otherReasonText || t('partnerWork.rejectModal.reasonOther', 'Lý do khác')
        : REJECT_REASONS[selectedReasonIndex];

    if (selectedRejectJobId) {
      handleUpdateBookingStatus(
        selectedRejectJobId,
        StatusAppointment.REJECTED,
        t('partnerWork.cancelSuccessToast', 'Đã từ chối lịch hẹn thành công! Xem trong Huỷ'),
        reason,
      );
    }

    setIsRejectModalVisible(false);
  };

  const handleStartMoving = (jobId: string) => {
    handleUpdateBookingStatus(
      jobId,
      StatusAppointment.ON_THE_WAY,
      t('partnerWork.movingToast', 'Đang di chuyển đến nhà khách hàng!'),
    );
  };

  const handleConfirmArrived = (jobId: string) => {
    handleUpdateBookingStatus(
      jobId,
      StatusAppointment.ARRIVED,
      t('partnerWork.arrivedToast', 'Đã xác nhận đến điểm hẹn thành công!'),
    );
  };

  const handleCompleteJob = (jobId: string) => {
    Alert.alert(
      t('partnerWork.confirmCompleteTitle', 'Xác nhận hoàn thành'),
      t('partnerWork.confirmCompleteMsg', 'Đánh dấu lịch hẹn này đã hoàn thành dịch vụ?'),
      [
        { text: t('common.cancel', 'Hủy'), style: 'cancel' },
        {
          text: t('common.agree', 'Đồng ý'),
          onPress: () =>
            handleUpdateBookingStatus(
              jobId,
              StatusAppointment.COMPLETED,
              t('partnerWork.completeSuccessToast', 'Đã hoàn thành dịch vụ thành công!'),
            ),
        },
      ],
    );
  };

  const handleOpenExternalMap = (addressText: string) => {
    if (!addressText) return;
    const encoded = encodeURIComponent(addressText);
    const url = Platform.select({
      ios: `maps:0,0?q=${encoded}`,
      android: `geo:0,0?q=${encoded}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
    });
    Linking.openURL(url as string).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    });
  };

  const handleBackToHome = () => {
    const mainNavigator = navigation.getParent()?.getParent();
    if (mainNavigator && mainNavigator.canGoBack()) {
      mainNavigator.goBack();
      return;
    }
    const parent = navigation.getParent();
    if (parent && parent.canGoBack()) {
      parent.goBack();
      return;
    }
    navigation.navigate(rootRoute, { screen: 'HomeTab' });
  };

  const currentTabData = tabsData[subStatus] || initialTabsData[subStatus];

  return (
    <Wrapper style={styles.container}>
      {/* Header */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerLeftBtn}
            activeOpacity={0.65}
            onPress={handleBackToHome}
          >
            <IconX
              type="ionicons"
              name="chevron-back"
              size={24}
              color={colors.c344054 || '#344054'}
            />
          </TouchableOpacity>

          <CText style={styles.headerTitle}>{t('partnerWork.title', 'Công việc')}</CText>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      {/* Main Tabs: Thông tin công việc | Trò chuyện */}
      <View style={styles.mainTabRow}>
        <TouchableOpacity
          style={styles.mainTabItem}
          activeOpacity={0.7}
          onPress={() => setMainTab('INFO')}
        >
          <CText
            style={[
              styles.mainTabText,
              mainTab === 'INFO' && styles.mainTabTextActive,
            ]}
          >
            {t('partnerWork.tabInfo', 'Thông tin công việc')}
          </CText>
          {mainTab === 'INFO' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainTabItem}
          activeOpacity={0.7}
          onPress={() => setMainTab('CHAT')}
        >
          <CText
            style={[
              styles.mainTabText,
              mainTab === 'CHAT' && styles.mainTabTextActive,
            ]}
          >
            {t('partnerWork.tabChat', 'Trò chuyện')}
          </CText>
          {mainTab === 'CHAT' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {mainTab === 'INFO' ? (
        <WorkInfoTab
          subStatus={subStatus}
          onSelectSubStatus={handleSelectSubStatus}
          requestsList={currentTabData.items}
          isLoading={currentTabData.loading}
          isRefreshing={currentTabData.refreshing}
          onRefresh={handleRefresh}
          onCall={handleCall}
          onChat={(name, avatar, jobId, toUserId, rawItem) =>
            handleOpenChat(name, avatar, jobId, toUserId, rawItem)
          }
          onOpenRejectModal={handleOpenRejectModal}
          onAcceptJob={handleAcceptJob}
          onStartMoving={handleStartMoving}
          onConfirmArrived={handleConfirmArrived}
          onCompleteJob={handleCompleteJob}
          onOpenMap={handleOpenExternalMap}
        />
      ) : (
        <WorkChatTab
          onOpenChat={(name, avatar, roomId, toUserId) =>
            handleOpenChat(name, avatar, roomId, toUserId)
          }
        />
      )}

      {/* Toast Feedback */}
      {!!toastMessage && (
        <View
          style={[
            styles.toastBanner,
            toastMessage.type === 'success'
              ? styles.toastSuccess
              : styles.toastDanger,
          ]}
        >
          <CText style={styles.toastText}>{toastMessage.text}</CText>
        </View>
      )}

      {/* Reject Modal */}
      <RejectJobModal
        visible={isRejectModalVisible}
        selectedReasonIndex={selectedReasonIndex}
        otherReasonText={otherReasonText}
        onSelectReason={setSelectedReasonIndex}
        onChangeOtherReasonText={setOtherReasonText}
        onClose={() => setIsRejectModalVisible(false)}
        onConfirm={handleConfirmReject}
      />
    </Wrapper>
  );
};

export default PartnerWorkScreen;
