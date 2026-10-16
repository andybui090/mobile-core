import { CHeader, IconType, IconX, ImageHelper, Wrapper } from '@/components';
import { getBottomSpace, ifIphoneX, images, screenStyles } from '@/configs';
import { mainRoute } from '@/constants';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Message,
  Send,
} from 'react-native-gifted-chat';
import { useHeaderHeight } from '@react-navigation/elements';
import { AppContext } from '@/contexts';

const useStyles = makeStyles(({ colors }) => ({
  avatarListMember40: {
    width: 40,
    height: 40,
    left: 4,
    overflow: 'hidden' as const,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
}));

const ChatScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { i18n } = useTranslation();

  const { user } = useContext(AppContext);

  const textRef = useRef<any>(null);

  const dispatch = useAppDispatch();

  // keyboardVerticalOffset = distance from screen top to GiftedChat container
  // useHeaderHeight() returns status bar + navigation header height
  const headerHeight = useHeaderHeight();

  // -------------------------------
  // STATE
  // -------------------------------

  const [item, setItem] = useState<any>(route?.params?.item || {});

  const [messages, setMessages] = useState([]);
  const [textMessages, setTextMessages] = useState<any>('');

  // -------------------------------
  // ACTION
  // -------------------------------
  const handleGoback = () => {
    navigation.goBack();
  };

  const handleProfileDoctor = () => {
    // navigation.navigate(mainRoute.channelDetailScreen, {
    //   doctorId: item.to,
    // });
  };

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const handleSend = () => {
    console.log('====handle send');
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box30}
        resizeMode="contain"
      />
    );
  };

  const renderLeftHead = () => {
    return (
      <View style={screenStyles.leftWrapper}>
        <Row start>
          <Pressable
            hitSlop={screenStyles.hitSlop20}
            onPress={() => handleGoback()}
          >
            <IconX
              type={IconType.IONICONS}
              name={'chevron-back'}
              color={colors.c667085}
              size={26}
            />
          </Pressable>
          <Pressable
            style={styles.avatar}
            onPress={() => handleProfileDoctor()}
          >
            <ImageHelper
              source={{ uri: item.thumbnail }}
              renderErrorImage={renderErrorImage}
            />
            {/* {isOnline ? <View style={styles.avatarDot}></View> : null} */}
          </Pressable>
          <View style={[screenStyles.flex1, screenStyles.pH10]}>
            <CText h5 w700 color={colors.c101828} numberOfLines={2}>
              {item.title}
            </CText>
          </View>
        </Row>
      </View>
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        disabled={!props.text.trim() || props.text === '@AI-Helper '}
        containerStyle={{
          paddingBottom: getBottomSpace() + ifIphoneX(-22, 12),
          paddingRight: 4,
          paddingLeft: 6,
        }}
        children={
          <Pressable onPress={handleSend}>
            <Image
              source={
                textMessages !== '' ? images.chat.ic_send : images.chat.ic_send
              }
              style={screenStyles.box48}
            />
          </Pressable>
        }
      ></Send>
    );
  };

  const renderContent = () => {
    return (
      <View
        style={{
          flex: 1,
          paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
        }}
      >
        <GiftedChat
          locale={i18n.language}
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: user?.id,
            name: user?.full_name,
            avatar: user?.personalization?.avatar,
          }}
          // renderSend={renderSend}
          // keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
        />
      </View>
    );
  };

  return (
    <Wrapper>
      <CHeader
        leftComponent={renderLeftHead()}
        rightComponentDisable
        isBorderBottom
      />
      {renderContent()}
    </Wrapper>
  );
};

export default ChatScreen;
