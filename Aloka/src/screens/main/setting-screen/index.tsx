import {
  APILoading,
  CHeader,
  IconType,
  ToggleSwitch,
  Wrapper,
  ModalLanguage,
} from '@/components';
import { getDeviceId, images, screenStyles, statusSuccess } from '@/configs';
import { AppContext } from '@/contexts';
import { goBack } from '@/navigation/RootNavigation';
import {
  callDeleteAccount,
  postLogout,
  resetProfileSlice,
} from '@/redux/slices/profileSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CScrollView } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Keyboard, Linking, View } from 'react-native';
import { PopupConfirm, PopupSuccess, SettingItem } from './components';
import ModalOTP, { OTPType } from '@/components/modal-otp';
import useI18n from '@/hooks/useI18n';
import { LINKS, mainRoute } from '@/constants';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.cFCFCFD,
  },
  sessionWrapper: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
  },
  icon: {
    width: 26,
    height: 26,
    padding: 4,
    borderRadius: 4,
  },
}));

const SettingScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const {lang, setLang} = useI18n();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { user, logout } = useContext(AppContext);
  const dispatch = useAppDispatch();

  const { logoutData, deleteAccountData } = useAppSelector(
    state => state.profileReducer,
  );
  // -------------------------------
  // STATE
  // -------------------------------
  const [isEnabledNotify, setIsEnabledNotify] = useState<boolean>(true);
  const [logoutVisible, setLogoutVisible] = useState<boolean>(false);

  // const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState<boolean>(false);

  const [deleteAcountVisible, setDeleteAcountVisible] =
    useState<boolean>(false);
  const [isShowSuccess, setIsShowSuccess] = useState<boolean>(false);

  const [verifyPhone, setVerifyPhone] = useState<any>({
    isVisible: false,
    phoneShow: '',
    phoneSend: '',
  });

  const [isVisibleLanguage, setIsVisibleLanguage] = useState<boolean>(false);
  const [language, setLanguage] = useState({
    flag: 'https://flagsapi.com/GB/flat/64.png',
    id: 31,
    lang: 'en',
    locale: 'English',
  });

  // -------------------------------
  // EFFECT
  // -------------------------------
  useEffect(() => {
    const processLogoutApp = () => {
      const { loading, data, error } = logoutData;
      if (!loading) {
        if (data) {
          setIsLoadingAPI(false);
          const { status }: any = data;
          console.log('🚀 ~ processLogoutApp ~ data:', data);
          if (statusSuccess(status)) {
            logout?.();
          }
          resetProfileSlice();
        } else if (error) {
          console.log('🚀 ~ processLogoutApp ~ error:', error);
          // Neu khong logout dc tren server van cho phep logout local app
          logout?.();
          setIsLoadingAPI(false);
          resetProfileSlice();
        }
      }
    };
    processLogoutApp();
  }, [logoutData]);

  useEffect(() => {
    const processDeleteAccount = async () => {
      const { loading, data, error } = deleteAccountData;
      if (!loading) {
        if (data) {
          setIsLoadingAPI(false);
          const { status }: any = data;
          console.log('🚀 ~ processDeleteAccount ~ data:', data);
          if (statusSuccess(status)) {
            logout?.();
          }
          resetProfileSlice();
        } else if (error) {
          console.log('🚀 ~ processDeleteAccount ~ error:', error);
          setIsLoadingAPI(false);
          resetProfileSlice();
        }
      }
    };
    processDeleteAccount();
  }, [deleteAccountData]);

  // -------------------------------
  // ACTION
  // -------------------------------
  const handleNotify = () => {};

  const handleLogout = () => {
    setLogoutVisible(false);

    setTimeout(async () => {
      setIsLoadingAPI(true);
      const deviceId = await getDeviceId();
      dispatch(postLogout({ deviceId }));
    }, 300);
  };

  const handleDeleteAccountSuccess = () => {};

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

  const handleVerifySuccess = () => {
    setVerifyPhone({
      isVisible: false,
      phoneShow: '',
      phoneSend: '',
    });
    Keyboard.dismiss();
    setTimeout(() => {
      setIsLoadingAPI(true);
      dispatch(callDeleteAccount(null));
    }, 300);
  };

  const handleChooseLanguage = (languageChange: any) => {
    setLanguage(languageChange);
    setLang(languageChange?.lang || lang);
    setIsVisibleLanguage(false);
  };

  const handleTerm = () => {
    Linking.openURL(LINKS.TERMS);
  };

  const handlePolicy = () => {
    Linking.openURL(LINKS.POLICY);
  };

  const handlePaymentPolicy = () => {
    Linking.openURL(LINKS.PAYMENT);
  };

  const handlePaymentGuide = () => {
    Linking.openURL(LINKS.GUIDE_PAYMENT);
  };

  const handleRefundPolicy = () => {
    Linking.openURL(LINKS.REFUND);
  };

  const handleGuideApp = () => {
    Linking.openURL(LINKS.GUIDE_APP);
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderToggleNotify = () => {
    return (
      <ToggleSwitch
        size="basic"
        isOn={isEnabledNotify}
        onToggle={handleNotify}
        onColor={colors.primary}
        offColor={colors.c98A2B3}
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

  const renderContent = () => {
    return (
      <CScrollView style={styles.container}>
        <View style={styles.sessionWrapper}>
          <SettingItem
            label={t('settings.notifications')}
            iconName={'notifications'}
            iconType={IconType.IONICONS}
            iconBg={'#F63D68'}
            leftRowChill={renderToggleNotify}
            isBorderBottom
          />
          <SettingItem
            label={t('settings.language')}
            iconName={'language'}
            iconType={IconType.IONICONS}
            iconBg={colors.primary}
            onPress={() => setIsVisibleLanguage(true)}
          />
        </View>
        <View style={styles.sessionWrapper}>
          <SettingItem
            label={t('settings.reportAProblem')}
            iconName={'help-buoy-outline'}
            iconType={IconType.IONICONS}
            iconBg={'#F79009'}
            onPress={() => navigation.navigate(mainRoute.feedbackScreen)}
            isBorderBottom
          />
          <SettingItem
            label={t('settings.paymentPolicy', 'Chính sách thanh toán')}
            iconName={'privacy-tip'}
            iconType={IconType.MATERIAL_ICONS}
            iconBg={'#34C7D0'}
            onPress={handlePaymentPolicy}
            isBorderBottom
          />
          <SettingItem
            label={t('settings.refundPolicy', 'Chính sách hoàn trả')}
            iconName={'privacy-tip'}
            iconType={IconType.MATERIAL_ICONS}
            iconBg={'#34C7D0'}
            onPress={handleRefundPolicy}
            isBorderBottom
          />
          <SettingItem
            label={t('settings.paymentGuide', 'Hướng dẫn thanh toán')}
            iconName={'privacy-tip'}
            iconType={IconType.MATERIAL_ICONS}
            iconBg={'#34C7D0'}
            onPress={handlePaymentGuide}
            isBorderBottom
          />
          <SettingItem
            label={t('settings.termsOfUse')}
            customIconLeft={() =>
              renderIcon(images.global.ico_rules, '#4AB95C')
            }
            onPress={handleTerm}
            isBorderBottom
          />
          <SettingItem
            label={t('settings.aboutUs', 'Về Chúng tôi')}
            iconName={'information-circle'}
            iconType={IconType.IONICONS}
            iconBg={'#19A2A7'}
            onPress={() => navigation.navigate(mainRoute.aboutUsScreen)}
          />
        </View>

        <View style={styles.sessionWrapper}>
          <SettingItem
            label={t('settings.deleteAcc', 'Xóa Tài khoản')}
            iconName={'trash-outline'}
            iconType={IconType.IONICONS}
            iconBg={'#F04438'}
            titleColor={'#F04438'}
            onPress={() => setDeleteAcountVisible(true)}
          />
        </View>

        <View style={styles.sessionWrapper}>
          <SettingItem
            label={t('settings.logout', 'Đăng xuất')}
            iconName={'log-out-outline'}
            iconType={IconType.IONICONS}
            iconBg={'#98A2B3'}
            onPress={() => setLogoutVisible(true)}
          />
        </View>
      </CScrollView>
    );
  };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={goBack}
        title={t('settings.settings', 'Cài đặt')}
        isBorderBottom
      />
      {renderContent()}
      <ModalLanguage
        isVisible={isVisibleLanguage}
        hideModal={() => setIsVisibleLanguage(false)}
        chooseLanguage={handleChooseLanguage}
        languageChoose={language}
      />
      {/* Popup xác nhận Đăng xuất */}
      {logoutVisible && (
        <PopupConfirm
          isVisible={logoutVisible}
          title={t('settings.logout', 'Đăng xuất')}
          description={t(
            'settings.logoutMessage',
            'Bạn có chắc chắn muốn đăng xuất?',
          )}
          confirmType="logout"
          confirmText={t('settings.logout', 'Đăng xuất')}
          hideModal={() => setLogoutVisible(false)}
          onConfirm={handleLogout}
        />
      )}

      {/* Popup xác nhận Xóa tài khoản */}
      {deleteAcountVisible && (
        <PopupConfirm
          isVisible={deleteAcountVisible}
          title={t(
            'settings.deleteAccConfirm.title',
            'Xóa Tài khoản vĩnh viễn',
          )}
          description={t(
            'settings.deleteAccConfirm.description',
            'Bạn thật sự bạn muốn thoát ứng dụng? Hãy sớm trở lại bạn nhé!',
          )}
          hideModal={() => setDeleteAcountVisible(false)}
          onConfirm={handleDeleteAccount}
          confirmText={t('settings.deleteAcc', 'Xóa Tài khoản')}
          confirmType="delete"
        />
      )}

      {verifyPhone.isVisible && (
        <ModalOTP
          isVisible={verifyPhone.isVisible}
          phone={verifyPhone.phoneSend}
          hideModalOTP={() => {
            setVerifyPhone({
              ...verifyPhone,
              isVisible: false,
            });
            Keyboard.dismiss();
          }}
          callBackVerifySuccess={handleVerifySuccess}
          email={user.email || ''}
          otpType={OTPType.delete}
        />
      )}

      {/* Popup Xóa tài khoản thành công */}
      {isShowSuccess && (
        <PopupSuccess
          isVisible={isShowSuccess}
          hideModal={() => setIsShowSuccess(false)}
          onConfirm={handleDeleteAccountSuccess}
          title={t(
            'settings.deleteAccConfirm.success',
            'Xóa tài khoản thành công',
          )}
          confirmText={t('common.done', 'Xong')}
        />
      )}

      {isLoadingAPI ? (
        <APILoading showAlert={true} isLoadingAPI={true} />
      ) : null}
    </Wrapper>
  );
};

export default SettingScreen;
