import {
  getChannelDetail,
  getChannelDetailCallback,
  updateChannel,
  updateChannelCallback,
  updateChannelSchedule,
  updateChannelScheduleCallback,
} from '@/redux/slices/channelSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface ActionGetChannelDetail {
  payload: string; // channelId
}

interface ActionUpdateChannel {
  payload: {
    id: string;
    schedules: string | Array<Record<string, any>>;
    [key: string]: any;
  };
}

function* fetchChannelDetail(action: ActionGetChannelDetail) {
  yield* processAPISaga(
    ApiService.getChannelDetail,
    action.payload,
    getChannelDetailCallback,
  );
}

function* fetchUpdateChannel(action: ActionUpdateChannel) {
  yield* processAPISaga(
    ApiService.updateChannel,
    action.payload,
    updateChannelCallback,
  );
}

export default [
  takeLatest(getChannelDetail, fetchChannelDetail),
  takeLatest(updateChannel, fetchUpdateChannel),
  takeLatest(updateChannelSchedule, fetchUpdateChannel),
];
