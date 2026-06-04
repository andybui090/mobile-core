import { images } from '@/config';
import { Text, Row } from '@/components/ui';
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

export const NetworkAwareProvider: React.FC = () => {
  const {t} = useTranslation();
  const {isConnected} = useNetInfo();
  const [isDismissed, setIsDismissed] = useState(false);

  const isOffline = isConnected === false;

  // ✅ Khi online lại → reset dismiss
  useEffect(() => {
    if (!isOffline) {
      setIsDismissed(false);
    }
  }, [isOffline]);

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Modal
      visible={isOffline && !isDismissed}
      statusBarTranslucent
      transparent
      animationType="fade"
      hardwareAccelerated
      presentationStyle="overFullScreen">
      <View style={styles.container}>
        <View style={styles.wrapContent}>
          <Text h2 w600 color="#101828">
            {t('network.connectionError', 'No Internet Connection')}
          </Text>
          <View style={styles.lottieView}>
            <Image
              source={images.global.no_internet}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>
          <Text h4 color="#101828" center>
            {t(
              'network.connectionMsg',
              'Oops! Looks like your device is not connected to the Internet.',
            )}
          </Text>
          <Row around style={{width: '100%', marginTop: 24}}>
            <TouchableOpacity onPress={handleDismiss} style={styles.btnDismiss}>
              <Text h4 w500 color="#344054">
                {t('network.dismiss', 'Dismiss')}
              </Text>
            </TouchableOpacity>
          </Row>
        </View>
      </View>
    </Modal>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
  },
  wrapContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  lottieView: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    marginBottom: 5,
    overflow: 'hidden',
  },
  btnDismiss: {
    borderRadius: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    paddingVertical: 10,
    borderColor: '#344054',
  },
  btnRetry: {
    borderRadius: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    paddingVertical: 10,
    borderColor: '#0080F6',
  },
});
