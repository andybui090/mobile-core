import React, { ReactNode, memo } from 'react';
import { StatusBar, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

import useStyles from './styles';

interface WrapperProps {
  isSafe?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  hideStatusbar?: boolean;
  isBottomSafe?: boolean;
}

const FocusAwareStatusBar = ({ hidden }: { hidden?: boolean }) => {
  const isFocused = useIsFocused();
  if (!isFocused) return null;

  return (
    <StatusBar
      barStyle="dark-content"
      backgroundColor="transparent"
      translucent
      hidden={hidden}
    />
  );
};

const Wrapper: React.FC<WrapperProps> = ({
  isSafe = false,
  children,
  style,
  hideStatusbar = false,
  isBottomSafe = false,
}) => {
  const styles = useStyles();
  const { top, bottom } = useSafeAreaInsets();

  const safeStyle: StyleProp<ViewStyle> = isSafe
    ? { paddingTop: top }
    : isBottomSafe
    ? { paddingBottom: bottom }
    : undefined;

  return (
    <View style={[styles.container, style, safeStyle]}>
      <FocusAwareStatusBar hidden={hideStatusbar} />
      {children}
    </View>
  );
};

export default memo(Wrapper);
