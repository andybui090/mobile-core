// RF DONE
import React, { ReactNode, memo } from 'react';
import { StatusBar, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

import useStyles from './styles';

interface WrapperProps {
  isSafe?: boolean;
  style?: ViewStyle | object;
  children: ReactNode;
  hideStatusbar?: boolean;
  isBottomSafe?: boolean;
}

const FocusAwareStatusBar = memo(({ hidden }: { hidden?: boolean }) => {
  const isFocused = useIsFocused();
  if (!isFocused) return null;

  return (
    <StatusBar
      barStyle="dark-content"
      backgroundColor="transparent"
      translucent={true}
      hidden={hidden}
    />
  );
});

const Wrapper: React.FC<WrapperProps> = ({
  isSafe = false,
  children,
  style,
  hideStatusbar = false,
  isBottomSafe = false,
}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  const safeStyle = isSafe ? { paddingTop: insets.top} : isBottomSafe ? { paddingBottom: insets.bottom } : undefined;

  return (
    <View style={[styles.container, style, safeStyle]}>
      <FocusAwareStatusBar hidden={hideStatusbar} />
      {children}
    </View>
  );
};

export default memo(Wrapper);
