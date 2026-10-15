import { createSlice } from '@reduxjs/toolkit';

import { responseProps } from '../types';

interface AuthState {
  channelDetailData: responseProps;
  // channelVideos: responseListProps;
  // channelSerries: responseListProps;
  channelList: responseProps;
  // updateChannelListLocal: any;
  // channelDetailNewsFeed: responseObjectProps;
  listPackageChannel: responseProps;
  listOptionPackageChannel: responseProps;
  dataPackageChannel: responseProps;
  dataEditPackageChannel: responseProps;
  dataBuyPackage: responseProps;
  dataBuyPackageFree: responseProps;
  dataBookingCall: responseProps;
  dataUpdateChannel: responseProps;
  dataAppointmentTime: responseProps;
  // dataPackageHot: responseObjectProps;
  // memberShipList: responseListProps;
  // refreshVideoLocal: any;
}

const initialState: AuthState = {
  channelDetailData: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  // channelVideos: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // channelSerries: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  channelList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  // updateChannelListLocal: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // channelDetailNewsFeed: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  listPackageChannel: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  listOptionPackageChannel: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataPackageChannel: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataEditPackageChannel: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataBuyPackage: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataBuyPackageFree: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataBookingCall: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataUpdateChannel: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  dataAppointmentTime: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  // dataPackageHot: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // memberShipList: {
  //   loading: false,
  //   data: undefined,
  //   error: undefined,
  // },
  // refreshVideoLocal: {
  //   isRefresh: false,
  // },
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    getDetailChannel: (state, _action) => {
      state.channelDetailData.loading = true;
    },
    getDetailChannelCallback: (state, { payload: { data, error } }) => {
      const { channelDetailData } = state;
      channelDetailData.loading = false;
      channelDetailData.data = data;
      channelDetailData.error = error;
    },
    // //
    // getVideoChannel: (state, _action) => {
    //   state.channelVideos.loading = true;
    // },
    // getVideoChannelCallback: (state, { payload: { data, error } }) => {
    //   const { channelVideos } = state;
    //   channelVideos.loading = false;
    //   channelVideos.data = data;
    //   channelVideos.error = error;
    // },
    // //
    // getSerriesChannel: (state, _action) => {
    //   state.channelSerries.loading = true;
    // },
    // getSerriesChannelCallback: (state, { payload: { data, error } }) => {
    //   const { channelSerries } = state;
    //   channelSerries.loading = false;
    //   channelSerries.data = data;
    //   channelSerries.error = error;
    // },
    // //
    getListChannel: (state, _action) => {
      state.channelList.loading = true;
    },
    getListChannelCallback: (state, { payload: { data, error } }) => {
      const { channelList } = state;
      channelList.loading = false;
      channelList.data = data;
      channelList.error = error;
    },
    // //
    // getMembership: (state, _action) => {
    //   state.memberShipList.loading = true;
    // },
    // getMembershipCallback: (state, { payload: { data, error } }) => {
    //   const { memberShipList } = state;
    //   memberShipList.loading = false;
    //   memberShipList.data = data;
    //   memberShipList.error = error;
    // },
    // //updatelocal
    // getListChannelLocal: (state, _action) => {
    //   state.updateChannelListLocal.data = _action.payload;
    // },
    // //
    // resetChannel: () => initialState,
    // resetChannelSuggest: (state, _action) => {
    //   const { channelVideos } = state;
    //   channelVideos.loading = false;
    //   channelVideos.data = undefined;
    //   channelVideos.error = undefined;
    // },
    resetChannelDetail: (state, _action) => {
      const { channelDetailData } = state;
      channelDetailData.loading = false;
      channelDetailData.data = undefined;
      channelDetailData.error = undefined;
    },
    // //
    // getDetailChannelNewsFeed: (state, _action) => {
    //   state.channelDetailNewsFeed.loading = true;
    // },
    // getDetailChannelNewsFeedCallback: (state, { payload: { data, error } }) => {
    //   const { channelDetailNewsFeed } = state;
    //   channelDetailNewsFeed.loading = false;
    //   channelDetailNewsFeed.data = data;
    //   channelDetailNewsFeed.error = error;
    // },
    // //
    getDetailChannelServicesPackage: (state, _action) => {
      state.listPackageChannel.loading = true;
    },
    getDetailChannelServicesPackageCallback: (
      state,
      { payload: { data, error } },
    ) => {
      const { listPackageChannel } = state;
      listPackageChannel.loading = false;
      listPackageChannel.data = data;
      listPackageChannel.error = error;
    },
    // //
    getDetailChannelOptionServicesPackage: (state, _action) => {
      state.listOptionPackageChannel.loading = true;
    },
    getDetailChannelOptionServicesPackageCallback: (
      state,
      { payload: { data, error } },
    ) => {
      const { listOptionPackageChannel } = state;
      listOptionPackageChannel.loading = false;
      listOptionPackageChannel.data = data;
      listOptionPackageChannel.error = error;
    },
    // //
    postCreateChannelPackage: (state, _action) => {
      state.dataPackageChannel.loading = true;
    },
    postCreateChannelPackageCallback: (state, { payload: { data, error } }) => {
      const { dataPackageChannel } = state;
      dataPackageChannel.loading = false;
      dataPackageChannel.data = data;
      dataPackageChannel.error = error;
    },
    // // edit package
    postEditChannelPackage: (state, _action) => {
      state.dataEditPackageChannel.loading = true;
    },
    postEditChannelPackageCallback: (state, { payload: { data, error } }) => {
      const { dataEditPackageChannel } = state;
      dataEditPackageChannel.loading = false;
      dataEditPackageChannel.data = data;
      dataEditPackageChannel.error = error;
    },
    postBuyPackageChannel: (state, _action) => {
      state.dataBuyPackage.loading = true;
    },
    postBuyPackageChannelCallback: (state, { payload: { data, error } }) => {
      const { dataBuyPackage } = state;
      dataBuyPackage.loading = false;
      dataBuyPackage.data = data;
      dataBuyPackage.error = error;
    },
    postBuyPackageFreeChannel: (state, _action) => {
      state.dataBuyPackageFree.loading = true;
    },
    postBuyPackageFreeChannelCallback: (
      state,
      { payload: { data, error } },
    ) => {
      const { dataBuyPackageFree } = state;
      dataBuyPackageFree.loading = false;
      dataBuyPackageFree.data = data;
      dataBuyPackageFree.error = error;
    },
    postBookingChannel: (state, _action) => {
      state.dataBookingCall.loading = true;
    },
    postBookingChannelCallback: (state, { payload: { data, error } }) => {
      const { dataBookingCall } = state;
      dataBookingCall.loading = false;
      dataBookingCall.data = data;
      dataBookingCall.error = error;
    },
    updateChannel: (state, _action) => {
      state.dataUpdateChannel.loading = true;
    },
    updateChannelCallback: (state, { payload: { data, error } }) => {
      const { dataUpdateChannel } = state;
      dataUpdateChannel.loading = false;
      dataUpdateChannel.data = data;
      dataUpdateChannel.error = error;
    },
    getAppointmentTime: (state, _action) => {
      state.dataAppointmentTime.loading = true;
    },
    getAppointmentTimeCallback: (state, { payload: { data, error } }) => {
      const { dataAppointmentTime } = state;
      dataAppointmentTime.loading = false;
      dataAppointmentTime.data = data;
      dataAppointmentTime.error = error;
    },
    // //
    // getPackageHot: (state, _action) => {
    //   state.dataPackageHot.loading = true;
    // },
    // getPackageHotCallback: (state, { payload: { data, error } }) => {
    //   const { dataPackageHot } = state;
    //   dataPackageHot.loading = false;
    //   dataPackageHot.data = data;
    //   dataPackageHot.error = error;
    // },

    resetPackageChannel: state => {
      const {
        dataBuyPackage,
        dataBuyPackageFree,
        dataPackageChannel,
        // dataEditPackageChannel,
        dataUpdateChannel,
        dataBookingCall,
      } = state;
      dataPackageChannel.loading = false;
      dataPackageChannel.data = undefined;
      dataPackageChannel.error = undefined;

      dataBuyPackageFree.loading = false;
      dataBuyPackageFree.data = undefined;
      dataBuyPackageFree.error = undefined;

      dataBuyPackage.loading = false;
      dataBuyPackage.data = undefined;
      dataBuyPackage.error = undefined;

      // dataEditPackageChannel.loading = false;
      // dataEditPackageChannel.data = undefined;
      // dataEditPackageChannel.error = undefined;

      dataUpdateChannel.loading = false;
      dataUpdateChannel.data = undefined;
      dataUpdateChannel.error = undefined;

      dataBookingCall.loading = false;
      dataBookingCall.data = undefined;
      dataBookingCall.error = undefined;
    },
    // resetChannelVideo: state => {
    //   const { channelVideos } = state;
    //   channelVideos.loading = false;
    //   channelVideos.data = undefined;
    //   channelVideos.error = undefined;
    // },
    // updateVideoChannelLocal: (state, _action) => {
    //   state.refreshVideoLocal.isRefresh = _action.payload;
    // },
    resetChannelList: state => {
      const { channelList } = state;
      channelList.loading = false;
      channelList.data = undefined;
      channelList.error = undefined;
    },
  },
});

export const {
  getDetailChannel,
  getDetailChannelCallback,
  // getVideoChannel,
  // getVideoChannelCallback,
  // getSerriesChannel,
  // getSerriesChannelCallback,
  getListChannel,
  getListChannelCallback,
  // getMembership,
  // getMembershipCallback,
  // resetChannel,
  // resetChannelSuggest,
  // getListChannelLocal,
  // getDetailChannelNewsFeed,
  // getDetailChannelNewsFeedCallback,
  getDetailChannelServicesPackage,
  getDetailChannelServicesPackageCallback,
  getDetailChannelOptionServicesPackage,
  getDetailChannelOptionServicesPackageCallback,
  postCreateChannelPackage,
  postCreateChannelPackageCallback,
  postBuyPackageChannel,
  postBuyPackageChannelCallback,
  postBuyPackageFreeChannel,
  postBuyPackageFreeChannelCallback,
  postBookingChannel,
  postBookingChannelCallback,
  resetPackageChannel,
  postEditChannelPackage,
  postEditChannelPackageCallback,
  updateChannel,
  updateChannelCallback,
  getAppointmentTime,
  getAppointmentTimeCallback,
  // getPackageHot,
  // getPackageHotCallback,
  resetChannelDetail,
  // resetChannelVideo,
  // updateVideoChannelLocal,
  resetChannelList,
} = channelSlice.actions;

export default channelSlice.reducer;
