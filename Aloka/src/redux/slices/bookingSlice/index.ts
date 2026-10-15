import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface BookingState {
  upcomingBookingData: responseProps;
  completeBooking: responseProps;
  localBooking: any;
  cancelBooking: responseProps;
  rejectBooking: responseProps;
  statusBooking: responseProps;
  dataRequestBooking: responseProps;
  acceptBooking: responseProps;
  dataCompletedBooking: responseProps;
  dataCancelBooking: responseProps;
  dataExpiredBooking: responseProps;
}

const initialState: BookingState = {
  upcomingBookingData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  completeBooking: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  cancelBooking: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  localBooking: {
    status: '',
  },
  rejectBooking: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  statusBooking: {
    //nurse di chuyển đến điểm hẹn
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataRequestBooking: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  acceptBooking: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataCompletedBooking: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataCancelBooking: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataExpiredBooking: {
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
    putCompleteBooking: (state, _action) => {
      state.completeBooking.loading = true;
    },
    putCompleteBookingCallback: (state, { payload: { data, error } }) => {
      const { completeBooking } = state;
      completeBooking.loading = false;
      completeBooking.data = data;
      completeBooking.error = error;
    },
    updateLocalBookingStatus: (state, { payload: { status } }) => {
      const { localBooking } = state;
      localBooking.status = status;
    },
    putCancelBooking: (state, _action) => {
      state.cancelBooking.loading = true;
    },
    putCancelBookingCallback: (state, { payload: { data, error } }) => {
      const { cancelBooking } = state;
      cancelBooking.loading = false;
      cancelBooking.data = data;
      cancelBooking.error = error;
    },
    putRejectBooking: (state, _action) => {
      state.rejectBooking.loading = true;
    },
    putRejectBookingCallback: (state, { payload: { data, error } }) => {
      const { rejectBooking } = state;
      rejectBooking.loading = false;
      rejectBooking.data = data;
      rejectBooking.error = error;
    },
    putStatusBooking: (state, _action) => {
      state.statusBooking.loading = true;
    },
    putStatusBookingCallback: (state, { payload: { data, error } }) => {
      const { statusBooking } = state;
      statusBooking.loading = false;
      statusBooking.data = data;
      statusBooking.error = error;
    },
    getRequestBooking: (state, _action) => {
      state.dataRequestBooking.loading = true;
    },
    getRequestBookingCallback: (state, { payload: { data, error } }) => {
      const { dataRequestBooking } = state;
      dataRequestBooking.loading = false;
      dataRequestBooking.data = data;
      dataRequestBooking.error = error;
    },
    putAcceptBooking: (state, _action) => {
      state.acceptBooking.loading = true;
    },
    putAcceptBookingCallback: (state, { payload: { data, error } }) => {
      const { acceptBooking } = state;
      acceptBooking.loading = false;
      acceptBooking.data = data;
      acceptBooking.error = error;
    },
    getCompletedBooking: (state, _action) => {
      state.dataCompletedBooking.loading = true;
    },
    getCompletedBookingCallback: (state, { payload: { data, error } }) => {
      const { dataCompletedBooking } = state;
      dataCompletedBooking.loading = false;
      dataCompletedBooking.data = data;
      dataCompletedBooking.error = error;
    },
    getCancelBooking: (state, _action) => {
      state.dataCancelBooking.loading = true;
    },
    getCancelBookingCallback: (state, { payload: { data, error } }) => {
      const { dataCancelBooking } = state;
      dataCancelBooking.loading = false;
      dataCancelBooking.data = data;
      dataCancelBooking.error = error;
    },
    getExpiredBooking: (state, _action) => {
      state.dataExpiredBooking.loading = true;
    },
    getExpiredBookingCallback: (state, { payload: { data, error } }) => {
      const { dataExpiredBooking } = state;
      dataExpiredBooking.loading = false;
      dataExpiredBooking.data = data;
      dataExpiredBooking.error = error;
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
    resetHistoryBooking: (state, _action) => {
      const {
        upcomingBookingData,
        dataRequestBooking,
        dataCompletedBooking,
        dataCancelBooking,
        statusBooking,
        dataExpiredBooking,
        rejectBooking,
        cancelBooking,
      } = state;

      cancelBooking.loading = false;
      cancelBooking.data = undefined;
      cancelBooking.error = undefined;

      upcomingBookingData.loading = false;
      upcomingBookingData.data = undefined;
      upcomingBookingData.error = undefined;

      rejectBooking.loading = false;
      rejectBooking.data = undefined;
      rejectBooking.error = undefined;

      dataRequestBooking.loading = false;
      dataRequestBooking.data = undefined;
      dataRequestBooking.error = undefined;

      dataCompletedBooking.loading = false;
      dataCompletedBooking.data = undefined;
      dataCompletedBooking.error = undefined;

      dataCancelBooking.loading = false;
      dataCancelBooking.data = undefined;
      dataCancelBooking.error = undefined;

      statusBooking.loading = false;
      statusBooking.data = undefined;
      statusBooking.error = undefined;

      dataExpiredBooking.loading = false;
      dataExpiredBooking.data = undefined;
      dataExpiredBooking.error = undefined;
    },
  },
});

export const {
  getUpcomingBooking,
  getUpcomingBookingCallback,
  putCompleteBooking,
  putCompleteBookingCallback,
  putCancelBooking,
  putCancelBookingCallback,
  putRejectBooking,
  putRejectBookingCallback,
  putStatusBooking,
  putStatusBookingCallback,
  getRequestBooking,
  getRequestBookingCallback,
  putAcceptBooking,
  putAcceptBookingCallback,
  getCompletedBooking,
  getCompletedBookingCallback,
  getCancelBooking,
  getCancelBookingCallback,
  getExpiredBooking,
  getExpiredBookingCallback,
  updateLocalBookingStatus,
  resetHistoryBooking,
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
