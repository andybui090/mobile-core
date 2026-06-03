import { all } from 'redux-saga/effects';
import globalSaga from './globalSaga';

export default function* rootSaga() {
  yield all([
    ...globalSaga,
  ]);
}
