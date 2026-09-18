import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@/components';
import { CText } from '@/utils';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import {
  getListNotify,
  getTotalNotifyUnread,
  readNotify,
  resetNotify,
} from '@/redux/slices/notificationSlice';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { rootRoute } from '@/constants';
import { navigationRef } from '@/navigation/RootNavigation';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  raw?: any;
}

interface NotificationListProps {
  onBack?: () => void;
}

const PAGE_SIZE = 20;

const formatNotifyTime = (dateValue: any): string => {
  if (!dateValue) return '';
  const m = moment(dateValue);
  if (!m.isValid()) return String(dateValue);
  const now = moment();
  const diffSec = now.diff(m, 'seconds');
  if (diffSec < 60) return 'Vừa xong';
  const diffMin = now.diff(m, 'minutes');
  if (diffMin < 60) return `${diffMin} phút`;
  const diffHour = now.diff(m, 'hours');
  if (diffHour < 24) return `${diffHour}h`;
  const diffDays = now.diff(m, 'days');
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return m.format('HH:mm - DD/MM/YYYY');
};

export const NotificationList: React.FC<NotificationListProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { notifyList, notifyRead } = useAppSelector(state => state.notifyReducer);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [offsetNoti, setOffsetNoti] = useState<number>(0);
  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);

  // Fetch initial notifications on mount
  useEffect(() => {
    dispatch(getListNotify({ offset: 0, limit: PAGE_SIZE }));
    dispatch(getTotalNotifyUnread(null));
  }, [dispatch]);

  // Handle getListNotify response from Redux
  useEffect(() => {
    const { loading, data, error } = notifyList;
    // Skip initial Redux state (loading=false, data=undefined, error=undefined)
    if (!loading && data === undefined && error === undefined) return;
    if (!loading) {
      if (data) {
        const resData: any = data;
        const rawItems: any[] =
          resData?.items ||
          resData?.result?.items ||
          resData?.result ||
          (Array.isArray(resData) ? resData : []);

        if (Array.isArray(rawItems)) {
          const mapped: NotificationItem[] = rawItems.map((item: any, index: number) => ({
            id: String(item.id ?? item._id ?? `${offsetNoti}_${index}`),
            title: item.title || t('settings.notifications', 'Thông báo'),
            message:
              item.content || item.message || item.body || item.description || '',
            time: formatNotifyTime(
              item.updated_at || item.created_at || item.createdAt || item.time
            ),
            isRead:
              item.is_read === 1 ||
              item.is_read === true ||
              item.isRead === true,
            raw: item,
          }));

          if (offsetNoti === 0) {
            setNotifications(mapped);
          } else {
            setNotifications(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const filtered = mapped.filter(m => !existingIds.has(m.id));
              return [...prev, ...filtered];
            });
          }
          setHasMore(rawItems.length >= PAGE_SIZE);
        } else {
          if (offsetNoti === 0) {
            setNotifications([]);
          }
          setHasMore(false);
        }
      }
      setIsFirstLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [notifyList, offsetNoti, t]);


  // Handle readNotify response
  useEffect(() => {
    const { loading, data, error } = notifyRead;
    if (!loading && (data || error)) {
      dispatch(getTotalNotifyUnread(null));
      dispatch(resetNotify());
    }
  }, [notifyRead, dispatch]);

  const handleRefresh = () => {
    setOffsetNoti(0);
    setRefreshing(true);
    dispatch(getListNotify({ offset: 0, limit: PAGE_SIZE }));
  };

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore || isFirstLoading || refreshing) return;
    const nextOffset = offsetNoti + PAGE_SIZE;
    setOffsetNoti(nextOffset);
    setIsLoadingMore(true);
    dispatch(getListNotify({ offset: nextOffset, limit: PAGE_SIZE }));
  };

  const handleMarkAllAsRead = () => {
    const unreadItems = notifications.filter(n => !n.isRead);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setShowOptionsModal(false);

    unreadItems.forEach(item => {
      dispatch(readNotify({ idNotify: item.id, id: item.id }));
    });
    dispatch(getTotalNotifyUnread(null));
  };

  const handleItemPress = (item: NotificationItem) => {
    // Mark as read locally and sync with backend
    if (!item.isRead) {
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      dispatch(readNotify({ idNotify: item.id, id: item.id }));
      dispatch(getTotalNotifyUnread(null));
    }

    // Extract payload from item.raw
    const rawData = item.raw?.data;
    let parsed: any = null;
    if (typeof rawData === 'string') {
      try {
        parsed = JSON.parse(rawData);
      } catch (e) {
        parsed = null;
      }
    } else if (typeof rawData === 'object' && rawData !== null) {
      parsed = rawData;
    }

    const type = parsed?.type || item.raw?.type || item.raw?.notify_type || '';
    const link = parsed?.link || item.raw?.link || item.raw?.url;

    // Handle web link
    if (link) {
      Linking.openURL(link).catch(() => {});
      return;
    }

    // Handle Chat notification
    if (type === 'chat' || type === 'friend') {
      const roomId = parsed?.room_id || parsed?.roomId || item.raw?.room_id;
      const toUserId = parsed?.to_user_id || parsed?.user_id || item.raw?.user_id;
      if (roomId || toUserId) {
        if (navigationRef.isReady()) {
          try {
            (navigationRef.current as any)?.navigate('BookingChat', {
              roomId,
              toUserId,
              customerName: parsed?.name || item.raw?.name,
            });
            return;
          } catch (e) {}
        }
      }
    }

    // Handle Appointment / Booking notification
    const textContent = `${item.title || ''} ${item.message || ''} ${type}`.toLowerCase();
    const isBookingNotify =
      type === 'booking' ||
      type === 'confirm_booking' ||
      type === 'next_booking' ||
      type === 'on_the_way_booking' ||
      type === 'arrived_booking' ||
      type === 'completed_booking' ||
      type === 'cancel_booking' ||
      textContent.includes('lịch hẹn') ||
      textContent.includes('đặt lịch') ||
      textContent.includes('booking');

    if (isBookingNotify) {
      let idxTab = 0; // 0: Sắp tới
      if (
        type === 'booking' ||
        textContent.includes('đã đặt lịch') ||
        textContent.includes('yêu cầu')
      ) {
        idxTab = 1; // 1: Yêu cầu
      } else if (
        type === 'completed_booking' ||
        textContent.includes('hoàn thành')
      ) {
        idxTab = 2; // 2: Đã hoàn thành
      } else if (
        type === 'cancel_booking' ||
        textContent.includes('huỷ') ||
        textContent.includes('hủy')
      ) {
        idxTab = 3; // 3: Hủy
      }

      // Navigate to AppointmentTab inside root AppTabScreen
      if (navigationRef.isReady()) {
        try {
          (navigationRef.current as any)?.navigate(rootRoute, {
            screen: 'AppointmentTab',
            params: { idxTab },
          });
          return;
        } catch (e) {
          console.warn('[NotificationList] navigationRef error:', e);
        }
      }

      try {
        navigation.navigate(rootRoute as any, {
          screen: 'AppointmentTab',
          params: { idxTab },
        });
      } catch (e1) {
        try {
          navigation.getParent()?.navigate(rootRoute as any, {
            screen: 'AppointmentTab',
            params: { idxTab },
          });
        } catch (e2) {
          try {
            navigation.navigate('AppointmentTab' as any, { idxTab });
          } catch (e3) {
            console.warn('[NotificationList] navigation error:', e3);
          }
        }
      }
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <IconX type="ionicons" name="notifications-off-outline" size={48} color="#0D9488" />
      </View>
      <CText style={styles.emptyTitle}>Không có thông báo</CText>
      <CText style={styles.emptyDesc}>
        Hiện tại bạn chưa có thông báo nào. Các thông báo về lịch hẹn và ưu đãi sẽ xuất hiện tại đây.
      </CText>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color="#0D9488" />
      </View>
    );
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        !item.isRead ? styles.itemUnreadBg : styles.itemReadBg,
      ]}
      activeOpacity={0.7}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.bellBadge}>
        <IconX type="ionicons" name="notifications" size={18} color="#FFFFFF" />
      </View>

      <View style={styles.itemBody}>
        <CText style={styles.itemTitle}>{item.title}</CText>
        <CText style={styles.itemMessage}>{item.message}</CText>
        {item.time ? <CText style={styles.itemTime}>{item.time}</CText> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack ?? (() => navigation.goBack())} activeOpacity={0.7}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>
          {t('settings.notifications', 'Thông báo')}
        </CText>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => setShowOptionsModal(true)}
          activeOpacity={0.7}
        >
          <IconX type="ionicons" name="ellipsis-horizontal" size={20} color="#1D2939" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {isFirstLoading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#0D9488" />
          <CText style={styles.loadingText}>Đang tải thông báo...</CText>
        </View>
      ) : notifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotificationItem}
          ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0D9488"
              colors={['#0D9488']}
            />
          }
        />
      )}

      {/* Options Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptionsModal}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={styles.modalContent}>
            {/* Drag handle */}
            <View style={styles.dragHandle} />

            {/* Mark all read action row */}
            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={handleMarkAllAsRead}
            >
              <IconX type="ionicons" name="mail-outline" size={22} color="#0D9488" />
              <CText style={styles.optionText}>Đánh dấu tất cả đã đọc</CText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
  },
  moreBtn: {
    width: 36,
    height: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'flex-start',
  },
  itemUnreadBg: {
    backgroundColor: '#EDFBF8',
  },
  itemReadBg: {
    backgroundColor: '#FFFFFF',
  },
  bellBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  itemBody: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  itemMessage: {
    fontSize: 12.5,
    color: '#475467',
    lineHeight: 18,
  },
  itemTime: {
    fontSize: 11.5,
    color: '#98A2B3',
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F2F4F7',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#667085',
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Empty State Styles */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 19,
  },

  /* Bottom Sheet Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D5DD',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#101828',
  },
});
