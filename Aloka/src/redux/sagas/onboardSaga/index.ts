import {
  getMedicalTypes,
  getMedicalTypesCallback,
  postSignUp,
  postSignUpCallback,
  registerExpert,
  registerExpertCallback,
  getSpecializations,
  getSpecializationsCallback,
  getTitleInfomations,
  getTitleInfomationsCallback,
  // getClinics,
  // getClinicsCallback,
  // getClinicTypes,
  // getClinicTypesCallback,
  // createClinic,
  // createClinicCallback,
  // registerDoctor,
  // registerDoctorCallback,
  // updateDoctorProfile,
  // updateDoctorProfileCallback,
  // registerStudent,
  // registerStudentCallback,
  // updateStudentProfile,
  // updateStudentProfileCallback,
} from '@/redux/slices/onboardSlice';
import { takeLatest } from 'redux-saga/effects';
import { processAPISaga } from '../function/commonProcess';
import ApiService from '@/services/api-base';

interface actionMediatypes {
  payload: null;
}

interface actionSignup {
  payload: {
    avatar: string;
    country: string;
    dob: string;
    fullName: string;
    gender: string;
    interests: string;
    phone: string;
    type: string;
    username: string;
  };
}

interface actionRegisterExpert {
  payload: null;
}

interface actionSpecializations {
  payload: null;
}

interface actionTitleInfomations {
  payload: { limit: 10 };
}

// interface actionClinics {
//   payload: { limit: number, fq:string };
// }
// interface actionClinicsTypes {
//   payload: null;
// }
// interface actionCreateClinic {
//   payload: {
//     name: string,
//     address: string,
//     clinic_type_id: number,
//     country_id: number,
//     state_id?: number,
//     city_id?: number,
//     ward_id?: number,
//   };
// }

// interface actionRegisterDoctor {
//   payload: {
//     type: string,
//     fullName: string,
//     username: string,
//     email: string,
//     phone: string,
//     specializationId: number,
//     identification: string,
//     gender: string,
//     country: string,
//     dob: string, //YYYY-MM-DD,
//     description: string,
//     interests: string,
//     medicalId: number,
//     awardId: number,
//     academicId: number,
//     degreeId: number,
//     occupationId: number,
//     links: any[], //["fb", "youtube"]
//     attachments: any[],
//     experiences: any[],
//   };
// }

// interface actionRegisterStudent {
//   payload: {
//     type: string,
//     fullName: string,
//     username: string,
//     email: string,
//     phone: string,
//     specializationId: number,
//     identification: string,
//     gender: string,
//     country: string,
//     dob: string, //YYYY-MM-DD,
//     interests: string,
//     medicalId: number,
//   };
// }

// interface actionUpdateDoctor {
//   payload: any;
// }

// interface actionUpdateStudent {
//   payload: any;
// }

function* fetchMediaType(action: actionMediatypes) {
  yield* processAPISaga(
    ApiService.getMedicalTypes,
    action.payload,
    getMedicalTypesCallback,
  );
}

function* fetchSignUp(action: actionSignup) {
  yield* processAPISaga(
    ApiService.signupUser,
    action.payload,
    postSignUpCallback,
  );
}

function* fetchSpecializations(action: actionSpecializations) {
  yield* processAPISaga(
    ApiService.getSpecializations,
    action.payload,
    getSpecializationsCallback,
  );
}

function* fetchTitleInfomations(action: actionTitleInfomations) {
  yield* processAPISaga(ApiService.getTitleInfomations, action.payload, getTitleInfomationsCallback);
}

// function* fetchClinics(action: actionClinics) {
//   yield* processAPISaga(ApiService.getClinics, action.payload, getClinicsCallback, 2);
// }

// function* fetchClinicTypes(action: actionClinicsTypes) {
//   yield* processAPISaga(ApiService.getClinicTypes, action.payload, getClinicTypesCallback, 2);
// }

// function* fetchCreateClinic(action: actionCreateClinic) {
//   yield* processAPISaga(ApiService.createClinic, action.payload, createClinicCallback, 3);
// }

function* fetchRegisterDoctor(action: actionRegisterExpert) {
  yield* processAPISaga(
    ApiService.expertRegister,
    action.payload,
    registerExpertCallback,
  );
}

// function* fetchUpdateDoctor(action: actionUpdateDoctor) {
//   yield* processAPISaga(ApiService.updateDoctorProfile, action.payload, updateDoctorProfileCallback, 3);
// }

// function* fetchRegisterStudent(action: actionRegisterStudent) {
//   yield* processAPISaga(ApiService.studentRegister, action.payload, registerStudentCallback, 3);
// }

// function* fetchUpdateStudent(action: actionUpdateStudent) {
//   yield* processAPISaga(ApiService.updateStudentProfile, action.payload, updateStudentProfileCallback, 3);
// }

export default [
  takeLatest(getMedicalTypes, fetchMediaType),
  takeLatest(postSignUp, fetchSignUp),
  takeLatest(registerExpert, fetchRegisterDoctor),
  takeLatest(getSpecializations, fetchSpecializations),
  takeLatest(getTitleInfomations, fetchTitleInfomations),
  // takeLatest(getClinics, fetchClinics),
  // takeLatest(getClinicTypes, fetchClinicTypes),
  // takeLatest(createClinic, fetchCreateClinic),
  // takeLatest(registerDoctor, fetchRegisterDoctor),
  // takeLatest(updateDoctorProfile, fetchUpdateDoctor),
  // takeLatest(registerStudent, fetchRegisterStudent),
  // takeLatest(updateStudentProfile, fetchUpdateStudent),
];
