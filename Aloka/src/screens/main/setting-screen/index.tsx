import {
  APILoading,
  CHeader,
  ICON_TYPE,
  ModalLanguage,
  ToggleSwitch,
  Wrapper,
} from '@/components';
import ModalOTP, { OTPType } from '@/components/modal-otp';
import { images, parseIntToBoolean, screenStyles } from '@/configs';
import { STORAGEKEY } from '@/constants';
import { LINKS } from '@/constants/links';
import { mainRoute } from '@/constants/route_key';
import { AppContext } from '@/contexts';
import useI18n from '@/hooks/useI18n';
import {
  getNotifySetting,
  updateFirebaseToken,
  updateNotifySetting,
} from '@/redux/slices/notificationSlice';
import {
  getDeleteAccount,
  postLogout,
  resetProfileSlice,
} from '@/redux/slices/profileSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { RenderItem } from '@/screens/account-tab/account-screen/Components/ItemFlatlist';
import { getStringData, storeStringData } from '@/storages';
import { CScrollView } from '@/utils';
import { getApp } from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from '@react-native-firebase/messaging';
import { useTheme } from '@rneui/themed';

import { isArray } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import PopupConfirm from './popupConfirm';
import PopupSuccess from './popupSuccess';
import useStyles from './style';

const SettingScreen: React.FC<any> = ({ navigation }: any) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { t } = useTranslation();
  const { lang, setLang } = useI18n();
  const dispatch = useAppDispatch();
  const { user, logout } = useContext(AppContext);

  const {
    isDeleteAccount,
    dataDeleteAccount,
    errDeleteAccount,
    isFetchingLogout,
    dataLogout,
    errLogout,
  } = useAppSelector(state => state.profileReducer);
  const { languageList, firebaseConfig } = useAppSelector(
    state => state.globalReducer,
  );
  const { notifySetting, notifyUpdate } = useAppSelector(
    state => state.notifyReducer,
  );

  // STATE & PROPS
  const [isEnabledNotify, setIsEnabledNotify] = useState<boolean>(true);

  const [isVisibleLanguage, setIsVisibleLanguage] = useState<boolean>(false);
  const [language, setLanguage] = useState({
    flag: 'https://flagsapi.com/GB/flat/64.png',
    id: 31,
    lang: 'en',
    locale: 'English',
  });

  const [logoutVisible, setLogoutVisible] = useState<boolean>(false);
  const [deleteAcountVisible, setDeleteAcountVisible] = useState<boolean>(false);
  const [isShowSuccess, setIsShowSuccess] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const [verifyPhone, setVerifyPhone] = useState({
    isVisible: false,
    phoneShow: '',
    phoneSend: '',
  });

  // Notify initialization
  useEffect(() => {
    dispatch(getNotifySetting(null));
  }, [dispatch]);

  useEffect(() => {
    const initDataNotify = () => {
      const { loading, data } = notifySetting;
      if (!loading && data) {
        let dataParent: any = data;
        if (dataParent?.result?.notification) {
          setIsEnabledNotify(
            parseIntToBoolean(dataParent?.result?.notification?.all),
          );
        }
      }
    };
    initDataNotify();
  }, [notifySetting]);

  useEffect(() => {
    const processUpdateNotify = () => {
      const { loading, data, error } = notifyUpdate;
      if (!loading) {
        if (data) {
          console.log('processUpdateNotify data:', data);
        } else if (error) {
          console.log('processUpdateNotify error:', error);
        }
      }
    };
    processUpdateNotify();
  }, [notifyUpdate]);

  // Delete Account listener
  useEffect(() => {
    const processAPIDeleteAccount = () => {
      if (!isDeleteAccount) {
        if (dataDeleteAccount) {
          setShowAlert(false);
          setIsLoadingAPI(false);
          setTimeout(() => {
            setIsShowSuccess(true);
          }, 300);
          dispatch(resetProfileSlice(null));
        } else if (errDeleteAccount) {
          setShowAlert(false);
          setIsLoadingAPI(false);
          dispatch(resetProfileSlice(null));
          Alert.alert(
            t('common.error', 'Lỗi'),
            t(
              'settings.deleteAccError',
              'Không thể xóa tài khoản. Vui lòng thử lại sau.',
            ),
          );
        }
      }
    };
    processAPIDeleteAccount();
  }, [isDeleteAccount, dataDeleteAccount, errDeleteAccount, dispatch, t]);

  // Logout listener
  useEffect(() => {
    const processAPILogoutAccount = () => {
      if (!isFetchingLogout) {
        if (dataLogout) {
          console.log('processAPILogoutAccount dataLogout:', dataLogout);
        } else if (errLogout) {
          console.log('processAPILogoutAccount errLogout:', errLogout);
        }
      }
    };
    processAPILogoutAccount();
  }, [isFetchingLogout, dataLogout, errLogout]);

  // Language default initialization
  useEffect(() => {
    const initLanguageDefault = () => {
      if (lang && isArray(languageList?.data?.items)) {
        for (let i = 0; i < languageList?.data?.items.length; i++) {
          if (languageList?.data?.items[i].lang === lang) {
            setLanguage(languageList?.data?.items[i]);
            break;
          }
        }
      }
    };
    initLanguageDefault();
  }, [languageList?.data, lang]);

  // FUNCTIONS
  const handleNotify = async () => {
    const nextStatus = !isEnabledNotify;
    setIsEnabledNotify(nextStatus);
    dispatch(
      updateNotifySetting({
        type: 'All',
        status: nextStatus ? 1 : 0,
      }),
    );

    if (nextStatus) {
      const firebaseToken = await getStringData(STORAGEKEY.FIREBASE_TOKEN);
      if (firebaseToken) {
        dispatch(
          updateFirebaseToken({
            token: firebaseToken,
          }),
        );
      } else {
        try {
          const app = getApp();
          const msgInstance = getMessaging(app);
          const authStatus = await requestPermission(msgInstance, {
            alert: true,
            badge: true,
            sound: true,
          });
          if (
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL
          ) {
            const token = await getToken(msgInstance);
            if (token) {
              dispatch(
                updateFirebaseToken({
                  token,
                }),
              );
              storeStringData(STORAGEKEY.FIREBASE_TOKEN, token);
            }
          }
        } catch (err) {
          console.log('FCM permission/token error:', err);
        }

      }
    }
  };

  const handleChooseLanguage = (languageChange: any) => {
    setLanguage(languageChange);
    setLang(languageChange?.lang || lang);
    setIsVisibleLanguage(false);
  };

  const handleLogout = async () => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      dispatch(postLogout({ deviceId }));
    } catch (e) {
      dispatch(postLogout({}));
    }
    await storeStringData(STORAGEKEY.CHECKLOCAL_FIRST, 'false');
    setTimeout(() => {
      logout?.();
      if (!firebaseConfig?.isRequireLogin) {
        if (navigation.canGoBack()) {
          navigation.pop();
        }
        navigation.navigate('HomeTab');
      }
    }, 300);
  };

  const handleVerifySuccess = async () => {
    setVerifyPhone({
      isVisible: false,
      phoneShow: '',
      phoneSend: '',
    });
    Keyboard.dismiss();
    setTimeout(() => {
      setShowAlert(true);
      setIsLoadingAPI(true);
    }, 300);

    try {
      const deviceId = await DeviceInfo.getUniqueId();
      dispatch(postLogout({ deviceId }));
    } catch (e) {
      dispatch(postLogout({}));
    }

    setTimeout(() => {
      dispatch(getDeleteAccount(null));
    }, 500);
  };

  const handleDeleteAccount = () => {
    setDeleteAcountVisible(false);
    setTimeout(() => {
      setVerifyPhone({
        isVisible: true,
        phoneShow: user?.phone || '',
        phoneSend: user?.phone || '',
      });
    }, 300);
  };

  const handleDone = () => {
    logout?.();
    if (!firebaseConfig?.isRequireLogin) {
      if (navigation.canGoBack()) {
        navigation.pop();
      }
      navigation.navigate('HomeTab');
    }
  };

  const handleTerm = () => {
    Linking.openURL(LINKS.TERMS).catch(() => {
      Alert.alert('Thông báo', 'Không thể mở liên kết');
    });
  };

  const handlePolicy = () => {
    Linking.openURL(LINKS.POLICY).catch(() => {
      Alert.alert('Thông báo', 'Không thể mở liên kết');
    });
  };

  const handlePaymentPolicy = () => {
    Linking.openURL(LINKS.PAYMENT).catch(() => {
      Alert.alert('Thông báo', 'Không thể mở liên kết');
    });
  };

  const handlePaymentGuide = () => {
    Linking.openURL(LINKS.GUIDE_PAYMENT).catch(() => {
      Alert.alert('Thông báo', 'Không thể mở liên kết');
    });
  };

  const handleRefundPolicy = () => {
    Linking.openURL(LINKS.REFUND).catch(() => {
      Alert.alert('Thông báo', 'Không thể mở liên kết');
    });
  };

  // Render helpers
  const renderNoti = () => {
    return (
      <ToggleSwitch
        size="basic"
        isOn={isEnabledNotify}
        onToggle={handleNotify}
        onColor={colors.primary || '#19A2A7'}
        offColor={'#D0D5DD'}
      />
    );
  };

  const renderIcon = (img?: any, bg?: any) => {
    return (
      <View
        style={[
          styles.icon,
          {
            backgroundColor: bg,
          },
        ]}
      >
        <Image
          source={img}
          style={screenStyles.fillParent}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <Wrapper>
      <CHeader
        title={t('settings.settings', 'Cài đặt')}
        leftComponentOnPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
        isBorderBottom
      />
      <CScrollView style={styles.container}>
        {/* Section 1: Thông báo & Ngôn ngữ */}
        <View style={styles.bgWhite}>
          <RenderItem
            title={t('settings.notifications', 'Thông báo')}
            nameIcon={'notifications'}
            typeIcon={ICON_TYPE.IONICONS}
            iconBg={'#F63D68'}
            leftRowChill={renderNoti}
            onPress={handleNotify}
          />
          <RenderItem
            isHideBottom
            title={t('settings.language', 'Ngôn ngữ')}
            nameIcon={'globe-outline'}
            typeIcon={ICON_TYPE.IONICONS}
            iconBg={colors.primary || '#19A2A7'}
            onPress={() => setIsVisibleLanguage(true)}
          />
        </View>

        {/* Section 2: Trợ giúp & Chính sách */}
        <View style={styles.bgWhite}>
          <RenderItem
            title={t('settings.reportAProblem', 'Trợ giúp & hỗ trợ')}
            customIconLeft={() =>
              renderIcon(images.setting.img_info, '#F79009')
            }
            onPress={() => {
              navigation.navigate('FeedbackScreen');
            }}
          />
          {!firebaseConfig?.isReviewApp && (
            <RenderItem
              title={t('settings.paymentPolicy', 'Chính sách thanh toán')}
              customIconLeft={() =>
                renderIcon(images.setting.ico_info, '#34C7D0')
              }
              onPress={handlePaymentPolicy}
            />
          )}
          {!firebaseConfig?.isReviewApp && (
            <RenderItem
              title={t('settings.refundPolicy', 'Chính sách hoàn trả')}
              customIconLeft={() =>
                renderIcon(images.setting.ico_info, '#34C7D0')
              }
              onPress={handleRefundPolicy}
            />
          )}
          {!firebaseConfig?.isReviewApp && (
            <RenderItem
              title={t('settings.paymentGuide', 'Hướng dẫn thanh toán')}
              customIconLeft={() =>
                renderIcon(images.setting.ico_info, '#34C7D0')
              }
              onPress={handlePaymentGuide}
            />
          )}
          <RenderItem
            title={t('settings.privacyPolicy', 'Chính sách Quyền riêng tư')}
            customIconLeft={() =>
              renderIcon(images.setting.ico_info, '#34C7D0')
            }
            onPress={handlePolicy}
          />
          <RenderItem
            title={t('settings.termsOfUse', 'Điều khoản sử dụng')}
            customIconLeft={() =>
              renderIcon(images.setting.ico_rules, '#4AB95C')
            }
            onPress={handleTerm}
          />
          <RenderItem
            isHideBottom
            title={t('settings.aboutUs', 'Về Chúng tôi')}
            nameIcon={'information-circle'}
            typeIcon={ICON_TYPE.IONICONS}
            iconBg={colors.primary || '#19A2A7'}
            onPress={() => {
              navigation.navigate('AboutUsScreen');
            }}
          />
        </View>


        {/* Section 3: Xóa tài khoản */}
        <View style={styles.bgWhite}>
          <RenderItem
            isHideBottom
            title={t('settings.deleteAcc', 'Xóa Tài khoản')}
            titleColor={'#F04438'}
            nameIcon={'trash-outline'}
            typeIcon={ICON_TYPE.IONICONS}
            iconBg={'#F04438'}
            onPress={() => setDeleteAcountVisible(true)}
          />
        </View>

        {/* Section 4: Đăng xuất */}
        <View style={styles.bgWhite}>
          <RenderItem
            isHideBottom
            title={t('settings.logout', 'Đăng xuất')}
            nameIcon={'log-out-outline'}
            typeIcon={ICON_TYPE.IONICONS}
            iconBg={'#98A2B3'}
            onPress={() => setLogoutVisible(true)}
          />
        </View>
      </CScrollView>

      {/* Modal chọn ngôn ngữ */}
      <ModalLanguage
        isVisible={isVisibleLanguage}
        hideModal={() => setIsVisibleLanguage(false)}
        chooseLanguage={handleChooseLanguage}
        languageChoose={language}
      />

      {/* Popup xác nhận Xóa tài khoản */}
      {deleteAcountVisible && (
        <PopupConfirm
          isVisible={deleteAcountVisible}
          title={t('settings.deleteAccConfirm.title', 'Xóa Tài khoản vĩnh viễn')}
          description={t(
            'settings.deleteAccConfirm.description',
            'Bạn thật sự bạn muốn thoát ứng dụng? Hãy sớm trở lại bạn nhé!',
          )}
          hideModal={() => setDeleteAcountVisible(false)}
          onConfirm={handleDeleteAccount}
          confirmText={t('settings.deleteAcc', 'Xóa Tài khoản')}
          confirmType="delete"
          icon="close"
        />
      )}

      {/* Modal OTP xác thực số điện thoại để xóa tài khoản */}
      {verifyPhone.isVisible && (
        <ModalOTP
          isVisible={verifyPhone.isVisible}
          phone={verifyPhone.phoneSend}
          hideModalOTP={() => {
            setVerifyPhone({
              isVisible: false,
              phoneShow: '',
              phoneSend: '',
            });
            Keyboard.dismiss();
          }}
          callBackVerifySuccess={handleVerifySuccess}
          email={user?.email || ''}
          otpType={OTPType.delete}
        />
      )}

      {/* Alert Loading API */}
      {showAlert ? (
        <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
      ) : null}

      {/* Popup xác nhận Đăng xuất */}
      {logoutVisible && (
        <PopupConfirm
          isVisible={logoutVisible}
          title={t('settings.logout', 'Đăng xuất')}
          description={t(
            'settings.logoutMessage',
            'Bạn có chắc chắn muốn đăng xuất?',
          )}
          hideModal={() => setLogoutVisible(false)}
          onConfirm={handleLogout}
          confirmText={t('settings.logout', 'Đăng xuất')}
          confirmType="logout"
          icon="close"
        />
      )}

      {/* Popup Xóa tài khoản thành công */}
      {isShowSuccess && (
        <PopupSuccess
          isVisible={isShowSuccess}
          hideModal={() => setIsShowSuccess(false)}
          onConfirm={handleDone}
          title={t(
            'settings.deleteAccConfirm.success',
            'Xóa tài khoản thành công',
          )}
          confirmText={t('common.done', 'Xong')}
        />
      )}
    </Wrapper>
  );
};

export default SettingScreen;
