import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface ProfileState {
  profileData: responseProps;
  isFetchingLogout: boolean;
  dataLogout: any;
  errLogout: any;
  isDeleteAccount: boolean;
  dataDeleteAccount: any;
  errDeleteAccount: any;
}

const initialState: ProfileState = {
  profileData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  isFetchingLogout: false,
  dataLogout: null,
  errLogout: null,
  isDeleteAccount: false,
  dataDeleteAccount: null,
  errDeleteAccount: null,
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
      state.isFetchingLogout = true;
    },
    postLogoutCallback: (state, { payload: { data, error } }) => {
      state.isFetchingLogout = false;
      state.dataLogout = data;
      state.errLogout = error;
    },
    getDeleteAccount: (state, _action) => {
      state.isDeleteAccount = true;
    },
    getDeleteAccountCallback: (state, { payload: { data, error } }) => {
      state.isDeleteAccount = false;
      state.dataDeleteAccount = data;
      state.errDeleteAccount = error;
    },
    resetProfileSlice: (state, _action) => {
      state.isDeleteAccount = false;
      state.dataDeleteAccount = null;
      state.errDeleteAccount = null;
      state.isFetchingLogout = false;
      state.dataLogout = null;
      state.errLogout = null;
    },
  },
});

export const {
  getProfile,
  getProfileCallback,
  postLogout,
  postLogoutCallback,
  getDeleteAccount,
  getDeleteAccountCallback,
  resetProfileSlice,
} = profileSlice.actions;

export default profileSlice.reducer;
