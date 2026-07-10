import { Wrapper } from '@/components';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Signin } from './step';
import { AppContext } from '@/contexts';

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
    // setDataBasicInfo({
    //   ...dataBasicInfo,
    //   email: '',
    //   fullName: '',
    // });
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
  };

  const handleNextSocial = (result: any, socialLoginType: string) => {
    const { email, username, full_name } = result;
    if (username) {
      login(result);
      //   GALogEvent(GAEvents.LOGIN, {method: 'App Login'});
      //   hideModal();
      // } else {
      //   GALogEvent(GAEvents.REGISTRATION_STARTED, {
      //     method: 'App register started',
      //   });
      //   setDataLogin({
      //     ...dataLogin,
      //     useOnboard: result,
      //     loginType: socialLoginType,
      //   });
      //   setDataBasicInfo({
      //     ...dataBasicInfo,
      //     email: email || '',
      //     fullName: full_name ? full_name.trim() : '',
      //   });
      //   setDataDoctorInfo({
      //     ...dataDoctorInfo,
      //     email: email || '',
      //     fullName: full_name ? full_name.trim() : '',
      //   });
      //   setDataStudentInfo({
      //     ...dataStudentInfo,
      //     email: email || '',
      //     fullName: full_name ? full_name.trim() : '',
      //   });
      //   setDataNurseInfo({
      //     ...dataNurseInfo,
      //     email: email || '',
      //     fullName: full_name ? full_name.trim() : '',
      //   });
      handleChangeStep(2);
    }
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
      default:
        break;
    }
  };
  return <Wrapper>{renderStep()}</Wrapper>;
};

export default AuthScreen;
