import { alertForLocationPermission, checkPermissionLocation, isIOS } from '@/config';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';

export const PermissionHelper = async () => {
  const result = await checkPermissionLocation();
  switch (result) {
    case RESULTS.UNAVAILABLE:
      return {
        isSuccess: false,
        imgRes: null,
        msg: 'Vị trí không khả dụng trên thiết bị này!',
      };
    case RESULTS.DENIED:
      return request(isIOS ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
        res => {
          if (res === RESULTS.GRANTED) {
            return { isSuccess: true, msg: '' };
          } else {
            return {
              isSuccess: false,
              msg: 'Vị trí không khả dụng trên thiết bị này!',
            };
          }
        },
      );
    case RESULTS.GRANTED:
      return { isSuccess: true, msg: '' };
    case RESULTS.LIMITED:
    // return showCamera();
    case RESULTS.BLOCKED:
      alertForLocationPermission();
      return { isSuccess: false, msg: '' };
    default:
      return { isSuccess: false, msg: '' };
  }
};
