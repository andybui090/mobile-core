import { Wrapper } from '@/components';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Signin } from './step';
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
    phoneNumber: '', //normal user: 0909995891, student user: 0909995892
    phoneCode: {
      value: '+84',
      label: 'Vietnam',
    },
    otpCode: '',
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
    onCompleteAuth();
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
    // setDataDoctorInfo({
    //   ...dataDoctorInfo,
    //   email: '',
    //   fullName: '',
    // });
    // setDataStudentInfo({
    //   ...dataStudentInfo,
    //   email: '',
    //   fullName: '',
    // });
    // setDataNurseInfo({
    //   ...dataNurseInfo,
    //   email: '',
    //   fullName: '',
    // });
    setStepIndex(1);
  };

  const handleNextSocial = (result: any, socialLoginType: string) => {
    const { email, username, full_name } = result;
    if (username) {
      login(result);
      hideModal();
    } else {
      setDataLogin({
        ...dataLogin,
        useOnboard: result,
        loginType: socialLoginType,
      });
      // setDataBasicInfo({
      //   ...dataBasicInfo,
      //   email: email || '',
      //   fullName: full_name ? full_name.trim() : '',
      // });
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
      // setDataNurseInfo({
      //   ...dataNurseInfo,
      //   email: email || '',
      //   fullName: full_name ? full_name.trim() : '',
      // });
      handleChangeStep(2);
    }
  };

  const handleGoOnboard = (user: any) => {
    setDataLogin({
      ...dataLogin,
      useOnboard: user,
      loginType: 'phone',
    });

    const {email, full_name, gender, dob} = user;

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

    // setDataDoctorInfo({
    //   ...dataDoctorInfo,
    //   email: email ?? '',
    //   fullName: full_name ?? '',
    //   gender: {
    //     value: gender ?? '',
    //     name: gender ? t(`gender.${gender?.toLowerCase()}`) : '',
    //     label: gender ?? '',
    //   },
    //   birthday: isValidDate(dob) ? moment(dob).format('DD/MM/YYYY') : '',
    // });

    // setDataStudentInfo({
    //   ...dataStudentInfo,
    //   email: email ?? '',
    //   fullName: full_name ?? '',
    //   gender: {
    //     value: gender ?? '',
    //     name: gender ? t(`gender.${gender?.toLowerCase()}`) : '',
    //     label: gender ?? '',
    //   },
    //   birthday: isValidDate(dob) ? moment(dob).format('DD/MM/YYYY') : '',
    // });
    // setDataNurseInfo({
    //   ...dataNurseInfo,
    //   email: email ?? '',
    //   fullName: full_name ?? '',
    //   gender: {
    //     value: gender ?? '',
    //     name: gender ? t(`gender.${gender?.toLowerCase()}`) : '',
    //     label: gender ?? '',
    //   },
    //   birthday: isValidDate(dob) ? moment(dob).format('DD/MM/YYYY') : '',
    // });
    handleChangeStep(2);
  };

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return (
          <Signin
            closeModal={hideModal}
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
            closeModal={hideModal}
            gotoOnboard={handleGoOnboard}
          />
        );
      default:
        break;
    }
  };
  return <Wrapper>{renderStep()}</Wrapper>;
};

export default AuthScreen;
