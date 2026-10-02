import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface ProfileState {
  profileData: responseProps;
  logoutData: responseProps;
  deleteAccountData: responseProps;
}

const initialState: ProfileState = {
  profileData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  logoutData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  deleteAccountData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getProfile: (state, _action) => {
      state.profileData.loading = true;
    },
    getProfileCallback: (state, { payload: { data, error } }) => {
      const { profileData } = state;
      profileData.loading = false;
      profileData.data = data;
      profileData.error = error;
    },
    postLogout: (state, _action) => {
      state.logoutData.loading = true;
    },
    postLogoutCallback: (state, { payload: { data, error } }) => {
      const { logoutData } = state;
      logoutData.loading = false;
      logoutData.data = data;
      logoutData.error = error;
    },
    //delete account
    callDeleteAccount: (state, _action) => {
      state.deleteAccountData.loading = true;
    },
    callDeleteAccountCallback: (state, { payload: { data, error } }) => {
      const { deleteAccountData } = state;
      deleteAccountData.loading = false;
      deleteAccountData.data = data;
      deleteAccountData.error = error;
    },
    resetProfileSlice: state => {
      const { logoutData, deleteAccountData } = state;
      logoutData.loading = false;
      logoutData.data = undefined;
      logoutData.error = undefined;

      deleteAccountData.loading = false;
      deleteAccountData.data = undefined;
      deleteAccountData.error = undefined;
    },
  },
});

export const {
  getProfile,
  getProfileCallback,
  postLogout,
  postLogoutCallback,
  callDeleteAccount,
  callDeleteAccountCallback,
  resetProfileSlice,
} = profileSlice.actions;

export default profileSlice.reducer;
