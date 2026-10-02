import { CInput, CInputTouch, IconType, IconX, ImageHelper, Toast } from '@/components';
import { images, isEmptyArray, isIOS, screenStyles, showToast } from '@/configs';
import { getCountries } from '@/redux/slices/globalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CScrollView, CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { isArray } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Keyboard, KeyboardAvoidingView, Pressable, TouchableOpacity, View } from 'react-native';
import { ModalPhoneCode } from '../../components';

const useStyles = makeStyles(({ colors }) => ({
  avatarWrap: {
    ...screenStyles.pV16,
    ...screenStyles.centerWrap,
  },
  avatar: {
    ...screenStyles.round64,
    backgroundColor: colors.cEAECF0,
    ...screenStyles.centerWrap,
  },
}));

export const Info = ({
  dataLogin,
  dataNurseInfo,
  avatarPrefix,
  changeAvatar,
  updateNurseInfo,
  onTouchCountry,
  onTouchGender,
  onTouchBirthday,
  // updateNurseInfoLinks,
  // addNewLink,
  // removeLink,
  errAPI,
  setPassStep,
  updateLoginData,
  callBackValid,
  isHasRequestAPI,
  phoneErrVerify,
  setPhoneErrVerify,
  emailErrVerify,
  setEmailErrVerify,
}: any) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  const scrollRef = useRef<any>(null);

  const fullNameEl = useRef<any>(null);
  const [errFullName, setErrFullName] = useState<string>('');

  const countryEl = useRef<any>(null);
  const [errCountry, setErrCountry] = useState<string>('');

  const genderEl = useRef<any>(null);
  const [errGender, setErrGender] = useState('');

  const birthdayEl = useRef<any>(null);
  const [errDob, setErrDob] = useState('');

  const phoneEl = useRef(null);
  const [errPhone, setErrPhone] = useState('');

  const emailEl = useRef<any>(null);
  const [errEmail, setErrEmail] = useState('');

  const cccdEl = useRef<any>(null);
  const [errCCCD, setErrCCCD] = useState('');

  // const descriptionEl = useRef<any>(null);
  const [errDescription, setErrDescription] = useState('');

  // const fbEl = useRef<any>(null);
  // const youtubeEl = useRef<any>(null);
  // const tiktokEl = useRef<any>(null);
  // const websiteEl = useRef<any>(null);

  const [isPostEmail, setIsPostEmail] = useState(true);
  const [showModalPhoneCode, setShowModalPhoneCode] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { countryList } = useAppSelector(state => state.globalReducer);

  const toastEl = useRef(null);

  //autofill country
  const checkAutoFillCountry = (arrCountry: any) => {
    if (dataLogin.phoneCode?.value) {
      let phoneParse: string = dataLogin.phoneCode.value;
      phoneParse = phoneParse.slice(1, phoneParse.length);
      // console.log("🚀 ~ checkAutoFillCountry ~ phoneParse:", phoneParse);
      for (let i = 0; i < arrCountry.length; i++) {
        if (arrCountry[i].phone_code == phoneParse) {
          updateNurseInfo('country', arrCountry[i]);
          break;
        }
      }
    }
  };

  useEffect(() => {
    dispatch(getCountries(null));
  }, []);

  useEffect(() => {
    const processCountryAPI = async () => {
      const { loading, data, error } = countryList;
      if (!loading) {
        if (isArray(data?.items)) {
          checkAutoFillCountry(data?.items);
        } else if (error) {
        }
      }
    };
    processCountryAPI();
  }, [countryList]);

  useEffect(() => {
    const checkEditEmail = () => {
      // console.log("🚀 ~ checkEditEmail ~ dataLogin.loginType:", dataLogin.loginType)
      if (dataLogin.loginType != 'phone') {
        if (dataNurseInfo.email != '') {
          setIsPostEmail(false);
        }
      }
    };
    checkEditEmail();
  }, [dataLogin.loginType]);

  //effect
  useEffect(() => {
    const detectErrAPI = () => {
      // {"errors": [{"key": "email", "msg": "This field is required"},
      // {"key": "medicalId", "msg": "This field is required"},
      // {"key": "username", "msg": "The field is between 5 and 50"},
      // {"key": "dob", "msg": "Age must be minimum of 17 years"},
      // {"key": "description", "msg": "This field is required"},
      // {"key": "occupationId", "msg": "This field is required"},
      // {"key": "experiences", "msg": "This field is required"}], "problem": "Client error", "status": 400}
      if (errAPI.errors) {
        console.log('🚀 ~ file: Info.tsx:93 ~ detectErrAPI ~ errAPI:', errAPI);
        const { errors } = errAPI;
        let valid = true;
        if (!isEmptyArray(errors)) {
          for (let i = 0; i < errors.length; i++) {
            let item = errors[i];
            if (item.key) {
              switch (item.key) {
                case 'fullName':
                  setErrFullName(item.msg || 'please check again!');
                  valid = false;
                  break;
                case 'gender':
                  setErrGender(item.msg || 'please check again!');
                  valid = false;
                  break;
                case 'dob':
                  setErrDob(item.msg || 'please check again!');
                  valid = false;
                  break;
                case 'email':
                  setErrEmail(item.msg || 'please check again!');
                  valid = false;
                  break;
                case 'description':
                  setErrDescription(item.msg || 'please check again!');
                  valid = false;
                  break;
                case 'identification':
                  setErrCCCD(item.msg || 'please check again!');
                  valid = false;
                  break;
                case 'phone':
                  setErrPhone(item.msg || 'please check again!');
                  valid = false;
                  break;
                default:
                  if (item.key.includes('link')) {
                    showToast(toastEl, t('onboarding.links') + ' ' + item.msg, 1500);
                    valid = false;
                  }
                  break;
              }
            }
          }
        }
        callBackValid(valid);
      }
    };
    if (isHasRequestAPI) {
      detectErrAPI();
    }
   
  }, [errAPI]);

  useEffect(() => {
    if (phoneErrVerify != '') {
      setErrPhone(phoneErrVerify);
      setPhoneErrVerify('');
    }
  }, [phoneErrVerify]);

  useEffect(() => {
    if (emailErrVerify != '') {
      setErrEmail(emailErrVerify);
      setEmailErrVerify('');
    }
  }, [emailErrVerify]);
  
  //Action
  const resetValid = () => {
    setPassStep(false);
  };

  // const handleChangeUserName = (value: string) => {
  //   setErrUserName('');
  //   updateNurseInfo('userName', value);
  //   resetValid();
  // };

  const handleChangeFullName = (value: string) => {
    setErrFullName('');
    updateNurseInfo('fullName', value);
    resetValid();
  };

  // const handleChangeChannelName = (value: string) => {
  //   setErrChanelName('');
  //   updateNurseInfo('channelName', value);
  //   resetValid();
  // };

  const handleUpdateCountry = () => {
    setErrCountry('');
    onTouchCountry();
    resetValid();
  };

  const handleTouchGender = () => {
    setErrGender('');
    onTouchGender();
    resetValid();
  };

  const handleTouchBirthday = () => {
    setErrDob('');
    onTouchBirthday(true);
    resetValid();
  };

  const handleChangePhoneNumber = (value: string) => {
    setErrPhone('');
    updateNurseInfo('phoneNumber', value);
    resetValid();
  };

  const handleChangeEmail = (value: string) => {
    setErrEmail('');
    updateNurseInfo('email', value);
    resetValid();
  };

  // const handleCCCD = (value: string) => {
  //   setErrCCCD('');
  //   updateNurseInfo('cccd', value);
  //   resetValid();
  // };

  // const handleChangeDescription = (value: string) => {
  //   setErrDescription('');
  //   updateNurseInfo('description', value);
  //   resetValid();
  // };

  // const handleChangeLink = (index: number, value: string) => {
  //   updateNurseInfoLinks(index, value);
  //   resetValid();
  // };

  // const handleAddNewLink = () => {
  //   addNewLink();
  //   setTimeout(() => {
  //     scrollRef.current?.scrollToEnd({ animated: true });
  //   }, 300);
  //   resetValid();
  // };

  // const handleRemoveLink = (index: number) => {
  //   removeLink(index);
  //   resetValid();
  // };

  const handleChangeCountryCode = () => {
    setShowModalPhoneCode(true);
  };

  const handleUpdatePhoneCode = (phoneCodeChoose: any) => {
    updateLoginData('phoneCode', phoneCodeChoose);
    setErrPhone('');
    setShowModalPhoneCode(false);
  };

  //Render
  const renderAvatar = () => {
    const { avatar } = dataNurseInfo;
    return (
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          {avatar !== '' ? (
            <ImageHelper source={{ uri: avatarPrefix + avatar }} />
          ) : (
            <Image source={images.global.no_avatar} style={screenStyles.box40} resizeMode="contain" />
          )}
        </View>
        <Pressable onPress={changeAvatar}>
          <CText h5 color={colors.primary} style={screenStyles.mT10}>
            {t('onboarding.addProfilePicture')}
          </CText>
        </Pressable>
      </View>
    );
  };

  const handleUpdateCountryOnSubmit = () => {
    if (dataNurseInfo.country.name == '') {
      setErrCountry('');
      onTouchCountry();
      resetValid();
    } else {
      Keyboard.dismiss();
    }
  };

  const renderFullName = () => {
    return (
      <CInput
        isRequire
        refChild={fullNameEl}
        value={dataNurseInfo.fullName}
        onChange={handleChangeFullName}
        errorText={errFullName}
        label={t('profile.editProfileScreen.fullName')}
        placeHolder={t('profile.editProfileScreen.fullName')}
        returnKeyType={'next'}
        autoCapitalize={'words'}
        onSubmitEditing={handleUpdateCountryOnSubmit}
        maxLength={100}
      />
    );
  };

  const renderCountry = () => {
    return (
      <CInputTouch
        refChild={countryEl}
        isRequire
        label={t('onboarding.country')}
        placeHolder={t('onboarding.selectCountry')}
        name={'country'}
        value={dataNurseInfo.country.name}
        onTouch={handleUpdateCountry}
        errorText={errCountry}
      />
    );
  };

  const renderGender = () => {
    return (
      <CInputTouch
        refChild={genderEl}
        isRequire={dataNurseInfo.requiredGender == 1}
        label={t('onboarding.gender')}
        placeHolder={t('onboarding.selectGender')}
        name={'gender'}
        onTouch={handleTouchGender}
        value={dataNurseInfo.gender.name}
        errorText={errGender}
      />
    );
  };

  const renderBirthday = () => {
    return (
      <CInputTouch
        refChild={birthdayEl}
        isRequire={dataNurseInfo.requiredDob == 1}
        label={t('onboarding.birthday')}
        placeHolder={`${t('onboarding.birthday')}`}
        name={'birthday'}
        onTouch={handleTouchBirthday}
        value={dataNurseInfo.birthday}
        rightIcon={<IconX type={IconType.OCTICONS} name={'calendar'} size={16} color={colors.c667085} />}
        errorText={errDob}
      />
    );
  };

  const renderPhone = () => {
    const phoneValue = dataNurseInfo.phoneNumber || dataLogin.phoneCode.value + dataLogin.phoneNumber;
    return (
      <CInput
        refChild={phoneEl}
        value={phoneValue}
        onChange={handleChangePhoneNumber}
        errorText={errPhone}
        label={t('onboarding.phone')}
        placeHolder={t('onboarding.phone')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={20}
        isRequire={dataNurseInfo.requiredPhone == 1}
        editable={false}
      />
    );
  };

  const renderPhoneSocial = () => {
    return (
      <CInput
        refChild={phoneEl}
        value={dataNurseInfo.phoneNumber}
        onChange={handleChangePhoneNumber}
        errorText={errPhone}
        label={t('onboarding.phone')}
        placeHolder={t('onboarding.phone')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={20}
        isRequire={dataNurseInfo.requiredPhone == 1}
        leftIcon={
          <TouchableOpacity onPress={handleChangeCountryCode} style={screenStyles.rowCenter}>
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
          </TouchableOpacity>
        }
        onSubmitEditing={() => Keyboard.dismiss()}
      />
    );
        
  };

  const renderEmail = () => {
    return (
      <CInput
        refChild={emailEl}
        value={dataNurseInfo.email}
        onChange={handleChangeEmail}
        errorText={errEmail}
        label={t('onboarding.email')}
        placeHolder={t('onboarding.email')}
        returnKeyType={'next'}
        maxLength={128}
        autoCapitalize={'none'}
        noSpace
        editable={isPostEmail}
        onSubmitEditing={() => cccdEl.current?.focus()}
      />
    );
  };

  // const renderIdentifier = () => {
  //   return (
  //     <CInput
  //       refChild={cccdEl}
  //       isRequire={false}
  //       value={dataNurseInfo.cccd}
  //       onChange={handleCCCD}
  //       errorText={errCCCD}
  //       label={t('onboarding.cccd')}
  //       placeHolder={t('onboarding.cccd')}
  //       returnKeyType={isIOS ? 'done' : 'next'}
  //       keyboardType={'numeric'}
  //       maxLength={32}
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //     />
  //   );
  // };

  // const renderDescription = () => {
  //   return (
  //     <CAreaContent
  //       refChild={descriptionEl}
  //       value={dataNurseInfo.description}
  //       onChange={handleChangeDescription}
  //       errorText={errDescription}
  //       label={t('onboarding.description')}
  //       placeHolder={t('onboarding.descriptionPlaceHolder')}
  //       onFocus={() => {
  //         if (isIOS) {
  //           scrollRef.current?.scrollToEnd({ animated: true });
  //         }
  //       }}
  //     />
  //   );
  // };

  // const renderLinkFB = () => {
  //   return (
  //     <CInput
  //       refChild={fbEl}
  //       value={dataNurseInfo.links[0].link}
  //       onChange={value => handleChangeLink(0, value)}
  //       errorText={''}
  //       label={t('onboarding.links')}
  //       placeHolder={'Facebook'}
  //       returnKeyType={'next'}
  //       leftIcon={<Image source={images.auth.ico_fb} style={screenStyles.box16} />}
  //       noSpace
  //       autoCapitalize={'none'}
  //       maxLength={100}
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //     />
  //   );
  // };

  // const renderYoutubeLink = () => {
  //   return (
  //     <CInput
  //       refChild={youtubeEl}
  //       value={dataNurseInfo.links[1].link}
  //       onChange={value => handleChangeLink(1, value)}
  //       errorText={''}
  //       placeHolder={'Youtube'}
  //       returnKeyType={'next'}
  //       leftIcon={<Image source={images.auth.ico_youtube} style={screenStyles.box16} />}
  //       noSpace
  //       autoCapitalize={'none'}
  //       maxLength={100}
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //     />
  //   );
  // };

  // const renderTiktokLink = () => {
  //   return (
  //     <CInput
  //       refChild={tiktokEl}
  //       value={dataNurseInfo.links[2].link}
  //       onChange={value => handleChangeLink(2, value)}
  //       errorText={''}
  //       placeHolder={'Tiktok'}
  //       returnKeyType={'next'}
  //       leftIcon={<Image source={images.auth.ico_tiktok} style={screenStyles.box16} />}
  //       noSpace
  //       autoCapitalize={'none'}
  //       maxLength={100}
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //     />
  //   );
  // };

  // const renderWebsiteLink = () => {
  //   return (
  //     <CInput
  //       refChild={websiteEl}
  //       value={dataNurseInfo.links[3].link}
  //       onChange={value => handleChangeLink(3, value)}
  //       errorText={''}
  //       placeHolder={'Website'}
  //       returnKeyType={'next'}
  //       leftIcon={<Image source={images.auth.ico_website} style={screenStyles.box16} />}
  //       noSpace
  //       autoCapitalize={'none'}
  //       maxLength={100}
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //     />
  //   );
  // };

  // const renderAddCustomLink = () => {
  //   return (
  //     <Pressable style={[screenStyles.pV10, screenStyles.rowStart]} onPress={handleAddNewLink}>
  //       <IconX type={IconType.IONICONS} name="add" color={colors.primary} size={20} />
  //       <CText h5 color={colors.primary} style={screenStyles.mL5}>
  //         {t('onboarding.addLink')}
  //       </CText>
  //     </Pressable>
  //   );
  // };

  // const renderItemLink = (index: number) => {
  //   return (
  //     <CInput
  //       key={index}
  //       value={dataNurseInfo.links[index].link}
  //       onChange={value => handleChangeLink(index, value)}
  //       errorText={''}
  //       placeHolder={'Custom link'}
  //       returnKeyType={'next'}
  //       leftIcon={<Image source={images.auth.ico_link} style={screenStyles.box16} />}
  //       noSpace
  //       autoCapitalize={'none'}
  //       rightIconCustom={
  //         <Pressable
  //           onPress={() => handleRemoveLink(index)}
  //           style={{ marginLeft: 10, marginTop: 3 }}
  //           hitSlop={screenStyles.hitSlop20}>
  //           <Image source={images.auth.ico_trash} style={screenStyles.box20} />
  //         </Pressable>
  //       }
  //       maxLength={100}
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //     />
  //   );
  // };

  // const renderCustomLink = () => {
  //   const { links } = dataNurseInfo;
  //   let result = [];
  //   for (let i = 4; i < links.length; i++) {
  //     result.push(renderItemLink(i));
  //   }
  //   return result;
  // };

  // const renderSocials = () => {
  //   return (
  //     <View style={screenStyles.mT8}>
  //       {renderLinkFB()}
  //       {renderYoutubeLink()}
  //       {renderTiktokLink()}
  //       {renderWebsiteLink()}
  //     </View>
  //   );
  // };

  return (
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : undefined} style={screenStyles.flex1}>
      <CScrollView innerRef={scrollRef} style={screenStyles.pH24} contentContainerStyle={screenStyles.flexGrow1}>
        {renderAvatar()}
        {renderFullName()}
        {renderCountry()}
        {renderGender()}
        {renderBirthday()}
        {dataLogin.loginType == 'phone' ? renderPhone() : renderPhoneSocial()}
        {renderEmail()}
        {/* {renderIdentifier()} */}
        {/* {renderDescription()} */}
        {/* <View style={{ height: 8 }} />
        {renderSocials()}
        {renderCustomLink()}
        {renderAddCustomLink()} */}
      </CScrollView>
      {showModalPhoneCode && (
        <ModalPhoneCode
          isVisible={showModalPhoneCode}
          hideModal={() => setShowModalPhoneCode(false)}
          choosePhoneCode={handleUpdatePhoneCode}
          phoneCodeChoose={dataLogin.phoneCode}
        />
      )}
      <Toast ref={toastEl} position="center" />
    </KeyboardAvoidingView>
  );
};
