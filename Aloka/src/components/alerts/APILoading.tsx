import { fonts } from '@/configs';
import { CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

export type APILoadingProps = {
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

type LoadingState = {
  visible: boolean;
  message?: string;
  progressColor?: string;
};

type Listener = (state: LoadingState) => void;
const listeners = new Set<Listener>();

let currentState: LoadingState = {
  visible: false,
  message: undefined,
  progressColor: undefined,
};

let loadingCount = 0;

export const LoadingHelper = {
  show: (message?: string, progressColor?: string) => {
    loadingCount++;
    currentState = {
      visible: true,
      message: message || currentState.message,
      progressColor: progressColor || currentState.progressColor,
    };
    listeners.forEach(fn => fn(currentState));
  },
  hide: (force = false) => {
    if (force) {
      loadingCount = 0;
    } else {
      loadingCount = Math.max(0, loadingCount - 1);
    }
    if (loadingCount === 0) {
      currentState = { visible: false, message: undefined, progressColor: undefined };
      listeners.forEach(fn => fn(currentState));
    }
  },
};

export const showLoading = (message?: string, progressColor?: string) => {
  LoadingHelper.show(message, progressColor);
};

export const hideLoading = (force = false) => {
  LoadingHelper.hide(force);
};

export const APILoading: React.FC<APILoadingProps> = ({
  showAlert = false,
  isLoadingAPI = true,
  message,
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
              {message || t('common.processing', 'Đang xử lý...')}
            </CText>
          )}
        </View>
      </View>
    </Modal>
  );
};

export const GlobalAPILoading: React.FC = () => {
  const [state, setState] = useState<LoadingState>(currentState);

  useEffect(() => {
    const handler: Listener = next => setState({ ...next });
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return (
    <APILoading
      showAlert={state.visible}
      isLoadingAPI={true}
      message={state.message}
      progressColor={state.progressColor}
    />
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
