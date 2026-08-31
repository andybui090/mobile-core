import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';

interface Message {
  id: string;
  sender: 'user' | 'nurse';
  text: string;
  avatar?: any;
}

const MESSAGES: Message[] = [
  {
    id: '4',
    sender: 'nurse',
    text: 'Dạ vâng, hẹn gặp lại chị ạ',
    avatar: images.common.img_default,
  },
  {
    id: '3',
    sender: 'user',
    text: 'Em gửi nhen, phòng hậu sản, tầng 3, bệnh viện An Gia, 44/7 đường n4, p. Tân Hưng, quận 7, TP.HCM.\nEm cảm ơn nhen',
  },
  {
    id: '2',
    sender: 'nurse',
    text: 'Dạ okie chị, mai em sẽ tới sớm, lúc 15h15 nha ạ, chị cho em xin số phòng bệnh nhé',
    avatar: images.common.img_default,
  },
  {
    id: '1',
    sender: 'user',
    text: 'Hi chị Thúy Ngọc, em vừa book lịch chăm mẹ bé ở bệnh viện lúc 15h30 ngày mai, em sẽ gửi lại địa chỉ chính xác, có gì Ngọc đến sớm trước 15p giúp em để tiện trao đổi về bé nhé chị',
  },
];

export const BookingChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
    };
    setMessages(prev => [newMessage, ...prev]);
    setInputText('');
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.nurseRow]}>
        {!isUser && (
          <ImageHelper
            source={item.avatar || images.common.img_default}
            style={styles.nurseAvatar}
          />
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.nurseBubble]}>
          <CText style={styles.messageText}>
            {item.text}
          </CText>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>

        <View style={styles.headerProfile}>
          <View style={styles.avatarWrapper}>
            <ImageHelper
              source={images.common.img_default}
              style={styles.headerAvatar}
            />
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.headerTextContainer}>
            <CText style={styles.headerName}>Điều dưỡng Thúy Ngọc</CText>
            <CText style={styles.headerStatus}>Đang hoạt động</CText>
          </View>
        </View>

        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
          <IconX type="ionicons" name="ellipsis-horizontal" size={22} color="#1D2939" />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        <View style={styles.inputBar}>
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
              <IconX type="ionicons" name="image-outline" size={22} color="#667085" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.innerActionBtn} activeOpacity={0.7}>
              <IconX type="ionicons" name="attach-outline" size={22} color="#667085" />
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
              color={inputText.trim() ? '#0D9488' : '#CBD5E1'}
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  backBtn: {
    padding: 4,
    marginRight: 6,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
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
    borderRadius: 6,
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
    padding: 4,
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
  userRow: {
    justifyContent: 'flex-end',
  },
  nurseRow: {
    justifyContent: 'flex-start',
  },
  nurseAvatar: {
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
  userBubble: {
    backgroundColor: '#D1F0EA',
  },
  nurseBubble: {
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
    paddingVertical: 10,
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
