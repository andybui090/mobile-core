import {
  getListSearchLocation,
  getListSearchLocationCallback,
} from '@/redux/slices/locationSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetListSearchLocation {
  payload: { input: string };
}

function* fetchListSearch(action: actionGetListSearchLocation) {
  yield* processAPISaga(
    ApiService.getListSearch,
    action.payload,
    getListSearchLocationCallback,
  );
}

export default [takeLatest(getListSearchLocation, fetchListSearch)];
