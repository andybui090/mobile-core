import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@rneui/themed';
import {
  CDatePicker,
  CInput,
  CKeyboardAvoidingView,
  IconX,
  ImageHelper,
  ModalGender,
  Wrapper,
} from '@/components';
import { useKeyboardAwareScroll } from '@/hooks';
import { images } from '@/configs/image';
import { AppContext } from '@/contexts';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { getProfile } from '@/redux/slices/profileSlice';
import ApiService from '@/services/api-base';
import ImageCropPicker from 'react-native-image-crop-picker';
import moment from 'moment';
import {
  DocumentPickerResponse,
  pick,
  types,
} from '@react-native-documents/picker';
import { CText } from '@/utils';

const { width } = Dimensions.get('window');

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    headerBar: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#F2F4F7',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: '#101828',
      textAlign: 'center',
    },
    headerRightPlaceholder: {
      width: 40,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: 20,
    },
    avatarWrap: {
      width: 76,
      height: 76,
      borderRadius: 38,
      overflow: 'hidden',
      backgroundColor: '#E6FAFA',
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    editAvatarText: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: '500',
      color: '#0080FF',
    },
    formGroup: {
      marginBottom: 16,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: '#344054',
    },
    requiredMark: {
      fontSize: 14,
      fontWeight: '600',
      color: '#F04438',
      marginLeft: 4,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: '#D0D5DD',
      borderRadius: 8,
      paddingHorizontal: 14,
      fontSize: 15,
      color: '#101828',
      backgroundColor: '#FFFFFF',
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
    selectText: {
      fontSize: 15,
      color: '#101828',
    },
    placeholderText: {
      fontSize: 15,
      color: '#98A2B3',
    },
    attachmentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      borderWidth: 1,
      borderColor: '#D0D5DD',
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FFFFFF',
      justifyContent: 'space-between',
    },
    attachmentLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 8,
    },
    attachmentName: {
      fontSize: 14,
      color: '#344054',
      marginLeft: 8,
      flex: 1,
    },
    removeAttachmentBtn: {
      padding: 4,
    },
    uploadEmptyCard: {
      height: 48,
      borderWidth: 1,
      borderColor: '#D0D5DD',
      borderStyle: 'dashed',
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FAFAFA',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    uploadEmptyText: {
      fontSize: 14,
      color: '#19A2A7',
      fontWeight: '500',
    },
    errorHelperText: {
      fontSize: 12,
      color: '#F04438',
      marginTop: 4,
      marginLeft: 2,
    },
    borderError: {
      borderColor: '#F04438',
      backgroundColor: '#FEF3F2',
    },
    bottomBar: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#F2F4F7',
    },
    submitButton: {
      height: 50,
      backgroundColor: '#19A2A7',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#19A2A7',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 3,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 36,
      maxHeight: 520,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#EAECF0',
      alignSelf: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: '#101828',
      marginBottom: 14,
      textAlign: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 12,
      height: 42,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#101828',
      paddingVertical: 0,
      marginLeft: 8,
    },
    modalItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#F2F4F7',
    },
    modalItemText: {
      fontSize: 15,
      color: '#344054',
    },
    modalItemTextActive: {
      fontSize: 15,
      fontWeight: '600',
      color: '#19A2A7',
    },
    modalOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#F2F4F7',
    },
    modalOptionIconBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#EFFBFA',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    modalOptionText: {
      fontSize: 15,
      fontWeight: '500',
      color: '#344054',
    },
    modalOptionCancelBtn: {
      marginTop: 14,
      height: 44,
      borderRadius: 8,
      backgroundColor: '#F2F4F7',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOptionCancelText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#667085',
    },
  })
);

export const EditProfileScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { user } = useContext<any>(AppContext) || {};

  // Form State initialized from user context (no hardcoded fallback values)
  const [fullName, setFullName] = useState<string>(user?.full_name || '');

  const getInitialGender = () => {
    const raw = user?.gender;
    if (!raw) return { value: '', name: '', label: '' };
    if (typeof raw === 'object' && raw?.value) return raw;
    const lower = typeof raw === 'string' ? raw.toLowerCase() : '';
    if (lower === 'female' || lower === 'nữ') {
      return { value: 'Female', name: 'Nữ', label: 'Nữ' };
    }
    if (lower === 'male' || lower === 'nam') {
      return { value: 'Male', name: 'Nam', label: 'Nam' };
    }
    return { value: 'Undisclosed', name: 'Khác', label: 'Khác' };
  };
  const [gender, setGender] = useState<any>(getInitialGender());
  const [showGenderModal, setShowGenderModal] = useState<boolean>(false);

  const [dob, setDob] = useState<string>(
    user?.dob && user.dob !== 'Invalid date' ? user.dob : ''
  );
  const [showDobModal, setShowDobModal] = useState<boolean>(false);

  const [phone, setPhone] = useState<string>(
    user?.phone || user?.phone_number || ''
  );

  const [email, setEmail] = useState<string>(user?.email || '');

  const [position, setPosition] = useState<string>(
    user?.personalization?.position || user?.position || ''
  );

  const specializationsInitial = Array.isArray(user?.personalization?.specializations)
    ? user.personalization.specializations.map((s: any) => s.name).join(', ')
    : typeof user?.personalization?.specialization === 'string'
      ? user.personalization.specialization
      : '';
  const [specialization, setSpecialization] = useState<string>(
    specializationsInitial || ''
  );

  const existingCertificate: any = '';

  // Chứng chỉ hành nghề attachment (Document picker)
  const [certificateFile, setCertificateFile] = useState<{
    name: string;
    size: string;
    uri?: string;
    type?: string;
  } | null>(() => {
    if (existingCertificate && typeof existingCertificate === 'string') {
      const parts = existingCertificate.split('/');
      return {
        name: parts[parts.length - 1] || 'chung_chi_hanh_nghe.pdf',
        size: '',
        uri: existingCertificate,
      };
    }
    return null;
  });

  const [certificateNumber, setCertificateNumber] = useState<string>(
    user?.personalization?.certificate_number || user?.certificate_number || ''
  );

  const [experience, setExperience] = useState<string>(
    user?.personalization?.experience || user?.experience || ''
  );

  const [workplace, setWorkplace] = useState<string>(
    user?.personalization?.workplace || user?.hospital || ''
  );

  const [workingArea, setWorkingArea] = useState<string>(
    user?.personalization?.working_area || user?.city || ''
  );
  const [showAreaModal, setShowAreaModal] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [searchArea, setSearchArea] = useState<string>('');
  const [isLoadingAreas, setIsLoadingAreas] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    certificateNumber?: string;
    certificateFile?: string;
    workingArea?: string;
  }>({});

  const {
    scrollViewRef,
    isKeyboardVisible,
    registerInput,
    scrollToField,
    onScrollViewLayout,
    onScroll,
    contentPaddingBottom,
  } = useKeyboardAwareScroll({
    bottomOffset: 20,
    inputHeight: 90,
  });

  const isFormValid = Boolean(
    fullName.trim() &&
    certificateFile &&
    certificateNumber.trim() &&
    workingArea &&
    workingArea.trim()
  );

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingAreas(true);
      try {
        const res: any = await ApiService.getProvinces({
          country_id: 237,
          fq: 'country_id:237',
          limit: 100,
        });
        if (res?.ok && res?.data) {
          const items =
            res.data?.items ||
            res.data?.data ||
            (Array.isArray(res.data) ? res.data : []);
          setProvinces(items);
        }
      } catch (err) {
        console.log('fetchProvinces error:', err);
      } finally {
        setIsLoadingAreas(false);
      }
    };
    fetchProvinces();
  }, []);

  const filteredProvinces = provinces.filter((p: any) => {
    const name = p?.name || (typeof p === 'string' ? p : '');
    return name.toLowerCase().includes(searchArea.trim().toLowerCase());
  });

  const [movingRadius, setMovingRadius] = useState<string>(
    user?.personalization?.moving_radius
      ? `${user.personalization.moving_radius} Km`
      : ''
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Avatar state from image picker (giao diện & thư viện  )
  const [selectedAvatar, setSelectedAvatar] = useState<{
    uri: string;
    base64?: string;
    mime?: string;
  } | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

  const avatar =
    user?.avatar ||
    user?.personalization?.avatar ||
    user?.channels?.[0]?.avatar;
  const avatarSource = selectedAvatar?.uri
    ? { uri: selectedAvatar.uri }
    : avatar
      ? typeof avatar === 'string'
        ? { uri: avatar }
        : avatar
      : images.common.img_default;

  const handlePickAvatar = () => {
    setShowAvatarModal(true);
  };

  const handleCamera = () => {
    setShowAvatarModal(false);
    setTimeout(async () => {
      try {
        const image: any = await ImageCropPicker.openCamera({
          mediaType: 'photo',
          cropping: true,
          cropperCircleOverlay: true,
          includeBase64: true,
          compressImageQuality: 0.8,
          width: 600,
          height: 600,
        });
        if (image?.path) {
          setSelectedAvatar({
            uri: image.path,
            base64: image.data,
            mime: image.mime,
          });
        }
      } catch (error: any) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          console.log('🚀 ~ handleCamera ~ error:', error);
        }
      }
    }, 200);
  };

  const handlePhotoLibrary = () => {
    setShowAvatarModal(false);
    setTimeout(async () => {
      try {
        const image: any = await ImageCropPicker.openPicker({
          mediaType: 'photo',
          cropping: true,
          cropperCircleOverlay: true,
          includeBase64: true,
          compressImageQuality: 0.8,
          width: 600,
          height: 600,
        });
        if (image?.path) {
          setSelectedAvatar({
            uri: image.path,
            base64: image.data,
            mime: image.mime,
          });
        }
      } catch (error: any) {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          console.log('🚀 ~ handlePhotoLibrary ~ error:', error);
        }
      }
    }, 200);
  };

  const formatBytes = (bytes?: number | null, decimals = 1) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handlePickCertificate = async () => {
    const MAX_MB = 10;
    try {
      const results: DocumentPickerResponse[] = await pick({
        type: [
          types.doc,
          types.docx,
          types.pdf,
          types.images,
        ],
        allowMultiSelection: false,
      });

      if (!results || results.length === 0) return;

      const document = results[0];

      if (document.size) {
        const mbSize = document.size / (1024 * 1024);
        if (mbSize > MAX_MB) {
          Alert.alert('Thông báo', 'Tệp không được vượt quá 10MB');
          return;
        }
      }

      setCertificateFile({
        name: document.name || 'chung_chi_hanh_nghe.pdf',
        size: formatBytes(document.size),
        uri: document.uri,
        type: document.type || undefined,
      });
      setErrors(prev => ({ ...prev, certificateFile: undefined }));
    } catch (err: any) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err.code === 'DOCUMENT_PICKER_CANCELED' ||
          err.code === 'OPERATION_CANCELED')
      ) {
        return;
      }
      console.log('🚀 ~ handlePickCertificate ~ err:', err);
    }
  };

  const handleUpdateProfile = async () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!certificateFile) {
      newErrors.certificateFile = 'Vui lòng tải lên chứng chỉ hành nghề';
    }

    if (!certificateNumber.trim()) {
      newErrors.certificateNumber = 'Vui lòng bổ sung số CCHN';
    }

    // if (!workingArea || !workingArea.trim()) {
    //   newErrors.workingArea = 'Vui lòng chọn khu vực làm việc';
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const firstError =
        newErrors.fullName ||
        newErrors.certificateFile ||
        newErrors.certificateNumber ||
        newErrors.workingArea;

      Alert.alert(
        'Thông báo',
        firstError || 'Vui lòng điền đầy đủ các trường bắt buộc (*)',
      );

      if (newErrors.fullName) {
        scrollToField('fullName', 50, true);
      } else if (newErrors.certificateFile || newErrors.certificateNumber) {
        scrollToField('certificateNumber', 50, true);
      } else if (newErrors.workingArea) {
        scrollToField('movingRadius', 50, true);
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      // Format DOB to YYYY-MM-DD for backend API
      const formattedDob = dob
        ? moment(dob, ['DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss.SSSZ']).format('YYYY-MM-DD')
        : undefined;

      let genderVal = gender?.value;
      if (!genderVal && typeof gender === 'string') {
        const lower = gender.toLowerCase();
        if (lower === 'female' || lower === 'nữ') genderVal = 'Female';
        else if (lower === 'male' || lower === 'nam') genderVal = 'Male';
        else if (lower === 'undisclosed' || lower === 'khác') genderVal = 'Undisclosed';
      }

      const payload: any = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        position: position.trim(),
        specialization: specialization.trim(),
        certificateNumber: certificateNumber.trim(),
        experience: experience.trim(),
        workplace: workplace.trim(),
        workingArea,
      };

      if (genderVal) {
        payload.gender = genderVal; // 'Male', 'Female', or 'Undisclosed'
      }

      if (formattedDob && formattedDob !== 'Invalid date') {
        payload.dob = formattedDob;
      }

      if (certificateFile?.name) {
        payload.certificateFile = certificateFile.name;
      }

      const radiusNumber = parseFloat(movingRadius.replace(/[^0-9.]/g, ''));
      if (!isNaN(radiusNumber)) {
        payload.movingRadius = radiusNumber;
      }

      // Backend expects raw/pure Base64 string without data:image/...;base64, prefix
      if (selectedAvatar?.base64) {
        payload.avatar = selectedAvatar.base64.replace(/^data:image\/[a-z]+;base64,/, '');
      }

      console.log('🚀 ~ handleUpdateProfile ~ payload:', payload);

      const res: any = await ApiService.updateProfile(payload);
      console.log('🚀 ~ handleUpdateProfile ~ res:', res);

      if (res?.ok && (res?.status === 200 || res?.status === 201 || res?.status === 204)) {
        // Refresh user context in background
        dispatch(getProfile(null));

        Alert.alert('Thành công', 'Cập nhật hồ sơ cá nhân thành công!', [
          {
            text: 'Đồng ý',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        // Parse backend errors (e.g. status 400 with errors: [{key, msg}])
        let errorMsg = 'Cập nhật hồ sơ cá nhân thất bại. Vui lòng thử lại!';
        if (Array.isArray(res?.data?.errors) && res.data.errors.length > 0) {
          errorMsg = res.data.errors
            .map((e: any) => `${e.key ? e.key + ': ' : ''}${e.msg || e.message || 'Lỗi không xác định'}`)
            .join('\n');
        } else if (res?.data?.message) {
          errorMsg = res.data.message;
        } else if (res?.data?.error) {
          errorMsg = res.data.error;
        } else if (res?.problem) {
          errorMsg = `Lỗi kết nối máy chủ (${res.problem})`;
        }

        Alert.alert('Thất bại', errorMsg);
      }
    } catch (error: any) {
      console.log('🚀 ~ handleUpdateProfile ~ error:', error);
      Alert.alert(
        'Thất bại',
        error?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ cá nhân. Vui lòng thử lại!'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper safeTop style={styles.container} statusBarStyle="dark-content">
      {/* Top Header */}
      <View style={[styles.headerBar, { paddingTop: Platform.OS === 'android' ? 6 : 0 }]}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <IconX
            type="ionicons"
            name="chevron-back"
            size={24}
            color="#1D2939"
          />
        </TouchableOpacity>

        <CText style={styles.headerTitle}>Sửa hồ sơ cá nhân</CText>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <CKeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          onLayout={onScrollViewLayout}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: contentPaddingBottom },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarWrap}
              activeOpacity={0.8}
              onPress={handlePickAvatar}
            >
              <ImageHelper
                source={avatarSource}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={handlePickAvatar}>
              <CText style={styles.editAvatarText}>Chỉnh sửa đại diện</CText>
            </TouchableOpacity>
          </View>

          {/* 1. Họ và tên */}
          <CInput
            label="Họ và tên"
            placeHolder="Nhập họ và tên"
            value={fullName}
            onChange={val => {
              setFullName(val);
              if (errors.fullName) {
                setErrors(prev => ({ ...prev, fullName: undefined }));
              }
            }}
            errorText={errors.fullName}
            autoCapitalize="words"
            isRequire
            {...registerInput('fullName')}
          />

          {/* 2. Giới tính */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.label}>Giới tính</CText>
            </View>
            <TouchableOpacity
              style={styles.selectBox}
              activeOpacity={0.7}
              onPress={() => setShowGenderModal(true)}
            >
              <CText
                style={
                  (gender?.name || (typeof gender === 'string' && gender))
                    ? styles.selectText
                    : styles.placeholderText
                }
              >
                {gender?.name || (typeof gender === 'string' ? gender : '') || 'Chọn giới tính'}
              </CText>
              <IconX
                type="ionicons"
                name="chevron-down"
                size={18}
                color="#667085"
              />
            </TouchableOpacity>
          </View>

          {/* 3. Ngày sinh */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.label}>Ngày sinh</CText>
            </View>
            <TouchableOpacity
              style={styles.selectBox}
              activeOpacity={0.7}
              onPress={() => setShowDobModal(true)}
            >
              <CText style={dob ? styles.selectText : styles.placeholderText}>
                {dob || 'Chọn ngày sinh'}
              </CText>
              <IconX
                type="ionicons"
                name="calendar-outline"
                size={18}
                color="#667085"
              />
            </TouchableOpacity>
          </View>

          {/* 4. Số điện thoại */}
          <CInput
            label="Số điện thoại"
            placeHolder="Nhập số điện thoại"
            value={phone}
            onChange={setPhone}
            keyboardType="phone-pad"
            maxLength={15}
            {...registerInput('phone')}
          />

          {/* 5. Email */}
          <CInput
            label="Email"
            placeHolder="Nhập email"
            value={email}
            onChange={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            {...registerInput('email')}
          />

          {/* 6. Học hàm / Chức vị */}
          <CInput
            label="Học hàm / Chức vị"
            placeHolder="Nhập học hàm / chức vị"
            value={position}
            onChange={setPosition}
            {...registerInput('position')}
          />

          {/* 7. Chuyên khoa */}
          <CInput
            label="Chuyên khoa"
            placeHolder="Nhập chuyên khoa"
            value={specialization}
            onChange={setSpecialization}
            {...registerInput('specialization')}
          />

          {/* 8. Chứng chỉ Hành Nghề * */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.label}>Chứng chỉ Hành Nghề</CText>
              <CText style={styles.requiredMark}>*</CText>
            </View>
            {certificateFile ? (
              <View style={styles.attachmentCard}>
                <View style={styles.attachmentLeft}>
                  <IconX
                    type="ionicons"
                    name="document-text-outline"
                    size={18}
                    color="#667085"
                  />
                  <CText style={styles.attachmentName} numberOfLines={1}>
                    {certificateFile.name} ({certificateFile.size})
                  </CText>
                </View>
                <TouchableOpacity
                  style={styles.removeAttachmentBtn}
                  activeOpacity={0.7}
                  onPress={() => setCertificateFile(null)}
                >
                  <IconX
                    type="ionicons"
                    name="close-outline"
                    size={20}
                    color="#667085"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.uploadEmptyCard,
                  errors.certificateFile ? styles.borderError : null,
                ]}
                activeOpacity={0.7}
                onPress={handlePickCertificate}
              >
                <IconX
                  type="ionicons"
                  name="cloud-upload-outline"
                  size={19}
                  color={errors.certificateFile ? '#F04438' : '#19A2A7'}
                />
                <CText
                  style={[
                    styles.uploadEmptyText,
                    errors.certificateFile && { color: '#F04438' },
                  ]}
                >
                  Tải lên chứng chỉ hành nghề (PNG, JPG, PDF)
                </CText>
              </TouchableOpacity>
            )}
            {errors.certificateFile ? (
              <CText style={styles.errorHelperText}>
                {errors.certificateFile}
              </CText>
            ) : null}
          </View>

          {/* 9. Số chứng chỉ Hành Nghề * */}
          <CInput
            label="Số chứng chỉ Hành Nghề"
            placeHolder="Bổ sung số CCHN"
            value={certificateNumber}
            onChange={val => {
              setCertificateNumber(val);
              if (errors.certificateNumber) {
                setErrors(prev => ({ ...prev, certificateNumber: undefined }));
              }
            }}
            errorText={errors.certificateNumber}
            isRequire
            {...registerInput('certificateNumber')}
          />

          {/* 10. Kinh nghiệm làm việc */}
          <CInput
            label="Kinh nghiệm làm việc"
            placeHolder="Nhập kinh nghiệm làm việc (ví dụ: 2 năm)"
            value={experience}
            onChange={setExperience}
            {...registerInput('experience')}
          />

          {/* 11. Nơi công tác */}
          <CInput
            label="Nơi công tác"
            placeHolder="Nhập nơi công tác"
            value={workplace}
            onChange={setWorkplace}
            {...registerInput('workplace')}
          />

          {/* 12. Khu vực làm việc * */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <CText style={styles.label}>Khu vực làm việc</CText>
              <CText style={styles.requiredMark}>*</CText>
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
                style={workingArea ? styles.selectText : styles.placeholderText}
              >
                {workingArea || 'Chọn khu vực làm việc'}
              </CText>
              <IconX
                type="ionicons"
                name="chevron-down"
                size={18}
                color="#667085"
              />
            </TouchableOpacity>
            {errors.workingArea ? (
              <CText style={styles.errorHelperText}>
                {errors.workingArea}
              </CText>
            ) : null}
          </View>

          {/* 13. Bán kính sẵn sàng di chuyển (phục vụ) */}
          <CInput
            label="Bán kính sẵn sàng di chuyển (phục vụ)"
            placeHolder="Nhập bán kính (ví dụ: 8 Km)"
            value={movingRadius}
            onChange={setMovingRadius}
            {...registerInput('movingRadius')}
          />
        </ScrollView>

        {/* Fixed Bottom Action Bar */}
        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom: isKeyboardVisible
                ? 10
                : insets.bottom > 0
                  ? insets.bottom
                  : 16,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormValid || isSubmitting) && { opacity: 0.65 },
            ]}
            activeOpacity={0.8}
            onPress={handleUpdateProfile}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <CText style={styles.submitButtonText}>Cập nhật</CText>
            )}
          </TouchableOpacity>
        </View>
      </CKeyboardAvoidingView>

      {/* Gender Selection Modal*/}
      {showGenderModal && (
        <ModalGender
          isVisible={showGenderModal}
          hideModal={() => setShowGenderModal(false)}
          chooseGender={(selected: any) => {
            setGender(selected);
          }}
          genderChoose={gender}
        />
      )}

      {/* Working Area Selection Modal */}
      <Modal
        visible={showAreaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowAreaModal(false);
          setSearchArea('');
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            setShowAreaModal(false);
            setSearchArea('');
          }}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <CText style={styles.modalTitle}>Chọn khu vực làm việc</CText>

            <View style={styles.searchContainer}>
              <IconX type="ionicons" name="search" size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm tỉnh, thành phố..."
                placeholderTextColor="#94A3B8"
                value={searchArea}
                onChangeText={setSearchArea}
                clearButtonMode="while-editing"
              />
              {searchArea.length > 0 && Platform.OS === 'android' && (
                <TouchableOpacity onPress={() => setSearchArea('')}>
                  <IconX type="ionicons" name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {isLoadingAreas ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#19A2A7" />
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {filteredProvinces.map((item: any) => {
                  const name = item?.name || item;
                  const key = item?.id || name;
                  const isSelected = workingArea === name;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.modalItemRow}
                      activeOpacity={0.7}
                      onPress={() => {
                        setWorkingArea(name);
                        setErrors(prev => ({ ...prev, workingArea: undefined }));
                        setShowAreaModal(false);
                        setSearchArea('');
                      }}
                    >
                      <CText
                        style={
                          isSelected
                            ? styles.modalItemTextActive
                            : styles.modalItemText
                        }
                      >
                        {name}
                      </CText>
                      {isSelected && (
                        <IconX
                          type="ionicons"
                          name="checkmark"
                          size={20}
                          color="#19A2A7"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Date of Birth Picker Modal */}
      <CDatePicker
        isModalVisible={showDobModal}
        dateTimeValue={dob}
        closeModal={() => setShowDobModal(false)}
        onChangeDate={(selectedDate: Date) => {
          setDob(moment(selectedDate).format('DD/MM/YYYY'));
        }}
      />

      {/* Avatar Picker Modal (In-screen overlay to prevent iOS Modal dismiss freeze) */}
      {showAvatarModal && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowAvatarModal(false)}
          >
            <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
              <View style={styles.modalHandle} />
              <CText style={styles.modalTitle}>Ảnh đại diện</CText>

              <TouchableOpacity
                style={styles.modalOptionRow}
                activeOpacity={0.7}
                onPress={handleCamera}
              >
                <View style={styles.modalOptionIconBox}>
                  <IconX
                    type="ionicons"
                    name="camera-outline"
                    size={24}
                    color="#19A2A7"
                  />
                </View>
                <CText style={styles.modalOptionText}>Chụp ảnh mới</CText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOptionRow}
                activeOpacity={0.7}
                onPress={handlePhotoLibrary}
              >
                <View style={styles.modalOptionIconBox}>
                  <IconX
                    type="ionicons"
                    name="images-outline"
                    size={24}
                    color="#19A2A7"
                  />
                </View>
                <CText style={styles.modalOptionText}>Chọn từ thư viện</CText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOptionCancelBtn}
                activeOpacity={0.7}
                onPress={() => setShowAvatarModal(false)}
              >
                <CText style={styles.modalOptionCancelText}>Huỷ</CText>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </View>
      )}
    </Wrapper>
  );
};

export default EditProfileScreen;
