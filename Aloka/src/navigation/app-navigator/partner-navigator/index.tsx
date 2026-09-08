import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PartnerTabNavigator } from './PartnerTabNavigator';
import {
  EditProfileScreen,
  IncomeManageScreen,
  TotalIncomeWalletScreen,
  WorkHistoryScreen,
  WithdrawScreen,
  TransactionSuccessScreen,
} from '@/screens/layout/partner-profile';
import { ChatScreen } from '@/screens/layout/chat';
import WorkScheduleManageScreen from '@/screens/layout/work-schedule';
import WorkingHoursScreen from '@/screens/layout/work-schedule/WorkingHoursScreen';
import WorkScheduleScreen from '@/screens/layout/work-schedule/WorkScheduleScreen';
import { mainStack } from '@/screens';

export type PartnerAppStackParamList = {
  PartnerTabNavigator: undefined;
  PartnerChatScreen: { customerName?: string; customerAvatar?: any } | undefined;
  NotificationScreen: undefined;
  SettingScreen: undefined;
  AboutUsScreen: undefined;
  FeedbackScreen: undefined;
  EditProfileScreen: undefined;
  WorkScheduleManageScreen: undefined;
  WorkingHoursScreen: undefined;
  WorkScheduleScreen: undefined;
  IncomeManageScreen: undefined;
  TotalIncomeWalletScreen: undefined;
  WorkHistoryScreen: undefined;
  WithdrawScreen: undefined;
  TransactionSuccessScreen: { amount?: string | number } | undefined;
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
        component={ChatScreen}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={mainStack.NotificationScreen}
      />
      <Stack.Screen
        name="SettingScreen"
        component={mainStack.SettingScreen}
      />
      <Stack.Screen
        name="AboutUsScreen"
        component={mainStack.AboutUsScreen}
      />
      <Stack.Screen
        name="FeedbackScreen"
        component={mainStack.FeedbackScreen}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
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
    </Stack.Navigator>
  );
};

export { PartnerTabNavigator };
export default PartnerAppNavigator;
