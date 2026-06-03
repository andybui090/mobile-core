// import { ICON_TYPE, IconX, ReCaptcha } from '@/components';
// import { getDeviceId, logError, screenStyles } from '@/configs';
// import { resendOTP, resetAuth, resetOTP, verifyOTP } from '@/redux/slices/authSlice';
// import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
// import { CText, Row } from '@/utils';
// import { useTheme } from '@rneui/themed';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Alert, Keyboard, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
// import OTPCustom from './OTPCustom';

// const DELAY_TIME = 60; //s

// export enum OTPType {
//     none,
//     register,
//     update,
//     delete,
// }

// interface propModalOTP {
//     isVisible: boolean;
//     phone: string;
//     email: string;
//     hideModalOTP: () => void;
//     callBackVerifySuccess: () => void;
//     otpType: OTPType
// }

// export const ModalOTP = ({ isVisible, phone = '', email = '', hideModalOTP, callBackVerifySuccess, otpType = OTPType.none }: propModalOTP) => {
//     const { t } = useTranslation();
//     const {
//         theme: { colors },
//     } = useTheme();
//     // console.log("🚀 ~ ModalOTP ~ email:", email)
//     const otpRef = useRef<any>(null);
//     const [otpCode, setOTPCode] = useState('');
//     const [errOTP, setErrorOTP] = useState('');
//     const [timerCount, setTimer] = useState(DELAY_TIME); //3ph
//     const [resetTimer, setResetTimer] = useState(false);
//     const [isGenRecapcha, setIsGenRecapcha] = useState<boolean>(false);
//     const [capchaToken, setCapChaToken] = useState<string>('');

//     const dispatch = useAppDispatch();
//     const { otpVerify, otpResend } = useAppSelector(state => state.authReducer);

//     useEffect(() => {
//         // goi lan dau de gui otp
//         setIsGenRecapcha(true);
//     }, []);

//     //EFFECT
//     useEffect(() => {
//         const processResendOTP = () => {
//             if (!otpResend.loading) {
//                 if (otpResend.data) {
//                     dispatch(resetAuth());
//                 } else if (otpResend.error) {
//                     setErrorOTP(logError(otpResend.error, '', true));
//                     dispatch(resetAuth());
//                 }
//             }
//         };
//         processResendOTP();
//     }, [otpResend]);

//     useEffect(() => {
//         const processVerifyOTP = () => {
//             if (!otpVerify.loading) {
//                 if (otpVerify.data) {
//                     const { status } = otpVerify.data;
//                     // const result: any = otpVerify.data.result;
//                     if (status == 'success') {
//                         // call back verify
//                         callBackVerifySuccess();
//                     }
//                     dispatch(resetAuth());
//                     dispatch(resetOTP(null));
//                     dispatch(resetOTP(null));
//                 } else if (otpVerify.error) {
//                     console.log('🚀 ~ processVerifyOTP ~ otpVerify.error:', JSON.stringify(otpVerify.error));
//                     setErrorOTP(logError(otpVerify.error, '', true));
//                     dispatch(resetAuth());
//                     dispatch(resetOTP(null));
//                     dispatch(resetOTP(null));
//                 }
//             }
//         };
//         processVerifyOTP();
//     }, [otpVerify]);

//     const actionWithToken = useCallback((token: any) => {
//         if (token) {
//             setCapChaToken(token);
//         } else {
//             Alert.alert('Error', 'Capcha could not verified, please try again');
//         }
//         setIsGenRecapcha(false);
//     }, []);

//     // Buoc 1 chay vo day de gui otp
//     useEffect(() => {
//         const requestResendOTP = async () => {
//             if (capchaToken !== '') {
//                 const deviceId = await getDeviceId();
//                 let bodyData: any = {
//                     deviceId,
//                     ggToken: capchaToken,
//                     type: OTPType[otpType],
//                 };
//                 if (phone != '') {
//                     bodyData.phone = phone;
//                 } else if (email != '') {
//                     bodyData.email = email;
//                 }
//                 // console.log("🚀 ~ requestResendOTP ~ bodyData:", bodyData)
//                 dispatch(resendOTP(bodyData));
//                 setErrorOTP('');
//                 setOTPCode('');
//                 setCapChaToken('');
//             } else {
//                 console.log('Cannot gen capcha');
//             }
//         };
//         requestResendOTP();
//     }, [capchaToken]);

//     useEffect(() => {
//         const OTPTimer = setInterval(() => {
//             setTimer(lastTimerCount => {
//                 if (lastTimerCount <= 1) {
//                     setResetTimer(false);
//                     clearInterval(OTPTimer);
//                     return 0;
//                 }
//                 return lastTimerCount - 1;
//             });
//         }, 1000); //each count
//         return () => clearInterval(OTPTimer);
//     }, [resetTimer]);

//     const handleConfirmOTP = async (valueOTP: string) => {
//         const deviceId = await getDeviceId();
//         const bodyData = {
//             phone: phone ? phone : email,
//             deviceId,
//             otp: valueOTP,
//         };
//         console.log("🚀 ~ handleConfirmOTP ~ bodyData:", bodyData)
//         dispatch(verifyOTP(bodyData));
//     };

//     const onValueChange = async (value: string, { isFulfilled }: any) => {
//         if (errOTP) {
//             setErrorOTP('');
//         }
//         if (isFulfilled) {
//             Keyboard.dismiss();
//             handleConfirmOTP(value);
//         }
//         setOTPCode(value);
//     };

//     const handleResendOTP = () => {
//         setIsGenRecapcha(true);
//     };

//     const onResendOTP = () => {
//         setErrorOTP('');
//         setTimer(DELAY_TIME);
//         setResetTimer(!resetTimer);
//         handleResendOTP();
//     };

//     // render
//     const renderOTPCustom = () => {
//         return (
//             <>
//                 <View style={styles.otpCustomWrapper}>
//                     <OTPCustom
//                         ref={otpRef}
//                         cellSize={44}
//                         cellStyle={{
//                             borderWidth: 1,
//                             borderRadius: 8,
//                             borderColor: colors.c98A2B3,
//                         }}
//                         textStyle={{
//                             color: colors.c101828,
//                         }}
//                         cellFocusedStyle={{
//                             borderColor: colors.primary,
//                             borderWidth: 1,
//                         }}
//                         codeLength={6}
//                         cellSpacing={10}
//                         value={otpCode}
//                         onValueChange={onValueChange}
//                         autoFocus={true}
//                         restrictToNumbers={true}
//                     />
//                 </View>
//                 {errOTP ? (
//                     <Row>
//                         <CText h5 w400 color={colors.error}>
//                             {errOTP}
//                         </CText>
//                     </Row>
//                 ) : null}
//             </>
//         );
//     };

//     const renderContent = () => {
//         return (
//             <>
//                 <Row style={screenStyles.mT15}>
//                     <CText h5 color={colors.c667085}>
//                         {phone ? t('auth.pleaseEnterOTP') : t('auth.pleaseEnterOTPEmail')}
//                     </CText>
//                 </Row>
//                 <Row style={screenStyles.mT5}>
//                     <CText h5 color={colors.primary}>
//                         {phone != '' ? phone : email}
//                     </CText>
//                 </Row>
//                 {renderOTPCustom()}
//                 <Row>
//                     <CText h5 w400 color={colors.c1D2939} style={screenStyles.mT10}>
//                         {`${t('auth.timeSenOTP', {
//                             timerCount,
//                         })}`}
//                     </CText>
//                 </Row>
//                 <TouchableOpacity
//                     onPress={onResendOTP}
//                     disabled={timerCount !== 0}
//                     style={[screenStyles.centerWrap, timerCount !== 0 && { opacity: 0.5 }]}>
//                     <CText h5 w600 color={colors.primary} style={screenStyles.mT15}>
//                         {t('common.resendOTP', 'Resend OTP')}
//                     </CText>
//                 </TouchableOpacity>
//             </>
//         );
//     };

//     const renderCapcha = useCallback(() => {
//         return <ReCaptcha onVerify={actionWithToken} />;
//     }, [actionWithToken]);

//     return (
//         <Modal
//             visible={isVisible}
//             statusBarTranslucent
//             transparent
//             animationType="fade"
//             hardwareAccelerated
//             presentationStyle="overFullScreen">
//             <View style={styles.container}>
//                 <View style={styles.wrapContent}>
//                     <Row between style={{ width: '100%' }}>
//                         <View style={{ width: 26 }} />
//                         <CText h2 w600 color={colors.c101828}>
//                             {t('auth.otpTitle', 'OTP Verification')}
//                         </CText>
//                         <Pressable onPress={hideModalOTP}>
//                             <IconX name={'close'} origin={ICON_TYPE.ANT_ICON} color={colors.c667085} size={26} />
//                         </Pressable>
//                     </Row>
//                     {renderContent()}
//                 </View>
//             </View>
//             {isGenRecapcha ? renderCapcha() : null}
//         </Modal>
//     );
// };


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         paddingHorizontal: 24,
//     },
//     wrapContent: {
//         alignItems: 'center',
//         backgroundColor: 'white',
//         paddingVertical: 20,
//         paddingHorizontal: 20,
//         borderRadius: 8,
//         marginBottom: 70,
//     },
//     otpCustomWrapper: {
//         ...screenStyles.centerWrap,
//         marginTop: 20,
//         marginBottom: 15,
//     },
// });

// export default ModalOTP;