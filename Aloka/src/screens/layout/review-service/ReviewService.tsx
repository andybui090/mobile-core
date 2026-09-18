import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { AppContext } from '@/contexts';
import ApiService from '@/services/api-base';
import { CText } from '@/utils';

export const ReviewService: React.FC<any> = ({ navigation, route }: any) => {
  const { user } = useContext<any>(AppContext) || {};

  // Trích xuất serviceData từ props giống mobile-doctor-app
  const serviceData =
    route?.params?.service ||
    route?.params?.item ||
    route?.params?.order ||
    {};
  const onReviewSuccess = route?.params?.onReviewSuccess;

  const packageInfo = serviceData?.package || {};
  const customer = serviceData?.user || serviceData?.patient || serviceData?.customer || {};
  const doctor = serviceData?.doctor || serviceData?.partner || {};

  // Nhận diện vai trò người xem (nếu ID trùng bác sĩ thì đang xem với vai trò Bác sĩ/Điều dưỡng)
  const currentUserId = user?.id || user?._id;
  const isMatchDoctorId = Boolean(
    currentUserId &&
      (String(serviceData?.doctor_id) === String(currentUserId) ||
        String(doctor?.id) === String(currentUserId) ||
        String(doctor?._id) === String(currentUserId)),
  );
  const isViewByDoctor = isMatchDoctorId;

  // Tên hiển thị người được phục vụ hoặc phục vụ
  const nurseOrDoctorName = isViewByDoctor
    ? customer?.full_name || customer?.name || customer?.username || 'Khách hàng'
    : doctor?.full_name ||
      doctor?.name ||
      serviceData?.doctor_name ||
      serviceData?.partner_name ||
      'Điều dưỡng Thúy Ngọc';

  // Tên gói dịch vụ
  const serviceTitle =
    packageInfo?.name ||
    serviceData?.name ||
    serviceData?.package_name ||
    'Dịch vụ Nuôi sinh & Chăm sóc mẹ\nbé tại bệnh viện';

  // Ảnh gói dịch vụ
  const serviceThumbnail = packageInfo?.thumbnail
    ? { uri: packageInfo.thumbnail }
    : serviceData?.thumbnail
    ? { uri: serviceData.thumbnail }
    : (images.common as any).service_mom_baby || images.common.img_default;

  // States
  const [rating, setRating] = useState<number>(serviceData?.rating || 4);
  const [reviewText, setReviewText] = useState<string>('');
  const [mediaText, setMediaText] = useState<string>('');
  const [imagesList, setImagesList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Điều hướng quay lại
  const handleGoBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  // Chọn hình ảnh / video bổ sung
  const handlePickImages = async () => {
    try {
      const selected: any = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'any',
        compressImageQuality: 0.8,
      });
      if (Array.isArray(selected)) {
        setImagesList(prev => [...prev, ...selected]);
      } else if (selected) {
        setImagesList(prev => [...prev, selected]);
      }
    } catch (err: any) {
      if (err?.code !== 'E_PICKER_CANCELLED') {
        console.log('ImagePicker error:', err);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesList(prev => prev.filter((_, idx) => idx !== index));
  };

  // Submit đánh giá qua ApiService giống mobile-doctor-app
  const handleReviewSubmit = async () => {
    if (isSubmitting) return;

    if (!rating || rating <= 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá cho dịch vụ.');
      return;
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    const channelId =
      serviceData?.channel_id ||
      packageInfo?.channel_id ||
      doctor?.channel_id ||
      '';

    const packageId =
      serviceData?.package_id ||
      packageInfo?.id ||
      packageInfo?._id ||
      serviceData?.id ||
      '';

    const orderId =
      serviceData?.order_id ||
      serviceData?.id ||
      serviceData?._id ||
      '';

    const combinedNote =
      [reviewText.trim(), mediaText.trim()].filter(Boolean).join('\n') ||
      'Đánh giá dịch vụ';

    const payload: any = {
      channel_id: channelId,
      package_id: packageId,
      order_id: orderId,
      value: rating,
      note: combinedNote,
    };

    if (imagesList && imagesList.length > 0) {
      payload.images = imagesList.map(img => img.path || img.uri || img);
    }

    try {
      const res: any = await ApiService.postRatingCarely(payload);

      // Kiểm tra kết quả phản hồi từ ApiService
      const isOk =
        res?.ok ??
        (res?.status >= 200 && res?.status < 300) ??
        Boolean(res?.data);

      if (isOk) {
        setShowSuccessModal(true);
        if (typeof onReviewSuccess === 'function') {
          onReviewSuccess();
        }
      } else {
        const errMsg =
          res?.data?.message ||
          res?.problem ||
          'Bạn đã đánh giá rồi hoặc có lỗi xảy ra.';
        Alert.alert('Thông báo', errMsg);
      }
    } catch (error: any) {
      console.log('postRatingCarely error:', error);
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể gửi đánh giá. Vui lòng thử lại sau.';
      Alert.alert('Thông báo', errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Đóng modal hoàn tất và quay về màn hình trước
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    handleGoBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={handleGoBack}
        >
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Đánh giá dịch vụ</CText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Service Header Info Card */}
        <View style={styles.serviceCard}>
          <ImageHelper
            source={serviceThumbnail}
            style={styles.serviceImage}
            resizeMode="cover"
            renderErrorImage={() => (
              <Image
                source={(images.common as any).service_mom_baby || images.common.img_default}
                style={styles.serviceImage}
                resizeMode="cover"
              />
            )}
          />
          <View style={styles.serviceInfo}>
            <CText style={styles.serviceTitle} numberOfLines={2}>
              {serviceTitle}
            </CText>
            <CText style={styles.nurseName}>{nurseOrDoctorName}</CText>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <CText style={styles.ratingPrompt}>
            Hãy cho chúng tôi biết trãi nghiệm{'\n'}của bạn tại dịch vụ này?
          </CText>

          {/* Large Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => {
              const isFilled = star <= rating;
              return (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                  style={styles.starBtn}
                >
                  <IconX
                    type="ionicons"
                    name="star"
                    size={36}
                    color={isFilled ? '#F59E0B' : '#EAECF0'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Review input card */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Chia sẻ cảm nhận của bạn"
            placeholderTextColor="#98A2B3"
            multiline
            value={reviewText}
            onChangeText={setReviewText}
            style={styles.textInput}
            textAlignVertical="top"
          />
        </View>

        {/* Photo/Video media input card */}
        <View style={styles.mediaBox}>
          <TextInput
            placeholder="Chia sẻ hình ảnh + Video"
            placeholderTextColor="#98A2B3"
            multiline
            value={mediaText}
            onChangeText={setMediaText}
            style={styles.mediaTextInput}
            textAlignVertical="top"
          />

          <View style={styles.mediaBottomRow}>
            <TouchableOpacity
              style={styles.uploadMediaBtn}
              onPress={handlePickImages}
              activeOpacity={0.7}
            >
              <IconX type="ionicons" name="image-outline" size={18} color="#14B8A6" />
              <CText style={styles.uploadMediaText}>Thêm hình ảnh / video</CText>
            </TouchableOpacity>
          </View>

          {imagesList.length > 0 && (
            <FlatList
              data={imagesList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => String(index)}
              style={styles.previewList}
              renderItem={({ item, index }) => (
                <View style={styles.previewItem}>
                  <Image source={{ uri: item.path || item.uri }} style={styles.previewThumb} />
                  <TouchableOpacity
                    style={styles.removeMediaBtn}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <IconX type="ionicons" name="close" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.skipBtn}
            activeOpacity={0.7}
            onPress={handleGoBack}
          >
            <CText style={styles.skipBtnText}>Để sau</CText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (isSubmitting || rating === 0) && styles.disabledSubmitBtn,
            ]}
            onPress={handleReviewSubmit}
            activeOpacity={0.8}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <CText style={styles.submitBtnText}>Đánh giá</CText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderPlaceholder} />
              <CText style={styles.modalTitle}>Đánh giá dịch vụ</CText>
              <TouchableOpacity
                onPress={handleCloseSuccessModal}
                activeOpacity={0.7}
                style={styles.closeBtn}
              >
                <IconX type="ionicons" name="close" size={22} color="#667085" />
              </TouchableOpacity>
            </View>

            <CText style={styles.modalMessage}>Đánh giá của bạn đã được gửi đi</CText>

            <View style={styles.modalStarsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <IconX
                  key={star}
                  type="ionicons"
                  name="star"
                  size={32}
                  color={star <= rating ? '#F59E0B' : '#EAECF0'}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={handleCloseSuccessModal}
              activeOpacity={0.8}
            >
              <CText style={styles.modalCloseBtnText}>Đóng</CText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101828',
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 12,
  },
  serviceImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  serviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 20,
  },
  nurseName: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 4,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingPrompt: {
    fontSize: 14,
    color: '#344054',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  starBtn: {
    padding: 2,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    height: 140,
    padding: 12,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 14,
    color: '#101828',
    padding: 0,
    height: '100%',
  },
  mediaBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    minHeight: 140,
    padding: 12,
    marginBottom: 16,
  },
  mediaTextInput: {
    fontSize: 14,
    color: '#101828',
    padding: 0,
    height: 80,
  },
  mediaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 4,
  },
  uploadMediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F0FDFA',
  },
  uploadMediaText: {
    fontSize: 13,
    color: '#14B8A6',
    fontWeight: '500',
  },
  previewList: {
    marginTop: 10,
  },
  previewItem: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 8,
    position: 'relative',
  },
  previewThumb: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#F2F4F7',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  skipBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#14B8A6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
  },
  submitBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSubmitBtn: {
    backgroundColor: 'rgba(20, 184, 166, 0.5)',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  modalHeaderPlaceholder: {
    width: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  closeBtn: {
    padding: 2,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  modalStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  modalCloseBtn: {
    backgroundColor: '#0D9488',
    height: 46,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
