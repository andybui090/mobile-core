import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import { BookingCancelPolicyModal } from './BookingCancelPolicyModal';

interface PaymentMethod {
  id: 'momo' | 'vnpay' | 'cash';
  name: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'momo', name: 'Ví điện tử MoMo' },
  { id: 'vnpay', name: 'Ví điện tử VNPay' },
  { id: 'cash', name: 'Thanh toán trực tiếp' },
];

export const BookingConfirm: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<'momo' | 'vnpay' | 'cash'>('momo');
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const renderPaymentIcon = (id: string) => {
    if (id === 'momo') {
      return (
        <View style={styles.momoBadge}>
          <CText style={styles.momoText}>mo{'\n'}mo</CText>
        </View>
      );
    }
    if (id === 'vnpay') {
      return (
        <View style={styles.vnpayBadge}>
          <View style={styles.vnpayTopTriangle} />
          <View style={styles.vnpayBottomTriangle} />
        </View>
      );
    }
    return (
      <View style={styles.cashBadge}>
        <IconX type="ionicons" name="cash-outline" size={20} color="#344054" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Xem lại và xác nhận</CText>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <IconX type="ionicons" name="share-social-outline" size={22} color="#344054" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Thông tin */}
        <CText style={styles.sectionHeading}>Thông tin</CText>
        <View style={styles.card}>
          <View style={styles.serviceRow}>
            <ImageHelper
              source={images.common.img_default}
              style={styles.serviceThumbnail}
              resizeMode="cover"
            />
            <View style={styles.serviceDetails}>
              <CText style={styles.serviceTitle} numberOfLines={2}>
                Dịch vụ Nuôi sinh & Chăm sóc mẹ bé tại bệnh viện
              </CText>
              <CText style={styles.nurseName}>Điều dưỡng Thúy Ngọc</CText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoMetaList}>
            <View style={styles.metaRow}>
              <IconX type="ionicons" name="calendar-outline" size={17} color="#667085" />
              <CText style={styles.metaText}>Thứ 4, Ngày 25/01/2026</CText>
            </View>
            <View style={styles.metaRow}>
              <IconX type="ionicons" name="time-outline" size={17} color="#667085" />
              <CText style={styles.metaText}>15:30 PM - 17:00 PM</CText>
            </View>
            <View style={styles.metaRow}>
              <IconX type="ionicons" name="location-outline" size={17} color="#667085" />
              <CText style={styles.metaText}>44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM</CText>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewDetailsBtn}
            onPress={() => setShowPolicyModal(true)}
            activeOpacity={0.7}
          >
            <CText style={styles.viewDetailsBtnText}>Xem chi tiết công việc</CText>
          </TouchableOpacity>
        </View>

        {/* Section 2: Phương thức thanh toán */}
        <CText style={styles.sectionHeading}>Phương thức thanh toán</CText>
        <View style={styles.card}>
          {PAYMENT_METHODS.map((method, index) => {
            const isSelected = selectedPayment === method.id;
            const isLast = index === PAYMENT_METHODS.length - 1;
            return (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedPayment(method.id)}
                style={[styles.paymentRow, !isLast && styles.rowBorderBottom]}
                activeOpacity={0.7}
              >
                <View style={styles.paymentLeft}>
                  {renderPaymentIcon(method.id)}
                  <CText style={styles.paymentName}>{method.name}</CText>
                </View>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 3: Mã giảm giá */}
        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
          <View style={styles.actionCardLeft}>
            <IconX type="ionicons" name="ticket-outline" size={20} color="#344054" />
            <CText style={styles.actionCardTitle}>Mã giảm giá</CText>
          </View>
          <CText style={styles.promoActionText}>Chọn hoặc nhập mã</CText>
        </TouchableOpacity>

        {/* Section 4: Lời nhắn/Ghi chú */}
        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
          <View style={styles.actionCardLeft}>
            <IconX type="ionicons" name="chatbox-outline" size={20} color="#344054" />
            <CText style={styles.actionCardTitle}>Lời nhắn/Ghi chú</CText>
          </View>
          <IconX type="ionicons" name="chevron-forward" size={18} color="#667085" />
        </TouchableOpacity>

        {/* Section 5: Chi tiết thanh toán */}
        <CText style={styles.sectionHeading}>Chi tiết thanh toán</CText>
        <View style={styles.card}>
          <View style={styles.receiptRow}>
            <CText style={styles.receiptLabel}>Giá gốc</CText>
            <CText style={styles.receiptValue}>199.000đ/Giờ</CText>
          </View>
          <View style={styles.receiptRow}>
            <CText style={styles.receiptLabel}>Tổng giờ</CText>
            <CText style={styles.receiptValue}>2 giờ</CText>
          </View>
          <View style={styles.receiptRow}>
            <CText style={styles.receiptLabel}>Giảm giá</CText>
            <CText style={styles.discountValue}>10.000đ</CText>
          </View>
          <View style={styles.receiptRow}>
            <CText style={styles.receiptLabel}>Giá sau khuyến mãi</CText>
            <CText style={styles.afterDiscountValue}>189.000đ</CText>
          </View>
          <View style={styles.receiptRow}>
            <CText style={styles.receiptLabel}>Phụ phí (nếu có)</CText>
            <CText style={styles.receiptValue}>0đ</CText>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptTotalRow}>
            <CText style={styles.receiptTotalLabel}>Tổng thanh toán</CText>
            <CText style={styles.receiptTotalValue}>189.000đ</CText>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.payNowBtn} activeOpacity={0.8}>
          <CText style={styles.payNowBtnText}>Thanh toán ngay</CText>
        </TouchableOpacity>
      </View>

      {/* Cancel Policy Modal */}
      <BookingCancelPolicyModal
        visible={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        onConfirm={() => setShowPolicyModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  headerBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  serviceRow: {
    flexDirection: 'row',
  },
  serviceThumbnail: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#F2F4F7',
  },
  serviceDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 19,
  },
  nurseName: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginVertical: 12,
  },
  infoMetaList: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#344054',
    marginLeft: 8,
    flex: 1,
  },
  viewDetailsBtn: {
    borderWidth: 1.2,
    borderColor: '#14B8A6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    backgroundColor: '#FFFFFF',
  },
  viewDetailsBtnText: {
    fontSize: 13.5,
    color: '#14B8A6',
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  momoBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#A50064',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  momoText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    lineHeight: 9,
    textAlign: 'center',
  },
  vnpayBadge: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  vnpayTopTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ED1C24',
    marginBottom: 1,
  },
  vnpayBottomTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#005BAA',
  },
  cashBadge: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  paymentName: {
    fontSize: 13.5,
    color: '#344054',
    fontWeight: '500',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#98A2B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#14B8A6',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#14B8A6',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCardTitle: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#101828',
    marginLeft: 10,
  },
  promoActionText: {
    fontSize: 13.5,
    color: '#14B8A6',
    fontWeight: '500',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptLabel: {
    fontSize: 13,
    color: '#475467',
  },
  receiptValue: {
    fontSize: 13,
    color: '#101828',
    fontWeight: '500',
  },
  discountValue: {
    fontSize: 13,
    color: '#F04438',
    fontWeight: '600',
  },
  afterDiscountValue: {
    fontSize: 13,
    color: '#14B8A6',
    fontWeight: '600',
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptTotalLabel: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#101828',
  },
  receiptTotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  payNowBtn: {
    backgroundColor: '#14B8A6',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
