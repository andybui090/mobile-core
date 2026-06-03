import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: `app-storage`,
  encryptionKey: 'drcarely-storage-key',
});
