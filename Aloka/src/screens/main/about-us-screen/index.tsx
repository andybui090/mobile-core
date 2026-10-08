import { CHeader, IconType, IconX, Wrapper } from '@/components';
import { goBack } from '@/navigation/RootNavigation';
import { CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

const AboutUsScreen: React.FC<any> = () => {
  const {t} = useTranslation();

  const {
    theme: {colors},
  } = useTheme();

  // const handleChooseSupport = (index: number, value: string) => {
  //   try {
  //     if (index === 0) {
  //       Linking.openURL(`tel:${value}`);
  //     } else if (index === 1) {
  //       Linking.openURL(`mailto:${value}`);
  //     }
  //   } catch (error) {}
  // };

  const secondaryColor = colors.c667085;
  const iconColor = colors.c98A2B3;

  return (
    <Wrapper>
      <CHeader
        title={t('settings.aboutUs')}
        leftComponentOnPress={goBack}
        isBorderBottom
      />

      <View style={styles.container}>
        {/* <Image source={images.global.logo_app} style={styles.logo} /> */}

        <CText
          h4
          w600
          color={colors.c101828}
          style={styles.companyName}>
          {"Aloka"}
        </CText>

        {/* ADDRESS */}
        <Row start style={styles.infoRow}>
          <View style={styles.iconWrapper}>
            <IconX
              type={IconType.OCTICONS}
              name={'location'}
              size={20}
              color={iconColor}
            />
          </View>

          <CText
            color={secondaryColor}
            h5
            style={styles.infoText}
            w500>
            {"Tầng văn phòng F3, Tòa nhà 187 Nguyễn Lương Bằng, Phường Đống Đa, TP. Hà Nội"}
          </CText>
        </Row>

        {/* PHONE */}
        {/* <Pressable
          style={styles.pressable}
          onPress={() =>
            handleChooseSupport(0, '(024) 373 475 12')
          }>
          <Row start style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <IconX
                origin={ICON_TYPE.FEATHER_ICONS}
                name={'phone'}
                size={20}
                color={iconColor}
              />
            </View>

            <CText
              color={colors.primary}
              h5
              w500
              style={styles.infoText}>
              {"(024) 373 475 12"}
            </CText>
          </Row>
        </Pressable> */}

        {/* EMAIL */}
        {/* <Pressable
          style={styles.pressable}
          onPress={() =>
            handleChooseSupport(1, 'dn@doctornetwork.vn')
          }>
          <Row start style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <IconX
                origin={ICON_TYPE.ANT_ICON}
                name={'mail'}
                size={20}
                color={iconColor}
              />
            </View>

            <CText
              color={colors.primary}
              h5
              w500
              style={styles.infoText}>
              {"dn@doctornetwork.vn"}
            </CText>
          </Row>
        </Pressable> */}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingTop: 28,
    paddingHorizontal: 24,
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },

  companyName: {
    marginTop: 20,
    marginBottom: 20,
  },

  pressable: {
    borderRadius: 12,
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