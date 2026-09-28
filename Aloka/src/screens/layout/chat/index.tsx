import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Config from 'react-native-config';
import ImagePicker from 'react-native-image-crop-picker';
import { WebView } from 'react-native-webview';
import { IconX, ToggleSwitch, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import socketService from '@/socketio';
import ApiService from '@/services/api-base';
import { getObjectData, storeObjectData } from '@/storages';
import { STORAGEKEY } from '@/constants';
import { AppContext } from '@/contexts';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  type?: 'text' | 'image' | 'video' | 'media' | 'file';
  text?: string;
  image?: string;
  video?: string;
  isLoading?: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'seen';
  avatar?: any;
  isNew?: boolean;
  replyTo?: {
    id: string;
    sender: 'me' | 'other';
    text?: string;
    image?: string;
    video?: string;
  };
}

export const REPORT_REASONS = [
  'Nội dung phản cảm, quấy rối hoặc đe dọa',
  'Lừa đảo, gian lận hoặc giả mạo người khác',
  'Spam, quảng cáo trái phép hoặc tin rác',
  'Chia sẻ thông tin sai lệch hoặc vi phạm chính sách',
  'Lý do khác',
];

export const isLocalFilePath = (path?: string): boolean => {
  if (!path || typeof path !== 'string') return false;
  const trimmed = path.trim();
  return (
    trimmed.startsWith('file://') ||
    trimmed.startsWith('/Users/') ||
    trimmed.startsWith('/var/') ||
    trimmed.startsWith('/private/') ||
    trimmed.startsWith('/data/') ||
    trimmed.startsWith('/storage/') ||
    trimmed.startsWith('/sdcard/') ||
    trimmed.startsWith('/Containers/') ||
    trimmed.includes('Containers/Data/Application') ||
    trimmed.includes('react-native-image-crop-picker') ||
    trimmed.includes('CoreSimulator/Devices')
  );
};

export const isImageUriValid = (uri?: any): boolean => {
  if (!uri || typeof uri !== 'string') return false;
  const trimmed = uri.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('file://') ||
    trimmed.startsWith('data:image') ||
    trimmed.startsWith('content://') ||
    isLocalFilePath(trimmed)
  );
};

/**
 * Format văn bản tin nhắn theo chuẩn tag hệ thống DoctorNetwork:
 * - {community.chat.remove}: đã xoá tin nhắn này
 * - {community.chat.recall}: Tin nhắn đã được thu hồi
 * - {communityChat.chat.pinMessage}: đã ghim tin nhắn
 * - {communityChat.chat.unPinMessage}: đã bỏ ghim tin nhắn
 * - {communityChat.chat.memberLeveaGroup}: đã rời khỏi nhóm
 * - {communityChat.chat.addMember}: được mời vào nhóm
 * - {communityChat.chat.deleteMember}: được mời rời khỏi nhóm
 * - {communityChat.listMember.changeRole}: đã trở thành phó nhóm
 */
export const formatChatMessageText = (text?: string): string => {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();

  // 1. Tag xoá tin nhắn: {community.chat.remove}
  if (trimmed.includes('{community.chat.remove}')) {
    const rawName = trimmed
      .replace(/DoctorNetwork_Chat_NETDEV/g, '')
      .replace(/\{community\.chat\.remove\}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    if (rawName) {
      return `${rawName} đã xoá tin nhắn này`;
    }
    return 'Tin nhắn đã bị xoá';
  }

  // 2. Tag thu hồi tin nhắn: {community.chat.recall}
  if (trimmed.includes('{community.chat.recall}') || trimmed === 'recall') {
    const rawName = trimmed
      .replace(/DoctorNetwork_Chat_NETDEV/g, '')
      .replace(/\{community\.chat\.recall\}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    if (rawName) {
      return `${rawName} đã thu hồi tin nhắn`;
    }
    return 'Tin nhắn đã được thu hồi';
  }

  // 3. Tag ghim tin nhắn: {communityChat.chat.pinMessage}
  if (trimmed.includes('{communityChat.chat.pinMessage}')) {
    const rawName = trimmed
      .replace(/DoctorNetwork_Chat_NETDEV/g, '')
      .replace(/\{communityChat\.chat\.pinMessage\}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return rawName ? `${rawName} đã ghim tin nhắn` : 'Tin nhắn đã được ghim';
  }

  // 4. Tag bỏ ghim tin nhắn: {communityChat.chat.unPinMessage}
  if (trimmed.includes('{communityChat.chat.unPinMessage}')) {
    const rawName = trimmed
      .replace(/DoctorNetwork_Chat_NETDEV/g, '')
      .replace(/\{communityChat\.chat\.unPinMessage\}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return rawName ? `${rawName} đã bỏ ghim tin nhắn` : 'Tin nhắn đã được bỏ ghim';
  }

  // 5. Tag rời nhóm: {communityChat.chat.memberLeveaGroup}
  if (trimmed.includes('{communityChat.chat.memberLeveaGroup}')) {
    const rawName = trimmed
      .replace(/DoctorNetwork_Chat_NETDEV/g, '')
      .replace(/\{communityChat\.chat\.memberLeveaGroup\}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return rawName ? `${rawName} đã rời khỏi nhóm` : 'Thành viên đã rời khỏi nhóm';
  }

  // 6. Tag thêm thành viên: {communityChat.chat.addMember}
  if (trimmed.includes('{communityChat.chat.addMember}')) {
    const rawName = trimmed
      .replace(/DoctorNetwork_Chat_NETDEV/g, '')
      .replace(/\{communityChat\.chat\.addMember\}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return rawName ? `${rawName} được mời vào nhóm` : 'Thành viên được mời vào nhóm';
  }

  // 7. Tag xoá thành viên: {communityChat.chat.deleteMember}
  if (trimmed.includes('{communityChat.chat.deleteMember}')) {
    const rawName = trimmed
      .replace(/DoctorNetwork_Chat_NETDEV/g, '')
      .replace(/\{communityChat\.chat\.deleteMember\}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return rawName ? `${rawName} được mời rời khỏi nhóm` : 'Thành viên được mời rời khỏi nhóm';
  }

  // 8. Tag thay đổi quyền: {communityChat.listMember.changeRole}
  if (trimmed.includes('{communityChat.listMember.changeRole}')) {
    const rawName = trimmed
      .replace(/DoctorNetwork_Chat_NETDEV/g, '')
      .replace(/\{communityChat\.listMember\.changeRole\}/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return rawName ? `${rawName} đã trở thành phó nhóm` : 'Đã thay đổi quyền phó nhóm';
  }

  // 9. Tag livestream
  if (trimmed.includes('{communityChat.chat.startLivestream}')) {
    return 'Chủ phòng đã bắt đầu phát trực tiếp';
  }
  if (trimmed.includes('{communityChat.chat.endLivestream}')) {
    return 'Chủ phòng đã kết thúc phát trực tiếp';
  }

  return trimmed;
};

export const isMessageDeleted = (text?: string): boolean => {
  if (!text || typeof text !== 'string') return false;
  return (
    text.includes('{community.chat.remove}') ||
    text.includes('đã xoá tin nhắn này') ||
    text.includes('Tin nhắn đã bị xoá')
  );
};

export const isMessageRecalled = (text?: string): boolean => {
  if (!text || typeof text !== 'string') return false;
  return (
    text.includes('{community.chat.recall}') ||
    text.includes('Tin nhắn đã được thu hồi') ||
    text.includes('đã thu hồi tin nhắn') ||
    text.trim() === 'recall'
  );
};

export const isMessageDeletedOrRecalled = (text?: string): boolean => {
  return isMessageDeleted(text) || isMessageRecalled(text);
};

/**
 * Chuẩn hóa URL ảnh / video, tự động nối CDN_URL nếu là relative path
 */
export const normalizeMediaUrl = (url?: any): string | undefined => {
  if (!url || typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  // 1. URL tuyệt đối đã có scheme -> trả thẳng
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('file://') ||
    trimmed.startsWith('content://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  // 2. Đường dẫn file cục bộ trong máy / simulator -> chuyển thành file://
  if (isLocalFilePath(trimmed)) {
    return trimmed.startsWith('file://') ? trimmed : `file://${trimmed}`;
  }
  // 3. Chỉ xử lý relative path THỰC SỰ trên CDN: bắt đầu bằng / hoặc có extension media rõ ràng
  const MEDIA_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'];
  const lowerNoQuery = trimmed.toLowerCase().split('?')[0];
  const hasMediaExtension = MEDIA_EXTENSIONS.some(ext => lowerNoQuery.endsWith(ext));
  if (
    !trimmed.startsWith('/Users') &&
    !trimmed.startsWith('/var') &&
    !trimmed.startsWith('/private') &&
    (trimmed.startsWith('/') || hasMediaExtension)
  ) {
    const cdnBase = (Config.CDN_URL as string) || 'https://cdn-global.doctornetwork.us';
    const cleanBase = cdnBase.endsWith('/') ? cdnBase.slice(0, -1) : cdnBase;
    const cleanRel = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${cleanBase}${cleanRel}`;
  }
  // Không phải URL media -> không xử lý (là text chat bình thường)
  return undefined;
};

/**
 * Kiểm tra xem URL phương tiện có phải là video (mp4, mov, videos-chat, etc.) hay không
 */
export const isVideoMedia = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.avi') ||
    clean.endsWith('.mkv') ||
    clean.includes('/videos-chat/') ||
    clean.includes('/videos/')
  );
};

/**
 * Trích xuất URL ảnh / video từ chuỗi JSON hoặc URL trực tiếp từ DoctorNetwork
 */
export const extractMediaUrl = (content: any): string | undefined => {
  if (!content) return undefined;
  if (typeof content === 'string') {
    const trimmed = content.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const first = parsed[0];
          const raw =
            first?.data ||
            first?.url ||
            first?.src ||
            first?.uri ||
            first?.path ||
            (typeof first === 'string' ? first : undefined);
          return normalizeMediaUrl(raw);
        } else if (parsed && typeof parsed === 'object') {
          const raw =
            parsed.data ||
            parsed.url ||
            parsed.src ||
            parsed.uri ||
            parsed.path;
          return normalizeMediaUrl(raw);
        }
      } catch (e) { }
    }
    return normalizeMediaUrl(trimmed);
  } else if (Array.isArray(content) && content.length > 0) {
    const first = content[0];
    const raw =
      first?.data ||
      first?.url ||
      first?.src ||
      first?.uri ||
      first?.path ||
      (typeof first === 'string' ? first : undefined);
    return normalizeMediaUrl(raw);
  } else if (typeof content === 'object') {
    const raw =
      content.data ||
      content.url ||
      content.src ||
      content.uri ||
      content.path;
    return normalizeMediaUrl(raw);
  }
  return undefined;
};

/**
 * Upload file ảnh / video lên server DoctorNetwork CDN (https://encoding-chat.doctornetwork.us/upload)
 */
export const uploadMediaFile = async (
  fileUri: string,
  mediaType: 'image' | 'video',
  mimeType?: string,
): Promise<string> => {
  // Config.CDN_UPLOAD (https://encoding-chat.doctornetwork.us) là server encoding video của DoctorNetwork.
  // Không gửi ảnh lên server này vì pipeline ffmpeg sẽ encode ảnh thành video .mp4 trong thư mục /videos-chat/.
  if (mediaType !== 'video') {
    return '';
  }

  try {
    const fileName =
      fileUri.split('/').pop() ||
      `${mediaType}_${Date.now()}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;
    const resolvedMime =
      mimeType || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg');

    const cleanUri =
      Platform.OS === 'android'
        ? fileUri
        : fileUri.startsWith('file://')
          ? fileUri
          : `file://${fileUri}`;

    const formData = new FormData();
    formData.append('file', {
      uri: cleanUri,
      type: resolvedMime,
      name: fileName,
    } as any);

    let jwtToken = ApiService.getAuthorizationHeader();
    if (!jwtToken) {
      const storedToken = await getObjectData(STORAGEKEY.JWT_TOKEN);
      if (storedToken?.access_token) {
        jwtToken = `Bearer ${storedToken.access_token}`;
      }
    }

    const uploadBaseUrl = Config.CDN_UPLOAD;

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${uploadBaseUrl}/upload`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'x-app-id': '56d4128c-7732-4218-936c-ed5d82a810fb',
        'x-app-name': 'DoctorNetwork',
        ...(jwtToken ? { Authorization: jwtToken } : {}),
      },
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutTimer);

    if (!response.ok) {
      console.warn(`[Upload] HTTP error ${response.status}`);
      return '';
    }

    const resJson = await response.json();
    console.log('[Upload] response data:', resJson);

    const relativeUrl =
      resJson?.data?.url || resJson?.url || resJson?.data?.src || resJson?.src;
    if (relativeUrl) {
      if (
        relativeUrl.startsWith('http://') ||
        relativeUrl.startsWith('https://')
      ) {
        return relativeUrl;
      }
      const cdnBase = (Config.CDN_URL as string);
      const cleanBase = cdnBase.endsWith('/') ? cdnBase.slice(0, -1) : cdnBase;
      const cleanRel = relativeUrl.startsWith('/')
        ? relativeUrl
        : `/${relativeUrl}`;
      return `${cleanBase}${cleanRel}`;
    }

    return '';
  } catch (error) {
    console.warn('[Upload] uploadMediaFile error:', error);
    return '';
  }
};

export const safeImageSource = (source: any, fallback: any = images.common.img_default): any => {
  if (!source) return fallback;
  if (typeof source === 'number') return source;
  if (typeof source === 'string') {
    const trimmed = source.trim();
    const normalized = normalizeMediaUrl(trimmed) || trimmed;
    if (isImageUriValid(normalized)) {
      return { uri: normalized };
    }
    return fallback;
  }
  if (typeof source === 'object') {
    if (source.uri && typeof source.uri === 'string') {
      const trimmed = source.uri.trim();
      const normalized = normalizeMediaUrl(trimmed) || trimmed;
      if (isImageUriValid(normalized)) {
        return { ...source, uri: normalized };
      }
    }
    return fallback;
  }
  return fallback;
};

const SUGGESTED_GREETINGS = ['👋 Xin chào!'];

const roomMessagesCache = new Map<string, ChatMessage[]>();

/**
 * Hiệu ứng Animated mượt mà cho tin nhắn vừa gửi / vừa nhận:
 * Scale nảy nhẹ (spring), fade-in và trượt nhẹ từ hướng tương ứng
 */
const AnimatedMessageBubble: React.FC<{
  item: ChatMessage;
  isMe: boolean;
  children: React.ReactNode;
}> = React.memo(({ item, isMe, children }) => {
  const shouldAnimate = !!item.isNew;
  const scaleAnim = useRef(new Animated.Value(shouldAnimate ? 0.84 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(shouldAnimate ? 0 : 1)).current;
  const translateYAnim = useRef(new Animated.Value(shouldAnimate ? 14 : 0)).current;
  const translateXAnim = useRef(new Animated.Value(shouldAnimate ? (isMe ? 12 : -12) : 0)).current;

  useEffect(() => {
    if (shouldAnimate) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 6,
          tension: 85,
          useNativeDriver: true,
        }),
        Animated.spring(translateXAnim, {
          toValue: 0,
          friction: 7,
          tension: 85,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shouldAnimate]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [
          { scale: scaleAnim },
          { translateY: translateYAnim },
          { translateX: translateXAnim },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
});

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  // Unified params supporting name / customerName / partnerName / item
  const targetName =
    route.params?.customerName ||
    route.params?.name ||
    route.params?.partnerName ||
    route.params?.item?.title ||
    route.params?.item?.name ||
    '';

  const rawAvatar =
    route.params?.customerAvatar ||
    route.params?.avatar ||
    route.params?.item?.thumbnail ||
    route.params?.item?.avatar;

  const targetAvatar = useMemo(() => {
    return safeImageSource(
      rawAvatar,
      images.common.img_default,
    );
  }, [rawAvatar]);

  const targetAvatarRef = useRef(targetAvatar);
  useEffect(() => {
    targetAvatarRef.current = targetAvatar;
  }, [targetAvatar]);

  const resolveRoomId = (p?: any): string => {
    return (
      p?.roomId ||
      p?.item?.room_id ||
      p?.item?.id ||
      (p?.item?._id ? String(p?.item?._id) : '') ||
      ''
    );
  };

  const initialRoomId = resolveRoomId(route.params);
  const [roomId, setRoomId] = useState<string>(initialRoomId);
  const roomIdRef = useRef<string>(initialRoomId);
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const { user } = useContext<any>(AppContext) || {};
  const currentUserId = useSelector(
    (state: any) =>
      state.profileReducer?.profileData?.data?.result?.id ||
      state.profileReducer?.profileData?.data?.id ||
      state.profileReducer?.profileData?.data?.user_id,
  );
  const myUserId = user?.id || user?.user_id || currentUserId;
  const toUserId =
    route.params?.toUserId ||
    route.params?.item?.to ||
    route.params?.item?.user_id ||
    route.params?.customerId ||
    route.params?.userId ||
    '';

  const mySentMsgIdsRef = useRef<Set<string>>(new Set());

  // Phân biệt tin nhắn của mình (me) hay của đối phương (other)
  const isMeMessage = (item: any): boolean => {
    if (!item) return false;
    if (item.sender === 'me') return true;
    if (item.sender === 'other') return false;

    // Kiểm tra id hoặc clientMsgId đã được gửi từ thiết bị này
    const clientMsgId = String(item.clientMsgId || item.client_msg_id || item.id || '');
    if (clientMsgId && mySentMsgIdsRef.current.has(clientMsgId)) {
      return true;
    }

    const senderId = String(
      item.user_id ||
      item.userId ||
      item.from ||
      item.sender_id ||
      item.owner_id ||
      item.user?.id ||
      item.fromUser?.id ||
      '',
    );
    const receiverId = String(
      item.to ||
      item.toUserId ||
      item.to_user_id ||
      item.to_user?.id ||
      '',
    );

    // 1. So khớp trực tiếp với myUserId của tài khoản hiện tại
    if (myUserId && senderId) {
      if (senderId === String(myUserId)) {
        return true; // Mình gửi -> me
      }
      return false; // Người khác gửi -> other
    }

    // 2. So khớp với toUserId của đối phương trong cuộc trò chuyện 1-1
    if (toUserId && toUserId !== roomId) {
      if (senderId && senderId === String(toUserId)) {
        return false; // Đối phương gửi -> other
      }
      if (receiverId && receiverId === String(toUserId)) {
        return true; // Gửi đến đối phương -> me
      }
      if (senderId && senderId !== String(toUserId)) {
        return true; // Trong chat 1-1, người gửi khác đối phương -> me
      }
    }

    return false;
  };

  const cachedMessages = useMemo(() => {
    if (!initialRoomId) return undefined;
    const cached = roomMessagesCache.get(initialRoomId);
    return cached && cached.length > 0 ? cached : undefined;
  }, [initialRoomId]);

  const [messages, setMessages] = useState<ChatMessage[]>(
    cachedMessages || route.params?.initialMessages || [],
  );
  // Đảm bảo loadingHistory là true ngay từ frame đầu tiên nếu chưa có tin nhắn trong cache (> 0 tin),
  // tránh tình trạng chớp màn hình "chưa có tin nhắn" trước khi loading xuất hiện.
  const [loadingHistory, setLoadingHistory] = useState<boolean>(
    !cachedMessages || cachedMessages.length === 0,
  );
  // Đánh dấu room_id nào đã hoàn tất quá trình tải lịch sử tin nhắn từ API
  const [historyFetchedRoomId, setHistoryFetchedRoomId] = useState<string | null>(
    cachedMessages && cachedMessages.length > 0 ? initialRoomId : null,
  );
  const isCurrentRoomHistoryFetched = Boolean(
    roomId && historyFetchedRoomId === roomId,
  );

  useEffect(() => {
    const currentParamsRoomId = resolveRoomId(route.params);
    if (currentParamsRoomId && currentParamsRoomId !== roomIdRef.current) {
      setRoomId(currentParamsRoomId);
      roomIdRef.current = currentParamsRoomId;

      const cached = roomMessagesCache.get(currentParamsRoomId);
      if (cached && cached.length > 0) {
        setMessages(cached);
        setHistoryFetchedRoomId(currentParamsRoomId);
        setLoadingHistory(false);
      } else {
        setMessages([]);
        setHistoryFetchedRoomId(null);
        setLoadingHistory(true);
      }
      isFetchingHistoryRef.current = false;
      socketService.emitJoinSocket(currentParamsRoomId, 1);
      fetchHistory(currentParamsRoomId);
    }
  }, [route.params?.roomId, route.params?.item]);
  const isFetchingHistoryRef = useRef(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingMoreRef = useRef(false);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingMessage, setReplyingMessage] = useState<ChatMessage | null>(null);

  // Animation states cho nút gửi tin nhắn (bounce & flight micro-interaction)
  const sendScaleAnim = useRef(new Animated.Value(1)).current;
  const sendPlaneAnim = useRef(new Animated.Value(0)).current;

  const triggerSendAnimation = () => {
    // 1. Hiệu ứng nảy nút gửi (spring scale)
    Animated.sequence([
      Animated.timing(sendScaleAnim, {
        toValue: 0.82,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.spring(sendScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 110,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Hiệu ứng máy bay giấy nghiêng góc bay vút
    sendPlaneAnim.setValue(-1);
    Animated.spring(sendPlaneAnim, {
      toValue: 0,
      friction: 5,
      tension: 130,
      useNativeDriver: true,
    }).start();
  };

  // Modals state
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isMediaPickerVisible, setIsMediaPickerVisible] = useState(false);
  const [activeActionMessage, setActiveActionMessage] = useState<ChatMessage | null>(null);

  // Chat settings state
  const [isPinned, setIsPinned] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Report Modal state chuẩn DoctorNetwork
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState<string>('');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);

  // Đồng bộ cài đặt phòng chat (Ghim, Tắt thông báo) từ Storage chuẩn DoctorNetwork
  useEffect(() => {
    const loadChatSettings = async () => {
      const activeRoomId = roomId || initialRoomId;
      if (!activeRoomId) return;

      try {
        // 1. Kiểm tra trạng thái ghim từ STORAGEKEY.PIN_LOCAL
        const pinLocal: any = await getObjectData(STORAGEKEY.PIN_LOCAL);
        if (pinLocal && Array.isArray(pinLocal)) {
          const isPin = pinLocal.some(
            (p: any) =>
              (typeof p === 'string' && p === activeRoomId) ||
              (p && (p.id === activeRoomId || p.roomId === activeRoomId)),
          );
          setIsPinned(Boolean(isPin));
        }

        // 2. Kiểm tra trạng thái tắt thông báo từ STORAGEKEY.MUTE_LOCAL
        const muteLocal: any = await getObjectData(STORAGEKEY.MUTE_LOCAL);
        if (muteLocal && Array.isArray(muteLocal)) {
          const isMute = muteLocal.some(
            (m: any) =>
              (typeof m === 'string' && m === activeRoomId) ||
              (m && (m.id === activeRoomId || m.roomId === activeRoomId)),
          );
          setIsMuted(Boolean(isMute));
        }
      } catch (err) {
        console.warn('loadChatSettings error:', err);
      }
    };

    loadChatSettings();
  }, [roomId, initialRoomId]);

  // Xử lý bật/tắt Ghim cuộc trò chuyện chuẩn DoctorNetwork
  const handleTogglePin = async (newVal: boolean) => {
    setIsPinned(newVal);
    const activeRoomId = roomId || initialRoomId;
    if (!activeRoomId) return;

    try {
      const pinLocal: any = (await getObjectData(STORAGEKEY.PIN_LOCAL)) || [];
      let arr: any[] = Array.isArray(pinLocal) ? [...pinLocal] : [];

      if (newVal) {
        const exists = arr.some(
          (p: any) =>
            (typeof p === 'string' && p === activeRoomId) ||
            (p && (p.id === activeRoomId || p.roomId === activeRoomId)),
        );
        if (!exists) {
          arr.push({
            id: activeRoomId,
            roomId: activeRoomId,
            name: targetName,
          });
          await storeObjectData(STORAGEKEY.PIN_LOCAL, arr);
        }
      } else {
        arr = arr.filter(
          (p: any) =>
            typeof p === 'string'
              ? p !== activeRoomId
              : p && p.id !== activeRoomId && p.roomId !== activeRoomId,
        );
        await storeObjectData(STORAGEKEY.PIN_LOCAL, arr);
      }
    } catch (err) {
      console.warn('handleTogglePin error:', err);
    }
  };

  // Xử lý bật/tắt Tắt thông báo cuộc trò chuyện chuẩn DoctorNetwork
  const handleToggleMute = async (newVal: boolean) => {
    setIsMuted(newVal);
    const activeRoomId = roomId || initialRoomId;
    if (!activeRoomId) return;

    try {
      const muteLocal: any = (await getObjectData(STORAGEKEY.MUTE_LOCAL)) || [];
      let arr: any[] = Array.isArray(muteLocal) ? [...muteLocal] : [];

      if (newVal) {
        const exists = arr.some(
          (m: any) =>
            (typeof m === 'string' && m === activeRoomId) ||
            (m && (m.id === activeRoomId || m.roomId === activeRoomId)),
        );
        if (!exists) {
          arr.push(activeRoomId);
          await storeObjectData(STORAGEKEY.MUTE_LOCAL, arr);
        }
      } else {
        arr = arr.filter(
          (m: any) =>
            typeof m === 'string'
              ? m !== activeRoomId
              : m && m.id !== activeRoomId && m.roomId !== activeRoomId,
        );
        await storeObjectData(STORAGEKEY.MUTE_LOCAL, arr);
      }
    } catch (err) {
      console.warn('handleToggleMute error:', err);
    }
  };

  // Mở modal Báo cáo cuộc trò chuyện
  const handleOpenReportModal = () => {
    setIsOptionModalVisible(false);
    setSelectedReportReason('');
    setReportDetails('');
    setTimeout(() => {
      setIsReportModalVisible(true);
    }, 250);
  };

  // Gửi báo cáo cuộc trò chuyện chuẩn DoctorNetwork
  const handleSendReport = async () => {
    if (!selectedReportReason) {
      Alert.alert('Thông báo', 'Vui lòng chọn lý do báo cáo');
      return;
    }
    setIsSubmittingReport(true);
    try {
      const activeRoomId = roomId || initialRoomId;
      await ApiService.postFeedback({
        type: 'CHAT_ROOM',
        room_id: activeRoomId,
        user_id: toUserId,
        title: selectedReportReason,
        content: reportDetails ? `${selectedReportReason}: ${reportDetails}` : selectedReportReason,
      });
    } catch (err) {
      console.warn('handleSendReport error:', err);
    } finally {
      setIsSubmittingReport(false);
      setIsReportModalVisible(false);
      setTimeout(() => {
        Alert.alert(
          'Cảm ơn bạn đã báo cáo',
          'Chúng tôi sẽ xem xét báo cáo của bạn và thực hiện hành động nếu có hành vi vi phạm Nguyên tắc Cộng đồng của chúng tôi.',
        );
      }, 300);
    }
  };

  const flatListRef = useRef<FlatList>(null);

  // Format message từ API DoctorNetwork (tối ưu parse Date cực nhanh)
  const formatApiMessage = (item: any): ChatMessage => {
    const isMe = isMeMessage(item);

    let textContent: string | undefined = undefined;
    let imageUri: string | undefined = undefined;
    let videoUri: string | undefined = undefined;

    let messageType: 'text' | 'image' | 'video' | 'media' | 'file' =
      item.type || 'text';

    const rawMedia =
      extractMediaUrl(item.content) ||
      extractMediaUrl(item.image) ||
      extractMediaUrl(item.video) ||
      extractMediaUrl(item.resources);

    if (rawMedia) {
      if (isVideoMedia(rawMedia) || item.type === 'video') {
        videoUri = rawMedia;
        messageType = 'video';
      } else {
        imageUri = rawMedia;
        messageType = 'image';
      }
    } else {
      let rawText = '';
      if (typeof item.content === 'string') {
        const trimmed = item.content.trim();
        if (trimmed.includes('{community')) {
          rawText = item.content;
        } else if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
          rawText = item.content;
        }
      } else if (typeof item.text === 'string') {
        rawText = item.text;
      }

      if (rawText) {
        textContent = formatChatMessageText(rawText);
      }
    }

    if (isMessageDeletedOrRecalled(textContent || item.content || item.text)) {
      imageUri = undefined;
      videoUri = undefined;
      messageType = 'text';
    }

    let timeString = '';
    if (item.created_at) {
      const ts =
        typeof item.created_at === 'number'
          ? item.created_at < 10000000000 ? item.created_at * 1000 : item.created_at
          : Date.parse(item.created_at);
      if (!isNaN(ts)) {
        const d = new Date(ts);
        const hh = d.getHours().toString().padStart(2, '0');
        const mm = d.getMinutes().toString().padStart(2, '0');
        timeString = `${hh}:${mm}`;
      }
    }
    if (!timeString) {
      const now = new Date();
      timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    let replyObj: any = item.replyTo;
    const rawReply = item.reply || item.contentReply || item.reply_message || item.replyMsg;
    if (!replyObj && rawReply && typeof rawReply === 'object') {
      const isRefMe = isMeMessage(rawReply);
      replyObj = {
        id: String(rawReply.id || rawReply._id || ''),
        sender: isRefMe ? 'me' : 'other',
        text: formatChatMessageText(rawReply.content || rawReply.text || ''),
        image: extractMediaUrl(rawReply.content) || extractMediaUrl(rawReply.image),
        video: extractMediaUrl(rawReply.video),
      };
    }

    let avatarSource = safeImageSource(
      item.avatar,
      isMe ? images.common.img_default : targetAvatarRef.current,
    );

    return {
      id: String(item.id || item._id || Date.now() + Math.random()),
      sender: isMe ? 'me' : 'other',
      type: messageType,
      text: textContent || undefined,
      image: imageUri,
      video: videoUri,
      replyTo: replyObj,
      time: timeString,
      status: 'seen',
      avatar: avatarSource,
    };
  };

  const fetchHistory = async (targetRoomId?: string) => {
    const activeRoomId = targetRoomId || roomIdRef.current || roomId;
    if (!activeRoomId || !activeRoomId.trim()) {
      setLoadingHistory(false);
      return;
    }
    if (isFetchingHistoryRef.current) {
      return;
    }
    isFetchingHistoryRef.current = true;
    setLoadingHistory(prev => (messages.length === 0 ? true : prev));
    try {
      const res: any = await ApiService.getListHistoryChat({
        id: activeRoomId,
        data: {
          offset: 0,
          limit: 20,
        },
      });

      // Nếu API báo lỗi hoặc chưa có tin nhắn (phòng mới) → để messages rỗng, không văng alert chặn user
      if (
        res?.status === 400 ||
        res?.status === 404 ||
        res?.data?.status === 'error' ||
        !res?.ok
      ) {
        console.log('[ChatScreen] getListHistoryChat notice/empty:', activeRoomId, res?.status, res?.data?.message);
        setMessages([]);
        setHasMore(false);
        setHistoryFetchedRoomId(activeRoomId);
        return;
      }

      const rawItems: any[] =
        (Array.isArray(res?.data?.items) && res.data.items) ||
        (Array.isArray(res?.data) && res.data) ||
        (Array.isArray(res?.items) && res.items) ||
        [];

      if (rawItems && rawItems.length > 0) {
        const validItems = rawItems.filter(item => !item.is_deleted);
        const itemMap = new Map<string, any>();
        validItems.forEach(i => {
          const id = String(i.id || i._id);
          if (id) itemMap.set(id, i);
        });

        const parsed = validItems.map(item => {
          const msg = formatApiMessage(item);
          const replyId = String(
            item.reply_id || item.replyId || item.reply_to || item.parent_id || '',
          );
          if (!msg.replyTo && replyId && itemMap.has(replyId)) {
            const refMsg = itemMap.get(replyId);
            msg.replyTo = {
              id: replyId,
              sender: isMeMessage(refMsg) ? 'me' : 'other',
              text: formatChatMessageText(refMsg.content || refMsg.text || ''),
              image: extractMediaUrl(refMsg.content) || extractMediaUrl(refMsg.image),
              video: extractMediaUrl(refMsg.video),
            };
          }
          return msg;
        });

        // Đảm bảo tin nhắn được xếp theo thứ tự mới nhất ở đầu (index 0) cho FlatList inverted
        const getTs = (m: any) => {
          const raw = m?.created_at || m?.createdAt;
          if (!raw) return 0;
          const ts = typeof raw === 'number'
            ? raw < 10000000000 ? raw * 1000 : raw
            : Date.parse(raw);
          return isNaN(ts) ? 0 : ts;
        };

        const firstTs = getTs(validItems[0]);
        const lastTs = getTs(validItems[validItems.length - 1]);
        const sortedParsed = firstTs > 0 && lastTs > 0 && firstTs < lastTs
          ? parsed.reverse()
          : parsed;

        setMessages(sortedParsed);
        if (activeRoomId) {
          roomMessagesCache.set(activeRoomId, sortedParsed);
        }
        setHasMore(rawItems.length >= 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('==== [ChatScreen] getListHistoryChat error:', error);
    } finally {
      setLoadingHistory(false);
      isFetchingHistoryRef.current = false;
      setHistoryFetchedRoomId(activeRoomId);
    }
  };

  // Action: Tải thêm tin nhắn cũ hơn khi cuộn lên đỉnh (inverted FlatList onEndReached)
  const handleLoadMore = async () => {
    if (
      !roomId ||
      isLoadingMoreRef.current ||
      isFetchingHistoryRef.current ||
      loadingHistory ||
      loadingMore ||
      !hasMore ||
      messages.length === 0
    ) {
      return;
    }

    isLoadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const currentOffset = messages.length;
      console.log('==== [ChatScreen] handleLoadMore offset:', currentOffset);
      const res: any = await ApiService.getListHistoryChat({
        id: roomId,
        data: {
          offset: currentOffset,
          limit: 20,
        },
      });

      const rawItems: any[] =
        (Array.isArray(res?.data?.items) && res.data.items) ||
        (Array.isArray(res?.data) && res.data) ||
        (Array.isArray(res?.items) && res.items) ||
        [];

      if (rawItems.length === 0) {
        setHasMore(false);
      } else {
        const validItems = rawItems.filter(item => !item.is_deleted);
        const itemMap = new Map<string, any>();
        validItems.forEach(i => {
          const id = String(i.id || i._id);
          if (id) itemMap.set(id, i);
        });

        const parsedOlder = validItems.map(item => {
          const msg = formatApiMessage(item);
          const replyId = String(
            item.reply_id || item.replyId || item.reply_to || item.parent_id || '',
          );
          if (!msg.replyTo && replyId && itemMap.has(replyId)) {
            const refMsg = itemMap.get(replyId);
            msg.replyTo = {
              id: replyId,
              sender: isMeMessage(refMsg) ? 'me' : 'other',
              text: formatChatMessageText(refMsg.content || refMsg.text || ''),
              image: extractMediaUrl(refMsg.content) || extractMediaUrl(refMsg.image),
              video: extractMediaUrl(refMsg.video),
            };
          }
          return msg;
        });

        const getTs = (m: any) => {
          const raw = m?.created_at || m?.createdAt;
          if (!raw) return 0;
          const ts = typeof raw === 'number'
            ? raw < 10000000000 ? raw * 1000 : raw
            : Date.parse(raw);
          return isNaN(ts) ? 0 : ts;
        };

        const firstTs = getTs(validItems[0]);
        const lastTs = getTs(validItems[validItems.length - 1]);
        const sortedOlder = firstTs > 0 && lastTs > 0 && firstTs < lastTs
          ? parsedOlder.reverse()
          : parsedOlder;

        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewOlder = sortedOlder.filter(m => !existingIds.has(m.id));
          if (uniqueNewOlder.length === 0) {
            setHasMore(false);
            return prev;
          }
          const updated = [...prev, ...uniqueNewOlder];
          if (roomId) {
            roomMessagesCache.set(roomId, updated);
          }
          return updated;
        });

        if (rawItems.length < 20) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.log('==== [ChatScreen] handleLoadMore error:', error);
    } finally {
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  };

  // Socket setup: auto connect, seen message, fetch history & listen to incoming messages
  useEffect(() => {
    socketService.connect();
    const currentId = roomId || initialRoomId || roomIdRef.current;
    if (currentId) {
      socketService.setCurrentRoomId(currentId);
      socketService.emitJoinSocket(currentId, 1);
      socketService.emitSeenMessage(currentId);
      storeObjectData(STORAGEKEY.DELETE_CHAT, {
        room_id: currentId,
        deleteRoom: 'false',
      });
      fetchHistory(currentId);
    } else if (toUserId) {
      // ⚡ Chưa có roomId nhưng có toUserId: Tạo/tìm phòng ngầm trong background (UI vẫn hiển thị loading)
      console.log('[ChatScreen] Missing roomId, initializing room in background for toUserId:', toUserId);
      setLoadingHistory(true);
      socketService
        .createRoom1vs1(targetName, String(toUserId), targetAvatar, route.params)
        .then(room => {
          const resolvedRoomId =
            room?.room_id ||
            (room?.id && String(room?.id) !== String(toUserId) ? room.id : '');
          if (resolvedRoomId) {
            console.log('[ChatScreen] Background createRoom1vs1 resolved roomId:', resolvedRoomId);
            setRoomId(resolvedRoomId);
            roomIdRef.current = resolvedRoomId;
            socketService.setCurrentRoomId(resolvedRoomId);
            socketService.emitJoinSocket(resolvedRoomId, 1);
            socketService.emitSeenMessage(resolvedRoomId);
            fetchHistory(resolvedRoomId);
          } else {
            setLoadingHistory(false);
          }
        })
        .catch(err => {
          console.warn('[ChatScreen] Background createRoom1vs1 error:', err);
          setLoadingHistory(false);
        });
    }

    const handleSocketConnect = () => {
      const activeId = roomIdRef.current || roomId;
      if (activeId) {
        console.log('[ChatScreen] socket connect/reconnect event -> joining room:', activeId);
        socketService.emitJoinSocket(activeId, 1);
      }
    };

    const handleIncomingMessage = (data: any) => {
      // Chuẩn hóa data từ socket: hỗ trợ cả { data: { ... } } của DoctorNetwork và { ... }
      const msgData =
        data?.data && typeof data.data === 'object' && !Array.isArray(data.data)
          ? data.data
          : data;

      const targetRoom = msgData?.room || msgData?.room_id || data?.room || data?.room_id;
      const currentRoom = roomIdRef.current || roomId;
      const isRoomMatch =
        !targetRoom ||
        !currentRoom ||
        String(targetRoom).trim() === String(currentRoom).trim();

      if (msgData && isRoomMatch) {
        const incoming = {
          ...formatApiMessage(msgData),
          isNew: true, // Tin nhắn mới đến sẽ có hiệu ứng pop-in mượt mà
        };

        setMessages(prev => {
          const clientMsgId =
            msgData.clientMsgId ||
            msgData.client_msg_id ||
            data?.clientMsgId ||
            data?.client_msg_id;

          if (clientMsgId) {
            const clientMsgStr = String(clientMsgId);
            const idx = prev.findIndex(
              m =>
                m.id === clientMsgStr ||
                `${m.id}.text` === clientMsgStr ||
                `${m.id}.${m.type}` === clientMsgStr ||
                clientMsgStr.startsWith(m.id) ||
                m.id.startsWith(clientMsgStr.split('.')[0]),
            );
            if (idx !== -1) {
              const prevMsg = prev[idx];
              const copy = [...prev];
              copy[idx] = {
                ...incoming,
                replyTo: incoming.replyTo || prevMsg.replyTo, // BẢO TỒN replyTo KHI SOCKET CONFIRM THÀNH CÔNG!
                sender: prevMsg.sender || incoming.sender,
                image: incoming.image || prevMsg.image,
                video: incoming.video || prevMsg.video,
                isLoading: false, // TẮT LOADING KHI SOCKET ĐÃ CONFIRM!
                isNew: false, // Tin nhắn mình vừa gửi đã animate lúc nhấn gửi rồi
              };
              if (roomId) {
                roomMessagesCache.set(roomId, copy);
              }
              return copy;
            }
          }

          // Nếu là tin nhắn mới nhận có reply_id:
          const replyId = String(
            msgData.reply_id ||
            msgData.replyId ||
            msgData.reply_to ||
            msgData.parent_id ||
            data?.reply_id ||
            data?.replyId ||
            '',
          );
          if (replyId && !incoming.replyTo) {
            const target = prev.find(
              m => m.id === replyId || String(replyId).startsWith(m.id),
            );
            if (target) {
              incoming.replyTo = {
                id: target.id,
                sender: target.sender,
                text: target.text,
                image: target.image,
                video: target.video,
              };
            }
          }

          if (prev.some(m => m.id === incoming.id)) return prev;
          const updated = [incoming, ...prev];
          if (roomId) {
            roomMessagesCache.set(roomId, updated);
          }
          return updated;
        });
      }
    };

    const handleTyping = (data: any) => {
      if (data && (data.room === roomId || !data.room)) {
        setIsTyping(!!data.isTyping);
      }
    };

    const handleRoomCreated = (res: any) => {
      const data = res?.data || res;
      const newRoomId = data?.room_id;
      if (newRoomId && (!roomId || roomId !== String(newRoomId))) {
        const isTargetMatch =
          !toUserId ||
          String(data?.to) === String(toUserId) ||
          data?.title === targetName;
        if (isTargetMatch) {
          console.log('[ChatScreen] Auto updating roomId from createRoom event:', newRoomId);
          setRoomId(String(newRoomId));
          roomIdRef.current = String(newRoomId);
          socketService.setCurrentRoomId(String(newRoomId));
          socketService.emitJoinSocket(String(newRoomId), 1);
        }
      }
    };

    const handleDeleteMessageEvent = (data: any) => {
      console.log('==== [ChatScreen] on deleteMessage ====', data);
      const delId = String(data?.id || data?._id || data?.messageId || '');
      if (!delId) return;

      setMessages(prev => {
        let updated: ChatMessage[];
        if (data?.content) {
          const formatted = formatChatMessageText(data.content);
          updated = prev.map(m =>
            m.id === delId
              ? { ...m, text: formatted, image: undefined, video: undefined, type: 'text' as const }
              : m,
          );
        } else {
          updated = prev.filter(m => m.id !== delId);
        }
        if (roomId) {
          roomMessagesCache.set(roomId, updated);
        }
        return updated;
      });
    };

    const handleRecallMessageEvent = (data: any) => {
      console.log('==== [ChatScreen] on recallMessage ====', data);
      const recallId = String(data?.id || data?._id || data?.messageId || '');
      if (!recallId) return;

      setMessages(prev => {
        const formatted =
          formatChatMessageText(data?.content) || 'Tin nhắn đã được thu hồi';
        const updated = prev.map(m =>
          m.id === recallId
            ? {
              ...m,
              text: formatted,
              image: undefined,
              video: undefined,
              type: 'text' as const,
            }
            : m,
        );
        if (roomId) {
          roomMessagesCache.set(roomId, updated);
        }
        return updated;
      });
    };

    socketService.on('connect', handleSocketConnect);
    socketService.on('message', handleIncomingMessage);
    socketService.on('typing', handleTyping);
    socketService.on('createRoom', handleRoomCreated);
    socketService.on('deleteMessage', handleDeleteMessageEvent);
    socketService.on('recallMessage', handleRecallMessageEvent);
    return () => {
      const activeId = roomIdRef.current || roomId;
      if (activeId) {
        socketService.emitSeenMessage(activeId);
      }
      socketService.off('connect', handleSocketConnect);
      socketService.off('message', handleIncomingMessage);
      socketService.off('typing', handleTyping);
      socketService.off('createRoom', handleRoomCreated);
      socketService.off('deleteMessage', handleDeleteMessageEvent);
      socketService.off('recallMessage', handleRecallMessageEvent);
    };
  }, [roomId, toUserId, targetName]);

  // Action: Gửi media (ảnh / video) với optimistic update + loading spinner trong bong bóng chờ socket
  const handleSendMedia = async (
    localUri: string,
    mediaType: 'image' | 'video',
    mimeType?: string,
  ) => {
    if (!localUri) return;

    triggerSendAnimation();

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const clientMsgId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    mySentMsgIdsRef.current.add(clientMsgId);

    const cleanLocalUri =
      isLocalFilePath(localUri) && !localUri.startsWith('file://')
        ? `file://${localUri}`
        : localUri;

    // Optimistic UI: Hiển thị ngay ảnh/video trong khung chat với hiệu ứng loading chờ socket
    const optimisticMessage: ChatMessage = {
      id: clientMsgId,
      sender: 'me',
      type: mediaType,
      image: mediaType === 'image' ? cleanLocalUri : undefined,
      video: mediaType === 'video' ? cleanLocalUri : undefined,
      isLoading: true, // <-- Hiệu ứng loading trong ảnh/video chờ socket
      time: timeString,
      status: 'sent',
      isNew: true,
      replyTo: replyingMessage
        ? {
          id: replyingMessage.id,
          sender: replyingMessage.sender,
          text: replyingMessage.text,
          image: replyingMessage.image,
          video: replyingMessage.video,
        }
        : undefined,
    };

    setMessages(prev => {
      const updated = [optimisticMessage, ...prev];
      if (roomId) {
        roomMessagesCache.set(roomId, updated);
      }
      return updated;
    });

    if (roomId) {
      storeObjectData(STORAGEKEY.DELETE_CHAT, {
        room_id: roomId,
        deleteRoom: 'false',
      });
    }

    setReplyingMessage(null);

    // Bắt đầu upload media lên server CDN DoctorNetwork
    try {
      const cdnUrl = await uploadMediaFile(cleanLocalUri, mediaType, mimeType);
      const finalUrl = cdnUrl || cleanLocalUri;

      // Xác định loại media thực tế (video hay image)
      const isActualVideo = mediaType === 'video' || isVideoMedia(finalUrl);
      const actualType: 'video' | 'image' = isActualVideo ? 'video' : 'image';

      // Đảm bảo đuôi filename khớp chính xác với loại media thực tế
      let rawFileName =
        localUri.split('/').pop() ||
        `${actualType}_${Date.now()}.${isActualVideo ? 'mp4' : 'jpg'}`;
      let fileName = rawFileName;
      if (isActualVideo) {
        if (!fileName.toLowerCase().endsWith('.mp4') && !fileName.toLowerCase().endsWith('.mov')) {
          const base = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
          fileName = `${base}.mp4`;
        }
      } else {
        if (fileName.toLowerCase().endsWith('.mp4') || fileName.toLowerCase().endsWith('.mov')) {
          const base = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
          fileName = `${base}.jpg`;
        }
      }

      const socketPayload = [
        {
          filename: fileName,
          data: finalUrl,
          type: actualType,
        },
      ];

      const targetTo = roomId || toUserId;
      // Gửi socket event message chuẩn DoctorNetwork theo đúng actualType
      if (actualType === 'image') {
        socketService.emitMessageSocketImage(
          socketPayload,
          'image',
          roomId,
          targetTo,
          clientMsgId,
        );
      } else {
        socketService.emitMessageSocketVideo(
          socketPayload,
          'video',
          roomId,
          targetTo,
          clientMsgId,
        );
      }

      // Cập nhật lại URL server và type cho tin nhắn trong state
      setMessages(prev => {
        const copy = prev.map(m =>
          m.id === clientMsgId
            ? {
              ...m,
              type: actualType,
              image: !isActualVideo ? finalUrl : undefined,
              video: isActualVideo ? finalUrl : undefined,
            }
            : m,
        );
        if (roomId) {
          roomMessagesCache.set(roomId, copy);
        }
        return copy;
      });

      // Timeout dự phòng: Sau 12s nếu socket chưa confirm thì tự tắt loading để UI mượt mà
      setTimeout(() => {
        setMessages(prev => {
          let hasChange = false;
          const copy = prev.map(m => {
            if (m.id === clientMsgId && m.isLoading) {
              hasChange = true;
              return { ...m, isLoading: false };
            }
            return m;
          });
          if (hasChange && roomId) {
            roomMessagesCache.set(roomId, copy);
          }
          return copy;
        });
      }, 12000);
    } catch (err) {
      console.warn('[ChatScreen] Error uploading / sending media:', err);
      // Tắt loading nếu upload lỗi
      setMessages(prev => {
        const copy = prev.map(m =>
          m.id === clientMsgId ? { ...m, isLoading: false } : m,
        );
        if (roomId) {
          roomMessagesCache.set(roomId, copy);
        }
        return copy;
      });
    }
  };

  // Action: Phát video trong player modal
  const handlePlayVideo = (videoUri: string) => {
    if (!videoUri) return;
    setPreviewVideo(videoUri);
  };

  // Action: Send message
  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    if (selectedImage) {
      await handleSendMedia(selectedImage, 'image');
      setSelectedImage(null);
    }

    if (inputText.trim()) {
      triggerSendAnimation();

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      const rawMsgId = Date.now().toString();
      const clientMsgIdWithSuffix = `${rawMsgId}.text`;

      const newMessage: ChatMessage = {
        id: rawMsgId,
        sender: 'me',
        type: 'text',
        text: inputText.trim(),
        time: timeString,
        status: 'sent',
        isNew: true, // Kích hoạt animation mượt mà pop-in
        replyTo: replyingMessage
          ? {
            id: replyingMessage.id,
            sender: replyingMessage.sender,
            text: replyingMessage.text,
            image: replyingMessage.image,
            video: replyingMessage.video,
          }
          : undefined,
      };

      mySentMsgIdsRef.current.add(newMessage.id);
      mySentMsgIdsRef.current.add(clientMsgIdWithSuffix);
      setMessages(prev => {
        const updated = [newMessage, ...prev];
        if (roomId) {
          roomMessagesCache.set(roomId, updated);
        }
        return updated;
      });

      if (roomId) {
        storeObjectData(STORAGEKEY.DELETE_CHAT, {
          room_id: roomId,
          deleteRoom: 'false',
        });
      }

      const targetTo = roomId || toUserId;
      // Gửi tin nhắn qua Socket chuẩn DoctorNetwork
      if (replyingMessage) {
        socketService.emitMessageSocketReply(
          inputText.trim(),
          'text',
          roomId,
          targetTo,
          clientMsgIdWithSuffix,
          replyingMessage.id,
        );
      } else {
        socketService.emitSendMessage(
          inputText.trim(),
          'text',
          roomId,
          targetTo,
          clientMsgIdWithSuffix,
        );
      }
    }

    setInputText('');
    setReplyingMessage(null);
  };

  // Action: Mở thư viện chọn ảnh với async/await để tránh đơ máy
  const handlePickPhoto = async () => {
    setIsMediaPickerVisible(false);
    Keyboard.dismiss();
    try {
      await new Promise(resolve => setTimeout(() => resolve(true), 150));
      const res = await ImagePicker.openPicker({
        mediaType: 'photo',
        compressImageQuality: 0.85,
      });
      if (res && res.path) {
        await handleSendMedia(res.path, 'image', res.mime);
      }
    } catch (err: any) {
      if (err?.code !== 'E_PICKER_CANCELLED') {
        console.log('Error picking photo:', err);
      }
    }
  };

  // Action: Mở thư viện chọn video với async/await để tránh đơ máy
  const handlePickVideo = async () => {
    setIsMediaPickerVisible(false);
    Keyboard.dismiss();
    try {
      await new Promise(resolve => setTimeout(() => resolve(true), 150));
      const res = await ImagePicker.openPicker({
        mediaType: 'video',
      });
      if (res && res.path) {
        await handleSendMedia(res.path, 'video', res.mime || 'video/mp4');
      }
    } catch (err: any) {
      if (err?.code !== 'E_PICKER_CANCELLED') {
        console.log('Error picking video:', err);
      }
    }
  };

  // Action: Chụp ảnh mới với async/await để tránh đơ máy
  const handleTakePhoto = async () => {
    setIsMediaPickerVisible(false);
    Keyboard.dismiss();
    try {
      await new Promise(resolve => setTimeout(() => resolve(true), 150));
      const res = await ImagePicker.openCamera({
        mediaType: 'photo',
        compressImageQuality: 0.85,
      });
      if (res && res.path) {
        await handleSendMedia(res.path, 'image', res.mime);
      }
    } catch (err: any) {
      if (err?.code !== 'E_PICKER_CANCELLED') {
        console.log('Error taking photo:', err);
      }
    }
  };

  // Action: Mở thư viện ảnh/video trực tiếp hoặc mở modal chọn với async/await
  const handlePickImage = async () => {
    Keyboard.dismiss();
    setIsMediaPickerVisible(true);
  };

  // Action: Long press on a message
  const handleLongPressMessage = (item: ChatMessage) => {
    if (isMessageDeletedOrRecalled(item.text)) {
      return;
    }
    setActiveActionMessage(item);
  };

  // Action: Delete a single message (chuẩn DoctorNetwork socket)
  const handleDeleteMessage = (id: string, all: boolean = false) => {
    setActiveActionMessage(null);
    if (all) {
      setMessages(prev => {
        const updated = prev.map(m =>
          m.id === id
            ? {
              ...m,
              text: 'Bạn đã xoá tin nhắn này',
              image: undefined,
              video: undefined,
              type: 'text' as const,
            }
            : m,
        );
        if (roomId) {
          roomMessagesCache.set(roomId, updated);
        }
        return updated;
      });
      if (roomId) {
        socketService.emitMessageSocketOwnerDelete(roomId, id);
      }
    } else {
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== id);
        if (roomId) {
          roomMessagesCache.set(roomId, updated);
        }
        return updated;
      });
      if (roomId) {
        socketService.emitMessageSocketDelete(roomId, id);
      }
    }
  };

  // Action: Thu hồi tin nhắn (chuẩn DoctorNetwork socket)
  const handleRecallMessage = (id: string) => {
    setActiveActionMessage(null);
    setMessages(prev => {
      const updated = prev.map(m =>
        m.id === id
          ? {
            ...m,
            text: 'Tin nhắn đã được thu hồi',
            image: undefined,
            video: undefined,
          }
          : m,
      );
      if (roomId) {
        roomMessagesCache.set(roomId, updated);
      }
      return updated;
    });

    if (roomId) {
      socketService.emitMessageSocketRecall(roomId, id);
    }
  };

  // Action: Prompt chọn xóa tin nhắn chuẩn DoctorNetwork
  const promptDeleteMessage = (item: ChatMessage) => {
    setActiveActionMessage(null);
    const isMe = item.sender === 'me';

    if (isMe) {
      Alert.alert(
        'Xóa tin nhắn',
        'Bạn muốn xóa tin nhắn này như thế nào?',
        [
          {
            text: 'Xóa riêng cho tôi',
            style: 'default',
            onPress: () => handleDeleteMessage(item.id, false),
          },
          {
            text: 'Xóa cho tất cả mọi người',
            style: 'destructive',
            onPress: () => handleDeleteMessage(item.id, true),
          },
          {
            text: 'Hủy',
            style: 'cancel',
          },
        ],
      );
    } else {
      Alert.alert(
        'Xóa tin nhắn riêng cho bạn',
        'Bạn có chắc chắn muốn xóa tin nhắn này ở phía bạn?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: () => handleDeleteMessage(item.id, false),
          },
        ],
      );
    }
  };

  // Action: Prompt xác nhận thu hồi tin nhắn chuẩn DoctorNetwork
  const promptRecallMessage = (item: ChatMessage) => {
    setActiveActionMessage(null);
    Alert.alert(
      'Thu hồi tin nhắn',
      'Bạn có chắc chắn muốn thu hồi tin nhắn này đối với mọi người?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Thu hồi',
          style: 'destructive',
          onPress: () => handleRecallMessage(item.id),
        },
      ],
    );
  };

  // Action: Clear entire conversation (chuẩn DoctorNetwork socket & storage)
  const handleClearHistory = () => {
    setIsOptionModalVisible(false);
    Alert.alert(
      'Xóa cuộc trò chuyện',
      'Bạn có chắc chắn muốn xóa toàn bộ lịch sử tin nhắn của cuộc trò chuyện này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const activeRoomId = roomId || initialRoomId;
            // 1. Clear local state and cache
            setMessages([]);
            if (activeRoomId) {
              roomMessagesCache.set(activeRoomId, []);
              // Gửi socket event xóa lịch sử tin nhắn và xóa phòng chuẩn DoctorNetwork
              const firstMsgId = messages.length > 0 ? messages[0].id : activeRoomId;
              socketService.emitMessageSocketDeleteHistory(activeRoomId, firstMsgId);
              socketService.emitDeleteRoom(activeRoomId);
              await storeObjectData(STORAGEKEY.DELETE_CHAT, {
                room_id: activeRoomId,
                deleteRoom: 'true',
              });
              socketService.emitListRoom(10, 0);
            }

            // 2. Navigate back to conversation list
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  // Render: Message Item
  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender === 'me';
    const isDeleted = isMessageDeleted(item.text);
    const isRecalled = isMessageRecalled(item.text);
    const isSpecialState = isDeleted || isRecalled;

    return (
      <AnimatedMessageBubble item={item} isMe={isMe}>
        <TouchableOpacity
          activeOpacity={0.9}
          onLongPress={() => handleLongPressMessage(item)}
          style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}
        >
          {!isMe && (
            <Image
              source={safeImageSource(item.avatar, targetAvatar)}
              style={styles.senderAvatar}
            />
          )}

          <View style={[styles.bubbleWrapper, isMe ? styles.myBubbleWrapper : styles.otherBubbleWrapper]}>
            {/* Attached image with loading overlay while waiting for socket */}
            {item.image && isImageUriValid(item.image) && !isVideoMedia(item.image) ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  if (!item.isLoading) {
                    setPreviewImage(item.image!);
                  }
                }}
                style={styles.imageMessageContainer}
              >
                <ImageHelper
                  source={{ uri: normalizeMediaUrl(item.image) || item.image }}
                  style={styles.imageMessage}
                  resizeMode="cover"
                  renderErrorImage={() => (
                    <View style={[styles.imageMessage, styles.imageErrorContainer]}>
                      <IconX type="ionicons" name="image-outline" size={32} color="#98A2B3" />
                      <CText style={styles.imageErrorText}>Không thể tải ảnh</CText>
                    </View>
                  )}
                />
                {item.isLoading && (
                  <View style={styles.mediaLoadingOverlay}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <CText style={styles.mediaLoadingText}>Đang gửi ảnh...</CText>
                  </View>
                )}
              </TouchableOpacity>
            ) : null}

            {/* Attached video with preview box and loading overlay while waiting for socket */}
            {(item.video || (item.image && isVideoMedia(item.image))) ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  if (!item.isLoading) {
                    handlePlayVideo(item.video || item.image!);
                  }
                }}
                style={styles.videoMessageContainer}
              >
                <View style={styles.videoPlayButton}>
                  <IconX type="ionicons" name="play" size={26} color="#FFFFFF" />
                </View>

                <View style={styles.videoBottomBar}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconX type="ionicons" name="videocam" size={14} color="#FFFFFF" />
                    <CText style={styles.videoBottomText}>Video</CText>
                  </View>
                  <CText style={[styles.videoBottomText, { color: '#D0D5DD' }]}>
                    Chạm để xem
                  </CText>
                </View>

                {item.isLoading && (
                  <View style={styles.mediaLoadingOverlay}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <CText style={styles.mediaLoadingText}>Đang gửi video...</CText>
                  </View>
                )}
              </TouchableOpacity>
            ) : null}

            {/* Text content or Quoted reply bubble */}
            {item.text || item.replyTo ? (
              isDeleted ? (
                // Tin nhắn đã xoá: Nền kem hồng nhạt viền nét đứt đỏ nhẹ + Icon thùng rác
                <View
                  style={[
                    styles.deletedBubble,
                    isMe ? styles.myDeletedBubbleMargin : styles.otherDeletedBubbleMargin,
                  ]}
                >
                  <IconX
                    type="ionicons"
                    name="trash-outline"
                    size={15}
                    color="#D92D20"
                    style={styles.specialMessageIcon}
                  />
                  <CText style={styles.deletedMessageText}>
                    {formatChatMessageText(item.text || '')}
                  </CText>
                </View>
              ) : isRecalled ? (
                // Tin nhắn đã thu hồi: Nền xám khói viền nét đứt xám + Icon mũi tên thu hồi
                <View
                  style={[
                    styles.recalledBubble,
                    isMe ? styles.myRecalledBubbleMargin : styles.otherRecalledBubbleMargin,
                  ]}
                >
                  <IconX
                    type="ionicons"
                    name="arrow-undo-outline"
                    size={15}
                    color="#475467"
                    style={styles.specialMessageIcon}
                  />
                  <CText style={styles.recalledMessageText}>
                    {formatChatMessageText(item.text || '')}
                  </CText>
                </View>
              ) : (
                // Tin nhắn bình thường: Nền xanh đặc cho 'me', nền trắng cho 'other'
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                  {/* Quoted reply banner INSIDE message bubble */}
                  {item.replyTo && (
                    <View style={[styles.quotedBubble, isMe ? styles.myQuotedBubble : styles.otherQuotedBubble]}>
                      <View style={[styles.quotedAccent, { backgroundColor: isMe ? '#FFFFFF' : '#19A2A7' }]} />
                      <View style={styles.quotedTextContainer}>
                        <CText style={[styles.quotedSender, isMe ? styles.myQuotedSender : styles.otherQuotedSender]}>
                          {item.replyTo.sender === 'me' ? 'Bạn' : targetName}
                        </CText>
                        {item.replyTo.text ? (
                          <CText numberOfLines={1} style={[styles.quotedContent, isMe ? styles.myQuotedContent : styles.otherQuotedContent]}>
                            {item.replyTo.text}
                          </CText>
                        ) : item.replyTo.image ? (
                          <CText numberOfLines={1} style={[styles.quotedContent, isMe ? styles.myQuotedContent : styles.otherQuotedContent]}>
                            [Hình ảnh]
                          </CText>
                        ) : item.replyTo.video ? (
                          <CText numberOfLines={1} style={[styles.quotedContent, isMe ? styles.myQuotedContent : styles.otherQuotedContent]}>
                            [Video]
                          </CText>
                        ) : null}
                      </View>
                    </View>
                  )}

                  {item.text ? (
                    <CText style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                      {item.text}
                    </CText>
                  ) : null}
                </View>
              )
            ) : null}

            {/* Timestamp & Seen status */}
            <View style={[styles.metaRow, isMe ? styles.myMetaRow : styles.otherMetaRow]}>
              <CText style={styles.metaTime}>{item.time}</CText>
              {isMe && !isSpecialState && (
                <View style={styles.statusTick}>
                  <IconX
                    type="ionicons"
                    name={item.status === 'seen' ? 'checkmark-done' : 'checkmark'}
                    size={14}
                    color={item.status === 'seen' ? '#19A2A7' : '#98A2B3'}
                  />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </AnimatedMessageBubble>
    );
  };

  // Action: Send quick suggested greeting
  const handleSendQuickGreeting = (text: string) => {
    triggerSendAnimation();

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text,
      time: timeString,
      status: 'sent',
      isNew: true,
    };

    mySentMsgIdsRef.current.add(newMessage.id);
    setMessages(prev => [newMessage, ...prev]);

    socketService.emitSendMessage(
      text,
      'text',
      roomId,
      toUserId || roomId,
      newMessage.id,
    );
  };

  // Render: Empty Chat State
  const renderEmptyChatState = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyChatScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.emptyChatContainer}>
          {/* Avatar Ring with Online Status */}
          <View style={styles.emptyAvatarRing}>
            <Image
              source={targetAvatar}
              style={styles.emptyAvatar}
            />
            <View style={styles.emptyOnlineBadge} />
          </View>

          {/* User Name */}
          <CText style={styles.emptyName}>{targetName}</CText>

          {/* Verification Badge */}
          <View style={styles.emptyRoleBadge}>
            <IconX type="ionicons" name="shield-checkmark" size={14} color="#19A2A7" />
            <CText style={styles.emptyRoleText}>Đã xác thực danh tính Aloka</CText>
          </View>

          {/* Description */}
          <CText style={styles.emptyDesc}>
            Chưa có tin nhắn nào ở đây. Hãy bắt đầu cuộc trò chuyện bằng cách gửi lời chào hoặc chọn mẫu câu bên dưới!
          </CText>

          {/* Quick Suggestions Section */}
          <View style={styles.emptySuggestionsWrapper}>
            <View style={styles.suggestionsHeader}>
              <IconX type="ionicons" name="sparkles" size={16} color="#19A2A7" />
              <CText style={styles.emptySuggestionsTitle}>Gợi ý mở đầu nhanh</CText>
            </View>

            <View style={styles.suggestionsList}>
              {SUGGESTED_GREETINGS.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionPill}
                  activeOpacity={0.7}
                  onPress={() => handleSendQuickGreeting(item)}
                >
                  <CText style={styles.suggestionText}>{item}</CText>
                  <IconX type="ionicons" name="send-outline" size={15} color="#19A2A7" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Security & Privacy Disclaimer */}
          <View style={styles.emptyPrivacyRow}>
            <IconX type="ionicons" name="lock-closed-outline" size={13} color="#98A2B3" />
            <CText style={styles.emptyPrivacyText}>
              Tin nhắn được bảo mật và mã hóa đầu cuối an toàn
            </CText>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerProfile}
          activeOpacity={0.8}
          onPress={() => setIsOptionModalVisible(true)}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={targetAvatar}
              style={styles.headerAvatar}
            />
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.headerTextContainer}>
            <CText style={styles.headerName} numberOfLines={1}>
              {targetName}
            </CText>
            <View style={styles.statusIndicatorRow}>
              <CText style={styles.headerStatus}>Đang hoạt động</CText>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => setIsOptionModalVisible(true)}
        >
          <IconX type="ionicons" name="ellipsis-horizontal" size={22} color="#1D2939" />
        </TouchableOpacity>
      </View>

      {/* Main Chat Message Feed */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            inverted
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loadingMore ? (
                <View style={{ paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator size="small" color={colors.primary || '#19A2A7'} />
                  <CText style={{ marginTop: 6, fontSize: 12, color: colors.c667085 || '#667085' }}>
                    Đang tải tin nhắn cũ hơn...
                  </CText>
                </View>
              ) : messages.length > 0 ? (
                <View style={styles.timeHeader}>
                  <View style={styles.timeHeaderPill}>
                    <CText style={styles.timeText}>
                      {messages[messages.length - 1]?.time
                        ? `Hôm nay, ${messages[messages.length - 1].time}`
                        : 'Hôm nay'}
                    </CText>
                  </View>
                </View>
              ) : undefined
            }
            ListHeaderComponent={
              isTyping ? (
                <View style={styles.typingContainer}>
                  <Image
                    source={targetAvatar}
                    style={styles.typingAvatar}
                  />
                  <View style={styles.typingBubble}>
                    <CText style={styles.typingText}>{`${targetName} đang soạn tin...`}</CText>
                  </View>
                </View>
              ) : undefined
            }
          />
        ) : !isCurrentRoomHistoryFetched || loadingHistory ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary || '#19A2A7'} />
            <CText style={{ marginTop: 12, color: colors.c667085 || '#667085', fontSize: 13.5 }}>
              {roomId ? 'Đang tải tin nhắn...' : 'Đang kết nối cuộc trò chuyện...'}
            </CText>
          </View>
        ) : (
          renderEmptyChatState()
        )}

        {/* Reply Quote Banner */}
        {replyingMessage && (
          <View style={styles.replyBar}>
            <View style={styles.replyBarAccent} />
            <View style={styles.replyBarContent}>
              <CText style={styles.replyBarTitle}>
                Đang trả lời {replyingMessage.sender === 'me' ? 'chính bạn' : targetName}
              </CText>
              <CText numberOfLines={1} style={styles.replyBarSnippet}>
                {replyingMessage.text || (replyingMessage.image ? '[Hình ảnh]' : '')}
              </CText>
            </View>
            <TouchableOpacity
              onPress={() => setReplyingMessage(null)}
              style={styles.replyBarClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconX type="ionicons" name="close" size={20} color="#98A2B3" />
            </TouchableOpacity>
          </View>
        )}

        {/* Selected Image Preview Strip */}
        {selectedImage && isImageUriValid(selectedImage) ? (
          <View style={styles.imagePreviewStrip}>
            <View style={styles.imageThumbnailWrapper}>
              <Image source={{ uri: selectedImage }} style={styles.imageThumbnail} />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={styles.imageThumbnailRemove}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <IconX type="ionicons" name="close-circle" size={20} color="#F04438" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.inputPill}>
            <TextInput
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#98A2B3"
              value={inputText}
              onChangeText={setInputText}
              style={styles.textInput}
              multiline
              maxLength={1000}
            />

            {/* Pick photo button */}
            <TouchableOpacity
              style={styles.innerActionBtn}
              activeOpacity={0.7}
              onPress={handlePickImage}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <IconX
                type="ionicons"
                name="image-outline"
                size={22}
                color={selectedImage ? '#19A2A7' : '#667085'}
              />
            </TouchableOpacity>
          </View>

          {/* Send button with lively spring bounce & flight animation */}
          <Animated.View style={{ transform: [{ scale: sendScaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.sendBtn,
                inputText.trim() || selectedImage ? styles.sendBtnActive : styles.sendBtnInactive,
              ]}
              onPress={handleSend}
              activeOpacity={0.8}
              disabled={!inputText.trim() && !selectedImage}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: sendPlaneAnim.interpolate({
                        inputRange: [-1, 0],
                        outputRange: ['-20deg', '0deg'],
                      }),
                    },
                    {
                      translateY: sendPlaneAnim.interpolate({
                        inputRange: [-1, 0],
                        outputRange: [-3, 0],
                      }),
                    },
                  ],
                }}
              >
                <IconX
                  type="ionicons"
                  name="paper-plane"
                  size={20}
                  color={inputText.trim() || selectedImage ? '#FFFFFF' : '#98A2B3'}
                />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      {/* 1-1 Chat Options Modal (From DoctorNetwork settingChat) */}
      <Modal
        visible={isOptionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOptionModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOptionModalVisible(false)}>
          <Pressable
            style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />

            {/* Profile Header in Modal */}
            <View style={styles.modalProfileHeader}>
              <Image
                source={targetAvatar}
                style={styles.modalAvatar}
              />
              <CText style={styles.modalProfileName}>{targetName}</CText>
              <CText style={styles.modalProfileStatus}>Đang hoạt động</CText>
            </View>

            <View style={styles.modalDivider} />

            <View style={styles.modalOptionItem}>
              <View style={styles.modalOptionIconBox}>
                <IconX type="antdesign" name="pushpino" size={20} color="#344054" />
              </View>
              <CText style={styles.modalOptionLabel}>Ghim cuộc trò chuyện</CText>
              <ToggleSwitch
                size="small"
                isOn={isPinned}
                onToggle={handleTogglePin}
                onColor="#19A2A7"
              />
            </View>

            <TouchableOpacity
              style={styles.modalOptionItem}
              onPress={handleOpenReportModal}
            >
              <View style={styles.modalOptionIconBox}>
                <IconX type="ionicons" name="flag-outline" size={20} color="#344054" />
              </View>
              <CText style={styles.modalOptionLabel}>Báo cáo cuộc trò chuyện</CText>
              <IconX type="ionicons" name="chevron-forward" size={18} color="#98A2B3" />
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            {/* Delete conversation */}
            <TouchableOpacity
              style={styles.modalOptionItem}
              onPress={handleClearHistory}
            >
              <View style={[styles.modalOptionIconBox, { backgroundColor: '#FEE4E2' }]}>
                <IconX type="ionicons" name="trash-outline" size={20} color="#F04438" />
              </View>
              <CText style={[styles.modalOptionLabel, { color: '#F04438' }]}>
                Xóa cuộc trò chuyện
              </CText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Report Conversation Modal (Chuẩn DoctorNetwork) */}
      <Modal
        visible={isReportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsReportModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%', justifyContent: 'flex-end' }}
          >
            <Pressable
              style={[
                styles.reportModalSheet,
                { paddingBottom: Math.max(insets.bottom, 20) },
              ]}
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.modalHandle} />

              {/* Header */}
              <View style={styles.reportModalHeader}>
                <TouchableOpacity
                  onPress={() => setIsReportModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <IconX type="ionicons" name="close" size={22} color="#344054" />
                </TouchableOpacity>
                <CText style={styles.reportModalTitle}>Báo cáo cuộc trò chuyện</CText>
                <View style={{ width: 22 }} />
              </View>

              <CText style={styles.reportModalSubtitle}>
                Vui lòng chọn lý do bạn muốn báo cáo cuộc trò chuyện này:
              </CText>

              {/* Reasons List */}
              <View style={styles.reportReasonsList}>
                {REPORT_REASONS.map((reason, index) => {
                  const isSelected = selectedReportReason === reason;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.reportReasonItem,
                        isSelected && styles.reportReasonItemSelected,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => setSelectedReportReason(reason)}
                    >
                      <View
                        style={[
                          styles.reportRadioCircle,
                          isSelected && styles.reportRadioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.reportRadioInnerDot} />}
                      </View>
                      <CText
                        style={[
                          styles.reportReasonText,
                          isSelected && styles.reportReasonTextSelected,
                        ]}
                      >
                        {reason}
                      </CText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Optional Details Input */}
              <TextInput
                style={styles.reportTextInput}
                placeholder="Nhập chi tiết báo cáo của bạn (không bắt buộc)..."
                placeholderTextColor="#98A2B3"
                multiline
                numberOfLines={3}
                value={reportDetails}
                onChangeText={setReportDetails}
              />

              {/* Action Buttons */}
              <View style={styles.reportActionsRow}>
                <TouchableOpacity
                  style={styles.reportCancelBtn}
                  activeOpacity={0.7}
                  onPress={() => setIsReportModalVisible(false)}
                >
                  <CText style={styles.reportCancelBtnText}>Hủy</CText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.reportSubmitBtn,
                    !selectedReportReason && styles.reportSubmitBtnDisabled,
                  ]}
                  activeOpacity={0.8}
                  disabled={!selectedReportReason || isSubmittingReport}
                  onPress={handleSendReport}
                >
                  {isSubmittingReport ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <CText style={styles.reportSubmitBtnText}>Gửi báo cáo</CText>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* Message Long Press Action Modal */}
      <Modal
        visible={!!activeActionMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveActionMessage(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveActionMessage(null)}>
          <Pressable
            style={[styles.actionSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <CText style={styles.actionSheetTitle}>Thao tác với tin nhắn</CText>

            <TouchableOpacity
              style={styles.actionSheetItem}
              activeOpacity={0.7}
              onPress={() => {
                if (activeActionMessage) {
                  setReplyingMessage(activeActionMessage);
                }
                setActiveActionMessage(null);
              }}
            >
              <IconX type="ionicons" name="arrow-undo-outline" size={20} color="#344054" />
              <CText style={styles.actionSheetLabel}>Trả lời</CText>
            </TouchableOpacity>

            {/* Thu hồi tin nhắn: chỉ hiển thị cho tin nhắn của chính mình và chưa bị thu hồi */}
            {activeActionMessage?.sender === 'me' &&
              activeActionMessage?.text !== 'Tin nhắn đã được thu hồi' && (
                <TouchableOpacity
                  style={styles.actionSheetItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (activeActionMessage) {
                      promptRecallMessage(activeActionMessage);
                    }
                  }}
                >
                  <IconX type="ionicons" name="refresh-circle-outline" size={20} color="#D92D20" />
                  <CText style={[styles.actionSheetLabel, { color: '#D92D20' }]}>Thu hồi tin nhắn</CText>
                </TouchableOpacity>
              )}

            <TouchableOpacity
              style={styles.actionSheetItem}
              activeOpacity={0.7}
              onPress={() => {
                if (activeActionMessage) {
                  promptDeleteMessage(activeActionMessage);
                }
              }}
            >
              <IconX type="ionicons" name="trash-outline" size={20} color="#F04438" />
              <CText style={[styles.actionSheetLabel, { color: '#F04438' }]}>Xóa tin nhắn</CText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Media Picker Sheet (In-screen overlay to prevent iOS Modal dismiss freeze) */}
      {isMediaPickerVisible && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsMediaPickerVisible(false)}
          >
            <Pressable
              style={[styles.actionSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.modalHandle} />
              <CText style={styles.actionSheetTitle}>Gửi phương tiện</CText>

              {/* Option 1: Chụp ảnh mới */}
              <TouchableOpacity
                style={styles.actionSheetItem}
                activeOpacity={0.7}
                onPress={handleTakePhoto}
              >
                <View style={[styles.actionSheetIconBox, { backgroundColor: '#E0F2FE' }]}>
                  <IconX type="ionicons" name="camera" size={20} color="#0284C7" />
                </View>
                <CText style={styles.actionSheetLabel}>Chụp ảnh mới</CText>
              </TouchableOpacity>

              {/* Option 2: Chọn ảnh từ thư viện */}
              <TouchableOpacity
                style={styles.actionSheetItem}
                activeOpacity={0.7}
                onPress={handlePickPhoto}
              >
                <View style={[styles.actionSheetIconBox, { backgroundColor: '#E0F7F5' }]}>
                  <IconX type="ionicons" name="images" size={20} color="#19A2A7" />
                </View>
                <CText style={styles.actionSheetLabel}>Chọn ảnh từ thư viện</CText>
              </TouchableOpacity>

              {/* Option 3: Chọn video từ thư viện */}
              <TouchableOpacity
                style={styles.actionSheetItem}
                activeOpacity={0.7}
                onPress={handlePickVideo}
              >
                <View style={[styles.actionSheetIconBox, { backgroundColor: '#FEE4E2' }]}>
                  <IconX type="ionicons" name="videocam" size={20} color="#F04438" />
                </View>
                <CText style={styles.actionSheetLabel}>Chọn video từ thư viện</CText>
              </TouchableOpacity>

              {/* Option 4: Hủy */}
              <TouchableOpacity
                style={[styles.actionSheetItem, { borderBottomWidth: 0, marginTop: 4 }]}
                activeOpacity={0.7}
                onPress={() => setIsMediaPickerVisible(false)}
              >
                <View style={[styles.actionSheetIconBox, { backgroundColor: '#F2F4F7' }]}>
                  <IconX type="ionicons" name="close" size={20} color="#667085" />
                </View>
                <CText style={[styles.actionSheetLabel, { color: '#667085' }]}>Hủy</CText>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </View>
      )}

      {/* Fullscreen Image Preview Modal */}
      <Modal
        visible={!!previewImage}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <SafeAreaView style={styles.fullscreenModal}>
          <TouchableOpacity
            style={styles.fullscreenCloseBtn}
            onPress={() => setPreviewImage(null)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <IconX type="ionicons" name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          {previewImage && isImageUriValid(previewImage) ? (
            <ImageHelper
              source={{ uri: normalizeMediaUrl(previewImage) || previewImage }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          ) : null}
        </SafeAreaView>
      </Modal>

      {/* Fullscreen Video Player Modal */}
      <Modal
        visible={!!previewVideo}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVideo(null)}
      >
        <SafeAreaView style={styles.fullscreenModal}>
          <View style={styles.fullscreenVideoHeader}>
            <TouchableOpacity
              style={styles.fullscreenCloseBtn}
              onPress={() => setPreviewVideo(null)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <IconX type="ionicons" name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fullscreenExternalBtn}
              onPress={() => {
                if (previewVideo) {
                  Linking.openURL(previewVideo).catch(err =>
                    console.log('Error opening video URL:', err),
                  );
                }
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <IconX type="ionicons" name="open-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {previewVideo ? (
            <View style={{ flex: 1, width: '100%', backgroundColor: '#000000', justifyContent: 'center' }}>
              <WebView
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                        <style>
                          body { margin: 0; background-color: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
                          video { width: 100%; max-height: 100vh; object-fit: contain; }
                        </style>
                      </head>
                      <body>
                        <video src="${previewVideo}" controls autoplay playsinline controlsList="nodownload"></video>
                      </body>
                    </html>
                  `,
                }}
                style={{ flex: 1, backgroundColor: '#000000' }}
                allowsFullscreenVideo
                mediaPlaybackRequiresUserAction={false}
              />
            </View>
          ) : null}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export const BookingChat = ChatScreen;

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F4F7',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#12B76A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#12B76A',
    marginRight: 5,
  },
  headerStatus: {
    fontSize: 12,
    color: '#667085',
  },
  moreBtn: {
    padding: 6,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  timeHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timeHeaderPill: {
    backgroundColor: '#EAECF0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myRow: {
    justifyContent: 'flex-end',
  },
  otherRow: {
    justifyContent: 'flex-start',
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F4F7',
    marginRight: 8,
    marginBottom: 16,
  },
  bubbleWrapper: {
    maxWidth: '78%',
  },
  myBubbleWrapper: {
    alignItems: 'flex-end',
  },
  otherBubbleWrapper: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#19A2A7',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  // Bong bóng tin nhắn đã xoá (Phân biệt hoàn toàn với tin nhắn bình thường)
  deletedBubble: {
    backgroundColor: '#FEF3F2',
    borderWidth: 1,
    borderColor: '#FECDCA',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
  },
  myDeletedBubbleMargin: {
    borderBottomRightRadius: 4,
  },
  otherDeletedBubbleMargin: {
    borderBottomLeftRadius: 4,
  },
  deletedMessageText: {
    fontSize: 13.5,
    fontStyle: 'italic',
    color: '#B42318',
    flexShrink: 1,
    lineHeight: 18,
  },

  // Bong bóng tin nhắn đã thu hồi (Phân biệt hoàn toàn với tin nhắn bình thường và tin nhắn xoá)
  recalledBubble: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
  },
  myRecalledBubbleMargin: {
    borderBottomRightRadius: 4,
  },
  otherRecalledBubbleMargin: {
    borderBottomLeftRadius: 4,
  },
  recalledMessageText: {
    fontSize: 13.5,
    fontStyle: 'italic',
    color: '#475467',
    flexShrink: 1,
    lineHeight: 18,
  },

  specialMessageIcon: {
    marginRight: 6,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#101828',
  },
  imageMessageContainer: {
    marginBottom: 4,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  imageMessage: {
    width: 220,
    height: 180,
    borderRadius: 14,
    backgroundColor: '#EAECF0',
  },
  imageErrorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
  },
  imageErrorText: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 6,
    fontWeight: '500',
  },
  mediaLoadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 24, 40, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    zIndex: 10,
    padding: 10,
  },
  mediaLoadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  videoMessageContainer: {
    width: 220,
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#101828',
    marginBottom: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#344054',
  },
  videoPlayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(25, 162, 167, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  videoBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  videoBottomText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  quotedBubble: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 6,
    minWidth: 100,
  },
  myQuotedBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
  },
  otherQuotedBubble: {
    backgroundColor: '#F2F4F7',
  },
  quotedAccent: {
    width: 3,
    borderRadius: 1.5,
    marginRight: 8,
  },
  quotedTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  quotedSender: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  myQuotedSender: {
    color: '#FFFFFF',
  },
  otherQuotedSender: {
    color: '#101828',
  },
  quotedContent: {
    fontSize: 12,
  },
  myQuotedContent: {
    color: 'rgba(255, 255, 255, 0.88)',
  },
  otherQuotedContent: {
    color: '#475467',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  myMetaRow: {
    justifyContent: 'flex-end',
  },
  otherMetaRow: {
    justifyContent: 'flex-start',
  },
  metaTime: {
    fontSize: 11,
    color: '#98A2B3',
    marginRight: 4,
  },
  statusTick: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  typingAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAECF0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  typingText: {
    fontSize: 12,
    color: '#667085',
    fontStyle: 'italic',
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  replyBarAccent: {
    width: 3,
    height: 32,
    borderRadius: 1.5,
    backgroundColor: '#19A2A7',
    marginRight: 10,
  },
  replyBarContent: {
    flex: 1,
  },
  replyBarTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#19A2A7',
  },
  replyBarSnippet: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  replyBarClose: {
    padding: 6,
  },
  imagePreviewStrip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },
  imageThumbnailWrapper: {
    position: 'relative',
  },
  imageThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  imageThumbnailRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  inputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 22,
    paddingHorizontal: 14,
    minHeight: 44,
    maxHeight: 110,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#101828',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginRight: 6,
  },
  innerActionBtn: {
    padding: 6,
  },
  sendBtn: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#19A2A7',
  },
  sendBtnInactive: {
    backgroundColor: '#F2F4F7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  modalHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#D0D5DD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalProfileHeader: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F4F7',
    marginBottom: 10,
  },
  modalProfileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
  },
  modalProfileStatus: {
    fontSize: 13,
    color: '#12B76A',
    marginTop: 2,
    fontWeight: '500',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EAECF0',
    marginVertical: 8,
  },
  modalOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalOptionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F4F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  modalOptionLabel: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: '#1D2939',
  },
  actionSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  actionSheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 14,
    textAlign: 'center',
  },
  actionSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  actionSheetIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheetLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1D2939',
    marginLeft: 12,
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 6,
  },
  fullscreenVideoHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullscreenExternalBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
  // Empty Chat State Styles
  emptyChatScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  emptyChatContainer: {
    alignItems: 'center',
  },
  emptyAvatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    backgroundColor: '#E6F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#19A2A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  emptyAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EAECF0',
  },
  emptyOnlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#12B76A',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  emptyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 12,
  },
  emptyRoleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#19A2A7',
    marginLeft: 5,
  },
  emptyDesc: {
    fontSize: 13.5,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  emptySuggestionsWrapper: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F2F4F7',
    marginBottom: 20,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  emptySuggestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344054',
    marginLeft: 6,
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 13,
    color: '#344054',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  emptyPrivacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyPrivacyText: {
    fontSize: 11.5,
    color: '#98A2B3',
    marginLeft: 5,
  },
  reportModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  reportModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
    marginBottom: 12,
  },
  reportModalTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#101828',
  },
  reportModalSubtitle: {
    fontSize: 13.5,
    color: '#475467',
    marginBottom: 14,
    lineHeight: 19,
  },
  reportReasonsList: {
    gap: 8,
    marginBottom: 14,
  },
  reportReasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  reportReasonItemSelected: {
    backgroundColor: '#E6FAFA',
    borderColor: '#19A2A7',
  },
  reportRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reportRadioCircleSelected: {
    borderColor: '#19A2A7',
  },
  reportRadioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#19A2A7',
  },
  reportReasonText: {
    fontSize: 13.5,
    color: '#344054',
    flex: 1,
  },
  reportReasonTextSelected: {
    color: '#101828',
    fontWeight: '600',
  },
  reportTextInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EAECF0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#101828',
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  reportActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  reportCancelBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#344054',
  },
  reportSubmitBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#19A2A7',
  },
  reportSubmitBtnDisabled: {
    opacity: 0.5,
  },
  reportSubmitBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
