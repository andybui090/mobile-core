import {createSlice} from '@reduxjs/toolkit';
import {
  AdjustParams,
  DeeplinkParams,
  responseListProps,
  responseObjectProps,
} from '../types';
import {storeObjectData} from '@/storages';
import {STORAGEKEY} from '@/constants';
import ApiService from '@/services/api-base';
interface GlobalState {
  tutorialList: responseListProps;
  categoryList: responseListProps;
  languageList: responseListProps;
  countryList: responseListProps;
  provinceList: responseListProps;
  districtList: responseListProps;
  wardList: responseListProps;
  firebaseConfig: any;
  playText: any;
  videoConfig: any;
  appRegion: any;
  updateCategories: any;
  regionList: responseListProps;
  appStateStatus: any;
  reloadConnectSocket: any;
  checkRoomPrivate: any;
  deleteRoomLive: any;
  adjustLink: AdjustParams;
  deepLink: DeeplinkParams;
  deepLinkTracking: any;
  historyChatName: string;
  dataPaymentStatus: responseObjectProps;
}

const initialState: GlobalState = {
  tutorialList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  categoryList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  languageList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  countryList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  provinceList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  districtList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  wardList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  firebaseConfig: {
    isRequireLogin: true,
    isRequireLoginSocial: false,
    isShowChatAssistant: false,
    isMarquee: true,
    isSoundHome: true,
    isShowAdmod: true,
    isShowAdmodMultiple: false,
    isShowGuide: true,
    isAllowCall: false,
    stepMinutes: 60,
  },
  playText: {
    isPlay: true,
  },
  videoConfig: {
    autoPlayNextVideo: false,
  },
  appRegion: {
    id: -1,
    name: 'Global',
  },
  updateCategories: {
    isUpdate: true,
  },
  regionList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  appStateStatus: '',
  reloadConnectSocket: '',
  checkRoomPrivate: '',

  deleteRoomLive: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataPaymentStatus: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  adjustLink: {
    url: '',
    utm_medium: '',
    utm_campaign: '',
    utm_source: '',
    utm_content: '',
    utm_term: '',
  },
  deepLink: {
    url: '',
    utm_medium: '',
    utm_campaign: '',
    utm_source: '',
    utm_content: '',
    utm_term: '',
  },
  deepLinkTracking: {},
  historyChatName: 'Community',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    getTutorials: (state, _action) => {
      state.tutorialList.loading = true;
    },
    getTutorialsCallback: (state, {payload: {data, error}}) => {
      const {tutorialList} = state;
      tutorialList.loading = false;
      tutorialList.data = data;
      tutorialList.error = error;
    },
    //
    getCategories: (state, _action) => {
      state.categoryList.loading = true;
    },
    getCategoriesCallback: (state, {payload: {data, error}}) => {
      const {categoryList} = state;
      categoryList.loading = false;
      categoryList.data = data;
      categoryList.error = error;
    },
    //
    getLanguages: (state, _action) => {
      state.languageList.loading = true;
    },
    getLanguagesCallback: (state, {payload: {data, error}}) => {
      const {languageList} = state;
      languageList.loading = false;
      languageList.data = data;
      languageList.error = error;
    },
    //
    getCountries: (state, _action) => {
      state.countryList.loading = true;
    },
    getCountriesCallback: (state, {payload: {data, error}}) => {
      const {countryList} = state;
      countryList.loading = false;
      countryList.data = data;
      countryList.error = error;
    },
    //
    getProvinces: (state, _action) => {
      state.provinceList.loading = true;
    },
    getProvincesCallback: (state, {payload: {data, error}}) => {
      const {provinceList} = state;
      provinceList.loading = false;
      provinceList.data = data;
      provinceList.error = error;
    },
    //
    getDistricts: (state, _action) => {
      state.districtList.loading = true;
    },
    getDistrictsCallback: (state, {payload: {data, error}}) => {
      const {districtList} = state;
      districtList.loading = false;
      districtList.data = data;
      districtList.error = error;
    },
    //
    getWards: (state, _action) => {
      state.wardList.loading = true;
    },
    getWardCallback: (state, {payload: {data, error}}) => {
      const {wardList} = state;
      wardList.loading = false;
      wardList.data = data;
      wardList.error = error;
    },
    setFirebaseConfig: (state, {payload}) => {
      state.firebaseConfig = payload;
    },
    updatePlayText: (state, action) => {
      // console.log("🚀 ~ action:", action)
      storeObjectData(STORAGEKEY.PLAY_TEXT, action.payload);
      state.playText = action.payload;
    },
    updateVideoConfig: (state, action) => {
      // console.log("🚀 ~ action:", action)
      storeObjectData(STORAGEKEY.VIDEO_CONFIG, action.payload);
      state.videoConfig = action.payload;
    },
    updateCategoriesWhenChangeLanguage: (state, action) => {
      state.updateCategories.isUpdate = !state.updateCategories.isUpdate;
    },
    setAppLink: (state, action) => {
      if (action.payload) {
        storeObjectData(STORAGEKEY.FIREBASE_DYNAMIC_LINK, action.payload);
      }
    },
    updateSoundHome: (state, {payload}) => {
      state.firebaseConfig.isSoundHome = payload;
    },
    setAppRegion: (state, action) => {
      state.appRegion = action.payload;
      if (action.payload.id == -1) {
        ApiService.setXAppContent('');
      } else {
        ApiService.setXAppContent(action.payload['iso2'] || '');
      }
      if (action.payload) {
        storeObjectData(STORAGEKEY.REGION, action.payload);
      }
    },
    //
    getRegions: (state, _action) => {
      state.regionList.loading = true;
    },
    getRegionsCallback: (state, {payload: {data, error}}) => {
      const {regionList} = state;
      regionList.loading = false;
      regionList.data = data;
      regionList.error = error;
    },

    resetGlobalReducer: () => initialState,

    appStateStatus: (state, _action) => {
      state.appStateStatus = _action.payload;
    },

    reloadConnectSocket: (state, _action) => {
      state.reloadConnectSocket = _action.payload;
    },

    checkRoomPrivate: (state, _action) => {
      state.checkRoomPrivate = _action.payload;
    },
    deleteRoomLive: (state, _action) => {
      state.deleteRoomLive = _action.payload;
    },
    setAdjustLink: (state, action) => {
      if (action.payload) {
        state.adjustLink = action.payload;
      }
    },
    setFirebaseLink: (state, action) => {
      if (action.payload) {
        state.deepLink = action.payload;
      }
    },
    setDeepLinkTracking: (state, action) => {
      if (action.payload) {
        state.deepLinkTracking = action.payload;
      }
    },
    setHistoryChatName: (state, action) => {
      state.historyChatName = action.payload;
    },
    checkPaymentStatus: (state, _action) => {
      state.dataPaymentStatus.loading = true;
    },
    checkPaymentStatusCallback: (state, {payload: {data, error}}) => {
      const {dataPaymentStatus} = state;
      dataPaymentStatus.loading = false;
      dataPaymentStatus.data = data;
      dataPaymentStatus.error = error;
    },
  },
});

export const {
  getTutorials,
  getTutorialsCallback,
  getCategories,
  getCategoriesCallback,
  getLanguages,
  getLanguagesCallback,
  getCountries,
  getCountriesCallback,
  getProvinces,
  getProvincesCallback,
  getDistricts,
  getDistrictsCallback,
  getWards,
  getWardCallback,
  setFirebaseConfig,
  updatePlayText,
  updateVideoConfig,
  updateCategoriesWhenChangeLanguage,
  setAppLink,
  updateSoundHome,
  setAppRegion,
  getRegions,
  getRegionsCallback,
  resetGlobalReducer,
  appStateStatus,
  reloadConnectSocket,
  checkRoomPrivate,
  deleteRoomLive,
  setAdjustLink,
  setFirebaseLink,
  setDeepLinkTracking,
  setHistoryChatName,
  checkPaymentStatus,
  checkPaymentStatusCallback,
} = globalSlice.actions;

export default globalSlice.reducer;
