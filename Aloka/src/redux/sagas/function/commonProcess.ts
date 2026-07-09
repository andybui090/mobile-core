import { put, call } from 'redux-saga/effects';
import { API_MESSAGE } from '@/constants';

export const getAPIErrorMessage = (problem: any) => {
  for (const [key, val] of Object.entries(API_MESSAGE)) {
    if (key === problem) {
      return val;
    }
  }
  return 'Something error, try login again!';
};

export function* processAPISaga(apiPath: any, payload: any, callBack: any, responeType: any): any {
  try {
    const response = yield call(apiPath, payload);
    const { problem, data, status } = response;
    if (!problem && (status === 200 || status === 201 || status === 204)) {
      if (responeType === 1) {
        //array GET
        yield put(
          callBack({
            data: data ? data : {},
            error: null,
          }),
        );
      } else if (responeType === 2) {
        //object GET
        yield put(
          callBack({
            data: data ? data : {},
            error: null,
          }),
        );
      } else if (responeType === 3) {
        //object POST, PUT, DELETE
        yield put(
          callBack({
            data: data ? data : { is_success: true },
            error: null,
          }),
        );
      } else if (responeType === 4) {
        //array POST, PUT, DELETE
        yield put(
          callBack({
            data: data ? data : [],
            error: null,
          }),
        );
      }
    } else {
      yield put(
        callBack({
          data: null,
          error: Object.assign(data || {}, { status, problem: getAPIErrorMessage(problem) }),
        }),
      );
    }
  } catch (error) {
    yield put(
      callBack({
        data: null,
        error: error,
      }),
    );
  }
}
