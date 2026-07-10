import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface ProfileState {
  profileData: responseProps;
}

const initialState: ProfileState = {
  profileData: {
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
  },
});

export const { getProfile, getProfileCallback } = profileSlice.actions;

export default profileSlice.reducer;
