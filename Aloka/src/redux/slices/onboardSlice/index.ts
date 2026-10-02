import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';

interface OnboardState {
  dataMedicalTypes: responseProps;
  signupNormal: responseProps;
  expertRegister: responseProps;
  specializationsList: responseProps;
  titleInfomationsList: responseProps;
  // clinicTypesList: responseListProps;
  // doctorUpdate: responseCreateProps;
  // studentRegister: responseCreateProps;
  // studentUpdate: responseCreateProps;
  // clinicList: responseListProps;
  // clinicCreate: responseCreateProps;
}

const initialState: OnboardState = {
  dataMedicalTypes: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  signupNormal: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  expertRegister: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  specializationsList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  titleInfomationsList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  // clinicTypesList: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // doctorUpdate: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // studentRegister: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // studentUpdate: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // clinicList: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // clinicCreate: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // }
};

const onboardSlice = createSlice({
  name: 'onboard',
  initialState,

  reducers: {
    getMedicalTypes: (state, _action) => {
      state.dataMedicalTypes.loading = true;
    },
    getMedicalTypesCallback: (state, { payload: { data, error } }) => {
      const { dataMedicalTypes } = state;
      dataMedicalTypes.loading = false;
      dataMedicalTypes.data = data;
      dataMedicalTypes.error = error;
    },
    //
    postSignUp: (state, _action) => {
      state.signupNormal.loading = true;
    },
    postSignUpCallback: (state, { payload: { data, error } }) => {
      const { signupNormal } = state;
      signupNormal.loading = false;
      signupNormal.data = data;
      signupNormal.error = error;
    },
    //
    getSpecializations: (state, _action) => {
      state.specializationsList.loading = true;
    },
    getSpecializationsCallback: (state, { payload: { data, error } }) => {
      const { specializationsList } = state;
      specializationsList.loading = false;
      specializationsList.data = data;
      specializationsList.error = error;
    },
    //
    getTitleInfomations: (state, _action) => {
      state.titleInfomationsList.loading = true;
    },
    getTitleInfomationsCallback: (state, { payload: { data, error } }) => {
      const { titleInfomationsList } = state;
      titleInfomationsList.loading = false;
      titleInfomationsList.data = data;
      titleInfomationsList.error = error;
    },
    //
    // getClinics: (state, _action) => {
    //   state.clinicList.loading = true;
    // },
    // getClinicsCallback: (state, { payload: { data, error } }) => {
    //   const { clinicList } = state;
    //   clinicList.loading = false;
    //   clinicList.data = data;
    //   clinicList.error = error;
    // },
    //
    // getClinicTypes: (state, _action) => {
    //   state.clinicTypesList.loading = true;
    // },
    // getClinicTypesCallback: (state, { payload: { data, error } }) => {
    //   const { clinicTypesList } = state;
    //   clinicTypesList.loading = false;
    //   clinicTypesList.data = data;
    //   clinicTypesList.error = error;
    // },
    //
    // updateDoctorProfile: (state, _action) => {
    //   state.doctorUpdate.loading = true;
    // },
    // updateDoctorProfileCallback: (state, { payload: { data, error } }) => {
    //   const { doctorUpdate } = state;
    //   doctorUpdate.loading = false;
    //   doctorUpdate.data = data;
    //   doctorUpdate.error = error;
    // },
    //
    // createClinic: (state, _action) => {
    //   state.clinicCreate.loading = true;
    // },
    // createClinicCallback: (state, { payload: { data, error } }) => {
    //   const { clinicCreate } = state;
    //   clinicCreate.loading = false;
    //   clinicCreate.data = data;
    //   clinicCreate.error = error;
    // },
    //
    registerExpert: (state, _action) => {
      state.expertRegister.loading = true;
    },
    registerExpertCallback: (state, { payload: { data, error } }) => {
      const { expertRegister } = state;
      expertRegister.loading = false;
      expertRegister.data = data;
      expertRegister.error = error;
    },
    //register student
    // registerStudent: (state, _action) => {
    //   state.studentRegister.loading = true;
    // },
    // registerStudentCallback: (state, { payload: { data, error } }) => {
    //   const { studentRegister } = state;
    //   studentRegister.loading = false;
    //   studentRegister.data = data;
    //   studentRegister.error = error;
    // },
    //
    // updateStudentProfile: (state, _action) => {
    //   state.studentUpdate.loading = true;
    // },
    // updateStudentProfileCallback: (state, { payload: { data, error } }) => {
    //   const { studentUpdate } = state;
    //   studentUpdate.loading = false;
    //   studentUpdate.data = data;
    //   studentUpdate.error = error;
    // },
    resetOnboardUnused: (state, _action) => {
      const {
        // doctorRegister,
        // doctorUpdate,
        // studentRegister,
        // studentUpdate,
        signupNormal,
        // clinicCreate,
        // clinicList,
      } = state;
      // doctorRegister.loading = false;
      // doctorRegister.data = undefined;
      // doctorRegister.error = undefined;
      // doctorUpdate.loading = false;
      // doctorUpdate.data = undefined;
      // doctorUpdate.error = undefined;
      // studentRegister.loading = false;
      // studentRegister.data = undefined;
      // studentRegister.error = undefined;
      // studentUpdate.loading = false;
      // studentUpdate.data = undefined;
      // studentUpdate.error = undefined;
      signupNormal.loading = false;
      signupNormal.data = undefined;
      signupNormal.error = undefined;
      // clinicCreate.loading = false;
      // clinicCreate.data = undefined;
      // clinicCreate.error = undefined;
      // clinicList.loading = false;
      // clinicList.data = undefined;
      // clinicList.error = undefined;
    },
  },
});

export const {
  getMedicalTypes,
  getMedicalTypesCallback,
  postSignUp,
  postSignUpCallback,
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
  registerExpert,
  registerExpertCallback,
  // updateDoctorProfile,
  // updateDoctorProfileCallback,
  // registerStudent,
  // registerStudentCallback,
  // updateStudentProfile,
  // updateStudentProfileCallback,
  resetOnboardUnused,
} = onboardSlice.actions;

export default onboardSlice.reducer;
