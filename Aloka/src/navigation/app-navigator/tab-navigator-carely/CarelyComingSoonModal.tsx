import { images, screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CarelyComingSoonModal: React.FC<Props> = ({visible, onClose}) => {
  const {t} = useTranslation();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <Row center>
            <Image
              source={images.bottomTab.carely}
              style={screenStyles.box26}
              resizeMode="contain"
            />
            <CText h4 w600 color={'#19A2A7'} style={{marginLeft: 5}}>
              {'Carely'}
            </CText>
          </Row>
          <CText h5 style={styles.content}>
            {t(
              'carely.commingSoon',
              'Dịch vụ chăm sóc sức khoẻ tận nhà – sẽ được ra mắt trong thời gian tới.',
            )}
          </CText>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <CText h5 w600 color="white">
              {t('carely.gotIt', 'Đã hiểu')}
            </CText>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
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
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2F80ED', // đổi sang màu primary của app nếu cần
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CarelyComingSoonModal;
