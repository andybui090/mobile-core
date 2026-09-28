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
  private currentRoomId?: string;

  setCurrentRoomId(roomId?: string) {
    this.currentRoomId = roomId ? String(roomId) : undefined;
  }

  getCurrentRoomId(): string | undefined {
    return this.currentRoomId;
  }

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
      this.emitRejoinRoom();
      if (this.currentRoomId) {
        this.emitJoinSocket(this.currentRoomId, 1);
      }
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

    socket.on('errors', (err: any) => {
      console.log('==== [socket.on errors] ====', err);
      this.notifyListeners('errors', err);
    });

    socket.on('error', (err: any) => {
      console.log('==== [socket.on error] ====', err);
      this.notifyListeners('error', err);
    });

    socket.on('createRoom', (data: any) => {
      console.log('==== Socket createRoom Event ====', data);
      this.notifyListeners('createRoom', data);
    });

    socket.on('joinRoom', (data: any) => {
      console.log('==== [socket.on joinRoom] ====', data);
      this.notifyListeners('joinRoom', data);
    });

    socket.on('leaveRoom', (data: any) => {
      console.log('==== [socket.on leaveRoom] ====', data);
      this.notifyListeners('leaveRoom', data);
    });

    socket.on('rejoinRoom', (data: any) => {
      console.log('==== [socket.on rejoinRoom] ====', data);
      this.notifyListeners('rejoinRoom', data);
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

    socket.on('recallMessage', (data: any) => {
      console.log('==== [socket.on recallMessage] ====', data);
      this.notifyListeners('recallMessage', data);
    });

    socket.on('upload', (data: any) => {
      console.log('==== [socket.on upload] ====', data);
      this.notifyListeners('upload', data);
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
   * Tạo room chat 1-1 chuẩn theo DoctorNetwork
   * socket?.emit('room:create', _data)
   */
  /**
   * Tạo room chat 1-1 chuẩn theo DoctorNetwork
   * socket?.emit('room:create', _data)
   */
  emitCreateSocketUser(
    title: string,
    toUserId: string,
    media?: any,
    isPremium?: any,
    is_chat?: any,
    packageId?: any,
    _orderId?: any,
    _expiredChat?: any,
  ) {
    try {
      let _data: any = {
        title,
        to: toUserId,
        is_chat: 1, // Khi tạo phòng is_chat luôn là 1
      };

      // Hỗ trợ truyền param dạng object extraData hoặc các param riêng lẻ
      if (typeof media === 'object' && media !== null) {
        const extra = media;
        if (extra.media) _data.media = extra.media;
        if (extra.is_premium === 1) {
          _data.is_premium = 1;
          if (extra.package_id || extra.packageId) {
            _data.package_id = extra.package_id || extra.packageId;
          }
        }
        _data.is_chat = 1;
        // LƯU Ý: order_id tuyệt đối KHÔNG gửi qua socket room:create (chuẩn DoctorNetwork comment out // _data.order_id = orderId;)
      } else {
        if (media) _data.media = media;
        if (isPremium === 1) {
          _data.is_premium = 1;
          if (packageId) _data.package_id = packageId;
        }
        _data.is_chat = 1;
        // LƯU Ý: order_id tuyệt đối KHÔNG gửi qua socket room:create
      }

      console.log('[Socket] emit room:create:', _data);
      if (socket?.connected) {
        socket.emit('room:create', _data);
      } else {
        console.warn('[Socket] socket not connected when emit room:create, reconnecting...');
        this.connect().then(connected => {
          if (connected && socket?.connected) {
            socket.emit('room:create', _data);
          }
        });
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
    // 0. Nếu đã có roomId sẵn trong extraData (ví dụ từ booking item), trả về ngay
    const directRoomId = extraData?.roomId || extraData?.room_id;
    if (directRoomId && String(directRoomId).trim() && String(directRoomId) !== String(toUserId)) {
      console.log('[Socket] Using direct roomId provided:', directRoomId);
      return {
        id: String(directRoomId),
        room_id: String(directRoomId),
        title: customerName,
        to: toUserId,
        thumbnail: customerAvatar,
        type: '1-1',
      };
    }

    // 1. Kiểm tra phòng chat đã tồn tại qua API /rooms trước khi phát socket tạo mới
    if (toUserId) {
      try {
        const res: any = await ApiService.getListRoom({
          limit: 50,
          offset: 0,
          fq: 'type:1-1',
        });
        const items: any[] =
          res?.data?.items ||
          res?.data?.result?.items ||
          (Array.isArray(res?.data) ? res.data : []) ||
          [];
        const matched = items.find((r: any) => {
          const rTo = String(r?.to || r?.to_user?.id || r?.to_user?._id || '');
          const rFrom = String(r?.from || r?.user?.id || r?.user?._id || '');
          const rMembers = (r?.members || r?.users || []).map((m: any) =>
            String(m?.id || m?._id || m),
          );
          return (
            rTo === String(toUserId) ||
            rFrom === String(toUserId) ||
            rMembers.includes(String(toUserId))
          );
        });
        if (matched) {
          const existingRoomId = matched.id || matched.room_id || matched._id;
          if (existingRoomId && String(existingRoomId) !== String(toUserId)) {
            console.log(
              '[Socket] Found existing room in /rooms for toUserId:',
              toUserId,
              existingRoomId,
            );
            return {
              id: String(existingRoomId),
              room_id: String(existingRoomId),
              title: matched.title || customerName,
              to: toUserId,
              thumbnail: customerAvatar,
              type: '1-1',
            };
          }
        }
      } catch (err) {
        console.warn('[Socket] Lookup existing room from API warning:', err);
      }
    }

    // 2. Đảm bảo socket đã kết nối
    if (!socket?.connected) {
      await this.connect();
    }

    return new Promise(resolve => {
      let resolved = false;

      const cleanup = () => {
        this.off('createRoom', handleRoomCreated);
        this.off('errors', handleErrors);
        this.off('error', handleErrors);
      };

      const handleRoomCreated = (res: any) => {
        const data = res?.data || res;
        console.log('[Socket] createRoom response:', data);
        if (resolved) return;

        // Backend Socket DoctorNetwork trả về data.room_id là id phòng chat thật sự
        const realRoomId =
          data?.room_id ||
          (data?.type === '1-1' && data?.id && String(data?.id) !== String(toUserId)
            ? data?.id
            : undefined);

        // Khớp cuộc trò chuyện 1-1
        const isTargetMatch =
          !toUserId ||
          String(data?.to) === String(toUserId) ||
          data?.title === customerName ||
          !data?.to;

        if (realRoomId && isTargetMatch) {
          resolved = true;
          cleanup();
          console.log('[Socket] Successfully resolved real room_id:', realRoomId);
          resolve({
            id: String(realRoomId),
            room_id: String(realRoomId),
            title: data.title || customerName,
            to: toUserId,
            thumbnail: customerAvatar,
            type: '1-1',
          });
        }
      };

      const handleErrors = (err: any) => {
        console.warn('[Socket] createRoom received errors from server:', err);
      };

      // Đăng ký lắng nghe sự kiện createRoom và errors từ socket
      this.on('createRoom', handleRoomCreated);
      this.on('errors', handleErrors);
      this.on('error', handleErrors);

      // Phát sự kiện tạo phòng chuẩn DoctorNetwork (title, to, media, is_chat)
      // KHÔNG gửi order_id hoặc package_id không hợp lệ để tránh lỗi { key: "room_id", msg: "Not Found" }
      this.emitCreateSocketUser(
        customerName,
        toUserId,
        extraData?.media || 'text',
        extraData?.is_premium,
        1,
        extraData?.package_id,
      );

      // Timeout dự phòng sau 3 giây: KHÔNG gán toUserId vào roomId để tránh lỗi 400 "Không tìm thấy"
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          console.warn('[Socket] createRoom timeout, entering chat state without roomId');
          resolve({
            id: '',
            room_id: '',
            title: customerName,
            to: toUserId,
            thumbnail: customerAvatar,
            type: '1-1',
          });
        }
      }, 3000);
    });
  }

  // Chấp nhận / tham gia room chat (chuẩn DoctorNetwork: socket.emit('room:join', { room: id, status }))
  emitJoinSocket(id: any, status: any = 1) {
    if (!id) return;
    const roomIdStr = String(id);
    this.currentRoomId = roomIdStr;
    console.log('[Socket] emitJoinSocket:', roomIdStr, status);
    if (socket?.connected) {
      socket.emit('room:join', { room: roomIdStr, status });
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('room:join', { room: roomIdStr, status });
        }
      });
    }
  }

  // Tự động tham gia room chat ngầm (chuẩn DoctorNetwork: socket.emit('room:join', { room: id, status, autojoin: true }))
  emitJoinSocketAuto(id: any, status: any = 1) {
    if (!id) return;
    const roomIdStr = String(id);
    if (socket?.connected) {
      socket.emit('room:join', { room: roomIdStr, status, autojoin: true });
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('room:join', { room: roomIdStr, status, autojoin: true });
        }
      });
    }
  }

  // Rời khỏi phòng chat (chuẩn DoctorNetwork: socket.emit('room:leave', { room: id }))
  emitLeaveSocket(id: any) {
    if (!id) return;
    const roomIdStr = String(id);
    if (this.currentRoomId === roomIdStr) {
      this.currentRoomId = undefined;
    }
    console.log('[Socket] emitLeaveSocket:', roomIdStr);
    if (socket?.connected) {
      socket.emit('room:leave', { room: roomIdStr });
    }
  }

  // Khôi phục tất cả các room đang hoạt động (chuẩn DoctorNetwork: socket.emit('room:rejoin', 'room'))
  emitRejoinRoom() {
    if (socket?.connected) {
      socket.emit('room:rejoin', 'room');
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('room:rejoin', 'room');
        }
      });
    }
  }

  // Gửi tin nhắn đa phương tiện (text, image, video, file, media) chuẩn DoctorNetwork
  emitSendMessage(
    content: any,
    type: 'text' | 'image' | 'video' | 'media' | 'file',
    room: string,
    toUserId: string,
    clientMsgId?: string,
    replyId?: string,
  ) {
    const formattedContent =
      typeof content === 'string' ? content : JSON.stringify(content);
    let finalClientMsgId = String(clientMsgId || Date.now());
    const suffix = `.${type || 'text'}`;
    if (!finalClientMsgId.endsWith(suffix) && !finalClientMsgId.includes('.')) {
      finalClientMsgId = `${finalClientMsgId}${suffix}`;
    }
    const targetTo = room || toUserId;
    const payload: any = {
      content: formattedContent,
      type: type || 'text',
      room,
      to: targetTo,
      clientMsgId: finalClientMsgId,
    };
    if (replyId) {
      payload.reply_id = replyId;
    }
    console.log('[Socket] emitSendMessage:', payload, 'connected:', socket?.connected);
    if (socket?.connected) {
      socket.emit('message', payload);
    } else {
      console.warn('[Socket] socket not connected when sending message, reconnecting...');
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('message', payload);
        }
      });
    }
  }

  // Gửi tin nhắn Trả lời (Reply) 1-1 chuẩn DoctorNetwork
  emitMessageSocketReply(
    content: any,
    type: any = 'text',
    room: any,
    userId: any,
    clientMsgId: any,
    msgIdReply: any,
  ) {
    let finalClientMsgId = String(clientMsgId || Date.now());
    const suffix = `.${type || 'text'}`;
    if (!finalClientMsgId.endsWith(suffix) && !finalClientMsgId.includes('.')) {
      finalClientMsgId = `${finalClientMsgId}${suffix}`;
    }
    const payload = {
      content: typeof content === 'string' ? content : JSON.stringify(content),
      type: type || 'text',
      room: room,
      to: room || userId,
      clientMsgId: finalClientMsgId,
      reply_id: msgIdReply,
    };
    console.log('[Socket] emitMessageSocketReply:', payload);
    if (socket?.connected) {
      socket.emit('message', payload);
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('message', payload);
        }
      });
    }
  }

  // Gửi tin nhắn Ảnh 1-1 chuẩn DoctorNetwork
  emitMessageSocketImage(
    content: any,
    type: any = 'image',
    room: any,
    userId: any,
    clientMsgId: any,
  ) {
    let finalClientMsgId = String(clientMsgId || Date.now());
    const suffix = `.${type || 'image'}`;
    if (!finalClientMsgId.endsWith(suffix) && !finalClientMsgId.includes('.')) {
      finalClientMsgId = `${finalClientMsgId}${suffix}`;
    }
    const payload = {
      content: typeof content === 'string' ? content : JSON.stringify(content),
      type: type || 'image',
      room,
      to: room || userId,
      clientMsgId: finalClientMsgId,
    };
    console.log('[Socket] emitMessageSocketImage:', payload);
    if (socket?.connected) {
      socket.emit('message', payload);
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('message', payload);
        }
      });
    }
  }

  // Gửi tin nhắn Video 1-1 chuẩn DoctorNetwork
  emitMessageSocketVideo(
    content: any,
    type: any = 'video',
    room: any,
    userId: any,
    clientMsgId: any,
  ) {
    let finalClientMsgId = String(clientMsgId || Date.now());
    const suffix = `.${type || 'video'}`;
    if (!finalClientMsgId.endsWith(suffix) && !finalClientMsgId.includes('.')) {
      finalClientMsgId = `${finalClientMsgId}${suffix}`;
    }
    const payload = {
      content: typeof content === 'string' ? content : JSON.stringify(content),
      type: type || 'video',
      room,
      to: room || userId,
      clientMsgId: finalClientMsgId,
    };
    console.log('[Socket] emitMessageSocketVideo:', payload);
    if (socket?.connected) {
      socket.emit('message', payload);
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('message', payload);
        }
      });
    }
  }

  // Upload file qua socket chuẩn DoctorNetwork
  emitUploadFile(resources: any) {
    if (socket?.connected) {
      socket.emit('upload', {
        resources: typeof resources === 'string' ? resources : JSON.stringify(resources),
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
   * Xóa tin nhắn (phía tôi) chuẩn DoctorNetwork
   * socket.emit('message:delete', { room, id })
   */
  emitMessageSocketDelete(room: any, id: any) {
    const payload = { room: room, id: id };
    console.log('=== delete message ===', room, id);
    if (socket?.connected) {
      socket.emit('message:delete', payload);
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('message:delete', payload);
        }
      });
    }
    this.notifyListeners('deleteMessage', payload);
  }

  /**
   * Owner xóa tin nhắn (cả 2 phía / all) chuẩn DoctorNetwork
   * socket.emit('message:delete', { room, id, all: true })
   */
  emitMessageSocketOwnerDelete(room: any, id: any) {
    const payload = { room: room, id: id, all: true };
    console.log('=== delete message owner ===', room, id);
    if (socket?.connected) {
      socket.emit('message:delete', payload);
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('message:delete', payload);
        }
      });
    }
    this.notifyListeners('deleteMessage', payload);
  }

  /**
   * Xóa lịch sử trò chuyện 1-1 chuẩn DoctorNetwork
   * socket.emit('message:delete', { room, id, history: true })
   */
  emitMessageSocketDeleteHistory(room: any, id?: any) {
    const payload = { room: room, id: id || room, history: true };
    console.log('=== delete message history ===', room, id);
    if (socket?.connected) {
      socket.emit('message:delete', payload);
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('message:delete', payload);
        }
      });
    }
  }

  /**
   * Thu hồi tin nhắn chuẩn DoctorNetwork
   * socket.emit('message:recall', { room, id })
   */
  emitMessageSocketRecall(room: any, id: any) {
    const payload = { room: room, id: id };
    console.log('=== recall message ===', room, id);
    if (socket?.connected) {
      socket.emit('message:recall', payload);
    } else {
      this.connect().then(connected => {
        if (connected && socket?.connected) {
          socket.emit('message:recall', payload);
        }
      });
    }
    this.notifyListeners('recallMessage', payload);
  }

  /**
   * Xóa lịch sử trò chuyện (alias theo DoctorNetwork)
   */
  emitDeleteSocketHistory(room: any, id?: any) {
    this.emitMessageSocketDeleteHistory(room, id);
  }

  /**
   * Xóa / thu hồi tin nhắn qua Socket (wrapper tương thích ngược)
   */
  emitDeleteMessage(messageId: string, roomId?: string, all: boolean = false) {
    if (!messageId) return;
    if (all) {
      this.emitMessageSocketOwnerDelete(roomId, messageId);
    } else {
      this.emitMessageSocketDelete(roomId, messageId);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
