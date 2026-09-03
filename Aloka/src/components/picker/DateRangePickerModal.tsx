import React, { useState, useMemo } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { IconX } from '../icons';
import { CText } from '@/utils';

export interface DateRangePickerModalProps {
  visible: boolean;
  title?: string;
  startDate?: string; // Format 'YYYY-MM-DD'
  endDate?: string;   // Format 'YYYY-MM-DD'
  onClose: () => void;
  onConfirm: (range: {
    startDate: string;
    endDate: string;
    displayString: string; // e.g. "27/8/2026 - 30/9/2026"
    displayFormatted: string; // e.g. "27 thg 8 - 30 thg 9"
  }) => void;
}

const WEEK_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// Generate months from current month + 6 months
const MONTHS_TO_RENDER = [
  '2026-08',
  '2026-09',
  '2026-10',
  '2026-11',
  '2026-12',
  '2027-01',
];

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  visible,
  title = 'Chọn khoảng thời gian',
  startDate: initStartDate = '2026-08-27',
  endDate: initEndDate = '2026-09-30',
  onClose,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedStart, setSelectedStart] = useState<string | null>(initStartDate);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(initEndDate);

  React.useEffect(() => {
    if (visible) {
      setSelectedStart(initStartDate || null);
      setSelectedEnd(initEndDate || null);
    }
  }, [visible, initStartDate, initEndDate]);

  const handleDayPress = (dateStr: string) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      // First click: select new start date
      setSelectedStart(dateStr);
      setSelectedEnd(null);
    } else if (selectedStart && !selectedEnd) {
      if (moment(dateStr).isBefore(moment(selectedStart), 'day')) {
        // Clicked before start: reset start date
        setSelectedStart(dateStr);
      } else {
        // Clicked after start: set end date
        setSelectedEnd(dateStr);
      }
    }
  };

  const displayFormattedText = useMemo(() => {
    if (selectedStart && selectedEnd) {
      const s = moment(selectedStart);
      const e = moment(selectedEnd);
      return `${s.format('D [thg] M')} - ${e.format('D [thg] M')}`;
    }
    if (selectedStart) {
      const s = moment(selectedStart);
      return `${s.format('D [thg] M')} - Chọn ngày kết thúc`;
    }
    return 'Chọn khoảng thời gian';
  }, [selectedStart, selectedEnd]);

  const handleConfirm = () => {
    if (!selectedStart) return;
    const finalStart = selectedStart;
    const finalEnd = selectedEnd || selectedStart;

    const s = moment(finalStart);
    const e = moment(finalEnd);

    onConfirm({
      startDate: finalStart,
      endDate: finalEnd,
      displayString: `${s.format('D/M/YYYY')} - ${e.format('D/M/YYYY')}`,
      displayFormatted: `${s.format('D [thg] M')} - ${e.format('D [thg] M')}`,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top || 12 }]}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <IconX
              type="ionicons"
              name="close-outline"
              size={26}
              color="#1D1B20"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.7}
            onPress={handleConfirm}
          >
            <CText style={styles.saveHeaderText}>Lưu</CText>
          </TouchableOpacity>
        </View>

        {/* Selected Range Display Banner */}
        <View style={styles.rangeBanner}>
          <View style={styles.bannerLeft}>
            <CText style={styles.bannerLabel}>{title}</CText>
            <CText style={styles.bannerValue}>{displayFormattedText}</CText>
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
            <IconX
              type="ionicons"
              name="pencil-outline"
              size={22}
              color="#1D1B20"
            />
          </TouchableOpacity>
        </View>

        {/* Weekday Row Header (Sticky) */}
        <View style={styles.weekdayRow}>
          {WEEK_DAYS.map(day => (
            <View key={day} style={styles.weekdayCell}>
              <CText style={styles.weekdayText}>{day}</CText>
            </View>
          ))}
        </View>

        {/* Scrollable Months List */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {MONTHS_TO_RENDER.map(monthStr => {
            const m = moment(monthStr, 'YYYY-MM');
            const monthLabel = `Tháng ${m.format('M YYYY')}`;
            const daysInMonth = m.daysInMonth();
            const firstDayOfWeek = m.startOf('month').day(); // 0 = CN, 1 = T2...

            // Create blank offset cells for first week
            const blanks = Array.from({ length: firstDayOfWeek });
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

            return (
              <View key={monthStr} style={styles.monthBlock}>
                <CText style={styles.monthTitle}>{monthLabel}</CText>

                <View style={styles.daysGrid}>
                  {/* Blanks */}
                  {blanks.map((_, bIdx) => (
                    <View key={`b_${bIdx}`} style={styles.dayCell} />
                  ))}

                  {/* Days in Month */}
                  {days.map(dayNum => {
                    const dateStr = `${monthStr}-${String(dayNum).padStart(2, '0')}`;
                    const isStart = selectedStart === dateStr;
                    const isEnd = selectedEnd === dateStr;
                    const isBetween =
                      selectedStart &&
                      selectedEnd &&
                      moment(dateStr).isAfter(moment(selectedStart), 'day') &&
                      moment(dateStr).isBefore(moment(selectedEnd), 'day');

                    const inRange = isStart || isEnd || isBetween;

                    return (
                      <TouchableOpacity
                        key={dateStr}
                        style={styles.dayCell}
                        activeOpacity={0.8}
                        onPress={() => handleDayPress(dateStr)}
                      >
                        {/* Range highlight background strip */}
                        {inRange && selectedEnd && (
                          <View
                            style={[
                              styles.rangeStrip,
                              isStart && styles.rangeStripStart,
                              isEnd && styles.rangeStripEnd,
                              isStart && isEnd && styles.rangeStripSingle,
                            ]}
                          />
                        )}

                        {/* End day / Start day solid circle */}
                        {(isEnd || (isStart && !selectedEnd)) && (
                          <View style={styles.solidEndpointCircle} />
                        )}

                        {/* Day number text */}
                        <CText
                          style={[
                            styles.dayNumberText,
                            (isEnd || (isStart && !selectedEnd)) &&
                            styles.dayNumberTextWhite,
                            isStart && selectedEnd && styles.dayNumberTextBold,
                          ]}
                        >
                          {dayNum}
                        </CText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
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
  },
  headerBtn: {
    padding: 4,
  },
  saveHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6750A4',
  },
  rangeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  bannerLeft: {
    flex: 1,
  },
  bannerLabel: {
    fontSize: 14,
    color: '#49454F',
    marginBottom: 4,
  },
  bannerValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1B20',
  },
  editBtn: {
    padding: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#49454F',
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  monthBlock: {
    marginBottom: 28,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#49454F',
    marginBottom: 12,
    paddingLeft: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.285%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 2,
  },
  rangeStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 2,
    bottom: 2,
    backgroundColor: '#E8DEF8',
  },
  rangeStripStart: {
    left: 4,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  rangeStripEnd: {
    right: 4,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
  },
  rangeStripSingle: {
    left: 4,
    right: 4,
    borderRadius: 22,
  },
  solidEndpointCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5D3EBC',
    zIndex: 2,
  },
  dayNumberText: {
    fontSize: 14,
    color: '#1D1B20',
    zIndex: 3,
  },
  dayNumberTextWhite: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayNumberTextBold: {
    fontWeight: '700',
    color: '#21005D',
  },
});

export default DateRangePickerModal;
