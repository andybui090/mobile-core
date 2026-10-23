import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import GeolocationAndroid from 'react-native-geolocation-service';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { PermissionHelper } from '@/permissions';

export interface MedicalFacility {
  id: string | number;
  name: string;
  type: 'hospital' | 'clinic' | 'other';
  address: string;
  latitude: number;
  longitude: number;
  distanceKm?: number; // Khoảng cách đường chim bay
  roadDistanceKm?: number; // Quãng đường xe chạy thực tế
  road?: string;
  suburb?: string;
  city?: string;
}

export interface GetNearbyFacilitiesParams {
  latitude: number;
  longitude: number;
  radiusKm?: number; // Bán kính tìm kiếm (mặc định 10km)
  facilityType?: 'hospital' | 'clinic' | 'all'; // 'hospital' | 'clinic' | 'all' (mặc định 'all')
  limit?: number; // Số lượng kết quả tối đa mỗi trang (mặc định 15)
  page?: number; // Trang hiện tại (1, 2, 3...)
  excludePlaceIds?: (string | number)[];
  searchQuery?: string; // Tìm kiếm theo tên / từ khoá
}

/**
 * Lấy toạ độ GPS thực tế của điện thoại (tự động xin quyền Permission)
 */
export const getCurrentDeviceLocation = async (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  const perm = await PermissionHelper();
  if (!perm.isSuccess) {
    throw new Error(perm.msg || 'Chưa cấp quyền truy cập vị trí (GPS)');
  }

  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        (pos: any) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (error: any) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
      );
    } else {
      Geolocation.getCurrentPosition(
        (pos: any) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        async (error: any) => {
          if (error?.code === 2) {
            try {
              const enableResult = await promptForEnableLocationIfNeeded();
              if (enableResult === 'enabled') {
                GeolocationAndroid.getCurrentPosition(
                  (pos: any) => {
                    resolve({
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                    });
                  },
                  (err: any) => reject(err),
                  { enableHighAccuracy: false, timeout: 15000 },
                );
                return;
              }
            } catch (_) {}
          }
          GeolocationAndroid.getCurrentPosition(
            (pos: any) => {
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            },
            (err: any) => reject(err),
            { enableHighAccuracy: false, timeout: 15000 },
          );
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
      );
    }
  });
};

/**
 * Tính khoảng cách giữa 2 toạ độ theo công thức Haversine (km)
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

/**
 * Gọi API Nominatim OpenStreetMap để lấy địa điểm theo query và bounding box
 */
const fetchNominatim = async (
  query: string,
  minLng: number,
  maxLat: number,
  maxLng: number,
  minLat: number,
  limit: number,
  page: number = 1,
  excludePlaceIds?: (string | number)[],
): Promise<any[]> => {
  let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query,
  )}&format=json&limit=${limit}&page=${page}&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=1&addressdetails=1`;

  if (excludePlaceIds && excludePlaceIds.length > 0) {
    url += `&exclude_place_ids=${excludePlaceIds.slice(0, 50).join(',')}`;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'AlokaApp/1.0 (contact@doctornetwork.us)',
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`fetchNominatim error [${query}]:`, error);
    return [];
  }
};

/**
 * Lấy quãng đường di chuyển đường bộ thực tế qua OSRM (km)
 */
export const getDrivingDistanceKm = async (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): Promise<number | null> => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`,
      { signal: controller.signal },
    );
    clearTimeout(timer);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]?.distance) {
      return Number((data.routes[0].distance / 1000).toFixed(2));
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Lấy danh sách bệnh viện, phòng khám gần toạ độ hiện tại
 */
export const getNearbyMedicalFacilities = async ({
  latitude,
  longitude,
  radiusKm = 10,
  facilityType = 'all',
  limit = 15,
  page = 1,
  excludePlaceIds,
  searchQuery,
}: GetNearbyFacilitiesParams): Promise<MedicalFacility[]> => {
  if (!latitude || !longitude) {
    return [];
  }

  // 1 độ vĩ độ ~ 111 km
  const delta = radiusKm / 111;
  const minLng = longitude - delta;
  const maxLng = longitude + delta;
  const minLat = latitude - delta;
  const maxLat = latitude + delta;

  let rawResults: any[] = [];
  const querySuffix =
    searchQuery && searchQuery.trim() !== '' ? ` ${searchQuery.trim()}` : '';

  if (facilityType === 'hospital') {
    rawResults = await fetchNominatim(
      `hospital${querySuffix}`,
      minLng,
      maxLat,
      maxLng,
      minLat,
      limit,
      page,
      excludePlaceIds,
    );
  } else if (facilityType === 'clinic') {
    rawResults = await fetchNominatim(
      `clinic${querySuffix}`,
      minLng,
      maxLat,
      maxLng,
      minLat,
      limit,
      page,
      excludePlaceIds,
    );
  } else {
    if (querySuffix) {
      rawResults = await fetchNominatim(
        querySuffix.trim(),
        minLng,
        maxLat,
        maxLng,
        minLat,
        limit,
        page,
        excludePlaceIds,
      );
    } else {
      const halfLimit = Math.ceil(limit / 2);
      const [hospitals, clinics] = await Promise.all([
        fetchNominatim(
          'hospital',
          minLng,
          maxLat,
          maxLng,
          minLat,
          halfLimit,
          page,
          excludePlaceIds,
        ),
        fetchNominatim(
          'clinic',
          minLng,
          maxLat,
          maxLng,
          minLat,
          halfLimit,
          page,
          excludePlaceIds,
        ),
      ]);
      rawResults = [...hospitals, ...clinics];
    }
  }

  // Loại bỏ các địa điểm trùng ID
  const mapUnique = new Map<string, any>();
  for (const item of rawResults) {
    const key = `${item.place_id || item.osm_id}`;
    if (!mapUnique.has(key)) {
      mapUnique.set(key, item);
    }
  }

  const facilities: MedicalFacility[] = Array.from(mapUnique.values())
    .map((item: any) => {
      const itemLat = parseFloat(item.lat);
      const itemLng = parseFloat(item.lon);
      const distanceKm = calculateDistanceKm(
        latitude,
        longitude,
        itemLat,
        itemLng,
      );

      // Tên ưu tiên name hoặc tên trong address
      let name = item.name;
      if (!name || name.trim() === '') {
        name =
          item.address?.amenity ||
          item.display_name?.split(',')?.[0] ||
          'Cơ sở y tế';
      }

      const type: 'hospital' | 'clinic' | 'other' =
        item.type === 'hospital'
          ? 'hospital'
          : item.type === 'clinic'
          ? 'clinic'
          : 'other';

      return {
        id: item.place_id || item.osm_id,
        name: name.trim(),
        type,
        address: item.display_name,
        latitude: itemLat,
        longitude: itemLng,
        distanceKm,
        road: item.address?.road,
        suburb: item.address?.suburb,
        city: item.address?.city,
      };
    })
    // Sắp xếp địa điểm gần nhất lên đầu theo đường chim bay
    .sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
    .slice(0, limit);

  // Tính quãng đường xe chạy thực tế cho top 5 kết quả
  await Promise.all(
    facilities.slice(0, 5).map(async fac => {
      const roadKm = await getDrivingDistanceKm(
        latitude,
        longitude,
        fac.latitude,
        fac.longitude,
      );
      if (roadKm != null) {
        fac.roadDistanceKm = roadKm;
      }
    }),
  );

  return facilities;
};

export default {
  getCurrentDeviceLocation,
  getNearbyMedicalFacilities,
  calculateDistanceKm,
  getDrivingDistanceKm,
};
