import {
  getProfile,
  getProfileCallback,
  postLogout,
  postLogoutCallback,
  getDeleteAccount,
  getDeleteAccountCallback,
} from '@/redux/slices/profileSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetProfile {
  payload: null;
}

interface actionLogoutApp {
  payload: any;
}

interface actionDeleteAccount {
  payload: null;
}

function* fetchProfile(action: actionGetProfile) {
  yield* processAPISaga(
    ApiService.getProfile,
    action.payload,
    getProfileCallback,
  );
}

function* fetchLogoutServer(action: actionLogoutApp) {
  yield* processAPISaga(
    ApiService.logoutApp,
    action.payload,
    postLogoutCallback,
  );
}

function* fetchDeleteAccount(action: actionDeleteAccount) {
  yield* processAPISaga(
    ApiService.deleteAccount,
    action.payload,
    getDeleteAccountCallback,
  );
}


export default [
  takeLatest(getProfile, fetchProfile),
  takeLatest(postLogout, fetchLogoutServer),
  takeLatest(getDeleteAccount, fetchDeleteAccount),
];
