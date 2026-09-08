import { images, isIOS, screenStyles } from '@/configs';
import ModalSetting from '@/screens/account-tab/components/modalSetting';
import { spacings } from '@/theme';
import { CButton, CText } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View, ViewStyle } from 'react-native';


type VoidFunc = () => void;
type ConfirmType = 'logout' | 'delete';

type Props = {
  isVisible: boolean;
  title: string;
  description?: string;
  onConfirm: VoidFunc;
  onCancel?: VoidFunc;
  confirmText?: string;
  descriptionText?: string;
  confirmType?: ConfirmType;
  icon?: any;
  hideModal: any;
};

const PopupSuccess = ({
  isVisible,
  title,
  onConfirm,
  confirmText,
  hideModal,
}: Props) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const _confirmHandler = () => {
    if (onConfirm) onConfirm();
    hideModal();
  };

  return (
    <ModalSetting
      onBackdropPress={hideModal}
      isHeader={false}
      isFullScreen={true}
      isVisible={isVisible}
    >
      <View style={styles.container}>
        <View style={styles.icon}>
          <Image
            source={images.setting.ico_success}
            style={screenStyles.fillParent}
            resizeMode="contain"
          />
        </View>
        <CText
          h5
          style={{
            fontWeight: isIOS ? '600' : '700',
            textAlign: 'center',
            paddingHorizontal: 24,
          }}
          color={colors.c101828 || '#101828'}
        >
          {title}
        </CText>
      </View>
      <View style={{ paddingHorizontal: 24, width: '100%' }}>
        <CButton
          onPress={_confirmHandler}
          title={confirmText ?? t('common.done', 'Xong')}
          isBottom
        />
      </View>
    </ModalSetting>
  );
};

export default PopupSuccess;

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  } as ViewStyle,
  icon: {
    width: 136,
    height: 136,
    marginBottom: spacings.xl,
  } as ViewStyle,
}));

