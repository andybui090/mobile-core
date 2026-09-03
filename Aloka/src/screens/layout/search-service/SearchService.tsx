import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import { SearchFilter } from './SearchFilter';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

interface ServiceItem {
  id: string;
  title: string;
  isHot?: boolean;
  rating: number;
  reviewsCount: number;
  nurseName: string;
  distance?: string;
  originalPrice: string;
  discountPrice: string;
  image: any;
}

const TABS = [
  { id: 'hanoi', label: 'Hà Nội' },
  { id: 'hcm', label: 'TP. HCM' },
  { id: 'popular', label: 'Phổ biến' },
  { id: 'price', label: 'Giá ⇅' },
];

const PILLS = ['Quận 1', 'Mức giá 100.000VNĐ', 'Đánh giá 5*'];

const SERVICES_DATA: ServiceItem[] = [
  {
    id: '1',
    title: 'Dịch vụ Tắm bé & Bảo mẫu Y tế Tại nhà',
    isHot: true,
    rating: 4.7,
    reviewsCount: 21,
    nurseName: 'Điều dưỡng Thúy Ngọc',
    distance: 'Cách bạn: 2.5km',
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: (images.common as any).service_baby_bath || images.common.img_default,
  },
  {
    id: '2',
    title: 'Dịch vụ Nuôi sinh &\nChăm sóc mẹ bé tại...',
    isHot: false,
    rating: 4.7,
    reviewsCount: 21,
    nurseName: 'Điều dưỡng Thúy Ngọc',
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: (images.common as any).service_mom_baby || images.common.img_default,
  },
  {
    id: '3',
    title: 'Dịch vụ Tắm bé & Bảo mẫu Y tế Tại nhà',
    isHot: true,
    rating: 4.7,
    reviewsCount: 21,
    nurseName: 'Điều dưỡng Thúy Ngọc',
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: (images.common as any).service_baby_bath || images.common.img_default,
  },
  {
    id: '4',
    title: 'Dịch vụ Nuôi sinh &\nChăm sóc mẹ bé tại...',
    isHot: false,
    rating: 4.7,
    reviewsCount: 21,
    nurseName: 'Điều dưỡng Thúy Ngọc',
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: (images.common as any).service_mom_baby || images.common.img_default,
  },
  {
    id: '5',
    title: 'Dịch vụ Tắm bé & Bảo mẫu Y tế Tại nhà',
    isHot: true,
    rating: 4.7,
    reviewsCount: 21,
    nurseName: 'Điều dưỡng Thúy Ngọc',
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: (images.common as any).service_baby_bath || images.common.img_default,
  },
  {
    id: '6',
    title: 'Dịch vụ Nuôi sinh &\nChăm sóc mẹ bé tại...',
    isHot: false,
    rating: 4.7,
    reviewsCount: 21,
    nurseName: 'Điều dưỡng Thúy Ngọc',
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: (images.common as any).service_mom_baby || images.common.img_default,
  },
  {
    id: '7',
    title: 'Dịch vụ Tắm bé & Bảo mẫu Y tế Tại nhà',
    isHot: false,
    rating: 4.7,
    reviewsCount: 21,
    nurseName: 'Điều dưỡng Thúy Ngọc',
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: (images.common as any).service_baby_bath || images.common.img_default,
  },
  {
    id: '8',
    title: 'Dịch vụ Nuôi sinh &\nChăm sóc mẹ bé tại...',
    isHot: false,
    rating: 4.7,
    reviewsCount: 21,
    nurseName: 'Điều dưỡng Thúy Ngọc',
    originalPrice: '999.000đ',
    discountPrice: '199.000đ',
    image: (images.common as any).service_mom_baby || images.common.img_default,
  },
];

interface SearchServiceProps {
  onBack?: () => void;
  onFilterPress?: () => void;
}

export const SearchService: React.FC<SearchServiceProps> = ({ onBack, onFilterPress }) => {
  const [searchText, setSearchText] = useState('Tắm bé');
  const [selectedTab, setSelectedTab] = useState('hanoi');
  const [isFavoriteSelected, setIsFavoriteSelected] = useState(false);
  const [isSuggestedSelected, setIsSuggestedSelected] = useState(true);
  const [showFilterScreen, setShowFilterScreen] = useState(false);

  if (showFilterScreen) {
    return <SearchFilter onBack={() => setShowFilterScreen(false)} />;
  }

  const renderServiceCard = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity style={styles.gridCard} activeOpacity={0.7}>
      <View style={styles.cardImageWrapper}>
        <ImageHelper
          source={item.image}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cardBody}>
        <CText style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </CText>

        <View style={styles.badgeRatingRow}>
          {item.isHot && (
            <View style={styles.hotBadge}>
              <CText style={styles.hotBadgeText}>Hot</CText>
            </View>
          )}
          <IconX type="ionicons" name="star" size={12} color="#F59E0B" />
          <CText style={styles.ratingScore}>{item.rating}</CText>
          <CText style={styles.reviewCount}>({item.reviewsCount} đánh giá)</CText>
        </View>

        <CText style={styles.nurseName}>{item.nurseName}</CText>
        {item.distance && <CText style={styles.distanceText}>{item.distance}</CText>}

        <View style={styles.priceRow}>
          <CText style={styles.oldPrice}>{item.originalPrice}</CText>
          <CText style={styles.newPrice}>{item.discountPrice}</CText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onBack}
        >
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Tìm kiếm</CText>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Search Input Bar with Turquoise Outline */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <IconX type="ionicons" name="search" size={20} color="#14B8A6" />
          <TextInput
            placeholder="Tìm kiếm"
            placeholderTextColor="#98A2B3"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.filterBtn}
            onPress={() => {
              if (onFilterPress) {
                onFilterPress();
              } else {
                setShowFilterScreen(true);
              }
            }}
          >
            <View style={styles.filterFunnelContainer}>
              <View style={[styles.filterFunnelLine, { width: 15 }]} />
              <View style={[styles.filterFunnelLine, { width: 10 }]} />
              <View style={[styles.filterFunnelLine, { width: 5 }]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Filter Tabs Bar */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab, idx) => {
          const isActive = selectedTab === tab.id;
          const isNotLast = idx < TABS.length - 1;
          return (
            <React.Fragment key={tab.id}>
              <TouchableOpacity
                onPress={() => setSelectedTab(tab.id)}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                activeOpacity={0.7}
              >
                <CText style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </CText>
                {isActive && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
              {isNotLast && <View style={styles.tabDivider} />}
            </React.Fragment>
          );
        })}
      </View>

      {/* Filter Pills */}
      <View style={styles.pillsRow}>
        {PILLS.map((pill, index) => (
          <TouchableOpacity key={index} style={styles.pillItem} activeOpacity={0.7}>
            <CText style={styles.pillText}>{pill}</CText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section 1: Chọn điều dưỡng yêu thích Banner */}
      <TouchableOpacity
        style={styles.favoriteNurseBanner}
        onPress={() => setIsFavoriteSelected(!isFavoriteSelected)}
        activeOpacity={0.7}
      >
        <CText style={styles.favoriteNurseText}>Chọn điều dưỡng yêu thích</CText>
        <View style={[styles.checkboxSquare, isFavoriteSelected && styles.checkboxActive]}>
          {isFavoriteSelected && (
            <IconX type="ionicons" name="checkmark" size={13} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      {/* Section 2: Dịch vụ gợi ý liên quan Header */}
      <View style={styles.sectionHeaderRow}>
        <CText style={styles.sectionTitle}>Dịch vụ gợi ý liên quan</CText>
        <TouchableOpacity
          onPress={() => setIsSuggestedSelected(!isSuggestedSelected)}
          activeOpacity={0.7}
          style={[styles.checkboxSquare, isSuggestedSelected && styles.checkboxBlueActive]}
        >
          {isSuggestedSelected && (
            <IconX type="ionicons" name="checkmark" size={13} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* 2-Column Grid List */}
      <FlatList
        data={SERVICES_DATA}
        keyExtractor={item => item.id}
        renderItem={renderServiceCard}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101828',
  },
  rightPlaceholder: {
    width: 36,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#14B8A6',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 42,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#101828',
    marginLeft: 8,
    paddingVertical: 0,
  },
  filterBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterFunnelContainer: {
    width: 18,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2.5,
  },
  filterFunnelLine: {
    height: 2,
    backgroundColor: '#8E98A8',
    borderRadius: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabItemActive: {},
  tabText: {
    fontSize: 13.5,
    color: '#667085',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#14B8A6',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: '#14B8A6',
    borderRadius: 1,
  },
  tabDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#EAECF0',
  },
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  pillItem: {
    backgroundColor: '#F2F4F7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 12,
    color: '#344054',
    fontWeight: '500',
  },
  favoriteNurseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 4,
  },
  favoriteNurseText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#14B8A6',
  },
  checkboxSquare: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#14B8A6',
  },
  checkboxBlueActive: {
    backgroundColor: '#0080FF',
    borderColor: '#0080FF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridCard: {
    width: CARD_WIDTH,
  },
  cardImageWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F2F4F7',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    marginTop: 6,
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 17,
  },
  badgeRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  hotBadge: {
    backgroundColor: '#F04438',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginRight: 2,
  },
  hotBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 1,
  },
  reviewCount: {
    fontSize: 10.5,
    color: '#667085',
  },
  nurseName: {
    fontSize: 11,
    color: '#98A2B3',
    marginTop: 2,
  },
  distanceText: {
    fontSize: 11,
    color: '#98A2B3',
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  oldPrice: {
    fontSize: 10.5,
    color: '#98A2B3',
    textDecorationLine: 'line-through',
  },
  newPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F04438',
  },
});
