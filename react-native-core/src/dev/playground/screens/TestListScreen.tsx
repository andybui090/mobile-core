import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { PlaygroundItem } from '../components/PlaygroundItem';
import { Header, Screen } from '@/shared/ui';

export const TestListScreen = () => {
  const navigation = useNavigation<any>();

  const items = [
    { title: 'Text', type: 'text' },
    { title: 'Font Scale', type: 'fontScale' },
    { title: 'Button', type: 'button' },
    { title: 'Theme', type: 'theme' },
  ];

  return (
    <Screen>
      <Header title="TestListScreen" />
      <View style={{ flex: 1 }}>
        {items.map(item => (
          <PlaygroundItem
            key={item.type}
            title={item.title}
            onPress={() =>
              navigation.navigate('TestDetail', { type: item.type })
            }
          />
        ))}
      </View>
    </Screen>
  );
};
