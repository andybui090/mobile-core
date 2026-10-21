// import {
//   CHeader,
//   IconType,
//   IconX,
//   ImageHelper,
//   Toast,
//   Wrapper,
// } from '@/components';
// import {
//   images,
//   screenStyles,
//   removeDuplicates,
//   showToast,
//   fonts,
//   timeDifferenceV2,
//   ScreenWidth,
// } from '@/configs';
// import { PAGINATION } from '@/constants';
// import { AppContext } from '@/contexts';
// import {
//   getListHistoryChat,
//   resetMessages,
//   resetUserDisconnect,
// } from '@/redux/slices/socketioSlice';
// import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
// import { CLoading, Container, CText, Row } from '@/utils';
// import { makeStyles, useTheme } from '@rneui/themed';
// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   Image,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   View,
// } from 'react-native';
// import {
//   Bubble,
//   Composer,
//   GiftedChat,
//   IMessage,
//   InputToolbar,
//   Message,
//   MessageText,
//   Send,
// } from 'react-native-gifted-chat';
// import { filterBadWords } from './functions';
// import socketService from '@/socketio';
// import { store } from '@/redux/store';
// import moment from 'moment';
// // import { MediaLocal } from './modal';

// const useStyles = makeStyles(({ colors }) => ({
//   avatarListMember40: {
//     width: 40,
//     height: 40,
//     left: 4,
//     overflow: 'hidden' as const,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     overflow: 'hidden' as const,
//     borderWidth: 1,
//     borderColor: colors.cF2F4F7,
//     backgroundColor: colors.cEAECF0,
//   },
//   inputToolbar: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderTopWidth: 1,
//     borderTopColor: colors.cF9FAFB,
//   },
//   inputRow: {
//     alignItems: 'flex-end' as const,
//   },
//   microphoneButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: colors.primary,
//     alignItems: 'center' as const,
//     justifyContent: 'center' as const,
//     marginRight: 8,
//   },
//   composerContainer: {
//     flex: 1,
//     flexDirection: 'row' as const,
//     alignItems: 'flex-end' as const,
//     minHeight: 44,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: colors.cEAECF0,
//     paddingHorizontal: 8,
//   },
//   composer: {
//     flex: 1,
//     color: colors.c101828,
//     fontSize: 15,
//     lineHeight: 22,
//     marginLeft: 6,
//     marginRight: 4,
//     marginTop: 8,
//     marginBottom: 8,
//     paddingTop: 0,
//     paddingBottom: 0,
//     fontFamily: fonts.inter,
//   },
//   attachmentButton: {
//     width: 32,
//     height: 42,
//     alignItems: 'center' as const,
//     justifyContent: 'center' as const,
//   },
//   sendButton: {
//     width: 44,
//     height: 44,
//     alignItems: 'center' as const,
//     justifyContent: 'center' as const,
//     marginLeft: 4,
//   },
//   avatar60: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     overflow: 'hidden' as const,
//     borderWidth: 1,
//     borderColor: colors.cF2F4F7,
//     backgroundColor: colors.cEAECF0,
//   },
//   bottomgoback: {
//     position: 'absolute' as const,
//     bottom: 120,
//     right: 8,
//   },
//   shadowGoback: {
//     borderRadius: 15,
//     borderColor: '#d3dadb',
//     ...screenStyles.shadow,
//     overflow: 'hidden' as const,
//   },
//   iconBack: { left: 4, top: 4, position: 'absolute', zIndex: 1 },
//   avatarDot: {
//     position: 'absolute' as const,
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     bottom: 3,
//     right: -1,
//     backgroundColor: colors.c12B76A,
//     zIndex: 1,
//   },
// }));

// const appBgChat = {
//   bgLeftColor: '#EAECF0',
//   bgRightColor: '#D0F0FF',
//   txtLeftColor: '#101828',
//   txtRightColor: '#101828',
// };

// const ChatScreen: React.FC<any> = ({ navigation, route }: any) => {
//   const styles = useStyles();
//   const {
//     theme: { colors },
//   } = useTheme();

//   const { i18n } = useTranslation();

//   const { t } = useTranslation();

//   const toastEl = useRef<any>(null);

//   const dispatch = useAppDispatch();

//   const { user, isDoctor, isNurse } = useContext(AppContext);

//   const {
//     listHistoryChat,

//     socketmessage,
//     socketUserOnline,
//     socketUserDisconnect,
//     // listMemberGroup,
//     // getRequestFriendInvited,
//     // getRequestFriendWaiting,
//     // getRequestFriend,
//     // listEmoji,
//     // currentToChatInfo,
//     // dataCompleteChatPremium,
//   } = useAppSelector(state => state.socketioReducer);

//   // -------------------------------
//   // STATE
//   // -------------------------------

//   const [item] = useState<any>(route?.params?.item || {});

//   const [firstRender, setFirstRender] = useState<boolean>(true);
//   const [offset, setOffset] = useState(0);
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [messagesPin, setMessagesPin] = useState<any>([]);
//   const [listHistoryChatRoom, setListHistoryChatRoom] = useState<any[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [finalLoad, setFinalLoad] = useState(false);
//   const [replyArrId, setReplyArrId] = useState<any>([]);
//   const [idMessageAll, setIdMessageAll] = useState<any>('');
//   const [showMessReply, setShowMessReply] = useState<boolean>(false);

//   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

//   const [isOnline, setIsOnline] = useState<boolean>(false);
//   const [timeUserOnl, setTimeUserOnl] = useState<number>(0);

//   const [textMessages, setTextMessages] = useState<any>('');

//   const [isOnlyView, setIsOnlyView] = useState(true);

//   const [showModalMedia, setShowModalMedia] = useState<boolean>(false);

//   useEffect(() => {
//     const checkPermisionUser = () => {
//       if (item.status == 2) {
//         setIsOnlyView(true);
//         return;
//       }
//       const status = user.personalization?.status;
//       if (isDoctor) {
//         if (status == 1 || isNurse) {
//           setIsOnlyView(false);
//         }
//       } else {
//         if (item.is_chat == 1) {
//           setIsOnlyView(false);
//         }
//       }
//     };
//     checkPermisionUser();
//   }, [user.personalization, item]);

//   useEffect(() => {
//     if (Platform.OS !== 'ios') return;

//     const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
//       setIsKeyboardVisible(true);
//     });
//     const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
//       setIsKeyboardVisible(false);
//     });

//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);

//   const getListHistoryChatApi = (_offset: number) => {
//     const params = {
//       // start: 1712730477270,
//       offset: _offset,
//       limit: PAGINATION.ITEMS_10,
//     };
//     dispatch(
//       getListHistoryChat({
//         id: item.id,
//         data: params,
//       }),
//     );
//   };

//   useEffect(() => {
//     // DS lich su chat
//     getListHistoryChatApi(0);
//   }, []);

//   useEffect(() => {
//     const proccessAPIListMsgChatHistory = () => {
//       const { loading, data, error } = listHistoryChat;
//       if (!loading) {
//         if (data) {
//           const newItems = data.items || [];
//           const sizeResponse = newItems.length;
//           // console.log(
//           //   '🚀 ~ proccessAPIListMsgChatHistory ~ sizeResponse:',
//           //   sizeResponse,
//           // );
//           if (offset === 0) {
//             setListHistoryChatRoom(newItems);
//             let arr = [...newItems];
//             let coverntArr = [];
//             let replyIdArr = [];
//             let arrMessPin = [];
//             let idChat = [];
//             let idChatuser = [];
//             for (let i = 0; i < arr.length; i++) {
//               if (arr[i].type !== 'live') {
//                 if (arr[i].user_id === user.id) {
//                   idChatuser = arr[i].user_id;
//                 } else {
//                   idChat = arr[i].user_id;
//                 }
//                 const itemUser = {
//                   _id: arr[i].id,
//                   text: arr[i].content,
//                   createdAt: arr[i].created_at,
//                   avatar: arr[i].avatar ?? '',
//                   room_id: arr[i].room_id,
//                   name: arr[i].full_name,
//                   type: arr[i].type,
//                   reply_id: arr[i].reply_id,
//                   is_pin: arr[i].is_pin,
//                   is_emoji: arr[i].emotions
//                     ? arr[i]?.emotions[arr[i]?.emotions?.length - 1]
//                     : undefined,
//                   emotions: arr[i]?.emotions ?? [],
//                   count_emoji: 0,
//                   // system: true,
//                   user: {
//                     _id: arr[i].user_id === user.id ? idChatuser : idChat,
//                     name: user.full_name,
//                     type: arr[i].type,
//                   },
//                 };
//                 if (arr[i].reply_id !== null) {
//                   replyIdArr.push(arr[i]);
//                 }
//                 coverntArr.push(itemUser);
//                 if (
//                   arr[i].is_pin === 0 &&
//                   arr[i].content !== '{community.chat.recall}'
//                 ) {
//                   arrMessPin.push(itemUser);
//                 }
//                 setMessagesPin(removeDuplicates(arrMessPin));
//                 setMessages(removeDuplicates(coverntArr));
//                 const result = coverntArr.filter(itemA =>
//                   replyIdArr.some(itemB => itemA._id === itemB.reply_id),
//                 );
//                 setReplyArrId(result);
//               }
//             }
//           }
//         } else if (error) {
//         }
//       }
//     };
//     proccessAPIListMsgChatHistory();
//   }, [listHistoryChat]);

//   useEffect(() => {
//     const proccessSocketMsg = () => {
//       const { loading, data, error } = socketmessage;
//       console.log('🚀 ~ proccessSocketMsg ~ socketmessage:', socketmessage);
//       if (!loading) {
//         if (data) {
//         } else if (error) {
//         }
//       }
//     };
//     proccessSocketMsg();
//   }, [socketmessage]);

//   useEffect(() => {
//     const processAPIListRoom = async () => {
//       const { loading, data, error } = socketUserDisconnect;
//       if (!loading) {
//         if (data) {
//           const newItems = data.disconnects || [];
//           const userOnline = newItems.filter((el: any) => el.id == item.to);
//           if (userOnline.length > 0) {
//             setTimeUserOnl(userOnline[0].time || 0);
//             setIsOnline(false);
//           }
//         } else if (error) {
//           setTimeUserOnl(0);
//           setIsOnline(false);
//         }
//       }
//     };
//     processAPIListRoom();
//   }, [socketUserDisconnect]);

//   useEffect(() => {
//     const processCheckUserOnline = () => {
//       // Kiem tra user co online hay khong
//       const { loading, data, error } = socketUserOnline;
//       // console.log("🚀 ~ processCheckUserOnline ~ data:", data)
//       if (!loading) {
//         if (data) {
//           const newItems = data.users || [];
//           const userOnline = newItems.filter((el: any) => el.userId == item.to);
//           if (userOnline.length > 0) {
//             setIsOnline(true);
//           }
//           // setListUserOnline(newItems);
//           store.dispatch(resetUserDisconnect(null));
//           // setFirstRender(false);
//           setRefreshing(false);
//         } else {
//           setIsOnline(false);
//           // setListUserOnline([]);
//         }
//       }
//     };
//     processCheckUserOnline();
//   }, [socketUserOnline]);

//   // -------------------------------
//   // ACTION
//   // -------------------------------
//   const handleGoback = () => {
//     navigation.goBack();
//   };

//   const handleProfileDoctor = () => {
//     // navigation.navigate(mainRoute.channelDetailScreen, {
//     //   doctorId: item.to,
//     // });
//   };

//   const onSend = useCallback((newMessages: IMessage[] = []) => {
//     console.log('🚀 ~ ChatScreen ~ item.type:', item.type);
//     if (newMessages[0]?.text.toString() === messages[0]?.text.toString()) {
//       showToast(
//         toastEl,
//         t(
//           'communityChat.message.duplicate',
//           'Nội dung chat bị trùng, vui lòng nhập nội dung khác',
//         ),
//         1500,
//       );
//       return;
//     }
//     const _badWords = t('common.badwords').split(',');
//     if (newMessages) {
//       newMessages[0].text = filterBadWords(newMessages[0].text, _badWords);
//     }
//     setIdMessageAll(newMessages[0]._id);
//     if (showMessReply) {
//     } else {
//       setMessages(previousMessages =>
//         GiftedChat.append(previousMessages, newMessages),
//       );
//       if (item.type === '1-1') {
//         socketService.emitMessageSocketUser(
//           newMessages[0].text,
//           'text',
//           item.id,
//           item.id,
//           newMessages[0]._id + '.text',
//         );
//         store.dispatch(resetMessages(null));
//       } else {
//         socketService.emitMessageSocketGroup(
//           newMessages[0].text,
//           'text',
//           item.id,
//           newMessages[0]._id + '.text',
//         );
//         store.dispatch(resetMessages(null));
//       }
//     }
//   }, []);

//   const handlePhoto = () => {
//     setShowModalMedia(true);
//   };

//   const onSendImgVideo = () => {

//   }

//   // -------------------------------
//   // RENDER UI
//   // -------------------------------
  
//   const renderErrorImage = () => {
//     return (
//       <Image
//         source={images.global.no_avatar}
//         style={screenStyles.box30}
//         resizeMode="contain"
//       />
//     );
//   };

//   const renderLeftHead = () => {
//     return (
//       <View style={screenStyles.leftWrapper}>
//         <Row start>
//           <Pressable
//             hitSlop={screenStyles.hitSlop20}
//             onPress={() => handleGoback()}
//           >
//             <IconX
//               type={IconType.IONICONS}
//               name={'chevron-back'}
//               color={colors.c667085}
//               size={26}
//             />
//           </Pressable>
//           <View style={{ width: 40, height: 40 }}>
//             <Pressable
//               style={styles.avatar}
//               onPress={() => handleProfileDoctor()}
//             >
//               <ImageHelper
//                 source={{ uri: item.thumbnail }}
//                 renderErrorImage={renderErrorImage}
//               />
//             </Pressable>
//             {isOnline ? <View style={styles.avatarDot} /> : null}
//           </View>

//           <View style={[screenStyles.flex1, screenStyles.pH10]}>
//             <CText h5 w700 color={colors.c101828} numberOfLines={2}>
//               {item.title}
//             </CText>
//             {isOnline ? (
//               <CText h56 color={colors.c33353A}>
//                 {t('communityChat.chat.title1vs1')}
//               </CText>
//             ) : timeUserOnl > 0 ? (
//               <CText h56 color={colors.c33353A}>
//                 {`${t('communityChat.chat.titleOnline')} ` +
//                   timeDifferenceV2(t, timeUserOnl)}
//               </CText>
//             ) : null}
//           </View>
//         </Row>
//       </View>
//     );
//   };

//   const renderSend = (props: any) => {
//     const canSend = Boolean(props.text?.trim());

//     return (
//       <Send
//         {...props}
//         isSendButtonAlwaysVisible
//         sendButtonProps={{ ...props.sendButtonProps, disabled: !canSend }}
//         containerStyle={styles.sendButton}
//       >
//         <Image
//           source={canSend ? images.chat.ic_send : images.chat.ic_send_dis}
//           style={screenStyles.box30}
//           resizeMode="contain"
//         />
//       </Send>
//     );
//   };

//   const renderInputToolbar = (props: any) => {
//     return (
//       <InputToolbar
//         {...props}
//         containerStyle={styles.inputToolbar}
//         primaryStyle={styles.inputRow}
//         renderActions={() => (
//           <Pressable
//             accessibilityRole="button"
//             accessibilityLabel="Ghi âm"
//             style={styles.microphoneButton}
//           >
//             <IconX
//               type={IconType.IONICONS}
//               name="mic-outline"
//               size={28}
//               color={colors.white}
//             />
//           </Pressable>
//         )}
//         renderComposer={composerProps => (
//           <View style={styles.composerContainer}>
//             <Composer
//               {...composerProps}
//               textInputProps={{
//                 ...composerProps.textInputProps,
//                 placeholder: t('communityChat.chat.input'),
//                 placeholderTextColor: colors.c667085,
//                 style: [composerProps.textInputProps?.style, styles.composer],
//               }}
//             />
//             <Pressable
//               accessibilityRole="button"
//               accessibilityLabel="Chọn ảnh"
//               style={styles.attachmentButton}
//               onPress={handlePhoto}
//             >
//               <IconX
//                 type={IconType.IONICONS}
//                 name="image-outline"
//                 size={24}
//                 color={colors.c667085}
//               />
//             </Pressable>
//             <Pressable
//               accessibilityRole="button"
//               accessibilityLabel="Đính kèm tệp"
//               style={styles.attachmentButton}
//             >
//               <IconX
//                 type={IconType.IONICONS}
//                 name="attach-outline"
//                 size={26}
//                 color={colors.c667085}
//               />
//             </Pressable>
//           </View>
//         )}
//         renderSend={renderSend}
//       />
//     );
//   };

//   const renderDay = (props: any) => {
//     const { currentMessage } = props;
//     if (!currentMessage || !currentMessage.createdAt) {
//       return null; // Don't render if there's no date
//     }
//     const dateText = moment(currentMessage.createdAt).format(
//       'dddd, DD MMMM YYYY',
//     );
//     return (
//       <View style={{ alignItems: 'center', marginVertical: 5 }}>
//         <CText h56 w500 color={colors.cb2b2b2}>
//           {dateText}
//         </CText>
//       </View>
//     );
//   };

//   const renderMessageImage = (props: any) => {
//     return null;
//   };

//   const renderMessageVideo = (props: any) => {
//     return null;
//   };

//   const renderMessageText = (props: any) => {
//     return (
//       <View>
//         <MessageText
//           {...props}
//           textStyle={{
//             left: { color: appBgChat.txtLeftColor },
//             right: { color: appBgChat.txtRightColor },
//           }}
//         />
//       </View>
//     );
//   };

//   const renderCustomBubble = (props: any) => {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             backgroundColor: appBgChat.bgRightColor,
//           },
//           left: {
//             backgroundColor: appBgChat.bgLeftColor,
//           },
//         }}
//         renderMessageText={renderMessageText}
//       />
//     );
//   };

//   const renderMessage = (props: any) => {
//     return <Message {...props} renderBubble={renderCustomBubble} />;
//   };

//   const renderContent = () => {
//     return (
//       <Container>
//         <GiftedChat
//           keyboardAvoidingViewProps={{ enabled: Platform.OS !== 'ios' }}
//           locale={i18n.language}
//           messages={messages}
//           onSend={onSend}
//           user={{
//             _id: user?.id,
//             name: user?.full_name,
//             avatar: user?.personalization?.avatar,
//           }}
//           renderInputToolbar={renderInputToolbar}
//           renderDay={renderDay}
//           renderMessage={renderMessage}
//           renderLoading={() => <CLoading />}
//         />
//       </Container>
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       style={screenStyles.flex1}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       enabled={Platform.OS === 'ios'}
//     >
//       <Wrapper safeBottom={Platform.OS === 'ios' && !isKeyboardVisible}>
//         <CHeader
//           leftComponent={renderLeftHead()}
//           rightComponentDisable
//           isBorderBottom
//         />
//         {renderContent()}
//         {/* {showModalMedia && (
//           <MediaLocal
//             isVisible={showModalMedia}
//             hideModal={() => setShowModalMedia(false)}
//             onSendImgVideo={onSendImgVideo}
//           />
//         )} */}
//         <Toast ref={toastEl} position={'center'} />
//       </Wrapper>
//     </KeyboardAvoidingView>
//   );
// };

// export default ChatScreen;
