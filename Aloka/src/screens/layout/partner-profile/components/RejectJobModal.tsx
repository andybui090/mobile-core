import React from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { IconX } from '@/components';
import { CText } from '@/utils';

export const REJECT_REASONS = [
  'Trùng lịch làm việc khác',
  'Khoảng cách quá xa',
  'Bận việc đột xuất',
  'Khác (ô nhập text)',
];

interface RejectJobModalProps {
  visible: boolean;
  selectedReasonIndex: number | null;
  otherReasonText: string;
  onSelectReason: (index: number) => void;
  onChangeOtherReasonText: (text: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    dialogBox: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    dialogHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    dialogTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.c101828 || '#101828',
    },
    dialogCloseBtn: {
      padding: 4,
    },
    dialogPrompt: {
      fontSize: 14,
      color: colors.c667085 || '#667085',
      marginBottom: 16,
      lineHeight: 20,
    },
    radioOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.cD0D5DD || '#D0D5DD',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    radioOuterSelected: {
      borderColor: colors.primary || '#19A2A7',
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary || '#19A2A7',
    },
    radioLabel: {
      fontSize: 14,
      color: colors.c344054 || '#344054',
      flex: 1,
    },
    otherTextInput: {
      borderWidth: 1,
      borderColor: colors.cD0D5DD || '#D0D5DD',
      borderRadius: 8,
      padding: 10,
      fontSize: 13.5,
      color: colors.c101828 || '#101828',
      marginTop: 6,
      marginBottom: 10,
    },
    dialogDivider: {
      height: 1,
      backgroundColor: colors.cF2F4F7 || '#F2F4F7',
      marginVertical: 16,
    },
    dialogBtnRow: {
      flexDirection: 'row',
      gap: 12,
    },
    dialogBackBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.cD0D5DD || '#D0D5DD',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogBackBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.c344054 || '#344054',
    },
    dialogConfirmBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: '#F04438',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogConfirmBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
  })
);

export const RejectJobModal: React.FC<RejectJobModalProps> = ({
  visible,
  selectedReasonIndex,
  otherReasonText,
  onSelectReason,
  onChangeOtherReasonText,
  onClose,
  onConfirm,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const rejectReasonLabels = [
    t('partnerWork.rejectModal.reasonDuplicate', 'Trùng lịch làm việc khác'),
    t('partnerWork.rejectModal.reasonDistance', 'Khoảng cách quá xa'),
    t('partnerWork.rejectModal.reasonBusy', 'Bận việc đột xuất'),
    t('partnerWork.rejectModal.reasonOther', 'Khác (ô nhập text)'),
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.dialogBox}>
              {/* Dialog Header */}
              <View style={styles.dialogHeader}>
                <CText style={styles.dialogTitle}>{t('partnerWork.rejectModal.title', 'Từ chối lịch hẹn')}</CText>
                <TouchableOpacity
                  style={styles.dialogCloseBtn}
                  activeOpacity={0.7}
                  onPress={onClose}
                >
                  <IconX
                    type="ionicons"
                    name="close"
                    size={20}
                    color={colors.c344054 || '#344054'}
                  />
                </TouchableOpacity>
              </View>

              <CText style={styles.dialogPrompt}>
                {t('partnerWork.rejectModal.prompt', 'Vui lòng chọn lý do từ chối lịch hẹn này:')}
              </CText>

              {/* Reasons Radio List */}
              {rejectReasonLabels.map((reason, index) => {
                const isSelected = selectedReasonIndex === index;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.radioOptionRow}
                    activeOpacity={0.7}
                    onPress={() => onSelectReason(index)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <CText style={styles.radioLabel}>{reason}</CText>
                  </TouchableOpacity>
                );
              })}

              {/* Optional input if "Khác" selected */}
              {selectedReasonIndex === 3 && (
                <TextInput
                  style={styles.otherTextInput}
                  placeholder={t('partnerWork.rejectModal.otherPlaceholder', 'Nhập lý do cụ thể...')}
                  placeholderTextColor={colors.c98A2B3 || '#98A2B3'}
                  value={otherReasonText}
                  onChangeText={onChangeOtherReasonText}
                />
              )}

              <View style={styles.dialogDivider} />

              {/* Dialog Action Buttons */}
              <View style={styles.dialogBtnRow}>
                <TouchableOpacity
                  style={styles.dialogBackBtn}
                  activeOpacity={0.7}
                  onPress={onClose}
                >
                  <CText style={styles.dialogBackBtnText}>{t('partnerWork.rejectModal.btnBack', 'Quay lại')}</CText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dialogConfirmBtn}
                  activeOpacity={0.8}
                  onPress={onConfirm}
                >
                  <CText style={styles.dialogConfirmBtnText}>
                    {t('partnerWork.rejectModal.btnConfirmReject', 'Xác nhận từ chối')}
                  </CText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
