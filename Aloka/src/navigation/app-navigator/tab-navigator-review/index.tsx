import {
  assistantTabRoute,
  communityRoute,
  homeTabRoute,
  nearbyTabRoute,
  newsfeedRoute
} from '@/constants/route_key';
import { AppContext } from '@/contexts';
import { UserTypes } from '@/navigation/root-store';
import {
  communityStack,
  homeStack,
  nearbyStack,
  newsfeedStack
} from '@/screens';
import AssistantScreen from '@/screens/assistant-screen';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import { TabBar } from './bottom-tab';

const Tab = createBottomTabNavigator();

const StackHome = createStackNavigator();
const StackNearby = createStackNavigator();
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
    <StackHome.Navigator screenOptions={screenOptions} initialRouteName={homeTabRoute.homeScreen}>
      {Object.values(homeTabRoute).map(item => {
        return <StackHome.Screen key={item} name={item} component={homeStack[item as keyof typeof homeStack]} />;
      })}
    </StackHome.Navigator>
  );
}

function NearbyStack() {
  return (
    <StackNearby.Navigator screenOptions={screenOptions} initialRouteName={nearbyTabRoute.nearbyScreen}>
      {Object.values(nearbyTabRoute).map(item => {
        return <StackNearby.Screen key={item} name={item} component={nearbyStack[item as keyof typeof nearbyStack]} />;
      })}
    </StackNearby.Navigator>
  );
}

//doctor
function DAStack() {
  return (
    <StackDA.Navigator screenOptions={screenOptions} initialRouteName={assistantTabRoute.assistantScreen}>
      <StackDA.Screen name={'AssistantScreen'} component={AssistantScreen} />
    </StackDA.Navigator>
  );
}

function NewsfeedStack() {
  return (
    <StackNewsfeed.Navigator screenOptions={screenOptions} initialRouteName={newsfeedRoute.newsfeedScreen}>
      {Object.values(newsfeedRoute).map(item => {
        return (
          <StackNewsfeed.Screen key={item} name={item} component={newsfeedStack[item as keyof typeof newsfeedStack]} />
        );
      })}
    </StackNewsfeed.Navigator>
  );
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
            component={communityStack[item as keyof typeof communityStack] as React.ComponentType}
          />
        );
      })}
    </StackCommunity.Navigator>
  );
}

function BottomTab(props: any) {
  const { state, descriptors, navigation } = props;
  const tabIndex = state.index || 0;
  const currentRoute = state.routes[tabIndex];
  let isHide = false;
  if (currentRoute && currentRoute.state) {
    isHide = currentRoute.state.index;
  }
  const hideBottomTab = isHide || (tabIndex == 2 || tabIndex == 4);
  return !hideBottomTab && <TabBar state={state} descriptors={descriptors} navigation={navigation} isExpert={false} />;
}

function BottomTab2(props: any) {
  const { state, descriptors, navigation } = props;
  const tabIndex = state.index || 0;
  const currentRoute = state.routes[tabIndex];
  let isHide = false;
  if (currentRoute && currentRoute.state) {
    isHide = currentRoute.state.index;
  }
  const hideBottomTab = isHide || (tabIndex == 2 || tabIndex == 4);
  return !hideBottomTab && <TabBar state={state} descriptors={descriptors} navigation={navigation} isExpert={true} />;
}

export function AppTabReview() {
  const { userType } = useContext(AppContext);
  if (userType == UserTypes.doctor) {
    return (
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={screenTabOption}
        tabBar={props => <BottomTab2 {...props} />}>
        <Tab.Screen name={'HomeTab'} component={HomeStack} />
        <Tab.Screen name={'NearbyTab'} component={NearbyStack} />
        <Tab.Screen name={'DATab'} component={DAStack} />
        <Tab.Screen name={'NewsfeedTab'} component={NewsfeedStack} />
        <Tab.Screen name={'CommunityTab'} component={CommunityStack} />
      </Tab.Navigator>
    );
  } else if (userType == UserTypes.student) {
    return (
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={screenTabOption}
        tabBar={props => <BottomTab {...props} />}>
        <Tab.Screen name={'HomeTab'} component={HomeStack} />
        <Tab.Screen name={'NearbyTab'} component={NearbyStack} />
        <Tab.Screen name={'DATab'} component={DAStack} />
        <Tab.Screen name={'NewsfeedTab'} component={NewsfeedStack} />
        <Tab.Screen name={'CommunityTab'} component={CommunityStack} />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={screenTabOption}
        tabBar={props => <BottomTab {...props} />}>
        <Tab.Screen name={'HomeTab'} component={HomeStack} />
        <Tab.Screen name={'NearbyTab'} component={NearbyStack} />
        <Tab.Screen name={'DATab'} component={DAStack} />
        <Tab.Screen name={'NewsfeedTab'} component={NewsfeedStack} />
        <Tab.Screen name={'CommunityTab'} component={CommunityStack} />
      </Tab.Navigator>
    );
  }
}