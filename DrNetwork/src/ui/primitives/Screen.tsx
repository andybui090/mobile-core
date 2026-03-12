import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import {
  StatusBar,
  View,
  ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StatusBarStyle = 'light-content' | 'dark-content';
type ScreenPreset = 'fixed' | 'no-bottom' | 'custom';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;

  preset?: ScreenPreset;

  statusBarStyle?: StatusBarStyle;
  hideStatusBar?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  contentStyle,

  preset = 'no-bottom',

  statusBarStyle = 'dark-content',
  hideStatusBar = false,
}) => {
  const isFocused = useIsFocused();

  const edges =
    preset === 'no-bottom'
      ? ['top']
      : preset === 'custom'
      ? []
      : ['top', 'bottom'];

  const Wrapper = preset === 'custom' ? View : SafeAreaView;

  return (
    <Wrapper style={[{ flex: 1 }, style]} edges={edges as any}>
      {isFocused && (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={statusBarStyle}
          hidden={hideStatusBar}
        />
      )}
      <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
    </Wrapper>
  );
};