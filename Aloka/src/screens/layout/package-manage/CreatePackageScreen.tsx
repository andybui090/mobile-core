import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CKeyboardAvoidingView, IconX, ToggleSwitch, Wrapper } from '@/components';
import ImagePicker from 'react-native-image-crop-picker';
import { images } from '@/configs';
import { formatMoneyVND } from '@/configs/common';
import { CText, Row } from '@/utils';

const GROUP_OPTIONS = [
  'Chăm sóc mẹ & bé',
  'Điều dưỡng tại nhà',
  'Khám bệnh tại nhà',
  'Phục hồi chức năng',
  'Chăm sóc người cao tuổi',
  'Vật lý trị liệu',
];

const DURATION_OPTIONS = ['30 phút', '45 phút', '60 phút', '90 phút', '120 phút'];

const WEEKLY_SESSIONS = [
  { label: '1 buổi/tuần', value: 1 },
  { label: '2 buổi/tuần', value: 2 },
  { label: '3 buổi/tuần', value: 3 },
  { label: '4 buổi/tuần', value: 4 },
  { label: '5 buổi/tuần', value: 5 },
];

const MONTHLY_SESSIONS = [
  { label: '4 buổi/tháng', value: 4 },
  { label: '8 buổi/tháng', value: 8 },
  { label: '12 buổi/tháng', value: 12 },
  { label: '16 buổi/tháng', value: 16 },
  { label: '20 buổi/tháng', value: 20 },
];

const DISCOUNT_OPTIONS = [
  { label: '0%', value: 0 },
  { label: '5%', value: 5 },
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
  { label: '20%', value: 20 },
  { label: '25%', value: 25 },
];

export const CreatePackageScreen: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    theme: { colors },
  } = useTheme();

  // Form State
  const [photos, setPhotos] = useState<any[]>([]);
  const [packageName, setPackageName] = useState('');
  const [serviceGroup, setServiceGroup] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [locationType, setLocationType] = useState<'home' | 'clinic'>('home');
  const [priceStr, setPriceStr] = useState('');

  // Booking formats
  const [allowSingle, setAllowSingle] = useState(false);

  const [allowWeekly, setAllowWeekly] = useState(false);
  const [weeklySessions, setWeeklySessions] = useState(2);
  const [weeklyDiscount, setWeeklyDiscount] = useState(5);

  const [allowMonthly, setAllowMonthly] = useState(false);
  const [monthlySessions, setMonthlySessions] = useState(8);
  const [monthlyDiscount, setMonthlyDiscount] = useState(10);

  // Expand advanced info
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Picker Modal State
  const [modalType, setModalType] = useState<
    'group' | 'duration' | 'weeklySession' | 'weeklyDiscount' | 'monthlySession' | 'monthlyDiscount' | null
  >(null);

  // Keyboard visibility listener
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const basePrice = parseInt(priceStr.replace(/\D/g, ''), 10) || 0;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handlePickImages = async () => {
    try {
      const remaining = 5 - photos.length;
      if (remaining <= 0) {
        Alert.alert(t('common.notice', 'Thông báo'), 'Bạn chỉ có thể chọn tối đa 5 ảnh');
        return;
      }
      const selected: any = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        maxFiles: remaining,
        compressImageQuality: 0.8,
      });

      if (Array.isArray(selected)) {
        const newPhotos = selected.map(img => ({ uri: img.path }));
        setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
      } else if (selected?.path) {
        setPhotos(prev => [...prev, { uri: selected.path }].slice(0, 5));
      }
    } catch (err: any) {
      if (err?.code !== 'E_PICKER_CANCELLED') {
        console.log('ImagePicker error:', err);
      }
    }
  };

  // Validate and proceed to Step 2 Preview Screen
  const handlePreview = () => {
    if (!packageName.trim()) {
      Alert.alert(t('common.notice', 'Thông báo'), 'Vui lòng nhập tên dịch vụ');
      return;
    }
    if (!serviceGroup.trim()) {
      Alert.alert(t('common.notice', 'Thông báo'), 'Vui lòng chọn nhóm dịch vụ');
      return;
    }
    if (!description.trim()) {
      Alert.alert(t('common.notice', 'Thông báo'), 'Vui lòng nhập mô tả ngắn về dịch vụ');
      return;
    }
    if (!duration) {
      Alert.alert(t('common.notice', 'Thông báo'), 'Vui lòng chọn thời lượng 1 buổi');
      return;
    }
    if (!basePrice || basePrice <= 0) {
      Alert.alert(t('common.notice', 'Thông báo'), 'Vui lòng nhập giá 1 buổi hợp lệ');
      return;
    }
    if (!allowSingle && !allowWeekly && !allowMonthly) {
      Alert.alert(t('common.notice', 'Thông báo'), 'Vui lòng bật ít nhất 1 hình thức đặt dịch vụ');
      return;
    }

    navigation.navigate('PreviewPackageScreen', {
      packageData: {
        packageName,
        serviceGroup,
        description,
        duration,
        locationType,
        basePrice,
        photos,
        allowSingle,
        allowWeekly,
        weeklySessions,
        weeklyDiscount,
        allowMonthly,
        monthlySessions,
        monthlyDiscount,
      },
    });
  };

  const handlePriceChange = (text: string) => {
    const raw = text.replace(/\D/g, '');
    setPriceStr(raw);
  };

  const displayPriceInput = basePrice > 0 ? formatMoneyVND(basePrice, '.') : '';

  // Render Pickers Modal
  const renderPickerModal = () => {
    if (!modalType) return null;

    let title = '';
    let items: { label: string; value: any }[] = [];
    let onSelect = (val: any) => { };

    if (modalType === 'group') {
      title = 'Chọn nhóm dịch vụ';
      items = GROUP_OPTIONS.map(g => ({ label: g, value: g }));
      onSelect = val => setServiceGroup(val);
    } else if (modalType === 'duration') {
      title = 'Chọn thời lượng 1 buổi';
      items = DURATION_OPTIONS.map(d => ({ label: d, value: d }));
      onSelect = val => setDuration(val);
    } else if (modalType === 'weeklySession') {
      title = 'Chọn số buổi/tuần';
      items = WEEKLY_SESSIONS;
      onSelect = val => setWeeklySessions(val);
    } else if (modalType === 'weeklyDiscount') {
      title = 'Chọn giảm giá so với đặt lẻ';
      items = DISCOUNT_OPTIONS;
      onSelect = val => setWeeklyDiscount(val);
    } else if (modalType === 'monthlySession') {
      title = 'Chọn số buổi/tháng';
      items = MONTHLY_SESSIONS;
      onSelect = val => setMonthlySessions(val);
    } else if (modalType === 'monthlyDiscount') {
      title = 'Chọn giảm giá so với đặt lẻ';
      items = DISCOUNT_OPTIONS;
      onSelect = val => setMonthlyDiscount(val);
    }

    return (
      <Modal transparent animationType="fade" visible={Boolean(modalType)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalType(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CText h4 w600 color="#101828">
                {title}
              </CText>
              <TouchableOpacity
                onPress={() => setModalType(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconX type="ionicons" name="close" size={24} color="#667085" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 320 }}>
              {items.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item.value);
                    setModalType(null);
                  }}
                >
                  <CText h5 color="#101828">
                    {item.label}
                  </CText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <Wrapper style={styles.container}>
      {/* SCREEN HEADER */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerNavRow}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <IconX type="ionicons" name="chevron-back" size={24} color="#101828" />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <CText style={styles.headerMainTitle}>Tạo dịch vụ / gói</CText>
            <CText style={styles.headerSubTitle} numberOfLines={1}>
              Chỉ cần vài thông tin cơ bản là bạn đã có thể tạo dịch vụ
            </CText>
          </View>
        </View>
      </View>

      {/* CONTENT AREA */}
      <CKeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Ảnh đại diện dịch vụ */}
          <View style={{ marginBottom: 16 }}>
            <View style={styles.fieldRow}>
              <View style={[styles.badgeIcon, { backgroundColor: '#ECFDF3' }]}>
                <IconX type="ionicons" name="images-outline" size={18} color="#12B76A" />
              </View>
              <View style={styles.fieldContent}>
                <CText style={styles.fieldLabel}>Ảnh đại diện dịch vụ</CText>
                <CText style={styles.fieldSub}>
                  Đăng tải hình ảnh rõ ràng, thu hút khách hàng
                </CText>
              </View>
            </View>

            {/* Gallery Collage Layout */}
            {photos.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyAddPhotoBox}
                activeOpacity={0.7}
                onPress={handlePickImages}
              >
                <IconX type="ionicons" name="camera" size={28} color="#344054" />
                <CText style={styles.addPhotoText}>Thêm ảnh</CText>
                <CText style={styles.addPhotoSub}>(Tối đa 5 ảnh)</CText>
              </TouchableOpacity>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 10 }}
              >
                {/* 1. Ảnh bìa (Cover photo - rộng) */}
                <View style={styles.coverCollageWrap}>
                  <Image
                    source={photos[0]?.uri ? { uri: photos[0].uri } : photos[0]}
                    style={styles.coverCollageImg}
                    resizeMode="cover"
                  />
                  <View style={styles.coverBadgeWhite}>
                    <IconX
                      type="ionicons"
                      name="image-outline"
                      size={12}
                      color="#344054"
                      style={{ marginRight: 4 }}
                    />
                    <CText style={styles.coverBadgeTextDark}>Ảnh bìa</CText>
                  </View>
                  <TouchableOpacity
                    style={styles.deletePhotoBtn}
                    activeOpacity={0.7}
                    onPress={() => setPhotos(prev => prev.filter((_, i) => i !== 0))}
                  >
                    <IconX type="ionicons" name="close" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* 2. Cột giữa: Nếu có từ 2 ảnh */}
                {photos.length > 1 && (
                  photos[2] ? (
                    /* Nếu có đủ ảnh 2 và 3 -> hiển thị 2 ảnh nhỏ xếp chồng */
                    <View style={styles.stackedCol}>
                      <View style={styles.stackedThumbWrap}>
                        <Image
                          source={photos[1]?.uri ? { uri: photos[1].uri } : photos[1]}
                          style={styles.thumbnailImg}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.deletePhotoBtnSmall}
                          activeOpacity={0.7}
                          onPress={() => setPhotos(prev => prev.filter((_, i) => i !== 1))}
                        >
                          <IconX type="ionicons" name="close" size={10} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.stackedThumbWrap}>
                        <Image
                          source={photos[2]?.uri ? { uri: photos[2].uri } : photos[2]}
                          style={styles.thumbnailImg}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.deletePhotoBtnSmall}
                          activeOpacity={0.7}
                          onPress={() => setPhotos(prev => prev.filter((_, i) => i !== 2))}
                        >
                          <IconX type="ionicons" name="close" size={10} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    /* Trường hợp chỉ có đúng 2 ảnh: Ảnh thứ 2 hiển thị trọn vẹn chiều cao 140px đồng bộ */
                    <View style={styles.singleThumbWrap}>
                      <Image
                        source={photos[1]?.uri ? { uri: photos[1].uri } : photos[1]}
                        style={styles.thumbnailImg}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.deletePhotoBtn}
                        activeOpacity={0.7}
                        onPress={() => setPhotos(prev => prev.filter((_, i) => i !== 1))}
                      >
                        <IconX type="ionicons" name="close" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  )
                )}

                {/* 3. Cột tiếp theo: photos[3] & photos[4] nếu có */}
                {photos.length > 3 && (
                  photos[4] ? (
                    <View style={styles.stackedCol}>
                      <View style={styles.stackedThumbWrap}>
                        <Image
                          source={photos[3]?.uri ? { uri: photos[3].uri } : photos[3]}
                          style={styles.thumbnailImg}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.deletePhotoBtnSmall}
                          activeOpacity={0.7}
                          onPress={() => setPhotos(prev => prev.filter((_, i) => i !== 3))}
                        >
                          <IconX type="ionicons" name="close" size={10} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.stackedThumbWrap}>
                        <Image
                          source={photos[4]?.uri ? { uri: photos[4].uri } : photos[4]}
                          style={styles.thumbnailImg}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.deletePhotoBtnSmall}
                          activeOpacity={0.7}
                          onPress={() => setPhotos(prev => prev.filter((_, i) => i !== 4))}
                        >
                          <IconX type="ionicons" name="close" size={10} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    /* Nếu có 4 ảnh: Ảnh 4 hiển thị full chiều cao */
                    <View style={styles.singleThumbWrap}>
                      <Image
                        source={photos[3]?.uri ? { uri: photos[3].uri } : photos[3]}
                        style={styles.thumbnailImg}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.deletePhotoBtn}
                        activeOpacity={0.7}
                        onPress={() => setPhotos(prev => prev.filter((_, i) => i !== 3))}
                      >
                        <IconX type="ionicons" name="close" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  )
                )}

                {/* 4. Hộp Thêm ảnh (nếu chưa đủ 5 ảnh) */}
                {photos.length < 5 && (
                  <TouchableOpacity
                    style={styles.addPhotoBoxCollage}
                    activeOpacity={0.7}
                    onPress={handlePickImages}
                  >
                    <IconX type="ionicons" name="camera" size={24} color="#1D2939" />
                    <CText style={styles.addPhotoText}>Thêm ảnh</CText>
                    <CText style={styles.addPhotoSub}>(Tối đa 5 ảnh)</CText>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>

          {/* Tên dịch vụ */}
          <View style={styles.fieldRow}>
            <View style={[styles.badgeIcon, { backgroundColor: '#EFF8FF' }]}>
              <IconX type="ionicons" name="person-outline" size={18} color="#2E90FA" />
            </View>
            <View style={styles.fieldContent}>
              <Row start>
                <CText style={styles.fieldLabel}>Tên dịch vụ</CText>
                <CText style={styles.requiredStar}>*</CText>
              </Row>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên dịch vụ"
                placeholderTextColor="#98A2B3"
                value={packageName}
                onChangeText={setPackageName}
                maxLength={100}
              />
              <CText style={styles.counterText}>{packageName.length}/100</CText>
            </View>
          </View>

          {/* Nhóm dịch vụ */}
          <View style={styles.fieldRow}>
            <View style={[styles.badgeIcon, { backgroundColor: '#FEF6EE' }]}>
              <IconX type="ionicons" name="folder-outline" size={18} color="#F79009" />
            </View>
            <View style={styles.fieldContent}>
              <Row start>
                <CText style={styles.fieldLabel}>Nhóm dịch vụ</CText>
                <CText style={styles.requiredStar}>*</CText>
              </Row>
              <TouchableOpacity
                style={styles.dropdownBtn}
                activeOpacity={0.7}
                onPress={() => setModalType('group')}
              >
                <CText style={serviceGroup ? styles.dropdownVal : styles.dropdownPlaceholder}>
                  {serviceGroup || 'Chọn nhóm dịch vụ'}
                </CText>
                <IconX type="ionicons" name="chevron-down" size={18} color="#667085" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Mô tả ngắn */}
          <View style={styles.fieldRow}>
            <View style={[styles.badgeIcon, { backgroundColor: '#EFF8FF' }]}>
              <IconX type="ionicons" name="document-text-outline" size={18} color="#2E90FA" />
            </View>
            <View style={styles.fieldContent}>
              <Row start>
                <CText style={styles.fieldLabel}>Mô tả ngắn</CText>
                <CText style={styles.requiredStar}>*</CText>
              </Row>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Nhập mô tả ngắn về dịch vụ..."
                placeholderTextColor="#98A2B3"
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
              />
              <CText style={styles.counterText}>{description.length}/500</CText>
            </View>
          </View>

          {/* Thời lượng & Địa điểm */}
          <View style={styles.twoColRow}>
            {/* Cột trái: Thời lượng */}
            <View style={{ flex: 1, marginRight: 8 }}>
              <Row start style={{ marginBottom: 4 }}>
                <View style={[styles.badgeIconSmall, { backgroundColor: '#FEF6EE' }]}>
                  <IconX type="ionicons" name="time-outline" size={16} color="#F79009" />
                </View>
                <CText style={styles.fieldLabelSmall}>Thời lượng 1 buổi</CText>
                <CText style={styles.requiredStar}>*</CText>
              </Row>
              <TouchableOpacity
                style={styles.dropdownBtn}
                activeOpacity={0.7}
                onPress={() => setModalType('duration')}
              >
                <CText
                  numberOfLines={1}
                  style={duration ? styles.dropdownVal : styles.dropdownPlaceholder}
                >
                  {duration || '60 phút'}
                </CText>
                <IconX type="ionicons" name="chevron-down" size={18} color="#667085" />
              </TouchableOpacity>
            </View>

            {/* Cột phải: Địa điểm */}
            <View style={{ flex: 1.35, marginLeft: 8 }}>
              <Row start style={{ marginBottom: 4 }}>
                <View style={[styles.badgeIconSmall, { backgroundColor: '#FDF2FA' }]}>
                  <IconX type="ionicons" name="location-outline" size={16} color="#EE46BC" />
                </View>
                <CText style={styles.fieldLabelSmall}>Địa điểm thực hiện</CText>
                <CText style={styles.requiredStar}>*</CText>
              </Row>
              <View style={styles.radioRow}>
                <TouchableOpacity
                  style={styles.radioItem}
                  activeOpacity={0.7}
                  onPress={() => setLocationType('home')}
                >
                  <View
                    style={
                      locationType === 'home'
                        ? styles.radioCircleActive
                        : styles.radioCircle
                    }
                  >
                    {locationType === 'home' && <View style={styles.radioDot} />}
                  </View>
                  <CText style={styles.radioLabel}>Tại nhà</CText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.radioItem, { marginLeft: 12 }]}
                  activeOpacity={0.7}
                  onPress={() => setLocationType('clinic')}
                >
                  <View
                    style={
                      locationType === 'clinic'
                        ? styles.radioCircleActive
                        : styles.radioCircle
                    }
                  >
                    {locationType === 'clinic' && <View style={styles.radioDot} />}
                  </View>
                  <CText style={styles.radioLabel}>Tại phòng khám</CText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Giá 1 buổi */}
          <View style={styles.fieldRow}>
            <View style={[styles.badgeIcon, { backgroundColor: '#FEF6EE' }]}>
              <IconX type="antdesign" name="dollar-circle" size={18} color="#F79009" />
            </View>
            <View style={styles.fieldContent}>
              <Row start>
                <CText style={styles.fieldLabel}>Giá 1 buổi (VNĐ)</CText>
                <CText style={styles.requiredStar}>*</CText>
              </Row>
              <TextInput
                style={styles.input}
                placeholder="300.000"
                placeholderTextColor="#98A2B3"
                value={displayPriceInput}
                onChangeText={handlePriceChange}
                keyboardType="numeric"
              />
              <CText style={styles.hintText}>
                Giá này sẽ được áp dụng cho hình thức đặt 1 buổi
              </CText>
            </View>
          </View>

          {/* DIVIDER TRƯỚC HÌNH THỨC ĐẶT DỊCH VỤ */}
          <View style={styles.sectionDivider} />

          {/* Hình thức đặt dịch vụ */}
          <View style={{ marginBottom: 16 }}>
            <View style={styles.fieldRow}>
              <View style={[styles.badgeIcon, { backgroundColor: '#ECFDF3' }]}>
                <IconX type="ionicons" name="gift-outline" size={18} color="#12B76A" />
              </View>
              <View style={styles.fieldContent}>
                <CText style={styles.fieldLabel}>Hình thức đặt dịch vụ</CText>
                <CText style={styles.fieldSub}>
                  Chọn các hình thức bạn muốn cung cấp cho khách hàng
                </CText>
              </View>
            </View>

            {/* Đặt 1 buổi - SOFT PINK TINT */}
            <View style={styles.optionBoxPink}>
              <Row between>
                <Row start style={{ flex: 1 }}>
                  <View style={[styles.badgeIcon, { backgroundColor: '#FEE4E2' }]}>
                    <IconX type="ionicons" name="calendar-outline" size={16} color="#F04438" />
                  </View>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <CText style={styles.optionTitle}>Đặt 1 buổi</CText>
                    <CText style={styles.optionDesc}>
                      Khách hàng có thể đặt lẻ từng buổi
                    </CText>
                  </View>
                </Row>
                <ToggleSwitch
                  isOn={allowSingle}
                  onToggle={setAllowSingle}
                  onColor="#19A2A7"
                  offColor="#D0D5DD"
                  size="basic"
                />
              </Row>
            </View>

            {/* Đặt theo tuần - SOFT BLUE TINT */}
            <View style={styles.optionBoxBlue}>
              <Row between>
                <Row start style={{ flex: 1 }}>
                  <View style={[styles.badgeIcon, { backgroundColor: '#D1E9FF' }]}>
                    <IconX type="ionicons" name="calendar-outline" size={16} color="#175CD3" />
                  </View>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <CText style={styles.optionTitle}>Đặt theo tuần</CText>
                    <CText style={styles.optionDesc}>
                      Khách hàng đặt nhiều buổi theo tuần để tiện theo dõi
                    </CText>
                  </View>
                </Row>
                <ToggleSwitch
                  isOn={allowWeekly}
                  onToggle={setAllowWeekly}
                  onColor="#19A2A7"
                  offColor="#D0D5DD"
                  size="basic"
                />
              </Row>
              {allowWeekly && (
                <View style={styles.subOptionRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <CText style={styles.subOptionLabel}>Số buổi/tuần</CText>
                    <TouchableOpacity
                      style={styles.dropdownBtnWhite}
                      activeOpacity={0.7}
                      onPress={() => setModalType('weeklySession')}
                    >
                      <CText style={styles.dropdownValSmall}>
                        {weeklySessions} buổi/tuần
                      </CText>
                      <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <CText style={styles.subOptionLabel}>Giảm giá so với đặt lẻ</CText>
                    <TouchableOpacity
                      style={styles.dropdownBtnWhite}
                      activeOpacity={0.7}
                      onPress={() => setModalType('weeklyDiscount')}
                    >
                      <CText style={styles.dropdownValSmall}>{weeklyDiscount}%</CText>
                      <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Đặt theo tháng - SOFT GREEN TINT */}
            <View style={styles.optionBoxGreen}>
              <Row between>
                <Row start style={{ flex: 1 }}>
                  <View style={[styles.badgeIcon, { backgroundColor: '#D1FADF' }]}>
                    <IconX type="ionicons" name="calendar-outline" size={16} color="#12B76A" />
                  </View>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <CText style={styles.optionTitle}>Đặt theo tháng</CText>
                    <CText style={styles.optionDesc}>
                      Khách hàng đặt gói nhiều buổi theo tháng với ưu đãi tốt hơn
                    </CText>
                  </View>
                </Row>
                <ToggleSwitch
                  isOn={allowMonthly}
                  onToggle={setAllowMonthly}
                  onColor="#19A2A7"
                  offColor="#D0D5DD"
                  size="basic"
                />
              </Row>
              {allowMonthly && (
                <View style={styles.subOptionRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <CText style={styles.subOptionLabel}>Số buổi/tháng</CText>
                    <TouchableOpacity
                      style={styles.dropdownBtnWhite}
                      activeOpacity={0.7}
                      onPress={() => setModalType('monthlySession')}
                    >
                      <CText style={styles.dropdownValSmall}>
                        {monthlySessions} buổi/tháng
                      </CText>
                      <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <CText style={styles.subOptionLabel}>Giảm giá so với đặt lẻ</CText>
                    <TouchableOpacity
                      style={styles.dropdownBtnWhite}
                      activeOpacity={0.7}
                      onPress={() => setModalType('monthlyDiscount')}
                    >
                      <CText style={styles.dropdownValSmall}>{monthlyDiscount}%</CText>
                      <IconX type="ionicons" name="chevron-down" size={16} color="#667085" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Thông tin nâng cao */}
          <TouchableOpacity
            style={styles.advancedTrigger}
            activeOpacity={0.8}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Row between>
              <Row start style={{ flex: 1 }}>
                <View style={[styles.badgeIcon, { backgroundColor: '#F2F4F7' }]}>
                  <IconX type="ionicons" name="settings-outline" size={16} color="#475467" />
                </View>
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <CText style={styles.fieldLabel}>Thông tin nâng cao (Tùy chọn)</CText>
                  <CText style={styles.fieldSub} numberOfLines={1}>
                    Quyền lợi chi tiết, đối tượng phù hợp, lưu ý, chính sách đổi lịch...
                  </CText>
                </View>
              </Row>
              <IconX
                type="ionicons"
                name={showAdvanced ? 'chevron-up' : 'chevron-forward'}
                size={20}
                color="#667085"
              />
            </Row>

            {showAdvanced && (
              <View style={styles.advancedWrap}>
                <CText style={styles.advancedNote}>
                  Các thông tin bổ sung sẽ được hiển thị trên trang chi tiết dịch vụ để khách hàng hiểu rõ quyền lợi.
                </CText>
                <View style={styles.advancedItem}>
                  <CText style={styles.advancedTitle}>✓ Dịch vụ bao gồm:</CText>
                  <CText style={styles.advancedText}>
                    • Chăm sóc sức khỏe mẹ sau sinh{'\n'}
                    • Hỗ trợ tắm bé, vệ sinh, massage{'\n'}
                    • Tư vấn dinh dưỡng cho mẹ và bé{'\n'}
                    • Theo dõi sự phát triển của bé
                  </CText>
                </View>
                <View style={styles.advancedItem}>
                  <CText style={styles.advancedTitle}>👥 Đối tượng phù hợp:</CText>
                  <CText style={styles.advancedText}>Mẹ sau sinh, trẻ sơ sinh</CText>
                </View>
                <View style={styles.advancedItem}>
                  <CText style={styles.advancedTitle}>ⓘ Lưu ý:</CText>
                  <CText style={styles.advancedText}>Nên đặt lịch trước ít nhất 1 ngày</CText>
                </View>
                <View style={styles.advancedItem}>
                  <CText style={styles.advancedTitle}>🔄 Chính sách đổi lịch:</CText>
                  <CText style={styles.advancedText}>Hỗ trợ đổi lịch trước 12 tiếng</CText>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Sticky Bottom Button */}
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
            style={styles.previewBtn}
            activeOpacity={0.85}
            onPress={handlePreview}
          >
            <IconX type="ionicons" name="eye" size={20} color="#FFFFFF" />
            <CText style={styles.previewBtnText}>Xem trước dịch vụ</CText>
          </TouchableOpacity>
        </View>
      </CKeyboardAvoidingView>

      {/* RENDER MODAL SELECTION */}
      {renderPickerModal()}
    </Wrapper>
  );
};

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    // Unified Header
    headerContainer: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F2F4F7',
    },
    headerNavRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backBtn: {
      padding: 4,
      marginRight: 8,
    },
    headerTextWrap: {
      flex: 1,
    },
    headerMainTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#101828',
    },
    headerSubTitle: {
      fontSize: 11,
      color: '#667085',
      marginTop: 2,
      lineHeight: 15,
    },
    previewActionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    draftBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#D0D5DD',
      backgroundColor: '#FFFFFF',
      marginRight: 8,
    },
    draftBtnText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#344054',
      marginLeft: 4,
    },
    publishBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
      backgroundColor: '#0BA5EC',
    },
    publishBtnText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 4,
    },

    // Form
    scrollArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    formContainer: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 28,
      backgroundColor: '#FFFFFF',
    },
    fieldSection: {
      marginBottom: 16,
    },
    fieldRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    fieldContent: {
      flex: 1,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: '#F2F4F7',
      marginVertical: 14,
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#EAECF0',
    },
    badgeIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
      marginTop: 2,
    },
    badgeIconSmall: {
      width: 28,
      height: 28,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      marginTop: 2,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#101828',
    },
    fieldLabelSmall: {
      fontSize: 13,
      fontWeight: '600',
      color: '#101828',
    },
    requiredStar: {
      color: '#F04438',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    fieldSub: {
      fontSize: 12,
      color: '#667085',
      marginTop: 2,
    },

    // Gallery Collage
    coverCollageWrap: {
      width: 210,
      height: 140,
      borderRadius: 10,
      overflow: 'hidden',
      marginRight: 8,
      position: 'relative',
      backgroundColor: '#F2F4F7',
    },
    coverCollageImg: {
      width: '100%',
      height: '100%',
    },
    coverBadgeWhite: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      backgroundColor: '#FFFFFF',
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
      elevation: 2,
    },
    coverBadgeTextDark: {
      color: '#1D2939',
      fontSize: 11,
      fontWeight: '600',
    },
    stackedCol: {
      width: 105,
      height: 140,
      justifyContent: 'space-between',
      marginRight: 8,
    },
    stackedThumbWrap: {
      width: 105,
      height: 66,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#F2F4F7',
    },
    singleThumbWrap: {
      width: 120,
      height: 140,
      borderRadius: 10,
      overflow: 'hidden',
      position: 'relative',
      marginRight: 8,
      backgroundColor: '#F2F4F7',
    },
    thumbnailImg: {
      width: '100%',
      height: '100%',
    },
    deletePhotoBtn: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deletePhotoBtnSmall: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addPhotoBoxCollage: {
      width: 105,
      height: 140,
      borderRadius: 10,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: '#D0D5DD',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FAFAFA',
      marginRight: 8,
    },
    emptyAddPhotoBox: {
      width: '100%',
      height: 140,
      borderRadius: 10,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: '#D0D5DD',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FAFAFA',
      marginTop: 10,
    },
    addPhotoText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#101828',
      marginTop: 6,
    },
    addPhotoSub: {
      fontSize: 10,
      color: '#667085',
      marginTop: 2,
    },

    // Inputs
    input: {
      borderWidth: 1,
      borderColor: '#EAECF0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      height: 44,
      fontSize: 14,
      color: '#101828',
      backgroundColor: '#FFFFFF',
      marginTop: 6,
    },
    textarea: {
      height: 84,
      textAlignVertical: 'top',
      paddingTop: 10,
    },
    counterText: {
      alignSelf: 'flex-end',
      fontSize: 11,
      color: '#98A2B3',
      marginTop: 4,
    },
    dropdownBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#EAECF0',
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 44,
      backgroundColor: '#FFFFFF',
      marginTop: 6,
    },
    dropdownVal: {
      fontSize: 14,
      color: '#101828',
    },
    dropdownPlaceholder: {
      fontSize: 14,
      color: '#98A2B3',
    },
    hintText: {
      fontSize: 12,
      color: '#667085',
      marginTop: 6,
    },

    // Two Columns
    twoColRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    twoColLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginRight: 6,
    },
    twoColRight: {
      flex: 1.45,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginLeft: 6,
    },
    radioRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      marginTop: 6,
    },
    radioItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
    },
    radioCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: '#D0D5DD',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 4,
      backgroundColor: '#FFFFFF',
    },
    radioCircleActive: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#19A2A7',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 4,
      backgroundColor: '#FFFFFF',
    },
    radioDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: '#19A2A7',
    },
    radioLabel: {
      fontSize: 12,
      color: '#344054',
    },

    // Pastel Option Boxes (Pink, Blue, Green)
    optionBoxPink: {
      backgroundColor: '#FFF5F6',
      borderRadius: 12,
      padding: 12,
      marginTop: 10,
    },
    optionBoxBlue: {
      backgroundColor: '#EFF8FF',
      borderRadius: 12,
      padding: 12,
      marginTop: 10,
    },
    optionBoxGreen: {
      backgroundColor: '#ECFDF3',
      borderRadius: 12,
      padding: 12,
      marginTop: 10,
    },
    optionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#101828',
    },
    optionDesc: {
      fontSize: 11,
      color: '#667085',
      marginTop: 2,
    },
    subOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    subOptionLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: '#475467',
      marginBottom: 4,
    },
    dropdownBtnWhite: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#D0D5DD',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 7,
      backgroundColor: '#FFFFFF',
    },
    dropdownValSmall: {
      fontSize: 12,
      color: '#101828',
    },

    // Advanced info accordion
    advancedTrigger: {
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: '#F2F4F7',
      marginTop: 8,
    },
    advancedWrap: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#F2F4F7',
    },
    advancedNote: {
      fontSize: 12,
      color: '#667085',
      marginBottom: 10,
    },
    advancedItem: {
      marginBottom: 8,
    },
    advancedTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#344054',
    },
    advancedText: {
      fontSize: 12,
      color: '#475467',
      marginTop: 2,
      lineHeight: 18,
    },

    // Bottom Bar
    bottomBar: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#F2F4F7',
      paddingHorizontal: 16,
      paddingTop: 10,
    },
    previewBtn: {
      backgroundColor: '#19A2A7',
      borderRadius: 10,
      paddingVertical: 13,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewBtnText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
      marginLeft: 8,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      paddingBottom: 32,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#EAECF0',
      marginBottom: 8,
    },
    modalItem: {
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#F2F4F7',
    },
  })
);

export default CreatePackageScreen;
