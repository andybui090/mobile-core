import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme, makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconX, Wrapper } from '@/components';
import { images } from '@/configs';
import { formatMoneyVND } from '@/configs/common';
import { CText, Row } from '@/utils';

export const PreviewPackageScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = useStyles();

  const packageData = route.params?.packageData || {};

  const {
    packageName = '',
    serviceGroup = '',
    description = '',
    duration = '60 phút',
    locationType = 'home',
    basePrice = 0,
    photos = [],
    allowSingle = true,
    allowWeekly = false,
    weeklySessions = 2,
    weeklyDiscount = 5,
    allowMonthly = false,
    monthlySessions = 8,
    monthlyDiscount = 10,
  } = packageData;

  // Selected package in preview card
  const initialPkg = allowSingle
    ? 'single'
    : allowWeekly
      ? 'weekly'
      : allowMonthly
        ? 'monthly'
        : 'single';

  const [selectedPreviewPkg, setSelectedPreviewPkg] = useState<
    'single' | 'weekly' | 'monthly'
  >(initialPkg);

  // Calculate weekly & monthly package prices
  const weeklyRaw = basePrice * weeklySessions;
  const weeklyPrice = Math.round(weeklyRaw * (1 - weeklyDiscount / 100));

  const monthlyRaw = basePrice * monthlySessions;
  const monthlyPrice = Math.round(monthlyRaw * (1 - monthlyDiscount / 100));

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSaveDraft = () => {
    Alert.alert(
      t('common.notice', 'Thông báo'),
      'Đã lưu bản nháp gói dịch vụ thành công!',
      [
        {
          text: 'Đóng',
          onPress: () => {
            navigation.navigate('PackageManageScreen');
          },
        },
      ]
    );
  };

  const handlePublish = () => {
    Alert.alert(
      'Thành công',
      'Đăng dịch vụ / gói thành công! Dịch vụ của bạn đã sẵn sàng hiển thị với khách hàng.',
      [
        {
          text: 'Về quản lý gói',
          onPress: () => {
            navigation.navigate('PackageManageScreen');
          },
        },
      ]
    );
  };

  return (
    <Wrapper style={styles.container}>
      {/* HEADER */}
      <View style={[styles.headerContainer, { paddingTop: insets.top || 12 }]}>
        <View style={styles.headerNavRow}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <IconX type="ionicons" name="chevron-back" size={24} color="#101828" />
          </TouchableOpacity>

          <View style={styles.previewActionsRow}>
            <TouchableOpacity
              style={styles.draftBtn}
              activeOpacity={0.8}
              onPress={handleSaveDraft}
            >
              <IconX type="ionicons" name="save-outline" size={17} color="#344054" />
              <CText style={styles.draftBtnText}>Lưu nháp</CText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.publishBtn}
              activeOpacity={0.8}
              onPress={handlePublish}
            >
              <IconX type="ionicons" name="paper-plane" size={17} color="#FFFFFF" />
              <CText style={styles.publishBtnText}>Đăng</CText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BODY CONTENT */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.previewContainer,
          { paddingBottom: (insets.bottom || 16) + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Hero Image */}
        <View style={styles.heroWrap}>
          <Image
            source={
              photos[0]?.uri
                ? { uri: photos[0].uri }
                : photos[0] || images.common.img_default
            }
            style={styles.heroImg}
            resizeMode="cover"
          />
        </View>

        {/* Card Info 1 */}
        <View style={styles.previewInfoCard}>
          {/* Category Tag */}
          <View style={styles.categoryPill}>
            <CText style={styles.categoryPillText}>{serviceGroup || 'Dịch vụ'}</CText>
          </View>

          {/* Service Title */}
          <CText style={styles.previewTitle}>{packageName}</CText>

          {/* Duration & Location */}
          <Row start style={{ marginTop: 8 }}>
            <IconX type="ionicons" name="time-outline" size={16} color="#667085" />
            <CText style={styles.previewMetaText}>{duration}/buổi</CText>
            <CText style={[styles.previewMetaText, { marginHorizontal: 8 }]}>|</CText>
            <IconX type="ionicons" name="location-outline" size={16} color="#667085" />
            <CText style={styles.previewMetaText}>
              {locationType === 'home' ? 'Tại nhà' : 'Tại phòng khám'}
            </CText>
          </Row>

          {/* Rating & Orders */}
          <Row start style={{ marginTop: 10 }}>
            <IconX type="ionicons" name="star" size={16} color="#FDB022" />
            <CText style={styles.ratingVal}>4.8</CText>
            <CText style={styles.ratingCount}>(320 đánh giá)</CText>
            <CText style={[styles.previewMetaText, { marginHorizontal: 8 }]}>|</CText>
            <IconX type="ionicons" name="people-outline" size={16} color="#667085" />
            <CText style={styles.previewMetaText}>12.5K lượt đặt dịch vụ</CText>
          </Row>

          {/* Description */}
          <CText style={styles.previewDesc}>{description}</CText>

          {/* Dịch vụ bao gồm */}
          <View style={styles.benefitsSection}>
            <CText style={styles.benefitsHeader}>Dịch vụ bao gồm</CText>
            <View style={styles.benefitsGrid}>
              <View style={styles.benefitItem}>
                <IconX type="ionicons" name="checkmark-circle" size={18} color="#12B76A" />
                <CText style={styles.benefitText}>Chăm sóc sức khỏe mẹ sau sinh</CText>
              </View>
              <View style={styles.benefitItem}>
                <IconX type="ionicons" name="checkmark-circle" size={18} color="#12B76A" />
                <CText style={styles.benefitText}>Tư vấn dinh dưỡng cho mẹ và bé</CText>
              </View>
              <View style={styles.benefitItem}>
                <IconX type="ionicons" name="checkmark-circle" size={18} color="#12B76A" />
                <CText style={styles.benefitText}>Hỗ trợ tắm bé, vệ sinh, massage</CText>
              </View>
              <View style={styles.benefitItem}>
                <IconX type="ionicons" name="checkmark-circle" size={18} color="#12B76A" />
                <CText style={styles.benefitText}>Theo dõi sự phát triển của bé</CText>
              </View>
            </View>
          </View>
        </View>

        {/* Chọn hình thức đặt dịch vụ */}
        <View style={styles.previewSectionCard}>
          <CText style={styles.sectionHeaderTitle}>Chọn hình thức đặt dịch vụ</CText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {/* Option 1: 1 buổi */}
            {allowSingle && (
              <TouchableOpacity
                style={[
                  styles.pkgCard,
                  selectedPreviewPkg === 'single' && styles.pkgCardSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedPreviewPkg('single')}
              >
                {selectedPreviewPkg === 'single' && (
                  <View style={styles.pkgCheckBadge}>
                    <IconX type="ionicons" name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                <View style={[styles.pkgIconWrap, { backgroundColor: '#FCE7F6' }]}>
                  <IconX type="ionicons" name="calendar" size={18} color="#C11574" />
                </View>
                <CText style={styles.pkgCardTitle}>1 buổi</CText>
                <CText style={styles.pkgCardPrice}>
                  {formatMoneyVND(basePrice, '.')}đ
                </CText>
                <CText style={styles.pkgCardSub}>{duration}/buổi</CText>
              </TouchableOpacity>
            )}

            {/* Option 2: Theo tuần */}
            {allowWeekly && (
              <TouchableOpacity
                style={[
                  styles.pkgCard,
                  selectedPreviewPkg === 'weekly' && styles.pkgCardSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedPreviewPkg('weekly')}
              >
                {selectedPreviewPkg === 'weekly' && (
                  <View style={styles.pkgCheckBadge}>
                    <IconX type="ionicons" name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                <View style={[styles.pkgIconWrap, { backgroundColor: '#EFF8FF' }]}>
                  <IconX type="ionicons" name="calendar" size={18} color="#175CD3" />
                </View>
                <CText style={styles.pkgCardTitle}>Theo tuần</CText>
                <CText style={styles.pkgCardPrice}>
                  {formatMoneyVND(weeklyPrice, '.')}đ
                </CText>
                <CText style={styles.pkgCardStrikethrough}>
                  {formatMoneyVND(weeklyRaw, '.')}đ
                </CText>
                <View style={styles.discountBadge}>
                  <CText style={styles.discountBadgeText}>
                    Tiết kiệm {weeklyDiscount}%
                  </CText>
                </View>
                <CText style={styles.pkgCardSub}>{weeklySessions} buổi/tuần</CText>
              </TouchableOpacity>
            )}

            {/* Option 3: Theo tháng */}
            {allowMonthly && (
              <TouchableOpacity
                style={[
                  styles.pkgCard,
                  selectedPreviewPkg === 'monthly' && styles.pkgCardSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedPreviewPkg('monthly')}
              >
                {selectedPreviewPkg === 'monthly' && (
                  <View style={styles.pkgCheckBadge}>
                    <IconX type="ionicons" name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                <View style={[styles.pkgIconWrap, { backgroundColor: '#ECFDF3' }]}>
                  <IconX type="ionicons" name="calendar" size={18} color="#12B76A" />
                </View>
                <CText style={styles.pkgCardTitle}>Theo tháng</CText>
                <CText style={styles.pkgCardPrice}>
                  {formatMoneyVND(monthlyPrice, '.')}đ
                </CText>
                <CText style={styles.pkgCardStrikethrough}>
                  {formatMoneyVND(monthlyRaw, '.')}đ
                </CText>
                <View style={styles.discountBadge}>
                  <CText style={styles.discountBadgeText}>
                    Tiết kiệm {monthlyDiscount}%
                  </CText>
                </View>
                <CText style={styles.pkgCardSub}>{monthlySessions} buổi/tháng</CText>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Lịch thực hiện note */}
          <View style={styles.scheduleCard}>
            <View style={[styles.badgeIcon, { backgroundColor: '#EFF8FF' }]}>
              <IconX type="ionicons" name="calendar-outline" size={18} color="#175CD3" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <CText style={styles.scheduleTitle}>Lịch thực hiện</CText>
              <CText style={styles.scheduleText}>
                Khách hàng sẽ chọn ngày giờ cụ thể trong các khung thời gian bạn đang mở lịch.
              </CText>
            </View>
          </View>
        </View>

        {/* Thông tin khác */}
        <View style={styles.previewSectionCard}>
          <CText style={styles.sectionHeaderTitle}>Thông tin khác</CText>

          <View style={styles.otherInfoRow}>
            <Row start style={{ flex: 1 }}>
              <IconX type="ionicons" name="location-outline" size={18} color="#667085" />
              <CText style={styles.otherInfoKey}>Địa điểm</CText>
            </Row>
            <CText style={styles.otherInfoVal}>
              {locationType === 'home' ? 'Tại nhà khách hàng' : 'Tại phòng khám'}
            </CText>
          </View>

          <View style={styles.otherInfoRow}>
            <Row start style={{ flex: 1 }}>
              <IconX type="ionicons" name="people-outline" size={18} color="#667085" />
              <CText style={styles.otherInfoKey}>Đối tượng phù hợp</CText>
            </Row>
            <CText style={styles.otherInfoVal}>Mẹ sau sinh, trẻ sơ sinh</CText>
          </View>

          <View style={styles.otherInfoRow}>
            <Row start style={{ flex: 1 }}>
              <IconX type="ionicons" name="information-circle-outline" size={18} color="#667085" />
              <CText style={styles.otherInfoKey}>Lưu ý</CText>
            </Row>
            <CText style={styles.otherInfoVal}>Nên đặt lịch trước ít nhất 1 ngày</CText>
          </View>

          <View style={[styles.otherInfoRow, { borderBottomWidth: 0 }]}>
            <Row start style={{ flex: 1 }}>
              <IconX type="ionicons" name="sync-outline" size={18} color="#667085" />
              <CText style={styles.otherInfoKey}>Chính sách đổi lịch</CText>
            </Row>
            <CText style={styles.otherInfoVal}>Hỗ trợ đổi lịch trước 12 tiếng</CText>
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    // Header
    headerContainer: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F2F4F7',
    },
    headerNavRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backBtn: {
      padding: 4,
      marginRight: 8,
    },
    headerTextWrap: {
      flex: 1,
    },
    headerMainTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#101828',
    },
    headerSubTitle: {
      fontSize: 11,
      color: '#667085',
      marginTop: 2,
      lineHeight: 15,
    },
    previewActionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    draftBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#D0D5DD',
      backgroundColor: '#FFFFFF',
      marginRight: 10,
    },
    draftBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#344054',
      marginLeft: 6,
    },
    publishBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 8,
      backgroundColor: '#19A2A7',
    },
    publishBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 6,
    },

    scrollArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    badgeIcon: {
      width: 24,
      height: 24,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // PREVIEW STYLES
    previewContainer: {
      paddingBottom: 32,
    },
    heroWrap: {
      width: '100%',
      height: 220,
      position: 'relative',
    },
    heroImg: {
      width: '100%',
      height: '100%',
    },
    previewInfoCard: {
      backgroundColor: '#FFFFFF',
      marginHorizontal: 16,
      marginTop: -20,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    categoryPill: {
      alignSelf: 'flex-start',
      backgroundColor: '#FEF0C7',
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginBottom: 8,
    },
    categoryPillText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#B54708',
    },
    previewTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#101828',
      lineHeight: 24,
    },
    previewMetaText: {
      fontSize: 13,
      color: '#475467',
      marginLeft: 4,
    },
    ratingVal: {
      fontSize: 14,
      fontWeight: '700',
      color: '#101828',
      marginLeft: 4,
    },
    ratingCount: {
      fontSize: 13,
      color: '#667085',
      marginLeft: 4,
    },
    previewDesc: {
      fontSize: 13,
      color: '#475467',
      lineHeight: 20,
      marginTop: 12,
    },
    benefitsSection: {
      marginTop: 16,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: '#F2F4F7',
    },
    benefitsHeader: {
      fontSize: 14,
      fontWeight: '700',
      color: '#B54708',
      marginBottom: 10,
    },
    benefitsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '50%',
      marginBottom: 8,
      paddingRight: 6,
    },
    benefitText: {
      fontSize: 12,
      color: '#344054',
      marginLeft: 6,
      flex: 1,
    },

    // Preview Packages
    previewSectionCard: {
      backgroundColor: '#FFFFFF',
      marginHorizontal: 16,
      marginTop: 14,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#F2F4F7',
    },
    sectionHeaderTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#101828',
      marginBottom: 6,
    },
    pkgCard: {
      width: 140,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: '#EAECF0',
      padding: 12,
      marginRight: 10,
      backgroundColor: '#FFFFFF',
      position: 'relative',
    },
    pkgCardSelected: {
      borderColor: '#19A2A7',
      backgroundColor: '#F0FBFA',
    },
    pkgCheckBadge: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#19A2A7',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pkgIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    pkgCardTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#344054',
    },
    pkgCardPrice: {
      fontSize: 15,
      fontWeight: '700',
      color: '#101828',
      marginTop: 4,
    },
    pkgCardStrikethrough: {
      fontSize: 11,
      color: '#98A2B3',
      textDecorationLine: 'line-through',
      marginTop: 2,
    },
    discountBadge: {
      backgroundColor: '#FEE4E2',
      borderRadius: 4,
      paddingHorizontal: 5,
      paddingVertical: 2,
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    discountBadgeText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#D92D20',
    },
    pkgCardSub: {
      fontSize: 10,
      color: '#667085',
      marginTop: 6,
    },

    scheduleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8F9FA',
      borderRadius: 8,
      padding: 12,
      marginTop: 12,
    },
    scheduleTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: '#101828',
    },
    scheduleText: {
      fontSize: 11,
      color: '#667085',
      marginTop: 2,
    },

    // Other Info
    otherInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F2F4F7',
    },
    otherInfoKey: {
      fontSize: 13,
      color: '#475467',
      marginLeft: 8,
    },
    otherInfoVal: {
      fontSize: 13,
      fontWeight: '500',
      color: '#101828',
    },
  })
);

export default PreviewPackageScreen;
