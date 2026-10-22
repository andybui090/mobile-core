import { CHeader, IconType, IconX, Wrapper } from '@/components';
import {
  getCurrentDeviceLocation,
  getNearbyMedicalFacilities,
  MedicalFacility,
} from '@/services/osmService';
import { Container, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

const PAGE_LIMIT = 15;

const NearbyFacilitiesScreen: React.FC<any> = ({ navigation }: any) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  // STATE
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  // FILTERS
  const [facilityType, setFacilityType] = useState<'all' | 'hospital' | 'clinic'>('all');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>('');
  const [queryInput, setQueryInput] = useState<string>('');

  const onEndReachedCalledDuringMomentum = useRef(true);

  // 1. Lấy toạ độ GPS khi vào màn hình
  const initLocation = useCallback(async () => {
    setLoading(true);
    try {
      const loc = await getCurrentDeviceLocation();
      setCurrentLocation(loc);
      return loc;
    } catch (err: any) {
      console.warn('Không lấy được GPS, dùng toạ độ mặc định:', err);
      const fallback = { latitude: 10.762622, longitude: 106.660172 };
      setCurrentLocation(fallback);
      return fallback;
    }
  }, []);

  // 2. Fetch danh sách từ OpenStreetMap
  const fetchFacilities = useCallback(
    async (
      loc: { latitude: number; longitude: number },
      targetPage: number,
      isRefresh: boolean = false,
      filterType: 'all' | 'hospital' | 'clinic' = facilityType,
      currentRadius: number = radiusKm,
      search: string = searchText,
      existingItems: MedicalFacility[] = [],
    ) => {
      try {
        const excludeIds = isRefresh
          ? []
          : existingItems.map(it => it.id);

        const newItems = await getNearbyMedicalFacilities({
          latitude: loc.latitude,
          longitude: loc.longitude,
          radiusKm: currentRadius,
          facilityType: filterType,
          limit: PAGE_LIMIT,
          page: targetPage,
          excludePlaceIds: excludeIds,
          searchQuery: search,
        });

        if (isRefresh || targetPage === 1) {
          setFacilities(newItems);
        } else {
          const existingIds = new Set(existingItems.map(it => `${it.id}`));
          const uniqueNew = newItems.filter(it => !existingIds.has(`${it.id}`));
          setFacilities(prev => [...prev, ...uniqueNew]);
        }

        setHasMore(newItems.length >= PAGE_LIMIT);
        setPage(targetPage);
      } catch (error) {
        console.error('Lỗi khi tải cơ sở y tế:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [facilityType, radiusKm, searchText],
  );

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const loc = await initLocation();
      if (isMounted && loc) {
        await fetchFacilities(loc, 1, true, facilityType, radiusKm, searchText, []);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Kéo xuống làm mới (Pull-to-refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    let loc = currentLocation;
    try {
      loc = await getCurrentDeviceLocation();
      setCurrentLocation(loc);
    } catch (_) {}

    if (loc) {
      await fetchFacilities(loc, 1, true, facilityType, radiusKm, searchText, []);
    } else {
      setRefreshing(false);
    }
  };

  // Tải thêm (Load More)
  const handleLoadMore = () => {
    if (loadingMore || loading || !hasMore || onEndReachedCalledDuringMomentum.current) {
      return;
    }

    if (!currentLocation) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    fetchFacilities(
      currentLocation,
      nextPage,
      false,
      facilityType,
      radiusKm,
      searchText,
      facilities,
    );
  };

  // Đổi loại (Tất cả / Bệnh viện / Phòng khám)
  const handleSelectType = (type: 'all' | 'hospital' | 'clinic') => {
    if (type === facilityType) return;
    setFacilityType(type);
    setLoading(true);
    if (currentLocation) {
      fetchFacilities(currentLocation, 1, true, type, radiusKm, searchText, []);
    }
  };

  // Đổi bán kính
  const handleSelectRadius = (r: number) => {
    if (r === radiusKm) return;
    setRadiusKm(r);
    setLoading(true);
    if (currentLocation) {
      fetchFacilities(currentLocation, 1, true, facilityType, r, searchText, []);
    }
  };

  // Tìm kiếm theo từ khoá
  const handleSearchSubmit = () => {
    const text = queryInput.trim();
    setSearchText(text);
    setLoading(true);
    if (currentLocation) {
      fetchFacilities(currentLocation, 1, true, facilityType, radiusKm, text, []);
    }
  };

  const handleClearSearch = () => {
    setQueryInput('');
    setSearchText('');
    setLoading(true);
    if (currentLocation) {
      fetchFacilities(currentLocation, 1, true, facilityType, radiusKm, '', []);
    }
  };

  // Mở ứng dụng Bản đồ chỉ đường
  const handleOpenMap = (item: MedicalFacility) => {
    const label = encodeURIComponent(item.name);
    const scheme = Platform.select({
      ios: `maps:0,0?q=${label}@${item.latitude},${item.longitude}`,
      android: `geo:0,0?q=${item.latitude},${item.longitude}(${label})`,
    });
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;

    Linking.canOpenURL(scheme || webUrl).then(supported => {
      if (supported && scheme) {
        Linking.openURL(scheme);
      } else {
        Linking.openURL(webUrl);
      }
    });
  };

  // RENDER ITEM
  const renderItem = ({ item, index }: { item: MedicalFacility; index: number }) => {
    const isHospital = item.type === 'hospital';

    return (
      <View style={styles.card}>
        <Row between style={{ alignItems: 'flex-start' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <CText h5 w600 color={colors.c101828} style={{ lineHeight: 22 }}>
              {`${index + 1}. ${item.name}`}
            </CText>
          </View>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: isHospital ? '#EBF5FF' : '#E6F9F5' },
            ]}
          >
            <CText
              w600
              style={{
                fontSize: 11,
                color: isHospital ? '#0066CC' : '#19A2A7',
              }}
            >
              {isHospital ? 'Bệnh viện' : 'Phòng khám'}
            </CText>
          </View>
        </Row>

        {/* Địa chỉ */}
        <Row start style={{ marginTop: 6, alignItems: 'flex-start' }}>
          <IconX
            name="location"
            type={IconType.OCTICONS}
            size={14}
            color={colors.c667085}
            style={{ marginTop: 3, marginRight: 5 }}
          />
          <View style={{ flex: 1 }}>
            <CText style={{ fontSize: 13, color: colors.c667085, lineHeight: 18 }}>
              {item.address}
            </CText>
          </View>
        </Row>

        {/* Khoảng cách & Chỉ đường */}
        <Row between style={{ marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F2F4F7' }}>
          <View style={{ flex: 1 }}>
            {item.roadDistanceKm != null ? (
              <Row start style={{ marginBottom: 2 }}>
                <CText w700 style={{ fontSize: 13, color: '#101828' }}>
                  {`🚗 ${item.roadDistanceKm} km `}
                </CText>
                <CText style={{ fontSize: 11, color: '#98A2B3' }}>
                  {`(xe chạy)`}
                </CText>
              </Row>
            ) : null}
            <CText style={{ fontSize: 12, color: '#475467' }}>
              {`📍 ${item.distanceKm} km (đường thẳng)`}
            </CText>
          </View>

          <Pressable
            style={styles.btnDirection}
            onPress={() => handleOpenMap(item)}
          >
            <IconX
              name="navigate"
              type={IconType.IONICONS}
              size={12}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <CText w600 style={{ color: '#fff', fontSize: 12 }}>
              Chỉ đường
            </CText>
          </Pressable>
        </Row>
      </View>
    );
  };

  // FOOTER LOAD MORE SPINNER
  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 24 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary || '#19A2A7'} />
        <CText style={{ marginLeft: 8, fontSize: 13, color: colors.c667085 }}>
          Đang tải thêm cơ sở y tế...
        </CText>
      </View>
    );
  };

  // EMPTY LIST
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <IconX
          name="medkit"
          type={IconType.IONICONS}
          size={48}
          color="#D0D5DD"
        />
        <CText h5 w600 color={colors.c101828} style={{ marginTop: 12 }}>
          Không tìm thấy cơ sở y tế nào
        </CText>
        <CText style={{ color: colors.c667085, textAlign: 'center', marginTop: 4, paddingHorizontal: 30 }}>
          Hãy thử tăng bán kính tìm kiếm hoặc thay đổi từ khoá tìm kiếm.
        </CText>
        <Pressable
          style={styles.btnRetry}
          onPress={() => handleSelectRadius(radiusKm + 10)}
        >
          <CText color="#fff" w600>
            {`Mở rộng bán kính lên ${radiusKm + 10} km`}
          </CText>
        </Pressable>
      </View>
    );
  };

  return (
    <Wrapper>
      <CHeader
        title="Cơ sở y tế gần bạn"
        isBorderBottom
        leftComponentOnPress={navigation.goBack}
      />

      <Container style={{ backgroundColor: '#F8F9FA' }}>
        {/* THANH TÌM KIẾM */}
        <View style={styles.searchContainer}>
          <Row style={styles.searchBar}>
            <IconX
              name="search"
              type={IconType.OCTICONS}
              size={16}
              color={colors.c667085}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên bệnh viện, phòng khám..."
              placeholderTextColor={colors.c98A2B3}
              value={queryInput}
              onChangeText={setQueryInput}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {queryInput.length > 0 && (
              <Pressable onPress={handleClearSearch} style={{ padding: 4 }}>
                <IconX
                  name="close-circle"
                  type={IconType.IONICONS}
                  size={16}
                  color={colors.c98A2B3}
                />
              </Pressable>
            )}
          </Row>
        </View>

        {/* BỘ LỌC CHIPS */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'hospital', label: '🏥 Bệnh viện' },
              { key: 'clinic', label: '🩺 Phòng khám' },
            ].map(tab => {
              const active = facilityType === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => handleSelectType(tab.key as any)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <CText
                    w500={!active}
                    w600={active}
                    style={{
                      fontSize: 12,
                      color: active ? '#fff' : '#475467',
                    }}
                  >
                    {tab.label}
                  </CText>
                </Pressable>
              );
            })}

            <View style={styles.divider} />

            {/* Lọc Bán kính */}
            {[5, 10, 15, 25].map(r => {
              const active = radiusKm === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => handleSelectRadius(r)}
                  style={[styles.chipRadius, active && styles.chipRadiusActive]}
                >
                  <CText
                    w500={!active}
                    w600={active}
                    style={{
                      fontSize: 11,
                      color: active ? '#19A2A7' : '#475467',
                    }}
                  >
                    {`${r} km`}
                  </CText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* THANH TOẠ ĐỘ GPS HIỆN TẠI */}
        {currentLocation && (
          <Row between style={styles.gpsBar}>
            <Row start style={{ flex: 1 }}>
              <IconX
                name="location"
                type={IconType.OCTICONS}
                size={14}
                color="#19A2A7"
                style={{ marginRight: 5 }}
              />
              <CText style={{ fontSize: 11, color: '#475467' }}>
                {`GPS: [${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}]`}
              </CText>
            </Row>
            <CText style={{ fontSize: 11, color: '#98A2B3' }}>
              {`${facilities.length} kết quả`}
            </CText>
          </Row>
        )}

        {/* DANH SÁCH CƠ SỞ Y TẾ */}
        {loading && facilities.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary || '#19A2A7'} />
            <CText style={{ marginTop: 12, color: colors.c667085, fontSize: 14 }}>
              Đang tìm kiếm cơ sở y tế gần bạn...
            </CText>
          </View>
        ) : (
          <FlatList
            data={facilities}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary || '#19A2A7']}
                tintColor={colors.primary || '#19A2A7'}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
          />
        )}
      </Container>
    </Wrapper>
  );
};

const useStyles = makeStyles(() => ({
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#fff',
  },
  searchBar: {
    backgroundColor: '#F2F4F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    alignItems: 'center' as const,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 13,
    color: '#101828',
    paddingVertical: 0,
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  chipsRow: {
    paddingHorizontal: 16,
    alignItems: 'center' as const,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F2F4F7',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#19A2A7',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#D0D5DD',
    marginHorizontal: 4,
  },
  chipRadius: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#fff',
    marginRight: 6,
  },
  chipRadiusActive: {
    borderColor: '#19A2A7',
    backgroundColor: '#E6F9F5',
  },
  gpsBar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAECF0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  btnDirection: {
    backgroundColor: '#19A2A7',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  footerLoader: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingBottom: 60,
  },
  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 60,
  },
  btnRetry: {
    marginTop: 16,
    backgroundColor: '#19A2A7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
}));

export default NearbyFacilitiesScreen;
