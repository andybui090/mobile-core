import deeplinkService from '@/DeeplinkService';
import {GAEvents, GALogEvent} from '@/configs';
import {API_MESSAGE, PAGINATION, STORAGEKEY} from '@/constants';
import {mainRoute} from '@/constants/route_key';
import {AppContext} from '@/contexts';
import customEventEmitter, {CUSTOM_EVENTS} from '@/notify-helper';
import {setAppChatBg} from '@/redux/slices/communitySlice';
import {
  appStateStatus,
  updatePlayText,
  updateVideoConfig,
} from '@/redux/slices/globalSlice';
import {
  getNewsfeedDetail,
  resetNewsfeedDetail,
} from '@/redux/slices/newsfeedSlice';
import {
  getTotalNotifyUnread,
  updateFirebaseToken,
} from '@/redux/slices/notificationSlice';
import {getProfile} from '@/redux/slices/profileSlice';
import {resetRoomDetal} from '@/redux/slices/socketioSlice';
import {updateTourGuide} from '@/redux/slices/tourguideSlice';
import {store} from '@/redux/store';
import {useAppDispatch, useAppSelector} from '@/redux/store/customReduxHook';
import {clearReducer} from '@/redux/store/reducers';
import AuthScreen from '@/screens/auth-screen';
import APIUpload from '@/screens/upvideo-tab/Gallery/callApi';
import ApiService from '@/services/api-base';
import APIECommerceService from '@/services/api-ecommerce';
import ApiSSO from '@/services/api-sso';
import socketService from '@/socketio';
import {getStringData, removeValue, storeStringData} from '@/storages';
import notifee from '@notifee/react-native';
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import {useThemeMode} from '@rneui/themed';
import {t} from 'i18next';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {Alert, AppState, Platform, View} from 'react-native';
import {AppEventsLogger} from 'react-native-fbsdk-next';
import GeolocationAndroid from 'react-native-geolocation-service';
import {navigate2, navigationRef} from './RootNavigation';
import {
  autoLoginApp,
  checkAppChatBg,
  checkAppTourGuide,
  checkHideCategoryApp,
  checkHideIntroApp,
  checkPlayText,
  checkVideoConfig,
} from './app-helper';
import MainNavigator from './app-navigator/main-navigator';
import CategoryApp from './category';
import GettingApp from './getting';
import {
  detectDeeplinkOpenApp,
  detectFirebaseOpenApp,
  detectNotify,
} from './notify-helper';
import {TYPES, initialState, rootReducer} from './root-store';
interface RootNavigatorProps {
  onCompleteLoading: () => Promise<void>;
}

const RootNavigator: React.FC<RootNavigatorProps> = ({onCompleteLoading}) => {
  const {appTheme} = useAppSelector(state => state.settingReducer);
  const {profileData} = useAppSelector(state => state.profileReducer);

  const {firebaseTokenUpdate} = useAppSelector(state => state.notifyReducer);

  const {firebaseConfig} = useAppSelector(state => state.globalReducer);

  const {detailRoom, checkErorrRemoveRoom, getRoomIslive, getRoomIsliveTitle} =
    useAppSelector(state => state.socketioReducer);

  const {newsfeedDetail} = useAppSelector(state => state.newsfeedReducer);

  const {setMode} = useThemeMode();
  const appDispatch = useAppDispatch();
  //quan ly toan cuc ung dung
  const [stateRoot, rootDispatch] = useReducer(rootReducer, initialState);
  const [isShowModalAuth, setShowModalAuth] = useState(false);

  const [hasNotify, setHasNotify] = useState(false);
  const [notifyPayload, setNotifyPayLoad] = useState(null);

  const [waitingRegisterComplete, setWaitingRegisterComplete] = useState(false);

  const [firstStart, setFirstStart] = useState(true);

  const [pressShareCourseBg, setPressShareCourseBg] = useState(false);
  const [shareCourseBgPayload, setShareCourseBgPayload] = useState(null);

  const [pressShareProfile, setPressShareProfile] = useState(false);
  const [shareProfileBgPayload, setShareProfileBgPayload] = useState(null);

  const [pressShareLinkInvite, setPressShareLinkInvite] = useState(false);
  const [shareLinkInvitePayload, setShareLinkInvitePayload] = useState(null);

  const [pressShareLinkVideo, setPressShareLinkVideo] = useState(false);
  const [shareLinkVideoPayload, setShareLinkVideoPayload] = useState(null);

  const [pressShareLinkNewsFeed, setPressShareLinkNewsFeed] = useState(false);
  const [shareLinkNewsFeedPayload, setShareLinkNewsFeedPayload] =
    useState<any>(null);

  const [pressLinkAdjust, setPressLinkAdjust] = useState(false);
  const [linkAdjustPayload, setLinkAdjustPayload] = useState<any>(null);

  const [pressDeepLink, setPressDeepLink] = useState(false);
  const [deepLinkPayload, setDeepLinkPayload] = useState<any>(null);

  const [pressShareChannel, setPressShareChannel] = useState(false);
  const [shareChannelPayload, setShareChannelPayload] = useState(null);

  const [pressSharePackage, setPressSharePackage] = useState(false);
  const [sharePackagePayload, setSharePackagePayload] = useState(null);

  const [errorRoomShare, setErrorRoomShare] = useState<any>(null);

  const adMod = useRef<any>({isFirstShow: false});

  const parseAdmod = (data: any) => {
    if (data.interstitial) {
      let arrData = data.interstitial || [];
      let adModTemp: any = {};
      for (let i = 0; i < arrData.length; i++) {
        if (Platform.OS == 'ios') {
          if (arrData[i]?.platform == 'IOS') {
            adModTemp = arrData[i];
            break;
          }
        } else if (Platform.OS == 'android') {
          if (arrData[i]?.platform == 'ANDROID') {
            adModTemp = arrData[i];
            break;
          }
        }
      }
      // sap xep lai thu tu hien thi
      if (adModTemp.code) {
        adMod.current = {
          isFirstShow: true,
          ...adModTemp,
        };
      }
    }
  };

  //Notify
  const onNotificationOpen = useCallback(async (payload: any) => {
    setHasNotify(true);
    setNotifyPayLoad(payload);
  }, []);

  const onShareCourseOpen = useCallback(async (payload: any) => {
    setPressShareCourseBg(true);
    setShareCourseBgPayload(payload);
  }, []);

  const onOpenProfile = useCallback(async (payload: any) => {
    setPressShareProfile(true);
    setShareProfileBgPayload(payload);
  }, []);

  const onOpenChannel = useCallback(async (payload: any) => {
    setPressShareChannel(true);
    setShareChannelPayload(payload);
  }, []);

  const onOpenPackage = useCallback(async (payload: any) => {
    // console.log("🚀 ~ RootNavigator ~ payload:", payload)
    setPressSharePackage(true);
    setSharePackagePayload(payload);
  }, []);

  const onOpenInviteRoomChat = useCallback(async (payload: any) => {
    setPressShareLinkInvite(true);
    setShareLinkInvitePayload(payload);
  }, []);

  const onOpenVideoShare = useCallback(async (payload: any) => {
    setPressShareLinkVideo(true);
    setShareLinkVideoPayload(payload);
  }, []);

  const onOpenNewsFeedShare = useCallback(async (payload: any) => {
    setPressShareLinkNewsFeed(true);
    setShareLinkNewsFeedPayload(payload);
  }, []);

  const onOpenAdjustLink = useCallback(async (payload: any) => {
    setPressLinkAdjust(true);
    setLinkAdjustPayload(payload);
  }, []);

  const onOpenDeepLink = useCallback(async (payload: any) => {
    setPressDeepLink(true);
    setDeepLinkPayload(payload);
  }, []);

  useEffect(() => {
    customEventEmitter.addListener(
      CUSTOM_EVENTS.ON_NOTIFICATION_OPEN,
      onNotificationOpen,
    );
    customEventEmitter.addListener(
      CUSTOM_EVENTS.SHARE_COURSE,
      onShareCourseOpen,
    );
    customEventEmitter.addListener(CUSTOM_EVENTS.DOCTOR_PROFILE, onOpenProfile);
    customEventEmitter.addListener(
      CUSTOM_EVENTS.INVITE_CHATROOM,
      onOpenInviteRoomChat,
    );
    customEventEmitter.addListener(
      CUSTOM_EVENTS.VIEW_VIDEO_SHARE,
      onOpenVideoShare,
    );
    customEventEmitter.addListener(
      CUSTOM_EVENTS.NEWSFEED_SHARE,
      onOpenNewsFeedShare,
    );
    //ADJUST
    customEventEmitter.addListener(CUSTOM_EVENTS.ADJUST_LINK, onOpenAdjustLink);
    //DEEPLINK
    customEventEmitter.addListener(CUSTOM_EVENTS.DEEP_LINK, onOpenDeepLink);
    customEventEmitter.addListener(CUSTOM_EVENTS.SHARE_CHANNEL, onOpenChannel);
    customEventEmitter.addListener(CUSTOM_EVENTS.SHARE_PACKAGE, onOpenPackage);
  }, []);

  useEffect(() => {
    if (pressLinkAdjust && linkAdjustPayload && !stateRoot.isLoading) {
      setPressLinkAdjust(false);
      setLinkAdjustPayload(null);
    }
  }, [pressLinkAdjust, linkAdjustPayload, stateRoot.isLoading]);

  useEffect(() => {
    if (pressDeepLink && deepLinkPayload && !stateRoot.isLoading) {
      detectDeeplinkOpenApp(deepLinkPayload);
      setPressDeepLink(false);
      setDeepLinkPayload(null);
    }
  }, [pressDeepLink, deepLinkPayload, stateRoot.isLoading]);

  useEffect(() => {
    if (hasNotify && notifyPayload && !stateRoot.isLoading) {
      detectNotify(notifyPayload, navigationRef, appDispatch, stateRoot.user);
      setHasNotify(false);
      setNotifyPayLoad(null);
    }
  }, [hasNotify, notifyPayload, stateRoot.isLoading]);

  useEffect(() => {
    if (pressShareLinkVideo && shareLinkVideoPayload && !stateRoot.isLoading) {
      detectFirebaseOpenApp(navigationRef, shareLinkVideoPayload);
      setPressShareLinkVideo(false);
      setShareLinkVideoPayload(null);
    }
  }, [pressShareLinkVideo, shareLinkVideoPayload, stateRoot.isLoading]);

  useEffect(() => {
    if (pressShareCourseBg && shareCourseBgPayload && !stateRoot.isLoading) {
      detectFirebaseOpenApp(navigationRef, shareCourseBgPayload);
      setPressShareCourseBg(false);
      setShareCourseBgPayload(null);
    }
  }, [pressShareCourseBg, shareCourseBgPayload, stateRoot.isLoading]);

  useEffect(() => {
    if (pressShareProfile && shareProfileBgPayload && !stateRoot.isLoading) {
      detectFirebaseOpenApp(navigationRef, shareProfileBgPayload);
      setPressShareProfile(false);
      setShareProfileBgPayload(null);
    }
  }, [pressShareProfile, shareProfileBgPayload, stateRoot.isLoading]);

  useEffect(() => {
    if (pressShareChannel && shareChannelPayload && !stateRoot.isLoading) {
      detectFirebaseOpenApp(navigationRef, shareChannelPayload);
      setPressShareChannel(false);
      setShareChannelPayload(null);
    }
  }, [pressShareChannel, shareChannelPayload, stateRoot.isLoading]);

  useEffect(() => {
    if (pressSharePackage && sharePackagePayload && !stateRoot.isLoading) {
      detectFirebaseOpenApp(navigationRef, sharePackagePayload);
      setPressSharePackage(false);
      setSharePackagePayload(null);
    }
  }, [pressSharePackage, sharePackagePayload, stateRoot.isLoading]);

  useEffect(() => {
    if (
      pressShareLinkInvite &&
      shareLinkInvitePayload &&
      !stateRoot.isLoading &&
      socketService.isConnected()
    ) {
      detectFirebaseOpenApp(navigationRef, shareLinkInvitePayload);
      setPressShareLinkInvite(false);
      setShareLinkInvitePayload(null);
    }
  }, [
    pressShareLinkInvite,
    shareLinkInvitePayload,
    stateRoot.isLoading,
    socketService.isConnected(),
  ]);

  useEffect(() => {
    if (
      pressShareLinkNewsFeed &&
      shareLinkNewsFeedPayload &&
      !stateRoot.isLoading
    ) {
      if (shareLinkNewsFeedPayload?.feedId) {
        appDispatch(getNewsfeedDetail({id: shareLinkNewsFeedPayload?.feedId}));
      }
      setPressShareLinkNewsFeed(false);
      setShareLinkNewsFeedPayload(null);
    }
  }, [pressShareLinkNewsFeed, shareLinkNewsFeedPayload, stateRoot.isLoading]);

  //share room is delete
  useEffect(() => {
    const processAPIrecallMess = async () => {
      const {loading, data, error} = checkErorrRemoveRoom;
      const checkPrivate = await getStringData(STORAGEKEY.CHECK_GROUP_PRIVATE);
      // console.log("🚀 ~ processAPIrecallMess ~ data:", data)
      setErrorRoomShare(data);
      if (!loading) {
        if (data) {
          if (data.errors && data.errors[0]?.key === 'room_id') {
            if (checkPrivate === 'null') {
              Alert.alert(
                t('communityChat.home.title'),
                t('communityChat.home.removeRoom'),
                [
                  {
                    text: t('common.ok'),
                    onPress: async () =>
                      await storeStringData(
                        STORAGEKEY.CHECK_GROUP_PRIVATE,
                        'false',
                      ),
                    style: 'default',
                  },
                ],
              );
            }
          }
        }
      }
    };
    processAPIrecallMess();
  }, [checkErorrRemoveRoom]);

  //navigation room chat
  useEffect(() => {
    const processAPIrecallMess = async () => {
      const {loading, data, error} = detailRoom;

      if (!loading) {
        if (data) {
          const item: any = data.result;
          let str = (await getStringData(STORAGEKEY.JOIN_PUBLIC_CHAT)) || '';
          let arrParse = str ? str.split(',') : [];
          let isFound = false;
          for (let i = 0; i < arrParse.length; i++) {
            if (arrParse[i].toString() == item.id) {
              isFound = true;
            }
          }
          if (!isFound) {
            arrParse.push(item.id);
            await storeStringData(
              STORAGEKEY.JOIN_PUBLIC_CHAT,
              arrParse.toString(),
            );
            socketService.emitRejoinRoom();
          }
          if (item.invite_status !== 0) {
            if (item.media == 'livestream') {
              if (item.owner_id === stateRoot.user.id) {
                navigate2(mainRoute.publishStream, {item: item});
              } else {
                if (item.private === 1) {
                  console.log('🚀 ~ processAPIrecallMess ~ item:', item);
                }
                navigate2(mainRoute.playStream, {item: item});
              }
            } else if (item.media === 'text') {
              let itemTemp: any;
              if (getRoomIslive.data) {
                itemTemp = {
                  ...item,
                  room_is_live: getRoomIslive.data.live_id,
                  room_live_title: getRoomIsliveTitle.data.title,
                };
              } else {
                itemTemp = item;
              }
              navigate2(mainRoute.communityChat, {
                item: itemTemp,
                listCreateRoom: [item],
                roomId: item.id,
                ownerId: item.owner_id,
                checkCreateRoom: false,
              });
            }
          }
        }
        store.dispatch(resetRoomDetal(null));
      }
    };
    processAPIrecallMess();
  }, [detailRoom]);

  //navigation newsfeed
  useEffect(() => {
    const processAPIrecallMess = () => {
      const {loading, data, error} = newsfeedDetail;
      if (!loading) {
        if (data) {
          if (data.result) {
            let item: any = data.result;
            navigate2(mainRoute.detailComment, {item});
            appDispatch(resetNewsfeedDetail(null));
          }
        } else if (error) {
          appDispatch(resetNewsfeedDetail(null));
        }
      }
    };
    processAPIrecallMess();
  }, [newsfeedDetail]);

  //endnotify
  useEffect(() => {
    setMode(appTheme); //default light
  }, [appTheme]);

  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  const [delayTime, setDelayTime] = useState(false);

  useEffect(() => {
    const callSocketService = async () => {
      store.dispatch(appStateStatus(appStateVisible));
      const checkFile = await getStringData(STORAGEKEY.CHECK_FILE);
      setDelayTime(false);
      if (appStateVisible == 'active') {
        initSocketIO();
        let currentUser: any = stateRoot.user || {};
        if (currentUser.id) {
          appDispatch(getProfile(null));
        }
      } else {
        if (socketService.isConnected()) {
          if (checkFile !== 'true') {
            if (
              navigationRef.current?.getCurrentRoute()?.name !== 'PlayStream'
            ) {
            }
          }
        }
      }
    };
    if (delayTime) {
      callSocketService();
    }
  }, [appStateVisible, delayTime]);

  const initConfigDefault = async () => {
    let objAppTourGuide = await checkAppTourGuide();

    if (objAppTourGuide) {
      appDispatch(updateTourGuide(objAppTourGuide));
    }

    let objPlayText = await checkPlayText();
    if (objPlayText) {
      appDispatch(updatePlayText(objPlayText));
    }
    let objAppChatBg = await checkAppChatBg();
    appDispatch(setAppChatBg(objAppChatBg));

    let objVideoConfig = await checkVideoConfig();
    if (objVideoConfig) {
      appDispatch(updateVideoConfig(objVideoConfig));
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppStateVisible(nextAppState);
      setTimeout(() => {
        setDelayTime(true);
      }, 0);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  //CHECK START APP
  useEffect(() => {
    const initApp = async () => {
      let isHideIntro = await checkHideIntroApp();
      if (isHideIntro) {
        rootDispatch({type: TYPES.SHOW_GETTING_START, payload: false});
        let isHideCaterory = await checkHideCategoryApp();
        if (isHideCaterory) {
          rootDispatch({type: TYPES.SHOW_CATEGORY, payload: false});
          await autoLoginApp(
            (userInfo: any) => {
              appDispatch(getProfile(null));
              initConfigDefault();
            },
            () => logoutApp(),
          );
        } else {
          //installed
          logoutApp();
        }
      } else {
        //show Intro and clear data
        logoutApp();
      }

      let objPlayText = await checkPlayText();
      if (objPlayText) {
        appDispatch(updatePlayText(objPlayText));
      }

      let objAppChatBg = await checkAppChatBg();
      appDispatch(setAppChatBg(objAppChatBg));

      let objVideoConfig = await checkVideoConfig();
      if (objVideoConfig) {
        appDispatch(updateVideoConfig(objVideoConfig));
      }
    };
    initApp();
  }, []);

  const initFirebaseToken = async () => {
    if (firstStart) {
      let firebaseToken = await getStringData(STORAGEKEY.FIREBASE_TOKEN);
      if (firebaseToken) {
        setFirstStart(false);
        appDispatch(getTotalNotifyUnread(null));
        appDispatch(
          updateFirebaseToken({
            token: firebaseToken,
          }),
        );
        // adjustService.trackUninstallAndroidFCM(firebaseToken);
      } else {
        await notifee.requestPermission();
        if (Platform.OS == 'android') {
          await notifee.createChannel({
            id: 'doctornetwork_globalnotify',
            name: 'Doctor Network',
          });
        }
        messaging()
          .requestPermission({
            alert: true,
            badge: true,
            sound: true,
          })
          .then(authStatus => {
            if (
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL
            ) {
              messaging()
                .getToken()
                .then(token => {
                  setFirstStart(false);
                  appDispatch(getTotalNotifyUnread(null));
                  appDispatch(
                    updateFirebaseToken({
                      token,
                    }),
                  );
                  storeStringData(STORAGEKEY.FIREBASE_TOKEN, token);
                });
            }
          });
      }
    }
  };

  const initSocketIO = async () => {
    if (!socketService.isConnected()) {
      await socketService.connect();
      if (
        navigationRef.current?.getCurrentRoute()?.name == 'CommunityScreen' ||
        navigationRef.current?.getCurrentRoute()?.name == 'CommunityChat'
      ) {
        socketService.emitListRoom(PAGINATION.ITEMS_100, 0);
      }
      deeplinkService.redirectScreen();
    }
  };

  useEffect(() => {
    const processAPIProfileUser = async () => {
      const {loading, data, error} = profileData;
      if (!loading) {
        if (data) {
          const dataRes: any = data;
          // console.log(
          //   '🚀 ~ processAPIProfileUser ~ dataRes.result:',
          //   dataRes.result,
          // );
          if (dataRes.result && dataRes.result.username) {
            rootDispatch({
              type: TYPES.SET_USER,
              payload: dataRes.result,
            });
            initFirebaseToken();
            initSocketIO();
          } else {
            logoutApp();
          }
        } else if (error) {
          console.log('🚀 ~ processAPIProfileUser ~ error:', error);
          if (
            error &&
            typeof error === 'object' &&
            'problem' in error &&
            (error as any).problem == API_MESSAGE.NETWORK_ERROR
          ) {
            logoutAppWhenLostNetwork();
          } else {
            logoutApp();
          }
        }
      }
    };
    processAPIProfileUser();
  }, [profileData]);

  useEffect(() => {
    const checkFirebaseToken = () => {
      const {loading, data, error} = firebaseTokenUpdate;
      if (!loading) {
        if (data) {
        } else if (error) {
          console.log('🚀 ~ checkFirebaseToken ~ error:', error);
        }
      }
    };
    checkFirebaseToken();
  }, [firebaseTokenUpdate]);

  const logoutApp = async () => {
    await removeValue(STORAGEKEY.JWT_TOKEN);
    ApiSSO.deleteAuthorizationHeader();
    ApiService.deleteAuthorizationHeader();
    APIUpload.deleteAuthorizationHeader();
    APIECommerceService.deleteAuthorizationHeader();
    appDispatch(clearReducer()); //open comment when done
    rootDispatch({type: TYPES.LOGOUT_APP, payload: true});
    setFirstStart(true);
  };

  const logoutAppWhenLostNetwork = async () => {
    ApiSSO.deleteAuthorizationHeader();
    ApiService.deleteAuthorizationHeader();
    APIUpload.deleteAuthorizationHeader();
    APIECommerceService.deleteAuthorizationHeader();
    appDispatch(clearReducer()); //open comment when done
    rootDispatch({type: TYPES.LOGOUT_APP, payload: true});
    setFirstStart(true);
  };

  const rootAction = useMemo(
    () => ({
      closeGettingStart: async () => {
        await storeStringData(STORAGEKEY.GETTING_APP, 'false');
        rootDispatch({type: TYPES.SHOW_GETTING_START, payload: false});
      },
      closeCategory: async () => {
        await storeStringData(STORAGEKEY.SHOW_CATEGORY, 'false');
        rootDispatch({type: TYPES.SHOW_CATEGORY, payload: false});
      },
      login: async (userInfo: any) => {
        await initConfigDefault();
        rootDispatch({
          type: TYPES.SET_USER,
          payload: userInfo,
        });
        setFirstStart(true);
        appDispatch(getProfile(null));
      },
      registerComplete: async (userInfo: any, loginType: any) => {
        GALogEvent(GAEvents.REGISTER_COMPLETE, {
          method: 'App register complete',
        });
        GALogEvent(GAEvents.REGISTER, {method: 'App register'});
        AppEventsLogger.logEvent('Register', {
          [AppEventsLogger.AppEventParams.RegistrationMethod]: loginType || '',
        });
        setWaitingRegisterComplete(true);
        rootDispatch({
          type: TYPES.SET_USER,
          payload: userInfo,
        });
        // set lai gia tri de nhan notify luc dau
        setFirstStart(true);
        appDispatch(getProfile(null));
        // Delete firebase dynamic link
        removeValue(STORAGEKEY.FIREBASE_DYNAMIC_LINK);
      },
      setGlobalLocation: async (location: any) => {
        rootDispatch({
          type: TYPES.SET_LOCATION,
          payload: location,
        });
      },
      register: () => {},
      logout: async () => {
        GALogEvent(GAEvents.LOGOUT, {method: 'App Logout'});
        logoutApp();
      },
      showModalAuth: async () => {
        setShowModalAuth(true);
      },
      onCompleteAuth: async () => {
        setWaitingRegisterComplete(false);
      },
      setAdmodData: (data: any) => {
        parseAdmod(data || {});
      },
      showModalAdd: () => {},
    }),
    [firebaseConfig],
  );

  const getLocationGlobal = () => {
    if (Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        (pos: {coords: {latitude: any; longitude: any}}) => {
          rootDispatch({
            type: TYPES.SET_LOCATION,
            payload: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            },
          });
        },
        () => {},
        {enableHighAccuracy: true},
      );
    } else {
      Geolocation.getCurrentPosition(
        (pos: {coords: {latitude: any; longitude: any}}) => {
          rootDispatch({
            type: TYPES.SET_LOCATION,
            payload: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            },
          });
        },
        (error: {code: number}) => {
          if (error.code && error.code === 2) {
            // showToast(toastEl, 'Vui lòng bật GPS trên thiết bị!', 2000);
          } else {
            GeolocationAndroid.getCurrentPosition(
              position => {
                rootDispatch({
                  type: TYPES.SET_LOCATION,
                  payload: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                });
              },
              error => {},
              {enableHighAccuracy: false},
            );
          }
        },
        {enableHighAccuracy: false},
      );
    }
  };

  useEffect(() => {
    const hideSplash = async () => {
      await onCompleteLoading();
      getLocationGlobal();
    };
    if (!stateRoot.isLoading) {
      hideSplash();
      // setTimeout(async () => {
      //   await onCompleteLoading();
      //   getLocationGlobal();
      // }, 500); // Giam time tu 1500 xuong 500
    }
  }, [stateRoot.isLoading]);

  const renderRootApp = useMemo(() => {
    if (!stateRoot.isLoading) {
      if (stateRoot.isGetting) {
        return <GettingApp />;
      } else {
        if (stateRoot.isCategory) {
          return <CategoryApp />;
        } else {
          let userTemp: any = stateRoot.user;
          if (userTemp.username && !waitingRegisterComplete) {
            return <MainNavigator isReview={firebaseConfig.isReviewApp} />;
          }
          return <AuthScreen />;
        }
      }
    } else {
      return <View />;
    }
  }, [stateRoot, waitingRegisterComplete, firebaseConfig.isReviewApp]);

  return (
    <AppContext.Provider
      value={{...rootAction, ...stateRoot, isModalAuth: isShowModalAuth}}>
      {renderRootApp}
    </AppContext.Provider>
  );
};

export {RootNavigator};
