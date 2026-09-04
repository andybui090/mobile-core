import {
  accountTabRoute,
  appointmentTabRoute,
  drnetworkTabRoute,
  homeTabRoute,
} from '@/constants';
import { accountStack, appointmentStack, homeStack, mainStack } from '@/screens';
import DrNetworkScreen from '@/screens/drnetwork-screen';
import PartnerProfileScreen, {
  IncomeManageScreen,
  TotalIncomeWalletScreen,
  WithdrawScreen,
  TransactionSuccessScreen,
  WorkHistoryScreen,
  PartnerChatScreen,
} from '@/screens/layout/partner-profile';
import WorkScheduleManageScreen from '@/screens/layout/work-schedule';
import WorkingHoursScreen from '@/screens/layout/work-schedule/WorkingHoursScreen';
import WorkScheduleScreen from '@/screens/layout/work-schedule/WorkScheduleScreen';
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

const StackHome = createStackNavigator();
const StackDrNetwork = createStackNavigator();
const StackAppointment = createStackNavigator();
const StackAccount = createStackNavigator();

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
      initialRouteName={homeTabRoute.homeScreen}
    >
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

function DrNetworkStack() {
  return (
    <StackDrNetwork.Navigator
      screenOptions={screenOptions}
      initialRouteName={drnetworkTabRoute.drnetworkScreen}
    >
      <StackDrNetwork.Screen
        name={'DrNetworkScreen'}
        component={DrNetworkScreen}
      />
    </StackDrNetwork.Navigator>
  );
}

function AppointmentStack() {
  return (
    <StackAppointment.Navigator
      screenOptions={screenOptions}
      initialRouteName={appointmentTabRoute.appointmentScreen}
    >
      {Object.values(appointmentTabRoute).map(item => {
        return (
          <StackAppointment.Screen
            key={item}
            name={item}
            component={appointmentStack[item as keyof typeof appointmentStack]}
          />
        );
      })}
    </StackAppointment.Navigator>
  );
}

function AccountStack() {
  return (
    <StackAccount.Navigator
      screenOptions={screenOptions}
      initialRouteName={accountTabRoute.partnerProfileScreen}
    >
      <StackAccount.Screen
        name={accountTabRoute.partnerProfileScreen}
        component={PartnerProfileScreen}
      />
      <StackAccount.Screen
        name={accountTabRoute.accountScreen}
        component={accountStack.AccountScreen}
      />
      <StackAccount.Screen
        name="IncomeManageScreen"
        component={IncomeManageScreen}
      />
      <StackAccount.Screen
        name="TotalIncomeWalletScreen"
        component={TotalIncomeWalletScreen}
      />
      <StackAccount.Screen
        name="WorkHistoryScreen"
        component={WorkHistoryScreen}
      />
      <StackAccount.Screen
        name="WithdrawScreen"
        component={WithdrawScreen}
      />
      <StackAccount.Screen
        name="TransactionSuccessScreen"
        component={TransactionSuccessScreen}
      />
      <StackAccount.Screen
        name="WorkScheduleManageScreen"
        component={WorkScheduleManageScreen}
      />
      <StackAccount.Screen
        name="WorkingHoursScreen"
        component={WorkingHoursScreen}
      />
      <StackAccount.Screen
        name="WorkScheduleScreen"
        component={WorkScheduleScreen}
      />
      <StackAccount.Screen
        name="PartnerChatScreen"
        component={PartnerChatScreen}
      />
      <StackAccount.Screen
        name="NotificationScreen"
        component={mainStack.NotificationScreen}
      />
    </StackAccount.Navigator>
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
  const hideBottomTab = isHide || tabIndex == 5;
  return (
    !hideBottomTab && (
      <TabBar state={state} descriptors={descriptors} navigation={navigation} />
    )
  );
}

export function AppTab() {
  // const { userType } = useContext(AppContext);
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={screenTabOption}
      tabBar={props => <BottomTab {...props} />}
    >
      <Tab.Screen name={'HomeTab'} component={HomeStack} />
      <Tab.Screen name={'DrNetworkTab'} component={DrNetworkStack} />
      <Tab.Screen name={'AppointmentTab'} component={AppointmentStack} />
      <Tab.Screen name={'AccountTab'} component={AccountStack} />
    </Tab.Navigator>
  );
}
