import { TourGuideZone } from '@/components/rn-tourguide-custom';
import { ScreenWidth, getBottomSpace, ifIphoneX } from '@/configs';
import { TOUR_KEY } from '@/constants';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomMenuItem } from './BottomMenuItem';
import registercustomAnimations from './animations';
import withPressAnimated from './animations/withPressAnimated';

registercustomAnimations();
const AnimatedTouch = withPressAnimated(TouchableOpacity);

export const TabBar = ({state, descriptors, navigation, isExpert}) => {
  const {t} = useTranslation();
  const renderItem = (route, index) => {
    const {options} = descriptors[route.key];
    const isFocused = state.index === index;

    const onPress = i => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
      });
      if (!isFocused && !event.defaultPrevented) {
        // console.log("🚀 ~ onPress ~ route.name:", route.name)
        if (route.name === 'DrNetworkTab') {
          navigation.navigate('rootRoute');
        } else {
          navigation.navigate(route.name);
        }
      } else {
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
      >
        <BottomMenuItem
          isFocused={isFocused}
          index={index}
          isExpert={isExpert}
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
          {state.routes.map((route, index) => (
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
