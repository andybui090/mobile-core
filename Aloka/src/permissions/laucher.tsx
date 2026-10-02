import {PermissionStatus, RESULTS} from 'react-native-permissions';
import {
  checkCameraPermission,
  checkPermissionPhoto,
  checkPermissionPhotoVideo,
  checkVideoDownloadPermission,
  requestCameraPermission,
  requestDownloadPermission,
  requestPhotoPermission,
  requestPhotoVideoPermission,
} from './checkPermissions';
import {
  showCameraPermissionAlert,
  showDownloadPermissionAlert,
  showPhotoPermissionAlert,
  showPhotoVideoPermissionAlert,
} from './permissionAlert';
import {
  showCamera,
  showCameraChat,
  showPhotoLibrary,
  showPhotoLibraryChangBackground,
  showPhotoLibraryDropThumnail,
  showPhotoVideoComment,
  showPhotoVideoLibrary,
} from './picker';
import {MediaResult} from './types/mediaResult';
import {Platform} from 'react-native';

const handlePermissionAndLaunch = async (
  checkPermission: () => Promise<PermissionStatus>,
  requestPermission: () => Promise<PermissionStatus>,
  onGranted: () => Promise<MediaResult>,
  onBlockedAlert: () => void,
  unavailableMsg: string,
  deniedMsg: string,
  blockedMsg: string,
): Promise<MediaResult> => {
  const status = await checkPermission();
  switch (status) {
    case RESULTS.GRANTED:
    case RESULTS.LIMITED:
      return onGranted();
    case RESULTS.UNAVAILABLE:
      return {isSuccess: false, imgRes: null, msg: unavailableMsg};
    case RESULTS.DENIED: {
      const result = await requestPermission();
      // console.log('🚀 ~ result ========:', result);
      if (Platform.OS == 'android' && result !== RESULTS.GRANTED) {
        onBlockedAlert();
        return {isSuccess: false, imgRes: null, msg: blockedMsg};
      }
      return result === RESULTS.GRANTED
        ? onGranted()
        : {
            isSuccess: false,
            imgRes: null,
            msg: result == RESULTS.DENIED ? deniedMsg : blockedMsg,
          };
    }
    case RESULTS.BLOCKED:
      onBlockedAlert();
      return {isSuccess: false, imgRes: null, msg: blockedMsg};
    default:
      return {
        isSuccess: false,
        imgRes: null,
        msg: 'Unknown permission status',
      };
  }
};

// Avatar and Profile Picture Launchers
export const cameraSingleCropLauncher = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkCameraPermission,
    requestCameraPermission,
    showCamera,
    showCameraPermissionAlert,
    'Camera is not available on this device!',
    'Camera access denied!',
    'Camera access is blocked. Please enable it in settings.',
  );

export const photoSingleCropLauncher = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkPermissionPhoto,
    requestPhotoPermission,
    showPhotoLibrary,
    showPhotoPermissionAlert,
    'Photo or video access is not available on this device!',
    'Photo permission denied!',
    'Photo access is blocked. Please enable it in settings.',
  );

export const thumnailSingleCropLauncher = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkPermissionPhoto,
    requestPhotoPermission,
    showPhotoLibraryDropThumnail,
    showPhotoPermissionAlert,
    'Photo or video access is not available on this device!',
    'Photo permission denied!',
    'Photo access is blocked. Please enable it in settings.',
  );

// end of Avatar and Profile Picture Launchers
export const photoVideoMultipleLauncher = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkPermissionPhotoVideo,
    requestPhotoVideoPermission,
    showPhotoVideoLibrary,
    showPhotoVideoPermissionAlert,
    'Photo/Video access is not available on this device!',
    'Photo/Video permission denied!',
    'Photo/Video access is blocked. Please enable it in settings.',
  );

export const videoDownloadPermission = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkVideoDownloadPermission,
    requestDownloadPermission,
    async () => {
      return {isSuccess: true, imgRes: null, msg: ''};
    },
    showDownloadPermissionAlert,
    'Photo/Video access is not available on this device!',
    'Photo/Video permission denied!',
    'Photo/Video access is blocked. Please enable it in settings.',
  );

export const cameraChatLauncher = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkCameraPermission,
    requestCameraPermission,
    showCameraChat,
    showCameraPermissionAlert,
    'Camera is not available on this device!',
    'Camera access denied!',
    'Camera access is blocked. Please enable it in settings.',
  );

export const cameraPermission = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkCameraPermission,
    requestCameraPermission,
    async () => {
      return {isSuccess: true, imgRes: null, msg: ''};
    },
    showCameraPermissionAlert,
    'Camera is not available on this device!',
    'Camera access denied!',
    'Camera access is blocked. Please enable it in settings.',
  );

export const photoVideoSingleLauncher = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkPermissionPhotoVideo,
    requestPhotoVideoPermission,
    showPhotoVideoComment,
    showPhotoVideoPermissionAlert,
    'Photo/Video access is not available on this device!',
    'Photo/Video permission denied!',
    'Photo/Video access is blocked. Please enable it in settings.',
  );

export const photoChangBackgroundLauncher = async (): Promise<MediaResult> =>
  handlePermissionAndLaunch(
    checkPermissionPhoto,
    requestPhotoPermission,
    showPhotoLibraryChangBackground,
    showPhotoPermissionAlert,
    'Photo or video access is not available on this device!',
    'Photo permission denied!',
    'Photo access is blocked. Please enable it in settings.',
  );
