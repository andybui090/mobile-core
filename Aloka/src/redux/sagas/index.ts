import { all } from 'redux-saga/effects';
import globalSaga from './globalSaga';
import settingSaga from './settingSaga';
import profileSaga from './profileSaga';
import authSaga from './authSaga';

export default function* rootSaga() {
  yield all([...globalSaga, ...settingSaga, ...profileSaga, ...authSaga]);
}
