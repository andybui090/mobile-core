import { APILoading, ActionSheet, CHeader, IconX, ReCaptcha, Wrapper } from '@/components';
import { OTPType } from '@/components/modal-otp';
import {
  ScreenWidth,
  getDeviceId,
  images,
  logError,
  screenStyles,
  statusSuccess,
} from '@/configs';
import { AppContext } from '@/contexts';
import {
  resendOTP,
  resetAuth,
  resetOTP,
  verifyOTP,
} from '@/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CScrollView, CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import OTPCustom from './OTPCustom';

const useStyles = makeStyles(({ colors }) => ({
  otpCustomWrapper: {
    ...screenStyles.centerWrap,
    marginTop: 20,
    marginBottom: 15,
  },
  txtError: {
    color: colors.error,
  },
  formWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logo: {
    width: ScreenWidth / 3.5,
    height: ScreenWidth / 3.5,
  },
}));

const DELAY_TIME = 60; //s

const OTP = ({
  dataLogin,
  goBack,
  updateLoginData,
  closeModal,
  gotoOnboard,
}: any) => {
  const { login } = useContext(AppContext);
  const otpRef = useRef<any>(null);
  const actionSheetRef = useRef<any>(null);

  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  const dispatch = useAppDispatch();
  const { otpVerify, otpResend } = useAppSelector(state => state.authReducer);

  const [timerCount, setTimer] = useState(DELAY_TIME); //3ph
  const [errOTP, setErrorOTP] = useState('');
  const [resetTimer, setResetTimer] = useState(false);
  const [capchaToken, setCapChaToken] = useState<string>('');
  const [isGenRecapcha, setIsGenRecapcha] = useState<boolean>(false);

  const [options] = useState([
    `(028) 3526 4818`,
    'info@mcv.com.vn',
    t('common.cancel'),
  ]);

  //EFFECT
  useEffect(() => {
    dispatch(resetOTP(null));
    return () => {
      dispatch(resetOTP(null));
    };
  }, []);

  useEffect(() => {
    const OTPTimer = setInterval(() => {
      setTimer(lastTimerCount => {
        if (lastTimerCount <= 1) {
          setResetTimer(false);
          clearInterval(OTPTimer);
          return 0;
        }
        return lastTimerCount - 1;
      });
    }, 1000); //each count
    return () => clearInterval(OTPTimer);
  }, [resetTimer]);

  useEffect(() => {
    const processVerifyOTP = () => {

      if (!otpVerify.loading) {
        if (otpVerify.data) {
          const { status, result }: any = otpVerify.data;
          console.log('🚀 ~ processVerifyOTP ~ result:', result);
          const hasUsername = Boolean(result?.username);
          if (hasUsername) {
            login(result || {});
            closeModal();
          } else {
            // Unregistered user -> Go to Onboarding
            updateLoginData('otpCode', '');
            gotoOnboard(result || {});
          }
          dispatch(resetAuth());
          dispatch(resetOTP(null));
        } else if (otpVerify.error) {
          setErrorOTP(logError(otpVerify.error, '', true));
          updateLoginData('otpCode', '');
          otpRef.current?.clear?.();
          dispatch(resetOTP(null));
        }
      }
    };
    processVerifyOTP();
  }, [otpVerify]);

  useEffect(() => {
    const processResendOTP = () => {
      if (!otpResend.loading) {
        if (otpResend.data) {
          dispatch(resetAuth());
        } else if (otpResend.error) {
          setErrorOTP(logError(otpResend.error, '', true));
          dispatch(resetAuth());
        }
      }
    };
    processResendOTP();
  }, [otpResend]);

  const actionWithToken = useCallback((token: any) => {
    if (token) {
      setCapChaToken(token);
    } else {
      Alert.alert('Error', 'Capcha could not verified, please try again');
    }
    setIsGenRecapcha(false);
  }, []);

  useEffect(() => {
    const requestResendOTP = async () => {
      if (capchaToken !== '') {
        const deviceId = await getDeviceId();
        const bodyData = {
          phone: dataLogin.phoneCode.value + dataLogin.phoneNumber,
          deviceId,
          ggToken: capchaToken,
          noAuthen: true,
        };
        dispatch(resendOTP(bodyData));
        setCapChaToken('');
        setErrorOTP('');
        updateLoginData('otpCode', '');
      } else {
        console.log('Cannot gen capcha');
      }
    };
    requestResendOTP();
  }, [capchaToken]);

  const isVerifyingRef = useRef(false);

  useEffect(() => {
    if (!otpVerify.loading) {
      isVerifyingRef.current = false;
    }
  }, [otpVerify.loading]);

  const handleChooseSupport = (index: number) => {
    try {
      if (index == 0) {
        Linking.openURL(`tel:02835264818`);
      } else if (index == 1) {
        Linking.openURL(`mailto:info@mcv.com.vn`);
      }
    } catch (error) { }
  };

  //ACTION
  const handleConfirmOTP = async (valueOTP?: string) => {
    const code = valueOTP || dataLogin.otpCode;
    if (!code || code.length < 6) return;
    if (isVerifyingRef.current || otpVerify.loading) {
      console.log('⚠️ [OTP screen] Skip duplicate handleConfirmOTP');
      return;
    }
    isVerifyingRef.current = true;
    try {
      const deviceId = await getDeviceId();
      const bodyData = {
        phone: dataLogin.phoneCode.value + dataLogin.phoneNumber,
        deviceId,
        otp: code,
        type: OTPType.register,
      };
      console.log('🚀 ~ [OTP screen] handleConfirmOTP ~ bodyData:', bodyData);
      dispatch(verifyOTP(bodyData));
    } catch (e) {
      isVerifyingRef.current = false;
    }
  };

  const onValueChange = async (value: string, meta?: any) => {
    if (errOTP) {
      setErrorOTP('');
    }
    updateLoginData('otpCode', value);
    if (value.length === 6 || meta?.isFulfilled) {
      Keyboard.dismiss();
      handleConfirmOTP(value);
    }
  };

  const handleResendOTP = () => {
    setIsGenRecapcha(true);
  };

  const onResendOTP = () => {
    setErrorOTP('');
    setTimer(DELAY_TIME);
    setResetTimer(!resetTimer);
    handleResendOTP();
  };

  const handleSupport = () => {
    actionSheetRef.current?.show();
  };

  //RENDER
  const renderOTPCustom = () => {
    return (
      <>
        <View style={styles.otpCustomWrapper}>
          <OTPCustom
            ref={otpRef}
            cellSize={44}
            cellStyle={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: colors.c98A2B3,
            }}
            textStyle={{
              color: colors.c101828,
            }}
            cellFocusedStyle={{
              borderColor: colors.primary,
              borderWidth: 1,
            }}
            codeLength={6}
            cellSpacing={10}
            value={dataLogin.otpCode}
            onValueChange={onValueChange}
            autoFocus={true}
            restrictToNumbers={true}
          />
        </View>
        {errOTP ? (
          <Row>
            <CText h5 w400 style={styles.txtError}>
              {errOTP}
            </CText>
          </Row>
        ) : null}
      </>
    );
  };

  const renderForm = () => {
    return (
      <>
        <Row style={screenStyles.mT5}>
          <CText h5 color={colors.c667085}>
            {t('auth.pleaseEnterOTP')}
          </CText>
        </Row>
        <Row style={screenStyles.mT5}>
          <CText h5 color={colors.primary}>
            {`(${dataLogin.phoneCode.value}) ${dataLogin.phoneNumber}`}
          </CText>
        </Row>
        {renderOTPCustom()}
        <Row>
          <CText h5 w400 color={colors.c1D2939} style={screenStyles.mT15}>
            {`${t('auth.timeSenOTP', {
              timerCount,
            })}`}
          </CText>
        </Row>
        <TouchableOpacity
          onPress={onResendOTP}
          disabled={timerCount !== 0 || otpVerify.loading}
          style={[
            screenStyles.centerWrap,
            (timerCount !== 0 || otpVerify.loading) && { opacity: 0.5 },
          ]}
        >
          <CText h5 w600 color={colors.primary} style={screenStyles.mT15}>
            {t('common.resendOTP', 'Resend OTP')}
          </CText>
        </TouchableOpacity>
      </>
    );
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.flexGrowBottom}>
        <View style={styles.formWrapper}>
          <Row
            style={{
              height: ScreenWidth / 3.5 + 64,
            }}
            center
          >
            <View>
              <View style={styles.logo}>
                <Image
                  source={images.global.logo_app_trans}
                  style={styles.logo}
                />
              </View>
              <CText h1 w600 color={'#0e7c7a'} center>
                {'Aloka'}
              </CText>
            </View>
          </Row>
          <View style={screenStyles.flex1}>
            {renderForm()}
            <View style={[screenStyles.flex1, screenStyles.pH12]}>
              <Row between style={{ height: 100 }}>
                <Pressable onPress={goBack}>
                  <Row start>
                    <IconX
                      type="ionicons"
                      name="phone-portrait"
                      size={24}
                      color={colors.c667085}
                    />
                    <CText
                      h5
                      w500
                      color={colors.c667085}
                      style={screenStyles.mL5}
                    >
                      {t('onboarding.changePhone')}
                    </CText>
                  </Row>
                </Pressable>
                <Pressable onPress={handleSupport}>
                  <Row start>
                    <IconX
                      type="ionicons"
                      name="help-buoy"
                      size={24}
                      color={colors.c667085}
                    />
                    <CText
                      h5
                      w500
                      color={colors.c667085}
                      style={screenStyles.mL5}
                    >
                      {t('onboarding.support')}
                    </CText>
                  </Row>
                </Pressable>
              </Row>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderCapcha = useCallback(() => {
    return <ReCaptcha onVerify={actionWithToken} />;
  }, [actionWithToken]);

  return (
    <Wrapper>
      <CHeader
        title={t('auth.otpTitle', 'OTP Verification')}
        isBorderBottom
        rightComponentDisable
        leftComponentOnPress={goBack}
      />
      <CScrollView>{renderContent()}</CScrollView>
      {isGenRecapcha ? renderCapcha() : null}
      <ActionSheet
        ref={actionSheetRef}
        options={options}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={handleChooseSupport}
      />
      {otpVerify.loading || otpResend.loading ? (
        <APILoading showAlert={true} isLoadingAPI={true} />
      ) : null}
    </Wrapper>
  );
};

export default OTP;
