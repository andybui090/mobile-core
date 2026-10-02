import { images, screenStyles } from '@/configs';
import { spacings } from '@/theme';
import { CButton, CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, View } from 'react-native';

type Props = {
  isVisible: boolean;
  title: string;
  confirmText?: string;
  onConfirm?: () => void;
  hideModal: () => void;
};

const PopupSuccess = ({
  isVisible,
  title,
  confirmText,
  onConfirm,
  hideModal,
}: Props) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const {
    theme: { colors },
  } = useTheme();

  const handleConfirm = () => {
    onConfirm?.();
    hideModal();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={hideModal}
    >
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <Image
              source={images.global.ico_success}
              style={screenStyles.fillParent}
              resizeMode="contain"
            />
          </View>

          <CText
            h5
            color={colors.c101828 || '#101828'}
            center
            style={styles.title}
          >
            {title}
          </CText>
        </View>

        <View style={styles.footer}>
          <CButton
            onPress={handleConfirm}
            title={confirmText ?? t('common.done', 'Xong')}
            isBottom
          />
        </View>
      </View>
    </Modal>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  icon: {
    width: 136,
    height: 136,
    marginBottom: spacings.xl,
  },

  title: {
    fontWeight: '600' as const,
    paddingHorizontal: 24,
  },

  footer: {
    width: '100%' as const,
    paddingHorizontal: 24,
  },
}));

export default PopupSuccess;
