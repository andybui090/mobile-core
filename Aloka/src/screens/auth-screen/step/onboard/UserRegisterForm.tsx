import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@rneui/themed';
import moment from 'moment';
import { APILoading, CDatePicker, CHeader, CInput, IconX, ModalGender, Wrapper } from '@/components';
import ModalOTP, { OTPType } from '@/components/modal-otp';
import { CButton, CText } from '@/utils';
import { AppContext } from '@/contexts';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { postSignUp, resetOnboardUnused } from '@/redux/slices/onboardSlice';
import { ModalSearchAddress, LocationItem } from '@/screens/layout/booking-schedule/ModalSearchAddress';
import { getStringData, storeStringData } from '@/storages';
import { STORAGEKEY } from '@/constants';
import ApiService from '@/services/api-base';
import { AccountTypeItem } from './ChooseAccountType';

interface Props {
  goBack: () => void;
  goToLogin?: () => void;
  onSuccess: (user: any) => void;
  dataLogin: any;
  accountType?: AccountTypeItem | null;
}

export const UserRegisterForm: React.FC<Props> = ({
  goBack,
  goToLogin,
  onSuccess,
  dataLogin,
  accountType,
}) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const dispatch = useAppDispatch();
  const { signupNormal } = useAppSelector(state => state.onboardReducer);

  const [fullName, setFullName] = useState<string>(
    dataLogin?.useOnboard?.full_name ||
    dataLogin?.useOnboard?.fullName ||
    dataLogin?.useOnboard?.name ||
    dataLogin?.useOnboard?.user?.full_name ||
    dataLogin?.useOnboard?.user?.fullName ||
    '',
  );
  const [gender, setGender] = useState<any>(
    dataLogin?.useOnboard?.gender
      ? {
        value: dataLogin.useOnboard.gender,
        name:
          dataLogin.useOnboard.gender === 'Male'
            ? 'Nam'
            : dataLogin.useOnboard.gender === 'Female'
              ? 'Nữ'
              : 'Khác',
        label: dataLogin.useOnboard.gender,
      }
      : null,
  );
  const [birthday, setBirthday] = useState<string>(
    dataLogin?.useOnboard?.dob
      ? moment(dataLogin.useOnboard.dob).format('DD/MM/YYYY')
      : dataLogin?.useOnboard?.birthday
        ? moment(dataLogin.useOnboard.birthday).format('DD/MM/YYYY')
        : '',
  );
  const [email, setEmail] = useState<string>(
    dataLogin?.useOnboard?.email || '',
  );
  const [phone, setPhone] = useState<string>(
    dataLogin?.phoneNumber || '',
  );

  useEffect(() => {
    const initialName =
      dataLogin?.useOnboard?.full_name ||
      dataLogin?.useOnboard?.fullName ||
      dataLogin?.useOnboard?.name ||
      '';
    if (initialName && !fullName) {
      setFullName(initialName);
    }
  }, [dataLogin]);
  const [livingArea, setLivingArea] = useState<string>('');
  const [livingAreaLocation, setLivingAreaLocation] = useState<LocationItem | null>(null);

  // Country selection (fetch from /countries)
  type CountryItem = { id: number; name: string;[key: string]: any };
  const [country, setCountry] = useState<CountryItem | null>(null);
  const [countryList, setCountryList] = useState<CountryItem[]>([]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Default Vietnam fallback (dùng khi API /countries fail hoặc không tìm thấy)
  const VIETNAM_DEFAULT: CountryItem = { id: 243, name: 'Vietnam' };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res: any = await ApiService.getCountries();
        const items: CountryItem[] = res?.data?.items || res?.data?.data || res?.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setCountryList(items);
          const vn = items.find(
            (c: CountryItem) =>
              c.name?.toLowerCase() === 'vietnam' ||
              c.name?.toLowerCase() === 'viet nam' ||
              c.name?.toLowerCase() === 'việt nam',
          );
          setCountry(vn || VIETNAM_DEFAULT);
        } else {
          setCountry(VIETNAM_DEFAULT);
        }
      } catch (e) {
        console.log('fetchCountries error', e);
        setCountry(VIETNAM_DEFAULT);
      }
    };
    fetchCountries();
  }, []);

  const filteredCountries = countrySearch.trim()
    ? countryList.filter(c =>
      c.name?.toLowerCase().includes(countrySearch.toLowerCase()),
    )
    : countryList;

  const [showGenderModal, setShowGenderModal] = useState<boolean>(false);
  const [showDobModal, setShowDobModal] = useState<boolean>(false);
  const [showAreaModal, setShowAreaModal] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    country?: string;
    gender?: string;
    birthday?: string;
    phone?: string;
    email?: string;
    livingArea?: string;
  }>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState<boolean>(false);

  const [verifyPhone, setVerifyPhone] = useState({
    isVisible: false,
    listPhoneOld: [] as { isVerified: boolean; phoneCode: string; phoneText: string }[],
    phoneShow: '',
    phoneSend: '',
  });

  const isEmailFlow = dataLogin?.loginType !== 'phone';
  const isPostEmail = !(isEmailFlow && Boolean(dataLogin?.useOnboard?.email));

  // Form validity check for button styling
  const cleanPhone = phone.replace(/[\s\-\.]/g, '').trim();
  const isValidForm =
    Boolean(fullName.trim()) &&
    Boolean(gender?.name || gender?.value) &&
    Boolean(birthday) &&
    Boolean(livingArea.trim()) &&
    cleanPhone.length >= 9 &&
    (!isEmailFlow || Boolean(email.trim()));

  useEffect(() => {
    if (!signupNormal.loading) {
      if (signupNormal.data) {
        setShowAlert(false);
        setIsLoadingAPI(false);
        setLoading(false);
        const data: any = signupNormal.data;
        const resUser: any = data?.result || {};
        const finalUser = {
          ...dataLogin?.useOnboard,
          ...resUser,
          username: resUser.username || resUser.full_name || fullName.trim(),
        };
        dispatch(resetOnboardUnused(null));
        onSuccess(finalUser);
      } else if (signupNormal.error) {
        setShowAlert(false);
        setIsLoadingAPI(false);
        setLoading(false);
        const err = signupNormal.error;
        const msg =
          err?.errors?.[0]?.msg ||
          err?.message ||
          err?.msg ||
          t('onboarding.errorRequiredFields', 'Vui lòng kiểm tra lại thông tin');
        Alert.alert(t('common.notification', 'Thông báo'), msg);
        dispatch(resetOnboardUnused(null));
      }
    }
  }, [signupNormal]);

  const validate = (): boolean => {
    const newErrors: {
      fullName?: string;
      country?: string;
      gender?: string;
      birthday?: string;
      phone?: string;
      email?: string;
      livingArea?: string;
    } = {};

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      newErrors.fullName = t('onboarding.errorFullName', 'Vui lòng nhập họ và tên');
    }

    // country mặc định Vietnam nếu chưa chọn
    if (!country) {
      setCountry(VIETNAM_DEFAULT);
    }

    if (!gender || (!gender.name && !gender.value)) {
      newErrors.gender = t('onboarding.errorGender', 'Vui lòng chọn giới tính');
    }

    if (!birthday) {
      newErrors.birthday = t('onboarding.errorBirthday', 'Vui lòng chọn ngày sinh');
    }

    // Phone is mandatory for backend /personalizations API
    const rawPhone = phone.trim();
    if (!rawPhone) {
      newErrors.phone = t('onboarding.errorPhone', 'Vui lòng nhập số điện thoại');
    } else {
      const clean = rawPhone.replace(/[\s\-\.]/g, '');
      let digits = clean;
      if (digits.startsWith('+84')) {
        digits = digits.substring(3);
      } else if (digits.startsWith('84')) {
        digits = digits.substring(2);
      }
      if (digits.startsWith('0')) {
        digits = digits.substring(1);
      }

      if (!/^\d+$/.test(digits)) {
        newErrors.phone = t('onboarding.errorPhoneInvalid', 'Số điện thoại chỉ được chứa các chữ số');
      } else {
        const phoneCode = dataLogin?.phoneCode?.value || '+84';
        if (phoneCode === '+84' || clean.startsWith('+84') || clean.startsWith('84')) {
          if (digits.length !== 9) {
            newErrors.phone = 'Số điện thoại Việt Nam gồm 10 chữ số (VD: 0775905677)';
          }
        } else if (digits.length < 7 || digits.length > 15) {
          newErrors.phone = t('onboarding.errorPhoneInvalid', 'Số điện thoại không hợp lệ');
        }
      }
    }

    if (isEmailFlow) {
      if (!email.trim()) {
        newErrors.email = t('onboarding.errorEmailRequired', 'Vui lòng nhập email');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          newErrors.email = t('onboarding.errorEmail', 'Email không hợp lệ');
        }
      }
    } else if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = t('onboarding.errorEmail', 'Email không hợp lệ');
      }
    }

    if (!livingArea.trim()) {
      newErrors.livingArea = t(
        'onboarding.errorLivingArea',
        'Vui lòng chọn khu vực sinh sống',
      );
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      console.log("⚠️ [UserRegisterForm] VALIDATION FAILED Errors:", JSON.stringify(newErrors, null, 2));
    }
    return isValid;
  };

  const buildFinalPhone = () => {
    const rawPhone = phone.trim();
    if (!rawPhone) return '';
    const clean = rawPhone.replace(/[\s\-\.]/g, '');
    let digits = clean;
    if (digits.startsWith('+84')) {
      digits = digits.substring(3);
    } else if (digits.startsWith('84')) {
      digits = digits.substring(2);
    }
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    const phoneCode = dataLogin?.phoneCode?.value || '+84';
    return phoneCode + digits;
  };

  const handleRegistryDefault = async () => {
    setShowAlert(true);
    setIsLoadingAPI(true);
    setLoading(true);

    try {
      const finalPhone = buildFinalPhone();

      let categories: string | null = await getStringData(STORAGEKEY.CATEGORIES);
      if (!categories) {
        try {
          const res: any = await ApiService.getCategories();
          const items = res?.data?.items || [];
          if (items.length > 0) {
            const cateStr = items.map((c: any) => c.id).join(',');
            categories = cateStr;
            await storeStringData(STORAGEKEY.CATEGORIES, cateStr);
          }
        } catch (e) {
          categories = '140,162,173,181,217';
        }
      }
      if (!categories) {
        categories = '140,162,173,181,217';
      }

      const trimmedFullName = fullName.trim();

      const payload: any = {
        type: (accountType?.code || 'User').toLowerCase() === 'user' ? 'User' : (accountType?.code || 'User'),
        fullName: trimmedFullName,
        country: country?.name || 'Vietnam',
        gender: gender?.value || gender?.name || 'Undisclosed',
        dob: moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        device: Platform.OS === 'ios' ? 'iOS' : 'Android',
        interests: categories,
      };

      if (finalPhone) {
        payload.phone = finalPhone;
      }

      if (email.trim()) {
        payload.email = email.trim().toLowerCase();
      }

      console.log("🚀 ~ [ONBOARD USER / EMAIL FLOW] SUBMITTING payload:", JSON.stringify(payload, null, 2));
      if (__DEV__ && console.tron && typeof console.tron.display === "function") {
        console.tron.display({
          name: "ONBOARD USER PAYLOAD",
          preview: `POST /personalizations (email: ${payload.email || "none"})`,
          value: payload,
          important: true,
        });
      }

      dispatch(postSignUp(payload));
    } catch (e) {
      setShowAlert(false);
      setIsLoadingAPI(false);
      setLoading(false);
    }
  };

  const checkStatusVerify = () => {
    for (let i = 0; i < verifyPhone.listPhoneOld.length; i++) {
      const item = verifyPhone.listPhoneOld[i];
      const phoneCode = dataLogin?.phoneCode?.value || '+84';
      if (item.phoneCode === phoneCode) {
        if (phone.trim() !== '' && item.phoneText === phone.trim()) {
          return item.isVerified;
        }
      }
    }
    return false;
  };

  const handleVerifySuccess = () => {
    const arrClone = [...verifyPhone.listPhoneOld];
    arrClone.push({
      isVerified: true,
      phoneCode: dataLogin?.phoneCode?.value || '+84',
      phoneText: phone.trim(),
    });
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

  const handleSubmit = async () => {
    if (!validate()) {
      console.log("⚠️ [UserRegisterForm] Submit blocked by validation");
      return;
    }

    // Luồng email: cần xác minh SĐT qua OTP trước
    if (isEmailFlow && phone.trim()) {
      const isVerified = checkStatusVerify();
      if (!isVerified) {
        const phoneSend = buildFinalPhone();
        const phoneCode = dataLogin?.phoneCode?.value || '+84';
        const phoneDisplay = phoneCode + ' ' + phone.trim();
        try {
          const res: any = await ApiService.signupUser({ phone: phoneSend });
          const resErrors = res?.data?.errors || [];
          // Tìm lỗi liên quan đến phone
          const phoneErr = Array.isArray(resErrors)
            ? resErrors.find((e: any) =>
              e.key === 'phone' ||
              e.field === 'phone' ||
              (e.msg || e.message || '').toLowerCase().includes('phone'),
            )
            : null;

          if (phoneErr) {
            setErrors(prev => ({ ...prev, phone: phoneErr.msg || phoneErr.message }));
          } else {
            // API ok hoặc không có lỗi phone → mở OTP
            setErrors(prev => ({ ...prev, phone: undefined }));
            Keyboard.dismiss();
            setVerifyPhone(prev => ({
              ...prev,
              isVisible: true,
              phoneShow: phoneDisplay,
              phoneSend,
            }));
          }
        } catch (e) {
          // Nếu gọi API lỗi (network) vẫn mở OTP — để user tiếp tục
          console.log('signupUser error, opening OTP anyway:', e);
          const phoneSend2 = buildFinalPhone();
          const phoneCode2 = dataLogin?.phoneCode?.value || '+84';
          const phoneDisplay2 = phoneCode2 + ' ' + phone.trim();
          Keyboard.dismiss();
          setVerifyPhone(prev => ({
            ...prev,
            isVisible: true,
            phoneShow: phoneDisplay2,
            phoneSend: phoneSend2,
          }));
        }
        return;
      }
    }

    handleRegistryDefault();
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://aloka.vn/terms').catch(() => { });
  };

  const handleOpenPrivacy = () => {
    Linking.openURL('https://aloka.vn/privacy').catch(() => { });
  };

  return (
    <Wrapper safeBottom>
      <CHeader
        title={
          isEmailFlow && dataLogin?.useOnboard?.email
            ? t('onboarding.updateInfo', 'Cập nhật thông tin')
            : t('onboarding.registerAccount', 'Đăng ký tài khoản')
        }
        isBorderBottom
        rightComponentDisable
        leftComponentOnPress={goBack}
      />

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. Họ và tên * */}
          <View style={styles.inputGroup}>
            <CInput
              label={t('onboarding.fieldFullName', 'Họ và tên')}
              placeHolder={t('onboarding.fieldFullName', 'Họ và tên')}
              value={fullName}
              onChange={val => {
                setFullName(val);
                if (errors.fullName) {
                  setErrors(prev => ({ ...prev, fullName: undefined }));
                }
              }}
              errorText={errors.fullName}
              isRequire
            />
          </View>

          {/* 1b. Quốc gia * */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.fieldLabel}>
                {t('onboarding.country', 'Quốc gia')}
              </CText>
              <CText style={styles.requiredMark}> *</CText>
            </View>
            <TouchableOpacity
              style={[
                styles.selectBox,
                errors.country ? styles.borderError : null,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setCountrySearch('');
                setShowCountryModal(true);
              }}
            >
              <CText
                style={country ? styles.selectValueText : styles.selectPlaceholderText}
                numberOfLines={1}
              >
                {country?.name || t('onboarding.selectCountry', 'Chọn quốc gia')}
              </CText>
              <IconX type="ionicons" name="chevron-down" size={20} color="#667085" />
            </TouchableOpacity>
            {errors.country ? (
              <CText style={styles.errorText}>{errors.country}</CText>
            ) : null}
          </View>

          {/* 2. Giới tính * (ModalGender) */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.fieldLabel}>
                {t('onboarding.gender', 'Giới tính')}
              </CText>
              <CText style={styles.requiredMark}> *</CText>
            </View>
            <TouchableOpacity
              style={[
                styles.selectBox,
                errors.gender ? styles.borderError : null,
              ]}
              activeOpacity={0.7}
              onPress={() => setShowGenderModal(true)}
            >
              <CText
                style={
                  gender?.name || gender?.label
                    ? styles.selectValueText
                    : styles.selectPlaceholderText
                }
                numberOfLines={1}
              >
                {gender?.name ||
                  gender?.label ||
                  t('onboarding.selectGender', 'Chọn Giới tính')}
              </CText>
              <IconX
                type="ionicons"
                name="chevron-down"
                size={20}
                color="#667085"
              />
            </TouchableOpacity>
            {errors.gender ? (
              <CText style={styles.errorText}>{errors.gender}</CText>
            ) : null}
          </View>

          {/* 3. Ngày sinh * (CDatePicker) */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.fieldLabel}>
                {t('onboarding.birthday', 'Ngày sinh')}
              </CText>
              <CText style={styles.requiredMark}> *</CText>
            </View>
            <TouchableOpacity
              style={[
                styles.selectBox,
                errors.birthday ? styles.borderError : null,
              ]}
              activeOpacity={0.7}
              onPress={() => setShowDobModal(true)}
            >
              <CText
                style={
                  birthday
                    ? styles.selectValueText
                    : styles.selectPlaceholderText
                }
                numberOfLines={1}
              >
                {birthday ||
                  t('onboarding.birthdayPlaceholder', 'Chọn ngày sinh')}
              </CText>
              <IconX
                type="ionicons"
                name="calendar-outline"
                size={20}
                color="#667085"
              />
            </TouchableOpacity>
            {errors.birthday ? (
              <CText style={styles.errorText}>{errors.birthday}</CText>
            ) : null}
          </View>

          {/* 4. Số điện thoại */}
          <View style={styles.inputGroup}>
            <CInput
              label={t('onboarding.phone', 'Số điện thoại')}
              placeHolder="VD: 0775905677"
              value={phone}
              onChange={val => {
                setPhone(val);
                if (errors.phone) {
                  setErrors(prev => ({ ...prev, phone: undefined }));
                }
              }}
              keyboardType="phone-pad"
              errorText={errors.phone}
              isRequire
              editable={isEmailFlow}
            />
          </View>

          {/* 5. Khu vực sinh sống * */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.fieldLabel}>
                {t('onboarding.fieldLivingArea', 'Khu vực sinh sống')}
              </CText>
              <CText style={styles.requiredMark}> *</CText>
            </View>
            <TouchableOpacity
              style={[
                styles.selectBox,
                errors.livingArea ? styles.borderError : null,
              ]}
              activeOpacity={0.7}
              onPress={() => setShowAreaModal(true)}
            >
              <CText
                style={
                  livingArea
                    ? styles.selectValueText
                    : styles.selectPlaceholderText
                }
                numberOfLines={1}
              >
                {livingArea ||
                  t(
                    'onboarding.areaDropdownPlaceholder',
                    'Trường bắt buộc, dropdown chọn khu vực',
                  )}
              </CText>
              <IconX
                type="ionicons"
                name="chevron-down"
                size={20}
                color="#667085"
              />
            </TouchableOpacity>
            {errors.livingArea ? (
              <CText style={styles.errorText}>{errors.livingArea}</CText>
            ) : null}
          </View>

          {/* 6. Email */}
          <View style={styles.inputGroup}>
            <CInput
              label={t('onboarding.email', 'Email')}
              placeHolder={t('onboarding.email', 'Email')}
              value={email}
              onChange={val => {
                setEmail(val);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              errorText={errors.email}
              isRequire={isEmailFlow}
              editable={isPostEmail}
            />
          </View>

          {/* Terms & Privacy Statement */}
          <View style={styles.policyWrap}>
            <CText style={styles.policyText}>
              {t(
                'onboarding.termsPrefix',
                'Bằng việc tiếp tục, bạn đồng ý với ',
              )}
              <CText
                style={styles.policyLink}
                onPress={handleOpenTerms}
              >
                {t('onboarding.termsOfService', 'Điều kiện sử dụng')}
              </CText>
              {t('onboarding.termsAnd', ' và ')}
              <CText
                style={styles.policyLink}
                onPress={handleOpenPrivacy}
              >
                {t('onboarding.privacyPolicyLink', 'Chính sách quyền riêng tư')}
              </CText>
              {t('onboarding.termsSuffix', ' của chúng tôi')}
            </CText>
          </View>

          {/* Link to Login if in Email/Register flow */}
          <View style={styles.loginRow}>
            <CText style={styles.haveAccountText}>
              {t('auth.alreadyHaveAccount', 'Bạn đã có tài khoản?')}{' '}
            </CText>
            <TouchableOpacity onPress={goToLogin || goBack}>
              <CText style={styles.loginLink}>
                {t('auth.signin', 'Đăng nhập')}
              </CText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <CButton
          btnWidth="100%"
          title={t('common.continue', 'Tiếp tục')}
          onPress={handleSubmit}
          isDisable={loading}
          backgroundColor={isValidForm ? '#0E9384' : '#D1F5F5'}
          titleColor={isValidForm ? '#FFFFFF' : '#0E9384'}
          style={styles.continueBtn}
        />
      </View>

      {/* Gender Selection Modal */}
      {showGenderModal && (
        <ModalGender
          isVisible={showGenderModal}
          hideModal={() => setShowGenderModal(false)}
          chooseGender={(selected: any) => {
            setGender(selected);
            if (errors.gender) {
              setErrors(prev => ({ ...prev, gender: undefined }));
            }
            setShowGenderModal(false);
          }}
          genderChoose={gender}
        />
      )}

      {/* Date of Birth Picker Modal */}
      <CDatePicker
        isModalVisible={showDobModal}
        dateTimeValue={birthday ? moment(birthday, 'DD/MM/YYYY').toDate() : new Date(2000, 0, 1)}
        closeModal={() => setShowDobModal(false)}
        onChangeDate={(selectedDate: Date) => {
          setBirthday(moment(selectedDate).format('DD/MM/YYYY'));
          if (errors.birthday) {
            setErrors(prev => ({ ...prev, birthday: undefined }));
          }
          setShowDobModal(false);
        }}
      />

      {/* Address Search Modal */}
      <ModalSearchAddress
        visible={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        onChooseLocation={(item: LocationItem) => {
          setLivingArea(item.text);
          setLivingAreaLocation(item);
          if (errors.livingArea) {
            setErrors(prev => ({ ...prev, livingArea: undefined }));
          }
          setShowAreaModal(false);
        }}
      />

      {verifyPhone.isVisible && (
        <ModalOTP
          isVisible={verifyPhone.isVisible}
          phone={verifyPhone.phoneSend}
          email={''}
          hideModalOTP={() => {
            setVerifyPhone(prev => ({ ...prev, isVisible: false }));
            Keyboard.dismiss();
          }}
          callBackVerifySuccess={handleVerifySuccess}
          otpType={OTPType.register}
        />
      )}

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.countryModalOverlay}>
          <View style={styles.countryModalContainer}>
            <View style={styles.countryModalHeader}>
              <CText style={styles.countryModalTitle}>
                {t('onboarding.selectCountry', 'Chọn quốc gia')}
              </CText>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <IconX type="ionicons" name="close" size={24} color="#344054" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.countrySearchInput}
              placeholder={t('common.search', 'Tìm kiếm...')}
              placeholderTextColor="#98A2B3"
              value={countrySearch}
              onChangeText={setCountrySearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    country?.id === item.id && styles.countryItemSelected,
                  ]}
                  onPress={() => {
                    setCountry(item);
                    if (errors.country) {
                      setErrors(prev => ({ ...prev, country: undefined }));
                    }
                    setShowCountryModal(false);
                  }}
                >
                  <CText
                    style={[
                      styles.countryItemText,
                      country?.id === item.id && styles.countryItemTextSelected,
                    ]}
                  >
                    {item.name}
                  </CText>
                  {country?.id === item.id && (
                    <IconX type="ionicons" name="checkmark" size={18} color="#0E9384" />
                  )}
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {showAlert ? (
        <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
      ) : null}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 110,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
  },
  requiredMark: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F04438',
  },
  selectBox: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  borderError: {
    borderColor: '#F04438',
  },
  selectPlaceholderText: {
    fontSize: 14,
    color: '#667085',
    flex: 1,
    marginRight: 8,
  },
  selectValueText: {
    fontSize: 14,
    color: '#101828',
    flex: 1,
    marginRight: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#F04438',
    marginTop: 4,
    marginLeft: 2,
  },
  policyWrap: {
    marginTop: 18,
    marginBottom: 20,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  policyText: {
    fontSize: 12,
    color: '#344054',
    lineHeight: 18,
  },
  policyLink: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  continueBtn: {
    borderRadius: 10,
    height: 50,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  haveAccountText: {
    fontSize: 13,
    color: '#475467',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#159A8E',
  },
  // Country picker modal
  countryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  countryModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  countryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  countryModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  countrySearchInput: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    height: 44,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#101828',
    backgroundColor: '#F9FAFB',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  countryItemSelected: {
    backgroundColor: '#F0FDFA',
  },
  countryItemText: {
    fontSize: 15,
    color: '#101828',
  },
  countryItemTextSelected: {
    color: '#0E9384',
    fontWeight: '600',
  },
});

export default UserRegisterForm;
