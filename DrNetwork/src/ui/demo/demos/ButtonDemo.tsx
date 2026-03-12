import React from 'react';
import { View } from 'react-native';
import { Section } from '../components/Section';
import { CButton, CText } from '@/ui';

export function ButtonDemo() {
  return (
    <Section title="Button">
      <CButton title="Primary Button" variant="primary" />
      <CButton title="Secondary Button" variant="secondary" />
      <CButton title="Disabled Button" variant="secondary" disabled />

      <View style={{ marginTop: 12 }}>
        <CText variant="caption" color="textSecondary">
          Button sizes
        </CText>

        <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
          <CButton title="SM" size="sm" />
          <CButton title="MD" size="md" />
          <CButton title="LG" size="lg" />
        </View>
      </View>
    </Section>
  );
}
