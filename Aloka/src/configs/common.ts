import { API_MESSAGE } from '@/constants';
import { Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getUniqueListBy = (arr: any, key: string) => {
  return [...new Map(arr.map((item: any) => [item[key], item])).values()];
};

export const getAPIErrorMessage = (problem: string) => {
  for (const [key, val] of Object.entries(API_MESSAGE)) {
    if (key === problem) {
      return val;
    }
  }
  return 'Something error, try login again!';
};

export const showToast = (toastEl: any, message: string, duration = 1000) => {
  if (message !== 'Token invalid') {
    toastEl.current?.show(message, duration);
  }
};

export const isEmptyObj = (obj: any) => {
  if (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }
  return true;
};

export const isEmptyArray = (array: Array<any>) => {
  return !Array.isArray(array) || !array.length;
};

export function safeJsonParse<T = any>(value: any, fallback: T): T {
  if (typeof value !== 'string') {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.log('safeJsonParse error', error);
    return fallback;
  }
}

export async function openExternalUrl(url?: string | null) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true;
    }
  } catch (error) {
    console.log('openExternalUrl error', error);
  }

  return false;
}

export const statusSuccess = (status: string) => {
  return status == 'success';
};

export const logError = (err: any, key?: string, isOnlyMsg?: boolean) => {
  let msg = 'Something error!!!';
  if (err.errors) {
    const { errors } = err;
    if (!isEmptyArray(errors)) {
      if (isOnlyMsg) {
        msg = errors[0].msg;
        if (errors[0].msg) {
          if (errors[0].msg.message) {
            msg = errors[0].msg.message;
          }
        }
      } else if (key) {
        for (let i = 0; i < errors.length; i++) {
          if (errors[i].key === key) {
            msg = errors[i].msg;
            break;
          }
        }
      } else {
        msg = errors[0].key + ': ' + errors[0].msg;
      }
    } else if (errors.msg) {
      msg = errors.msg;
    }
  }
  return msg;
};

export const changeAlias = (val: string) => {
  if (val === null || val === undefined) return '';
  var str = val;
  str = str.trim();
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.toUpperCase();
  return str;
};

export const keyExtractor = (item: any, index: number) => index.toString();

export const getDeviceId = async () => {
  const deviceId = await DeviceInfo.getUniqueId();
  return deviceId;
};

export function isValidDate(dateStr: any) {
  if (dateStr) {
    const validDate = new Date(dateStr);
    return !isNaN(validDate.valueOf());
  }
  return false;
}
