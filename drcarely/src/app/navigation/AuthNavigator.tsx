import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthScreen } from '@/screens/Auth';
import { SCREEN_OPTIONS } from './constants';

export type AuthStackParamList = {
  Auth: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}
