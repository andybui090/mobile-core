import {API_MESSAGE} from '@/constants';
import dayjs from 'dayjs';
import moment from 'moment';
import {Linking, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';

import 'moment/locale/ja';
import 'moment/locale/vi';
import 'moment/locale/th';
import 'moment/locale/fr';
import 'moment/locale/ko';

const acceptExts = 'apk';

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

export const imgExts = ['jpeg', 'jpg', 'webp', 'png', 'gif', 'heic'];

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

export const checkApk = (ext: string) => {
  if (ext.indexOf(acceptExts) > -1) {
    return true;
  }
  return false;
};
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

export const isRealDevice = async () => {
  let simulator = await DeviceInfo.isEmulator();
  return !simulator;
};

export const formatDateAgo = (value: string) => {
  if (value) {
    const value_replace = moment(value, 'YYYY-MM-DD h:mm:ss').fromNow(true);
    return (
      value_replace.replace(value_replace[0], value_replace[0].toUpperCase()) +
      ' trước'
    );
  }
  return '';
};

export const formatDateAgoV2 = (value: string) => {
  if (value) {
    const value_replace = moment(value, 'YYYY-MM-DD h:mm:ss').fromNow(true);
    return value_replace.replace(
      value_replace[0],
      value_replace[0].toUpperCase(),
    );
  }
  return '';
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

export const replaceSpace = (str: string) => {
  return str.replace(/\u0020/, '\u00a0');
};

export const isImageBase64 = (data: string) => {
  if (!data) return false;
  return (
    data.indexOf('data:image/jpg;base64') != -1 ||
    data.indexOf('data:image/png;base64') != -1 ||
    data.indexOf('data:image/jpeg;base64') != -1
  );
};

const errorType = {
  problem: String,
  message: String,
};

export const logError = (err: any, key?: string, isOnlyMsg?: boolean) => {
  let msg = 'Something error!!!';
  if (err.errors) {
    const {errors} = err;
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

export const checkAuthen = (
  userInfo: any,
  callBack: Function,
  authen: Function,
) => {
  if (userInfo.id) {
    callBack();
  } else {
    authen();
  }
};

export const keyExtractor = (item: any, index: number) => index.toString();

export const getDeviceId = async () => {
  const deviceId = await DeviceInfo.getUniqueId();
  return deviceId;
};

export const getDeviceName = async () => {
  const deviceName = await DeviceInfo.getDeviceName();
  return deviceName;
};

export const replaceOverSpace = (value: string) => {
  return value.replace(/\s\s+/g, ' ');
};

export const removeSpace = (value: string) => {
  return value.replace(/\s+/g, '');
};

export const removeExtraSpaces = (value: string) => {
  return value.replace(/\s{2,}/g, ' ');
};

export const checkActiveObjectInArr = (
  arr: [],
  keyFind: string,
  valueFine: any,
) => {
  //array with some: stop as soon as one element is found
  return arr.some((e: any) => e[keyFind] === valueFine);
};

export const statusSuccess = (status: string) => {
  return status == 'success';
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

export const showError = (errMsg: string) => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: errMsg,
  });
};

export const kFormatter = (num: number) => {
  let result = 0;
  if (num) {
    if (Math.abs(num) > 999) {
      result = Math.sign(num) * (Math.abs(num) / 1000);
      if (Math.abs(num) % 1000 != 0) {
        return result.toFixed(1) + 'k';
      }
      return result + 'k';
    } else {
      return Math.sign(num) * Math.abs(num);
    }
  }
  return 0;
};

//tim so luong phan tu xuat hien nhieu nhat trong mang
export const mode = (array: any) => {
  var counts: any = {};
  var compare = -1;
  var mostFrequent;
  for (var i = 0, len = array.length; i < len; i++) {
    var word = changeAlias(array[i].value);
    if (counts[word] === undefined) {
      counts[word] = 1;
    } else {
      counts[word] = counts[word] + 1;
    }
    if (counts[word] > compare) {
      compare = counts[word];
      mostFrequent = array[i];
    }
  }
  return mostFrequent;
};

export const timeDifference = (t: any, start: any, end?: any): string => {
  let startDate = dayjs(start);
  let endDate = dayjs(end) || dayjs();
  let difference = endDate.diff(startDate, 'millisecond');
  if (startDate > endDate) {
    difference = startDate.diff(endDate, 'millisecond');
  }
  if (difference < 60 * 1000) {
    return `${Math.round(difference / 1000)}${t('common.acronymSeconds', 's')}`;
  }
  if (difference < 60 * 60 * 1000) {
    return `${Math.round(difference / (60 * 1000))}${t(
      'common.acronymMinute',
      'm',
    )}`;
  }
  if (difference < 24 * 60 * 60 * 1000) {
    return `${Math.round(difference / (60 * 60 * 1000))}${t(
      'common.acronymHours',
      'h',
    )}`;
  }
  if (difference < 30 * 24 * 60 * 60 * 1000) {
    return `${Math.round(difference / (24 * 60 * 60 * 1000))} ${t(
      'common.days',
      'days',
    )}`;
  }
  if (difference < 365 * 24 * 60 * 60 * 1000) {
    return `${Math.round(difference / (30 * 24 * 60 * 60 * 1000))} ${t(
      'common.months',
      'months',
    )}`;
  }
  return !end
    ? startDate.format('DD-MM-YYYY')
    : `${Math.round(difference / (365 * 24 * 60 * 60 * 1000))} ${t(
        'common.years',
        'years',
      )}`;
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

export const parseContentReply = (contentReply: string) => {
  let result = {
    userReply: '',
    content: contentReply || '',
  };
  if (contentReply) {
    const arr = contentReply.split('#');
    const newTextArr: any = [];
    arr.forEach((element, index) => {
      if (index % 2 !== 0) {
        result.userReply = element;
      } else {
        result.content = element;
      }
    });
  }
  return result;
};

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

export const parseIntToBoolean = (value: any) => {
  if (value && value == 1) {
    return true;
  }
  return false;
};

export const shareVideo = async (videoId: number, caption: string) => {
  try {
    const _url = `${Config.SHARE_WEB_URL}/video/${videoId}`;
    const msg = caption ? caption : '';
    const shareOption = {
      title: caption,
      message: msg,
      url: _url,
    };
    Share.open(shareOption)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  } catch (error) {
    console.log('==== share error ====', error);
  }
};

export const shareCourse = async (courseId: number, lessionName: string) => {
  try {
    const _url = `${Config.SHARE_WEB_URL}/dl?course_id=${courseId}&source=inapp&campaign=inapp`;
    const msg = lessionName ? lessionName : '';
    const shareOption = {
      title: lessionName,
      message: msg,
      url: _url,
    };
    Share.open(shareOption)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  } catch (error) {
    console.log('==== share error ====', error);
  }
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

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isValidDate(dateStr: any) {
  if (dateStr) {
    const validDate = new Date(dateStr);
    return !isNaN(validDate.valueOf());
  }
  return false;
}

export const splitCategory = (categoryName: string) => {
  let result = '';
  if (categoryName) {
    result = categoryName.split(',')[0];
  }
  return result;
};

export const shareInviteFriend = async (
  linkInviteFriend: string,
  title: string,
  caption: string,
) => {
  const shareOption = {
    title,
    message: caption || '',
    url: linkInviteFriend,
  };
  Share.open(shareOption)
    .then((res: any) => {})
    .catch(error => console.log(error));
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

export const isCourseFree = (rootPrice: number, discountPrice: number) => {
  let rootPriceParse: number = rootPrice ? rootPrice : 0;
  let discountPriceParse: number = discountPrice ? discountPrice : 0;
  let isFree = false;
  if (rootPriceParse == 0) {
    isFree = true;
  }
  return {
    isFree,
    rootPrice: rootPriceParse,
    discountPrice: discountPriceParse,
  };
};

export const parsePriceCourse = (stagePrice: any, stateDiscount: any) => {
  let stagePriceParse: number = stagePrice ? stagePrice : 0;
  let stateDiscountParse: number = stateDiscount ? stateDiscount : 0;
  let isFree = false;
  let purchasePriceParse = stateDiscountParse;
  if (stateDiscountParse == 0) {
    purchasePriceParse = stagePriceParse;
    if (stagePriceParse == 0) {
      isFree = true;
    }
  }
  return {
    isFree,
    isShowRight: !(stagePriceParse == 0 || stateDiscountParse == 0),
    rootPrice: stagePriceParse,
    purchasePrice: purchasePriceParse,
  };
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

export const isCourseCME = (
  isCertified: any,
  is_cme: any,
  cme_price: any,
  rootPrice: any,
  discountPrice: any,
) => {
  if ((isCertified === 1 || isCertified === 0) && is_cme === 1) {
    let cmeRootPrice: any;
    if (cme_price > rootPrice) {
      cmeRootPrice = rootPrice == 0 ? cme_price : rootPrice;
    } else {
      cmeRootPrice = cme_price == 0 ? rootPrice : cme_price;
    }
    return {
      isFree: rootPrice == 0 && cme_price == 0,
      rootPrice: cmeRootPrice,
      discountPrice: discountPrice,
    };
  } else {
    return isCourseFree(rootPrice, discountPrice);
  }
};

export const getUrlExtensionFile = (url: string) => {
  return url?.split(/[#?]/)[0].split('.').pop()?.trim() ?? '';
};

export const downloadFile = async (url: any) => {
  // Get the app's cache directory
  const {config, fs} = ReactNativeBlobUtil;
  const cacheDir = fs.dirs.DownloadDir;

  // Generate a unique filename for the downloaded image
  const filename = url.split('/').pop();
  const imagePath = `${cacheDir}/${filename}`;
  try {
    // Download the file and save it to the cache directory
    const configOptions: any = Platform.select({
      ios: {
        fileCache: false,
        path: imagePath,
        appendExt: filename.split('.').pop(),
      },
      android: {
        fileCache: true,
        path: imagePath,
        appendExt: filename.split('.').pop(),
        addAndroidDownloads: {
          // Related to the Android only
          useDownloadManager: true,
          notification: true,
          path: imagePath,
          description: 'File',
        },
      },
    });
    const response = await ReactNativeBlobUtil.config(configOptions).fetch(
      'GET',
      url,
    );
    // Return the path to the downloaded file
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const isValidUrl = (urlString: any) => {
  var urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const extractAndValidateURI = (string: any) => {
  const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  const urls = string.toLowerCase().match(urlPattern);
  if (urls) {
    for (let url of urls) {
      try {
        new URL(url);
        return true;
      } catch (e) {
        continue;
      }
    }
  }
  return false;
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

export const formatDateBooking = (isoString: string) => {
  if (!isoString) return '--/--/---- --:--'; // null, undefined, empty string
  const date = new Date(isoString);
  // kiểm tra có phải ngày hợp lệ không
  if (isNaN(date.getTime())) {
    return '--/--/---- --:--';
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
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

// utils/dateHelpers.ts
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

export const logApp = (params: unknown, screenName: string = 'DrNetwork') => {
  if (__DEV__) {
    console.log(screenName + ': ' + JSON.stringify(params, null, 2));
  }
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

export const formatTimeRangeWithDurationFromISO = (
  isoString: string,
  durationMinutes: number,
) => {
  if (!isoString) return '';

  const start = new Date(isoString);

  if (isNaN(start.getTime())) return '';

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const format24hWithPeriod = (date: Date) => {
    const hh = pad2(date.getHours());
    const mm = pad2(date.getMinutes());
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${hh}:${mm} ${period}`;
  };

  return `${format24hWithPeriod(start)} – ${format24hWithPeriod(end)}`;
};

export const formatISOToVietnameseDate = (
  isoString: string,
  lang: string,
  t: any,
) => {
  // convert sang giờ VN
  if (!isoString) return '--/--/----'; // null, undefined, empty string
  const date = new Date(isoString);
  // kiểm tra có phải ngày hợp lệ không
  if (isNaN(date.getTime())) {
    return '--/--/----';
  }
  const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const labels = [
    t('common.sunday', 'Sun'),
    t('common.monday', 'Mon'),
    t('common.tuesday', 'Tue'),
    t('common.wednesday', 'Wed'),
    t('common.thursday', 'Thu'),
    t('common.friday', 'Fri'),
    t('common.saturday', 'Sat'),
  ];

  const dayName = labels[vnDate.getDay()];
  const dd = vnDate.getDate().toString().padStart(2, '0');
  const mm = (vnDate.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = vnDate.getFullYear();
  if (lang === 'vi') {
    return `${dayName}, Ngày ${dd}/${mm}/${yyyy}`;
  }
  return `${dayName}, ${dd}/${mm}/${yyyy}`;
};

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

export function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    console.log('safeDecodeURIComponent error', error);
    return value;
  }
}

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

// Lay order gan nhat co remain_chat == 0 de loai tru truong hop da co phong chat roi
export function getNearValidChatPackageIdRemain0(
  pkg: MergedPackage,
): number | null {
  // duyệt ngược từ cuối mảng orders
  for (let i = 0; i < pkg.orders.length; i++) {
    const order = pkg.orders[i];
    if (order.remain_chat === 0) {
      return order.id;
    }
  }
  return null; // không tìm thấy
}

export function getNearValidChatOrderIdRemain0(
  pkg: MergedPackage,
): number | null {
  // duyệt ngược từ cuối mảng orders
  for (let i = 0; i < pkg.orders.length; i++) {
    const order = pkg.orders[i];
    if (order.remain_chat === 0) {
      return order.order_id;
    }
  }
  return null; // không tìm thấy
}

export const getMediaType = (fileName: string) => {
  if (fileName.match(/\.(mp4|mov|avi)$/i)) return 'video';
  return 'image';
};

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
