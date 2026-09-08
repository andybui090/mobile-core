import {
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
} from '@/redux/slices/notificationSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetNotifySetting {
  payload: null;
}

interface actionUpdateNotifySetting {
  payload: {
    type: string;
    status: any;
  };
}

interface actionUpdateFirebaseToken {
  payload: {
    token: string;
  };
}

interface actionGetListNotify {
  payload: {
    offset: number | string;
    limit: number;
  };
}

interface actionReadNotify {
  payload: {
    idNotify?: number | string;
    id?: number | string;
  };
}

interface actionTotalUnReadNotify {
  payload: null;
}

function* fetchNotifySetting(action: actionGetNotifySetting) {
  yield* processAPISaga(
    ApiService.getSettingNotify,
    action.payload,
    getNotifySettingCallback,
  );
}

function* fetchUpdateNotifySetting(action: actionUpdateNotifySetting) {
  yield* processAPISaga(
    ApiService.updateSettingNotify,
    action.payload,
    updateNotifySettingCallback,
  );
}

function* fetchUpdateFirebaseToken(action: actionUpdateFirebaseToken) {
  yield* processAPISaga(
    ApiService.updateNotifyToken,
    action.payload,
    updateFirebaseTokenCallback,
  );
}

function* fetchListNotify(action: actionGetListNotify) {
  yield* processAPISaga(
    ApiService.getListNotify,
    action.payload,
    getListNotifyCallback,
  );
}

function* fetchReadNotify(action: actionReadNotify) {
  yield* processAPISaga(
    ApiService.markReadNotify,
    action.payload,
    readNotifyCallback,
  );
}

function* fetchTotalUnReadNotify(action: actionTotalUnReadNotify) {
  yield* processAPISaga(
    ApiService.getTotalUnreadNotify,
    action.payload,
    getTotalNotifyUnreadCallback,
  );
}

export default [
  takeLatest(getNotifySetting, fetchNotifySetting),
  takeLatest(updateNotifySetting, fetchUpdateNotifySetting),
  takeLatest(updateFirebaseToken, fetchUpdateFirebaseToken),
  takeLatest(getListNotify, fetchListNotify),
  takeLatest(readNotify, fetchReadNotify),
  takeLatest(getTotalNotifyUnread, fetchTotalUnReadNotify),
];
