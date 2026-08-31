import { STORAGEKEY } from '@/constants';
import ApiService from '@/services/api-base';
import ApiSSO from '@/services/api-sso';
import { removeValue, storeObjectData } from '@/storages';
import { createSlice } from '@reduxjs/toolkit';

// import APIUpload from '@/screens/upvideo-tab/Gallery/callApi';
import { responseProps } from '../types';
// import APIECommerceService from '@/services/api-ecommerce';

interface AuthState {
  loginPhone: responseProps;
  otpVerify: responseProps;
  otpResend: responseProps;
  usernameCheck: responseProps;
  loginSocial: responseProps;
}

const initialState: AuthState = {
  loginPhone: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  otpVerify: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  otpResend: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  usernameCheck: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  loginSocial: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginByPhone: (state, _action) => {
      state.loginPhone.loading = true;
      removeValue(STORAGEKEY.JWT_TOKEN);
      ApiSSO.deleteAuthorizationHeader();
      ApiService.deleteAuthorizationHeader();
      // APIUpload.deleteAuthorizationHeader();
      // APIECommerceService.deleteAuthorizationHeader();
    },
    loginByPhoneCallback: (state, { payload: { data, error } }) => {
      const { loginPhone } = state;
      loginPhone.loading = false;
      loginPhone.data = data;
      loginPhone.error = error;
    },
    verifyOTP: (state, _action) => {
      state.otpVerify.loading = true;
    },
    verifyOTPCallback: (state, { payload: { data, error } }) => {
      if (data?.result?.access_token) {
        const access_token = data.result.access_token;
        ApiSSO.setAuthorizationHeader(access_token);
        ApiService.setAuthorizationHeader(access_token);
        // APIUpload.setAuthorizationHeader(access_token);
        // APIECommerceService.setAuthorizationHeader(access_token);
        storeObjectData(STORAGEKEY.JWT_TOKEN, data.result);
      }
      const { otpVerify } = state;
      otpVerify.loading = false;
      otpVerify.data = data;
      otpVerify.error = error;
    },
    resendOTP: (state, _action) => {
      state.otpResend.loading = true;
    },
    resendOTPCallback: (state, { payload: { data, error } }) => {
      const { otpResend } = state;
      otpResend.loading = false;
      otpResend.data = data;
      otpResend.error = error;
    },
    checkUserName: (state, _action) => {
      state.usernameCheck.loading = true;
    },
    checkUserNameCallback: (state, { payload: { data, error } }) => {
      const { usernameCheck } = state;
      usernameCheck.loading = false;
      usernameCheck.data = data;
      usernameCheck.error = error;
    },
    //
    loginBySocial: (state, _action) => {
      state.loginSocial.loading = true;
    },
    loginBySocialCallback: (state, { payload: { data, error } }) => {
      const { loginSocial } = state;
      if (data?.result?.access_token) {
        const access_token = data.result.access_token;
        ApiSSO.setAuthorizationHeader(access_token);
        ApiService.setAuthorizationHeader(access_token);
        // APIUpload.setAuthorizationHeader(access_token);
        // APIECommerceService.setAuthorizationHeader(access_token);
        storeObjectData(STORAGEKEY.JWT_TOKEN, data.result);
      }
      loginSocial.loading = false;
      loginSocial.data = data;
      loginSocial.error = error;
    },
    //
    resetAuth: () => initialState,
    //
    resetOTP: (state, _action) => {
      const { otpVerify, otpResend } = state;
      otpVerify.loading = false;
      otpVerify.data = undefined;
      otpVerify.error = undefined;

      otpResend.loading = false;
      otpResend.data = undefined;
      otpResend.error = undefined;
    }
  },
});

export const {
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
  resetAuth,
  resetOTP,
} = authSlice.actions;

export default authSlice.reducer;
