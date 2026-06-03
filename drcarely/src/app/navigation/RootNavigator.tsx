import {
    NavigationContainer
} from '@react-navigation/native';
import {
    createNativeStackNavigator
} from '@react-navigation/native-stack';

import { HomeScreen } from '@/features/home/presentation/screens/HomeScreen';
import { useTheme } from '@/shared/theme/useTheme';
import { SCREEN_OPTIONS } from './constants';
import { createNavigationTheme } from './navigationTheme';

/**
 * 1. Define Root Stack Param List (VERY IMPORTANT)
 */
export type RootStackParamList = {
  Home: undefined;
};
/**
 * 2. Create typed stack
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { colors } = useTheme();
  return (
    <NavigationContainer theme={createNavigationTheme(colors)}>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
