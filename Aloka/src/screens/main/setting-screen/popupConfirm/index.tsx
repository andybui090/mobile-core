import { ICON_TYPE, IconX } from '@/components';
import ModalSetting from '@/screens/account-tab/components/modalSetting';
import { spacings } from '@/theme';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type VoidFunc = () => void;
type ConfirmType = 'logout' | 'delete' | 'update';

enum ConfirmTypeEnum {
  logout = 'logout',
  delete = 'delete',
}

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

const PopupConfirm = ({
  isVisible,
  title,
  description = '',
  onConfirm,
  onCancel,
  confirmText,
  confirmType = ConfirmTypeEnum.logout,
  icon = 'close',
  hideModal,
}: Props) => {
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  // FUNCTION
  const _cancelHandler = () => {
    if (onCancel) onCancel();
    hideModal();
  };

  const _confirmHandler = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <ModalSetting
      onBackdropPress={hideModal}
      isHeader={false}
      isFullScreen={false}
      isVisible={isVisible}
      isTransparent
    >
      <View style={styles.container}>
        <View style={styles.bgPopup}>
          <TouchableOpacity
            onPress={_cancelHandler}
            style={{ alignItems: 'flex-end' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconX
              type={ICON_TYPE.IONICONS}
              name={icon as any}
              size={24}
              color={colors.c344054 || '#344054'}
            />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.bgLogoLogout}>
              <IconX
                type="ionicons"
                name={
                  confirmType === 'delete' ? 'trash-outline' : 'log-out-outline'
                }
                size={30}
                color={colors.white}
              />
            </View>
            <CText
              h4
              w600
              style={{
                marginBottom: spacings.xs,
                textAlign: 'center',
                color: colors.c101828 || '#101828',
              }}
            >
              {title}
            </CText>
            {!!description && (
              <CText
                h5
                color={colors.c667085 || '#667085'}
                style={{ textAlign: 'center' }}
              >
                {description}
              </CText>
            )}
            {/* Action buttons */}
            <Row around style={{ marginTop: spacings.xl, width: '100%' }}>
              <TouchableOpacity
                onPress={_cancelHandler}
                style={styles.btnCancel}
                activeOpacity={0.7}
              >
                <CText h5 w600 color={colors.c344054 || '#344054'}>
                  {t('common.cancel', 'Hủy')}
                </CText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={_confirmHandler}
                style={styles.btnConfirm}
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
    </ModalSetting>
  );
};

export default PopupConfirm;

const useStyles = makeStyles(({ colors }) => ({
  container: {
    margin: 0,
    alignItems: 'center',
    marginHorizontal: 24,
  } as ViewStyle,
  bgPopup: {
    backgroundColor: colors.white,
    width: '100%',
    maxWidth: 343,
    borderRadius: 16,
    paddingVertical: spacings.lg,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
  bgLogoLogout: {
    alignItems: 'center',
    width: 60,
    height: 60,
    backgroundColor: colors.cF04438 || '#F04438',
    borderRadius: 30,
    justifyContent: 'center',
    marginBottom: spacings.md,
  } as ViewStyle,
  btnConfirm: {
    backgroundColor: colors.cF04438 || '#F04438',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 6,
  } as ViewStyle,
  btnCancel: {
    backgroundColor: colors.cEAECF0 || '#F2F4F7',
    paddingVertical: 12,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
  } as ViewStyle,
}));
