import React from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/shared/ui';
import { useTheme } from '@/shared/theme';

interface Props {
  title?: string;
  onBack?: () => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showBack?: boolean;
}

export const Header = ({
  title,
  onBack,
  left,
  right,
  showBack = true,
}: Props) => {
  const {
    theme: { colors },
  } = useTheme();

  const insets = useSafeAreaInsets();
  const hasNotch = insets.top > 20;
  const headerHeight = hasNotch ? 44 : 48;

  return (
    <View
      style={{
        height: insets.top + headerHeight,
        // backgroundColor: colors.background,
         backgroundColor:'yellow'
      }}
    >
      <View
        style={{
          height: headerHeight,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: colors.cF2F2F2,
          marginTop: insets.top,
          backgroundColor:'red'
        }}
      >
        {/* LEFT */}
        {left
          ? left
          : showBack && (
              <Pressable
                onPress={onBack}
                style={{
                  position: 'absolute',
                  left: 16,
                }}
              >
                <Icon type={'ionicons'} name="chevron-back" size={26} />
              </Pressable>
            )}

        {/* TITLE */}
        <Text variant="bodyLarge" weight="semibold">
          {title}
        </Text>

        {/* RIGHT */}
        {right && right}
      </View>
    </View>
  );
};
