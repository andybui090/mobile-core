import dayjs from 'dayjs';
import moment from 'moment';
import {Linking, Platform} from 'react-native';

const acceptExts = 'apk';

export const imgExts = ['jpeg', 'jpg', 'webp', 'png', 'gif', 'heic'];

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