/**
 * Add splash for support debugs search
 */
export const GLOBAL = {
  GET_TUTORIAL: '/tutorials',
  GET_LAGUAGES: '/languages',
  GET_PROVINCE: '/states',
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
  UPDATE_PROFILE: '/me',
  LOGOUT_APP: '/logout',
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

export const CHANNEL = {
  DETAIL: (id: string) => `/channels/${id}`,
  UPDATE: (id: string) => `/channels/${id}`,
};

