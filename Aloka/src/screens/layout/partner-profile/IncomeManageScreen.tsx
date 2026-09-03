import React from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import { IconX, Wrapper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';

interface WalletCardItem {
  id: string;
  title: string;
  amountText: string;
  iconName: string;
  iconType: 'ionicons' | 'materialicons' | 'fontisto' | 'antdesign' | 'octicons';
  onPress?: () => void;
}

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
  profileSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomWidth: 8,
    borderBottomColor: colors.cF2F4F7 || '#F2F4F7',
  },
  profileMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#E6FAFA',
    borderWidth: 1.5,
    borderColor: colors.cEAECF0 || '#EAECF0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileInfoCol: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.c101828 || '#101828',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 13,
    color: colors.c667085 || '#667085',
    lineHeight: 18,
  },
  profileDivider: {
    height: 1,
    backgroundColor: colors.cEAECF0 || '#EAECF0',
    marginBottom: 14,
  },
  profileBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactList: {
    flex: 1,
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 13,
    color: colors.c667085 || '#667085',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary || '#19A2A7',
    backgroundColor: colors.white,
    gap: 6,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary || '#19A2A7',
  },
  cardListContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
  walletCard: {
    backgroundColor: '#E6F7F7',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4F3F2',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.c1D2939 || '#1D2939',
    marginBottom: 3,
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary || '#19A2A7',
  },
}));

export const IncomeManageScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Thông báo', `Không thể gọi tới số ${phoneNumber}`);
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Thông báo', `Không thể mở email tới ${email}`);
    });
  };

  const walletCards: WalletCardItem[] = [
    {
      id: 'total-income-wallet',
      title: 'Ví tổng thu nhập',
      amountText: '890.000đ',
      iconName: 'wallet-outline',
      iconType: 'ionicons',
      onPress: () => {
        navigation.navigate('TotalIncomeWalletScreen');
      },
    },
    {
      id: 'withdrawn-income-wallet',
      title: 'Quản lý ví thu nhập đã rút',
      amountText: 'Còn lại: 200.000đ',
      iconName: 'savings',
      iconType: 'materialicons',
      onPress: () => {
        Alert.alert(
          'Quản lý ví thu nhập đã rút',
          'Số dư còn lại: 200.000đ\nXem lịch sử giao dịch và các lệnh rút tiền.',
        );
      },
    },
  ];

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
              } else {
                navigation.navigate('AccountTab');
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

          <CText style={styles.headerTitle}>Quản lý thu nhập</CText>

          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card Information */}
        <View style={styles.profileSection}>
          <View style={styles.profileMainRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={images.common.nurse_minh_hieu || images.common.img_default}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.profileInfoCol}>
              <CText style={styles.profileName}>Minh Hiếu</CText>
              <CText style={styles.profileSubtitle}>
                Thạc sĩ Y tá  ·  Bệnh viện Nhi Đồng II
              </CText>
            </View>
          </View>

          <View style={styles.profileDivider} />

          <View style={styles.profileBottomRow}>
            <View style={styles.contactList}>
              <TouchableOpacity
                style={styles.contactItem}
                activeOpacity={0.7}
                onPress={() => handleCall('0909764948')}
              >
                <IconX
                  type="ionicons"
                  name="call-outline"
                  size={15}
                  color={colors.c98A2B3 || '#98A2B3'}
                />
                <CText style={styles.contactText}>0909 764 948</CText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                activeOpacity={0.7}
                onPress={() => handleEmail('minhhieu.nguyen@gmail.com')}
              >
                <IconX
                  type="ionicons"
                  name="mail-outline"
                  size={15}
                  color={colors.c98A2B3 || '#98A2B3'}
                />
                <CText style={styles.contactText}>minhhieu.nguyen@gmail.com</CText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.editProfileBtn}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert('Chỉnh sửa', 'Chức năng chỉnh sửa thông tin hồ sơ đối tác');
              }}
            >
              <IconX
                type="ionicons"
                name="create-outline"
                size={17}
                color={colors.primary || '#19A2A7'}
              />
              <CText style={styles.editProfileText}>Sửa hồ sơ</CText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2 Wallet Cards */}
        <View style={styles.cardListContainer}>
          {walletCards.map(card => (
            <TouchableOpacity
              key={card.id}
              style={styles.walletCard}
              activeOpacity={0.7}
              onPress={card.onPress}
            >
              <View style={styles.iconBox}>
                <IconX
                  type={card.iconType}
                  name={card.iconName}
                  size={22}
                  color={colors.c344054 || '#344054'}
                />
              </View>

              <View style={styles.cardContent}>
                <CText style={styles.cardTitle}>{card.title}</CText>
                <CText style={styles.cardAmount}>{card.amountText}</CText>
              </View>

              <IconX
                type="ionicons"
                name="chevron-forward"
                size={20}
                color={colors.c98A2B3 || '#98A2B3'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default IncomeManageScreen;
