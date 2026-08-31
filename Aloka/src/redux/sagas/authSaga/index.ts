import {
  loginByPhone,
  loginByPhoneCallback,
  verifyOTP,
  verifyOTPCallback,
  resendOTP,
  resendOTPCallback,
  checkUserName,
  checkUserNameCallback,
  loginBySocial,
  loginBySocialCallback,
} from '@/redux/slices/authSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiSSO from '@/services/api-sso';

interface actionLogin {
  payload: {
    phone: string;
    deviceId: string;
    deviceName: string;
    ggToken: string;
  };
}
interface actionVerifyOTP {
  payload: {
    phone: string;
    deviceId: string;
    otp: string;
    noAuthen: boolean;
  };
}

interface actionResendOTP {
  payload: {
    phone: string;
    deviceId: string;
    ggToken: string;
    noAuthen: boolean;
  };
}

interface actionCheckUsername {
  payload: {
    username: string;
  };
}

function* fetchLogin(action: actionLogin) {
  yield* processAPISaga(ApiSSO.login, action.payload, loginByPhoneCallback);
}

function* fetchVerifyOTP(action: actionVerifyOTP) {
  yield* processAPISaga(ApiSSO.verifyOTP, action.payload, verifyOTPCallback);
}

function* fetchResendOTPCallBack(action: actionResendOTP) {
  yield* processAPISaga(ApiSSO.resendOTP, action.payload, resendOTPCallback);
}

function* fetchCheckUsername(action: actionCheckUsername) {
  yield* processAPISaga(
    ApiSSO.checkUsername,
    action.payload,
    checkUserNameCallback,
  );
}

function* fetchLoginSocial(action: actionLogin) {
  yield* processAPISaga(
    ApiSSO.loginSocial,
    action.payload,
    loginBySocialCallback,
  );
}

export default [
  takeLatest(loginByPhone, fetchLogin),
  takeLatest(verifyOTP, fetchVerifyOTP),
  takeLatest(resendOTP, fetchResendOTPCallBack),
  takeLatest(checkUserName, fetchCheckUsername),
  takeLatest(loginBySocial, fetchLoginSocial),
];
