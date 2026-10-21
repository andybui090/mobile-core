import { createSlice } from '@reduxjs/toolkit';
import { responseProps } from '../types';
interface SocketState {
  socketCreatRoom: responseProps;
  socketinviteRoom: responseProps;

  socketinviteRoomLive: responseProps;

  socketmessage: any;
  socketjoinRoom: responseProps;
  socketdeleteRoom: any;
  socketleaveRoom: responseProps;
  transferRoom: responseProps;
  listMessages: responseProps;

  uploadFile: any;

  recallMess: any;

  isTyping: responseProps;
  errorSocket: responseProps;

  listFriend: responseProps;

  listRoomCreate: responseProps;
  listRoomLiveStream: responseProps;
  listRoomLiveStreamChat: responseProps;
  listRoomCreateDialogLocal: responseProps;

  removeRoom: any;

  socketUserOnline: responseProps;

  socketuserDisconnect: responseProps;

  socketuserSeenMessage: responseProps;

  socketOwnerDeleteMessage: any;

  socketPinMessage: any;

  socketAddFriends: responseProps;

  listDialogLocal: any;

  removeFriend: responseProps;

  editRoom: any;

  checkErorrRemoveRoom: any;

  botResponse: any;

  botTyping: any;

  isPlayVoiceCheck: any;

  detailRoom: responseProps,

  likeEmoji: any,

  recallEmoji: responseProps,

  getPinLocal: responseProps,

  getViewerLive: any,

  getRoomLive: responseProps,

  actionEmoji: responseProps,

  liveContinue: any,

  liveEnd: any,

  liveVodReady: any,

  rotatePlay: any,

  orientationPlay: any,

  localVolumeLive: any,

  updateLocalListRoomChat: any,

  getRoomIslive: any,

  getRoomIsliveTitle: any,

  dataEndRoomChat: any,

  dataFirstRoomChat: any;
}
const initialState: SocketState = {
  socketCreatRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  socketinviteRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  socketinviteRoomLive: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  socketmessage: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  socketjoinRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  socketleaveRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  socketdeleteRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  listMessages: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  transferRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  isTyping: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  uploadFile: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  errorSocket: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  listFriend: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  recallMess: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  listRoomCreate: {
    loading: false,
    data: undefined,
    error: undefined,
  },


  listRoomLiveStream: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  listRoomLiveStreamChat: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  listRoomCreateDialogLocal: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  removeRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  removeFriend: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  socketUserOnline: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  socketuserDisconnect: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  socketuserSeenMessage: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  socketOwnerDeleteMessage: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  socketPinMessage: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  socketAddFriends: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  editRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  checkErorrRemoveRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  botResponse: {
    avatar: undefined,
    clientMsgId: undefined,
    content: undefined,
    from: undefined,
    full_name: undefined,
    id: undefined,
    reply_id: undefined,
    resources: undefined,
    room_id: undefined
  },

  botTyping: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  detailRoom: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  isPlayVoiceCheck: false,

  listDialogLocal: [],

  likeEmoji: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  recallEmoji: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  getPinLocal: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  getViewerLive: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  getRoomLive: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  actionEmoji: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  liveContinue: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  liveEnd: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  liveVodReady: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  rotatePlay: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  orientationPlay: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  localVolumeLive: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  updateLocalListRoomChat: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  getRoomIslive: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  getRoomIsliveTitle: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  dataEndRoomChat: {
    loading: false,
    data: undefined,
    error: undefined,
  },

  dataFirstRoomChat: {
    roomId: null
  },
};

const socketioSlice = createSlice({
  name: 'socketio',
  initialState,
  reducers: {
    socketCreatRoom: (state, _action) => {
      state.socketCreatRoom.loading = false;
      state.socketCreatRoom.data = _action.payload;
    },
    socketinviteRoom: (state, _action) => {
      state.socketinviteRoom.data = _action.payload;
    },
    socketinviteRoomLive: (state, _action) => {
      state.socketinviteRoomLive.data = _action.payload;
    },
    socketmessage: (state, _action) => {
      state.socketmessage.data = _action.payload;
    },
    socketjoinRoom: (state, _action) => {
      state.socketjoinRoom.data = _action.payload;
    },
    socketdeleteRoom: (state, _action) => {
      state.socketdeleteRoom.data = _action.payload;
    },
    socketleaveRoom: (state, _action) => {
      state.socketleaveRoom.data = _action.payload;
    },

    listMessagesLocal: (state, _action) => {
      state.listMessages.data = _action.payload;
    },

    transferRoom: (state, _action) => {
      state.transferRoom.data = _action.payload;
    },

    isTyping: (state, _action) => {
      state.isTyping.data = _action.payload;
    },

    uploadFile: (state, _action) => {
      state.uploadFile.data = _action.payload;
    },

    errorSocket: (state, _action) => {
      state.errorSocket.data = _action.payload;
    },

    resetMessages: (state, _action) => {
      state.socketmessage.data = undefined
      state.socketCreatRoom.data = undefined
      state.removeRoom.data = undefined
      state.removeFriend.data = undefined
      state.socketuserSeenMessage.data = undefined
      state.socketdeleteRoom.data = undefined
      state.socketPinMessage.data = undefined
      state.editRoom.data = undefined
    },

    resetTransferRoom: (state, _action) => {
      state.transferRoom.data = undefined;
      state.isTyping.data = undefined;
    },

    listFriends: (state, _action) => {
      state.listFriend.data = _action.payload;
    },

    recallMess: (state, _action) => {
      state.recallMess.data = _action.payload;
    },
    listRoomCreateLoading: (state, _action) => {
      state.listRoomCreate.loading = true;
    },
    listRoomCreate: (state, _action) => {
      state.listRoomCreate.loading = false;
      state.listRoomCreate.data = _action.payload || [];
    },

    listRoomLiveStream: (state, _action) => {
      state.listRoomLiveStream.data = _action.payload;
    },

    listRoomLiveStreamChat: (state, _action) => {
      state.listRoomLiveStreamChat.data = _action.payload;
    },

    listRoomCreateDialogLocal: (state, _action) => {
      state.listRoomCreateDialogLocal.data = _action.payload;
    },

    resetlistRoom: (state, _action) => {
      state.listRoomCreate.data = undefined;
      state.listRoomLiveStream.data = undefined;
      state.listRoomLiveStreamChat.data = undefined;
    },

    removeRoom: (state, _action) => {
      state.removeRoom.data = _action.payload;
    },

    removeFriend: (state, _action) => {
      state.removeFriend.data = _action.payload;
    },

    socketUserOnline: (state, _action) => {
      state.socketUserOnline.data = _action.payload;
    },

    socketuserDisconnect: (state, _action) => {
      state.socketuserDisconnect.data = _action.payload;
    },

    resetUserDisconnect: (state, _action) => {
      state.socketuserDisconnect.data = undefined;
    },

    socketuserSeenMessage: (state, _action) => {
      state.socketuserSeenMessage.data = _action.payload;
    },

    socketOwnerDeleteMessage: (state, _action) => {
      state.socketOwnerDeleteMessage.data = _action.payload;
    },

    socketPinMessage: (state, _action) => {
      state.socketPinMessage.data = _action.payload;
    },

    socketAddFriends: (state, _action) => {
      state.socketAddFriends.data = _action.payload;
    },

    resetPinMessage: (state, _action) => {
      state.socketPinMessage.data = undefined;
    },


    listDialogLocalMsg: (state, _action) => {
      state.listDialogLocal = _action.payload;
    },

    editRoom: (state, _action) => {
      state.editRoom = _action.payload;
    },

    checkErorrRemoveRoom: (state, _action) => {
      state.checkErorrRemoveRoom.data = _action.payload;
      state.checkErorrRemoveRoom.error = _action.payload;
    },

    resetCheckErorrRemoveRoom: (state, _action) => {
      const { checkErorrRemoveRoom } = state;
      checkErorrRemoveRoom.loading = false;
      checkErorrRemoveRoom.data = undefined;
      checkErorrRemoveRoom.error = undefined;
    },

    botResponse: (state, _action) => {
      state.botResponse = _action.payload
    },

    botTyping: (state, _action) => {
      state.botTyping.data = _action.payload;
    },

    detailRoom: (state, _action) => {
      state.detailRoom.data = _action.payload;
    },

    isPlayVoice: (state, _action) => {
      state.isPlayVoiceCheck = _action.payload;
    },

    resetbotTyping: (state, _action) => {
      state.botTyping.data = undefined;
      state.isTyping.data = undefined;
    },

    resetRoomDetal: (state, _action) => {
      state.detailRoom.data = undefined;
    },

    likeEmoji: (state, _action) => {
      state.likeEmoji.data = _action.payload;
    },

    recallEmoji: (state, _action) => {
      state.recallEmoji.data = _action.payload;
    },

    getPinLocal: (state, _action) => {
      state.getPinLocal.data = _action.payload;
    },

    getViewerLive: (state, _action) => {
      state.getViewerLive.data = _action.payload;
    },

    getRoomLive: (state, _action) => {
      state.getRoomLive.data = _action.payload;
    },

    actionEmoji: (state, _action) => {
      state.actionEmoji.data = _action.payload;
    },

    resetActionEmoji: (state, _action) => {
      state.actionEmoji.data = undefined;
    },

    resetPinLocal: (state, _action) => {
      state.getPinLocal.data = undefined;
    },

    resetSocketjoinRoom: (state, _action) => {
      state.socketjoinRoom.data = undefined
      state.getViewerLive.data = undefined
      state.getRoomLive.data = undefined
      state.actionEmoji.data = undefined
      state.liveEnd.data = undefined
      state.liveContinue.data = undefined
    },

    resetlistRoomLiveStream: (state, _action) => {
      state.listRoomLiveStream.data = undefined;
      state.removeRoom.data = undefined;
    },

    liveContinue: (state, _action) => {
      state.liveContinue.data = _action.payload
    },

    liveEnd: (state, _action) => {
      state.liveEnd.data = _action.payload
    },

    liveVodReady: (state, _action) => {
      state.liveVodReady.data = _action.payload
    },

    getrotatePlay: (state, _action) => {
      state.rotatePlay.data = _action.payload
    },

    orientationPlay: (state, _action) => {
      state.orientationPlay.data = _action.payload
    },

    resetRotatePlay: (state, _action) => {
      state.rotatePlay.data = undefined
    },

    localVolumeLive: (state, _action) => {
      state.localVolumeLive.data = undefined
    },

    updateLocalListRoomChat: (state, _action) => {
      state.updateLocalListRoomChat.data = _action.payload
    },

    getRoomIslive: (state, _action) => {
      state.getRoomIslive.data = _action.payload
    },

    getRoomIsliveTitle: (state, _action) => {
      state.getRoomIsliveTitle.data = _action.payload
    },

    resetLocalListRoomChat: (state, _action) => {
      state.updateLocalListRoomChat.data = undefined
    },

    resetGetRoomIslive: (state, _action) => {
      state.getRoomIslive.data = undefined
    },
    endRoomChat: (state, _action) => {
      state.dataEndRoomChat = _action.payload;
    },
    updateLocalChatFirstTime: (state, _action) => {
      state.dataFirstRoomChat = _action.payload;
    },
  },
});

export const {
  socketCreatRoom,
  socketinviteRoom,
  socketinviteRoomLive,
  socketmessage,
  socketjoinRoom,
  socketdeleteRoom,
  socketleaveRoom,
  resetMessages,
  listMessagesLocal,
  transferRoom,
  isTyping,
  errorSocket,
  resetTransferRoom,
  listFriends,
  uploadFile,
  recallMess,
  listRoomCreateLoading,
  listRoomCreate,
  listRoomLiveStream,
  listRoomLiveStreamChat,
  listRoomCreateDialogLocal,
  resetlistRoom,
  removeRoom,
  removeFriend,
  socketUserOnline,
  socketuserDisconnect,
  socketuserSeenMessage,
  socketOwnerDeleteMessage,
  socketPinMessage,
  socketAddFriends,
  resetPinMessage,
  listDialogLocalMsg,
  editRoom,
  resetUserDisconnect,
  checkErorrRemoveRoom,
  resetCheckErorrRemoveRoom,
  botResponse,
  botTyping,
  isPlayVoice,
  resetbotTyping,
  detailRoom,
  resetRoomDetal,
  likeEmoji,
  recallEmoji,
  getPinLocal,
  resetPinLocal,
  getViewerLive,
  getRoomLive,
  resetSocketjoinRoom,
  resetlistRoomLiveStream,
  actionEmoji,
  liveContinue,
  liveEnd,
  liveVodReady,
  getrotatePlay,
  orientationPlay,
  resetRotatePlay,
  resetActionEmoji,
  localVolumeLive,
  updateLocalListRoomChat,
  resetLocalListRoomChat,
  getRoomIslive,
  getRoomIsliveTitle,
  resetGetRoomIslive,
  endRoomChat,
  updateLocalChatFirstTime,
} = socketioSlice.actions;

export default socketioSlice.reducer;