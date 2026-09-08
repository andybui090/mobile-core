import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconX } from '@/components';
import { fonts } from '@/configs';
import { CText } from '@/utils';
import {
  PartnerWorkScreen,
  PartnerProfileScreen,
  TotalIncomeWalletScreen,
} from '@/screens/layout/partner-profile';

const Tab = createBottomTabNavigator();

export type PartnerTabParamList = {
  PartnerWorkTab: undefined;
  PartnerProfileTab: undefined;
  PartnerWalletTab: undefined;
};

const TAB_CONFIG: Record<
  string,
  { label: string; iconName: any; iconType: any }
> = {
  PartnerWorkTab: {
    label: 'Công việc',
    iconName: 'stats-chart-outline',
    iconType: 'ionicons',
  },
  PartnerProfileTab: {
    label: 'Tài khoản',
    iconName: 'person-outline',
    iconType: 'ionicons',
  },
  PartnerWalletTab: {
    label: 'Ví',
    iconName: 'wallet-outline',
    iconType: 'ionicons',
  },
};

const PartnerTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 8;

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: bottomPadding }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name] || {
          label: route.name,
          iconName: 'ellipse-outline',
          iconType: 'ionicons',
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const activeColor = '#19A2A7';
        const inactiveColor = '#98A2B3';
        const color = isFocused ? activeColor : inactiveColor;

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.7}
            onPress={onPress}
            style={styles.tabItem}
          >
            <IconX
              type={config.iconType}
              name={config.iconName}
              size={23}
              color={color}
            />
            <CText
              style={[
                styles.tabLabel,
                {
                  color,
                  fontWeight: isFocused ? '600' : '400',
                },
              ]}
            >
              {config.label}
            </CText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const PartnerTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="PartnerProfileTab"
      backBehavior="none"
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      tabBar={props => <PartnerTabBar {...props} />}
    >
      <Tab.Screen
        name="PartnerWorkTab"
        component={PartnerWorkScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="PartnerProfileTab"
        component={PartnerProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="PartnerWalletTab"
        component={TotalIncomeWalletScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: fonts.inter,
    marginTop: 4,
  },
});

export default PartnerTabNavigator;
