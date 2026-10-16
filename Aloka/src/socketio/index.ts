import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { getDeviceId } from '@/configs';
import ApiService from '@/services/api-base';
import { store } from '@/redux/store';
import { listRoomCreate, listRoomCreateLoading } from '@/redux/slices/socketioSlice';

var socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

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
      socket = io(Config.SOCKET_LINK as string, {
        transports: ['websocket'],
        extraHeaders: {
          Authorization: jwtToken,
          deviceId: deviceId,
        },
      });
      socket?.connect();
      this.listenEvent();
    }
  }

  listenEvent() {
    socket?.on('connect', () => {
      console.log('====Connect SocketIo====');
      //   store.dispatch(errorSocket('Connect SocketIo'));
      //   store.dispatch(reloadConnectSocket('true'));
      //   deeplinkService.redirectScreen();
    });

    socket?.on('disconnect', () => {
      console.log('====Disconnect SocketIo====');
    });

    // Danh sach room chat
    socket?.on('listRoom', (data: any) => {
      console.log("🚀 ~ Socketio ~ listenEvent ~ data:", data);
      if (data.total > 0) {
        store.dispatch(listRoomCreate(data));
      } else if (data?.result?.total == 0 || data?.total == 0) {
        store.dispatch(listRoomCreate(null));
      }
      // if (data.total > 0) {
      //   if (data?.items[0]?.media === 'livestream') {
      //     store.dispatch(listRoomLiveStream(data));
      //   } else if (data?.items[0]?.media === 'livechat') {
      //     store.dispatch(listRoomLiveStreamChat(data));
      //   } else {
      //     store.dispatch(listRoomCreate(data));
      //   }
      // } else if (data?.result?.total == 0 || data?.total == 0) {
      //   store.dispatch(listRoomLiveStream(null));
      //   store.dispatch(listRoomCreate(null));
      // }
    });
  }

  disconnect() {
    // store.dispatch(reloadConnectSocket('false'));
    // store.dispatch(checkRoomPrivate(''));
    socket?.disconnect();
  }

  //list room
  emitListRoom(limit: any, offset: any, media?: any, premium: any = 0) {
    let _data: any = {
      limit: limit,
      offset: offset,
      premium: premium, //0,1
      fq: `type:1-1`,
    };

    if (media) {
      _data.media = media;
    }
    console.log('🚀 ~ Socketio ~ emitListRoom ~ _data:', _data);
    socket?.emit('room:list', _data);
    store.dispatch(listRoomCreateLoading(null));
  }
}

const socketService = new Socketio();
Object.freeze(socketService);

export default socketService;
