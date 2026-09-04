import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import { NotificationList } from '../notification';
import { SearchFilter, SearchService } from '../search-service';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Tất cả' },
  { id: '2', name: 'Tắm bé' },
  { id: '3', name: 'Chăm sóc sau sinh' },
  { id: '4', name: 'Chăm sóc người cao tuổi' },
  { id: '5', name: 'Vật lý trị liệu' },
];

const PROMOTIONS = [
  {
    id: '1',
    title: 'Giảm 30% gói dịch vụ\ndọn nhà tết trọn gói',
  },
  {
    id: '2',
    title: 'Giảm 20% gói dịch vụ\ndọn nhà tết',
  },
  {
    id: '3',
    title: 'Ưu đãi 15% cho khách hàng mới',
  },
];

export const HomeBooking: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'home' | 'search_results' | 'search_filter' | 'notifications'>('home');

  if (viewMode === 'notifications') {
    return <NotificationList onBack={() => setViewMode('home')} />;
  }

  if (viewMode === 'search_results') {
    return (
      <SearchService
        onBack={() => setViewMode('home')}
        onFilterPress={() => setViewMode('search_filter')}
      />
    );
  }

  if (viewMode === 'search_filter') {
    return <SearchFilter onBack={() => setViewMode('home')} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header Background Image bgHome */}
      <View style={styles.topBgContainer}>
        <ImageHelper
          source={(images.common as any).bg_home || images.common.img_default}
          style={styles.topBgImage}
          resizeMode="cover"
        />

        <SafeAreaView style={styles.safeTopContent}>
          {/* Top Bar User Info */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
              <IconX type="ionicons" name="arrow-back" size={24} color="#101828" />
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <View style={styles.avatarBorder}>
                <IconX type="ionicons" name="paw-outline" size={20} color="#667085" />
              </View>
              <View style={styles.greetingContainer}>
                <CText style={styles.greetingText}>Chào buổi sáng,</CText>
                <CText style={styles.userNameText}>User Name</CText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bellBtn}
              activeOpacity={0.7}
              onPress={() => setViewMode('notifications')}
            >
              <IconX type="ionicons" name="notifications-outline" size={22} color="#101828" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchContainer}
            activeOpacity={0.9}
            onPress={() => setViewMode('search_results')}
          >
            <IconX type="ionicons" name="search" size={20} color="#14B8A6" />
            <TextInput
              placeholder="Tìm kiếm"
              placeholderTextColor="#98A2B3"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setViewMode('search_results')}
            />
            <TouchableOpacity
              style={styles.filterBtn}
              activeOpacity={0.7}
              onPress={() => setViewMode('search_filter')}
            >
              <View style={styles.filterFunnelContainer}>
                <View style={[styles.filterFunnelLine, { width: 15 }]} />
                <View style={[styles.filterFunnelLine, { width: 10 }]} />
                <View style={[styles.filterFunnelLine, { width: 5 }]} />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Categories Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <CText
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </CText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Carousel */}
        <View style={styles.bannerWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannerScrollContent}
            decelerationRate="fast"
            snapToInterval={width - 48}
          >
            {/* Banner Left Preview */}
            <View style={[styles.bannerSideCard, styles.bannerGradientPink]} />

            {/* Banner Main Center (Vibrant Wave Gradient) */}
            <View style={[styles.bannerMainCard, styles.bannerGradientMain]} />

            {/* Banner Right Preview */}
            <View style={[styles.bannerSideCard, styles.bannerGradientPurple]} />
          </ScrollView>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Section: Dịch vụ */}
        <View style={styles.sectionHeader}>
          <CText style={styles.sectionTitle}>Dịch vụ</CText>
        </View>

        <View style={styles.servicesGrid}>
          {/* Item 1: Tắm bé */}
          <TouchableOpacity style={styles.serviceCardHalf} activeOpacity={0.7}>
            <View style={styles.serviceIconBox}>
              <IconX type="ionicons" name="body-outline" size={22} color="#101828" />
            </View>
            <CText style={styles.serviceTitle}>Tắm bé</CText>
          </TouchableOpacity>

          {/* Item 2: Chăm sóc sau sinh */}
          <TouchableOpacity style={styles.serviceCardHalf} activeOpacity={0.7}>
            <View style={styles.serviceIconBox}>
              <IconX type="ionicons" name="woman-outline" size={22} color="#101828" />
            </View>
            <CText style={styles.serviceTitle}>Chăm sóc{'\n'}sau sinh</CText>
          </TouchableOpacity>

          {/* Item 3: Chăm sóc bệnh nhân */}
          <TouchableOpacity style={styles.serviceCardHalf} activeOpacity={0.7}>
            <View style={styles.serviceIconBox}>
              <IconX type="ionicons" name="person-outline" size={22} color="#101828" />
            </View>
            <CText style={styles.serviceTitle}>Chăm sóc{'\n'}bệnh nhân</CText>
          </TouchableOpacity>

          {/* Item 4: Chăm sóc người cao tuổi */}
          <TouchableOpacity style={styles.serviceCardHalf} activeOpacity={0.7}>
            <View style={styles.serviceIconBox}>
              <IconX type="ionicons" name="people-outline" size={22} color="#101828" />
            </View>
            <CText style={styles.serviceTitle}>Chăm sóc{'\n'}người cao tuổi</CText>
          </TouchableOpacity>

          {/* Item 5: Vật lý trị liệu (Full Width Centered) */}
          <TouchableOpacity style={styles.serviceCardFull} activeOpacity={0.7}>
            <View style={styles.serviceIconBox}>
              <IconX type="ionicons" name="fitness-outline" size={22} color="#101828" />
            </View>
            <CText style={styles.serviceTitleFull}>Vật lý trị{'\n'}liệu</CText>
          </TouchableOpacity>
        </View>

        {/* Section: Khuyến mãi */}
        <View style={styles.sectionHeader}>
          <CText style={styles.sectionTitle}>Khuyến mãi</CText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoScrollContent}
        >
          {PROMOTIONS.map(promo => (
            <TouchableOpacity
              key={promo.id}
              style={styles.promoCard}
              activeOpacity={0.7}
            >
              <View style={styles.starBadge}>
                <IconX type="ionicons" name="star" size={14} color="#FFFFFF" />
              </View>
              <CText style={styles.promoText} numberOfLines={2}>
                {promo.title}
              </CText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBgContainer: {
    width: width,
    height: 250,
    position: 'relative',
    overflow: 'hidden',
  },
  topBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: width,
    height: 250,
  },
  safeTopContent: {
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 12,
    color: '#475467',
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginTop: 1,
  },
  bellBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#14B8A6',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#101828',
    paddingVertical: 0,
    marginLeft: 8,
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
  categoryScroll: {
    marginTop: 12,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F2F4F7',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#0D9488',
  },
  categoryText: {
    fontSize: 13,
    color: '#344054',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  bannerWrapper: {
    marginTop: 6,
    alignItems: 'center',
  },
  bannerScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  bannerSideCard: {
    width: 18,
    height: 140,
    borderRadius: 14,
  },
  bannerMainCard: {
    width: width - 70,
    height: 145,
    borderRadius: 16,
  },
  bannerGradientPink: {
    backgroundColor: '#F472B6',
  },
  bannerGradientMain: {
    backgroundColor: '#D946EF',
  },
  bannerGradientPurple: {
    backgroundColor: '#A855F7',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D0D5DD',
  },
  dotActive: {
    backgroundColor: '#0080FF',
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    rowGap: 10,
  },
  serviceCardHalf: {
    width: '48.5%',
    backgroundColor: '#E8FAF8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 66,
  },
  serviceCardFull: {
    width: '100%',
    backgroundColor: '#E8FAF8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 66,
  },
  serviceIconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 18,
    flex: 1,
  },
  serviceTitleFull: {
    fontSize: 13,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 18,
  },
  promoScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  promoCard: {
    width: 220,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  starBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  promoText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 17,
    flex: 1,
  },
});
