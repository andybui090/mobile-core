import { all } from 'redux-saga/effects';
import globalSaga from './globalSaga';
import authSaga from './authSaga';
import profileSaga from './profileSaga';
import onboardSaga from './onboardSaga';
import homeSaga from './homeSaga';
import nearbySaga from './nearbySaga';
import videoSaga from './videoSaga';
import searchSaga from './searchSaga';
import courseSaga from './courseSaga';
import videoCommentSaga from './videoCommentSaga';
import notifySaga from './notifySaga';
import channelSaga from './channelSaga';
// eCommerce
import eCommerceSaga from './eCommerceSaga';
import communitySaga from './communitySaga';
// course version 2
import courseSagaV2 from './courseSagaV2';
import settingSaga from './settingSaga';
import advertisingSaga from './advertisingSaga';
import newsfeedSaga from './newsfeedSaga';
// carely
import carelySaga from './carelySaga';
export default function* rootSaga() {
  yield all([
    ...globalSaga,
    ...authSaga,
    ...profileSaga,
    ...onboardSaga,
    ...homeSaga,
    ...nearbySaga,
    ...videoSaga,
    ...searchSaga,
    ...courseSaga,
    ...videoCommentSaga,
    ...notifySaga,
    ...channelSaga,
    ...eCommerceSaga,
    ...communitySaga,
    // course version 2
    ...courseSagaV2,
    ...settingSaga,
    ...advertisingSaga,
    ...newsfeedSaga,
    // carely
    ...carelySaga,
  ]);
}
