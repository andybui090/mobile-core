import { images } from '@/configs';
import { CText, Row } from '@/utils';
import { useNetInfo } from '@react-native-community/netinfo';
import { ScreenWidth } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

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

  // const handleRetry = () => {
  //   // ❌ Không dùng fetch
  //   // Retry chỉ là UX → hook sẽ tự update khi mạng đổi
  // };

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
          <CText h2 w600 color="#101828">
            {t('network.connectionError', 'No Internet Connection')}
          </CText>
          <View style={styles.lottieView}>
            <Image
              source={images.global.no_internet}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>
          <CText h4 color="#101828" center>
            {t(
              'network.connectionMsg',
              'Oops! Looks like your device is not connected to the Internet.',
            )}
          </CText>
          <Row around style={{width: '100%', marginTop: 24}}>
            <TouchableOpacity onPress={handleDismiss} style={styles.btnDismiss}>
              <CText h4 w500 color="#344054">
                {t('network.dismiss', 'Dismiss')}
              </CText>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={handleRetry} style={styles.btnRetry}>
              <CText h4 w500 color="#0080F6">
                Try Again
              </CText>
            </TouchableOpacity> */}
          </Row>
        </View>
      </View>
    </Modal>
  );
};

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
    width: ScreenWidth / 3,
    height: ScreenWidth / 3,
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
