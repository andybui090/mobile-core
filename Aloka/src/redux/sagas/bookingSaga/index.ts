import {
  getCarelyServices,
  getCarelyServicesCallback,
} from '@/redux/slices/carelySlice';
import {takeLatest} from 'redux-saga/effects';
import {processAPISaga} from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetCarelyService {
  payload: {
    fq?: string;
    limit?: number;
    offset?: number;
    sort?: string;
  };
}

function* fetchCarelyService(action: actionGetCarelyService) {
  yield* processAPISaga(
    ApiService.getCarelyServices,
    action.payload,
    getCarelyServicesCallback,
  );
}

export default [
  takeLatest(getCarelyServices, fetchCarelyService),
];
