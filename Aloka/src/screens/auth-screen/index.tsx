import { Wrapper } from '@/components';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Signin,
  ChooseAccountType,
  UserRegisterForm,
  ExpertRegisterForm,
  OnboardSuccess,
  AccountTypeItem,
} from './step';
import { AppContext } from '@/contexts';
import { OTP } from './step/components';
import { isValidDate } from '@/configs';
import { navigate } from '@/navigation/RootNavigation';
import { mainRoute } from '@/constants';
import moment from 'moment';

const AuthScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const { login, onCompleteAuth } = useContext(AppContext);

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountTypeItem | null>(null);
  const [onboardFromStep, setOnboardFromStep] = useState(0);
  const [createdUser, setCreatedUser] = useState<any>(null);

  //default
  const [dataLogin, setDataLogin] = useState({
    phoneNumber: '', //normal user: 0909995891, student user: 0909995892
    phoneCode: {
      value: '+84',
      label: 'Vietnam',
    },
    otpCode: '',
    useOnboard: {} as any,
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
    birthday: '',
    phoneNumber: '',
    email: '',
    interests: '',
    type: '',
    userChoose: {},
    requiredPhone: 0,
    requiredDob: 0,
    requiredGender: 0,
    requiredInterest: 0,
  });

  //ACTION
  const handleChangeStep = (idxChange: number) => {
    setStepIndex(idxChange);
  };

  const handleUpdateLoginData = (name: string, value: any) => {
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
      handleChangeStep(2);
    }
  };

  const handleGoOnboard = (user: any) => {
    setOnboardFromStep(1);
    setDataLogin({
      ...dataLogin,
      useOnboard: user,
      loginType: 'phone',
    });

    const { email, full_name, gender, dob } = user || {};

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

    handleChangeStep(2);
  };

  const handleSelectUserType = (item: AccountTypeItem) => {
    setSelectedAccountType(item);
    handleChangeStep(3);
  };

  const handleSelectExpertType = (item: AccountTypeItem) => {
    setSelectedAccountType(item);
    handleChangeStep(4);
  };

  const handleRegisterSuccess = (user: any) => {
    setCreatedUser(user);
    handleChangeStep(5);
  };

  const handleBookNow = () => {
    if (createdUser) {
      login(createdUser);
    }
    hideModal();
    setTimeout(() => {
      navigate(mainRoute.searchService as any);
    }, 350);
  };

  const handleGoHome = () => {
    if (createdUser) {
      login(createdUser);
    }
    hideModal();
  };

  const handleGoToLogin = () => {
    setOnboardFromStep(0);
    handleChangeStep(0);
    setDataLogin({
      phoneNumber: '',
      phoneCode: {
        value: '+84',
        label: 'Vietnam',
      },
      otpCode: '',
      useOnboard: {},
      loginType: 'phone',
      requiredPhone: 0,
    });
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
            onRegister={() => {
              setDataLogin({
                ...dataLogin,
                loginType: 'email',
                phoneNumber: '',
                useOnboard: {},
              });
              setOnboardFromStep(0);
              handleChangeStep(2);
            }}
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
      case 2:
        return (
          <ChooseAccountType
            goBack={() => {
              handleChangeStep(onboardFromStep);
            }}
            onSelectUser={handleSelectUserType}
            onSelectExpert={handleSelectExpertType}
            selectedItem={selectedAccountType}
          />
        );
      case 3:
        return (
          <UserRegisterForm
            goBack={() => handleChangeStep(2)}
            goToLogin={handleGoToLogin}
            onSuccess={handleRegisterSuccess}
            dataLogin={dataLogin}
            accountType={selectedAccountType}
          />
        );
      case 4:
        return (
          <ExpertRegisterForm
            goBack={() => handleChangeStep(2)}
            goToLogin={handleGoToLogin}
            onSuccess={handleRegisterSuccess}
            dataLogin={dataLogin}
            accountType={selectedAccountType}
          />
        );
      case 5:
        return (
          <OnboardSuccess
            onBookNow={handleBookNow}
            onGoHome={handleGoHome}
          />
        );
      default:
        break;
    }
  };

  return <Wrapper>{renderStep()}</Wrapper>;
};

export default AuthScreen;
