import React from 'react';
import { View } from 'react-native';
import { Section } from '../components/Section';
import { ScaleButton } from '../components/ScaleButton';
import { useFontScale } from '@/ui/providers/FontScaleProvider';

export function FontScaleDemo() {
  const { appScale, setAppScale } = useFontScale();

  return (
    <Section title="Font Size (In-App Setting)">
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <ScaleButton
          label="Small"
          active={appScale === 'small'}
          onPress={() => setAppScale('small')}
        />
        <ScaleButton
          label="Default"
          active={appScale === 'default'}
          onPress={() => setAppScale('default')}
        />
        <ScaleButton
          label="Large"
          active={appScale === 'large'}
          onPress={() => setAppScale('large')}
        />
      </View>
    </Section>
  );
}