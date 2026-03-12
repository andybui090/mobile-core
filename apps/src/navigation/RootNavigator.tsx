import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DevNavigator } from './DevNavigator';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  console.log(`Running in development mode: ${__DEV__}`);
  return (
    <NavigationContainer>
      {__DEV__ ? <DevNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
}
