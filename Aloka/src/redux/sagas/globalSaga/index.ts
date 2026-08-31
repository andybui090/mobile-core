import {
  getTutorials,
  getTutorialsCallback,
  getLanguages,
  getLanguagesCallback,
} from '@/redux/slices/globalSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetTutorials {
  payload: { fq: string; sort: string };
}
interface actionGetLanguages {
  payload: { fq: string };
}

function* fetchTutorials(action: actionGetTutorials) {
  yield* processAPISaga(
    ApiService.getTutorials,
    action.payload,
    getTutorialsCallback,
  );
}

function* fetchListLanguage(action: actionGetLanguages) {
  yield* processAPISaga(
    ApiService.getLanguage,
    action.payload,
    getLanguagesCallback,
  );
}

export default [
  takeLatest(getTutorials, fetchTutorials),
  takeLatest(getLanguages, fetchListLanguage),
];
