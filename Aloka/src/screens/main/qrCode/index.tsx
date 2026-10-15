import React, { useContext, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@rneui/themed';
import Share from 'react-native-share';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { CHeader, ICON_TYPE, IconX, Toast, Wrapper } from '@/components';
import { requestPhotoLibrarySavePermission, showToast } from '@/configs';
import { AppContext } from '@/contexts';
import { CText, Row } from '@/utils';
import QRCode from './components/QRCode';
import ScanQRCode from './components/ScanQRCode';
import useStyles from './styles';

export const QRCodeScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const styles = useStyles();
  const toastEl = useRef<any>(null);
  const { user } = useContext<any>(AppContext) || {};

  // 0: My QR Code, 1: Scan QR Code (matching Doctor Network)
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleSaveQRCode = async (qrBase64: string) => {
    if (!qrBase64) return;
    try {
      // 1. Kiểm tra & xin quyền lưu vào thư viện ảnh
      const permResult = await requestPhotoLibrarySavePermission(true);
      if (!permResult.isSuccess) {
        if (permResult.msg) {
          showToast(toastEl, permResult.msg);
        }
        return;
      }

      // 2. Chuẩn hoá dữ liệu base64
      const cleanBase64 = qrBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      // 3. Ghi file tạm vào cache directory
      const fileName = `aloka_qr_${Date.now()}.png`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      await RNFS.writeFile(filePath, cleanBase64, 'base64');

      // 4. Lưu vào thư viện ảnh (Camera Roll)
      await CameraRoll.save(`file://${filePath}`, { type: 'photo' });

      // 5. Xoá file tạm
      await RNFS.unlink(filePath).catch(() => {});

      showToast(
        toastEl,
        t('profile.saveQrCodeSuccess', 'QRCode đã được lưu vào thư viện ảnh'),
        1500
      );
    } catch (error: any) {
      console.log('Save QR error:', error);
      showToast(
        toastEl,
        t('profile.saveQrCodeFailed', 'Lưu mã QR thất bại'),
        1500
      );
    }
  };

  const handleShareQRCode = async (qrBase64: string, targetUrl: string) => {
    try {
      const shareUrl = qrBase64
        ? qrBase64.startsWith('data:image')
          ? qrBase64
          : `data:image/png;base64,${qrBase64}`
        : targetUrl;

      await Share.open({
        title: t('profile.shareQrCode', 'Chia sẻ mã QR'),
        message: targetUrl,
        url: shareUrl,
      });
    } catch (error: any) {
      if (error?.message && error.message !== 'User did not share') {
        console.log('Share QR error:', error);
      }
    }
  };

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('PartnerProfileTab');
    }
  };

  const renderFooter = () => (
    <Row around style={styles.footer}>
      <TouchableOpacity
        onPress={() => setTabIndex(0)}
        style={tabIndex === 0 ? styles.btnActive : styles.btn}
        activeOpacity={0.7}
      >
        <IconX
          type="materialicons"
          name="qr-code"
          size={20}
          color={tabIndex === 0 ? '#FFFFFF' : (colors.c667085 || '#667085')}
        />
        <CText style={tabIndex === 0 ? styles.btnTextActive : styles.btnTextInactive}>
          {t('myprofile.myQrCode', 'Mã QR của tôi')}
        </CText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setTabIndex(1)}
        style={tabIndex === 1 ? styles.btnActive : styles.btn}
        activeOpacity={0.7}
      >
        <IconX
          type="ionicons"
          name="scan-outline"
          size={20}
          color={tabIndex === 1 ? '#FFFFFF' : (colors.c667085 || '#667085')}
        />
        <CText style={tabIndex === 1 ? styles.btnTextActive : styles.btnTextInactive}>
          {t('myprofile.scanQrCode', 'Quét mã QR')}
        </CText>
      </TouchableOpacity>
    </Row>
  );

  const renderContent = () => {
    if (tabIndex === 0) {
      return (
        <QRCode
          saveQrCode={handleSaveQRCode}
          shareQrCode={handleShareQRCode}
        />
      );
    }
    return <ScanQRCode navigation={navigation} />;
  };

  return (
    <Wrapper style={{ flex: 1, backgroundColor: tabIndex === 1 ? '#000000' : '#FFFFFF' }}>
      <CHeader
        leftComponentOnPress={handleBack}
        title={t('profile.qrCode', 'Mã QR')}
        isBorderBottom={tabIndex === 0}
        rightComponentDisable
      />
      <View style={styles.container}>
        {renderContent()}
        {renderFooter()}
      </View>
      <Toast ref={toastEl} position="center" />
    </Wrapper>
  );
};

export default QRCodeScreen;
