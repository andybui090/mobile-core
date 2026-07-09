import { carelyAccountTabRoute, carelyAppointmentTabRoute, carelyHomeTabRoute } from '@/constants/route_key';
import { carelyAccountStack, carelyAppoinmentStack, carelyHomeStack } from '@/screens';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import { TabBar } from './bottom-tab';
import { useContext } from 'react';
import { AppContext } from '@/contexts';
import { UserTypes } from '@/navigation/root-store';

const Tab = createBottomTabNavigator();

const StackHomeCarely = createStackNavigator();
const StackAppoinmentCarely = createStackNavigator();
const StackAccountCarely = createStackNavigator();

const screenOptions: StackNavigationOptions = {
    headerShown: false,
    gestureEnabled: false,
};

const screenTabOption: BottomTabNavigationOptions = {
    headerShown: false,
    lazy: true,
};

const CarelyHomeStack = () => {
    return (
        <StackHomeCarely.Navigator screenOptions={screenOptions} initialRouteName={carelyHomeTabRoute.carelyHomeScreen}>
            {Object.values(carelyHomeTabRoute).map(item => {
                return <StackHomeCarely.Screen key={item} name={item} component={carelyHomeStack[item as keyof typeof carelyHomeStack]} />;
            })}
        </StackHomeCarely.Navigator>
    );
};

const CarelyAppoinmentStack = () => {
    return (
        <StackAppoinmentCarely.Navigator screenOptions={screenOptions} initialRouteName={carelyAppointmentTabRoute.carelyAppointmentScreen}>
            {Object.values(carelyAppointmentTabRoute).map(item => {
                return <StackAppoinmentCarely.Screen key={item} name={item} component={carelyAppoinmentStack[item as keyof typeof carelyAppoinmentStack]} />;
            })}
        </StackAppoinmentCarely.Navigator>
    );
};

const CarelyAccountStack = () => {
    const { userType } = useContext(AppContext);
    let initialRouteName = carelyAccountTabRoute.doctorAccountScreen;
    if (userType == UserTypes.doctor || userType == UserTypes.nurse) {
        initialRouteName = carelyAccountTabRoute.doctorAccountScreen;
    } else if (userType == UserTypes.student) {
        initialRouteName = carelyAccountTabRoute.studentAccountScreen;
    } else {
        initialRouteName = carelyAccountTabRoute.accountScreen;
    }
    return (
        <StackAccountCarely.Navigator screenOptions={screenOptions}
            initialRouteName={initialRouteName}>
            {Object.values(carelyAccountTabRoute).map(item => {
                return <StackAccountCarely.Screen key={item} name={item}
                    component={carelyAccountStack[item as keyof typeof carelyAccountStack]} />;
            })}
        </StackAccountCarely.Navigator>
    );
};

function BottomTab(props: any) {
    const { state, descriptors, navigation } = props;
    const tabIndex = state.index || 0;
    const currentRoute = state.routes[tabIndex];
    let isHide = false;
    if (currentRoute && currentRoute.state) {
        isHide = currentRoute.state.index;
    }
    const hideBottomTab = isHide || (tabIndex ==3);
    return !hideBottomTab && <TabBar state={state} descriptors={descriptors} navigation={navigation} isExpert={false} />;
}

function CarelyEntryScreen() {
    return null;
}

export function CarelyTab() {
    return (
        <Tab.Navigator
            initialRouteName="CarelyHomeTab"
            screenOptions={screenTabOption}
            tabBar={props => <BottomTab {...props} />}>
            <Tab.Screen name={'CarelyHomeTab'} component={CarelyHomeStack} />
            <Tab.Screen
                name="DrNetworkTab"
                component={CarelyEntryScreen}
            />
            <Tab.Screen
                name={'CarelyAppointmentTab'}
                component={CarelyAppoinmentStack}
            />
            <Tab.Screen
                name="CarelyAccountTab"
                component={CarelyAccountStack}
            />
        </Tab.Navigator>
    );
}
