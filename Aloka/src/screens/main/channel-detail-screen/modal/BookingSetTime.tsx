import { CInput, CInputTouch, IconType, IconX } from '@/components';
import { screenStyles } from '@/configs';
import i18n from '@/i18n';
import {
  resetPackageChannel,
  updateChannel,
} from '@/redux/slices/channelSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CScrollView, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

interface ScheduleData {
  day_from?: string;
  day_to?: string;
  time_from1?: string;
  time_to1?: string;
  time_from2?: string;
  time_to2?: string;
  time_from3?: string;
  time_to3?: string;
}

export interface BookingSetTimeProps {
  visible: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
  channelId: string;
  schedules: ScheduleData[];
}

export const BookingSetTime: React.FC<BookingSetTimeProps> = ({
  visible,
  onClose,
  onUpdateSuccess,
  channelId,
  schedules,
}) => {
  const scrollRef = useRef<any>(null);
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { dataUpdateChannel } = useAppSelector(state => state.channelReducer);

  const appointmentTimeRef = useRef<any>(null);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [range, setRange] = useState<{ startDate?: Date; endDate?: Date }>({});

  const [timeStart1, setTimeStart1] = useState<string>('');
  const [timeEnd1, setTimeEnd1] = useState<string>('');
  const [errTime1, setErrTime1] = useState<string>('');

  const [timeStart2, setTimeStart2] = useState<string>('');
  const [timeEnd2, setTimeEnd2] = useState<string>('');
  const [errTime2, setErrTime2] = useState<string>('');

  // 🔥 CA THỨ 3
  const [timeStart3, setTimeStart3] = useState<string>('');
  const [timeEnd3, setTimeEnd3] = useState<string>('');
  const [errTime3, setErrTime3] = useState<string>('');

  const [timePickerVisible, setTimePickerVisible] = useState<null | {
    field: string;
  }>(null);

  const [activeBtn, setActiveBtn] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const [exceptDayValue, setExceptDayValue] = useState<string>('');
  const [errExceptDay, setErrExceptDay] = useState<string>('');

  // 🔥 WORKING DAYS: Thứ 2 (2) → Chủ nhật (8)
  const [workingDays, setWorkingDays] = useState<Record<number, boolean>>({
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  });

  /* ================= PARSE SCHEDULE ================= */

  const isValidDate = (value?: string) => {
    if (!value) return false;
    const d = new Date(value);
    return d instanceof Date && !isNaN(d.getTime());
  };

  const isValidTime = (time?: string) => {
    if (!time) return false;
    if (time === 'Invalid date') return false;
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  };

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      const merged = schedules.reduce(
        (acc: any, cur: any) => ({ ...acc, ...cur }),
        {},
      );

      const startValid = isValidDate(merged.day_from);
      const endValid = isValidDate(merged.day_to);

      if (startValid || endValid) {
        setRange({
          startDate: startValid ? new Date(merged.day_from!) : undefined,
          endDate: endValid ? new Date(merged.day_to!) : undefined,
        });
      } else {
        // 🔥 cả 2 đều Invalid → để trống
        setRange({});
      }

      setTimeStart1(isValidTime(merged.time_from1) ? merged.time_from1 : '');
      setTimeEnd1(isValidTime(merged.time_to1) ? merged.time_to1 : '');

      setTimeStart2(isValidTime(merged.time_from2) ? merged.time_from2 : '');
      setTimeEnd2(isValidTime(merged.time_to2) ? merged.time_to2 : '');

      setTimeStart3(isValidTime(merged.time_from3) ? merged.time_from3 : '');
      setTimeEnd3(isValidTime(merged.time_to3) ? merged.time_to3 : '');

      if (merged.schedule_except) {
        setExceptDayValue(
          merged.schedule_except
            .split(',')
            .map((d: any) => d.trim())
            .filter(Boolean)
            .join(','),
        );
      }

      // 👇 THÊM Ở ĐÂY
      const wd: any = {};
      for (let i = 2; i <= 8; i++) {
        wd[i] = merged[`schedule_day_${i}`] === 1;
      }
      setWorkingDays(wd);
    }
  }, [schedules, visible]);

  useEffect(() => {
    if (range.startDate && range.endDate) {
      setActiveBtn(true);
    }
  }, [range.startDate, range.endDate]);

  /* ================= API RESULT ================= */

  useEffect(() => {
    const { loading, data, error } = dataUpdateChannel;
    if (!loading) {
      setIsLoadingAPI(false);

      if (data) {
        dispatch(resetPackageChannel());
        onUpdateSuccess();
      }

      if (error) {
        dispatch(resetPackageChannel());
      }
    }
  }, [dataUpdateChannel]);

  /* ================= HELPERS ================= */

  const handleTouchRangeDate = () => {
    setDatePickerVisible(true);
  };

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  /* ================= SAVE ================= */

  const normalizeExceptDayValue = () => {
    const days = exceptDayValue
      .split(',')
      .filter(Boolean)
      .map(Number)
      .filter(d => d >= 1 && d <= 31);

    return Array.from(new Set(days))
      .sort((a, b) => a - b)
      .join(',');
  };

  const handleSave = () => {
    if (isLoadingAPI) return;

    let hasError = false;

    if (timeStart1 && timeEnd1) {
      if (toMinutes(timeEnd1) - toMinutes(timeStart1) < 60) {
        setErrTime1('End time must be at least 1 hour later than start time');
        hasError = true;
      } else {
        setErrTime1('');
      }
    }

    if (timeStart2 && timeEnd2) {
      if (toMinutes(timeEnd2) - toMinutes(timeStart2) < 60) {
        setErrTime2('End time must be at least 1 hour later than start time');
        hasError = true;
      } else {
        setErrTime2('');
      }
    }

    if (timeStart3 && timeEnd3) {
      if (toMinutes(timeEnd3) - toMinutes(timeStart3) < 60) {
        setErrTime3('End time must be at least 1 hour later than start time');
        hasError = true;
      } else {
        setErrTime3('');
      }
    }

    if (hasError) return;

    if (range.startDate && range.endDate) {
      const dataUpdate: any[] = [
        { day_from: range.startDate, day_to: range.endDate },
        timeStart1 && { time_from1: timeStart1 },
        timeEnd1 && { time_to1: timeEnd1 },
        timeStart2 && { time_from2: timeStart2 },
        timeEnd2 && { time_to2: timeEnd2 },
        timeStart3 && { time_from3: timeStart3 },
        timeEnd3 && { time_to3: timeEnd3 },
      ];

      const except = normalizeExceptDayValue();
      if (except) {
        dataUpdate.push({ schedule_except: except });
      }
      Object.entries(workingDays).forEach(([day, isWorking]) => {
        dataUpdate.push({
          [`schedule_day_${day}`]: isWorking ? 1 : 0,
        });
      });
      setIsLoadingAPI(true);

      dispatch(
        updateChannel({
          id: channelId,
          schedules: JSON.stringify(dataUpdate),
        }),
      );
    }
  };

  const handleChangeExceptDay = (text: string) => {
    // cho phép số, dấu phẩy, space
    if (!/^[0-9,\s]*$/.test(text)) {
      setErrExceptDay(
        t(
          'package.invalidExceptionDays',
          'Only numbers and commas are allowed',
        ),
      );
      return;
    }
    // chỉ strip space, KHÔNG parse / sort ở đây
    const cleaned = text.replace(/\s+/g, '');
    setExceptDayValue(cleaned);
    setErrExceptDay('');
  };

  const normalizeExceptDay = () => {
    if (!exceptDayValue) return;

    const days = exceptDayValue
      .split(',')
      .filter(Boolean) // bỏ phần rỗng
      .map(Number)
      .filter(d => d >= 1 && d <= 31);

    const uniqueDays = Array.from(new Set(days)).sort((a, b) => a - b);

    setExceptDayValue(uniqueDays.join(','));
  };

  /* ================= RENDER ================= */

  const renderTitle = () => (
    <Row between style={screenStyles.modalTopHeader}>
      <Pressable onPress={onClose}>
        <IconX
          name={'close'}
          type={IconType.ANT_DESIGN}
          color={colors.c667085}
          size={24}
        />
      </Pressable>
      <CText h4 w600 color={colors.c101828}>
        {t('booking.workSchedule', 'Work schedule')}
      </CText>
      <View style={screenStyles.box24} />
    </Row>
  );

  const renderTimePicker = () => (
    <CInputTouch
      refChild={appointmentTimeRef}
      isRequire
      name={'packageOption'}
      value={
        range.startDate && range.endDate
          ? `${range.startDate.toLocaleDateString()} - ${range.endDate.toLocaleDateString()}`
          : ''
      }
      onTouch={handleTouchRangeDate}
      errorText={''}
      label={t('date.selectRange', 'Select Range')}
      placeHolder={'DD/MM/YYYY - DD/MM/YYYY'}
    />
  );

  const renderExceptionDayBlock = () => {
    return (
      <CInput
        value={exceptDayValue}
        onChange={handleChangeExceptDay}
        errorText={errExceptDay}
        onBlur={normalizeExceptDay}
        label={t('package.exceptionDays', 'Exception days')}
        placeHolder={'1,7,16,...'}
        maxLength={64}
        keyboardType={'default'}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  };

  const renderWorkingDays = () => {
    const labels: any = {
      2: t('common.monday', 'Mon'),
      3: t('common.tuesday', 'Tue'),
      4: t('common.wednesday', 'Wed'),
      5: t('common.thursday', 'Thu'),
      6: t('common.friday', 'Fri'),
      7: t('common.saturday', 'Sat'),
      8: t('common.sunday', 'Sun'),
    };

    return (
      <View style={{ marginTop: 12 }}>
        <CText h5 color={colors.c344054}>
          {t('booking.workingDays', 'Working days')}
        </CText>

        <Row start style={{ marginTop: 8, flexWrap: 'wrap' }}>
          {[2, 3, 4, 5, 6, 7, 8].map(day => {
            const active = workingDays[day];
            return (
              <Pressable
                key={day}
                onPress={() =>
                  setWorkingDays(prev => ({
                    ...prev,
                    [day]: !prev[day],
                  }))
                }
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 16,
                  marginRight: 8,
                  marginBottom: 8,
                  backgroundColor: active ? colors.primary : colors.cF2F4F7,
                }}
              >
                <CText h5 color={active ? colors.white : colors.c667085}>
                  {labels[day]}
                </CText>
              </Pressable>
            );
          })}
        </Row>
      </View>
    );
  };

  const renderTimeBlock = (
    start: string,
    end: string,
    onStart: () => void,
    onEnd: () => void,
    error?: string,
  ) => (
    <>
      <Row between>
        <View style={{ flex: 1, marginRight: 10 }}>
          <CInputTouch
            value={start}
            onTouch={onStart}
            label={t('booking.startTime', 'Start time')}
            placeHolder={'hh:mm'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CInputTouch
            value={end}
            onTouch={onEnd}
            label={t('booking.endTime', 'End time')}
            placeHolder={'hh:mm'}
          />
        </View>
      </Row>
      {error && (
        <CText h5 w400 style={{ color: '#F04438' }}>
          {error}
        </CText>
      )}
    </>
  );

  const renderContent = () => (
    <View style={screenStyles.wrapModalTop}>
      {renderTitle()}
      <Divider />
      <CScrollView innerRef={scrollRef} style={screenStyles.pH24}>
        <View style={{ height: 8 }} />
        {renderTimePicker()}
        {renderExceptionDayBlock()}
        {renderWorkingDays()}
        <CText h5 color={colors.c667085} style={{ marginTop: 8 }}>
          {t('booking.dailyWorkingHours', 'Daily working hours')}
        </CText>
        <View style={{ height: 4 }} />

        {renderTimeBlock(
          timeStart1,
          timeEnd1,
          () => setTimePickerVisible({ field: 'timeStart1' }),
          () => setTimePickerVisible({ field: 'timeEnd1' }),
          errTime1,
        )}

        {renderTimeBlock(
          timeStart2,
          timeEnd2,
          () => setTimePickerVisible({ field: 'timeStart2' }),
          () => setTimePickerVisible({ field: 'timeEnd2' }),
          errTime2,
        )}

        {renderTimeBlock(
          timeStart3,
          timeEnd3,
          () => setTimePickerVisible({ field: 'timeStart3' }),
          () => setTimePickerVisible({ field: 'timeEnd3' }),
          errTime3,
        )}
      </CScrollView>

      <View style={screenStyles.pH24}>
        <CButton
          title={t('common.save', 'Save')}
          btnWidth={'100%'}
          onPress={handleSave}
          isDisable={!activeBtn || isLoadingAPI}
          isBottom
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View style={styles.backdrop} />
        </Pressable>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>

      {/* {renderContent()} */}

      <DatePickerModal
        locale={i18n.language === 'vi' ? 'vi' : 'en'}
        mode="range"
        visible={datePickerVisible}
        startDate={range.startDate}
        endDate={range.endDate}
        onDismiss={() => setDatePickerVisible(false)}
        onConfirm={({ startDate, endDate }) => {
          setRange({ startDate, endDate });
          setDatePickerVisible(false);
        }}
        validRange={{ startDate: new Date() }}
      />

      <TimePickerModal
        locale={i18n.language === 'vi' ? 'vi' : 'en'}
        visible={timePickerVisible !== null}
        onDismiss={() => setTimePickerVisible(null)}
        onConfirm={({ hours, minutes }) => {
          const formatted = `${String(hours).padStart(2, '0')}:${String(
            minutes,
          ).padStart(2, '0')}`;

          switch (timePickerVisible?.field) {
            case 'timeStart1':
              setTimeStart1(formatted);
              break;
            case 'timeEnd1':
              setTimeEnd1(formatted);
              break;
            case 'timeStart2':
              setTimeStart2(formatted);
              break;
            case 'timeEnd2':
              setTimeEnd2(formatted);
              break;
            case 'timeStart3':
              setTimeStart3(formatted);
              break;
            case 'timeEnd3':
              setTimeEnd3(formatted);
              break;
          }
          setTimePickerVisible(null);
        }}
        hours={8}
        minutes={0}
        label={t('common.time', 'Time')}
        cancelLabel={t('common.cancel')}
        confirmLabel={t('common.save')}
      />

      {isLoadingAPI && (
        <View style={styles.loadingOverlay} accessibilityRole="progressbar">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  contentContainer: {
    width: '100%',
    height: '87%',
  },
});
