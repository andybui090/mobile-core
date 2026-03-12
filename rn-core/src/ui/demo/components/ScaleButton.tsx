import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { CText } from '@/ui';

export function ScaleButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, active && styles.active]}
    >
      <CText
        variant="button"
        weight="medium"
        color={active ? 'textPrimary' : 'textSecondary'}
      >
        {label}
      </CText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    marginRight: 12,
  },
  active: {
    backgroundColor: '#006BD5',
    borderColor: '#006BD5',
  },
});