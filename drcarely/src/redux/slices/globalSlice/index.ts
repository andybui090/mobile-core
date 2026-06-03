import { createSlice } from '@reduxjs/toolkit';
import { responseListProps } from '../types';
interface GlobalState {
  tutorialList: responseListProps;
  updateCategories: any;
}

const initialState: GlobalState = {
  tutorialList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  updateCategories: {
    isUpdate: true,
  },
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    getTutorials: (state, _action) => {
      state.tutorialList.loading = true;
    },
    getTutorialsCallback: (state, { payload: { data, error } }) => {
      const { tutorialList } = state;
      tutorialList.loading = false;
      tutorialList.data = data;
      tutorialList.error = error;
    },
    updateCategoriesWhenChangeLanguage: (state, action) => {
      state.updateCategories.isUpdate = !state.updateCategories.isUpdate;
    },
  },
});

export const {
  getTutorials,
  getTutorialsCallback,
  updateCategoriesWhenChangeLanguage,
} = globalSlice.actions;

export default globalSlice.reducer;
