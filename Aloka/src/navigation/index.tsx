// import deeplinkService from '@/DeeplinkService';
// import {GAEvents, GALogEvent} from '@/configs';
import { API_MESSAGE, PAGINATION, STORAGEKEY } from '@/constants';
// import {mainRoute} from '@/constants/route_key';
import { AppContext } from '@/contexts';
// import customEventEmitter, {CUSTOM_EVENTS} from '@/notify-helper';
// import {setAppChatBg} from '@/redux/slices/communitySlice';
// import {
//   appStateStatus,
//   updatePlayText,
//   updateVideoConfig,
// } from '@/redux/slices/globalSlice';
// import {
//   getNewsfeedDetail,
//   resetNewsfeedDetail,
// } from '@/redux/slices/newsfeedSlice';
// import {
//   getTotalNotifyUnread,
//   updateFirebaseToken,
// } from '@/redux/slices/notificationSlice';
// import {resetRoomDetal} from '@/redux/slices/socketioSlice';
// import {updateTourGuide} from '@/redux/slices/tourguideSlice';
// import {store} from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { clearReducer } from '@/redux/store/reducers';
// import AuthScreen from '@/screens/auth-screen';
// import APIUpload from '@/screens/upvideo-tab/Gallery/callApi';
import ApiService from '@/services/api-base';
// import APIECommerceService from '@/services/api-ecommerce';
// import ApiSSO from '@/services/api-sso';
// import socketService from '@/socketio';
import { getStringData, removeValue, storeStringData } from '@/storages';
// import notifee from '@notifee/react-native';
// import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import { useThemeMode } from '@rneui/themed';
import { t } from 'i18next';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Alert, AppState, Platform, View } from 'react-native';
// import {AppEventsLogger} from 'react-native-fbsdk-next';
// import GeolocationAndroid from 'react-native-geolocation-service';
import { navigate2, navigationRef } from './RootNavigation';
import {
  autoLoginApp,
  // checkAppChatBg,
  // checkAppTourGuide,
  checkHideCategoryApp,
  checkHideIntroApp,
  // checkPlayText,
  // checkVideoConfig,
} from './app-helper';
// import MainNavigator from './app-navigator/main-navigator';
// import CategoryApp from './category';
import GettingApp from '@/screens/getting';
import {
  detectDeeplinkOpenApp,
  detectFirebaseOpenApp,
  detectNotify,
} from './notify-helper';
import { TYPES, initialState, rootReducer } from './root-store';
import { getProfile } from '@/redux/slices/profileSlice';
import AuthScreen from '@/screens/auth-screen';
import AppTabNavigator from './app-navigator/tab-navigator';
import HomeBookingLayout, { HomeBooking } from '@/screens/layout/home';
import { AppointmentList, BookingCancelPolicyModal, BookingChat, BookingConfirm, BookingSchedule, NotificationList, NurseProfile, ReviewService, SearchFilter, SearchService, ServiceDetail } from '@/screens/layout';
interface RootNavigatorProps {
  onCompleteLoading: () => Promise<void>;
}

const RootNavigator: React.FC<RootNavigatorProps> = ({ onCompleteLoading }) => {
  const { appTheme } = useAppSelector(state => state.settingReducer);
  const { firebaseConfig } = useAppSelector(state => state.globalReducer);

  // const {profileData} = useAppSelector(state => state.profileReducer);

  // const {firebaseTokenUpdate} = useAppSelector(state => state.notifyReducer);

  const { setMode } = useThemeMode();
  const appDispatch = useAppDispatch();
  //quan ly toan cuc ung dung
  const [stateRoot, rootDispatch] = useReducer(rootReducer, initialState);
  const [isShowModalAuth, setShowModalAuth] = useState(false);

  const [hasNotify, setHasNotify] = useState(false);
  const [notifyPayload, setNotifyPayLoad] = useState(null);

  const [waitingRegisterComplete, setWaitingRegisterComplete] = useState(false);

  const [firstStart, setFirstStart] = useState(true);

  useEffect(() => {
    setMode(appTheme); //default light
  }, [appTheme]);

  const initConfigDefault = async () => {
    // let objAppChatBg = await checkAppChatBg();
    // if (objAppChatBg) {
    //   appDispatch(setAppChatBg(objAppChatBg));
    // }
    // appDispatch(setAppChatBg(objAppChatBg));
  };

  //CHECK START APP
  useEffect(() => {
    const initApp = async () => {
      let isHideIntro = await checkHideIntroApp();
      if (isHideIntro) {
        rootDispatch({ type: TYPES.SHOW_GETTING_START, payload: false });
        await autoLoginApp(
          (userInfo: any) => {
            appDispatch(getProfile(null));
            initConfigDefault();
          },
          () => logoutApp(),
        );
        // let isHideCaterory = await checkHideCategoryApp();
        // if (isHideCaterory) {
        //   rootDispatch({ type: TYPES.SHOW_CATEGORY, payload: false });
        //   await autoLoginApp(
        //     (userInfo: any) => {
        //       appDispatch(getProfile(null));
        //       initConfigDefault();
        //     },
        //     () => logoutApp(),
        //   );
        // } else {
        //   //installed
        //   logoutApp();
        // }
      } else {
        //show Intro and clear data
        logoutApp();
      }
    };
    initApp();
  }, []);

  // const initFirebaseToken = async () => {
  //   if (firstStart) {
  //     let firebaseToken = await getStringData(STORAGEKEY.FIREBASE_TOKEN);
  //     if (firebaseToken) {
  //       setFirstStart(false);
  //       appDispatch(getTotalNotifyUnread(null));
  //       appDispatch(
  //         updateFirebaseToken({
  //           token: firebaseToken,
  //         }),
  //       );
  //       // adjustService.trackUninstallAndroidFCM(firebaseToken);
  //     } else {
  //       await notifee.requestPermission();
  //       if (Platform.OS == 'android') {
  //         await notifee.createChannel({
  //           id: 'doctornetwork_globalnotify',
  //           name: 'Doctor Network',
  //         });
  //       }
  //       messaging()
  //         .requestPermission({
  //           alert: true,
  //           badge: true,
  //           sound: true,
  //         })
  //         .then(authStatus => {
  //           if (
  //             authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //             authStatus === messaging.AuthorizationStatus.PROVISIONAL
  //           ) {
  //             messaging()
  //               .getToken()
  //               .then(token => {
  //                 setFirstStart(false);
  //                 appDispatch(getTotalNotifyUnread(null));
  //                 appDispatch(
  //                   updateFirebaseToken({
  //                     token,
  //                   }),
  //                 );
  //                 storeStringData(STORAGEKEY.FIREBASE_TOKEN, token);
  //               });
  //           }
  //         });
  //     }
  //   }
  // };

  // const initSocketIO = async () => {
  //   if (!socketService.isConnected()) {
  //     await socketService.connect();
  //     if (
  //       navigationRef.current?.getCurrentRoute()?.name == 'CommunityScreen' ||
  //       navigationRef.current?.getCurrentRoute()?.name == 'CommunityChat'
  //     ) {
  //       socketService.emitListRoom(PAGINATION.ITEMS_100, 0);
  //     }
  //     deeplinkService.redirectScreen();
  //   }
  // };

  // useEffect(() => {
  //   const processAPIProfileUser = async () => {
  //     const {loading, data, error} = profileData;
  //     if (!loading) {
  //       if (data) {
  //         const dataRes: any = data;
  //         // console.log(
  //         //   '🚀 ~ processAPIProfileUser ~ dataRes.result:',
  //         //   dataRes.result,
  //         // );
  //         if (dataRes.result && dataRes.result.username) {
  //           rootDispatch({
  //             type: TYPES.SET_USER,
  //             payload: dataRes.result,
  //           });
  //           initFirebaseToken();
  //           // initSocketIO();
  //         } else {
  //           logoutApp();
  //         }
  //       } else if (error) {
  //         console.log('🚀 ~ processAPIProfileUser ~ error:', error);
  //         if (
  //           error &&
  //           typeof error === 'object' &&
  //           'problem' in error &&
  //           (error as any).problem == API_MESSAGE.NETWORK_ERROR
  //         ) {
  //           logoutAppWhenLostNetwork();
  //         } else {
  //           logoutApp();
  //         }
  //       }
  //     }
  //   };
  //   processAPIProfileUser();
  // }, [profileData]);

  // useEffect(() => {
  //   const checkFirebaseToken = () => {
  //     const {loading, data, error} = firebaseTokenUpdate;
  //     if (!loading) {
  //       if (data) {
  //       } else if (error) {
  //         console.log('🚀 ~ checkFirebaseToken ~ error:', error);
  //       }
  //     }
  //   };
  //   checkFirebaseToken();
  // }, [firebaseTokenUpdate]);

  const logoutApp = async () => {
    await removeValue(STORAGEKEY.JWT_TOKEN);
    ApiService.deleteAuthorizationHeader();
    // ApiSSO.deleteAuthorizationHeader();
    // APIUpload.deleteAuthorizationHeader();
    // APIECommerceService.deleteAuthorizationHeader();
    appDispatch(clearReducer()); //open comment when done
    rootDispatch({ type: TYPES.LOGOUT_APP, payload: true });
    setFirstStart(true);
  };

  const logoutAppWhenLostNetwork = async () => {
    // ApiSSO.deleteAuthorizationHeader();
    ApiService.deleteAuthorizationHeader();
    // APIUpload.deleteAuthorizationHeader();
    // APIECommerceService.deleteAuthorizationHeader();
    appDispatch(clearReducer()); //open comment when done
    rootDispatch({ type: TYPES.LOGOUT_APP, payload: true });
    setFirstStart(true);
  };

  const rootAction = useMemo(
    () => ({
      closeGettingStart: () => {
        storeStringData(STORAGEKEY.GETTING_APP, 'false');
        rootDispatch({ type: TYPES.SHOW_GETTING_START, payload: false });
      },
      // closeCategory: async () => {
      //   storeStringData(STORAGEKEY.SHOW_CATEGORY, 'false');
      //   rootDispatch({ type: TYPES.SHOW_CATEGORY, payload: false });
      // },
      // login: async (userInfo: any) => {
      //   await initConfigDefault();
      //   rootDispatch({
      //     type: TYPES.SET_USER,
      //     payload: userInfo,
      //   });
      //   setFirstStart(true);
      //   appDispatch(getProfile(null));
      // },
      // registerComplete: async (userInfo: any, loginType: any) => {
      //   GALogEvent(GAEvents.REGISTER_COMPLETE, {
      //     method: 'App register complete',
      //   });
      //   GALogEvent(GAEvents.REGISTER, {method: 'App register'});
      //   AppEventsLogger.logEvent('Register', {
      //     [AppEventsLogger.AppEventParams.RegistrationMethod]: loginType || '',
      //   });
      //   setWaitingRegisterComplete(true);
      //   rootDispatch({
      //     type: TYPES.SET_USER,
      //     payload: userInfo,
      //   });
      //   // set lai gia tri de nhan notify luc dau
      //   setFirstStart(true);
      //   appDispatch(getProfile(null));
      //   // Delete firebase dynamic link
      //   // removeValue(STORAGEKEY.FIREBASE_DYNAMIC_LINK);
      // },
      // setGlobalLocation: async (location: any) => {
      //   rootDispatch({
      //     type: TYPES.SET_LOCATION,
      //     payload: location,
      //   });
      // },
      // register: () => {},
      // logout: async () => {
      //   GALogEvent(GAEvents.LOGOUT, {method: 'App Logout'});
      //   logoutApp();
      // },
      // showModalAuth: async () => {
      //   setShowModalAuth(true);
      // },
      // onCompleteAuth: async () => {
      //   setWaitingRegisterComplete(false);
      // },
      // setAdmodData: (data: any) => {
      //   parseAdmod(data || {});
      // },
      // showModalAdd: () => {},
    }),
    [firebaseConfig],
  );

  // const getLocationGlobal = () => {
  //   if (Platform.OS === 'ios') {
  //     Geolocation.getCurrentPosition(
  //       (pos: {coords: {latitude: any; longitude: any}}) => {
  //         rootDispatch({
  //           type: TYPES.SET_LOCATION,
  //           payload: {
  //             latitude: pos.coords.latitude,
  //             longitude: pos.coords.longitude,
  //           },
  //         });
  //       },
  //       () => {},
  //       {enableHighAccuracy: true},
  //     );
  //   } else {
  //     Geolocation.getCurrentPosition(
  //       (pos: {coords: {latitude: any; longitude: any}}) => {
  //         rootDispatch({
  //           type: TYPES.SET_LOCATION,
  //           payload: {
  //             latitude: pos.coords.latitude,
  //             longitude: pos.coords.longitude,
  //           },
  //         });
  //       },
  //       (error: {code: number}) => {
  //         if (error.code && error.code === 2) {
  //           // showToast(toastEl, 'Vui lòng bật GPS trên thiết bị!', 2000);
  //         } else {
  //           GeolocationAndroid.getCurrentPosition(
  //             position => {
  //               rootDispatch({
  //                 type: TYPES.SET_LOCATION,
  //                 payload: {
  //                   latitude: position.coords.latitude,
  //                   longitude: position.coords.longitude,
  //                 },
  //               });
  //             },
  //             error => {},
  //             {enableHighAccuracy: false},
  //           );
  //         }
  //       },
  //       {enableHighAccuracy: false},
  //     );
  //   }
  // };

  useEffect(() => {
    const hideSplash = async () => {
      await onCompleteLoading();
      // getLocationGlobal();
    };
    if (!stateRoot.isLoading) {
      hideSplash();
    }
  }, [stateRoot.isLoading]);

  const renderRootApp = useMemo(() => {
    if (!stateRoot.isLoading) {
      if (stateRoot.isGetting) {
        return <GettingApp />;
      } else {
        // return <AppTabNavigator />;
        return <HomeBooking />;
        // const userTemp: any = stateRoot.user;
        // if (userTemp.username && !waitingRegisterComplete) {

        // }
        // if (stateRoot.isCategory) {
        //   return <View />;
        //   // return <CategoryApp />;
        // } else {
        //   return <View />;
        //   // let userTemp: any = stateRoot.user;
        //   // if (userTemp.username && !waitingRegisterComplete) {
        //   //   return <MainNavigator isReview={firebaseConfig.isReviewApp} />;
        //   // }
        //   // return <AuthScreen />;
        // }
      }
    } else {
      return <View />;
    }
  }, [stateRoot, waitingRegisterComplete, firebaseConfig.isReviewApp]);

  return (
    <AppContext.Provider
      value={{ ...rootAction, ...stateRoot, isModalAuth: isShowModalAuth }}
    >
      {renderRootApp}
    </AppContext.Provider>
  );
};

export { RootNavigator };
