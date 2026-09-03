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

export function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    console.log('safeDecodeURIComponent error', error);
    return value;
  }
}

export function parseQueryParameters(url: string) {
  if (!url || typeof url !== 'string') {
    return {};
  }

  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params: Record<string, string> = {};
  let match;

  while ((match = regex.exec(url))) {
    params[safeDecodeURIComponent(match[1])] = safeDecodeURIComponent(match[2]);
  }

  return params;
}

export const calculateDistance = (
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null,
) => {
  const isValidNumber = (value: any) =>
    typeof value === 'number' && !isNaN(value);

  const isValidLat = (lat: any) =>
    isValidNumber(lat) && lat >= -90 && lat <= 90;

  const isValidLng = (lng: any) =>
    isValidNumber(lng) && lng >= -180 && lng <= 180;

  if (
    !isValidLat(lat1) ||
    !isValidLng(lon1) ||
    !isValidLat(lat2) ||
    !isValidLng(lon2)
  ) {
    return null;
  }

  // 👇 TS hiểu chắc chắn là number
  const safeLat1 = lat1 as number;
  const safeLon1 = lon1 as number;
  const safeLat2 = lat2 as number;
  const safeLon2 = lon2 as number;

  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371;

  const dLat = toRad(safeLat2 - safeLat1);
  const dLon = toRad(safeLon2 - safeLon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(safeLat1)) *
      Math.cos(toRad(safeLat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((R * c).toFixed(2));
};

export const formatMoneyVND = (money: any, characterReplace: string) => {
  if (money) {
    if (money.toString().length > 0) {
      let str = String(money);
      return (
        str
          .replace(/\D/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, characterReplace) + 'đ'
      );
    } else {
      return money + 'đ';
    }
  }
  return '0đ';
};

export const parseValueToNumber = (value: unknown) => {
  if (typeof value === 'string') {
    // Bỏ dấu chấm phân tách nghìn
    value = value.replace(/\./g, '');
  }
  return Number(value) || 0;
};

export const parsePricePackage = (
  stagePrice: unknown,
  stateDiscount: unknown,
) => {
  return {
    rootPrice: parseValueToNumber(stagePrice),
    discountPrice: parseValueToNumber(stateDiscount),
  };
};
