import {images, screenStyles} from '@/configs';
import {CText, Row} from '@/utils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  msg?: string;
  title?: string;

  primaryText?: string;
  secondaryText?: string;

  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

export const ModalAgreeFormDN2Btn: React.FC<Props> = ({
  visible,
  onClose,
  msg,
  title = '',
  primaryText,
  secondaryText,
  onPrimaryPress,
  onSecondaryPress,
}) => {
  const {t} = useTranslation();

  const handlePrimary = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {!title ? (
            <Row center>
              <Image
                source={images.bottomTab.drnetwork}
                style={screenStyles.box26}
                resizeMode="contain"
              />
              <CText h5 w600 color={'#0080F6'} style={{marginLeft: 5}}>
                Doctor Network
              </CText>
            </Row>
          ) : (
            <Row center>
              <CText h4 w500 color={'#101828'} style={{marginLeft: 5}}>
                {title}
              </CText>
            </Row>
          )}

          <CText h5 style={styles.content}>
            {msg}
          </CText>

          <View style={styles.buttonRow}>
            {secondaryText && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSecondaryPress}
                hitSlop={screenStyles.hitSlop20}>
                <CText h5 w600 color="#2F80ED">
                  {secondaryText}
                </CText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.primaryButton, !secondaryText && {width: '100%'}]}
              onPress={handlePrimary}>
              <CText h5 w600 color="white">
                {primaryText || t('carely.gotIt', 'Đã hiểu')}
              </CText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  content: {
    color: '#344054',
    // textAlign: 'center',
    marginBottom: 24,
    marginTop: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },

  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
