import { create } from 'apisauce';

import Config from 'react-native-config';
import apiMonitor from './monitor';
import {
  GLOBAL,
  HOME,
  SETTINGS,
  PROFILE,
  CARELY,
  ONBOARD,
  LOCATION,
  CHANNEL,
  APPOINTMENT,
  PACKAGE,
  COURSES,
} from './uris';
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
  const getCountries = (payload: object) => {
    return api.get(GLOBAL.GET_COUNTRY, payload);
  };
  const postFeedback = (payload: object) => {
    return api.post(GLOBAL.REPORT, payload);
  };
  const getListReport = (payload: object) => {
    return api.get(GLOBAL.LIST_REPORT, payload);
  };
  const postReport = (payload: object) => {
    return api.post(GLOBAL.REPORT, payload);
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

  const logoutApp = (payload?: object) => {
    return api.post(PROFILE.LOGOUT_APP, payload || {});
  };

  const deleteAccount = (payload: object) => {
    return api.delete(PROFILE.DELETE_ACCOUNT);
  };
  const putUpdateProfile = (payload: object) => {
    return api.put(PROFILE.UPDATE_PROFILE, payload);
  };
  const getMyPackages = (payload: any) => {
    return api.get(`${PROFILE.ORDERS}`, payload);
  };
  /*
    ONBOARD
  */
  const getMedicalTypes = (payload: object) => {
    return api.get(ONBOARD.GET_MEDICAL_TYPE, payload);
  };
  const signupUser = (payload: object) => {
    return api.post(ONBOARD.SIGN_UP, payload);
  };
  const getCategories = (payload: any) => {
    return api.get(GLOBAL.GET_CATEGORIES, payload);
  };
  const expertRegister = (payload: object) => {
    return api.post(ONBOARD.EXPERT_REGISTER, payload);
  };
  const getSpecializations = (payload: object) => {
    return api.get(ONBOARD.GET_SPECIALIZATIONS, payload);
  };
  const getTitleInfomations = (payload: object) => {
    return api.get(ONBOARD.GET_TITLE_INFORMATION, payload);
  };
  const updateExpertProfile = (payload: object) => {
    return api.put(PROFILE.UPDATE_PROFILE, payload);
  };

  /*
    CARELY
  */
  const getCarelyServices = (payload: any) => {
    return api.get(CARELY.SERVICES, payload);
  };
  const getCarelyPackageDetail = (payload: any) => {
    return api.get(`${CARELY.SERVICES}/${payload.packageId}`, payload);
  };
  const refundAfterBookingFailed = (payload: any) => {
    return api.post(CARELY.REFUND, payload);
  };
  /*
    LOCATION
  */
  const getListSearch = (payload: object) => {
    return api.get(LOCATION.SEARCH_LOCATION, payload);
  };

  /*
    CHANNEL
  */
  const getChannelDetail = (payload: any) => {
    return api.get(`${CHANNEL.GET_CHANNEL}/${payload.channelId}`);
  };
  const getChannelAppointmentTime = (payload: any) => {
    return api.get(`${PACKAGE.APPOINT_TIME}/${payload.channelId}`);
  };
  const postBookingCall = (payload: any) => {
    return api.post(`${CHANNEL.BOOKING_CALL}`, payload);
  };
  const getListChannel = (payload: any) => {
    return api.get(CHANNEL.GET_CHANNEL, payload);
  };
  const getChannelDetailServicesPackage = (payload: any) => {
    return api.get(PACKAGE.PACKAGES, payload);
  };
  const putChannel = (payload: any) => {
    return api.put(`${CHANNEL.GET_CHANNEL}/${payload.id}`, payload);
  };
  const postChannelPackage = (payload: any) => {
    return api.post(PACKAGE.PACKAGES, payload);
  };
  const putChannelPackage = (payload: any) => {
    return api.put(`${PACKAGE.PACKAGES}/${payload.id}`, payload);
  };
  const getListMembership = (payload: any) => {
    return api.get(CHANNEL.GET_MEMBERSHIP, payload);
  };
  /*
      BOOKING
    */
  const updateBookingStatus = (payload: any) => {
    return api.put(`${APPOINTMENT.APPOINTMENTS}/${payload?.id}`, payload);
  };

  const buyPackage = (payload: any) => {
    return api.post(`${CHANNEL.BUY_PACKAGE}`, payload);
  };

  const getPaymentStatus = (payload: any) => {
    return api.get(`${PACKAGE.GET_PAYMENT_STATUS}/${payload.orderId}`);
  };

  const getMyPackagesBeforeBooking = (packageId: any) => {
    return api.get(`/packages/my?package_id=${packageId}`);
  };

  const getVoucherByPackage = (payload: any) => {
    return api.get(`vouchers/by-package`, payload);
  };

  const getVoucherCourse = (payload: object) => {
    return api.post(COURSES.VERIFY_COURSE, payload);
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
    getCountries,
    postFeedback,
    getListReport,
    postReport,
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
    logoutApp,
    deleteAccount,
    putUpdateProfile,
    getMyPackages,
    /*
      ONBOARD
    */
    getMedicalTypes,
    signupUser,
    getCategories,
    expertRegister,
    getSpecializations,
    getTitleInfomations,
    updateExpertProfile,

    /*
      SERVICE
    */
    getCarelyServices,
    getCarelyPackageDetail,
    refundAfterBookingFailed,
    /*
      LOCATION
    */
    getListSearch,

    /*
      CHANNEL
    */
    getChannelDetail,
    getChannelAppointmentTime,
    postBookingCall,
    getListChannel,
    getChannelDetailServicesPackage,
    putChannel,
    postChannelPackage,
    putChannelPackage,
    getListMembership,
    /*
      BOOKING
    */
    updateBookingStatus,
    buyPackage,
    getPaymentStatus,
    getMyPackagesBeforeBooking,
    getVoucherByPackage,
    getVoucherCourse,
  };
};

const ApiService = createApiClient();

export default ApiService;
