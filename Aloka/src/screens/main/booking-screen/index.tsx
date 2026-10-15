import {
  APILoading,
  CAreaContent,
  CHeader,
  CInputTouch,
  IconType,
  IconX,
  ModalAgreeForm,
  Toast,
  Wrapper,
} from '@/components';
import {
  calculateDistance,
  formatDateTimeKey,
  getStatusBarHeight,
  isIOS,
  logError,
  normalizeTimeBooked,
  parsePricePackage,
  screenStyles,
  showToast,
} from '@/configs';
import {mainRoute, STORAGEKEY} from '@/constants';
import {AppContext} from '@/contexts';
import i18n from '@/i18n';
import {refundPkgCarely} from '@/redux/slices/carelySlice';
import {
  getAppointmentTime,
  postBookingChannel,
  postBuyPackageFreeChannel,
  resetPackageChannel,
} from '@/redux/slices/channelSlice';
import {getProfile} from '@/redux/slices/profileSlice';
import {useAppDispatch, useAppSelector} from '@/redux/store/customReduxHook';
import ApiService from '@/services/api-base';
import {getObjectData, removeValue, storeObjectData} from '@/storages';
import {CButton, CEmptyData, Container, CScrollView, CText, Row} from '@/utils';
import {Divider} from '@rneui/base';
import {makeStyles, useTheme} from '@rneui/themed';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  AppState,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  View,
} from 'react-native';
import {DatePickerModal} from 'react-native-paper-dates';
import {ModalPayment, PaymentTypes} from './components/ModalPayment';
import ConfirmModal from './ConfirmModal';
import ModalSearchNearby from './ModalSearchNearby';

// import ModalVoucher from '../channel-detail-screen/modal/ModalVoucher';

// ====== helper functions ======
type TimeWindow = {from: string; to: string};
type SlotItem = {time: string; isActive: boolean};

function parseHM(hm: string) {
  const [h, m] = hm.split(':').map(Number);
  return {h, m};
}

function addMinutes(date: Date, minutes: number) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}
function formatHM(date: Date) {
  const hh = `${date.getHours()}`.padStart(2, '0');
  const mm = `${date.getMinutes()}`.padStart(2, '0');
  return `${hh}:${mm}`;
}
function clampToDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function* iterateDates(start: Date, end: Date) {
  const d = clampToDay(start);
  const last = clampToDay(end);
  while (d <= last) {
    yield new Date(d);
    d.setDate(d.getDate() + 1);
  }
}

function labelDate(d: Date) {
  if (i18n.language === 'vi') {
    // Hiển thị: Thứ N, dd/MM/yyyy
    const weekday = d.toLocaleDateString('vi-VN', {weekday: 'long'}); // "Thứ Năm"
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${weekday}, ${day}/${month}/${year}`;
  } else {
    // Hiển thị: Thu, Sep 26, 2025
    const opts: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', opts).format(d);
  }
}

/**
 * buildTimeSlotsForDate
 * - Trả về mảng SlotItem { time: "HH:mm", isActive: boolean }
 * - Nếu date là hôm nay => chỉ active các slot có time >= now
 * - Với ngày khác => tất cả active (chưa xét booked; booked sẽ xử lý ở render)
 */
function buildTimeSlotsForDate(
  date: Date,
  windows: TimeWindow[],
  stepMinutes: number = 60,
  breakMinutes: number = 0,
): SlotItem[] {
  stepMinutes = Number(stepMinutes) || 60;
  breakMinutes = Number(breakMinutes) || 0;

  const slots: SlotItem[] = [];

  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const step = stepMinutes + breakMinutes;

  windows.forEach(w => {
    const {h: fh, m: fm} = parseHM(w.from);
    const {h: th, m: tm} = parseHM(w.to);

    const start = new Date(date);
    start.setHours(fh, fm, 0, 0);

    const end = new Date(date);
    end.setHours(th, tm, 0, 0);

    for (let t = new Date(start); t < end; t = addMinutes(t, step)) {
      const timeStr = formatHM(t);
      const isActive = !isToday || t.getTime() >= now.getTime();

      slots.push({time: timeStr, isActive});
    }
  });

  const map = new Map<string, SlotItem>();

  slots.forEach(s => {
    if (!map.has(s.time)) {
      map.set(s.time, s);
    } else {
      const existing = map.get(s.time)!;
      if (s.isActive && !existing.isActive) {
        map.set(s.time, s);
      }
    }
  });

  return Array.from(map.values()).sort((a, b) => (a.time > b.time ? 1 : -1));
}

function isValidScheduleDate(
  date: Date,
  workingDays: Record<number, boolean>,
  scheduleExcept: string,
) {
  // JS: 0=CN → 8, 1=T2 → 2 ...
  const dayOfWeek = date.getDay() === 0 ? 8 : date.getDay() + 1;

  // ✅ 1. chỉ check workingDays nếu có ít nhất 1 ngày true
  const hasWorkingDays =
    workingDays && Object.values(workingDays).some(v => v === true);

  if (hasWorkingDays) {
    if (workingDays[dayOfWeek] === false) {
      return false;
    }
  }

  // ✅ 2. check exception days nếu có
  if (scheduleExcept && scheduleExcept.trim() !== '') {
    const exceptDays = scheduleExcept
      .split(',')
      .map(d => Number(d))
      .filter(d => !isNaN(d));

    if (exceptDays.includes(date.getDate())) {
      return false;
    }
  }

  return true;
}

const BookingScreen: React.FC<any> = ({navigation, route}: any) => {
  const {
    theme: {colors},
  } = useTheme();
  const {t} = useTranslation();

  const styles = useStyles();
  const toastEl = useRef(null);

  const dispatch = useAppDispatch();

  const {user, isDoctor, currentLocation} = useContext(AppContext);
  const scrollRef = useRef<any>(null);
  const appointmentTimeRef = useRef<any>(null);
  const descriptionEl = useRef<any>(null);

  //PROPS & STATE
  const {dataBookingCall, dataAppointmentTime, dataBuyPackageFree} =
    useAppSelector(state => state.channelReducer);

  const [service] = useState(route.params?.service || {});
  const [channelData] = useState(route.params?.channelData || {});
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [stepMinutes] = useState<number>(
    route.params?.service.time_package || 60,
  );

  const [timeBreak] = useState<number>(route.params?.service.time_break || 0);

  const [timeBooked, setTimeBooked] = useState([]);

  const [agreePopup, setAgreePopup] = useState({
    isShow: false,
    title: '',
    msg: '',
  });

  const [currentOrderId, setCurrentOrderId] = useState(''); //uuidv4

  useEffect(() => {
    if (channelData.id || service.channel_id) {
      dispatch(
        getAppointmentTime({
          channelId: channelData.id || service.channel_id,
        }),
      );
    }
  }, [channelData.id, service.channel_id]);

  useEffect(() => {
    const processAPIAppointmentTimeBooked = () => {
      const {loading, data, error}: any = dataAppointmentTime;
      if (!loading) {
        if (data) {
          setTimeBooked(data.items || []);
          // console.log('🚀 ~ processAPIAppointmentTime ~ data:', data);
        } else if (error) {
          console.log('🚀 ~ processAPIAppointmentTime ~ error:', error);
        }
      }
    };
    processAPIAppointmentTimeBooked();
  }, [dataAppointmentTime]);

  const showAgreeForm = (title: string, msg: string) => {
    setAgreePopup({
      isShow: true,
      title,
      msg,
    });
  };

  useEffect(() => {
    const processAPIBuyPackageFree = () => {
      const {loading, data, error} = dataBuyPackageFree;
      if (!loading) {
        if (data) {
          console.log('🚀 ~ processAPIBuyPackageFree ~ data:', data);
          const {msg}: any = data;
          if (msg && msg.result?.order_id) {
            console.log('Mua goi thanh cong');
            dispatch(getProfile(null));
            bookService(msg.result?.order_id);
          } else {
            showToast(toastEl, 'Something error!');
            setShowAlert(false);
            setIsLoadingAPI(false);
          }
          dispatch(resetPackageChannel());
        } else if (error) {
          console.log('🚀 ~ processAPIBuyPackageFree ~ error:', error);
          const msg = logError(error, 'package_id', true);
          if (msg.includes('order_id')) {
            showAgreeForm(
              t('package.payment', 'Buy Package'),
              t(
                'carely.oncePerUser',
                'Gói dịch vụ trải nghiệm này chỉ áp dụng một lần cho mỗi người dùng.',
              ),
            );
          } else {
            showAgreeForm(
              t('package.payment', 'Buy Package'),
              'Something error!!!',
            );
          }
          dispatch(resetPackageChannel());
          setShowAlert(false);
          setIsLoadingAPI(false);
        }
      }
    };
    processAPIBuyPackageFree();
  }, [dataBuyPackageFree]);

  //booking
  const raw = [
    {day_from: '', day_to: ''}, // index 0

    {time_from1: ''}, // index 1
    {time_from2: ''}, // index 2
    {time_from3: ''}, // index 3

    {time_to1: ''}, // index 4
    {time_to2: ''}, // index 5
    {time_to3: ''}, // index 6

    {schedule_except: ''}, // index 7

    {schedule_day_2: 0}, // index 8
    {schedule_day_3: 0}, // index 9
    {schedule_day_4: 0}, // index 10
    {schedule_day_5: 0}, // index 11
    {schedule_day_6: 0}, // index 12
    {schedule_day_7: 0}, // index 13
    {schedule_day_8: 0}, // index 14
  ];

  const [dayFrom, setDayFrom] = useState(raw[0].day_from!);
  const [dayTo, setDayTo] = useState(raw[0].day_to!);
  const [windows, setWindows] = useState([
    {from: raw[1].time_from1!, to: raw[4].time_to1!},
    {from: raw[2].time_from2!, to: raw[5].time_to2!},
    {from: raw[3].time_from3!, to: raw[6].time_to3!},
  ]);
  const [scheduleExcept, setScheduleExcept] = useState(raw[7].schedule_except!);

  const [workingDays, setWorkingDays] = useState<any>({
    2: raw[8].schedule_day_2! === 1,
    3: raw[9].schedule_day_3! === 1,
    4: raw[10].schedule_day_4! === 1,
    5: raw[11].schedule_day_5! === 1,
    6: raw[12].schedule_day_6! === 1,
    7: raw[13].schedule_day_7! === 1,
    8: raw[14].schedule_day_8! === 1,
  });

  const bookedMap = useMemo(
    () => normalizeTimeBooked(timeBooked),
    [timeBooked],
  );

  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const [showAlertBooking, setShowAlertBooking] = useState(false);
  const [isLoadingAPIBooking, setIsLoadingAPIBooking] = useState(false);

  // Address
  const [bookingAddress, setBookingAddress] = useState<any>({});
  const [showAddress, setShowAddress] = useState<boolean>(false);
  //

  // EFFECT
  useEffect(() => {
    if (channelData.schedules) {
      const schedule = channelData?.schedules ?? [];
      // console.log('🚀 ~ CarelyBookScreen ~ schedule:', schedule);
      const mergedSchedule = (schedule ?? []).reduce(
        (acc: any, cur: any) => ({...acc, ...cur}),
        {},
      );

      setDayFrom(mergedSchedule.day_from ?? '');
      setDayTo(mergedSchedule.day_to ?? '');

      setWindows(
        [
          {
            from: mergedSchedule.time_from1 ?? '',
            to: mergedSchedule.time_to1 ?? '',
          },
          {
            from: mergedSchedule.time_from2 ?? '',
            to: mergedSchedule.time_to2 ?? '',
          },
          {
            from: mergedSchedule.time_from3 ?? '',
            to: mergedSchedule.time_to3 ?? '',
          },
        ].filter(w => w.from && w.to),
      ); // optional: bỏ ca trống

      setScheduleExcept(mergedSchedule.schedule_except ?? '');

      setWorkingDays({
        2: mergedSchedule.schedule_day_2 === 1,
        3: mergedSchedule.schedule_day_3 === 1,
        4: mergedSchedule.schedule_day_4 === 1,
        5: mergedSchedule.schedule_day_5 === 1,
        6: mergedSchedule.schedule_day_6 === 1,
        7: mergedSchedule.schedule_day_7 === 1,
        8: mergedSchedule.schedule_day_8 === 1,
      });
    }
  }, [channelData]);

  const {startDate, endDate, allDates} = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const from = new Date(dayFrom);
    const to = new Date(dayTo);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return {startDate: null, endDate: null, allDates: []};
    }

    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    // ✅ startDate > today
    const validStart = from < tomorrow ? tomorrow : from;
    const validEnd = to < validStart ? validStart : to;

    const exceptSet =
      scheduleExcept && scheduleExcept.trim() !== ''
        ? new Set(
            scheduleExcept
              .split(',')
              .map(d => Number(d))
              .filter(d => !isNaN(d)),
          )
        : null;

    const hasWorkingDays =
      workingDays && Object.values(workingDays).some(v => v === true);

    const dates = Array.from(iterateDates(validStart, validEnd)).filter(d => {
      // 🔒 đảm bảo > hôm nay (double safety)
      if (d <= today) return false;

      if (hasWorkingDays) {
        const jsDay = d.getDay(); // 0=Sun
        const weekdayKey = jsDay === 0 ? 8 : jsDay + 1;

        if (workingDays[weekdayKey] === false) return false;
      }

      if (exceptSet && exceptSet.has(d.getDate())) return false;

      return true;
    });

    return {
      startDate: validStart,
      endDate: validEnd,
      allDates: dates,
    };
  }, [dayFrom, dayTo, scheduleExcept, workingDays]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    allDates.length ? allDates[0] : null,
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Khi allDates thay đổi (ví dụ API trả khác), cập nhật selectedDate mặc định
  useEffect(() => {
    setSelectedDate(allDates.length ? allDates[0] : null);
    setSelectedTime(null);
  }, [allDates]);

  // Khi thay đổi date, reset time
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  const slots = useMemo(() => {
    if (!selectedDate) return [] as SlotItem[];

    const validDate = isValidScheduleDate(
      selectedDate,
      workingDays,
      scheduleExcept,
    );

    // ❌ ngày không hợp lệ → KHÔNG có slot
    if (!validDate) {
      return [];
    }

    // ✅ ngày hợp lệ → build slot bình thường
    // return buildTimeSlotsForDate(selectedDate, windows, stepMinutes);
    return buildTimeSlotsForDate(selectedDate, windows, stepMinutes, timeBreak);
  }, [
    selectedDate,
    windows,
    stepMinutes,
    scheduleExcept,
    workingDays,
    timeBreak,
  ]);

  const [txtDes, setTxtDes] = useState('');

  const [canConfirm, setCanConfirm] = useState<boolean>(false);

  // Buy package
  const [paymentResult, setPaymentResult] = useState<any>({resultCode: -1});
  const [modalBuyPackage, setModalBuyPackage] = useState({
    typeShow: 1, // 1 payment, 2 result
    isVisible: false,
  });

  const [dataVoucher, setDataVoucher] = useState<any>(null);

  useEffect(() => {
    setCanConfirm(
      selectedDate != null &&
        selectedTime != null &&
        bookingAddress?.text?.trim() != '',
    );
  }, [selectedDate, selectedTime, txtDes, bookingAddress]);

  const [modalConfirm, setModalConfirm] = React.useState({
    isVisible: false,
    message: '',
    onCancel: () => {},
    onConfirm: () => {},
  });

  const hasHandledPayment = useRef(false);
  const appState = useRef<any>(AppState.currentState);

  useEffect(() => {
    const handleOpenURL = (event: any) => {
      const urlMemoCallback = event.url;
      console.log('🚀 ~ handleOpenURL ~ urlMemoCallback:', urlMemoCallback);
      if (urlMemoCallback) {
        if (
          urlMemoCallback.includes(
            'doctornetwork://?partnerCode=MOMOI7R020210402&',
          )
        ) {
          const prefix: string =
            'doctornetwork://?partnerCode=MOMOI7R020210402&';
          let data = urlMemoCallback.slice(
            prefix.length,
            urlMemoCallback.length,
          );
          data = data.replace(/\+/g, '%20');
          const objParse = JSON.parse(
            '{"' +
              decodeURIComponent(
                data.replace(/&/g, '","').replace(/=/g, '":"'),
              ) +
              '"}',
          );
          console.log('🚀 ~ handleOpenURL ~ urlMemoCallback:', objParse);
          if (objParse.orderId) {
            hasHandledPayment.current = true; // ✅ IMPORTANT
            setPaymentResult(objParse);
            // Cho nay de tranh hien dau x failed
            setTimeout(() => {
              setModalBuyPackage({
                typeShow: 2,
                isVisible: true,
              });
            }, 300);
          }
        } else if (urlMemoCallback.includes('doctornetwork://?vnp_Amount')) {
          const prefix: string = 'doctornetwork://?';
          let data = urlMemoCallback.slice(
            prefix.length,
            urlMemoCallback.length,
          );
          data = data.replace(/\+/g, '%20');
          const objParse = JSON.parse(
            '{"' +
              decodeURIComponent(
                data.replace(/&/g, '","').replace(/=/g, '":"'),
              ) +
              '"}',
          );
          console.log('🚀 ~ handleOpenURL ~ objParse:', objParse);
          const objData = {
            resultCode:
              objParse.vnp_ResponseCode == '00'
                ? '0'
                : objParse.vnp_ResponseCode ?? '',
            message: '',
            amount: objParse.vnp_Amount ? objParse.vnp_Amount / 100 : 0,
            transId: objParse.vnp_TransactionNo ?? '',
          };
          if (objData.resultCode) {
            hasHandledPayment.current = true; // ✅ IMPORTANT
            setPaymentResult(objData);
            setTimeout(() => {
              setModalBuyPackage({
                typeShow: 2,
                isVisible: true,
              });
            }, 300);
          }
        }
      }
    };
    const subscription = Linking.addEventListener('url', handleOpenURL);
    return () => subscription.remove();
  }, []);

  const handleCheckPendingPayment = async () => {
    const MAX_PENDING_TIME = 15 * 60 * 1000; // 15 phút
    const obj = await getObjectData(STORAGEKEY.PAYMENT_PENDING_KEY);
    if (!obj?.orderId) return;
    // 👉 check timeout
    const now = Date.now();
    const createdTime = obj.time ?? 0;
    if (now - createdTime > MAX_PENDING_TIME) {
      // console.log('⏰ Payment expired → clear');
      removeValue(STORAGEKEY.PAYMENT_PENDING_KEY);
      return;
    }
    try {
      const res: any = await ApiService.getPaymentStatus({
        orderId: obj.orderId, // nhớ truyền đúng BE cần
      });
      // console.log('🚀 ~ handleCheckPendingPayment ~ res:', res.data?.status);

      if (!res || res.data?.status !== 'success') return;
      const result: any = res.data?.result || {};
      if (result.id.toString() == obj.orderId.toString()) {
        if (result.status == 1 && result.transaction_id) {
          hasHandledPayment.current = true;
          const objData = {
            resultCode: '0',
            message: '',
            amount: result.total_price ? result.total_price : 0,
            transId: result.transaction_id ?? '',
          };
          setPaymentResult(objData);
          setModalBuyPackage({
            typeShow: 2,
            isVisible: true,
          });
          // 👉 clear sau khi xử lý xong
          removeValue(STORAGEKEY.PAYMENT_PENDING_KEY);
        }
      }
    } catch (err) {
      console.log('checkPayment error', err);
    }
  };

  useEffect(() => {
    const sub = AppState.addEventListener('change', async nextState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        // 👉 nếu deep link đã xử lý rồi → skip
        if (hasHandledPayment.current) return;

        setTimeout(() => {
          handleCheckPendingPayment();
        }, 500);
      }
      appState.current = nextState;
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (paymentResult?.resultCode === '0') {
      dispatch(getProfile(null));
      setTimeout(() => {
        bookService(currentOrderId);
      }, 1500);
    }
  }, [paymentResult?.resultCode]);

  useEffect(() => {
    const processAPIBookingService = async () => {
      const {loading, data, error}: any = dataBookingCall;
      if (!loading) {
        if (data) {
          console.log('🚀 ~ processAPIBookingCall ~ data:', data);
          // Handle successful booking data
          //  {"result": {"id": 72}, "status": "success"}
          if (data.status == 'success') {
            setIsLoadingAPIBooking(false);
            setShowAlertBooking(false);
            setShowAlert(false);
            setIsLoadingAPI(false);
            if (dataVoucher) {
              setDataVoucher(null);
            }
            // Free service hoac co apply voucher
            if (
              service.price == 0 ||
              service.discount == 0 ||
              dataVoucher != null
            ) {
              setTimeout(() => {
                setModalConfirm({
                  isVisible: true,
                  message: t(
                    'booking.success',
                    '🎉 Booking successful! Your appointment is being confirmed. You’ll receive the result within 12 hours.',
                  ),
                  onCancel: () => {
                    setModalConfirm({
                      isVisible: false,
                      message: '',
                      onCancel: () => {},
                      onConfirm: () => {},
                    });
                    navigation.goBack();
                  },
                  onConfirm: () => {
                    setModalConfirm({
                      isVisible: false,
                      message: '',
                      onCancel: () => {},
                      onConfirm: () => {},
                    });
                    navigation.pop(1);
                    navigation.navigate('AppointmentTab', {idxTab: 1});
                  },
                });
              }, 300);
            }
          }

          dispatch(resetPackageChannel());
          setCurrentOrderId('');
        } else if (error) {
          console.log('🚀 ~ processAPIBookingCall ~ error:', error);
          // Goi lai hoan tien neu co loi
          if (currentOrderId) {
            dispatch(
              refundPkgCarely({
                order_id: currentOrderId,
              }),
            );
          }
          setCurrentOrderId('');
          setIsLoadingAPIBooking(false);
          setShowAlertBooking(false);
          setShowAlert(false);
          setIsLoadingAPI(false);
          Alert.alert('Thông báo', logError(error, '', true));
          // showToast(toastEl, logError(error, '', true));
          dispatch(resetPackageChannel());
        }
      }
    };
    processAPIBookingService();
  }, [dataBookingCall]);

  //ACTION
  const handleKYC = () => {
    if (isDoctor) {
      navigation.navigate(mainRoute.partnerEditProfileScreen)
    }
  };

  const handleHideWithPayCode = () => {
    dispatch(getProfile(null));
    setModalBuyPackage({
      typeShow: 1,
      isVisible: false,
    });
    setPaymentResult({resultCode: -1});
    navigation.pop(1);
    navigation.navigate('AppointmentTab', {idxTab: 1});
  };

  const waitMyPackageReadyBeforeBooking = async (packageId: any) => {
    try {
      for (let i = 0; i < 5; i++) {
        const result: any = await ApiService.getMyPackagesBeforeBooking(
          packageId,
        );
        const items: any[] = Array.isArray(result?.data?.items)
          ? result.data.items
          : [];

        if (items.length > 0) {
          return true;
        }
        if (i < 4) {
          await new Promise((resolve:any) => setTimeout(resolve, 1500));
        }
      }
      return false;
    } catch (error) {
      console.log('❌ waitPackageReadyBeforeBooking error:', error);
      return false;
    }
  };

  const bookService = async (orderIdFromUser: any, isVoucherFree = false) => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Thông báo', 'Vui lòng chọn ngày và giờ');
      setShowAlert(false);
      setIsLoadingAPI(false);
      return;
    }

    if (!channelData?.ownerInfo?.id || !channelData?.id) {
      Alert.alert('Lỗi', 'Thiếu thông tin kênh hoặc bác sĩ');
      setShowAlert(false);
      setIsLoadingAPI(false);
      return;
    }

    if (!service?.id) {
      Alert.alert('Lỗi', 'Dịch vụ không hợp lệ');
      setShowAlert(false);
      setIsLoadingAPI(false);
      return;
    }

    const specialists =
      channelData.categories?.length > 0 ? channelData.categories : [{id: ''}];

    const categoryId = specialists[0]?.id;

    if (!categoryId) {
      Alert.alert('Thông báo', 'Vui lòng chọn chuyên khoa');
      setShowAlert(false);
      setIsLoadingAPI(false);
      return;
    }

    const timeParsed = parseHM(selectedTime);
    if (!timeParsed) {
      Alert.alert('Lỗi', 'Thời gian không hợp lệ');
      setShowAlert(false);
      setIsLoadingAPI(false);
      return;
    }

    const {h, m} = timeParsed;

    const dt = new Date(selectedDate);
    if (isNaN(dt.getTime())) {
      Alert.alert('Lỗi', 'Ngày không hợp lệ');
      setShowAlert(false);
      setIsLoadingAPI(false);
      return;
    }

    dt.setHours(h, m, 0, 0);
    // console.log('🚀 ~ bookService ~ isVoucherFree:', isVoucherFree);
    if (isVoucherFree) {
      setIsLoadingAPIBooking(true);
      setShowAlertBooking(true);
    }

    // Chỗ này không cheat delay time nưa, mà gọi api
    // https://prod-api.doctornetwork.us/v1/packages/my?package_id=212 cho đến khi có giá trị
    // const result = await ApiService.getMyPackagesBeforeBooking(service.id);
    // Chờ BE update package xong trước khi booking
    const isPackageReady = await waitMyPackageReadyBeforeBooking(service.id);
    if (!isPackageReady) {
      Alert.alert(
        'Thông báo',
        'Gói dịch vụ chưa sẵn sàng. Vui lòng thử lại sau.',
      );
      setShowAlert(false);
      setShowAlertBooking(false);
      setIsLoadingAPI(false);
      setIsLoadingAPIBooking(false);
      return;
    }

    const bookingData = {
      doctor_id: channelData.ownerInfo.id,
      channel_id: channelData.id,
      category_id: categoryId,
      full_name: user.full_name || '',
      phone: user.phone || '',
      duration: stepMinutes || 60,
      note: txtDes,
      date: dt,
      type: service?.is_book_service == 0 ? 'ONLINE' : 'OFFLINE',
      address: bookingAddress?.text?.trim(),
      package_id: service.id,
      order_id: orderIdFromUser,
    };
    console.log('🚀 ~ bookService ~ bookingData:', bookingData);
    dispatch(postBookingChannel(bookingData));
  };

  const handleConfirm = async () => {
    // Kiem tra dia chi va ban kinh phuc vu
    const {price, discount, id, distance, latitude, longitude, radius} =
      service;
    // lat long lay tu dia chi chon

    if (
      radius &&
      radius > 0 &&
      bookingAddress?.geometry?.location?.lat &&
      bookingAddress?.geometry?.location?.lng
    ) {
      const distanceKm = distance
        ? distance
        : calculateDistance(
            bookingAddress?.geometry?.location?.lat,
            bookingAddress?.geometry?.location?.lng,
            latitude,
            longitude,
          );
      console.log('🚀 ~ handleConfirm ~ bookingAddress:', distanceKm, radius);
      if (distanceKm > radius) {
        showAgreeForm(
          t('carely.serviceArea', 'Phạm vi phục vụ'),
          t(
            'carely.overArea',
            'Địa chỉ nằm ngoài phạm vi phục vụ. Vui lòng chọn địa chỉ khác.',
          ),
        );
        return;
      }
    }

    if (!selectedDate || !selectedTime) return;
    // Cho nay kiem tra them neu goi la 0 dong thi cho book luon

    const priceFormat = parsePricePackage(price, discount);
    if (priceFormat.rootPrice == 0) {
      if (id) {
        setShowAlert(true);
        setIsLoadingAPI(true);
        setTimeout(() => {
          const params: any = {
            package_id: id,
            payment: PaymentTypes.momo,
          };
          dispatch(postBuyPackageFreeChannel(params));
        }, 200);
      } else {
        showToast(toastEl, 'Service not found!');
      }
    } else {
      hasHandledPayment.current = false;
      setModalBuyPackage({
        typeShow: 1,
        isVisible: true,
      });
    }
  };

  const handleOpenPickDate = () => {
    setOpenDatePicker(true);
  };

  const handleChangeDescription = (value: string) => {
    setTxtDes(value);
  };

  const handleTouchAddress = () => {
    setShowAddress(true);
  };

  const onChooseLocation = async (newLocation: any) => {
    setShowAddress(false);

    if (!newLocation) return;

    setBookingAddress(newLocation);

    try {
      const arrHis =
        (await getObjectData(STORAGEKEY.ALOKA_ADDRESS_HISTORY)) || [];

      // đã tồn tại → KHÔNG lưu nữa
      const isExist = arrHis.some(
        (item: any) =>
          item?.text?.toString().trim() ===
          newLocation?.text?.toString().trim(),
      );

      if (isExist) return;

      const newHistory = [newLocation, ...arrHis].slice(0, 5);

      storeObjectData(STORAGEKEY.ALOKA_ADDRESS_HISTORY, newHistory);
    } catch (error) {
      console.log('Save address history error:', error);
    }
  };

  //RENDER
  const renderAddress = () => {
    // Lay dia chi luu o local
    return (
      <Pressable
        style={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          justifyContent: 'center',
        }}
        onPress={handleTouchAddress}>
        <Row between style={{width: '100%'}}>
          <Row start style={{alignItems: 'flex-start', flex: 1}}>
            <IconX
              name={'location-sharp'}
              type={IconType.IONICONS}
              color={colors.c19A2A7}
              size={18}
            />
            <View style={[screenStyles.pH5, screenStyles.flex1]}>
              <CText
                h5
                color={colors.c101828}
                numberOfLines={2}
                style={{flexShrink: 1}}>
                {bookingAddress?.text?.trim() || t('carely.inputAddress')}
              </CText>
            </View>
          </Row>
          <Row end>
            <Pressable>
              <IconX
                name={'chevron-forward'}
                type={IconType.IONICONS}
                color={colors.c667085}
                size={22}
              />
            </Pressable>
          </Row>
        </Row>
      </Pressable>
    );
  };

  const renderKYC = () => {
    return (
      <>
        <CScrollView innerRef={scrollRef} style={screenStyles.pH24}>
          <Container isCenter style={screenStyles.pH24}>
            <CText h5 center w600 color={colors.c475467}>
              {t(
                'booking.updatePhone',
                'You need to update your phone number to continue.',
              )}
            </CText>
          </Container>
        </CScrollView>
        <CButton
          title={t('settings.appversion.action', 'Update Now')}
          isBottom
          onPress={handleKYC}
        />
      </>
    );
  };

  const renderDatePicker = () => {
    const isValid =
      Array.isArray(allDates) &&
      allDates.length > 0 &&
      startDate instanceof Date &&
      !isNaN(startDate.getTime()) &&
      endDate instanceof Date &&
      !isNaN(endDate.getTime());
    if (isValid) {
      return (
        <CInputTouch
          refChild={appointmentTimeRef}
          isRequire
          name={'packageOption'}
          value={
            selectedDate
              ? labelDate(selectedDate)
              : t('date.selectSingle', 'Pick a date')
          }
          onTouch={handleOpenPickDate}
          errorText={''}
          label={t('date.selectSingle', 'Pick a date')}
          placeHolder={'DD/MM/YYYY'}
        />
      );
    } else {
      return (
        <>
          <Row start style={screenStyles.mT5}>
            <CText h5 color={colors.c344054}>
              {t('date.selectSingle', 'Pick a date')}
            </CText>
            <CText h5 color={colors.error}>
              {' *'}
            </CText>
          </Row>
          <CText h5 color={colors.c667085} style={screenStyles.mT5}>
            {t('common.noDataAvailable', 'No data available')}
          </CText>
        </>
      );
    }
  };

  const renderTimeRange = () => {
    return (
      <View style={styles.grid}>
        {slots.length === 0 ? (
          <CText h5 color={colors.c667085}>
            {t(
              'booking.noTimeAvailable',
              'No available time slots for this date',
            )}
          </CText>
        ) : (
          slots.map(slot => {
            const isSelected = slot.time === selectedTime;
            // build datetime từ selectedDate + slot.time
            const {h, m} = parseHM(slot.time);
            const dt = new Date(selectedDate!);
            dt.setHours(h, m, 0, 0);
            const key = formatDateTimeKey(dt);
            const isBooked = bookedMap.has(key);

            const disabled = isBooked || !slot.isActive;

            return (
              <Pressable
                key={slot.time}
                style={[
                  styles.slot,
                  isSelected && styles.slotActive,
                  disabled && styles.slotDisabled,
                ]}
                disabled={disabled}
                onPress={() => !disabled && setSelectedTime(slot.time)}>
                <CText
                  h5
                  w400
                  color={
                    disabled
                      ? '#D0D5DD'
                      : isSelected
                      ? colors.white
                      : colors.c19A2A7
                  }>
                  {slot.time}
                </CText>
              </Pressable>
            );
          })
        )}
      </View>
    );
  };

  const renderNote = () => {
    return (
      <CAreaContent
        refChild={descriptionEl}
        isRequire={false}
        value={txtDes}
        onChange={handleChangeDescription}
        errorText={''}
        label={t('package.consultationNote', 'Consultation note')}
        placeHolder={t('package.consultationNote', 'Consultation note')}
        // placeHolder={t("validation.minimum5Chars", "at minimum length of 5")}
        heightView={100}
        maxCharLimit={1500}
        onFocus={() => {
          if (isIOS) {
            setTimeout(() => {
              scrollRef.current?.scrollToEnd({animated: true});
            }, 300);
          }
        }}
      />
    );
  };

  const renderRange = () => {
    // const { time_package, time_break } = service;
    // const timeService = time_package ? time_package : 0;
    const isValid =
      Array.isArray(allDates) &&
      allDates.length > 0 &&
      startDate instanceof Date &&
      !isNaN(startDate.getTime()) &&
      endDate instanceof Date &&
      !isNaN(endDate.getTime());
    if (isValid) {
      return (
        <>
          {/* {renderPackageSuggest()} */}
          <View style={screenStyles.pH20}>
            {renderDatePicker()}
            <Row start style={screenStyles.mT5}>
              <CText h5 color={colors.c344054}>
                {t('time.selectSingle', 'Pick a time')}
              </CText>
              <CText h5 color={colors.error}>
                {' *'}
              </CText>
            </Row>
            {renderTimeRange()}
            {renderNote()}
          </View>
        </>
      );
    }
  };

  const renderWorkTime = () => {
    const isValid =
      Array.isArray(allDates) &&
      allDates.length > 0 &&
      startDate instanceof Date &&
      !isNaN(startDate.getTime()) &&
      endDate instanceof Date &&
      !isNaN(endDate.getTime());
    const {time_package, time_break} = service;
    const timeService = time_package ? time_package : 0;
    return (
      <View
        style={{
          paddingVertical: 8,
          flex: 1,
        }}>
        {!user.phone ? (
          renderKYC()
        ) : (
          <KeyboardAvoidingView
            behavior={isIOS ? 'padding' : undefined}
            style={screenStyles.flex1}
            keyboardVerticalOffset={getStatusBarHeight()}>
            <CScrollView innerRef={scrollRef}>
              {isValid ? (
                renderRange()
              ) : (
                <CEmptyData
                  title={t(
                    'booking.noSchedule',
                    'No work schedule yet, please check back later.',
                  )}
                />
              )}
              <Divider
                color={colors.cF2F4F7}
                width={4}
                style={screenStyles.mT8}
              />
              <Row between style={[screenStyles.pH24, screenStyles.pV12]}>
                <CText h5 color={colors.c344054}>
                  {t('carely.serviceDuration', 'Thời gian thực hiện dịch vụ')}
                </CText>
                <View
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#ECFDF3',
                  }}>
                  <CText color={colors.c19A2A7} h5 w400>
                    {timeService +
                      ' ' +
                      (timeService > 1
                        ? t('common.minutes')
                        : t('common.minute'))}
                  </CText>
                </View>
              </Row>
            </CScrollView>
            <CButton
              title={t('common.confirm')}
              isDisable={!canConfirm}
              onPress={handleConfirm}
              disabledStyle={{backgroundColor: 'rgba(25,162,167, 0.8)'}}
              buttonStyle={{backgroundColor: colors.c19A2A7}}
              isBottom
            />
          </KeyboardAvoidingView>
        )}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <Container>
        <Divider color={colors.cF2F4F7} width={4} />
        {renderAddress()}
        <Divider color={colors.cF2F4F7} width={4} />
        {renderWorkTime()}
      </Container>
    );
  };

  return (
    <Wrapper>
      <CHeader
        isBorderBottom={true}
        title={t('package.consultationTime', 'Consultation Time')}
        rightComponentDisable
        leftComponentOnPress={() => {
          navigation.goBack();
        }}
      />
      {renderContent()}
      <DatePickerModal
        locale={i18n.language}
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={selectedDate ?? startDate ?? undefined}
        validRange={{
          startDate: startDate ?? undefined,
          endDate: endDate ?? undefined,
        }}
        onConfirm={(params:any) => {
          setOpenDatePicker(false);
          if (params.date) {
            setSelectedDate(params.date);
            setSelectedTime(null);
          }
        }}
      />
      {showAlert ? (
        <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
      ) : null}
      {showAlertBooking ? (
        <APILoading
          showAlert={showAlertBooking}
          isLoadingAPI={isLoadingAPIBooking}
        />
      ) : null}
      <ConfirmModal
        visible={modalConfirm.isVisible}
        message={modalConfirm.message}
        onCancel={modalConfirm.onCancel}
        onConfirm={modalConfirm.onConfirm}
        cancelText={t('common.close')}
        confirmText={t('booking.viewAppointment', 'View appointment')}
      />
      <ModalPayment
        isVisible={modalBuyPackage.isVisible}
        hideModal={() => {
          setModalBuyPackage({
            typeShow: 1,
            isVisible: false,
          });
          setPaymentResult({resultCode: -1});
        }}
        dataDetailPackage={service || {}}
        typeShow={modalBuyPackage.typeShow}
        paymentResult={paymentResult}
        updateTypeShow={(typeShow: number) => {
          setModalBuyPackage({
            ...modalBuyPackage,
            typeShow,
          });
          setPaymentResult({resultCode: -1});
        }}
        hideWithPayCode={handleHideWithPayCode}
        channelName={channelData?.name || ''}
        selectedDate={selectedDate || ''}
        selectedTime={selectedTime || ''}
        bookingAddress={bookingAddress?.text?.trim() || ''}
        setCurrentOrderId={setCurrentOrderId}
        hideModalFreeWithVoucher={(order_id: any, dataVoucher: any) => {
          setDataVoucher(dataVoucher);
          dispatch(getProfile(null));
          bookService(order_id, true);
        }}
      />
      {showAddress && (
        <ModalSearchNearby
          modalVisibled={showAddress}
          onClose={() => {
            setShowAddress(false);
          }}
          onChooseLocation={onChooseLocation}
        />
      )}
      <ModalAgreeForm
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
      />
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

const useStyles = makeStyles(({colors}) => ({
  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    paddingBottom: 8,
    marginTop: 5,
  },
  slot: {
    flexBasis: '20%' as const, // khoảng 4 ô mỗi hàng, có khoảng trống giữa
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#19A2A7',
    backgroundColor: '#fff',
    margin: 4,
  },
  slotActive: {
    backgroundColor: '#19A2A7',
    borderColor: '#19A2A7',
  },
  slotDisabled: {
    backgroundColor: 'white' as const,
    borderColor: '#d1d5db',
  },
}));

export default BookingScreen;
