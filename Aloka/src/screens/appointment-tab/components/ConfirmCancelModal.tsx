import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CText } from '@/utils';

interface ConfirmCancelModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.confirmOverlay}>
        <View style={styles.confirmBox}>
          <CText style={styles.confirmTitle}>Xác nhận hủy lịch</CText>
          <CText style={styles.confirmDesc}>
            Bạn có chắc chắn muốn hủy lịch hẹn này không? Thao tác này không
            thể hoàn tác.
          </CText>
          <View style={styles.confirmActions}>
            <TouchableOpacity
              style={styles.confirmCancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <CText style={styles.confirmCancelText}>Đóng</CText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmOkBtn}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <CText style={styles.confirmOkText}>Hủy lịch</CText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  confirmDesc: {
    fontSize: 14,
    color: '#475467',
    lineHeight: 20,
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
  confirmOkBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#F04438',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmOkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
