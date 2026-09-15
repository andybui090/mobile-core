import { STORAGEKEY } from '@/constants';
import ApiService from '@/services/api-base';
import { getObjectData, getStringData } from '@/storages';
import { Linking, Platform } from 'react-native';
import Config from 'react-native-config';

export const checkHideIntroApp = async () => {
  const isGetting = getStringData(STORAGEKEY.GETTING_APP);
  return isGetting === 'false';
};

export const checkHideCategoryApp = async () => {
  // const isGetting = await getStringData(STORAGEKEY.SHOW_CATEGORY);
  // return isGetting === 'false';

  return false;
};

export const autoLoginApp = async (
  successCallback: (token: object) => void,
  failedCallback: () => void,
) => {
  const jwtToken = await getObjectData(STORAGEKEY.JWT_TOKEN);
  if (jwtToken && jwtToken.access_token) {
    console.log(
      '🚀 ~ file: app-helper.tsx:20 ~ autoLoginApp ~ jwtToken.access_token:',
      jwtToken.access_token,
    );
    // ApiSSO.setAuthorizationHeader(jwtToken.access_token);
    ApiService.setAuthorizationHeader(jwtToken.access_token);
    if (jwtToken.access_token) {
      successCallback(jwtToken);
    } else {
      failedCallback();
    }
  } else {
    failedCallback();
  }
};

export const openDoctorNetworkApp = async () => {
  try {
    const isIOS = Platform.OS === 'ios';
    const jwtToken: any = await getObjectData(STORAGEKEY.JWT_TOKEN);
    const token = jwtToken?.access_token || jwtToken?.accessToken || '';

    const scheme = Config.SCHEME_DOCTOR_NETWORK || 'doctornetwork://';
    const deepLink = token ? `${scheme}token=${token}` : scheme;

    const storeUrl = isIOS
      ? (Config.DOCTOR_NETWORK_IOS_DOWNLOAD_LINK || 'https://apps.apple.com/app/doctor-networks/id1671676828')
      : (Config.DOCTOR_NETWORK_ANDROID_DOWNLOAD_LINK || 'https://play.google.com/store/apps/details?id=com.anonymous.doctornetwork');

    const canOpen = await Linking.canOpenURL(scheme).catch(() => false);
    if (canOpen) {
      await Linking.openURL(deepLink);
    } else {
      Linking.openURL(deepLink).catch(async () => {
        await Linking.openURL(storeUrl).catch(err => {
          console.log('Cannot open store url', err);
        });
      });
    }
  } catch (error) {
    console.log('openDoctorNetworkApp error:', error);
  }
};

