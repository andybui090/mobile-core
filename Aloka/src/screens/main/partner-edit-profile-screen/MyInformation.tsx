import {
  CAreaContent,
  CInput,
  CInputTouch,
  IconType,
  IconX,
  ImageHelper,
  Toast,
} from '@/components';
import {
  images,
  isEmptyArray,
  isIOS,
  screenStyles,
  showToast,
} from '@/configs';
import { CScrollView, CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';

const MyInformation = ({
  userInfo,
  updateInfo,
  onChangeAvatar,
  onTouchCountry,
  onTouchGender,
  onTouchBirthday,
  // updateSocialLink,
  // addNewLink,
  // removeLink,
  errAPI,
  user,
  // socials,
  showKYCInfo,
  errEmail,
  setErrEmail,
  isEditEmail,
  requiredPhone,
  setShowModalPhoneCode,
  phoneCode,
  errPhone,
  setErrPhone,
  requiredGender,
  requiredDob,
}: any) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const userNameEl = useRef<any>(null);
  const [errUserName, setErrUserName] = useState('');

  const fullNameEl = useRef<any>(null);
  const [errFullName, setErrFullName] = useState('');

  const chanelNameEl = useRef<any>(null);
  const [errChanelName, setErrChanelName] = useState<string>('');

  const countryEl = useRef<any>(null);
  const [errCountry, setErrCountry] = useState<string>('');

  const phoneEl = useRef(null);
  // const [errPhone, setErrPhone] = useState('');

  const [errGender, setErrGender] = useState('');
  const [errDob, setErrDob] = useState('');

  const emailEl = useRef(null);
  // const [errEmail, setErrEmail] = useState('');

  // const cccdEl = useRef<any>(null);
  // const [errCCCD, setErrCCCD] = useState('');

  const descriptionEl = useRef<any>(null);
  const [errDescription, setErrDescription] = useState('');

  const scrollRef = useRef<any>(null);

  // const fbEl = useRef<any>(null);
  // const youtubeEl = useRef<any>(null);
  // const tiktokEl = useRef<any>(null);
  // const websiteEl = useRef<any>(null);

  const toastEl = useRef(null);

  //EFFECT
  useEffect(() => {
    const detectErrAPI = () => {
      if (errAPI) {
        const { errors } = errAPI;
        let valid = true;
        if (!isEmptyArray(errors)) {
          // console.log("====== ", errors);
          for (let i = 0; i < errors.length; i++) {
            let item = errors[i];
            if (item.key) {
              switch (item.key) {
                // case 'username':
                //   setErrUserName(item.msg || 'please check again!');
                //   valid = false;
                //   break;
                case 'fullName':
                  setErrFullName(item.msg || 'please check again!');
                  valid = false;
                  break;
                case 'channel_name':
                  setErrChanelName(item.msg || 'please check again!');
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
                // case 'description':
                //   setErrDescription(item.msg || 'please check again!');
                //   valid = false;
                //   break;
                // case 'identification':
                //   setErrCCCD(item.msg || 'please check again!');
                //   valid = false;
                  break;
                default:
                  // console.log('======= ', item.key.includes('link'));
                  // if (item.key.includes('link')) {
                  //   showToast(
                  //     toastEl,
                  //     t('onboarding.links') + ' ' + item.msg,
                  //     1500,
                  //   );
                  //   valid = false;
                  // } else {
                  // }
                  // showToast(toastEl, item.msg || 'please check again!');
                  break;
              }
            }
          }
        }
      }
    };
    detectErrAPI();
  }, [errAPI]);

  //ACTION
  const handleChangeUserName = (value: string) => {
    setErrUserName('');
    updateInfo('username', value);
  };

  const handleChangeFullName = (value: string) => {
    setErrFullName('');
    updateInfo('fullName', value);
  };

  const handleTouchGender = () => {
    setErrGender('');
    onTouchGender(true);
  };

  const handleTouchBirthday = () => {
    setErrDob('');
    onTouchBirthday(true);
  };

  const handleChangeEmail = (value: string) => {
    setErrEmail('');
    updateInfo('email', value);
  };

  // const handleCCCD = (value: string) => {
  //   setErrCCCD('');
  //   updateInfo('identification', value);
  // };

  // const handleChangeDescription = (value: string) => {
  //   setErrDescription('');
  //   updateInfo('description', value);
  // };

  // const handleChangeLink = (index: number, value: string) => {
  //   updateSocialLink(index, value);
  // };

  // const handleAddNewLink = () => {
  //   addNewLink();
  //   setTimeout(() => {
  //     scrollRef.current?.scrollToEnd({ animated: true });
  //   }, 300);
  // };

  // const handleRemoveLink = (index: number) => {
  //   removeLink(index);
  // };

  // const handleChangeChannelName = (value: string) => {
  //   setErrChanelName('');
  //   updateInfo('channelName', value);
  // };

  const handleChangePhoneNumber = (value: string) => {
    setErrPhone('');
    updateInfo('phone', value);
  };

  //RENDER
  const renderAvatar = () => {
    const { avatar, avatarPrefix } = userInfo;
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
        <Pressable onPress={onChangeAvatar}>
          <CText h5 color={colors.primary} style={screenStyles.mT10}>
            {t('onboarding.addProfilePicture')}
          </CText>
        </Pressable>
      </View>
    );
  };

  const renderUsername = () => {
    return (
      <CInput
        refChild={userNameEl}
        value={userInfo.username}
        onChange={handleChangeUserName}
        errorText={errUserName}
        label={t('onboarding.username')}
        placeHolder={t('onboarding.username')}
        returnKeyType={'next'}
        maxLength={50}
        isRequire
        onSubmitEditing={() => fullNameEl.current?.focus()}
        autoCapitalize={'none'}
      />
    );
  };

  const renderFullName = () => {
    const { isKYCFullName, fullName } = userInfo;
    return (
      <CInput
        refChild={fullNameEl}
        value={fullName}
        onChange={handleChangeFullName}
        errorText={errFullName}
        label={t('profile.editProfileScreen.fullName')}
        placeHolder={t('profile.editProfileScreen.fullName')}
        returnKeyType={'next'}
        autoCapitalize={'words'}
        maxLength={100}
        isRequire
        onSubmitEditing={() => chanelNameEl.current?.focus()}
        isKYC={isKYCFullName}
        onPressKycInfo={showKYCInfo}
      />
    );
  };

  // const handleUpdateCountryOnSubmit = () => {
  //   if (userInfo.country.name == '') {
  //     setErrCountry('');
  //     onTouchCountry();
  //   } else {
  //     Keyboard.dismiss();
  //   }
  // };

  // const rendeChanelName = () => {
  //   return (
  //     <CInput
  //       isRequire
  //       refChild={chanelNameEl}
  //       value={userInfo.channelName}
  //       onChange={handleChangeChannelName}
  //       errorText={errChanelName}
  //       label={t('profile.editProfileScreen.channelName', 'Channel Name')}
  //       placeHolder={t('profile.editProfileScreen.channelName', 'Channel Name')}
  //       returnKeyType={'next'}
  //       autoCapitalize={'words'}
  //       onSubmitEditing={handleUpdateCountryOnSubmit}
  //       maxLength={100}
  //     />
  //   );
  // };

  const renderCountry = () => {
    return (
      <CInputTouch
        label={t('onboarding.country')}
        placeHolder={t('onboarding.selectCountry')}
        isRequire
        name={'country'}
        onTouch={onTouchCountry}
        value={userInfo.country.name}
      />
    );
  };

  const renderGender = () => {
    let gender =
      userInfo.gender.name == user.gender
        ? t(`gender.${user.gender?.toLowerCase()}`)
        : userInfo.gender.name;
    return (
      <CInputTouch
        label={t('onboarding.gender')}
        placeHolder={t('onboarding.selectGender')}
        isRequire={requiredGender == 1}
        name={'gender'}
        onTouch={handleTouchGender}
        value={gender}
        errorText={errGender}
      />
    );
  };

  const renderBirthday = () => {
    const { isKYCDob, birthday } = userInfo;
    return (
      <CInputTouch
        label={t('onboarding.birthday')}
        placeHolder={`${t('onboarding.birthday')}`}
        isRequire={requiredDob == 1}
        name={'birthday'}
        onTouch={handleTouchBirthday}
        value={birthday}
        rightIcon={
          <IconX
            type={IconType.OCTICONS}
            name={'calendar'}
            size={16}
            color={colors.c667085}
          />
        }
        errorText={errDob}
        isKYC={isKYCDob}
        onPressKycInfo={showKYCInfo}
      />
    );
  };

  const renderPhone = () => {
    return (
      <CInput
        refChild={phoneEl}
        value={userInfo.phone}
        onChange={() => {}}
        errorText={errPhone}
        label={t('onboarding.phone')}
        placeHolder={t('onboarding.phone')}
        returnKeyType={isIOS ? 'done' : 'next'}
        keyboardType={'numeric'}
        maxLength={20}
        isRequire
        editable={false}
      />
    );
  };

  const renderPhoneSocial = () => {
    return (
      <CInput
        refChild={phoneEl}
        value={userInfo.phone}
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
        onSubmitEditing={() => Keyboard.dismiss()}
      />
    );
  };

  const renderEmail = () => {
    return (
      <CInput
        refChild={emailEl}
        value={userInfo.email}
        onChange={handleChangeEmail}
        errorText={errEmail}
        label={t('onboarding.email')}
        placeHolder={t('onboarding.email')}
        returnKeyType={'next'}
        maxLength={64}
        autoCapitalize={'none'}
        noSpace
        // onSubmitEditing={() => cccdEl.current.focus()}
        editable={isEditEmail}
      />
    );
  };

  // const renderIdentifier = () => {
  //   //yeu cau khong can cung cap CCCD: 29/01/2024
  //   const { isKYCIdentification, identification } = userInfo;
  //   return (
  //     <CInput
  //       refChild={cccdEl}
  //       isRequire={false}
  //       value={identification}
  //       onChange={handleCCCD}
  //       errorText={errCCCD}
  //       label={t('onboarding.cccd')}
  //       placeHolder={t('onboarding.cccd')}
  //       returnKeyType={isIOS ? 'done' : 'next'}
  //       keyboardType={'numeric'}
  //       maxLength={32}
  //       noSpace
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //       isKYC={isKYCIdentification}
  //       onPressKycInfo={showKYCInfo}
  //     />
  //   );
  // };

  // const renderDescription = () => {
  //   return (
  //     <CAreaContent
  //       refChild={descriptionEl}
  //       value={userInfo.description}
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
  //       value={socials[0].link}
  //       onChange={value => handleChangeLink(0, value)}
  //       errorText={''}
  //       label={t('onboarding.links')}
  //       placeHolder={'Facebook'}
  //       returnKeyType={'next'}
  //       leftIcon={
  //         <Image source={images.auth.ico_fb} style={screenStyles.box16} />
  //       }
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
  //       value={socials[1].link}
  //       onChange={value => handleChangeLink(1, value)}
  //       errorText={''}
  //       placeHolder={'Youtube'}
  //       returnKeyType={'next'}
  //       leftIcon={
  //         <Image source={images.auth.ico_youtube} style={screenStyles.box16} />
  //       }
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
  //       value={socials[2].link}
  //       onChange={value => handleChangeLink(2, value)}
  //       errorText={''}
  //       placeHolder={'Tiktok'}
  //       returnKeyType={'next'}
  //       leftIcon={
  //         <Image source={images.auth.ico_tiktok} style={screenStyles.box16} />
  //       }
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
  //       value={socials[3].link}
  //       onChange={value => handleChangeLink(3, value)}
  //       errorText={''}
  //       placeHolder={'Website'}
  //       returnKeyType={'next'}
  //       leftIcon={
  //         <Image source={images.auth.ico_website} style={screenStyles.box16} />
  //       }
  //       noSpace
  //       autoCapitalize={'none'}
  //       maxLength={100}
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //     />
  //   );
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

  // const renderAddCustomLink = () => {
  //   return (
  //     <Pressable
  //       style={[screenStyles.pV12, screenStyles.rowStart]}
  //       onPress={handleAddNewLink}
  //     >
  //       <IconX
  //         type={IconType.IONICONS}
  //         name="add"
  //         color={colors.primary}
  //         size={20}
  //       />
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
  //       value={socials[index].link}
  //       onChange={value => handleChangeLink(index, value)}
  //       errorText={''}
  //       placeHolder={'Custom link'}
  //       returnKeyType={'next'}
  //       leftIcon={
  //         <Image source={images.auth.ico_link} style={screenStyles.box16} />
  //       }
  //       noSpace
  //       autoCapitalize={'none'}
  //       rightIconCustom={
  //         <Pressable
  //           onPress={() => handleRemoveLink(index)}
  //           style={{ marginLeft: 10, marginTop: 3 }}
  //           hitSlop={screenStyles.hitSlop20}
  //         >
  //           <Image source={images.auth.ico_trash} style={screenStyles.box20} />
  //         </Pressable>
  //       }
  //       maxLength={100}
  //       onSubmitEditing={() => Keyboard.dismiss()}
  //     />
  //   );
  // };

  // const renderCustomLink = () => {
  //   // const { socials } = userInfo;
  //   let result = [];
  //   for (let i = 4; i < socials.length; i++) {
  //     if (!socials[i].delete) {
  //       result.push(renderItemLink(i));
  //     }
  //   }
  //   return result;
  // };

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : undefined}
      style={screenStyles.flex1}
      keyboardVerticalOffset={150}
    >
      <CScrollView innerRef={scrollRef} style={screenStyles.pH24}>
        {renderAvatar()}
        {/* {renderUsername()} */}
        {renderFullName()}
        {/* {rendeChanelName()} */}
        {renderCountry()}
        {renderGender()}
        {renderBirthday()}
        {/* {renderPhone()} */}
        {user.phone ? renderPhone() : renderPhoneSocial()}
        {renderEmail()}
        {/* {renderIdentifier()} */}
        {/* {renderDescription()} */}
        {/* {renderSocials()}
        {renderCustomLink()}
        {renderAddCustomLink()} */}
      </CScrollView>
      <Toast ref={toastEl} position="center" />
    </KeyboardAvoidingView>
  );
};

export default MyInformation;
