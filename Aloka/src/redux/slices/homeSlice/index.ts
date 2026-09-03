import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface HomeState {
  topBannerData: responseProps;
  upcomingBookingData: responseProps;
}

const initialState: HomeState = {
  topBannerData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  upcomingBookingData: {
    loading: false,
    data: <any>undefined,
    error: undefined,
  },
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    getBanner: (state, _action) => {
      state.topBannerData.loading = true;
    },
    getBannerCallback: (state, { payload: { data, error } }) => {
      const { topBannerData } = state;
      topBannerData.loading = false;
      topBannerData.data = data;
      topBannerData.error = error;
    },
    // lich sử cuộc hẹn home carely
    getUpcomingBookingHome: (state, _action) => {
      state.upcomingBookingData.loading = true;
    },
    getUpcomingBookingHomeCallback: (state, { payload: { data, error } }) => {
      const { upcomingBookingData } = state;
      upcomingBookingData.loading = false;
      upcomingBookingData.data = data;
      upcomingBookingData.error = error;
    },
  },
});

export const {
  getBanner,
  getBannerCallback,
  getUpcomingBookingHome,
  getUpcomingBookingHomeCallback,
} = homeSlice.actions;

export default homeSlice.reducer;
