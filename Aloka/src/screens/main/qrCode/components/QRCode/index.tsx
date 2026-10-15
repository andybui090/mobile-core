import React, { useContext, useRef } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@rneui/themed';
import Config from 'react-native-config';
import QRCodeSVG from 'react-native-qrcode-svg';
import { ICON_TYPE, IconX, ImageHelper, Wrapper } from '@/components';
import { images } from '@/configs';
import { AppContext } from '@/contexts';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';

interface QRCodeProps {
  showMyQRCode?: boolean;
  saveQrCode?: (base64: string) => void;
  shareQrCode?: (base64: string, targetUrl: string) => void;
}

export const QRCode: React.FC<QRCodeProps> = ({
  showMyQRCode = true,
  saveQrCode,
  shareQrCode,
}) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const { user } = useContext<any>(AppContext) || {};
  const { profileData } = useAppSelector(state => state.profileReducer);
  const currentUser =
    (profileData as any)?.data?.result || (profileData as any)?.data || user || {};

  const qrCodeRef = useRef<any>(null);

  const name =
    currentUser?.full_name ||
    currentUser?.personalization?.channel_name ||
    currentUser?.name ||
    currentUser?.username ||
    'User';

  const avatar = currentUser?.avatar || currentUser?.personalization?.avatar;
  const username = currentUser?.username || '';
  const doctorId = currentUser?.id || user?.id || '';

  // Generate target URL matching Doctor Network profile URL
  const targetUrl = doctorId
    ? `${Config.SHARE_WEB_URL}/doctor?id=${doctorId}`
    : `${Config.SHARE_WEB_URL}/user/${username || 'profile'}`;

  const handleSave = () => {
    if (qrCodeRef.current && saveQrCode) {
      qrCodeRef.current.toDataURL((data: string) => {
        saveQrCode(data);
      });
    }
  };

  const handleShare = () => {
    if (qrCodeRef.current && shareQrCode) {
      qrCodeRef.current.toDataURL((data: string) => {
        shareQrCode(data, targetUrl);
      });
    }
  };

  const renderErrorAvatar = () => (
    <Image
      source={images.global.no_avatar}
      style={styles.avatarImg}
      resizeMode="cover"
    />
  );

  return (
    <Wrapper style={styles.container}>
      <View style={styles.contentWrap}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          {avatar ? (
            <ImageHelper
              source={{ uri: avatar }}
              renderErrorImage={renderErrorAvatar}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          ) : (
            renderErrorAvatar()
          )}
        </View>

        {/* Name and Handle */}
        <CText style={styles.nameText} numberOfLines={1}>
          {name}
        </CText>
        {!!username && (
          <CText style={styles.usernameText}>
            {`@${username}`}
          </CText>
        )}

        {/* QR Code Container */}
        <View style={styles.qrWrapper}>
          <QRCodeSVG
            value={targetUrl}
            size={200}
            color={colors.c101828 || '#101828'}
            backgroundColor="#FFFFFF"
            getRef={(ref: any) => {
              qrCodeRef.current = ref;
            }}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {saveQrCode && (
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.7}
              onPress={handleSave}
            >
              <Row center>
                <IconX
                  type="materialicons"
                  name="save-alt"
                  size={22}
                  color={colors.primary || '#19A2A7'}
                />
                <CText style={styles.saveButtonText}>
                  {t('profile.saveQrCode', 'Lưu mã QR')}
                </CText>
              </Row>
            </TouchableOpacity>
          )}

          {shareQrCode && (
            <TouchableOpacity
              style={styles.shareButton}
              activeOpacity={0.7}
              onPress={handleShare}
            >
              <Row center>
                <IconX
                  type="ionicons"
                  name="share-social-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <CText style={styles.shareButtonText}>
                  {t('profile.shareQrCode', 'Chia sẻ mã QR')}
                </CText>
              </Row>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Wrapper>
  );
};

export default QRCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  contentWrap: {
    alignItems: 'center',
    paddingTop: 28,
    width: '100%',
    paddingHorizontal: 24,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#EAECF0',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: 68,
    height: 68,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#98A2B3',
    marginBottom: 8,
  },
  qrWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionsContainer: {
    width: '100%',
    marginTop: 24,
    gap: 12,
    alignItems: 'center',
  },
  saveButton: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#19A2A7',
    paddingVertical: 10,
    paddingHorizontal: 28,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#19A2A7',
    marginLeft: 8,
  },
  shareButton: {
    borderRadius: 10,
    backgroundColor: '#19A2A7',
    paddingVertical: 11,
    paddingHorizontal: 28,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
