import { LINKS } from '@/constants';
import {
  CHeader,
  CInput,
  IconX,
  ImageHelper,
  ModalLanguage,
  ReCaptcha,
  Wrapper,
} from '@/components';
import {
  ScreenWidth,
  images,
  isIOS,
  logError,
  screenStyles,
  statusSuccess,
} from '@/configs';
import useI18n from '@/hooks/useI18n';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CText, CScrollView, Row, CButton, Loader } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  Pressable,
  View,
} from 'react-native';
import { getDeviceId, getDeviceName } from 'react-native-device-info';
import {
  loginByPhone,
  loginBySocial,
  resetAuth,
} from '@/redux/slices/authSlice';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { getLanguages } from '@/redux/slices/globalSlice';
import { ModalPhoneCode } from './components';

// =====================
// STYLES
// =====================
const useStyles = makeStyles(({ colors }) => ({
  countryWrap: {
    backgroundColor: colors.cF9FAFB,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    ...screenStyles.rowCenter,
  },
  countryEnsign: {
    ...screenStyles.box20,
    ...screenStyles.centerWrap,
  },
  formWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
  viewWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  lineOr: {
    height: 1,
    backgroundColor: colors.cEAECF0,
    flex: 1,
  },
  btnStyle: {
    backgroundColor: colors.white,
    borderColor: colors.cD0D5DD,
    borderWidth: 1,
  },
  rightWrapper: {
    right: 16,
    position: 'absolute' as const,
    ...screenStyles.rowCenter,
  },
  logo: {
    width: ScreenWidth / 3.5,
    height: ScreenWidth / 3.5,
  },
}));

// =====================
// TYPES
// =====================
type PhoneCode = {
  value: string;
  label: string;
};

type LoginData = {
  phoneNumber: string;
  phoneCode: PhoneCode;
  otpCode: string;
  useOnboard: Record<string, unknown>;
  loginType: string;
  requiredPhone: number;
};

interface SignInProps {
  onNext: () => void;
  closeModal: () => void;
  dataLogin: LoginData;
  updateLoginData: (name: string, value: string) => void;
  onNextSocial: (result: any, socialType: string) => void;
}

// =====================
// MAIN COMPONENT
// =====================
export const Signin: React.FC<SignInProps> = ({
  onNext,
  closeModal,
  dataLogin,
  updateLoginData,
  onNextSocial,
}) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const { lang, setLang } = useI18n();

  const dispatch = useAppDispatch();

  const { firebaseConfig, languageList }: any = useAppSelector(
    state => state.globalReducer,
  );

  const { loginPhone, loginSocial } = useAppSelector(
    state => state.authReducer,
  );

  const [loading, setLoading] = useState(false);
  const [socialLoginType, setSocialLoginType] = useState('');

  // =====================
  // LOCAL STATE
  // =====================
  const phoneEl = useRef<any>(null);
  const [errPhone, setErrPhone] = useState('');

  const [language, setLanguage] = useState({
    flag: 'https://flagsapi.com/GB/flat/64.png',
    id: 31,
    lang: 'en',
    locale: 'English',
  });

  const [isGenRecapcha, setIsGenRecapcha] = useState<boolean>(false);
  const [capchaToken, setCapChaToken] = useState<string>('');

  const [showModalPhoneCode, setShowModalPhoneCode] = useState(false);
  const [showModalLanguage, setShowModalLanguage] = useState<boolean>(false);

  // =====================
  // INIT GOOGLE + LANGUAGE
  // =====================
  useEffect(() => {
    GoogleSignin.configure();
    dispatch(
      getLanguages({
        fq: `status:1`,
      }),
    );
  }, []);

  // ======================================================
  // INIT LANGUAGE DEFAULT
  // ======================================================
  useEffect(() => {
    if (!lang || !Array.isArray(languageList?.data?.items)) return;

    const found = languageList.data.items.find((x: any) => x.lang === lang);
    if (found) setLanguage(found);
  }, [languageList, lang]);

  // ======================================================
  // LOGIN STEP 1 — When captcha has token → call API login phone
  // ======================================================
  useEffect(() => {
    const requestAPILogin = async () => {
      if (capchaToken !== '') {
        setLoading(true);
        const deviceId = getDeviceId();
        const deviceName = await getDeviceName();
        //cho phep nhap so 0 o Vietnam
        let phoneParse: string = dataLogin.phoneNumber;
        if (dataLogin.phoneCode.value == '+84') {
          let firstCharacter = phoneParse.charAt(0);
          if (firstCharacter == '0') {
            phoneParse = phoneParse.substring(1);
            updateLoginData('phoneNumber', phoneParse);
          }
        }
        const bodyData = {
          phone: dataLogin.phoneCode.value + phoneParse,
          deviceId,
          deviceName,
          ggToken: capchaToken,
        };
        dispatch(loginByPhone(bodyData));
        setCapChaToken('');
      } else {
        console.log('Cannot gen capcha');
      }
    };
    requestAPILogin();
  }, [capchaToken]);

  // ======================================================
  // LOGIN STEP 2 — Process API Login Phone
  // ======================================================
  useEffect(() => {
    const processLoginPhone = () => {
      const { loading, data, error } = loginPhone;
      if (!loading) {
        if (data) {
          setLoading(false);
          const { result, status }: any = data;
          if (statusSuccess(status)) {
            setErrPhone('');
            onNext();
          }
          dispatch(resetAuth());
        } else if (error) {
          setLoading(false);
          setErrPhone(logError(error, '', true));
          dispatch(resetAuth());
        }
      }
    };
    processLoginPhone();
  }, [loginPhone]);

  // ======================================================
  // LOGIN STEP 3 — Process API Login Social
  // ======================================================
  useEffect(() => {
    const processLoginSocial = async () => {
      const { loading, data, error } = loginSocial;
      if (!loading) {
        if (data) {
          setLoading(false);
          const { result, status }: any = data;
          if (statusSuccess(status)) {
            onNextSocial(result, socialLoginType);
          }
          dispatch(resetAuth());
        } else if (error) {
          setErrPhone(logError(error, '', true));
          setLoading(false);
          dispatch(resetAuth());
        }
      }
    };
    processLoginSocial();
  }, [loginSocial]);

  // ======================================================
  // ACTIONS
  // ======================================================

  // ======================================================
  // PHONE CODE + LANGUAGE SELECTORS
  // ======================================================
  const handleChangeCountryCode = () => setShowModalPhoneCode(true);

  const handleUpdatePhoneCode = (code: any) => {
    updateLoginData('phoneCode', code);
    setShowModalPhoneCode(false);
    setErrPhone('');
  };

  const handleChangeLanguage = () => setShowModalLanguage(true);

  const handleChooseLanguage = (languageChange: any) => {
    setLanguage(languageChange);
    setLang(languageChange?.lang ?? lang);
    setShowModalLanguage(false);
  };

  const handleChangeInput = (name: string, value: string) => {
    updateLoginData(name, value);
  };

  const handleLoginByApple = async () => {
    try {
      const res = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const deviceId = getDeviceId();
      const deviceName = await getDeviceName();
      const payload = {
        deviceId,
        deviceName,
        provider: 'apple',
        token: res.identityToken,
      };
      setSocialLoginType('apple');
      setLoading(true);
      dispatch(loginBySocial(payload));
    } catch (err) {
      setLoading(false);
    }
  };

  const handleLoginByGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const deviceId = getDeviceId();
      const deviceName = await getDeviceName();
      const payload = {
        deviceId,
        deviceName,
        provider: 'google',
        token: tokens.accessToken,
      };
      setSocialLoginType('google');
      setLoading(true);
      dispatch(loginBySocial(payload));
    } catch (err: any) {
      setLoading(false);
      if (err.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (err.code === statusCodes.IN_PROGRESS) return;
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) return;
      console.log('Google login error:', err);
    }
  };

  const handleLoginByFacebook = async () => {
    // try {
    //   if (Platform.OS === 'android') {
    //     // LoginManager.logOut();
    //     LoginManager.setLoginBehavior('web_only');
    //   }
    //   const result = await LoginManager.logInWithPermissions([
    //     'public_profile',
    //     'email',
    //   ]);
    //   if (result.isCancelled) {
    //     console.log('User cancelled login');
    //     return;
    //   }
    //   const tokenData = await AccessToken.getCurrentAccessToken();
    //   if (!tokenData?.accessToken) {
    //     console.log('No access token');
    //     return;
    //   }
    //   await getFBToken(tokenData);
    // } catch (err) {
    //   console.log('Facebook login error:', err);
    // }
  };

  const handleTerm = () => Linking.openURL(LINKS.TERMS);
  const handlePolicy = () => Linking.openURL(LINKS.POLICY);

  const actionWithToken = useCallback((token: any) => {
    if (token) {
      setCapChaToken(token);
    } else {
      Alert.alert('Error', 'Capcha could not verified, please try again');
    }
    setIsGenRecapcha(false);
  }, []);

  const handleSubmit = () => {
    Keyboard.dismiss();
    setIsGenRecapcha(true);
  };

  // ======================================================
  // RENDER
  // ======================================================

  const renderRightHead = () => (
    <View style={styles.rightWrapper}>
      <Pressable
        style={[styles.countryWrap, screenStyles.colCenter]}
        onPress={handleChangeLanguage}
      >
        <View style={styles.countryEnsign}>
          <ImageHelper source={{ uri: language.flag }} resizeMode="contain" />
        </View>

        <CText h6 style={screenStyles.mH8} w500 color={colors.c1D2939}>
          {language.lang.toUpperCase()}
        </CText>
        <IconX
          type="fontisto"
          name={'angle-down' as any}
          size={12}
          color={colors.c98A2B3}
        />
      </Pressable>
    </View>
  );

  const renderLogo = () => (
    <Row>
      <View>
        <View style={styles.logo}>
          <Image source={images.global.logo_dog_trans} style={styles.logo} />
        </View>
        <CText h1 w600 color={'#0e7c7a'} center>
          {'Aloka'}
        </CText>
      </View>
    </Row>
  );

  const renderPhoneNumber = () => (
    <CInput
      refChild={phoneEl}
      value={dataLogin.phoneNumber}
      onChange={v => handleChangeInput('phoneNumber', v)}
      errorText={errPhone}
      maxLength={15}
      keyboardType="numeric"
      placeHolder={t('profile.editProfileScreen.phone', 'Phone')}
      returnKeyType={isIOS ? 'done' : 'next'}
      onSubmitEditing={handleSubmit}
      noSpace
      leftIcon={
        <Pressable
          onPress={handleChangeCountryCode}
          style={screenStyles.rowCenter}
        >
          <CText h5 color={colors.c101828}>
            {dataLogin.phoneCode.value}
          </CText>
          <IconX
            type="ionicons"
            name="chevron-down"
            size={18}
            color={colors.c667085}
            style={screenStyles.mH5}
          />
        </Pressable>
      }
    />
  );

  const renderButtonCommon = (index: number, title: string, icon?: any) => {
    const onPress = () => {
      if (index === 0) return handleLoginByApple();
      if (index === 1) return handleLoginByGoogle();
      if (index === 2) return handleLoginByFacebook();
      if (index === 3) return closeModal();
    };

    return (
      <CButton
        title={title}
        btnWidth="100%"
        containerStyle={screenStyles.mT15}
        buttonStyle={styles.btnStyle}
        titleColor={colors.c667085}
        icon={
          icon ? (
            <View style={{ marginRight: 12 }}>
              <Image source={icon} style={screenStyles.box20} />
            </View>
          ) : undefined
        }
        onPress={onPress}
      />
    );
  };

  const renderSocialLogin = () => (
    <>
      {isIOS &&
        renderButtonCommon(
          0,
          t('auth.singinWithApple', 'Sign in with Apple'),
          images.auth.ico_apple,
        )}
      {renderButtonCommon(
        1,
        t('auth.singinWithGoogle', 'Sign in with Google'),
        images.auth.ico_google,
      )}
      {renderButtonCommon(
        2,
        t('auth.singinWithFacebook', 'Sign in with Facebook'),
        images.auth.ico_facebook,
      )}
    </>
  );

  const renderPolicy = () => (
    <Row style={screenStyles.pH8}>
      <CText center h56 color={colors.c101828} style={{ lineHeight: 20 }}>
        {t('auth.agreement', 'By tapping login, you agree to our') + ' '}
        <CText h56 color={colors.primary} w500 onPress={handleTerm}>
          {t('auth.terms', 'Terms of Use')}
        </CText>
        <CText h56 color={colors.c101828}>
          {t(' and ', ' and ')}
        </CText>
        <CText h56 color={colors.primary} w500 onPress={handlePolicy}>
          {t('auth.privacy', 'Privacy Policy')}
        </CText>
      </CText>
    </Row>
  );

  const renderLoginBySocial = () => {
    return (
      <View style={styles.formWrapper}>
        {renderLogo()}
        {renderPhoneNumber()}
        <CButton
          btnWidth="100%"
          title={t('auth.signin', 'Sign in')}
          onPress={handleSubmit}
          isDisable={!dataLogin.phoneNumber}
          style={screenStyles.mT10}
        />
        <Row style={screenStyles.mT15}>
          <View style={styles.lineOr} />
          <CText h5 style={screenStyles.mH12} color={colors.c667085}>
            {t('common.or', 'Or')}
          </CText>
          <View style={styles.lineOr} />
        </Row>
        {renderSocialLogin()}
        <View style={screenStyles.flex1EndBottom}>{renderPolicy()}</View>
      </View>
    );
  };

  const renderLoginNoSocial = () => {
    return (
      <View style={styles.formWrapper}>
        <View style={screenStyles.flex1}>
          {renderLogo()}
          <View style={[screenStyles.flex1, screenStyles.mT30]}>
            {renderPhoneNumber()}
            <CButton
              btnWidth="100%"
              title={t('auth.signin', 'Sign in')}
              onPress={handleSubmit}
              isDisable={!dataLogin.phoneNumber}
              style={screenStyles.mT15}
            />
          </View>
        </View>
        {renderPolicy()}
      </View>
    );
  };

  return (
    <Wrapper safeBottom>
      <CHeader rightComponent={renderRightHead()} leftComponentDisable />
      <CScrollView style={styles.viewWrapper}>
        {firebaseConfig.isReviewApp
          ? renderLoginNoSocial()
          : renderLoginBySocial()}
      </CScrollView>

      {isGenRecapcha && <ReCaptcha onVerify={actionWithToken} />}

      <Loader visible={loading || isGenRecapcha} />

      {showModalLanguage && (
        <ModalLanguage
          isVisible={showModalLanguage}
          hideModal={() => setShowModalLanguage(false)}
          chooseLanguage={handleChooseLanguage}
          languageChoose={language}
        />
      )}

      {showModalPhoneCode && (
        <ModalPhoneCode
          isVisible={showModalPhoneCode}
          hideModal={() => setShowModalPhoneCode(false)}
          choosePhoneCode={handleUpdatePhoneCode}
          phoneCodeChoose={dataLogin.phoneCode}
        />
      )}
    </Wrapper>
  );
};
