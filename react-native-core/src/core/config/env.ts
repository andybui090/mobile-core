import Config from 'react-native-config';

type EnvType = 'development' | 'staging' | 'production';

export const ENV = Object.freeze({
  APP_ENV: (Config.APP_ENV as EnvType) || 'development',
  API_URL: Config.API_URL || '',
});

export const isDev = ENV.APP_ENV === 'development';
export const isStaging = ENV.APP_ENV === 'staging';
export const isProd = ENV.APP_ENV === 'production';