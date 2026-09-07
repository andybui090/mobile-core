import { mainRoute, rootRoute } from '@/constants';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import { AppTab } from '../tab-navigator';
import {
  PartnerAppNavigator,
  PartnerTabNavigator,
} from '../partner-navigator';
import { mainStack } from '@/screens';

const Stack = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
};

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={rootRoute} screenOptions={screenOptions}>
      <Stack.Screen name={rootRoute} component={AppTab} />
      <Stack.Screen name="PartnerAppNavigator" component={PartnerAppNavigator} />
      <Stack.Screen name="PartnerTabNavigator" component={PartnerTabNavigator} />

      {Object.values(mainRoute).map(item => {
        return (
          <Stack.Screen
            key={item}
            name={item as keyof typeof mainStack}
            component={mainStack[item as keyof typeof mainStack]}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default MainNavigator;
