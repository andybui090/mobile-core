import {
  CHeader,
  IconX,
  IconType,
  ImageHelper,
  Wrapper,
  CInput,
  CInputTouch,
  ModalCountry,
  ModalGender,
  CDatePicker,
  ModalOTP,
  OTPType,
  Toast,
  APILoading,
} from '@/components';
import { useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import {
  ifIphoneX,
  images,
  isEmptyArray,
  isIOS,
  screenStyles,
  showToast,
  statusSuccess,
} from '@/configs';
import { CButton, CScrollView, CText, Row } from '@/utils';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  cameraSingleCropLauncher,
  photoSingleCropLauncher,
} from '@/permissions/laucher';
import { showPhotoLibrary } from '@/permissions/picker';
import moment from 'moment';
import { ModalPhoneCode } from '../components';
import { getCountries } from '@/redux/slices/globalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { getSettingsOnboarding } from '@/redux/slices/settingSlice';
import { isArray } from 'lodash';
import { AppContext } from '@/contexts/AppContext';
import { postSignUp, resetOnboardUnused } from '@/redux/slices/onboardSlice';
// import { getObjectData, getStringData } from '@/storages';
// import { STORAGEKEY } from '@/constants';
import ApiService from '@/services/api-base';
import { ModalCategory } from './modal-categories';
import { getObjectData, getStringData, storeObjectData } from '@/storages';
import { STORAGEKEY } from '@/constants';
import ModalSearchNearby from '../components/ModalSearchNearby';

export const BasicInfo = ({
  goBack,
  dataLogin,
  dataBasicInfo,
  updateBasicInfo,
  updateLoginData,
  setDataBasicInfo,
  onNext,
}: any) => {
  const { t } = useTranslation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {
    theme: { colors },
  } = useTheme();

  const dispatch = useAppDispatch();
  const { countryList } = useAppSelector(state => state.globalReducer);

  const { registerComplete } = useContext(AppContext);

  const { settingOnboarding } = useAppSelector(state => state.settingReducer);
  const { signupNormal } = useAppSelector(
    (state: { onboardReducer: any }) => state.onboardReducer,
  );

  const toastEl = useRef<any>(null);
  const [avatarPrefix, setAvatarPrefix] = useState('');

  const snapPoints = useMemo(() => [180, 180 + ifIphoneX(15, 0)], []);
  const [activeBtn, setActiveBtn] = useState<boolean>(false);

  const fullNameEl = useRef<any>(null);
  const [errFullName, setErrFullName] = useState('');

  const [errCountry, setErrCountry] = useState<string>('');
  const [showModalCountry, setShowModalCountry] = useState<boolean>(false);

  const [errGender, setErrGender] = useState('');
  const [errDob, setErrDob] = useState('');

  const [showModalGender, setShowModalGender] = useState<boolean>(false);

  const [showModalBirthday, setShowModalBirthday] = useState(false);
  const [date_Atmometer] = useState<any>(moment(new Date(), 'DD/MM/YYYY'));

  const phoneEl = useRef(null);
  const [errPhone, setErrPhone] = useState('');

  const [showModalPhoneCode, setShowModalPhoneCode] = useState<boolean>(false);

  const emailEl = useRef(null);
  const [errEmail, setErrEmail] = useState('');

  const [isPostEmail, setIsPostEmail] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const [showModalCatefory, setShowModalCategory] = useState<boolean>(false);

  const [listCategory, setListCategory] = useState<any[]>([]);

  const [showAddress, setShowAddress] = useState<boolean>(false);

  //autofill country
  const checkAutoFillCountry = (arrCountry: any) => {
    if (dataLogin.phoneCode?.value) {
      let phoneParse: string = dataLogin.phoneCode.value;
      phoneParse = phoneParse.slice(1, phoneParse.length);
      // console.log("🚀 ~ checkAutoFillCountry ~ phoneParse:", phoneParse);
      for (let i = 0; i < arrCountry.length; i++) {
        if (arrCountry[i].phone_code == phoneParse) {
          updateBasicInfo('country', arrCountry[i]);
          break;
        }
      }
    }
  };

  useEffect(() => {
    dispatch(getCountries(null));
  }, []);

  useEffect(() => {
    // Kiem tra xem co yeu cau nhap phone hay khong
    dispatch(getSettingsOnboarding({ fq: 'type:onboard' }));
  }, []);

  useEffect(() => {
    const processCountryAPI = async () => {
      const { loading, data, error } = countryList;
      if (!loading) {
        if (isArray(data?.items)) {
          checkAutoFillCountry(data?.items);
        } else if (error) {
          // setFirstRender(false);
        }
      }
    };
    processCountryAPI();
  }, [countryList]);

  useEffect(() => {
    const processAPIRequiredField = () => {
      const { loading, data, error } = settingOnboarding;
      console.log(
        '🚀 ~ processAPIRequiredField ~ settingOnboarding:',
        settingOnboarding,
      );
      if (!loading) {
        if (data) {
          const items = data.items || [];
          let isRequiredDob = 0;
          let isRequiredGender = 0;
          let isRequiredPhone = 0;
          let isRequiredInterest = 0;
          for (let i = 0; i < items.length; i++) {
            if (items[i].code == 'required_dob') {
              isRequiredDob = items[i].value ? items[i].value : 0;
            }
            if (items[i].code == 'required_gender') {
              isRequiredGender = items[i].value ? items[i].value : 0;
            }
            if (items[i].code == 'required_phone') {
              isRequiredPhone = items[i].value ? items[i].value : 0;
            }
            if (items[i].code == 'required_interest') {
              isRequiredInterest = items[i].value ? items[i].value : 0;
            }
          }
          setDataBasicInfo({
            ...dataBasicInfo,
            requiredDob: isRequiredDob,
            requiredGender: isRequiredGender,
            requiredPhone: isRequiredPhone,
            requiredInterest: isRequiredInterest,
          });
        } else if (error) {
          // dispatch(resetSettings(null));
        }
      }
    };
    processAPIRequiredField();
  }, [settingOnboarding]);

  useEffect(() => {
    const checkEditEmail = () => {
      if (dataLogin.loginType != 'phone') {
        if (dataBasicInfo.email != '') {
          setIsPostEmail(false);
        }
      }
    };
    checkEditEmail();
  }, [dataLogin.loginType]);

  useEffect(() => {
    const checkValidData = () => {
      const {
        fullName,
        country,
        gender,
        birthday,
        phoneNumber,
        requiredPhone,
        requiredDob,
        requiredGender,
      } = dataBasicInfo;
      let valid = true;
      // if (userName === '') {
      //   valid = false;
      // }
      if (fullName?.trim() === '') {
        valid = false;
      }
      if (country.id == -1) {
        valid = false;
      }
      if (requiredGender == 1 && gender.name == '') {
        valid = false;
      }
      if (requiredDob == 1 && birthday == '') {
        valid = false;
      }
      if (dataLogin.loginType != 'phone' && requiredPhone == 1) {
        if (phoneNumber == '') {
          valid = false;
        }
      }
      setActiveBtn(valid);
    };
    checkValidData();
  }, [dataBasicInfo]);

  useEffect(() => {
    const processSignupNormalUser = () => {
      if (!signupNormal.loading) {
        if (signupNormal.data) {
          let dataParse: any = signupNormal.data;
          const { result, status, voucher } = dataParse;
          console.log('🚀 ~ processSignupNormalUser ~ dataParse:', dataParse);
          if (statusSuccess(status)) {
            // if (voucher && voucher.code && voucher.event) {
            //   dispatch(setVoucher(voucher));
            // }
            registerComplete(dataLogin.useOnboard, dataLogin.loginType);
            onNext();
          }
          dispatch(resetOnboardUnused(null));
          setShowAlert(false);
          setIsLoadingAPI(false);
        } else if (signupNormal.error) {
          // console.log("🚀 ~ processSignupNormalUser ~ signupNormal:", signupNormal);
          setShowAlert(false);
          setIsLoadingAPI(false);
          const { errors } = signupNormal.error;
          // const errors =  {"msg": "Invalid token"};
          console.log(
            '🚀 ~ file: index.tsx:106 ~ processSignupNormalUser ~ errors:',
            errors,
          );
          if (!isEmptyArray(errors)) {
            for (let i = 0; i < errors.length; i++) {
              let item = errors[i];
              if (item.key) {
                switch (item.key) {
                  // case 'username':
                  //   setErrUserName(item.msg || 'please check again!');
                  //   break;
                  case 'fullName':
                    setErrFullName(item.msg || 'please check again!');
                    break;
                  case 'gender':
                    setErrGender(item.msg || 'please check again!');
                    break;
                  case 'dob':
                    setErrDob(item.msg || 'please check again!');
                    break;
                  case 'email':
                    setErrEmail(item.msg || 'please check again!');
                    break;
                  case 'phone':
                    setErrPhone(item.msg || 'please check again!');
                    break;
                  case 'interests':
                    setShowModalCategory(true);
                    break;
                  default:
                    showToast(
                      toastEl,
                      item.key + ': ' + (item.msg || 'please check again!'),
                    );
                    break;
                }
              }
            }
          } else if (errors?.msg) {
            showToast(toastEl, errors.msg);
          }
          dispatch(resetOnboardUnused(null));
        }
      }
    };
    processSignupNormalUser();
  }, [signupNormal]);

  // HANDLE
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleCamera = async () => {
    bottomSheetModalRef.current?.close();
    const checkCamera: any = await cameraSingleCropLauncher();
    if (checkCamera.isSuccess) {
      if (checkCamera.imgRes) {
        setAvatarPrefix(`data:image/${checkCamera.mime};base64,`);
        updateBasicInfo('avatar', checkCamera.imgRes.data);
      }
    } else if (checkCamera.msg) {
      console.log('checkCamera.msg', checkCamera.msg);
      // showToast(toastEl, checkCamera.msg);
    }
  };

  const handlePhoto = async () => {
    bottomSheetModalRef.current?.close();
    let checkPhoto: any = {};
    if (Platform.OS == 'android') {
      checkPhoto = await showPhotoLibrary();
    } else {
      checkPhoto = await photoSingleCropLauncher();
    }
    if (checkPhoto.isSuccess) {
      if (checkPhoto.imgRes) {
        setAvatarPrefix(`data:image/${checkPhoto.mime};base64,`);
        updateBasicInfo('avatar', checkPhoto.imgRes.data);
      }
    } else if (checkPhoto.msg) {
      console.log('checkPhoto.msg', checkPhoto.msg);
      // showToast(toastEl, checkPhoto.msg);
    }
  };

  const handleChangeFullName = (value: string) => {
    setErrFullName('');
    updateBasicInfo('fullName', value);
  };

  const handleTouchCountry = () => {
    setShowModalCountry(true);
  };

  const handleUpdateCountryOnSubmit = () => {
    if (dataBasicInfo.country.name == '') {
      setErrCountry('');
      handleTouchCountry();
    }
    Keyboard.dismiss();
  };

  const handleTouchGender = () => {
    setErrGender('');
    setShowModalGender(true);
  };

  const handleTouchBirthday = () => {
    setErrDob('');
    setShowModalBirthday(true);
  };

  const handleChangePhoneNumber = (value: string) => {
    setErrPhone('');
    updateBasicInfo('phoneNumber', value);
  };

  const handleChangeCountryCode = () => {
    setShowModalPhoneCode(true);
  };

  const handleChangeEmail = (value: string) => {
    setErrEmail('');
    updateBasicInfo('email', value);
  };

  const handleUpdatePhoneCode = (phoneCodeChoose: any) => {
    updateLoginData('phoneCode', phoneCodeChoose);
    setErrPhone('');
    setShowModalPhoneCode(false);
  };

  const handleUpdateCountry = (countryChoose: any) => {
    updateBasicInfo('country', countryChoose);
    setShowModalCountry(false);
  };

  const handleUpdateGender = (genderChoose: any) => {
    updateBasicInfo('gender', genderChoose);
    setShowModalGender(false);
  };

  const handleOnChangeDate = (date: any) => {
    updateBasicInfo('birthday', moment(date).format('DD/MM/YYYY'));
  };

  const handleRegistryDefault = async () => {
    const {
      avatar,
      fullName,
      country,
      gender,
      birthday,
      phoneNumber,
      email,
      type,
    } = dataBasicInfo;
    setShowAlert(true);
    setIsLoadingAPI(true);
    let categories = getStringData(STORAGEKEY.CATEGORIES);
    let phoneP = '';
    let phoneParse: string;
    if (dataLogin.loginType == 'phone') {
      phoneParse = dataLogin.phoneNumber.trim();
      if (dataLogin.phoneCode.value == '+84') {
        let firstCharacter = phoneParse.charAt(0);
        if (firstCharacter == '0') {
          phoneParse = phoneParse.substring(1);
        }
      }
      phoneP = dataLogin.phoneCode.value + phoneParse;
    } else {
      phoneParse = phoneNumber.trim();
      if (dataLogin.phoneCode.value == '+84') {
        let firstCharacter = phoneNumber.charAt(0);
        if (firstCharacter == '0') {
          phoneParse = phoneParse.substring(1);
        }
      }
      phoneP = dataLogin.phoneCode.value + phoneParse;
    }
    let bodyData: any = {
      country: country.name,
      fullName: fullName.trim(),
      type,
      device: isIOS ? 'iOS' : 'Android',
    };
    if (dataLogin.loginType != 'phone') {
      if (dataBasicInfo.requiredPhone == 1) {
        bodyData.phone = phoneP;
      } else {
        if (phoneParse != '') {
          bodyData.phone = phoneP;
        }
      }
    } else {
      if (dataBasicInfo.requiredPhone == 1) {
        bodyData.phone = phoneP;
      }
    }
    if (gender.value) {
      bodyData.gender = gender.value;
    }
    if (birthday != '') {
      const br = moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
      bodyData.dob = br;
    }
    if (categories) {
      bodyData.interests = categories;
    }
    if (avatarPrefix != '') {
      bodyData.avatar = avatar;
    }
    if (isPostEmail) {
      if (email.trim() != '') {
        bodyData.email = email.trim().toLowerCase();
      }
    }
    // Add firebase dynamic link
    // const fireBaseLink = await getObjectData(STORAGEKEY.FIREBASE_DYNAMIC_LINK);
    // if (fireBaseLink) {
    //   bodyData.appLink = fireBaseLink;
    //   console.log(
    //     '🚀 ~ handleRegistryDefault ~ bodyData.appLink:',
    //     bodyData.appLink,
    //   );
    //   GALogEvent(GAEvents.REGISTER_BY_QR_CODE, {
    //     method: 'App register by QR code',
    //   });
    // }
    console.log('🚀 ~ handleRegistryDefault ~ bodyData:', bodyData);
    setTimeout(() => {
      dispatch(postSignUp(bodyData));
    }, 300);
  };

  const [verifyPhone, setVerifyPhone] = useState({
    isVisible: false,
    listPhoneOld: [
      // {isVerified:false, phoneText:''}
    ], //dung de kiem tra gia tri co thay doi hay ko
    phoneShow: '',
    phoneSend: '',
  });

  const handleVerifySuccess = () => {
    let arrClone: any = [...verifyPhone.listPhoneOld];
    let obj = {
      isVerified: true,
      phoneCode: dataLogin.phoneCode.value,
      phoneText: dataBasicInfo.phoneNumber,
    };
    arrClone.push(obj);
    setVerifyPhone({
      ...verifyPhone,
      isVisible: false,
      listPhoneOld: arrClone,
      phoneShow: '',
      phoneSend: '',
    });
    Keyboard.dismiss();
    handleRegistryDefault();
  };

  const checkStatusVerify = () => {
    for (let i = 0; i < verifyPhone.listPhoneOld.length; i++) {
      let item: any = verifyPhone.listPhoneOld[i];
      if (item.phoneCode == dataLogin.phoneCode.value) {
        if (
          dataBasicInfo.phoneNumber != '' &&
          item.phoneText == dataBasicInfo.phoneNumber
        ) {
          return item.isVerified;
        }
      }
    }
    return false;
  };

  const handleRegistryVerifyPhone = () => {
    const { phoneNumber, requiredPhone } = dataBasicInfo;
    if (requiredPhone == 1 || phoneNumber.trim() != '') {
      const isVerify = checkStatusVerify();
      if (!isVerify) {
        let phoneP = '';
        let phoneParse: string = phoneNumber;
        if (dataLogin.phoneCode.value == '+84') {
          let firstCharacter = phoneNumber.charAt(0);
          if (firstCharacter == '0') {
            phoneParse = phoneParse.substring(1);
          }
        }
        phoneP = dataLogin.phoneCode.value + phoneParse;
        let bodyData: any = {
          phone: phoneP,
        };
        ApiService.signupUser(bodyData)
          .then(res => {
            const { status, data }: any = res;
            let isFound = false;
            if (isArray(data.errors)) {
              let errors = data.errors || [];
              for (let i = 0; i < errors.length; i++) {
                if (errors[i].key == 'phone') {
                  setErrPhone(errors[i].msg);
                  isFound = true;
                  break;
                }
              }
              if (!isFound) {
                setErrPhone('');
                Keyboard.dismiss();
                // xac minh otp qua sdt
                setVerifyPhone({
                  ...verifyPhone,
                  isVisible: true,
                  phoneShow: dataLogin.phoneCode.value + ' ' + phoneNumber,
                  phoneSend: phoneP,
                });
              }
            }
          })
          .then((err: any) => {
            console.log('=========== err', err);
          });
      } else {
        handleRegistryDefault();
      }
    } else {
      handleRegistryDefault();
    }
  };

  const [verifyEmail, setVerifyEmail] = useState({
    isVisible: false,
    listEmailOld: [
      // {isVerified:false, emailText:''}
    ], //dung de kiem tra gia tri co thay doi hay ko
    emailShow: '',
  });

  const checkStatusVerifyEmail = (emailCompare: string) => {
    for (let i = 0; i < verifyEmail.listEmailOld.length; i++) {
      let item: any = verifyEmail.listEmailOld[i];
      if (item.emailText == emailCompare) {
        return item.isVerified;
      }
    }
    return false;
  };

  const handleVerifyEmailSuccess = () => {
    let arrClone: any = [...verifyEmail.listEmailOld];
    let obj = {
      isVerified: true,
      emailText: dataBasicInfo.email.trim(),
    };
    arrClone.push(obj);
    setVerifyEmail({
      isVisible: false,
      listEmailOld: arrClone,
      emailShow: '',
    });
    Keyboard.dismiss();
    handleRegistryDefault();
  };

  const handleRegistryVerifyEmail = (emailCompare: string) => {
    const isVerify = checkStatusVerifyEmail(emailCompare);
    if (!isVerify) {
      let bodyData: any = {
        email: emailCompare,
      };
      ApiService.signupUser(bodyData)
        .then(res => {
          const { status, data }: any = res;
          let isFound = false;
          if (isArray(data.errors)) {
            let errors = data.errors || [];
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].key == 'email') {
                setErrEmail(errors[i].msg);
                isFound = true;
                break;
              }
            }
            if (!isFound) {
              setErrEmail('');
              // xac minh otp qua email
              Keyboard.dismiss();
              setVerifyEmail({
                ...verifyEmail,
                isVisible: true,
                emailShow: emailCompare,
              });
            }
          }
        })
        .catch(err => {
          console.log('=========== err', err);
        });
    } else {
      handleRegistryDefault();
    }
  };

  const handleRegister2 = () => {
    if (dataLogin.loginType == 'phone') {
      if (isPostEmail) {
        if (dataBasicInfo.email.trim() != '') {
          // Check verify email
          handleRegistryVerifyEmail(dataBasicInfo.email.trim());
        } else {
          handleRegistryDefault();
        }
      }
    } else {
      handleRegistryVerifyPhone();
    }
  };

  const handleUpdateCategories = (
    listCategoires: any,
    strCategories: string,
  ) => {
    let arrClone = [...listCategoires];
    setListCategory(arrClone);
    setShowModalCategory(false);
  };

  const onChooseLocation = async (newLocation: any) => {
    console.log('🚀 ~ onChooseLocation ~ newLocation:', newLocation);
    setShowAddress(false);

    if (!newLocation) return;

    updateBasicInfo('bookingAddress', newLocation);

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

  // RENDER
  const renderBottomSheetModal = () => {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={screenStyles.pH24}>
          <CText h3 w600 color={colors.c101828} style={screenStyles.pV12}>
            {t('common.addAvatar', 'Add avatar')}
          </CText>

          <Pressable onPress={handleCamera}>
            <Row start style={screenStyles.pV12}>
              <IconX
                type={IconType.MATERIAL_ICONS}
                name="camera-alt"
                size={26}
                color={colors.primary}
              />
              <CText h4 color={colors.c344054} style={screenStyles.mL10}>
                {t('common.takePicture', 'Take picture')}
              </CText>
            </Row>
          </Pressable>

          <Pressable onPress={handlePhoto}>
            <Row start style={screenStyles.pV12}>
              <IconX
                type={IconType.MATERIAL_DESIGN_ICONS}
                name="image-multiple"
                size={26}
                color={colors.primary}
              />
              <CText h4 color={colors.c344054} style={screenStyles.mL10}>
                {t('common.chooseFromGallery', 'Choose from Gallery')}
              </CText>
            </Row>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  };

  const renderAvatar = () => {
    const { avatar } = dataBasicInfo;
    return (
      <View style={{ paddingVertical: 12, ...screenStyles.centerWrap }}>
        <View
          style={[
            screenStyles.round64,
            { backgroundColor: colors.cEAECF0 },
            screenStyles.centerWrap,
          ]}
        >
          {avatar !== '' ? (
            <ImageHelper source={{ uri: avatarPrefix + avatar }} />
          ) : (
            <Image
              source={images.global.no_avatar}
              style={screenStyles.box40}
              resizeMode="contain"
            />
          )}
        </View>
        <Pressable onPress={handlePresentModalPress}>
          <CText h5 color={colors.primary} style={screenStyles.mT10}>
            {t('onboarding.addProfilePicture', 'Thêm Ảnh Hồ sơ')}
          </CText>
        </Pressable>
      </View>
    );
  };

  const renderFullName = () => {
    return (
      <CInput
        refChild={fullNameEl}
        value={dataBasicInfo.fullName}
        onChange={handleChangeFullName}
        errorText={errFullName}
        label={t('profile.editProfileScreen.fullName', 'Họ và tên')}
        placeHolder={t('profile.editProfileScreen.fullName', 'Họ và tên')}
        returnKeyType={'next'}
        maxLength={100}
        isRequire
        autoCapitalize={'words'}
        onSubmitEditing={handleUpdateCountryOnSubmit}
      />
    );
  };

  const renderCountry = () => {
    return (
      <CInputTouch
        label={t('onboarding.country', 'Quốc gia')}
        placeHolder={t('onboarding.selectCountry', 'Chọn quốc gia')}
        isRequire
        name={'country'}
        onTouch={handleTouchCountry}
        value={dataBasicInfo.country.name}
        errorText={errCountry}
      />
    );
  };

  const renderGender = () => {
    return (
      <CInputTouch
        label={t('onboarding.gender', 'Giới tính')}
        placeHolder={t('onboarding.selectGender', 'Chọn giới tính')}
        isRequire={dataBasicInfo.requiredGender == 1}
        name={'gender'}
        onTouch={handleTouchGender}
        value={dataBasicInfo.gender.name}
        errorText={errGender}
      />
    );
  };

  const renderBirthday = () => {
    return (
      <CInputTouch
        label={t('onboarding.birthday', 'Ngày sinh')}
        placeHolder={`${t('onboarding.birthday', 'Ngày sinh')} (DD/MM/YYYY)`}
        isRequire={dataBasicInfo.requiredDob == 1}
        name={'birthday'}
        onTouch={handleTouchBirthday}
        value={dataBasicInfo.birthday}
        rightIcon={
          <IconX
            type={IconType.OCTICONS}
            name={'calendar'}
            size={16}
            color={colors.c667085}
          />
        }
        errorText={errDob}
      />
    );
  };

  const renderPhone = () => {
    return (
      <CInput
        refChild={phoneEl}
        value={dataLogin.phoneCode.value + dataLogin.phoneNumber}
        onChange={handleChangePhoneNumber}
        errorText={errPhone}
        label={t('onboarding.phone')}
        placeHolder={t('onboarding.phone')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={20}
        isRequire={dataBasicInfo.requiredPhone == 1}
        editable={false}
      />
    );
  };

  const renderPhoneSocial = () => {
    return (
      <CInput
        refChild={phoneEl}
        value={dataBasicInfo.phoneNumber}
        onChange={handleChangePhoneNumber}
        errorText={errPhone}
        label={t('onboarding.phone', 'Số điện thoại')}
        placeHolder={t('onboarding.phone', 'Số điện thoại')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={20}
        isRequire={dataBasicInfo.requiredPhone == 1}
        leftIcon={
          <Pressable
            onPress={handleChangeCountryCode}
            style={screenStyles.rowCenter}
          >
            <CText h5 color={colors.c101828}>
              {`${dataLogin.phoneCode.value}`}
            </CText>
            <IconX
              type={IconType.IONICONS}
              name={'chevron-down'}
              size={18}
              color={colors.c667085}
              style={{ marginHorizontal: 5 }}
            />
          </Pressable>
        }
        onSubmitEditing={() => Keyboard.dismiss()}
      />
    );
  };

  const renderEmail = () => {
    return (
      <CInput
        refChild={emailEl}
        value={dataBasicInfo.email}
        onChange={handleChangeEmail}
        errorText={errEmail}
        label={t('onboarding.email', 'Email')}
        placeHolder={t('onboarding.email', 'Email')}
        returnKeyType={'next'}
        maxLength={64}
        autoCapitalize={'none'}
        editable={isPostEmail}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  };

  const renderAddress = () => {
    return (
      <CInputTouch
        label={t('onboarding.fieldLivingArea', 'Khu vực sinh sống')}
        placeHolder={t('onboarding.fieldLivingArea', 'Khu vực sinh sống')}
        isRequire
        name={'address'}
        onTouch={() => setShowAddress(true)}
        value={dataBasicInfo.bookingAddress.text}
      />
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : undefined}
        style={screenStyles.flex1}
      >
        <CScrollView style={screenStyles.pH24}>
          {renderAvatar()}
          {renderFullName()}
          {renderCountry()}
          {renderGender()}
          {renderBirthday()}
          {dataLogin.loginType == 'phone' ? renderPhone() : renderPhoneSocial()}
          {renderEmail()}
          {/* Bo sung them khu vuc sinh song */}
          {renderAddress()}
        </CScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <Wrapper>
      <CHeader
        rightComponentDisable
        leftComponentOnPress={goBack}
        isBorderBottom
        title={t('onboarding.updateInfo')}
      />
      {renderContent()}
      <CButton
        isBottom
        title={t('common.continue', 'Tiếp theo')}
        isDisable={!activeBtn}
        onPress={handleRegister2}
      />
      {renderBottomSheetModal()}
      {showModalPhoneCode && (
        <ModalPhoneCode
          isVisible={showModalPhoneCode}
          hideModal={() => setShowModalPhoneCode(false)}
          choosePhoneCode={handleUpdatePhoneCode}
          phoneCodeChoose={dataLogin.phoneCode}
        />
      )}
      {showModalCountry && (
        <ModalCountry
          isVisible={showModalCountry}
          hideModal={() => setShowModalCountry(false)}
          chooseCountry={handleUpdateCountry}
          countryChoose={dataBasicInfo.country}
        />
      )}
      {showModalGender && (
        <ModalGender
          isVisible={showModalGender}
          hideModal={() => setShowModalGender(false)}
          chooseGender={handleUpdateGender}
          genderChoose={dataBasicInfo.gender}
        />
      )}
      {showModalBirthday && (
        <CDatePicker
          isModalVisible={showModalBirthday}
          dateTimeValue={dataBasicInfo.birthday || new Date(date_Atmometer)}
          closeModal={() => setShowModalBirthday(false)}
          onChangeDate={handleOnChangeDate}
        />
      )}
      {verifyPhone.isVisible && (
        <ModalOTP
          isVisible={verifyPhone.isVisible}
          phone={verifyPhone.phoneSend}
          hideModalOTP={() => {
            setVerifyPhone({
              ...verifyPhone,
              isVisible: false,
            });
            Keyboard.dismiss();
          }}
          callBackVerifySuccess={handleVerifySuccess}
          email={''}
          otpType={OTPType.register}
        />
      )}
      {verifyEmail.isVisible && (
        <ModalOTP
          isVisible={verifyEmail.isVisible}
          phone={''}
          email={verifyEmail.emailShow}
          hideModalOTP={() => {
            setVerifyEmail({
              ...verifyEmail,
              isVisible: false,
            });
            Keyboard.dismiss();
          }}
          callBackVerifySuccess={handleVerifyEmailSuccess}
          otpType={OTPType.register}
        />
      )}
      {showModalCatefory ? (
        <ModalCategory
          isVisible={showModalCatefory}
          hideModal={() => setShowModalCategory(false)}
          listCategoryChoose={listCategory || []}
          updateListCategories={handleUpdateCategories}
        />
      ) : null}
      {showAlert ? (
        <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
      ) : null}
      {showAddress && (
        <ModalSearchNearby
          modalVisibled={showAddress}
          onClose={() => {
            setShowAddress(false);
          }}
          onChooseLocation={onChooseLocation}
        />
      )}
      <Toast ref={toastEl} position="center" />
    </Wrapper>
  );
};
