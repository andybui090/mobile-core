import {
  ClockTimePickerModal,
  DateRangePickerModal,
  CHeader,
  CSwitch,
  IconX,
  Wrapper,
} from '@/components';
import { CLoading, CText, Loader } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getChannelDetail,
  updateChannel,
} from '@/redux/slices/channelSlice';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  parseScheduleResponse,
} from './scheduleHelper';


interface TimeSlot {
  id: string;
  from: string;
  to: string;
}

interface DayOff {
  id: string;
  startDate: string;
  endDate: string;
}

const DAYS_OF_WEEK = [
  { id: 'T2', label: 'T2' },
  { id: 'T3', label: 'T3' },
  { id: 'T4', label: 'T4' },
  { id: 'T5', label: 'T5' },
  { id: 'T6', label: 'T6' },
  { id: 'T7', label: 'T7' },
  { id: 'CN', label: 'CN' },
];

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  // Date Range Section
  dateRangeSection: {
    marginBottom: 16,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
  },
  requiredStar: {
    color: '#F04438',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  dateRangeBox: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  dateRangeText: {
    fontSize: 14,
    color: '#1D2939',
    fontWeight: '500',
  },
  // Switch Section
  switchSection: {
    marginBottom: 16,
    paddingTop: 4,
  },
  switchRowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  titleShift: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
    marginRight: 14,
  },
  repeatText: {
    fontSize: 15,
    color: '#0084FF',
    fontWeight: '500',
  },
  // Days of week
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  dayButton: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cEAECF0,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: colors.white,
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.c344054,
  },
  dayTextActive: {
    color: colors.white,
  },
  helperText: {
    fontSize: 13,
    color: colors.c667085,
    marginBottom: 16,
    lineHeight: 18,
  },
  // Time Slots
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  timeInputGroup: {
    flex: 1,
    marginRight: 8,
  },
  timeLabel: {
    fontSize: 13,
    color: colors.c344054,
    marginBottom: 6,
    fontWeight: '500',
  },
  dropdownBox: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.cD0D5DD,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.c1D2939,
    fontWeight: '500',
  },
  deleteButton: {
    width: 38,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  addTimeButton: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  addTimeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#80DFDE',
    marginBottom: 20,
    marginTop: 4,
  },
  // Days off section
  dayOffCard: {
    backgroundColor: '#EBF8FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dayOffTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.c1D2939,
    marginBottom: 12,
  },
  dayOffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateSelectBox: {
    flex: 1,
    height: 42,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cD0D5DD,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateSeparator: {
    marginHorizontal: 8,
    color: colors.c667085,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    color: colors.c1D2939,
    fontWeight: '500',
  },
  addDayOffButton: {
    paddingTop: 6,
  },
  addDayOffText: {
    fontSize: 14,
    color: '#0088FF',
    fontWeight: '600',
  },
  // Update button
  updateButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  })
);

const DEFAULT_CHANNEL_ID = '129882f2-2db9-46cf-92a4-2078eff195fd';

export const WorkingHoursScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const {
    theme: { colors },
  } = useTheme();

  const channelId = route.params?.channelId || DEFAULT_CHANNEL_ID;

  // Redux store selector
  const { channelDetail, updateSchedule } = useSelector(
    (state: any) => state.channelReducer || {},
  );

  // Load initial data from route param or channelDetail
  const incomingSchedules =
    route.params?.schedules ||
    channelDetail?.data?.result?.schedules ||
    [];
  const initialParsed = parseScheduleResponse(incomingSchedules);

  // Fetch channel detail on mount
  useEffect(() => {
    dispatch(getChannelDetail(channelId));
  }, [dispatch, channelId]);

  // States
  const [shiftStatus, setShiftStatus] = useState(true);
  const [repeatWeekly, setRepeatWeekly] = useState(true);

  // Date range picker states
  const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);
  const [dateRangeText, setDateRangeText] = useState(
    initialParsed.dateRange.displayString || '27/8/2026 - 30/9/2026',
  );
  const [rangeStartDate, setRangeStartDate] = useState(
    initialParsed.dateRange.dayFrom || '2026-08-27',
  );
  const [rangeEndDate, setRangeEndDate] = useState(
    initialParsed.dateRange.dayTo || '2026-09-30',
  );

  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialParsed.selectedDays.length > 0
      ? initialParsed.selectedDays
      : ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  );

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    initialParsed.timeSlots.length > 0
      ? initialParsed.timeSlots
      : [{ id: '1', from: '08:00', to: '21:00' }],
  );

  const [daysOff, setDaysOff] = useState<DayOff[]>(
    initialParsed.daysOff.length > 0
      ? initialParsed.daysOff
      : [{ id: '1', startDate: '2026-08-27', endDate: '2026-09-30' }],
  );

  // Update states when API response arrives
  useEffect(() => {
    const schedules = channelDetail?.data?.result?.schedules;
    if (schedules && Array.isArray(schedules) && schedules.length > 0) {
      const parsed = parseScheduleResponse(schedules);
      setSelectedDays(parsed.selectedDays);
      setTimeSlots(parsed.timeSlots);
      setRangeStartDate(parsed.dateRange.dayFrom);
      setRangeEndDate(parsed.dateRange.dayTo);
      setDateRangeText(parsed.dateRange.displayString);
      if (parsed.daysOff.length > 0) {
        setDaysOff(parsed.daysOff);
      }
    }
  }, [channelDetail?.data]);

  // Day off picker state
  const [dayOffModalVisible, setDayOffModalVisible] = useState(false);
  const [activeDayOffId, setActiveDayOffId] = useState<string | null>(null);

  // Clock picker modal state
  const [clockModalVisible, setClockModalVisible] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<'from' | 'to'>('from');

  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleAddTimeSlot = () => {
    if (timeSlots.length >= 3) {
      Alert.alert('Thông báo', 'Chỉ được thêm tối đa 03 khung giờ làm việc');
      return;
    }
    const newId = Date.now().toString();
    setTimeSlots([...timeSlots, { id: newId, from: '10:00', to: '14:00' }]);
  };

  const handleDeleteTimeSlot = (id: string) => {
    if (timeSlots.length <= 1) {
      Alert.alert('Thông báo', 'Cần giữ lại ít nhất 01 khung giờ làm việc');
      return;
    }
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleAddDayOff = () => {
    const newId = Date.now().toString();
    setDaysOff([
      ...daysOff,
      { id: newId, startDate: '2026-10-01', endDate: '2026-10-15' },
    ]);
  };

  const handleDeleteDayOff = (id: string) => {
    setDaysOff(daysOff.filter(item => item.id !== id));
  };

  const openDayOffPicker = (id: string) => {
    setActiveDayOffId(id);
    setDayOffModalVisible(true);
  };

  const handleConfirmDayOff = (range: {
    startDate: string;
    endDate: string;
  }) => {
    if (activeDayOffId) {
      setDaysOff(
        daysOff.map(item =>
          item.id === activeDayOffId
            ? { ...item, startDate: range.startDate, endDate: range.endDate }
            : item,
        ),
      );
    }
    setDayOffModalVisible(false);
  };

  const currentDayOff = daysOff.find(item => item.id === activeDayOffId);

  const openTimePicker = (slotId: string, field: 'from' | 'to') => {
    setActiveSlotId(slotId);
    setActiveField(field);
    setClockModalVisible(true);
  };

  const handleConfirmTime = (time: string) => {
    if (activeSlotId) {
      setTimeSlots(
        timeSlots.map(slot =>
          slot.id === activeSlotId ? { ...slot, [activeField]: time } : slot,
        ),
      );
    }
    setClockModalVisible(false);
  };

  const handleConfirmDateRange = (range: {
    startDate: string;
    endDate: string;
    displayString: string;
  }) => {
    setRangeStartDate(range.startDate);
    setRangeEndDate(range.endDate);
    setDateRangeText(range.displayString);
  };

  // Get current active time for clock picker initial value
  const currentActiveTime = () => {
    if (!activeSlotId) return '08:00';
    const slot = timeSlots.find(s => s.id === activeSlotId);
    if (!slot) return '08:00';
    return activeField === 'from' ? slot.from : slot.to;
  };

  const handleUpdate = () => {
    const timeStart1 = timeSlots[0]?.from;
    const timeEnd1 = timeSlots[0]?.to;
    const timeStart2 = timeSlots[1]?.from;
    const timeEnd2 = timeSlots[1]?.to;
    const timeStart3 = timeSlots[2]?.from;
    const timeEnd3 = timeSlots[2]?.to;

    const dataUpdate: any[] = [
      { day_from: rangeStartDate, day_to: rangeEndDate },
      timeStart1 && { time_from1: timeStart1 },
      timeEnd1 && { time_to1: timeEnd1 },
      timeStart2 && { time_from2: timeStart2 },
      timeEnd2 && { time_to2: timeEnd2 },
      timeStart3 && { time_from3: timeStart3 },
      timeEnd3 && { time_to3: timeEnd3 },
    ].filter(Boolean);

    // 1. Add schedule_except (if any)
    if (initialParsed.scheduleExcept) {
      dataUpdate.push({ schedule_except: initialParsed.scheduleExcept });
    }

    // 2. Add working days: schedule_day_2 -> schedule_day_8 (T2=2, ..., CN=8)
    const dayMapUiToNum: Record<string, number> = {
      T2: 2,
      T3: 3,
      T4: 4,
      T5: 5,
      T6: 6,
      T7: 7,
      CN: 8,
    };
    [2, 3, 4, 5, 6, 7, 8].forEach(day => {
      const isWorking = selectedDays.some(d => dayMapUiToNum[d] === day);
      dataUpdate.push({
        [`schedule_day_${day}`]: isWorking ? 1 : 0,
      });
    });

    console.log('Dispatching updateChannel with dataUpdate:', dataUpdate);

    dispatch(
      updateChannel({
        id: channelId,
        schedules: JSON.stringify(dataUpdate),
        callback: (res: any) => {
          if (res?.success) {
            Alert.alert(
              'Thành công',
              `Đã cập nhật lịch làm việc thành công!\nKhoảng thời gian: ${dateRangeText}\nSố khung giờ: ${timeSlots.length}`,
            );
          } else {
            const errorMsg =
              res?.error?.message ||
              res?.error?.problem ||
              'Cập nhật lịch làm việc thất bại. Vui lòng thử lại sau!';
            Alert.alert('Thất bại', errorMsg);
          }
        },
      }),
    );
  };

  // Show loading indicator while fetching initial data from API
  if (channelDetail?.loading && !channelDetail?.data) {
    return (
      <Wrapper style={styles.container}>
        <CHeader
          title="Thời gian làm việc"
          isBorderBottom
          leftComponentOnPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        />
        <CLoading colorLoading={colors.primary} />
      </Wrapper>
    );
  }

  return (
    <Wrapper style={styles.container}>
      <CHeader
        title="Thời gian làm việc"
        isBorderBottom
        leftComponentOnPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Chọn khoảng thời gian * */}
        <View style={styles.dateRangeSection}>
          <View style={styles.sectionLabelRow}>
            <CText style={styles.sectionLabel}>Chọn khoảng thời gian</CText>
            <CText style={styles.requiredStar}>*</CText>
          </View>
          <TouchableOpacity
            style={styles.dateRangeBox}
            activeOpacity={0.7}
            onPress={() => setDateRangePickerVisible(true)}
          >
            <CText style={styles.dateRangeText}>{dateRangeText}</CText>
            <IconX
              type="ionicons"
              name="chevron-down"
              size={18}
              color={colors.c667085}
            />
          </TouchableOpacity>
        </View>

        {/* Switch Section */}
        <View style={styles.switchSection}>
          <View style={styles.switchRowRight}>
            <CText style={styles.titleShift}>Trạng thái nhận ca</CText>
            <CSwitch
              value={shiftStatus}
              onValueChange={setShiftStatus}
              activeColor="#4E9B8F"
              inactiveColor="#E4E7EC"
            />
          </View>

          <View style={styles.switchRowBetween}>
            <CText style={styles.repeatText}>
              Thời gian làm việc lặp lại theo tuần
            </CText>
            <CSwitch
              value={repeatWeekly}
              onValueChange={setRepeatWeekly}
              activeColor="#4E9B8F"
              inactiveColor="#E4E7EC"
            />
          </View>
        </View>

        {/* Days of Week Selector */}
        <View style={styles.daysRow}>
          {DAYS_OF_WEEK.map(day => {
            const isActive = selectedDays.includes(day.id);
            return (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  isActive && styles.dayButtonActive,
                ]}
                activeOpacity={0.7}
                onPress={() => toggleDay(day.id)}
              >
                <CText
                  style={[
                    styles.dayText,
                    isActive && styles.dayTextActive,
                  ]}
                >
                  {day.label}
                </CText>
              </TouchableOpacity>
            );
          })}
        </View>

        <CText style={styles.helperText}>
          Chọn 01 ngày/thứ bất kỳ nếu bạn muốn cài đặt khung giờ riêng cho ngày đó
        </CText>

        {/* Time Slots */}
        {timeSlots.map(slot => (
          <View key={slot.id} style={styles.timeSlotItem}>
            {/* From */}
            <View style={styles.timeInputGroup}>
              <CText style={styles.timeLabel}>Bắt đầu</CText>
              <TouchableOpacity
                style={styles.dropdownBox}
                activeOpacity={0.7}
                onPress={() => openTimePicker(slot.id, 'from')}
              >
                <CText style={styles.dropdownText}>{slot.from}</CText>
                <IconX
                  type="ionicons"
                  name="chevron-down"
                  size={16}
                  color={colors.c667085}
                />
              </TouchableOpacity>
            </View>

            {/* To */}
            <View style={styles.timeInputGroup}>
              <CText style={styles.timeLabel}>Kết thúc</CText>
              <TouchableOpacity
                style={styles.dropdownBox}
                activeOpacity={0.7}
                onPress={() => openTimePicker(slot.id, 'to')}
              >
                <CText style={styles.dropdownText}>{slot.to}</CText>
                <IconX
                  type="ionicons"
                  name="chevron-down"
                  size={16}
                  color={colors.c667085}
                />
              </TouchableOpacity>
            </View>

            {/* Delete button */}
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.7}
              onPress={() => handleDeleteTimeSlot(slot.id)}
            >
              <IconX
                type="ionicons"
                name="trash-outline"
                size={20}
                color={colors.c98A2B3}
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Time Slot Button (Tối đa 3 khung giờ) */}
        {timeSlots.length < 3 && (
          <TouchableOpacity
            style={styles.addTimeButton}
            activeOpacity={0.7}
            onPress={handleAddTimeSlot}
          >
            <CText style={styles.addTimeText}>Thêm thời gian làm việc</CText>
          </TouchableOpacity>
        )}

        {/* Divider */}
        <View style={styles.sectionDivider} />

        {/* Day Off Section */}
        <View style={styles.dayOffCard}>
          <CText style={styles.dayOffTitle}>Chọn ngày nghỉ</CText>

          {daysOff.map(item => (
            <View key={item.id} style={styles.dayOffRow}>
              {/* Start Date */}
              <TouchableOpacity
                style={styles.dateSelectBox}
                activeOpacity={0.7}
                onPress={() => openDayOffPicker(item.id)}
              >
                <CText style={styles.dateText}>{item.startDate}</CText>
                <IconX
                  type="ionicons"
                  name="chevron-down"
                  size={16}
                  color={colors.c667085}
                />
              </TouchableOpacity>

              <CText style={styles.dateSeparator}>|</CText>

              {/* End Date */}
              <TouchableOpacity
                style={styles.dateSelectBox}
                activeOpacity={0.7}
                onPress={() => openDayOffPicker(item.id)}
              >
                <CText style={styles.dateText}>{item.endDate}</CText>
                <IconX
                  type="ionicons"
                  name="chevron-down"
                  size={16}
                  color={colors.c667085}
                />
              </TouchableOpacity>

              {/* Delete Day Off */}
              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.7}
                onPress={() => handleDeleteDayOff(item.id)}
              >
                <IconX
                  type="ionicons"
                  name="trash-outline"
                  size={20}
                  color={colors.c98A2B3}
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addDayOffButton}
            activeOpacity={0.7}
            onPress={handleAddDayOff}
          >
            <CText style={styles.addDayOffText}>+ Thêm ngày nghỉ</CText>
          </TouchableOpacity>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={styles.updateButton}
          activeOpacity={0.8}
          onPress={handleUpdate}
        >
          <CText style={styles.updateButtonText}>Cập nhật</CText>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Range Picker Calendar Modal for Working Schedule (Image 1) */}
      <DateRangePickerModal
        title="Chọn khoảng thời gian"
        visible={dateRangePickerVisible}
        startDate={rangeStartDate}
        endDate={rangeEndDate}
        onClose={() => setDateRangePickerVisible(false)}
        onConfirm={handleConfirmDateRange}
      />

      {/* Date Range Picker Calendar Modal for Days Off (Chọn ngày nghỉ) */}
      <DateRangePickerModal
        title="Chọn ngày nghỉ"
        visible={dayOffModalVisible}
        startDate={currentDayOff?.startDate}
        endDate={currentDayOff?.endDate}
        onClose={() => setDayOffModalVisible(false)}
        onConfirm={handleConfirmDayOff}
      />

      {/* Radial Clock Time Picker Modal (Image 2) */}
      <ClockTimePickerModal
        visible={clockModalVisible}
        initialTime={currentActiveTime()}
        onClose={() => setClockModalVisible(false)}
        onConfirm={handleConfirmTime}
      />

      {/* Overlay loading while updating schedule */}
      <Loader visible={!!updateSchedule?.loading} />
    </Wrapper>
  );
};

export default WorkingHoursScreen;
