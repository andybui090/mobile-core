import { CHeader, CSearchBar, IconType, IconX, Wrapper } from '@/components';
import { screenStyles } from '@/configs';
import { PAGINATION } from '@/constants';
import { AppContext } from '@/contexts';
import { PermissionHelper } from '@/permissions';
import {
  getNearbyMedicalFacilities,
  MedicalFacility,
} from '@/services/osmService';
import { Container, CText, Row } from '@/utils';
import Geolocation from '@react-native-community/geolocation';
import { makeStyles, useTheme } from '@rneui/themed';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import GeolocationAndroid from 'react-native-geolocation-service';

const NearbyFacilitiesScreen: React.FC<any> = ({ navigation }: any) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { t } = useTranslation();

  const { currentLocation, setGlobalLocation }: any = useContext(AppContext);

  // STATE
  const [location, setLocation] = useState<{
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
  const [facilityType, setFacilityType] = useState<
    'all' | 'hospital' | 'clinic'
  >('all');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>('');
  const [queryInput, setQueryInput] = useState<string>('');

  const onEndReachedCalledDuringMomentum = useRef(true);

  const handleLocationError = useCallback((error: unknown) => {
    console.warn('[NearbyFacilities] Không lấy được vị trí:', error);
    setLoading(false);
    setRefreshing(false);
  }, []);

  const _handleCheckPermission = useCallback(async () => {
    try {
      const checkLocation = await PermissionHelper();
      if (checkLocation.isSuccess) {
        if (Platform.OS === 'ios') {
          Geolocation.getCurrentPosition(
            (pos: any) => {
              const objLocation = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                type: 'place',
              };
              setLocation(objLocation);
              setGlobalLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            },
            (error: any) => {
              handleLocationError(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
          );
        } else {
          Geolocation.getCurrentPosition(
            (pos: any) => {
              const objLocation = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                type: 'place',
              };
              setLocation(objLocation);
              setGlobalLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            },
            async (error: any) => {
              try {
                if (error.code && error.code === 2) {
                  const enableResult = await promptForEnableLocationIfNeeded();
                  if (enableResult === 'enabled') {
                    _handleCheckPermission();
                  } else {
                    handleLocationError(error);
                  }
                } else {
                  GeolocationAndroid.getCurrentPosition(
                    position => {
                      const objLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        type: 'place',
                      };
                      setLocation(objLocation);
                      setGlobalLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      });
                    },
                    handleLocationError,
                    {
                      enableHighAccuracy: false,
                      timeout: 15000,
                      maximumAge: 60000,
                    },
                  );
                }
              } catch (promptError) {
                handleLocationError(promptError);
              }
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
          );
        }
      } else {
        handleLocationError(checkLocation.msg);
      }
    } catch (permissionError) {
      handleLocationError(permissionError);
    }
  }, [handleLocationError, setGlobalLocation]);

  useEffect(() => {
    if (location != null) return;

    if (
      Number.isFinite(currentLocation?.latitude) &&
      Number.isFinite(currentLocation?.longitude)
    ) {
      setLocation({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        // type: 'place',
      });
    } else {
      _handleCheckPermission();
    }
  }, [currentLocation, location, _handleCheckPermission]);

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
        const excludeIds = isRefresh ? [] : existingItems.map(it => it.id);

        const newItems = await getNearbyMedicalFacilities({
          latitude: loc.latitude,
          longitude: loc.longitude,
          radiusKm: currentRadius,
          facilityType: filterType,
          limit: PAGINATION.ITEMS_15,
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

        setHasMore(newItems.length >= PAGINATION.ITEMS_15);
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
    if (!location) return;
    setLoading(true);
    fetchFacilities(location, 1, true);
  }, [location, fetchFacilities]);

  // Kéo xuống làm mới (Pull-to-refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    await _handleCheckPermission();
  };

  // Tải thêm (Load More)
  const handleLoadMore = () => {
    if (
      loadingMore ||
      loading ||
      !hasMore ||
      onEndReachedCalledDuringMomentum.current
    ) {
      return;
    }

    if (!location) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    fetchFacilities(
      location,
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
  };

  // Đổi bán kính
  const handleSelectRadius = (r: number) => {
    if (r === radiusKm) return;
    setRadiusKm(r);
  };

  // Tìm kiếm theo từ khoá
  const handleSearchSubmit = () => {
    const text = queryInput.trim();
    setSearchText(text);
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
  const renderItem = ({
    item,
    index,
  }: {
    item: MedicalFacility;
    index: number;
  }) => {
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
              {isHospital ? t('home.nearbyHospital') : t('home.nearbyClinic')}
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
            <CText h5 color={colors.c667085}>
              {item.address}
            </CText>
          </View>
        </Row>

        {/* Khoảng cách & Chỉ đường */}
        <Row
          between
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#F2F4F7',
          }}
        >
          <View style={{ flex: 1 }}>
            {item.roadDistanceKm != null ? (
              <Row start style={{ marginBottom: 2 }}>
                <CText w700 h5 color={colors.c101828}>
                  {`🚗 ${item.roadDistanceKm} km `}
                </CText>
                <CText h6 color={colors.c475467}>
                  {`(${t('nearby.driving', 'Xe chạy')})`}
                </CText>
              </Row>
            ) : null}
            <CText h6 color={colors.c475467}>
              {`📍 ${item.distanceKm} km (${t(
                'nearby.straightLine',
                'Đường thẳng',
              )})`}
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
            <CText w600 h6 color={colors.white}>
              {t('search.getDirections', 'Get directions')}
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
          {t('search.searchPlaceholder')}
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
        <CText h5 w600 color={colors.c101828} style={screenStyles.mT10}>
          {t('search.noHealthcareFound', 'Không tìm thấy cơ sở y tế nào')}
        </CText>
        <CText h5 center color={colors.c667085} style={screenStyles.mT10}>
          {t(
            'nearby.TryExpanding',
            'Hãy thử tăng bán kính tìm kiếm hoặc thay đổi từ khoá tìm kiếm',
          )}
        </CText>
        <Pressable
          style={styles.btnRetry}
          onPress={() => handleSelectRadius(radiusKm + 10)}
        >
          <CText color="#fff" w600>
            {`${t('search.expandSearch', 'Mở rộng bán kính lên')} ${
              radiusKm + 10
            } km`}
          </CText>
        </Pressable>
      </View>
    );
  };

  // RENDER

  const renderSearch = () => {
    return (
      <View style={styles.searchContainer}>
        <CSearchBar
          value={queryInput}
          placeholder={t(
            'search.searchByClinicName',
            'Tìm theo tên bệnh viện, phòng khám',
          )}
          onChangeText={setQueryInput}
          onClear={() => {
            setQueryInput('');
            setSearchText('');
          }}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
      </View>
    );
  };

  const renderChips = () => {
    return (
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {[
            { key: 'all', label: t('common.all') },
            { key: 'hospital', label: '🏥 ' + t('home.nearbyHospital') },
            { key: 'clinic', label: '🩺 ' + t('home.nearbyClinic') },
          ].map(tab => {
            const active = facilityType === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => handleSelectType(tab.key as any)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <CText h6 w500 color={active ? colors.white : colors.c475467}>
                  {tab.label}
                </CText>
              </Pressable>
            );
          })}
          <View style={styles.divider} />
          {[5, 10, 15, 25].map(r => {
            const active = radiusKm === r;
            return (
              <Pressable
                key={r}
                onPress={() => handleSelectRadius(r)}
                style={[styles.chipRadius, active && styles.chipRadiusActive]}
              >
                <CText w500 h6 color={active ? colors.primary : colors.c475467}>
                  {`${r} km`}
                </CText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderLocationGPS = () => {
    if (location) {
      return (
        <Row between style={styles.gpsBar}>
          <Row start style={{ flex: 1 }}>
            <IconX
              name="location"
              type={IconType.OCTICONS}
              size={14}
              color={colors.primary}
              style={{ marginRight: 5 }}
            />
            <CText h6 color={colors.c475467}>
              {`GPS: [${location.latitude.toFixed(
                4,
              )}, ${location.longitude.toFixed(4)}]`}
            </CText>
          </Row>
          <CText h6 color={colors.c98A2B3}>
            {`${facilities.length}`}
          </CText>
        </Row>
      );
    }
  };

  const renderContent = () => {
    return (
      <Container>
        {renderSearch()}
        {/* BỘ LỌC CHIPS */}
        {renderChips()}
        {/* THANH TOẠ ĐỘ GPS HIỆN TẠI */}
        {renderLocationGPS()}
        {/* DANH SÁCH CƠ SỞ Y TẾ */}
        {loading && facilities.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary || '#19A2A7'}
            />
            <CText h5 color={colors.c667085} style={screenStyles.mT10}>
              {t('search.searchPlaceholder')}
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
    );
  };

  return (
    <Wrapper>
      <CHeader
        title={t(
          'search.healthcareFacilities',
          'Healthcare Facilities Near You',
        )}
        isBorderBottom
        leftComponentOnPress={navigation.goBack}
      />
      {renderContent()}
    </Wrapper>
  );
};

const useStyles = makeStyles(() => ({
  searchContainer: {
    paddingHorizontal: 16,
    padding: 10,
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
    marginRight: 10,
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
    paddingHorizontal: 24,
    flex: 1,
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
