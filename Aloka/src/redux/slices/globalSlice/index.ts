import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';
interface GlobalState {
  tutorialData: responseProps;
  firebaseConfig: any;
  languageList: responseProps;
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
  },
});

export const {
  getTutorials,
  getTutorialsCallback,
  setFirebaseConfig,
  getLanguages,
  getLanguagesCallback,
} = globalSlice.actions;

export default globalSlice.reducer;
