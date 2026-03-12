import React from 'react';
import { View, Pressable } from 'react-native';
import { Section } from '../components/Section';
import { CText } from '@/ui';
import { useTheme } from '@/ui/providers/ThemeProvider';

export function ThemeDemo() {
  const { mode, setMode } = useTheme();

  return (
    <Section title="Theme (Override System)">
      <View style={{ flexDirection: 'row'}}>
        {(['system', 'light', 'dark'] as const).map(item => {
          const active = mode === item;
          return (
            <Pressable
              key={item}
              onPress={() => setMode(item)}
              style={{
                padding: 10,
                marginRight: 12,
                borderRadius: 8,
                backgroundColor: active ? '#0080F6' : '#F2F4F7',
              }}
            >
              <CText color={active ? 'textInverse' : 'textPrimary'}>
                {item.toUpperCase()}
              </CText>
            </Pressable>
          );
        })}
      </View>
    </Section>
  );
}