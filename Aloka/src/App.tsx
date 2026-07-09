// RF DONE
import { RootNavigator } from '@/navigation';
// import LottieSplashScreen from '@attarchi/react-native-lottie-splash-screen';
// import notifee, {EventType} from '@notifee/react-native';
// import {useEffect} from 'react';
import { Platform, StatusBar } from 'react-native';
// import Orientation from 'react-native-orientation-locker';
// import Toast from 'react-native-toast-message';
// import {
//   getTrackingStatus,
//   requestTrackingPermission,
// } from 'react-native-tracking-transparency';

// import FirebaseConfigProvider from './FirebaseConfigProvider';
// import {TourGuideProvider} from './components/rn-tourguide-custom';

// import {GAEvents, GALogEvent} from '@/configs';
// import {PaperProvider} from 'react-native-paper';
// import {STORAGEKEY} from './constants';
// import {AppreviewProvider} from './contexts/AppreviewContext';
// import customEventEmitter, {CUSTOM_EVENTS} from './notify-helper';
// import {storeStringData} from './storages';
// import {NetworkAwareProvider} from './utils';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {getApp} from '@react-native-firebase/app';
// import {
//   AuthorizationStatus,
//   getInitialNotification,
//   getMessaging,
//   getToken,
//   onMessage,
//   onNotificationOpenedApp,
//   onTokenRefresh,
//   requestPermission,
// } from '@react-native-firebase/messaging';
// import {useTranslation} from 'react-i18next';
import { View } from 'react-native';
// import {registerTranslation} from 'react-native-paper-dates';

function App({ updateTrackingApp }: any) {
  // const {t} = useTranslation();
  // registerTranslation('vi', {
  //   save: t('common.save'), // ví dụ key trong i18n của bạn
  //   selectSingle: t('date.selectSingle', 'Chọn ngày'),
  //   selectMultiple: t('date.selectMultiple'),
  //   selectRange: t('date.selectRange', 'Chọn khoảng thời gian'),
  //   notAccordingToDateFormat: inputFormat =>
  //     t('date.invalidFormat', {format: inputFormat}),
  //   mustBeHigherThan: date => t('date.mustBeHigherThan', {date}),
  //   mustBeLowerThan: date => t('date.mustBeLowerThan', {date}),
  //   mustBeBetween: (startDate, endDate) =>
  //     t('date.mustBeBetween', {startDate, endDate}),
  //   dateIsDisabled: t('date.disabled'),
  //   previous: t('common.previous'),
  //   next: t('common.next'),
  //   typeInDate: t('date.typeIn'),
  //   pickDateFromCalendar: t('date.pickFromCalendar'),
  //   close: t('common.close'),
  //   hour: t('date.hour'),
  //   minute: t('date.minute'),
  // });

  // registerTranslation('en', {
  //   save: t('common.save', 'Save'), // ví dụ key trong i18n của bạn
  //   selectSingle: t('date.selectSingle', 'Pick a date'),
  //   selectMultiple: t('date.selectMultiple'),
  //   selectRange: t('date.selectRange', 'Select Range'),
  //   notAccordingToDateFormat: inputFormat =>
  //     t('date.invalidFormat', {format: inputFormat}),
  //   mustBeHigherThan: date => t('date.mustBeHigherThan', {date}),
  //   mustBeLowerThan: date => t('date.mustBeLowerThan', {date}),
  //   mustBeBetween: (startDate, endDate) =>
  //     t('date.mustBeBetween', {startDate, endDate}),
  //   dateIsDisabled: t('date.disabled'),
  //   previous: t('common.previous'),
  //   next: t('common.next'),
  //   typeInDate: t('date.typeIn'),
  //   pickDateFromCalendar: t('date.pickFromCalendar'),
  //   close: t('common.close'),
  //   hour: t('date.hour'),
  //   minute: t('date.minute'),
  // });

  // useEffect(() => {
  //   Orientation.lockToPortrait();
  //   const logFirstOpen = async () => {
  //     const isLogged = await AsyncStorage.getItem('fb_first_open_logged');
  //     if (!isLogged) {
  //       await AsyncStorage.setItem('fb_first_open_logged', 'true');
  //     }
  //   };
  //   logFirstOpen();
  // }, []);

  // useEffect(() => {
  //   getTrackingStatus()
  //     .then(status => {
  //       console.log('🚀 ~ App ~ getTrackingStatus:', status);
  //       updateTrackingApp(status === 'authorized');
  //     })
  //     .catch(e => console.log('Error', e?.toString?.() ?? e));
  // }, []);

  const hideSlashScreen = async () => {
    // LottieSplashScreen?.hide();

    // try {
    //   const status = await requestTrackingPermission();
    //   updateTrackingApp(status === 'authorized');
    // } catch (e) {
    //   console.log('Error', e?.toString?.() ?? e);
    // }

    // await checkPushNotifications();
    // GALogEvent(GAEvents.APP_OPEN, {method: 'App Open'});
  };

  // const initNotify = async () => {
  //   try {
  //     // 1️⃣ Lấy instance messaging theo modular API
  //     const app = getApp();
  //     const messaging = getMessaging(app);

  //     // 2️⃣ Xin quyền (không truyền options)
  //     const authStatus = await requestPermission(messaging);
  //     console.log('🚀 ~ initNotify ~ authStatus:', authStatus);

  //     const enabled =
  //       authStatus === AuthorizationStatus.AUTHORIZED ||
  //       authStatus === AuthorizationStatus.PROVISIONAL;

  //     if (!enabled) {
  //       console.log('🚫 User denied notification permission');
  //       return;
  //     }

  //     console.log('🚀 Notifications Authorized');

  //     // 3️⃣ Lấy token (modular)
  //     const token = await getToken(messaging);
  //     console.log('🔥 FIREBASE_TOKEN:', token);
  //     storeStringData(STORAGEKEY.FIREBASE_TOKEN, token);

  //     // 4️⃣ Refresh token
  //     onTokenRefresh(messaging, newToken => {
  //       storeStringData(STORAGEKEY.FIREBASE_TOKEN, newToken);
  //     });

  //     // 5️⃣ Foreground messages
  //     onMessage(messaging, async remoteMessage => {
  //       processNotification(remoteMessage, false);
  //     });

  //     // 6️⃣ Background tap
  //     onNotificationOpenedApp(messaging, remoteMessage => {
  //       processNotification(remoteMessage, true);
  //     });

  //     // 7️⃣ App kill → mở bằng notify
  //     const initial = await getInitialNotification(messaging);
  //     if (initial) {
  //       processNotification(initial, true);
  //     }
  //   } catch (err) {
  //     console.log('===initNotify ERR=== ', err);
  //   }
  // };

  // const checkPushNotifications = async () => {
  //   await notifee.requestPermission();
  //   if (Platform.OS === 'android') {
  //     await notifee.createChannel({
  //       id: 'doctornetwork_globalnotify',
  //       name: 'Doctor Network',
  //     });
  //   }
  //   initNotify();
  // };

  // useEffect(() => {
  //   return notifee.onForegroundEvent(({type, detail}) => {
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         break;
  //       case EventType.PRESS:
  //         customEventEmitter.emit(CUSTOM_EVENTS.ON_NOTIFICATION_OPEN, {
  //           ...detail.notification,
  //           fromBackground: false,
  //           isPressed: true,
  //         });
  //         break;
  //     }
  //   });
  // }, []);

  // const processNotification = async (
  //   remoteMessage: any,
  //   fromBackground: boolean,
  // ) => {
  //   if (fromBackground) {
  //     setTimeout(() => {
  //       customEventEmitter.emit(CUSTOM_EVENTS.ON_NOTIFICATION_OPEN, {
  //         ...remoteMessage,
  //         isPressed: true,
  //       });
  //     }, 1500);
  //   } else {
  //     customEventEmitter.emit(CUSTOM_EVENTS.ON_NOTIFICATION_OPEN, {
  //       ...remoteMessage,
  //       isPressed: false,
  //     });

  //     await notifee.displayNotification({
  //       title: remoteMessage?.notification?.title,
  //       body: remoteMessage?.notification?.body,
  //       data: remoteMessage?.data,
  //       android: {
  //         channelId: 'doctornetwork_globalnotify',
  //       },
  //     });
  //   }
  // };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator 
        onCompleteLoading={hideSlashScreen} 
      />
      {/* <PaperProvider>
        <TourGuideProvider
          preventOutsideInteraction={true}
          androidStatusBarVisible={true}>
          <RootNavigator onCompleteLoading={hideSlashScreen} />
        </TourGuideProvider>
      </PaperProvider>
      <NetworkAwareProvider />
      <FirebaseConfigProvider />
      <AppreviewProvider />
      <Toast /> */}
    </View>
  );
}

export default App;
