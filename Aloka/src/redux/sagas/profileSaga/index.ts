import {
  getProfile,
  getProfileCallback,
  postLogout,
  postLogoutCallback,
  callDeleteAccount,
  callDeleteAccountCallback,
  updateProfileInfo,
  updateProfileInfoCallback,
} from '@/redux/slices/profileSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetProfile {
  payload: null;
}
interface actionLogout {
  payload: { deviceId: string };
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

interface actionUpdateProfileInfo {
  payload: null;
}

function* fetchLogoutServer(action: actionLogout) {
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
    callDeleteAccountCallback,
  );
}

function* fetchUpdateProfileInfo(action: actionUpdateProfileInfo) {
  yield* processAPISaga(
    ApiService.putUpdateProfile,
    action.payload,
    updateProfileInfoCallback,
  );
}

export default [
  takeLatest(getProfile, fetchProfile),
  takeLatest(postLogout, fetchLogoutServer),
  takeLatest(callDeleteAccount, fetchDeleteAccount),
  takeLatest(updateProfileInfo, fetchUpdateProfileInfo),
];
