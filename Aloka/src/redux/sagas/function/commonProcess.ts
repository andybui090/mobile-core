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

export function* processAPISaga(
  apiPath: any,
  payload: any,
  callBack: any,
): any {
  try {
    const response = yield call(apiPath, payload);
    const { problem, data, status } = response;
    if (!problem && (status === 200 || status === 201 || status === 204)) {
      yield put(
        callBack({
          data: data ? data : {},
          error: null,
        }),
      );
      if (payload && typeof payload.callback === 'function') {
        payload.callback({ success: true, data: data ? data : {} });
      }
    } else {
      const errorObj = Object.assign(data || {}, {
        status,
        problem: getAPIErrorMessage(problem),
      });
      yield put(
        callBack({
          data: null,
          error: errorObj,
        }),
      );
      if (payload && typeof payload.callback === 'function') {
        payload.callback({ success: false, error: errorObj });
      }
    }
  } catch (error) {
    yield put(
      callBack({
        data: null,
        error: error,
      }),
    );
    if (payload && typeof payload.callback === 'function') {
      payload.callback({ success: false, error });
    }
  }
}

