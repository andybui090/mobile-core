import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX, ImageHelper } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';

export const ReviewService: React.FC = () => {
  const [rating, setRating] = useState(4); // 4 filled stars matching Figma default
  const [reviewText, setReviewText] = useState('');
  const [mediaText, setMediaText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleReviewSubmit = () => {
    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
          <IconX type="ionicons" name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <CText style={styles.headerTitle}>Đánh giá dịch vụ</CText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Service Header Info Card */}
        <View style={styles.serviceCard}>
          <ImageHelper
            source={(images.common as any).service_mom_baby || images.common.img_default}
            style={styles.serviceImage}
            resizeMode="cover"
          />
          <View style={styles.serviceInfo}>
            <CText style={styles.serviceTitle} numberOfLines={2}>
              Dịch vụ Nuôi sinh & Chăm sóc mẹ{'\n'}bé tại bệnh viện
            </CText>
            <CText style={styles.nurseName}>Điều dưỡng Thúy Ngọc</CText>
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
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Chia sẻ hình ảnh + Video"
            placeholderTextColor="#98A2B3"
            multiline
            value={mediaText}
            onChangeText={setMediaText}
            style={styles.textInput}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7}>
            <CText style={styles.skipBtnText}>Để sau</CText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleReviewSubmit}
            activeOpacity={0.8}
          >
            <CText style={styles.submitBtnText}>Đánh giá</CText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderPlaceholder} />
              <CText style={styles.modalTitle}>Đánh giá khóa học</CText>
              <TouchableOpacity
                onPress={() => setShowSuccessModal(false)}
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
                  color={star <= 4 ? '#F59E0B' : '#EAECF0'}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowSuccessModal(false)}
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
