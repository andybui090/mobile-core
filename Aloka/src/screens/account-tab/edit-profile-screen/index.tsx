import {
  APILoading,
  CDatePicker,
  CHeader,
  CInput,
  CInputTouch,
  IconType,
  IconX,
  ImageHelper,
  ModalCountry,
  ModalGender,
  ModalOTP,
  Toast,
  Wrapper,
} from '@/components';
import { OTPType } from '@/components/modal-otp';
import {
  ifIphoneX,
  images,
  isEmptyArray,
  isIOS,
  isValidDate,
  logError,
  screenStyles,
  showToast,
  statusSuccess,
} from '@/configs';
import { STORAGEKEY } from '@/constants';
import { AppContext } from '@/contexts';
import { goBack } from '@/navigation/RootNavigation';
import {
  cameraSingleCropLauncher,
  photoSingleCropLauncher,
} from '@/permissions';
import { showPhotoLibrary } from '@/permissions/picker';
import {
  getProfile,
  updateProfileInfo,
  resetProfileSlice,
} from '@/redux/slices/profileSlice';
import {
  getSettings,
  getSettingsOnboarding,
} from '@/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { ModalPhoneCode } from '@/screens/auth-screen/step/components';
import ModalSearchNearby from '@/screens/auth-screen/step/components/ModalSearchNearby';
import ApiService from '@/services/api-base';
import { getObjectData, storeObjectData } from '@/storages';
import { CButton, CScrollView, CText, Row } from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@rneui/themed';
import { isArray } from 'lodash';
import moment from 'moment';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';

const EditProfileScreen: React.FC<any> = ({ navigation }: any) => {
  const { t } = useTranslation();

  const {
    theme: { colors },
  } = useTheme();

  const toastEl = useRef<any>(null);

  const { user }: any = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { dataUpdateProfileInfo } = useAppSelector(
    state => state.profileReducer,
  );
  const { settingOnboarding } = useAppSelector(state => state.settingReducer);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [verifyEmail, setVerifyEmail] = useState({
    isVisible: false,
    listEmailOld: [], //dung de kiem tra gia tri co thay doi hay ko
    emailShow: '',
  });

  const [verifyPhone, setVerifyPhone] = useState({
    isVisible: false,
    listPhoneOld: [], //dung de kiem tra gia tri co thay doi hay ko
    phoneSend: '',
  });

  //STATE & PROPS
  const [myInfo, setMyInfo] = useState({
    username: '',
    avatar: '',
    avatarPrefix: '',
    fullName: '',
    country: {
      id: -1,
      name: '',
    },
    gender: { value: '', name: '', label: '' },
    birthday: '',
    phone: '',
    email: '',
    bookingAddress: { text: '', lat: 0, lng: 0, placeId: '' },
  });

  const [isEditEmail, setIsEditEmail] = useState(true);

  const [showAddress, setShowAddress] = useState<boolean>(false);

  useEffect(() => {
    // console.log("🚀 ~ initMyInfoData ~ user:", user)
    const initMyInfoData = () => {
      setMyInfo({
        ...myInfo,
        avatar: user.personalization?.avatar || '',
        avatarPrefix: user.personalization?.avatar ? '' : myInfo.avatarPrefix,
        username: user.username || '',
        fullName: user.full_name,
        country: {
          id: user.country ? 999 : -1,
          name: user.country || '',
        },
        gender: {
          value: user.gender || '',
          name: user.gender ? t(`gender.${user.gender?.toLowerCase()}`) : '',
          label: user.gender || '',
        },
        birthday: isValidDate(user.dob)
          ? moment(user.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')
          : '',
        phone: user.phone || '',
        email: user.email || '',
      });
    };
    if (user.username && myInfo.username == '') {
      if (
        user.provider &&
        user.provider?.toLowerCase() != 'phone' &&
        user.email != ''
      ) {
        setIsEditEmail(false);
      }
      if (user.id) {
        initMyInfoData();
      }
      if (user.provider?.toLowerCase() != 'phone') {
        dispatch(getSettings({ fq: 'code:required_phone' }));
      }
    }
  }, [user]);

  const fullNameEl = useRef<any>(null);
  const [errFullName, setErrFullName] = useState('');

  const phoneEl = useRef(null);
  const [errPhone, setErrPhone] = useState('');

  const [errGender, setErrGender] = useState('');
  const [errDob, setErrDob] = useState('');

  const emailEl = useRef(null);
  const [errEmail, setErrEmail] = useState('');

  const snapPoints = useMemo(() => [180, 180 + ifIphoneX(15, 0)], []);

  const [showModalCountry, setShowModalCountry] = useState<boolean>(false);

  const [showModalGender, setShowModalGender] = useState<boolean>(false);

  const [showModalBirthday, setShowModalBirthday] = useState(false);
  const [date_Atmometer] = useState<any>(moment(new Date(), 'DD/MM/YYYY'));

  const [activeBtn, setActiveBtn] = useState<boolean>(false);

  const [errAPI, setErrAPI] = useState<any>({});

  const [requiredPhone, setRequiredPhone] = useState<number>(0);
  const [requiredDob, setRequiredDob] = useState<number>(0);
  const [requiredGender, setRequiredGender] = useState<number>(0);

  const [phoneCode, setPhoneCode] = useState({
    value: '+84',
    label: 'Vietnam',
  });

  const [showModalPhoneCode, setShowModalPhoneCode] = useState<boolean>(false);

  useEffect(() => {
    // Kiem tra xem co yeu cau nhap phone hay khong
    dispatch(getSettingsOnboarding({ fq: 'type:onboard' }));
  }, []);

  useEffect(() => {
    const processAPIRequiredField = () => {
      const { loading, data, error } = settingOnboarding;
      if (!loading) {
        if (data) {
          const items = data.items || [];
          let isRequiredDob = 0;
          let isRequiredGender = 0;
          let isRequiredPhone = 0;
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
          }
          setRequiredGender(isRequiredGender);
          setRequiredDob(isRequiredDob);
          setRequiredPhone(isRequiredPhone);
        } else if (error) {
          // dispatch(resetSettings(null));
        }
      }
    };
    processAPIRequiredField();
  }, [settingOnboarding]);

  useEffect(() => {
    const checkValidData = () => {
      const {
        avatarPrefix,
        fullName,
        country,
        gender,
        birthday,
        phone,
        email,
      } = myInfo;
      let isSave = false;
      if (avatarPrefix != '') {
        isSave = true;
      }
      if (fullName?.trim() != user.full_name) {
        isSave = true;
      }
      if (country.name != user.country) {
        isSave = true;
      }
      if (gender.name != '' && gender.name != user.gender) {
        let genderTemp = t(`gender.${user.gender?.toLowerCase()}`);
        if (genderTemp != gender.name) {
          isSave = true;
        }
      }
      if (birthday != '') {
        const br = moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
        if (br != user.dob) {
          isSave = true;
        }
      }
      if (isEditEmail) {
        if (email != '' && email != user.email) {
          isSave = true;
        }
      }
      if (
        phone !== '' &&
        user.phone !== phone &&
        user.phone !== `${phoneCode.value}${phone}`
      ) {
        isSave = true;
      }
      setActiveBtn(isSave);
    };
    checkValidData();
  }, [myInfo]);

  //LIFT
  useEffect(() => {
    const processAPIEditProfile = () => {
      const { loading, data, error } = dataUpdateProfileInfo;
      if (!loading) {
        if (data) {
          const { status }: any = data;
          if (statusSuccess(status)) {
            dispatch(getProfile(null));
          }
          dispatch(resetProfileSlice());
          setIsSuccess(true);
          setIsLoadingAPI(false);
        } else if (error) {
          setShowAlert(false);
          setIsSuccess(false);
          setIsLoadingAPI(false);
          dispatch(resetProfileSlice());
          setErrAPI(error);
        }
      }
    };
    processAPIEditProfile();
  }, [dataUpdateProfileInfo]);

  useEffect(() => {
    const detectErrAPI = () => {
      if (errAPI) {
        const { errors } = errAPI;
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
                default:
                  showToast(toastEl, logError(item.msg, '', true));
                  break;
              }
            }
          }
        }
      }
    };
    detectErrAPI();
  }, [errAPI]);

  //FUNCTIONS
  const handleUpdateMyInfo = (name: string, value: string) => {
    setMyInfo({
      ...myInfo,
      [name]: value,
    });
  };

  const handleChangeFullName = (value: string) => {
    setErrFullName('');
    handleUpdateMyInfo('fullName', value);
  };

  const handleChangePhoneNumber = (value: string) => {
    setErrPhone('');
    handleUpdateMyInfo('phone', value);
  };

  const handleChangeEmail = (value: string) => {
    setErrEmail('');
    handleUpdateMyInfo('email', value);
  };

  const handleTouchCountry = () => {
    setShowModalCountry(true);
  };

  const handleTouchGender = () => {
    setErrGender('');
    setShowModalGender(true);
  };

  const handleTouchBirthday = () => {
    setErrDob('');
    setShowModalBirthday(true);
  };

  const handleUpdateCountry = (countryChoose: any) => {
    handleUpdateMyInfo('country', countryChoose);
    setShowModalCountry(false);
  };

  const handleUpdateGender = (genderChoose: any) => {
    handleUpdateMyInfo('gender', genderChoose);
    setShowModalGender(false);
  };

  const handleOnChangeDate = (date: any) => {
    handleUpdateMyInfo('birthday', moment(date).format('DD/MM/YYYY'));
  };

  const handleCamera = async () => {
    bottomSheetModalRef.current?.close();
    const checkCamera: any = await cameraSingleCropLauncher();
    if (checkCamera.isSuccess) {
      if (checkCamera.imgRes) {
        setMyInfo({
          ...myInfo,
          avatarPrefix: `data:image/${checkCamera?.mime};base64,`,
          avatar: checkCamera.imgRes.data,
        });
      }
    } else if (checkCamera.msg) {
      console.log('🚀 ~ handleCamera ~ checkCamera.msg:', checkCamera.msg);
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
        setMyInfo({
          ...myInfo,
          avatarPrefix: `data:image/${checkPhoto?.mime};base64,`,
          avatar: checkPhoto.imgRes.data,
        });
      }
    } else if (checkPhoto.msg) {
      console.log('🚀 ~ handlePhoto ~ checkPhoto.msg:', checkPhoto.msg);
    }
  };

  const handleEdit = async () => {
    const {
      avatar,
      avatarPrefix,
      fullName,
      country,
      gender,
      birthday,
      phone,
      email,
      bookingAddress,
    } = myInfo;
    const br = moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let bodyData: any = {};
    if (avatarPrefix != '') {
      bodyData.avatar = avatar;
    }
    // if (username != user.username) {
    //   bodyData.username = username;
    // }
    if (fullName != user.full_name) {
      bodyData.fullName = fullName?.trim();
    }
    if (country.name != user.country) {
      bodyData.country = country.name;
    }
    if (gender.name != '' && gender.name != user.gender) {
      bodyData.gender = gender.value;
    }
    if (birthday != '') {
      if (br != user.dob) {
        bodyData.dob = br;
      }
    }
    let emailP = user.email ? user.email : '';
    if (isEditEmail && email.trim() != emailP) {
      bodyData.email = email;
    }
    if (phone !== '') {
      if (user.phone != `${phoneCode.value}${phone}`) {
        bodyData.phone = phone;
      }
    }
    // console.log("🚀 ~ setTimeout ~ bodyData:", bodyData)
    setShowAlert(true);
    setIsLoadingAPI(true);
    setTimeout(() => {
      dispatch(updateProfileInfo(bodyData));
    }, 300);
  };

  const checkStatusVerifyEmail = (emailCompare: string) => {
    for (let i = 0; i < verifyEmail.listEmailOld.length; i++) {
      let item: any = verifyEmail.listEmailOld[i];
      if (item.emailText == emailCompare) {
        return item.isVerified;
      }
    }
    return false;
  };

  const checkStatusVerify = (phoneCompare: string) => {
    for (let i = 0; i < verifyPhone.listPhoneOld.length; i++) {
      let item: any = verifyPhone.listPhoneOld[i];
      if (item.phoneCode == phoneCode.value) {
        if (phoneCompare != '' && item.phoneText == phoneCompare) {
          return item.isVerified;
        }
      }
    }
    return false;
  };

  const handleRegistryVerifyPhone = async (phoneCompare: string) => {
    const isVerify = checkStatusVerify(phoneCompare);
    let phoneParse = phoneCompare.trim();
    if (phoneCode.value == '+84') {
      let firstCharacter = phoneParse.charAt(0);
      if (firstCharacter == '0') {
        phoneParse = phoneParse.substring(1);
      }
    }
    let phoneP = phoneCode.value + phoneParse;
    if (!isVerify) {
      let bodyData: any = {
        phone: phoneP,
        fullName: '',
      };
      ApiService.putUpdateProfile(bodyData)
        .then(res => {
          const { status, data }: any = res;
          let isFound = false;
          if (isArray(data.errors)) {
            let errors = data.errors || [];
            console.log('🚀 ~ handleRegistryVerifyPhone ~ errors:', errors);
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
              setVerifyPhone({
                ...verifyPhone,
                isVisible: true,
                phoneSend: phoneP,
              });
            }
          }
        })
        .catch(err => {
          console.log('=========== err', err);
        });
    } else {
      handleEdit();
    }
  };

  const handleRegistryVerifyEmail = async (emailCompare: string) => {
    const isVerify = checkStatusVerifyEmail(emailCompare);
    if (!isVerify) {
      let bodyData: any = {
        email: emailCompare,
        fullName: '',
      };
      ApiService.putUpdateProfile(bodyData)
        .then(res => {
          const { status, data }: any = res;
          let isFound = false;
          if (isArray(data.errors)) {
            let errors = data.errors || [];
            // console.log("🚀 ~ handleRegistryVerifyEmail ~ errors:", errors)
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
      handleEdit();
    }
  };

  const handleChoosePhoneCode = (codeChoose: any) => {
    setPhoneCode({
      ...phoneCode,
      value: codeChoose.value ?? '',
    });
    setShowModalPhoneCode(false);
  };

  const handleEditSubmit = async () => {
    if (isEditEmail) {
      let emailCheck = myInfo.email.trim();
      if (emailCheck != '' && emailCheck != user.email) {
        handleRegistryVerifyEmail(myInfo.email.trim());
      } else {
        handleEdit();
      }
    } else {
      if (myInfo.phone !== '' && myInfo.phone.trim() != user.phone) {
        handleRegistryVerifyPhone(myInfo.phone.trim());
      } else {
        handleEdit();
      }
    }
  };

  const handleConfirmButtonPress = () => {
    setShowAlert(false);
    setIsSuccess(false);
    setIsLoadingAPI(false);
    navigation.pop(1);
    //
  };

  const onChooseLocation = async (newLocation: any) => {
    console.log('🚀 ~ onChooseLocation ~ newLocation:', newLocation);
    setShowAddress(false);

    if (!newLocation) return;

    setMyInfo({
        ...myInfo,
        bookingAddress:newLocation
    });
    // setMyInfo('bookingAddress', newLocation);

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

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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

  const handleVerifyEmailSuccess = () => {
    let arrClone: any = [...verifyEmail.listEmailOld];
    let obj = {
      isVerified: true,
      emailText: myInfo.email.trim(),
    };
    arrClone.push(obj);
    setVerifyEmail({
      isVisible: false,
      listEmailOld: arrClone,
      emailShow: '',
    });
    Keyboard.dismiss();
    handleEdit();
  };

  const handleVerifyPhoneSuccess = () => {
    let arrClone: any = [...verifyPhone.listPhoneOld];
    let obj = {
      isVerified: true,
      phoneCode: phoneCode.value,
      phoneText: myInfo.phone.trim(),
    };
    arrClone.push(obj);
    setVerifyPhone({
      ...verifyPhone,
      isVisible: false,
      listPhoneOld: arrClone,
      phoneSend: '',
    });
    Keyboard.dismiss();
    handleEdit();
  };

  //RENDER
  const renderAvatar = () => {
    const { avatar, avatarPrefix } = myInfo;
    return (
      <View
        style={{
          paddingTop: 16,
          paddingBottom: 12,
          ...screenStyles.centerWrap,
        }}
      >
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
            {t('onboarding.addProfilePicture')}
          </CText>
        </Pressable>
      </View>
    );
  };

  const renderFullName = () => {
    return (
      <CInput
        refChild={fullNameEl}
        value={myInfo.fullName}
        onChange={handleChangeFullName}
        errorText={errFullName}
        label={t('profile.editProfileScreen.fullName')}
        placeHolder={t('profile.editProfileScreen.fullName')}
        returnKeyType={'next'}
        onSubmitEditing={() => Keyboard.dismiss()}
        autoCapitalize={'words'}
        maxLength={64}
        isRequire
      />
    );
  };

  const renderCountry = () => {
    return (
      <CInputTouch
        label={t('onboarding.country')}
        placeHolder={t('onboarding.selectCountry')}
        isRequire
        name={'country'}
        onTouch={handleTouchCountry}
        value={myInfo.country.name}
      />
    );
  };

  const renderGender = () => {
    let gender =
      myInfo.gender.name == user.gender
        ? t(`gender.${user.gender?.toLowerCase()}`)
        : myInfo.gender.name;
    return (
      <CInputTouch
        label={t('onboarding.gender')}
        placeHolder={t('onboarding.selectGender')}
        name={'gender'}
        onTouch={handleTouchGender}
        value={gender}
        errorText={errGender}
        isRequire={requiredGender == 1}
      />
    );
  };

  const renderBirthday = () => {
    return (
      <CInputTouch
        label={t('onboarding.birthday')}
        placeHolder={`${t('onboarding.birthday')}`}
        name={'birthday'}
        onTouch={handleTouchBirthday}
        value={myInfo.birthday}
        rightIcon={
          <IconX
            type={IconType.OCTICONS}
            name={'calendar'}
            size={16}
            color={colors.c667085}
          />
        }
        errorText={errDob}
        isRequire={requiredDob == 1}
      />
    );
  };

  const renderPhone = () => {
    return (
      <CInput
        refChild={phoneEl}
        value={myInfo.phone}
        onChange={handleChangePhoneNumber}
        errorText={errPhone}
        label={t('onboarding.phone')}
        placeHolder={t('onboarding.phone')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={15}
        isRequire
        editable={false}
      />
    );
  };

  const renderPhoneSocial = () => {
    return (
      <CInput
        refChild={phoneEl}
        value={myInfo.phone}
        onChange={handleChangePhoneNumber}
        errorText={errPhone}
        label={t('onboarding.phone')}
        placeHolder={t('onboarding.phone')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={15}
        isRequire={requiredPhone == 1}
        leftIcon={
          <TouchableOpacity
            onPress={() => setShowModalPhoneCode(true)}
            style={screenStyles.rowCenter}
          >
            <CText h5 color={colors.c101828}>
              {`${phoneCode.value}`}
            </CText>
            <IconX
              type={IconType.IONICONS}
              name={'chevron-down'}
              size={18}
              color={colors.c667085}
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        }
      />
    );
  };

  const renderEmail = () => {
    return (
      <CInput
        refChild={emailEl}
        value={myInfo.email}
        onChange={handleChangeEmail}
        errorText={errEmail}
        label={t('onboarding.email')}
        placeHolder={t('onboarding.email')}
        returnKeyType={'next'}
        maxLength={64}
        autoCapitalize={'none'}
        noSpace
        editable={isEditEmail}
        onSubmitEditing={() => Keyboard.dismiss()}
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
        value={myInfo.bookingAddress.text}
      />
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : undefined}
        style={screenStyles.flex1}
      >
        <CScrollView
          contentContainerStyle={[screenStyles.flexGrow1, screenStyles.pH24]}
        >
          {renderAvatar()}
          {renderFullName()}
          {renderCountry()}
          {renderGender()}
          {renderBirthday()}
          {user.phone ? renderPhone() : renderPhoneSocial()}
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
        leftComponentOnPress={goBack}
        rightComponentDisable
        title={t('profile.editProfile', 'Edit profile')}
        isBorderBottom
      />
      {renderContent()}
      <CButton
        isBottom
        title={t('common.save')}
        isDisable={!activeBtn}
        onPress={handleEditSubmit}
      />
      {showModalCountry && (
        <ModalCountry
          isVisible={showModalCountry}
          hideModal={() => setShowModalCountry(false)}
          chooseCountry={handleUpdateCountry}
          countryChoose={myInfo.country}
        />
      )}
      {showModalGender && (
        <ModalGender
          isVisible={showModalGender}
          hideModal={() => setShowModalGender(false)}
          chooseGender={handleUpdateGender}
          genderChoose={myInfo.gender}
        />
      )}
      <CDatePicker
        isModalVisible={showModalBirthday}
        dateTimeValue={myInfo.birthday || new Date(date_Atmometer)}
        closeModal={() => setShowModalBirthday(false)}
        onChangeDate={handleOnChangeDate}
      />
      {renderBottomSheetModal()}
      {showAlert ? (
        <APILoading
          showAlert={showAlert}
          isLoadingAPI={isLoadingAPI}
          isSuccess={isSuccess}
          onConfirmPressed={handleConfirmButtonPress}
          title={t('onboarding.updateInfo')}
          message={t('profile.editProfileScreen.updateSuccessTitle')}
          confirmText={t('common.ok')}
        />
      ) : null}
      {verifyEmail.isVisible && (
        <ModalOTP
          isVisible={verifyEmail.isVisible}
          email={verifyEmail.emailShow}
          hideModalOTP={() => {
            setVerifyEmail({
              ...verifyEmail,
              isVisible: false,
            });
            Keyboard.dismiss();
          }}
          callBackVerifySuccess={handleVerifyEmailSuccess}
          otpType={OTPType.update}
          phone={''}
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
          callBackVerifySuccess={handleVerifyPhoneSuccess}
          email={''}
          otpType={OTPType.update}
        />
      )}
      {showModalPhoneCode && (
        <ModalPhoneCode
          isVisible={showModalPhoneCode}
          hideModal={() => setShowModalPhoneCode(false)}
          choosePhoneCode={handleChoosePhoneCode}
          phoneCodeChoose={phoneCode}
        />
      )}
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

export default EditProfileScreen;
