import { create } from 'apisauce';

import Config from 'react-native-config';
import apiMonitor from './monitor';
import { GLOBAL, SETTINGS, PROFILE, CHANNELS } from './uris';
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

  /*
    CHANNELS & SCHEDULES
  */
  const getChannelDetail = (channelId: string) => {
    return api.get(CHANNELS.GET_CHANNEL_DETAIL(channelId));
  };

  const updateChannel = (payload: {
    id: string;
    schedules: string | Array<Record<string, any>>;
    [key: string]: any;
  }) => {
    const { id, ...rest } = payload;
    return api.put(CHANNELS.UPDATE_CHANNEL_SCHEDULE(id), rest);
  };

  const updateChannelSchedule = updateChannel;

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

    /*
      SETTINGS
    */
    getSettingsOnboarding,
    
    /*
      PROFILE
    */
    getProfile,

    /*
      CHANNELS & SCHEDULES
    */
    getChannelDetail,
    updateChannel,
    updateChannelSchedule,
  };
};

const ApiService = createApiClient();

export default ApiService;
