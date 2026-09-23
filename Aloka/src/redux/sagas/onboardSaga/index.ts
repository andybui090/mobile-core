import {
  getMedicaltypes,
  getMedicaltypesCallback,
  postSignUp,
  postSignUpCallback,
  getSpecializations,
  getSpecializationsCallback,
  getTitleInfomations,
  getTitleInfomationsCallback,
  registerDoctor,
  registerDoctorCallback,
} from '@/redux/slices/onboardSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface ActionPayload {
  payload: any;
}

function* fetchMediaType(action: ActionPayload): any {
  yield* processAPISaga(ApiService.getMedicaltypes, action.payload, getMedicaltypesCallback);
}

function* fetchSignUp(action: ActionPayload): any {
  yield* processAPISaga(ApiService.signupUser, action.payload, postSignUpCallback);
}

function* fetchSpecializations(action: ActionPayload): any {
  yield* processAPISaga(ApiService.getSpecializations, action.payload, getSpecializationsCallback);
}

function* fetchTitleInfomations(action: ActionPayload): any {
  yield* processAPISaga(ApiService.getTitleInfomations, action.payload, getTitleInfomationsCallback);
}

function* fetchRegisterDoctor(action: ActionPayload): any {
  yield* processAPISaga(ApiService.doctorRegister, action.payload, registerDoctorCallback);
}

export default [
  takeLatest(getMedicaltypes, fetchMediaType),
  takeLatest(postSignUp, fetchSignUp),
  takeLatest(getSpecializations, fetchSpecializations),
  takeLatest(getTitleInfomations, fetchTitleInfomations),
  takeLatest(registerDoctor, fetchRegisterDoctor),
];
