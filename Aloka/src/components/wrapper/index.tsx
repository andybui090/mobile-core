import { useTheme } from '@rneui/themed';
import { useIsFocused } from '@react-navigation/native';
import React, { ReactNode, memo, useMemo } from 'react';
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  safeTop?: boolean;
  safeBottom?: boolean;
  statusBarHidden?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
}

const FocusAwareStatusBar = memo(
  ({
    hidden,
    barStyle,
  }: {
    hidden?: boolean;
    barStyle: 'light-content' | 'dark-content';
  }) => {
    const isFocused = useIsFocused();
    if (!isFocused) return null;

    return (
      <StatusBar
        barStyle={barStyle}
        // backgroundColor="transparent"
        // translucent
        hidden={hidden}
      />
    );
  },
);

const Wrapper = ({
  children,
  style,
  safeTop = false,
  safeBottom = false,
  statusBarHidden = false,
  statusBarStyle = 'dark-content',
}: Props) => {
  const {
    theme: { colors },
  } = useTheme();
  const insets = useSafeAreaInsets();

  const safeStyle = useMemo(
    () => ({
      paddingTop: safeTop ? insets.top : 0,
      paddingBottom: safeBottom ? insets.bottom : 0,
    }),
    [insets.bottom, insets.top, safeBottom, safeTop],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        safeStyle,
        style,
      ]}
    >
      <FocusAwareStatusBar hidden={statusBarHidden} barStyle={statusBarStyle} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Wrapper;
