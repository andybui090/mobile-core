import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';
interface GlobalState {
  tutorialData: responseProps;
  firebaseConfig: any;
  languageList: responseProps;
  countryList: responseProps;
  categoryList: responseProps;
  feedbackData: responseProps;
  reportList: responseProps;
  responseCreateReport: responseProps;
}

const initialState: GlobalState = {
  tutorialData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  firebaseConfig: {
    isConfig: false,
    currentVersion: '',
    reviewVersion: '',
    minSupportVersion: '',
    isAllowForceUpdate: false,
    isReviewApp: false,
  },
  languageList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  countryList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  categoryList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  feedbackData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  reportList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  responseCreateReport: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    getTutorials: (state, _action) => {
      state.tutorialData.loading = true;
    },
    getTutorialsCallback: (state, { payload: { data, error } }) => {
      const { tutorialData } = state;
      tutorialData.loading = false;
      tutorialData.data = data;
      tutorialData.error = error;
    },
    //
    setFirebaseConfig: (state, { payload }) => {
      state.firebaseConfig = payload;
    },
    //
    getLanguages: (state, _action) => {
      state.languageList.loading = true;
    },
    getLanguagesCallback: (state, { payload: { data, error } }) => {
      const { languageList } = state;
      languageList.loading = false;
      languageList.data = data;
      languageList.error = error;
    },
    //
    getCountries: (state, _action) => {
      state.countryList.loading = true;
    },
    getCountriesCallback: (state, { payload: { data, error } }) => {
      const { countryList } = state;
      countryList.loading = false;
      countryList.data = data;
      countryList.error = error;
    },
    //
    getCategories: (state, _action) => {
      state.categoryList.loading = true;
    },
    getCategoriesCallback: (state, { payload: { data, error } }) => {
      const { categoryList } = state;
      categoryList.loading = false;
      categoryList.data = data;
      categoryList.error = error;
    },
    postFeedbackData: (state, _action) => {
      state.feedbackData.loading = true;
    },
    postFeedbackDataCallback: (state, { payload: { data, error } }) => {
      const { feedbackData } = state;
      feedbackData.loading = false;
      feedbackData.data = data;
      feedbackData.error = error;
    },
    //
    getListReport: (state, payload) => {
      state.reportList.loading = true;
    },
    getListReportCallback: (state, { payload: { data, error } }) => {
      const { reportList } = state;
      reportList.loading = false;
      reportList.data = data;
      reportList.error = error;
    },
    postReport: (state, payload) => {
      state.responseCreateReport.loading = true;
    },
    postReportCallback: (state, { payload: { data, error } }) => {
      const { responseCreateReport } = state;
      responseCreateReport.loading = false;
      responseCreateReport.data = data;
      responseCreateReport.error = error;
    },
    resetGlobal: (state, _action) => {
      const { feedbackData, responseCreateReport } = state;
      feedbackData.loading = false;
      feedbackData.data = undefined;
      feedbackData.error = undefined;

      responseCreateReport.loading = false;
      responseCreateReport.data = undefined;
      responseCreateReport.error = undefined;
    },
  },
});

export const {
  getTutorials,
  getTutorialsCallback,
  setFirebaseConfig,
  getLanguages,
  getLanguagesCallback,
  getCountries,
  getCountriesCallback,
  getCategories,
  getCategoriesCallback,
  postFeedbackData,
  postFeedbackDataCallback,
  getListReport,
  getListReportCallback,
  postReport,
  postReportCallback,
  resetGlobal,
} = globalSlice.actions;

export default globalSlice.reducer;
