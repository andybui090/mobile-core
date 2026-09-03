import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PartnerWorkScreen } from '@/screens/layout/partner-profile';

export type WorkStackParamList = {
  PartnerWorkScreen: undefined;
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
    </Stack.Navigator>
  );
};

export default WorkNavigator;
