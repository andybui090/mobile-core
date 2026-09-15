import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { IconX, ImageHelper } from '@/components';
import { formatMoneyVND } from '@/configs/common';
import { images } from '@/configs/image';
import { PAGINATION, homeTabRoute } from '@/constants';
import {
  getCarelyServices,
  getCarelySearchServices,
} from '@/redux/slices/carelySlice';
import { CText } from '@/utils';
import { SearchFilter } from './SearchFilter';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

// Debounce helper
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

interface SearchServiceProps {
  onBack?: () => void;
  onFilterPress?: () => void;
}

export const SearchService: React.FC<SearchServiceProps> = ({ onBack, onFilterPress }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  // ── Redux state ─────────────────────────────────────────────────────
  const { carelyServiceData, carelySearchData } = useSelector(
    (state: any) => state.carelyReducer || {},
  );

  // ── UI state ─────────────────────────────────────────────────────────
  const [showFilterScreen, setShowFilterScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 400);

  // Filter tabs (dịch vụ cha từ API)
  const ALL_TAB = { id: 0, name: 'Tất cả' };
  const [filterTabs, setFilterTabs] = useState<any[]>([ALL_TAB]);
  const [selectedFilterId, setSelectedFilterId] = useState<number>(0);

  // Danh sách kết quả
  const [listServices, setListServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [finalLoad, setFinalLoad] = useState(false);
  const offsetRef = useRef(0);

  // ── API calls ────────────────────────────────────────────────────────

  /** Bước 1: lấy danh sách dịch vụ cha để làm filter tabs + danh sách mặc định */
  const callParentServices = useCallback(
    (offset: number) => {
      dispatch(
        getCarelyServices({
          limit: PAGINATION.ITEMS_50 || 50,
          offset,
          fq: 'status:1,is_deleted:0,parent_id:0,is_book_service:1',
          s: '',
        }),
      );
    },
    [dispatch],
  );

  /** Bước 2: lấy dịch vụ con theo filter + search (giống Doctor Network) */
  const callSearchServices = useCallback(
    (offset: number, filterId: number = 0, searchTxt: string = '') => {
      dispatch(
        getCarelySearchServices({
          limit: PAGINATION.ITEMS_50 || 50,
          offset,
          fq: `status:1,is_deleted:0,parent_id:${filterId},is_book_service:1`,
          s: searchTxt ? `${searchTxt}|name` : '',
        }),
      );
    },
    [dispatch],
  );

  // ── Effects ──────────────────────────────────────────────────────────

  // Mount: lấy dịch vụ cha
  useEffect(() => {
    callParentServices(0);
  }, []);

  // Xử lý kết quả getCarelyServices (dịch vụ cha → filter tabs)
  useEffect(() => {
    const { loading, data, error } = carelyServiceData || {};
    if (!loading) {
      if (data) {
        const items: any[] = data.items || [];
        setFilterTabs([ALL_TAB, ...items]);
        // Lần đầu, nếu chưa có filter/search → dùng luôn danh sách cha làm kết quả
        if (selectedFilterId === 0 && !debouncedSearch) {
          setListServices(items);
          setFinalLoad(items.length < (PAGINATION.ITEMS_50 || 50));
        }
      } else if (error) {
        // giữ tabs mặc định
      }
      setLoadingServices(false);
      setRefreshing(false);
    }
  }, [carelyServiceData]);

  // Xử lý kết quả getCarelySearchServices (dịch vụ con)
  useEffect(() => {
    const { loading, data, error } = carelySearchData || {};
    if (!loading) {
      if (data) {
        const newItems: any[] = data.items || [];
        if (offsetRef.current === 0) {
          setListServices(newItems);
        } else {
          setListServices(prev => [...prev, ...newItems]);
        }
        setFinalLoad(newItems.length < (PAGINATION.ITEMS_50 || 50));
      } else if (error) {
        if (offsetRef.current === 0) setListServices([]);
      }
      setLoadingServices(false);
      setRefreshing(false);
    }
  }, [carelySearchData]);

  // Khi debounced search thay đổi → gọi API search
  useEffect(() => {
    if (debouncedSearch !== '' || selectedFilterId !== 0) {
      setLoadingServices(true);
      offsetRef.current = 0;
      callSearchServices(0, selectedFilterId, debouncedSearch);
    } else {
      // Về lại trạng thái ban đầu → dùng danh sách cha
      setLoadingServices(true);
      offsetRef.current = 0;
      callParentServices(0);
    }
  }, [debouncedSearch, selectedFilterId]);

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleFilterSelect = (tab: any) => {
    if (tab.id === selectedFilterId) return;
    setSelectedFilterId(tab.id);
    // Effect sẽ tự trigger khi selectedFilterId đổi
  };

  const handleLoadMore = () => {
    if (finalLoad || loadingServices || refreshing) return;
    const nextOffset = offsetRef.current + (PAGINATION.ITEMS_50 || 50);
    offsetRef.current = nextOffset;
    if (selectedFilterId !== 0 || debouncedSearch) {
      callSearchServices(nextOffset, selectedFilterId, debouncedSearch);
    } else {
      callParentServices(nextOffset);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    offsetRef.current = 0;
    setFinalLoad(false);
    if (selectedFilterId !== 0 || debouncedSearch) {
      callSearchServices(0, selectedFilterId, debouncedSearch);
    } else {
      callParentServices(0);
    }
  };

  const handleCardPress = (item: any) => {
    // Nếu là dịch vụ cha → vào màn danh sách con
    if (selectedFilterId === 0 && !debouncedSearch) {
      navigation.navigate(homeTabRoute.carelyServiceScreen, {
        parentService: item,
      });
    } else {
      navigation.navigate(homeTabRoute.carelyServiceDetailScreen, {
        service: item,
      });
    }
  };

  // ── Render ───────────────────────────────────────────────────────────

  if (showFilterScreen) {
    return <SearchFilter onBack={() => setShowFilterScreen(false)} />;
  }

  const renderFilterTabs = () => (
    <FlatList
      horizontal
      data={filterTabs}
      keyExtractor={item => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterTabsList}
      renderItem={({ item }) => {
        const isActive = selectedFilterId === item.id;
        return (
          <TouchableOpacity
            onPress={() => handleFilterSelect(item)}
            activeOpacity={0.7}
            style={[styles.filterTabChip, isActive && styles.filterTabChipActive]}
          >
            <CText style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
              {item.name}
            </CText>
          </TouchableOpacity>
        );
      }}
    />
  );

  const renderServiceCard = ({ item }: { item: any }) => {
    const title = item?.name || item?.title || '';
    const nurseOrDoctor =
      item?.channel?.name ||
      item?.doctor?.full_name ||
      item?.nurse_name ||
      'Điều dưỡng Aloka';
    const rating = item?.avg_value ? Number(item.avg_value).toFixed(1) : '5.0';
    const totalRatings = item?.total_ratings || 0;
    const price = item?.price ?? item?.package?.price ?? 0;
    const priceFormatted = formatMoneyVND(price, '.');
    const isHot = Boolean(item?.is_hot || item?.hot);

    const imageSource = item?.thumbnail
      ? { uri: item.thumbnail }
      : (images.common as any)?.service_mom_baby || images.common.img_default;

    return (
      <TouchableOpacity
        style={styles.gridCard}
        activeOpacity={0.7}
        onPress={() => handleCardPress(item)}
      >
        <View style={styles.cardImageWrapper}>
          <ImageHelper source={imageSource} style={styles.cardImage} resizeMode="cover" />
          {isHot && (
            <View style={styles.hotBadge}>
              <CText style={styles.hotBadgeText}>Hot</CText>
            </View>
          )}
        </View>
        <View style={styles.cardBody}>
          <CText style={styles.cardTitle} numberOfLines={2}>{title}</CText>
          <View style={styles.ratingRow}>
            <IconX type="ionicons" name="star" size={12} color="#F59E0B" />
            <CText style={styles.ratingScore}>{rating}</CText>
            {totalRatings > 0 && (
              <CText style={styles.reviewCount}>({totalRatings})</CText>
            )}
          </View>
          <CText style={styles.nurseName} numberOfLines={1}>{nurseOrDoctor}</CText>
          {price > 0 && (
            <CText style={styles.priceText}>{priceFormatted}</CText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loadingServices) return null;
    return (
      <View style={styles.emptyContainer}>
        <IconX type="ionicons" name="search-outline" size={52} color="#D0D5DD" />
        <CText style={styles.emptyText}>
          {debouncedSearch
            ? `Không tìm thấy kết quả cho "${debouncedSearch}"`
            : 'Chưa có dịch vụ nào'}
        </CText>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingServices || refreshing) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color="#14B8A6" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onBack ? onBack : () => navigation.goBack()}
        >
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Tìm kiếm</CText>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <IconX type="ionicons" name="search" size={20} color="#14B8A6" />
          <TextInput
            placeholder="Tìm kiếm dịch vụ"
            placeholderTextColor="#98A2B3"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} activeOpacity={0.7}>
              <IconX type="ionicons" name="close-circle" size={18} color="#98A2B3" />
            </TouchableOpacity>
          )}
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

      {/* Filter Tabs từ API */}
      <View style={styles.filterTabsContainer}>
        {renderFilterTabs()}
      </View>

      {/* Danh sách dịch vụ từ API */}
      {loadingServices && listServices.length === 0 ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#14B8A6" />
        </View>
      ) : (
        <FlatList
          data={listServices}
          keyExtractor={(item, index) => String(item?.id || item?._id || index)}
          renderItem={renderServiceCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.listContent,
            listServices.length === 0 && { flexGrow: 1, justifyContent: 'center' },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#14B8A6"
              colors={['#14B8A6']}
            />
          }
        />
      )}
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
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#101828',
    paddingVertical: 0,
  },
  filterBtn: {
    padding: 4,
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
  filterTabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  filterTabsList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTabChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F2F4F7',
  },
  filterTabChipActive: {
    backgroundColor: '#14B8A6',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#667085',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAECF0',
    overflow: 'hidden',
  },
  cardImageWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.05,
    backgroundColor: '#F2F4F7',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F04438',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 17,
    minHeight: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 3,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  reviewCount: {
    fontSize: 10.5,
    color: '#667085',
  },
  nurseName: {
    fontSize: 11,
    color: '#98A2B3',
    marginTop: 3,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#14B8A6',
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#98A2B3',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
