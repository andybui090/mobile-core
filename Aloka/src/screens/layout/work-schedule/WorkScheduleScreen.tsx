import {
  CHeader,
  IconX,
  Wrapper,
  hideLoading,
} from '@/components';
import { DateRangePickerModal } from '@/components/picker/DateRangePickerModal';
import { STORAGEKEY } from '@/constants';
import { AppContext } from '@/contexts';
import ApiService from '@/services/api-base';
import { getObjectData } from '@/storages';
import { CText } from '@/utils';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import moment from 'moment';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface DateItem {
  dayName: string;
  dateStr: string;
  fullDate: string;
  hasSchedule?: boolean;
}

interface ScheduleEvent {
  id: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  timeRange: string;
  address?: string;
  bgColor: string;
  timeSlotHour: string;
}

const BG_COLORS = ['#E0F2FE', '#E8F8F0', '#FFF1F2', '#FEFBE8'];

const TIMELINE_HOURS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
    },
    searchBox: {
      height: 42,
      backgroundColor: '#F9FAFB',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.cEAECF0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 14,
      color: colors.c1D2939,
      paddingVertical: 0,
    },
    // Calendar header
    monthHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    monthTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.c1D2939,
    },
    // Date strip
    dateStripContainer: {
      paddingHorizontal: 12,
      marginBottom: 16,
    },
    dateStripContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateBox: {
      width: 46,
      height: 58,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.cEAECF0,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 3,
    },
    dateBoxSelected: {
      borderColor: colors.primary,
      borderWidth: 1.5,
    },
    dayNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    dayNameText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.c344054,
    },
    dayNameTextSelected: {
      color: colors.primary,
    },
    orangeDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: '#F79009',
      marginLeft: 3,
    },
    dateNumText: {
      fontSize: 11,
      color: colors.c98A2B3,
      fontWeight: '500',
    },
    dateNumTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
    // Timeline Section
    timelineScroll: {
      flex: 1,
      paddingHorizontal: 16,
    },
    timelineScrollContent: {
      paddingBottom: 40,
    },
    timelineRow: {
      flexDirection: 'row',
      marginBottom: 14,
      minHeight: 52,
    },
    timeLabelCol: {
      width: 56,
      paddingTop: 4,
    },
    timeLabelText: {
      fontSize: 13,
      color: colors.c344054,
      fontWeight: '500',
    },
    cardCol: {
      flex: 1,
      justifyContent: 'center',
    },
    // Event Card
    eventCard: {
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 4,
    },
    eventTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    eventTitleText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.c1D2939,
    },
    eventTimeText: {
      fontSize: 13,
      color: colors.c667085,
      fontWeight: '500',
      marginLeft: 6,
    },
    eventAddressText: {
      fontSize: 12,
      color: colors.c667085,
      marginTop: 6,
      lineHeight: 16,
    },
    eventAddressTimeOnly: {
      fontSize: 12,
      color: colors.c667085,
      marginTop: 4,
      lineHeight: 16,
    },
    // Current time line
    currentTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    orangeDotCurrent: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#F97066',
      marginRight: 6,
    },
    currentTimeLine: {
      flex: 1,
      height: 1.5,
      backgroundColor: '#F97066',
    },
    loadingWrap: {
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyWrap: {
      paddingVertical: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      marginTop: 12,
      fontSize: 14,
      color: colors.c667085 || '#667085',
      textAlign: 'center',
    },
  }),
);

export const WorkScheduleScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useContext<any>(AppContext) || {};
  const {
    theme: { colors },
  } = useTheme();

  const channelId = user?.channel_id || route.params?.channelId;

  // Selected date (Defaults to current date YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Raw appointments from API
  const [appointments, setAppointments] = useState<any[]>([]);

  // Fetch appointments from API
  const fetchAppointments = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      let header = ApiService.getAuthorizationHeader();
      if (!header || header === 'Bearer ' || header === 'Bearer undefined') {
        const jwtToken: any = await getObjectData(STORAGEKEY.JWT_TOKEN);
        const token = jwtToken?.access_token || jwtToken?.accessToken;
        if (token) {
          ApiService.setAuthorizationHeader(token);
        }
      }

      const param: any = {
        limit: 100,
        offset: 0,
        sort: 'date',
      };

      let res: any = await ApiService.getHistoryBookings(param);

      if (!res?.ok && res?.status === 401) {
        const jwtToken: any = await getObjectData(STORAGEKEY.JWT_TOKEN);
        const token = jwtToken?.access_token || jwtToken?.accessToken;
        if (token) {
          ApiService.setAuthorizationHeader(token);
          res = await ApiService.getHistoryBookings(param);
        }
      }

      console.log('[WorkScheduleScreen] getHistoryBookings res:', res);

      if (res?.ok) {
        const items: any[] =
          res?.data?.items ||
          res?.data?.result?.items ||
          res?.data?.result?.item ||
          (Array.isArray(res?.data) ? res.data : []) ||
          [];
        setAppointments(items);
      }
    } catch (err) {
      console.warn('[WorkScheduleScreen] fetchAppointments error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      hideLoading(true);
      fetchAppointments(true);
    }, [fetchAppointments]),
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAppointments(false);
  };

  // Generate 7 days of the week around selectedDate
  const datesStrip: DateItem[] = useMemo(() => {
    const base = moment(selectedDate).isValid() ? moment(selectedDate) : moment();
    const startOfWeek = base.clone().startOf('week'); // Sunday
    const list: DateItem[] = [];
    const vnDayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < 7; i++) {
      const cur = startOfWeek.clone().add(i, 'days');
      const fullDate = cur.format('YYYY-MM-DD');
      const dateStr = cur.format('DD/MM');
      const dayName = vnDayNames[cur.day()];

      // Check if this date has any appointment
      const hasSchedule = appointments.some(appt => {
        if (!appt?.date) return false;
        return moment(appt.date).isSame(cur, 'day');
      });

      list.push({
        dayName,
        dateStr,
        fullDate,
        hasSchedule,
      });
    }

    return list;
  }, [selectedDate, appointments]);

  // Month header text: e.g. "Tháng 01/2025" or "Tháng 09/2026"
  const monthTitle = useMemo(() => {
    const m = moment(selectedDate).isValid() ? moment(selectedDate) : moment();
    return `Tháng ${m.format('MM/YYYY')}`;
  }, [selectedDate]);

  // Map API appointments to ScheduleEvents on selectedDate
  const eventsForSelectedDate: ScheduleEvent[] = useMemo(() => {
    const filtered = appointments.filter(item => {
      if (!item?.date) return false;
      return moment(item.date).isSame(moment(selectedDate), 'day');
    });

    if (filtered.length > 0) {
      return filtered.map((item, idx) => {
        const startM = moment(item.date);
        const duration = Number(item.duration) || 60;
        const endM = startM.clone().add(duration, 'minutes');
        const timeStart = startM.format('HH:mm');
        const timeEnd = endM.format('HH:mm');
        const timeSlotHour = `${startM.format('HH')}:00`;

        const title =
          item.package?.name ||
          item.package_name ||
          item.name ||
          item.title ||
          'Dịch vụ y tế';

        const address =
          item.address ||
          item.customer_address ||
          item.user?.address ||
          item.patient_address ||
          '';

        const bgColor = BG_COLORS[idx % BG_COLORS.length];

        return {
          id: String(item.id || item._id || idx),
          timeSlotHour,
          timeStart,
          timeEnd,
          title,
          timeRange: `${timeStart} - ${timeEnd}`,
          address,
          bgColor,
        };
      });
    }

    return [];
  }, [appointments, selectedDate]);

  // Filter events based on search
  const filteredEvents = useMemo(() => {
    if (!searchText.trim()) return eventsForSelectedDate;
    const q = searchText.toLowerCase().trim();
    return eventsForSelectedDate.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        (item.address && item.address.toLowerCase().includes(q)),
    );
  }, [eventsForSelectedDate, searchText]);

  const isToday = moment(selectedDate).isSame(moment(), 'day');
  const currentHourString = `${moment().format('HH')}:00`;

  return (
    <Wrapper style={styles.container}>
      <CHeader
        title="Lịch làm việc"
        isBorderBottom
        leftComponentOnPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <IconX
            type="ionicons"
            name="search-outline"
            size={18}
            color={colors.c98A2B3}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={colors.c98A2B3}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <IconX
                type="ionicons"
                name="close-circle"
                size={18}
                color={colors.c98A2B3}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Month Header */}
      <View style={styles.monthHeader}>
        <CText style={styles.monthTitle}>{monthTitle}</CText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setDatePickerVisible(true)}
        >
          <IconX
            type="ionicons"
            name="calendar-outline"
            size={22}
            color={colors.c344054}
          />
        </TouchableOpacity>
      </View>

      {/* Horizontal Date Strip */}
      <View style={styles.dateStripContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStripContent}
        >
          {datesStrip.map(item => {
            const isSelected = item.fullDate === selectedDate;
            return (
              <TouchableOpacity
                key={item.fullDate}
                style={[
                  styles.dateBox,
                  isSelected && styles.dateBoxSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedDate(item.fullDate)}
              >
                <View style={styles.dayNameRow}>
                  <CText
                    style={[
                      styles.dayNameText,
                      isSelected && styles.dayNameTextSelected,
                    ]}
                  >
                    {item.dayName}
                  </CText>
                  {item.hasSchedule && <View style={styles.orangeDot} />}
                </View>
                <CText
                  style={[
                    styles.dateNumText,
                    isSelected && styles.dateNumTextSelected,
                  ]}
                >
                  {item.dateStr}
                </CText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Timeline Schedule View */}
      <ScrollView
        style={styles.timelineScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.timelineScrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && !isRefreshing && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        {!isLoading && filteredEvents.length === 0 ? (
          <View style={styles.emptyWrap}>
            <IconX
              type="ionicons"
              name="calendar-outline"
              size={56}
              color={colors.cD0D5DD || '#D0D5DD'}
            />
            <CText style={styles.emptyText}>
              {searchText
                ? 'Không tìm thấy lịch làm việc phù hợp'
                : 'Chưa có lịch làm việc trong ngày này'}
            </CText>
          </View>
        ) : (
          TIMELINE_HOURS.map(hour => {
            const matchedEvents = filteredEvents.filter(
              ev => ev.timeSlotHour === hour,
            );
            const isCurrentSlot = isToday && hour === currentHourString;

            return (
              <View key={hour} style={styles.timelineRow}>
                <View style={styles.timeLabelCol}>
                  <CText style={styles.timeLabelText}>{hour}</CText>
                </View>

                <View style={styles.cardCol}>
                  {/* Red Current Time Line if viewing today and matching current hour */}
                  {isCurrentSlot && (
                    <View style={styles.currentTimeRow}>
                      <View style={styles.orangeDotCurrent} />
                      <View style={styles.currentTimeLine} />
                    </View>
                  )}

                  {/* Event Cards */}
                  {matchedEvents.map(ev => (
                    <View
                      key={ev.id}
                      style={[
                        styles.eventCard,
                        { backgroundColor: ev.bgColor },
                        matchedEvents.length > 1 && { marginBottom: 8 },
                      ]}
                    >
                      <View style={styles.eventTitleRow}>
                        <CText style={styles.eventTitleText}>
                          {ev.title}
                        </CText>
                        <CText style={styles.eventTimeText}>
                          {ev.address ? `| ${ev.timeRange}` : ''}
                        </CText>
                      </View>

                      {!ev.address && (
                        <CText style={styles.eventAddressTimeOnly}>
                          {ev.timeRange}
                        </CText>
                      )}

                      {Boolean(ev.address) && (
                        <CText style={styles.eventAddressText}>
                          {ev.address}
                        </CText>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Date Picker Modal to pick any date */}
      <DateRangePickerModal
        visible={datePickerVisible}
        title="Chọn ngày"
        mode="single"
        startDate={selectedDate}
        endDate={selectedDate}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={({ startDate }) => {
          if (startDate) {
            setSelectedDate(startDate);
          }
        }}
      />
    </Wrapper>
  );
};

export default WorkScheduleScreen;
