import {
  APILoading,
  CDatePicker,
  CHeader,
  IconType,
  IconX,
  ModalCountry,
  ModalGender,
  Toast,
  Wrapper,
} from '@/components';
import ModalOTP, { OTPType } from '@/components/modal-otp';
import {
  ScreenWidth,
  ifIphoneX,
  isIOS,
  isValidDate,
  logError,
  screenStyles,
  showToast,
  statusSuccess,
  toLower,
} from '@/configs';
import { AppContext } from '@/contexts';
import {
  cameraSingleCropLauncher,
  photoSingleCropLauncher,
} from '@/permissions';
import { showPhotoLibrary } from '@/permissions/picker';
// import {
//   resetOnboardUnused,
//   updateDoctorProfile,
// } from '@/redux/slices/onboardSlice';
import { getProfile } from '@/redux/slices/profileSlice';
import { getSettingsOnboarding } from '@/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { ModalPhoneCode } from '@/screens/auth-screen/step/components';
import ApiService from '@/services/api-base';
import { CButton, CText, Row } from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { makeStyles, useTheme } from '@rneui/themed';
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
import { Keyboard, Platform, Pressable } from 'react-native';
// import RNFS from 'react-native-fs';
import { TabBar, TabView } from 'react-native-tab-view';
// import MyInformation from './MyInformation';
// import SpecialList from './SpecialList';
// import { isHasChangeLink, isHasChangeSpecial } from './functions';
// import WorkInformation from './WorkInformation';
import { ModalCommon } from '@/screens/auth-screen/step/nurse-info/step';
import { goBack } from '@/navigation/RootNavigation';

const useStyles = makeStyles(({ colors }) => ({
  tabStyle: {
    width: 'auto',
  },
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 2,
    // left: 12,
  },
}));

const PartnerEditProfileScreen: React.FC<any> = ({
  navigation,
  route,
}: any) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();
  const toastEl = useRef<any>(null);

  const { t } = useTranslation();

  //   const {user} = useContext(AppContext);
  //   const dispatch = useAppDispatch();
  //   const {doctorUpdate} = useAppSelector(state => state.onboardReducer);
  //   const {settingOnboarding} = useAppSelector(state => state.settingReducer);

  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  //   const snapPoints = useMemo(() => [180, 180 + ifIphoneX(15, 0)], []);

  const [index, setIndex] = useState<number>(0);

  const [routes] = useState([
    {
      key: 'MyInformation',
      title: t('profile.editProfileScreen.myInformation'),
    },
    {
      key: 'SpecialList',
      title: t('profile.editProfileScreen.specialList', 'SpecialList'),
    },
    {
      key: 'WorkInformation',
      title: t('profile.editProfileScreen.workInformation', 'Work information'),
    },
  ]);

  //   const [myInfo, setMyInfo] = useState({
  //     avatar: '',
  //     avatarPrefix: '',
  //     username: '',
  //     fullName: '',
  //     isKYCFullName: false,
  //     channelName: '',
  //     channelId: -1,
  //     country: {
  //       id: -1,
  //       name: '',
  //     },
  //     gender: {value: '', name: '', label: ''},
  //     birthday: '',
  //     isKYCDob: false,
  //     phone: '',
  //     email: '',
  //     identification: '',
  //     isKYCIdentification: false,
  //     description: '',
  //   });

  //   const [socials, setSocials] = useState<any>([
  //     {id: -1, link: '', delete: false}, //fb
  //     {id: -1, link: '', delete: false}, //youtube
  //     {id: -1, link: '', delete: false}, //tiktok
  //     {id: -1, link: '', delete: false}, //Website
  //   ]);

  //   const [socialsOld, setSocialsOld] = useState<any>([
  //     {id: -1, link: '', delete: false}, //fb
  //     {id: -1, link: '', delete: false}, //youtube
  //     {id: -1, link: '', delete: false}, //tiktok
  //     {id: -1, link: '', delete: false}, //Website
  //   ]);

  //   const [showModalGender, setShowModalGender] = useState<boolean>(false);
  //   const [showModalBirthday, setShowModalBirthday] = useState(false);
  //   const [date_Atmometer] = useState<any>(moment(new Date(), 'DD/MM/YYYY'));
  //   const [showModalCountry, setShowModalCountry] = useState<boolean>(false);

  //   //tab2
  //   const [isChangeSpecialization, setIsChangeSpecialization] =
  //     useState<boolean>(false);
  //   const [specializationArr, setSpecializationArr] = useState<any>([]);
  //   const [specializationArrOld, setSpecializationArrOld] = useState<any>([]);

  //   //tab3
  //   const [isChangeAttachments, setIsChangeAttachments] =
  //     useState<boolean>(false);
  //   const [attachments, setAttactments] = useState<any>([]);
  //   const [attachmentsOld, setAttactmentsOld] = useState<any>([]);
  //   const [otherAttachments, setOtherAttactments] = useState<any>([]);
  //   const [otherAttachmentsOld, setOtherAttactmentsOld] = useState<any>([]);

  //   const [position, setPosition] = useState({
  //     awardId: -1, //danh hieu
  //     isKYCAwardId: false,
  //     academicId: -1, //hoc ham
  //     isKYCAcademicId: false,
  //     degreeId: -1, //hoc vi
  //     isKYCDegreeId: false,
  //     occupationId: -1,
  //     isKYCOccupationId: false,
  //   });

  //   const [modalCommon, setModalCommon] = useState({
  //     title: '',
  //     isShow: false,
  //     data: [],
  //     currentItemSelect: {id: -1, name: '', code: ''},
  //   });

  //   const [errAPI, setErrAPI] = useState<any>({});

  //   const [activeBtn, setActiveBtn] = useState(false);

  //   const [showAlert, setShowAlert] = useState(false);
  //   const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  //   const [isSuccess, setIsSuccess] = useState(false);

  //   const [isKYC, setIsKYC] = useState(false);

  //   const [firstRender, setFirstRender] = useState<boolean>(true);

  //   const [verifyEmail, setVerifyEmail] = useState({
  //     isVisible: false,
  //     listEmailOld: [
  //       // {isVerified:false, emailText:''}
  //     ], //dung de kiem tra gia tri co thay doi hay ko
  //     emailShow: '',
  //   });

  //   const [isEditEmail, setIsEditEmail] = useState(true);
  //   const [errEmail, setErrEmail] = useState('');

  //   const [requiredPhone, setRequiredPhone] = useState<number>(0);
  //   const [requiredDob, setRequiredDob] = useState<number>(0);
  //   const [requiredGender, setRequiredGender] = useState<number>(0);

  //   const [showModalPhoneCode, setShowModalPhoneCode] = useState<boolean>(false);
  //   const [phoneCode, setPhoneCode] = useState({
  //     value: '+84',
  //     label: 'Vietnam',
  //   });

  //   const [verifyPhone, setVerifyPhone] = useState({
  //     isVisible: false,
  //     listPhoneOld: [
  //       // {isVerified:false, phoneText:''}
  //     ], //dung de kiem tra gia tri co thay doi hay ko
  //     phoneSend: '',
  //   });

  //   const phoneEl = useRef(null);
  //   const [errPhone, setErrPhone] = useState('');

  //   //EFFECT
  //   useEffect(() => {
  //     if (route?.params) {
  //       if (route?.params?.tabIndex !== undefined) {
  //         setIndex(route?.params?.tabIndex || 0);
  //       }
  //     }
  //     setFirstRender(false);
  //   }, [route]);

  //   useEffect(() => {
  //     const initMyInfoData = () => {
  //       let links = JSON.parse(JSON.stringify(socials));
  //       if (user.personalization?.socials) {
  //         let arrDelete = [];
  //         let isFB: any,
  //           isYoutube: any,
  //           isTiktok: any,
  //           isWebsite: any = false;
  //         for (let i = 0; i < user.personalization?.socials?.length; i++) {
  //           let item = user.personalization.socials[i];
  //           switch (item.type) {
  //             case 'Facebook':
  //               if (!isFB) {
  //                 links[0].id = item.id ? item.id : -1;
  //                 links[0].link = item.link || '';
  //                 isFB = true;
  //                 arrDelete.push({
  //                   ...item,
  //                   isDeleted: true,
  //                 });
  //               }
  //               break;
  //             case 'Youtube':
  //               if (!isYoutube) {
  //                 links[1].id = item.id ? item.id : -1;
  //                 links[1].link = item.link || '';
  //                 isYoutube = true;
  //                 arrDelete.push({
  //                   ...item,
  //                   isDeleted: true,
  //                 });
  //               }
  //               break;
  //             case 'Tiktok':
  //               if (!isTiktok) {
  //                 // console.log('======= 2', arrTemp.length);
  //                 links[2].id = item.id ? item.id : -1;
  //                 links[2].link = item.link || '';
  //                 isTiktok = true;
  //                 arrDelete.push({
  //                   ...item,
  //                   isDeleted: true,
  //                 });
  //               }
  //               break;
  //             case 'Website':
  //               if (!isWebsite) {
  //                 links[3].id = item.id ? item.id : -1;
  //                 links[3].link = item.link || '';
  //                 isWebsite = true;
  //                 arrDelete.push({
  //                   ...item,
  //                   isDeleted: true,
  //                 });
  //               }
  //               break;
  //             default:
  //               break;
  //           }
  //           for (let i = 0; i < arrDelete.length; i++) {
  //             if (!arrDelete[i].isDeleted) {
  //               let item: any = {
  //                 id: arrDelete[i].id ? arrDelete[i].id : -1,
  //                 link: arrDelete[i].link || '',
  //                 delete: false,
  //               };
  //               links.push(item);
  //             }
  //           }
  //         }
  //       }
  //       setSocials(JSON.parse(JSON.stringify(links)));
  //       setSocialsOld(JSON.parse(JSON.stringify(links)));

  //       let fullName = user.full_name || '';
  //       let isKYCFullName = false;

  //       let birthday = isValidDate(user.dob)
  //         ? moment(user.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')
  //         : '';
  //       let isKYCDob = false;

  //       let identification = user.personalization?.identification || '';
  //       let isKYCIdentification = false;
  //       if (user.personalization?.kyc_changes) {
  //         const kycChange = user.personalization?.kyc_changes;
  //         if (kycChange.full_name) {
  //           fullName = kycChange.full_name;
  //           isKYCFullName = true;
  //         }
  //         if (kycChange.dob) {
  //           birthday = isValidDate(kycChange.dob)
  //             ? moment(kycChange.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')
  //             : '';
  //           isKYCDob = true;
  //         }
  //         if (kycChange.identification) {
  //           identification = kycChange.identification;
  //           isKYCIdentification = true;
  //         }
  //       }

  //       setMyInfo({
  //         ...myInfo,
  //         avatar: user.personalization?.avatar || '',
  //         avatarPrefix: user.personalization?.avatar ? '' : myInfo.avatarPrefix,
  //         username: user.username || '',
  //         // fullName: user.full_name,
  //         fullName,
  //         isKYCFullName,
  //         channelName: user.channel_name || '',
  //         channelId: user.channel_id || -1,
  //         country: {
  //           id: user.country ? 999 : -1,
  //           name: user.country || '',
  //         },
  //         gender: {
  //           value: user.gender || '',
  //           name: user.gender ? t(`gender.${user.gender?.toLowerCase()}`) : '',
  //           label: user.gender || '',
  //         },
  //         birthday,
  //         isKYCDob,
  //         phone: user.phone || '',
  //         email: user.email || '',
  //         identification,
  //         isKYCIdentification,
  //         description: user.personalization?.description || '',
  //       });
  //       if (
  //         user.provider &&
  //         user.provider?.toLowerCase() != 'phone' &&
  //         user.email != ''
  //       ) {
  //         setIsEditEmail(false);
  //       }
  //       //tab2
  //       if (user.personalization?.kyc_changes?.specializations) {
  //         setSpecializationArr(
  //           JSON.parse(
  //             JSON.stringify(
  //               user.personalization?.kyc_changes?.specializations || [],
  //             ),
  //           ),
  //         );
  //         setSpecializationArrOld(
  //           JSON.parse(
  //             JSON.stringify(
  //               user.personalization?.kyc_changes?.specializations || [],
  //             ),
  //           ),
  //         );
  //         setIsChangeSpecialization(true);
  //       } else {
  //         if (user.personalization?.specializations) {
  //           setSpecializationArr(
  //             JSON.parse(
  //               JSON.stringify(user.personalization?.specializations || []),
  //             ),
  //           );
  //           setSpecializationArrOld(
  //             JSON.parse(
  //               JSON.stringify(user.personalization?.specializations || []),
  //             ),
  //           );
  //         }
  //       }

  //       //tab3
  //       console.log(
  //         '🚀 ~ initMyInfoData ~ user.personalization:',
  //         user.personalization,
  //       );
  //       if (user.personalization?.kyc_changes?.attachments) {
  //         let arrDefault = [];
  //         let arrOther = [];
  //         for (
  //           let i = 0;
  //           i < user.personalization?.kyc_changes?.attachments?.length;
  //           i++
  //         ) {
  //           let itemTemp = user.personalization?.kyc_changes?.attachments[i];
  //           let typeP = itemTemp?.file?.split('.').pop();
  //           let objectDefault = {
  //             id: itemTemp.id,
  //             certificate_id: itemTemp.certificate_id,
  //             certifiName: '',
  //             status: itemTemp.status,
  //             file: itemTemp.file, //cho nay dung de luu giu so sanh voi trang thai thay doi truoc do
  //             fileUri: itemTemp.file || '',
  //             fileCopyUri: itemTemp.file || '',
  //             fileName: itemTemp.name,
  //             fileType: typeP,
  //             fileSize: itemTemp.size,
  //           };
  //           if (objectDefault.certificate_id) {
  //             arrDefault.push(objectDefault);
  //           } else {
  //             arrOther.push(objectDefault);
  //           }
  //         }
  //         setAttactments(arrDefault);
  //         setAttactmentsOld(arrDefault);
  //         setOtherAttactments(arrOther);
  //         setOtherAttactmentsOld(arrOther);
  //         setIsChangeAttachments(true);
  //       } else if (user.personalization?.attachments) {
  //         let arrDefault = [];
  //         let arrOther = [];
  //         for (let i = 0; i < user.personalization?.attachments?.length; i++) {
  //           let itemTemp = user.personalization?.attachments[i];
  //           let typeP = itemTemp?.file?.split('.').pop();
  //           let objectDefault = {
  //             id: itemTemp.id,
  //             certificate_id: itemTemp.certificate_id,
  //             certifiName: '',
  //             status: itemTemp.status,
  //             file: itemTemp.file, //cho nay dung de luu giu so sanh voi trang thai thay doi truoc do
  //             fileUri: itemTemp.file || '',
  //             fileCopyUri: itemTemp.file || '',
  //             fileName: itemTemp.name,
  //             fileType: typeP,
  //             fileSize: itemTemp.size,
  //           };
  //           if (objectDefault.certificate_id) {
  //             arrDefault.push(objectDefault);
  //           } else {
  //             arrOther.push(objectDefault);
  //           }
  //         }
  //         setAttactments(arrDefault);
  //         setAttactmentsOld(arrDefault);
  //         setOtherAttactments(arrOther);
  //         setOtherAttactmentsOld(arrOther);
  //       }

  //       let _awardId = user.personalization?.award_id || -1;
  //       let _isKYCAwardId = false;

  //       let _academicId = user.personalization?.academic_id || -1;
  //       let _isKYCAcademicId = false;

  //       let _degreeId = user.personalization?.degree_id || -1;
  //       let _isKYCDegreeId = false;

  //       let _occupationId = user.personalization?.occupation_id || -1;
  //       let _isKYCOccupationId = false;

  //       if (user.personalization?.kyc_changes) {
  //         const kycChange = user.personalization?.kyc_changes;

  //         if (kycChange.award && kycChange.award.id) {
  //           _awardId = kycChange.award.id;
  //           _isKYCAwardId = true;
  //         }

  //         if (kycChange.academic && kycChange.academic.id) {
  //           _academicId = kycChange.academic.id;
  //           _isKYCAcademicId = true;
  //         }

  //         if (kycChange.degree && kycChange.degree.id) {
  //           _degreeId = kycChange.degree.id;
  //           _isKYCDegreeId = true;
  //         }

  //         if (kycChange.occupation && kycChange.occupation.id) {
  //           _occupationId = kycChange.occupation.id;
  //           _isKYCOccupationId = true;
  //         }
  //       }

  //       setPosition({
  //         ...position,
  //         awardId: _awardId, //danh hieu
  //         isKYCAwardId: _isKYCAwardId,
  //         academicId: _academicId, //hoc ham
  //         isKYCAcademicId: _isKYCAcademicId,
  //         degreeId: _degreeId, //hoc vi
  //         isKYCDegreeId: _isKYCDegreeId,
  //         occupationId: _occupationId,
  //         isKYCOccupationId: _isKYCOccupationId,
  //       });
  //     };

  //     if (user.username && myInfo.username == '') {
  //       if (user.id) {
  //         initMyInfoData();
  //       }
  //     }
  //   }, [user]);

  //   useEffect(() => {
  //     // Kiem tra xem co yeu cau nhap phone hay khong
  //     dispatch(getSettingsOnboarding({fq: 'type:onboard'}));
  //   }, []);

  //   useEffect(() => {
  //     const processAPIRequiredField = () => {
  //       const {loading, data, error} = settingOnboarding;
  //       if (!loading) {
  //         if (data) {
  //           const items = data.items || [];
  //           let isRequiredDob = 0;
  //           let isRequiredGender = 0;
  //           let isRequiredPhone = 0;
  //           for (let i = 0; i < items.length; i++) {
  //             if (items[i].code == 'required_dob_doctor') {
  //               isRequiredDob = items[i].value ? items[i].value : 0;
  //             }
  //             if (items[i].code == 'required_gender_doctor') {
  //               isRequiredGender = items[i].value ? items[i].value : 0;
  //             }
  //             if (items[i].code == 'required_phone_doctor') {
  //               isRequiredPhone = items[i].value ? items[i].value : 0;
  //             }
  //           }
  //           setRequiredGender(isRequiredGender);
  //           setRequiredDob(isRequiredDob);
  //           setRequiredPhone(isRequiredPhone);
  //         } else if (error) {
  //           // dispatch(resetSettings(null));
  //         }
  //       }
  //     };
  //     processAPIRequiredField();
  //   }, [settingOnboarding]);

  //   useEffect(() => {
  //     const checkActiveBtn = () => {
  //       let isSave = false;
  //       switch (index) {
  //         case 0:
  //           const {
  //             avatar,
  //             avatarPrefix,
  //             username,
  //             fullName,
  //             isKYCFullName,
  //             country,
  //             gender,
  //             birthday,
  //             isKYCDob,
  //             identification,
  //             isKYCIdentification,
  //             email,
  //             description,
  //             channelName,
  //             phone,
  //           } = myInfo;
  //           if (avatarPrefix != '') {
  //             isSave = true;
  //           }
  //           // if (username != user.username) {
  //           //   isSave = true;
  //           // }
  //           if (isKYCFullName) {
  //             if (
  //               fullName?.trim() != user.personalization?.kyc_changes.full_name
  //             ) {
  //               isSave = true;
  //             }
  //           } else {
  //             if (fullName?.trim() != user.full_name) {
  //               isSave = true;
  //             }
  //           }

  //           if (channelName != user.channel_name) {
  //             isSave = true;
  //           }
  //           if (country.name != user.country) {
  //             isSave = true;
  //           }
  //           if (gender.name != '' && gender.name != user.gender) {
  //             let genderTemp = t(`gender.${user.gender?.toLowerCase()}`);
  //             if (genderTemp != gender.name) {
  //               isSave = true;
  //             }
  //           }
  //           if (birthday != '') {
  //             const br = moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
  //             if (isKYCDob) {
  //               if (br != user.personalization?.kyc_changes?.dob) {
  //                 isSave = true;
  //               }
  //             } else {
  //               if (br != user.dob) {
  //                 isSave = true;
  //               }
  //             }
  //           }
  //           let emailP = user.email ? user.email : '';
  //           if (email.trim() != emailP) {
  //             isSave = true;
  //           }
  //           if (
  //             phone !== '' &&
  //             user.phone !== phone &&
  //             user.phone !== `${phoneCode.value}${phone}`
  //           ) {
  //             isSave = true;
  //           }
  //           if (isKYCIdentification) {
  //             if (
  //               identification &&
  //               identification.trim() !=
  //                 user.personalization?.kyc_changes.identification
  //             ) {
  //               isSave = true;
  //             }
  //           } else {
  //             if (
  //               identification &&
  //               identification.trim() != user.personalization?.identification
  //             ) {
  //               isSave = true;
  //             }
  //           }

  //           if (
  //             description != '' &&
  //             description != user.personalization?.description
  //           ) {
  //             isSave = true;
  //           }
  //           //kiem tra co thay doi ve link
  //           if (isHasChangeLink(socials, socialsOld)) {
  //             isSave = true;
  //           }
  //           break;
  //         case 1:
  //           if (isHasChangeSpecial(specializationArr, specializationArrOld)) {
  //             isSave = true;
  //           }
  //           break;
  //         case 2:
  //           const {
  //             awardId,
  //             isKYCAwardId,
  //             academicId,
  //             isKYCAcademicId,
  //             degreeId,
  //             isKYCDegreeId,
  //             occupationId,
  //             isKYCOccupationId,
  //           } = position;
  //           console.log('🚀 ~ checkActiveBtn ~ awardId:', awardId);
  //           if (isKYCAwardId) {
  //             if (awardId != user.personalization?.kyc_changes?.award?.id) {
  //               isSave = true;
  //             }
  //           } else {
  //             if (awardId != user.personalization?.award_id) {
  //               isSave = true;
  //             }
  //           }

  //           if (isKYCAcademicId) {
  //             if (academicId != user.personalization?.kyc_changes?.academic?.id) {
  //               isSave = true;
  //             }
  //           } else {
  //             if (academicId != user.personalization?.academic_id) {
  //               isSave = true;
  //             }
  //           }

  //           if (isKYCDegreeId) {
  //             if (degreeId != user.personalization?.kyc_changes?.degree?.id) {
  //               isSave = true;
  //             }
  //           } else {
  //             if (degreeId != user.personalization?.degree_id) {
  //               isSave = true;
  //             }
  //           }

  //           if (isKYCOccupationId) {
  //             if (
  //               occupationId != user.personalization?.kyc_changes?.occupation?.id
  //             ) {
  //               isSave = true;
  //             }
  //           } else {
  //             if (occupationId != user.personalization?.occupation_id) {
  //               isSave = true;
  //             }
  //           }
  //           // if (
  //           //   position.awardId != user.personalization?.award_id ||
  //           //   position.academicId != user.personalization?.academic_id ||
  //           //   position.degreeId != user.personalization?.degree_id ||
  //           //   position.occupationId != user.personalization?.occupation_id
  //           // ) {
  //           //   isSave = true;
  //           // }
  //           if (otherAttachments.length > 0) {
  //             for (let i = 0; i < otherAttachments.length; i++) {
  //               if (otherAttachments[i].file != otherAttachments[i].fileUri) {
  //                 if (otherAttachments[i].fileUri != '') {
  //                   isSave = true;
  //                 }
  //                 break;
  //               }
  //             }
  //           } else {
  //             if (otherAttachmentsOld.length > 0) {
  //               isSave = true;
  //               break;
  //             }
  //           }
  //           if (attachments.length > 0) {
  //             for (let i = 0; i < attachments.length; i++) {
  //               if (attachments[i].file != attachments[i].fileUri) {
  //                 if (attachments[i].fileUri != '') {
  //                   isSave = true;
  //                 }
  //                 isSave = true;
  //               }
  //               if (!attachments[i].fileUri) {
  //                 isSave = false;
  //                 break;
  //               }
  //             }
  //           } else {
  //             if (attachmentsOld.length > 0) {
  //               isSave = true;
  //               break;
  //             }
  //           }
  //           // if (position.occupationId == -1) {
  //           //   isSave = false;
  //           // }
  //           break;
  //         default:
  //           isSave = true;
  //           break;
  //       }
  //       setActiveBtn(isSave);
  //     };
  //     checkActiveBtn();
  //   }, [
  //     myInfo,
  //     specializationArr,
  //     socials,
  //     attachments,
  //     otherAttachments,
  //     position,
  //   ]);

  //   useEffect(() => {
  //     const processAPIUpdateDoctor = () => {
  //       const {loading, data, error} = doctorUpdate;
  //       if (!loading) {
  //         if (data) {
  //           const {result, status} = data;
  //           // console.log('🚀 ~ processAPIUpdateDoctor ~ data:', data);
  //           // {"msg": "Congratulations, your account has been successfully updated", "status": "success"}
  //           if (statusSuccess(status)) {
  //           }
  //           dispatch(getProfile(null));
  //           setIsSuccess(true);
  //           setIsLoadingAPI(false);
  //           dispatch(resetOnboardUnused(null));
  //         } else if (error) {
  //           // console.log('🚀 ~ processAPIUpdateDoctor ~ error:', error);
  //           setShowAlert(false);
  //           setIsSuccess(false);
  //           setIsLoadingAPI(false);
  //           if (index == 3) {
  //             showToast(toastEl, logError(error, '', false));
  //           }
  //           setErrAPI(error);
  //           dispatch(resetOnboardUnused(null));
  //         }
  //       }
  //     };
  //     processAPIUpdateDoctor();
  //   }, [doctorUpdate]);

  //   //action
  //   const handleChoosePhoneCode = (codeChoose: any) => {
  //     setPhoneCode({
  //       ...phoneCode,
  //       value: codeChoose.value ?? '',
  //     });
  //     setShowModalPhoneCode(false);
  //   };

  //   const handleBack = () => {
  //     navigation.pop(1);
  //   };

  //   const updateMyInfo = (name: string, value: any) => {
  //     setMyInfo({
  //       ...myInfo,
  //       [name]: value,
  //     });
  //   };

  //   const handlePresentModalPress = useCallback(() => {
  //     bottomSheetModalRef.current?.present();
  //   }, []);

  //   const handleTouchCountry = () => {
  //     setShowModalCountry(true);
  //   };

  //   const convertBase64 = async (localUri: any) => {
  //     const data = await RNFS.readFile(
  //       decodeURIComponent(localUri),
  //       'base64',
  //     ).then(res => {
  //       return res;
  //     });
  //     return data;
  //   };

  //   const convertAttactment = async (arrData: any[]) => {
  //     let result = [];
  //     try {
  //       for (let i = 0; i < arrData.length; i++) {
  //         let item = arrData[i];
  //         if (item.fileUri) {
  //           let base64 = '';
  //           if (isIOS) {
  //             base64 = await convertBase64(item.fileUri);
  //           } else if (item.fileCopyUri) {
  //             base64 = await convertBase64(item.fileCopyUri);
  //           }
  //           let itemPush: any = {
  //             file: base64,
  //             name: toLower(item.fileName),
  //           };
  //           if (item.certificate_id) {
  //             itemPush.certificate_id = item.certificate_id;
  //           }
  //           result.push(itemPush);
  //         } else if (item.delete && item.id) {
  //           result.push(item);
  //         }
  //       }
  //     } catch (error) {
  //       console.log(
  //         '🚀 ~ file: index.tsx:403 ~ convertAttactment ~ error:',
  //         error,
  //       );
  //     }
  //     return result;
  //   };

  //   const checkStatusVerifyEmail = (emailCompare: string) => {
  //     for (let i = 0; i < verifyEmail.listEmailOld.length; i++) {
  //       let item: any = verifyEmail.listEmailOld[i];
  //       if (item.emailText == emailCompare) {
  //         return item.isVerified;
  //       }
  //     }
  //     return false;
  //   };

  //   const handleRegistryVerifyEmail = (emailCompare: string) => {
  //     const isVerify = checkStatusVerifyEmail(emailCompare);
  //     if (!isVerify) {
  //       let bodyData: any = {
  //         email: emailCompare,
  //         fullName: '',
  //       };
  //       console.log('🚀 ~ handleRegistryVerifyEmail ~ bodyData:', bodyData);
  //       ApiService.updateDoctorProfile(bodyData)
  //         .then(res => {
  //           const {status, data}: any = res;
  //           let isFound = false;
  //           if (isArray(data.errors)) {
  //             let errors = data.errors || [];
  //             console.log('🚀 ~ handleRegistryVerifyEmail ~ errors:', errors);
  //             for (let i = 0; i < errors.length; i++) {
  //               if (errors[i].key == 'email') {
  //                 setErrEmail(errors[i].msg);
  //                 isFound = true;
  //                 break;
  //               }
  //             }
  //             if (!isFound) {
  //               setErrEmail('');
  //               // xac minh otp qua email
  //               Keyboard.dismiss();
  //               setVerifyEmail({
  //                 ...verifyEmail,
  //                 isVisible: true,
  //                 emailShow: emailCompare,
  //               });
  //             }
  //           }
  //         })
  //         .catch(err => {
  //           console.log('=========== err', err);
  //         });
  //     } else {
  //       handleSubmit();
  //     }
  //   };

  //   const checkStatusVerify = (phoneCompare: string) => {
  //     for (let i = 0; i < verifyPhone.listPhoneOld.length; i++) {
  //       let item: any = verifyPhone.listPhoneOld[i];
  //       if (item.phoneCode == phoneCode.value) {
  //         if (phoneCompare != '' && item.phoneText == phoneCompare) {
  //           return item.isVerified;
  //         }
  //       }
  //     }
  //     return false;
  //   };

  //   const handleVerifyPhoneSuccess = () => {
  //     let arrClone: any = [...verifyPhone.listPhoneOld];
  //     let obj = {
  //       isVerified: true,
  //       phoneCode: phoneCode.value,
  //       phoneText: myInfo.phone.trim(),
  //     };
  //     arrClone.push(obj);
  //     setVerifyPhone({
  //       ...verifyPhone,
  //       isVisible: false,
  //       listPhoneOld: arrClone,
  //       phoneSend: '',
  //     });
  //     Keyboard.dismiss();
  //     handleSubmit();
  //   };

  //   const handleRegistryVerifyPhone = async (phoneCompare: string) => {
  //     const isVerify = checkStatusVerify(phoneCompare);
  //     let phoneParse = phoneCompare.trim();
  //     if (phoneCode.value == '+84') {
  //       let firstCharacter = phoneParse.charAt(0);
  //       if (firstCharacter == '0') {
  //         phoneParse = phoneParse.substring(1);
  //       }
  //     }
  //     let phoneP = phoneCode.value + phoneParse;
  //     if (!isVerify) {
  //       let bodyData: any = {
  //         phone: phoneP,
  //         fullName: '',
  //       };
  //       ApiService.putUpdateProfile(bodyData)
  //         .then(res => {
  //           const {status, data}: any = res;
  //           let isFound = false;
  //           if (isArray(data.errors)) {
  //             let errors = data.errors || [];
  //             console.log('🚀 ~ handleRegistryVerifyPhone ~ errors:', errors);
  //             for (let i = 0; i < errors.length; i++) {
  //               if (errors[i].key == 'phone') {
  //                 setErrPhone(errors[i].msg);
  //                 isFound = true;
  //                 break;
  //               }
  //             }
  //             if (!isFound) {
  //               setErrPhone('');
  //               Keyboard.dismiss();
  //               setVerifyPhone({
  //                 ...verifyPhone,
  //                 isVisible: true,
  //                 phoneSend: phoneP,
  //               });
  //             }
  //           }
  //         })
  //         .catch(err => {
  //           console.log('=========== err', err);
  //         });
  //     } else {
  //       handleSubmit();
  //     }
  //   };

  //   const handleSubmitEdit = async () => {
  //     if (index == 0) {
  //       if (isEditEmail) {
  //         let emailCheck = myInfo.email.trim();
  //         if (emailCheck != '' && emailCheck != user.email) {
  //           // Check verify email
  //           handleRegistryVerifyEmail(myInfo.email.trim());
  //         } else {
  //           handleSubmit();
  //         }
  //       } else {
  //         if (myInfo.phone !== '' && myInfo.phone.trim() != user.phone) {
  //           handleRegistryVerifyPhone(myInfo.phone.trim());
  //         } else {
  //           handleSubmit();
  //         }
  //       }
  //     } else {
  //       handleSubmit();
  //     }
  //   };

  //   const handleSubmit = async () => {
  //     let isRequestKYC = false;
  //     switch (index) {
  //       case 0:
  //         setShowAlert(true);
  //         setIsLoadingAPI(true);
  //         let bodyData: any = {};
  //         const {
  //           avatarPrefix,
  //           username,
  //           fullName,
  //           isKYCFullName,
  //           channelName,
  //           channelId,
  //           country,
  //           gender,
  //           birthday,
  //           isKYCDob,
  //           email,
  //           identification,
  //           isKYCIdentification,
  //           description,
  //           phone,
  //         } = myInfo;
  //         if (avatarPrefix != '') {
  //           bodyData.avatar = myInfo.avatar;
  //         }
  //         if (username != user.username) {
  //           bodyData.username = username;
  //         }
  //         if (isKYCFullName) {
  //           if (fullName?.trim() != user.personalization?.kyc_changes.full_name) {
  //             bodyData.fullName = fullName;
  //             isRequestKYC = true;
  //           }
  //         } else if (fullName?.trim() != user.full_name) {
  //           bodyData.fullName = fullName;
  //           isRequestKYC = true;
  //         }

  //         if (channelName != user.channel_name) {
  //           bodyData.channel_name = channelName;
  //           bodyData.channel_id = channelId;
  //           // isRequestKYC = true;
  //         }
  //         if (country.name != user.country) {
  //           bodyData.country = country.name;
  //         }
  //         // console.log("🚀 ~ handleSubmit ~ user.gender:", user.gender)
  //         if (gender.name != '' && gender.name != user.gender) {
  //           bodyData.gender = gender.value;
  //         }
  //         if (birthday != '') {
  //           const br = moment(myInfo.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
  //           if (isKYCDob) {
  //             if (br != user.personalization?.kyc_changes?.dob) {
  //               bodyData.dob = br;
  //               isRequestKYC = true;
  //             }
  //           } else if (br != user.dob) {
  //             bodyData.dob = br;
  //             isRequestKYC = true;
  //           }
  //         }
  //         let emailP = user.email ? user.email : '';
  //         if (email.trim() != emailP) {
  //           bodyData.email = email;
  //         }
  //         if (phone !== '') {
  //           if (user.phone != `${phoneCode.value}${phone}`) {
  //             bodyData.phone = phone;
  //           }
  //         }
  //         if (isKYCIdentification) {
  //           if (
  //             identification &&
  //             identification.trim() !=
  //               user.personalization?.kyc_changes.identification
  //           ) {
  //             bodyData.identification = identification;
  //           }
  //         } else {
  //           if (
  //             identification &&
  //             identification.trim() != user.personalization?.identification
  //           ) {
  //             bodyData.identification = identification;
  //           }
  //         }

  //         if (myInfo.description) {
  //           bodyData.description = myInfo.description;
  //         }
  //         if (socials.length > 0) {
  //           let links = [];
  //           for (let i = 0; i < socials.length; i++) {
  //             let item = socials[i];
  //             if (item.delete) {
  //               links.push({
  //                 id: item.id,
  //                 delete: true,
  //               });
  //             } else if (item.id == -1) {
  //               if (item.link.trim() !== '') {
  //                 links.push(socials[i].link);
  //               }
  //             } else {
  //               //cho nay miss truong hop kiem tra them co thay doi voi phien ban cu hay khong
  //               links.push({
  //                 id: item.id,
  //                 link: item.link,
  //               });
  //             }
  //           }
  //           if (links.length > 0) {
  //             bodyData.links = links;
  //           }
  //         }
  //         console.log('======= ', bodyData);
  //         setTimeout(() => {
  //           dispatch(updateDoctorProfile(bodyData));
  //         }, 300);
  //         break;
  //       case 1:
  //         let bodyDataStep1: any = {};
  //         let specializationIds = '';
  //         if (specializationArr.length > 0) {
  //           let checkChange = isHasChangeSpecial(
  //             specializationArr,
  //             specializationArrOld,
  //           );
  //           if (checkChange) {
  //             isRequestKYC = true;
  //           }
  //           for (let i = 0; i < specializationArr.length; i++) {
  //             if (i == 0) {
  //               specializationIds = specializationArr[i].id;
  //             } else {
  //               specializationIds =
  //                 specializationIds + ',' + specializationArr[i].id;
  //             }
  //           }
  //         }
  //         if (isRequestKYC) {
  //           setShowAlert(true);
  //           setIsLoadingAPI(true);
  //           bodyDataStep1.specializationId = specializationIds;
  //           setTimeout(() => {
  //             dispatch(updateDoctorProfile(bodyDataStep1));
  //           }, 300);
  //         }
  //         break;
  //       case 2:
  //         let bodyDataStep2: any = {};

  //         // if (user.personalization?.award_id != position.awardId) {
  //         //   bodyDataStep2.awardId = position.awardId;
  //         //   isRequestKYC = true;
  //         // }
  //         if (position.isKYCAwardId) {
  //           if (
  //             position.awardId != user.personalization?.kyc_changes?.award?.id
  //           ) {
  //             bodyDataStep2.awardId = position.awardId;
  //             isRequestKYC = true;
  //           }
  //         } else {
  //           if (user.personalization?.award_id != position.awardId) {
  //             bodyDataStep2.awardId = position.awardId;
  //             isRequestKYC = true;
  //           }
  //         }

  //         // if (user.personalization?.academic_id != position.academicId) {
  //         //   bodyDataStep2.academicId = position.academicId;
  //         //   isRequestKYC = true;
  //         // }

  //         if (position.isKYCAcademicId) {
  //           if (
  //             position.academicId !=
  //             user.personalization?.kyc_changes?.academic?.id
  //           ) {
  //             bodyDataStep2.academicId = position.academicId;
  //             isRequestKYC = true;
  //           }
  //         } else {
  //           if (user.personalization?.academic_id != position.academicId) {
  //             bodyDataStep2.academicId = position.academicId;
  //             isRequestKYC = true;
  //           }
  //         }

  //         // if (user.personalization?.degree_id != position.degreeId) {
  //         //   bodyDataStep2.degreeId = position.degreeId;
  //         //   isRequestKYC = true;
  //         // }
  //         if (position.isKYCDegreeId) {
  //           if (
  //             position.degreeId != user.personalization?.kyc_changes?.degree?.id
  //           ) {
  //             bodyDataStep2.degreeId = position.degreeId;
  //             isRequestKYC = true;
  //           }
  //         } else {
  //           if (user.personalization?.degree_id != position.degreeId) {
  //             bodyDataStep2.degreeId = position.degreeId;
  //             isRequestKYC = true;
  //           }
  //         }

  //         // if (user.personalization?.occupation_id != position.occupationId) {
  //         //   bodyDataStep2.occupationId = position.occupationId;
  //         //   isRequestKYC = true;
  //         // }
  //         if (position.isKYCOccupationId) {
  //           if (
  //             position.degreeId !=
  //             user.personalization?.kyc_changes?.occupation?.id
  //           ) {
  //             bodyDataStep2.occupationId = position.occupationId;
  //             isRequestKYC = true;
  //           }
  //         } else {
  //           if (user.personalization?.occupation_id != position.occupationId) {
  //             bodyDataStep2.occupationId = position.occupationId;
  //             isRequestKYC = true;
  //           }
  //         }

  //         let newArrPost = [];
  //         let attachmentsAPI: any = [];
  //         if (attachments.length > 0) {
  //           for (let i = 0; i < attachments.length; i++) {
  //             if (attachments[i].fileUri != attachments[i].file) {
  //               newArrPost.push(attachments[i]);
  //               if (attachments[i].id) {
  //                 newArrPost.push({
  //                   id: attachments[i].id,
  //                   delete: true,
  //                 });
  //               }
  //             }
  //           }
  //         } else {
  //           for (let i = 0; i < attachmentsOld.length; i++) {
  //             newArrPost.push({
  //               id: attachmentsOld[i].id,
  //               delete: true,
  //             });
  //           }
  //         }

  //         if (newArrPost.length > 0) {
  //           attachmentsAPI = await convertAttactment(newArrPost);
  //         }
  //         let newArrPostOther = [];
  //         let attachmentsAPIOther: any = [];
  //         if (otherAttachments.length > 0) {
  //           for (let i = 0; i < otherAttachments.length; i++) {
  //             if (otherAttachments[i].fileUri != otherAttachments[i].file) {
  //               newArrPostOther.push(otherAttachments[i]);
  //               newArrPostOther.push({
  //                 id: otherAttachments[i].id,
  //                 delete: true,
  //               });
  //             }
  //           }
  //         } else {
  //           for (let i = 0; i < otherAttachmentsOld.length; i++) {
  //             newArrPostOther.push({
  //               id: otherAttachmentsOld[i].id,
  //               delete: true,
  //             });
  //           }
  //         }

  //         // console.log('====newArrPost', otherAttachments);
  //         if (newArrPostOther.length > 0) {
  //           attachmentsAPIOther = await convertAttactment(newArrPostOther);
  //         }
  //         // console.log("🚀 ~ handleSubmit ~ attachmentsAPIOther:", attachmentsAPIOther)
  //         if (attachmentsAPI.length > 0 || attachmentsAPIOther.length > 0) {
  //           isRequestKYC = true;
  //         }
  //         // console.log("========= ", attachmentsAPI)
  //         if (isRequestKYC) {
  //           setShowAlert(true);
  //           setIsLoadingAPI(true);
  //           if (attachmentsAPI.length > 0 || attachmentsAPIOther.length > 0) {
  //             bodyDataStep2.attachments = [
  //               ...attachmentsAPI,
  //               ...attachmentsAPIOther,
  //             ];
  //           }
  //           console.log('========= ', bodyDataStep2);
  //           setTimeout(() => {
  //             dispatch(updateDoctorProfile(bodyDataStep2));
  //           }, 300);
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //     setIsKYC(isRequestKYC);
  //   };

  //   const handleSheetChanges = useCallback((index: number) => {
  //     console.log('handleSheetChanges', index);
  //   }, []);

  //   const handleCamera = async () => {
  //     bottomSheetModalRef.current?.close();
  //     const checkCamera: any = await cameraSingleCropLauncher();
  //     if (checkCamera.isSuccess) {
  //       if (checkCamera.imgRes) {
  //         setMyInfo({
  //           ...myInfo,
  //           avatar: checkCamera.imgRes.data,
  //           avatarPrefix: `data:image/${checkCamera.mime};base64,`,
  //         });
  //       }
  //     } else if (checkCamera.msg) {
  //       console.log('🚀 ~ handleCamera ~ checkCamera.msg:', checkCamera.msg);
  //       // showToast(toastEl, checkCamera.msg);
  //     }
  //   };

  //   const handlePhoto = async () => {
  //     bottomSheetModalRef.current?.close();
  //     let checkPhoto: any = {};
  //     if (Platform.OS == 'android') {
  //       checkPhoto = await showPhotoLibrary();
  //     } else {
  //       checkPhoto = await photoSingleCropLauncher();
  //     }
  //     if (checkPhoto.isSuccess) {
  //       if (checkPhoto.imgRes) {
  //         setMyInfo({
  //           ...myInfo,
  //           avatar: checkPhoto.imgRes.data,
  //           avatarPrefix: `data:image/${checkPhoto.mime};base64,`,
  //         });
  //       }
  //     } else if (checkPhoto.msg) {
  //       console.log('🚀 ~ handlePhoto ~ checkPhoto.msg:', checkPhoto.msg);
  //       // showToast(toastEl, checkPhoto.msg);
  //     }
  //   };

  //   const handleUpdateCountry = (countryChoose: any) => {
  //     updateMyInfo('country', countryChoose);
  //     setShowModalCountry(false);
  //   };

  //   const handleUpdateGender = (genderChoose: any) => {
  //     updateMyInfo('gender', genderChoose);
  //     setShowModalGender(false);
  //   };

  //   const handleOnChangeDate = (date: any) => {
  //     updateMyInfo('birthday', moment(date).format('DD/MM/YYYY'));
  //   };

  //   const handleAddNewLink = () => {
  //     let arrClone = JSON.parse(JSON.stringify(socials));
  //     arrClone.push({id: -1, link: '', delete: false});
  //     setSocials(arrClone);
  //   };

  //   const handleRemoveLink = (index: number) => {
  //     let arrClone = JSON.parse(JSON.stringify(socials));
  //     //kiem tra 2 truong hop, them moi voi xoa cai cu di
  //     if (arrClone[index].id == -1) {
  //       arrClone.splice(index, 1);
  //     } else {
  //       arrClone[index].delete = true;
  //     }
  //     setSocials(arrClone);
  //   };

  //   const handleUpdateInfoLinks = (index: number, value: string) => {
  //     let arrClone = JSON.parse(JSON.stringify(socials));
  //     arrClone[index].link = value;
  //     setSocials(arrClone);
  //   };

  //   const handleConfirmButtonPress = () => {
  //     setShowAlert(false);
  //     setIsSuccess(false);
  //     setIsLoadingAPI(false);
  //     navigation.pop(1);
  //     //
  //   };

  //   //step 3
  //   const handleUpdateAttachments = (newAttachments: any) => {
  //     // console.log("🚀 ~ handleUpdateAttachments ~ newAttachments:", newAttachments)
  //     setAttactments(newAttachments);
  //   };
  //   const handleUpdateOtherAttachments = (newOtherAttachments: any) => {
  //     setOtherAttactments(newOtherAttachments);
  //   };

  //   const handleShowModalCommon = (itemTitleChoose: any) => {
  //     let curSe = {
  //       ...itemTitleChoose,
  //     };
  //     if (itemTitleChoose.code === 'award') {
  //       curSe.id = position.awardId;
  //     } else if (itemTitleChoose.code === 'academy_rank') {
  //       curSe.id = position.academicId;
  //     } else if (itemTitleChoose.code === 'degree') {
  //       curSe.id = position.degreeId;
  //     } else if (itemTitleChoose.code === 'occupation') {
  //       curSe.id = position.occupationId;
  //     }
  //     setModalCommon({
  //       ...modalCommon,
  //       isShow: true,
  //       data: itemTitleChoose.children || [],
  //       title: t(`onboarding.${itemTitleChoose.code}`),
  //       currentItemSelect: curSe,
  //     });
  //   };

  //   const handleChooseCommon = (itemChoose: any) => {
  //     const id = itemChoose?.id ?? -1;
  //     if (modalCommon.currentItemSelect.code === 'award') {
  //       setPosition({
  //         ...position,
  //         awardId: id,
  //       });
  //     } else if (modalCommon.currentItemSelect.code === 'academy_rank') {
  //       setPosition({
  //         ...position,
  //         academicId: id,
  //       });
  //     } else if (modalCommon.currentItemSelect.code === 'degree') {
  //       setPosition({
  //         ...position,
  //         degreeId: id,
  //       });
  //     } else if (modalCommon.currentItemSelect.code === 'occupation') {
  //       setPosition({
  //         ...position,
  //         occupationId: id,
  //       });
  //     }
  //     setModalCommon({
  //       title: '',
  //       isShow: false,
  //       data: [],
  //       currentItemSelect: {id: -1, name: '', code: ''},
  //     });
  //   };

  //   const handleShowKYCInfo = () => {
  //     if (user.personalization?.status == 2) {
  //       showToast(
  //         toastEl,
  //         t('profile.verifyingFailed', 'Verifying Failed'),
  //         1000,
  //       );
  //     } else {
  //       showToast(toastEl, t('profile.verifying', 'Verifying'), 1000);
  //     }
  //   };

  //   const handleVerifyEmailSuccess = () => {
  //     let arrClone: any = [...verifyEmail.listEmailOld];
  //     let obj = {
  //       isVerified: true,
  //       emailText: myInfo.email.trim(),
  //     };
  //     arrClone.push(obj);
  //     setVerifyEmail({
  //       isVisible: false,
  //       listEmailOld: arrClone,
  //       emailShow: '',
  //     });
  //     Keyboard.dismiss();
  //     handleSubmit();
  //   };

  //   //render
  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        style={{
          backgroundColor: colors.white,
        }}
        activeColor={colors.primary}
        inactiveColor={colors.c667085}
        tabStyle={styles.tabStyle}
        indicatorStyle={styles.indicatorStyle}
        renderLabel={({ route, focused, color }: any) => {
          // console.log("🚀 ~ renderTabBar ~ route:", route.title)
          const labelColor = focused ? colors.primary : colors.c667085;
          return (
            <CText
              h5
              style={{
                color: labelColor,
              }}
            >
              {route.title}
            </CText>
          );
        }}
      />
    );
  };

  const renderScene = ({ route, jumpTo }: any) => {
    return null;
    //   switch (route.key) {
    //     case 'MyInformation':
    //       return (
    //         <MyInformation
    //           userInfo={myInfo}
    //           updateInfo={updateMyInfo}
    //           onChangeAvatar={handlePresentModalPress}
    //           onTouchCountry={handleTouchCountry}
    //           onTouchGender={() => setShowModalGender(true)}
    //           onTouchBirthday={() => setShowModalBirthday(true)}
    //           updateSocialLink={handleUpdateInfoLinks}
    //           addNewLink={handleAddNewLink}
    //           removeLink={handleRemoveLink}
    //           errAPI={errAPI}
    //           user={user}
    //           socials={socials}
    //           showKYCInfo={handleShowKYCInfo}
    //           errEmail={errEmail}
    //           setErrEmail={setErrEmail}
    //           isEditEmail={isEditEmail}
    //           requiredPhone={requiredPhone}
    //           setShowModalPhoneCode={setShowModalPhoneCode}
    //           phoneCode={phoneCode}
    //           errPhone={errPhone}
    //           setErrPhone={setErrPhone}
    //           requiredGender={requiredGender}
    //           requiredDob={requiredDob}
    //         />
    //       );
    //     case 'SpecialList':
    //       return (
    //         <SpecialList
    //           specializationArr={specializationArr}
    //           updateSpecialList={setSpecializationArr}
    //           specializationArrOld={specializationArrOld}
    //           isChangeSpecialization={isChangeSpecialization}
    //           onPressKycInfo={handleShowKYCInfo}
    //         />
    //       );
    //     case 'WorkInformation':
    //       return (
    //         <WorkInformation
    //           attachments={attachments}
    //           updateAttachments={handleUpdateAttachments}
    //           otherAttachments={otherAttachments}
    //           updateOtherAttachments={handleUpdateOtherAttachments}
    //           showModalCommon={handleShowModalCommon}
    //           position={position}
    //           showKYCInfo={handleShowKYCInfo}
    //           isChangeAttachments={isChangeAttachments}
    //         />
    //       );
    //     default:
    //       break;
    //   }
  };

  //   const renderBottomSheetModal = () => {
  //     return (
  //       <BottomSheetModalProvider>
  //         <BottomSheetModal
  //           onDismiss={() => bottomSheetModalRef.current?.close()}
  //           backdropComponent={props => (
  //             <BottomSheetBackdrop
  //               {...props}
  //               onPress={() => bottomSheetModalRef.current?.close()}
  //               appearsOnIndex={1}
  //             />
  //           )}
  //           ref={bottomSheetModalRef}
  //           index={1}
  //           snapPoints={snapPoints}
  //           onChange={handleSheetChanges}>
  //           <BottomSheetView style={screenStyles.pH24}>
  //             <CText h3 w600 color={colors.c101828} style={screenStyles.pV12}>
  //               {t('common.addAvatar', 'Add avatar')}
  //             </CText>
  //             <Pressable onPress={handleCamera}>
  //               <Row start style={screenStyles.pV12}>
  //                 <IconX
  //                   origin={ICON_TYPE.MATERIAL_ICONS}
  //                   name="camera-alt"
  //                   size={26}
  //                   color={colors.primary}
  //                 />
  //                 <CText h4 color={colors.c344054} style={screenStyles.mL10}>
  //                   {t('common.takePicture', 'Take picture')}
  //                 </CText>
  //               </Row>
  //             </Pressable>
  //             <Pressable onPress={handlePhoto}>
  //               <Row start style={screenStyles.pV12}>
  //                 <IconX
  //                   origin={ICON_TYPE.MATERIAL_COMMUNITY}
  //                   name="image-multiple"
  //                   size={26}
  //                   color={colors.primary}
  //                 />
  //                 <CText h4 color={colors.c344054} style={screenStyles.mL10}>
  //                   {t('common.chooseFromGallery', 'Choose from Gallery')}
  //                 </CText>
  //               </Row>
  //             </Pressable>
  //           </BottomSheetView>
  //         </BottomSheetModal>
  //       </BottomSheetModalProvider>
  //     );
  //   };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={goBack}
        title={t('profile.editProfile')}
        isBorderBottom
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: ScreenWidth }}
        lazy={true}
      />
      {/* {!firstRender && (
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{width: ScreenWidth}}
          lazy={true}
        />
      )}
      <CButton
        isBottom
        title={t('common.save')}
        onPress={handleSubmitEdit}
        isDisable={!activeBtn}
      />
      {renderBottomSheetModal()}
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
      {showAlert ? (
        <APILoading
          showAlert={showAlert}
          isLoadingAPI={isLoadingAPI}
          isSuccess={isSuccess}
          onConfirmPressed={handleConfirmButtonPress}
          title={t('onboarding.updateInfo')}
          message={
            isKYC
              ? t(
                  'profile.editProfileScreen.updateKYCMessage',
                  'Information has been updated. Please wait for our review',
                )
              : t('profile.editProfileScreen.updateSuccessTitle')
          }
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
      /> */}
      <Toast ref={toastEl} position={'center'} />
    </Wrapper>
  );
};

export default PartnerEditProfileScreen;
