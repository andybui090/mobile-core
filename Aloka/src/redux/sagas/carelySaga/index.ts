import {
  getCarelyServices,
  getCarelyServicesCallback,
  getCarelySearchServices,
  getCarelySearchServicesCallback,
  // getCarelyChildServices,
  // getCarelyChildServicesCallback,
  // ratingCarely,
  // ratingCarelyCallback,
  // getDetailPkgCarely,
  // getDetailPkgCarelyCallback,
  // refundPkgCarely,
  // refundPkgCarelyCallback,
  // getReviewCarely,
  // getReviewCarelyCallback,
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

// interface actionRefundCarelyService {
//   payload: {
//     order_id:''
//   };
// }

function* fetchCarelyService(action: actionGetCarelyService) {
  yield* processAPISaga(
    ApiService.getCarelyServices,
    action.payload,
    getCarelyServicesCallback,
  );
}

function* fetchCarelySearchService(action: actionGetCarelyService) {
  yield* processAPISaga(
    ApiService.getCarelyServices,
    action.payload,
    getCarelySearchServicesCallback,
  );
}

// function* fetchCarelyChildServices(action: actionGetCarelyService) {
//   yield* processAPISaga(
//     ApiService.getCarelyServices,
//     action.payload,
//     getCarelyChildServicesCallback,
//     2,
//   );
// }

// function* fetchRatingCarely(action: actionGetCarelyService) {
//   yield* processAPISaga(
//     ApiService.postRatingCarely,
//     action.payload,
//     ratingCarelyCallback,
//     3,
//   );
// }

// function* fetchDetailPkgCarely(action: actionGetCarelyService) {
//   yield* processAPISaga(
//     ApiService.getCarelyPackageDetail,
//     action.payload,
//     getDetailPkgCarelyCallback,
//     1,
//   );
// }

// function* fetchRefundPkgCarely(action: actionRefundCarelyService) {
//   yield* processAPISaga(
//     ApiService.refundAfterBookingFailed,
//     action.payload,
//     refundPkgCarelyCallback,
//     1,
//   );
// }

// function* fetchCarelyReview(action: actionGetCarelyService) {
//   yield* processAPISaga(
//     ApiService.getCarelyReviews,
//     action.payload,
//     getReviewCarelyCallback,
//     2,
//   );
// }

export default [
  takeLatest(getCarelyServices, fetchCarelyService),
  takeLatest(getCarelySearchServices, fetchCarelySearchService),
  // takeLatest(getCarelyChildServices, fetchCarelyChildServices),
  // takeLatest(ratingCarely, fetchRatingCarely),
  // takeLatest(getDetailPkgCarely, fetchDetailPkgCarely),
  // takeLatest(refundPkgCarely, fetchRefundPkgCarely),
  // takeLatest(getReviewCarely, fetchCarelyReview),
];
