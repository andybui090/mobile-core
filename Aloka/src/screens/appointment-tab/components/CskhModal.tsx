import React from 'react';
import {
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@/components';
import { CText } from '@/utils';

interface CskhModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CskhModal: React.FC<CskhModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.cskhModalContent}>
          <View style={styles.dragHandle} />

          <View style={styles.cskhHeader}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={styles.cskhBackBtn}
            >
              <IconX
                type="ionicons"
                name="chevron-back"
                size={22}
                color="#1D2939"
              />
            </TouchableOpacity>
            <CText style={styles.cskhTitle}>Liên hệ bộ phận CSKH</CText>
            <View style={styles.cskhPlaceholder} />
          </View>

          <View style={styles.cskhDivider} />

          <CText style={styles.cskhDesc}>
            Liên hệ qua số hotline hoặc gửi qua địa chỉ email sau để được tư vấn
            và xử lý vấn đề:
          </CText>

          <View style={styles.cskhContactList}>
            <View style={styles.cskhContactRow}>
              <View style={styles.bulletDot} />
              <CText style={styles.cskhLabel}>Hotline </CText>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  Linking.openURL('tel:02835264818').catch(() => {})
                }
              >
                <CText style={styles.cskhValueLink}>028 3526 4818</CText>
              </TouchableOpacity>
            </View>

            <View style={styles.cskhContactRow}>
              <View style={styles.bulletDot} />
              <CText style={styles.cskhLabel}>Email </CText>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  Linking.openURL('mailto:info@mcv.com.vn').catch(() => {})
                }
              >
                <CText style={styles.cskhValueLink}>info@mcv.com.vn</CText>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.cskhConfirmBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <CText style={styles.cskhConfirmBtnText}>Đã hiểu</CText>
          </TouchableOpacity>
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
  cskhModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D5DD',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  cskhHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cskhBackBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  cskhTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
  },
  cskhPlaceholder: {
    width: 32,
  },
  cskhDivider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginTop: 8,
    marginBottom: 16,
  },
  cskhDesc: {
    fontSize: 13.5,
    color: '#344054',
    lineHeight: 20,
    marginBottom: 14,
  },
  cskhContactList: {
    gap: 10,
    marginBottom: 28,
  },
  cskhContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475467',
    marginRight: 8,
  },
  cskhLabel: {
    fontSize: 13.5,
    color: '#475467',
  },
  cskhValueLink: {
    fontSize: 13.5,
    color: '#19A2A7',
    fontWeight: '500',
  },
  cskhConfirmBtn: {
    backgroundColor: '#14B8A6',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cskhConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
