import { fonts } from '@/configs';
import { CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

type APILoadingProps = {
  showAlert: boolean;
  isLoadingAPI?: boolean;
  isSuccess?: boolean;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  hideAlert?: () => void;
  onConfirmPressed?: () => void;
  isShowProgress?: boolean;
  showCancelButton?: boolean;
  progressColor?: string;
};

export const APILoading: React.FC<APILoadingProps> = ({
  showAlert = false,
  isLoadingAPI = false,
  progressColor,
}) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  if (!showAlert) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={showAlert}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.contentContainer, { backgroundColor: colors.white }]}>
          <ActivityIndicator
            size="large"
            color={progressColor || colors.primary || '#19A2A7'}
          />
          {isLoadingAPI && (
            <CText
              style={[
                styles.message,
                {
                  color: colors.c101828 || '#101828',
                },
              ]}
            >
              {t('common.processing', 'Đang xử lý...')}
            </CText>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    minWidth: 140,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  message: {
    fontFamily: fonts.inter,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default APILoading;
