import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';
interface GlobalState {
  tutorialData: responseProps;
  firebaseConfig:any;
}

const initialState: GlobalState = {
  tutorialData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  firebaseConfig: undefined,
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
  },
});

export const { getTutorials, getTutorialsCallback } = globalSlice.actions;

export default globalSlice.reducer;
