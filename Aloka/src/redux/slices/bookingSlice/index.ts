import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface BookingState {
  upcomingBookingData: responseProps;
}

const initialState: BookingState = {
  upcomingBookingData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    getUpcomingBooking: (state, _action) => {
      state.upcomingBookingData.loading = true;
    },
    getUpcomingBookingCallback: (state, { payload: { data, error } }) => {
      const { upcomingBookingData } = state;
      upcomingBookingData.loading = false;
      upcomingBookingData.data = data;
      upcomingBookingData.error = error;
    },
    //   getCarelyChildServices: (state, _action) => {
    //     state.carelyChildServiceData.loading = true;
    //   },
    //   getCarelyChildServicesCallback: (state, { payload: { data, error } }) => {
    //     const { carelyChildServiceData } = state;
    //     carelyChildServiceData.loading = false;
    //     carelyChildServiceData.data = data;
    //     carelyChildServiceData.error = error;
    //   },
    //   ratingCarely: (state, _action) => {
    //     state.carelyRatingData.loading = true;
    //   },
    //   ratingCarelyCallback: (state, { payload: { data, error } }) => {
    //     const { carelyRatingData } = state;
    //     carelyRatingData.loading = false;
    //     carelyRatingData.data = data;
    //     carelyRatingData.error = error;
    //   },
    //   getDetailPkgCarely: (state, _action) => {
    //     state.carelyPackageData.loading = true;
    //   },
    //   getDetailPkgCarelyCallback: (state, { payload: { data, error } }) => {
    //     const { carelyPackageData } = state;
    //     carelyPackageData.loading = false;
    //     carelyPackageData.data = data;
    //     carelyPackageData.error = error;
    //   },
    //   refundPkgCarely: (state, _action) => {
    //     state.carelyDataRefund.loading = true;
    //   },
    //   refundPkgCarelyCallback: (state, { payload: { data, error } }) => {
    //     const { carelyDataRefund } = state;
    //     carelyDataRefund.loading = false;
    //     carelyDataRefund.data = data;
    //     carelyDataRefund.error = error;
    //   },
    //   getReviewCarely: (state, _action) => {
    //     state.carelyReviewData.loading = true;
    //   },
    //   getReviewCarelyCallback: (state, { payload: { data, error } }) => {
    //     const { carelyReviewData } = state;
    //     carelyReviewData.loading = false;
    //     carelyReviewData.data = data;
    //     carelyReviewData.error = error;
    //   },
    //   resetCarely: state => {
    //     const {
    //       carelyChildServiceData,
    //       carelyRatingData,
    //       carelyPackageData,
    //       carelyDataRefund,
    //     } = state;
    //     carelyChildServiceData.loading = false;
    //     carelyChildServiceData.data = undefined;
    //     carelyChildServiceData.error = undefined;

    //     carelyRatingData.loading = false;
    //     carelyRatingData.data = undefined;
    //     carelyRatingData.error = undefined;

    //     carelyPackageData.loading = false;
    //     carelyPackageData.data = undefined;
    //     carelyPackageData.error = undefined;

    //     carelyDataRefund.loading = false;
    //     carelyDataRefund.data = undefined;
    //     carelyDataRefund.error = undefined;
    //   },
    //   resetCarelyRating: state => {
    //     const { carelyReviewData } = state;

    //     carelyReviewData.loading = false;
    //     carelyReviewData.data = undefined;
    //     carelyReviewData.error = undefined;
    //   },
  },
});

export const {
  // getCarelyServices,
  // getCarelyServicesCallback,
  // getCarelySearchServices,
  // getCarelySearchServicesCallback,
  // getCarelyChildServices,
  // getCarelyChildServicesCallback,
  // ratingCarely,
  // ratingCarelyCallback,
  // getDetailPkgCarely,
  // getDetailPkgCarelyCallback,
  // refundPkgCarely,
  // refundPkgCarelyCallback,
  // resetCarely,
  // getReviewCarely,
  // getReviewCarelyCallback,
  // resetCarelyRating,
} = bookingSlice.actions;

export default bookingSlice.reducer;
