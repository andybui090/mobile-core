import { Alert, Platform } from 'react-native';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';

export interface CameraPermissionResult {
  isSuccess: boolean;
  msg?: string;
  status?: PermissionStatus;
}

/**
 * Lấy permission camera theo từng nền tảng
 */
const getCameraPermissionKey = () => {
  return Platform.OS === 'ios'
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;
};

/**
 * Hiển thị dialog hướng dẫn người dùng mở Cài đặt (Settings) khi quyền bị chặn
 */
export const alertOpenSettingsForCamera = (
  customTitle?: string,
  customMessage?: string
) => {
  Alert.alert(
    customTitle || 'Cần quyền truy cập Camera',
    customMessage ||
      'Aloka cần quyền truy cập Camera để quét mã QR và hỗ trợ các tính năng trong ứng dụng. Vui lòng bật quyền Camera trong Cài đặt thiết bị.',
    [
      {
        text: 'Huỷ',
        style: 'cancel',
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
    ]
  );
};

/**
 * Kiểm tra trạng thái quyền Camera hiện tại
 */
export const checkCameraPermission = async (): Promise<PermissionStatus> => {
  try {
    const permission = getCameraPermissionKey();
    const result = await check(permission);
    return result;
  } catch (error) {
    console.warn('checkCameraPermission error:', error);
    return RESULTS.UNAVAILABLE;
  }
};

/**
 * Yêu cầu cấp quyền Camera. Nếu bị từ chối hoặc chặn, hiển thị popup dẫn tới Settings.
 */
export const requestCameraPermission = async (
  showSettingsAlert = true
): Promise<CameraPermissionResult> => {
  try {
    const permission = getCameraPermissionKey();
    const currentStatus = await check(permission);

    if (currentStatus === RESULTS.GRANTED || currentStatus === RESULTS.LIMITED) {
      return { isSuccess: true, status: currentStatus };
    }

    if (currentStatus === RESULTS.DENIED) {
      const reqResult = await request(permission);
      if (reqResult === RESULTS.GRANTED || reqResult === RESULTS.LIMITED) {
        return { isSuccess: true, status: reqResult };
      }
      if (showSettingsAlert) {
        alertOpenSettingsForCamera();
      }
      return {
        isSuccess: false,
        status: reqResult,
        msg: 'Quyền truy cập Camera bị từ chối',
      };
    }

    if (currentStatus === RESULTS.BLOCKED) {
      if (showSettingsAlert) {
        alertOpenSettingsForCamera();
      }
      return {
        isSuccess: false,
        status: currentStatus,
        msg: 'Quyền truy cập Camera đã bị tắt trong Cài đặt',
      };
    }

    if (currentStatus === RESULTS.UNAVAILABLE) {
      return {
        isSuccess: false,
        status: currentStatus,
        msg: 'Camera không khả dụng trên thiết bị này',
      };
    }

    return { isSuccess: false, status: currentStatus };
  } catch (error) {
    console.warn('requestCameraPermission error:', error);
    return {
      isSuccess: false,
      msg: 'Lỗi khi kiểm tra quyền Camera',
    };
  }
};

/**
 * Yêu cầu quyền lưu ảnh vào Thư viện ảnh (Camera Roll)
 */
export const requestPhotoLibrarySavePermission = async (
  showSettingsAlert = true
): Promise<CameraPermissionResult> => {
  try {
    if (Platform.OS === 'ios') {
      const permission = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
      const currentStatus = await check(permission);
      if (
        currentStatus === RESULTS.GRANTED ||
        currentStatus === RESULTS.LIMITED
      ) {
        return { isSuccess: true, status: currentStatus };
      }
      if (currentStatus === RESULTS.DENIED) {
        const reqResult = await request(permission);
        if (
          reqResult === RESULTS.GRANTED ||
          reqResult === RESULTS.LIMITED
        ) {
          return { isSuccess: true, status: reqResult };
        }
        if (showSettingsAlert) {
          Alert.alert(
            'Cần quyền truy cập Thư viện ảnh',
            'Aloka cần quyền lưu ảnh vào thư viện thiết bị. Vui lòng bật quyền trong Cài đặt.',
            [
              { text: 'Huỷ', style: 'cancel' },
              {
                text: 'Mở Cài đặt',
                onPress: () => openSettings().catch(() => {}),
              },
            ]
          );
        }
        return {
          isSuccess: false,
          status: reqResult,
          msg: 'Quyền truy cập Thư viện ảnh bị từ chối',
        };
      }
      if (currentStatus === RESULTS.BLOCKED) {
        if (showSettingsAlert) {
          Alert.alert(
            'Cần quyền truy cập Thư viện ảnh',
            'Aloka cần quyền lưu ảnh vào thư viện thiết bị. Vui lòng bật quyền trong Cài đặt.',
            [
              { text: 'Huỷ', style: 'cancel' },
              {
                text: 'Mở Cài đặt',
                onPress: () => openSettings().catch(() => {}),
              },
            ]
          );
        }
        return {
          isSuccess: false,
          status: currentStatus,
          msg: 'Quyền truy cập Thư viện ảnh đã bị tắt trong Cài đặt',
        };
      }
      return { isSuccess: false, status: currentStatus };
    } else {
      // Android
      const androidVersion = Number(Platform.Version);
      if (androidVersion >= 29) {
        // Android 10+ (API 29+) uses MediaStore, doesn't require WRITE_EXTERNAL_STORAGE
        return { isSuccess: true, status: RESULTS.GRANTED };
      }
      const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      const currentStatus = await check(permission);
      if (currentStatus === RESULTS.GRANTED) {
        return { isSuccess: true, status: currentStatus };
      }
      const reqResult = await request(permission);
      return {
        isSuccess: reqResult === RESULTS.GRANTED,
        status: reqResult,
        msg:
          reqResult === RESULTS.GRANTED
            ? ''
            : 'Quyền lưu vào bộ nhớ bị từ chối',
      };
    }
  } catch (error) {
    console.warn('requestPhotoLibrarySavePermission error:', error);
    return { isSuccess: false, msg: 'Lỗi khi kiểm tra quyền lưu ảnh' };
  }
};

