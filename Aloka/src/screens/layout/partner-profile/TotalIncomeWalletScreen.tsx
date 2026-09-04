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
    paddingBottom: 40,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: colors.white,
    borderBottomWidth: 8,
    borderBottomColor: colors.cF2F4F7 || '#F2F4F7',
  },
  totalIncomeCard: {
    backgroundColor: '#EFFBFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4F3F2',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCardHalf: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cEAECF0 || '#EAECF0',
    padding: 16,
  },
  statCardFull: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cEAECF0 || '#EAECF0',
    padding: 16,
  },
  statNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.primary || '#19A2A7',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: colors.c344054 || '#344054',
    lineHeight: 18,
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
  bottomFiller: {
    flex: 1,
    backgroundColor: colors.cF9FAFB || '#F9FAFB',
    minHeight: 180,
  },
  })
);

export const TotalIncomeWalletScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert('Thành công', 'Dữ liệu thu nhập đã được làm mới');
    }, 500);
  };

  const handleWithdraw = () => {
    navigation.navigate('WithdrawScreen');
  };

  return (
    <Wrapper style={styles.container}>
      {/* Pixel-perfect Header matching mockup */}
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

          <CText style={styles.headerTitle}>Ví tổng thu nhập</CText>

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
        {/* Top Section: Balance & Stats Cards */}
        <View style={styles.topSection}>
          {/* Main Balance Box */}
          <View style={styles.totalIncomeCard}>
            <CText style={styles.totalAmountText}>890.000đ</CText>
            <CText style={styles.totalAmountLabel}>Tổng thu nhập (Net)</CText>
          </View>

          {/* Row: Completed Jobs & Cancelled Jobs */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statCardHalf}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('WorkHistoryScreen')}
            >
              <CText style={styles.statNumber}>18</CText>
              <CText style={styles.statLabel}>Công việc hoàn thành</CText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCardHalf}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('WorkHistoryScreen')}
            >
              <CText style={styles.statNumber}>1</CText>
              <CText style={styles.statLabel}>Công việc đã hủy</CText>
            </TouchableOpacity>
          </View>

          {/* Full Width: Total Completed Hours */}
          <TouchableOpacity
            style={styles.statCardFull}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('WorkHistoryScreen')}
          >
            <CText style={styles.statNumber}>25</CText>
            <CText style={styles.statLabel}>Số lượng (giờ) hoàn thành</CText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action Section: Withdraw Button Fixed at Bottom */}
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

export default TotalIncomeWalletScreen;
