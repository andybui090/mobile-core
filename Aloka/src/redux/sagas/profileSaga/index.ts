import { getProfile, getProfileCallback } from '@/redux/slices/profileSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetProfile {
  payload: null;
}

function* fetchProfile(action: actionGetProfile) {
  yield* processAPISaga(
    ApiService.getProfile,
    action.payload,
    getProfileCallback,
  );
}

export default [takeLatest(getProfile, fetchProfile)];
