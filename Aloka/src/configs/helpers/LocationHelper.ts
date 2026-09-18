import { Alert, Platform } from 'react-native';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export interface PermissionResult {
  isSuccess: boolean;
  msg?: string;
  status?: PermissionStatus;
}

/**
 * Lấy permission tương ứng cho từng nền tảng
 */
const getLocationPermissionKey = () => {
  return Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
};

/**
 * Hiển thị thông báo yêu cầu người dùng mở Cài đặt (Settings) của thiết bị để cấp quyền vị trí
 */
export const alertOpenSettingsForLocation = (customTitle?: string, customMessage?: string) => {
  Alert.alert(
    customTitle || 'Cho phép quyền Vị trí',
    customMessage ||
      'Aloka cần quyền truy cập vị trí để tìm các bệnh viện, phòng khám MCN và bác sĩ gần bạn nhất. Vui lòng bật quyền trong Cài đặt thiết bị.',
    [
      {
        text: 'Huỷ',
        style: 'cancel',
        onPress: () => console.log('Location permission request cancelled'),
      },
      {
        text: 'Mở Cài đặt',
        style: 'default',
        onPress: () => {
          openSettings().catch(() => {
            console.warn('Cannot open device settings');
          });
        },
      },
    ],
  );
};

/**
 * Kiểm tra trạng thái quyền vị trí hiện tại
 */
export const checkLocationPermission = async (): Promise<PermissionStatus> => {
  try {
    const permission = getLocationPermissionKey();
    const result = await check(permission);
    return result;
  } catch (error) {
    console.warn('checkLocationPermission error:', error);
    return RESULTS.UNAVAILABLE;
  }
};

/**
 * Xin quyền vị trí. Nếu bị Denied/Blocked thì hiển thị Alert dẫn tới Cài đặt (Settings)
 */
export const requestLocationPermission = async (showSettingsAlert = true): Promise<PermissionResult> => {
  try {
    const permission = getLocationPermissionKey();
    const currentStatus = await check(permission);

    if (currentStatus === RESULTS.GRANTED) {
      return { isSuccess: true, status: currentStatus };
    }

    if (currentStatus === RESULTS.DENIED) {
      const reqResult = await request(permission);
      if (reqResult === RESULTS.GRANTED) {
        return { isSuccess: true, status: reqResult };
      }
      if (showSettingsAlert) {
        alertOpenSettingsForLocation();
      }
      return { isSuccess: false, status: reqResult, msg: 'Người dùng từ chối quyền vị trí' };
    }

    if (currentStatus === RESULTS.BLOCKED || currentStatus === RESULTS.LIMITED) {
      if (showSettingsAlert) {
        alertOpenSettingsForLocation();
      }
      return { isSuccess: false, status: currentStatus, msg: 'Quyền vị trí đã bị chặn trong Cài đặt' };
    }

    if (currentStatus === RESULTS.UNAVAILABLE) {
      if (showSettingsAlert) {
        Alert.alert(
          'Dịch vụ Vị trí không khả dụng',
          'Vui lòng bật Định vị (GPS) trong Cài đặt thiết bị để tìm kiếm xung quanh.',
          [
            { text: 'Đóng', style: 'cancel' },
            {
              text: 'Mở Cài đặt',
              onPress: () => openSettings().catch(() => {}),
            },
          ],
        );
      }
      return { isSuccess: false, status: currentStatus, msg: 'Vị trí không khả dụng trên thiết bị' };
    }

    return { isSuccess: false, status: currentStatus };
  } catch (error: any) {
    console.warn('requestLocationPermission error:', error);
    return { isSuccess: false, msg: error?.message || 'Lỗi khi xin quyền vị trí' };
  }
};

/**
 * Lấy toạ độ vị trí hiện tại của thiết bị qua @react-native-community/geolocation
 */
export const getCurrentPositionAsync = (timeoutMs = 12000): Promise<UserCoordinates> => {
  return new Promise((resolve, reject) => {
    // Cấu hình Geolocation
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      enableBackgroundLocationUpdates: false,
    });

    // Thử lấy với enableHighAccuracy: true trước
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.warn('getCurrentPosition high accuracy failed, fallback to false:', error);
        // Fallback accuracy = false nếu GPS ngoài trời yếu hoặc chạy trên simulator
        Geolocation.getCurrentPosition(
          pos => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          err => {
            console.warn('getCurrentPosition fallback failed:', err);
            reject(err);
          },
          { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 60000 },
        );
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30000 },
    );
  });
};

/**
 * Tính khoảng cách (km) giữa 2 toạ độ GPS theo công thức Haversine
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Bán kính trái đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // làm tròn 1 chữ số thập phân, vd: 1.5
};

export { openSettings };
