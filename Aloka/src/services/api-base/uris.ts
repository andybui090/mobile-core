/**
 * Add splash for support debugs search
 */
export const GLOBAL = {
  GET_TUTORIAL: '/tutorials',
  GET_LAGUAGES: '/languages',
  GET_PROVINCE: '/states',
  SEARCH_LOCATION: '/places',
};

export const HOME = {
  BANNER: '/bannerpopups',
  APPOINTMENTS: '/appointments',
};

export const SETTINGS = {
  GET_SETTINGS: '/settings',
};

export const PROFILE = {
  GET_PROFILE: '/me',
  PROFILE: '/me',
  UPDATE_PROFILE: '/me',
  LOGOUT_APP: '/logout',
  LIST_VIDEO: '/videos',
  LIST_VIDEO_SAVED: '/videos',
  FOLLOWERS: '/interactions/followers',
  FOLLOWINGS: '/interactions/followings',
  FOLLOW: '/interactions/follows',
  FEEDBACK: '/interactions/reports',
  MY_COURSES: '/courses/list/my',
  APPOINTMENTS: '/appointments',
  ORDERS: '/packages/my',
};

export const NOTIFICATION = {
  SETTING: '/notifications/settings',
  UPDATE_FIREBASE_TOKEN: '/notifications/tokens',
  GET_LIST: '/notifications',
  READ_NOTI: '/notifications/',
  TOTAL_UNREAD: '/notifications/unreads',
};

export const CARELY = {
  SERVICES: '/packages',
  RATING: '/orders/rating',
  REFUND: '/orders/refund',
  REVIEW: '/rating',
};

export const SCHEDULE = {
  /** GET /appointments/time/:channelId - lay danh sach gio da book (giong doctor-mobile-app) */
  APPOINT_TIME: '/appointments/time',
};

export const CHANNEL = {
  DETAIL: (id: string) => `/channels/${id}`,
  UPDATE: (id: string) => `/channels/${id}`,
};

export const ORDER = {
  CREATE:       '/orders',           // tạo order (Aloka)
  DETAIL:       (id: string) => `/orders/${id}`,
  APPOINTMENT:  '/appointments',     // đặt lịch sau khi mua
  SUBSCRIPTION: '/orders/packages',  // quản lý subscription (active/pause)
};

export const PAYMENT = {
  MOMO: '/payments/momo',
  VNPAY: '/payments/vnpay',
  STATUS: (orderId: string) => `/payments/${orderId}/status`,
};

export const COMMUNITY = {
  GET_LISTROOM: '/rooms',
  GET_LISTHISTORYCHAT: '/rooms',
  POST_MESSAGE_SEEN: '/messages/seen',
};
