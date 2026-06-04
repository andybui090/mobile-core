import { createMMKV } from 'react-native-mmkv';
import { safeJsonParse } from '@/config';
import Config from 'react-native-config'

const STORAGE_PREFIX = 'DRCarely_';

const storage = createMMKV({
  id: `app-storage`,
  encryptionKey: Config.MMKV_ENCRYPTION_KEY, // Use a secure key in production
});

const storeStringData = (key: string, value: string) => {
  try {
    const storeKey = STORAGE_PREFIX + key;
    storage.set(storeKey, value);
  } catch (e) {
    console.log(`error storeString ${key}`, e);
  }
};

const storeObjectData = (key: string, value: object) => {
  try {
    const storeKey = STORAGE_PREFIX + key;
    const jsonValue = JSON.stringify(value);
    storage.set(storeKey, jsonValue);
  } catch (e) {
    console.log(`error storeObject ${key}`, e);
  }
};

const getStringData = (key: string) => {
  try {
    const storeKey = STORAGE_PREFIX + key;
    const value = storage.getString(storeKey);
    return value ?? null;
  } catch (e) {
    console.log(`error getString ${key}`, e);
    return null;
  }
};

const getObjectData = async <T = any>(key: string): Promise<T | null> => {
  try {
    const storeKey = STORAGE_PREFIX + key;
    const jsonValue = storage.getString(storeKey);
    return jsonValue != null ? safeJsonParse<T | null>(jsonValue, null) : null;
  } catch (e) {
    console.log(`error getObject ${key}`, e);
    return null;
  }
};

const removeValue = (key: string) => {
  try {
    const storeKey = STORAGE_PREFIX + key;
    storage.remove(storeKey);
  } catch (e) {
    console.log('error remove .', key);
  }
};

const clearAll = () => {
  try {
    storage.clearAll();
  } catch (e) {
    console.log('error clearAll .', e);
  }
};

export {
  STORAGE_PREFIX,
  storeStringData,
  getStringData,
  storeObjectData,
  getObjectData,
  removeValue,
  clearAll,
};
