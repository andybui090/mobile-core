import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';

interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  avatar?: any;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '2',
    sender: 'other',
    text: 'Chào bạn, rất vui khi bạn đã\nchọn dịch vụ của chúng tôi!\nBạn cần hỗ trợ gì?',
    avatar: images.common.avatar_support,
  },
  {
    id: '1',
    sender: 'me',
    text: 'Cho mình hỏi thêm về dịch vụ',
  },
];

export const PartnerChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  const customerName = route.params?.customerName || 'Thiên Ân';
  const customerAvatar =
    route.params?.customerAvatar || images.common.avatar_thien_an;

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
    };
    setMessages(prev => [newMessage, ...prev]);
    setInputText('');
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}>
        {!isMe && (
          <Image
            source={item.avatar || images.common.avatar_support}
            style={styles.senderAvatar}
          />
        )}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <CText style={styles.messageText}>{item.text}</CText>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <IconX
            type="ionicons"
            name="chevron-back"
            size={24}
            color="#1D2939"
          />
        </TouchableOpacity>

        <View style={styles.headerProfile}>
          <View style={styles.avatarWrapper}>
            <Image
              source={customerAvatar || images.common.avatar_thien_an}
              style={styles.headerAvatar}
            />
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.headerTextContainer}>
            <CText style={styles.headerName}>{customerName}</CText>
            <CText style={styles.headerStatus}>Đang hoạt động</CText>
          </View>
        </View>

        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
          <IconX
            type="ionicons"
            name="ellipsis-horizontal"
            size={22}
            color="#1D2939"
          />
        </TouchableOpacity>
      </View>

      {/* Chat Messages Area */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          inverted
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.timeHeader}>
              <CText style={styles.timeText}>09:27</CText>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.inputPill}>
            <TextInput
              placeholder="Nhập tin nhắn"
              placeholderTextColor="#98A2B3"
              value={inputText}
              onChangeText={setInputText}
              style={styles.textInput}
              multiline={false}
            />
            <TouchableOpacity style={styles.innerActionBtn} activeOpacity={0.7}>
              <IconX
                type="ionicons"
                name="image-outline"
                size={22}
                color="#667085"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.innerActionBtn} activeOpacity={0.7}>
              <IconX
                type="ionicons"
                name="attach-outline"
                size={22}
                color="#667085"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={!inputText.trim()}
          >
            <IconX
              type="ionicons"
              name="paper-plane"
              size={24}
              color={inputText.trim() ? (colors.primary || '#19A2A7') : '#CBD5E1'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2F4F7',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#12B76A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
  },
  headerStatus: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  moreBtn: {
    padding: 6,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  timeHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#98A2B3',
    fontWeight: '400',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
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
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  myBubble: {
    backgroundColor: '#C5F2EC',
  },
  otherBubble: {
    backgroundColor: '#F2F4F7',
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: '#1D2939',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  inputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#101828',
    paddingVertical: 0,
    marginRight: 6,
  },
  innerActionBtn: {
    padding: 4,
    marginLeft: 4,
  },
  sendBtn: {
    marginLeft: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PartnerChatScreen;
