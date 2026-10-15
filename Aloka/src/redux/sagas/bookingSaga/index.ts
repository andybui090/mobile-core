import {
  getUpcomingBooking,
  getUpcomingBookingCallback,
  putCompleteBooking,
  putCompleteBookingCallback,
  putCancelBooking,
  putCancelBookingCallback,
  putRejectBooking,
  putRejectBookingCallback,
  putStatusBooking,
  putStatusBookingCallback,
  getRequestBooking,
  getRequestBookingCallback,
  putAcceptBooking,
  putAcceptBookingCallback,
  getCompletedBooking,
  getCompletedBookingCallback,
  getCancelBooking,
  getCancelBookingCallback,
  getExpiredBooking,
  getExpiredBookingCallback,
} from '@/redux/slices/bookingSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';
interface actionHistoryBookings {
  payload: {
    fq?: string;
    offset?: number;
    limit?: number;
  };
}

interface actionBookings {
  payload: {
    status?: string;
  };
}

function* fetchUpcomingBooking(action: actionHistoryBookings) {
  yield* processAPISaga(
    ApiService.getHistoryBookings,
    action.payload,
    getUpcomingBookingCallback,
  );
}

function* completeBooking(action: actionBookings) {
  yield* processAPISaga(
    ApiService.updateBookingStatus,
    action.payload,
    putCompleteBookingCallback,
  );
}

function* cancelBooking(action: actionBookings) {
  yield* processAPISaga(
    ApiService.updateBookingStatus,
    action.payload,
    putCancelBookingCallback,
  );
}

function* rejectBooking(action: actionBookings) {
  yield* processAPISaga(
    ApiService.updateBookingStatus,
    action.payload,
    putRejectBookingCallback,
  );
}

function* updateStatusBooking(action: actionBookings) {
  yield* processAPISaga(
    ApiService.updateBookingStatus,
    action.payload,
    putStatusBookingCallback,
  );
}

function* fetchRequestBooking(action: actionHistoryBookings) {
  yield* processAPISaga(
    ApiService.getHistoryBookings,
    action.payload,
    getRequestBookingCallback,
  );
}

function* acceptBooking(action: actionBookings) {
  yield* processAPISaga(
    ApiService.updateBookingStatus,
    action.payload,
    putAcceptBookingCallback,
  );
}

function* fetchCompletedBooking(action: actionHistoryBookings) {
  yield* processAPISaga(
    ApiService.getHistoryBookings,
    action.payload,
    getCompletedBookingCallback,
  );
}

function* fetchCancelBooking(action: actionHistoryBookings) {
  yield* processAPISaga(
    ApiService.getHistoryBookings,
    action.payload,
    getCancelBookingCallback,
  );
}

function* fetchExpiredBooking(action: actionHistoryBookings) {
  yield* processAPISaga(
    ApiService.getHistoryBookings,
    action.payload,
    getExpiredBookingCallback,
  );
}

export default [
  takeLatest(getUpcomingBooking, fetchUpcomingBooking),
  takeLatest(putCompleteBooking, completeBooking),
  takeLatest(putCancelBooking, cancelBooking),
  takeLatest(putRejectBooking, rejectBooking),
  takeLatest(putStatusBooking, updateStatusBooking),
  takeLatest(getRequestBooking, fetchRequestBooking),
  takeLatest(putAcceptBooking, acceptBooking),
  takeLatest(getCompletedBooking, fetchCompletedBooking),
  takeLatest(getCancelBooking, fetchCancelBooking),
  takeLatest(getExpiredBooking, fetchExpiredBooking),
];
