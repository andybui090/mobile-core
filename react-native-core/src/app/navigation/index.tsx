import React, { useMemo } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { useTheme } from '@/shared/theme/useTheme';

import { TestListScreen } from '@/dev/playground/screens/TestListScreen';
import { TestDetailScreen } from '@/dev/playground/screens/TestDetailScreen';

/**
 * 1. Define Root Stack Param List (VERY IMPORTANT)
 */
export type RootStackParamList = {
  TestList: undefined;
  TestDetail: { type?: string }; // example typed params
};

/**
 * 2. Create typed stack
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 3. Extract screen options
 */
const SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
};

/**
 * 4. Navigation Component
 */
export const Navigation = () => {
  const { colors } = useTheme();

  /**
   * 5. Memo theme (avoid re-render NavigationContainer)
   */
  const navTheme: NavigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
        text: colors.text,
      },
    }),
    [colors.background, colors.text],
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="TestList" component={TestListScreen} />
        <Stack.Screen name="TestDetail" component={TestDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};