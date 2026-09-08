import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import ImagePicker from 'react-native-image-crop-picker';
import { IconX, ToggleSwitch } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import socketService from '@/socketio';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text?: string;
  image?: string;
  time: string;
  status?: 'sent' | 'delivered' | 'seen';
  avatar?: any;
  replyTo?: {
    id: string;
    sender: 'me' | 'other';
    text?: string;
    image?: string;
  };
}

const SUGGESTED_GREETINGS = ['👋 Xin chào, rất vui được hỗ trợ bạn!'];

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  // Unified params supporting customer / partner / nurse naming
  const targetName =
    route.params?.customerName ||
    route.params?.partnerName ||
    route.params?.name ||
    'Thiên Ân';

  const targetAvatar =
    route.params?.customerAvatar ||
    route.params?.partnerAvatar ||
    route.params?.avatar ||
    images.common.avatar_thien_an;

  const roomId =
    route.params?.roomId || `room_1v1_${route.params?.id || 'default'}`;

  const [messages, setMessages] = useState<ChatMessage[]>(
    route.params?.initialMessages || [],
  );
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingMessage, setReplyingMessage] = useState<ChatMessage | null>(null);

  // Modals state
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeActionMessage, setActiveActionMessage] = useState<ChatMessage | null>(null);

  // Chat settings state
  const [isPinned, setIsPinned] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Socket setup: auto connect, seen message & listen to incoming messages
  useEffect(() => {
    socketService.connect();
    socketService.emitSeenMessage(roomId);

    const handleIncomingMessage = (data: any) => {
      if (data && (data.room === roomId || !data.room)) {
        const textContent =
          typeof data.content === 'string'
            ? data.content
            : data.text || '';
        const incoming: ChatMessage = {
          id: data.id || Date.now().toString(),
          sender: data.from === 'me' ? 'me' : 'other',
          text: textContent || undefined,
          image: data.image || undefined,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'seen',
          avatar: targetAvatar,
        };
        setMessages(prev => [incoming, ...prev]);
      }
    };

    const handleTyping = (data: any) => {
      if (data && (data.room === roomId || !data.room)) {
        setIsTyping(!!data.isTyping);
      }
    };

    socketService.on('message', handleIncomingMessage);
    socketService.on('typing', handleTyping);
    return () => {
      socketService.emitSeenMessage(roomId);
      socketService.off('message', handleIncomingMessage);
      socketService.off('typing', handleTyping);
    };
  }, [roomId, targetAvatar]);

  // Action: Send message
  const handleSend = () => {
    if (!inputText.trim() && !selectedImage) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim() || undefined,
      image: selectedImage || undefined,
      time: timeString,
      status: 'sent',
      replyTo: replyingMessage
        ? {
          id: replyingMessage.id,
          sender: replyingMessage.sender,
          text: replyingMessage.text,
          image: replyingMessage.image,
        }
        : undefined,
    };

    setMessages(prev => [newMessage, ...prev]);

    // Gửi tin nhắn qua Socket
    if (inputText.trim()) {
      socketService.emitSendMessage(
        inputText.trim(),
        'text',
        roomId,
        targetName,
        newMessage.id,
      );
    }
    if (selectedImage) {
      socketService.emitSendMessage(
        selectedImage,
        'image',
        roomId,
        targetName,
        newMessage.id,
      );
    }

    setInputText('');
    setSelectedImage(null);
    setReplyingMessage(null);
  };

  // Action: Pick Image
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });
      if (result && result.path) {
        setSelectedImage(result.path);
      }
    } catch (err: any) {
      if (err.code !== 'E_PICKER_CANCELLED') {
        // ignore cancel
      }
    }
  };

  // Action: Long press on a message
  const handleLongPressMessage = (item: ChatMessage) => {
    setActiveActionMessage(item);
  };

  // Action: Delete a single message
  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setActiveActionMessage(null);
  };

  // Action: Clear entire conversation
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
          onPress: () => {
            setMessages([]);
          },
        },
      ],
    );
  };

  // Render: Message Item
  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender === 'me';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => handleLongPressMessage(item)}
        style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}
      >
        {!isMe && (
          <Image
            source={item.avatar || targetAvatar || images.common.avatar_support}
            style={styles.senderAvatar}
          />
        )}

        <View style={[styles.bubbleWrapper, isMe ? styles.myBubbleWrapper : styles.otherBubbleWrapper]}>
          {/* Quoted reply banner inside message bubble */}
          {item.replyTo && (
            <View style={[styles.quotedBubble, isMe ? styles.myQuotedBubble : styles.otherQuotedBubble]}>
              <View style={[styles.quotedAccent, { backgroundColor: isMe ? '#19A2A7' : '#98A2B3' }]} />
              <View style={styles.quotedTextContainer}>
                <CText style={styles.quotedSender}>
                  {item.replyTo.sender === 'me' ? 'Bạn' : targetName}
                </CText>
                {item.replyTo.text ? (
                  <CText numberOfLines={1} style={styles.quotedContent}>
                    {item.replyTo.text}
                  </CText>
                ) : item.replyTo.image ? (
                  <CText numberOfLines={1} style={styles.quotedContent}>
                    [Hình ảnh]
                  </CText>
                ) : null}
              </View>
            </View>
          )}

          {/* Attached image if any */}
          {item.image && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setPreviewImage(item.image!)}
              style={styles.imageMessageContainer}
            >
              <Image source={{ uri: item.image }} style={styles.imageMessage} resizeMode="cover" />
            </TouchableOpacity>
          )}

          {/* Text content */}
          {item.text ? (
            <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
              <CText style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                {item.text}
              </CText>
            </View>
          ) : null}

          {/* Timestamp & Seen status */}
          <View style={[styles.metaRow, isMe ? styles.myMetaRow : styles.otherMetaRow]}>
            <CText style={styles.metaTime}>{item.time}</CText>
            {isMe && (
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
    );
  };

  // Action: Send quick suggested greeting
  const handleSendQuickGreeting = (text: string) => {
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
    };

    setMessages(prev => [newMessage, ...prev]);

    socketService.emitSendMessage(
      text,
      'text',
      roomId,
      targetName,
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
              source={targetAvatar || images.common.avatar_thien_an}
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
              source={targetAvatar || images.common.avatar_thien_an}
              style={styles.headerAvatar}
            />
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.headerTextContainer}>
            <CText style={styles.headerName} numberOfLines={1}>
              {targetName}
            </CText>
            <View style={styles.statusIndicatorRow}>
              <View style={styles.statusDot} />
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
        {messages.length === 0 ? (
          renderEmptyChatState()
        ) : (
          <FlatList
            ref={flatListRef}
            inverted
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              messages.length > 0 ? (
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
                    source={targetAvatar || images.common.avatar_support}
                    style={styles.typingAvatar}
                  />
                  <View style={styles.typingBubble}>
                    <CText style={styles.typingText}>{`${targetName} đang soạn tin...`}</CText>
                  </View>
                </View>
              ) : undefined
            }
          />
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
        {selectedImage && (
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
        )}

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

          {/* Send button */}
          <TouchableOpacity
            style={[
              styles.sendBtn,
              inputText.trim() || selectedImage ? styles.sendBtnActive : styles.sendBtnInactive,
            ]}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={!inputText.trim() && !selectedImage}
          >
            <IconX
              type="ionicons"
              name="paper-plane"
              size={20}
              color={inputText.trim() || selectedImage ? '#FFFFFF' : '#98A2B3'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 1-1 Chat Options Modal (From DoctorNetwork settingChat) */}
      <Modal
        visible={isOptionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOptionModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOptionModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                <View style={styles.modalHandle} />

                {/* Profile Header in Modal */}
                <View style={styles.modalProfileHeader}>
                  <Image
                    source={targetAvatar || images.common.avatar_thien_an}
                    style={styles.modalAvatar}
                  />
                  <CText style={styles.modalProfileName}>{targetName}</CText>
                  <CText style={styles.modalProfileStatus}>Đang hoạt động</CText>
                </View>

                <View style={styles.modalDivider} />

                {/* Option Items */}
                <TouchableOpacity
                  style={styles.modalOptionItem}
                  onPress={() => {
                    setIsOptionModalVisible(false);
                    Alert.alert('Hồ sơ', `Xem thông tin chi tiết của ${targetName}`);
                  }}
                >
                  <View style={styles.modalOptionIconBox}>
                    <IconX type="ionicons" name="person-outline" size={20} color="#344054" />
                  </View>
                  <CText style={styles.modalOptionLabel}>Xem hồ sơ</CText>
                  <IconX type="ionicons" name="chevron-forward" size={18} color="#98A2B3" />
                </TouchableOpacity>

                <View style={styles.modalOptionItem}>
                  <View style={styles.modalOptionIconBox}>
                    <IconX type="ionicons" name="pin-outline" size={20} color="#344054" />
                  </View>
                  <CText style={styles.modalOptionLabel}>Ghim cuộc trò chuyện</CText>
                  <ToggleSwitch
                    size="small"
                    isOn={isPinned}
                    onToggle={val => setIsPinned(val)}
                    onColor="#19A2A7"
                  />
                </View>

                <View style={styles.modalOptionItem}>
                  <View style={styles.modalOptionIconBox}>
                    <IconX type="ionicons" name="notifications-off-outline" size={20} color="#344054" />
                  </View>
                  <CText style={styles.modalOptionLabel}>Tắt thông báo</CText>
                  <ToggleSwitch
                    size="small"
                    isOn={isMuted}
                    onToggle={val => setIsMuted(val)}
                    onColor="#19A2A7"
                  />
                </View>

                <TouchableOpacity
                  style={styles.modalOptionItem}
                  onPress={() => {
                    setIsOptionModalVisible(false);
                    Alert.alert('Báo cáo', 'Cảm ơn phản hồi của bạn. Chúng tôi sẽ kiểm tra.');
                  }}
                >
                  <View style={styles.modalOptionIconBox}>
                    <IconX type="ionicons" name="flag-outline" size={20} color="#344054" />
                  </View>
                  <CText style={styles.modalOptionLabel}>Báo cáo cuộc trò chuyện</CText>
                  <IconX type="ionicons" name="chevron-forward" size={18} color="#98A2B3" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOptionItem}
                  onPress={() => {
                    setIsOptionModalVisible(false);
                    Alert.alert('Chặn người dùng', `Bạn có chắc chắn muốn chặn ${targetName}?`, [
                      { text: 'Hủy', style: 'cancel' },
                      { text: 'Chặn', style: 'destructive' },
                    ]);
                  }}
                >
                  <View style={styles.modalOptionIconBox}>
                    <IconX type="ionicons" name="ban-outline" size={20} color="#344054" />
                  </View>
                  <CText style={styles.modalOptionLabel}>Chặn người dùng</CText>
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
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Message Long Press Action Modal */}
      <Modal
        visible={!!activeActionMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveActionMessage(null)}
      >
        <TouchableWithoutFeedback onPress={() => setActiveActionMessage(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.actionSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <View style={styles.modalHandle} />
                <CText style={styles.actionSheetTitle}>Thao tác với tin nhắn</CText>

                <TouchableOpacity
                  style={styles.actionSheetItem}
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

                <TouchableOpacity
                  style={styles.actionSheetItem}
                  onPress={() => {
                    if (activeActionMessage?.id) {
                      handleDeleteMessage(activeActionMessage.id);
                    }
                  }}
                >
                  <IconX type="ionicons" name="trash-outline" size={20} color="#F04438" />
                  <CText style={[styles.actionSheetLabel, { color: '#F04438' }]}>Xóa tin nhắn</CText>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
          {previewImage ? (
            <Image
              source={{ uri: previewImage }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          ) : null}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Aliases so both PartnerChatScreen and BookingChat can use this unified screen
export const PartnerChatScreen = ChatScreen;
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
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 14,
    backgroundColor: '#EAECF0',
  },
  quotedBubble: {
    flexDirection: 'row',
    backgroundColor: '#F2F4F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 4,
    width: '100%',
  },
  myQuotedBubble: {
    backgroundColor: '#E0F7F5',
  },
  otherQuotedBubble: {
    backgroundColor: '#EAECF0',
  },
  quotedAccent: {
    width: 3,
    borderRadius: 1.5,
    marginRight: 8,
  },
  quotedTextContainer: {
    flex: 1,
  },
  quotedSender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 2,
  },
  quotedContent: {
    fontSize: 12,
    color: '#667085',
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
});
