import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface NotifyState {
  notifySetting: responseProps;
  notifyUpdate: responseProps;
  firebaseTokenUpdate: responseProps;
  notifyList: responseProps;
  notifyRead: responseProps;
  totalNotifyUnRead: responseProps;
}

const initialState: NotifyState = {
  notifySetting: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  notifyUpdate: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  firebaseTokenUpdate: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  notifyList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  notifyRead: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  totalNotifyUnRead: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    getNotifySetting: (state, _action) => {
      state.notifySetting.loading = true;
    },
    getNotifySettingCallback: (state, { payload: { data, error } }) => {
      const { notifySetting } = state;
      notifySetting.loading = false;
      notifySetting.data = data;
      notifySetting.error = error;
    },
    updateNotifySetting: (state, _action) => {
      state.notifyUpdate.loading = true;
    },
    updateNotifySettingCallback: (state, { payload: { data, error } }) => {
      const { notifyUpdate } = state;
      notifyUpdate.loading = false;
      notifyUpdate.data = data;
      notifyUpdate.error = error;
    },
    updateFirebaseToken: (state, _action) => {
      state.firebaseTokenUpdate.loading = true;
    },
    updateFirebaseTokenCallback: (state, { payload: { data, error } }) => {
      const { firebaseTokenUpdate } = state;
      firebaseTokenUpdate.loading = false;
      firebaseTokenUpdate.data = data;
      firebaseTokenUpdate.error = error;
    },
    getListNotify: (state, _action) => {
      state.notifyList.loading = true;
    },
    getListNotifyCallback: (state, { payload: { data, error } }) => {
      const { notifyList } = state;
      notifyList.loading = false;
      notifyList.data = data;
      notifyList.error = error;
    },
    readNotify: (state, _action) => {
      state.notifyRead.loading = true;
    },
    readNotifyCallback: (state, { payload: { data, error } }) => {
      const { notifyRead } = state;
      notifyRead.loading = false;
      notifyRead.data = data;
      notifyRead.error = error;
    },
    getTotalNotifyUnread: (state, _action) => {
      state.totalNotifyUnRead.loading = true;
    },
    getTotalNotifyUnreadCallback: (state, { payload: { data, error } }) => {
      const { totalNotifyUnRead } = state;
      totalNotifyUnRead.loading = false;
      totalNotifyUnRead.data = data;
      totalNotifyUnRead.error = error;
    },
    resetNotify: state => {
      state.notifySetting.loading = false;
      state.notifySetting.data = undefined;
      state.notifySetting.error = undefined;
      state.notifyRead.loading = false;
      state.notifyRead.data = undefined;
      state.notifyRead.error = undefined;
    },
  },
});

export const {
  getNotifySetting,
  getNotifySettingCallback,
  updateNotifySetting,
  updateNotifySettingCallback,
  updateFirebaseToken,
  updateFirebaseTokenCallback,
  getListNotify,
  getListNotifyCallback,
  readNotify,
  readNotifyCallback,
  getTotalNotifyUnread,
  getTotalNotifyUnreadCallback,
  resetNotify,
} = notifySlice.actions;

export default notifySlice.reducer;
