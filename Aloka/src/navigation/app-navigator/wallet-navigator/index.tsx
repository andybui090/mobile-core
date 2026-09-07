import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  IncomeManageScreen,
  TotalIncomeWalletScreen,
  WithdrawScreen,
  TransactionSuccessScreen,
  WorkHistoryScreen,
  PartnerChatScreen,
} from '@/screens/layout/partner-profile';

export type WalletStackParamList = {
  TotalIncomeWalletScreen: undefined;
  IncomeManageScreen: undefined;
  WorkHistoryScreen: undefined;
  WithdrawScreen: undefined;
  TransactionSuccessScreen: { amount?: string | number } | undefined;
  PartnerChatScreen: { customerName?: string; customerAvatar?: any } | undefined;
};

const Stack = createNativeStackNavigator<WalletStackParamList>();

export const WalletNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="TotalIncomeWalletScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="TotalIncomeWalletScreen"
        component={TotalIncomeWalletScreen}
      />
      <Stack.Screen
        name="IncomeManageScreen"
        component={IncomeManageScreen}
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
        name="PartnerChatScreen"
        component={PartnerChatScreen}
      />
    </Stack.Navigator>
  );
};

export default WalletNavigator;
