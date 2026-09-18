import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconX, hideLoading, showLoading } from '@/components';
import { homeTabRoute } from '@/constants';
import { CText } from '@/utils';
import { useAppSelector } from '@/redux/store/customReduxHook';
import ApiService from '@/services/api-base';
import ModalSearchAddress, { LocationItem } from './ModalSearchAddress';

interface DayItem { id: string; dayName: string; dateStr: string; dateObj: Date; }
interface TimeSlotItem { id: string; time: string; available: boolean; }
type TimeWindow = { from: string; to: string };

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// JS getDay() -> server schedule_day_* (2=T2..8=CN)
const JS_DAY_TO_SERVER: Record<number, number> = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 0: 8 };

interface ParsedSchedule {
  dayFrom: Date | null; dayTo: Date | null;
  workingDays: Record<number, boolean>;
  scheduleExcept: number[];
  windows: TimeWindow[];
}

const parseSchedules = (schedules: any[]): ParsedSchedule => {
  const result: ParsedSchedule = { dayFrom: null, dayTo: null, workingDays: {}, scheduleExcept: [], windows: [] };
  if (!Array.isArray(schedules)) return result;
  const timeFroms: Record<number, string> = {};
  const timeTos: Record<number, string> = {};
  schedules.forEach((item: any) => {
    if (item.day_from) result.dayFrom = new Date(item.day_from);
    if (item.day_to) result.dayTo = new Date(item.day_to);
    if (item.schedule_except) {
      result.scheduleExcept = String(item.schedule_except).split(',').map(Number).filter(n => !isNaN(n));
    }
    for (let d = 2; d <= 8; d++) {
      const key = `schedule_day_${d}`;
      if (key in item) result.workingDays[d] = Boolean(item[key]);
    }
    const tfKey = Object.keys(item).find(k => k.startsWith('time_from'));
    const ttKey = Object.keys(item).find(k => k.startsWith('time_to'));
    if (tfKey) { const i = Number(tfKey.replace('time_from', '')); timeFroms[i] = item[tfKey]; }
    if (ttKey) { const i = Number(ttKey.replace('time_to', '')); timeTos[i] = item[ttKey]; }
  });
  const idxs = Array.from(new Set([...Object.keys(timeFroms), ...Object.keys(timeTos)].map(Number))).sort((a, b) => a - b);
  idxs.forEach(i => { if (timeFroms[i] && timeTos[i]) result.windows.push({ from: timeFroms[i], to: timeTos[i] }); });
  return result;
};

function addMins(date: Date, mins: number): Date {
  const d = new Date(date); d.setMinutes(d.getMinutes() + mins); return d;
}
function fmtHM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
function parseHM(hm: string) { const [h, m] = hm.split(':').map(Number); return { h: h || 0, m: m || 0 }; }

function buildSlotsForDate(date: Date, windows: TimeWindow[], step: number, brk: number, booked: string[]): TimeSlotItem[] {
  const totalStep = (step || 30) + (brk || 0);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const map = new Map<string, TimeSlotItem>();
  let idx = 0;
  windows.forEach(w => {
    const { h: fh, m: fm } = parseHM(w.from); const { h: th, m: tm } = parseHM(w.to);
    const start = new Date(date); start.setHours(fh, fm, 0, 0);
    const end = new Date(date); end.setHours(th, tm, 0, 0);
    for (let t = new Date(start); t < end; t = addMins(t, totalStep)) {
      const time = fmtHM(t);
      const isPast = isToday && t.getTime() <= now.getTime();
      if (!map.has(time)) map.set(time, { id: String(idx++), time, available: !isPast && !booked.includes(time) });
    }
  });
  return Array.from(map.values()).sort((a, b) => a.time > b.time ? 1 : -1);
}

function buildValidDays(schedule: ParsedSchedule, max = 14): DayItem[] {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const rangeEnd = schedule.dayTo ?? addMins(today, 60 * 24 * max);
  const hasWD = Object.values(schedule.workingDays).some(v => v);
  const days: DayItem[] = [];
  for (let i = 0; days.length < 7 && i < max; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    if (d > rangeEnd) break;
    if (schedule.dayFrom && d < schedule.dayFrom) continue;
    if (hasWD && schedule.workingDays[JS_DAY_TO_SERVER[d.getDay()]] === false) continue;
    if (schedule.scheduleExcept.includes(d.getDate())) continue;
    const dd = String(d.getDate()).padStart(2, '0'), mm = String(d.getMonth() + 1).padStart(2, '0');
    days.push({ id: String(i), dayName: DAY_NAMES[d.getDay()], dateStr: `${dd}/${mm}`, dateObj: new Date(d) });
  }
  if (days.length === 0) {
    for (let i = 0; i < 7; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      const dd = String(d.getDate()).padStart(2, '0'), mm = String(d.getMonth() + 1).padStart(2, '0');
      days.push({ id: String(i), dayName: DAY_NAMES[d.getDay()], dateStr: `${dd}/${mm}`, dateObj: new Date(d) });
    }
  }
  return days;
}


const fmtDuration = (dur: any): string => {
  if (!dur && dur !== 0) return ''; const n = Number(dur); if (isNaN(n)) return String(dur);
  if (n < 60) return `${n} phút`; const h = Math.floor(n / 60), m = n % 60; return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
};

// ── Modal thong bao 1 nut (giong ModalAgreeFormCarely cua doctor-mobile-app - Anh 2) ──
interface ModalAgreeFormProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  msg?: string;
}

const ModalAgreeFormCarely: React.FC<ModalAgreeFormProps> = ({
  visible,
  onClose,
  title = 'Mua gói',
  msg = '',
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <Pressable style={modalStyles.container} onPress={e => e.stopPropagation()}>
          {!!title && <CText style={modalStyles.title}>{title}</CText>}
          <CText style={modalStyles.content}>{msg}</CText>
          <TouchableOpacity style={modalStyles.button} onPress={onClose} activeOpacity={0.8}>
            <CText style={modalStyles.buttonText}>Đã hiểu</CText>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ── Modal xac nhan thanh cong 2 nut (giong ConfirmModal cua doctor-mobile-app - Anh 3) ──
interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  message,
  onCancel,
  onConfirm,
  cancelText = 'Đóng',
  confirmText = 'Đi đến lịch hẹn',
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <CText style={modalStyles.confirmMessage}>{message}</CText>
          <View style={modalStyles.actions}>
            <TouchableOpacity
              style={[modalStyles.actionButton, modalStyles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <CText style={modalStyles.cancelText}>{cancelText}</CText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.actionButton, modalStyles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <CText style={modalStyles.confirmText}>{confirmText}</CText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const BookingSchedule: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const service = route.params?.service ?? {};

  const channelId: string = service?.channel_id || '';
  const rawStep: number = Number(service?.time_package) || 0;
  const rawDuration: number = Number(service?.duration || 0);
  const stepMins: number = rawStep > 0
    ? rawStep
    : rawDuration > 0
      ? (rawDuration < 24 ? rawDuration * 60 : rawDuration)
      : 30;
  const brkMins: number = Number(service?.time_break) || 0;
  const durationLabel = fmtDuration(stepMins);

  const price: number = Number(service?.price ?? 0);
  const isFree: boolean = price === 0;
  const packageId: string = String(service?.id || '');

  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [days, setDays] = useState<DayItem[]>([]);
  const [selectedDayId, setSelectedDayId] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlotItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<ParsedSchedule | null>(null);

  const { profileData } = useAppSelector(state => state.profileReducer);
  const userInfo = (profileData as any)?.data?.result || {};
  const [channelData, setChannelData] = useState<any>(route.params?.channelData || null);

  // Modals state - giong doctor-mobile-app (Anh 2 & Anh 3)
  const [agreePopup, setAgreePopup] = useState<{
    visible: boolean;
    title: string;
    msg: string;
  }>({
    visible: false,
    title: '',
    msg: '',
  });
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Address state - de trong cho user chon
  const [bookingAddress, setBookingAddress] = useState<LocationItem | null>(null);
  const [showAddress, setShowAddress] = useState(false);

  // Bước 1: fetch channel schedules + booked appointments (giống doctor-mobile-app)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let parsed: ParsedSchedule = { dayFrom: null, dayTo: null, workingDays: {}, scheduleExcept: [], windows: [] };
      try {
        if (channelId) {
          const [chRes, apptRes]: any[] = await Promise.all([
            ApiService.getChannelDetail(channelId),
            ApiService.getChannelAppointmentTime(channelId),
          ]);
          if (chRes?.ok && chRes.data?.result) {
            setChannelData(chRes.data.result);
            if (chRes.data.result.schedules) {
              parsed = parseSchedules(chRes.data.result.schedules);
            }
          }
          if (apptRes?.ok) {
            const items: any[] = apptRes.data?.result?.items || [];
            setBookedTimes(items.map((b: any) => b.time || b.start_time || b.time_from || '').filter(Boolean));
          }
        } else if (service?.schedules) {
          parsed = parseSchedules(Array.isArray(service.schedules) ? service.schedules : []);
        }
      } catch { }
      const validDays = buildValidDays(parsed);
      setSchedule(parsed);
      setDays(validDays);
      setSelectedDayId(validDays[0]?.id ?? '');
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  // Bước 2: generate time slots khi ngày/schedule/booked thay đổi
  const genSlots = useCallback((dayId: string, curDays: DayItem[], curBooked: string[], curSched: ParsedSchedule | null) => {
    const day = curDays.find(d => d.id === dayId);
    if (!day) { setTimeSlots([]); return; }
    const slots = buildSlotsForDate(day.dateObj, curSched?.windows ?? [], stepMins, brkMins, curBooked);
    setTimeSlots(slots);
    setSelectedSlotId(slots.find(s => s.available)?.id ?? null);
  }, [stepMins, brkMins]);

  useEffect(() => {
    if (days.length > 0 && selectedDayId) genSlots(selectedDayId, days, bookedTimes, schedule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, bookedTimes, schedule]);

  const handleSelectDay = useCallback((dayId: string) => {
    setSelectedDayId(dayId);
    genSlots(dayId, days, bookedTimes, schedule);
  }, [days, bookedTimes, schedule, genSlots]);

  // ── handleConfirm: giống doctor-mobile-app ──────────────────────────────
  // 0đ → xử lý thẳng (buy + book appointment), có phí → navigate sang BookingConfirm
  const handleConfirm = async () => {
    const selectedDay = days.find(d => d.id === selectedDayId);
    const selectedTimeSlot = timeSlots.find(s => s.id === selectedSlotId);
    if (!selectedDay || !selectedTimeSlot) {
      Alert.alert('Thông báo', 'Vui lòng chọn ngày và giờ');
      return;
    }
    if (!bookingAddress?.text) {
      Alert.alert('Thông báo', 'Vui lòng chọn địa chỉ');
      return;
    }
    if (!isFree) {
      // Có phí → navigate sang BookingConfirm để thanh toán
      navigation.navigate(homeTabRoute.bookingConfirm, {
        service,
        selectedDay,
        selectedTimeSlot,
        bookingAddress: bookingAddress.text,
      });
      return;
    }
    // Gói 0đ: xử lý thẳng như doctor-mobile-app
    if (isBooking) return;
    setIsBooking(true);
    showLoading();
    try {
      // Bước 1: Mua gói → POST /orders/packages { package_id, payment: 'MoMo' }
      // Giống hệt doctor-mobile-app: postBuyPackageFreeChannel({ package_id: id, payment: PaymentTypes.momo })
      const buyRes: any = await ApiService.buyPackageFree({
        package_id: packageId,
        payment: 'MoMo',   // PaymentTypes.momo = 'MoMo' trong doctor-mobile-app
      });

      console.log('🚀 ~ buyPackageFree result:', buyRes?.status, buyRes?.data);

      const buyOk = buyRes?.ok || buyRes?.status === 200 || buyRes?.status === 201;

      // Lỗi mua gói
      if (!buyOk) {
        const errorsArr: any[] = buyRes?.data?.errors || [];
        const isExisted =
          errorsArr.some((e: any) => String(e?.msg).includes('đã tồn tại')) ||
          JSON.stringify(buyRes?.data || '').includes('đã tồn tại');

        if (isExisted) {
          setAgreePopup({
            visible: true,
            title: 'Mua gói',
            msg: 'Gói miễn phí này chỉ áp dụng một lần cho mỗi người dùng.',
          });
          return;
        }

        const firstMsg = errorsArr[0]?.msg || buyRes?.data?.message || 'Có lỗi xảy ra!';
        setAgreePopup({
          visible: true,
          title: 'Mua gói',
          msg: firstMsg,
        });
        return;
      }

      const orderId: string =
        buyRes?.data?.result?.order_id ||
        buyRes?.data?.result?.id ||
        buyRes?.data?.order_id ||
        '';

      const { h, m } = parseHM(selectedTimeSlot.time);
      const dt = new Date(selectedDay.dateObj);
      dt.setHours(h, m, 0, 0);

      const channelIdVal = channelData?.id || channelId;
      const doctorId = channelData?.owner_id || service?.user_id || '';
      const categoryId = channelData?.categories?.[0]?.id || service?.parent_id || '';

      // Bước 2: Đặt lịch → POST /appointments
      const bookRes: any = await ApiService.bookAppointment({
        package_id:  packageId,
        order_id:    orderId,
        channel_id:  channelIdVal,
        doctor_id:   doctorId,
        category_id: categoryId,
        date:        dt,
        duration:    stepMins,
        full_name:   userInfo?.full_name || '',
        phone:       userInfo?.phone || '',
        type:        service?.is_book_service === 0 ? 'ONLINE' : 'OFFLINE',
        address:     bookingAddress.text,
        note:        '',
      });

      console.log('🚀 ~ bookAppointment result:', bookRes?.status, bookRes?.data);

      if (bookRes?.ok || bookRes?.status === 200 || bookRes?.status === 201) {
        setSuccessModalVisible(true);
      } else {
        const errorsArr: any[] = bookRes?.data?.errors || [];
        const msg = errorsArr.map((e: any) => e.msg).join(', ')
          || bookRes?.data?.message || 'Có lỗi xảy ra!';
        setAgreePopup({
          visible: true,
          title: 'Đặt lịch',
          msg,
        });
      }
    } catch (err: any) {
      console.log('❌ [handleConfirm] catch error:', err);
      const msg: string = err?.message || '';
      if (msg.includes('đã tồn tại')) {
        setAgreePopup({
          visible: true,
          title: 'Mua gói',
          msg: 'Gói miễn phí này chỉ áp dụng một lần cho mỗi người dùng.',
        });
      } else {
        setAgreePopup({
          visible: true,
          title: 'Thông báo',
          msg: msg || 'Không thể hoàn thành đặt lịch, vui lòng thử lại sau.',
        });
      }
    } finally {
      setIsBooking(false);
      hideLoading();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Đặt lịch</CText>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.addressSection} activeOpacity={0.7} onPress={() => setShowAddress(true)}>
          <View style={styles.addressLeftIcon}>
            <IconX type="ionicons" name="location" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.addressInfo}>
            {bookingAddress?.text ? (
              <CText style={styles.addressTitle} numberOfLines={2}>{bookingAddress.text}</CText>
            ) : (
              <CText style={styles.addressPlaceholder}>Chọn địa chỉ</CText>
            )}
          </View>
          <IconX type="ionicons" name="chevron-forward" size={20} color="#98A2B3" />
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionBlock}>
          <CText style={styles.sectionTitle}>Thời gian làm việc</CText>
          {loading ? (
            <View style={styles.centerBox}><ActivityIndicator size="small" color="#14B8A6" /></View>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
                {days.map(day => {
                  const sel = selectedDayId === day.id;
                  return (
                    <TouchableOpacity key={day.id} onPress={() => handleSelectDay(day.id)}
                      style={[styles.dayCard, sel && styles.dayCardActive]} activeOpacity={0.7}>
                      <CText style={[styles.dayNameText, sel && styles.dayNameTextActive]}>{day.dayName}</CText>
                      <CText style={[styles.dateText, sel && styles.dateTextActive]}>{day.dateStr}</CText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <CText style={styles.subSectionTitle}>Thời gian bắt đầu</CText>
              {timeSlots.length > 0 ? (
                <View style={styles.timeSlotsGrid}>
                  {timeSlots.map(slot => {
                    const sel = selectedSlotId === slot.id, avail = slot.available;
                    return (
                      <TouchableOpacity key={slot.id} disabled={!avail} onPress={() => setSelectedSlotId(slot.id)}
                        style={[styles.timeSlotChip, sel && styles.timeSlotChipActive, !avail && styles.timeSlotChipDisabled]}
                        activeOpacity={0.7}>
                        <CText style={[styles.timeSlotText, sel && styles.timeSlotTextActive, !avail && styles.timeSlotTextDisabled]}>
                          {slot.time}
                        </CText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.centerBox}><CText style={styles.emptyText}>Không có giờ nào khả dụng</CText></View>
              )}
            </>
          )}
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.optionsList}>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <CText style={styles.optionText}>Chọn lặp lại theo tuần</CText>
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <CText style={styles.optionText}>Chọn lặp lại theo tháng</CText>
          </TouchableOpacity>
          {!!durationLabel && (
            <>
              <View style={styles.rowDivider} />
              <View style={styles.optionRowBetween}>
                <CText style={styles.optionText}>Số giờ phục vụ/buổi</CText>
                <View style={styles.hoursBadge}><CText style={styles.hoursBadgeText}>{durationLabel}</CText></View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, isBooking && { opacity: 0.7 }]}
          activeOpacity={0.8}
          disabled={isBooking}
          onPress={handleConfirm}>
          <CText style={styles.confirmBtnText}>{isFree ? 'Xác nhận đặt lịch' : 'Tiếp tục'}</CText>
        </TouchableOpacity>
      </View>

      {/* Modal chon dia chi - giong ModalSearchNearby cua doctor-mobile-app */}
      <ModalSearchAddress
        visible={showAddress}
        onClose={() => setShowAddress(false)}
        onChooseLocation={(item) => {
          setBookingAddress(item);
          setShowAddress(false);
        }}
      />

      {/* Modal thong bao Mua goi / Loi - giong ModalAgreeFormCarely cua doctor-mobile-app (Anh 2) */}
      <ModalAgreeFormCarely
        visible={agreePopup.visible}
        title={agreePopup.title}
        msg={agreePopup.msg}
        onClose={() => setAgreePopup(prev => ({ ...prev, visible: false }))}
      />

      {/* Modal xac nhan thanh cong - giong ConfirmModal cua doctor-mobile-app (Anh 3) */}
      <ConfirmModal
        visible={successModalVisible}
        message="🎉 Đặt lịch thành công! Lịch hẹn của bạn đang được xác nhận. Kết quả sẽ có trong vòng 12 giờ."
        cancelText="Đóng"
        confirmText="Đi đến lịch hẹn"
        onCancel={() => {
          setSuccessModalVisible(false);
          navigation.goBack();
        }}
        onConfirm={() => {
          setSuccessModalVisible(false);
          navigation.popToTop?.();
          navigation.navigate('AppointmentTab', { idxTab: 0 });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F2F4F7', backgroundColor: '#FFFFFF' },
  headerBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#101828' },
  headerBtnPlaceholder: { width: 36 },
  scrollContent: { paddingBottom: 90 },
  addressSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF' },
  addressLeftIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#14B8A6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  addressInfo: { flex: 1 },
  addressTitle: { fontSize: 14, fontWeight: '700', color: '#101828' },
  addressSubTitle: { fontSize: 12.5, color: '#667085', marginTop: 2 },
  addressLink: { fontSize: 12.5, color: '#0D9488', fontWeight: '500' },
  addressPlaceholder: { fontSize: 14, color: '#98A2B3', fontWeight: '400' },
  sectionDivider: { height: 8, backgroundColor: '#F8F9FA' },
  sectionBlock: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFFFFF' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#101828', marginBottom: 12 },
  subSectionTitle: { fontSize: 14, fontWeight: '600', color: '#101828', marginTop: 18, marginBottom: 12 },
  daysScroll: { gap: 8 },
  dayCard: { width: 52, height: 60, borderRadius: 6, borderWidth: 1, borderColor: '#EAECF0', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  dayCardActive: { borderColor: '#14B8A6', borderWidth: 1.5 },
  dayNameText: { fontSize: 14, fontWeight: '700', color: '#101828' },
  dayNameTextActive: { color: '#14B8A6' },
  dateText: { fontSize: 11, color: '#98A2B3', marginTop: 2 },
  dateTextActive: { color: '#14B8A6', fontWeight: '600' },
  centerBox: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, color: '#98A2B3' },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeSlotChip: { width: '30.5%', height: 42, borderRadius: 8, borderWidth: 1, borderColor: '#14B8A6', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  timeSlotChipActive: { backgroundColor: '#14B8A6', borderColor: '#14B8A6' },
  timeSlotChipDisabled: { borderColor: '#EAECF0', backgroundColor: '#FFFFFF' },
  timeSlotText: { fontSize: 14, fontWeight: '600', color: '#14B8A6' },
  timeSlotTextActive: { color: '#FFFFFF' },
  timeSlotTextDisabled: { color: '#D0D5DD' },
  optionsList: { backgroundColor: '#FFFFFF' },
  optionRow: { paddingHorizontal: 16, paddingVertical: 16 },
  optionRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  optionText: { fontSize: 14, color: '#101828', fontWeight: '500' },
  rowDivider: { height: 1, backgroundColor: '#F2F4F7', marginLeft: 16 },
  hoursBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14 },
  hoursBadgeText: { fontSize: 13, color: '#10B981', fontWeight: '600' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#EAECF0' },
  confirmBtn: { backgroundColor: '#0D9488', height: 46, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  confirmBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
  },
  content: {
    fontSize: 14,
    color: '#344054',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 12,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmMessage: {
    fontSize: 14,
    color: '#101828',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F4F7',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
  confirmButton: {
    backgroundColor: '#0D9488',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
