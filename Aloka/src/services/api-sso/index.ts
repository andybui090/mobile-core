import { create } from 'apisauce';
import Config from 'react-native-config';
import apiMonitor from './monitor';
import {
  AUTH,
} from './uris';
import i18n from "i18next";

const createApiClient = (baseURL = Config.SSO_API_URL) => {
  const api = create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      "x-app-id": "56d4128c-7732-4218-936c-ed5d82a810fb",
      "x-app-language": i18n.language,
      'x-app-name': "DoctorNetwork",
    },
    timeout: 20000,
  });

  const apiNotoken = create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      "x-app-id": "56d4128c-7732-4218-936c-ed5d82a810fb",
      "x-app-language": i18n.language,
      'x-app-name': "DoctorNetwork",
    },
    timeout: 20000,
  });

  api.addMonitor(apiMonitor);

  /*
    AUTHENTICATION
  */
  const setXAppLanguage = (payload: string) => {
    apiNotoken.setHeader('x-app-language', payload);
    return api.setHeader('x-app-language', payload);
  }

  const setAuthorizationHeader = (access_token: string) => {
    return api.setHeader('Authorization', 'Bearer ' + access_token);
  };

  const deleteAuthorizationHeader = async () => delete api.headers.Authorization;

  const login = (payload: object) => {
    return api.post(AUTH.LOGIN, payload);
  };

  const verifyOTP = (payload: object) => {
    // console.log(api.headers);
    return api.post(AUTH.VERIFY_OTP, payload);
  };

  const resendOTP = (payload: object) => {
    return api.post(AUTH.RESEND_OTP, payload);
  };

  const checkUsername = (payload: object) => {
    return api.get(AUTH.CHECK_USERNAME, payload);
  };

  const loginSocial = (payload: object) => {
    return api.post(AUTH.SOCIAL_LOGIN, payload);
  };

  return {
    setAuthorizationHeader,
    deleteAuthorizationHeader,
    login,
    loginSocial,
    verifyOTP,
    resendOTP,
    checkUsername,
    api,
    setXAppLanguage,
  };
};

const ApiSSO = createApiClient();

export default ApiSSO;