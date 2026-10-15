import {
  getTutorials,
  getTutorialsCallback,
  getLanguages,
  getLanguagesCallback,
  getCountries,
  getCountriesCallback,
  getCategories,
  getCategoriesCallback,
  postFeedbackData,
  postFeedbackDataCallback,
  getListReport,
  getListReportCallback,
  postReport,
  postReportCallback,
} from '@/redux/slices/globalSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionGetTutorials {
  payload: { fq: string; sort: string };
}
interface actionGetLanguages {
  payload: { fq: string };
}

interface actionGetCountries {
  payload: null;
}

interface actionGetCategories {
  payload: null;
}

interface actionFeedBack {
  payload: {
    content: string;
    type: string;
    report_images?: any;
  };
}

interface actionListReport {
  payload: null;
}

interface actionReport {
  payload: {
    // video_id: string;
    // report_type_id: number;
    // content: string;
    // type: string;
  };
}


function* fetchTutorials(action: actionGetTutorials) {
  yield* processAPISaga(
    ApiService.getTutorials,
    action.payload,
    getTutorialsCallback,
  );
}

function* fetchListLanguage(action: actionGetLanguages) {
  yield* processAPISaga(
    ApiService.getLanguage,
    action.payload,
    getLanguagesCallback,
  );
}

function* fetchCountries(action: actionGetCountries) {
  yield* processAPISaga(
    ApiService.getCountries,
    action.payload,
    getCountriesCallback,
  );
}

function* fetchCategories(action: actionGetCategories) {
  yield* processAPISaga(
    ApiService.getCategories,
    action.payload,
    getCategoriesCallback,
  );
}

function* fetchFeedback(action: actionFeedBack) {
  yield* processAPISaga(
    ApiService.postFeedback,
    action.payload,
    postFeedbackDataCallback,
  );
}

function* fetchListReport(action: actionListReport) {
  yield* processAPISaga(
    ApiService.getListReport,
    action.payload,
    getListReportCallback,
  );
}

function* fetchPostReport(action: actionReport) {
  yield* processAPISaga(ApiService.postReport, action.payload, postReportCallback);
}


export default [
  takeLatest(getTutorials, fetchTutorials),
  takeLatest(getLanguages, fetchListLanguage),
  takeLatest(getCountries, fetchCountries),
  takeLatest(getCategories, fetchCategories),
  takeLatest(postFeedbackData, fetchFeedback),
  takeLatest(getListReport, fetchListReport),
  takeLatest(postReport, fetchPostReport),
];
