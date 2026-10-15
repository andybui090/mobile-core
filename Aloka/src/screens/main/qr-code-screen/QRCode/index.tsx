import { IconType, IconX, ImageHelper, Wrapper } from '@/components';
import { images, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { CEmptyData, CLoading, CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Config from 'react-native-config';

import RNQRGenerator from 'rn-qr-generator';

export default function QRCode({ showMyQRCode, saveQrCode }: any) {
  const { user, linkInviteFriend }: any = useContext(AppContext);
  const { avatar } = user?.personalization || '';
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const [qrCodeImg, setQRCodeImg] = useState<string>('');
  const [qrBase64, setQrBase64] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setQRCodeImg('');
    setQrBase64('');

    const url = showMyQRCode
      ? user?.id
        ? `${Config.SHARE_WEB_URL}/doctor?id=${user.id}`
        : ''
      : linkInviteFriend;

    if (!url) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const initQRImage = () => {
      RNQRGenerator.generate({
        value: url,
        height: 200,
        width: 200,
        correctionLevel: 'M',
        base64: true,
      })
        .then(response => {
          if (cancelled) return;
          const { uri, width, height, base64 } = response;
          setQRCodeImg(uri);
          if (base64 && base64 != '') {
            setQrBase64(base64);
          }
          setIsLoading(false);
        })
        .catch(error => {
          if (cancelled) return;
          setIsLoading(false);
          console.log('Cannot create QR code', error);
        });
    };
    initQRImage();
    return () => {
      cancelled = true;
    };
  }, [showMyQRCode, user?.id, linkInviteFriend]);

  const renderQRCode = () => {
    if (qrCodeImg == '') {
      return <CEmptyData />;
    }
    return (
      <View style={styles.QRWrapper}>
        <Image
          source={{ uri: qrCodeImg }}
          style={{
            width: 200,
            height: 200,
          }}
        />
      </View>
    );
  };

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box40}
        resizeMode="contain"
      />
    );
  };

  if (isLoading) {
    return <CLoading />;
  } else {
    return (
      <Wrapper>
        <View style={styles.container}>
          <View
            style={[
              styles.imgWrap,
              ,
              {
                borderWidth: 1,
                borderColor: colors.cF9FAFB,
                backgroundColor: colors.cEAECF0,
              },
            ]}
          >
            <ImageHelper
              source={{
                uri: avatar,
              }}
              renderErrorImage={renderErrorImage}
            />
          </View>
          <CText h5 w600 color={colors.c101828}>
            {user?.full_name ?? user?.username}
          </CText>
          {user?.username && (
            <CText h5 color={colors.c98A2B3}>
              {`@${user.username}`}
            </CText>
          )}
          {renderQRCode()}
          {qrBase64 != '' ? (
            <Pressable onPress={() => saveQrCode(qrBase64)}>
              <Row
                start
                style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingHorizontal: 36,
                  paddingVertical: 8,
                  borderColor: colors.primary,
                  marginTop: 20,
                }}
              >
                <IconX
                  type={IconType.MATERIAL_ICONS}
                  name="save-alt"
                  size={26}
                  color={colors.primary}
                />
                <CText h4 w400 color={colors.primary} style={screenStyles.mL10}>
                  {t('profile.saveQrCode', 'Save QRCode')}
                </CText>
              </Row>
            </Pressable>
          ) : null}
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
  },
  imgWrap: {
    ...screenStyles.centerWrap,
    height: 64,
    width: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 8,
  },
  QRWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 20,
    marginTop: 40,
  },
});
