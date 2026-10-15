import {
  getSettingsOnboarding,
  getSettingsOnboardingCallback,
   getSettings,
  getSettingsCallback,
} from '@/redux/slices/settingSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionSettings {
  payload: { fq: string;};
}
interface actionSettingsOnboarding {
  payload: { fq: string };
}

function* fetchSettings(action: actionSettings) {
  yield* processAPISaga(ApiService.getSettingsOnboarding, action.payload, getSettingsCallback);
}

function* fetchSettingsOnboarding(action: actionSettingsOnboarding) {
  yield* processAPISaga(
    ApiService.getSettingsOnboarding,
    action.payload,
    getSettingsOnboardingCallback,
  );
}

export default [
  takeLatest(getSettings, fetchSettings),
  takeLatest(getSettingsOnboarding, fetchSettingsOnboarding),
];
