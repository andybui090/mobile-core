import { images, screenStyles } from '@/configs';
import { CText } from '@/utils';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

export const BottomMenuItem = ({ isFocused, index, isExpert, isShowMenu }: any) => {
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
        <CText h7 color={'#0080F6'} style={screenStyles.mT3}>
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

  // const renderItemCommunity = (src: any, title: string) => {
  //   return (
  //     <View style={style.wrapItem}>
  //       <Image source={src} style={screenStyles.box16} resizeMode="contain" />
  //       <CText h7 color={'#959598'} style={screenStyles.mT3}>
  //         {title}
  //       </CText>
  //     </View>
  //   );
  // };

  if (isExpert) {
    switch (index) {
      case 0:
        return (isFocused && !isShowMenu)
          ? renderItemActive(images.bottomTab.home_active, t('common.home', 'Home'))
          : renderItemUnactive(images.bottomTab.home_unactive, t('common.home', 'Home'));
      case 1:
        return (isFocused && !isShowMenu)
          ? renderItemActive(images.bottomTab.carely, t('common.carely', 'Carely'))
          : renderItemUnactive(images.bottomTab.carely, t('common.carely', 'Carely'));
      case 2:
        return (isFocused && !isShowMenu)
          ? renderItemAssitant(images.bottomTab.btn_assitant, 'Dr Assistant')
          : renderItemAssitant(images.bottomTab.btn_assitant, 'Dr Assistant');
      case 3:
        return (isFocused && !isShowMenu)
          ? renderItemActive(images.bottomTab.newsfeed_active, t('common.newsfeed', 'Newsfeed'))
          : renderItemUnactive(images.bottomTab.newsfeed_unactive, t('common.newsfeed', 'Newsfeed'));
      case 4:
        return (isFocused || isShowMenu)
          ? renderItemActive(images.bottomTab.menu_active, t('common.more', 'More'))
          : renderItemUnactive(images.bottomTab.menu_unactive, t('common.more', 'More'));
      // case 4:
      //   return isFocused
      //     ? renderItemActive(images.bottomTab.course_active, t('home.hotvideo', 'Hot video'))
      //     : renderItemUnactive(images.bottomTab.course_unactive, t('home.hotvideo', 'Hot video'));
      // case 5:
      //   return renderItemCommunity(images.bottomTab.community, t('community.community', 'Community'));
      default:
        break;
    }
  } else {
    switch (index) {
      case 0:
        return (isFocused && !isShowMenu)
          ? renderItemActive(images.bottomTab.home_active, t('common.home', 'Home'))
          : renderItemUnactive(images.bottomTab.home_unactive, t('common.home', 'Home'));
      case 1:
        return (isFocused && !isShowMenu)
          ? renderItemActive(images.bottomTab.carely, t('common.carely', 'Carely'))
          : renderItemUnactive(images.bottomTab.carely, t('common.carely', 'Carely'));
      case 2:
        return (isFocused && !isShowMenu)
          ? renderItemAssitant(images.bottomTab.btn_assitant, 'Dr Assistant')
          : renderItemAssitant(images.bottomTab.btn_assitant, 'Dr Assistant');
      case 3:
        return (isFocused && !isShowMenu)
          ? renderItemActive(images.bottomTab.newsfeed_active, t('common.newsfeed', 'Newsfeed'))
          : renderItemUnactive(images.bottomTab.newsfeed_unactive, t('common.newsfeed', 'Newsfeed'));
      case 4:
        return (isFocused || isShowMenu)
          ? renderItemActive(images.bottomTab.menu_active, t('common.more', 'More'))
          : renderItemUnactive(images.bottomTab.menu_unactive, t('common.more', 'More')); 
      // case 4:
      //   return isFocused
      //     ? renderItemActive(images.bottomTab.course_active, t('home.hotvideo', 'Hot video'))
      //     : renderItemUnactive(images.bottomTab.course_unactive, t('home.hotvideo', 'Hot video'));
      // case 5:
      //   return renderItemCommunity(images.bottomTab.community, t('community.community', 'Community'));
      default:
        break;
    }
  }
};

const style = StyleSheet.create({
  wrapItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});