import { DevStackParamList } from '@/navigation/types';
import { CText, Header, Screen } from '@/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { UIDemoType } from '../types';

type NavigationProp = NativeStackNavigationProp<
  DevStackParamList,
  'UIDemoList'
>;

const DEMOS: { key: UIDemoType; title: string }[] = [
  { key: 'typography', title: 'Typography' },
  { key: 'button', title: 'Button' },
  { key: 'layout', title: 'Layout' },
  { key: 'theme', title: 'Theme & Font Scale' },
];

export function UIDemoListScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Screen>
      <Header title="UI Component Demo" />
      <ScrollView contentContainerStyle={styles.container}>
        {DEMOS.map(item => (
          <Pressable
            key={item.key}
            style={styles.item}
            onPress={() =>
              navigation.navigate('UIDemoDetail', {
                type: item.key, // ✅ type-safe
              })
            }
          >
            <CText variant="subtitle" weight="medium">
              {item.title}
            </CText>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
});
