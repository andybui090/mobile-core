import { Wrapper } from '@/components';
import { images, isIOS, screenStyles } from '@/configs';
import { CButton, CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Linking,
  StyleSheet,
  View
} from 'react-native';
// import { useIsFocused } from '@react-navigation/native';
// import { openDoctorNetworkApp } from '@/navigation/app-helper';

const DrNetworkScreen: React.FC<any> = ({ navigation }: any) => {
  
  // const isFocus = useIsFocused();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  // useEffect(() => {
  //   // if (isFocus) {
  //   //   openDoctorNetworkApp();
  //   //   const timer = setTimeout(() => {
  //   //     navigation.navigate('HomeTab');
  //   //   }, 500);
  //   //   return () => clearTimeout(timer);
  //   // }
  // }, [isFocus, navigation]);

  const handleOpenDrApp = async () => {
    try {
      const scheme = 'doctornetwork://';
      const storeUrl = isIOS
        ? 'https://apps.apple.com/app/doctor-networks/id1671676828'
        : 'https://play.google.com/store/apps/details?id=com.anonymous.doctornetwork';

      const canOpen = await Linking.canOpenURL(scheme).catch(() => false);
      if (canOpen) {
        await Linking.openURL(scheme);
      } else {
        Linking.openURL(scheme).catch(async () => {
          await Linking.openURL(storeUrl).catch(err => {
            console.log('Cannot open store url', err);
          });
        });
      }
    } catch (error) {
      console.log('openDoctorNetworkApp error:', error);
    }
  };

  return (
    <Wrapper>
      <View style={styles.container}>
        <Image
          source={images.bottomTab.drnetwork}
          style={styles.logo}
          resizeMode="contain"
        />
        <CText h2 color={colors.c101828} w600>
          {'Doctor Network'}
        </CText>
        <CText h4 color={colors.c667085} style={screenStyles.mV15}>
          {t('common.connectDr', 'Connect & Open Doctor Network')}
        </CText>

        <CButton
          title={t('common.openDr')}
          btnWidth={'100%'}
          onPress={handleOpenDrApp}
          isBottom
        />
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
});

export default DrNetworkScreen;
