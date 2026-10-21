import {getDeviceId} from '@/configs';
import {STORAGEKEY} from '@/constants';
// import deeplinkService from '@/DeeplinkService';
import {
  checkRoomPrivate,
  reloadConnectSocket,
} from '@/redux/slices/globalSlice';
import {
  getProfile, 
  // refreshPackageAfter
} from '@/redux/slices/profileSlice';
import {
  actionEmoji,
  botResponse,
  botTyping,
  checkErorrRemoveRoom,
  detailRoom,
  editRoom,
  errorSocket,
  getRoomLive,
  getViewerLive,
  isTyping,
  likeEmoji,
  listRoomCreate,
  listRoomLiveStream,
  listRoomLiveStreamChat,
  liveContinue,
  liveEnd,
  liveVodReady,
  recallEmoji,
  recallMess,
  removeFriend,
  removeRoom,
  socketAddFriends,
  socketCreatRoom,
  listRoomCreateLoading,
  socketdeleteRoom,
  socketinviteRoom,
  socketinviteRoomLive,
  socketjoinRoom,
  socketleaveRoom,
  socketmessage,
  socketOwnerDeleteMessage,
  socketPinMessage,
  socketuserDisconnect,
  socketUserOnline,
  socketuserSeenMessage,
  transferRoom,
  uploadFile,
  endRoomChat,
} from '@/redux/slices/socketioSlice';
import {store} from '@/redux/store';
import ApiService from '@/services/api-base';
import {storeObjectData} from '@/storages';
import {DefaultEventsMap} from '@socket.io/component-emitter';
import Config from 'react-native-config';
import {io, Socket} from 'socket.io-client';

var socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
var currentOrderId: any = null;
var currentExpiredChat: any = false;
class Socketio {
  isConnected() {
    return socket?.connected;
  }

  async connect() {
    if (socket?.connected) {
      console.log('------ socket.connected');
      return;
    } else {
      const deviceId = await getDeviceId();
      const jwtToken = ApiService.getAuthorizationHeader();
      // this.socket = io('ws://42.96.44.24:9017', {
      socket = io(Config.SOCKET_LINK as string, {
        transports: ['websocket'],
        extraHeaders: {
          Authorization: jwtToken,
          deviceId: deviceId,
        },
      });
      //   socket = io('ws://42.96.45.86:9107', {
      //     transports: ['websocket'],
      //     extraHeaders: {
      //         Authorization: jwtToken,
      //         deviceId: deviceId,
      //     }
      // });
      socket?.connect();
      this.listenEvent();
    }
  }

  listenEvent() {
    socket?.on('connect', () => {
      console.log('====Connect SocketIo====');
      store.dispatch(errorSocket('Connect SocketIo'));
      store.dispatch(reloadConnectSocket('true'));
      // deeplinkService.redirectScreen();
    });

    socket?.on('users', async (data: any) => {
      // console.log('user-online', data);
      store.dispatch(socketUserOnline(data));
      storeObjectData(STORAGEKEY.CHECK_ONL, {
        items: data.users,
      });
    });

    socket?.on('userDisconnect', async (data: any) => {
      store.dispatch(socketuserDisconnect(data));
      storeObjectData(STORAGEKEY.CHECK_DISONL, {
        items: data.disconnects,
      });
    });

    socket?.on('disconnect', () => {
      console.log('====Disconnect SocketIo====');
    });

    socket?.on('connect_error', (err: any) => {
      console.log(err.message);
    });

    socket?.on('errors', (err: any) => {
      console.log('====errors=====', err);
      store.dispatch(checkErorrRemoveRoom(err));
    });

    socket?.on('createRoom', (data: any) => {
      console.log('createRoom', data);
      store.dispatch(socketCreatRoom(data));
      // lan dau tien tao room chat premium
      if (
        data.type == '1-1' &&
        data.is_premium == 1 &&
        data.first != data.room_id
      ) {
        if (currentOrderId) {
          console.log(
            '🚀 ~ Socketio ~ this.currentOrderId:',
            currentOrderId,
            currentExpiredChat,
          );
          // Khong goi update neu ramain call da ve so 0, tranh truong hop sai
          if (!currentExpiredChat) {
            ApiService.updateRemainCallChat({
              id: currentOrderId,
              type: 'chat', // call | chat
            })
              .then((res: any) => {
                console.log(
                  '🚀 ~ Socketio ~ listenEvent ~ update remain call chat:',
                  res,
                );
                if (res?.status?.toString() === '200') {
                  store.dispatch(getProfile(null));

                  // cập nhật lại danh sách package
                  // store.dispatch(refreshPackageAfter({isRefresh: true}));
                }
              })
              .catch((error: any) => {
                console.log('🚀 ~ updateRemainCallChat error:', error);
              });
          }
          currentExpiredChat = false;
          currentOrderId = null;
        }
      }
    });

    socket?.on('joinRoom', (data: any) => {
      console.log('joinRoom', data);
      store.dispatch(socketjoinRoom(data));
    });

    socket?.on('leaveRoom', (data: any) => {
      console.log('leaveRoom', data);
      store.dispatch(socketleaveRoom(data));
    });

    socket?.on('inviteRoom', async (data: any) => {
      console.log('inviteRoom', data);
      if (data.media === 'livestream') {
        store.dispatch(socketinviteRoomLive(data));
      } else {
        store.dispatch(socketinviteRoom(data));
      }
    });

    socket?.on('message', async (data: any) => {
      console.log('message', data);
      store.dispatch(socketmessage(data));
      await storeObjectData(STORAGEKEY.LIST_MESSAGES, {
        items: data,
      });
    });

    socket?.on('deleteMessage', async (data: any) => {
      console.log('deleteMessage', data);
      store.dispatch(socketOwnerDeleteMessage(data));
      await storeObjectData(STORAGEKEY.LIST_MESSAGES, {
        items: data,
      });
    });

    socket?.on('recallMessage', async (data: any) => {
      console.log('recallMessage', data);
      store.dispatch(recallMess(data));
      await storeObjectData(STORAGEKEY.LIST_MESSAGES, {
        items: data,
      });
    });

    socket?.on('upload', (data: any) => {
      console.log('upload', data);
      store.dispatch(uploadFile(data));
    });

    socket?.on('deleteRoom', (data: any) => {
      console.log('room:delete', data);
      store.dispatch(socketdeleteRoom(data));
    });

    socket?.on('transferRoom', async (data: any) => {
      console.log('room:transfer', data);
      store.dispatch(transferRoom(data));
    });

    socket?.on('typing', (data: any) => {
      store.dispatch(isTyping(data));
    });

    socket?.on('upload', (data: any) => {
      console.log('upload', data);
      store.dispatch(uploadFile(data));
    });

    socket?.on('listRoom', (data: any) => {
      if (data.total > 0) {
        if (data?.items[0]?.media === 'livestream') {
          store.dispatch(listRoomLiveStream(data));
        } else if (data?.items[0]?.media === 'livechat') {
          store.dispatch(listRoomLiveStreamChat(data));
        } else {
          store.dispatch(listRoomCreate(data));
        }
      } else if (data?.result?.total == 0 || data?.total == 0) {
        store.dispatch(listRoomLiveStream(null));
        store.dispatch(listRoomCreate(null));
      }
    });

    socket?.on('removeRoom', (data: any) => {
      console.log('removeRoom', data);
      store.dispatch(removeRoom(data));
    });

    socket?.on('rejoinRoom', (data: any) => {
      // console.log('rejoinRoom', data);
    });

    socket?.on('seenMessage', (data: any) => {
      console.log('seenMessage', data);
      store.dispatch(socketuserSeenMessage(data));
    });

    socket?.on('pinMessage', (data: any) => {
      console.log('pinMessage', data);
      store.dispatch(socketPinMessage(data));
    });

    socket?.on('requestFriend', (data: any) => {
      console.log('requestFriend', data);
      store.dispatch(socketAddFriends(data));
    });

    socket?.on('statusFriend', (data: any) => {
      console.log('statusFriend', data);
      store.dispatch(socketAddFriends(data));
    });

    socket?.on('deleteFriend', (data: any) => {
      console.log('deleteFriend', data);
      store.dispatch(socketAddFriends(data));
    });

    socket?.on('removeFriend', (data: any) => {
      console.log('removeFriend', data);
      store.dispatch(removeFriend(data));
    });

    socket?.on('editRoom', (data: any) => {
      console.log('editRoom', data);
      store.dispatch(editRoom(data));
    });

    socket?.on('botResponse', (data: any) => {
      console.log('botResponse', data);
      store.dispatch(botResponse(data));
    });

    socket?.on('botTyping', (data: any) => {
      console.log('botTyping', data);
      store.dispatch(botTyping(data));
    });

    socket?.on('detailRoom', (data: any) => {
      console.log('======= socket detailRoom======', data);
      store.dispatch(detailRoom(data));
    });

    socket?.on('shareRoom', (data: any) => {
      console.log('shareRoom', data);
    });

    socket?.on('emotion', (data: any) => {
      store.dispatch(likeEmoji(data));
      console.log('emotion', data);
    });

    socket?.on('recallEmotion', (data: any) => {
      console.log('recallEmotion', data);
      store.dispatch(recallEmoji(data));
    });

    socket?.on('livestreamRoom', (data: any) => {
      console.log('livestreamRoom', data);
      store.dispatch(getViewerLive(data));
    });

    socket?.on('liveRoom', (data: any) => {
      console.log('liveRoom', data);
      store.dispatch(getRoomLive(data));
    });

    socket?.on('actionRoom', (data: any) => {
      console.log('actionRoom', data);
      store.dispatch(actionEmoji(data));
    });

    socket?.on('liveStreamStarted', (data: any) => {
      console.log('liveStreamStarted', data);
      store.dispatch(liveContinue(data));
    });

    socket?.on('liveStreamEnded', (data: any) => {
      console.log('liveStreamEnded', data);
      store.dispatch(liveEnd(data));
    });

    socket?.on('vodReady', (data: any) => {
      console.log('vodReady', data);
      store.dispatch(liveVodReady(data));
    });

    socket?.on('memberRoom', (data: any) => {
      console.log('memberRoom', data);
    });

    socket?.on('endRoom', (data: any) => {
      console.log('endRoom', data);
      store.dispatch(endRoomChat(data));
    });
  }

  disconnect() {
    store.dispatch(reloadConnectSocket('false'));
    store.dispatch(checkRoomPrivate(''));
    socket?.disconnect();
  }

  //tao nhom chat 1-1
  emitCreateSocketUser(
    title: any,
    user: any,
    media?: any,
    isPremium?: any,
    is_chat?: any,
    packageId?: any,
    orderId?: any,
    expiredChat?: any,
  ) {
    try {
      //is_chat = 1;
      let _data: any = {
        title: title,
        to: user,
      };
      if (media) {
        _data.media = media;
      }
      if (isPremium === 1) {
        _data.is_premium = 1;
      }
      if (is_chat === 1) {
        _data.is_chat = 1;
      }
      if (packageId) {
        _data.package_id = packageId;
      }
      if (orderId) {
        // _data.order_id = orderId;
        currentOrderId = orderId;
      }
      if (expiredChat) {
        currentExpiredChat = expiredChat;
      }
      socket?.emit('room:create', _data);
      // console.log("🚀11111111 orderId", orderId);
      console.log('🚀11111111', _data);
    } catch (error) {
      console.log('emitCreateSocketUser =====error', error);
    }
  }

  //tao nhom chat group co anh dai dien
  emitCreateSocketGroup(
    title: any,
    user: any,
    filename: any,
    image64: any,
    checkPrivate: any,
    is_record: any,
    isShow?: any,
    media?: any,
    isShowUser?: any,
    isName?: any,
    isPush?: any,
    room_id?: any,
    isPremium?: any,
  ) {
    let _data: any = {
      title: title,
      thumbnail: {
        filename: filename,
        data: image64,
      },
      private: checkPrivate,
      is_record: is_record,
    };
    if (user !== '') {
      _data.to = user;
    }
    if (isShow == 0 || isShow == 1) {
      _data.is_show = isShow;
    }
    if (media) {
      _data.media = media;
    }
    if (isShowUser == 0 || isShowUser == 1) {
      _data.is_chat = isShowUser;
    }
    if (isName == 0 || isName == 1) {
      _data.is_name = isName;
    }
    if (isPush == 0 || isPush == 1) {
      _data.is_push = isPush;
    }
    if (room_id !== '') {
      _data.room_id = room_id;
    }
    if (isPremium == 0 || isPremium == 1) {
      _data.is_premium = isPremium;
    }
    socket?.emit('room:create', _data);
    console.log('🚀2222222:', _data);
  }

  //tao nhom chat live stream
  emitCreateSocketLiveStream(title: any, user: any, checkPrivate: any) {
    socket?.emit('room:create', {
      title: title,
      to: user,
      private: checkPrivate,
      is_show: 0,
      media: 'livestream',
    });
  }

  //tao nhom chat group khong anh
  emitCreateSocketGroupNoImage(
    title: any,
    user: any,
    checkPrivate: any,
    is_record: any,
    isShow?: any,
    media?: any,
    isShowUser?: any,
    isName?: any,
    isPush?: any,
    room_id?: any,
    isPremium?: any,
  ) {
    let _data: any = {
      title: title,
      private: checkPrivate,
      is_record: is_record,
    };
    if (user !== '') {
      _data.to = user;
    }
    if (isShow == 0 || isShow == 1) {
      _data.is_show = isShow;
    }
    if (media) {
      _data.media = media;
    }
    if (isShowUser == 0 || isShowUser == 1) {
      _data.is_chat = isShowUser;
    }
    if (isName == 0 || isName == 1) {
      _data.is_name = isName;
    }
    if (isPush == 0 || isPush == 1) {
      _data.is_push = isPush;
    }
    if (room_id !== '') {
      _data.room_id = room_id;
    }
    if (isPremium == 0 || isPremium == 1) {
      _data.is_premium = isPremium;
    }
    socket?.emit('room:create', _data);
    console.log('🚀33333333', _data);
  }

  //tao nhom chat group co anh dai dien rieng tu
  emitCreateSocketGroupPrivate(
    title: any,
    filename: any,
    image64: any,
    is_record: any,
    isShow?: any,
    media?: any,
    isShowUser?: any,
    isName?: any,
    isPush?: any,
    isPremium?: any,
  ) {
    let _data: any = {
      title: title,
      thumbnail: {
        filename: filename,
        data: image64,
      },
      private: false,
      is_record: is_record,
    };
    if (isShow == 0 || isShow == 1) {
      _data.is_show = isShow;
    }
    if (media) {
      _data.media = media;
    }
    if (isShowUser == 0 || isShowUser == 1) {
      _data.is_chat = isShowUser;
    }
    if (isName == 0 || isName == 1) {
      _data.is_name = isName;
    }
    if (isPush == 0 || isPush == 1) {
      _data.is_push = isPush;
    }
    if (isPremium == 0 || isPremium == 1) {
      _data.is_premium = isPremium;
    }
    console.log('🚀 44444', _data);
    socket?.emit('room:create', _data);
  }

  //tao nhom chat group khong anh rieng tu
  emitCreateSocketGroupNoImagePrivate(
    title: any,
    is_record: any,
    isShow: any,
    media?: any,
    isShowUser?: any,
    isName?: any,
    isPush?: any,
    isPremium?: any,
  ) {
    let _data: any = {
      title: title,
      private: false,
      is_record: is_record,
    };
    if (isShow == 0 || isShow == 1) {
      _data.is_show = isShow;
    }
    if (media) {
      _data.media = media;
    }
    if (isShowUser == 0 || isShowUser == 1) {
      _data.is_chat = isShowUser;
    }
    if (isName == 0 || isName == 1) {
      _data.is_name = isName;
    }
    if (isPush == 0 || isPush == 1) {
      _data.is_push = isPush;
    }
    if (isPremium == 0 || isPremium == 1) {
      _data.is_premium = isPremium;
    }
    socket?.emit('room:create', _data);
  }

  //tao nhom chat group khong anh rieng tu
  emitCreateSocketGroupNoImagePrivateChat(
    title: any,
    user: any,
    room_id: any,
    isPush?: any,
  ) {
    console.log('🚀 ~ emitCreateSocketGroupNoImagePrivateChat ~ user:', user);
    let _data: any = {
      title: title,
      to: user,
      private: true,
      is_record: 1,
      media: 'livechat',
      is_chat: 0,
      room_id: room_id,
    };
    if (isPush == 0 || isPush == 1) {
      _data.is_push = isPush;
    }
    socket?.emit('room:create', _data);
  }

  //chap nhan / tu choi tham gia group
  emitJoinSocket(id: any, status: any) {
    socket?.emit('room:join', {room: id, status: status});
  }

  //chap nhan auto / tu choi tham gia group auto
  emitJoinSocketAuto(id: any, status: any) {
    socket?.emit('room:join', {room: id, status: status, autojoin: true});
  }

  //roi khoi chat
  emitLeaveSocket(id: any) {
    socket?.emit('room:leave', {room: id});
    console.log('roome leave');
  }

  //send messages 1-1
  emitMessageSocketUser(
    content: any,
    type: any,
    room: any,
    userId: any,
    clientMsgId: any,
  ) {
    // console.log("🚀 ~ Socketio ~ emitMessageSocketUser ~ content:",
    //     content, type, room, userId, clientMsgId);
    socket?.emit('message', {
      content: content,
      type: type,
      room: room,
      to: userId,
      clientMsgId: clientMsgId,
    });
    console.log(room, type, content, userId);
  }

  //send messages group
  emitMessageSocketGroup(
    content: any,
    type: any,
    room: any,
    clientMsgId: any,
    context?: any,
  ) {
    let _data: any = {
      content: content,
      type: type,
      room: room,
      clientMsgId: clientMsgId,
    };
    if (context) {
      _data.context = context;
    }
    socket?.emit('message', _data);
    console.log('emitMessageSocketGroup', _data);
  }

  //send messages Image 1-1
  emitMessageSocketImage(
    content: any,
    type: any,
    room: any,
    userId: any,
    clientMsgId: any,
  ) {
    socket?.emit('message', {
      content: JSON.stringify(content),
      type: type,
      room: room,
      to: userId,
      clientMsgId: clientMsgId,
    });
    console.log('=== send image 1-1 ===');
  }

  //send messages Image in group
  emitMessageSocketGroupImage(
    content: any,
    type: any,
    room: any,
    clientMsgId: any,
  ) {
    socket?.emit('message', {
      content: JSON.stringify(content),
      type: type,
      room: room,
      clientMsgId: clientMsgId,
    });
    console.log('=== send image group ===');
  }

  //send messages Video 1-1
  emitMessageSocketVideo(
    content: any,
    type: any,
    room: any,
    userId: any,
    clientMsgId: any,
  ) {
    socket?.emit('message', {
      content: JSON.stringify(content),
      type: type,
      room: room,
      to: userId,
      clientMsgId: clientMsgId,
    });
    console.log('=== send video 1-1 ===', content);
  }

  //send messages file 1-1
  emitMessageSocketFile(
    content: any,
    type: any,
    room: any,
    userId: any,
    clientMsgId: any,
  ) {
    socket?.emit('message', {
      content: JSON.stringify(content),
      type: type,
      room: room,
      to: userId,
      clientMsgId: clientMsgId,
    });
    console.log('=== send file 1-1 ===', content, type, room, userId);
  }

  //send messages file group
  emitMessageSocketFileGroup(
    content: any,
    type: any,
    room: any,
    clientMsgId: any,
  ) {
    socket?.emit('message', {
      content: JSON.stringify(content),
      type: type,
      room: room,
      clientMsgId: clientMsgId,
    });
    console.log('=== send file group ===', content, type, room);
  }

  //send messages Video in group
  emitMessageSocketGroupVideo(
    content: any,
    type: any,
    room: any,
    clientMsgId: any,
  ) {
    socket?.emit('message', {
      content: JSON.stringify(content),
      type: type,
      room: room,
      clientMsgId: clientMsgId,
    });
    console.log('=== send video group ===', content);
  }

  //send messages reply
  emitMessageSocketReply(
    content: any,
    type: any,
    room: any,
    userId: any,
    clientMsgId: any,
    msgIdReply: any,
  ) {
    socket?.emit('message', {
      content: JSON.stringify(content),
      type: type,
      room: room,
      to: userId,
      clientMsgId: clientMsgId,
      reply_id: msgIdReply,
    });
    console.log('=== send message reply ===');
  }

  //xoa tin nhan
  emitMessageSocketDelete(room: any, id: any) {
    socket?.emit('message:delete', {
      room: room,
      id: id,
    });
    console.log('=== delete message ===', room, id);
  }

  //Owner xoa tin nhan
  emitMessageSocketOwnerDelete(room: any, id: any) {
    socket?.emit('message:delete', {
      room: room,
      id: id,
      all: true,
    });
    console.log('=== delete message ===', room, id);
  }

  //xoa lich su tro chuyen 1-1
  emitMessageSocketDeleteHistory(room: any, id: any) {
    socket?.emit('message:delete', {
      room: room,
      id: id,
      history: true,
    });
    console.log('=== delete message ===', room, id);
  }

  //thu hoi tin nhan
  emitMessageSocketRecall(room: any, id: any) {
    socket?.emit('message:recall', {
      room: room,
      id: id,
    });
    console.log('=== recall message ===', room, id);
  }

  //moi thanh vien vao nhom
  emitInviteSocket(room: any, userId: any, media?: any) {
    socket?.emit('room:invite', {room: room, to: userId, media: media});
  }

  //xoa nhom
  emitDeleteSocket(room: any, media?: any) {
    let _data: any = {
      room: room,
    };
    if (media) {
      _data.media = 'livestream';
    }
    socket?.emit('room:delete', _data);
  }

  //xoa lich su tro chuyen
  emitDeleteSocketHistory(room: any, id: any) {
    socket?.emit('message:delete', {room: room, id: id, history: true});
  }

  //chuyen quyền admin
  emitChangeAdmin(room: any, userId: any) {
    socket?.emit('room:transfer', {room: room, to: userId});
  }

  //isTyping
  emitTypingTo(room: any, status: any) {
    socket?.emit('typing', {room: room, status: status});
  }

  //upload file
  emitUploadFile(resources: any) {
    socket?.emit('upload', {resources: JSON.stringify(resources)});
  }

  //list room
  emitListRoom(limit: any, offset: any, media?: any, premium: any = 0) {
    let _data: any = {
      limit: limit,
      offset: offset,
      premium: premium, //0,1
      fq: `type:1-1`,
      // "fqin": `status:1,2`,
    };

    if (media) {
      _data.media = media;
    }
    console.log('🚀 ~ Socketio ~ emitListRoom ~ _data:', _data);
    socket?.emit('room:list', _data);
    store.dispatch(listRoomCreateLoading(null));
  }

  //detail room
  emitDetailRoom(room: any) {
    socket?.emit('room:detail', {room: room});
  }

  //list room truyen them id room
  emitListRoomId(limit: any, offset: any, ids: any) {
    socket?.emit('room:list', {limit, offset, ids: JSON.stringify(ids)});
  }

  //kich khoi nhom
  emitRemoveMember(room: any, to: any) {
    socket?.emit('room:remove', {room, to});
  }

  //rejoin Room
  emitRejoinRoom() {
    socket?.emit('room:rejoin', 'room');
  }

  //seen meeages
  emitSeenMessage(room: any, time: any) {
    socket?.emit('message:seen', {room, time});
  }

  //pin meeages
  emitPinMessage(id: any, room: any, status: any) {
    socket?.emit('message:pin', {id, room, status});
  }

  //request friends gui loi moi kb
  emitFriendRequest(userId: any) {
    socket?.emit('friend:request', {to: userId});
  }

  //appcet / rejecr friends
  emitFriendAppectReject(status: any, userId: any) {
    socket?.emit('friend:status', {status: status, to: userId});
  }

  //thu hoi yeu cau kb
  emitRecallFriend(userId: any) {
    socket?.emit('friend:delete', {to: userId});
  }

  //xoa ket ban
  emitRemoveFriend(userId: any) {
    socket?.emit('friend:remove', {to: userId});
  }

  //editRoom
  emitEditRoom(id: any, title: any, filename: any, image64: any) {
    socket?.emit('room:edit', {
      id: id,
      title: title,
      thumbnail: {
        filename: filename,
        data: image64,
      },
    });
  }
  emitEditNoTitle(id: any, filename: any, image64: any) {
    socket?.emit('room:edit', {
      id: id,
      thumbnail: {
        filename: filename,
        data: image64,
      },
    });
  }
  emitEditRoomNoAvatart(id: any, title: any) {
    socket?.emit('room:edit', {id: id, title: title});
  }

  emitEditRoomChangeBackground(id: any, title: any, background: any) {
    socket?.emit('room:edit', {id: id, title: title, background: background});
  }

  //shareLink join
  emitRoomShare(room: any, userId: any) {
    socket?.emit('room:share', {room: room, from: userId});
  }

  //like emoji
  emitLikeEmoji(room: any, message: any, emoji: any) {
    socket?.emit('emotion', {room: room, message: message, emoji: emoji});
  }

  //recal emoji
  emitRecalEmoji(room: any, message: any) {
    socket?.emit('emotion:recall', {room: room, message: message});
  }

  //viewer live stream
  emitViewerLive(room: any, status: any) {
    socket?.emit('room:livestream', {room: room, status: status});
  }

  //room live
  emitRoomLive(roomId: any, status: any, record: any) {
    socket?.emit('room:live', {id: roomId, status: status, record: record});
  }

  //room live chat
  emitRoomLiveChat(roomId: any, status: any, record: any, room_id: any) {
    socket?.emit('room:live', {
      id: roomId,
      status: status,
      record: record,
      room_id: room_id,
    });
  }

  //action emoji
  emitActionEmoji(roomId: any, emoji: any) {
    socket?.emit('room:action', {id: roomId, emoji: emoji});
  }

  //approve member
  emitApproveMember(room: any, to: any, status: any, title: any) {
    let _data: any = {
      room: room,
      to: to,
      status: status,
      title: title,
    };
    socket?.emit('room:member', _data);
  }

  //approve member admin
  emitApproveAdmin(room: any, to: any, role: any) {
    let _data: any = {
      room: room,
      to: to,
      role: role,
    };
    console.log('🚀 ~ emitApproveAdmin ~ _data:', _data);
    socket?.emit('room:member', _data);
  }

  // end room
  emitEndroom(roomId: any) {
    console.log('🚀 ~ Socketio ~ emitEndroom ~ emitEndroom:', roomId);
    socket?.emit('room:end', {id: roomId, status: 2});
  }
}

const socketService = new Socketio();
Object.freeze(socketService);

export default socketService;
