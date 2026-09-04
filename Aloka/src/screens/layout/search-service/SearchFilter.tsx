import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@/components';
import { CText } from '@/utils';

const SIDEBAR_ITEMS = [
  { id: 'time', label: 'Thời gian' },
  { id: 'location', label: 'Địa điểm' },
  { id: 'price', label: 'Khoảng giá\n(VNĐ)' },
  { id: 'popular', label: 'Phổ biến' },
  { id: 'rating', label: 'Đánh giá' },
];

const LOCATIONS = ['Hồ Chí Minh', 'Thủ Đức', 'Bán kính <10km', 'Tất cả'];
const POPULAR_OPTIONS = [
  'Đặt nhiều nhất',
  'Đánh giá cao nhất',
  'Dịch vụ mới nhất',
  'Được đề xuất nhất',
];

interface SearchFilterProps {
  onBack?: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onBack }) => {
  const [selectedSidebar, setSelectedSidebar] = useState('time');
  const [searchText, setSearchText] = useState('Tắm bé');

  // Filter States
  const [day, setDay] = useState('18');
  const [month, setMonth] = useState('07');
  const [timeFrom, setTimeFrom] = useState('07:30');
  const [timeTo, setTimeTo] = useState('09:00');
  const [selectedLocation, setSelectedLocation] = useState('Hồ Chí Minh');
  const [selectedPriceSort, setSelectedPriceSort] = useState('Từ cao đến thấp');
  const [selectedPopular, setSelectedPopular] = useState('Đánh giá cao nhất');
  const [selectedRating, setSelectedRating] = useState('4');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Tìm kiếm</CText>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <IconX type="ionicons" name="search" size={20} color="#14B8A6" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Tìm kiếm"
            placeholderTextColor="#98A2B3"
            style={styles.searchInput}
          />
          <TouchableOpacity activeOpacity={0.7} style={styles.filterBtn}>
            <View style={styles.filterFunnelContainer}>
              <View style={[styles.filterFunnelLine, { width: 15 }]} />
              <View style={[styles.filterFunnelLine, { width: 10 }]} />
              <View style={[styles.filterFunnelLine, { width: 5 }]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Split Layout: Left Sidebar + Right Filter Content */}
      <View style={styles.mainLayout}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {SIDEBAR_ITEMS.map(item => {
            const isActive = selectedSidebar === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedSidebar(item.id)}
                style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                activeOpacity={0.7}
              >
                {isActive && <View style={styles.activeBar} />}
                <CText
                  style={[
                    styles.sidebarItemText,
                    isActive && styles.sidebarItemTextActive,
                  ]}
                >
                  {item.label}
                </CText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right Scrollable Filter Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {/* Section 1: Thời gian */}
          <View style={styles.section}>
            <CText style={styles.sectionHeading}>Thời gian</CText>

            {/* Ngày - Tháng */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldCol}>
                <CText style={styles.fieldLabel}>Ngày</CText>
                <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.7}>
                  <CText style={styles.dropdownValue}>{day}</CText>
                  <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldCol}>
                <CText style={styles.fieldLabel}>Tháng</CText>
                <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.7}>
                  <CText style={styles.dropdownValue}>{month}</CText>
                  <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.trashBtn} activeOpacity={0.7}>
                <IconX type="ionicons" name="trash-outline" size={18} color="#98A2B3" />
              </TouchableOpacity>
            </View>

            {/* Từ - Đến */}
            <CText style={[styles.fieldLabel, { marginTop: 12 }]}>Thời gian</CText>
            <View style={styles.fieldRow}>
              <View style={styles.fieldCol}>
                <CText style={styles.subFieldLabel}>Từ</CText>
                <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.7}>
                  <CText style={styles.dropdownValue}>{timeFrom}</CText>
                  <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldCol}>
                <CText style={styles.subFieldLabel}>Đến</CText>
                <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.7}>
                  <CText style={styles.dropdownValue}>{timeTo}</CText>
                  <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.trashBtn} activeOpacity={0.7}>
                <IconX type="ionicons" name="trash-outline" size={18} color="#98A2B3" />
              </TouchableOpacity>
            </View>

            {/* Quick Button: Đặt lịch ngay bây giờ */}
            <TouchableOpacity style={styles.bookNowBtn} activeOpacity={0.7}>
              <CText style={styles.bookNowBtnText}>Đặt lịch ngay bây giờ</CText>
            </TouchableOpacity>
          </View>

          {/* Section 2: Địa điểm */}
          <View style={styles.section}>
            <CText style={styles.sectionHeading}>Địa điểm</CText>
            <View style={styles.grid2Col}>
              {LOCATIONS.map(loc => {
                const isActive = selectedLocation === loc;
                return (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => setSelectedLocation(loc)}
                    style={[styles.chipBox, isActive && styles.chipBoxActive]}
                    activeOpacity={0.7}
                  >
                    <CText
                      style={[styles.chipText, isActive && styles.chipTextActive]}
                      numberOfLines={1}
                    >
                      {loc}
                    </CText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 3: Khoảng giá (VNĐ) */}
          <View style={styles.section}>
            <CText style={styles.sectionHeading}>Khoảng giá (VNĐ)</CText>
            <View style={styles.priceRow}>
              <View style={styles.priceChip}>
                <CText style={styles.priceChipText}>100.000VNĐ</CText>
              </View>
              <View style={[styles.priceChip, styles.priceChipActive]}>
                <CText style={[styles.priceChipText, styles.priceChipTextActive]}>
                  1.000.000VNĐ
                </CText>
              </View>
            </View>

            {/* Slider Visual Track */}
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrackBg} />
              <View style={styles.sliderTrackActive} />
              <View style={[styles.sliderKnob, { left: 0 }]} />
              <View style={[styles.sliderKnob, { right: 0 }]} />
            </View>

            {/* Sort Price */}
            <CText style={[styles.sectionHeading, { marginTop: 16 }]}>
              Khoảng giá (VNĐ)
            </CText>
            <View style={styles.grid2Col}>
              {['Từ thấp đến cao', 'Từ cao đến thấp'].map(sort => {
                const isActive = selectedPriceSort === sort;
                return (
                  <TouchableOpacity
                    key={sort}
                    onPress={() => setSelectedPriceSort(sort)}
                    style={[styles.chipBox, isActive && styles.chipBoxActive]}
                    activeOpacity={0.7}
                  >
                    <CText
                      style={[styles.chipText, isActive && styles.chipTextActive]}
                      numberOfLines={1}
                    >
                      {sort}
                    </CText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 4: Phổ biến */}
          <View style={styles.section}>
            <CText style={styles.sectionHeading}>Phổ biến</CText>
            <View style={styles.grid2Col}>
              {POPULAR_OPTIONS.map(opt => {
                const isActive = selectedPopular === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setSelectedPopular(opt)}
                    style={[styles.chipBox, isActive && styles.chipBoxActive]}
                    activeOpacity={0.7}
                  >
                    <CText
                      style={[styles.chipText, isActive && styles.chipTextActive]}
                      numberOfLines={1}
                    >
                      {opt}
                    </CText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 5: Đánh giá */}
          <View style={styles.section}>
            <CText style={styles.sectionHeading}>Đánh giá</CText>
            <View style={styles.ratingChipsRow}>
              {['4', '3'].map(rate => {
                const isActive = selectedRating === rate;
                return (
                  <TouchableOpacity
                    key={rate}
                    onPress={() => setSelectedRating(rate)}
                    style={[styles.ratingChip, isActive && styles.ratingChipActive]}
                    activeOpacity={0.7}
                  >
                    <CText style={styles.ratingChipText}>Từ {rate}</CText>
                    <IconX type="ionicons" name="star" size={14} color="#F59E0B" />
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.ratingChipsRow}>
              {['2'].map(rate => {
                const isActive = selectedRating === rate;
                return (
                  <TouchableOpacity
                    key={rate}
                    onPress={() => setSelectedRating(rate)}
                    style={[styles.ratingChip, isActive && styles.ratingChipActive]}
                    activeOpacity={0.7}
                  >
                    <CText style={styles.ratingChipText}>Từ {rate}</CText>
                    <IconX type="ionicons" name="star" size={14} color="#F59E0B" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
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
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
  },
  headerPlaceholder: {
    width: 36,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#14B8A6',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
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
    backgroundColor: '#14B8A6',
    borderRadius: 1,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#F2F4F7',
  },
  sidebarItem: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    position: 'relative',
    justifyContent: 'center',
  },
  sidebarItemActive: {
    backgroundColor: '#F9FAFB',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: '#14B8A6',
    borderRadius: 1.5,
  },
  sidebarItemText: {
    fontSize: 13,
    color: '#667085',
    fontWeight: '500',
    lineHeight: 18,
  },
  sidebarItemTextActive: {
    color: '#14B8A6',
    fontWeight: '700',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  fieldCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 6,
  },
  subFieldLabel: {
    fontSize: 12,
    color: '#344054',
    marginBottom: 6,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#101828',
  },
  trashBtn: {
    width: 36,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookNowBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#14B8A6',
    borderRadius: 6,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  bookNowBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipBox: {
    width: '48%',
    height: 36,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  chipBoxActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  chipText: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#14B8A6',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  priceChip: {
    flex: 1,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceChipActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  priceChipText: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '500',
  },
  priceChipTextActive: {
    color: '#14B8A6',
    fontWeight: '600',
  },
  sliderContainer: {
    height: 24,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  sliderTrackBg: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    width: '100%',
  },
  sliderTrackActive: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#0080FF',
    borderRadius: 2,
  },
  sliderKnob: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0080FF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  ratingChipActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  ratingChipText: {
    fontSize: 12.5,
    color: '#667085',
    fontWeight: '500',
  },
});
