import React, { useContext, useState } from 'react';
import {
  Dimensions,
  Image,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { CHeader, IconX, ImageHelper, Wrapper } from '@/components';
import { images } from '@/configs';
import { AppContext } from '@/contexts';
import { CText } from '@/utils';

const { width } = Dimensions.get('window');
const QR_SIZE = Math.min(width - 96, 240);

const QRCodeScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { user }: any = useContext(AppContext);

  const name = user?.personalization?.name || user?.full_name || user?.name || user?.username || 'User';
  const avatar = user?.personalization?.avatar || user?.avatar;
  const username = user?.username || user?.id || '';

  // QR Code URL: if user has personalization.qr_code use it, otherwise generate via standard QR service
  const qrTargetUrl = user?.personalization?.qr_code || `https://doctornetwork.us/user/${username}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrTargetUrl)}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Kết nối với tôi trên Doctor Network: ${qrTargetUrl}`,
        url: qrTargetUrl,
        title: `Mã QR của ${name}`,
      });
    } catch (err) {
      console.log('Share QR error:', err);
    }
  };

  return (
    <Wrapper>
      <CHeader
        leftComponentOnPress={() => navigation.goBack()}
        isBorderBottom
        title={t('profile.qrCode', 'Mã QR')}
        rightComponentDisable
      />
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Avatar and Name */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <ImageHelper
                source={{ uri: avatar || '' }}
                renderErrorImage={() => (
                  <Image source={images.global.no_avatar} style={styles.avatar} resizeMode="cover" />
                )}
                style={styles.avatar}
              />
            </View>
            <View style={styles.info}>
              <CText style={styles.name} numberOfLines={1}>{name}</CText>
              <CText style={styles.subText}>Doctor Network</CText>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <Image
              source={{ uri: qrImageUrl }}
              style={{ width: QR_SIZE, height: QR_SIZE }}
              resizeMode="contain"
            />
          </View>

          <CText style={styles.hintText}>
            Quét mã QR để kết nối và xem thông tin hồ sơ
          </CText>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8} onPress={handleShare}>
          <IconX type="ionicons" name="share-social-outline" size={20} color="#FFFFFF" />
          <CText style={styles.shareBtnText}>Chia sẻ mã QR</CText>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#EAECF0',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  subText: {
    fontSize: 13,
    color: '#667085',
    marginTop: 2,
  },
  qrContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F2F4F7',
    marginBottom: 16,
  },
  hintText: {
    fontSize: 13,
    color: '#98A2B3',
    textAlign: 'center',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#19A2A7',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: '100%',
    gap: 8,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default QRCodeScreen;
