import { images, screenStyles } from '@/configs';
import { CText } from '@/utils';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

export const BottomMenuItem = ({ isFocused, index }: any) => {
  const { t } = useTranslation();

  const renderItemUnactive = (src: any, title: string) => {
    return (
      <View style={style.wrapItem}>
        <Image source={src} style={screenStyles.box20} resizeMode="contain" />
        <CText h7 color={'#959598'} style={screenStyles.mT3}>
          {title}
        </CText>
      </View>
    );
  };

  const renderItemActive = (src: any, title: string) => {
    return (
      <View style={style.wrapItem}>
        <Image source={src} style={screenStyles.box20} resizeMode="contain" />
        <CText h7 color={'#19A2A7'} style={screenStyles.mT3}>
          {title}
        </CText>
      </View>
    );
  };

  switch (index) {
    case 0:
      return isFocused
        ? renderItemActive(
            images.bottomTab.work_active,
            t('common.work', 'Công việc'),
          )
        : renderItemUnactive(
            images.bottomTab.work_unactive,
            t('common.work', 'Công việc'),
          );
    case 1:
      return isFocused
        ? renderItemActive(
            images.bottomTab.account_active,
            t('common.account', 'Account'),
          )
        : renderItemUnactive(
            images.bottomTab.account_unactive,
            t('common.account', 'Account'),
          );
    case 2:
      return isFocused
        ? renderItemActive(
            images.bottomTab.wallet_active,
            t('common.wallet', 'Wallet'),
          )
        : renderItemUnactive(
            images.bottomTab.wallet_unactive,
            t('common.wallet', 'Wallet'),
          );
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
