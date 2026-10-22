import { API_MESSAGE } from '@/constants';
import { Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import dayjs from 'dayjs';
import moment from 'moment';

export const imgExts = ['jpeg', 'jpg', 'webp', 'png', 'gif', 'heic'];

export const videoExts = [
  '3g2',
  '3gp',
  'aaf',
  'asf',
  'avchd',
  'avi',
  'drc',
  'flv',
  'm2v',
  'm3u8',
  'm4p',
  'm4v',
  'mkv',
  'mng',
  'mov',
  'mp2',
  'mp4',
  'mpe',
  'mpeg',
  'mpg',
  'mpv',
  'mxf',
  'nsv',
  'ogg',
  'ogv',
  'qt',
  'rm',
  'rmvb',
  'roq',
  'svi',
  'vob',
  'webm',
  'wmv',
  'yuv',
];

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
  return { MB, removeEx, extension };
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

export const normalizeTimeBooked = (bookings: { date: string }[]) => {
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

export const formatMoneyVNDPackage = (money: any, characterReplace: string) => {
  if (money) {
    if (money.toString().length > 0) {
      let str = String(money);
      return str
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, characterReplace);
    } else {
      return money;
    }
  }
  return '';
};

export const timeDifferenceV2 = (t: any, start: any, end?: any): string => {
  let startDate = dayjs(start);
  let endDate = dayjs(end) || dayjs();
  let difference = endDate.diff(startDate, 'millisecond');
  if (startDate > endDate) {
    difference = startDate.diff(endDate, 'millisecond');
  }
  if (difference < 60 * 1000) {
    return `${t('communityChat.chat.titleOffline')}`;
  }
  if (difference < 60 * 60 * 1000) {
    const minute = Math.round(difference / (60 * 1000));
    if (minute === 1) {
      return `${minute} ${t('common.minute', 'minute')}`;
    }
    return `${minute} ${t('common.minutes', 'minutes')}`;
  }
  if (difference < 24 * 60 * 60 * 1000) {
    const hour = Math.round(difference / (60 * 60 * 1000));
    if (hour === 1) {
      return `${hour} ${t('common.hour', 'hour')}`;
    }
    return `${hour} ${t('common.hours', 'hours')}`;
  }
  if (difference < 30 * 24 * 60 * 60 * 1000) {
    const day = Math.round(difference / (24 * 60 * 60 * 1000));
    if (day === 1) {
      return `${day} ${t('common.day', 'day')}`;
    }
    return `${day} ${t('common.days', 'days')}`;
  }
  if (difference < 365 * 24 * 60 * 60 * 1000) {
    const month = Math.round(difference / (30 * 24 * 60 * 60 * 1000));
    if (month === 1) {
      return `${month} ${t('common.month', 'month')}`;
    }
    return `${month} ${t('common.months', 'months')}`;
  }
  if (!end) {
    return startDate.format('DD-MM-YYYY');
  } else {
    const year = Math.round(difference / (365 * 24 * 60 * 60 * 1000));
    if (year === 1) {
      return `${year} ${t('common.year', 'year')}`;
    }
    return `${year} ${t('common.years', 'years')}`;
  }
};

export function removeDuplicates(arr: any) {
  return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
}

export const conventUserNameChat = (
  listOwner: any = '',
  text: any = '',
  isReview: boolean,
  isName: number = 0,
) => {
  let result = '';
  if (typeof text === 'string') {
    if (text.includes('{community.chat.remove}')) {
      result = text.replace('{community.chat.remove}', '');
    } else if (text.includes('{communityChat.chat.unPinMessage}')) {
      result = text.replace('{communityChat.chat.unPinMessage}', '');
    } else if (text.includes('{communityChat.chat.pinMessage}')) {
      result = text.replace('{communityChat.chat.pinMessage}', '');
    } else if (text.includes('{communityChat.chat.memberLeveaGroup}')) {
      result = text.replace('{communityChat.chat.memberLeveaGroup}', '');
    } else if (text.includes('{communityChat.chat.addMember}')) {
      result = text.replace('{communityChat.chat.addMember}', '');
    } else if (text.includes('{communityChat.chat.deleteMember}')) {
      result = text.replace('{communityChat.chat.deleteMember}', '');
    } else if (text.includes('{communityChat.listMember.changeRole}')) {
      result = text.replace('{communityChat.listMember.changeRole}', '');
    } else {
      result = text;
    }
  }
  if (result.length > 2) {
    return listOwner === 'Owner' ||
      listOwner === 'Admin' ||
      isReview ||
      isName !== 1
      ? result
      : result.slice(0, 2) + '*'.repeat(result.length - 2);
  }
  return result;
};

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const replaceSpace = (str: string) => {
  return str.replace(/\u0020/, '\u00a0');
};

export const setMomentLocale = (languageCode: string) => {
  switch (languageCode) {
    case 'vi':
      moment.locale('vi');
      break;
    case 'ko':
      moment.locale('ko');
      break;
    case 'ja':
      moment.locale('ja');
      break;
    case 'fr':
      moment.locale('fr');
      break;
    default:
      moment.locale('en');
      break;
  }
};

export const getURLExtension = (url: string) => {
  if (url) {
    let str: string = url.split('.').pop() || '';
    if (str) {
      let extension = str.toLowerCase();
      if (imgExts.indexOf(extension) > -1) {
        return 'img';
      }
      if (videoExts.indexOf(extension) > -1) return 'video';
    }
  }
  return '';
};

export const getMediaType = (fileName: string) => {
  if (fileName.match(/\.(mp4|mov|avi)$/i)) return 'video';
  return 'image';
};