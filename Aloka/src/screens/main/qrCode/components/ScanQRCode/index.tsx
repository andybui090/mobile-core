import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@rneui/themed';
import {
  CameraDevice,
  Camera as VisionCamera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { IconX, Toast } from '@/components';
import { images, requestCameraPermission, showToast } from '@/configs';
import { CText } from '@/utils';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

export const ScanQRCode: React.FC<any> = () => {
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const toastEl = useRef<any>(null);
  const cameraRef = useRef<VisionCamera>(null);
  const isScanningRef = useRef<boolean>(false);

  const [isActiveCam, setIsActiveCam] = useState<boolean>(false);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const device = useCameraDevice(cameraPosition);

  const checkAndRequestPermission = async (showAlert = false) => {
    const result = await requestCameraPermission(showAlert);
    if (result.isSuccess) {
      setIsActiveCam(true);
    } else {
      setIsActiveCam(false);
      if (result.msg && showAlert) {
        showToast(toastEl, result.msg);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      isScanningRef.current = false;
      checkAndRequestPermission(false);
    } else {
      setIsActiveCam(false);
    }
  }, [isFocused]);

  const showSuccessAlert = (message?: string) => {
    Alert.alert(
      t('common.success', 'Thành công'),
      message || t('profile.scanQrSuccess', 'Quét mã QR thành công!'),
      [
        {
          text: t('common.close', 'Đóng'),
          onPress: () => {
            setTimeout(() => {
              isScanningRef.current = false;
            }, 1000);
          },
        },
      ]
    );
  };

  const showFailureAlert = (message?: string) => {
    Alert.alert(
      t('common.failure', 'Thất bại'),
      message || t('error.barCodeInvalid', 'Mã QR không hợp lệ'),
      [
        {
          text: t('common.close', 'Đóng'),
          onPress: () => {
            setTimeout(() => {
              isScanningRef.current = false;
            }, 1000);
          },
        },
      ]
    );
  };

  const handleProcessCode = (stringData: string) => {
    if (!stringData) {
      showFailureAlert(t('error.barCodeInvalid', 'Mã QR không hợp lệ'));
      return;
    }

    try {
      // 1. Check if it's JSON from Doctor Network profile (drNetworK_profile)
      if (stringData.startsWith('{') && stringData.endsWith('}')) {
        const data = JSON.parse(stringData);
        const targetId = data?.userId || data?.channelId || data?.id;
        if (targetId) {
          showSuccessAlert(t('profile.scanQrSuccess', 'Quét mã QR thành công!'));
          return;
        }
      }

      // 2. Check if it's doctor web URL (e.g. https://doctornetwork.us/doctor?id=...)
      if (stringData.includes('/doctor?id=')) {
        const match = stringData.match(/id=([^&]*)/);
        const doctorId = match ? match[1] : null;
        if (doctorId) {
          showSuccessAlert(t('profile.scanQrSuccess', 'Quét mã QR thành công!'));
          return;
        }
      }

      // 3. Check if it contains utm_source (from Doctor Network share/community links)
      if (stringData.includes('utm_source=')) {
        const match = stringData.match(/utm_source=([^&]*)/);
        const doctorId = match ? match[1] : null;
        if (doctorId) {
          showSuccessAlert(t('profile.scanQrSuccess', 'Quét mã QR thành công!'));
          return;
        }
      }

      // 4. Check if it's user profile URL (e.g. /user/:id)
      if (stringData.includes('/user/')) {
        const match = stringData.match(/\/user\/([^/?#]+)/);
        const userId = match ? match[1] : null;
        if (userId) {
          showSuccessAlert(t('profile.scanQrSuccess', 'Quét mã QR thành công!'));
          return;
        }
      }

      // 5. Check if it's generic valid web URL
      if (stringData.startsWith('http://') || stringData.startsWith('https://')) {
        showSuccessAlert(t('profile.scanQrSuccess', 'Quét mã QR thành công!'));
        return;
      }

      // Không khớp định dạng hợp lệ nào -> Báo thất bại
      showFailureAlert(t('error.barCodeInvalid', 'Mã QR không hợp lệ'));
    } catch (error) {
      console.log('Scan QR error:', error);
      showFailureAlert(t('error.barCodeInvalid', 'Mã QR không hợp lệ'));
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (isScanningRef.current) return;
      if (!codes || codes.length === 0) return;
      const stringData = codes[0]?.value;
      if (!stringData) return;
      isScanningRef.current = true;
      handleProcessCode(stringData);
    },
  });

  return (
    <View style={styles.container}>
      {/* Camera Live Stream */}
      {device && isActiveCam ? (
        <VisionCamera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          video={false}
          audio={false}
          photo={false}
          isActive={isFocused && isActiveCam}
          device={device as CameraDevice}
          codeScanner={codeScanner}
        />
      ) : (
        <TouchableOpacity
          style={styles.camUnavailableBox}
          activeOpacity={0.7}
          onPress={() => checkAndRequestPermission(true)}
        >
          <IconX
            type="ionicons"
            name="videocam-off-outline"
            size={40}
            color="#98A2B3"
          />
          <CText style={styles.unavailableText}>
            {t('profile.cameraUnavailable', 'Camera không khả dụng')}
          </CText>
          <CText style={styles.retryText}>
            {t('profile.tapToEnableCamera', 'Chạm vào đây để cấp quyền Camera')}
          </CText>
        </TouchableOpacity>
      )}

      {/* Scanner Frame View */}
      <View style={styles.frameWrapper} pointerEvents="none">
        <Image
          source={images.setting.iconFram}
          style={styles.framStyle}
          resizeMode="contain"
        />
      </View>

      <CText style={styles.hintText}>
        {t('profile.scanHint', 'Đặt mã QR vào giữa khung hình để quét')}
      </CText>

      <Toast ref={toastEl} position="center" />
    </View>
  );
};

export default ScanQRCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenWidth,
    backgroundColor: '#000000',
  },
  frameWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  framStyle: {
    height: ScreenHeight / 3,
    width: ScreenWidth - 120,
  },
  camUnavailableBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  unavailableText: {
    color: '#98A2B3',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 32,
    opacity: 0.85,
    zIndex: 2,
  },
});
