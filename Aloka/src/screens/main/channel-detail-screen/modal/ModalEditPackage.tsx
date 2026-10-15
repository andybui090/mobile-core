import {
  CAreaContent,
  CInput,
  CInputTouch,
  IconType,
  IconX,
  ImageHelper,
  Toast,
  ToggleSwitch,
} from '@/components';
import {
  formatMoneyVNDPackage,
  getStatusBarHeight,
  ifIphoneX,
  images,
  isIOS,
  logError,
  screenStyles,
  ScreenWidth,
  showToast,
} from '@/configs';
import { PAGINATION, STORAGEKEY } from '@/constants';
import { thumnailSingleCropLauncher } from '@/permissions/laucher';
import { showPhotoLibraryDropThumnail } from '@/permissions/picker';
import {
  getDetailChannelOptionServicesPackage,
  postEditChannelPackage,
  resetPackageChannel,
} from '@/redux/slices/channelSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { getObjectData, storeObjectData } from '@/storages';
import { CButton, CScrollView, CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  Pressable,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
// import {ModalPackageDuration} from './ModalPackageDuration';
import { ModalPackageSuggest } from './ModalPackageSuggest';
import ModalSearchLocation from './ModalSearchLocation';
import { useTheme, makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ colors }) => ({
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  contentContainer: {
    width: '100%' as const,
    height: '87%' as const,
  },
}));

type PackageOption = {
  id: number;
  name: string;
  is_book_service: number;
};

type PackageService = {
  key: number;
  value: string;
};

type ToggleKeys = 'isCall1vs1' | 'isChat' | 'isNewsfeed';

type DataEditProps = {
  packageOption: PackageOption;
  packageName: string;
  packagePrice: string;
  duration: string;
  packageDiscount: string;
  isBooking: boolean;
  isNewsfeed: boolean;
  isCall1vs1: boolean;
  numberCall: string;
  isChat: boolean;
  numberChat: string;
  descriptions: PackageService[]; // ✅ mảng các PackageService
  fileThumnail: any;
  location: any;
  packageAddress: string;
  radius: string;
  serviceTime: string;
};

type Props = {
  label: string;
  value: boolean; // true = ON, false = OFF
  onChange: (v: boolean) => void;
};

const CheckBoxItem = ({ label, value, onChange }: Props) => {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}
    >
      <IconX
        name={value ? 'check-square' : 'square'}
        type={IconType.ANT_DESIGN}
        color={value ? colors.primary : '#667085'}
        size={20}
      />
      <CText style={{ marginLeft: 8 }} color="#344054">
        {label}
      </CText>
    </Pressable>
  );
};

export const ModalEditPackage = ({
  isVisible,
  itemEdit,
  hideModal,
  channelData,
  user,
  onEditPackageSuccess,
  isStudent,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const styles = useStyles();

  const { listOptionPackageChannel, dataEditPackageChannel } = useAppSelector(
    state => state.channelReducer,
  );

  const scrollRef = useRef<any>(null);

  const packageOptionRef = useRef<any>(null);

  const packageNameRef = useRef<any>(null);
  const [errPackageName, setErrPackageName] = useState<string>('');

  const packagePriceRef = useRef<any>(null);
  const [errPackagePrice, setErrPackagePrice] = useState<string>('');

  const packageTimeRef = useRef<any>(null);

  const packageDiscountRef = useRef<any>(null);
  const [errPackageDiscount, setErrPackageDiscount] = useState<string>('');

  const packageCallNumberRef = useRef<any>(null);

  const packageChatNumberRef = useRef<any>(null);

  const [activeBtn, setActiveBtn] = useState(false);

  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const toastEl = useRef(null);
  const desEl = useRef<any>(null);
  const [errDes, setErrDes] = useState<string>('');
  const [txtDes, setTxtDes] = useState<string>('');

  const packageTimeServiceRef = useRef<any>(null);
  const [errPackageTimeService, setErrPackageTimeService] =
    useState<string>('');

  // Modal choose package option
  const [modalPackageSuggest, setModalPackageSuggest] = useState<any>({
    isVisible: false,
    listPackageOptions: [],
  });

  const [modalPackageTime, setModalPackageTime] = useState<any>({
    isVisible: false,
    timeOptions: [1, 3, 6, 9, 12],
  });

  const [dataEdit, setDataEdit] = useState<DataEditProps>({
    packageOption: { id: -1, name: '', is_book_service: 0 },
    packageName: '',
    packagePrice: '',
    duration: '',
    packageDiscount: '',
    serviceTime: '',
    isBooking: false,
    isNewsfeed: false,
    isCall1vs1: false,
    numberCall: '',
    isChat: false,
    numberChat: '',
    descriptions: [],
    fileThumnail: { path: null },
    location: {},
    packageAddress: '',
    radius: '',
  });

  const packageLocationRef = useRef<any>(null);
  const [showAddress, setShowAddress] = useState<boolean>(false);

  const packageRadiusRef = useRef<any>(null);
  const [errPackageRadius, setErrPackageRadius] = useState<string>('');

  //danh sách all package
  useEffect(() => {
    const callAPIChannelPackageOptions = () => {
      let param: any = {
        limit: PAGINATION.ITEMS_50,
        offset: 0,
        fq: `status:1,is_deleted:0,parent_id:0,is_book_service:1`,
      };
      if (isStudent) {
        param.fq += ',is_expert_only:0';
      }
      dispatch(getDetailChannelOptionServicesPackage(param));
    };
    callAPIChannelPackageOptions();
  }, []);

  useEffect(() => {
    const proccessPackageOptionAPI = () => {
      const { loading, data, error } = listOptionPackageChannel;
      if (!loading) {
        if (data) {
          const newItems = data.items || [];
          setModalPackageSuggest({
            ...modalPackageSuggest,
            listPackageOptions: newItems,
          });
        } else if (error) {
          console.log('🚀 ~ proccessPackageOptionAPI ~ error:', error);
        }
      }
    };
    proccessPackageOptionAPI();
  }, [listOptionPackageChannel]);

  useEffect(() => {
    if (modalPackageSuggest.listPackageOptions.length > 0) {
      const listSuggest = modalPackageSuggest.listPackageOptions;
      for (let i = 0; i < listSuggest.length; i++) {
        if (listSuggest[i].id == itemEdit.parent_id) {
          setDataEdit((prev: DataEditProps) => ({
            ...prev,
            packageOption: listSuggest[i],
          }));
          break;
        }
      }
    }
  }, [modalPackageSuggest.listPackageOptions]);

  useEffect(() => {
    const initDataEdit = () => {
      const {
        name,
        price,
        duration,
        discount,
        is_newsfeed,
        call_1vs1,
        chat_1vs1,
        count_call,
        count_chat,
        description,
        is_book_service,
        location,
        address,
        radius,
        time_package,
      } = itemEdit;
      let options: { key: number; value: string }[] = [];
      for (let i = 1; i <= 5; i++) {
        const value = itemEdit[`option${i}` as keyof typeof itemEdit];
        if (value) {
          options.push({ key: i, value: value as string });
        }
      }
      setDataEdit((prev: DataEditProps) => ({
        ...prev,
        packageName: name || '',
        packagePrice: price ?? '',
        duration: duration || '',
        packageDiscount: discount ?? '',
        isBooking: is_book_service == 1,
        isNewsfeed: is_newsfeed == 1,
        isCall1vs1: call_1vs1 == 1,
        isChat: chat_1vs1 == 1,
        // ✅ chỉ set nếu count_call > 0
        numberCall: count_call && count_call > 0 ? count_call : '',
        numberChat: count_chat && count_chat > 0 ? count_chat : '',
        descriptions: options,
        fileThumnail: { path: itemEdit.thumbnail || null },
        location: location || {},
        packageAddress: address || '',
        radius: radius?.toString() || '',
        serviceTime: time_package ? time_package.toString() : '0',
      }));
      setTxtDes(description || '');
    };
    if (itemEdit.id) {
      initDataEdit();
    }
  }, [itemEdit]);

  const toNumberOrNull = (val: any): number | null => {
    if (val === null || val === undefined || val === '') return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  useEffect(() => {
    const checkActiveBtn = () => {
      const {
        packageOption,
        packageName,
        packagePrice,
        packageDiscount,
        duration,
        isCall1vs1,
        isChat,
        isNewsfeed,
        isBooking,
        numberCall,
        numberChat,
        descriptions,
        fileThumnail,
        location,
        radius,
        serviceTime,
      } = dataEdit;

      let valid = true;
      // if (packageOption.id == -1) {
      //     valid = false;
      // }
      if (packageName.toString().trim() == '') {
        valid = false;
      }
      // if (packagePrice.toString().trim() == '') {
      //   valid = false;
      // }
      if (
        packagePrice === '' ||
        packagePrice === null ||
        packagePrice === undefined
      ) {
        valid = false;
      }
      // console.log('🚀 ~ checkActiveBtn ~ isChange:', packagePrice, valid);
      if (duration.toString().trim() == '') {
        valid = false;
      }
      // Kiem tra tiep trang thai du lieu co thay doi khong
      let isChange = false;
      if (packageOption.id !== -1 && packageOption.id !== itemEdit.parent_id) {
        isChange = true;
      }
      if (fileThumnail && fileThumnail.path !== itemEdit.thumbnail) {
        isChange = true;
      }
      if (packageName.toString().trim() !== itemEdit.name.toString().trim()) {
        isChange = true;
      }
      if (
        parseVND(packagePrice).toString().trim() !==
        itemEdit.price.toString().trim()
      ) {
        isChange = true;
      }
      if (
        parseVND(packageDiscount).toString().trim() !==
        itemEdit.discount.toString().trim()
      ) {
        isChange = true;
      }
      if (
        !dataEdit.isBooking &&
        duration.toString().trim() !== itemEdit.duration.toString().trim()
      ) {
        isChange = true;
      }
      if (
        serviceTime.toString().trim() !==
        itemEdit.time_package.toString().trim()
      ) {
        isChange = true;
      }
      if (isBooking != (itemEdit.is_book_service == 1)) {
        isChange = true;
      }
      const isFeed = isNewsfeed ? 1 : 0;
      if (isFeed != itemEdit.is_newsfeed) {
        isChange = true;
      }
      const isAChat = isChat ? 1 : 0;
      if (isAChat != itemEdit.chat_1vs1) {
        isChange = true;
      }
      const isACall = isCall1vs1 ? 1 : 0;
      if (isACall != itemEdit.call_1vs1) {
        isChange = true;
      }
      const countCall =
        itemEdit.count_call && itemEdit.count_call > 0
          ? itemEdit.count_call
          : '';
      if (numberCall != countCall) {
        isChange = true;
      }
      const countChat =
        itemEdit.count_chat && itemEdit.count_chat > 0
          ? itemEdit.count_chat
          : '';
      if (numberChat != countChat) {
        isChange = true;
      }
      let options: { key: number; value: string }[] = [];
      for (let i = 1; i <= 5; i++) {
        const value = itemEdit[`option${i}` as keyof typeof itemEdit];
        if (value) {
          options.push({ key: i, value: value as string });
        }
      }
      if (options.length > descriptions.length) {
        isChange = true;
      }

      if (descriptions.length == 0) {
        if (options.length > 0) {
          isChange = true;
        }
      } else {
        for (let i = 0; i < descriptions.length; i++) {
          if (
            descriptions[i]?.value?.toString().trim() !=
            options[i]?.value?.toString().trim()
          ) {
            isChange = true;
            break;
          }
        }
      }
      if (
        txtDes.toString().trim() !==
        (itemEdit.description || '').toString().trim()
      ) {
        isChange = true;
      }
      // console.log('🚀 ~ checkActiveBtn ~ itemEdit:', itemEdit);
      const lat1 = toNumberOrNull(itemEdit?.latitude);
      const lng1 = toNumberOrNull(itemEdit?.longitude);

      const lat2 = toNumberOrNull(location?.lat);
      const lng2 = toNumberOrNull(location?.lng);

      const radius1 = toNumberOrNull(itemEdit?.radius);
      const radius2 = toNumberOrNull(radius);

      if (lat1 !== lat2 || lng1 !== lng2) {
        isChange = true;
      }

      if (radius1 !== radius2) {
        isChange = true;
      }
      setActiveBtn(valid && isChange);
    };
    checkActiveBtn();
  }, [JSON.stringify(dataEdit), itemEdit, txtDes]);

  //tạo gói
  useEffect(() => {
    const proccessAPIEditPackage = () => {
      const { loading, data, error } = dataEditPackageChannel;
      if (!loading) {
        if (data) {
          console.log('🚀 ~ proccessAPIEditPackage ~ data:', data);
          setIsLoadingAPI(false);
          dispatch(resetPackageChannel());
          onEditPackageSuccess(itemEdit.id);
        } else if (error) {
          console.log('🚀 ~ proccessAPIEditPackage ~ error:', error);
          showToast(toastEl, logError(error, '', true));
          setIsLoadingAPI(false);
          dispatch(resetPackageChannel());
        }
      }
    };
    proccessAPIEditPackage();
  }, [dataEditPackageChannel]);

  //ACTION
  const parseVND = (value: unknown): number => {
    if (typeof value === 'number')
      return Number.isFinite(value) ? Math.floor(value) : 0;
    if (typeof value === 'string') {
      const num = Number(value.replace(/[^\d]/g, ''));
      return Number.isFinite(num) ? num : 0;
    }
    return 0;
  };

  const isValidVND = (value: unknown, min = 1000): boolean => {
    const amount = parseVND(value);
    return Number.isInteger(amount) && amount >= min && amount % 1000 === 0;
  };

  const handleTouchPackageOption = () => {
    setModalPackageSuggest({ ...modalPackageSuggest, isVisible: true });
  };

  const handleChoosePackageSuggest = (option: any) => {
    if (option.id && option.id != dataEdit.packageOption.id) {
      let arrOption: { key: number; value: string }[] = [];
      for (let i = 1; i <= 5; i++) {
        const value = option[`option${i}` as keyof typeof option];
        if (value) {
          arrOption.push({ key: i, value });
        }
      }
      setDataEdit((prev: DataEditProps) => ({
        ...prev,
        packageOption: option,
        packagePrice: option.price || '',
        packageDiscount: option.discount || '',
        isNewsfeed: option.is_newsfeed == 1,
        isChat: option.chat_1vs1 == 1,
        numberChat:
          option.chat_1vs1 == 1 && option.count_chat !== -1
            ? option.count_chat
            : '',
        isCall1vs1: option.call_1vs1 == 1,
        numberCall:
          option.call_1vs1 == 1 && option.count_call !== -1
            ? option.count_call
            : '',
        isBooking: option.is_book_service == 1,
        descriptions: arrOption,
      }));
    }
    setModalPackageSuggest((prev: any) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const handleChangePackageName = (value: string) => {
    setDataEdit((prev: DataEditProps) => ({ ...prev, packageName: value }));
    setErrPackageName('');
  };

  const handleChangePackagePrice = (value: string) => {
    setDataEdit((prev: DataEditProps) => ({ ...prev, packagePrice: value }));
    setErrPackagePrice('');
  };

  const handleTouchTimeOption = () => {
    setModalPackageTime({ ...modalPackageTime, isVisible: true });
  };

  const handleChoosePackageTime = (value: any) => {
    if (value != dataEdit.duration) {
      setDataEdit((prev: DataEditProps) => ({ ...prev, duration: value }));
    }
    setModalPackageTime((prev: any) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const onChooseLocation = async (itemLocation: any) => {
    setShowAddress(false);

    const address = itemLocation?.address?.toString().trim();
    const location = itemLocation?.location;
    if (!address || !location) return;

    // update UI state
    setDataEdit((prev: any) => ({
      ...prev,
      location,
      packageAddress: address,
    }));

    try {
      const arrHis =
        (await getObjectData(STORAGEKEY.LOCATION_ADDRESS_HISTORY)) || [];

      // 🔥 FIX: vì giờ lưu object → check đúng structure
      const isExist = arrHis.some(
        (item: any) => item?.address?.toString().trim() === address,
      );

      if (isExist) return;

      // ✅ lưu object đầy đủ
      const newItem = {
        address,
        location,
      };

      const newHistory = [newItem, ...arrHis].slice(0, 5);

      await storeObjectData(STORAGEKEY.LOCATION_ADDRESS_HISTORY, newHistory);
    } catch (error) {
      console.log('Save address history error:', error);
    }
  };

  const handleChangePackageDiscount = (value: string) => {
    setDataEdit((prev: any) => ({ ...prev, packageDiscount: value }));
    setErrPackageDiscount('');
  };

  const handleChangePackageTime = (value: string) => {
    setDataEdit((prev: any) => ({ ...prev, serviceTime: value }));
    setErrPackageTimeService('');
  };

  const handleToggle = (name: ToggleKeys) => {
    setDataEdit((prev: DataEditProps) => ({
      ...prev,
      [name]: !prev[name], // dùng [name] để lấy key động
    }));
  };

  const handleChangePackageValue = (name: string, value: string) => {
    setDataEdit((prev: DataEditProps) => ({ ...prev, [name]: value }));
  };

  const handleTouchPackageLocation = () => {
    Keyboard.dismiss();
    setShowAddress(true);
  };

  const handleChangePackageRaDius = (value: string) => {
    setDataEdit((prev: any) => ({ ...prev, radius: value }));
    setErrPackageRadius('');
  };

  const handleAddNewDescription = () => {
    let arrClone = JSON.parse(JSON.stringify(dataEdit.descriptions));
    arrClone.push({ key: arrClone.length, value: '' });
    setDataEdit((prev: any) => ({ ...prev, descriptions: arrClone }));
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleChangeDescription = (index: number, value: string) => {
    setDataEdit((prev: any) => {
      const newDescriptions = [...prev.descriptions];
      newDescriptions[index].value = value;
      return { ...prev, descriptions: newDescriptions };
    });
  };

  const handleRemoveDescription = (index: number) => {
    let objClone = { ...dataEdit };
    objClone.descriptions.splice(index, 1);
    setDataEdit(objClone);
  };

  const handleSubmit = () => {
    if (isLoadingAPI) return;

    const {
      packageOption,
      fileThumnail,
      packageName,
      packagePrice,
      duration,
      packageDiscount,
      isBooking,
      isNewsfeed,
      isChat,
      numberChat,
      isCall1vs1,
      numberCall,
      descriptions,
      location,
      radius,
      packageAddress,
      serviceTime,
    } = dataEdit;

    const rootPrice = parseVND(packagePrice);
    const discountPrice = parseVND(packageDiscount);
    let hasError = false;
    // --- Validate price ---
    if (!isValidVND(packagePrice, isBooking ? 0 : 0)) {
      setErrPackagePrice(
        t(
          'package.errorPriceMin',
          'Price must be at least 1.000 VND and must be a valid amount',
        ),
      );
      hasError = true;
    }
    // --- Validate discount ---
    if (discountPrice && discountPrice !== 0) {
      if (!isValidVND(packageDiscount)) {
        setErrPackageDiscount(
          t(
            'package.errorDiscountMin',
            'Price must be at least 1.000 VND and must be a valid amount',
          ),
        );
        hasError = true;
      } else if (discountPrice > rootPrice - 1000) {
        setErrPackageDiscount(
          t(
            'package.errorDiscountOver',
            'Discount must be less than original price minus 1.000 VND',
          ),
        );
        hasError = true;
      }
    }

    // --- Validate time service ---
    const serviceTimeNumber = parseInt(serviceTime, 10);
    if (isNaN(serviceTimeNumber) || serviceTimeNumber < 0) {
      setErrPackageTimeService(
        t(
          'package.errorServiceTime',
          'Service time must be a number greater than or equal to 0',
        ),
      );
      hasError = true;
    }

    if (hasError) return;

    const { manager, owner_id, id } = channelData;
    const userId = manager?.user_id === user.id ? manager?.user_id : owner_id;

    let param: any = {
      id: itemEdit.id,
      // parent_id: packageOption.id,
      user_id: userId,
      channel_id: id,
      price: rootPrice,
      name: packageName,
      is_newsfeed: isNewsfeed ? 1 : 0,
      duration: Number(duration) || 1,
      time_package: serviceTimeNumber,
    };
    // if (packageOption.id && packageOption.id != -1) {
    //     param.parent_id = packageOption.id;
    // }
    if (packageOption.id && packageOption.id != -1) {
      param.parent_id = packageOption.id;
    } else {
      param.parent_id = 0;
    }
    if (fileThumnail.path && fileThumnail.path != itemEdit.thumbnail) {
      // const _filename = dataVideo.fileName ? dataVideo.fileName : 'video' + moment().unix().toString() + '.mp4';
      param.thumbnail = {
        filename: fileThumnail.fileName
          ? fileThumnail.fileName
          : `thumbnail_${Date.now()}.jpg`,
        data: `data:${fileThumnail.mime};base64,${fileThumnail.data}`,
      };
    }
    if (discountPrice >= 0) {
      param.discount = discountPrice;
    }
    param.chat_1vs1 = isChat ? 1 : 0;
    const numChat = parseInt(numberChat, 10);
    if (!isNaN(numChat)) {
      param.count_chat = numChat;
    } else {
      param.count_chat = -1;
    }
    if (isBooking) {
      param.is_book_service = 1;
      param.call_1vs1 = 0;
      param.count_call = -1;
      if (location.lat && location.lng) {
        param.latitude = location.lat || '';
        param.longitude = location.lng || '';
      }
      if (radius && radius.trim() !== '') {
        param.radius = parseInt(radius.trim(), 10);
      }
      if (packageAddress) {
        param.address = packageAddress || '';
      }
    } else {
      param.is_book_service = 0;
      param.call_1vs1 = isCall1vs1 ? 1 : 0;
      const numCall = parseInt(numberCall, 10);
      if (!isNaN(numCall)) {
        param.count_call = numCall;
      } else {
        param.count_call = -1;
      }
    }
    if (txtDes.trim() !== itemEdit.description?.trim()) {
      param.description = txtDes.trim();
    }

    const filtered = descriptions.filter((item: any) => item.value !== '');
    // console.log("🚀 ~ handleSubmit ~ filtered:", filtered)
    for (let index = 0; index < 5; index++) {
      const item = filtered[index];
      const key = `option${index + 1}` as keyof typeof param;
      if (!item) {
        param[key] = null;
      } else {
        param[key] = item?.value;
      }
    }
    // console.log("🚀 ~ handleSubmit ~ param:", param)
    setIsLoadingAPI(true);
    dispatch(postEditChannelPackage(param));
  };

  const handleUploadThumnail = async () => {
    // Upload file logic here
    // const checkPhoto: any = await thumnailSingleCropLauncher();
    let checkPhoto: any = {};
    if (Platform.OS == 'android') {
      checkPhoto = await showPhotoLibraryDropThumnail();
    } else {
      checkPhoto = await thumnailSingleCropLauncher();
    }
    if (checkPhoto.isSuccess) {
      // console.log("🚀 ~ handleUploadThumnail ~ checkPhoto.imgRes:", checkPhoto.imgRes)
      if (checkPhoto.imgRes) {
        setDataEdit({
          ...dataEdit,
          fileThumnail: checkPhoto.imgRes,
        });
      }
    } else if (checkPhoto.msg) {
      console.log('🚀 ~ handlePhoto ~ checkPhoto.msg:', checkPhoto.msg);
    }
  };

  const handleChangeDes = (value: string) => {
    setErrDes('');
    setTxtDes(value);
  };

  const handleChangePackageBooking = (value: boolean) => {
    if (dataEdit.packageOption.id == -1) {
      if (value) {
        setErrPackagePrice('');
      }
      setDataEdit((prev: any) => ({ ...prev, isBooking: value }));
    }
  };

  //RENDER
  const renderPackageSuggest = () => (
    <CInputTouch
      refChild={packageOptionRef}
      isRequire={false}
      name={'packageOption'}
      value={dataEdit.packageOption.name}
      onTouch={handleTouchPackageOption}
      errorText={''}
      label={t('package.suggest')}
      placeHolder={t('package.suggest')}
    />
  );

  const renderThumnail = () => {
    return (
      <>
        <CText h5 color={colors.c344054}>
          {t('package.thumnail', 'Thumbnail')}
        </CText>
        <Pressable
          style={{
            borderRadius: 8,
            borderColor: colors.cD0D5DD,
            backgroundColor: colors.cFCFCFD,
            borderWidth: 1,
            marginTop: 8,
            height: (ScreenWidth / 3.5) * 1.33,
            width: ScreenWidth / 3.5,
            borderStyle: dataEdit.fileThumnail.path ? 'solid' : 'dashed',
            overflow: 'hidden',
          }}
          onPress={handleUploadThumnail}
        >
          {dataEdit.fileThumnail.path ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <ImageHelper
                source={{
                  uri: dataEdit.fileThumnail.path,
                }}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconX
                type={IconType.MATERIAL_DESIGN_ICONS}
                name="file-image-plus"
                size={32}
                color={colors.c98A2B3}
              />
              <CText h6 color={colors.c98A2B3} style={{ marginTop: 8 }}>
                {'3:4'}
              </CText>
            </View>
          )}
        </Pressable>
      </>
    );
  };

  const renderPackageName = () => {
    return (
      <CInput
        isRequire
        refChild={packageNameRef}
        value={dataEdit.packageName}
        onChange={handleChangePackageName}
        errorText={errPackageName}
        label={t('package.name')}
        placeHolder={t('package.inputName')}
        returnKeyType={'next'}
        autoCapitalize={'words'}
        onSubmitEditing={() => packagePriceRef.current?.focus()}
        maxLength={100}
      />
    );
  };

  const renderPackagePrice = () => {
    return (
      <>
        <Row between>
          <View style={{ flex: 2, marginRight: 8 }}>
            <CInput
              isRequire
              refChild={packagePriceRef}
              value={
                dataEdit.packagePrice === '' ||
                dataEdit.packagePrice === null ||
                dataEdit.packagePrice === undefined
                  ? ''
                  : formatMoneyVNDPackage(dataEdit.packagePrice.toString(), '.')
              }
              onChange={handleChangePackagePrice}
              errorText={''}
              label={t('package.price')}
              placeHolder={t('package.enterPrice', 'Enter Price')}
              returnKeyType={isIOS ? 'done' : 'next'}
              keyboardType={'numeric'}
              maxLength={12}
              onSubmitEditing={() => packageDiscountRef.current?.focus()}
            />
          </View>
          {!dataEdit.isBooking && (
            <View style={{ flex: 1.5 }}>
              <CInputTouch
                refChild={packageTimeRef}
                isRequire
                name={'packageTime'}
                value={dataEdit.duration}
                onTouch={handleTouchTimeOption}
                errorText={''}
                label={t('package.validityPeriod', 'Validity (months)')}
                placeHolder={t('common.select') + ' ' + t('common.month')}
              />
            </View>
          )}
        </Row>
        {errPackagePrice && (
          <CText
            h5
            w400
            style={{
              marginVertical: 5,
              color: '#F04438',
              marginLeft: 5,
            }}
          >
            {errPackagePrice}
          </CText>
        )}
      </>
    );
  };

  const renderPackagePriceDiscount = () => {
    return (
      <CInput
        refChild={packageDiscountRef}
        value={
          dataEdit.packageDiscount === '' ||
          dataEdit.packageDiscount === null ||
          dataEdit.packageDiscount === undefined
            ? ''
            : formatMoneyVNDPackage(dataEdit.packageDiscount.toString(), '.')
        }
        onChange={handleChangePackageDiscount}
        errorText={errPackageDiscount}
        label={t('package.discount', 'Discounted Price')}
        placeHolder={t('package.enterPrice', 'Enter Price')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={12}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  };

  const renderPackageTimeDuration = () => {
    return (
      <CInput
        refChild={packageTimeServiceRef}
        value={dataEdit.serviceTime}
        onChange={handleChangePackageTime}
        errorText={errPackageTimeService}
        label={t(
          'package.serviceDuration',
          'Thời gian thực hiện dịch vụ (phút)',
        )}
        placeHolder={'30'}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={12}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  };

  const renderBookingType = () => {
    if (dataEdit.packageOption.id == -1) {
      return (
        <View style={screenStyles.pV6}>
          <Row start>
            <CheckBoxItem
              label={t(
                'booking.clinicConsultation',
                'Đặt lịch tư vấn tại phòng khám',
              )}
              value={dataEdit.isBooking}
              onChange={handleChangePackageBooking}
            />
          </Row>
        </View>
      );
    } else if (dataEdit.packageOption.is_book_service == 1) {
      return (
        <View style={screenStyles.pV6}>
          <Row start>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <IconX
                name={'check-square'}
                type={IconType.ANT_DESIGN}
                color={colors.primary}
                size={20}
              />
              <CText style={{ marginLeft: 8 }} color="#344054">
                {t('booking.clinicConsultation', 'Dịch vụ chăm sóc tại nhà')}
              </CText>
            </View>
          </Row>
        </View>
      );
    }
  };

  const renderIsNewsfeed = () => {
    return (
      <Row between style={{ paddingVertical: 12 }}>
        <CText h5 color={colors.c344054}>
          {t('package.newsfeed', 'Allow Viewing Newsfeed')}
        </CText>
        <ToggleSwitch
          size="small"
          isOn={dataEdit.isNewsfeed}
          onToggle={() => handleToggle('isNewsfeed')}
          onColor={colors.primary}
          offColor={colors.c98A2B3}
        />
      </Row>
    );
  };

  const renderIsChat = () => {
    return (
      <Row between style={{ paddingVertical: 12 }}>
        <CText h5 color={colors.c344054}>
          {t('package.chat', 'Allow Making Private Chat')}
        </CText>
        <ToggleSwitch
          size="small"
          isOn={dataEdit.isChat}
          onToggle={() => handleToggle('isChat')}
          onColor={colors.primary}
          offColor={colors.c98A2B3}
        />
      </Row>
    );
  };

  const renderPackageChatNumber = () => {
    return (
      <CInput
        refChild={packageChatNumberRef}
        value={dataEdit.numberChat ? dataEdit.numberChat.toString() : ''}
        onChange={value => handleChangePackageValue('numberChat', value)}
        errorText={''}
        label={t('package.numberOfChat', 'Number of chats')}
        placeHolder={t('package.numberOfChat', 'Number of chats')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={4}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  };

  const renderIsCall1vs1 = () => {
    return (
      <Row between style={{ paddingVertical: 12 }}>
        <CText h5 color={colors.c344054}>
          {t('package.call1vs1', 'Allow Scheduling 1-on-1 Calls')}
        </CText>
        <ToggleSwitch
          size="small"
          isOn={dataEdit.isCall1vs1}
          onToggle={() => handleToggle('isCall1vs1')}
          onColor={colors.primary}
          offColor={colors.c98A2B3}
        />
      </Row>
    );
  };

  const renderPackageCallNumber = () => {
    return (
      <CInput
        refChild={packageCallNumberRef}
        value={dataEdit.numberCall ? dataEdit.numberCall.toString() : ''}
        onChange={value => handleChangePackageValue('numberCall', value)}
        errorText={''}
        label={t('package.numberOfCall', 'Number of calls')}
        placeHolder={t('package.numberOfCall', 'Number of calls')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={4}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  };

  const renderLocation = () => {
    return (
      <CInputTouch
        refChild={packageLocationRef}
        isRequire={false}
        name={'packageLocation'}
        value={dataEdit.packageAddress}
        onTouch={handleTouchPackageLocation}
        errorText={''}
        label={t('package.serviceLocation', 'Vị trí phục vụ')}
        placeHolder={t('package.serviceLocation', 'Vị trí phục vụ')}
      />
    );
  };

  const renderPackageRadius = () => {
    return (
      <CInput
        refChild={packageRadiusRef}
        value={
          dataEdit.radius?.toString() === '' ||
          dataEdit.radius === null ||
          dataEdit.radius === undefined
            ? ''
            : dataEdit.radius
        }
        onChange={handleChangePackageRaDius}
        errorText={errPackageRadius}
        label={t('package.serviceRadius', 'Bán kính phục vụ (Km)')}
        placeHolder={'5'}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={4}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  };

  const renderAddingDes = () => {
    return (
      <CAreaContent
        refChild={desEl}
        value={txtDes}
        onChange={handleChangeDes}
        errorText={errDes}
        label={t('package.des', 'Description')}
        labelStyle={{ fontWeight: '400', fontSize: 14, color: colors.c344054 }}
        placeHolder={t('package.des', 'Description')}
        onFocus={() => {
          if (isIOS) {
            setTimeout(() => {
              scrollRef.current?.scrollToEnd({ animated: true });
            }, 300);
          }
        }}
      />
    );
  };

  const renderAddingDescription = () => {
    return (
      <CText h5 color={colors.c667085} style={{ marginTop: 8 }}>
        {t(
          'package.description',
          'Add additional service features to this package',
        )}
      </CText>
    );
  };

  const renderBtnAddingDescription = () => {
    if (dataEdit.descriptions.length > 4) return null;
    return (
      <Row start style={[screenStyles.pV12]}>
        <Pressable
          style={screenStyles.rowStart}
          onPress={handleAddNewDescription}
        >
          <IconX
            type={IconType.IONICONS}
            name="add"
            color={colors.primary}
            size={20}
          />
          <CText h5 color={colors.primary} style={screenStyles.mL5}>
            {t('package.addDescription', 'Additional Services')}
          </CText>
        </Pressable>
      </Row>
    );
  };

  const renderItemLink = (index: number) => {
    return (
      <CInput
        key={index}
        value={dataEdit.descriptions[index].value}
        onChange={value => handleChangeDescription(index, value)}
        errorText={''}
        placeHolder={t('package.additionalService', 'Additional service')}
        returnKeyType={'next'}
        autoCapitalize={'sentences'}
        rightIconCustom={
          <Pressable
            onPress={() => handleRemoveDescription(index)}
            style={{ marginLeft: 10, marginTop: 3 }}
            hitSlop={screenStyles.hitSlop20}
          >
            <Image source={images.auth.ico_trash} style={screenStyles.box20} />
          </Pressable>
        }
        maxLength={120}
        onSubmitEditing={() => Keyboard.dismiss()}
      />
    );
  };

  const renderCustomDescription = () => {
    const { descriptions } = dataEdit;
    let result = [];
    for (let i = 0; i < descriptions.length; i++) {
      result.push(renderItemLink(i));
    }
    return result;
  };

  const renderContent = () => {
    return (
      <View style={[screenStyles.wrapModalTop]}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={hideModal}>
            <IconX
              name={'close'}
              type={IconType.ANT_DESIGN}
              color={colors.c667085}
              size={24}
            />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('package.edit', 'Edit package')}
          </CText>
          <View style={screenStyles.box24} />
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        <KeyboardAvoidingView
          behavior={isIOS ? 'padding' : undefined}
          style={screenStyles.flex1}
          keyboardVerticalOffset={getStatusBarHeight() + ifIphoneX(20, 30)}
        >
          <CScrollView innerRef={scrollRef} style={screenStyles.pH24}>
            <View style={{ height: 8 }} />
            {renderPackageSuggest()}
            {renderThumnail()}
            {renderPackageName()}
            {renderPackagePrice()}
            {renderPackagePriceDiscount()}
            {renderPackageTimeDuration()}
            {/* {renderBookingType()} */}
            {/* {renderIsNewsfeed()} */}
            {/* {renderIsChat()} */}
            {/* {dataEdit.isChat && renderPackageChatNumber()} */}
            {/* {!dataEdit.isBooking && renderIsCall1vs1()} */}
            {/* {!dataEdit.isBooking &&
              dataEdit.isCall1vs1 &&
              renderPackageCallNumber()} */}
            {dataEdit.isBooking && renderLocation()}
            {dataEdit.isBooking && renderPackageRadius()}
            {renderAddingDes()}
            {renderAddingDescription()}
            {renderCustomDescription()}
            {renderBtnAddingDescription()}
          </CScrollView>
        </KeyboardAvoidingView>
        <View style={screenStyles.pH24}>
          <CButton
            title={t('common.confirm', 'Confirm')}
            btnWidth={'100%'}
            onPress={handleSubmit}
            isDisable={!activeBtn || isLoadingAPI}
            isBottom
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={hideModal}
    >
      <View style={styles.modalContainer}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hideModal}>
          <View style={styles.backdrop} />
        </Pressable>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>

      {/* {renderContent()} */}
      {modalPackageSuggest.isVisible && (
        <ModalPackageSuggest
          isVisible={modalPackageSuggest.isVisible}
          hideModal={() => {
            setModalPackageSuggest({
              ...modalPackageSuggest,
              isVisible: false,
            });
          }}
          listOption={modalPackageSuggest.listPackageOptions || []}
          optionChoose={dataEdit.packageOption}
          onChooseOption={handleChoosePackageSuggest}
        />
      )}
      {/* {modalPackageTime.isVisible && (
        <ModalPackageDuration
          isVisible={modalPackageTime.isVisible}
          hideModal={() => {
            setModalPackageTime({...modalPackageTime, isVisible: false});
          }}
          listOption={modalPackageTime.timeOptions || []}
          optionChoose={dataEdit.duration}
          onChooseOption={handleChoosePackageTime}
        />
      )} */}
      {showAddress && (
        <ModalSearchLocation
          modalVisibled={showAddress}
          onClose={() => {
            setShowAddress(false);
          }}
          onChooseLocation={onChooseLocation}
        />
      )}
      <Toast ref={toastEl} position="center" />
      {isLoadingAPI && (
        <View style={styles.loadingOverlay} accessibilityRole="progressbar">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </Modal>
  );
};
