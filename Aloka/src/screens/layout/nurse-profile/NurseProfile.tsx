import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText, onShare } from '@/utils';

const { width } = Dimensions.get('window');

const hasNativeLinearGradient = !!(
  UIManager.getViewManagerConfig &&
  (UIManager.getViewManagerConfig('BVLinearGradient') || UIManager.getViewManagerConfig('RNLinearGradient'))
);

const SafeLinearGradient = (props: any) => {
  if (hasNativeLinearGradient) {
    return <LinearGradient {...props} />;
  }
  return <View style={props.style}>{props.children}</View>;
};

interface HighlightService {
  id: string;
  title: string;
  hospital: string;
  rating: number;
  reviews: number;
  originalPrice: string;
  discountPrice: string;
  image: any;
}

interface ReviewItem {
  id: string;
  author: string;
  timeAgo: string;
  rating: number;
  content: string;
}

const HIGHLIGHT_SERVICES: HighlightService[] = [
  {
    id: '1',
    title: 'Dịch vụ Tắm bé & Bảo mẫu Y tế Tại nhà',
    hospital: 'Bệnh viện FV',
    rating: 4.7,
    reviews: 21,
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: images.common.img_default,
  },
  {
    id: '2',
    title: 'Dịch vụ Nuôi sinh & Chăm sóc mẹ bé tại bệnh viện',
    hospital: 'Bệnh viện FV',
    rating: 4.7,
    reviews: 21,
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: images.common.img_default,
  },
  {
    id: '3',
    title: 'Dịch vụ Chăm sóc mẹ & bé sau sinh toàn diện',
    hospital: 'Bệnh viện FV',
    rating: 4.7,
    reviews: 21,
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: images.common.img_default,
  },
];

const REVIEWS: ReviewItem[] = [
  {
    id: '1',
    author: 'Jerome Bell',
    timeAgo: '18 hours ago',
    rating: 5,
    content:
      'Those obviously high field watches drawing-board. Requirements teeth resources bells stand live working. Timepoint business out inclusion fit lean.',
  },
  {
    id: '2',
    author: 'Esther Howard',
    timeAgo: '18 hours ago',
    rating: 5,
    content:
      'Those obviously high field watches drawing-board. Requirements teeth resources bells stand live working. Timepoint business out inclusion fit lean.',
  },
  {
    id: '3',
    author: 'Robert Fox',
    timeAgo: '18 hours ago',
    rating: 5,
    content:
      'Those obviously high field watches drawing-board. Requirements teeth resources bells stand live working. Timepoint business out inclusion fit lean.',
  },
];

const STAR_FILTERS = [
  { stars: 5, count: 32 },
  { stars: 4, count: 12 },
  { stars: 3, count: 10 },
  { stars: 2, count: 0 },
];

export const NurseProfile: React.FC = () => {
  const [selectedStar, setSelectedStar] = useState(5);

  const renderStars = (count: number) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Photo Header with LinearGradient overlay */}
        <View style={styles.bannerContainer}>
          <ImageHelper
            source={(images.common as any).nurse_minh_hieu || images.common.img_default}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          {/* LinearGradient matching doctor-mobile-app pattern */}
          <SafeLinearGradient
            colors={[
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0.15)',
              'rgba(255, 255, 255, 0.45)',
              'rgba(255, 255, 255, 0.8)',
              'rgba(255, 255, 255, 1)',
            ]}
            locations={[0, 0.3, 0.6, 0.85, 1]}
            style={styles.layerBlur}
          >
            {/* Name & Badges */}
            <View style={styles.nameRow}>
              <CText style={styles.nurseName}>Minh Hiếu</CText>
              <View style={styles.badgeTasker}>
                <CText style={styles.badgeTaskerText}>Star Tasker</CText>
              </View>
              <View style={styles.badgeVerified}>
                <IconX
                  type="ionicons"
                  name="checkmark-circle"
                  size={14}
                  color="#0080FF"
                  style={{ marginRight: 3 }}
                />
                <CText style={styles.badgeVerifiedText}>Đã xác thực</CText>
              </View>
            </View>
          </SafeLinearGradient>

          {/* Top Bar with translucent overlay buttons */}
          <SafeAreaView style={styles.topBar}>
            <TouchableOpacity style={styles.circleBtn} activeOpacity={0.7}>
              <IconX type="ionicons" name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleBtn}
              activeOpacity={0.7}
              onPress={() =>
                onShare({
                  title: 'Điều dưỡng Minh Hiếu',
                  message: 'Hồ sơ Điều dưỡng Minh Hiếu - Chuyên môn Điều dưỡng Nhi tại Aloka',
                })
              }
            >
              <IconX type="ionicons" name="share-social-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Profile Info Details */}
        <View style={styles.infoContainer}>
          <CText style={styles.codeText}>
            Mã chuyên gia: <CText style={styles.codeBold}>CG_8829</CText>
          </CText>
          <CText style={styles.specialtyText}>Y tá truyền dịch 05 năm kinh nghiệm</CText>
          <CText style={styles.hospitalText}>BV Nhi Đồng I</CText>

          <View style={styles.locationRow}>
            <IconX type="ionicons" name="location-outline" size={15} color="#667085" />
            <CText style={styles.addressText}>Phú Nhuận - Hồ Chí Minh</CText>
          </View>

          {/* Rating & Stats */}
          <View style={styles.ratingStatsRow}>
            <View style={styles.ratingLeft}>
              <IconX type="ionicons" name="star" size={16} color="#F59E0B" />
              <CText style={styles.starRating}>4.7</CText>
              <CText style={styles.reviewLabel}>42 Đánh giá</CText>
            </View>
            <View style={styles.jobRight}>
              <CText style={styles.jobLabel}>
                Công việc đã nhận <CText style={styles.jobCount}>100</CText>
              </CText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.outlineActionBtn} activeOpacity={0.7}>
              <CText style={styles.outlineActionText}>Liên hệ chuyên gia</CText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineActionBtn} activeOpacity={0.7}>
              <CText style={styles.outlineActionText}>Nhắn tin với chuyên gia</CText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Giới thiệu */}
        <View style={styles.sectionBlock}>
          <CText style={styles.sectionHeaderTitle}>Giới thiệu</CText>
          <View style={styles.bioCard}>
            <CText style={styles.bioText}>
              Chuyên chăm sóc mẹ và bé sau sinh, hỗ trợ tiêu hóa, ăn uống, tắm bé chăm sóc toàn diện
            </CText>
            <TouchableOpacity activeOpacity={0.7}>
              <CText style={styles.readMoreText}>Xem thêm</CText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Thời gian làm việc */}
        <View style={styles.sectionBlock}>
          <CText style={styles.sectionHeaderTitle}>Thời gian làm việc</CText>
          <View style={styles.workScheduleList}>
            <View style={styles.workScheduleRow}>
              <CText style={styles.workDay}>Thứ 2 - Thứ 4</CText>
              <CText style={styles.workHour}>10:30 - 18:00</CText>
            </View>
            <View style={styles.workScheduleRow}>
              <CText style={styles.workDay}>Thứ 6 - Thứ 7</CText>
              <CText style={styles.workHour}>9:30 - 11:00</CText>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Dịch vụ nổi bật */}
        <View style={styles.sectionBlock}>
          <CText style={styles.sectionHeaderTitle}>Dịch vụ nổi bật</CText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.serviceScrollContent}
          >
            {HIGHLIGHT_SERVICES.map(service => (
              <TouchableOpacity
                key={service.id}
                style={styles.highlightCard}
                activeOpacity={0.7}
              >
                <ImageHelper
                  source={service.image}
                  style={styles.highlightImage}
                  resizeMode="cover"
                />
                <View style={styles.highlightBody}>
                  <CText style={styles.highlightTitle} numberOfLines={2}>
                    {service.title}
                  </CText>
                  <View style={styles.highlightRatingRow}>
                    <IconX type="ionicons" name="star" size={12} color="#F59E0B" />
                    <CText style={styles.highlightRatingText}>{service.rating}</CText>
                    <CText style={styles.highlightReviewCount}>({service.reviews} đánh giá)</CText>
                  </View>
                  <CText style={styles.highlightHospital}>{service.hospital}</CText>
                  <View style={styles.highlightPriceRow}>
                    <CText style={styles.highlightOldPrice}>{service.originalPrice}</CText>
                    <CText style={styles.highlightNewPrice}>{service.discountPrice}</CText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionDivider} />

        {/* Đánh giá */}
        <View style={styles.sectionBlock}>
          <CText style={styles.sectionHeaderTitle}>Đánh giá</CText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.starFiltersScrollContent}
          >
            {STAR_FILTERS.map(sf => {
              const isSelected = selectedStar === sf.stars;
              return (
                <TouchableOpacity
                  key={sf.stars}
                  onPress={() => setSelectedStar(sf.stars)}
                  style={[
                    styles.starFilterPill,
                    isSelected && styles.starFilterPillActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <CText style={styles.starFilterStars}>
                    {'★'.repeat(sf.stars)}
                  </CText>
                  <CText style={styles.starFilterCount}>{sf.count}</CText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Review List */}
          <View style={styles.reviewsList}>
            {REVIEWS.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewAuthorRow}>
                  <ImageHelper
                    source={images.common.img_default}
                    style={styles.reviewAvatar}
                  />
                  <View style={styles.reviewAuthorInfo}>
                    <CText style={styles.reviewAuthorName}>{review.author}</CText>
                    <CText style={styles.reviewTime}>{review.timeAgo}</CText>
                  </View>
                </View>
                <View style={styles.reviewStarsRow}>
                  <CText style={styles.goldStarsText}>{renderStars(review.rating)}</CText>
                </View>
                <CText style={styles.reviewContentText}>{review.content}</CText>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.viewAllReviewsBtn} activeOpacity={0.7}>
            <CText style={styles.viewAllReviewsText}>Xem tất cả</CText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookNowBtn} activeOpacity={0.8}>
          <CText style={styles.bookNowBtnText}>Đặt lịch ngay</CText>
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
    height: 340,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  layerBlur: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 6,
    zIndex: 1,
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
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nurseName: {
    fontSize: 23,
    fontWeight: '700',
    color: '#101828',
  },
  badgeTasker: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  badgeTaskerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  badgeVerified: {
    backgroundColor: '#EFF8FF',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeVerifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0080FF',
  },
  codeText: {
    fontSize: 13,
    color: '#667085',
    marginTop: 6,
  },
  codeBold: {
    fontWeight: '700',
    color: '#344054',
  },
  specialtyText: {
    fontSize: 15,
    color: '#0080FF',
    fontWeight: '500',
    marginTop: 4,
  },
  hospitalText: {
    fontSize: 15,
    color: '#0080FF',
    fontWeight: '600',
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  addressText: {
    fontSize: 13,
    color: '#667085',
    marginLeft: 4,
  },
  ratingStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 4,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starRating: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 4,
  },
  reviewLabel: {
    fontSize: 12.5,
    color: '#667085',
    marginLeft: 6,
  },
  jobRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobLabel: {
    fontSize: 12.5,
    color: '#667085',
  },
  jobCount: {
    fontWeight: '700',
    color: '#101828',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  outlineActionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#14B8A6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineActionText: {
    fontSize: 12.5,
    color: '#14B8A6',
    fontWeight: '600',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F8F9FA',
  },
  sectionBlock: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 10,
  },
  bioCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
  },
  bioText: {
    fontSize: 12.5,
    color: '#344054',
    lineHeight: 18,
  },
  readMoreText: {
    fontSize: 12,
    color: '#667085',
    marginTop: 6,
    fontWeight: '500',
  },
  workScheduleList: {
    gap: 8,
  },
  workScheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workDay: {
    fontSize: 13,
    color: '#475467',
  },
  workHour: {
    fontSize: 13,
    fontWeight: '600',
    color: '#101828',
  },
  serviceScrollContent: {
    gap: 12,
  },
  highlightCard: {
    width: 140,
    marginRight: 12,
  },
  highlightImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#F2F4F7',
  },
  highlightBody: {
    marginTop: 6,
  },
  highlightTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 17,
  },
  highlightRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  highlightRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 2,
  },
  highlightReviewCount: {
    fontSize: 10.5,
    color: '#667085',
    marginLeft: 4,
  },
  highlightHospital: {
    fontSize: 11,
    color: '#98A2B3',
    marginTop: 2,
  },
  highlightPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  highlightOldPrice: {
    fontSize: 10.5,
    color: '#98A2B3',
    textDecorationLine: 'line-through',
  },
  highlightNewPrice: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F04438',
  },
  starFiltersScrollContent: {
    gap: 8,
    marginBottom: 12,
  },
  starFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAECF0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  starFilterPillActive: {
    borderColor: '#14B8A6',
  },
  starFilterStars: {
    color: '#F59E0B',
    fontSize: 12,
    marginRight: 6,
  },
  starFilterCount: {
    fontSize: 12,
    color: '#101828',
    fontWeight: '500',
  },
  reviewsList: {
    gap: 10,
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  reviewAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  reviewAuthorInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthorName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#101828',
  },
  reviewTime: {
    fontSize: 11,
    color: '#98A2B3',
  },
  reviewStarsRow: {
    marginTop: 4,
  },
  goldStarsText: {
    color: '#F59E0B',
    fontSize: 11,
    letterSpacing: 2,
  },
  reviewContentText: {
    fontSize: 12,
    color: '#344054',
    lineHeight: 17,
    marginTop: 6,
  },
  viewAllReviewsBtn: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 6,
  },
  viewAllReviewsText: {
    fontSize: 12.5,
    color: '#0284C7',
    fontWeight: '500',
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
  },
  bookNowBtn: {
    backgroundColor: '#14B8A6',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
