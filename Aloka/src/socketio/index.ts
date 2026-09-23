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

// Lấy link Socket từ file .env (biến SOCKET_LINK)
const getSocketUrl = () => {
  const url = Config.SOCKET_LINK || '';
  if (!url || url.includes(':9007')) {
    return 'https://staging.rf.api.doctornetwork.us';
  }
  return url;
};
const SOCKET_BASE_URL = getSocketUrl();

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

    // 1. Chuẩn bị Token và DeviceId trước khi vào Promise
    let jwtToken = ApiService.getAuthorizationHeader();
    if (!jwtToken) {
      const storedToken = await getObjectData(STORAGEKEY.JWT_TOKEN);
      if (storedToken?.access_token) {
        jwtToken = `Bearer ${storedToken.access_token}`;
        ApiService.setAuthorizationHeader(storedToken.access_token);
      }
    }

    const deviceId = await getDeviceId().catch(() => undefined);

    // 2. Khởi tạo Socket instance nếu chưa có
    if (!socket) {
      socket = io(SOCKET_BASE_URL, {
        path: '/socket.io/', // Mặc định là /socket.io/, socket.io-client sẽ tự lo EIO=4
        transports: ['websocket', 'polling'],
        autoConnect: false, // Để chủ động gọi socket.connect() có kiểm soát bên dưới
        auth: {
          token: jwtToken || '',
          authorization: jwtToken || '',
          deviceId: deviceId || '',
        },
        // extraHeaders chỉ có tác dụng trên React Native / NodeJS
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
    } else {
      // Cập nhật lại token mới nhất nếu socket đã tồn tại từ trước
      socket.auth = {
        token: jwtToken || '',
        authorization: jwtToken || '',
        deviceId: deviceId || '',
      };
    }

    if (!socket) {
      return false;
    }

    if (socket.connected) {
      return true;
    }

    const currentSocket = socket;

    // 3. Thực hiện kết nối với Cleanup an toàn tránh Memory Leak
    return new Promise<boolean>(resolve => {
      let timer: ReturnType<typeof setTimeout> | null = null;

      const cleanup = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        currentSocket.off('connect', onConnect);
        currentSocket.off('connect_error', onConnectError);
      };

      const onConnect = () => {
        cleanup();
        resolve(true);
      };

      const onConnectError = (error: Error) => {
        cleanup();
        console.warn('Socket connection error:', error.message);
        resolve(false);
      };

      timer = setTimeout(() => {
        cleanup();
        resolve(currentSocket.connected || false);
      }, 5000);

      currentSocket.once('connect', onConnect);
      currentSocket.once('connect_error', onConnectError);

      currentSocket.connect();
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
      console.log('==== message ====', data);
      this.notifyListeners('message', data);
    });

    socket.on('listRoom', (data: any) => {
      console.log('listRoom', data);
      this.notifyListeners('room:list', data);
    });

    socket.on('deleteRoom', (data: any) => {
      console.log('==== [socket.on deleteRoom DATA] ====', data);
      this.notifyListeners('deleteRoom', data);
    });

    socket.on('deleteMessage', (data: any) => {
      console.log('==== [socket.on deleteMessage] ====', data);
      this.notifyListeners('deleteMessage', data);
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
    mediaOrExtra?: any,
    isPremium?: any,
    is_chat?: any,
    packageId?: any,
    orderId?: any,
    expiredChat?: any,
  ) {
    try {
      let payload: any = {
        title,
        to: toUserId,
        type: '1-1',
        created_at: Date.now(),
      };
      if (typeof mediaOrExtra === 'object' && mediaOrExtra !== null) {
        payload = { ...payload, ...mediaOrExtra };
      } else {
        if (mediaOrExtra) payload.media = mediaOrExtra;
        if (isPremium) payload.is_premium = isPremium;
        if (is_chat) payload.is_chat = is_chat;
        if (packageId) payload.package_id = packageId;
        if (orderId) payload.order_id = orderId;
        if (expiredChat) payload.expired_chat = expiredChat;
      }
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
    extraData?: any,
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
        media: 'text',
        is_chat: 1,
        ...extraData,
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
          resolve(null);
          return;
        }
        socket.emit(
          'room:list',
          {
            limit,
            offset,
            premium: 0,
            fq: 'type:1-1',
          },
          (res: any) => {
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
   * Xóa / rời cuộc trò chuyện qua Socket
   */
  emitDeleteRoom(roomId: string) {
    if (!roomId) return;
    try {
      if (socket?.connected) {
        socket.emit('deleteRoom', { roomId, room: roomId, id: roomId });
      }
    } catch (e) {
      console.warn('emitDeleteRoom error:', e);
    }
    // Thông báo cho các listeners local cập nhật UI ngay lập tức
    this.notifyListeners('deleteRoom', { roomId, room: roomId, id: roomId });
  }

  /**
   * Xóa / thu hồi tin nhắn qua Socket
   */
  emitDeleteMessage(messageId: string, roomId?: string) {
    if (!messageId) return;
    try {
      if (socket?.connected) {
        socket.emit('deleteMessage', {
          id: messageId,
          messageId,
          room: roomId,
          roomId,
        });
      }
    } catch (e) {
      console.warn('emitDeleteMessage error:', e);
    }
    // Thông báo cho các listeners local cập nhật UI ngay lập tức
    this.notifyListeners('deleteMessage', {
      id: messageId,
      messageId,
      room: roomId,
      roomId,
    });
  }
}

export const socketService = new SocketService();
export default socketService;
