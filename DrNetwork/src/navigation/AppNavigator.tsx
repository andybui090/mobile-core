import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UIDemoListScreen, UIDemoDetailScreen } from '@/ui/demo';
import { DevStackParamList } from './types';

const Stack = createNativeStackNavigator<DevStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UIDemoList" component={UIDemoListScreen} />
      <Stack.Screen name="UIDemoDetail" component={UIDemoDetailScreen} />
    </Stack.Navigator>
  );
}