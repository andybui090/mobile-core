import AsyncStorage from '@react-native-async-storage/async-storage';
import {safeJsonParse} from '@/configs';

const STORAGE_PREFIX = 'DoctorNetwork_';

const storeStringData = async (key: string, value: string) => {
  try {
    let storeKey = STORAGE_PREFIX + key;
    await AsyncStorage.setItem(storeKey, value);
  } catch (e) {
    console.log(`error storeString ${key}`, e);
  }
};

const storeObjectData = async (key: string, value: object) => {
  try {
    let storeKey = STORAGE_PREFIX + key;
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(storeKey, jsonValue);
  } catch (e) {
    console.log(`error storeObject ${key}`, e);
  }
};

const getStringData = async (key: string) => {
  try {
    let storeKey = STORAGE_PREFIX + key;
    const value = await AsyncStorage.getItem(storeKey);
    if (value !== null) {
      return value;
    } else {
      return null;
    }
  } catch (e) {
    console.log(`error getString ${key}`, e);
    return null;
  }
};

const getObjectData = async <T = any>(key: string): Promise<T | null> => {
  try {
    let storeKey = STORAGE_PREFIX + key;
    const jsonValue = await AsyncStorage.getItem(storeKey);
    return jsonValue !== null ? safeJsonParse<T | null>(jsonValue, null) : null;
  } catch (e) {
    console.log(`error getObject ${key}`, e);
    return null;
  }
};

const removeValue = async (key: string) => {
  try {
    let storeKey = STORAGE_PREFIX + key;
    await AsyncStorage.removeItem(storeKey);
  } catch (e) {
    console.log('error remove .', key);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log('error clearAll .', e);
  }
};

const removeMultiValues = async (keys: any) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return { success: true };
  } catch (e) {
    return { error: e };
  }
};

const getAllKeys = async () => {
  let keys: any;
  try {
    keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    return keys;
  }
};

const getMultiple = async (arrKey = []) => {
  let results: any;
  try {
    results = await AsyncStorage.multiGet(arrKey);
  } catch (e) {
  }
  return results;
};

const removeFew = async (keys = []) => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (e) {
    console.log('error removeFew ', e);
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
  removeMultiValues,
  getAllKeys,
  getMultiple,
  removeFew,
};
