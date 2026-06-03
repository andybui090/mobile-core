import { DevNavigator } from './DevNavigator';
import { RootNavigator } from './RootNavigator';

import { isDev } from '@/core/config/env';

export const AppNavigator = () => {
  if (isDev) {
    return <DevNavigator />;
  }

  return <RootNavigator />;
};