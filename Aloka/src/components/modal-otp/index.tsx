import { IconX, ReCaptcha } from '@/components';
import { getDeviceId, logError, screenStyles, statusSuccess } from '@/configs';
import { STORAGEKEY } from '@/constants';
import {
  resendOTP,
  resetAuth,
  resetOTP,
  verifyOTP,
} from '@/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import OTPCustom from './OTPCustom';

const DELAY_TIME = 60; //s

export enum OTPType {
  none,
  register,
  update,
  delete,
}

interface propModalOTP {
  isVisible: boolean;
  phone: string;
  email: string;
  hideModalOTP: () => void;
  callBackVerifySuccess: () => void;
  otpType: OTPType;
}

export const ModalOTP = ({
  isVisible,
  phone = '',
  email = '',
  hideModalOTP,
  callBackVerifySuccess,
  otpType = OTPType.none,
}: propModalOTP) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();
  const otpRef = useRef<any>(null);
  const [otpCode, setOTPCode] = useState('');
  const [errOTP, setErrorOTP] = useState('');
  const [timerCount, setTimer] = useState(DELAY_TIME);
  const [resetTimer, setResetTimer] = useState(false);
  const [isGenRecapcha, setIsGenRecapcha] = useState<boolean>(false);
  const [capchaToken, setCapChaToken] = useState<string>('');

  const dispatch = useAppDispatch();
  const { otpVerify, otpResend } = useAppSelector(state => state.authReducer);

  const isVerifyingRef = useRef(false);

  useEffect(() => {
    // goi lan dau de gui otp
    isVerifyingRef.current = false;
    dispatch(resetOTP(null));
    setErrorOTP('');
    setOTPCode('');
    setIsGenRecapcha(true);
    return () => {
      isVerifyingRef.current = false;
      dispatch(resetOTP(null));
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      isVerifyingRef.current = false;
      dispatch(resetOTP(null));
      setOTPCode('');
      setErrorOTP('');
      setTimer(DELAY_TIME);
      setResetTimer(prev => !prev);
    }
  }, [isVisible]);

  // Resend OTP listener
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

  // Verify OTP listener
  useEffect(() => {
    const processVerifyOTP = () => {
      if (!otpVerify.loading) {
        isVerifyingRef.current = false;
        if (otpVerify.data) {
          const { status, result }: any = otpVerify.data;
          console.log('🚀 ~ [ModalOTP] processVerifyOTP success data:', otpVerify.data);
          const isSuccess =
            status === 'success' || Boolean(result) || statusSuccess(status);
          if (isSuccess) {
            hideModalOTP();
            callBackVerifySuccess();
          }
          dispatch(resetAuth());
          dispatch(resetOTP(null));
        } else if (otpVerify.error) {
          console.log('🚀 ~ [ModalOTP] processVerifyOTP error:', otpVerify.error);
          const err: any = otpVerify.error;
          setErrorOTP(err);
          setOTPCode('');
          otpRef.current?.clear?.();
          dispatch(resetAuth());
          dispatch(resetOTP(null));
        }
      }
    };
    processVerifyOTP();
  }, [otpVerify]);

  const actionWithToken = useCallback((token: any) => {
    if (token) {
      setCapChaToken(token);
    } else {
      Alert.alert('Error', 'Capcha could not verified, please try again');
    }
    setIsGenRecapcha(false);
  }, []);

  // Request send/resend OTP
  useEffect(() => {
    const requestResendOTP = async () => {
      if (capchaToken !== '') {
        const deviceId = await getDeviceId();
        let bodyData: any = {
          deviceId,
          ggToken: capchaToken,
          type: OTPType[otpType],
        };
        if (phone != '') {
          bodyData.phone = phone;
        } else if (email != '') {
          bodyData.email = email;
        }
        console.log('🚀 ~ [ModalOTP] requestResendOTP bodyData:', bodyData);
        dispatch(resendOTP(bodyData));
        setErrorOTP('');
        setOTPCode('');
        setCapChaToken('');
      } else {
        console.log('Cannot gen capcha');
      }
    };
    requestResendOTP();
  }, [capchaToken]);

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
    }, 1000);
    return () => clearInterval(OTPTimer);
  }, [resetTimer]);

  const handleConfirmOTP = async (valueOTP?: string) => {
    const code = (valueOTP || otpCode || '').trim();
    if (!code || code.length < 6) return;
    if (otpResend.loading) {
      console.log('⚠️ [ModalOTP] OTP is still being sent, please wait');
      return;
    }
    if (isVerifyingRef.current || otpVerify.loading) {
      console.log('⚠️ [ModalOTP] Skip duplicate verifyOTP call');
      return;
    }
    isVerifyingRef.current = true;
    setErrorOTP('');
    try {
      const deviceId = await getDeviceId();
      const target = (phone ? phone : email).trim();
      const bodyData = {
        phone: target,
        deviceId,
        otp: code,
        type: OTPType.register,
      };
      console.log('🚀 ~ [ModalOTP] dispatch(verifyOTP(bodyData)):', bodyData);
      dispatch(verifyOTP(bodyData));
    } catch (e) {
      isVerifyingRef.current = false;
    }
  };

  const onValueChange = (value: string, meta?: any) => {
    if (errOTP) {
      setErrorOTP('');
    }
    setOTPCode(value);
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
    setOTPCode('');
    otpRef.current?.clear?.();
    setTimer(DELAY_TIME);
    setResetTimer(!resetTimer);
    handleResendOTP();
  };

  // render
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
            value={otpCode}
            onValueChange={onValueChange}
            autoFocus={true}
            restrictToNumbers={true}
          />
        </View>
        {errOTP ? (
          <Row>
            <CText h5 w400 color={colors.error} style={{ textAlign: 'center', marginTop: 4 }}>
              {errOTP}
            </CText>
          </Row>
        ) : null}
      </>
    );
  };

  const renderContent = () => {
    return (
      <>
        <Row style={screenStyles.mT15}>
          <CText h5 color={colors.c667085}>
            {phone ? t('auth.pleaseEnterOTP') : t('auth.pleaseEnterOTPEmail')}
          </CText>
        </Row>
        <Row style={screenStyles.mT5}>
          <CText h5 color={colors.primary} style={{ fontWeight: '600' }}>
            {phone != '' ? phone : email}
          </CText>
        </Row>
        {otpResend.loading && (
          <Row style={{ marginTop: 6, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 6 }} />
            <CText h5 color={colors.c667085}>
              {t('auth.sendingOTP', 'Đang gửi mã xác thực...')}
            </CText>
          </Row>
        )}
        {renderOTPCustom()}

        {/* Nút Xác nhận */}
        <TouchableOpacity
          onPress={() => handleConfirmOTP(otpCode)}
          disabled={otpCode.length < 6 || otpVerify.loading || otpResend.loading}
          activeOpacity={0.8}
          style={[
            styles.btnConfirm,
            { backgroundColor: colors.primary },
            (otpCode.length < 6 || otpVerify.loading || otpResend.loading) && { opacity: 0.5 },
          ]}
        >
          {otpVerify.loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <CText h5 w600 color="#FFFFFF">
              {t('common.confirm', 'Xác nhận')}
            </CText>
          )}
        </TouchableOpacity>

        <Row style={screenStyles.mT15}>
          <CText h5 w400 color={colors.c1D2939}>
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
          <CText h5 w600 color={colors.primary} style={screenStyles.mT10}>
            {t('common.resendOTP', 'Resend OTP')}
          </CText>
        </TouchableOpacity>
      </>
    );
  };

  const renderCapcha = useCallback(() => {
    return <ReCaptcha onVerify={actionWithToken} />;
  }, [actionWithToken]);

  return (
    <Modal
      visible={isVisible}
      statusBarTranslucent
      transparent
      animationType="fade"
      hardwareAccelerated
      presentationStyle="overFullScreen"
    >
      <View style={styles.container}>
        <View style={styles.wrapContent}>
          <Row between style={{ width: '100%' }}>
            <View style={{ width: 26 }} />
            <CText h2 w600 color={colors.c101828}>
              {t('auth.otpTitle', 'OTP Verification')}
            </CText>
            <Pressable onPress={hideModalOTP} disabled={otpVerify.loading}>
              <IconX
                name="close"
                type="antdesign"
                color={colors.c667085}
                size={22}
              />
            </Pressable>
          </Row>
          {renderContent()}
        </View>
      </View>
      {isGenRecapcha ? renderCapcha() : null}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
  },
  wrapContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 70,
  },
  otpCustomWrapper: {
    ...screenStyles.centerWrap,
    marginTop: 20,
    marginBottom: 10,
  },
  btnConfirm: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
});

export default ModalOTP;
