import {
  assistantTabRoute,
  carelyRootRoute,
  communityRoute,
  courseTabRouteV3,
  homeTabRoute,
  nearbyTabRoute2,
  newsfeedRoute,
} from '@/constants/route_key';
import {
  communityStack,
  courseStack3,
  homeStack,
  nearbyStack2,
  newsfeedStack,
} from '@/screens';
import AssistantScreen from '@/screens/assistant-screen';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import {useCallback, useState} from 'react';
import {TabBar} from './bottom-tab';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {GAEvents, GALogEvent, getBottomSpace, ifIphoneX, images, screenStyles} from '@/configs';
import {CText} from '@/utils/CText';
import {Row} from '@/utils/Row';
import {useTranslation} from 'react-i18next';
import {navigate2} from '@/navigation/RootNavigation';
import CarelyComingSoonModal from './CarelyComingSoonModal';

const Tab = createBottomTabNavigator();

const StackHome = createStackNavigator();
const StackNearby = createStackNavigator();
const StackDiscover = createStackNavigator();
const StackDA = createStackNavigator();
const StackNewsfeed = createStackNavigator();

const StackCommunity = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
};

const screenTabOption: BottomTabNavigationOptions = {
  headerShown: false,
  lazy: true,
};

function HomeStack() {
  return (
    <StackHome.Navigator
      screenOptions={screenOptions}
      initialRouteName={homeTabRoute.homeScreen}>
      {Object.values(homeTabRoute).map(item => {
        return (
          <StackHome.Screen
            key={item}
            name={item}
            component={homeStack[item as keyof typeof homeStack]}
          />
        );
      })}
    </StackHome.Navigator>
  );
}

function NearbyStack() {
  return (
    <StackNearby.Navigator
      screenOptions={screenOptions}
      initialRouteName={nearbyTabRoute2.nearbyScreen2}>
      {Object.values(nearbyTabRoute2).map(item => {
        return (
          <StackNearby.Screen
            key={item}
            name={item}
            component={nearbyStack2[item as keyof typeof nearbyStack2]}
          />
        );
      })}
    </StackNearby.Navigator>
  );
}

function CourseStack() {
  return (
    <StackDiscover.Navigator
      screenOptions={screenOptions}
      initialRouteName={courseTabRouteV3.coursesScreenV2}>
      {Object.values(courseTabRouteV3).map(item => {
        return (
          <StackDiscover.Screen
            key={item}
            name={item}
            component={courseStack3[item as keyof typeof courseStack3]}
          />
        );
      })}
    </StackDiscover.Navigator>
  );
}

//doctor
function DAStack() {
  return (
    <StackDA.Navigator
      screenOptions={screenOptions}
      initialRouteName={assistantTabRoute.assistantScreen}>
      <StackDA.Screen name={'AssistantScreen'} component={AssistantScreen} />
    </StackDA.Navigator>
  );
}

function NewsfeedStack() {
  return (
    <StackNewsfeed.Navigator
      screenOptions={screenOptions}
      initialRouteName={newsfeedRoute.newsfeedScreen}>
      {Object.values(newsfeedRoute).map(item => {
        return (
          <StackNewsfeed.Screen
            key={item}
            name={item}
            component={newsfeedStack[item as keyof typeof newsfeedStack]}
          />
        );
      })}
    </StackNewsfeed.Navigator>
  );
}

function MenuStack() {
  return null;
}

function CarelyEntryScreen() {
  return null;
}

function CommunityStack() {
  return (
    <StackCommunity.Navigator
      screenOptions={screenOptions}
      initialRouteName={communityRoute.tabsCommunity}>
      {Object.values(communityRoute).map(item => {
        return (
          <StackCommunity.Screen
            key={item}
            name={item}
            component={
              communityStack[
                item as keyof typeof communityStack
              ] as React.ComponentType
            }
          />
        );
      })}
    </StackCommunity.Navigator>
  );
}

function BottomTab(props: any) {
  const {
    state,
    descriptors,
    navigation,
    openMenu,
    isShowMenu,
    closeMenu,
    onPressCarely,
  } = props;
  const tabIndex = state.index || 0;
  const currentRoute = state.routes[tabIndex];
  let isHide = false;
  if (currentRoute && currentRoute.state) {
    isHide = currentRoute.state.index;
  }
  const hideBottomTab = isHide || tabIndex == 2 || tabIndex >= 5;
  return (
    !hideBottomTab && (
      <TabBar
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        isExpert={false}
        onPressMenu={openMenu}
        isShowMenu={isShowMenu}
        closeMenu={closeMenu}
        onPressCarely={onPressCarely}
      />
    )
  );
}

export function AppTabCarely() {
  const {t} = useTranslation();

  const [isShowMenu, setIsShowMenu] = useState(false);

  const handleOpenMenu = () => {
    setIsShowMenu(!isShowMenu);
  };

  const handleCloseMenu = () => {
    setIsShowMenu(false);
  };

  const handlePressNearby = useCallback(() => {
    // adding tracking here to check if user click nearby tab in menu
    GALogEvent(GAEvents.NEARBY_BUTTON_CLICKED, { method: 'App nearby button clicked' });
    handleCloseMenu();
    navigate2('NearbyTab', null);
  }, []);

  const handlePressStore = useCallback(() => {
    GALogEvent(GAEvents.COURSE_BUTTON_CLICKED, { method: 'App course button clicked' });
    handleCloseMenu();
    navigate2('CourseTab', null);
  }, []);

  const handlePressCommunity = useCallback(() => {
    GALogEvent(GAEvents.COMMUNITY_BUTTON_CLICKED, { method: 'App community button clicked' });
    handleCloseMenu();
    navigate2('CommunityTab', null);
  }, []);

  // popup comming soon
  const [showCarelyPopup, setShowCarelyPopup] = useState(false);

  // Khi bấm tab / button Carely
  const onPressCarely = () => {
    setShowCarelyPopup(true);
  };

  const renderMenu = () => {
    if (isShowMenu)
      return (
        <>
          <Pressable style={styles.menuMask} onPress={handleCloseMenu} />
          <View style={styles.menuWrapper}>
            <View style={styles.menuContent}>
              <Row
                center
                style={{
                  paddingBottom: 10,
                }}>
                <Image
                  source={images.bottomTab.menu_line}
                  style={{
                    width: 36,
                    height: 8,
                  }}
                  resizeMode="contain"
                />
              </Row>
              <Row end>
                <Pressable
                  style={styles.itemWraper}
                  onPress={handlePressNearby}>
                  <Image
                    source={images.bottomTab.nearby_unactive}
                    style={screenStyles.box18}
                    resizeMode="contain"
                  />
                  <CText h7 color={'#959598'} style={screenStyles.mT3}>
                    {t('common.nearby', 'Nearby')}
                  </CText>
                </Pressable>
                <Pressable style={styles.itemWraper} onPress={handlePressStore}>
                  <Image
                    source={images.bottomTab.course_unactive}
                    style={screenStyles.box18}
                    resizeMode="contain"
                  />
                  <CText h7 color={'#959598'} style={screenStyles.mT3}>
                    {t('home.hotvideo', 'Hot video')}
                  </CText>
                </Pressable>
                <Pressable
                  style={styles.itemWraper}
                  onPress={handlePressCommunity}>
                  <Image
                    source={images.bottomTab.community}
                    style={screenStyles.box18}
                    resizeMode="contain"
                  />
                  <CText h7 color={'#959598'} style={screenStyles.mT3}>
                    {t('community.community', 'Community')}
                  </CText>
                </Pressable>
              </Row>
            </View>
          </View>
        </>
      );
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={screenTabOption}
        tabBar={props => (
          <BottomTab
            {...props}
            isShowMenu={isShowMenu}
            openMenu={handleOpenMenu}
            closeMenu={handleCloseMenu}
            onPressCarely={onPressCarely}
          />
        )}>
        <Tab.Screen name={'HomeTab'} component={HomeStack} />
        <Tab.Screen name="CarelyTab" component={CarelyEntryScreen} />
        <Tab.Screen name={'DATab'} component={DAStack} />
        <Tab.Screen name={'NewsfeedTab'} component={NewsfeedStack} />
        <Tab.Screen name={'MenuTab'} component={MenuStack} />
        <Tab.Screen name={'NearbyTab'} component={NearbyStack} />
        <Tab.Screen name={'CourseTab'} component={CourseStack} />
        <Tab.Screen name={'CommunityTab'} component={CommunityStack} />
      </Tab.Navigator>
      {renderMenu()}
      <CarelyComingSoonModal
        visible={showCarelyPopup}
        onClose={() => setShowCarelyPopup(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  menuMask: {
    position: 'absolute',
    top: 0,
    bottom: 55 + getBottomSpace() - ifIphoneX(16, 0),
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  menuWrapper: {
    position: 'absolute',
    bottom: 55 + getBottomSpace() - ifIphoneX(16, 0),
    left: 0,
    right: 0,
    zIndex: 2,
  },
  menuContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  itemWraper: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 70,
  },
});
