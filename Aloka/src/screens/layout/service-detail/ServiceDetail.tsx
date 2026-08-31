import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText, onShare } from '@/utils';

const { width } = Dimensions.get('window');

interface ServicePackage {
  id: string;
  title: string;
  description: string;
  dateInfo: string;
}

const PACKAGES: ServicePackage[] = [
  {
    id: '1',
    title: 'Gói theo tuần',
    description:
      'Chuyên chăm sóc mẹ và bé sau sinh, hỗ trợ tiêu hóa, ăn uống, tắm bé chăm sóc toàn diện',
    dateInfo: '10/2021 · Số lần sử dụng',
  },
  {
    id: '2',
    title: 'Gói theo tháng',
    description:
      'Chuyên chăm sóc mẹ và bé sau sinh, hỗ trợ tiêu hóa, ăn uống, tắm bé chăm sóc toàn diện',
    dateInfo: '10/2021 · Số lần sử dụng',
  },
];

const DESCRIPTIONS = [
  'Mẹ đi sinh không còn lo lắng vì thiếu người thân. Đội ngũ Hộ lý/Điều dưỡng sẽ túc trực 24/24 tại bệnh viện để hỗ trợ mẹ vệ sinh, đón tay bé, pha sữa và chăm sóc những ngày đầu đời ngay tại viện.',
  'Túc trực 24/24 hoặc theo ca (Sáng/Đêm).',
  'Hỗ trợ mẹ đi vệ sinh, thay băng vết thương.',
  'Chăm sóc bé sơ sinh trọn gói tại phòng.',
];

export const ServiceDetail: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState('1');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Hero Photo with Top Controls */}
        <View style={styles.bannerContainer}>
          <ImageHelper
            source={(images.common as any).service_mom_baby || images.common.img_default}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          <SafeAreaView style={styles.topBar}>
            <TouchableOpacity style={styles.circleBtn} activeOpacity={0.7}>
              <IconX type="ionicons" name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleBtn}
              activeOpacity={0.7}
              onPress={() =>
                onShare({
                  title: 'Dịch vụ Nuôi sinh & Chăm sóc mẹ bé',
                  message: 'Dịch vụ Nuôi sinh & Chăm sóc mẹ bé tại bệnh viện - Điều dưỡng Thúy Ngọc',
                })
              }
            >
              <IconX type="ionicons" name="share-social-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Header Information Section */}
        <View style={styles.mainInfoSection}>
          <CText style={styles.serviceTitle}>
            Dịch vụ Nuôi sinh & Chăm{'\n'}sóc mẹ bé tại bệnh viện
          </CText>

          <CText style={styles.nurseName}>Điều dưỡng Thúy Ngọc</CText>

          <View style={styles.locationRow}>
            <IconX type="ionicons" name="location-outline" size={15} color="#667085" />
            <CText style={styles.locationText}>Phú Nhuận - Hồ Chí Minh</CText>
          </View>

          <View style={styles.ratingStatsRow}>
            <View style={styles.ratingLeft}>
              <IconX type="ionicons" name="star" size={15} color="#F59E0B" />
              <CText style={styles.starScore}>4.7</CText>
              <CText style={styles.reviewCount}>42 Đánh giá</CText>
            </View>
            <CText style={styles.jobsRight}>
              Tổng công việc đã nhận <CText style={styles.jobCountBold}>100</CText>
            </CText>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Section: Mô tả dịch vụ */}
        <View style={styles.sectionBlock}>
          <CText style={styles.sectionTitle}>Mô tả dịch vụ</CText>
          <View style={styles.cardContainer}>
            <CText style={styles.paragraphText}>{DESCRIPTIONS[0]}</CText>
            {DESCRIPTIONS.slice(1).map((item, index) => (
              <View key={index} style={styles.bulletRow}>
                <IconX
                  type="ionicons"
                  name="checkmark"
                  size={16}
                  color="#101828"
                  style={styles.checkIcon}
                />
                <CText style={styles.bulletText}>{item}</CText>
              </View>
            ))}
          </View>

          {/* Thời gian thực hiện dịch vụ */}
          <CText style={[styles.sectionTitle, { marginTop: 18 }]}>
            Thời gian thực hiện dịch vụ
          </CText>
          <View style={styles.durationCard}>
            <IconX type="ionicons" name="time-outline" size={18} color="#101828" />
            <CText style={styles.durationText}>2 giờ</CText>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Section: Thông tin khác */}
        <View style={styles.sectionBlock}>
          <CText style={styles.sectionTitle}>Thông tin khác</CText>
          <View style={styles.packagesList}>
            {PACKAGES.map(pkg => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <TouchableOpacity
                  key={pkg.id}
                  onPress={() => setSelectedPackage(pkg.id)}
                  style={styles.packageCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.packageIconBadge}>
                    <IconX type="ionicons" name="location" size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.packageBody}>
                    <CText style={styles.packageTitle}>{pkg.title}</CText>
                    <CText style={styles.packageDesc}>{pkg.description}</CText>
                    <CText style={styles.packageDate}>{pkg.dateInfo}</CText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <CText style={styles.priceLabel}>Giá trị gói</CText>
          <CText style={styles.priceValue}>199.000đ</CText>
        </View>
        <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
          <CText style={styles.bookButtonText}>Đặt lịch ngay</CText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  bannerContainer: {
    width: width,
    height: 330,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInfoSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 28,
  },
  nurseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14B8A6',
    marginTop: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#667085',
    marginLeft: 4,
  },
  ratingStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starScore: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101828',
    marginLeft: 6,
  },
  jobsRight: {
    fontSize: 12.5,
    color: '#667085',
  },
  jobCountBold: {
    fontWeight: '700',
    color: '#101828',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F8F9FA',
  },
  sectionBlock: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
  },
  paragraphText: {
    fontSize: 13,
    color: '#344054',
    lineHeight: 20,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  checkIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#344054',
    lineHeight: 19,
  },
  durationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#101828',
    marginLeft: 8,
  },
  packagesList: {
    gap: 12,
  },
  packageCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  packageIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  packageBody: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
  },
  packageDesc: {
    fontSize: 12.5,
    color: '#475467',
    lineHeight: 18,
    marginTop: 4,
  },
  packageDate: {
    fontSize: 11,
    color: '#98A2B3',
    marginTop: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#667085',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F04438',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 32,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
