import {
    partnerProfileTabRoute,
    partnerWalletTabRoute,
    partnerWorkTabRoute,
} from '@/constants';
import {
    partnerProfileStack,
    partnerWalletStack,
    partnerWorkStack
} from '@/screens';
import {
    BottomTabNavigationOptions,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
    StackNavigationOptions,
    createStackNavigator,
} from '@react-navigation/stack';
import { TabBar } from './bottom-tab';

const Tab = createBottomTabNavigator();

const StackPartnerWork = createStackNavigator();
const StackPartnerProfile = createStackNavigator();
const StackPartnerWallet = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
};

const screenTabOption: BottomTabNavigationOptions = {
  headerShown: false,
  lazy: true,
};

function PartnerWorkStack() {
  return (
    <StackPartnerWork.Navigator
      screenOptions={screenOptions}
      initialRouteName={partnerWorkTabRoute.partnerWorkScreen}
    >
      {Object.values(partnerWorkTabRoute).map(item => {
        return (
          <StackPartnerWork.Screen
            key={item}
            name={item}
            component={partnerWorkStack[item as keyof typeof partnerWorkStack]}
          />
        );
      })}
    </StackPartnerWork.Navigator>
  );
}

function PartnerProfileStack() {
  return (
    <StackPartnerProfile.Navigator
      screenOptions={screenOptions}
      initialRouteName={partnerProfileTabRoute.partnerProfileScreen}
    >
      {Object.values(partnerProfileTabRoute).map(item => {
        return (
          <StackPartnerWallet.Screen
            key={item}
            name={item}
            component={
              partnerProfileStack[item as keyof typeof partnerProfileStack]
            }
          />
        );
      })}
    </StackPartnerProfile.Navigator>
  );
}

function PartnerWalletStack() {
  return (
    <StackPartnerWallet.Navigator
      screenOptions={screenOptions}
      initialRouteName={partnerWalletTabRoute.partnerWalletScreen}
    >
      {Object.values(partnerWalletTabRoute).map(item => {
        return (
          <StackPartnerWallet.Screen
            key={item}
            name={item}
            component={
              partnerWalletStack[item as keyof typeof partnerWalletStack]
            }
          />
        );
      })}
    </StackPartnerWallet.Navigator>
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

  // Thay doi logic tren de an bottom tab doi voi tung loai tai khoan
  // const hideBottomTab = isHide || tabIndex == 5;

  return (
    !isHide && (
      <TabBar state={state} descriptors={descriptors} navigation={navigation} />
    )
  );
}

export function PartnerTab() {
  // const { userType } = useContext(AppContext);
  return (
    <Tab.Navigator
      initialRouteName="PartnerProfileTab"
      screenOptions={screenTabOption}
      tabBar={props => <BottomTab {...props} />}
    >
      <Tab.Screen name={'PartnerWorkTab'} component={PartnerWorkStack} />
      <Tab.Screen name={'PartnerProfileTab'} component={PartnerProfileStack} />
      <Tab.Screen name={'PartnerWalletTab'} component={PartnerWalletStack} />
    </Tab.Navigator>
  );
}