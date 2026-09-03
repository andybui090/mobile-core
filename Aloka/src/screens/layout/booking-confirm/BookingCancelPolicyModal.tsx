import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CText } from '@/utils';

interface BookingCancelPolicyModalProps {
  visible?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

export const BookingCancelPolicyModal: React.FC<BookingCancelPolicyModalProps> = ({
  visible = true,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <CText style={styles.title}>Thông báo</CText>

          <CText style={styles.message}>
            Lịch hẹn không thể hủy trước giờ bắt đầu dịch vụ 02 tiếng. Nếu bạn hủy sau thời gian này, phí dịch vụ sẽ không được hoàn trả theo quy định của hệ thống.
          </CText>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm || onClose}>
              <CText style={styles.confirmBtnText}>Xác nhận</CText>
            </TouchableOpacity>

            {onClose && (
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <CText style={styles.cancelBtnText}>Đóng</CText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    width: '100%',
  },
  confirmBtn: {
    backgroundColor: '#0D9488',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});
