import { create } from 'apisauce';

import Config from 'react-native-config';
import apiMonitor from './monitor';
import { GLOBAL, HOME, SETTINGS, PROFILE, CARELY, NOTIFICATION, COMMUNITY, ORDER, PAYMENT, SCHEDULE, CHANNEL, ONBOARD } from './uris';
import i18n from 'i18next';
import { getObjectData } from '@/storages';
import { STORAGEKEY } from '@/constants';

const BASE_API_FALLBACK_URL = 'https://staging.rf.api.doctornetwork.us/v1';

const createApiClient = (baseURL = Config.BASE_API_URL || BASE_API_FALLBACK_URL) => {
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

  api.addAsyncRequestTransform(async request => {
    if (!request.headers) {
      request.headers = {};
    }
    if (!request.headers['Authorization']) {
      try {
        const jwtToken: any = await getObjectData(STORAGEKEY.JWT_TOKEN);
        if (jwtToken?.access_token) {
          request.headers['Authorization'] = 'Bearer ' + jwtToken.access_token;
          api.setHeader('Authorization', 'Bearer ' + jwtToken.access_token);
        }
      } catch (err) {
        console.log('Error getting token in request transform:', err);
      }
    }
  });

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

  const getCountries = (payload?: object) => {
    return api.get(GLOBAL.GET_COUNTRY, payload || {});
  };

  const searchLocation = (input: string) => {
    return api.get(GLOBAL.SEARCH_LOCATION, { input });
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
  const updateBookingStatus = (payload: any) => {
    const id = payload?.id || payload?._id;
    return api.put(`${HOME.APPOINTMENTS}/${id}`, payload);
  };
  /*
    SETTINGS
  */
  const getSettingsOnboarding = (payload: object) => {
    return api.get(SETTINGS.GET_SETTINGS, payload);
  };

  /*
    GLOBAL
  */
  const getCategories = (payload?: any) => {
    return api.get(GLOBAL.GET_CATEGORIES, payload || {});
  };

  /*
    ONBOARD
  */
  const getMedicaltypes = (payload?: object) => {
    return api.get(ONBOARD.GET_MEDICAL_TYPE, payload || {});
  };
  const signupUser = (payload: object) => {
    return api.post(ONBOARD.SIGN_UP, payload);
  };
  const doctorRegister = (payload: object) => {
    return api.post(ONBOARD.DOCTOR_REGISTER, payload);
  };
  const getSpecializations = (payload?: object) => {
    return api.get(ONBOARD.GET_SPECIALIZATIONS, payload || {});
  };
  const getTitleInfomations = (payload?: object) => {
    return api.get(ONBOARD.GET_TITLE_INFORMATION, payload || {});
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

  const getListFollowings = (payload: object) => {
    return api.get(PROFILE.FOLLOWINGS, payload);
  };

  const getListFollowers = (payload: object) => {
    return api.get(PROFILE.FOLLOWERS, payload);
  };

  const postFollow = (payload: any) => {
    return api.post(PROFILE.FOLLOW, payload);
  };

  const putUnFollow = (payload: any) => {
    const docId = payload?.doctorId || payload?.id;
    return api.put(`${PROFILE.FOLLOW}/${docId}`, payload?.data1 || payload || {});
  };

  const getVideosLiked = (payload: object) => {
    return api.get(PROFILE.LIST_VIDEO, payload);
  };

  const getVideosSaved = (payload: object) => {
    return api.get(PROFILE.LIST_VIDEO_SAVED, payload);
  };

  const getMyCourses = (payload: object) => {
    return api.get(PROFILE.MY_COURSES, payload);
  };

  const getMyPackages = (payload: object) => {
    return api.get(PROFILE.ORDERS, payload);
  };

  const postFeedback = (payload: object) => {
    return api.post(PROFILE.FEEDBACK, payload);
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

  const postRatingCarely = (payload: any) => {
    return api.post(CARELY.RATING, payload);
  };

  /*
    SCHEDULE / APPOINTMENT TIME
  */
  /**
   * Lấy danh sách giờ đã được book của channel.
   * Giống doctor-mobile-app: GET /appointments/time/:channelId
   * Kết quả dùng để đánh dấu slot bận khi render time grid.
   */
  const getChannelAppointmentTime = (channelId: string) => {
    return api.get(`${SCHEDULE.APPOINT_TIME}/${channelId}`);
  };

  /**
   * Lấy thông tin channel (bao gồm schedules, working hours).
   * GET /channels/:channelId
   */
  const getChannelDetail = (payload: any) => {
    const channelId =
      typeof payload === 'string'
        ? payload
        : payload?.channelId || payload?.id || payload?.channel_id;
    return api.get(CHANNEL.DETAIL(channelId));
  };

  const updateChannel = (payload: any) => {
    const channelId = payload?.id || payload?.channel_id;
    return api.put(CHANNEL.UPDATE(channelId), payload);
  };
  const createOrder = (payload: any) => {
    return api.post(ORDER.CREATE, payload);
  };

  const getOrderDetail = (orderId: string) => {
    return api.get(ORDER.DETAIL(orderId));
  };

  /** POST /orders/packages – mua gói (giống doctor-mobile-app BUY_PACKAGE) */
  const buyPackageFree = (payload: { package_id: string; payment: string }) => {
    return api.post(ORDER.SUBSCRIPTION, payload);
  };

  /** POST /appointments – đặt lịch sau khi mua gói (giống postBookingCall doctor-mobile-app) */
  const bookAppointment = (payload: any) => {
    return api.post(ORDER.APPOINTMENT, payload);
  };

  /*
    PAYMENT
  */
  const payWithMomo = (payload: {
    order_id: string;
    amount: number;
    redirect_url?: string;
    ipn_url?: string;
    extra_data?: string;
  }) => {
    return api.post(PAYMENT.MOMO, payload);
  };

  const payWithVnpay = (payload: {
    order_id: string;
    amount: number;
    return_url?: string;
    extra_data?: string;
  }) => {
    return api.post(PAYMENT.VNPAY, payload);
  };

  const getPaymentStatus = (orderId: string) => {
    return api.get(PAYMENT.STATUS(orderId));
  };

  /*
    COMMUNITY
  */
  const getListRoom = (payload: any) => {
    return api.get(COMMUNITY.GET_LISTROOM, payload);
  };

  const getListHistoryChat = (payload: { id: string; data?: any }) => {
    return api.get(
      `${COMMUNITY.GET_LISTHISTORYCHAT}/${payload.id}/messages`,
      payload.data,
    );
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
    searchLocation,
    /*
      HOME
    */
    getBanner,
    getHistoryBookings,
    updateBookingStatus,
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
    getListFollowings,
    getListFollowers,
    postFollow,
    putUnFollow,
    getVideosLiked,
    getVideosSaved,
    getMyCourses,
    getMyPackages,
    postFeedback,

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
    postRatingCarely,
    /*
      SCHEDULE / APPOINTMENT TIME
    */
    getChannelAppointmentTime,
    getChannelDetail,
    updateChannel,
    /*
      ORDER
    */
    createOrder,
    getOrderDetail,
    buyPackageFree,
    bookAppointment,
    /*
      PAYMENT
    */
    payWithMomo,
    payWithVnpay,
    getPaymentStatus,
    /*
      COMMUNITY
    */
    getListRoom,
    getListHistoryChat,
    /*
      ONBOARD
    */
    getMedicaltypes,
    signupUser,
    doctorRegister,
    getSpecializations,
    getTitleInfomations,
    getCategories,
    getCountries,
  };
};

export const getApiErrorMessage = (
  res: any,
  defaultMsg: string = 'Có lỗi xảy ra, vui lòng thử lại',
): string => {
  const data = res?.data;
  if (!data) return res?.problem || defaultMsg;
  if (typeof data === 'string') return data;
  if (data?.errors?.msg) return data.errors.msg;
  if (data?.errors?.message) return data.errors.message;
  if (Array.isArray(data?.errors)) {
    const first = data.errors[0];
    if (typeof first === 'string') return first;
    if (first?.msg) return first.msg;
    if (first?.message) return first.message;
  }
  if (typeof data?.errors === 'string') return data.errors;
  if (data?.message) return data.message;
  if (data?.msg) return data.msg;
  if (data?.error) {
    return typeof data.error === 'string'
      ? data.error
      : data.error?.msg || data.error?.message || defaultMsg;
  }
  return res?.problem || defaultMsg;
};

export const isApiSuccess = (res: any): boolean => {
  if (!res) return false;
  const isOkStatus = Boolean(res.ok || res.status === 200 || res.status === 201);
  const hasErrorStatus = res.data?.status === 'error';
  const hasErrors = Boolean(res.data?.errors);
  return isOkStatus && !hasErrorStatus && !hasErrors;
};

const ApiService = createApiClient();

export default ApiService;


