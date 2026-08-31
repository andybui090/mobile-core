import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@/components';
import { CText } from '@/utils';

interface DayItem {
  id: string;
  dayName: string;
  dateStr: string;
}

const DAYS: DayItem[] = [
  { id: '1', dayName: 'CN', dateStr: '22/01' },
  { id: '2', dayName: 'T2', dateStr: '23/01' },
  { id: '3', dayName: 'T3', dateStr: '24/01' },
  { id: '4', dayName: 'T4', dateStr: '25/01' },
  { id: '5', dayName: 'T5', dateStr: '26/01' },
  { id: '6', dayName: 'T6', dateStr: '27/01' },
  { id: '7', dayName: 'T7', dateStr: '28/01' },
];

const TIME_SLOTS = [
  { id: '1', time: '10:30', available: true },
  { id: '2', time: '13:00', available: false },
  { id: '3', time: '15:30', available: true },
  { id: '4', time: '18:30', available: true },
  { id: '5', time: '19:00', available: false },
  { id: '6', time: '20:00', available: true },
];

export const BookingSchedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('4'); // T4 25/01
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('1'); // 10:30

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Địa chỉ</CText>
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
            <CText style={styles.addressTitle}>44/7 Đường N4</CText>
            <CText style={styles.addressSubTitle}>P. Tân Hưng, Quận 7, TP. HCM</CText>
            <CText style={styles.addressLink}>Thêm mô tả địa chỉ</CText>
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
                  onPress={() => setSelectedDay(day.id)}
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
          <CText style={styles.subSectionTitle}>Thời gian bắt đầu</CText>

          {/* Time Slot Chips Grid */}
          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map(slot => {
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

          <View style={styles.rowDivider} />

          <View style={styles.optionRowBetween}>
            <CText style={styles.optionText}>Số giờ phục vụ/buổi</CText>
            <View style={styles.hoursBadge}>
              <CText style={styles.hoursBadgeText}>2 giờ</CText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Confirm */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8}>
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
    marginTop: 4,
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
