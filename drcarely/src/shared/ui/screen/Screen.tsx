import React, { ReactNode, memo } from 'react';
import { StatusBar, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

import { useTheme } from '@/shared/theme/useTheme';

interface Props {
  children: ReactNode;
  style?: ViewStyle;

  // safe area
  safeTop?: boolean;
  safeBottom?: boolean;

  // status bar
  statusBarHidden?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
}

const FocusAwareStatusBar = memo(
  ({ hidden, barStyle }: { hidden?: boolean; barStyle: 'light-content' | 'dark-content' }) => {
    const isFocused = useIsFocused();
    if (!isFocused) return null;

    return (
      <StatusBar
        barStyle={barStyle}
        backgroundColor="transparent"
        translucent
        hidden={hidden}
      />
    );
  }
);

export const Screen: React.FC<Props> = ({
  children,
  style,
  safeTop = false,
  safeBottom = false,
  statusBarHidden = false,
  statusBarStyle,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const safeStyle = {
    paddingTop: safeTop ? insets.top : 0,
    paddingBottom: safeBottom ? insets.bottom : 0,
  };

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
        },
        safeStyle,
        style,
      ]}
    >
      <FocusAwareStatusBar
        hidden={statusBarHidden}
        barStyle={statusBarStyle ?? 'dark-content'}
      />

      {children}
    </View>
  );
};