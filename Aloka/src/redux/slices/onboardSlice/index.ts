import { createSlice } from '@reduxjs/toolkit';
import { responseCreateProps, responseListProps } from '../types';

interface OnboardState {
  medicalTypesList: responseListProps;
  signupNormal: responseCreateProps;
  doctorRegister: responseCreateProps;
  specializationsList: responseListProps;
  titleInfomationsList: responseListProps;
}

const initialState: OnboardState = {
  medicalTypesList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  signupNormal: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  doctorRegister: {
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
};

const onboardSlice = createSlice({
  name: 'onboard',
  initialState,

  reducers: {
    getMedicaltypes: (state, _action) => {
      state.medicalTypesList.loading = true;
    },
    getMedicaltypesCallback: (state, { payload: { data, error } }) => {
      const { medicalTypesList } = state;
      medicalTypesList.loading = false;
      medicalTypesList.data = data;
      medicalTypesList.error = error;
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
    registerDoctor: (state, _action) => {
      state.doctorRegister.loading = true;
    },
    registerDoctorCallback: (state, { payload: { data, error } }) => {
      const { doctorRegister } = state;
      doctorRegister.loading = false;
      doctorRegister.data = data;
      doctorRegister.error = error;
    },
    resetOnboardUnused: (state, _action) => {
      const { doctorRegister, signupNormal } = state;
      doctorRegister.loading = false;
      doctorRegister.data = undefined;
      doctorRegister.error = undefined;

      signupNormal.loading = false;
      signupNormal.data = undefined;
      signupNormal.error = undefined;
    },
  },
});

export const {
  getMedicaltypes,
  getMedicaltypesCallback,
  postSignUp,
  postSignUpCallback,
  getSpecializations,
  getSpecializationsCallback,
  getTitleInfomations,
  getTitleInfomationsCallback,
  registerDoctor,
  registerDoctorCallback,
  resetOnboardUnused,
} = onboardSlice.actions;

export default onboardSlice.reducer;
