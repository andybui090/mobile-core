import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ReCaptcha, Wrapper } from '@/components';
import { CText, Loader } from '@/utils';
import { images, isIOS, logError, statusSuccess } from '@/configs';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
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
import { getDeviceId, getDeviceName } from 'react-native-device-info';

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
  onRegister?: () => void;
}

export const Signin: React.FC<SignInProps> = ({
  onNext,
  closeModal,
  dataLogin,
  updateLoginData,
  onNextSocial,
  onRegister,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { firebaseConfig }: any = useAppSelector(
    state => state.globalReducer,
  );

  const { loginPhone, loginSocial } = useAppSelector(
    state => state.authReducer,
  );

  const [loading, setLoading] = useState(false);
  const [socialLoginType, setSocialLoginType] = useState('');

  const phoneEl = useRef<any>(null);
  const [errPhone, setErrPhone] = useState('');

  const [isGenRecapcha, setIsGenRecapcha] = useState<boolean>(false);
  const [capchaToken, setCapChaToken] = useState<string>('');

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  // LOGIN STEP 1 — When captcha has token → call API login phone
  useEffect(() => {
    const requestAPILogin = async () => {
      if (capchaToken !== '') {
        setLoading(true);
        const deviceId = getDeviceId();
        const deviceName = await getDeviceName();

        let phoneParse: string = dataLogin.phoneNumber.trim();
        const phoneCode = dataLogin.phoneCode?.value || '+84';
        if (phoneCode === '+84') {
          const firstCharacter = phoneParse.charAt(0);
          if (firstCharacter === '0') {
            phoneParse = phoneParse.substring(1);
            updateLoginData('phoneNumber', phoneParse);
          }
        }
        const bodyData = {
          phone: phoneCode + phoneParse,
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

  // LOGIN STEP 2 — Process API Login Phone
  useEffect(() => {
    const processLoginPhone = () => {
      const { loading, data, error } = loginPhone;
      if (!loading) {
        if (data) {
          setLoading(false);
          const { status }: any = data;
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

  // LOGIN STEP 3 — Process API Login Social
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

  const handleChangeInput = (name: string, value: string) => {
    if (errPhone) setErrPhone('');
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
    // Facebook login handler
  };

  const actionWithToken = useCallback((token: any) => {
    if (token) {
      setCapChaToken(token);
    } else {
      Alert.alert('Error', 'Capcha could not verified, please try again');
    }
    setIsGenRecapcha(false);
  }, []);

  const handleSubmit = () => {
    if (!dataLogin.phoneNumber || !dataLogin.phoneNumber.trim()) {
      setErrPhone(t('auth.emptyPhone', 'Vui lòng nhập số điện thoại'));
      return;
    }
    setErrPhone('');
    Keyboard.dismiss();
    setIsGenRecapcha(true);
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    } else {
      onNext();
    }
  };

  const isPhoneValid = Boolean(
    dataLogin.phoneNumber && dataLogin.phoneNumber.trim().length > 0,
  );

  return (
    <Wrapper safeTop safeBottom style={styles.wrapper}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Brand */}
          <View style={styles.logoSection}>
            <Image
              source={images.global.logo_app_trans}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <CText style={styles.brandTitle}>aloka</CText>
          </View>

          {/* Phone Input */}
          <View
            style={[
              styles.inputBox,
              Boolean(errPhone) && styles.inputBoxError,
            ]}
          >
            <TextInput
              ref={phoneEl}
              value={dataLogin.phoneNumber}
              onChangeText={v => handleChangeInput('phoneNumber', v)}
              maxLength={15}
              keyboardType="phone-pad"
              placeholder={t('auth.enterPhone', 'Nhập số điện thoại')}
              placeholderTextColor="#D0D5DD"
              returnKeyType={isIOS ? 'done' : 'next'}
              onSubmitEditing={handleSubmit}
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {Boolean(errPhone) && (
            <CText style={styles.errorText}>{errPhone}</CText>
          )}

          {/* Đăng nhập Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            style={[
              styles.loginBtn,
              isPhoneValid ? styles.loginBtnActive : styles.loginBtnInactive,
            ]}
          >
            <CText
              style={[
                styles.loginBtnText,
                isPhoneValid
                  ? styles.loginBtnTextActive
                  : styles.loginBtnTextInactive,
              ]}
            >
              {t('auth.signin', 'Đăng nhập')}
            </CText>
          </TouchableOpacity>

          {/* Bạn chưa có tài khoản? Đăng ký */}
          {/* <View style={styles.registerRow}>
            <CText style={styles.notMemberText}>
              {t('auth.notAMember', 'Bạn chưa có tài khoản?')}{' '}
            </CText>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleRegister}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CText style={styles.registerLink}>
                {t('auth.register', 'Đăng ký')}
              </CText>
            </TouchableOpacity>
          </View> */}

          {/* Divider "Hoặc" & Social Logins */}
          {!firebaseConfig?.isReviewApp && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <CText style={styles.dividerText}>
                  {t('common.or', 'Hoặc')}
                </CText>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                {isIOS && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleLoginByApple}
                    style={styles.socialBtn}
                  >
                    <Image
                      source={images.auth.ico_apple}
                      style={styles.socialIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleLoginByGoogle}
                  style={styles.socialBtn}
                >
                  <Image
                    source={images.auth.ico_google}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleLoginByFacebook}
                  style={styles.socialBtn}
                >
                  <Image
                    source={images.auth.ico_facebook}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {isGenRecapcha && <ReCaptcha onVerify={actionWithToken} />}

      <Loader visible={loading || isGenRecapcha} />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#21847A',
    marginTop: 10,
    letterSpacing: -0.5,
  },
  inputBox: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputBoxError: {
    borderColor: '#F04438',
  },
  textInput: {
    fontSize: 15,
    color: '#101828',
    paddingVertical: 0,
    height: '100%',
  },
  errorText: {
    color: '#F04438',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  loginBtn: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginBtnInactive: {
    backgroundColor: '#E0F7F6',
  },
  loginBtnActive: {
    backgroundColor: '#0E9384',
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  loginBtnTextInactive: {
    color: '#159A8E',
  },
  loginBtnTextActive: {
    color: '#FFFFFF',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  notMemberText: {
    fontSize: 13,
    color: '#475467',
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#159A8E',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAECF0',
  },
  dividerText: {
    fontSize: 13,
    color: '#98A2B3',
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
});

export default Signin;
