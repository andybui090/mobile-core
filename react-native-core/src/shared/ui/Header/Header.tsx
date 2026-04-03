import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/shared/ui';
import { useTheme } from '@/shared/theme/useTheme';

interface Props {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  showBack?: boolean;
}

export const Header = ({
  title,
  onBack,
  right,
  showBack = true,
}: Props) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: colors.background }}>
      <View
        style={{
          height: 48,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        {/* LEFT */}
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            style={{
              position: 'absolute',
              left: 16,
            }}
          >
            <Text>{'< Back'}</Text>
          </TouchableOpacity>
        )}

        {/* TITLE */}
        <Text variant="h3" weight="bold">
          {title}
        </Text>

        {/* RIGHT */}
        {right && (
          <View
            style={{
              position: 'absolute',
              right: 16,
            }}
          >
            {right}
          </View>
        )}
      </View>
    </View>
  );
};