import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PartnerWorkScreen } from '@/screens/layout/partner-profile';
import { ChatScreen } from '@/screens/layout/chat';

export type WorkStackParamList = {
  PartnerWorkScreen: undefined;
  PartnerChatScreen: { customerName?: string; customerAvatar?: any } | undefined;
};

const Stack = createNativeStackNavigator<WorkStackParamList>();

export const WorkNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="PartnerWorkScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="PartnerWorkScreen"
        component={PartnerWorkScreen}
      />
      <Stack.Screen
        name="PartnerChatScreen"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
};

export default WorkNavigator;
