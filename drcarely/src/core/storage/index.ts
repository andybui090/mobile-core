import { storage } from './mmkv';

export const Storage = {
  set: (key: string, value: any) => {
    storage.set(key, JSON.stringify(value));
  },

  get: <T = any>(key: string): T | null => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  },

  remove: (key: string) => {
    storage.remove(key);
  },

  clear: () => {
    storage.clearAll();
  },
};