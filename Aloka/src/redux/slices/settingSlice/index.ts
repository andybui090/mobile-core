import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface settingState {
  appTheme: 'dark' | 'light';
  settingOnboarding:responseProps;
}

const initialState: settingState = {
  appTheme: 'light',
  settingOnboarding:{
    loading: false,
    data: undefined,
    error: undefined,
  }
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setAppTheme: (state, { payload }) => state.appTheme = payload,
    getSettingsOnboarding: (state, _action) => {
      state.settingOnboarding.loading = true;
    },
    getSettingsOnboardingCallback: (state, { payload: { data, error } }) => {
      const { settingOnboarding } = state;
      settingOnboarding.loading = false;
      settingOnboarding.data = data;
      settingOnboarding.error = error;
    },
    resetSettings: (state, _action) => {
      const { settingOnboarding } = state;
      settingOnboarding.loading = false;
      settingOnboarding.data = undefined;
      settingOnboarding.error = undefined;
    }
  },
});

export const { 
  setAppTheme,
  getSettingsOnboarding,
  getSettingsOnboardingCallback,
  resetSettings,
} = settingSlice.actions;

export default settingSlice.reducer;