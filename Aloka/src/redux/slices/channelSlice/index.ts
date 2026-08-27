import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface ChannelState {
  channelDetail: responseProps;
  updateSchedule: responseProps;
}

const initialState: ChannelState = {
  channelDetail: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  updateSchedule: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    getChannelDetail: (state, _action: PayloadAction<string>) => {
      state.channelDetail.loading = true;
      state.channelDetail.error = undefined;
    },
    getChannelDetailCallback: (state, { payload: { data, error } }) => {
      state.channelDetail.loading = false;
      state.channelDetail.data = data;
      state.channelDetail.error = error;
    },
    updateChannel: (
      state,
      _action: PayloadAction<{
        id: string;
        schedules: string | Array<Record<string, any>>;
        [key: string]: any;
      }>,
    ) => {
      state.updateSchedule.loading = true;
      state.updateSchedule.error = undefined;
    },
    updateChannelCallback: (state, { payload: { data, error } }) => {
      state.updateSchedule.loading = false;
      state.updateSchedule.data = data;
      state.updateSchedule.error = error;
      if (data && state.channelDetail.data) {
        state.channelDetail.data = data;
      }
    },
    updateChannelSchedule: (
      state,
      _action: PayloadAction<{
        id: string;
        schedules: string | Array<Record<string, any>>;
        [key: string]: any;
      }>,
    ) => {
      state.updateSchedule.loading = true;
      state.updateSchedule.error = undefined;
    },
    updateChannelScheduleCallback: (state, { payload: { data, error } }) => {
      state.updateSchedule.loading = false;
      state.updateSchedule.data = data;
      state.updateSchedule.error = error;
      if (data && state.channelDetail.data) {
        state.channelDetail.data = data;
      }
    },
  },
});

export const {
  getChannelDetail,
  getChannelDetailCallback,
  updateChannel,
  updateChannelCallback,
  updateChannelSchedule,
  updateChannelScheduleCallback,
} = channelSlice.actions;

export default channelSlice.reducer;
