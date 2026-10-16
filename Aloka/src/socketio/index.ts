import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { getDeviceId } from '@/configs';
import ApiService from '@/services/api-base';

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
  }
}

const socketService = new Socketio();
Object.freeze(socketService);

export default socketService;
