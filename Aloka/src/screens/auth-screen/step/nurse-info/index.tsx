import {
  APILoading,
  CDatePicker,
  CHeader,
  IconType,
  IconX,
  ModalCountry,
  ModalGender,
  ModalOTP,
  Toast,
  Wrapper,
} from '@/components';
import { OTPType } from '@/components/modal-otp';
import {
  ScreenWidth,
  ifIphoneX,
  logError,
  screenStyles,
  showToast,
  statusSuccess,
  toLower,
} from '@/configs';
import { STORAGEKEY } from '@/constants';
import { AppContext } from '@/contexts';
import {
  cameraSingleCropLauncher,
  photoSingleCropLauncher,
} from '@/permissions';
import { showPhotoLibrary } from '@/permissions/picker';
import {
  // registerDoctor,
  registerExpert,
  resetOnboardUnused,
} from '@/redux/slices/onboardSlice';
import { getSettingsOnboarding } from '@/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import ApiService from '@/services/api-base';
import { getObjectData, getStringData } from '@/storages';
import { CButton, CText, Row } from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { isIOS } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { isArray } from 'lodash';
import moment from 'moment';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Platform, Pressable, View } from 'react-native';
import { readFile } from '@dr.pogodin/react-native-fs';
import { Info, ModalCommon, Specializations, WorkInformation } from './step';
import { WorkInformationV2 } from './step/WorkInformationV2';

export const NurseInfo = ({
  dataLogin,
  dataNurseInfo,
  updateNurseInfo,
  // updateNurseInfoLinks,
  // addNewLink,
  // removeLink,
  goBack,
  onNext,
  updateLoginData,
  setDataNurseInfo,
  addNewDoc,
  removeNewDoc,
}: any) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  // const styles = useStyles();

  const { registerComplete } = useContext(AppContext);

  //props
  const dispatch = useAppDispatch();
  const { expertRegister } = useAppSelector(state => state.onboardReducer);
  const { settingOnboarding } = useAppSelector(state => state.settingReducer);

  // ref
  const toastEl = useRef<any>(null);
  const snapPoints = useMemo(() => [180, 180 + ifIphoneX(15, 0)], []);

  // state
  const [step, setStep] = useState<number>(0);
  const [title, setTitle] = useState<string>(
    t('profile.editProfileScreen.myInformation'),
  );
  const [maxStep] = useState<number>(3);
  const [avatarPrefix, setAvatarPrefix] = useState<string>('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [showModalCountry, setShowModalCountry] = useState<boolean>(false);
  const [showModalGender, setShowModalGender] = useState<boolean>(false);
  const [showModalBirthday, setShowModalBirthday] = useState<boolean>(false);

  const [errAPI, setErrAPI] = useState<any>({});
  const [showAlert, setShowAlert] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [passStep1, setPassStep1] = useState(false);
  const [isHasRequestAPI, setIsHasRequestAPI] = useState(false);

  const [activeBtn, setActiveBtn] = useState(false);
  const [date_Atmometer] = useState<any>(moment(new Date(), 'DD/MM/YYYY'));

  const [phoneErrVerify, setPhoneErrVerify] = useState('');
  const [emailErrVerify, setEmailErrVerify] = useState('');

  const [modalCommon, setModalCommon] = useState({
    title: '',
    isShow: false,
    data: [],
    currentItemSelect: { id: -1, name: '', code: '' },
    index: -1,
  });

  // effect
  useEffect(() => {
    switch (step) {
      case 0:
        setTitle(t('profile.editProfileScreen.myInformation'));
        break;
      case 1:
        setTitle(t('onboarding.specialistTitle'));
        break;
      case 2:
        setTitle(t('onboarding.workInformationTitle'));
        break;
      default:
        break;
    }
  }, [step]);

  useEffect(() => {
    const processAPIRegisterNurse = () => {
      const { loading, data, error } = expertRegister;
      if (!loading) {
        if (data) {
          console.log('🚀 ~ processAPIRegisterNurse ~ data:', data);
          setIsHasRequestAPI(false);
          const { result, status }: any = data;
          setShowAlert(false);
          setIsLoadingAPI(false);
          dispatch(resetOnboardUnused(null));
          if (statusSuccess(status)) {
            registerComplete(dataLogin.useOnboard, dataLogin.loginType);
            onNext();
          }
        } else if (error) {
          console.log('🚀 ~ processAPIRegisterNurse ~ error:', error);
          setShowAlert(false);
          setIsLoadingAPI(false);
          const errors: any = error.errors;
          if (errors && errors.msg) {
            showToast(toastEl, errors.msg);
          }
          if (step == 2) {
            showToast(toastEl, logError(error, '', false));
          }
          setErrAPI(error);
          dispatch(resetOnboardUnused(null));
          setTimeout(() => {
            setIsHasRequestAPI(false);
          }, 500);
        }
      }
    };
    processAPIRegisterNurse();
  }, [expertRegister]);

  useEffect(() => {
    const checkActiveBtn = () => {
      let valid = true;
      switch (step) {
        case 0:
          const {
            fullName,
            country,
            phoneNumber,
            requiredPhone,
            requiredDob,
            birthday,
            gender,
            requiredGender,
          } = dataNurseInfo;
          if (fullName?.trim() === '') {
            valid = false;
          }
          if (country.id == -1) {
            valid = false;
          }
          if (dataLogin.loginType != 'phone' && requiredPhone == 1) {
            if (phoneNumber == '') {
              valid = false;
            }
          }
          if (requiredDob == 1 && birthday == '') {
            valid = false;
          }
          if (requiredGender == 1 && gender.name == '') {
            valid = false;
          }
          break;
        case 1:
          const { specializationArr } = dataNurseInfo;
          if (specializationArr.length == 0) {
            valid = false;
          }
          break;
        case 2:
          const { attachments, occupationId } = dataNurseInfo;
          for (let i = 0; i < attachments.length; i++) {
            if (attachments[i].fileUri == '') {
              valid = false;
              break;
            }
          }
          // if (occupationId == -1) {
          //   valid = false;
          // }
          // const {arrExperience, isExperienceType} = dataNurseInfo;
          // if (isExperienceType == 1) {
          //   //da co kinh nghiem
          //   let found = false;
          //   for (let i = 0; i < arrExperience.length; i++) {
          //     if (arrExperience[i].isSave) {
          //       found = true;
          //       break;
          //     }
          //   }
          //   if (!found) {
          //     valid = false;
          //   }
          // }
          break;
        default:
          break;
      }
      setActiveBtn(valid);
    };
    checkActiveBtn();
  }, [step, dataNurseInfo, dataLogin.loginType]);

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
            if (items[i].code == 'required_dob_doctor') {
              isRequiredDob = items[i].value ? items[i].value : 0;
            }
            if (items[i].code == 'required_gender_doctor') {
              isRequiredGender = items[i].value ? items[i].value : 0;
            }
            if (items[i].code == 'required_phone_doctor') {
              isRequiredPhone = items[i].value ? items[i].value : 0;
            }
          }
          setDataNurseInfo({
            ...dataNurseInfo,
            requiredDob: isRequiredDob,
            requiredGender: isRequiredGender,
            requiredPhone: isRequiredPhone,
          });
        } else if (error) {
          // dispatch(resetSettings(null));
        }
      }
    };
    processAPIRequiredField();
  }, [settingOnboarding]);

  // action
  const handleUpdateCountry = (countryChoose: any) => {
    updateNurseInfo('country', countryChoose);
    setShowModalCountry(false);
  };

  const handleUpdateGender = (genderChoose: any) => {
    updateNurseInfo('gender', genderChoose);
    setShowModalGender(false);
  };

  const handleOnChangeDate = (date: any) => {
    updateNurseInfo('birthday', moment(date).format('DD/MM/YYYY'));
  };

  const handleBack = () => {
    switch (step) {
      case 0:
        goBack();
        break;
      case 1:
        setStep(0);
        break;
      case 2:
        setStep(1);
        break;
      default:
        break;
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleTouchCountry = () => {
    setShowModalCountry(true);
  };

  const showGender = () => {
    setShowModalGender(true);
  };

  const handleTouchBirthday = () => {
    setShowModalBirthday(true);
  };
  //
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
      phoneText: dataNurseInfo.phoneNumber,
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
    registryNurseDefault();
  };

  const checkStatusVerify = () => {
    for (let i = 0; i < verifyPhone.listPhoneOld.length; i++) {
      let item: any = verifyPhone.listPhoneOld[i];
      if (item.phoneCode == dataLogin.phoneCode.value) {
        if (
          dataNurseInfo.phoneNumber != '' &&
          item.phoneText == dataNurseInfo.phoneNumber
        ) {
          return item.isVerified;
        }
      }
    }
    return false;
  };

  const handleRegistryVerifyPhone = () => {
    // const { phoneNumber } = dataNurseInfo;
    const { phoneNumber, requiredPhone } = dataNurseInfo;
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
        ApiService.expertRegister(bodyData)
          .then((res: any) => {
            const { status, data }: any = res;
            let isFound = false;
            if (isArray(data.errors)) {
              console.log(
                '🚀 ~ handleRegistryVerifyPhone ~ data.errors:',
                data.errors,
              );
              let errors = data.errors || [];
              for (let i = 0; i < errors.length; i++) {
                if (errors[i].key == 'phone') {
                  // setErrPhone(errors[i].msg);
                  // setErrAPI({errors:data.errors});
                  setPhoneErrVerify(errors[i].msg);
                  isFound = true;
                  break;
                }
              }
              if (!isFound) {
                setPhoneErrVerify('');
                // xac minh otp qua sdt
                Keyboard.dismiss();
                setVerifyPhone({
                  ...verifyPhone,
                  isVisible: true,
                  phoneShow: dataLogin.phoneCode.value + ' ' + phoneNumber,
                  phoneSend: phoneP,
                });
              }
            }
          })
          .catch(err => {
            console.log('=========== err', err);
          });
      } else {
        registryNurseDefault();
      }
    } else {
      console.log('======vo day');
      registryNurseDefault();
    }
  };

  const [verifyEmail, setVerifyEmail] = useState({
    isVisible: false,
    listEmailOld: [
      // {isVerified:false, emailText:''}
    ], //dung de kiem tra gia tri co thay doi hay ko
    emailShow: '',
  });

  const handleVerifyEmailSuccess = () => {
    let arrClone: any = [...verifyEmail.listEmailOld];
    let obj = {
      isVerified: true,
      emailText: dataNurseInfo.email.trim(),
    };
    arrClone.push(obj);
    setVerifyEmail({
      isVisible: false,
      listEmailOld: arrClone,
      emailShow: '',
    });
    Keyboard.dismiss();
    registryNurseDefault();
  };

  const [isPostEmail, setIsPostEmail] = useState(true);
  useEffect(() => {
    const checkEditEmail = () => {
      if (dataLogin.loginType != 'phone') {
        if (dataNurseInfo.email != '') {
          setIsPostEmail(false);
        }
      }
    };
    checkEditEmail();
  }, [dataLogin.loginType]);

  const checkStatusVerifyEmail = (emailCompare: string) => {
    for (let i = 0; i < verifyEmail.listEmailOld.length; i++) {
      let item: any = verifyEmail.listEmailOld[i];
      if (item.emailText == emailCompare) {
        return item.isVerified;
      }
    }
    return false;
  };

  const convertBase64 = async (localUri: any) => {
    const data = await readFile(decodeURIComponent(localUri), 'base64').then(
      (res: any) => {
        return res;
      },
    );
    return data;
  };

  const convertAttactment = async (arrData: any[]) => {
    let result = [];
    try {
      for (let i = 0; i < arrData.length; i++) {
        let item = arrData[i];
        if (item.fileUri != '') {
          let base64 = '';
          if (isIOS) {
            base64 = await convertBase64(item.fileUri);
          } else if (item.fileCopyUri) {
            base64 = await convertBase64(item.fileCopyUri);
          }
          let itemPush: any = {
            file: base64,
            name: toLower(item.fileName),
          };
          if (item.certificate_id) {
            itemPush.certificate_id = item.certificate_id;
          }
          result.push(itemPush);
        }
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: index.tsx:403 ~ convertAttactment ~ error:',
        error,
      );
    }
    return result;
  };

  const handleRegistryVerifyEmail = (emailCompare: string) => {
    const isVerify = checkStatusVerifyEmail(emailCompare);
    if (!isVerify) {
      let bodyData: any = {
        email: emailCompare,
      };
      ApiService.expertRegister(bodyData)
        .then((res: any) => {
          const { status, data }: any = res;
          let isFound = false;
          if (isArray(data.errors)) {
            let errors = data.errors || [];
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].key == 'email') {
                setEmailErrVerify(errors[i].msg);
                isFound = true;
                break;
              }
            }
            if (!isFound) {
              setEmailErrVerify('');
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
      registryNurseDefault();
    }
  };

  const registerNurseAll = () => {
    if (dataLogin.loginType == 'phone') {
      if (isPostEmail) {
        if (dataNurseInfo.email.trim() != '') {
          handleRegistryVerifyEmail(dataNurseInfo.email.trim().toLowerCase());
        } else {
          registryNurseDefault();
        }
      }
    } else {
      console.log(
        '🚀 ~ registerNurseAll ~ dataNurseInfo.requiredPhone:',
        dataNurseInfo.requiredPhone,
      );
      handleRegistryVerifyPhone();
    }
  };

  const registryNurseDefault = async () => {
    setIsHasRequestAPI(true);
    setShowAlert(true);
    setIsLoadingAPI(true);
    const {
      birthday,
      type,
      fullName,
      channelName,
      userName,
      cccd,
      gender,
      country,
      userChoose,
      avatar,
      email,
      description,
      links,
      specializationArr,
      awardId,
      academicId,
      degreeId,
      attachments,
      arrAttachments,
    } = dataNurseInfo;
    let bodyData: any = {
      type,
      fullName: fullName?.trim(),
      channel_name: fullName?.trim(),
      country: country.name,
      medicalId: userChoose.id,
      device: isIOS ? 'iOS' : 'Android',
    };
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
      phoneParse = dataNurseInfo.phoneNumber.trim();
      if (dataLogin.phoneCode.value == '+84') {
        let firstCharacter = dataNurseInfo.phoneNumber.charAt(0);
        if (firstCharacter == '0') {
          phoneParse = phoneParse.substring(1);
        }
      }
      phoneP = dataLogin.phoneCode.value + phoneParse;
    }
    if (dataLogin.loginType != 'phone') {
      if (dataNurseInfo.requiredPhone == 1) {
        bodyData.phone = phoneP;
      } else {
        if (phoneParse != '') {
          bodyData.phone = phoneP;
        }
      }
    } else {
      if (dataNurseInfo.requiredPhone == 1) {
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
    let categories = getStringData(STORAGEKEY.CATEGORIES);
    if (categories) {
      bodyData.interests = categories;
    }
    if (isPostEmail) {
      if (email.trim() != '') {
        bodyData.email = email.trim().toLowerCase();
      }
    }
    if (description) {
      bodyData.description = description;
    }
    if (cccd) {
      bodyData.identification = cccd;
    }
    if (avatar) {
      bodyData.avatar = avatar;
    }
    // parse link
    let linkAPI = [];
    for (let i = 0; i < links.length; i++) {
      if (links[i].link.trim() !== '') {
        linkAPI.push(links[i].link);
      }
    }
    if (linkAPI.length > 0) {
      bodyData.links = linkAPI;
    }
    // call api
    if (step == 0) {
      // console.log('🚀 ~ setTimeout ~ bodyData:', bodyData);
      setTimeout(() => {
        dispatch(registerExpert(bodyData));
      }, 300);
    } else if (step == 2) {
      if (awardId != -1) {
        bodyData.awardId = awardId;
      }
      if (academicId != -1) {
        bodyData.academicId = academicId;
      }
      if (degreeId != -1) {
        bodyData.degreeId = degreeId;
      }
      //map id specializationId
      let specializationIds = '';
      for (let j = 0; j < specializationArr?.length; j++) {
        if (j == 0) {
          specializationIds = specializationArr[j].id;
        } else {
          specializationIds = specializationIds + ',' + specializationArr[j].id;
        }
      }
      if (specializationIds) {
        bodyData.specializationId = specializationIds;
      }

      let attachmentsAPI: any = await convertAttactment(attachments);
      let attachmentsNewAPI: any = await convertAttactment(arrAttachments);
      if (attachmentsAPI.length > 0 || attachmentsNewAPI.length > 0) {
        bodyData.attachments = [
          ...attachmentsAPI,
          ...attachmentsNewAPI,
        ] as never;
      }

      // Add firebase dynamic link
      // const fireBaseLink = await getObjectData(
      //   STORAGEKEY.FIREBASE_DYNAMIC_LINK,
      // );
      // if (fireBaseLink) {
      //   bodyData.appLink = fireBaseLink;

      //   GALogEvent(GAEvents.REGISTER_BY_QR_CODE, {
      //     method: 'App register by QR code',
      //   });
      // }
      console.log('🚀 ~ registryNurseDefault ~ bodyData:', bodyData);
      setTimeout(() => {
        dispatch(registerExpert(bodyData));
      }, 300);
    }
  };

  const handleNext = async () => {
    switch (step) {
      case 0:
        if (passStep1) {
          setStep(1);
        } else {
          registerNurseAll();
        }
        break;
      case 1:
        setStep(2);
        // registerNurseAll();
        break;
      case 2:
        registerNurseAll();
        break;
      default:
        break;
    }
  };

  const handleCamera = async () => {
    bottomSheetModalRef.current?.close();
    const checkCamera: any = await cameraSingleCropLauncher();
    if (checkCamera.isSuccess) {
      if (checkCamera.imgRes) {
        setAvatarPrefix(`data:image/${checkCamera.mime};base64,`);
        updateNurseInfo('avatar', checkCamera.imgRes.data);
      }
    } else if (checkCamera.msg) {
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
        updateNurseInfo('avatar', checkPhoto.imgRes.data);
      }
    } else if (checkPhoto.msg) {
    }
  };

  const handleCheckStep1Valid = (isValid: boolean) => {
    if (isValid) {
      setStep(1);
      setPassStep1(true);
    } else {
      setPassStep1(false);
    }
  };

  const handleShowModalCommon = (itemTitleChoose: any, index: number) => {
    let idChoose = -1;
    if (index == 0) {
      idChoose = dataNurseInfo.awardId;
    }
    if (index == 1) {
      idChoose = dataNurseInfo.academicId;
    }
    if (index == 2) {
      idChoose = dataNurseInfo.degreeId;
    }
    if (index == 3) {
      idChoose = dataNurseInfo.occupationId;
    }
    // console.log("🚀 ~ file: index.tsx:552 ~ handleShowModalCommon ~ itemTitleChoose:", itemTitleChoose)
    setModalCommon({
      ...modalCommon,
      isShow: true,
      data: itemTitleChoose.children || [],
      title: t(`onboarding.${itemTitleChoose.code}`),
      currentItemSelect: { id: idChoose, name: '', code: '' },
      index,
    });
  };

  const handleChooseCommon = (itemChoose: any) => {
    const id = itemChoose?.id ?? -1;
    if (modalCommon.index === 0) {
      updateNurseInfo('awardId', id);
    } else if (modalCommon.index === 1) {
      updateNurseInfo('academicId', id);
    } else if (modalCommon.index === 2) {
      updateNurseInfo('degreeId', id);
    } else if (modalCommon.index === 3) {
      updateNurseInfo('occupationId', id);
    }
    setModalCommon({
      title: '',
      isShow: false,
      data: [],
      currentItemSelect: { id: -1, name: '', code: '' },
      index: -1,
    });
  };

  // render
  const renderLineStep = () => {
    let widthLine = ScreenWidth / maxStep;
    return (
      <View
        style={{
          height: 5,
          backgroundColor: colors.cD0D5DD,
          width: ScreenWidth,
        }}
      >
        <View
          style={{
            width: widthLine - 5,
            position: 'absolute',
            left: 0,
            backgroundColor: colors.primary,
            height: 5,
          }}
        />
        <View
          style={{
            width: 5,
            position: 'absolute',
            left: widthLine - 5,
            backgroundColor: colors.white,
            height: 5,
          }}
        />
        <View
          style={{
            width: widthLine - 5,
            position: 'absolute',
            left: widthLine,
            backgroundColor: step >= 1 ? colors.primary : colors.cD0D5DD,
            height: 5,
          }}
        />
        <View
          style={{
            width: 5,
            position: 'absolute',
            left: widthLine * 2 - 5,
            backgroundColor: colors.white,
            height: 5,
          }}
        />
        <View
          style={{
            width: widthLine,
            position: 'absolute',
            left: widthLine * 2,
            backgroundColor: step >= 2 ? colors.primary : colors.cD0D5DD,
            height: 5,
          }}
        />
      </View>
    );
  };

  const renderStepLine = () => {
    switch (step) {
      case 0:
        return (
          <Info
            dataLogin={dataLogin}
            dataNurseInfo={dataNurseInfo}
            updateNurseInfo={updateNurseInfo}
            avatarPrefix={avatarPrefix}
            changeAvatar={handlePresentModalPress}
            onTouchCountry={handleTouchCountry}
            onTouchGender={showGender}
            onTouchBirthday={handleTouchBirthday}
            // updateNurseInfoLinks={updateNurseInfoLinks}
            // addNewLink={addNewLink}
            // removeLink={removeLink}
            errAPI={errAPI}
            setPassStep={setPassStep1}
            updateLoginData={updateLoginData}
            callBackValid={handleCheckStep1Valid}
            isHasRequestAPI={isHasRequestAPI}
            phoneErrVerify={phoneErrVerify}
            setPhoneErrVerify={setPhoneErrVerify}
            emailErrVerify={emailErrVerify}
            setEmailErrVerify={setEmailErrVerify}
          />
        );
      case 1:
        return (
          <Specializations
            dataNurseInfo={dataNurseInfo}
            updateNurseInfo={updateNurseInfo}
          />
        );
      case 2:
        // Cho nay thay doi xiu thanh mo ta thong tin cong viec
        return (
          // <WorkInformation
          //   dataNurseInfo={dataNurseInfo}
          //   updateNurseInfo={updateNurseInfo}
          //   addNewDoc={addNewDoc}
          //   showModalCommon={handleShowModalCommon}
          //   removeNewDoc={removeNewDoc}
          // />
          <WorkInformationV2
            dataNurseInfo={dataNurseInfo}
            updateNurseInfo={updateNurseInfo}
            addNewDoc={addNewDoc}
            showModalCommon={handleShowModalCommon}
            removeNewDoc={removeNewDoc}
          />
        );
      default:
        break;
    }
  };

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

  return (
    <Wrapper>
      <CHeader
        rightComponentDisable
        leftComponentOnPress={handleBack}
        title={title}
      />
      {renderLineStep()}
      {renderStepLine()}
      <CButton
        isBottom
        title={t('common.continue')}
        isDisable={!activeBtn}
        onPress={handleNext}
      />
      {showModalCountry && (
        <ModalCountry
          isVisible={showModalCountry}
          hideModal={() => setShowModalCountry(false)}
          chooseCountry={handleUpdateCountry}
          countryChoose={dataNurseInfo.country}
        />
      )}
      {showModalGender && (
        <ModalGender
          isVisible={showModalGender}
          hideModal={() => setShowModalGender(false)}
          chooseGender={handleUpdateGender}
          genderChoose={dataNurseInfo.gender}
        />
      )}
      {showModalBirthday && (
        <CDatePicker
          isModalVisible={showModalBirthday}
          dateTimeValue={dataNurseInfo.birthday || new Date(date_Atmometer)}
          closeModal={() => setShowModalBirthday(false)}
          onChangeDate={handleOnChangeDate}
        />
      )}
      {showAlert ? (
        <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
      ) : null}
      {renderBottomSheetModal()}
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
      {modalCommon.isShow && (
        <ModalCommon
          isVisible={modalCommon.isShow}
          hideModal={() =>
            setModalCommon({
              ...modalCommon,
              isShow: false,
            })
          }
          listData={modalCommon.data || []}
          title={modalCommon.title || ''}
          itemChoose={modalCommon.currentItemSelect}
          onSubmit={handleChooseCommon}
        />
      )}
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};
