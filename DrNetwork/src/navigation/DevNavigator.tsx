import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UIDemoListScreen, UIDemoDetailScreen } from '@/ui/demo';
import { DevStackParamList } from './types';

const Stack = createNativeStackNavigator<DevStackParamList>();

export function DevNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="UIDemoList" // if not default run first Screen 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="UIDemoList" component={UIDemoListScreen} />
      <Stack.Screen name="UIDemoDetail" component={UIDemoDetailScreen} />
    </Stack.Navigator>
  );
}
