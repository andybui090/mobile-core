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
  postCreateChannelPackage,
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
// import { ModalPackageDuration } from './ModalPackageDuration';
import { useTheme, makeStyles } from '@rneui/themed';
import { ModalPackageSuggest } from './ModalPackageSuggest';
import ModalSearchLocation from './ModalSearchLocation';

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

type DataCreateProps = {
  packageOption: PackageOption;
  packageName: string;
  packagePrice: string;
  duration: string;
  serviceTime: string;
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

export const ModalCreatePackage = ({
  isVisible,
  hideModal,
  channelData,
  user,
  onCreatePackageSuccess,
  isStudent,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const styles = useStyles();

  const { listOptionPackageChannel, dataPackageChannel } = useAppSelector(
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

  const packageTimeServiceRef = useRef<any>(null);
  const [errPackageTimeService, setErrPackageTimeService] =
    useState<string>('');

  const packageCallNumberRef = useRef<any>(null);

  const packageChatNumberRef = useRef<any>(null);

  const toastEl = useRef(null);

  const desEl = useRef<any>(null);
  const [errDes, setErrDes] = useState<string>('');
  const [txtDes, setTxtDes] = useState<string>('');

  const [activeBtn, setActiveBtn] = useState(false);

  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  // Modal choose package option
  const [modalPackageSuggest, setModalPackageSuggest] = useState<any>({
    isVisible: false,
    listPackageOptions: [],
  });

  const [modalPackageTime, setModalPackageTime] = useState<any>({
    isVisible: false,
    timeOptions: [1, 3, 6, 9, 12],
  });

  const [dataCreate, setDataCreate] = useState<DataCreateProps>({
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
    fileThumnail: {},
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
      // Chi lay goi cua carely
      let param: any = {
        limit: PAGINATION.ITEMS_50,
        offset: 0,
        fq: `status:1,is_deleted:0,parent_id:0,is_book_service:1`,
      };
      if (isStudent) {
        param.fq += ',is_expert_only:0';
      }
      // console.log("🚀 ~ callAPIChannelPackageOptions ~ param:", param)
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
    const checkActiveBtn = () => {
      const { packageOption, isCall1vs1, isChat, isNewsfeed } = dataCreate;
      let valid = true;
      // if (packageOption.id == -1) {
      //     valid = false;
      // }
      if (dataCreate.packageName.toString().trim() == '') {
        valid = false;
      }
      // if (dataCreate.packagePrice.toString().trim() == '') {
      //   valid = false;
      // }
      const value = dataCreate.packagePrice;
      if (value === '' || value === null || value === undefined) {
        valid = false;
      }
      if (
        !dataCreate.isBooking &&
        dataCreate.duration.toString().trim() == ''
      ) {
        valid = false;
      }
      if (!isCall1vs1 && !isChat && !isNewsfeed) {
        valid = false;
      }
      setActiveBtn(valid);
    };
    checkActiveBtn();
  }, [dataCreate]);

  //tạo gói
  useEffect(() => {
    const proccessAPICreatePackage = () => {
      const { loading, data, error } = dataPackageChannel;
      if (!loading) {
        if (data) {
          console.log('🚀 ~ proccessAPICreatePackage ~ data:', data);
          const pkgId: any = data.msg?.package || 0;
          setIsLoadingAPI(false);
          dispatch(resetPackageChannel());
          onCreatePackageSuccess(pkgId);
        } else if (error) {
          console.log('🚀 ~ proccessAPICreatePackage ~ error:', error);
          showToast(toastEl, logError(error, '', true));
          setIsLoadingAPI(false);
          dispatch(resetPackageChannel());
        }
      }
    };
    proccessAPICreatePackage();
  }, [dataPackageChannel]);

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
    console.log('🚀 ~ handleChoosePackageSuggest ~ option:', option);
    if (option.id && option.id != dataCreate.packageOption.id) {
      let arrOption: { key: number; value: string }[] = [];
      for (let i = 1; i <= 5; i++) {
        const value = option[`option${i}` as keyof typeof option];
        if (value) {
          arrOption.push({ key: i, value });
        }
      }
      setDataCreate((prev: DataCreateProps) => ({
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
        descriptions: arrOption,
        isBooking: option.is_book_service == 1,
        serviceTime: option.time_package || '0',
      }));
    }
    setModalPackageSuggest((prev: any) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const handleChangePackageName = (value: string) => {
    setDataCreate((prev: DataCreateProps) => ({ ...prev, packageName: value }));
    setErrPackageName('');
  };

  const handleChangePackagePrice = (value: string) => {
    setDataCreate((prev: DataCreateProps) => ({
      ...prev,
      packagePrice: value,
    }));
    setErrPackagePrice('');
  };

  const handleTouchTimeOption = () => {
    setModalPackageTime({ ...modalPackageTime, isVisible: true });
  };

  const handleChoosePackageTime = (value: any) => {
    if (value != dataCreate.duration) {
      setDataCreate((prev: DataCreateProps) => ({ ...prev, duration: value }));
    }
    setModalPackageTime((prev: any) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const handleChangePackageDiscount = (value: string) => {
    setDataCreate((prev: any) => ({ ...prev, packageDiscount: value }));
    setErrPackageDiscount('');
  };

  const handleChangePackageTime = (value: string) => {
    setDataCreate((prev: any) => ({ ...prev, serviceTime: value }));
    setErrPackageTimeService('');
  };

  const handleChangePackageBooking = (value: boolean) => {
    if (dataCreate.packageOption.id == -1) {
      if (value) {
        setErrPackagePrice('');
      }
      setDataCreate((prev: any) => ({ ...prev, isBooking: value }));
    }
  };

  const handleToggle = (name: ToggleKeys) => {
    setDataCreate((prev: DataCreateProps) => ({
      ...prev,
      [name]: !prev[name], // dùng [name] để lấy key động
    }));
  };

  const handleChangePackageValue = (name: string, value: string) => {
    setDataCreate((prev: DataCreateProps) => ({ ...prev, [name]: value }));
  };

  const handleTouchPackageLocation = () => {
    Keyboard.dismiss();
    setShowAddress(true);
  };

  const handleChangePackageRaDius = (value: string) => {
    setDataCreate((prev: any) => ({ ...prev, radius: value }));
    setErrPackageRadius('');
  };

  const onChooseLocation = async (itemLocation: any) => {
    // console.log('🚀 ~ onChooseLocation ~ itemLocation:', itemLocation);
    setShowAddress(false);

    const address = itemLocation?.text?.toString().trim();
    const location = itemLocation?.geometry.location;
    if (!address || !location) return;

    // update UI state
    setDataCreate((prev: any) => ({
      ...prev,
      location,
      packageAddress: address,
    }));

    try {
      const arrHis =
        (await getObjectData(STORAGEKEY.ALOKA_ADDRESS_HISTORY)) || [];

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

      storeObjectData(STORAGEKEY.ALOKA_ADDRESS_HISTORY, newHistory);
    } catch (error) {
      console.log('Save address history error:', error);
    }
  };

  const handleAddNewDescription = () => {
    let arrClone = JSON.parse(JSON.stringify(dataCreate.descriptions));
    arrClone.push({ key: arrClone.length, value: '' });
    setDataCreate((prev: any) => ({ ...prev, descriptions: arrClone }));
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleChangeDescription = (index: number, value: string) => {
    setDataCreate((prev: any) => {
      const newDescriptions = [...prev.descriptions];
      newDescriptions[index].value = value;
      return { ...prev, descriptions: newDescriptions };
    });
  };

  const handleChangeDes = (value: string) => {
    setErrDes('');
    setTxtDes(value);
  };

  const handleRemoveDescription = (index: number) => {
    let objClone = { ...dataCreate };
    objClone.descriptions.splice(index, 1);
    setDataCreate(objClone);
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
      packageAddress,
      radius,
      serviceTime,
    } = dataCreate;

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
        t('package.errorServiceTime', 'Service time must be ≥ 0'),
      );
      hasError = true;
    }

    if (hasError) return;

    const { manager, owner_id, id } = channelData;
    const userId = manager?.user_id === user.id ? manager?.user_id : owner_id;

    let param: any = {
      // parent_id: packageOption.id,
      user_id: userId,
      channel_id: id,
      price: rootPrice,
      name: packageName,
      is_newsfeed: isNewsfeed ? 1 : 0,
      duration: Number(duration) || 1,
      time_package: serviceTimeNumber,
    };
    if (packageOption.id && packageOption.id != -1) {
      param.parent_id = packageOption.id;
    } else {
      param.parent_id = 0;
    }
    if (fileThumnail.path) {
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
    if (isChat) {
      param.chat_1vs1 = 1;
      const numChat = parseInt(numberChat, 10);
      if (!isNaN(numChat)) {
        param.count_chat = numChat;
      }
    }
    if (isBooking) {
      param.is_book_service = 1;
      if (location.lat && location.lng) {
        // param.location = location.lat + ',' + location.lng;
        param.latitude = location.lat || '';
        param.longitude = location.lng || '';
      }
      if (packageAddress) {
        param.address = packageAddress || '';
      }
      if (radius && radius.trim() !== '') {
        param.radius = parseInt(radius.trim(), 10);
      }
    } else if (isCall1vs1) {
      param.call_1vs1 = 1;
      const numCall = parseInt(numberCall, 10);
      if (!isNaN(numCall)) {
        param.count_call = numCall;
      }
    }
    if (txtDes && txtDes.trim() !== '') {
      param.description = txtDes.trim();
    }
    const filtered = descriptions.filter((item: any) => item.value !== '');
    filtered.forEach((item, index) => {
      const key = `option${index + 1}` as keyof typeof param;
      param[key] = item.value;
    });
    console.log('🚀 ~ handleSubmit ~ param:', param);
    setIsLoadingAPI(true);
    dispatch(postCreateChannelPackage(param));
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
      if (checkPhoto.imgRes) {
        setDataCreate({
          ...dataCreate,
          fileThumnail: checkPhoto.imgRes,
        });
      }
    } else if (checkPhoto.msg) {
      console.log('🚀 ~ handlePhoto ~ checkPhoto.msg:', checkPhoto.msg);
    }
  };

  //RENDER
  const renderPackageSuggest = () => (
    <CInputTouch
      refChild={packageOptionRef}
      isRequire={false}
      name={'packageOption'}
      value={dataCreate.packageOption.name}
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
            borderStyle: dataCreate.fileThumnail.path ? 'solid' : 'dashed',
            overflow: 'hidden',
          }}
          onPress={handleUploadThumnail}
        >
          {dataCreate.fileThumnail.path ? (
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
                  uri: dataCreate.fileThumnail.path,
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
        value={dataCreate.packageName}
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
                dataCreate.packagePrice === '' ||
                dataCreate.packagePrice === null ||
                dataCreate.packagePrice === undefined
                  ? ''
                  : formatMoneyVNDPackage(
                      dataCreate.packagePrice.toString(),
                      '.',
                    )
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
          {/* {!dataCreate.isBooking && (
            <View style={{ flex: 1.5 }}>
              <CInputTouch
                refChild={packageTimeRef}
                isRequire
                name={'packageTime'}
                value={dataCreate.duration}
                onTouch={handleTouchTimeOption}
                errorText={''}
                label={t('package.validityPeriod', 'Validity (months)')}
                placeHolder={t('common.select') + ' ' + t('common.month')}
              />
            </View>
          )} */}
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
          dataCreate.packageDiscount === '' ||
          dataCreate.packageDiscount === null ||
          dataCreate.packageDiscount === undefined
            ? ''
            : formatMoneyVNDPackage(dataCreate.packageDiscount.toString(), '.')
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
        value={dataCreate.serviceTime}
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
    // kiem tra neu co chon package thi di theo package cha
    if (dataCreate.packageOption.id == -1)
      return (
        <View style={screenStyles.pV6}>
          <Row start>
            <CheckBoxItem
              label={t(
                'booking.clinicConsultation',
                'Dịch vụ chăm sóc tại nhà',
              )}
              value={dataCreate.isBooking}
              onChange={handleChangePackageBooking}
            />
          </Row>
        </View>
      );
    else if (dataCreate.packageOption.is_book_service == 1) {
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
          isOn={dataCreate.isNewsfeed}
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
          isOn={dataCreate.isChat}
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
        value={dataCreate.numberChat ? dataCreate.numberChat.toString() : ''}
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
          isOn={dataCreate.isCall1vs1}
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
        value={dataCreate.numberCall ? dataCreate.numberCall.toString() : ''}
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
        value={dataCreate.packageAddress}
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
          dataCreate.radius?.toString() === '' ||
          dataCreate.radius === null ||
          dataCreate.radius === undefined
            ? ''
            : dataCreate.radius
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

  const renderPleaseChoose = () => {
    return (
      <CText h5 color={colors.c667085} style={{ marginTop: 8 }}>
        {t('package.pleaseChoose', 'Please select at least one option service')}
        <CText h5 color={colors.error}>
          {' *'}
        </CText>
      </CText>
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
    if (dataCreate.descriptions.length > 4) return null;
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
        value={dataCreate.descriptions[index].value}
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
    const { descriptions } = dataCreate;
    let result = [];
    for (let i = 0; i < descriptions.length; i++) {
      result.push(renderItemLink(i));
    }
    return result;
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        style={screenStyles.flex1}
      >
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
              {t('package.create', 'Create package')}
            </CText>
            <View style={screenStyles.box24} />
          </Row>
          <Divider color={colors.cD0D5DD} width={1} />

          <CScrollView innerRef={scrollRef} style={screenStyles.pH24}>
            <View style={{ height: 8 }} />
            {renderPackageSuggest()}
            {renderThumnail()}
            {renderPackageName()}
            {renderPackagePrice()}
            {renderPackagePriceDiscount()}
            {renderPackageTimeDuration()}
            {/* {renderPleaseChoose()} */}
            {/* {renderBookingType()} */}
            {/* {renderIsNewsfeed()} */}
            {/* {renderIsChat()} */}
            {/* {dataCreate.isChat && renderPackageChatNumber()} */}
            {/* {!dataCreate.isBooking && renderIsCall1vs1()} */}
            {/* {!dataCreate.isBooking &&
              dataCreate.isCall1vs1 &&
              renderPackageCallNumber()} */}
            {dataCreate.isBooking && renderLocation()}
            {dataCreate.isBooking && renderPackageRadius()}
            {renderAddingDes()}
            {renderAddingDescription()}
            {renderCustomDescription()}
            {renderBtnAddingDescription()}
          </CScrollView>

          <CButton
            title={t('common.confirm', 'Confirm')}
            onPress={handleSubmit}
            isDisable={!activeBtn || isLoadingAPI}
            isBottom
          />
        </View>
      </KeyboardAvoidingView>
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
          optionChoose={dataCreate.packageOption}
          onChooseOption={handleChoosePackageSuggest}
        />
      )}
      {/* {modalPackageTime.isVisible && (
        <ModalPackageDuration
          isVisible={modalPackageTime.isVisible}
          hideModal={() => {
            setModalPackageTime({ ...modalPackageTime, isVisible: false });
          }}
          listOption={modalPackageTime.timeOptions || []}
          optionChoose={dataCreate.duration}
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
