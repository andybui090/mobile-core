import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface LocationState {
  listSearchLocation: responseProps;
}

const initialState: LocationState = {
  listSearchLocation: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    getListSearchLocation: (state, _action) => {
      state.listSearchLocation.loading = true;
    },
    getListSearchLocationCallback: (state, { payload: { data, error } }) => {
      const { listSearchLocation } = state;
      listSearchLocation.loading = false;
      listSearchLocation.data = data;
      listSearchLocation.error = error;
    },
    resetLocation: (state, _action) => {
      const { listSearchLocation } = state;

      listSearchLocation.loading = false;
      listSearchLocation.data = undefined;
      listSearchLocation.error = undefined;
    },
  },
});

export const { getListSearchLocation, getListSearchLocationCallback, resetLocation } =
  locationSlice.actions;

export default locationSlice.reducer;
