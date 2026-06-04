import createHttpClient from '@/services/httpClient';
import apiMonitor from '@/services/apiMonitor';
import Config from 'react-native-config';
import {
  GLOBAL,
} from './uris';
import i18n from 'i18next';

const createApiClient = (baseURL = Config.BASE_API_URL) => {
  // default timeout 20s
  const client = createHttpClient({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'x-app-id': '56d4128c-7732-4218-936c-ed5d82a810fb',
      'x-app-content': '',
      'x-app-language': i18n.language,
      'x-app-name': 'DoctorNetwork',
    },
  });

  // attach monitor for logging
  if (apiMonitor) {
    client.addMonitor(apiMonitor);
  }

  /*
    GLOBAL
  */
  const setXAppLanguage = (payload: string) => {
    return client.setHeader('x-app-language', payload);
  };

  const setXAppContent = (payload: string) => {
    return client.setHeader('x-app-content', payload);
  };

  const getTutorials = (payload: object) => {
    return client.get(GLOBAL.GET_TUTORIAL, payload);
  };
  /*
    AUTHENTICATION
  */
  const setAuthorizationHeader = (access_token: string) => {
    return client.setHeader('Authorization', 'Bearer ' + access_token);
  };
  const getAuthorizationHeader = () => {
    return (client.getHeaders() as Record<string, any>).Authorization;
  };
  const deleteAuthorizationHeader = () => client.deleteHeader('Authorization');

  const getHeader = () => {
    return client.getHeaders();
  };
  

  return {
    api: client.instance,
    setXAppLanguage,
    setXAppContent,
    //global
    getTutorials,
    //auth
    setAuthorizationHeader,
    getAuthorizationHeader,
    deleteAuthorizationHeader,
    getHeader,
    //onboard
  };
};

const ApiService = createApiClient();

export default ApiService;
