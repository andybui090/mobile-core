import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkScheduleManageScreen from '@/screens/work-schedule';
import WorkingHoursScreen from '@/screens/work-schedule/WorkingHoursScreen';
import WorkScheduleScreen from '@/screens/work-schedule/WorkScheduleScreen';

export type WorkScheduleStackParamList = {
  WorkScheduleManageScreen: undefined;
  WorkingHoursScreen: undefined;
  WorkScheduleScreen: undefined;
};

const Stack = createNativeStackNavigator<WorkScheduleStackParamList>();

export const WorkScheduleNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="WorkScheduleManageScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="WorkScheduleManageScreen"
        component={WorkScheduleManageScreen}
      />
      <Stack.Screen
        name="WorkingHoursScreen"
        component={WorkingHoursScreen}
      />
      <Stack.Screen
        name="WorkScheduleScreen"
        component={WorkScheduleScreen}
      />
    </Stack.Navigator>
  );
};

export default WorkScheduleNavigator;
