import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { IconX, Wrapper } from '@/components';
import { CText } from '@/utils';

const { width } = Dimensions.get('window');

type FilterStatus = 'ALL' | 'COMPLETED' | 'CANCELLED';

interface JobItem {
  id: string;
  title: string;
  note?: string;
  date: string;
  time: string;
  address: string;
  status: 'COMPLETED' | 'CANCELLED';
  statusText: string;
  cancelReason?: string;
  amount: string;
  isNegative?: boolean;
}

const JOBS_DATA: JobItem[] = [
  {
    id: '1',
    title: 'Tắm bé - Massage',
    note: 'Đến nhà nhớ gọi trước',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    status: 'COMPLETED',
    statusText: 'Đã hoàn thành',
    amount: '219.000đ',
    isNegative: false,
  },
  {
    id: '2',
    title: 'Tắm bé - Massage',
    note: 'Đến nhà nhớ gọi trước',
    date: 'Thứ 4, Ngày 25/01/2026',
    time: '15:30 PM - 17:00 PM',
    address: '44/7 Đường N4, P. Tân Hưng, Quận 7, TP. HCM',
    status: 'CANCELLED',
    statusText: 'Đã huỷ',
    cancelReason: 'Khách hàng báo bận đột xuất',
    amount: '-219.000đ',
    isNegative: true,
  },
];

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerWrapper: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0 || '#EAECF0',
  },
  headerBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeftBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.c101828 || '#101828',
    textAlign: 'center',
  },
  headerRightBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  totalIncomeCard: {
    backgroundColor: '#EFFBFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4F3F2',
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  totalAmountText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary || '#19A2A7',
    marginBottom: 6,
  },
  totalAmountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.c344054 || '#344054',
  },
  dateFilterSection: {
    marginBottom: 16,
  },
  dateFilterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.c1D2939 || '#1D2939',
    marginBottom: 10,
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePickerBox: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cD0D5DD || '#D0D5DD',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 14,
    color: colors.c1D2939 || '#1D2939',
    fontWeight: '400',
  },
  dateDivider: {
    fontSize: 16,
    color: colors.cD0D5DD || '#D0D5DD',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 8,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.c667085 || '#667085',
  },
  tabTextActive: {
    color: '#0086C9',
    fontWeight: '600',
  },
  jobCardCompleted: {
    backgroundColor: '#EBF6FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  jobCardCancelled: {
    backgroundColor: '#FFF5F3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.c1D2939 || '#1D2939',
    marginBottom: 8,
  },
  jobNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  jobNoteText: {
    fontSize: 12.5,
    color: colors.c98A2B3 || '#98A2B3',
    fontStyle: 'italic',
  },
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  jobInfoText: {
    fontSize: 13,
    color: colors.c344054 || '#344054',
    flex: 1,
  },
  statusCompletedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#12B76A',
    marginTop: 6,
    marginBottom: 4,
  },
  statusCancelledText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F79009',
    marginTop: 6,
  },
  cancelReasonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F79009',
    marginTop: 2,
    marginBottom: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.c1D2939 || '#1D2939',
  },
  amountCompletedValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F04438',
  },
  amountCancelledValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F04438',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.cEAECF0 || '#EAECF0',
  },
  withdrawBtn: {
    backgroundColor: colors.primary || '#19A2A7',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary || '#19A2A7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  withdrawBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  })
);

export const WorkHistoryScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [fromDate, setFromDate] = useState('20/06/2026');
  const [toDate, setToDate] = useState('17/07/2026');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert('Thành công', 'Lịch sử công việc đã được cập nhật');
    }, 500);
  };

  const handleWithdraw = () => {
    navigation.navigate('WithdrawScreen');
  };

  const filteredJobs = JOBS_DATA.filter(job => {
    if (filterStatus === 'COMPLETED') return job.status === 'COMPLETED';
    if (filterStatus === 'CANCELLED') return job.status === 'CANCELLED';
    return true;
  });

  return (
    <Wrapper style={styles.container}>
      {/* Header */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerLeftBtn}
            activeOpacity={0.65}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          >
            <IconX
              type="ionicons"
              name="chevron-back"
              size={24}
              color={colors.c344054 || '#344054'}
            />
          </TouchableOpacity>

          <CText style={styles.headerTitle}>Lịch sử công việc</CText>

          <TouchableOpacity
            style={styles.headerRightBtn}
            activeOpacity={0.65}
            onPress={handleRefresh}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={colors.primary || '#19A2A7'} />
            ) : (
              <IconX
                type="ionicons"
                name="sync-outline"
                size={22}
                color={colors.c344054 || '#344054'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Balance Box */}
        <View style={styles.totalIncomeCard}>
          <CText style={styles.totalAmountText}>890.000đ</CText>
          <CText style={styles.totalAmountLabel}>Tổng thu nhập (Net)</CText>
        </View>

        {/* Date Filter Section */}
        <View style={styles.dateFilterSection}>
          <CText style={styles.dateFilterLabel}>Chọn thời gian</CText>
          <View style={styles.dateFilterRow}>
            <TouchableOpacity
              style={styles.datePickerBox}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Chọn ngày', 'Chọn thời gian bắt đầu')}
            >
              <CText style={styles.dateText}>{fromDate}</CText>
              <IconX
                type="ionicons"
                name="chevron-down"
                size={16}
                color={colors.c667085 || '#667085'}
              />
            </TouchableOpacity>

            <CText style={styles.dateDivider}>|</CText>

            <TouchableOpacity
              style={styles.datePickerBox}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Chọn ngày', 'Chọn thời gian kết thúc')}
            >
              <CText style={styles.dateText}>{toDate}</CText>
              <IconX
                type="ionicons"
                name="chevron-down"
                size={16}
                color={colors.c667085 || '#667085'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setFilterStatus('ALL')}
          >
            <CText
              style={[
                styles.tabText,
                filterStatus === 'ALL' && styles.tabTextActive,
              ]}
            >
              Tất cả
            </CText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setFilterStatus('COMPLETED')}
          >
            <CText
              style={[
                styles.tabText,
                filterStatus === 'COMPLETED' && styles.tabTextActive,
              ]}
            >
              Đã hoàn thành
            </CText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setFilterStatus('CANCELLED')}
          >
            <CText
              style={[
                styles.tabText,
                filterStatus === 'CANCELLED' && styles.tabTextActive,
              ]}
            >
              Đã huỷ
            </CText>
          </TouchableOpacity>
        </View>

        {/* Job Cards List */}
        {filteredJobs.map(job => {
          const isCompleted = job.status === 'COMPLETED';

          return (
            <View
              key={job.id}
              style={
                isCompleted
                  ? styles.jobCardCompleted
                  : styles.jobCardCancelled
              }
            >
              <CText style={styles.jobTitle}>{job.title}</CText>

              {!!job.note && (
                <View style={styles.jobNoteRow}>
                  <IconX
                    type="ionicons"
                    name="document-text-outline"
                    size={14}
                    color={colors.c98A2B3 || '#98A2B3'}
                  />
                  <CText style={styles.jobNoteText}>{job.note}</CText>
                </View>
              )}

              <View style={styles.jobInfoRow}>
                <IconX
                  type="ionicons"
                  name="calendar-outline"
                  size={15}
                  color={colors.c344054 || '#344054'}
                />
                <CText style={styles.jobInfoText}>{job.date}</CText>
              </View>

              <View style={styles.jobInfoRow}>
                <IconX
                  type="ionicons"
                  name="time-outline"
                  size={15}
                  color={colors.c344054 || '#344054'}
                />
                <CText style={styles.jobInfoText}>{job.time}</CText>
              </View>

              <View style={styles.jobInfoRow}>
                <IconX
                  type="ionicons"
                  name="location-outline"
                  size={15}
                  color={colors.c344054 || '#344054'}
                />
                <CText style={styles.jobInfoText}>{job.address}</CText>
              </View>

              {isCompleted ? (
                <CText style={styles.statusCompletedText}>
                  Trạng thái: {job.statusText}
                </CText>
              ) : (
                <>
                  <CText style={styles.statusCancelledText}>
                    Trạng thái: {job.statusText}
                  </CText>
                  {!!job.cancelReason && (
                    <CText style={styles.cancelReasonText}>
                      Lý do huỷ: {job.cancelReason}
                    </CText>
                  )}
                </>
              )}

              <View style={styles.cardDivider} />

              <View style={styles.amountRow}>
                <CText style={styles.amountLabel}>Tổng tiền nhận được</CText>
                <CText
                  style={
                    isCompleted
                      ? styles.amountCompletedValue
                      : styles.amountCancelledValue
                  }
                >
                  {job.amount}
                </CText>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Withdraw Action Button Fixed at Bottom */}
      <View
        style={[
          styles.actionSection,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
        ]}
      >
        <TouchableOpacity
          style={styles.withdrawBtn}
          activeOpacity={0.8}
          onPress={handleWithdraw}
        >
          <CText style={styles.withdrawBtnText}>Rút tiền</CText>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default WorkHistoryScreen;
