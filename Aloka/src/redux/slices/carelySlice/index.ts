import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface CarelyState {
  carelyServiceData: responseProps;
  // carelyChildServiceData: responseProps;
  carelySearchData: responseProps;
  // carelyRatingData: responseProps;
  // carelyPackageData: responseProps;
  // carelyDataRefund: responseProps;
  // carelyReviewData: responseProps;
}

const initialState: CarelyState = {
  carelyServiceData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  // carelyChildServiceData: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  carelySearchData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  // carelyRatingData: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // carelyPackageData: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // carelyDataRefund: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // carelyReviewData: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
};

const carelySlice = createSlice({
  name: 'carely',
  initialState,
  reducers: {
    getCarelyServices: (state, _action) => {
      state.carelyServiceData.loading = true;
    },
    getCarelyServicesCallback: (state, { payload: { data, error } }) => {
      const { carelyServiceData } = state;
      carelyServiceData.loading = false;
      carelyServiceData.data = data;
      carelyServiceData.error = error;
    },
    getCarelySearchServices: (state, _action) => {
      state.carelySearchData.loading = true;
    },
    getCarelySearchServicesCallback: (state, { payload: { data, error } }) => {
      const { carelySearchData } = state;
      carelySearchData.loading = false;
      carelySearchData.data = data;
      carelySearchData.error = error;
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
  getCarelyServices,
  getCarelyServicesCallback,
  getCarelySearchServices,
  getCarelySearchServicesCallback,
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
} = carelySlice.actions;

export default carelySlice.reducer;
