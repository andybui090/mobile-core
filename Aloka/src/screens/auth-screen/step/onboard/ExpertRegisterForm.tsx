import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@rneui/themed';
import { APILoading, CHeader, CInput, IconX, Wrapper } from '@/components';
import ModalOTP, { OTPType } from '@/components/modal-otp';
import { CButton, CText } from '@/utils';
import { AppContext } from '@/contexts';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { registerDoctor, resetOnboardUnused } from '@/redux/slices/onboardSlice';
import { ModalSearchAddress, LocationItem } from '@/screens/layout/booking-schedule/ModalSearchAddress';
import { getStringData, storeStringData } from '@/storages';
import { STORAGEKEY } from '@/constants';
import ApiService from '@/services/api-base';
import { AccountTypeItem } from './ChooseAccountType';
import { SelectSpecialization, SpecializationItem } from './SelectSpecialization';

interface Props {
  goBack: () => void;
  goToLogin?: () => void;
  onSuccess: (user: any) => void;
  dataLogin: any;
  accountType?: AccountTypeItem | null;
}

export const ExpertRegisterForm: React.FC<Props> = ({
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
  const { doctorRegister: doctorRegisterState } = useAppSelector(
    state => state.onboardReducer,
  );

  const [fullName, setFullName] = useState<string>(
    dataLogin?.useOnboard?.full_name ||
    dataLogin?.useOnboard?.fullName ||
    dataLogin?.useOnboard?.name ||
    dataLogin?.useOnboard?.user?.full_name ||
    dataLogin?.useOnboard?.user?.fullName ||
    '',
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
  const [position, setPosition] = useState<string>('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<SpecializationItem[]>([]);
  const [isSelectingSpecialization, setIsSelectingSpecialization] = useState<boolean>(false);

  const [isExperienceType, setIsExperienceType] = useState<number | null>(null);
  const [experience, setExperience] = useState<string>('');
  const [showExperienceModal, setShowExperienceModal] = useState<boolean>(false);

  const [email, setEmail] = useState<string>(
    dataLogin?.useOnboard?.email || '',
  );
  const [phone, setPhone] = useState<string>(
    dataLogin?.phoneNumber || '',
  );
  const [workplace, setWorkplace] = useState<string>('');
  const [workingArea, setWorkingArea] = useState<string>('');
  const [workingAreaLocation, setWorkingAreaLocation] = useState<LocationItem | null>(null);
  const [movingRadius, setMovingRadius] = useState<string>('10 Km');

  const [showAreaModal, setShowAreaModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState<boolean>(false);

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
          setCountry(vn || items[0] || VIETNAM_DEFAULT);
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

  const [verifyPhone, setVerifyPhone] = useState({
    isVisible: false,
    listPhoneOld: [] as { isVerified: boolean; phoneCode: string; phoneText: string }[],
    phoneShow: '',
    phoneSend: '',
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    country?: string;
    specialization?: string;
    experience?: string;
    email?: string;
    phone?: string;
    workingArea?: string;
    movingRadius?: string;
  }>({});

  // 3 experience options matching doctor-mobile-app & mockup image 2
  const experienceOptions = [
    {
      type: 0,
      label: t('onboarding.noExperience', 'Chưa có kinh nghiệm'),
    },
    {
      type: 2,
      label: t(
        'onboarding.freelancerExperience',
        'Không thuộc cơ sở hiện tại nào (Hưu trí/Freelancer)',
      ),
    },
    {
      type: 1,
      label: t('onboarding.hasExperience', 'Đã có kinh nghiệm'),
    },
  ];

  const isEmailFlow = dataLogin?.loginType !== 'phone';
  const isPostEmail = !(isEmailFlow && Boolean(dataLogin?.useOnboard?.email));

  // Check if form is valid to style the button
  const cleanPhone = phone.replace(/[\s\-\.]/g, '').trim();
  const isValidForm =
    Boolean(fullName.trim()) &&
    selectedSpecializations.length > 0 &&
    isExperienceType !== null &&
    Boolean(workingArea.trim()) &&
    cleanPhone.length >= 9 &&
    (!isEmailFlow || Boolean(email.trim()));

  useEffect(() => {
    if (!doctorRegisterState.loading) {
      if (doctorRegisterState.data) {
        setShowAlert(false);
        setIsLoadingAPI(false);
        setLoading(false);
        const data: any = doctorRegisterState.data;
        const resUser: any = data?.result || {};
        const finalUser = {
          ...dataLogin?.useOnboard,
          ...resUser,
          username: resUser.username || resUser.full_name || fullName.trim(),
        };
        dispatch(resetOnboardUnused(null));
        onSuccess(finalUser);
      } else if (doctorRegisterState.error) {
        setShowAlert(false);
        setIsLoadingAPI(false);
        setLoading(false);
        const err = doctorRegisterState.error;
        const msg =
          err?.errors?.[0]?.msg ||
          err?.message ||
          err?.msg ||
          t('onboarding.errorRequiredFields', 'Vui lòng kiểm tra lại thông tin');
        Alert.alert(t('common.notification', 'Thông báo'), msg);
        dispatch(resetOnboardUnused(null));
      }
    }
  }, [doctorRegisterState]);

  const validate = (): boolean => {
    const newErrors: {
      fullName?: string;
      country?: string;
      specialization?: string;
      experience?: string;
      email?: string;
      phone?: string;
      workingArea?: string;
      movingRadius?: string;
    } = {};

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      newErrors.fullName = t('onboarding.errorFullName', 'Vui lòng nhập họ và tên');
    }

    // country mặc định Vietnam nếu chưa chọn
    if (!country) {
      setCountry(VIETNAM_DEFAULT);
    }

    if (selectedSpecializations.length === 0) {
      newErrors.specialization = t(
        'onboarding.errorSpecialization',
        'Vui lòng chọn chuyên khoa',
      );
    }

    if (isExperienceType === null) {
      newErrors.experience = t(
        'onboarding.errorExperience',
        'Vui lòng chọn kinh nghiệm làm việc',
      );
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

    if (!workingArea.trim()) {
      newErrors.workingArea = t(
        'onboarding.errorWorkingArea',
        'Vui lòng chọn khu vực làm việc',
      );
    }

    // movingRadius mặc định 10 Km nếu không nhập
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      console.log("⚠️ [ExpertRegisterForm] VALIDATION FAILED Errors:", JSON.stringify(newErrors, null, 2));
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

  // occupationId: chỉ dùng khi onboard là chuyên gia (bắt buộc theo backend, số nguyên từ titleInfomations: 53-56)
  const getOccupationId = (): number => {
    const pos = (position || '').toLowerCase();
    if (pos.includes('chuyên khoa 1') || pos.includes('cki') || pos.includes('ck1')) return 53;
    if (pos.includes('chuyên khoa 2') || pos.includes('ckii') || pos.includes('ck2')) return 54;
    if (pos.includes('nội trú')) return 55;
    return 56; // Bác sĩ
  };

  const handleRegistryDefault = async () => {
    setShowAlert(true);
    setIsLoadingAPI(true);
    setLoading(true);

    try {

      const finalPhone = buildFinalPhone();

      const specializationIds = selectedSpecializations.map((s: any) => s.id).join(',');
      const specializationNames = selectedSpecializations.map((s: any) => s.name).join(', ');

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

      const radiusNumber = parseFloat(movingRadius.replace(/[^0-9.]/g, '')) || 10;
      const trimmedFullName = fullName.trim();

      // medicalId: giống doctor-mobile-app truyền medicalId: userChoose.id (số nguyên: 46 cho Nurse, 47 cho Doctor)
      const isDoctor = (accountType?.code || '').toLowerCase() === 'doctor';
      const medicalId = Number(
        accountType?.raw?.id ||
        (typeof accountType?.id === 'number' ? accountType.id : (isDoctor ? 47 : 46)),
      );

      const payload: any = {
        type: isDoctor ? 'Doctor' : 'Nurse',
        fullName: trimmedFullName,
        channel_name: trimmedFullName,
        country: country?.name || 'Vietnam',
        medicalId: medicalId,
        device: Platform.OS === 'ios' ? 'iOS' : 'Android',
        specializationId: specializationIds,
        interests: categories,
        radius: radiusNumber,
        working_area: (workingAreaLocation?.text || workingArea).trim(),
        address: (workingAreaLocation?.text || workingArea).trim(),
      };

      // occupationId chỉ dùng khi onboard là Bác sĩ (Doctor), Điều dưỡng (Nurse) không có occupationId (giống doctor-mobile-app)
      if (isDoctor) {
        payload.occupationId = getOccupationId();
      }

      if (isExperienceType === 2) {
        payload.is_freelancer = 1;
      } else if (isExperienceType === 1) {
        payload.experiences = [
          {
            name: workplace.trim() || 'Cơ sở y tế',
            position: position.trim() || (isDoctor ? 'Bác sĩ' : 'Điều dưỡng'),
            isPresent: true,
          },
        ];
      }

      if (finalPhone) {
        payload.phone = finalPhone;
      }

      if (workingAreaLocation?.geometry?.location) {
        const { lat, lng } = workingAreaLocation.geometry.location;
        if (lat !== undefined && lng !== undefined) {
          payload.latitude = lat;
          payload.longitude = lng;
        }
      }

      if (email.trim()) {
        payload.email = email.trim().toLowerCase();
      }

      if (dataLogin?.useOnboard?.gender) {
        payload.gender = dataLogin.useOnboard.gender;
      }

      if (dataLogin?.useOnboard?.dob) {
        payload.dob = dataLogin.useOnboard.dob;
      }

      if (__DEV__ && console.tron && typeof console.tron.display === "function") {
        console.tron.display({
          name: "ONBOARD EXPERT PAYLOAD",
          preview: `POST /personalizations (email: ${payload.email || "none"})`,
          value: payload,
          important: true,
        });
      }

      dispatch(registerDoctor(payload));
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
      console.log("⚠️ [ExpertRegisterForm] Submit blocked by validation");
      return;
    }

    // Luồng email: cần xác minh SĐT qua OTP trước (giống UserRegisterForm)
    if (isEmailFlow && phone.trim()) {
      const isVerified = checkStatusVerify();
      if (!isVerified) {
        const phoneSend = buildFinalPhone();
        const phoneCode = dataLogin?.phoneCode?.value || '+84';
        const phoneDisplay = phoneCode + ' ' + phone.trim();
        const isDoctor = (accountType?.code || '').toLowerCase() === 'doctor';
        const medicalId = Number(
          accountType?.raw?.id ||
          (typeof accountType?.id === 'number' ? accountType.id : (isDoctor ? 47 : 46)),
        );
        const checkBody: any = {
          phone: phoneSend,
          type: isDoctor ? 'Doctor' : 'Nurse',
          medicalId,
        };
        if (isDoctor) {
          checkBody.occupationId = getOccupationId();
        }
        try {
          const res: any = await ApiService.doctorRegister(checkBody);
          const resErrors = res?.data?.errors || [];
          // Tìm lỗi liên quan đến phone (giống doctor-mobile-app)
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
          console.log('doctorRegister check error, opening OTP anyway:', e);
          Keyboard.dismiss();
          setVerifyPhone(prev => ({
            ...prev,
            isVisible: true,
            phoneShow: phoneDisplay,
            phoneSend,
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

  // If user navigated to select specializations screen
  if (isSelectingSpecialization) {
    return (
      <SelectSpecialization
        initialSelected={selectedSpecializations}
        goBack={() => setIsSelectingSpecialization(false)}
        onConfirm={(items: SpecializationItem[]) => {
          setSelectedSpecializations(items);
          if (errors.specialization) {
            setErrors(prev => ({ ...prev, specialization: undefined }));
          }
          setIsSelectingSpecialization(false);
        }}
      />
    );
  }
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

          {/* 2. Học hàm / Chức vị */}
          <View style={styles.inputGroup}>
            <CInput
              label={t('onboarding.fieldPosition', 'Học hàm / Chức vị')}
              placeHolder={t(
                'onboarding.fieldPositionPlaceholder',
                'Bác sĩ CKI, Cử nhân Điều dưỡng',
              )}
              value={position}
              onChange={setPosition}
            />
          </View>

          {/* 3. Chuyên khoa * (Click opens SelectSpecialization screen) */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.fieldLabel}>
                {t('onboarding.fieldSpecialization', 'Chuyên khoa')}
              </CText>
              <CText style={styles.requiredMark}> *</CText>
            </View>
            <TouchableOpacity
              style={[
                styles.selectBox,
                errors.specialization ? styles.borderError : null,
              ]}
              activeOpacity={0.7}
              onPress={() => setIsSelectingSpecialization(true)}
            >
              <CText
                style={
                  selectedSpecializations.length > 0
                    ? styles.selectValueText
                    : styles.selectPlaceholderText
                }
                numberOfLines={1}
              >
                {selectedSpecializations.length > 0
                  ? selectedSpecializations.map(s => s.name).join(', ')
                  : t(
                    'onboarding.fieldSpecializationPlaceholder',
                    'Chọn chuyên khoa',
                  )}
              </CText>
              <IconX
                type="ionicons"
                name="chevron-forward"
                size={20}
                color="#667085"
              />
            </TouchableOpacity>
            {errors.specialization ? (
              <CText style={styles.errorText}>{errors.specialization}</CText>
            ) : null}
          </View>

          {/* 4. Kinh nghiệm làm việc * (Dropdown / Modal) */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.fieldLabel}>
                {t('onboarding.fieldExperience', 'Kinh nghiệm làm việc')}
              </CText>
              <CText style={styles.requiredMark}> *</CText>
            </View>
            <TouchableOpacity
              style={[
                styles.selectBox,
                errors.experience ? styles.borderError : null,
              ]}
              activeOpacity={0.7}
              onPress={() => setShowExperienceModal(true)}
            >
              <CText
                style={
                  experience
                    ? styles.selectValueText
                    : styles.selectPlaceholderText
                }
                numberOfLines={1}
              >
                {experience ||
                  t(
                    'onboarding.fieldExperiencePlaceholder',
                    'Chọn kinh nghiệm làm việc',
                  )}
              </CText>
              <IconX
                type="ionicons"
                name="chevron-down"
                size={20}
                color="#667085"
              />
            </TouchableOpacity>
            {errors.experience ? (
              <CText style={styles.errorText}>{errors.experience}</CText>
            ) : null}
          </View>

          {/* 5. Email */}
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

          {/* 6. Số điện thoại */}
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

          {/* 7. Nơi công tác */}
          <View style={styles.inputGroup}>
            <CInput
              label={t('onboarding.fieldWorkplace', 'Nơi công tác')}
              placeHolder={t(
                'onboarding.fieldWorkplacePlaceholder',
                'Nơi công tác',
              )}
              value={workplace}
              onChange={setWorkplace}
            />
          </View>

          {/* 8. Khu vực làm việc * */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.fieldLabel}>
                {t('onboarding.fieldWorkingArea', 'Khu vực làm việc')}
              </CText>
              <CText style={styles.requiredMark}> *</CText>
            </View>
            <TouchableOpacity
              style={[
                styles.selectBox,
                errors.workingArea ? styles.borderError : null,
              ]}
              activeOpacity={0.7}
              onPress={() => setShowAreaModal(true)}
            >
              <CText
                style={
                  workingArea
                    ? styles.selectValueText
                    : styles.selectPlaceholderText
                }
                numberOfLines={1}
              >
                {workingArea ||
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
            {errors.workingArea ? (
              <CText style={styles.errorText}>{errors.workingArea}</CText>
            ) : null}
          </View>

          {/* 9. Bán kính sẵn sàng di chuyển (phục vụ) */}
          <View style={styles.inputGroup}>
            <CInput
              label={t(
                'onboarding.fieldMovingRadius',
                'Bán kính sẵn sàng di chuyển (phục vụ)',
              )}
              placeHolder={t(
                'onboarding.fieldMovingRadiusPlaceholder',
                'Bán kính sẵn sàng di chuyển (mặc định 10 Km)',
              )}
              value={movingRadius}
              onChange={val => {
                setMovingRadius(val);
                if (errors.movingRadius) {
                  setErrors(prev => ({ ...prev, movingRadius: undefined }));
                }
              }}
              errorText={errors.movingRadius}
            />
          </View>

          {/* Terms & Privacy Statement */}
          <View style={styles.policyWrap}>
            <CText center style={styles.policyText}>
              {t(
                'onboarding.termsPrefix',
                'Bằng việc tiếp tục, bạn đồng ý với ',
              )}
              <CText
                center
                style={styles.policyLink}
                onPress={handleOpenTerms}
              >
                {t('onboarding.termsOfService', 'Điều kiện sử dụng')}
              </CText>
              {t('onboarding.termsAnd', ' và ')}
              <CText
                center
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

      {/* Experience Selection Modal matching Mockup Image 2 */}
      <Modal
        visible={showExperienceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExperienceModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowExperienceModal(false)}
        >
          <Pressable style={styles.modalCard} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <CText style={styles.modalTitle}>
                {t('onboarding.isExperience', 'Bạn có kinh nghiệm làm việc chưa')}
              </CText>
              <TouchableOpacity
                onPress={() => setShowExperienceModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconX
                  type="ionicons"
                  name="close"
                  size={24}
                  color="#667085"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            <View style={styles.modalOptionsList}>
              {experienceOptions.map(opt => {
                const isSelected = isExperienceType === opt.type;
                return (
                  <TouchableOpacity
                    key={opt.type}
                    style={styles.radioRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      setIsExperienceType(opt.type);
                      setExperience(opt.label);
                      if (errors.experience) {
                        setErrors(prev => ({ ...prev, experience: undefined }));
                      }
                      setShowExperienceModal(false);
                    }}
                  >
                    <IconX
                      type="ionicons"
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={22}
                      color={isSelected ? '#007AFF' : '#667085'}
                    />
                    <CText
                      style={[
                        styles.radioLabel,
                        isSelected && styles.radioLabelActive,
                      ]}
                    >
                      {opt.label}
                    </CText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Address Search Modal */}
      <ModalSearchAddress
        visible={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        onChooseLocation={(item: LocationItem) => {
          setWorkingArea(item.text);
          setWorkingAreaLocation(item);
          if (errors.workingArea) {
            setErrors(prev => ({ ...prev, workingArea: undefined }));
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

      {showAlert ? (
        <APILoading showAlert={showAlert} isLoadingAPI={isLoadingAPI} />
      ) : null}

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
  // Modal styles for Experience
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    flex: 1,
    marginRight: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EAECF0',
    marginBottom: 12,
  },
  modalOptionsList: {
    paddingVertical: 6,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  radioLabel: {
    fontSize: 15,
    color: '#344054',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  radioLabelActive: {
    color: '#101828',
    fontWeight: '600',
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
    maxHeight: '80%' as any,
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

export default ExpertRegisterForm;
