import { create } from 'apisauce';

import Config from 'react-native-config';
import apiMonitor from './monitor';
import { GLOBAL, HOME, SETTINGS, PROFILE, CARELY, NOTIFICATION, COMMUNITY, ORDER, PAYMENT } from './uris';
import i18n from 'i18next';
import { getObjectData } from '@/storages';
import { STORAGEKEY } from '@/constants';

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
    ORDER
  */
  const createOrder = (payload: any) => {
    return api.post(ORDER.CREATE, payload);
  };

  const getOrderDetail = (orderId: string) => {
    return api.get(ORDER.DETAIL(orderId));
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
    CHANNEL
  */
  const getChannelDetail = (channelId: string) => {
    return api.get(`/channels/${channelId}`);
  };

  const updateChannel = (payload: any) => {
    const { id, ...data } = payload || {};
    return api.put(`/channels/${id}`, data);
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
      ORDER
    */
    createOrder,
    getOrderDetail,
    /*
      PAYMENT
    */
    payWithMomo,
    payWithVnpay,
    getPaymentStatus,
    /*
      CHANNEL
    */
    getChannelDetail,
    updateChannel,

    /*
      COMMUNITY
    */
    getListRoom,
    getListHistoryChat,
  };
};

const ApiService = createApiClient();

export default ApiService;

