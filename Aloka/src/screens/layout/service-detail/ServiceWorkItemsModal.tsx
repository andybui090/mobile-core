import React from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CText } from '@/utils';

interface ServiceWorkItemsModalProps {
  visible?: boolean;
  onClose?: () => void;
}

const WORK_ITEMS = [
  '1. Chăm sóc trẻ em',
  '2. Thay tả cho bé',
  '3. Tắm cho bé',
  '4. Massage 30 phút',
];

export const ServiceWorkItemsModal: React.FC<ServiceWorkItemsModalProps> = ({
  visible = true,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
              <CText style={styles.backIcon}>‹</CText>
            </TouchableOpacity>
            <CText style={styles.title}>Chi tiết dịch vụ</CText>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            {/* Service hours */}
            <View style={styles.rowItem}>
              <CText style={styles.rowLabel}>Số giờ phục vụ</CText>
              <View style={styles.hoursBadge}>
                <CText style={styles.hoursText}>2 giờ</CText>
              </View>
            </View>

            {/* Work items */}
            <CText style={styles.sectionHeading}>Chi tiết công việc</CText>
            <View style={styles.listContainer}>
              {WORK_ITEMS.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <CText style={styles.itemText}>{item}</CText>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
              <CText style={styles.confirmButtonText}>Xác nhận</CText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    minHeight: 350,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 26,
    color: '#111827',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: {
    width: 36,
  },
  content: {
    paddingVertical: 16,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  hoursBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hoursText: {
    fontSize: 13,
    color: '#0D9488',
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  listContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  itemRow: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemText: {
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    marginTop: 16,
  },
  confirmButton: {
    backgroundColor: '#0D9488',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
