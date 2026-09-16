import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconX, ImageHelper } from '@/components';
import { formatMoneyVND } from '@/configs/common';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import ApiService from '@/services/api-base';
import { useCheckPaymentOnResume } from '@/hooks';
import { BookingCancelPolicyModal } from './BookingCancelPolicyModal';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAY_LABEL: Record<string, string> = {
  CN: 'Chủ nhật',
  T2: 'Thứ 2',
  T3: 'Thứ 3',
  T4: 'Thứ 4',
  T5: 'Thứ 5',
  T6: 'Thứ 6',
  T7: 'Thứ 7',
};

const formatTimePeriod = (time: string): string => {
  if (!time) return '';
  const [hStr] = time.split(':');
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return time;
  return `${time} ${h >= 12 ? 'PM' : 'AM'}`;
};

const addMinutes = (time: string, minutes: number): string => {
  const [hStr, mStr] = time.split(':');
  const totalMins = parseInt(hStr, 10) * 60 + parseInt(mStr || '0', 10) + minutes;
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return formatTimePeriod(
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
  );
};

const buildDateLabel = (selectedDay: any): string => {
  if (!selectedDay) return '';
  const dayLabel = DAY_LABEL[selectedDay.dayName] || selectedDay.dayName || '';
  const dateStr: string = selectedDay.dateStr || '';
  if (!dateStr) return dayLabel;
  return `${dayLabel}, Ngày ${dateStr}/${new Date().getFullYear()}`;
};

const buildTimeLabel = (selectedTimeSlot: any, durationMinutes: number): string => {
  if (!selectedTimeSlot?.time) return '';
  const start = formatTimePeriod(selectedTimeSlot.time);
  if (!durationMinutes) return start;
  const end = addMinutes(selectedTimeSlot.time, durationMinutes);
  return `${start} – ${end}`;
};

// ─── Component ───────────────────────────────────────────────────────────────

export const BookingConfirm: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const service          = route.params?.service || {};
  const selectedDay      = route.params?.selectedDay;
  const selectedTimeSlot = route.params?.selectedTimeSlot;
  const bookingAddress   = route.params?.bookingAddress || service?.address || '';

  // ── Derived values ────────────────────────────────────────────────────────
  const serviceTitle = service?.name;
  const nurseName    = service?.channel?.name || service?.doctor?.full_name;
  const address      = service?.address || service?.doctor?.address;
  const price        = Number(service?.price ?? service?.package?.price ?? 0);
  const isFree       = price === 0;
  const priceFormatted = isFree ? 'Miễn phí' : formatMoneyVND(price, '.');
  const thumbnail    = service?.thumbnail
    ? { uri: service.thumbnail }
    : images.common.img_default;

  const rawDuration =
    service?.duration ||
    service?.working_hours ||
    service?.hours ||
    service?.package?.duration ||
    null;
  // duration từ API có thể là phút (>= 24) hoặc giờ (< 24)
  const durationMinutes = rawDuration
    ? rawDuration >= 24 ? rawDuration : rawDuration * 60
    : 90;

  const dateLabel = buildDateLabel(selectedDay);
  const timeLabel = buildTimeLabel(selectedTimeSlot, durationMinutes);

  // ── State ─────────────────────────────────────────────────────────────────
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [isLoading, setIsLoading]             = useState(false);

  // Lưu orderId để check khi user quay lại app từ MoMo
  const pendingOrderId = useRef<string | null>(null);

  // ── useCheckPaymentOnResume (copy pattern từ drcarely) ────────────────────
  // Khi user quay lại app sau khi mở MoMo, gọi API check trạng thái thanh toán
  useCheckPaymentOnResume(async () => {
    const orderId = pendingOrderId.current;
    if (!orderId) return;

    try {
      const res: any = await ApiService.getPaymentStatus(orderId);
      if (!res.ok) return;

      const status: string =
        res.data?.result?.status ||
        res.data?.status ||
        '';

      if (status === 'paid' || status === 'success' || status === 'completed') {
        pendingOrderId.current = null;
        Alert.alert(
          'Thanh toán thành công',
          'Đơn hàng của bạn đã được xác nhận.',
          [
            {
              text: 'Xem lịch hẹn',
              onPress: () => navigation.navigate('AppointmentTab', { idxTab: 0 }),
            },
          ],
        );
      } else if (status === 'failed' || status === 'cancelled') {
        pendingOrderId.current = null;
        Alert.alert('Thanh toán thất bại', 'Giao dịch không thành công. Vui lòng thử lại.');
      }
      // status === 'pending' → chưa xử lý, giữ nguyên để check lần sau
    } catch (_) {
      // Bỏ qua lỗi network khi check resume
    }
  });

  // ── Payment handler ───────────────────────────────────────────────────────

  const handlePayNow = async () => {
    if (isLoading) return;
    if (!selectedDay || !selectedTimeSlot) {
      Alert.alert('Thông báo', 'Vui lòng chọn ngày và giờ');
      return;
    }
    setIsLoading(true);
    try {
      const packageId = service?._id || service?.id || String(service?.package_id || '');

      // ── Bước 1: Mua gói → POST /orders/packages (giống doctor-mobile-app buyPackage) ──
      const buyRes: any = await ApiService.createOrder({
        package_id:     packageId,
        payment:        'momo',    // doctor-mobile-app luôn gửi 'momo' kể cả gói 0đ
        amount:         price,
      });

      let orderId: string =
        buyRes?.data?.result?.order_id ||
        buyRes?.data?.result?._id      ||
        buyRes?.data?.result?.id       ||
        buyRes?.data?.order_id         ||
        buyRes?.data?._id              ||
        buyRes?.data?.id               || '';

      // Lỗi: gói 0đ đã mua lần trước → message chứa order_id cũ
      if (!buyRes?.ok) {
        const errMsg: string = buyRes?.data?.message || buyRes?.data?.error || '';
        const existingOrderId = errMsg.match(/order_id[:\s"]*([a-zA-Z0-9-]+)/)?.[1];

        if (existingOrderId && isFree) {
          // Dùng order_id cũ để đặt lịch tiếp (lần sau với gói 0đ)
          orderId = existingOrderId;
        } else {
          throw new Error(errMsg || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
        }
      }

      // ── Bước 2a (0đ): Đặt lịch thực sự → POST /appointments ──────────────
      if (isFree) {
        await _bookAppointment(orderId);
        return;
      }

      // ── Bước 2b (có phí): Gọi MoMo API → nhận deeplink ──────────────────
      if (!orderId) throw new Error('Không nhận được mã đơn hàng từ server.');

      const momoRes: any = await ApiService.payWithMomo({
        order_id: orderId,
        amount:   price,
      });

      if (!momoRes?.ok) {
        throw new Error(momoRes?.data?.message || 'Không thể kết nối MoMo. Vui lòng thử lại.');
      }

      const deeplink: string =
        momoRes.data?.result?.deeplink  ||
        momoRes.data?.result?.payUrl    ||
        momoRes.data?.deeplink          ||
        momoRes.data?.payUrl            || '';

      const webUrl: string =
        momoRes.data?.result?.qrCodeUrl ||
        momoRes.data?.result?.shortLink ||
        deeplink;

      if (!deeplink) throw new Error('Không nhận được link thanh toán MoMo.');

      // Lưu orderId → useCheckPaymentOnResume dùng sau khi quay lại từ MoMo
      pendingOrderId.current = orderId;

      const canOpen = await Linking.canOpenURL(deeplink);
      await Linking.openURL(canOpen ? deeplink : webUrl);

    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Đặt lịch hẹn sau khi có order_id (POST /appointments) ─────────────────
  // Giống bookService() trong doctor-mobile-app
  const _bookAppointment = async (orderId: string) => {
    try {
      const channelId  = service?.channel_id || service?.channel?.id || '';
      const doctorId   = service?.user_id || service?.doctor?.id || service?.channel?.user_id || '';
      const categoryId = service?.category_id ||
        (Array.isArray(service?.categories) && service.categories[0]?.id) || '';

      // Parse date + time thành DateTime
      const [dd, mm] = (selectedDay.dateStr || '').split('/').map(Number);
      const year = new Date().getFullYear();
      const [hh, mnt] = (selectedTimeSlot.time || '').split(':').map(Number);
      const dt = new Date(year, (mm || 1) - 1, dd || 1, hh || 0, mnt || 0, 0, 0);

      const bookingPayload: any = {
        package_id:  service?._id || service?.id || String(service?.package_id || ''),
        order_id:    orderId,
        channel_id:  channelId,
        doctor_id:   doctorId,
        category_id: categoryId,
        date:        dt,
        duration:    Number(service?.time_package || service?.duration || 30),
        type:        service?.is_book_service == 0 ? 'ONLINE' : 'OFFLINE',
        address:     bookingAddress || service?.address || '',
        note:        '',
      };

      const bookRes: any = await ApiService.updateBookingStatus(bookingPayload);

      if (bookRes?.ok || bookRes?.status === 200 || bookRes?.status === 201) {
        Alert.alert(
          '🎉 Đặt lịch thành công',
          'Lịch hẹn của bạn đã được xác nhận. Bạn sẽ nhận được kết quả trong 12 giờ.',
          [
            {
              text: 'Xem lịch hẹn',
              onPress: () => {
                navigation.popToTop?.();
                navigation.navigate('AppointmentTab', { idxTab: 0 });
              },
            },
            { text: 'Đóng', onPress: () => navigation.goBack() },
          ],
        );
      } else {
        const msg = bookRes?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.';
        Alert.alert('Lỗi đặt lịch', msg);
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Đặt lịch thất bại.');
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Xem lại và xác nhận</CText>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Thông tin ── */}
        <CText style={styles.sectionHeading}>Thông tin</CText>
        <View style={styles.card}>
          <View style={styles.serviceRow}>
            <ImageHelper
              source={thumbnail}
              style={styles.serviceThumbnail}
              resizeMode="cover"
            />
            <View style={styles.serviceDetails}>
              <CText style={styles.serviceTitle} numberOfLines={2}>
                {serviceTitle}
              </CText>
              <CText style={styles.nurseName}>{nurseName}</CText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoMetaList}>
            {!!dateLabel && (
              <View style={styles.metaRow}>
                <IconX type="ionicons" name="calendar-outline" size={17} color="#667085" />
                <CText style={styles.metaText}>{dateLabel}</CText>
              </View>
            )}
            {!!timeLabel && (
              <View style={styles.metaRow}>
                <IconX type="ionicons" name="time-outline" size={17} color="#667085" />
                <CText style={styles.metaText}>{timeLabel}</CText>
              </View>
            )}
            {!!address && (
              <View style={styles.metaRow}>
                <IconX type="ionicons" name="location-outline" size={17} color="#667085" />
                <CText style={styles.metaText}>{address}</CText>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.viewDetailsBtn}
            onPress={() => setShowPolicyModal(true)}
            activeOpacity={0.7}
          >
            <CText style={styles.viewDetailsBtnText}>Xem chi tiết công việc</CText>
          </TouchableOpacity>
        </View>

        {/* ── Mã giảm giá ── */}
        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
          <View style={styles.actionCardLeft}>
            <IconX type="ionicons" name="ticket-outline" size={20} color="#344054" />
            <CText style={styles.actionCardTitle}>Mã giảm giá</CText>
          </View>
          <CText style={styles.promoActionText}>Chọn hoặc nhập mã</CText>
        </TouchableOpacity>

        {/* ── Phương thức thanh toán (ẩn khi miễn phí) ── */}
        {!isFree && (
          <>
            <CText style={styles.sectionHeading}>Phương thức thanh toán</CText>
            <View style={styles.card}>
              <View style={styles.paymentRow}>
                <View style={styles.paymentLeft}>
                  <View style={styles.momoBadge}>
                    <CText style={styles.momoText}>mo{'\n'}mo</CText>
                  </View>
                  <CText style={styles.paymentName}>Ví điện tử MoMo</CText>
                </View>
                <View style={styles.radioCircleActive}>
                  <View style={styles.radioDot} />
                </View>
              </View>
            </View>
          </>
        )}

        {/* ── Chi tiết thanh toán ── */}
        <CText style={styles.sectionHeading}>Chi tiết thanh toán</CText>
        <View style={styles.card}>
          <View style={styles.receiptTotalRow}>
            <CText style={styles.receiptTotalLabel}>Thành tiền</CText>
            <CText style={[styles.receiptTotalValue, isFree && styles.receiptFreeValue]}>
              {priceFormatted}
            </CText>
          </View>
          <View style={styles.securityRow}>
            <IconX type="ionicons" name="lock-closed-outline" size={13} color="#667085" />
            <CText style={styles.securityText}>
              Chúng tôi cam kết bảo mật mọi thông tin của bạn khi mua gói dịch vụ.
            </CText>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.payNowBtn, isLoading && styles.payNowBtnDisabled]}
          activeOpacity={0.8}
          onPress={handlePayNow}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator size="small" color="#FFFFFF" />
            : <CText style={styles.payNowBtnText}>
                {isFree ? 'Xác nhận đặt lịch' : 'Thanh toán ngay'}
              </CText>
          }
        </TouchableOpacity>
      </View>

      <BookingCancelPolicyModal
        visible={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        onConfirm={() => setShowPolicyModal(false)}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    height: 52, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EAECF0',
  },
  headerBtn:    { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle:  { fontSize: 16, fontWeight: '700', color: '#101828' },
  scrollContent: { padding: 16, paddingBottom: 110 },
  sectionHeading: {
    fontSize: 15, fontWeight: '700', color: '#101828',
    marginTop: 10, marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 14, marginBottom: 6,
    borderWidth: 1, borderColor: '#EAECF0',
  },
  serviceRow:     { flexDirection: 'row' },
  serviceThumbnail: { width: 54, height: 54, borderRadius: 8, backgroundColor: '#F2F4F7' },
  serviceDetails: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  serviceTitle:   { fontSize: 13.5, fontWeight: '600', color: '#101828', lineHeight: 19 },
  nurseName:      { fontSize: 12, color: '#98A2B3', marginTop: 4 },
  divider:        { height: 1, backgroundColor: '#F2F4F7', marginVertical: 12 },
  infoMetaList:   { gap: 8 },
  metaRow:        { flexDirection: 'row', alignItems: 'center' },
  metaText:       { fontSize: 13, color: '#344054', marginLeft: 8, flex: 1 },
  viewDetailsBtn: {
    borderWidth: 1.2, borderColor: '#14B8A6', borderRadius: 8,
    paddingVertical: 10, alignItems: 'center', marginTop: 14, backgroundColor: '#FFFFFF',
  },
  viewDetailsBtnText: { fontSize: 13.5, color: '#14B8A6', fontWeight: '600' },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14,
    marginTop: 4, marginBottom: 6, borderWidth: 1, borderColor: '#EAECF0',
  },
  actionCardLeft:  { flexDirection: 'row', alignItems: 'center' },
  actionCardTitle: { fontSize: 13.5, fontWeight: '500', color: '#101828', marginLeft: 10 },
  promoActionText: { fontSize: 13.5, color: '#14B8A6', fontWeight: '500' },
  paymentRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 4,
  },
  paymentLeft: { flexDirection: 'row', alignItems: 'center' },
  momoBadge: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#A50064', alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  momoText: {
    color: '#FFFFFF', fontSize: 10, fontWeight: '800',
    lineHeight: 11, textAlign: 'center',
  },
  paymentName:      { fontSize: 14, color: '#344054', fontWeight: '500' },
  radioCircleActive: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#14B8A6',
    alignItems: 'center', justifyContent: 'center',
  },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#14B8A6' },
  receiptTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  receiptTotalLabel: { fontSize: 14, fontWeight: '500', color: '#101828' },
  receiptTotalValue: { fontSize: 15, fontWeight: '700', color: '#101828' },
  receiptFreeValue:  { color: '#14B8A6' },
  securityRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  securityText: { fontSize: 12, color: '#667085', flex: 1, lineHeight: 17 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EAECF0',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24,
  },
  payNowBtn: {
    backgroundColor: '#14B8A6', height: 50,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  payNowBtnDisabled: { opacity: 0.7 },
  payNowBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
