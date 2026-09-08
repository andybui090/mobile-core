import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartnerProfileScreen, {
  IncomeManageScreen,
  TotalIncomeWalletScreen,
  WithdrawScreen,
  TransactionSuccessScreen,
  WorkHistoryScreen,
} from '@/screens/layout/partner-profile';
import WorkScheduleManageScreen from '@/screens/layout/work-schedule';
import WorkingHoursScreen from '@/screens/layout/work-schedule/WorkingHoursScreen';
import WorkScheduleScreen from '@/screens/layout/work-schedule/WorkScheduleScreen';

export type WorkScheduleStackParamList = {
  PartnerProfileScreen: undefined;
  IncomeManageScreen: undefined;
  TotalIncomeWalletScreen: undefined;
  WorkHistoryScreen: undefined;
  WithdrawScreen: undefined;
  TransactionSuccessScreen: { amount?: string | number } | undefined;
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
        name="PartnerProfileScreen"
        component={PartnerProfileScreen}
      />
      <Stack.Screen
        name="IncomeManageScreen"
        component={IncomeManageScreen}
      />
      <Stack.Screen
        name="TotalIncomeWalletScreen"
        component={TotalIncomeWalletScreen}
      />
      <Stack.Screen
        name="WorkHistoryScreen"
        component={WorkHistoryScreen}
      />
      <Stack.Screen
        name="WithdrawScreen"
        component={WithdrawScreen}
      />
      <Stack.Screen
        name="TransactionSuccessScreen"
        component={TransactionSuccessScreen}
      />
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
