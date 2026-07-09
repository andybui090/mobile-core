import { images, screenStyles } from '@/configs';
import { CText } from '@/utils';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

export const BottomMenuItem = ({ isFocused, index, isExpert }: any) => {
  const { t } = useTranslation();

  const renderItemUnactive = (src: any, title: string) => {
    return (
      <View style={style.wrapItem}>
        <Image source={src} style={screenStyles.box18} resizeMode="contain" />
        <CText h7 color={'#959598'} style={screenStyles.mT3}>
          {title}
        </CText>
      </View>
    );
  };

  const renderItemActive = (src: any, title: string) => {
    return (
      <View style={style.wrapItem}>
        <Image source={src} style={screenStyles.box18} resizeMode="contain" />
        <CText h7 color={'#19A2A7'} style={screenStyles.mT3}>
          {title}
        </CText>
      </View>
    );
  };

  const renderItemAssitant = (src: any, title: string) => {
    return (
      <View style={style.wrapItem}>
        <Image source={src} style={screenStyles.box18} resizeMode="contain" />
        <CText h7 color={'#959598'} style={screenStyles.mT3}>
          {title}
        </CText>
      </View>
    );
  };

  switch (index) {
    case 0:
      return isFocused
        ? renderItemActive(images.bottomTab.carely_home_active, t('common.home', 'Home'))
        : renderItemUnactive(images.bottomTab.carely_home_unactive, t('common.home', 'Home'));
    case 1:
      return isFocused
        ? renderItemActive(images.bottomTab.drnetwork, "Doctor Network")
        : renderItemUnactive(images.bottomTab.drnetwork, "Doctor Network");
    case 2:
      return isFocused
        ? renderItemActive(images.bottomTab.appointment_active, t('profile.appoints', 'Appointment'))
        : renderItemUnactive(images.bottomTab.appointment_unactive, t('profile.appoints', 'Appointment'));
    case 3:
      return isFocused
        ? renderItemAssitant(images.bottomTab.carely_account, t('common.account', 'Account'))
        : renderItemAssitant(images.bottomTab.carely_account, t('common.account', 'Account'));
    default:
      break;
  }
};

const style = StyleSheet.create({
  wrapItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});