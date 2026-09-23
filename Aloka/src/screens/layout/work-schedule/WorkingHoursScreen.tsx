import {
  ClockTimePickerModal,
  DateRangePickerModal,
  CHeader,
  CSwitch,
  IconX,
  Wrapper,
  showLoading,
  hideLoading,
} from '@/components';
import { CLoading, CText } from '@/utils';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getChannelDetail,
  getChannelDetailCallback,
  updateChannel,
} from '@/redux/slices/channelSlice';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppContext } from '@/contexts';
import ApiService from '@/services/api-base';
import moment from 'moment';

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
  { id: 'T2', dayNum: 2, label: 'T2' },
  { id: 'T3', dayNum: 3, label: 'T3' },
  { id: 'T4', dayNum: 4, label: 'T4' },
  { id: 'T5', dayNum: 5, label: 'T5' },
  { id: 'T6', dayNum: 6, label: 'T6' },
  { id: 'T7', dayNum: 7, label: 'T7' },
  { id: 'CN', dayNum: 8, label: 'CN' },
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
      paddingBottom: 24,
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
      fontSize: 16,
      fontWeight: '700',
      color: '#101828',
      marginRight: 12,
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
      borderColor: colors.cEAECF0 || '#EAECF0',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 3,
      backgroundColor: colors.white,
    },
    dayButtonActive: {
      backgroundColor: colors.primary || '#14B8A6',
      borderColor: colors.primary || '#14B8A6',
    },
    dayText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.c344054 || '#344054',
    },
    dayTextActive: {
      color: colors.white,
    },
    helperText: {
      fontSize: 13,
      color: colors.c667085 || '#667085',
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
      color: colors.c344054 || '#344054',
      marginBottom: 6,
      fontWeight: '500',
    },
    dropdownBox: {
      height: 42,
      borderWidth: 1,
      borderColor: colors.cD0D5DD || '#D0D5DD',
      borderRadius: 8,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.white,
    },
    dropdownText: {
      fontSize: 14,
      color: colors.c1D2939 || '#101828',
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
      color: colors.primary || '#14B8A6',
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
      backgroundColor: colors.cE6FAFA || '#E6FAFA',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    dayOffTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.c1D2939 || '#1D2939',
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
      borderColor: colors.cD0D5DD || '#D0D5DD',
      borderRadius: 8,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateSeparator: {
      marginHorizontal: 8,
      color: colors.c667085 || '#667085',
      fontWeight: '600',
    },
    dateText: {
      fontSize: 13,
      color: colors.c1D2939 || '#1D2939',
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
    bottomBar: {
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      paddingTop: 10,
    },
    // Update button
    updateButton: {
      backgroundColor: colors.primary || '#14B8A6',
      height: 48,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    updateButtonDisabled: {
      opacity: 0.6,
    },
    updateButtonText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: '700',
    },
    errorText: {
      fontSize: 12,
      color: '#F04438',
      marginTop: 4,
      marginBottom: 8,
    },
  }),
);


const normalizeSchedules = (raw: any): any[] => {
  if (!raw) return [];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return normalizeSchedules(parsed);
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) {
    if (raw.length === 1 && typeof raw[0] === 'string') {
      try {
        const inner = JSON.parse(raw[0]);
        return normalizeSchedules(inner);
      } catch { }
    }
    return raw;
  }
  if (typeof raw === 'object' && raw !== null) {
    return [raw];
  }
  return [];
};

const extractSchedules = (resObj: any): any[] => {
  return resObj?.data?.result?.schedules ?? resObj?.result?.schedules ?? [];
};

const formatSlotTime = (val?: string): string => {
  if (!val || val === 'Invalid date') return '';
  const str = String(val).trim();
  const match = str.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    const hh = match[1].padStart(2, '0');
    const mm = match[2];
    return `${hh}:${mm}`;
  }
  return '';
};

export const WorkingHoursScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const dispatch = useDispatch<any>();
  const { user } = useContext<any>(AppContext) || {};
  const {
    theme: { colors },
  } = useTheme();

  const channelId = user?.channel_id || route.params?.channelId;

  // Redux store selector
  const { channelDetail } = useSelector(
    (state: any) => state.channelReducer || {},
  );

  // Screen loading state while fetching channel data from API
  const [isLoadingChannel, setIsLoadingChannel] = useState<boolean>(true);

  // States
  const [shiftStatus, setShiftStatus] = useState<boolean>(true);
  const [repeatWeekly, setRepeatWeekly] = useState<boolean>(true);

  // Date range picker states
  const [dateRangePickerVisible, setDateRangePickerVisible] = useState<boolean>(false);
  const [dateRangeText, setDateRangeText] = useState<string>('');
  const [rangeStartDate, setRangeStartDate] = useState<string>('');
  const [rangeEndDate, setRangeEndDate] = useState<string>('');

  // Selected days in week (T2, T3, T4, T5, T6, T7, CN)
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Time Slots (Up to 3 slots)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Days off (Chọn ngày nghỉ)
  const [daysOff, setDaysOff] = useState<DayOff[]>([]);

  // Day off picker modal state
  const [dayOffModalVisible, setDayOffModalVisible] = useState<boolean>(false);
  const [activeDayOffId, setActiveDayOffId] = useState<string | null>(null);

  // Clock picker modal state
  const [clockModalVisible, setClockModalVisible] = useState<boolean>(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<'from' | 'to'>('from');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});

  // Populate screen states dynamically from API schedules array
  const populateScheduleData = useCallback((rawInput: any) => {
    const list = normalizeSchedules(rawInput);
    if (!list || list.length === 0) {
      setTimeSlots([]);
      setSelectedDays([]);
      return;
    }

    const merged = list.reduce((acc: any, cur: any) => {
      if (typeof cur === 'string') {
        try {
          const p = JSON.parse(cur);
          return typeof p === 'object' && p !== null ? { ...acc, ...p } : acc;
        } catch {
          return acc;
        }
      }
      return typeof cur === 'object' && cur !== null ? { ...acc, ...cur } : acc;
    }, {});

    // 1. Parse date range
    if (merged.day_from && merged.day_to) {
      const sM = moment(merged.day_from);
      const eM = moment(merged.day_to);
      if (sM.isValid() && eM.isValid()) {
        setRangeStartDate(sM.format('YYYY-MM-DD'));
        setRangeEndDate(eM.format('YYYY-MM-DD'));
        setDateRangeText(`${sM.format('D/M/YYYY')} - ${eM.format('D/M/YYYY')}`);
      }
    } else if (merged.day_from) {
      const sM = moment(merged.day_from);
      if (sM.isValid()) {
        setRangeStartDate(sM.format('YYYY-MM-DD'));
        setDateRangeText(sM.format('D/M/YYYY'));
      }
    }

    // 2. Parse time slots (up to 3 slots)
    const parsedSlots: TimeSlot[] = [];
    const from1 = formatSlotTime(merged.time_from1);
    const to1 = formatSlotTime(merged.time_to1);
    if (from1 || to1) {
      parsedSlots.push({
        id: '1',
        from: from1,
        to: to1,
      });
    }

    const from2 = formatSlotTime(merged.time_from2);
    const to2 = formatSlotTime(merged.time_to2);
    if (from2 || to2) {
      parsedSlots.push({
        id: '2',
        from: from2,
        to: to2,
      });
    }

    const from3 = formatSlotTime(merged.time_from3);
    const to3 = formatSlotTime(merged.time_to3);
    if (from3 || to3) {
      parsedSlots.push({
        id: '3',
        from: from3,
        to: to3,
      });
    }

    setTimeSlots(parsedSlots);

    // 3. Parse working days (schedule_day_2..8)
    const daysFromApi: string[] = [];
    const dayMapApiToUi: Record<string, string> = {
      schedule_day_2: 'T2',
      schedule_day_3: 'T3',
      schedule_day_4: 'T4',
      schedule_day_5: 'T5',
      schedule_day_6: 'T6',
      schedule_day_7: 'T7',
      schedule_day_8: 'CN',
    };
    Object.keys(dayMapApiToUi).forEach(key => {
      if (Number(merged[key]) === 1 || merged[key] === true) {
        daysFromApi.push(dayMapApiToUi[key]);
      }
    });
    setSelectedDays(daysFromApi);

    // 4. Parse days off from schedule_except
    if (merged.schedule_except) {
      const days = String(merged.schedule_except)
        .split(',')
        .map(d => d.trim())
        .filter(Boolean)
        .map(Number)
        .filter(d => d >= 1 && d <= 31);

      if (days.length > 0) {
        const baseM = merged.day_from && moment(merged.day_from).isValid()
          ? moment(merged.day_from)
          : moment();
        const parsedDaysOff: DayOff[] = days.map((dayNum, idx) => {
          const dateStr = baseM.clone().date(dayNum).format('YYYY-MM-DD');
          return {
            id: String(idx + 1),
            startDate: dateStr,
            endDate: dateStr,
          };
        });
        setDaysOff(parsedDaysOff);
      } else {
        setDaysOff([]);
      }
    } else {
      setDaysOff([]);
    }
  }, []);

  // Synchronize when Redux store updates with channelDetail
  useEffect(() => {
    if (channelDetail?.data) {
      const rawSchedules = extractSchedules(channelDetail.data);
      const parsed = normalizeSchedules(rawSchedules);
      if (parsed.length > 0) {
        populateScheduleData(parsed);
      }
    }
  }, [channelDetail?.data, populateScheduleData]);

  // Fetch channel detail whenever screen is focused, show loading spinner, then populate data
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadInitialData = async () => {
        setIsLoadingChannel(true);

        // 1. If schedules were passed via route params and no channelId, populate them immediately
        if (route.params?.schedules && !channelId) {
          const parsed = normalizeSchedules(route.params.schedules);
          if (parsed.length > 0) {
            populateScheduleData(parsed);
            if (isMounted) setIsLoadingChannel(false);
            return;
          }
        }

        // 2. Fetch from API if channelId is available
        if (channelId) {
          try {
            const res: any = await ApiService.getChannelDetail(channelId);
            console.log('getChannelDetail res on focus:', res);
            if (!isMounted) return;

            if (res?.data) {
              dispatch(getChannelDetailCallback({ data: res.data, error: null }));
            }

            const rawSchedules = extractSchedules(res);
            const parsed = normalizeSchedules(rawSchedules);

            if (parsed.length > 0) {
              populateScheduleData(parsed);
            } else {
              populateScheduleData([]);
            }
          } catch (err) {
            console.warn('Failed to fetch channel detail:', err);
            if (isMounted) {
              populateScheduleData([]);
            }
          } finally {
            if (isMounted) {
              setIsLoadingChannel(false);
            }
          }
        } else {
          if (isMounted) {
            populateScheduleData([]);
            setIsLoadingChannel(false);
          }
        }
      };

      loadInitialData();

      return () => {
        isMounted = false;
      };
    }, [channelId, route.params?.schedules, populateScheduleData, dispatch]),
  );

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
    setTimeSlots([...timeSlots, { id: newId, from: '', to: '' }]);
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
    const defaultDate = rangeStartDate || moment().format('YYYY-MM-DD');
    setDaysOff([
      ...daysOff,
      { id: newId, startDate: defaultDate, endDate: defaultDate },
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
    setDateRangePickerVisible(false);
  };

  const currentActiveTime = () => {
    if (!activeSlotId) return '08:00';
    const slot = timeSlots.find(s => s.id === activeSlotId);
    if (!slot) return '08:00';
    return activeField === 'from' ? slot.from : slot.to;
  };

  const toMinutes = (time: string) => {
    if (!time || !time.includes(':')) return 0;
    const [h, m] = time.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // Handle Save / Update matching mobile-doctor-app logic
  const handleUpdate = async () => {
    if (isSubmitting) return;

    if (!channelId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin kênh làm việc.');
      return;
    }

    if (!rangeStartDate || !rangeEndDate) {
      Alert.alert('Thông báo', 'Vui lòng chọn khoảng thời gian làm việc.');
      return;
    }

    if (timeSlots.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng thêm ít nhất 01 khung giờ làm việc.');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 01 ngày làm việc trong tuần.');
      return;
    }

    // Validate slots (each slot's end time must be at least 1 hour later than start time)
    const errors: Record<string, string> = {};
    let hasError = false;

    timeSlots.forEach((slot, index) => {
      if (!slot.from || !slot.to) {
        errors[slot.id] = `Ca ${index + 1}: Vui lòng chọn đầy đủ giờ bắt đầu và kết thúc`;
        hasError = true;
      } else if (toMinutes(slot.to) - toMinutes(slot.from) < 60) {
        errors[slot.id] = `Ca ${index + 1}: Giờ kết thúc phải sau giờ bắt đầu ít nhất 1 tiếng`;
        hasError = true;
      }
    });

    setSlotErrors(errors);

    if (hasError) {
      const firstError = Object.values(errors)[0];
      Alert.alert('Lỗi khung giờ', firstError);
      return;
    }

    Keyboard.dismiss();
    setIsSubmitting(true);
    showLoading();

    // Extract slot times matching mobile-doctor-app
    const timeStart1 = timeSlots[0]?.from || '';
    const timeEnd1 = timeSlots[0]?.to || '';
    const timeStart2 = timeSlots[1]?.from || '';
    const timeEnd2 = timeSlots[1]?.to || '';
    const timeStart3 = timeSlots[2]?.from || '';
    const timeEnd3 = timeSlots[2]?.to || '';

    // Convert date range to Date instance matching mobile-doctor-app BookingSetTime
    const startDateVal = rangeStartDate ? new Date(rangeStartDate) : undefined;
    const endDateVal = rangeEndDate ? new Date(rangeEndDate) : undefined;

    // Build dataUpdate array matching mobile-doctor-app BookingSetTime exactly
    const dataUpdate: any[] = [
      { day_from: startDateVal || rangeStartDate, day_to: endDateVal || rangeEndDate },
      timeStart1 ? { time_from1: timeStart1 } : '',
      timeEnd1 ? { time_to1: timeEnd1 } : '',
      timeStart2 ? { time_from2: timeStart2 } : '',
      timeEnd2 ? { time_to2: timeEnd2 } : '',
      timeStart3 ? { time_from3: timeStart3 } : '',
      timeEnd3 ? { time_to3: timeEnd3 } : '',
    ];

    // Build schedule_except from days off
    const exceptDaysSet = new Set<number>();
    daysOff.forEach(dOff => {
      if (dOff.startDate && dOff.endDate) {
        const startM = moment(dOff.startDate);
        const endM = moment(dOff.endDate);
        if (startM.isValid() && endM.isValid()) {
          const cur = startM.clone();
          while (cur.isSameOrBefore(endM, 'day') && exceptDaysSet.size < 31) {
            exceptDaysSet.add(cur.date());
            cur.add(1, 'day');
          }
        }
      }
    });

    const exceptStr =
      exceptDaysSet.size > 0
        ? Array.from(exceptDaysSet)
          .sort((a, b) => a - b)
          .join(',')
        : '';
    if (exceptStr) {
      dataUpdate.push({ schedule_except: exceptStr });
    }

    // Working days: schedule_day_2..8 (2=Thứ 2, ..., 8=Chủ nhật)
    const dayMapUiToApi: Record<string, number> = {
      T2: 2,
      T3: 3,
      T4: 4,
      T5: 5,
      T6: 6,
      T7: 7,
      CN: 8,
    };
    [2, 3, 4, 5, 6, 7, 8].forEach(dayNum => {
      const isWorking = selectedDays.some(d => dayMapUiToApi[d] === dayNum);
      dataUpdate.push({
        [`schedule_day_${dayNum}`]: isWorking ? 1 : 0,
      });
    });

    const updatePayload = {
      id: channelId,
      schedules: JSON.stringify(dataUpdate),
    };

    console.log('====== [WorkingHoursScreen] ON PRESS SAVE ======');
    console.log('[WorkingHoursScreen] Current State:', {
      channelId,
      range: { startDate: startDateVal, endDate: endDateVal },
      timeStart1,
      timeEnd1,
      timeStart2,
      timeEnd2,
      timeStart3,
      timeEnd3,
      exceptDayValue: exceptStr,
      workingDays: [2, 3, 4, 5, 6, 7, 8].reduce((acc, d) => ({
        ...acc,
        [d]: selectedDays.some(sd => dayMapUiToApi[sd] === d),
      }), {}),
    });
    console.log('[WorkingHoursScreen] dataUpdate (Array):', dataUpdate);
    console.log('[WorkingHoursScreen] schedules (JSON String):', updatePayload.schedules);
    console.log('[WorkingHoursScreen] Final Dispatch Payload to updateChannel:', updatePayload);
    console.log('============================================');

    try {
      // Also dispatch to Redux store
      dispatch(updateChannel(updatePayload));

      const res: any = await ApiService.updateChannel(updatePayload);
      console.log('[WorkingHoursScreen] updateChannel response:', res);

      const isOk =
        res?.ok ||
        (res?.status >= 200 && res?.status < 300) ||
        res?.data?.status === 'success' ||
        res?.data?.status === 200;

      if (isOk) {
        // 1. Immediately sync current screen state
        populateScheduleData(dataUpdate);

        // 2. Fetch fresh channel details from server and update Redux store
        try {
          const freshRes: any = await ApiService.getChannelDetail(channelId);
          console.log('fresh channel response after update:', freshRes);
          if (freshRes?.data) {
            dispatch(getChannelDetailCallback({ data: freshRes.data, error: null }));
            const freshRaw = extractSchedules(freshRes);
            const freshParsed = normalizeSchedules(freshRaw);
            if (freshParsed.length > 0) {
              populateScheduleData(freshParsed);
            }
          }
        } catch (fetchErr) {
          console.warn('Error refreshing channel detail after update:', fetchErr);
        }

        Alert.alert('Thành công', 'Đã cập nhật lịch làm việc thành công!', [
          {
            text: 'OK',
            onPress: () => {
              if (typeof route.params?.onUpdateSuccess === 'function') {
                route.params.onUpdateSuccess();
              }
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            },
          },
        ]);
      } else {
        const errorMsg =
          res?.data?.message ||
          res?.problem ||
          'Cập nhật lịch làm việc thất bại. Vui lòng thử lại sau!';
        Alert.alert('Thất bại', errorMsg);
      }
    } catch (err: any) {
      console.log('updateChannel error:', err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Cập nhật lịch làm việc thất bại. Vui lòng thử lại sau!';
      Alert.alert('Thất bại', errorMsg);
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  // Show loading while initial data fetching
  if (isLoadingChannel) {
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <CLoading colorLoading={colors.primary} />
        </View>
      </Wrapper>
    );
  }

  return (
    <Wrapper style={styles.container}>
      {/* Header Aloka UI */}
      <CHeader
        title="Thời gian làm việc"
        isBorderBottom={false}
        leftComponentOnPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Chọn khoảng thời gian */}
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
            <CText
              style={[
                styles.dateRangeText,
                !dateRangeText && { color: '#98A2B3', fontWeight: '400' },
              ]}
            >
              {dateRangeText || 'Chọn khoảng thời gian'}
            </CText>
            <IconX type="ionicons" name="chevron-down" size={18} color="#667085" />
          </TouchableOpacity>
        </View>

        {/* 2. Toggles: Trạng thái nhận ca & Lặp lại theo tuần */}
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

        {/* 3. Days of week: [T2] [T3] [T4] [T5] [T6] [T7] [CN] */}
        <View style={styles.daysRow}>
          {DAYS_OF_WEEK.map(day => {
            const isSelected = selectedDays.includes(day.id);
            return (
              <TouchableOpacity
                key={day.id}
                style={[styles.dayButton, isSelected && styles.dayButtonActive]}
                activeOpacity={0.7}
                onPress={() => toggleDay(day.id)}
              >
                <CText
                  style={[styles.dayText, isSelected && styles.dayTextActive]}
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

        {/* 4. Khung giờ làm việc (Dynamic slots with trash icons) */}
        {timeSlots.map((slot, index) => (
          <View key={slot.id} style={{ marginBottom: 4 }}>
            <View style={styles.timeSlotItem}>
              <View style={styles.timeInputGroup}>
                <CText style={styles.timeLabel}>Bắt đầu</CText>
                <TouchableOpacity
                  style={styles.dropdownBox}
                  activeOpacity={0.7}
                  onPress={() => openTimePicker(slot.id, 'from')}
                >
                  <CText
                    style={[
                      styles.dropdownText,
                      !slot.from && { color: '#98A2B3', fontWeight: '400' },
                    ]}
                  >
                    {slot.from || 'hh:mm'}
                  </CText>
                  <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                </TouchableOpacity>
              </View>

              <View style={styles.timeInputGroup}>
                <CText style={styles.timeLabel}>Kết thúc</CText>
                <TouchableOpacity
                  style={styles.dropdownBox}
                  activeOpacity={0.7}
                  onPress={() => openTimePicker(slot.id, 'to')}
                >
                  <CText
                    style={[
                      styles.dropdownText,
                      !slot.to && { color: '#98A2B3', fontWeight: '400' },
                    ]}
                  >
                    {slot.to || 'hh:mm'}
                  </CText>
                  <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.7}
                onPress={() => handleDeleteTimeSlot(slot.id)}
              >
                <IconX type="ionicons" name="trash-outline" size={20} color="#98A2B3" />
              </TouchableOpacity>
            </View>
            {Boolean(slotErrors[slot.id]) && (
              <CText style={styles.errorText}>{slotErrors[slot.id]}</CText>
            )}
          </View>
        ))}

        {/* Nút thêm khung giờ (nếu < 3 slots) */}
        {timeSlots.length < 3 && (
          <TouchableOpacity
            style={styles.addTimeButton}
            activeOpacity={0.7}
            onPress={handleAddTimeSlot}
          >
            <CText style={styles.addTimeText}>+ Thêm khung giờ làm việc</CText>
          </TouchableOpacity>
        )}

        <View style={styles.sectionDivider} />

        {/* 5. Khối Chọn ngày nghỉ */}
        <View style={styles.dayOffCard}>
          <CText style={styles.dayOffTitle}>Chọn ngày nghỉ</CText>

          {daysOff.map(item => (
            <View key={item.id} style={styles.dayOffRow}>
              <TouchableOpacity
                style={styles.dateSelectBox}
                activeOpacity={0.7}
                onPress={() => openDayOffPicker(item.id)}
              >
                <CText style={styles.dateText}>
                  {item.startDate ? moment(item.startDate).format('D/M/YYYY') : ''}
                </CText>
                <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
              </TouchableOpacity>

              <CText style={styles.dateSeparator}>|</CText>

              <TouchableOpacity
                style={styles.dateSelectBox}
                activeOpacity={0.7}
                onPress={() => openDayOffPicker(item.id)}
              >
                <CText style={styles.dateText}>
                  {item.endDate ? moment(item.endDate).format('D/M/YYYY') : ''}
                </CText>
                <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.7}
                onPress={() => handleDeleteDayOff(item.id)}
              >
                <IconX type="ionicons" name="trash-outline" size={20} color="#98A2B3" />
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
      </ScrollView>

      {/* Fixed Bottom Action Bar: Nút Cập nhật */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={[styles.updateButton, isSubmitting && styles.updateButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleUpdate}
          disabled={isSubmitting}
        >
          <CText style={styles.updateButtonText}>Cập nhật</CText>
        </TouchableOpacity>
      </View>

      {/* Date Range Picker Modal for Working Schedule */}
      <DateRangePickerModal
        title="Chọn khoảng thời gian"
        visible={dateRangePickerVisible}
        startDate={rangeStartDate}
        endDate={rangeEndDate}
        onClose={() => setDateRangePickerVisible(false)}
        onConfirm={handleConfirmDateRange}
      />

      {/* Date Range Picker Modal for Days Off */}
      <DateRangePickerModal
        title="Chọn ngày nghỉ"
        visible={dayOffModalVisible}
        startDate={currentDayOff?.startDate}
        endDate={currentDayOff?.endDate}
        onClose={() => setDayOffModalVisible(false)}
        onConfirm={handleConfirmDayOff}
      />

      {/* Radial Clock Time Picker Modal */}
      <ClockTimePickerModal
        visible={clockModalVisible}
        initialTime={currentActiveTime()}
        onClose={() => setClockModalVisible(false)}
        onConfirm={handleConfirmTime}
      />
    </Wrapper>
  );
};

export default WorkingHoursScreen;
