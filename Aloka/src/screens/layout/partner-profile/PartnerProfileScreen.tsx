import React, { useContext } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { IconX, ImageHelper, Wrapper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import { AppContext } from '@/contexts';
import { rootRoute } from '@/constants';

const { width } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  iconName: any;
  iconType: 'ionicons' | 'fontisto' | 'antdesign' | 'octicons' | 'materialicons';
  iconBgColor: string;
  onPress?: () => void;
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    headerBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: 240,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 8 : 16,
      paddingBottom: 16,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 4,
      marginRight: 8,
      marginLeft: -4,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.c101828 || '#101828',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    headerIconButton: {
      padding: 4,
    },
    profileCard: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    profileMainRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      overflow: 'hidden',
      backgroundColor: '#E6FAFA',
      borderWidth: 2,
      borderColor: colors.white,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
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
      fontSize: 20,
      fontWeight: '700',
      color: colors.c101828 || '#101828',
      marginBottom: 4,
    },
    profileSubtitle: {
      fontSize: 13,
      color: colors.c667085 || '#667085',
      lineHeight: 18,
    },
    profileBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
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
      paddingVertical: 9,
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
    sectionDivider: {
      height: 8,
      backgroundColor: colors.cF2F4F7 || '#F2F4F7',
    },
    sectionContainer: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 6,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.c101828 || '#101828',
      marginBottom: 12,
    },
    introBox: {
      backgroundColor: colors.cF9FAFB || '#F9FAFB',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.cEAECF0 || '#EAECF0',
    },
    introText: {
      fontSize: 14,
      color: colors.c344054 || '#344054',
      lineHeight: 22,
    },
    menuListContainer: {
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    menuItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
    },
    menuIconBox: {
      width: 38,
      height: 38,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemTitle: {
      flex: 1,
      marginLeft: 14,
      fontSize: 15,
      fontWeight: '500',
      color: colors.c1D2939 || '#1D2939',
    },
    menuDivider: {
      height: 1,
      backgroundColor: colors.cEAECF0 || '#EAECF0',
      marginLeft: 52,
    },
  })
);

export const PartnerProfileScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const {
    theme: { colors },
  } = useTheme();
  const { user } = useContext<any>(AppContext) || {};
  // Extract exact fields from user object
  const displayName =
    user?.full_name ||
    user?.personalization?.channel_name ||
    user?.username ||
    '';

  const position =
    user?.personalization?.position || user?.personalization?.type || '';
  const specializations = Array.isArray(user?.personalization?.specializations)
    ? user.personalization.specializations
      .map((s: any) => s?.name)
      .filter(Boolean)
      .join(', ')
    : '';

  const displaySubtitle =
    position && specializations
      ? `${position}  ·  ${specializations}`
      : position || specializations || '';

  const displayPhone = user?.phone || '';

  const displayEmail = user?.email || '';

  const displayIntro =
    user?.personalization?.description ||
    user?.channels?.[0]?.description ||
    user?.personalization?.channels?.[0]?.description ||
    '';

  const avatar =
    user?.avatar ||
    user?.personalization?.avatar ||
    user?.channels?.[0]?.avatar;

  const avatarSource = avatar
    ? typeof avatar === 'string'
      ? { uri: avatar }
      : avatar
    : images.common.img_default;

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Thông báo', `Không thể gọi tới số ${phoneNumber}`);
    });
  };

  const handleEmail = (emailStr: string) => {
    Linking.openURL(`mailto:${emailStr}`).catch(() => {
      Alert.alert('Thông báo', `Không thể mở ứng dụng gửi thư tới ${emailStr}`);
    });
  };

  const menuItems: MenuItem[] = [
    {
      id: 'work-schedule',
      title: 'Quản lý lịch làm việc',
      iconName: 'calendar',
      iconType: 'ionicons',
      iconBgColor: colors.primary || '#19A2A7',
      onPress: () => {
        navigation.navigate('WorkScheduleManageScreen');
      },
    },
    {
      id: 'packages-promotions',
      title: 'Gói dịch vụ & khuyến mãi',
      iconName: 'bookmark',
      iconType: 'ionicons',
      iconBgColor: '#2E90FA',
      onPress: () => {
        Alert.alert('Thông báo', 'Tính năng Gói dịch vụ & khuyến mãi đang được cập nhật');
      },
    },
    {
      id: 'income-manage',
      title: 'Quản lý thu nhập',
      iconName: 'settings',
      iconType: 'ionicons',
      iconBgColor: '#F79009',
      onPress: () => {
        navigation.navigate('IncomeManageScreen');
      },
    },
    {
      id: 'support',
      title: 'Hỗ trợ',
      iconName: 'headset',
      iconType: 'ionicons',
      iconBgColor: '#9E77ED',
      onPress: () => {
        Alert.alert('Thông báo', 'Tổng đài hỗ trợ đối tác: 1900 xxxx');
      },
    },
  ];

  const handleBackToHome = () => {
    const mainNavigator = navigation.getParent()?.getParent();
    if (mainNavigator && mainNavigator.canGoBack()) {
      mainNavigator.goBack();
      return;
    }
    const parentNavigator = navigation.getParent();
    if (parentNavigator && parentNavigator.canGoBack()) {
      parentNavigator.goBack();
      return;
    }
    navigation.navigate(rootRoute, { screen: 'HomeTab' });
  };

  return (
    <Wrapper safeTop style={styles.container} statusBarStyle="dark-content">
      {/* Background image header */}
      <Image
        source={images.common.bg_partner}
        style={styles.headerBackground}
        resizeMode="cover"
      />

      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={handleBackToHome}
          >
            <IconX
              type="ionicons"
              name="chevron-back"
              size={26}
              color={colors.c101828 || '#101828'}
            />
          </TouchableOpacity>
          <CText style={styles.headerTitle}>Hồ sơ</CText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('NotificationScreen');
            }}
          >
            <IconX
              type="ionicons"
              name="notifications-outline"
              size={23}
              color={colors.c344054 || '#344054'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('SettingScreen');
            }}
          >
            <IconX
              type="ionicons"
              name="settings-outline"
              size={23}
              color={colors.c344054 || '#344054'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card Info */}
        <View style={styles.profileCard}>
          <View style={styles.profileMainRow}>
            <View style={styles.avatarWrap}>
              <ImageHelper
                source={avatarSource}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.profileInfoCol}>
              <CText style={styles.profileName}>{displayName}</CText>
              {!!displaySubtitle && (
                <CText style={styles.profileSubtitle}>{displaySubtitle}</CText>
              )}
            </View>
          </View>

          <View style={styles.profileBottomRow}>
            <View style={styles.contactList}>
              {!!displayPhone && (
                <TouchableOpacity
                  style={styles.contactItem}
                  activeOpacity={0.7}
                  onPress={() => handleCall(displayPhone)}
                >
                  <IconX
                    type="ionicons"
                    name="call-outline"
                    size={15}
                    color={colors.c98A2B3 || '#98A2B3'}
                  />
                  <CText style={styles.contactText}>{displayPhone}</CText>
                </TouchableOpacity>
              )}

              {!!displayEmail && (
                <TouchableOpacity
                  style={styles.contactItem}
                  activeOpacity={0.7}
                  onPress={() => handleEmail(displayEmail)}
                >
                  <IconX
                    type="ionicons"
                    name="mail-outline"
                    size={15}
                    color={colors.c98A2B3 || '#98A2B3'}
                  />
                  <CText style={styles.contactText}>{displayEmail}</CText>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.editProfileBtn}
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('EditProfileScreen');
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

        {/* Section: Giới thiệu */}
        {!!displayIntro && (
          <View style={styles.sectionContainer}>
            <CText style={styles.sectionTitle}>Giới thiệu</CText>
            <View style={styles.introBox}>
              <CText style={styles.introText}>{displayIntro}</CText>
            </View>
          </View>
        )}

        <View style={{ height: 12 }} />

        {/* Action Menu List */}
        <View style={styles.menuListContainer}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.menuItemRow}
                activeOpacity={0.65}
                onPress={item.onPress}
              >
                <View
                  style={[
                    styles.menuIconBox,
                    { backgroundColor: item.iconBgColor },
                  ]}
                >
                  <IconX
                    type={item.iconType}
                    name={item.iconName}
                    size={19}
                    color="#FFFFFF"
                  />
                </View>

                <CText style={styles.menuItemTitle}>{item.title}</CText>

                <IconX
                  type="ionicons"
                  name="chevron-forward"
                  size={20}
                  color={colors.c98A2B3 || '#98A2B3'}
                />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default PartnerProfileScreen;
