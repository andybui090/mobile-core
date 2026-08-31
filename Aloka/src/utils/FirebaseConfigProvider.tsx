import { CText, Row } from '@/utils';
import compareVersions from 'compare-versions';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { getVersion } from 'react-native-device-info';
import { STORAGEKEY } from '../constants';
import { openExternalUrl } from '../configs';
import { setFirebaseConfig } from '../redux/slices/globalSlice';
import { useAppDispatch } from '../redux/store/customReduxHook';
import { getObjectData, storeObjectData } from '../storages';

import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from '@react-native-firebase/remote-config';

const DEFAULT_CONFIG = {
  TOGGLE_CONFIG: true,
  ALOKA_MIN_SUPPORT_IOS: '1.0.0',
  ALOKA_MIN_SUPPORT_ANDROID: '1.0.0',
  ALOKA_REVIEW_VERSION_IOS: '1.0.0',
  ALOKA_REVIEW_VERSION_ANDROID: '1.0.0',
  ALOKA_STORE_URL_IOS: 'https://apps.apple.com/app/aloka/id6786619509',
  ALOKA_STORE_URL_ANDROID:
    'https://play.google.com/store/apps/details?id=com.doctornetwork.homecare',
  ALOKA_FORCE_UPDATE: false,
};

const FirebaseConfigProvider: React.FC = () => {
  const [isForceUpdate, setIsForceUpdate] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');
  const [isFetchSuccess, setIsFetchSuccess] = useState(false);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const rc = getRemoteConfig();

  const initFirebaseRemoteConfig = async () => {
    try {
      // rc.settings = {
      //   minimumFetchIntervalMillis: __DEV__ ? 1000 : 2000,
      //   fetchTimeoutMillis: 200,
      // };

      rc.defaultConfig = DEFAULT_CONFIG;

      const fetchedRemotely = await fetchAndActivate(rc);
      setIsFetchSuccess(fetchedRemotely);

      // Android fallback
      if (!fetchedRemotely && Platform.OS === 'android') {
        const cachedConfig = await getObjectData(STORAGEKEY.FIREBASE_CONFIG);
        if (cachedConfig) {
          dispatch(setFirebaseConfig(cachedConfig));
        }
      }
    } catch (error) {
      console.warn('[FirebaseConfig] fetchAndActivate failed:', error);
      setIsFetchSuccess(false);

      if (Platform.OS === 'android') {
        const cachedConfig = await getObjectData(STORAGEKEY.FIREBASE_CONFIG);
        if (cachedConfig) {
          dispatch(setFirebaseConfig(cachedConfig));
        }
      }
    }
  };

  const getVal = (key: string) => getValue(rc, key);

  const handleFullConfig = async () => {
    if (!getVal('TOGGLE_CONFIG').asBoolean()) return;

    const version = getVersion();
    const isIOS = Platform.OS === 'ios';

    const minVersion = getVal(
      isIOS ? 'ALOKA_MIN_SUPPORT_IOS' : 'ALOKA_MIN_SUPPORT_ANDROID',
    ).asString();
    console.log("🚀 ~ handleFullConfig ~ minVersion:", minVersion)

    const forceUpdate = getVal('ALOKA_FORCE_UPDATE').asBoolean();
    const reviewVersion = getVal(
      isIOS ? 'ALOKA_REVIEW_VERSION_IOS' : 'ALOKA_REVIEW_VERSION_ANDROID',
    ).asString();

    const needUpdate =
      forceUpdate && compareVersions.compare(version, minVersion, '<');

    const downloadUrl = getVal(
      isIOS ? 'ALOKA_STORE_URL_IOS' : 'ALOKA_STORE_URL_ANDROID',
    ).asString();

    if (needUpdate) {
      setIsForceUpdate(true);
      setStoreUrl(downloadUrl);
    }

    const configData = {
      isConfig: true,
      currentVersion: version,
      reviewVersion: reviewVersion,
      minSupportVersion: minVersion,
      isAllowForceUpdate: forceUpdate,
      isReviewApp: version === reviewVersion,
    };
    console.log('🚀 ~ handleFullConfig ~ configData:', configData);

    try {
      storeObjectData(STORAGEKEY.FIREBASE_CONFIG, configData);
      console.log('[FirebaseConfig] cached config updated', configData);
    } catch (error) {
      console.warn('[FirebaseConfig] cache update failed', error);
    }

    dispatch(setFirebaseConfig(configData));
  };

  useEffect(() => {
    initFirebaseRemoteConfig();
  }, []);

  useEffect(() => {
    if (isFetchSuccess) {
      handleFullConfig();
    }
  }, [isFetchSuccess]);

  const handleUpdate = () => openExternalUrl(storeUrl);

  if (!isForceUpdate) return null;
  return (
    <Modal visible={isForceUpdate} transparent>
      <View style={styles.container}>
        <View style={styles.wrapContent}>
          <CText h2>{t('settings.appversion.title')}</CText>
          <CText h4 style={{ marginTop: 10 }}>
            {t('settings.appversion.description')}
          </CText>

          <Row around style={{ width: '100%', marginTop: 24 }}>
            <TouchableOpacity onPress={handleUpdate} style={styles.btnRetry}>
              <CText h4 w500 color="#19A2A7">
                {t('settings.appversion.action')}
              </CText>
            </TouchableOpacity>
          </Row>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
  },
  wrapContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnRetry: {
    borderRadius: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    paddingVertical: 10,
    borderColor: '#19A2A7',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default FirebaseConfigProvider;
