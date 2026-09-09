import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';
import ApiService from '@/services/api-base';
import { getDeviceId } from '@/configs/common';
import { getObjectData } from '@/storages';
import { PAGINATION, STORAGEKEY } from '@/constants';

export interface RoomDetail {
  id: string;
  room_id?: string;
  title: string;
  to?: string;
  thumbnail?: string;
  type?: '1-1' | 'Room';
  created_at?: number;
  updated_at?: number;
  last_message?: string;
  last_time?: string;
  unread_count?: number;
  is_online?: boolean;
}

let socket: Socket | undefined;

class SocketService {
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  isConnected(): boolean {
    return !!socket?.connected;
  }

  getSocket(): Socket | undefined {
    return socket;
  }

  async connect(): Promise<boolean> {
    if (socket?.connected) {
      return true;
    }

    return new Promise(async resolve => {
      try {
        const deviceId = await getDeviceId();
        let jwtToken = ApiService.getAuthorizationHeader();
        if (!jwtToken) {
          const storedToken = await getObjectData(STORAGEKEY.JWT_TOKEN);
          if (storedToken?.access_token) {
            jwtToken = `Bearer ${storedToken.access_token}`;
            ApiService.setAuthorizationHeader(storedToken.access_token);
          }
        }

        const socketUrl = Config.SOCKET_LINK;

        if (!socket) {
          socket = io(socketUrl, {
            transports: ['websocket'],
            auth: {
              token: jwtToken || '',
              authorization: jwtToken || '',
            },
            extraHeaders: {
              ...(jwtToken ? { Authorization: jwtToken } : {}),
              ...(deviceId ? { deviceId } : {}),
            },
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 3000,
            timeout: 10000,
          });

          this.bindInternalEvents();
        }

        if (socket.connected) {
          resolve(true);
          return;
        }

        const timeout = setTimeout(() => {
          resolve(socket?.connected || false);
        }, 5000);

        socket.once('connect', () => {
          clearTimeout(timeout);
          resolve(true);
        });

        socket.once('connect_error', () => {
          clearTimeout(timeout);
          resolve(false);
        });

        socket.connect();
      } catch (error) {
        console.log('Socket connect error:', error);
        resolve(false);
      }
    });
  }

  private bindInternalEvents() {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('==== Connect SocketIo Success ====');
      this.notifyListeners('connect', null);
    });

    socket.on('disconnect', reason => {
      console.log('==== Disconnect SocketIo ====', reason);
      this.notifyListeners('disconnect', reason);
    });

    socket.on('connect_error', err => {
      console.log('Socket connect error:', err?.message);
      this.notifyListeners('connect_error', err);
    });

    socket.on('createRoom', (data: any) => {
      console.log('==== Socket createRoom Event ====', data);
      this.notifyListeners('createRoom', data);
    });

    socket.on('message', (data: any) => {
      this.notifyListeners('message', data);
    });

    socket.on('room:list', (data: any) => {
      console.log('==== [socket.on room:list DATA] ====', data);
      this.notifyListeners('room:list', data);
    });

    socket.on('listRoom', (data: any) => {
      console.log('==== [socket.on listRoom DATA] ====', data);
      this.notifyListeners('room:list', data);
    });

    socket.on('deleteRoom', (data: any) => {
      console.log('==== [socket.on deleteRoom DATA] ====', data);
      const roomId = data?.roomId || data?.room || data?.id || (typeof data === 'string' ? data : '');
      if (roomId) {
        this.notifyListeners('room:deleted', roomId);
      }
      this.notifyListeners('deleteRoom', data);
    });

    socket.on('room:delete', (data: any) => {
      console.log('==== [socket.on room:delete DATA] ====', data);
      const roomId = data?.roomId || data?.room || data?.id || (typeof data === 'string' ? data : '');
      if (roomId) {
        this.notifyListeners('room:deleted', roomId);
      }
      this.notifyListeners('room:delete', data);
    });

    socket.on('users', (data: any) => {
      this.notifyListeners('users', data);
    });
  }

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }

  // Subscribe to socket events
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in listener for ${event}:`, e);
        }
      });
    }
  }

  /**
   * Tạo room chat 1-1 giống DoctorNetwork
   * socket?.emit('room:create', { title, to: user, type: '1-1' })
   */
  emitCreateSocketUser(
    title: string,
    toUserId: string,
    extraData?: any,
  ) {
    try {
      const payload = {
        title,
        to: toUserId,
        type: '1-1',
        created_at: Date.now(),
        ...extraData,
      };
      console.log('Socket emit room:create:', payload);
      if (socket?.connected) {
        socket.emit('room:create', payload);
      }
    } catch (error) {
      console.warn('emitCreateSocketUser error:', error);
    }
  }

  /**
   * Helper async tạo room chat 1-1 và đợi phản hồi, có timeout dự phòng
   */
  async createRoom1vs1(
    customerName: string,
    toUserId: string,
    customerAvatar?: any,
  ): Promise<RoomDetail> {
    // Đảm bảo socket đã kết nối
    if (!socket?.connected) {
      await this.connect();
    }

    return new Promise(resolve => {
      const fallbackRoomId = `room_1v1_${toUserId || Date.now()}`;
      let resolved = false;

      const handleRoomCreated = (res: any) => {
        if (resolved) return;
        const data = res?.data || res;
        // Kiểm tra đúng phòng chat 1-1 vừa tạo
        if (data?.room_id || data?.id) {
          resolved = true;
          this.off('createRoom', handleRoomCreated);
          resolve({
            id: data.room_id || data.id,
            room_id: data.room_id || data.id,
            title: data.title || customerName,
            to: toUserId,
            thumbnail: customerAvatar,
            type: '1-1',
          });
        }
      };

      // Đăng ký lắng nghe sự kiện createRoom từ socket
      this.on('createRoom', handleRoomCreated);

      // Phát sự kiện tạo phòng
      this.emitCreateSocketUser(customerName, toUserId, {
        thumbnail: customerAvatar,
      });

      // Timeout dự phòng sau 1.5 giây nếu socket chưa phản hồi kịp
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.off('createRoom', handleRoomCreated);
          resolve({
            id: fallbackRoomId,
            room_id: fallbackRoomId,
            title: customerName,
            to: toUserId,
            thumbnail: customerAvatar,
            type: '1-1',
          });
        }
      }, 1500);
    });
  }

  // Gửi tin nhắn
  emitSendMessage(
    content: string,
    type: 'text' | 'image' | 'media',
    room: string,
    toUserId: string,
    clientMsgId?: string,
  ) {
    if (socket?.connected) {
      socket.emit('message', {
        content,
        type,
        room,
        to: toUserId,
        clientMsgId: clientMsgId || `${Date.now()}_${Math.random()}`,
      });
    }
  }

  // Đánh dấu đã xem
  emitSeenMessage(room: string, time?: number) {
    if (socket?.connected) {
      socket.emit('message:seen', { room, time: time || Date.now() });
    }
  }

  // Lấy danh sách phòng chat
  async emitListRoom(
    limit: number = PAGINATION.ITEMS_10,
    offset: number = 0,
    callback?: (res: any) => void,
  ): Promise<any> {
    if (!socket?.connected) {
      await this.connect();
    }

    return new Promise(resolve => {
      const send = () => {
        if (!socket?.connected) {
          console.warn('[SocketService] emitListRoom: socket not connected');
          resolve(null);
          return;
        }

        console.log(`[SocketService] emitListRoom: limit=${limit}, offset=${offset}`);
        socket.emit(
          'room:list',
          {
            limit,
            offset,
            premium: 0,
            fq: 'type:1-1',
          },
          (res: any) => {
            console.log(
              `[SocketService] room:list ack for offset=${offset}:`,
              Array.isArray(res)
                ? res.length
                : (res?.data?.length || res?.items?.length || 0),
            );
            console.log('==== [room:list RESPONSE RAW] ====', res);
            try {
              console.log(
                '==== [room:list RESPONSE JSON] ====',
                JSON.stringify(res, null, 2),
              );
            } catch (err) {
              console.log('==== [room:list stringify error] ====', err);
            }
            if (callback) callback(res);
            if (res) {
              this.notifyListeners('room:list', res);
            }
            resolve(res);
          },
        );
      };

      if (socket?.connected) {
        send();
      } else if (socket) {
        socket.once('connect', send);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Xóa / rời cuộc trò chuyện theo chuẩn DoctorNetwork
   */
  emitDeleteRoom(roomId: string) {
    if (!roomId) return;
    try {
      if (socket?.connected) {
        socket.emit('room:delete', { roomId, room: roomId, id: roomId });
        socket.emit('deleteRoom', { roomId, room: roomId, id: roomId });
        socket.emit('room:leave', { roomId, room: roomId, id: roomId });
      }
    } catch (e) {
      console.warn('emitDeleteRoom error:', e);
    }
    // Thông báo cho các listeners local cập nhật UI ngay lập tức
    this.notifyListeners('room:deleted', roomId);
  }
}

export const socketService = new SocketService();
export default socketService;
