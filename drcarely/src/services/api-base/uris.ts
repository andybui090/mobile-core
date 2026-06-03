/**
 * Add splash for support debugs search
 */
export const GLOBAL = {
  GET_TUTORIAL: '/tutorials',
  GET_CATEGORIES: '/categories',
  GET_LAGUAGES: '/languages',
  GET_COUNTRY: '/countries',
  GET_PROVINCE: '/states',
  GET_DISTRICT: '/cities',
  GET_WARD: '/wards',
  GET_REGION: '/releasecountries',
  GET_PAYMENT_STATUS: '/orders',
};

export const PROFILE = {
  PROFILE: '/me',
  UPDATE_PROFILE: '/me',
  LOGOUT_APP: '/logout',
  LIST_VIDEO: '/videos',
  FOLLOWERS: '/interactions/followers', // người ta theo dõi mình
  FOLLOWINGS: '/interactions/followings', // mình theo dõi ngta
  FOLLOW: '/interactions/follows',
  LIST_VIDEO_SAVED: '/videos',
  FEEDBACK: '/interactions/reports',
  MY_COURSES: '/courses/list/my',
  APPOINTMENTS: '/appointments',
  NAMECARDS: '/namecards',
  ORDERS: '/packages/my',
};

export const ONBOARD = {
  GET_MEDICAL_TYPE: '/medicaltypes',
  SIGN_UP: '/personalizations',
  GET_SPECIALIZATIONS: '/specializations',
  GET_TITLE_INFORMATION: '/titleInfomations',
  GET_CLINIC: '/clinics',
  GET_CLINIC_TYPE: '/clinictypes',
  CREATE_CLINIC: '/clinics',
  DOCTOR_REGISTER: '/personalizations',
  STUDENT_REGISTER: '/personalizations',
};

export const HOME = {
  BANNER: '/bannerpopups',
  TRENDING: '/videos/trending',
  CATEGORIES: '/categories',
  VIDEOS: '/videos',
  // CHANNEL_SUGGESTION: '/doctors/videos/recommendation',
  CHANNEL_SUGGESTION: '/channels/videos/recommendation',
  // EXPERT_SUGGESTION: '/doctors/recommendation',
  EXPERT_SUGGESTION: '/channels/recommendation',
  DRUG_STORE_SUGGESTION: '/stores',
  FOLLOW_EXPERT: '/interactions/follows',
  LIST_REPORT: '/reports',
  CREATE_REPORT: '/interactions/reports',
  SAVE_ITEM: '/interactions/saves',
  LIKE_ITEM: '/interactions/likes',
  SHARE_VIDEO: '/interactions/shares',
  VIEW_VIDEO: '/interactions/views',
  FOLLOW_CHANNEL: '/interactions/follows',
};

export const NEARBY = {
  SEARCH_LOCATION: '/places',
  DOCTORS: '/doctors',
  STORES: '/stores',
  FOLLOW: '/interactions/follows',
  LIST_VIDEO: '/videos',
};

export const VIDEO = {
  TRENDING: '/videos/trending',
  FORYOU: '/videos',
  FOLLOW: '/videos',
  ENCODING_UPLOAD: '/upload',
  VIDEOS_CATEGORIES: '/categories',
  VIDEO: '/videos',
  SERIES: '/series',
  LIKE_VIDEO: '/interactions/likes',
  REPORT: '/reports',
  HIDE: '/interactions/hides',
  REPORT_VIDEO: '/interactions/reports',
  DELETE_VIDEO: '/videos',
};

export const SEARCH = {
  DEFAULT: 'search/keywords',
  CHANNEL: 'channels',
  DOCTOR: 'doctors',
  STORE: 'stores',
  VIDEO_TAB: 'videos',
  DOCTOR_TAB: 'doctors',
  STORE_TAB: 'stores',
  CHANNEL_TAB: 'channels',
};

export const COURSES = {
  COURSE: '/courses',
  CATEGORY_COURSE: '/courses/list/categories',
  LIST_MY_SAVE: '/courses/list/saves',
  SAVE_COURSE: '/interactions/saves',
  REVIEW_COURSE: '/interactions/reviews',
  COURSE_ENROLLMENTS: '/courseenrollments',
  CERTIFICATE: '/certificates',
  LESSON_VIEW: '/lessonperiods',
  COMMENTS: '/interactions/comments',
  LIKE_COMMENTS: '/interactions/likes',
  BUY_COURSE: '/orders/products',
  VERIFY_COURSE: 'events/vouchers/verify',
  // UI V2
  TRAINING_COURSES: 'traininginstitutions',
  TRAINING_COURSES_DETAIL: '/traininginstitutions',
};

export const VIDEO_COMMENT = {
  COMMENTS: '/interactions/comments',
  LIKE: '/interactions/likes',
};

export const NOTIFICATION = {
  SETTING: '/notifications/settings',
  UPDATE_FIREBASE_TOKEN: '/notifications/tokens',
  GET_LIST: '/notifications',
  READ_NOTI: '/notifications/',
  TOTAL_UNREAD: '/notifications/unreads',
};

export const CHANNEL = {
  GET_CHANNEL: '/channels',
  TOP_11_VIDEO: '/videos',
  SERIES: '/series',
  NEWSFEED: '/feeds/home',
  BUY_PACKAGE: '/orders/packages',
  BOOKING_CALL: '/appointments',
  GET_MEMBERSHIP: '/packages/list',
};

export const COMMUNITY = {
  GET_LISTROOM: '/rooms',
  GET_LISTFRIEND: '/doctors',
  GET_LISTHISTORYCHAT: '/rooms',
  GET_LISTMEMBERGROUP: '/rooms',
  POST_MESSAGE_SEEN: '/messages/seen',
  REQUEST_FRIENDS: '/friends',
  GET_EMOJI: '/emojis',
  BACKGROUND: '/backgrounds',
  GET_TYPE_LISTROOM: '/rooms/owner',
};

export const ADVERTISING = {
  GET_ADVERTISING: '/advertisings',
};

export const SETTINGS = {
  GET_SETTINGS: '/settings',
};

export const NEWSFEED = {
  CREATE_NEWSFEED: '/feeds',
  HOME: '/feeds/home',
  LIST_COMMENT: '/feeds',
  NEWSFEED_AI: '/feeds/generate',
};

export const AUTH = {
  REFRESH_TOKEN: '/auth/token',
};

export const PACKAGE = {
  PACKAGE_USED: '/packages/used',
  PACKAGES: '/packages',
  APPOINT_TIME: '/appointments/time',
};

export const CARELY = {
  SERVICES: '/packages',
  RATING: '/orders/rating',
  REFUND: '/orders/refund',
  REVIEW: '/rating',
};
