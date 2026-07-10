import {
  getSettingsOnboarding,
  getSettingsOnboardingCallback,
} from '@/redux/slices/settingSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionSettingsOnboarding {
  payload: { fq: string };
}
function* fetchSettingsOnboarding(action: actionSettingsOnboarding) {
  yield* processAPISaga(
    ApiService.getSettingsOnboarding,
    action.payload,
    getSettingsOnboardingCallback,
  );
}

export default [
  takeLatest(getSettingsOnboarding, fetchSettingsOnboarding),
];
