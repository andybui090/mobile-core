import {
  getDetailChannel,
  getDetailChannelCallback,
  // getVideoChannel,
  // getVideoChannelCallback,
  // getSerriesChannel,
  // getSerriesChannelCallback,
  getListChannel,
  getListChannelCallback,
  getMembership,
  getMembershipCallback,
  // getDetailChannelNewsFeed,
  // getDetailChannelNewsFeedCallback,
  getDetailChannelServicesPackage,
  getDetailChannelServicesPackageCallback,
  getDetailChannelOptionServicesPackage,
  getDetailChannelOptionServicesPackageCallback,
  postCreateChannelPackage,
  postCreateChannelPackageCallback,
  // postBuyPackageChannel,
  // postBuyPackageChannelCallback,
  postBuyPackageFreeChannel,
  postBuyPackageFreeChannelCallback,
  postBookingChannel,
  postBookingChannelCallback,
  postEditChannelPackage,
  postEditChannelPackageCallback,
  updateChannel,
  updateChannelCallback,
  getAppointmentTime,
  getAppointmentTimeCallback,
  // getPackageHot,
  // getPackageHotCallback,
} from '@/redux/slices/channelSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionDetailChannel {
  payload: {
    channelId: string;
  };
}

interface actionListChannel {
  payload: {
    limit: number;
    offset: number;
    fqin: string;
  };
}

interface actionMemershipChannel {
  payload: {
    limit: number;
    offset: number;
    fqin: string;
  };
}

// interface actionSerriesChannel {
//   payload: {
//     fqin: string;
//   };
// }

// interface actionDetailChannelNewsFeed {
//   payload: {
//     limit: number;
//     offset: number;
//     fq: string;
//   };
// }

interface actionDetailChannelServicesPackage {
  payload: {};
}

interface actionCreateChannePackage {
  payload: {
    user_id: string;
    channel_id: string;
    package_id: string;
    name: string;
    price: number;
    discount: number;
    chat_1vs1: number;
    call_1vs1: number;
    is_newsfeed: number;
    is_livestream: number;
    view_week: number;
  };
}

interface actionUpdateChannel {
  payload: {
    schedules: string;
    channel_id: string;
  };
}

interface actionAppointmentTime {
  payload: {
    channelId: string;
  };
}

interface actionBuyPackage {
  payload: {
    package_id: number;
    payment: string;
  };
}

interface actionBookingCall {
  payload: {
    doctor_id: string;
    category_id: string;
    clinic_id: string;
    full_name: string;
    phone: string;
    duration: string;
    note: string;
    date: string;
    type: 'OFFLINE';
  };
}

function* fetchDetailChannel(action: actionDetailChannel) {
  yield* processAPISaga(
    ApiService.getChannelDetail,
    action.payload,
    getDetailChannelCallback,
  );
}

// function* fetchVideoChannel(action: actionVideoChannel) {
//   yield* processAPISaga(
//     ApiService.getVideoChannel,
//     action.payload,
//     getVideoChannelCallback,
//     2,
//   );
// }

// function* fetchSerriesChannel(action: actionSerriesChannel) {
//   yield* processAPISaga(
//     ApiService.getSerriesChannel,
//     action.payload,
//     getSerriesChannelCallback,
//     2,
//   );
// }

function* fetchListChannel(action: actionListChannel) {
  yield* processAPISaga(
    ApiService.getListChannel,
    action.payload,
    getListChannelCallback,
  );
}

function* fetchListMemberShip(action: actionMemershipChannel) {
  yield* processAPISaga(
    ApiService.getListMembership,
    action.payload,
    getMembershipCallback,
  );
}

// function* fetchDetailChannelNewsfeed(action: actionDetailChannelNewsFeed) {
//   yield* processAPISaga(
//     ApiService.getChannelDetailNewsfeed,
//     action.payload,
//     getDetailChannelNewsFeedCallback,
//     2,
//   );
// }

function* fetchDetailChannelServicesPackage(
  action: actionDetailChannelServicesPackage,
) {
  yield* processAPISaga(
    ApiService.getChannelDetailServicesPackage,
    action.payload,
    getDetailChannelServicesPackageCallback,
  );
}

function* fetchDetailChannelOptionServicesPackage(
  action: actionDetailChannelServicesPackage,
) {
  yield* processAPISaga(
    ApiService.getChannelDetailServicesPackage,
    action.payload,
    getDetailChannelOptionServicesPackageCallback,
  );
}

function* fetchCreateChannelPackage(action: actionCreateChannePackage) {
  yield* processAPISaga(
    ApiService.postChannelPackage,
    action.payload,
    postCreateChannelPackageCallback,
  );
}

// function* fetchBuyPackage(action: actionBuyPackage) {
//   yield* processAPISaga(
//     ApiService.buyPackage,
//     action.payload,
//     postBuyPackageChannelCallback,
//     2,
//   );
// }

function* fetchBuyPackageFree(action: actionBuyPackage) {
  yield* processAPISaga(
    ApiService.buyPackage,
    action.payload,
    postBuyPackageFreeChannelCallback,
  );
}

function* fetchBookingCall(action: actionBookingCall) {
  yield* processAPISaga(
    ApiService.postBookingCall,
    action.payload,
    postBookingChannelCallback,
  );
}

function* fetchEditChannelPackage(action: actionCreateChannePackage) {
  yield* processAPISaga(
    ApiService.putChannelPackage,
    action.payload,
    postEditChannelPackageCallback,
  );
}

function* updateChannelAppointment(action: actionUpdateChannel) {
  yield* processAPISaga(
    ApiService.putChannel,
    action.payload,
    updateChannelCallback,
  );
}

function* fetchTimeAppointment(action: actionAppointmentTime) {
  yield* processAPISaga(
    ApiService.getChannelAppointmentTime,
    action.payload,
    getAppointmentTimeCallback,
  );
}

// function* fetchPackageHot(action: actionDetailChannelServicesPackage) {
//   yield* processAPISaga(
//     ApiService.getPackageHot,
//     action.payload,
//     getPackageHotCallback,
//     2,
//   );
// }

export default [
  takeLatest(getDetailChannel, fetchDetailChannel),
  // takeLatest(getVideoChannel, fetchVideoChannel),
  // takeLatest(getSerriesChannel, fetchSerriesChannel),
  takeLatest(getListChannel, fetchListChannel),
  takeLatest(getMembership, fetchListMemberShip),
  // takeLatest(getDetailChannelNewsFeed, fetchDetailChannelNewsfeed),
  takeLatest(
    getDetailChannelServicesPackage,
    fetchDetailChannelServicesPackage,
  ),
  takeLatest(
    getDetailChannelOptionServicesPackage,
    fetchDetailChannelOptionServicesPackage,
  ),
  takeLatest(postCreateChannelPackage, fetchCreateChannelPackage),
  // takeLatest(postBuyPackageChannel, fetchBuyPackage),
  takeLatest(postBuyPackageFreeChannel, fetchBuyPackageFree),
  takeLatest(postBookingChannel, fetchBookingCall),
  takeLatest(postEditChannelPackage, fetchEditChannelPackage),
  takeLatest(updateChannel, updateChannelAppointment),
  takeLatest(getAppointmentTime, fetchTimeAppointment),
  // takeLatest(getPackageHot, fetchPackageHot),
];
