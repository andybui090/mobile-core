import {ScreenHeight, screenStyles} from '@/configs';
import {AppContext} from '@/contexts';
import {CText, Row} from '@/utils';
import {makeStyles, useTheme} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, Pressable, ScrollView, View} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import Geolocation from '@react-native-community/geolocation';
import {PermissionHelper} from '@/permissions';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import GeolocationAndroid from 'react-native-geolocation-service';

// ---- TYPES ----
type SortBy = 'distance' | 'popular' | 'newest' | 'price_asc' | 'price_desc';

const FilterDropdownV2 = ({onApply, onClose, filters}: any) => {
  const {
    theme: {colors},
  } = useTheme();
  const {t} = useTranslation();
  const styles = useStyles();

  const {currentLocation, setGlobalLocation}: any = useContext(AppContext);

  // ❗ mặc định = null (không chọn gì)
  const [sortBy, setSortBy] = useState<SortBy | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    if (filters) {
      setSortBy(filters.sortBy || null);
      setRating(filters.rating || null);
    } else {
      setSortBy(null);
      setRating(null);
    }
  }, [filters]);

  useEffect(() => {
    const checkGlobalLocation = () => {
      if (currentLocation.latitude) {
        const objLocation = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          type: 'place',
        };
        setLocation(objLocation);
      }
    };
    if (location == null) {
      checkGlobalLocation();
    }
  }, [currentLocation]);

  const _handleCheckPermission = async () => {
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
          (error: any) => {},
          {enableHighAccuracy: true},
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
            if (error.code && error.code === 2) {
              const enableResult = await promptForEnableLocationIfNeeded();
              if (enableResult == 'enabled') {
                _handleCheckPermission();
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
                error => {},
                {enableHighAccuracy: false},
              );
            }
          },
          {enableHighAccuracy: false},
        );
      }
    }
  };
  // ---- HANDLERS ----
  const handleApply = () => {
    // # Distance sort
    // GET /packages?sort_by=distance&lat=10.762622&lng=106.660172
    // # Popular
    // GET /packages?sort_by=popular
    // # Price
    // GET /packages?sort_by=price_asc
    // GET /packages?sort_by=price_desc
    // # Newest
    // GET /packages?sort_by=newest
    // # Rating filter
    // GET /packages?rating=5
    // GET /packages?rating=4
    // # Kết hợp
    // GET /packages?sort_by=distance&lat=10.762622&lng=106.660172&rating=4
    const params: any = {};

    if (sortBy) {
      params.sortBy = sortBy;

      if (sortBy === 'distance' && location?.latitude && location?.longitude) {
        // console.log('Location for distance sorting:', location);
        params.lat = location.latitude;
        params.lng = location.longitude;
      }
    }

    if (rating) {
      params.rating = rating;
    }

    // 👉 bạn gắn API ở đây
    onApply(params);
  };

  const handleReset = () => {
    setSortBy(null);
    setRating(null);
  };

  // ---- UI ----
  const Chip = ({label, active, onPress}: any) => (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.chip,
        active && styles.chipActive,
        pressed && {opacity: 0.7},
      ]}>
      <CText h5 w400 color={active ? colors.c19A2A7 : colors.c667085}>
        {label}
      </CText>
    </Pressable>
  );

  const renderSection = (title: string, content: React.ReactNode) => (
    <View>
      <CText h5 w500 color={colors.c101828}>
        {title}
      </CText>
      {content}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.content}
          contentContainerStyle={screenStyles.pB12}>
          {/* LOCATION */}
          {renderSection(
            t('carely.location', 'Location'),
            <Row start style={screenStyles.mT10}>
              <Chip
                label={t('carely.locationNear', 'Nearest')}
                active={sortBy === 'distance'}
                onPress={() => {
                  if (!location) {
                    _handleCheckPermission();
                    return;
                  }
                  setSortBy('distance');
                }}
              />
            </Row>,
          )}

          <View style={screenStyles.mT15} />

          {/* SORT */}
          {renderSection(
            t('carely.popular', 'Popular'),
            <Row style={[screenStyles.mT10, {gap: 12}]}>
              <Chip
                label={t('carely.mostBooked', 'Most booked')}
                active={sortBy === 'popular'}
                onPress={() => setSortBy('popular')}
              />
              <Chip
                label={t('carely.newest', 'Newest')}
                active={sortBy === 'newest'}
                onPress={() => setSortBy('newest')}
              />
            </Row>,
          )}

          <View style={screenStyles.mT15} />

          {/* PRICE */}
          {renderSection(
            t('carely.priceRange', 'Price range'),
            <Row style={[screenStyles.mT10, {gap: 12}]}>
              <Chip
                label={t('carely.priceLowToHigh', 'Low to High')}
                active={sortBy === 'price_asc'}
                onPress={() => setSortBy('price_asc')}
              />
              <Chip
                label={t('carely.priceHighToLow', 'High to Low')}
                active={sortBy === 'price_desc'}
                onPress={() => setSortBy('price_desc')}
              />
            </Row>,
          )}

          <View style={screenStyles.mT15} />

          {/* RATING */}
          {renderSection(
            t('carely.rating', 'Rating'),
            <Row start style={[screenStyles.mT10, {gap: 12, flexWrap: 'wrap'}]}>
              {[5, 4, 3, 2, 1].map(r => (
                <Pressable
                  key={r}
                  onPress={() => setRating(r)}
                  style={({pressed}) => [
                    styles.chip,
                    rating === r && styles.chipActive,
                    pressed && {opacity: 0.7},
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CText
                      h5
                      w400
                      style={{marginLeft: 6}}
                      color={rating === r ? colors.c19A2A7 : colors.c667085}>
                      {r}
                    </CText>

                    <StarRating
                      rating={1}
                      maxStars={1}
                      enableSwiping={false}
                      onChange={() => {}}
                      starSize={14}
                      color={'#FDB022'}
                      emptyColor={'#EAECF0'}
                    />
                  </View>
                </Pressable>
              ))}
            </Row>,
          )}
        </ScrollView>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable style={styles.resetBtn} onPress={handleReset}>
          <CText h5 w500 color={colors.c19A2A7}>
            {t('carely.resetFilter', 'Reset filters')}
          </CText>
        </Pressable>

        <Pressable style={styles.applyBtn} onPress={handleApply}>
          <CText h5 w500 color={colors.white}>
            {t('common.apply', 'Apply')}
          </CText>
        </Pressable>
      </View>
    </View>
  );
};

const useStyles = makeStyles(({colors}) => ({
  wrapper: {
    flex: 1,
    overflow: 'hidden' as const,
  },
  body: {
    flex: 1,
    maxHeight: ScreenHeight * 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  chip: {
    width: '48%' as const,
    height: 36,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 6,
    backgroundColor: '#F2F4F7',
  },
  chipActive: {
    borderWidth: 1,
    borderColor: colors.c19A2A7,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row' as const,
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    gap: 16,
    backgroundColor: colors.white,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center' as const,
    borderColor: colors.c19A2A7,
    justifyContent: 'center' as const,
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: colors.c19A2A7,
    alignItems: 'center' as const,
  },
}));

export default FilterDropdownV2;
