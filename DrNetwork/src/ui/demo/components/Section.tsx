import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CText } from '@/ui';

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <CText variant="subtitle" weight="semibold" style={styles.title}>
        {title}
      </CText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 12,
  },
});