import {
  getTutorials,
  getTutorialsCallback,
} from '@/redux/slices/globalSlice';
import {takeLatest} from 'redux-saga/effects';
import {processAPISaga} from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetTutorials {
  payload: {fq: string; sort: string};
}

function* fetchTutorials(action: actionGetTutorials) {
  yield* processAPISaga(
    ApiService.getTutorials,
    action.payload,
    getTutorialsCallback,
    2,
  );
}

export default [
  takeLatest(getTutorials, fetchTutorials),
];