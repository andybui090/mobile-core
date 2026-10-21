// import { takeLatest } from 'redux-saga/effects';
// import { processAPISaga } from '../function/commonProcess';

// import {
//   //   getCreateBackground,
//   //   getCreateBackgroundCallback,
//   //   getListBackground,
//   //   getListBackgroundCallback,
//   //   getListEmoji,
//   //   getListEmojiCallback,
//   //   getListFriends,
//   //   getListFriendsCallback,
//   getListHistoryChat,
//   getListHistoryChatCallback,
//   //   getListMemberGroup,
//   //   getListMemberGroupCallback,
//   //   getListMemberGroupCallbackChat,
//   //   getListMemberGroupChat,
//   //   getListRooms,
//   //   getListRoomsCallback,
//   //   getListTypeRoom,
//   //   getListTypeRoomCallback,
//   //   getRequestFriendInvitedCallback,
//   //   getRequestFriendInviteds,
//   //   getRequestFriendWaitings,
//   //   getRequestFriendWaitingsCallback,
//   //   getRequestFriends,
//   //   getRequestFriendsCallback,
//   //   getSearchFriend,
//   //   getSearchFriendCallback,
//   //   postMessageSeen,
//   //   postMessageSeenCallback,
//   //   markCompleteChat,
//   //   markCompleteChatCallback,
// } from '@/redux/slices/socketioSlice';
// import ApiService from '@/services/api-base';

// interface actionListHistoryChat {
//   payload: {
//     id: number;
//     data: {
//       start: any;
//       limit: number;
//       offset: number;
//     };
//   };
// }

// // interface actionListRoom {
// //   payload: {
// //     limit: number;
// //     offset: number;
// //   };
// // }

// // interface actionListFriends {
// //   payload: {
// //     limit: number;
// //     offset: number;
// //     s: string;
// //   };
// // }

// // interface actionListMemberChat {
// //   payload: {
// //     id: number;
// //     data: {
// //       start: any;
// //       limit: number;
// //       offset: number;
// //     };
// //   };
// // }

// // interface actionPostMessageSeen {
// //   payload: {
// //     room_id: string;
// //     time: number;
// //   };
// // }

// // interface actionGetRequsetFriend {
// //   payload: {};
// // }

// // interface actionGetRequsetFriendInvited {
// //   payload: {};
// // }
// // interface actionGetRequsetFriendWatting {
// //   payload: {};
// // }

// // interface actionGetSearchFriend {
// //   payload: {
// //     phone: any;
// //   };
// // }

// // interface actionListEmoji {
// //   payload: {};
// // }

// // interface actionListTypeRoom {
// //   payload: {
// //     limit: number;
// //     offset: number;
// //     s: any;
// //   };
// // }

// // interface actionListBackground {
// //   payload: { room_id: string };
// // }

// // interface actionCreateBackground {
// //   payload: {
// //     room_id: any;
// //     image: any;
// //   };
// // }

// // function* fetchListRoom(action: actionListRoom) {
// //   yield* processAPISaga(
// //     ApiService.getListRoom,
// //     action.payload,
// //     getListRoomsCallback,
// //     2,
// //   );
// // }

// // function* fetchListFriends(action: actionListFriends) {
// //   yield* processAPISaga(
// //     ApiService.getListFriends,
// //     action.payload,
// //     getListFriendsCallback,
// //     2,
// //   );
// // }

// function* fetchListHistoryChat(action: actionListHistoryChat) {
//   yield* processAPISaga(
//     ApiService.getListHistoryChat,
//     action.payload,
//     getListHistoryChatCallback,
//   );
// }

// // function* fetchListMemberGroup(action: actionListHistoryChat) {
// //   yield* processAPISaga(
// //     ApiService.getListMemberGroup,
// //     action.payload,
// //     getListMemberGroupCallback,
// //     2,
// //   );
// // }

// // function* fetchListMemberGroupChat(action: actionListMemberChat) {
// //   yield* processAPISaga(
// //     ApiService.getListMemberGroupChat,
// //     action.payload,
// //     getListMemberGroupCallbackChat,
// //     2,
// //   );
// // }

// // function* fetchPostMessageSeen(action: actionPostMessageSeen) {
// //   yield* processAPISaga(
// //     ApiService.postMessageSeen,
// //     action.payload,
// //     postMessageSeenCallback,
// //     3,
// //   );
// // }

// // function* fetchGetRequsetFriend(action: actionGetRequsetFriend) {
// //   yield* processAPISaga(
// //     ApiService.getListRequestFriends,
// //     action.payload,
// //     getRequestFriendsCallback,
// //     2,
// //   );
// // }

// // function* fetchGetRequsetFriendInvited(action: actionGetRequsetFriendInvited) {
// //   yield* processAPISaga(
// //     ApiService.getListRequestFriendsInvited,
// //     action.payload,
// //     getRequestFriendInvitedCallback,
// //     2,
// //   );
// // }

// // function* fetchGetListRequestFriendsWaitting(
// //   action: actionGetRequsetFriendWatting,
// // ) {
// //   yield* processAPISaga(
// //     ApiService.getListRequestFriendsWaitting,
// //     action.payload,
// //     getRequestFriendWaitingsCallback,
// //     2,
// //   );
// // }

// // function* fetchGetListSearchFriends(action: actionGetSearchFriend) {
// //   yield* processAPISaga(
// //     ApiService.getListSearchFriends,
// //     action.payload,
// //     getSearchFriendCallback,
// //     2,
// //   );
// // }

// // function* fetchListEmoji(action: actionListEmoji) {
// //   yield* processAPISaga(
// //     ApiService.getListEmoji,
// //     action.payload,
// //     getListEmojiCallback,
// //     2,
// //   );
// // }

// // function* fetchListTypeRoom(action: actionListTypeRoom) {
// //   yield* processAPISaga(
// //     ApiService.getListTypeRoom,
// //     action.payload,
// //     getListTypeRoomCallback,
// //     2,
// //   );
// // }

// // function* fetchListBackground(action: actionListBackground) {
// //   yield* processAPISaga(
// //     ApiService.getBackground,
// //     action.payload,
// //     getListBackgroundCallback,
// //     2,
// //   );
// // }

// // function* fetchCreateBackground(action: actionCreateBackground) {
// //   yield* processAPISaga(
// //     ApiService.createBackground,
// //     action.payload,
// //     getCreateBackgroundCallback,
// //     3,
// //   );
// // }

// // function* putCompleteChat(action: actionCreateBackground) {
// //   yield* processAPISaga(
// //     ApiService.updateChatPremiumStatus,
// //     action.payload,
// //     markCompleteChatCallback,
// //     3,
// //   );
// // }

// export default [
// //   takeLatest(getListRooms, fetchListRoom),
// //   takeLatest(getListFriends, fetchListFriends),
//   takeLatest(getListHistoryChat, fetchListHistoryChat),
// //   takeLatest(getListMemberGroup, fetchListMemberGroup),
// //   takeLatest(getListMemberGroupChat, fetchListMemberGroupChat),
// //   takeLatest(postMessageSeen, fetchPostMessageSeen),
// //   takeLatest(getRequestFriends, fetchGetRequsetFriend),
// //   takeLatest(getRequestFriendInviteds, fetchGetRequsetFriendInvited),
// //   takeLatest(getRequestFriendWaitings, fetchGetListRequestFriendsWaitting),
// //   takeLatest(getSearchFriend, fetchGetListSearchFriends),
// //   takeLatest(getListEmoji, fetchListEmoji),
// //   takeLatest(getListTypeRoom, fetchListTypeRoom),
// //   takeLatest(getListBackground, fetchListBackground),
// //   takeLatest(getCreateBackground, fetchCreateBackground),
// //   takeLatest(markCompleteChat, putCompleteChat),
// ];
