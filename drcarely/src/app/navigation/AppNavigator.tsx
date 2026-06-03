import { HomeScreen } from '@/screens/home-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_OPTIONS } from './constants';

export type AppStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}