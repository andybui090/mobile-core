import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTab as PartnerTabNavigator } from '../tab-navigator';
import { PartnerChatScreen } from '@/screens/layout/partner-profile';

export type PartnerAppStackParamList = {
  PartnerTabNavigator: undefined;
  PartnerChatScreen: { customerName?: string; customerAvatar?: any } | undefined;
};

const Stack = createNativeStackNavigator<PartnerAppStackParamList>();

export const PartnerAppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="PartnerTabNavigator"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="PartnerTabNavigator"
        component={PartnerTabNavigator}
      />
      <Stack.Screen
        name="PartnerChatScreen"
        component={PartnerChatScreen}
      />
    </Stack.Navigator>
  );
};

export default PartnerAppNavigator;
