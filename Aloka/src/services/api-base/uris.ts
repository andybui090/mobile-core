/**
 * Add splash for support debugs search
 */
export const GLOBAL = {
  GET_TUTORIAL: '/tutorials',
};

export const SETTINGS = {
  GET_SETTINGS: '/settings',
};

export const PROFILE = {
  GET_PROFILE: '/me',
};

export const CHANNELS = {
  GET_CHANNEL_DETAIL: (channelId: string) => `/channels/${channelId}`,
  UPDATE_CHANNEL_SCHEDULE: (channelId: string) => `/channels/${channelId}`,
};