import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';
import { STORAGEKEY } from '@/constants';
import { storeObjectData } from '@/storages';

interface CommunityState {
  listRooms: responseProps;
  listFriends: responseProps;
  listHistoryChat: responseProps;
  listMemberGroup: responseProps;
  listMemberGroupChat: responseProps;
  postMessageSeen: responseProps;
  getRequestFriend: responseProps;
  getRequestFriendInvited: responseProps;
  getRequestFriendWaiting: responseProps;
  getSearchListFriend: responseProps;
  appBgChat: any;
  listEmoji: responseProps;
  listBackground: any;
  createBackground: any;
  listTypeRoom: responseProps;
  currentToChatInfo: any;
  dataCompleteChatPremium: responseProps;
}

const initialState: CommunityState = {
  listRooms: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  listFriends: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  listHistoryChat: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  listMemberGroup: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  listMemberGroupChat: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  postMessageSeen: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  getRequestFriend: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  getRequestFriendInvited: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  getRequestFriendWaiting: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  getSearchListFriend: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  appBgChat: {
    id: 1,
    path: '',
    bgLeftColor: '#EAECF0',
    bgRightColor: '#D0F0FF',
    txtLeftColor: '#101828',
    txtRightColor: '#101828',
    inviteLeft: '#EAECF0',
    inviteRight: '#81bcd6',
  },
  listEmoji: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  listTypeRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  listBackground: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  createBackground: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  currentToChatInfo: {
    roomChatId: '',
    userToId: '',
    userToAvatar: '',
    sayHello: '',
  },
  dataCompleteChatPremium: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    //get list rooms
    getListRooms: (state, payload) => {
      state.listRooms.loading = true;
    },
    getListRoomsCallback: (state, { payload: { data, error } }) => {
      const { listRooms } = state;
      listRooms.loading = false;
      listRooms.data = data;
      listRooms.error = error;
    },
    //get list friend
    getListFriends: (state, payload) => {
      state.listFriends.loading = true;
    },
    getListFriendsCallback: (state, { payload: { data, error } }) => {
      const { listFriends } = state;
      listFriends.loading = false;
      listFriends.data = data;
      listFriends.error = error;
    },
    //get list historyChat
    getListHistoryChat: (state, payload) => {
      state.listHistoryChat.loading = true;
    },
    getListHistoryChatCallback: (state, { payload: { data, error } }) => {
      const { listHistoryChat } = state;
      listHistoryChat.loading = false;
      listHistoryChat.data = data;
      listHistoryChat.error = error;
    },
    //get list memberGroup
    getListMemberGroup: (state, payload) => {
      state.listMemberGroup.loading = true;
    },
    getListMemberGroupCallback: (state, { payload: { data, error } }) => {
      const { listMemberGroup } = state;
      listMemberGroup.loading = false;
      listMemberGroup.data = data;
      listMemberGroup.error = error;
    },

    //get list memberGroup Chat
    getListMemberGroupChat: (state, payload) => {
      state.listMemberGroupChat.loading = true;
    },
    getListMemberGroupCallbackChat: (state, { payload: { data, error } }) => {
      const { listMemberGroupChat } = state;
      listMemberGroupChat.loading = false;
      listMemberGroupChat.data = data;
      listMemberGroupChat.error = error;
    },

    //post message seen
    postMessageSeen: (state, payload) => {
      state.postMessageSeen.loading = true;
    },
    postMessageSeenCallback: (state, { payload: { data, error } }) => {
      const { postMessageSeen } = state;
      postMessageSeen.loading = false;
      postMessageSeen.data = data;
      postMessageSeen.error = error;
    },
    //get request friends
    getRequestFriends: (state, payload) => {
      state.getRequestFriend.loading = true;
    },
    getRequestFriendsCallback: (state, { payload: { data, error } }) => {
      const { getRequestFriend } = state;
      getRequestFriend.loading = false;
      getRequestFriend.data = data;
      getRequestFriend.error = error;
    },
    //get request friends invited
    getRequestFriendInviteds: (state, payload) => {
      state.getRequestFriendInvited.loading = true;
    },
    getRequestFriendInvitedCallback: (state, { payload: { data, error } }) => {
      const { getRequestFriendInvited } = state;
      getRequestFriendInvited.loading = false;
      getRequestFriendInvited.data = data;
      getRequestFriendInvited.error = error;
    },
    //get request friends waiting
    getRequestFriendWaitings: (state, payload) => {
      state.getRequestFriendWaiting.loading = true;
    },
    getRequestFriendWaitingsCallback: (state, { payload: { data, error } }) => {
      const { getRequestFriendWaiting } = state;
      getRequestFriendWaiting.loading = false;
      getRequestFriendWaiting.data = data;
      getRequestFriendWaiting.error = error;
    },
    //get search friends
    getSearchFriend: (state, payload) => {
      state.getSearchListFriend.loading = true;
    },
    getSearchFriendCallback: (state, { payload: { data, error } }) => {
      const { getSearchListFriend } = state;
      getSearchListFriend.loading = false;
      getSearchListFriend.data = data;
      getSearchListFriend.error = error;
    },
    //reset list Historychat
    resetHistoryChat: (state, _action) => {
      const { listHistoryChat } = state;
      listHistoryChat.loading = false;
      listHistoryChat.data = undefined;
      listHistoryChat.error = undefined;
    },
    setAppChatBg: (state, action) => {
      if (action.payload) {
        // console.log("🚀 ~ action.payload:", action.payload)
        state.appBgChat = action.payload;
        storeObjectData(STORAGEKEY.APP_BG_CHAT, action.payload);
      }
    },

    //get list emoji
    getListEmoji: (state, payload) => {
      state.listEmoji.loading = true;
    },
    getListEmojiCallback: (state, { payload: { data, error } }) => {
      const { listEmoji } = state;
      listEmoji.loading = false;
      listEmoji.data = data;
      listEmoji.error = error;
    },

    //get list type room
    getListTypeRoom: (state, payload) => {
      state.listTypeRoom.loading = true;
    },
    getListTypeRoomCallback: (state, { payload: { data, error } }) => {
      const { listTypeRoom } = state;
      listTypeRoom.loading = false;
      listTypeRoom.data = data;
      listTypeRoom.error = error;
    },

    //get list background
    getListBackground: (state, payload) => {
      state.listBackground.loading = true;
    },
    getListBackgroundCallback: (state, { payload: { data, error } }) => {
      const { listBackground } = state;
      listBackground.loading = false;
      listBackground.data = data;
      listBackground.error = error;
    },

    //create background
    getCreateBackground: (state, payload) => {
      state.createBackground.loading = true;
    },
    getCreateBackgroundCallback: (state, { payload: { data, error } }) => {
      const { createBackground } = state;
      createBackground.loading = false;
      createBackground.data = data;
      createBackground.error = error;
    },
    // mark complete chat premium
    markCompleteChat: (state, payload) => {
      state.dataCompleteChatPremium.loading = true;
    },
    markCompleteChatCallback: (state, { payload: { data, error } }) => {
      const { dataCompleteChatPremium } = state;
      dataCompleteChatPremium.loading = false;
      dataCompleteChatPremium.data = data;
      dataCompleteChatPremium.error = error;
    },
    //reset list Historychat
    resetDataUpdateChat: (state, _action) => {
      const { dataCompleteChatPremium } = state;
      dataCompleteChatPremium.loading = false;
      dataCompleteChatPremium.data = undefined;
      dataCompleteChatPremium.error = undefined;
    },
    updateCurrentToChatInfo: (state, _action) => {
      state.currentToChatInfo = _action.payload;
    },
  },
});

export const {
  getListRooms,
  getListRoomsCallback,
  getListFriends,
  getListFriendsCallback,
  getListHistoryChat,
  getListHistoryChatCallback,
  getListMemberGroup,
  getListMemberGroupCallback,
  getListMemberGroupChat,
  getListMemberGroupCallbackChat,
  postMessageSeen,
  postMessageSeenCallback,
  resetHistoryChat,
  getRequestFriends,
  getRequestFriendsCallback,
  getRequestFriendInviteds,
  getRequestFriendInvitedCallback,
  getRequestFriendWaitings,
  getRequestFriendWaitingsCallback,
  getSearchFriend,
  getSearchFriendCallback,
  setAppChatBg,
  getListEmoji,
  getListEmojiCallback,
  getListBackground,
  getListBackgroundCallback,
  getCreateBackground,
  getCreateBackgroundCallback,
  getListTypeRoom,
  getListTypeRoomCallback,
  updateCurrentToChatInfo,
  markCompleteChat,
  markCompleteChatCallback,
  resetDataUpdateChat,
} = communitySlice.actions;

export default communitySlice.reducer;
