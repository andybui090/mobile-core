import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { IconX, Wrapper } from '@/components';
import { CText } from '@/utils';

const { width } = Dimensions.get('window');

const PRESET_AMOUNTS = [50000, 100000, 200000];

const formatNumber = (val: number | string) => {
  const num = typeof val === 'string' ? parseInt(val.replace(/\D/g, ''), 10) || 0 : val;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const KEYPAD_ROWS = [
  [
    { key: '1', sub: '' },
    { key: '2', sub: 'ABC' },
    { key: '3', sub: 'DEF' },
  ],
  [
    { key: '4', sub: 'GHI' },
    { key: '5', sub: 'JKL' },
    { key: '6', sub: 'MNO' },
  ],
  [
    { key: '7', sub: 'PQRS' },
    { key: '8', sub: 'TUV' },
    { key: '9', sub: 'WXYZ' },
  ],
  [
    { key: '+ * #', isSpecial: true },
    { key: '0', sub: '' },
    { key: 'delete', isDelete: true },
  ],
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
  headerRightPlaceholder: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 8,
    borderBottomColor: colors.cF2F4F7 || '#F2F4F7',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  balanceTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.c344054 || '#344054',
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary || '#19A2A7',
  },
  myWalletLink: {
    fontSize: 13.5,
    color: '#2E90FA',
    textDecorationLine: 'underline',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  presetBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cEAECF0 || '#EAECF0',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: colors.primary || '#19A2A7',
    borderColor: colors.primary || '#19A2A7',
  },
  presetBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.c344054 || '#344054',
  },
  presetBtnTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  withdrawAllBtn: {
    height: 38,
    borderRadius: 6,
    backgroundColor: colors.primary || '#19A2A7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  withdrawAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  amountInputBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cEAECF0 || '#EAECF0',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  amountInputLabel: {
    fontSize: 12,
    color: colors.c667085 || '#667085',
    marginBottom: 6,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountTextInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '600',
    color: colors.primary || '#19A2A7',
    padding: 0,
  },
  amountCurrency: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.c344054 || '#344054',
    marginRight: 10,
  },
  clearBtn: {
    padding: 4,
  },
  bankSection: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  bankSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.c101828 || '#101828',
    marginBottom: 4,
  },
  bankSectionSubtitle: {
    fontSize: 12.5,
    color: colors.c667085 || '#667085',
    marginBottom: 16,
  },
  bankItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bankLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#00529C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankLogoText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  bankNameText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.c1D2939 || '#1D2939',
  },
  addBankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
    gap: 12,
  },
  addBankText: {
    fontSize: 14.5,
    color: colors.c475467 || '#475467',
  },
  confirmSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.cEAECF0 || '#EAECF0',
  },
  confirmBtn: {
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
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  bottomFiller: {
    flex: 1,
    backgroundColor: colors.cF9FAFB || '#F9FAFB',
    minHeight: 180,
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0 || '#EAECF0',
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.c101828 || '#101828',
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 16,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  pinBox: {
    width: 44,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cEAECF0 || '#EAECF0',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBoxActive: {
    borderColor: colors.primary || '#19A2A7',
    borderWidth: 1.5,
  },
  pinCursor: {
    fontSize: 22,
    fontWeight: '300',
    color: colors.primary || '#19A2A7',
    opacity: 0.8,
  },
  pinDash: {
    fontSize: 18,
    color: colors.cD0D5DD || '#D0D5DD',
    fontWeight: '600',
  },
  pinDot: {
    fontSize: 20,
    color: colors.c101828 || '#101828',
    fontWeight: '800',
  },
  keypadContainer: {
    backgroundColor: '#ECEEF1',
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  keypadKey: {
    flex: 1,
    height: 46,
    backgroundColor: colors.white,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  keypadKeyTransparent: {
    flex: 1,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  keypadNumber: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.c101828 || '#101828',
    lineHeight: 25,
  },
  keypadSubText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.c344054 || '#344054',
    letterSpacing: 1.5,
    marginTop: -2,
  },
  keypadSpecialText: {
    fontSize: 18,
    color: colors.c344054 || '#344054',
    fontWeight: '500',
    letterSpacing: 2,
  },
  })
);

export const WithdrawScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  const totalBalance = 200000;
  const [amountInput, setAmountInput] = useState('30000');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(50000);
  const [selectedBank, setSelectedBank] = useState('acb');

  // Modal PIN state
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState('');

  const handleSelectPreset = (amount: number) => {
    setSelectedPreset(amount);
    setAmountInput(amount.toString());
  };

  const handleWithdrawAll = () => {
    setSelectedPreset(null);
    setAmountInput(totalBalance.toString());
  };

  const handleChangeAmount = (text: string) => {
    const rawNumber = text.replace(/\D/g, '');
    setSelectedPreset(null);
    setAmountInput(rawNumber);
  };

  const handleClearAmount = () => {
    setAmountInput('');
    setSelectedPreset(null);
  };

  const handleOpenPinModal = () => {
    const num = parseInt(amountInput, 10) || 0;
    if (num <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền muốn rút');
      return;
    }
    if (num > totalBalance) {
      Alert.alert(
        'Lỗi',
        `Số tiền rút (${formatNumber(num)}đ) vượt quá số dư hiện tại (${formatNumber(
          totalBalance,
        )}đ)`,
      );
      return;
    }

    setPinCode('');
    setIsPinModalVisible(true);
  };

  const handleKeyPress = (key: string) => {
    if (pinCode.length >= 6) return;
    const nextPin = pinCode + key;
    setPinCode(nextPin);

    // Khi nhập đủ 6 số, tự động chuyển sang màn Thông tin giao dịch thành công
    if (nextPin.length === 6) {
      setTimeout(() => {
        setIsPinModalVisible(false);
        navigation.navigate('TransactionSuccessScreen', {
          amount: amountInput || '30000',
        });
      }, 300);
    }
  };

  const handleDeletePress = () => {
    if (pinCode.length > 0) {
      setPinCode(pinCode.slice(0, -1));
    }
  };

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

          <CText style={styles.headerTitle}>Rút tiền</CText>

          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Carely Balance & Amount input */}
        <View style={styles.topSection}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceTextWrap}>
              <CText style={styles.balanceLabel}>Số dư Carely </CText>
              <CText style={styles.balanceAmount}>{formatNumber(totalBalance)}đ</CText>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('TotalIncomeWalletScreen');
              }}
            >
              <CText style={styles.myWalletLink}>Ví của tôi</CText>
            </TouchableOpacity>
          </View>

          {/* 3 Preset Amount Buttons */}
          <View style={styles.presetRow}>
            {PRESET_AMOUNTS.map(preset => {
              const isActive = selectedPreset === preset;
              return (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetBtn,
                    isActive && styles.presetBtnActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleSelectPreset(preset)}
                >
                  <CText
                    style={[
                      styles.presetBtnText,
                      isActive && styles.presetBtnTextActive,
                    ]}
                  >
                    {formatNumber(preset)}đ
                  </CText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Withdraw All Button */}
          <TouchableOpacity
            style={styles.withdrawAllBtn}
            activeOpacity={0.8}
            onPress={handleWithdrawAll}
          >
            <CText style={styles.withdrawAllText}>Rút tất cả</CText>
          </TouchableOpacity>

          {/* Amount Input Box */}
          <View style={styles.amountInputBox}>
            <CText style={styles.amountInputLabel}>Nhập số tiền</CText>
            <View style={styles.amountInputRow}>
              <TextInput
                style={styles.amountTextInput}
                keyboardType="numeric"
                value={formatNumber(amountInput)}
                onChangeText={handleChangeAmount}
                placeholder="0"
                placeholderTextColor={colors.c98A2B3 || '#98A2B3'}
              />
              <CText style={styles.amountCurrency}>đ</CText>

              {!!amountInput && (
                <TouchableOpacity
                  style={styles.clearBtn}
                  activeOpacity={0.65}
                  onPress={handleClearAmount}
                >
                  <IconX
                    type="ionicons"
                    name="close-circle"
                    size={19}
                    color={colors.cD0D5DD || '#D0D5DD'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Section 2: Bank Selection */}
        <View style={styles.bankSection}>
          <CText style={styles.bankSectionTitle}>Rút về ngân hàng</CText>
          <CText style={styles.bankSectionSubtitle}>
            Miễn phí 03 giao dịch thành công đầu tiên
          </CText>

          {/* Bank Option 1: ACB */}
          <TouchableOpacity
            style={styles.bankItemRow}
            activeOpacity={0.7}
            onPress={() => setSelectedBank('acb')}
          >
            <View style={styles.bankLogoBox}>
              <CText style={styles.bankLogoText}>ACB</CText>
            </View>

            <CText style={styles.bankNameText}>Ngân hàng Á Châu (ACB)</CText>

            {selectedBank === 'acb' && (
              <IconX
                type="ionicons"
                name="checkmark"
                size={20}
                color={colors.c101828 || '#101828'}
              />
            )}
          </TouchableOpacity>

          {/* Add Bank Account Row */}
          <TouchableOpacity
            style={styles.addBankRow}
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert('Thêm liên kết', 'Chức năng thêm tài khoản ngân hàng mới');
            }}
          >
            <IconX
              type="ionicons"
              name="add"
              size={20}
              color={colors.c475467 || '#475467'}
            />
            <CText style={styles.addBankText}>Thêm liên kết</CText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Action Button Fixed at Bottom */}
      <View
        style={[
          styles.confirmSection,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
        ]}
      >
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.8}
          onPress={handleOpenPinModal}
        >
          <CText style={styles.confirmBtnText}>Xác nhận</CText>
        </TouchableOpacity>
      </View>

      {/* Modal / BottomSheet: Nhập mật khẩu */}
      <Modal
        visible={isPinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPinModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPinModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.bottomSheet}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <CText style={styles.modalTitle}>Nhập mật khẩu</CText>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    activeOpacity={0.7}
                    onPress={() => setIsPinModalVisible(false)}
                  >
                    <IconX
                      type="ionicons"
                      name="close"
                      size={22}
                      color={colors.c344054 || '#344054'}
                    />
                  </TouchableOpacity>
                </View>

                {/* 6 PIN Input Boxes */}
                <View style={styles.pinContainer}>
                  {[0, 1, 2, 3, 4, 5].map(index => {
                    const isEntered = index < pinCode.length;
                    const isCurrent = index === pinCode.length;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.pinBox,
                          isCurrent && styles.pinBoxActive,
                        ]}
                      >
                        {isEntered ? (
                          <CText style={styles.pinDot}>●</CText>
                        ) : isCurrent ? (
                          <CText style={styles.pinCursor}>|</CText>
                        ) : (
                          <CText style={styles.pinDash}>-</CText>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* iOS Numeric Keypad */}
                <View
                  style={[
                    styles.keypadContainer,
                    { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
                  ]}
                >
                  {KEYPAD_ROWS.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.keypadRow}>
                      {row.map((item, colIndex) => {
                        if (item.isDelete) {
                          return (
                            <TouchableOpacity
                              key={colIndex}
                              style={styles.keypadKeyTransparent}
                              activeOpacity={0.5}
                              onPress={handleDeletePress}
                            >
                              <IconX
                                type="ionicons"
                                name="backspace-outline"
                                size={23}
                                color={colors.c344054 || '#344054'}
                              />
                            </TouchableOpacity>
                          );
                        }

                        if (item.isSpecial) {
                          return (
                            <View
                              key={colIndex}
                              style={styles.keypadKeyTransparent}
                            >
                              <CText style={styles.keypadSpecialText}>
                                {item.key}
                              </CText>
                            </View>
                          );
                        }

                        return (
                          <TouchableOpacity
                            key={colIndex}
                            style={styles.keypadKey}
                            activeOpacity={0.65}
                            onPress={() => handleKeyPress(item.key)}
                          >
                            <CText style={styles.keypadNumber}>{item.key}</CText>
                            {!!item.sub && (
                              <CText style={styles.keypadSubText}>
                                {item.sub}
                              </CText>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Wrapper>
  );
};

export default WithdrawScreen;
