import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconX } from '@/components';
import { homeTabRoute } from '@/constants';
import { CText } from '@/utils';

interface DayItem {
  id: string;
  dayName: string;
  dateStr: string;
}

interface TimeSlotItem {
  id: string;
  time: string;
  available: boolean;
}

/** Tên thứ theo tiếng Việt, index 0 = Chủ nhật */
const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/** Tạo 7 ngày liên tiếp bắt đầu từ hôm nay */
const buildDaysFromToday = (): DayItem[] => {
  const days: DayItem[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = DAY_NAMES[d.getDay()];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    days.push({
      id: String(i),
      dayName,
      dateStr: `${dd}/${mm}`,
    });
  }
  return days;
};

/** Parse time_slots từ API response.
 *  Hỗ trợ nhiều format: mảng string, mảng object { time, available }, string schedule
 */
const parseTimeSlots = (raw: any): TimeSlotItem[] => {
  if (!raw || !Array.isArray(raw) || raw.length === 0) return [];

  return raw.map((item: any, index: number) => {
    if (typeof item === 'string') {
      return { id: String(index), time: item, available: true };
    }
    if (typeof item === 'object') {
      const time =
        item.time || item.time_from || item.start_time || item.from || '';
      const available =
        item.available !== undefined
          ? Boolean(item.available)
          : item.status === 'available' || item.is_available !== false;
      return { id: String(item.id ?? index), time, available };
    }
    return { id: String(index), time: String(item), available: true };
  });
};

/** Format số giờ hiển thị */
const formatDuration = (duration: any): string => {
  if (!duration && duration !== 0) return '';
  const num = Number(duration);
  if (isNaN(num)) return String(duration);
  if (num < 60) return `${num} phút`;
  const h = Math.floor(num / 60);
  const m = num % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
};

export const BookingSchedule: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const service = route.params?.service;

  // ── Địa chỉ từ service ──────────────────────────────────────────────
  const address =
    service?.address ||
    service?.location?.address ||
    service?.location_address ||
    service?.provider?.address ||
    '';

  const addressDetail =
    service?.address_detail ||
    service?.location?.district ||
    service?.district ||
    service?.location?.detail ||
    '';

  // ── Số giờ phục vụ ──────────────────────────────────────────────────
  // duration có thể là phút (60 = 1 giờ) hoặc giờ
  const rawDuration =
    service?.duration ||
    service?.working_hours ||
    service?.hours ||
    service?.package?.duration ||
    service?.package_info?.duration ||
    null;

  const durationLabel = rawDuration ? formatDuration(rawDuration) : '';

  // ── Tạo 7 ngày từ hôm nay ──────────────────────────────────────────
  const DAYS = useMemo(() => buildDaysFromToday(), []);

  // ── Time slots từ API ───────────────────────────────────────────────
  const apiTimeSlots = useMemo(() => {
    const raw =
      service?.time_slots ||
      service?.schedules ||
      service?.available_slots ||
      service?.slots ||
      null;
    return parseTimeSlots(raw);
  }, [service]);

  // ── State ───────────────────────────────────────────────────────────
  const [selectedDay, setSelectedDay] = useState(DAYS[0]?.id ?? '0');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
    apiTimeSlots.find(s => s.available)?.id ?? null,
  );

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
        <CText style={styles.headerTitle}>Đặt lịch</CText>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Address Section */}
        <TouchableOpacity style={styles.addressSection} activeOpacity={0.7}>
          <View style={styles.addressLeftIcon}>
            <IconX type="ionicons" name="location" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.addressInfo}>
            {address ? (
              <>
                <CText style={styles.addressTitle}>{address}</CText>
                {!!addressDetail && (
                  <CText style={styles.addressSubTitle}>{addressDetail}</CText>
                )}
              </>
            ) : (
              <CText style={styles.addressLink}>Thêm địa chỉ</CText>
            )}
          </View>
          <IconX type="ionicons" name="chevron-forward" size={20} color="#98A2B3" />
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        {/* Thời gian làm việc */}
        <View style={styles.sectionBlock}>
          <CText style={styles.sectionTitle}>Thời gian làm việc</CText>

          {/* Days horizontal scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScroll}
          >
            {DAYS.map(day => {
              const isSelected = selectedDay === day.id;
              return (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => {
                    setSelectedDay(day.id);
                    // Reset slot khi đổi ngày (nếu có API lấy slot theo ngày)
                    setSelectedTimeSlot(
                      apiTimeSlots.find(s => s.available)?.id ?? null,
                    );
                  }}
                  style={[styles.dayCard, isSelected && styles.dayCardActive]}
                  activeOpacity={0.7}
                >
                  <CText style={[styles.dayNameText, isSelected && styles.dayNameTextActive]}>
                    {day.dayName}
                  </CText>
                  <CText style={[styles.dateText, isSelected && styles.dateTextActive]}>
                    {day.dateStr}
                  </CText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Thời gian bắt đầu */}
          {apiTimeSlots.length > 0 && (
            <>
              <CText style={styles.subSectionTitle}>Thời gian bắt đầu</CText>

              {/* Time Slot Chips Grid */}
              <View style={styles.timeSlotsGrid}>
                {apiTimeSlots.map(slot => {
                  const isSelected = selectedTimeSlot === slot.id;
                  const isAvailable = slot.available;
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      disabled={!isAvailable}
                      onPress={() => setSelectedTimeSlot(slot.id)}
                      style={[
                        styles.timeSlotChip,
                        isSelected && styles.timeSlotChipActive,
                        !isAvailable && styles.timeSlotChipDisabled,
                      ]}
                      activeOpacity={0.7}
                    >
                      <CText
                        style={[
                          styles.timeSlotText,
                          isSelected && styles.timeSlotTextActive,
                          !isAvailable && styles.timeSlotTextDisabled,
                        ]}
                      >
                        {slot.time}
                      </CText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        <View style={styles.sectionDivider} />

        {/* Repetition & Service Options */}
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
                <View style={styles.hoursBadge}>
                  <CText style={styles.hoursBadgeText}>{durationLabel}</CText>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer Confirm */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(homeTabRoute.bookingConfirm, {
              service,
              selectedDay: DAYS.find(d => d.id === selectedDay),
              selectedTimeSlot: apiTimeSlots.find(s => s.id === selectedTimeSlot),
            })
          }
        >
          <CText style={styles.confirmBtnText}>Xác nhận</CText>
        </TouchableOpacity>
      </View>
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
  headerBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
  },
  headerBtnPlaceholder: {
    width: 36,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  addressLeftIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  addressSubTitle: {
    fontSize: 12.5,
    color: '#667085',
    marginTop: 2,
  },
  addressLink: {
    fontSize: 12.5,
    color: '#0D9488',
    fontWeight: '500',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F8F9FA',
  },
  sectionBlock: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
    marginTop: 18,
    marginBottom: 12,
  },
  daysScroll: {
    gap: 8,
  },
  dayCard: {
    width: 52,
    height: 60,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardActive: {
    borderColor: '#14B8A6',
    borderWidth: 1.5,
  },
  dayNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  dayNameTextActive: {
    color: '#14B8A6',
  },
  dateText: {
    fontSize: 11,
    color: '#98A2B3',
    marginTop: 2,
  },
  dateTextActive: {
    color: '#14B8A6',
    fontWeight: '600',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlotChip: {
    width: '30.5%',
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#14B8A6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotChipActive: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  timeSlotChipDisabled: {
    borderColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
  },
  timeSlotTextDisabled: {
    color: '#D0D5DD',
  },
  optionsList: {
    backgroundColor: '#FFFFFF',
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 14,
    color: '#101828',
    fontWeight: '500',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginLeft: 16,
  },
  hoursBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  hoursBadgeText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },
  confirmBtn: {
    backgroundColor: '#0D9488',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
