import { IconX } from '@/components';
import { spacings } from '@/theme';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type ConfirmType = 'logout' | 'delete' | 'update';

type Props = {
  isVisible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  confirmType?: ConfirmType;
  hideModal: () => void;
  onConfirm: () => void;
};

const PopupConfirm = ({
  isVisible,
  title,
  description,
  confirmText,
  confirmType = 'logout',
  hideModal,
  onConfirm,
}: Props) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const actionIcon =
    confirmType === 'delete' ? 'trash-outline' : 'log-out-outline';

  return (
    <Modal
      visible={isVisible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={hideModal}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hideModal} />

        <View style={styles.popup}>
          <TouchableOpacity
            onPress={hideModal}
            style={styles.close}
            hitSlop={10}
          >
            <IconX
              type="ionicons"
              name="close"
              size={24}
              color={colors.c344054}
            />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.icon}>
              <IconX
                type="ionicons"
                name={actionIcon}
                size={30}
                color={colors.white}
              />
            </View>

            <CText h4 w600 style={styles.title}>
              {title}
            </CText>

            {!!description && (
              <CText h5 color={colors.c667085} style={styles.description}>
                {description}
              </CText>
            )}

            <Row style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={hideModal}
                activeOpacity={0.7}
              >
                <CText h5 w600 color={colors.c344054}>
                  {t('common.cancel', 'Hủy')}
                </CText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onConfirm}
                activeOpacity={0.7}
              >
                <CText h5 w600 color={colors.white}>
                  {confirmText}
                </CText>
              </TouchableOpacity>
            </Row>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  overlay: {
    flex: 1,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 24,
  },

  popup: {
    width: '100%',
    maxWidth: 343,
    alignSelf: 'center' as const,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },

  close: {
    alignSelf: 'flex-end' as const,
  },

  content: {
    alignItems: 'center' as const,
  },

  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.cF04438,
    marginBottom: spacings.md,
  },

  title: {
    textAlign: 'center' as const,
    color: colors.c101828,
    marginBottom: spacings.xs,
  },

  description: {
    textAlign: 'center' as const,
  },

  actions: {
    width: '100%' as const,
    marginTop: spacings.xl,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.cEAECF0,
  },

  confirmButton: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.cF04438,
  },
}));

export default PopupConfirm;