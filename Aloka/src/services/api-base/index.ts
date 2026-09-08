import { create } from 'apisauce';

import Config from 'react-native-config';
import apiMonitor from './monitor';
import { GLOBAL, HOME, SETTINGS, PROFILE, CARELY, NOTIFICATION } from './uris';
import i18n from 'i18next';

const createApiClient = (baseURL = Config.BASE_API_URL) => {
  const api = create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'x-app-id': '56d4128c-7732-4218-936c-ed5d82a810fb',
      'x-app-content': '',
      'x-app-language': i18n.language,
      'x-app-name': 'DoctorNetwork',
    },
    // timeout: 20000,
  });

  api.addMonitor(apiMonitor);

  /*
    AUTHENTICATION
  */
  const setAuthorizationHeader = (access_token: string) => {
    return api.setHeader('Authorization', 'Bearer ' + access_token);
  };
  const getAuthorizationHeader = () => {
    return api.headers.Authorization;
  };
  const deleteAuthorizationHeader = () => delete api.headers.Authorization;

  const getHeader = () => {
    return api.headers;
  };

  /*
    GLOBAL
  */
  const setXAppLanguage = (payload: string) => {
    return api.setHeader('x-app-language', payload);
  };

  const setXAppContent = (payload: string) => {
    return api.setHeader('x-app-content', payload);
  };

  const getTutorials = (payload: object) => {
    return api.get(GLOBAL.GET_TUTORIAL, payload);
  };

  const getLanguage = (payload: object) => {
    return api.get(GLOBAL.GET_LAGUAGES, payload);
  };

  const getProvinces = (payload?: object) => {
    return api.get(GLOBAL.GET_PROVINCE, payload);
  };

  /*
    HOME
  */
  const getBanner = (payload: object) => {
    return api.get(HOME.BANNER, payload);
  };
  const getHistoryBookings = (payload: object) => {
    return api.get(HOME.APPOINTMENTS, payload);
  };
  /*
    SETTINGS
  */
  const getSettingsOnboarding = (payload: object) => {
    return api.get(SETTINGS.GET_SETTINGS, payload);
  };

  /*
    PROFILE
  */
  const getProfile = (payload: object) => {
    return api.get(PROFILE.GET_PROFILE, payload);
  };

  const updateProfile = (payload: any) => {
    return api.put(PROFILE.UPDATE_PROFILE, payload);
  };

  const logoutApp = (payload?: object) => {
    return api.post(PROFILE.LOGOUT_APP, payload || {});
  };

  const deleteAccount = () => {
    return api.delete(PROFILE.GET_PROFILE);
  };

  /*
    NOTIFICATION
  */
  const getSettingNotify = (payload: any) => {
    return api.get(NOTIFICATION.SETTING, payload);
  };

  const updateSettingNotify = (payload: any) => {
    return api.post(NOTIFICATION.SETTING, payload);
  };

  const updateNotifyToken = (payload: any) => {
    return api.post(NOTIFICATION.UPDATE_FIREBASE_TOKEN, payload);
  };

  const getListNotify = (payload: any) => {
    return api.get(NOTIFICATION.GET_LIST, payload);
  };

  const markReadNotify = (payload: any) => {
    const id = payload?.idNotify ?? payload?.id;
    return api.put(`${NOTIFICATION.READ_NOTI}${id}`, {});
  };

  const getTotalUnreadNotify = (payload: any) => {
    return api.get(NOTIFICATION.TOTAL_UNREAD, payload);
  };

  /*
    CARELY
  */
  const getCarelyServices = (payload: any) => {
    return api.get(CARELY.SERVICES, payload);
  };

  /*
    CHANNEL
  */
  const getChannelDetail = (channelId: string) => {
    return api.get(`/channels/${channelId}`);
  };

  const updateChannel = (payload: any) => {
    const { id, ...data } = payload || {};
    return api.put(`/channels/${id}`, data);
  };

  return {
    api,
    setXAppLanguage,
    setXAppContent,
    setAuthorizationHeader,
    getAuthorizationHeader,
    deleteAuthorizationHeader,
    getHeader,

    /*
      GLOBAL
    */
    getTutorials,
    getLanguage,
    getProvinces,
    /*
      HOME
    */
    getBanner,
    getHistoryBookings,
    /*
      SETTINGS
    */
    getSettingsOnboarding,

    /*
      PROFILE
    */
    getProfile,
    updateProfile,
    logoutApp,
    deleteAccount,

    /*
      NOTIFICATION
    */
    getSettingNotify,
    updateSettingNotify,
    updateNotifyToken,
    getListNotify,
    markReadNotify,
    getTotalUnreadNotify,

    /*
      CARELY
    */
    getCarelyServices,
    /*
      CHANNEL
    */
    getChannelDetail,
    updateChannel,
  };
};

const ApiService = createApiClient();

export default ApiService;

