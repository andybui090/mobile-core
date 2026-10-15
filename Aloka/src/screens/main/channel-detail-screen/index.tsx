import {
  APILoading,
  //   BottomSheetReport,
  //   CImgVideoModal,
  IconType,
  IconX,
  ImageHelper,
  //   ModalAgreeFormDN,
  //   ModalAgreeFormDN2Btn,
  Toast,
  Wrapper,
} from '@/components';
import {
  calculateNumberViewLike,
  //   GAEvents,
  //   GALogEvent,
  getBottomSpace,
  getNearValidChatOrderId,
  getNearValidChatPackageId,
  getPackageByChannelId,
  images,
  isIOS,
  keyExtractor,
  MergedPackage,
  mergePackagesByChannel,
  ScreenHeight,
  screenStyles,
  ScreenWidth,
  showToast,
  splitCategory,
} from '@/configs';
import { PAGINATION, STORAGEKEY } from '@/constants';
import { mainRoute } from '@/constants/route_key';
import { AppContext } from '@/contexts';
import {
  getDetailChannel,
  getDetailChannelServicesPackage,
  resetChannelDetail,
  //   getDetailChannelNewsFeed,
  //   getDetailChannelServicesPackage,
  //   getVideoChannel,
  //   resetChannelDetail,
  //   resetChannelVideo,
  //   updateVideoChannelLocal,
} from '@/redux/slices/channelSlice';
// import {
//   getListEmoji,
//   updateCurrentToChatInfo,
// } from '@/redux/slices/communitySlice';
// import {
//   getListReport,
//   postFollowChannel,
//   updateFollowLocal,
// } from '@/redux/slices/homeSlice';
// import {
//   deleteNewsfeed,
//   getNewsfeedOne,
//   postReactions,
//   resetNewsfeedOne,
// } from '@/redux/slices/newsfeedSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
// import {BottomSheetAction} from '@/screens/newsfeed-tab/newsfeed-screen/components';
// import {BottomModalReaction} from '@/screens/newsfeed-tab/newsfeed-screen/components/bottom-modal-reaction';
// import {BottomModalShare} from '@/screens/newsfeed-tab/newsfeed-screen/components/bottom-modal-share';
import { CEmptyData, CLoading, CText, Row } from '@/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';
// import {BottomSheetMenu} from './components/bottom-sheet-menu';
// import {BottomSheetReportChannel} from './components/modal-report-channel';
// import {ModalEditChannel} from './modal/ModalEditChannel';
// import {ModalEditPackage} from './modal/ModalEditPackage';
// import {ModalMenuPkgV2} from './modal/ModalMenuPkgV2';
// import {
//   IntroduceChannel,
//   ListEmptyVideo,
//   ListSeries,
//   NewsfeedItem,
//   VideoItem,
// } from './tabs';
// import {ListEmptyNewsfeed} from './tabs/NewsfeedChannel';
// import {ListEmptyPkg, PackageItem} from './tabs/PackageChannel';
import ApiService from '@/services/api-base';
import { IntroduceChannel, PackageChannel } from './tabs';
import { BottomSheetMenu } from './components/bottom-sheet-menu';
import { getListReport } from '@/redux/slices/globalSlice';
import { BottomSheetReportChannel } from './components/modal-report-channel';
import { BookingSetTime } from './modal/BookingSetTime';
import { ModalEditChannel } from './modal/ModalEditChannel';
import { ModalCreatePackage } from './modal/ModalCreatePackage';
import { ModalMenuPkgV2 } from './modal/ModalMenuPkgV2';
import { ModalEditPackage } from './modal/ModalEditPackage';
// import {ModalCreatePackage} from './modal/ModalCreatePackage';
// import {BookingSetTime} from './modal/BookingSetTime';
// import moment from 'moment';
// import {storeObjectData} from '@/storages';
// import socketService from '@/socketio';
// import AppointmentPickerModal from './modal/AppointmentPicker';

const useStyles = makeStyles(({ colors }) => ({
  btnHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  btnHeaderWrapper: {
    position: 'absolute' as const,
    zIndex: 1,
    width: ScreenWidth,
    paddingHorizontal: 16,
  },
  gradient: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    left: 0,
    height: ScreenHeight * 0.28,
    justifyContent: 'flex-end' as const,
    zIndex: 1,
  },
  btnUnActive: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    width: '48%' as const,
    alignItems: 'center' as const,
  },
  bgRow: {
    borderBottomWidth: 1,
    borderColor: colors.cEAECF0,
    paddingLeft: 16,
    marginTop: 10,
  },
  itemTabWrapper: {
    marginRight: 20,
    paddingVertical: 10,
    alignItems: 'center' as const,
    borderBottomWidth: 1.5,
  },
  btnScrollTopTop: {
    position: 'absolute' as const,
    bottom: getBottomSpace() + 32,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
}));

const HEADER_HEIGHT = ScreenHeight * 0.55;

const GRADIENT_COLORS = [
  'rgba(255, 255, 255, 0)',
  'rgba(255, 255, 255, 0.25)',
  'rgba(255, 255, 255, 0.5)',
  'rgba(255, 255, 255, 0.75)',
  'rgba(255, 255, 255, 1)',
];

const getTabs = (t: any) => [
  { key: 0, label: t('doctorProfile.about') },
  { key: 1, label: t('carely.service', 'Dịch vụ') },
];

type ModalEditPackage = {
  isVisible: boolean;
  itemEdit: any;
};

const ChannelDetailScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { channelId, type } = route.params;

  const scrollRef = useRef<any>(null);
  const tabPositions = useRef<any>({});

  const insets = useSafeAreaInsets();

  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  const { t } = useTranslation();

  const toastEl = useRef(null);

  const dispatch = useAppDispatch();

  const isFocusScreen = useIsFocused();
  const { user, isDoctor, isStudent } = useContext(AppContext);

  const { reportList, firebaseConfig } = useAppSelector(
    state => state.globalReducer,
  );

  const {
    channelDetailData,
    listPackageChannel,
    // dataBuyPackageFree,
  } = useAppSelector(state => state.channelReducer);

  const [loading, setLoading] = useState<boolean>(true);
  const bottomSheetRef = useRef<any>(null);

  const [channelData, setChannelData] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  const [myPackage, setMyPackage] = useState<MergedPackage>({
    channel_id: '',
    call_1vs1: 0,
    chat_1vs1: 0,
    is_book_service: 0,
    orders: [],
    expiredChat: true,
    expiredCall: true,
  });

  const TABS = useMemo(() => getTabs(t), [t]);

  const [activeTab, setActiveTab] = useState(0);

  // About tab

  // Edit Channel
  const [showModalEditChannel, setShowModalEditChannel] =
    useState<boolean>(false);

  const bottomSheetReportChannelRef = useRef<any>(null);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  //danh sach package
  const [offsetPkg, setOffsetPkg] = useState<number>(0);
  const [listPkg, setListPkg] = useState<any>([]);
  const [firstRenderPkg, setFirstRenderPkg] = useState<boolean>(true);
  const [finalLoadPkg, setFinalLoadPkg] = useState<boolean>(false);
  const [onEndReachedPkg, setOnEndReachedPkg] = useState(true);
  const [itemPackageChoose, setItemPackageChoose] = useState<any>(null);
  const bottomSheetPkgMenuActionRef = useRef<BottomSheetModal>(null);
  const [modalEditPackage, setModalEditPackage] = useState<ModalEditPackage>({
    isVisible: false,
    itemEdit: { id: -1 },
  });
  const [showModalCreatePackage, setShowModalCreatePackage] =
    useState<boolean>(false);

  // Lich lam viec cua kenh
  const [modalWorkScheduleVisible, setModalWorkScheduleVisible] =
    useState<boolean>(false);

  const [agreePopup2Btn, setAgreePopup2Btn] = useState({
    isShow: false,
    title: '',
    msg: '',
  });
  const [agreePopup, setAgreePopup] = useState({
    isShow: false,
    title: '',
    msg: '',
  });

  const [roomChatId, setRoomChatId] = useState('');
  //   const {socketCreatRoom, dataEndRoomChat} = useAppSelector(
  //     state => state.socketioReducer,
  //   );

  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  //booking
  const [openBooking, setOpenBooking] = useState(false);

  const raw = [
    { day_from: '', day_to: '' }, // index 0

    { time_from1: '' }, // index 1
    { time_from2: '' }, // index 2
    { time_from3: '' }, // index 3

    { time_to1: '' }, // index 4
    { time_to2: '' }, // index 5
    { time_to3: '' }, // index 6

    { schedule_except: '' }, // index 7

    { schedule_day_2: 0 }, // index 8
    { schedule_day_3: 0 }, // index 9
    { schedule_day_4: 0 }, // index 10
    { schedule_day_5: 0 }, // index 11
    { schedule_day_6: 0 }, // index 12
    { schedule_day_7: 0 }, // index 13
    { schedule_day_8: 0 }, // index 14
  ];

  const [dayFrom, setDayFrom] = useState(raw[0].day_from!);
  const [dayTo, setDayTo] = useState(raw[0].day_to!);
  const [windows, setWindows] = useState([
    { from: raw[1].time_from1!, to: raw[4].time_to1! },
    { from: raw[2].time_from2!, to: raw[5].time_to2! },
    { from: raw[3].time_from3!, to: raw[6].time_to3! },
  ]);
  const [scheduleExcept, setScheduleExcept] = useState(raw[7].schedule_except!);

  const [workingDays, setWorkingDays] = useState({
    2: raw[8].schedule_day_2! === 1,
    3: raw[9].schedule_day_3! === 1,
    4: raw[10].schedule_day_4! === 1,
    5: raw[11].schedule_day_5! === 1,
    6: raw[12].schedule_day_6! === 1,
    7: raw[13].schedule_day_7! === 1,
    8: raw[14].schedule_day_8! === 1,
  });

  // Du lieu dong bo local
  const channelInfo = useMemo(() => {
    // console.log('channelData?.schedules', channelData?.schedules);
    const isOwner =
      (channelData?.manager?.id === user.id ||
        channelData?.owner_id === user.id) &&
      isDoctor;
    return {
      id: channelData.id,
      avatar: channelData?.avatar || channelData?.userInfo?.avatar || '',
      name: channelData?.name || '',
      isOwner,
      otherDoctor: isDoctor && !isOwner,
      isFollowed: channelData?.statistics?.is_followed ? true : false,
      isVerified: channelData?.is_verified === 1 ? true : false,
      categoryName: channelData?.categoryName || '',
      totalFollow:
        calculateNumberViewLike(
          channelData?.statistics?.total_follow,
          channelData?.vt_follow,
        ) || 0,
      description: channelData?.description || '',
      youtubeLink: channelData?.youtube_link || '',
      customLink: channelData?.custom_link || '',
      facebookLink: channelData?.facebook_link || '',
      tiktokLink: channelData?.tiktok_link || '',
      websiteLink: channelData?.website_link || '',
      categories: channelData?.categories || [],
      schedules: channelData?.schedules || [],
    };
  }, [channelData]);

  const fetchChannelDetail = () => {
    if (!channelId) return;
    dispatch(getDetailChannel({ channelId }));
  };

  const callAPIChannelPackage = (_offset: number) => {
    // hien thi package ONLINE cho user
    let param: any = {
      limit: PAGINATION.ITEMS_5,
      offset: _offset,
      fqin: `channel_id:${channelId ?? channelData.id}`,
    };
    if (channelInfo.isOwner) {
      param.fq = `is_deleted:0`;
      param.fqin = `status:0,1|channel_id:${channelId ?? channelData.id}`;
    } else {
      param.fq = `is_deleted:0`;
      param.fqin = `status:1|channel_id:${channelId ?? channelData.id}`;
      param.fqnot = 'parent_id:0';
    }
    dispatch(getDetailChannelServicesPackage(param));
  };

  const initDataAfterChannel = () => {
    setOffsetPkg(0);
    callAPIChannelPackage(0);
  };

  useEffect(() => {
    if (channelInfo.id) {
      initDataAfterChannel();
    }
  }, [channelInfo.id]);

  useEffect(() => {
    fetchChannelDetail();
  }, [channelId]);

  //loc package theo channel
  useEffect(() => {
    const processChannelPackage = () => {
      const filteredPackages = (user.packages || []).filter(
        (item: any) => item.is_book_service !== 1,
      );
      const merged: MergedPackage[] = mergePackagesByChannel(filteredPackages);
      const result = getPackageByChannelId(merged, channelData.id);
      console.log('🚀 ~ processChannelPackage ~ result:', result);
      setMyPackage(result);
      // setIsBooking(result?.call_1vs1 === 1 && !result?.expiredCall);
      // setIsAllowChat(result?.chat_1vs1 === 1 && !result?.expiredChat);
    };

    if (user.packages && channelData.id) {
      processChannelPackage();
    }
  }, [user, channelData.id]);

  // useEffect(() => {
  //   console.log('isAllowChat changed:', isAllowChat);
  // }, [isAllowChat]);

  useEffect(() => {
    if (!isFocusScreen) return;
    const { loading: apiLoading, data, error }: any = channelDetailData;
    if (apiLoading) return;
    if (data) {
      const datachannel = data.result || {};
      setChannelData(datachannel);
      setLoading(false);
      setRefreshing(false);
      dispatch(resetChannelDetail(null));
    } else if (error) {
      setLoading(false);
      setRefreshing(false);
      dispatch(resetChannelDetail(null));
    }
  }, [channelDetailData, isFocusScreen]);

  // danh sách package theo channel
  useEffect(() => {
    const proccessPackageAPI = () => {
      const { loading, data, error } = listPackageChannel;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          const sizeResponse = newItems.length;
          setFirstRenderPkg(false);
          if (offsetPkg === 0) {
            setListPkg(newItems);
          } else {
            setListPkg((prev: any) => [...prev, ...newItems]);
          }
          setFinalLoadPkg(sizeResponse < PAGINATION.ITEMS_5);
        } else if (error) {
          console.log('🚀 ~ proccessPackageAPI ~ error:', error);
          setFirstRenderPkg(false);
        }
      }
    };
    proccessPackageAPI();
  }, [listPackageChannel]);

  //   useEffect(() => {
  //     const process = async () => {
  //       if (socketCreatRoom.data?.room_id) {
  //         if (showAlert && isLoadingAPI) {
  //           setShowAlert(false);
  //           setIsLoadingAPI(false);
  //           const {owner_id, manager, ownerInfo, say_hello} = channelData;
  //           const infoToUser = {
  //             roomChatId: socketCreatRoom.data?.room_id,
  //             userToId: owner_id || manager?.id,
  //             userToAvatar: manager?.avatar || ownerInfo?.avatar || '',
  //             sayHello:
  //               say_hello ||
  //               t('chat.sayHello', 'Xin chào 👋! Tôi có thể hỗ trợ gì cho bạn?'),
  //           };
  //           dispatch(updateCurrentToChatInfo(infoToUser));
  //           storeObjectData(STORAGEKEY.LIST_ROOM_PACKAGE, infoToUser);
  //           setRoomChatId(socketCreatRoom.data?.room_id);
  //           socketService.emitDetailRoom(socketCreatRoom.data?.room_id);
  //         } else {
  //           setRoomChatId(socketCreatRoom.data?.room_id);
  //           console.log(
  //             '🚀 ~ process ~ socketCreatRoom.data:',
  //             socketCreatRoom.data,
  //           );
  //         }
  //       }
  //     };
  //     process();
  //   }, [socketCreatRoom]);

  useEffect(() => {
    // console.log("🚀 ~ ChannelDetailScreen ~ route.params?.type:", route.params?.type)
    if (route.params?.type !== 'package') return;
    setActiveTab(1);
    // GALogEvent(GAEvents.package_viewed, {
    //   method: 'App package viewed',
    // });
  }, [route.params?.type]);

  //    useEffect(() => {
  //       if (!isFocusScreen) return;
  //       const processAPIFeedAfterShare = () => {
  //         const {loading, data, error} = newsfeedListOne;
  //         if (!loading) {
  //           if (data) {
  //             let newItems = data.items || [];
  //             if (newItems.length > 0) {
  //               setListNF((prev:any) => [newItems[0], ...prev]);
  //             }
  //             setOriginFeed({});
  //             setFeedIdProps(0);
  //             dispatch(resetNewsfeedOne({}));
  //           } else if (error) {
  //             dispatch(resetNewsfeedOne({}));
  //           }
  //         }
  //       };
  //       processAPIFeedAfterShare();
  //     }, [newsfeedListOne]);

  // Action
  const showAgreeForm = (title: string, msg: string) => {
    setAgreePopup({
      isShow: true,
      title,
      msg,
    });
  };

  // const handleBooking = () => {
  //   if (isBooking) {
  //     if (myPackage.expiredCall) {
  //       showAgreeForm(
  //         '',
  //         t(
  //           'package.expiredCall',
  //           'You’ve used all your appointment bookings. Please purchase more.',
  //         ),
  //       );
  //     } else {
  //       const schedule = channelData?.schedules ?? [];
  //       // console.log('🚀 ~ handleBooking ~ schedule:', schedule);
  //       const mergedSchedule = (schedule ?? []).reduce(
  //         (acc: any, cur: any) => ({ ...acc, ...cur }),
  //         {},
  //       );

  //       setDayFrom(mergedSchedule.day_from ?? '');
  //       setDayTo(mergedSchedule.day_to ?? '');

  //       setWindows(
  //         [
  //           {
  //             from: mergedSchedule.time_from1 ?? '',
  //             to: mergedSchedule.time_to1 ?? '',
  //           },
  //           {
  //             from: mergedSchedule.time_from2 ?? '',
  //             to: mergedSchedule.time_to2 ?? '',
  //           },
  //           {
  //             from: mergedSchedule.time_from3 ?? '',
  //             to: mergedSchedule.time_to3 ?? '',
  //           },
  //         ].filter(w => w.from && w.to),
  //       ); // optional: bỏ ca trống

  //       setScheduleExcept(mergedSchedule.schedule_except ?? '');

  //       setWorkingDays({
  //         2: mergedSchedule.schedule_day_2 === 1,
  //         3: mergedSchedule.schedule_day_3 === 1,
  //         4: mergedSchedule.schedule_day_4 === 1,
  //         5: mergedSchedule.schedule_day_5 === 1,
  //         6: mergedSchedule.schedule_day_6 === 1,
  //         7: mergedSchedule.schedule_day_7 === 1,
  //         8: mergedSchedule.schedule_day_8 === 1,
  //       });
  //       // Luôn mở modal, kể cả khi schedule null/undefined
  //       setTimeout(() => {
  //         //   GALogEvent(GAEvents.calender_viewed, {
  //         //     method: 'App package calender viewed',
  //         //   });
  //         setOpenBooking(true);
  //       }, 300);
  //     }
  //   } else {
  //     showAgreeForm(
  //       '',
  //       t(
  //         'package.activeCall',
  //         'Vui lòng mua gói dịch vụ cho phép lên lịch cuộc gọi để sử dụng tính năng này.',
  //       ),
  //     );
  //   }
  // };

  const handleWorkSchedule = () => {
    setModalWorkScheduleVisible(true);
  };

  const handleFollow = (channel_id: any) => {
    // // Kiem tra neu la ownner thi khong hien nut follow
    // if (channel_id) {
    //   dispatch(
    //     postFollowChannel({
    //       channel_id,
    //     }),
    //   );
    //   let objClone = {...channelData};
    //   let statisticsClone = {...objClone.statistics};
    //   let isFollowed = statisticsClone.is_followed ? false : true;
    //   //auto update local
    //   dispatch(
    //     updateFollowLocal({
    //       data: {
    //         actionType: 'FOLLOW',
    //         channelId,
    //         doctorId: channelId,
    //         isFollowed,
    //       },
    //     }),
    //   );
    // //   if (isFollowed) {
    // //     GALogEvent(GAEvents.FOLLOW_USER, {
    // //       method: 'App follow channel',
    // //       channel_id: channelId ? channelId.toString() : '',
    // //     });
    // //   }
    // }
  };

  const handleEditChannel = () => {
    setShowModalEditChannel(true);
  };

  const handleShowSpecName = (name: string) => {
    if (name.length > 22) {
      showToast(toastEl, name);
    }
  };

  const handleShareChannel = () => {
    bottomSheetRef.current?.close();
    try {
      const _url = `${Config.SHARE_WEB_URL}/channels?id=${channelData?.id}`;
      const msg = channelData.description || '';
      const shareOption = {
        title: channelData.description,
        message: msg,
        url: _url,
      };
      Share.open(shareOption)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    } catch (error) {
      console.log('==== share error ====');
    }
  };

  const handleReportChannel = () => {
    bottomSheetRef.current?.close();
    dispatch(getListReport(null));
    setTimeout(() => {
      bottomSheetReportChannelRef.current?.present();
    }, 500);
  };

  const handleLoadMorePkg = () => {
    if (!finalLoadPkg && !onEndReachedPkg) {
      const _offset = offsetPkg + PAGINATION.ITEMS_5;
      setOffsetPkg(_offset);
      callAPIChannelPackage(_offset);
    }
  };

  // Kiem tra item la free va nam trong myPackage
  const checkIsFreeBuyed = (packageItem: any) => {
    for (let i = 0; i < myPackage.orders.length; i++) {
      const order = myPackage.orders[i];
      if (order.id === packageItem.id) {
        return true;
      }
    }
    return false;
  };

  const handleViewPackageDetail = (item: any, is_book_service: any) => {
    if (is_book_service == 1) {
      navigation.navigate(mainRoute.serviceDetailScreen, {
        service: item,
        channelId: channelData.id,
      });
    } else {
      //   navigation.navigate(mainRoute.packageDetailScreen, {
      //     channelId: channelData.id,
      //     service: item,
      //   });
    }
  };

  const handlePressMenuPkg = (item: any) => {
    // console.log("🚀 ~ handlePressMenuPkg ~ item:", bottomSheetPkgMenuActionRef.current)
    bottomSheetPkgMenuActionRef.current?.present();
    setItemPackageChoose({ isOwner: channelInfo.isOwner, ...item });
  };

  const handleEditPackage = (item: any) => {
    bottomSheetPkgMenuActionRef.current?.dismiss();
    setItemPackageChoose(null);
    setModalEditPackage({
      isVisible: true,
      itemEdit: item,
    });
  };

  const handleSharePackage = (item: any) => {
    bottomSheetPkgMenuActionRef.current?.dismiss();
    setItemPackageChoose(null);
    if (!item.id || !item.channel_id) return;
    try {
      const _url = `${Config.SHARE_WEB_URL}/packages?id=${item?.id}&channelid=${item.channel_id}&source=inapp&campaign=share_package`;
      const msg = t('package.title', 'Package') + ' ' + item.name || '';
      const shareOption = {
        title: channelData.description,
        message: msg,
        url: _url,
      };

      Share.open(shareOption)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    } catch (error) {
      console.log('==== share error ====');
    }
  };

  const handleEditPackageSuccess = async (pkgId: any) => {
    try {
      setModalEditPackage({
        isVisible: false,
        itemEdit: {},
      });

      const res: any = await ApiService.getCarelyPackageDetail({
        channelId: channelInfo?.id,
        packageId: pkgId,
      });

      if (res?.status === 200 || res?.status === 201) {
        const packageEdited = res?.data?.result;

        if (!packageEdited?.id) return;

        setListPkg((prev: any[]) =>
          prev.map(item =>
            item?.id === packageEdited.id ? packageEdited : item,
          ),
        );

        showToast(
          toastEl,
          t('package.editSuccess', 'Package updated successfully'),
          1500,
        );
      }
    } catch (error) {
      console.log('handleEditPackageSuccess error', error);
      showToast(
        toastEl,
        t('common.somethingWentWrong', 'Something went wrong'),
        1500,
      );
    }
  };

  const handleCreatePackageSuccess = async (pkgId: any) => {
    try {
      setShowModalCreatePackage(false);
      if (pkgId) {
        const res: any = await ApiService.getCarelyPackageDetail({
          channelId: channelInfo?.id,
          packageId: pkgId,
        });
        if (res?.status === 200 || res?.status === 201) {
          const packageNewed = res?.data?.result;
          if (!packageNewed?.id) return;
          setListPkg((prev: any[]) => [packageNewed, ...prev]);
        }
      }
      showToast(
        toastEl,
        t('package.createSuccess', 'Package created successfully'),
        1500,
      );
    } catch (error) {
      console.log('🚀 handleCreatePackageSuccess error:', error);
      showToast(
        toastEl,
        t('common.somethingWentWrong', 'Something went wrong'),
        1500,
      );
    }
  };

  const handleViewAppointment = () => {
    setOpenBooking(false);
    // dispatch(getProfile(null));
    // navigation.navigate(mainRoute.myAppointment, {idxTab: 1});
  };

  const handleUploadVideoApp = async () => {
    // navigation.navigate(mainRoute.upvideoScreen as never);
  };

  // ================= HEADER =================
  const renderHeaderActions = useCallback(() => {
    return (
      <Row between style={[{ top: insets.top }, styles.btnHeaderWrapper]}>
        <TouchableOpacity
          hitSlop={screenStyles.hitSlop30}
          onPress={navigation.goBack}
          style={styles.btnHeader}
        >
          <IconX
            type={IconType.FONTISTO}
            name="angle-left"
            size={16}
            color={colors.white}
          />
        </TouchableOpacity>
        {!loading && (
          <TouchableOpacity
            hitSlop={screenStyles.hitSlop30}
            onPress={() => bottomSheetRef.current?.present()}
            style={styles.btnHeader}
          >
            <IconX
              type={IconType.ENTYPO}
              name="dots-three-vertical"
              size={18}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
      </Row>
    );
  }, [loading, insets.top]);

  // ================= REFRESH =================
  const onRefresh = () => {
    setRefreshing(true);
    try {
      fetchChannelDetail();
      initDataAfterChannel();
    } finally {
      setRefreshing(false);
    }
  };

  const renderErrorImage = () => {
    return (
      <Image
        source={images.channel.channel_default}
        style={screenStyles.fillParent}
        resizeMode="contain"
      />
    );
  };

  const renderChannelTopInfo = useCallback(() => {
    const {
      id,
      name,
      isFollowed,
      isVerified,
      categoryName,
      totalFollow,
      isOwner,
      otherDoctor,
    } = channelInfo;
    return (
      <View style={screenStyles.pH16}>
        <Row start>
          <CText color={colors.c101828} h3 w600>
            {name}
          </CText>
          {isVerified && (
            <View style={screenStyles.mL5}>
              <Image
                source={images.global.kyc_1}
                style={screenStyles.box24}
                resizeMode="contain"
              />
            </View>
          )}
        </Row>
        {categoryName && (
          <CText h5 color={colors.c33353A}>
            {splitCategory(categoryName)}
          </CText>
        )}
        <Row between style={screenStyles.mT10}>
          <CText h5 color={colors.c1D2939}>
            <CText h5 color={colors.c101828} w600>
              {totalFollow}
            </CText>
            {` ${t('profile.followers')}`}
          </CText>
        </Row>
        <Row between style={screenStyles.mT10}>
          {!isOwner ? (
            <Pressable
              onPress={() => handleFollow(id)}
              style={[
                styles.btnUnActive,
                {
                  borderColor: isFollowed ? colors.c667085 : colors.primary,
                },
              ]}
            >
              <CText h5 color={isFollowed ? colors.c667085 : colors.primary}>
                {isFollowed ? t('profile.followed') : t('profile.follow')}
              </CText>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleEditChannel}
              style={[
                styles.btnUnActive,
                {
                  borderColor: colors.primary,
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
              ]}
            >
              <IconX
                name={'mode-edit'}
                type={IconType.MATERIAL_ICONS}
                color={colors.primary}
                size={16}
              />
              <CText h5 color={colors.primary} style={screenStyles.mL5}>
                {t('profile.editChannel', 'Chỉnh sửa kênh')}
              </CText>
            </Pressable>
          )}
          {isOwner && (
            <Pressable
              onPress={handleWorkSchedule}
              style={[
                styles.btnUnActive,
                {
                  borderColor: colors.primary,
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
              ]}
            >
              <IconX
                name={'calendar'}
                type={IconType.OCTICONS}
                color={colors.primary}
                size={16}
              />
              <CText h5 color={colors.primary} style={screenStyles.mL5}>
                {t('booking.workSchedule', 'Work schedule')}
              </CText>
            </Pressable>
          )}
        </Row>
      </View>
    );
  }, [channelInfo, myPackage]);

  const renderTop = useCallback(() => {
    return (
      <View style={{ height: HEADER_HEIGHT }}>
        <ImageHelper
          source={{ uri: channelInfo.avatar }}
          resizeMode="cover"
          renderErrorImage={renderErrorImage}
        />
        <LinearGradient colors={GRADIENT_COLORS} style={styles.gradient}>
          {renderChannelTopInfo()}
        </LinearGradient>
      </View>
    );
  }, [channelInfo]);

  const handlePressTab = (key: any) => {
    setActiveTab(key);
    const x = tabPositions.current[key];
    if (x !== undefined && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: x - 40,
          animated: true,
        });
      }, 0);
    }
  };

  const renderTabView = useCallback(() => {
    return (
      <>
        <View style={styles.bgRow}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {TABS.map((tab, index) => {
              const isActive = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => handlePressTab(tab.key)}
                  style={[
                    styles.itemTabWrapper,
                    {
                      borderBottomColor: isActive
                        ? colors.primary
                        : 'transparent',
                    },
                  ]}
                  onLayout={e => {
                    tabPositions.current[tab.key] = e.nativeEvent.layout.x;
                  }}
                >
                  <CText
                    h5
                    w500
                    color={isActive ? colors.primary : colors.c667085}
                  >
                    {tab.label}
                  </CText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        {activeTab == 1 && channelInfo.isOwner && (
          <View style={[screenStyles.pH16, screenStyles.mT16]}>
            <Row end>
              <Pressable
                onPress={() => setShowModalCreatePackage(true)}
                style={[
                  screenStyles.pV8,
                  screenStyles.pH12,
                  screenStyles.rowCenter,
                  {
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.primary,
                    borderRadius: 5,
                  },
                ]}
              >
                <IconX
                  name={'plus'}
                  type={IconType.OCTICONS}
                  color={colors.primary}
                  size={14}
                />
                <CText
                  h5
                  w500
                  color={colors.primary}
                  style={screenStyles.mL5}
                >{`${t('service.createService', 'Tạo dịch vụ')}`}</CText>
              </Pressable>
            </Row>
          </View>
        )}
      </>
    );
  }, [activeTab]);

  // ================= HEADER CONTENT =================
  const renderHeader = () => {
    return (
      <>
        {renderTop()}
        {renderTabView()}
      </>
    );
  };

  const data = useMemo(() => {
    switch (activeTab) {
      case 0:
        return [{ type: 'about' }];
      case 1:
        return listPkg || [];
      default:
        return [[{ type: 'content' }]];
    }
  }, [activeTab, listPkg]);

  const renderItem = ({ item, index }: any) => {
    switch (activeTab) {
      case 0:
        return (
          <IntroduceChannel
            description={channelInfo.description}
            categories={channelInfo.categories}
            onShowSpecName={handleShowSpecName}
          />
        );
      case 1:
        // if (firstRenderPkg) {
        //   return <CLoading />;
        // }
        // if (firebaseConfig.isReviewApp) return null;
        return (
          <PackageChannel
            item={item}
            index={index}
            checkIsFreeBuyed={checkIsFreeBuyed}
            t={t}
            user={user}
            onViewDetailPackage={handleViewPackageDetail}
            onPressMenu={handlePressMenuPkg}
          />
        );
      default:
        return null;
    }
  };

  const _renderLoadingFooterPkg = () => {
    return !finalLoadPkg && !onEndReachedPkg ? (
      <Row style={screenStyles.mT5}>
        <ActivityIndicator size="small" color={colors.primary} />
      </Row>
    ) : null;
  };

  const listConfig = useMemo(() => {
    switch (activeTab) {
      case 0:
        return {
          key: 'grid',
          numColumns: 1,
          onEndReached: undefined,
          ListFooterComponent: undefined,
          ListEmptyComponent: undefined,
          setOnEndReached: null,
        };
      case 1:
        return {
          key: 'list-package',
          numColumns: 1,
          onEndReached: handleLoadMorePkg,
          ListFooterComponent: _renderLoadingFooterPkg,
          ListEmptyComponent: <CEmptyData />,
          setOnEndReached: setOnEndReachedPkg,
        };

      default:
        return {
          key: 'grid',
          numColumns: 1,
          onEndReached: undefined,
          ListFooterComponent: undefined,
          ListEmptyComponent: undefined,
          setOnEndReached: null,
        };
    }
  }, [activeTab, handleLoadMorePkg]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={screenStyles.flex1}>
          <CLoading />
        </View>
      );
    }
    return (
      <FlatList
        ref={flatListRef}
        key={listConfig.key} // 👈 QUAN TRỌNG
        contentContainerStyle={screenStyles.flexGrowBottom}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={listConfig.numColumns}
        onEndReached={listConfig.onEndReached}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={isIOS ? 160 : 16}
        onEndReachedThreshold={0.5}
        ListFooterComponent={listConfig.ListFooterComponent}
        onMomentumScrollBegin={() => {
          // listConfig.setOnEndReached?.(false);
        }}
        ListEmptyComponent={listConfig.ListEmptyComponent}
        onScroll={event => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowScrollTop(offsetY > 400);
        }}
      />
    );
  };

  const renderBtnScrollTopTop = () => {
    if (showScrollTop)
      return (
        <Pressable
          style={styles.btnScrollTopTop}
          onPress={() => {
            flatListRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
          }}
        >
          <View style={{ height: 34, width: 34, ...screenStyles.centerWrap }}>
            <IconX
              type={IconType.FONTISTO}
              name={'chevrons-up'}
              size={22}
              color={colors.white}
            />
          </View>
        </Pressable>
      );
  };

  return (
    <Wrapper>
      {renderHeaderActions()}
      {renderContent()}
      {renderBtnScrollTopTop()}
      {showModalEditChannel && (
        <ModalEditChannel
          isVisible={showModalEditChannel}
          itemEdit={channelInfo}
          hideModal={() => setShowModalEditChannel(false)}
          onUpdateChannelSuccess={() => {
            setShowModalEditChannel(false);
            fetchChannelDetail();
            showToast(
              toastEl,
              t('channel.editSuccess', 'Cập nhật trang thành công'),
              1500,
            );
          }}
        />
      )}
      <BottomSheetMenu
        t={t}
        bottomSheetRef={bottomSheetRef}
        onShareChannel={handleShareChannel}
        onReportChannel={handleReportChannel}
      />
      <BottomSheetReportChannel
        t={t}
        bottomSheetReportChannelRef={bottomSheetReportChannelRef}
        itemId={channelData.id}
      />
      {/* Package */}
      <ModalMenuPkgV2
        bottomSheetRef={bottomSheetPkgMenuActionRef}
        t={t}
        onEditPackage={handleEditPackage}
        onSharePackage={handleSharePackage}
        itemMenu={itemPackageChoose}
        onDismiss={() => {
          // bottomSheetPkgMenuActionRef.current?.dismiss();
          setItemPackageChoose(null);
        }}
      />
      {modalEditPackage.isVisible && (
        <ModalEditPackage
          isVisible={modalEditPackage.isVisible}
          itemEdit={modalEditPackage.itemEdit}
          hideModal={() =>
            setModalEditPackage({
              isVisible: false,
              itemEdit: {},
            })
          }
          channelData={channelData}
          user={user}
          onEditPackageSuccess={handleEditPackageSuccess}
          isStudent={isStudent}
        />
      )}
      {showModalCreatePackage && (
        <ModalCreatePackage
          isVisible={showModalCreatePackage}
          hideModal={() => setShowModalCreatePackage(false)}
          channelData={channelData}
          user={user}
          onCreatePackageSuccess={handleCreatePackageSuccess}
          isStudent={isStudent}
        />
      )}
      {modalWorkScheduleVisible && (
        <BookingSetTime
          visible={modalWorkScheduleVisible}
          onClose={() => setModalWorkScheduleVisible(false)}
          onUpdateSuccess={() => {
            showToast(
              toastEl,
              t('common.updateTimeSuccess', 'Time updated successfully'),
              1500,
            );
            setModalWorkScheduleVisible(false);
            dispatch(getDetailChannel({ channelId: channelInfo.id }));
          }}
          channelId={channelInfo.id}
          schedules={channelInfo.schedules}
        />
      )}
      {/* <ModalAgreeFormDN2Btn
        visible={agreePopup2Btn.isShow}
        onClose={() =>
          setAgreePopup2Btn({
            isShow: false,
            title: '',
            msg: '',
          })
        }
        msg={agreePopup2Btn.msg}
        secondaryText={t('package.chatHistory', 'Chat history')}
        onSecondaryPress={() => {
          setAgreePopup2Btn({
            isShow: false,
            title: '',
            msg: '',
          });
        //   navigation.navigate(mainRoute.myPackages, {idxTab: 1});
        }}
      /> */}
      {/* {openBooking && (
        <AppointmentPickerModal
          visible={openBooking}
          onClose={() => {
            // GALogEvent(GAEvents.user_calender_failed, {
            //   method: 'App package calender failed',
            // });
            setOpenBooking(false);
          }}
          dayFrom={dayFrom}
          dayTo={dayTo}
          windows={windows}
          scheduleExcept={scheduleExcept}
          workingDays={workingDays}
          channelData={channelData}
          user={user}
          onViewAppointment={handleViewAppointment}
          onKYCInfo={() => {
            setOpenBooking(false);
            // isDoctor
            //   ? navigation.navigate(mainRoute.doctorEditScreen)
            //   : navigation.navigate(mainRoute.editProfileScreen);
          }}
          myPackage={myPackage}
          stepMinutes={firebaseConfig.stepMinutes ?? 60}
        />
      )} */}
      {/* <ModalAgreeFormDN
        visible={agreePopup.isShow}
        msg={agreePopup.msg}
        title={agreePopup.title}
        onClose={() =>
          setAgreePopup({
            isShow: false,
            title: '',
            msg: '',
          })
        }
      /> */}
      {showAlert ? (
        <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
      ) : null}
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

export default ChannelDetailScreen;
