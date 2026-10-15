import { CHeader, IconType, IconX, Toast, Wrapper } from '@/components';
import { AppContext } from '@/contexts';
import { goBack } from '@/navigation/RootNavigation';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
// import RNQRGenerator from 'rn-qr-generator';
import { screenStyles, ScreenWidth, showToast } from '@/configs';
import {
  DocumentDirectoryPath,
  writeFile
} from '@dr.pogodin/react-native-fs';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import moment from 'moment';
import QRCode from './QRCode';
import ScanQRCode from './ScanQRCode';
import { videoDownloadPermission } from '@/permissions';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    alignItems: 'center' as const,
  },
  textTitle: {},
  footer: {
    position: 'absolute' as const,
    bottom: 37,
    backgroundColor: colors.cF2F4F7,
    width: ScreenWidth - 48,
    borderRadius: 15,
    marginHorizontal: 24,
    paddingVertical: 10,
    // display: 'flex',
    justifyContent: 'space-around' as const,
    paddingHorizontal: 10,
  },
  btnActive: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  btn: {
    backgroundColor: colors.cF2F4F7,
    borderRadius: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  rightWrapper: {
    right: 20,
    position: 'absolute' as const,
    ...screenStyles.rowCenter,
  },
}));

const QRCodeScreen: React.FC<any> = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const { user, isDoctor }: any = useContext(AppContext);
  const toastEl = useRef<any>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const dispatch = useAppDispatch();

  const { avatar } = user?.personalization || '';

  // -------------------------------
  // STATE
  // -------------------------------
  const [tabIndex, setTabIndex] = useState(0);

  const [showMyQRCode, setShowMyQRCode] = useState(false);

  useEffect(() => {
    // if (isDoctor) {
    //   setShowMyQRCode(true);
    // }
    setShowMyQRCode(true);
  }, [user]);

  // -------------------------------
  // ACTION
  // -------------------------------
  const handleSaveQRCode = async (qrBase64: string) => {
    if (qrBase64 !== '') {
      try {
        const aPath = DocumentDirectoryPath;
        const fileName = `doctornetwork_${moment().unix()}.jpeg`;
        const imagePath = `${aPath}/${fileName}`;
        // 🔥 ghi file base64 ra temp
        await writeFile(imagePath, qrBase64, 'base64');
        // if (Platform.OS === 'android') {
        //   // ✅ Android → MediaStore
        //   await MediaStoreModule.saveMedia(imagePath, fileName, 'image');
        //   // xoá file temp
        //   await unlink(imagePath);
        //   showToast(
        //     toastEl,
        //     t('profile.saveQrCodeSuccess', 'Save QRCode success'),
        //     1500,
        //   );
        //   console.log('✅ QR saved Android');
        // } else {
        // ===== GIỮ NGUYÊN iOS =====
        const checkVideoDownLoad: any = await videoDownloadPermission();
        if (checkVideoDownLoad.isSuccess) {
          await CameraRoll.saveAsset(imagePath);
          showToast(
            toastEl,
            t('profile.saveQrCodeSuccess', 'Save QRCode success'),
            1500,
          );
          console.log('✅ QR saved iOS');
        } else if (checkVideoDownLoad.msg) {
          console.log(checkVideoDownLoad.msg);
        }
        // }
        bottomSheetModalRef.current?.close();
      } catch (error) {
        console.log('🔥 Save QR error:', error);
        showToast(toastEl, JSON.stringify(error));
      }
    }
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------

  const renderTab = () => {
    // return <QRCode showMyQRCode={showMyQRCode} saveQrCode={handleSaveQRCode} />;
    if (tabIndex === 0) {
      return (
        <QRCode showMyQRCode={showMyQRCode} saveQrCode={handleSaveQRCode} />
      );
    } else {
      return <ScanQRCode navigation={navigation} />;
    }
  };

  const _renderFooter = () => {
    return (
      <Row around style={styles.footer}>
        <Pressable
          onPress={() => setTabIndex(0)}
          style={[tabIndex === 0 ? styles.btnActive : styles.btn]}
        >
          <IconX
            style={{ marginRight: 8 }}
            name="qr-code"
            size={20}
            type={IconType.MATERIAL_ICONS}
            color={tabIndex === 0 ? colors.white : colors.c667085}
          />
          <CText color={tabIndex === 0 ? colors.white : colors.c667085}>
            {t('myprofile.myQrCode', 'My QR Code')}
          </CText>
        </Pressable>
        <Pressable
          onPress={() => setTabIndex(1)}
          style={[tabIndex === 1 ? styles.btnActive : styles.btn, {}]}
        >
          <IconX
            style={{ marginRight: 8 }}
            name="line-scan"
            size={20}
            type={IconType.MATERIAL_DESIGN_ICONS}
            color={tabIndex === 1 ? colors.white : colors.c667085}
          />
          <CText color={tabIndex === 1 ? colors.white : colors.c667085}>
            {t('myprofile.scanQrCode', 'Scan QR Code')}
          </CText>
        </Pressable>
      </Row>
    );
  };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={goBack}
        rightComponentDisable
        title={t('profile.qrCode')}
        isBorderBottom
      />
      <View style={styles.container}>
        {renderTab()}
        {_renderFooter()}
      </View>
      <Toast ref={toastEl} position="center" />
    </Wrapper>
  );
};

export default QRCodeScreen;
