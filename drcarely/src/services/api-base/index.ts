import {create} from 'apisauce';

import Config from 'react-native-config';
import apiMonitor from './monitor';
// import setInterceptor from './interceptor';
import {
  GLOBAL,
  PROFILE,
  ONBOARD,
  HOME,
  NEARBY,
  VIDEO,
  SEARCH,
  COURSES,
  VIDEO_COMMENT,
  NOTIFICATION,
  CHANNEL,
  COMMUNITY,
  ADVERTISING,
  SETTINGS,
  NEWSFEED,
  PACKAGE,
  CARELY,
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
  // setInterceptor(api);

  /*
    GLOBAL
  */
  const setXAppLanguage = (payload: string) => {
    return api.setHeader('x-app-language', payload);
  };

  const setXAppContent = (payload: string) => {
    // console.log("🚀 ~ setXAppContent ~ payload:", payload)
    return api.setHeader('x-app-content', payload);
  };

  const getTutorials = (payload: object) => {
    return api.get(GLOBAL.GET_TUTORIAL, payload);
  };
  const getCategories = (payload: any) => {
    return api.get(GLOBAL.GET_CATEGORIES, payload);
  };
  const getLanguage = (payload: object) => {
    return api.get(GLOBAL.GET_LAGUAGES, payload);
  };
  const getCountries = (payload: object) => {
    return api.get(GLOBAL.GET_COUNTRY, payload);
  };
  const getProvinces = (payload: object) => {
    return api.get(GLOBAL.GET_PROVINCE, payload);
  };
  const getDistricts = (payload: object) => {
    return api.get(GLOBAL.GET_DISTRICT, payload);
  };
  const getWards = (payload: object) => {
    return api.get(GLOBAL.GET_WARD, payload);
  };
  const getRegions = (payload: object) => {
    return api.get(GLOBAL.GET_REGION, payload);
  };
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
    PROFILE
  */
  const getProfile = (payload: object) => {
    return api.get(PROFILE.PROFILE, payload);
  };
  const logoutApp = (payload: object) => {
    return api.post(PROFILE.LOGOUT_APP, payload);
  };
  const getVideoliked = (payload: object) => {
    return api.get(PROFILE.LIST_VIDEO, payload);
  };
  const getVideoSaved = (payload: object) => {
    return api.get(PROFILE.LIST_VIDEO_SAVED, payload);
  };
  const deleteAccount = (payload: object) => {
    return api.delete(PROFILE.PROFILE);
  };
  const postFeedback = (payload: object) => {
    return api.post(PROFILE.FEEDBACK, payload);
  };
  const putUpdateProfile = (payload: object) => {
    return api.put(PROFILE.PROFILE, payload);
  };
  const getMyCourse = (payload: object) => {
    return api.get(PROFILE.MY_COURSES, payload);
  };
  const getHistoryBookings = (payload: object) => {
    return api.get(PROFILE.APPOINTMENTS, payload);
  };
  const getCreateEbizNameCard = (payload: object) => {
    return api.post(PROFILE.NAMECARDS, payload);
  };
  const putUpdateEbizNameCard = (payload: any) => {
    return api.put(`${PROFILE.NAMECARDS}/${payload?.id}`, payload);
  };
  const deleteEbizNameCard = (payload: any) => {
    return api.delete(`${PROFILE.NAMECARDS}/${payload?.id}`);
  };
  const getVideoManagement = (payload: object) => {
    return api.get(PROFILE.LIST_VIDEO, payload);
  };
  const getListFollowings = (payload: object) => {
    return api.get(PROFILE.FOLLOWINGS, payload);
  };
  const getListFollower = (payload: object) => {
    return api.get(PROFILE.FOLLOWERS, payload);
  };
  const putUnFollow = (payload: any) => {
    return api.put(`${PROFILE.FOLLOW}/${payload.doctorId}`, payload.data1);
  };
  const postFollow = (payload: any) => {
    return api.post(PROFILE.FOLLOW, payload);
  };

  const getListEbizNameCard = (payload: object) => {
    return api.get(PROFILE.NAMECARDS, payload);
  };

  /*
    ONBOARD
  */
  const getMedicaltypes = (payload: object) => {
    return api.get(ONBOARD.GET_MEDICAL_TYPE, payload);
  };
  const signupUser = (payload: object) => {
    return api.post(ONBOARD.SIGN_UP, payload);
  };
  const getSpecializations = (payload: object) => {
    return api.get(ONBOARD.GET_SPECIALIZATIONS, payload);
  };
  const getTitleInfomations = (payload: object) => {
    return api.get(ONBOARD.GET_TITLE_INFORMATION, payload);
  };
  const getClinics = (payload: object) => {
    return api.get(ONBOARD.GET_CLINIC, payload);
  };
  const getClinicTypes = (payload: object) => {
    return api.get(ONBOARD.GET_CLINIC_TYPE, payload);
  };
  const createClinic = (payload: object) => {
    return api.post(ONBOARD.CREATE_CLINIC, payload);
  };
  const doctorRegister = (payload: object) => {
    return api.post(ONBOARD.DOCTOR_REGISTER, payload);
  };
  const updateDoctorProfile = (payload: object) => {
    return api.put(PROFILE.PROFILE, payload);
  };
  const studentRegister = (payload: object) => {
    return api.post(ONBOARD.STUDENT_REGISTER, payload);
  };
  const updateStudentProfile = (payload: object) => {
    return api.put(PROFILE.PROFILE, payload);
  };
  /*
    HOME
  */
  const getBanner = (payload: object) => {
    return api.get(HOME.BANNER, payload);
  };
  const getTrending = (payload: object) => {
    return api.get(HOME.TRENDING, payload);
  };
  const getListVideosHome = (payload: object) => {
    return api.get(HOME.VIDEOS, payload);
  };
  const postFollowExpert = (payload: object) => {
    return api.post(HOME.FOLLOW_EXPERT, payload);
  };
  const putUnFollowExpert = (payload: any) => {
    return api.put(`${HOME.FOLLOW_EXPERT}/${payload.doctorId}`, {
      is_followed: payload.is_followed,
    });
  };
  const postFollowChannel = (payload: object) => {
    // console.log("========== postFollowChannel header", api.headers);
    return api.post(HOME.FOLLOW_CHANNEL, payload);
  };
  const postLikeVideo = (payload: object) => {
    return api.post(HOME.LIKE_ITEM, payload);
  };
  const putUnLikeVideo = (payload: any) => {
    return api.put(`${HOME.LIKE_ITEM}/${payload.id}`, {
      is_liked: payload.is_liked,
      type: payload.type,
    });
  };
  const getListReport = (payload: object) => {
    return api.get(HOME.LIST_REPORT, payload);
  };
  const postReport = (payload: object) => {
    return api.post(HOME.CREATE_REPORT, payload);
  };
  const postShareVideo = (payload: object) => {
    return api.post(HOME.SHARE_VIDEO, payload);
  };
  const postViewVideo = (payload: object) => {
    return api.post(HOME.VIEW_VIDEO, payload);
  };
  const getVideoDetailNoti = (payload: any) => {
    return api.get(`${HOME.VIDEOS}/${payload?.video_id}`);
  };

  const postSaveVideoExecute = (payload: object) => {
    return api.post(HOME.SAVE_ITEM, payload);
  };
  const putUnSaveVideoExecute = (payload?: any) => {
    return api.put(`${HOME.SAVE_ITEM}/${payload?.video_id}`, payload);
  };
  const getListSuggestChannel = (payload: object) => {
    return api.get(HOME.CHANNEL_SUGGESTION, payload);
  };
  const getListSuggestExpert = (payload: object) => {
    return api.get(HOME.EXPERT_SUGGESTION, payload);
  };
  const getListSuggestDrugStore = (payload: object) => {
    return api.get(HOME.DRUG_STORE_SUGGESTION, payload);
  };
  // NEAR BY
  const getListSearch = (payload: object) => {
    return api.get(NEARBY.SEARCH_LOCATION, payload);
  };
  const getListNearbyChannel = (payload: object) => {
    return api.get(CHANNEL.GET_CHANNEL, payload);
  };
  const getListNearbyStore = (payload: object) => {
    return api.get(NEARBY.STORES, payload);
  };
  const postFollowDoctor = (payload: object) => {
    return api.post(NEARBY.FOLLOW, payload);
  };
  const putFollowDoctor = (payload: any) => {
    return api.put(`${NEARBY.FOLLOW}/${payload?.id}`, payload);
  };
  const getExpertProfile = (payload: any) => {
    return api.get(`${NEARBY.DOCTORS}/${payload?.doctorId}`);
  };
  const getVideosAll = (payload: object) => {
    return api.get(NEARBY.LIST_VIDEO, payload);
  };
  const getDetailStores = (payload: any) => {
    return api.get(`${NEARBY.STORES}/${payload?.id}`, payload);
  };
  const getListSeriesExper = (payload: any) => {
    return api.get(VIDEO.SERIES, payload);
  };

  //VIDEO
  const getVideoTrending = (payload: object) => {
    return api.get(VIDEO.TRENDING, payload);
  };
  const getVideoForYou = (payload: object) => {
    return api.get(VIDEO.FORYOU, payload);
  };
  const getVideoFollow = (payload: object) => {
    return api.get(VIDEO.FOLLOW, payload);
  };
  const unlikeVideo = (payload: any) => {
    return api.put(VIDEO.LIKE_VIDEO + `/${payload.video_id}`, payload);
  };
  const likeVideo = (payload: object) => {
    return api.post(VIDEO.LIKE_VIDEO, payload);
  };
  const getListReportVideo = (payload: object) => {
    return api.get(VIDEO.REPORT, payload);
  };
  const hideVideo = (payload: object) => {
    return api.post(VIDEO.HIDE, payload);
  };
  const reportVideo = (payload: object) => {
    return api.post(VIDEO.REPORT_VIDEO, payload);
  };
  const deleteVideo = (payload: any) => {
    return api.delete(`${VIDEO.DELETE_VIDEO}/${payload?.video_id}`);
  };
  //SEARCH
  const getSearchDefault = (payload: object) => {
    return api.get(SEARCH.DEFAULT, payload);
  };

  const postUploadVideo = (form: FormData) => {
    return api.post(VIDEO.ENCODING_UPLOAD, form, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  };

  const getCategoryVideo = (payload: object) => {
    return api.get(VIDEO.VIDEOS_CATEGORIES, payload);
  };

  const postVideo = (payload: object) => {
    return api.post(VIDEO.VIDEO, payload);
  };
  const getListSeries = (payload: object) => {
    return api.get(VIDEO.SERIES, payload);
  };
  const createSeries = (payload: object) => {
    return api.post(VIDEO.SERIES, payload);
  };
  const getSearchChannels = (payload: object) => {
    return api.get(SEARCH.CHANNEL, payload);
  };
  const getSearchDoctors = (payload: object) => {
    return api.get(SEARCH.DOCTOR, payload);
  };
  const getSearchStores = (payload: object) => {
    return api.get(SEARCH.STORE, payload);
  };
  const getSearchVideoTabs = (payload: object) => {
    return api.get(SEARCH.VIDEO_TAB, payload);
  };
  const getSearchDoctorTabs = (payload: object) => {
    return api.get(SEARCH.DOCTOR_TAB, payload);
  };
  const getSearchStoreTabs = (payload: object) => {
    return api.get(SEARCH.STORE_TAB, payload);
  };
  const getSearchChannelTabs = (payload: object) => {
    return api.get(SEARCH.CHANNEL_TAB, payload);
  };
  //-- COURSE
  const getCourseToppick = (payload: object) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getCategoryCouse = (payload: object) => {
    return api.get(COURSES.CATEGORY_COURSE, payload);
  };
  const getDetailCourse = (payload: any) => {
    return api.get(`${COURSES.COURSE}/${payload?.id}`);
  };
  const getListMySave = (payload: object) => {
    return api.get(COURSES.LIST_MY_SAVE, payload);
  };
  const postSaveCousre = (payload: object) => {
    return api.post(COURSES.SAVE_COURSE, payload);
  };
  const putUnSaveCousre = (payload: any) => {
    return api.put(`${COURSES.SAVE_COURSE}/${payload.id}`, payload.data);
  };
  const getListReviewCousre = (payload: any) => {
    return api.get(COURSES.REVIEW_COURSE, payload);
  };

  const postReviewCousre = (payload: any) => {
    return api.post(COURSES.REVIEW_COURSE, payload);
  };
  const postCourseEnrollment = (payload: any) => {
    return api.post(COURSES.COURSE_ENROLLMENTS, payload);
  };
  const getCertificates = (payload: any) => {
    return api.get(`${COURSES.CERTIFICATE}/${payload?.course_id}`);
    // return api.get(`${COURSES.CERTIFICATE}/${payload?.fq}`);
  };
  const postLessonperiods = (payload: any) => {
    return api.post(COURSES.LESSON_VIEW, payload);
  };

  const getListDiscussions = (payload: any) => {
    return api.get(COURSES.COMMENTS, payload);
  };
  const sendDiscussions = (payload: any) => {
    return api.post(COURSES.COMMENTS, payload);
  };

  const createCommentDiscussions = (payload: any) => {
    return api.post(COURSES.COMMENTS, payload);
  };
  const getListCommentOfPost = (payload: any) => {
    return api.get(COURSES.COMMENTS, payload);
  };
  const postLikeComment = (payload: any) => {
    return api.post(COURSES.LIKE_COMMENTS, payload);
  };
  const getListRecommendedCourses = (payload: any) => {
    return api.get(`${COURSES.COURSE}`, payload);
  };
  const buyCourse = (payload: any) => {
    return api.post(`${COURSES.BUY_COURSE}`, payload);
  };
  const postVoucherCourse = (payload: object) => {
    return api.post(COURSES.BUY_COURSE, payload);
  };
  const getVoucherCourse = (payload: object) => {
    return api.post(COURSES.VERIFY_COURSE, payload);
  };
  /*
    VIDEO COMMENT
  */
  const getListVideoComments = (payload: any) => {
    return api.get(VIDEO_COMMENT.COMMENTS, payload);
  };
  const createVideoComments = (payload: any) => {
    return api.post(VIDEO_COMMENT.COMMENTS, payload);
  };
  const likeVideoComment = (payload: any) => {
    return api.post(VIDEO_COMMENT.LIKE, payload);
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
    return api.put(NOTIFICATION.READ_NOTI + payload.id, {});
  };
  const getTotalUnreadNotify = (payload: any) => {
    return api.get(NOTIFICATION.TOTAL_UNREAD, payload);
  };
  /*
    CHANNEL
  */
  const getChannelDetail = (payload: any) => {
    return api.get(`${CHANNEL.GET_CHANNEL}/${payload.channelId}`);
  };
  const getVideoChannel = (payload: any) => {
    return api.get(CHANNEL.TOP_11_VIDEO, payload);
  };
  const getSerriesChannel = (payload: any) => {
    return api.get(CHANNEL.SERIES, payload);
  };
  const getChannelDetailNewsfeed = (payload: any) => {
    return api.get(CHANNEL.NEWSFEED, payload);
  };
  const getChannelDetailServicesPackage = (payload: any) => {
    return api.get(PACKAGE.PACKAGES, payload);
  };
  const postChannelPackage = (payload: any) => {
    return api.post(PACKAGE.PACKAGES, payload);
  };
  const putChannelPackage = (payload: any) => {
    return api.put(`${PACKAGE.PACKAGES}/${payload.id}`, payload);
  };
  const putChannel = (payload: any) => {
    return api.put(`${CHANNEL.GET_CHANNEL}/${payload.id}`, payload);
  };
  const getPackageHot = (payload: any) => {
    return api.get(PACKAGE.PACKAGES, payload);
  };
  /*
    COMMUNITY
  */
  const getListRoom = (payload: any) => {
    return api.get(COMMUNITY.GET_LISTROOM, payload);
  };
  const getListFriends = (payload: any) => {
    return api.get(COMMUNITY.GET_LISTFRIEND, payload);
  };
  const getListHistoryChat = (payload: any) => {
    return api.get(
      `${COMMUNITY.GET_LISTHISTORYCHAT}/${payload.id}/messages`,
      payload.data,
    );
  };
  const getListMemberGroup = (payload: any) => {
    return api.get(
      `${COMMUNITY.GET_LISTMEMBERGROUP}/${payload.id}/members`,
      payload.data,
    );
  };

  const getListMemberGroupChat = (payload: any) => {
    return api.get(
      `${COMMUNITY.GET_LISTMEMBERGROUP}/${payload.id}/members`,
      payload.data,
    );
  };

  const postMessageSeen = (payload: any) => {
    return api.post(`${COMMUNITY.POST_MESSAGE_SEEN}`, payload);
  };

  const getListRequestFriends = (payload: any) => {
    return api.get(`${COMMUNITY.REQUEST_FRIENDS}`, payload);
  };

  const getListRequestFriendsInvited = (payload: any) => {
    return api.get(`${COMMUNITY.REQUEST_FRIENDS}?type=invited`, payload);
  };

  const getListRequestFriendsWaitting = (payload: any) => {
    return api.get(`${COMMUNITY.REQUEST_FRIENDS}?type=waiting`, payload);
  };

  const getListSearchFriends = (payload: any) => {
    return api.get(
      `${COMMUNITY.REQUEST_FRIENDS}/search?s=${payload.phone}`,
      payload,
    );
  };

  const getListEmoji = (payload: any) => {
    return api.get(`${COMMUNITY.GET_EMOJI}`, payload);
  };

  const getAdvertising = (payload: any) => {
    return api.get(ADVERTISING.GET_ADVERTISING, payload);
  };

  // course version 2
  const getCourseOutstanding = (payload: object) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getCourseTraining = (payload: object) => {
    return api.get(`${COURSES.TRAINING_COURSES}?sort=view_priority`, payload);
  };
  const getCourseTrainingCME = (payload: object) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getCourseExploreNow = (payload: object) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getCourseFree = (payload: object) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getCourseEBook = (payload: object) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getCourseEBookFree = (payload: object) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getDetailCourseTraining = (payload: any) => {
    return api.get(`${COURSES.TRAINING_COURSES_DETAIL}/${payload?.id}`);
  };
  const getCourseExclusiveContent = (payload: any) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getCourseTrainingELearning = (payload: any) => {
    return api.get(COURSES.COURSE, payload);
  };
  const getCourseTrainingEbook = (payload: any) => {
    return api.get(COURSES.COURSE, payload);
  };

  // settings
  const getSettings = (payload: object) => {
    return api.get(SETTINGS.GET_SETTINGS, payload);
  };

  // newsfeed
  const createNewsfeed = (payload: any) => {
    return api.post(NEWSFEED.CREATE_NEWSFEED, payload);
  };
  const getListNewsfeed = (payload: object) => {
    return api.get(NEWSFEED.HOME, payload);
  };
  const getListOneNewsfeed = (payload: object) => {
    return api.get(NEWSFEED.HOME, payload);
  };
  const getNewsfeedDetail = (payload: any) => {
    return api.get(`${NEWSFEED.LIST_COMMENT}/${payload?.id}`);
  };
  const postReactionFeed = (payload: any) => {
    return api.post(
      `${NEWSFEED.CREATE_NEWSFEED}/${payload.feed_id}/reactions`,
      payload,
    );
  };
  const getDetailReactionFeed = (payload: any) => {
    return api.get(
      `${NEWSFEED.CREATE_NEWSFEED}/${payload.feed_id}/reactions/popups`,
      payload,
    );
  };
  const postShareFeed = (payload: any) => {
    return api.post(
      `${NEWSFEED.CREATE_NEWSFEED}/${payload.feed_id}/shares`,
      payload,
    );
  };
  const getListChannel = (payload: any) => {
    return api.get(CHANNEL.GET_CHANNEL, payload);
  };
  const getListMembership = (payload: any) => {
    return api.get(CHANNEL.GET_MEMBERSHIP, payload);
  };
  const createNewsfeedAi = (payload: any) => {
    // console.log("===========", api.headers);
    return api.post(NEWSFEED.NEWSFEED_AI, payload);
  };
  //commnet newsfeed
  const getListComment = (payload: any) => {
    return api.get(
      `${NEWSFEED.LIST_COMMENT}/${payload?.id}/comments`,
      payload.data,
    );
  };
  const createComment = (payload: any) => {
    return api.post(
      `${NEWSFEED.LIST_COMMENT}/${payload?.id}/comments`,
      payload.data,
    );
  };
  const getListCommentReply = (payload: any) => {
    return api.get(
      `${NEWSFEED.LIST_COMMENT}/${payload?.id}/comments/${payload?.idCmt}/replies`,
      payload.data,
    );
  };
  const createCommentReply = (payload: any) => {
    return api.post(
      `${NEWSFEED.LIST_COMMENT}/${payload?.id}/comments`,
      payload.data,
    );
  };
  const deleteComment = (payload: any) => {
    return api.delete(
      `${NEWSFEED.LIST_COMMENT}/${payload?.id}/comments/${payload?.idCmt}`,
    );
  };
  const deleteNewsFeed = (payload: any) => {
    return api.delete(`${NEWSFEED.LIST_COMMENT}/${payload?.id}`);
  };
  //background chat
  const getBackground = (payload: object) => {
    return api.get(COMMUNITY.BACKGROUND, payload);
  };

  const createBackground = (payload: object) => {
    return api.post(COMMUNITY.BACKGROUND, payload);
  };

  const getListTypeRoom = (payload: any) => {
    return api.get(COMMUNITY.GET_TYPE_LISTROOM, payload);
  };

  const buyPackage = (payload: any) => {
    return api.post(`${CHANNEL.BUY_PACKAGE}`, payload);
  };

  const getMyPackages = (payload: any) => {
    return api.get(`${PROFILE.ORDERS}`, payload);
  };

  const postBookingCall = (payload: any) => {
    return api.post(`${CHANNEL.BOOKING_CALL}`, payload);
  };

  const updateBookingStatus = (payload: any) => {
    return api.put(`${CHANNEL.BOOKING_CALL}/${payload?.id}`, payload);
  };

  const updateChatPremiumStatus = (payload: any) => {
    return api.put(`/rooms/${payload?.id}/update`, payload.dataUpdate);
  };

  const updateRemainCallChat = (payload: any) => {
    return api.post(PACKAGE.PACKAGE_USED, payload);
  };

  const getChannelAppointmentTime = (payload: any) => {
    return api.get(`${PACKAGE.APPOINT_TIME}/${payload.channelId}`);
  };

  // Carely
  const getCarelyServices = (payload: any) => {
    return api.get(CARELY.SERVICES, payload);
  };

  const postRatingCarely = (payload: any) => {
    return api.post(CARELY.RATING, payload);
  };

  const getCarelyPackageDetail = (payload: any) => {
    return api.get(`${CARELY.SERVICES}/${payload.packageId}`, payload);
  };

  const getPaymentStatus = (payload: any) => {
    return api.get(`${GLOBAL.GET_PAYMENT_STATUS}/${payload.orderId}`);
  };

  const refundAfterBookingFailed = (payload: any) => {
    return api.post(CARELY.REFUND, payload);
  };

  const getCarelyReviews = (payload: any) => {
    return api.get(`packages/${payload.packageId}${CARELY.REVIEW}`, {
      params: payload,
    });
  };

  return {
    api,
    setXAppLanguage,
    setXAppContent,
    //global
    getTutorials,
    getCategories,
    getLanguage,
    getCountries,
    getProvinces,
    getDistricts,
    getWards,
    getRegions,
    //auth
    setAuthorizationHeader,
    getAuthorizationHeader,
    deleteAuthorizationHeader,
    getHeader,
    //onboard
    getMedicaltypes,
    signupUser,
    getSpecializations,
    getTitleInfomations,
    getClinics,
    getClinicTypes,
    createClinic,
    doctorRegister,
    updateDoctorProfile,
    studentRegister,
    updateStudentProfile,
    //home
    getBanner,
    getTrending,
    getListVideosHome,
    getListSuggestChannel,
    getListSuggestExpert,
    getListSuggestDrugStore,
    postFollowExpert,
    postFollowChannel,
    putUnFollowExpert,
    postLikeVideo,
    putUnLikeVideo,
    postSaveVideoExecute,
    putUnSaveVideoExecute,
    getListReport,
    postReport,
    postShareVideo,
    postViewVideo,
    getVideoDetailNoti,
    //profile
    getProfile,
    logoutApp,
    getVideoliked,
    getVideoSaved,
    deleteAccount,
    postFeedback,
    putUpdateProfile,
    getMyCourse,
    getHistoryBookings,
    getCreateEbizNameCard,
    putUpdateEbizNameCard,
    deleteEbizNameCard,
    getVideoManagement,
    getListFollower,
    getListFollowings,
    putUnFollow,
    postFollow,
    //near by
    getListSearch,
    getListNearbyChannel,
    getListNearbyStore,
    postFollowDoctor,
    putFollowDoctor,
    getListEbizNameCard,
    getDetailStores,
    getListSeriesExper,
    //video
    getVideoTrending,
    getVideoForYou,
    getVideoFollow,
    getExpertProfile,
    getVideosAll,
    likeVideo,
    unlikeVideo,
    getListReportVideo,
    hideVideo,
    reportVideo,
    deleteVideo,
    //search
    getSearchDefault,
    postUploadVideo,
    getCategoryVideo,
    postVideo,
    getListSeries,
    createSeries,
    getSearchChannels,
    getSearchDoctors,
    getSearchStores,
    getSearchVideoTabs,
    getSearchDoctorTabs,
    getSearchStoreTabs,
    getSearchChannelTabs,
    //course
    getCourseToppick,
    getCategoryCouse,
    getDetailCourse,
    getListMySave,
    postSaveCousre,
    putUnSaveCousre,
    getListReviewCousre,
    postReviewCousre,
    postCourseEnrollment,
    getCertificates,
    postLessonperiods,
    getListDiscussions,
    sendDiscussions,
    createCommentDiscussions,
    getListCommentOfPost,
    postLikeComment,
    getListRecommendedCourses,
    buyCourse,
    postVoucherCourse,
    getVoucherCourse,
    //comment
    getListVideoComments,
    createVideoComments,
    likeVideoComment,
    //notification
    getSettingNotify,
    updateSettingNotify,
    updateNotifyToken,
    getListNotify,
    markReadNotify,
    getTotalUnreadNotify,
    //channel
    getChannelDetail,
    getVideoChannel,
    getSerriesChannel,
    getChannelDetailNewsfeed,
    getChannelDetailServicesPackage,
    postChannelPackage,
    putChannelPackage,
    putChannel,
    getPackageHot,
    //community
    getListRoom,
    getListFriends,
    getListHistoryChat,
    getListMemberGroup,
    getListMemberGroupChat,
    postMessageSeen,
    getListRequestFriends,
    getListRequestFriendsInvited,
    getListRequestFriendsWaitting,
    getListSearchFriends,
    getListEmoji,
    getListTypeRoom,
    // advertising
    getAdvertising,
    // course version 2
    getCourseOutstanding,
    getCourseTraining,
    getCourseTrainingCME,
    getCourseExploreNow,
    getCourseFree,
    getCourseEBook,
    getCourseEBookFree,
    getDetailCourseTraining,
    getCourseExclusiveContent,
    getCourseTrainingELearning,
    getCourseTrainingEbook,
    // setting
    getSettings,
    // newsfeed
    createNewsfeed,
    getListNewsfeed,
    postReactionFeed,
    getDetailReactionFeed,
    postShareFeed,
    getListOneNewsfeed,
    getNewsfeedDetail,
    getListChannel,
    getListMembership,
    createNewsfeedAi,
    //commentnewsfeed
    getListComment,
    createComment,
    createCommentReply,
    getListCommentReply,
    deleteComment,
    deleteNewsFeed,
    //background Chat
    getBackground,
    createBackground,
    buyPackage,
    getMyPackages,
    postBookingCall,
    updateBookingStatus,
    // end chat premium
    updateChatPremiumStatus,
    updateRemainCallChat,
    getChannelAppointmentTime,
    // carely
    getCarelyServices,
    postRatingCarely,
    getCarelyPackageDetail,
    getPaymentStatus,
    refundAfterBookingFailed,
    getCarelyReviews,
  };
};

const ApiService = createApiClient();

export default ApiService;
