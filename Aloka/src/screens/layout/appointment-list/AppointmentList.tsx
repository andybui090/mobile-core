import React, { useState } from 'react';
import {
  FlatList,
  Linking,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';

interface UpcomingItem {
  id: string;
  type: 'upcoming';
  title: string;
  nurseName: string;
  expertCode: string;
  statusTitle: string;
  statusSubTitle: string;
  date: string;
  time: string;
  address: string;
  totalPrice: string;
  image: any;
}

interface CompletedItem {
  id: string;
  type: 'completed_pending_confirm' | 'completed_rebook';
  title: string;
  nurseName?: string;
  hospitalName?: string;
  date: string;
  time: string;
  address: string;
  image: any;
}

const TABS = ['Sắp diễn ra', 'Yêu cầu', 'Đã hoàn thành', 'Đã hủy'];

const UPCOMING_APPOINTMENTS: UpcomingItem[] = [
  {
    id: 'up_1',
    type: 'upcoming',
    title: 'Dịch vụ Nuôi sinh & Chăm sóc mẹ\nbé tại bệnh viện',
    nurseName: 'Bệnh viện FV',
    expertCode: 'CG_1805',
    statusTitle: 'Đang trên đường đến',
    statusSubTitle: 'Dự kiến đến nơi lúc 15:25',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    totalPrice: '219.000đ',
    image: (images.common as any).service_mom_baby || images.common.img_default,
  },
];

const COMPLETED_APPOINTMENTS: CompletedItem[] = [
  {
    id: 'comp_1',
    type: 'completed_pending_confirm',
    title: 'Dịch vụ Nuôi sinh & Chăm sóc mẹ\nbé tại bệnh viện',
    nurseName: 'Điều dưỡng Thúy Ngọc',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    image: (images.common as any).service_mom_baby || images.common.img_default,
  },
  {
    id: 'comp_2',
    type: 'completed_rebook',
    title: 'Dịch vụ Nuôi sinh & Chăm sóc mẹ\nbé tại bệnh viện',
    hospitalName: 'Bệnh viện FV',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    image: (images.common as any).service_mom_baby || images.common.img_default,
  },
];

type AppointmentItem = UpcomingItem | CompletedItem;

export const AppointmentList: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Sắp diễn ra');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCskhModal, setShowCskhModal] = useState(false);

  const handleReviewPress = () => {
    setShowSuccessModal(true);
  };

  const handleCallHotline = () => {
    Linking.openURL('tel:02835264818').catch(() => {});
  };

  const handleEmailHotline = () => {
    Linking.openURL('mailto:info@mcv.com.vn').catch(() => {});
  };

  const renderUpcomingCard = (item: UpcomingItem) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.serviceHeader}>
        <ImageHelper source={item.image} style={styles.serviceImage} resizeMode="cover" />
        <View style={styles.serviceInfo}>
          <CText style={styles.serviceTitle} numberOfLines={2}>
            {item.title}
          </CText>
          <CText style={styles.nurseName}>{item.nurseName}</CText>
        </View>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.actionLinkRow} activeOpacity={0.7}>
        <IconX type="ionicons" name="chatbubble-ellipses-outline" size={18} color="#14B8A6" />
        <CText style={styles.actionLinkText}>Liên hệ điều dưỡng</CText>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <IconX type="ionicons" name="calendar-outline" size={16} color="#667085" />
          <CText style={styles.metaText}>{item.date}</CText>
        </View>
        <View style={styles.metaRow}>
          <IconX type="ionicons" name="time-outline" size={16} color="#667085" />
          <CText style={styles.metaText}>{item.time}</CText>
        </View>
        <View style={styles.metaRow}>
          <IconX type="ionicons" name="location-outline" size={16} color="#667085" />
          <CText style={styles.metaText}>{item.address}</CText>
        </View>
      </View>

      <View style={styles.totalRow}>
        <CText style={styles.totalLabel}>Tổng thanh toán</CText>
        <CText style={styles.totalValue}>{item.totalPrice}</CText>
      </View>

      <View style={styles.cardActionsRow}>
        <TouchableOpacity
          style={styles.cskhBtn}
          activeOpacity={0.7}
          onPress={() => setShowCskhModal(true)}
        >
          <CText style={styles.cskhBtnText}>Liên hệ CSKH</CText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.7}>
          <CText style={styles.cancelBtnText}>Hủy lịch/Hoàn tiền</CText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCompletedCard = (item: CompletedItem) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.serviceHeader}>
        <ImageHelper source={item.image} style={styles.serviceImage} resizeMode="cover" />
        <View style={styles.serviceInfo}>
          <CText style={styles.serviceTitle} numberOfLines={2}>
            {item.title}
          </CText>
          <CText style={styles.nurseName}>
            {item.nurseName || item.hospitalName}
          </CText>
        </View>
      </View>

      {item.type === 'completed_pending_confirm' && (
        <>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionLinkRow} activeOpacity={0.7}>
            <IconX type="ionicons" name="chatbubble-ellipses-outline" size={18} color="#14B8A6" />
            <CText style={styles.actionLinkText}>Liên hệ điều dưỡng</CText>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.divider} />

      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <IconX type="ionicons" name="calendar-outline" size={16} color="#667085" />
          <CText style={styles.metaText}>{item.date}</CText>
        </View>
        <View style={styles.metaRow}>
          <IconX type="ionicons" name="time-outline" size={16} color="#667085" />
          <CText style={styles.metaText}>{item.time}</CText>
        </View>
        <View style={styles.metaRow}>
          <IconX type="ionicons" name="location-outline" size={16} color="#667085" />
          <CText style={styles.metaText}>{item.address}</CText>
        </View>
      </View>

      <View style={styles.cardActionsRow}>
        {item.type === 'completed_pending_confirm' ? (
          <>
            <TouchableOpacity
              style={styles.reviewBtn}
              activeOpacity={0.7}
              onPress={handleReviewPress}
            >
              <CText style={styles.reviewBtnText}>Đánh giá</CText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmDoneBtn} activeOpacity={0.8}>
              <CText style={styles.confirmDoneBtnText}>Xác nhận hoàn thành</CText>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.rebookBtn} activeOpacity={0.7}>
            <CText style={styles.rebookBtnText}>Đặt lịch lại</CText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const currentData: AppointmentItem[] =
    selectedTab === 'Đã hoàn thành' ? COMPLETED_APPOINTMENTS : UPCOMING_APPOINTMENTS;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Lịch hẹn</CText>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map(tab => {
          const isActive = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <CText style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </CText>
              {isActive && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      <FlatList<AppointmentItem>
        data={currentData}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          item.type === 'upcoming'
            ? renderUpcomingCard(item)
            : renderCompletedCard(item)
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Review Success Modal Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderPlaceholder} />
              <CText style={styles.modalTitle}>Đánh giá khóa học</CText>
              <TouchableOpacity
                onPress={() => setShowSuccessModal(false)}
                activeOpacity={0.7}
                style={styles.closeBtn}
              >
                <IconX type="ionicons" name="close" size={22} color="#667085" />
              </TouchableOpacity>
            </View>

            <CText style={styles.modalMessage}>Đánh giá của bạn đã được gửi đi</CText>

            <View style={styles.modalStarsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <IconX
                  key={star}
                  type="ionicons"
                  name="star"
                  size={32}
                  color={star <= 4 ? '#F59E0B' : '#EAECF0'}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowSuccessModal(false)}
              activeOpacity={0.8}
            >
              <CText style={styles.modalCloseBtnText}>Đóng</CText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CSKH Contact Modal Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCskhModal}
        onRequestClose={() => setShowCskhModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cskhModalContent}>
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Header */}
            <View style={styles.cskhHeader}>
              <TouchableOpacity
                onPress={() => setShowCskhModal(false)}
                activeOpacity={0.7}
                style={styles.cskhBackBtn}
              >
                <IconX type="ionicons" name="chevron-back" size={22} color="#1D2939" />
              </TouchableOpacity>
              <CText style={styles.cskhTitle}>Liên hệ bộ phận CSKH</CText>
              <View style={styles.cskhPlaceholder} />
            </View>

            <View style={styles.cskhDivider} />

            {/* Body Description */}
            <CText style={styles.cskhDesc}>
              Liên hệ qua số hotline hoặc gửi qua địa chỉ email sau để được tư vấn và xử lý vấn đề:
            </CText>

            {/* Contact Details List */}
            <View style={styles.cskhContactList}>
              <View style={styles.cskhContactRow}>
                <View style={styles.bulletDot} />
                <CText style={styles.cskhLabel}>Hotline </CText>
                <TouchableOpacity activeOpacity={0.7} onPress={handleCallHotline}>
                  <CText style={styles.cskhValueLink}>028 3526 4818</CText>
                </TouchableOpacity>
              </View>

              <View style={styles.cskhContactRow}>
                <View style={styles.bulletDot} />
                <CText style={styles.cskhLabel}>Hotline </CText>
                <TouchableOpacity activeOpacity={0.7} onPress={handleEmailHotline}>
                  <CText style={styles.cskhValueLink}>info@mcv.com.vn</CText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Button: Đã hiểu */}
            <TouchableOpacity
              style={styles.cskhConfirmBtn}
              onPress={() => setShowCskhModal(false)}
              activeOpacity={0.8}
            >
              <CText style={styles.cskhConfirmBtnText}>Đã hiểu</CText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
  placeholder: {
    width: 36,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 13.5,
    color: '#667085',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0080FF',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: '#0080FF',
    borderRadius: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 14,
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  serviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 19,
  },
  nurseName: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginVertical: 12,
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionLinkText: {
    fontSize: 13.5,
    color: '#344054',
    fontWeight: '500',
  },
  metaContainer: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12.5,
    color: '#475467',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 13.5,
    color: '#344054',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  cskhBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cskhBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  cancelBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDA29B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
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
    flex: 1.2,
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
  rebookBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  rebookBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  modalHeaderPlaceholder: {
    width: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  closeBtn: {
    padding: 2,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  modalStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  modalCloseBtn: {
    backgroundColor: '#0D9488',
    height: 46,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* CSKH Modal Styles */
  cskhModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D5DD',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  cskhHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cskhBackBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  cskhTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
  },
  cskhPlaceholder: {
    width: 32,
  },
  cskhDivider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginTop: 8,
    marginBottom: 16,
  },
  cskhDesc: {
    fontSize: 13.5,
    color: '#344054',
    lineHeight: 20,
    marginBottom: 14,
  },
  cskhContactList: {
    gap: 10,
    marginBottom: 28,
  },
  cskhContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475467',
    marginRight: 8,
  },
  cskhLabel: {
    fontSize: 13.5,
    color: '#475467',
  },
  cskhValueLink: {
    fontSize: 13.5,
    color: '#0080FF',
    fontWeight: '500',
  },
  cskhConfirmBtn: {
    backgroundColor: '#14B8A6',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cskhConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
