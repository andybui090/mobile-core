import {
  ScreenWidth,
  getBottomSpace,
  ifIphoneX,
  screenStyles,
} from '@/configs';
// import { reloadHomeScreen } from '@/redux/slices/homeSlice';
// import { useAppDispatch } from '@/redux/store/customReduxHook';
import { Row } from '@/utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomMenuItem } from './BottomMenuItem';
import registercustomAnimations from './animations';
import withPressAnimated from './animations/withPressAnimated';

registercustomAnimations();
const AnimatedTouch = withPressAnimated(TouchableOpacity);

export const TabBar = ({ state, descriptors, navigation }: any) => {
  const { t } = useTranslation();
  const renderItem = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    // const dispatch = useAppDispatch();

    const onPress = (i: any) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      } else {
        // if (route.name == 'HomeTab') {
        //   dispatch(reloadHomeScreen({ isReload: true }));
        // }
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
        style={styles.container}
      >
        <BottomMenuItem
          isFocused={isFocused}
          index={index}
        />
      </AnimatedTouch>
    );
  };

  return (
    <View style={[styles.tabContainer]}>
      <Row around style={screenStyles.flex1}>
        {state.routes.map((route: any, index: number) =>
          renderItem(route, index),
        )}
      </Row>
    </View>
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
