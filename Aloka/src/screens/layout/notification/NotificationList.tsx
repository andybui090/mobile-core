import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@/components';
import { CText } from '@/utils';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Gói chăm Mẹ và Bé',
    message: 'Dịch vụ đã hoàn tất. Bạn có hài lòng với trải nghiệm này không?',
    time: '45 phút',
    isRead: false,
  },
  {
    id: '2',
    title: 'Gói chăm Mẹ và Bé',
    message: 'Điều dưỡng đã có mặt tại điểm hẹn!',
    time: '1h',
    isRead: false,
  },
  {
    id: '3',
    title: 'Gói chăm Mẹ và Bé',
    message: 'Điều dưỡng đang trên đường di chuyển đến chỗ bạn!',
    time: '2h',
    isRead: false,
  },
  {
    id: '4',
    title: 'Gói chăm Mẹ và Bé',
    message:
      'Đặt lịch hẹn thành công! Gói dịch vụ của Điều dưỡng Minh Hiếu đã đồng ý lịch hẹn của bạn. Đi tới lịch hẹn ngay!',
    time: '21h',
    isRead: false,
  },
  {
    id: '5',
    title: 'Gói chăm Mẹ và Bé',
    message: 'Thanh toán thành công!',
    time: '23h',
    isRead: true,
  },
  {
    id: '6',
    title: 'Gói chăm Mẹ và Bé',
    message: 'Hoàn tiền thành công! Vui lòng kiểm tra lại số dư',
    time: '23h',
    isRead: true,
  },
  {
    id: '7',
    title: 'Gói chăm Mẹ và Bé',
    message: 'Số tiền 219.000đ sẽ được hoàn vào Momo của bạn từ 7-14 ngày',
    time: '23h',
    isRead: true,
  },
  {
    id: '8',
    title: 'Gói chăm Mẹ và Bé',
    message: 'Lịch hẹn không được xác nhận. Khoản tiền tạm giữ sẽ được hoàn lại.',
    time: '23h',
    isRead: true,
  },
  {
    id: '9',
    title: 'Gói chăm Mẹ và Bé',
    message: 'Thanh toán thành công!',
    time: '23h',
    isRead: true,
  },
  {
    id: '10',
    title: 'Gói tắm bé chuyên sâu',
    message: 'Dịch vụ đã hoàn tất. Bạn có hài lòng với trải nghiệm này không?',
    time: '15:30 - 04/11/2025',
    isRead: true,
  },
];

interface NotificationListProps {
  onBack?: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setShowOptionsModal(false);
  };

  const handleItemPress = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <IconX type="ionicons" name="notifications-off-outline" size={48} color="#99F6E4" />
      </View>
      <CText style={styles.emptyTitle}>Không có thông báo</CText>
      <CText style={styles.emptyDesc}>
        Odio elit fermentum fusce malesuada duis eget vestibulum orci. Eget interdum elit mauris sit.
      </CText>
    </View>
  );

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        !item.isRead ? styles.itemUnreadBg : styles.itemReadBg,
      ]}
      activeOpacity={0.7}
      onPress={() => handleItemPress(item.id)}
    >
      <View style={styles.bellBadge}>
        <IconX type="ionicons" name="notifications" size={18} color="#FFFFFF" />
      </View>

      <View style={styles.itemBody}>
        <CText style={styles.itemTitle}>{item.title}</CText>
        <CText style={styles.itemMessage}>{item.message}</CText>
        <CText style={styles.itemTime}>{item.time}</CText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Thông báo</CText>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => setShowOptionsModal(true)}
          activeOpacity={0.7}
        >
          <IconX type="ionicons" name="ellipsis-horizontal" size={20} color="#1D2939" />
        </TouchableOpacity>
      </View>

      {/* Content List or Empty State */}
      {notifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotificationItem}
          ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
              <IconX type="ionicons" name="mail-outline" size={22} color="#0080FF" />
              <CText style={styles.optionText}>Đánh dấu tất cả đã đọc</CText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

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

  /* Empty State Styles */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
