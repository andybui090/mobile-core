import { NavigationContainer } from '@react-navigation/native';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { initialState, rootReducer, TYPES } from './root-store';
import { AppContext } from '@/contexts';
import { View } from 'react-native';
import GettingScreen from '@/screens/Getting';
import { checkHideCategoryApp, checkHideIntroApp } from './app-helper';
import { removeValue } from '@/storage';
import { STORAGEKEY } from '@/constants/storage_key';
// import ApiSSO from '@/services/api-sso';
import ApiService from '@/services/api-base';

export const RootNavigator = () => {
  const [stateRoot, rootDispatch] = useReducer(rootReducer, initialState);
  const [waitingRegisterComplete, setWaitingRegisterComplete] = useState(false);
  const [firstStart, setFirstStart] = useState(true);

  const logoutApp = async () => {
    await removeValue(STORAGEKEY.JWT_TOKEN);
    // ApiSSO.deleteAuthorizationHeader();
    ApiService.deleteAuthorizationHeader();
    // APIUpload.deleteAuthorizationHeader();
    // APIECommerceService.deleteAuthorizationHeader();
    // Redux removed, no store cleanup here
    rootDispatch({ type: TYPES.LOGOUT_APP, payload: true });
    setFirstStart(true);
  };

  //CHECK START APP
  useEffect(() => {
    const initApp = async () => {
      let isHideIntro = await checkHideIntroApp();
      if (isHideIntro) {
        rootDispatch({ type: TYPES.SHOW_GETTING_START, payload: false });
        let isHideCaterory = await checkHideCategoryApp();
        if (isHideCaterory) {
          rootDispatch({ type: TYPES.SHOW_CATEGORY, payload: false });
          // await autoLoginApp(
          //   (userInfo: any) => {
          //     appDispatch(getProfile(null));
          //     initConfigDefault();
          //   },
          //   () => logoutApp(),
          // );
        } else {
          //installed
          logoutApp();
        }
      } else {
        //show Intro and clear data
        logoutApp();
      }
    };
    initApp();
  }, []);

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
        return <GettingScreen />;
      } else {
        if (stateRoot.isCategory) {
          return <View />;
          // return <CategoryApp />;
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
