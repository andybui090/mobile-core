import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { IconX, Wrapper } from '@/components';
import { CText } from '@/utils';

const { width } = Dimensions.get('window');

const formatNumber = (val: number | string) => {
  const num = typeof val === 'string' ? parseInt(val.replace(/\D/g, ''), 10) || 0 : val;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const useStyles = makeStyles(({ colors }) => ({
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
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.c101828 || '#101828',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  outerCircle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: '#F0FAF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  middleCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#CEF2EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#12B76A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#12B76A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  amountText: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.primary || '#19A2A7',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.c101828 || '#101828',
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.white,
  },
  closeBtn: {
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
  closeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
}));

export const TransactionSuccessScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  const amount = route.params?.amount || '30000';

  const handleClose = () => {
    // Quay về màn hình Ví tổng thu nhập hoặc Hồ sơ
    navigation.navigate('TotalIncomeWalletScreen');
  };

  return (
    <Wrapper style={styles.container}>
      {/* Header */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <CText style={styles.headerTitle}>Thông tin giao dịch</CText>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Multi-layered Success Badge */}
        <View style={styles.outerCircle}>
          <View style={styles.middleCircle}>
            <View style={styles.innerCircle}>
              <IconX
                type="ionicons"
                name="checkmark"
                size={36}
                color={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Amount */}
        <CText style={styles.amountText}>{formatNumber(amount)}đ</CText>

        {/* Status */}
        <CText style={styles.statusText}>Rút tiền thành công</CText>
      </View>

      {/* Bottom Button */}
      <View
        style={[
          styles.bottomSection,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 24 },
        ]}
      >
        <TouchableOpacity
          style={styles.closeBtn}
          activeOpacity={0.8}
          onPress={handleClose}
        >
          <CText style={styles.closeBtnText}>Đóng</CText>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default TransactionSuccessScreen;
