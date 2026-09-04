import { CHeader, IconX, Wrapper } from '@/components';
import { CText } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import {
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
  title: string;
  timeRange: string;
  address?: string;
  bgColor: string;
  timeSlotHour: string;
}

const DATES: DateItem[] = [
  { dayName: 'CN', dateStr: '22/01', fullDate: '2025-01-22' },
  { dayName: 'T2', dateStr: '23/01', fullDate: '2025-01-23' },
  { dayName: 'T3', dateStr: '24/01', fullDate: '2025-01-24' },
  {
    dayName: 'T4',
    dateStr: '25/01',
    fullDate: '2025-01-25',
    hasSchedule: true,
  },
  {
    dayName: 'T5',
    dateStr: '26/01',
    fullDate: '2025-01-26',
    hasSchedule: true,
  },
  { dayName: 'T6', dateStr: '27/01', fullDate: '2025-01-27' },
  { dayName: 'T7', dateStr: '28/01', fullDate: '2025-01-28' },
];

const SCHEDULE_DATA: ScheduleEvent[] = [
  {
    id: '1',
    timeSlotHour: '07:00',
    timeStart: '07:00',
    title: 'Tắm bé - Massage',
    timeRange: '07:00 - 07:55',
    address: '344 Phạm Ngũ Lão, Cầu Kho, Quận 1, TP.HCM',
    bgColor: '#E0F2FE',
  },
  {
    id: '2',
    timeSlotHour: '08:00',
    timeStart: '08:00',
    title: 'Vệ sinh vết thương',
    timeRange: '08:00 - 9:30',
    address: '344 Phạm Ngũ Lão, Cầu Kho, Quận 1, TP.HCM',
    bgColor: '#E8F8F0',
  },
  {
    id: '3',
    timeSlotHour: '10:00',
    timeStart: '10:00',
    title: 'Tắm bé',
    timeRange: '10:00 - 10:30',
    bgColor: '#FFF1F2',
  },
  {
    id: '4',
    timeSlotHour: '12:00',
    timeStart: '12:00',
    title: 'Hỗ trợ khâu vết thương',
    timeRange: '12:00 - 12:55',
    bgColor: '#FEFBE8',
  },
  {
    id: '5',
    timeSlotHour: '13:00',
    timeStart: '13:00',
    title: 'Hỗ trợ vệ sinh cá nhân',
    timeRange: '13:00 - 13:45',
    bgColor: '#E0F2FE',
  },
];

const TIMELINE_HOURS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
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
  })
);

export const WorkScheduleScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const {
    theme: { colors },
  } = useTheme();

  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-01-25');

  // Filter events based on search
  const filteredEvents = SCHEDULE_DATA.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.address && item.address.toLowerCase().includes(searchText.toLowerCase())),
  );

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
        <CText style={styles.monthTitle}>Tháng 01/2025</CText>
        <TouchableOpacity activeOpacity={0.7}>
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
          {DATES.map(item => {
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
      >
        {TIMELINE_HOURS.map(hour => {
          const matchedEvent = filteredEvents.find(
            ev => ev.timeSlotHour === hour,
          );

          if (hour === '11:00') {
            return (
              <React.Fragment key={hour}>
                <View style={styles.timelineRow}>
                  <View style={styles.timeLabelCol}>
                    <CText style={styles.timeLabelText}>11:00</CText>
                  </View>
                  <View style={styles.cardCol}>
                    <View style={styles.currentTimeRow}>
                      <View style={styles.orangeDotCurrent} />
                      <View style={styles.currentTimeLine} />
                    </View>
                  </View>
                </View>
              </React.Fragment>
            );
          }

          if (matchedEvent) {
            return (
              <View key={hour} style={styles.timelineRow}>
                <View style={styles.timeLabelCol}>
                  <CText style={styles.timeLabelText}>
                    {matchedEvent.timeStart}
                  </CText>
                </View>

                <View style={styles.cardCol}>
                  <View
                    style={[
                      styles.eventCard,
                      { backgroundColor: matchedEvent.bgColor },
                    ]}
                  >
                    <View style={styles.eventTitleRow}>
                      <CText style={styles.eventTitleText}>
                        {matchedEvent.title}
                      </CText>
                      <CText style={styles.eventTimeText}>
                        {matchedEvent.address ? `| ${matchedEvent.timeRange}` : ''}
                      </CText>
                    </View>

                    {!matchedEvent.address && (
                      <CText style={styles.eventAddressTimeOnly}>
                        {matchedEvent.timeRange}
                      </CText>
                    )}


                    {matchedEvent.address && (
                      <CText style={styles.eventAddressText}>
                        {matchedEvent.address}
                      </CText>
                    )}
                  </View>
                </View>
              </View>
            );
          }

          return (
            <View key={hour} style={styles.timelineRow}>
              <View style={styles.timeLabelCol}>
                <CText style={styles.timeLabelText}>{hour}</CText>
              </View>
              <View style={styles.cardCol} />
            </View>
          );
        })}
      </ScrollView>
    </Wrapper>
  );
};

export default WorkScheduleScreen;
