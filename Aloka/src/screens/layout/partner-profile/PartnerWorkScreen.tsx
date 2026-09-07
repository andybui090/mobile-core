import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { IconX, Wrapper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import { rootRoute } from '@/constants';

const { width } = Dimensions.get('window');

type MainTab = 'INFO' | 'CHAT';
type SubStatus = 'REQUEST' | 'SCHEDULE' | 'COMPLETED' | 'CANCELLED';

interface ChatMessage {
  id: string;
  sender: 'partner' | 'customer';
  text: string;
  avatar?: any;
}

const DEFAULT_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '2',
    sender: 'customer',
    text: 'Chào bạn, rất vui khi bạn đã chọn dịch vụ của chúng tôi!\nBạn cần hỗ trợ gì?',
    avatar: images.common.nurse_minh_hieu,
  },
  {
    id: '1',
    sender: 'partner',
    text: 'Cho mình hỏi thêm về dịch vụ',
  },
];

interface WorkRequestItem {
  id: string;
  customerName: string;
  customerAvatar?: any;
  customerPhone: string;
  serviceTitle: string;
  autoCancelTime?: string;
  note?: string;
  date: string;
  time: string;
  address: string;
  amount: string;
  status: SubStatus;
  cancelReason?: string;
  isMoving?: boolean;
}

const REJECT_REASONS = [
  'Trùng lịch làm việc khác',
  'Khoảng cách quá xa',
  'Bận việc đột xuất',
  'Khác (ô nhập text)',
];

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
  subPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: colors.white,
  },
  pillItem: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.cF2F4F7 || '#F2F4F7',
  },
  pillItemActive: {
    backgroundColor: colors.primary || '#19A2A7',
  },
  pillText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: colors.c667085 || '#667085',
  },
  pillTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  jobCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cEAECF0 || '#EAECF0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cF2F4F7 || '#F2F4F7',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6FAFA',
    marginRight: 10,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.c1D2939 || '#1D2939',
  },
  customerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary || '#19A2A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.c1D2939 || '#1D2939',
  },
  autoCancelTag: {
    backgroundColor: '#FFF1F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  autoCancelText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#F04438',
  },
  customerNoteBox: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  customerNoteText: {
    fontSize: 12.5,
    color: '#F04438',
    flex: 1,
  },
  customerNoteBoxNormal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  customerNoteTextNormal: {
    fontSize: 12.5,
    color: colors.c98A2B3 || '#98A2B3',
    flex: 1,
  },
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  jobInfoText: {
    fontSize: 13,
    color: colors.c344054 || '#344054',
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cF2F4F7 || '#F2F4F7',
    marginTop: 6,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.c1D2939 || '#1D2939',
  },
  amountValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F04438',
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F04438',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F04438',
  },
  acceptBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary || '#19A2A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  mapContainer: {
    height: 185,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#E5E7EB',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.cEAECF0 || '#EAECF0',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  openMapBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FB6514',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  openMapText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.white,
  },
  arriveBtn: {
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary || '#19A2A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arriveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  // Toast Banner
  toastBanner: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 99,
  },
  toastSuccess: {
    backgroundColor: '#22C55E',
  },
  toastDanger: {
    backgroundColor: '#D92D20',
  },
  toastText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },

  // Reject Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialogBox: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.c101828 || '#101828',
  },
  dialogCloseBtn: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  dialogPrompt: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.c101828 || '#101828',
    marginBottom: 16,
  },
  radioOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.cD0D5DD || '#D0D5DD',
    backgroundColor: '#EAECF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary || '#19A2A7',
    backgroundColor: colors.white,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary || '#19A2A7',
  },
  radioLabel: {
    fontSize: 14,
    color: colors.c344054 || '#344054',
  },
  otherTextInput: {
    borderWidth: 1,
    borderColor: colors.cD0D5DD || '#D0D5DD',
    borderRadius: 8,
    padding: 10,
    fontSize: 13.5,
    color: colors.c101828 || '#101828',
    marginTop: 8,
    marginBottom: 12,
  },
  dialogDivider: {
    height: 1,
    backgroundColor: colors.cEAECF0 || '#EAECF0',
    marginVertical: 16,
  },
  dialogBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dialogBackBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cD0D5DD || '#D0D5DD',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBackBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.c475467 || '#475467',
  },
  dialogConfirmBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#D92D20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogConfirmBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.c667085 || '#667085',
    marginTop: 10,
  },

  // Chat Area Styles (from BookingChat)
  chatContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  chatCustomerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0 || '#EAECF0',
  },
  chatAvatarWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  chatHeaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F4F7',
  },
  chatOnlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#12B76A',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  chatHeaderTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.c101828 || '#101828',
  },
  chatHeaderStatus: {
    fontSize: 11.5,
    color: '#12B76A',
    marginTop: 2,
  },
  chatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  timeHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timeText: {
    fontSize: 12,
    color: colors.c98A2B3 || '#98A2B3',
    fontWeight: '400',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  partnerRow: {
    justifyContent: 'flex-end',
  },
  customerRowMsg: {
    justifyContent: 'flex-start',
  },
  customerAvatarMsg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F4F7',
    marginRight: 8,
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  partnerBubble: {
    backgroundColor: '#D1F0EA',
  },
  customerBubble: {
    backgroundColor: '#F2F4F7',
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.c1D2939 || '#1D2939',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  inputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cD0D5DD || '#D0D5DD',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 42,
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    color: colors.c101828 || '#101828',
    paddingVertical: 0,
    marginRight: 4,
  },
  innerActionBtn: {
    padding: 4,
    marginLeft: 2,
  },
  sendBtn: {
    marginLeft: 10,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  })
);

export const PartnerWorkScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  const [mainTab, setMainTab] = useState<MainTab>('INFO');
  const [subStatus, setSubStatus] = useState<SubStatus>('REQUEST');
  const [requestsList, setRequestsList] = useState<WorkRequestItem[]>(INITIAL_REQUESTS);

  // Toast message state
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
      Alert.alert('Thông báo', `Không thể gọi tới ${phoneNumber}`);
    });
  };

  // Chat state (from BookingChat)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(DEFAULT_CHAT_MESSAGES);
  const [chatInputText, setChatInputText] = useState('');
  const [activeChatCustomer, setActiveChatCustomer] = useState('Thiên Ân');

  const handleSendChat = () => {
    if (!chatInputText.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'partner',
      text: chatInputText.trim(),
    };
    setChatMessages(prev => [newMessage, ...prev]);
    setChatInputText('');
  };

  const handleChat = (name: string, avatar?: any) => {
    navigation.navigate('PartnerChatScreen', {
      customerName: name,
      customerAvatar: avatar,
    });
  };

  const handleAcceptJob = (jobId: string) => {
    // Chuyển job sang trạng thái SCHEDULE (Lịch hẹn)
    setRequestsList(prev =>
      prev.map(item =>
        item.id === jobId ? { ...item, status: 'SCHEDULE' as SubStatus } : item,
      ),
    );
    showToast('Đã nhận ca thành công! Xem trong Lịch hẹn.', 'success');
  };

  const handleOpenRejectModal = (jobId: string) => {
    setSelectedRejectJobId(jobId);
    setSelectedReasonIndex(null);
    setOtherReasonText('');
    setIsRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (selectedReasonIndex === null) {
      Alert.alert('Thông báo', 'Vui lòng chọn lý do từ chối lịch hẹn');
      return;
    }

    const reason =
      selectedReasonIndex === 3
        ? otherReasonText || 'Lý do khác'
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
    showToast('Đã huỷ bỏ lịch hẹn thành công! Xem trong Huỷ', 'danger');
  };

  const handleStartMoving = (jobId: string) => {
    setRequestsList(prev =>
      prev.map(item =>
        item.id === jobId ? { ...item, isMoving: true } : item,
      ),
    );
    showToast('Đang di chuyển đến nhà khách hàng!', 'success');
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

  const handleConfirmArrived = (jobId: string) => {
    showToast('Đã xác nhận đến điểm hẹn thành công! Bắt đầu dịch vụ.', 'success');
  };

  const currentList = requestsList.filter(item => item.status === subStatus);

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

          <CText style={styles.headerTitle}>Công việc</CText>

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
          <CText style={[styles.mainTabText, styles.mainTabTextActive]}>
            Thông tin công việc
          </CText>
          <View style={styles.mainTabIndicator} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainTabItem}
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('PartnerChatScreen', {
              customerName: 'Thiên Ân',
              customerAvatar: images.common.avatar_thien_an,
            });
          }}
        >
          <CText style={styles.mainTabText}>
            Trò chuyện
          </CText>
        </TouchableOpacity>
      </View>

      {/* Sub Status Pills: Yêu cầu | Lịch hẹn | Hoàn thành | Huỷ */}
      <View style={styles.subPillsRow}>
            <TouchableOpacity
              style={[
                styles.pillItem,
                subStatus === 'REQUEST' && styles.pillItemActive,
              ]}
              activeOpacity={0.7}
              onPress={() => setSubStatus('REQUEST')}
            >
              <CText
                style={[
                  styles.pillText,
                  subStatus === 'REQUEST' && styles.pillTextActive,
                ]}
              >
                Yêu cầu
              </CText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pillItem,
                subStatus === 'SCHEDULE' && styles.pillItemActive,
              ]}
              activeOpacity={0.7}
              onPress={() => setSubStatus('SCHEDULE')}
            >
              <CText
                style={[
                  styles.pillText,
                  subStatus === 'SCHEDULE' && styles.pillTextActive,
                ]}
              >
                Lịch hẹn
              </CText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pillItem,
                subStatus === 'COMPLETED' && styles.pillItemActive,
              ]}
              activeOpacity={0.7}
              onPress={() => setSubStatus('COMPLETED')}
            >
              <CText
                style={[
                  styles.pillText,
                  subStatus === 'COMPLETED' && styles.pillTextActive,
                ]}
              >
                Hoàn thành
              </CText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pillItem,
                subStatus === 'CANCELLED' && styles.pillItemActive,
              ]}
              activeOpacity={0.7}
              onPress={() => setSubStatus('CANCELLED')}
            >
              <CText
                style={[
                  styles.pillText,
                  subStatus === 'CANCELLED' && styles.pillTextActive,
                ]}
              >
                Huỷ
              </CText>
            </TouchableOpacity>
          </View>

          {/* Content List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {currentList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <IconX
                  type="ionicons"
                  name="clipboard-outline"
                  size={48}
                  color={colors.c98A2B3 || '#98A2B3'}
                />
                <CText style={styles.emptyText}>Chưa có công việc nào</CText>
              </View>
            ) : (
              currentList.map(job => (
                <React.Fragment key={job.id}>
                  {/* Mini Map Preview khi ca đang di chuyển (isMoving) */}
                  {subStatus === 'SCHEDULE' && job.isMoving && (
                    <View style={styles.mapContainer}>
                      <Image
                        source={images.common.mini_map}
                        style={styles.mapImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.openMapBtn}
                        activeOpacity={0.8}
                        onPress={() => handleOpenExternalMap(job.address)}
                      >
                        <CText style={styles.openMapText}>Xem bản đồ</CText>
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.jobCard}>
                    {/* Customer Header */}
                    <View style={styles.customerRow}>
                      <View style={styles.customerInfo}>
                        <Image
                          source={
                            job.customerAvatar || images.common.nurse_minh_hieu
                          }
                          style={styles.avatarImg}
                        />
                        <CText style={styles.customerName}>
                          {job.customerName}
                        </CText>
                      </View>

                      <View style={styles.customerActions}>
                        <TouchableOpacity
                          style={styles.circleIconBtn}
                          activeOpacity={0.7}
                          onPress={() => handleCall(job.customerPhone)}
                        >
                          <IconX
                            type="ionicons"
                            name="call"
                            size={17}
                            color={colors.white}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.circleIconBtn}
                          activeOpacity={0.7}
                          onPress={() =>
                            handleChat(job.customerName, job.customerAvatar)
                          }
                        >
                          <IconX
                            type="ionicons"
                            name="chatbubble-ellipses"
                            size={17}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Service Title & Auto Cancel Tag */}
                    <View style={styles.jobTitleRow}>
                      <CText style={styles.serviceTitle}>
                        {job.serviceTitle}
                      </CText>
                      {!!job.autoCancelTime && subStatus === 'REQUEST' && (
                        <View style={styles.autoCancelTag}>
                          <CText style={styles.autoCancelText}>
                            Tự động huỷ: {job.autoCancelTime}
                          </CText>
                        </View>
                      )}
                    </View>

                    {/* Note Box */}
                    {!!job.note &&
                      (job.note.includes('dị ứng') ? (
                        <View style={styles.customerNoteBox}>
                          <IconX
                            type="ionicons"
                            name="document-text-outline"
                            size={15}
                            color="#F04438"
                          />
                          <CText style={styles.customerNoteText}>
                            {job.note}
                          </CText>
                        </View>
                      ) : (
                        <View style={styles.customerNoteBoxNormal}>
                          <IconX
                            type="ionicons"
                            name="document-text-outline"
                            size={15}
                            color={colors.c98A2B3 || '#98A2B3'}
                          />
                          <CText style={styles.customerNoteTextNormal}>
                            {job.note}
                          </CText>
                        </View>
                      ))}

                    {/* Job Details */}
                    <View style={styles.jobInfoRow}>
                      <IconX
                        type="ionicons"
                        name="calendar-outline"
                        size={15}
                        color={colors.c344054 || '#344054'}
                      />
                      <CText style={styles.jobInfoText}>{job.date}</CText>
                    </View>

                    <View style={styles.jobInfoRow}>
                      <IconX
                        type="ionicons"
                        name="time-outline"
                        size={15}
                        color={
                          subStatus === 'SCHEDULE'
                            ? '#F79009'
                            : colors.c344054 || '#344054'
                        }
                      />
                      <CText
                        style={[
                          styles.jobInfoText,
                          subStatus === 'SCHEDULE' && {
                            color: '#F79009',
                            fontWeight: '500',
                          },
                        ]}
                      >
                        {job.time}
                      </CText>
                    </View>

                    <View style={styles.jobInfoRow}>
                      <IconX
                        type="ionicons"
                        name="location-outline"
                        size={15}
                        color={colors.c344054 || '#344054'}
                      />
                      <CText style={styles.jobInfoText}>{job.address}</CText>
                    </View>

                    {/* Amount Row */}
                    <View style={styles.amountRow}>
                      <CText style={styles.amountLabel}>
                        Tổng tiền nhận được
                      </CText>
                      <CText style={styles.amountValue}>{job.amount}</CText>
                    </View>

                    {/* Action Buttons: Từ chối | Chấp nhận (ở tab Yêu cầu) */}
                    {subStatus === 'REQUEST' && (
                      <View style={styles.cardActionRow}>
                        <TouchableOpacity
                          style={styles.rejectBtn}
                          activeOpacity={0.7}
                          onPress={() => handleOpenRejectModal(job.id)}
                        >
                          <CText style={styles.rejectBtnText}>Từ chối</CText>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.acceptBtn}
                          activeOpacity={0.7}
                          onPress={() => handleAcceptJob(job.id)}
                        >
                          <CText style={styles.acceptBtnText}>Chấp nhận</CText>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Action Buttons cho tab Lịch hẹn: Nếu đang di chuyển -> 1 nút "Xác nhận đã đến điểm hẹn", nếu chưa di chuyển -> 2 nút */}
                    {subStatus === 'SCHEDULE' &&
                      (job.isMoving ? (
                        <TouchableOpacity
                          style={styles.arriveBtn}
                          activeOpacity={0.8}
                          onPress={() => handleConfirmArrived(job.id)}
                        >
                          <CText style={styles.arriveBtnText}>
                            Xác nhận đã đến điểm hẹn
                          </CText>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.cardActionRow}>
                          <TouchableOpacity
                            style={styles.rejectBtn}
                            activeOpacity={0.7}
                            onPress={() => handleStartMoving(job.id)}
                          >
                            <CText style={styles.rejectBtnText}>
                              Bắt đầu di chuyển
                            </CText>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.acceptBtn}
                            activeOpacity={0.7}
                            onPress={() => handleConfirmArrived(job.id)}
                          >
                            <CText style={styles.acceptBtnText}>
                              Xác nhận đã đến
                            </CText>
                          </TouchableOpacity>
                        </View>
                      ))}
                  </View>
                </React.Fragment>
              ))
            )}
          </ScrollView>

      {/* Toast Banner Feedback */}
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

      {/* Reject Reason Modal Dialog */}
      <Modal
        visible={isRejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsRejectModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsRejectModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.dialogBox}>
                {/* Dialog Header */}
                <View style={styles.dialogHeader}>
                  <CText style={styles.dialogTitle}>Từ chối lịch hẹn</CText>
                  <TouchableOpacity
                    style={styles.dialogCloseBtn}
                    activeOpacity={0.7}
                    onPress={() => setIsRejectModalVisible(false)}
                  >
                    <IconX
                      type="ionicons"
                      name="close"
                      size={20}
                      color={colors.c344054 || '#344054'}
                    />
                  </TouchableOpacity>
                </View>

                <CText style={styles.dialogPrompt}>
                  Vui lòng chọn lý do từ chối lịch hẹn này:
                </CText>

                {/* Reasons Radio List */}
                {REJECT_REASONS.map((reason, index) => {
                  const isSelected = selectedReasonIndex === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.radioOptionRow}
                      activeOpacity={0.7}
                      onPress={() => setSelectedReasonIndex(index)}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <CText style={styles.radioLabel}>{reason}</CText>
                    </TouchableOpacity>
                  );
                })}

                {/* Optional input if "Khác" selected */}
                {selectedReasonIndex === 3 && (
                  <TextInput
                    style={styles.otherTextInput}
                    placeholder="Nhập lý do cụ thể..."
                    placeholderTextColor={colors.c98A2B3 || '#98A2B3'}
                    value={otherReasonText}
                    onChangeText={setOtherReasonText}
                  />
                )}

                <View style={styles.dialogDivider} />

                {/* Dialog Action Buttons */}
                <View style={styles.dialogBtnRow}>
                  <TouchableOpacity
                    style={styles.dialogBackBtn}
                    activeOpacity={0.7}
                    onPress={() => setIsRejectModalVisible(false)}
                  >
                    <CText style={styles.dialogBackBtnText}>Quay lại</CText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dialogConfirmBtn}
                    activeOpacity={0.8}
                    onPress={handleConfirmReject}
                  >
                    <CText style={styles.dialogConfirmBtnText}>
                      Xác nhận từ chối
                    </CText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Wrapper>
  );
};

export default PartnerWorkScreen;
