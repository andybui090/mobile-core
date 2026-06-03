import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { Header, Screen, Icon } from '@/shared/ui';
import { PlaygroundItem } from '../components/PlaygroundItem';

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
      <Header title="TestListScreen" showBack={false} />
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
        <Icon name="person" size="xl" color="#4F8EF7" />
      </View>
    </Screen>
  );
};
