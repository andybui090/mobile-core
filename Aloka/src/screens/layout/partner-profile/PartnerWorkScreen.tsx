import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { IconX, Wrapper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import { rootRoute } from '@/constants';
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

const INITIAL_REQUESTS: WorkRequestItem[] = [
  {
    id: 'req-1',
    customerName: 'Thiên Ân',
    customerAvatar: images.common.avatar_thien_an,
    customerPhone: '0901234567',
    serviceTitle: 'Tắm bé - Massage',
    autoCancelTime: '01:00',
    note: 'Đến gọi trước, bé bị dị ứng xà bông .....',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    amount: '219.000đ',
    status: 'REQUEST',
  },
  {
    id: 'req-2',
    customerName: 'Thanh Thúy',
    customerAvatar: images.common.img_default,
    customerPhone: '0909876543',
    serviceTitle: 'Tắm bé - Massage',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    amount: '219.000đ',
    status: 'REQUEST',
  },
  {
    id: 'sch-1',
    customerName: 'Thiên Ân',
    customerAvatar: images.common.avatar_thien_an,
    customerPhone: '0901234567',
    serviceTitle: 'Tắm bé - Massage',
    note: 'Đến gọi trước, bé bị dị ứng xà bông .....',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    amount: '219.000đ',
    status: 'SCHEDULE',
    isMoving: true,
  },
  {
    id: 'sch-2',
    customerName: 'Thanh Thúy',
    customerAvatar: images.common.img_default,
    customerPhone: '0909876543',
    serviceTitle: 'Tắm bé - Massage',
    note: 'Đến nhà nhớ gọi trước',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    amount: '219.000đ',
    status: 'SCHEDULE',
  },
];

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
  const [requestsList, setRequestsList] = useState<WorkRequestItem[]>(INITIAL_REQUESTS);

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

  const handleCall = (phoneNumber: string) => {
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
    roomIdOrCustomerId?: string,
    isNewChat?: boolean,
    toUserId?: string,
  ) => {
    try {
      if (!isNewChat && roomIdOrCustomerId) {
        navigation.navigate('PartnerChatScreen', {
          roomId: roomIdOrCustomerId,
          name: name,
          customerName: name,
          avatar: avatar,
          customerAvatar: avatar,
          toUserId: toUserId,
        });
        return;
      }

      showToast(`${t('partnerWork.startChatWith', 'Đang mở đoạn chat với')} ${name}...`, 'success');
      const room = await socketService.createRoom1vs1(
        name,
        toUserId || roomIdOrCustomerId || `cust_${Date.now()}`,
        avatar,
      );
      navigation.navigate('PartnerChatScreen', {
        roomId: room.id,
        name: name,
        customerName: name,
        avatar: avatar,
        customerAvatar: avatar,
        isNewChat: !!isNewChat,
        toUserId: toUserId,
      });
    } catch (e) {
      navigation.navigate('PartnerChatScreen', {
        name: name,
        customerName: name,
        avatar: avatar,
        customerAvatar: avatar,
        isNewChat: !!isNewChat,
        toUserId: toUserId,
      });
    }
  };

  const handleAcceptJob = (jobId: string) => {
    setRequestsList(prev =>
      prev.map(item =>
        item.id === jobId ? { ...item, status: 'SCHEDULE' as SubStatus } : item,
      ),
    );
    showToast(t('partnerWork.acceptSuccessToast', 'Đã nhận ca thành công! Xem trong Lịch hẹn.'), 'success');
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
      setRequestsList(prev =>
        prev.map(item =>
          item.id === selectedRejectJobId
            ? { ...item, status: 'CANCELLED' as SubStatus, cancelReason: reason }
            : item,
        ),
      );
    }

    setIsRejectModalVisible(false);
    showToast(t('partnerWork.cancelSuccessToast', 'Đã huỷ bỏ lịch hẹn thành công! Xem trong Huỷ'), 'danger');
  };

  const handleStartMoving = (jobId: string) => {
    setRequestsList(prev =>
      prev.map(item =>
        item.id === jobId ? { ...item, isMoving: true } : item,
      ),
    );
    showToast(t('partnerWork.movingToast', 'Đang di chuyển đến nhà khách hàng!'), 'success');
  };

  const handleConfirmArrived = (jobId: string) => {
    showToast(t('partnerWork.arrivedToast', 'Đã xác nhận đến điểm hẹn thành công! Bắt đầu dịch vụ.'), 'success');
  };

  const handleOpenExternalMap = (addressText: string) => {
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
          onSelectSubStatus={setSubStatus}
          requestsList={requestsList}
          onCall={handleCall}
          onChat={(name, avatar, jobId) => handleOpenChat(name, avatar, jobId, true)}
          onOpenRejectModal={handleOpenRejectModal}
          onAcceptJob={handleAcceptJob}
          onStartMoving={handleStartMoving}
          onConfirmArrived={handleConfirmArrived}
          onOpenMap={handleOpenExternalMap}
        />
      ) : (
        <WorkChatTab
          onOpenChat={(name, avatar, roomId, toUserId) =>
            handleOpenChat(name, avatar, roomId, false, toUserId)
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
