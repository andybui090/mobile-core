import { Platform } from 'react-native';
import {
  check,
  request,
  RESULTS,
  PERMISSIONS,
  PermissionStatus,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';

const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';
const isAndroid13OrAbove = isAndroid && Number(Platform.Version) >= 33;

// Define permissions
const CAMERA_PERMISSION = isIOS
  ? PERMISSIONS.IOS.CAMERA
  : PERMISSIONS.ANDROID.CAMERA;

const PHOTO_PERMISSION = isIOS
  ? PERMISSIONS.IOS.PHOTO_LIBRARY
  : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

const VIDEO_DOWNLOAD_PERMISSION = isIOS
  ? PERMISSIONS.IOS.PHOTO_LIBRARY
  : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

// --- CAMERA ---

export const checkCameraPermission = (): Promise<PermissionStatus> => {
  return check(CAMERA_PERMISSION);
};

export const requestCameraPermission = (): Promise<PermissionStatus> => {
  return request(CAMERA_PERMISSION);
};

// --- PHOTO ---
export const checkPermissionPhoto = async (): Promise<PermissionStatus> => {
  if (isAndroid13OrAbove) {
    const result = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    return result;
  }
  return check(PHOTO_PERMISSION);
};

export const requestPhotoPermission = async (): Promise<PermissionStatus> => {
  if (isAndroid13OrAbove) {
    const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES); 
    return result;
  }
  return request(PHOTO_PERMISSION);
};

// --- PHOTO/VIDEO ---
export const checkPermissionPhotoVideo = async (): Promise<PermissionStatus> => {
  if (isAndroid13OrAbove) {
    const result = await checkMultiple([
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
    ]);
    const isGranted =
      result[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] === RESULTS.GRANTED ||
      result[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === RESULTS.GRANTED;

    return isGranted ? RESULTS.GRANTED : RESULTS.DENIED;
  }

  return check(PHOTO_PERMISSION);
};

export const requestPhotoVideoPermission = async (): Promise<PermissionStatus> => {
  if (isAndroid13OrAbove) {
    const result = await requestMultiple([
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    ]);
    return result['android.permission.READ_MEDIA_IMAGES'] === RESULTS.GRANTED
      || result['android.permission.READ_MEDIA_VIDEO'] === RESULTS.GRANTED ? RESULTS.GRANTED : RESULTS.DENIED;
  }
  return request(PHOTO_PERMISSION);
};

// --- VIDEO DOWNLOAD ---
export const checkVideoDownloadPermission = async (): Promise<PermissionStatus> => {
  if (isAndroid13OrAbove) {
    const result = await check(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
    return result;
  }
  return check(VIDEO_DOWNLOAD_PERMISSION);
};

export const requestDownloadPermission = async (): Promise<PermissionStatus> => {
  if (isAndroid13OrAbove) {
    const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
    return result;
  }
  return request(VIDEO_DOWNLOAD_PERMISSION);
};