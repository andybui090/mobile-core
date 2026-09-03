import { STORAGEKEY } from '@/constants';
import ApiService from '@/services/api-base';
import { getObjectData, getStringData } from '@/storages';

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
