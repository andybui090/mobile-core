import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';

type Center = 'none' | 'both' | 'horizontal' | 'vertical';

export interface ContainerProps extends ViewProps {
  center?: Center;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  center = 'none',
  style,
  children,
  ...rest
}) => {
  return (
    <View {...rest} style={[base, centerStyles[center], style]}>
      {children}
    </View>
  );
};

const base: ViewStyle = {
  flex: 1,
};

const centerStyles: Record<Center, ViewStyle> = {
  none: {},
  both: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontal: {
    alignItems: 'center',
  },
  vertical: {
    justifyContent: 'center',
  },
};
