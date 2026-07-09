import { isIOS } from '@/configs';
import { useTranslation } from 'react-i18next';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
// 

export const checkPermissionMicrophone = async () => {
  return check(Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO)
    .then(result => {
      return result;
    })
    .catch(error => {
      return error;
    });
};

export const checkPermissionCamera = async () => {
  return check(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
    .then(result => {
      return result;
    })
    .catch(error => {
      return error;
    });
};

// export const checkPermissionPhoto = async () => {
//   return check(Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
//     .then(result => {
//       return result;
//     })
//     .catch(error => {
//       return error;
//     });
// };

export const checkPermissionPhoto = async () => {
  try {
    if (Platform.OS === 'ios') {
      return await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    }

    // ANDROID
     const version = Number(Platform.Version);
    if (version >= 33) {
      // Android 13+
      return await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    } else {
      // Android < 13
      return await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }
  } catch (error) {
    return error;
  }
};

export const checkPermissionLocation = async () => {
  return check(Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    .then(result => {
      return result;
    })
    .catch(error => {
      return error;
    });
};

export const checkPermissionFileAndroid = async () => {
  return check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
    .then(result => {
      return result;
    })
    .catch(error => {
      return error;
    });
};

export function alertForLocationPermission() {
  const { t } = useTranslation();
  Alert.alert(`${t('locationPermission.title')}`, `${t('locationPermission.description')}`, [
    {
      text: 'Allow While Using App',
      onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
      style: 'default',
    },
    {
      text: 'Always Allow',
      onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
      style: 'default',
    },
    {
      text: "Don't Allow",
      onPress: () => console.log('Permission denied'),
      style: 'destructive',
    },
  ]);
}

export function alertForCameraPermission() {
  Alert.alert(
    'Allow us to access the Camera on this device?',
    'This permission gives you a better app experience.',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Permission denied'),
        style: 'destructive',
      },
      {
        text: 'OK',
        onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
        style: 'default',
      },
    ],
  );
}

export function alertForAllPermission() {
  Alert.alert(
    'Cần quyền truy cập',
    'Ứng dụng cần quyền Camera và Micro để tham gia cuộc gọi. Vui lòng bật trong Cài đặt.',
    [
      {
        text: 'Huỷ',
        onPress: () => console.log('Permission denied'),
        style: 'destructive',
      },
      {
        text: 'Đồng ý',
        onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
        style: 'default',
      },
    ],
  );
}

export function alertForPhotoPermission() {
  Alert.alert(
    'Allow us to access the Photo/Video Library on this device?',
    'This permission gives you a better app experience.',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Permission denied'),
        style: 'destructive',
      },
      {
        text: 'OK',
        onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
        style: 'default',
      },
    ],
  );
}

//contact
export function alertForContactPermission() {
  Alert.alert('Cho phép chúng tôi truy cập Danh bạ điện thoại của bạn trên thiết bị này?', 'Điều này cho phép bạn xem những người bạn của mình trên Doctor Network', [
    {
      text: 'Bỏ qua',
      onPress: () => console.log('Permission denied'),
      style: 'destructive',
    },
    {
      text: 'Đồng ý',
      onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
      style: 'default',
    },
  ]);
}

//////// mic
export function alertForMicrophonePermission() {
  Alert.alert(
    'Allow us to access the Microphone on this device?',
    'This permission gives you a better app experience.',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Permission denied'),
        style: 'destructive',
      },
      {
        text: 'OK',
        onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
        style: 'default',
      },
    ],
  );
}

export function alertForFileAndroidPermission() {
  Alert.alert('Allow us to access files on this device?',
    'This permission gives you a better app experience.', [
    {
      text: 'Cancel',
      onPress: () => console.log('Permission denied'),
      style: 'destructive',
    },
    {
      text: 'OK',
      onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
      style: 'default',
    },
  ]);
}

const checkAndRequestPermission = async (permissionIOS: any, permissionAndroid: any, alertBlocked: () => void, name: string) => {
  const result = await check(isIOS ? permissionIOS : permissionAndroid);

  switch (result) {
    case RESULTS.GRANTED:
      return { isSuccess: true, msg: "success" };
    case RESULTS.DENIED:
      const req = await request(isIOS ? permissionIOS : permissionAndroid);
      return req === RESULTS.GRANTED
        ? { isSuccess: true, msg: "success" }
        : { isSuccess: false, msg: `${name} access denied!` };
    case RESULTS.BLOCKED:
      alertBlocked();
      return { isSuccess: false, msg: `${name} permission blocked!` };
    case RESULTS.UNAVAILABLE:
      return { isSuccess: false, msg: `${name} is not available on this device!` };
    default:
      return { isSuccess: false, msg: `${name} unknown error!` };
  }
};

export function alertForMicrophonePermission1(onCancelPress?: () => void) {
  Alert.alert(
    'Allow us to access the Microphone on this device?',
    'This permission gives you a better app experience.',
    [
      {
        text: 'Cancel',
        onPress: onCancelPress ? onCancelPress : () => console.log('Permission denied'),
        style: 'destructive',
      },
      {
        text: 'OK',
        onPress: () =>
          openSettings().catch(() => console.warn('cannot open settings')),
        style: 'default',
      },
    ],
  );
}

export function alertForCameraPermission1(onCancelPress?: () => void) {
  Alert.alert(
    'Allow us to access the Camera on this device?',
    'This permission gives you a better app experience.',
    [
      {
        text: 'Cancel',
       onPress: onCancelPress ? onCancelPress : () => console.log('Permission denied'),
        style: 'destructive',
      },
      {
        text: 'OK',
        onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
        style: 'default',
      },
    ],
  );
}

export const checkCallLauncher = async () => {
  // check microphone trước
  const micResult = await checkAndRequestPermission(
    PERMISSIONS.IOS.MICROPHONE,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    alertForMicrophonePermission,
    "Microphone"
  );

  if (!micResult.isSuccess) return micResult;
  // check camera
  const camResult = await checkAndRequestPermission(
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.ANDROID.CAMERA,
    alertForCameraPermission,
    "Camera"
  );

  return camResult;
};

export const checkCallLauncher1 = async (onCancelPress?: () => void) => {
  // check microphone trước
  const micResult = await checkAndRequestPermission(
    PERMISSIONS.IOS.MICROPHONE,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    () => alertForMicrophonePermission1(onCancelPress),
    "Microphone"
  );

  if (!micResult.isSuccess) return micResult;

  // check camera
  const camResult = await checkAndRequestPermission(
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.ANDROID.CAMERA,
    () => alertForCameraPermission1(onCancelPress),
    "Camera"
  );

  return camResult;
};

export const checkFileAndroid = async () => {
  const resultCheckFile = await checkPermissionFileAndroid();
  switch (resultCheckFile) {
    case RESULTS.GRANTED:
      return { isSuccess: true, msg: 'success' };
    case RESULTS.DENIED:
      return request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
        if (result === RESULTS.GRANTED) {
          return { isSuccess: true, msg: 'success' };
        } else {
          alertForFileAndroidPermission();
          return { isSuccess: false, msg: '' };
        }
      });
    case RESULTS.BLOCKED:
      alertForFileAndroidPermission();
      return { isSuccess: false, msg: '' };
    case RESULTS.UNAVAILABLE:
      return {
        isSuccess: false,
        msg: 'Read File is not available on this device!',
      };
    default:
      break;
  }
};

export const getDownloadPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save Files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
  } catch (err) {
    console.log('err', err);
  }
};
