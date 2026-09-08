import { CHeader, ICON_TYPE, IconX, Wrapper } from '@/components';
import { images } from '@/configs';
import { CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

const AboutUsScreen: React.FC<any> = ({ navigation }: any) => {
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const secondaryColor = colors.c667085 || '#667085';
  const iconColor = colors.c98A2B3 || '#98A2B3';

  return (
    <Wrapper>
      <CHeader
        title={t('settings.aboutUs', 'Về Chúng tôi')}
        leftComponentOnPress={() => {
          if (navigation?.canGoBack?.()) {
            navigation.goBack();
          }
        }}
        isBorderBottom
      />

      <View style={styles.container}>
        <Image source={images.setting.logo_Aloka} style={styles.logo} />
        {/* <CText h4 w600 color={colors.c101828 || '#101828'} style={styles.companyName}>
          {'ALOKA'}
        </CText> */}

        {/* ADDRESS */}
        <Row start style={styles.infoRow}>
          <View style={styles.iconWrapper}>
            <IconX
              type={ICON_TYPE.OCTICONS}
              name={'location'}
              size={20}
              color={iconColor}
            />
          </View>

          <CText color={secondaryColor} h5 style={styles.infoText} w500>
            {
              'Tầng văn phòng F3, Tòa nhà 187 Nguyễn Lương Bằng, Phường Đống Đa, TP. Hà Nội'
            }
          </CText>
        </Row>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 28,
    paddingHorizontal: 24,
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  companyName: {
    marginTop: 16,
    marginBottom: 24,
  },
  infoRow: {
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  iconWrapper: {
    width: 20,
    alignItems: 'center',
    marginTop: 5,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    lineHeight: 28,
  },
});

export default AboutUsScreen;
