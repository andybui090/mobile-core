import React from 'react';
import { ScrollView } from 'react-native';
import { Screen, Header } from '@/ui';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DevStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  TypographyDemo,
  ButtonDemo,
  LayoutDemo,
  ThemeDemo,
  FontScaleDemo,
} from '../demos';

type RouteProps = RouteProp<DevStackParamList, 'UIDemoDetail'>;
type NavigationProps = NativeStackNavigationProp<DevStackParamList>;

export function UIDemoDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { type } = route.params; // ✅ UIDemoType

  const handleGoBack = () => {
    navigation.goBack();
  }

  return (
    <Screen>
      <Header title={type.toUpperCase()} leftIcon="back" onLeftPress={handleGoBack}/>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {renderDemo(type)}
      </ScrollView>
    </Screen>
  );
}

function renderDemo(type: DevStackParamList['UIDemoDetail']['type']) {
  switch (type) {
    case 'typography':
      return <TypographyDemo />;
    case 'button':
      return <ButtonDemo />;
    case 'layout':
      return <LayoutDemo />;
    case 'theme':
      return (
        <>
          <ThemeDemo />
          <FontScaleDemo />
        </>
      );
    default:
      return null;
  }
}