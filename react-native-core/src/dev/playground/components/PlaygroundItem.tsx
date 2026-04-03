import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/shared/ui';
import { useTheme } from '@/shared/theme/useTheme';

interface Props {
  title: string;
  onPress: () => void;
}

export const PlaygroundItem = ({ title, onPress }: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text variant="h3">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};