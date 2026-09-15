import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@/components';
import { CText } from '@/utils';

interface CompleteReviewModalProps {
  visible: boolean;
  providerName: string;
  onClose: () => void;
  onSkip: () => void;
  onReview: () => void;
}

export const CompleteReviewModal: React.FC<CompleteReviewModalProps> = ({
  visible,
  providerName,
  onClose,
  onSkip,
  onReview,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.completeModalContent}>
          <View style={styles.dragHandle} />

          <View style={styles.completeModalHeader}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={styles.completeBackBtn}
            >
              <IconX
                type="ionicons"
                name="chevron-back"
                size={24}
                color="#1D2939"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.completeModalDivider} />

          <View style={styles.completeModalBody}>
            <CText style={styles.completeModalDesc}>
              {`Dịch vụ đã hoàn tất, bạn có muốn dành ít phút đánh giá cho ${providerName} không?`}
            </CText>

            <View style={styles.completeModalActions}>
              <TouchableOpacity
                style={styles.completeSkipBtn}
                activeOpacity={0.7}
                onPress={onSkip}
              >
                <CText style={styles.completeSkipBtnText}>Bỏ qua</CText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.completeReviewBtn}
                activeOpacity={0.8}
                onPress={onReview}
              >
                <CText style={styles.completeReviewBtnText}>Đánh giá</CText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  completeModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D5DD',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  completeModalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  completeBackBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  completeModalDivider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    width: '100%',
  },
  completeModalBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  completeModalDesc: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D2939',
    lineHeight: 22,
    marginBottom: 20,
  },
  completeModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  completeSkipBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  completeSkipBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#14B8A6',
  },
  completeReviewBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeReviewBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
