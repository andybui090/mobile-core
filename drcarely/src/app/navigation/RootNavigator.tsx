import { NavigationContainer } from '@react-navigation/native';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { useMemo, useReducer, useState } from 'react';
import { initialState, rootReducer } from './root-store';
import { AppContext } from '@/contexts';
import { View } from 'react-native';

export const RootNavigator = () => {
  
  const [stateRoot, rootDispatch] = useReducer(rootReducer, initialState);
  const [waitingRegisterComplete, setWaitingRegisterComplete] = useState(false);
  const rootAction = useMemo(
    () => ({
      closeGettingStart: async () => {},
      closeCategory: async () => {},
      login: async (userInfo: any) => {},
      registerComplete: async (userInfo: any, loginType: any) => {},
      setGlobalLocation: async (location: any) => {},
      register: () => {},
      logout: async () => {},
      onCompleteAuth: async () => {},
    }),
    [],
  );

  const renderRootApp = useMemo(() => {
    if (!stateRoot.isLoading) {
      if (stateRoot.isGetting) {
        return <GettingApp />;
      } else {
        if (stateRoot.isCategory) {
          return <CategoryApp />;
        } else {
          const userTemp: any = stateRoot.user;
          if (userTemp.username && !waitingRegisterComplete) {
            return <AppNavigator />;
          }
          return <AuthNavigator />;
        }
      }
    } else {
      return <View />; // SplashScreen
    }
  }, [stateRoot, waitingRegisterComplete]);

  return (
    <NavigationContainer>
      <AppContext.Provider value={{ ...rootAction, ...stateRoot }}>
        {renderRootApp}
      </AppContext.Provider>
    </NavigationContainer>
  );
};
