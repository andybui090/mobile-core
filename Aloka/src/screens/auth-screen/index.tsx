import { Wrapper } from '@/components';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicInfo, Complete, Onboard, Signin, NurseInfo } from './step';
import { AppContext } from '@/contexts';
import { OTP } from './step/components';
import { isValidDate } from '@/configs';
import moment from 'moment';

const AuthScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const { login, onCompleteAuth } = useContext(AppContext);

  const [stepIndex, setStepIndex] = useState(0);

  //default
  const [dataLogin, setDataLogin] = useState({
    phoneNumber: '0909995896', //normal user: 0909995891, student user: 0909995892
    phoneCode: {
      value: '+84',
      label: 'Vietnam',
    },
    otpCode: '123456',
    useOnboard: {},
    loginType: 'phone',
    requiredPhone: 0, // 1 là bắt buộc, nếu là 0 thì bỏ required đi
  });

  const [dataBasicInfo, setDataBasicInfo] = useState({
    avatar: '',
    userName: '',
    fullName: '',
    country: {
      id: -1,
      name: '',
    },
    gender: { value: '', name: '', label: '' },
    // country:{"id": 243, "name": "Vietnam"},
    // gender: {value: 'Male', name: 'Male', label: 'Male'},
    birthday: '', //"2011-11-10"
    phoneNumber: '',
    email: '',
    interests: '',
    type: '', //loai nguoi dung dang ky  normal, doctor
    userChoose: {}, //loai nguoi dung dang ky,
    requiredPhone: 0, // 1 là bắt buộc, nếu là 0 thì bỏ required đi
    requiredDob: 0,
    requiredGender: 0,
    requiredInterest: 0,
    //Bo sung them dia chi sinh song
    bookingAddress: { text: '', lat: 0, lng: 0, placeId: '' },
  });

  const [dataNurseInfo, setDataNurseInfo] = useState({
    avatar: '',
    userName: '', //AndyBui
    fullName: '', //AndyBui11
    channelName: '',
    country: {
      id: -1,
      name: '',
    }, // {"id": 243, "name": "Vietnam"}
    gender: { value: '', name: '', label: '' }, //{value: 'Male', name: 'Male', label: 'Male'},
    birthday: '', //"26/06/1990
    phoneNumber: '', //+84909995896
    email: '',
    cccd: '', //080090002238
    description: '',
    links: [
      { key: 0, link: '' }, //fb
      { key: 1, link: '' }, //youtube
      { key: 2, link: '' }, //tiktok
      { key: 3, link: '' }, //website
    ],
    specializationArr: [], //map khi submit
    specializationIds: '',
    attachments: [],
    arrAttachments: [], //tai lieu bo sung
    awardId: -1, //danh hieu
    academicId: -1, //hoc ham
    degreeId: -1, //hoc vi
    occupationId: -1, //nghe nghiep
    interests: '',
    type: '',
    userChoose: {},
    requiredPhone: 0, // 1 là bắt buộc, nếu là 0 thì bỏ required đi
    requiredDob: 0,
    requiredGender: 0,
    //bo sung cho aloka
    workplace: '',
    experience: '', // thuc chat no la truong mo ta them ve kinh nghiem lam viec cua nguoi dung
    bookingAddress: { text: '', lat: 0, lng: 0, placeId: '' },
    serviceRadius:{ value: -1, label: '' }, //ban kinh san sang di chuyen phuc vu
  });

  //ACTION
  const handleChangeStep = (idxChange: number) => {
    setStepIndex(idxChange);
  };

  const handleUpdateLoginData = (name: string, value: string) => {
    setDataLogin({
      ...dataLogin,
      [name]: value,
    });
  };

  const hideModal = () => {
    // onCompleteAuth();
  };

  const handleNextPhone = () => {
    setStepIndex(1);
    setDataLogin({
      ...dataLogin,
      loginType: 'phone',
    });
    setDataBasicInfo({
      ...dataBasicInfo,
      email: '',
      fullName: '',
    });
    setStepIndex(1);
  };

  const handleNextSocial = (result: any, socialLoginType: string) => {
    const { email, username, full_name } = result;
    if (username) {
      login(result);
      // hideModal();
    } else {
      setDataLogin({
        ...dataLogin,
        useOnboard: result,
        loginType: socialLoginType,
      });
      setDataBasicInfo({
        ...dataBasicInfo,
        email: email || '',
        fullName: full_name ? full_name.trim() : '',
      });
      // setDataDoctorInfo({
      //   ...dataDoctorInfo,
      //   email: email || '',
      //   fullName: full_name ? full_name.trim() : '',
      // });
      // setDataStudentInfo({
      //   ...dataStudentInfo,
      //   email: email || '',
      //   fullName: full_name ? full_name.trim() : '',
      // });
      setDataNurseInfo({
        ...dataNurseInfo,
        email: email || '',
        fullName: full_name ? full_name.trim() : '',
      });
      handleChangeStep(2);
    }
  };

  const handleGoOnboard = (user: any) => {
    setDataLogin({
      ...dataLogin,
      useOnboard: user,
      loginType: 'phone',
    });

    const { email, full_name, gender, dob } = user;

    setDataBasicInfo({
      ...dataBasicInfo,
      email: email ?? '',
      fullName: full_name ?? '',
      gender: {
        value: gender ?? '',
        name: gender ? t(`gender.${gender?.toLowerCase()}`) : '',
        label: gender ?? '',
      },
      birthday: isValidDate(dob) ? moment(dob).format('DD/MM/YYYY') : '',
    });

    setDataNurseInfo({
      ...dataNurseInfo,
      email: email ?? '',
      fullName: full_name ?? '',
      gender: {
        value: gender ?? '',
        name: gender ? t(`gender.${gender?.toLowerCase()}`) : '',
        label: gender ?? '',
      },
      birthday: isValidDate(dob) ? moment(dob).format('DD/MM/YYYY') : '',
    });
    handleChangeStep(2);
  };

  const handleGoUser = (itemChoose: any) => {
    handleChangeStep(3);
    setDataBasicInfo({
      ...dataBasicInfo,
      type: itemChoose.code || 'User',
      userChoose: itemChoose,
    });
  };

  const handleGoNurse = (itemChoose: any) => {
    setDataNurseInfo({
      ...dataNurseInfo,
      type: itemChoose.code || 'Nurse',
      userChoose: itemChoose,
    });
    handleChangeStep(4);
  };

  const handleUpdateDataBasicInfo = (name: string, value: string) => {
    setDataBasicInfo({
      ...dataBasicInfo,
      [name]: value,
    });
  };

  const handleUpdateDataNurseInfo = (name: string, value: string) => {
    setDataNurseInfo({
      ...dataNurseInfo,
      [name]: value,
    });
  };

  // const handleUpdateDataNurseInfoLinks = (key: number, value: string) => {
  //   let objClone = { ...dataNurseInfo };
  //   objClone.links[key].link = value;
  //   setDataNurseInfo(objClone);
  // };

  // const handleAddNewLinkNurse = () => {
  //   let objClone = { ...dataNurseInfo };
  //   objClone.links.push(
  //     { key: objClone.links.length, link: '' }, //fb
  //   );
  //   setDataNurseInfo(objClone);
  // };

  // const handleRemoveLinkNurse = (index: number) => {
  //   let objClone = { ...dataNurseInfo };
  //   objClone.links.splice(index, 1);
  //   setDataNurseInfo(objClone);
  // };

  const handleAddNewDocNurse = () => {
    let objClone = { ...dataNurseInfo };
    objClone.arrAttachments.push({
      fileUri: '',
      fileName: '',
      fileSize: 0,
      fileType: '',
    } as never);
    setDataNurseInfo(objClone);
  };

  const handleRemoveNewDocNurse = (index: number) => {
    let arrClone = [...dataNurseInfo.arrAttachments];
    arrClone.splice(index, 1);
    setDataNurseInfo({
      ...dataNurseInfo,
      arrAttachments: arrClone,
    });
  };

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return (
          <Signin
            // closeModal={hideModal}
            dataLogin={dataLogin}
            updateLoginData={handleUpdateLoginData}
            onNext={handleNextPhone}
            onNextSocial={handleNextSocial}
          />
        );
      case 1:
        return (
          <OTP
            dataLogin={dataLogin}
            goBack={() => {
              handleChangeStep(0);
              handleUpdateLoginData('otpCode', '');
            }}
            updateLoginData={handleUpdateLoginData}
            // closeModal={hideModal}
            gotoOnboard={handleGoOnboard}
          />
        );
      case 2:
        return (
          <Onboard
            goBack={() => handleChangeStep(0)}
            gotoUpdateBasicInfo={handleGoUser}
            gotoUpdateNurseInfo={handleGoNurse}
            // gotoUpdateDoctorInfo={handleGoDoctor}
            // gotoUpdateStudentInfo={handleGoStudent}
            // gotoUpdateKolKocInfo={handleGoKolKoc}
          />
        );
      case 3:
        return (
          <BasicInfo
            dataLogin={dataLogin}
            dataBasicInfo={dataBasicInfo}
            updateBasicInfo={handleUpdateDataBasicInfo}
            goBack={() => handleChangeStep(2)}
            onNext={() => handleChangeStep(6)}
            updateLoginData={handleUpdateLoginData}
            setDataBasicInfo={setDataBasicInfo}
          />
        );
      case 4:
        return (
          <NurseInfo
            dataLogin={dataLogin}
            dataNurseInfo={dataNurseInfo}
            updateNurseInfo={handleUpdateDataNurseInfo}
            goBack={() => handleChangeStep(2)}
            onNext={() => handleChangeStep(6)}
            // updateNurseInfoLinks={handleUpdateDataNurseInfoLinks}
            // addNewLink={handleAddNewLinkNurse}
            // removeLink={handleRemoveLinkNurse}
            addNewDoc={handleAddNewDocNurse}
            removeNewDoc={handleRemoveNewDocNurse}
            updateLoginData={handleUpdateLoginData}
            setDataNurseInfo={setDataNurseInfo}
          />
        );
      case 6:
        return <Complete onComplete={onCompleteAuth} />;
      default:
        break;
    }
  };
  return <Wrapper>{renderStep()}</Wrapper>;
};

export default AuthScreen;
