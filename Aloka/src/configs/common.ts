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

export const formatISOToVietnameseDate = (
  value?: string | Date | null,
  locale = 'vi',
  _t?: unknown,
) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatTimeRangeWithDurationFromISO = (
  value?: string | Date | null,
  durationMinutes = 0,
  locale = 'vi',
) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const endDate = new Date(date.getTime() + durationMinutes * 60 * 1000);
  const timeFormatter = new Intl.DateTimeFormat(
    locale === 'vi' ? 'vi-VN' : 'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  );

  return `${timeFormatter.format(date)} - ${timeFormatter.format(endDate)}`;
};

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

export const replaceOverSpace = (value: string) => {
  return value.replace(/\s\s+/g, ' ');
};

export const checkActiveObjectInArr = (
  arr: [],
  keyFind: string,
  valueFine: any,
) => {
  //array with some: stop as soon as one element is found
  return arr.some((e: any) => e[keyFind] === valueFine);
};

//do chuoi qua dai backend xu ly bi loi
export const toLower = (fileName: string) => {
  let result = '';
  if (fileName) {
    if (fileName.length > 56) {
      result = fileName.slice(0, 46);
      result = result + '.' + fileName.split('.').pop();
    } else {
      result = fileName;
    }
  }
  return result;
};

export const removeExtraSpaces = (value: string) => {
  return value.replace(/\s{2,}/g, ' ');
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatByte = (type: any, name: string, size: number) => {
  let extension = type.split('/').pop().toUpperCase();
  let removeEx = name.split('.').shift();
  let MB = formatBytes(size);
  return {MB, removeEx, extension};
};

export const formatDateTimeKey = (d: Date) => {
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
};

export const normalizeTimeBooked = (bookings: {date: string}[]) => {
  const map = new Map<string, boolean>();
  bookings.forEach(b => {
    const d = new Date(b.date);
    const key = formatDateTimeKey(d);
    map.set(key, true);
  });
  return map;
};

const pad2 = (num: number) => (num < 10 ? `0${num}` : `${num}`);

export const formatDateCarely = (date: Date, lang: string, t: any) => {
  const labels = [
    t('common.sunday', 'Sun'),
    t('common.monday', 'Mon'),
    t('common.tuesday', 'Tue'),
    t('common.wednesday', 'Wed'),
    t('common.thursday', 'Thu'),
    t('common.friday', 'Fri'),
    t('common.saturday', 'Sat'),
  ];

  const dayName = labels[date.getDay()];
  const dd = pad2(date.getDate());
  const mm = pad2(date.getMonth() + 1);
  const yyyy = date.getFullYear();

  if (lang === 'vi') {
    return `${dayName}, Ngày ${dd}/${mm}/${yyyy}`;
  }

  return `${dayName}, ${dd}/${mm}/${yyyy}`;
};

export const formatTimeRangeWithDuration = (
  startTime: string, // "15:30"
  durationMinutes: number, // 90
) => {
  const [h, m] = startTime.split(':').map(Number);

  const start = new Date();
  start.setHours(h, m, 0, 0);

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const format24hWithPeriod = (date: Date) => {
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${hh}:${mm} ${period}`;
  };

  return `${format24hWithPeriod(start)} – ${format24hWithPeriod(end)}`;
};

type PackageItem = {
  channel_id: string;
  call_1vs1: number;
  chat_1vs1: number;
  is_book_service: number;
  id: number;
  order_id: number;
  remain_call: number;
  remain_chat: number;
};

type OrderInfo = {
  id: number;
  order_id: number;
  is_book_service: number;
  remain_call: number;
  remain_chat: number;
};

export type MergedPackage = {
  channel_id: string;
  call_1vs1: number;
  chat_1vs1: number;
  is_book_service: number;
  orders: OrderInfo[];
  expiredChat: boolean;
  expiredCall: boolean;
};

export function mergePackagesByChannel(
  packages: PackageItem[] | null | undefined,
): MergedPackage[] {
  if (!Array.isArray(packages)) return [];

  const result: Record<string, MergedPackage> = {};

  packages.forEach(pkg => {
    const {
      channel_id,
      call_1vs1,
      chat_1vs1,
      id,
      order_id,
      remain_call,
      remain_chat,
      is_book_service,
    } = pkg;

    if (!result[channel_id]) {
      result[channel_id] = {
        channel_id,
        call_1vs1,
        chat_1vs1,
        is_book_service,
        orders: [],
        expiredChat: true,
        expiredCall: true,
      };
    }

    result[channel_id].orders.push({
      id,
      order_id,
      is_book_service,
      remain_call,
      remain_chat,
    });
  });

  // tính expiredChat & expiredCall
  Object.values(result).forEach(pkg => {
    const hasUnlimitedChat = pkg.orders.some(o => o.remain_chat < 0);
    const hasUnlimitedCall = pkg.orders.some(o => o.remain_call < 0);

    pkg.expiredChat = hasUnlimitedChat
      ? false
      : pkg.orders.every(o => o.remain_chat === 0);

    pkg.expiredCall = hasUnlimitedCall
      ? false
      : pkg.orders.every(o => o.remain_call === 0);
  });

  return Object.values(result);
}

export function getPackageByChannelId(
  mergedPackages: MergedPackage[],
  channelId: string,
): MergedPackage {
  return (
    mergedPackages.find(pkg => pkg.channel_id === channelId) ?? {
      channel_id: '',
      call_1vs1: 0,
      chat_1vs1: 0,
      is_book_service: 0,
      orders: [],
      expiredChat: true,
      expiredCall: true,
    }
  );
}

export function getNearValidChatPackageId(pkg: MergedPackage): number | null {
  // duyệt ngược từ cuối mảng orders
  for (let i = 0; i < pkg.orders.length; i++) {
    const order = pkg.orders[i];
    if (order.remain_chat < 0 || order.remain_chat > 0) {
      return order.id;
    }
  }
  return null; // không tìm thấy
}

export function getNearValidChatOrderId(pkg: MergedPackage): number | null {
  // duyệt ngược từ cuối mảng orders
  for (let i = 0; i < pkg.orders.length; i++) {
    const order = pkg.orders[i];
    if (order.remain_chat < 0 || order.remain_chat > 0) {
      return order.order_id;
    }
  }
  return null; // không tìm thấy
}

export function getNearValidCallOrderId(pkg: MergedPackage): number | null {
  // duyệt ngược từ cuối mảng orders
  for (let i = 0; i < pkg.orders.length; i++) {
    const order = pkg.orders[i];
    if (order.remain_call < 0 || order.remain_call > 0) {
      return order.order_id;
    }
  }
  return null; // không tìm thấy
}

export function getPackageOrderId(
  pkg: MergedPackage,
  pkgId: number,
): number | null {
  if (!pkg?.orders?.length) return null;

  const order = pkg.orders.find(o => o.id === pkgId);
  return order?.order_id ?? null;
}

export const calculateNumberViewLike = (
  numberReal: number,
  numberVirtual: number,
) => {
  //se la so luot that + them so luot ao
  if (numberReal) {
    if (numberVirtual) {
      return numberReal + numberVirtual;
    } else {
      return numberReal;
    }
  } else {
    if (numberVirtual) {
      return numberVirtual;
    }
    return 0;
  }
};

export const splitCategory = (categoryName: string) => {
  let result = '';
  if (categoryName) {
    result = categoryName.split(',')[0];
  }
  return result;
};