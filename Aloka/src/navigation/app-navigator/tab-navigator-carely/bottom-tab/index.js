import { TourGuideZone } from '@/components/rn-tourguide-custom';
import {
  GAEvents,
  GALogEvent,
  ScreenWidth,
  getBottomSpace,
  ifIphoneX,
} from '@/configs';
import { TOUR_KEY } from '@/constants';
import { carelyRootRoute } from '@/constants/route_key';
import { reloadHomeScreen } from '@/redux/slices/homeSlice';
import { useAppDispatch } from '@/redux/store/customReduxHook';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import { BottomMenuItem } from './BottomMenuItem';
import registercustomAnimations from './animations';
import withPressAnimated from './animations/withPressAnimated';

registercustomAnimations();
const AnimatedTouch = withPressAnimated(TouchableOpacity);

export const TabBar = ({
  state,
  descriptors,
  navigation,
  isExpert,
  onPressMenu,
  isShowMenu,
  closeMenu,
  onPressCarely,
}) => {
  const {t} = useTranslation();
  const renderItem = (route, index) => {
    const {options} = descriptors[route.key];
    const isFocused = state.index === index;

    const dispatch = useAppDispatch();

    const onPress = i => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
      });
      if (!isFocused && !event.defaultPrevented) {
        switch (route.name) {
          case 'HomeTab':
            break;
          case 'NearbyTab':
            GALogEvent(GAEvents.NEARBY_BUTTON_CLICKED, {
              method: 'App nearby button clicked',
            });
            break;
          case 'DATab':
            GALogEvent(GAEvents.DA_BUTTON_CLICKED, {
              method: 'App DA button clicked',
            });
            break;
          case 'NewsfeedTab':
            GALogEvent(GAEvents.NEWSFEED_BUTTON_CLICKED, {
              method: 'App newsfeed button clicked',
            });
            break;
          case 'CourseTab':
            GALogEvent(GAEvents.COURSE_BUTTON_CLICKED, {
              method: 'App course button clicked',
            });
            break;
          case 'CommunityTab':
            GALogEvent(GAEvents.COMMUNITY_BUTTON_CLICKED, {
              method: 'App community button clicked',
            });
            break;
          default:
            break;
        }
        if (route.name === 'MenuTab') {
          onPressMenu?.(); // 👉 mở bottom sheet
        } else if (route.name == 'CarelyTab') {
          closeMenu?.();
          // cho nay thay doi cho moi truong production
          if (Config.ENV === 'staging') {
            navigation.navigate(carelyRootRoute, null);
          } else {
            // show popup tinh nang sap ra mat
            //  onPressCarely?.();
            navigation.navigate(carelyRootRoute, null);
          }
        } else {
          closeMenu?.(); // 👉 đóng bottom sheet nếu đang mở
          navigation.navigate(route.name);
          console.log('🚀 ~ onPress ~ route.name:', route.name);
        }
      } else {
        if (isShowMenu) {
          closeMenu?.(); // 👉 đóng bottom sheet nếu đang mở
        }
        if (route.name == 'HomeTab') {
          dispatch(reloadHomeScreen({isReload: true}));
        }
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <AnimatedTouch
        key={index}
        activeOpacity={0.5}
        accessibilityRole="button"
        accessibilityStates={isFocused ? ['selected'] : []}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        // style={styles.container}
      >
        <BottomMenuItem
          isFocused={isFocused}
          index={index}
          isExpert={isExpert}
          isShowMenu={isShowMenu}
        />
      </AnimatedTouch>
    );
  };

  return (
    <TourGuideZone
      zone={5}
      text={t('tourguide.home.step5')}
      borderRadius={4}
      tooltipBottomOffset={10}
      tourKey={TOUR_KEY.home}>
      <View style={[styles.tabContainer]}>
        <View style={{flexDirection: 'row', flex: 1}}>
          {state.routes.slice(0, 5).map((route, index) => (
            <View key={route.key} style={styles.container}>
              {renderItem(route, index)}
            </View>
          ))}
        </View>
      </View>
    </TourGuideZone>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    height: 55 + getBottomSpace() - ifIphoneX(16, 0),
    paddingBottom: getBottomSpace() - ifIphoneX(16, 0),
    backgroundColor: 'white',
    width: ScreenWidth,
    paddingHorizontal: 12,
  },
});
