import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { IconX, ImageHelper } from '@/components';
import { formatMoneyVND } from '@/configs/common';
import { images } from '@/configs/image';
import {
  requestLocationPermission,
  getCurrentPositionAsync,
  calculateDistanceKm,
  alertOpenSettingsForLocation,
  checkLocationPermission,
  UserCoordinates,
} from '@/configs';
import { RESULTS } from 'react-native-permissions';
import { AppContext } from '@/contexts';
import { PAGINATION, homeTabRoute, mainRoute } from '@/constants';
import {
  getCarelyServices,
  getCarelySearchServices,
} from '@/redux/slices/carelySlice';
import { CText } from '@/utils';
import { SearchFilter } from './SearchFilter';
import {
  MCNDoctor,
  MCNHospital,
  MCNService,
  MOCK_MCN_LIST,
  POPULAR_SUGGESTED_SERVICES,
  getAllDoctorsFromMCN,
} from './MCNMockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

// 3 luồng tìm kiếm chính
type SearchFlow = 'SERVICES' | 'DOCTORS' | 'NEARBY_MCN';

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
  const { setGlobalLocation } = useContext<any>(AppContext) || {};

  // ── Redux state ─────────────────────────────────────────────────────
  const { carelyServiceData, carelySearchData } = useSelector(
    (state: any) => state.carelyReducer || {},
  );

  // ── UI state ─────────────────────────────────────────────────────────
  const [activeFlow, setActiveFlow] = useState<SearchFlow>('SERVICES');
  const [showFilterScreen, setShowFilterScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 400);

  // Location / Scanning state
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
  const [isScanningNearby, setIsScanningNearby] = useState<boolean>(false);
  const [showNearbyPrompt, setShowNearbyPrompt] = useState<boolean>(true);
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>(null);
  const [hospitalsList, setHospitalsList] = useState<MCNHospital[]>(MOCK_MCN_LIST);

  // Kiểm tra quyền vị trí ban đầu
  useEffect(() => {
    checkLocationPermission().then(status => {
      if (status === RESULTS.GRANTED) {
        setHasLocationPermission(true);
      }
    });
  }, []);

  // Filter tabs (dịch vụ cha từ API cho Luồng 1)
  const ALL_TAB = { id: 0, name: 'Tất cả', title: 'Tất cả' };
  const [filterTabs, setFilterTabs] = useState<any[]>([ALL_TAB]);
  const [selectedFilterId, setSelectedFilterId] = useState<number>(0);

  // Dữ liệu cho Luồng 1: Gói dịch vụ
  const [listServices, setListServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [finalLoad, setFinalLoad] = useState(false);
  const offsetRef = useRef(0);

  // Dữ liệu cho Luồng 2: Bác sĩ / Điều dưỡng
  const allDoctors = useMemo(() => getAllDoctorsFromMCN(), []);
  const filteredDoctors = useMemo(() => {
    if (!debouncedSearch) return allDoctors;
    const q = debouncedSearch.toLowerCase();
    return allDoctors.filter(
      d =>
        d.full_name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.position.toLowerCase().includes(q) ||
        d.mcn_name.toLowerCase().includes(q) ||
        d.mcn_id.toLowerCase().includes(q),
    );
  }, [allDoctors, debouncedSearch]);

  // Dữ liệu cho Luồng 3: Bệnh viện / MCN gần tôi
  const filteredHospitals = useMemo(() => {
    const list = hospitalsList;
    if (!debouncedSearch) return list;
    const q = debouncedSearch.toLowerCase();
    return list.filter(
      h =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q) ||
        h.email.toLowerCase().includes(q),
    );
  }, [hospitalsList, debouncedSearch]);

  // ── API calls (Luồng 1) ──────────────────────────────────────────────
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

  // Mount: lấy dịch vụ cha
  useEffect(() => {
    callParentServices(0);
  }, []);

  // Xử lý kết quả getCarelyServices
  useEffect(() => {
    const { loading, data } = carelyServiceData || {};
    if (!loading) {
      if (data) {
        const rawItems: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data.items)
            ? data.items
            : [];
        const items = rawItems.map(item => ({
          ...item,
          name: item?.name || item?.title || item?.service_name || '',
          title: item?.title || item?.name || item?.service_name || '',
        }));
        setFilterTabs([ALL_TAB, ...items]);
        if (selectedFilterId === 0 && !debouncedSearch) {
          setListServices(items);
          setFinalLoad(items.length < (PAGINATION.ITEMS_50 || 50));
        }
      }
      setLoadingServices(false);
      setRefreshing(false);
    }
  }, [carelyServiceData]);

  // Xử lý kết quả getCarelySearchServices
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

  // Debounced search trigger (cho Luồng 1)
  useEffect(() => {
    if (activeFlow === 'SERVICES') {
      if (debouncedSearch !== '' || selectedFilterId !== 0) {
        setLoadingServices(true);
        offsetRef.current = 0;
        callSearchServices(0, selectedFilterId, debouncedSearch);
      } else {
        setLoadingServices(true);
        offsetRef.current = 0;
        callParentServices(0);
      }
    }
  }, [debouncedSearch, selectedFilterId, activeFlow]);

  // ── Actions & Handlers ───────────────────────────────────────────────

  const handleFilterSelect = (tab: any) => {
    if (tab.id === selectedFilterId) return;
    setSelectedFilterId(tab.id);
  };

  const handleLoadMore = () => {
    if (activeFlow !== 'SERVICES') return;
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
    if (activeFlow === 'SERVICES') {
      if (selectedFilterId !== 0 || debouncedSearch) {
        callSearchServices(0, selectedFilterId, debouncedSearch);
      } else {
        callParentServices(0);
      }
    } else {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  /**
   * Kích hoạt quét vị trí tìm MCN Bệnh viện gần tôi (Luồng 3)
   * Sử dụng thư viện react-native-permissions để xin quyền từ Cài đặt thiết bị
   * và @react-native-community/geolocation để lấy toạ độ GPS chính xác.
   */
  const handleEnableLocationAndScan = async () => {
    Keyboard.dismiss();
    setIsScanningNearby(true);
    try {
      // 1. Kiểm tra và xin quyền vị trí. Nếu chưa cho phép / bị chặn, hiển thị Popup dẫn tới Cài đặt (Settings) thiết bị
      const permResult = await requestLocationPermission(true);
      if (!permResult.isSuccess) {
        setIsScanningNearby(false);
        return;
      }

      // 2. Đã cấp quyền: Sử dụng thư viện Geolocation để lấy toạ độ GPS
      const coords = await getCurrentPositionAsync(12000);
      setUserCoords(coords);
      setHasLocationPermission(true);

      if (setGlobalLocation) {
        setGlobalLocation(coords);
      }

      // 3. Tính toán lại khoảng cách thực tế đến từng Bệnh viện / Phòng khám MCN và sort theo khoảng cách gần nhất
      const updatedHospitals = MOCK_MCN_LIST.map(hosp => {
        if (hosp.latitude && hosp.longitude) {
          const dist = calculateDistanceKm(
            coords.latitude,
            coords.longitude,
            hosp.latitude,
            hosp.longitude,
          );
          return { ...hosp, distanceKm: dist };
        }
        return hosp;
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      setHospitalsList(updatedHospitals);
      setActiveFlow('NEARBY_MCN');
      setShowNearbyPrompt(false);
    } catch (error: any) {
      console.warn('handleEnableLocationAndScan error:', error);
      alertOpenSettingsForLocation(
        'Không thể xác định toạ độ GPS',
        'Vui lòng kiểm tra định vị GPS trên thiết bị đã được bật trong Cài đặt.',
      );
    } finally {
      setIsScanningNearby(false);
    }
  };

  const handleCardPress = (item: any) => {
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

  const handleHospitalPress = (hospital: MCNHospital) => {
    navigation.navigate('MCNDetailScreen', { hospital, mcnId: hospital.id });
  };

  const handleDoctorBookService = (service: MCNService, doctor: MCNDoctor) => {
    navigation.navigate(homeTabRoute.carelyServiceDetailScreen || mainRoute.carelyServiceDetailScreen, {
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        time_package: service.duration,
        description: service.description,
        is_book_service: 1,
        mcn_id: doctor.mcn_id,
        mcn_name: doctor.mcn_name,
        channel_id: service.channel_id,
        user_id: doctor.id,
        doctor: {
          id: doctor.id,
          full_name: doctor.full_name,
          avatar: doctor.avatar,
          position: doctor.position,
        },
        channel: {
          name: doctor.mcn_name,
          owner_id: doctor.id,
        },
      },
    });
  };

  if (showFilterScreen) {
    return <SearchFilter onBack={() => setShowFilterScreen(false)} />;
  }

  // ── Render Components ────────────────────────────────────────────────

  /** Thanh tab chuyển 3 luồng tìm kiếm */
  const renderFlowTabs = () => (
    <View style={styles.flowTabsRow}>
      <TouchableOpacity
        style={[styles.flowTabItem, activeFlow === 'SERVICES' && styles.flowTabItemActive]}
        activeOpacity={0.7}
        onPress={() => setActiveFlow('SERVICES')}
      >
        <IconX
          type="ionicons"
          name="cube-outline"
          size={16}
          color={activeFlow === 'SERVICES' ? '#0D9488' : '#64748B'}
        />
        <CText style={[styles.flowTabText, activeFlow === 'SERVICES' && styles.flowTabTextActive]}>
          Gói dịch vụ
        </CText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.flowTabItem, activeFlow === 'DOCTORS' && styles.flowTabItemActive]}
        activeOpacity={0.7}
        onPress={() => setActiveFlow('DOCTORS')}
      >
        <IconX
          type="ionicons"
          name="person-outline"
          size={16}
          color={activeFlow === 'DOCTORS' ? '#0D9488' : '#64748B'}
        />
        <CText style={[styles.flowTabText, activeFlow === 'DOCTORS' && styles.flowTabTextActive]}>
          Bác sĩ & ĐD
        </CText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.flowTabItem, activeFlow === 'NEARBY_MCN' && styles.flowTabItemActive]}
        activeOpacity={0.7}
        onPress={() => {
          setActiveFlow('NEARBY_MCN');
          if (!hasLocationPermission || !userCoords) {
            handleEnableLocationAndScan();
          }
        }}
      >
        <IconX
          type="ionicons"
          name="navigate-outline"
          size={16}
          color={activeFlow === 'NEARBY_MCN' ? '#0D9488' : '#64748B'}
        />
        <CText
          style={[styles.flowTabText, activeFlow === 'NEARBY_MCN' && styles.flowTabTextActive]}
        >
          Gần tôi (MCN)
        </CText>
      </TouchableOpacity>
    </View>
  );

  /** Banner gợi ý "Tìm quanh đây bạn có muốn không?" */
  const renderNearbyPromptBanner = () => {
    if (!showNearbyPrompt && activeFlow === 'NEARBY_MCN') return null;
    return (
      <View style={styles.nearbyPromptBox}>
        <View style={styles.nearbyPromptLeft}>
          <View style={[styles.radarIconWrap, userCoords && styles.radarIconWrapActive]}>
            <IconX
              type="ionicons"
              name={userCoords ? 'navigate' : 'location'}
              size={20}
              color="#0D9488"
            />
          </View>
          <View style={styles.nearbyPromptContent}>
            <CText style={styles.nearbyPromptTitle}>
              {userCoords ? 'Đang định vị gần bạn' : 'Tìm cơ sở y tế quanh đây?'}
            </CText>
            <CText style={styles.nearbyPromptSub}>
              {userCoords
                ? `Toạ độ GPS (${userCoords.latitude.toFixed(2)}, ${userCoords.longitude.toFixed(2)}) • Gần nhất: ${hospitalsList[0]?.name || ''}`
                : 'Quét bệnh viện & phòng khám đối tác (MCN) gần bạn nhất.'}
            </CText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.nearbyPromptBtn, userCoords && styles.nearbyPromptBtnActive]}
          activeOpacity={0.7}
          onPress={handleEnableLocationAndScan}
          disabled={isScanningNearby}
        >
          {isScanningNearby ? (
            <ActivityIndicator size="small" color={userCoords ? '#0D9488' : '#FFFFFF'} />
          ) : (
            <CText
              style={[
                styles.nearbyPromptBtnText,
                userCoords && styles.nearbyPromptBtnTextActive,
              ]}
            >
              {userCoords ? 'Quét lại' : 'Tìm quanh đây'}
            </CText>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  /** Filter categories cho Luồng 1 */
  const renderCategoryFilterTabs = () => (
    <View style={styles.filterTabsWrapper}>
      <FlatList
        horizontal
        data={filterTabs}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsList}
        renderItem={({ item }) => {
          const isActive = selectedFilterId === item.id;
          const tabTitle =
            item?.name ||
            item?.title ||
            item?.service_name ||
            (item?.id === 0 ? 'Tất cả' : 'Dịch vụ');
          return (
            <TouchableOpacity
              onPress={() => handleFilterSelect(item)}
              activeOpacity={0.7}
              style={[
                styles.filterTabChip,
                isActive && styles.filterTabChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.filterTabTextActive,
                ]}
                numberOfLines={1}
              >
                {tabTitle}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  /** Card dịch vụ (Luồng 1) */
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
        </View>
      </TouchableOpacity>
    );
  };

  /** Item Bác sĩ / Điều dưỡng (Luồng 2) */
  const renderDoctorItem = ({ item }: { item: MCNDoctor }) => {
    return (
      <View style={styles.doctorCardItem}>
        <View style={styles.doctorHeader}>
          <ImageHelper source={{ uri: item.avatar }} style={styles.doctorAvatar} resizeMode="cover" />
          <View style={styles.doctorDetails}>
            <View style={styles.doctorNameLine}>
              <CText style={styles.doctorName}>{item.full_name}</CText>
              <IconX type="ionicons" name="checkmark-circle" size={14} color="#0D9488" />
            </View>
            <CText style={styles.doctorRole}>{item.position}</CText>
            <CText style={styles.doctorSpec} numberOfLines={1}>{item.specialization}</CText>
            <View style={styles.doctorMCNTag}>
              <IconX type="ionicons" name="business" size={11} color="#0284C7" />
              <CText style={styles.doctorMCNText}>{item.mcn_name}</CText>
            </View>
          </View>
        </View>

        {/* Các gói dịch vụ của bác sĩ */}
        {item.services && item.services.length > 0 && (
          <View style={styles.doctorServicesList}>
            <CText style={styles.servicesLabel}>Gói dịch vụ nổi bật:</CText>
            {item.services.map((srv, idx) => (
              <View key={String(srv.id || idx)} style={styles.doctorServiceRow}>
                <View style={styles.doctorServiceInfo}>
                  <CText style={styles.doctorServiceName} numberOfLines={1}>{srv.name}</CText>
                  <CText style={styles.doctorServicePrice}>
                    {formatMoneyVND(srv.price, '.')} • {srv.duration}p
                  </CText>
                </View>
                <TouchableOpacity
                  style={styles.doctorServiceBookBtn}
                  activeOpacity={0.7}
                  onPress={() => handleDoctorBookService(srv, item)}
                >
                  <CText style={styles.doctorServiceBookText}>Đặt lịch</CText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  /** Card Bệnh viện / Phòng khám MCN (Luồng 3) */
  const renderHospitalMCNItem = ({ item }: { item: MCNHospital }) => {
    return (
      <TouchableOpacity
        style={styles.hospitalCard}
        activeOpacity={0.8}
        onPress={() => handleHospitalPress(item)}
      >
        <Image source={{ uri: item.coverImage || item.avatar }} style={styles.hospitalCover} resizeMode="cover" />
        <View style={styles.hospitalBody}>
          <View style={styles.hospitalTopRow}>
            <View style={styles.hospitalAvatarWrap}>
              <ImageHelper source={{ uri: item.avatar }} style={styles.hospitalAvatar} resizeMode="cover" />
            </View>
            <View style={styles.hospitalMainInfo}>
              <CText style={styles.hospitalName} numberOfLines={1}>{item.name}</CText>
              <View style={styles.hospitalTagsRow}>
                <View style={styles.mcnTag}>
                  <CText style={styles.mcnTagText}>MCN: {item.id}</CText>
                </View>
                <View style={styles.distanceTag}>
                  <IconX type="ionicons" name="navigate" size={11} color="#0D9488" />
                  <CText style={styles.distanceTagText}>Cách {item.distanceKm} km</CText>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.hospitalAddressRow}>
            <IconX type="ionicons" name="location-outline" size={14} color="#64748B" />
            <CText style={styles.hospitalAddressText} numberOfLines={2}>{item.address}</CText>
          </View>

          <View style={styles.hospitalFooterRow}>
            <View style={styles.hospitalStatItem}>
              <IconX type="ionicons" name="people-outline" size={14} color="#0D9488" />
              <CText style={styles.hospitalStatText}>{item.doctors.length} Bác sĩ / ĐD</CText>
            </View>
            <View style={styles.hospitalStatItem}>
              <IconX type="ionicons" name="star" size={13} color="#F59E0B" />
              <CText style={styles.hospitalStatText}>{item.rating} ({item.totalReviews})</CText>
            </View>
            <View style={styles.viewDoctorBtn}>
              <CText style={styles.viewDoctorBtnText}>Xem danh sách bác sĩ</CText>
              <IconX type="ionicons" name="chevron-forward" size={13} color="#0D9488" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Smart Empty State kèm Gợi ý khi không tìm thấy kết quả
   */
  const renderSmartEmptyState = () => {
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyHeader}>
          <IconX type="ionicons" name="search-outline" size={48} color="#94A3B8" />
          <CText style={styles.emptyTitle}>
            {debouncedSearch
              ? `Chưa tìm thấy kết quả cho "${debouncedSearch}"`
              : 'Không có dữ liệu phù hợp'}
          </CText>
          <CText style={styles.emptySubtitle}>
            Đừng lo! Hãy thử tìm các cơ sở y tế gần bạn hoặc tham khảo các dịch vụ phổ biến dưới đây.
          </CText>
        </View>

        {/* Gợi ý 1: Nút quét cơ sở gần tôi */}
        <TouchableOpacity
          style={styles.suggestionBanner}
          activeOpacity={0.7}
          onPress={handleEnableLocationAndScan}
        >
          <View style={styles.suggestionBannerLeft}>
            <IconX type="ionicons" name="navigate-circle" size={32} color="#0D9488" />
            <View style={styles.suggestionBannerTextCol}>
              <CText style={styles.suggestionBannerTitle}>Tìm quanh đây bạn có muốn không?</CText>
              <CText style={styles.suggestionBannerSub}>
                Có 3 bệnh viện & phòng khám đối tác (MCN) đang hoạt động gần bạn.
              </CText>
            </View>
          </View>
          <IconX type="ionicons" name="arrow-forward" size={18} color="#0D9488" />
        </TouchableOpacity>

        {/* Gợi ý 2: Gói dịch vụ phổ biến / Hot */}
        <View style={styles.suggestedSection}>
          <View style={styles.suggestedSectionHeader}>
            <IconX type="ionicons" name="flame" size={18} color="#EF4444" />
            <CText style={styles.suggestedSectionTitle}>Gợi ý dịch vụ phổ biến:</CText>
          </View>

          {POPULAR_SUGGESTED_SERVICES.map((srv, index) => (
            <TouchableOpacity
              key={String(srv.id || index)}
              style={styles.suggestedServiceCard}
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate(homeTabRoute.carelyServiceDetailScreen, {
                  service: srv,
                });
              }}
            >
              <ImageHelper
                source={{ uri: srv.thumbnail }}
                style={styles.suggestedServiceImg}
                resizeMode="cover"
              />
              <View style={styles.suggestedServiceContent}>
                <CText style={styles.suggestedServiceName} numberOfLines={1}>{srv.name}</CText>
                <CText style={styles.suggestedServiceNurse}>{srv.nurse_name} • {srv.mcn_name}</CText>
                <View style={styles.suggestedServiceBottom}>
                  <CText style={styles.suggestedServicePrice}>{formatMoneyVND(srv.price, '.')}</CText>
                  <View style={styles.suggestedServiceRating}>
                    <IconX type="ionicons" name="star" size={11} color="#F59E0B" />
                    <CText style={styles.suggestedServiceRatingScore}>{srv.rating}</CText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
        <CText style={styles.headerTitle}>Tìm kiếm & Khám phá</CText>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <IconX type="ionicons" name="search" size={20} color="#0D9488" />
          <TextInput
            placeholder={
              activeFlow === 'SERVICES'
                ? 'Tìm kiếm gói dịch vụ...'
                : activeFlow === 'DOCTORS'
                  ? 'Tìm theo tên bác sĩ, chuyên khoa...'
                  : 'Tìm bệnh viện, phòng khám MCN...'
            }
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
            style={[styles.locateBtn, userCoords && styles.locateBtnActive]}
            onPress={handleEnableLocationAndScan}
            disabled={isScanningNearby}
          >
            {isScanningNearby ? (
              <ActivityIndicator size="small" color="#0D9488" />
            ) : (
              <IconX
                type="ionicons"
                name={userCoords ? 'locate' : 'locate-outline'}
                size={18}
                color={userCoords ? '#0D9488' : '#64748B'}
              />
            )}
          </TouchableOpacity>
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
            <IconX type="ionicons" name="options-outline" size={18} color="#0D9488" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3 Luồng phân loại: Gói dịch vụ - Bác sĩ/ĐD - Gần tôi */}
      {renderFlowTabs()}

      {/* Prompt tìm quanh đây */}
      {renderNearbyPromptBanner()}

      {/* Nội dung theo từng luồng */}
      {activeFlow === 'SERVICES' && (
        <>
          {renderCategoryFilterTabs()}
          <FlatList
            data={listServices}
            keyExtractor={item => String(item.id || item._id)}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            renderItem={renderServiceCard}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#0D9488']} />
            }
            ListEmptyComponent={!loadingServices ? renderSmartEmptyState : undefined}
            ListFooterComponent={
              loadingServices && !refreshing ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator size="small" color="#0D9488" />
                </View>
              ) : undefined
            }
          />
        </>
      )}

      {activeFlow === 'DOCTORS' && (
        <FlatList
          data={filteredDoctors}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.doctorListContent}
          renderItem={renderDoctorItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#0D9488']} />
          }
          ListEmptyComponent={renderSmartEmptyState}
        />
      )}

      {activeFlow === 'NEARBY_MCN' && (
        <FlatList
          data={filteredHospitals}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.hospitalListContent}
          renderItem={renderHospitalMCNItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#0D9488']} />
          }
          ListEmptyComponent={renderSmartEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  rightPlaceholder: {
    width: 36,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  filterBtn: {
    padding: 4,
  },
  locateBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  locateBtnActive: {
    backgroundColor: '#CCFBF1',
  },
  flowTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  flowTabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    gap: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  flowTabItemActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0D9488',
  },
  flowTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  flowTabTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  nearbyPromptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  nearbyPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 10,
  },
  radarIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarIconWrapActive: {
    backgroundColor: '#A7F3D0',
  },
  nearbyPromptContent: {
    flex: 1,
  },
  nearbyPromptTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  nearbyPromptSub: {
    fontSize: 11,
    color: '#115E59',
    marginTop: 2,
    lineHeight: 15,
  },
  nearbyPromptBtn: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  nearbyPromptBtnActive: {
    backgroundColor: '#E2E8F0',
  },
  nearbyPromptBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nearbyPromptBtnTextActive: {
    color: '#0F172A',
  },
  filterTabsWrapper: {
    height: 52,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  filterTabsList: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  filterTabChip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabChipActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  filterTabText: {
    fontSize: 13,
    color: '#344054',
    fontWeight: '500',
    textAlign: 'center',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  columnWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImageWrapper: {
    width: '100%',
    height: 120,
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
    backgroundColor: '#EF4444',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  reviewCount: {
    fontSize: 10,
    color: '#94A3B8',
  },
  nurseName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D9488',
    marginTop: 6,
  },
  doctorListContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 12,
  },
  doctorCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  doctorHeader: {
    flexDirection: 'row',
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDFA',
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 12,
  },
  doctorNameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
    marginTop: 2,
  },
  doctorSpec: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  doctorMCNTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  doctorMCNText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0284C7',
  },
  doctorServicesList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  servicesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  doctorServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },
  doctorServiceInfo: {
    flex: 1,
    marginRight: 8,
  },
  doctorServiceName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  doctorServicePrice: {
    fontSize: 11,
    color: '#0D9488',
    marginTop: 2,
    fontWeight: '600',
  },
  doctorServiceBookBtn: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  doctorServiceBookText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hospitalListContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 14,
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  hospitalCover: {
    width: '100%',
    height: 110,
  },
  hospitalBody: {
    padding: 14,
  },
  hospitalTopRow: {
    flexDirection: 'row',
    marginTop: -28,
    alignItems: 'flex-end',
  },
  hospitalAvatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#F0FDFA',
  },
  hospitalAvatar: {
    width: '100%',
    height: '100%',
  },
  hospitalMainInfo: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 2,
    paddingVertical: 20,
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  hospitalTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  mcnTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mcnTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0369A1',
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  distanceTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0F766E',
  },
  hospitalAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  hospitalAddressText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  hospitalFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  hospitalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hospitalStatText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  viewDoctorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDoctorBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  emptyWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  suggestionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  suggestionBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  suggestionBannerTextCol: {
    flex: 1,
  },
  suggestionBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  suggestionBannerSub: {
    fontSize: 11,
    color: '#134E4A',
    marginTop: 2,
    lineHeight: 15,
  },
  suggestedSection: {
    marginTop: 20,
  },
  suggestedSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  suggestedSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  suggestedServiceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  suggestedServiceImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  suggestedServiceContent: {
    flex: 1,
    marginLeft: 10,
  },
  suggestedServiceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  suggestedServiceNurse: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  suggestedServiceBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  suggestedServicePrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  suggestedServiceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  suggestedServiceRatingScore: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default SearchService;
