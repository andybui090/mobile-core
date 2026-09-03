import {
  getBanner,
  getBannerCallback,
  getUpcomingBookingHome,
  getUpcomingBookingHomeCallback,
} from '@/redux/slices/homeSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';

import ApiService from '@/services/api-base';

interface actionBanner {
  payload: {
    fq: string;
  };
}

interface actionHistoryBookings {
  payload: {
    fq?: string;
    offset?: number;
    limit?: number;
  };
}

function* fetchBanner(action: actionBanner) {
  yield* processAPISaga(
    ApiService.getBanner,
    action.payload,
    getBannerCallback,
  );
}

function* fetchUpcomingBookingHome(action: actionHistoryBookings) {
  yield* processAPISaga(
    ApiService.getHistoryBookings,
    action.payload,
    getUpcomingBookingHomeCallback,
  );
}

export default [
  takeLatest(getBanner, fetchBanner),
  takeLatest(getUpcomingBookingHome, fetchUpcomingBookingHome),
];
