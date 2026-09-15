import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { IconX } from '@/components';
import { changeAlias, keyExtractor } from '@/configs';
import { images } from '@/configs/image';
import { CEmptySearch, CText } from '@/utils';
import { PAGINATION } from '@/constants';
import { AppContext } from '@/contexts';
import socketService from '@/socketio';
import ApiService from '@/services/api-base';
import { ConversationItem } from './types';

export const formatChatTime = (timeVal: any, t?: any): string => {
  if (!timeVal) return '';
  let m = moment(timeVal);
  if (typeof timeVal === 'number' && timeVal < 10000000000) {
    m = moment(timeVal * 1000);
  }
  if (!m.isValid()) return '';
  const now = moment();
  if (now.isSame(m, 'day')) {
    return m.format('HH:mm');
  }
  if (now.clone().subtract(1, 'day').isSame(m, 'day')) {
    return t ? t('partnerWork.yesterday', 'Hôm qua') : 'Hôm qua';
  }
  if (now.isSame(m, 'year')) {
    return m.format('DD/MM');
  }
  return m.format('DD/MM/YYYY');
};

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    chatListContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    chatSearchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F2F4F7',
      borderRadius: 10,
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
      paddingHorizontal: 12,
      height: 42,
    },
    chatSearchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.c101828 || '#101828',
      paddingVertical: 0,
      marginLeft: 8,
    },
    convListContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    conversationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.cF2F4F7 || '#F2F4F7',
    },
    convAvatarWrapper: {
      position: 'relative',
      marginRight: 12,
    },
    convAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#F2F4F7',
    },
    convOnlineDot: {
      position: 'absolute',
      bottom: 1,
      right: 1,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#12B76A',
      borderWidth: 2,
      borderColor: colors.white,
    },
    convInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    convNameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    convName: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.c101828 || '#101828',
      flex: 1,
      marginRight: 8,
    },
    convTime: {
      fontSize: 12,
      color: colors.c98A2B3 || '#98A2B3',
    },
    convMessageRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    convSnippet: {
      fontSize: 13.5,
      color: colors.c667085 || '#667085',
      flex: 1,
      marginRight: 10,
    },
    convSnippetUnread: {
      fontWeight: '600',
      color: colors.c101828 || '#101828',
    },
    convUnreadBadge: {
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.primary || '#19A2A7',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    convUnreadText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.white,
    },
    chatEmptyStateContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingBottom: 60,
    },
    chatEmptyIconCircle: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: '#E6FAFA',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    chatEmptyStateTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.c101828 || '#101828',
      marginBottom: 8,
      textAlign: 'center',
    },
    chatEmptyStateSubtitle: {
      fontSize: 13.5,
      color: colors.c667085 || '#667085',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 20,
    },
    chatReloadBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary || '#19A2A7',
      paddingVertical: 9,
      paddingHorizontal: 18,
      borderRadius: 20,
      gap: 6,
    },
    chatReloadBtnText: {
      fontSize: 13.5,
      fontWeight: '600',
      color: colors.white,
    },
  })
);

interface WorkChatTabProps {
  onOpenChat: (
    name: string,
    avatar?: any,
    roomId?: string,
    toUserId?: string,
  ) => void;
}

export const WorkChatTab: React.FC<WorkChatTabProps> = ({ onOpenChat }) => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();
  const { user } = useContext<any>(AppContext) || {};
  const currentUserId = String(user?.id || user?._id || user?.user_id || '');

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [finalLoad, setFinalLoad] = useState(false);
  const [chatSearchKeyword, setChatSearchKeyword] = useState('');

  const offsetRef = useRef(0);
  const requestedOffsetRef = useRef(0);
  const finalLoadRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  const isRefreshingRef = useRef(false);

  // Parse nội dung tin nhắn cuối tương tự DoctorNetwork
  const parseLastMessage = (last_message: any): string => {
    if (!last_message) return t('partnerWork.startChatPrompt', 'Bắt đầu cuộc trò chuyện');
    if (typeof last_message === 'object') {
      return last_message.content || last_message.text || '';
    }
    if (typeof last_message !== 'string') return '';

    if (last_message.includes('"type":"video"')) {
      return t('communityChat.home.lastMessageVideo', '[Video]');
    }
    if (last_message.includes('"type":"image"') || last_message.includes('"filename"')) {
      return t('communityChat.home.lastMessageImage', '[Hình ảnh]');
    }
    if (last_message.includes('"type":"file"')) {
      return t('communityChat.home.lastMessageFile', '[Tệp tin]');
    }
    if (last_message.includes('"type":"voice"')) {
      return t('communityChat.home.lastMessageVoice', '[Tin nhắn thoại]');
    }
    if (last_message.includes('idTag')) {
      try {
        return JSON.parse(last_message).content;
      } catch {
        return last_message;
      }
    }
    if (last_message.includes('{community.chat.remove}')) {
      return t('communityChat.chat.remove', 'Tin nhắn đã được thu hồi');
    }
    if (last_message.includes('{communityChat.chat.addMember}')) {
      return t('communityChat.chat.addMember', 'Đã thêm thành viên');
    }
    if (last_message.includes('{communityChat.chat.memberLeveaGroup}')) {
      return t('communityChat.chat.memberLeveaGroup', 'Đã rời khỏi nhóm');
    }
    return (
      last_message.replaceAll('DoctorNetwork_Chat_NETDEV ', '').trim() ||
      t('partnerWork.startChatPrompt', 'Bắt đầu cuộc trò chuyện')
    );
  };

  // Parse response danh sách phòng chat từ API / Socket theo chuẩn chat 1-1
  const parseRoomListResponse = (rawList: any[]): ConversationItem[] => {
    if (!Array.isArray(rawList)) return [];

    const validList = rawList.filter((item: any) => {
      if (!item) return false;
      if (item.is_deleted || item.is_delete || item.deleted || item.deleted_at) {
        return false;
      }
      if (
        item.status === 'deleted' ||
        item.status === 'delete' ||
        item.status === 'inactive' ||
        item.status === 'leave'
      ) {
        return false;
      }
      if (item.state === 'deleted') return false;
      return true;
    });

    return validList.map((item: any, index: number) => {
      const roomId = item.room_id || item.id || item._id || `room_${index}`;

      // Xác định đối phương trong phòng chat 1-1
      let partnerUser: any = null;
      if (item.users && Array.isArray(item.users) && item.users.length > 0) {
        partnerUser = item.users.find(
          (u: any) =>
            u &&
            String(u.id || u._id || u.user_id) !== String(currentUserId),
        ) || item.users[0];
      } else if (item.members && Array.isArray(item.members) && item.members.length > 0) {
        partnerUser = item.members.find(
          (m: any) =>
            m &&
            String(m.id || m._id || m.user_id) !== String(currentUserId),
        ) || item.members[0];
      }

      const toUserObj = item.to_user || item.toUser;
      const userObj = item.user || item.fromUser;

      if (!partnerUser) {
        if (toUserObj && String(toUserObj.id || toUserObj._id) !== String(currentUserId)) {
          partnerUser = toUserObj;
        } else if (userObj && String(userObj.id || userObj._id) !== String(currentUserId)) {
          partnerUser = userObj;
        } else if (toUserObj) {
          partnerUser = toUserObj;
        } else if (userObj) {
          partnerUser = userObj;
        }
      }

      const toUserId =
        partnerUser?.id ||
        partnerUser?._id ||
        partnerUser?.user_id ||
        (String(item.to) !== String(currentUserId) && item.to ? item.to : null) ||
        (String(item.from) !== String(currentUserId) && item.from ? item.from : null) ||
        (String(item.created_by) !== String(currentUserId) && item.created_by ? item.created_by : null) ||
        item.toUserId ||
        item.to ||
        item.user_id;

      const customerName =
        partnerUser?.name ||
        partnerUser?.full_name ||
        item.title ||
        item.name ||
        item.customerName ||
        toUserObj?.name ||
        userObj?.name ||
        t('partnerWork.defaultCustomerName');

      let avatarSource: any = images.common.img_default;
      const avatarUrl =
        partnerUser?.avatar ||
        partnerUser?.thumbnail ||
        item.thumbnail ||
        toUserObj?.avatar ||
        userObj?.avatar;

      if (
        avatarUrl &&
        typeof avatarUrl === 'string' &&
        (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://'))
      ) {
        avatarSource = { uri: avatarUrl };
      } else if (item.customerAvatar) {
        avatarSource = item.customerAvatar;
      }

      const rawMsg = item.last_message || item.lastMessage || item.content || '';
      const lastMsg = parseLastMessage(rawMsg);

      const timeStr = formatChatTime(
        item.updated_at || item.created_at || item.time || item.last_time,
        t,
      );

      const unread = Number(
        item.unread_messages || item.unread_count || item.unreadCount || 0,
      );

      return {
        id: String(roomId),
        roomId: String(roomId),
        customerName,
        customerAvatar: avatarSource,
        lastMessage: lastMsg,
        time: timeStr,
        unreadCount: unread,
        isOnline: Boolean(item.is_online || item.online || partnerUser?.is_online || partnerUser?.online),
        toUserId: toUserId ? String(toUserId) : undefined,
      };
    });
  };

  // Cập nhật state danh sách phòng chat
  const processRoomList = (rawItems: any[], reqOffset: number) => {
    const parsed = parseRoomListResponse(rawItems);
    const sizeResponse = rawItems.length;

    console.log(
      `[WorkChatTab] processRoomList: size=${sizeResponse}, reqOffset=${reqOffset}`,
    );

    if (reqOffset === 0) {
      setConversations(parsed);
      offsetRef.current = 0;
      setOffset(0);
    } else {
      setConversations(prev => {
        const existingIds = new Set(prev.map(t => t.roomId || t.id));
        const newItems = parsed.filter(t => !existingIds.has(t.roomId || t.id));
        return [...prev, ...newItems];
      });
      offsetRef.current = reqOffset;
      setOffset(reqOffset);
    }

    const isEnd = sizeResponse < PAGINATION.ITEMS_10;
    setFinalLoad(isEnd);
    finalLoadRef.current = isEnd;
  };

  // Lấy danh sách phòng chat qua API REST với fq/fp: 'type:1-1'
  const getListRoomApi = async (reqOffset: number) => {
    try {
      requestedOffsetRef.current = reqOffset;
      const res: any = await ApiService.getListRoom({
        limit: PAGINATION.ITEMS_10,
        offset: reqOffset,
        fq: 'type:1-1',
      });
      const rawItems: any[] = (Array.isArray(res?.data?.items) && res.data.items) || [];
      processRoomList(rawItems, reqOffset);
    } catch (e) {
      console.log('[WorkChatTab] getListRoomApi REST error:', e);
    } finally {
      setFirstRender(false);
      setRefreshing(false);
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
      isRefreshingRef.current = false;
    }
  };

  const onRefresh = () => {
    if (isRefreshingRef.current || isLoadingMoreRef.current) return;
    isRefreshingRef.current = true;
    offsetRef.current = 0;
    requestedOffsetRef.current = 0;
    finalLoadRef.current = false;
    setFinalLoad(false);
    setOffset(0);
    setRefreshing(true);
    getListRoomApi(0);
  };

  const handleLoadMore = () => {
    if (
      finalLoadRef.current ||
      isLoadingMoreRef.current ||
      isRefreshingRef.current ||
      firstRender ||
      refreshing
    ) {
      return;
    }

    const nextOffset = offsetRef.current + PAGINATION.ITEMS_10;
    isLoadingMoreRef.current = true;
    setLoadingMore(true);
    getListRoomApi(nextOffset);
  };

  useEffect(() => {
    // Kết nối socket ngầm để hỗ trợ realtime messages & room events
    if (!socketService.isConnected()) {
      socketService.connect().catch(err => {
        console.log('[WorkChatTab] socket connect error:', err);
      });
    }

    const handleRoomList = (res: any) => {
      try {
        const rawItems: any[] =
          (Array.isArray(res) && res) ||
          (Array.isArray(res?.items) && res.items) ||
          (Array.isArray(res?.data?.items) && res.data.items) ||
          (Array.isArray(res?.data) && res.data) ||
          (Array.isArray(res?.result?.items) && res.result.items) ||
          [];
        if (rawItems.length > 0) {
          processRoomList(rawItems, requestedOffsetRef.current);
        }
      } catch (err) {
        console.log('[WorkChatTab] handleRoomList socket error:', err);
      }
    };

    const handleNewMessage = () => {
      getListRoomApi(0);
    };

    const handleRoomDeleted = (deletedData: any) => {
      const targetId =
        typeof deletedData === 'string'
          ? deletedData
          : deletedData?.roomId || deletedData?.room || deletedData?.id;
      if (!targetId) return;
      setConversations(prev =>
        prev.filter(c => (c.roomId || c.id) !== targetId),
      );
    };

    socketService.on('room:list', handleRoomList);
    socketService.on('message', handleNewMessage);
    socketService.on('createRoom', handleNewMessage);
    socketService.on('deleteRoom', handleRoomDeleted);

    // Initial fetch qua REST API
    offsetRef.current = 0;
    requestedOffsetRef.current = 0;
    finalLoadRef.current = false;
    isLoadingMoreRef.current = false;
    isRefreshingRef.current = false;
    setOffset(0);
    setFinalLoad(false);
    setFirstRender(true);
    getListRoomApi(0);

    return () => {
      socketService.off('room:list', handleRoomList);
      socketService.off('message', handleNewMessage);
      socketService.off('createRoom', handleNewMessage);
      socketService.off('deleteRoom', handleRoomDeleted);
    };
  }, []);

  // Tự động làm mới danh sách khi màn hình được focus trở lại
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListRoomApi(0);
    });
    return unsubscribe;
  }, [navigation]);

  // Tìm kiếm với changeAlias chuẩn DoctorNetwork
  const filteredConversations = conversations.filter(item => {
    if (!chatSearchKeyword.trim()) return true;
    const itemData = changeAlias(item.customerName || '').toLowerCase();
    const lastMsgData = changeAlias(item.lastMessage || '').toLowerCase();
    const textData = changeAlias(chatSearchKeyword).toLowerCase();
    return itemData.includes(textData) || lastMsgData.includes(textData);
  });

  const handleDeleteConversation = (item: ConversationItem) => {
    const roomId = item.roomId || item.id;
    if (!roomId) return;
    Alert.alert(
      t('communityChat.setting.Delete1vs1', 'Xóa cuộc trò chuyện'),
      t(
        'chat.deleteConfirm',
        `Bạn có chắc chắn muốn xóa cuộc trò chuyện với ${item.customerName}?`,
      ),
      [
        { text: t('common.cancel', 'Hủy'), style: 'cancel' },
        {
          text: t('common.delete', 'Xóa'),
          style: 'destructive',
          onPress: () => {
            socketService.emitDeleteRoom(roomId);
            setConversations(prev =>
              prev.filter(c => (c.roomId || c.id) !== roomId),
            );
          },
        },
      ],
    );
  };

  const _renderLoadingFooter = () => {
    if (loadingMore && !finalLoad) {
      return (
        <View style={{ paddingVertical: 14, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="small" color={colors.primary || '#19A2A7'} />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.chatListContainer}>
      {/* Search bar */}
      <View style={styles.chatSearchWrapper}>
        <IconX
          type="ionicons"
          name="search-outline"
          size={18}
          color={colors.c98A2B3 || '#98A2B3'}
        />
        <TextInput
          style={styles.chatSearchInput}
          placeholder={t('partnerWork.searchChatPlaceholder', 'Tìm kiếm cuộc trò chuyện...')}
          placeholderTextColor={colors.c98A2B3 || '#98A2B3'}
          value={chatSearchKeyword}
          onChangeText={setChatSearchKeyword}
        />
        {chatSearchKeyword.length > 0 && (
          <TouchableOpacity
            onPress={() => setChatSearchKeyword('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <IconX
              type="ionicons"
              name="close-circle"
              size={18}
              color={colors.c98A2B3 || '#98A2B3'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Conversations FlatList */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item, index) => item.roomId || item.id || String(index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.convListContent,
          filteredConversations.length === 0 && { flexGrow: 1, justifyContent: 'center' },
        ]}
        onEndReachedThreshold={0.3}
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary || '#19A2A7']}
            tintColor={colors.primary || '#19A2A7'}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            activeOpacity={0.7}
            onPress={() =>
              onOpenChat(
                item.customerName,
                item.customerAvatar,
                item.roomId || item.id,
                item.toUserId,
              )
            }
            onLongPress={() => handleDeleteConversation(item)}
          >
            <View style={styles.convAvatarWrapper}>
              <Image
                source={item.customerAvatar || images.common.img_default}
                style={styles.convAvatar}
              />
              {item.isOnline && <View style={styles.convOnlineDot} />}
            </View>

            <View style={styles.convInfo}>
              <View style={styles.convNameRow}>
                <CText style={styles.convName} numberOfLines={1}>
                  {item.customerName}
                </CText>
                {!!item.time && <CText style={styles.convTime}>{item.time}</CText>}
              </View>

              <View style={styles.convMessageRow}>
                <CText
                  style={[
                    styles.convSnippet,
                    item.unreadCount && item.unreadCount > 0
                      ? styles.convSnippetUnread
                      : undefined,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage || t('partnerWork.startChatPrompt', 'Bắt đầu cuộc trò chuyện')}
                </CText>
                {item.unreadCount && item.unreadCount > 0 ? (
                  <View style={styles.convUnreadBadge}>
                    <CText style={styles.convUnreadText}>
                      {item.unreadCount}
                    </CText>
                  </View>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          firstRender ? (
            <View style={styles.chatEmptyStateContainer}>
              <ActivityIndicator size="large" color={colors.primary || '#19A2A7'} />
              <CText style={[styles.chatEmptyStateSubtitle, { marginTop: 14 }]}>
                {t('partnerWork.loadingChat', 'Đang tải danh sách cuộc trò chuyện...')}
              </CText>
            </View>
          ) : chatSearchKeyword.trim().length > 0 ? (
            <View style={styles.chatEmptyStateContainer}>
              <CEmptySearch
                title={`${t('partnerWork.searchEmptyChat', 'Không tìm thấy cuộc trò chuyện với')} "${chatSearchKeyword}"`}
                isSmall
              />
            </View>
          ) : (
            <View style={styles.chatEmptyStateContainer}>
              <View style={styles.chatEmptyIconCircle}>
                <IconX
                  type="ionicons"
                  name="chatbubbles-outline"
                  size={40}
                  color={colors.primary || '#19A2A7'}
                />
              </View>
              <CText style={styles.chatEmptyStateTitle}>
                {t('partnerWork.emptyChatTitle', 'Chưa có cuộc trò chuyện nào')}
              </CText>
              <CText style={styles.chatEmptyStateSubtitle}>
                {t('partnerWork.emptyChatSubtitle', 'Các cuộc trò chuyện với khách hàng sẽ xuất hiện tại đây khi bạn nhận việc hoặc bắt đầu chat.')}
              </CText>
              <TouchableOpacity
                style={styles.chatReloadBtn}
                activeOpacity={0.7}
                onPress={onRefresh}
              >
                <IconX
                  type="ionicons"
                  name="reload-outline"
                  size={16}
                  color={colors.white}
                />
                <CText style={styles.chatReloadBtnText}>{t('partnerWork.reload', 'Tải lại')}</CText>
              </TouchableOpacity>
            </View>
          )
        }
        ListFooterComponent={_renderLoadingFooter}
      />
    </View>
  );
};
