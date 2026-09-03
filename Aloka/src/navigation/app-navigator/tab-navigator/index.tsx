import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { View, StyleSheet, Platform } from 'react-native';
import { IconX, Wrapper } from '@/components';
import { CText } from '@/utils';
import WorkScheduleNavigator from '../work-schedule-navigator';
import ProfileNavigator from '../profile-navigator';
import WorkNavigator from '../work-navigator';

const Tab = createBottomTabNavigator();

export const PartnerTabNavigator: React.FC = () => {
  const {
    theme: { colors },
  } = useTheme();

  const defaultTabBarStyle = {
    backgroundColor: colors.white,
    borderTopColor: colors.cEAECF0,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 26 : 10,
  };

  return (
    <Tab.Navigator
      initialRouteName="WorkTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary || '#19A2A7',
        tabBarInactiveTintColor: colors.c98A2B3 || '#98A2B3',
        tabBarStyle: defaultTabBarStyle,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="WorkTab"
        component={WorkNavigator}
        options={{
          tabBarLabel: 'Công việc',
          tabBarIcon: ({ color, size }) => (
            <IconX
              type="ionicons"
              name="bar-chart-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AccountTab"
        component={WorkScheduleNavigator}
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <IconX
              type="ionicons"
              name="person-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="WalletTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Ví',
          tabBarIcon: ({ color, size }) => (
            <IconX
              type="ionicons"
              name="wallet-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { PartnerTabNavigator as AppTabNavigator };
export default PartnerTabNavigator;
