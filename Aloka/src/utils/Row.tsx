import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
export interface RowProps {
  start?: boolean;
  center?: boolean;
  between?: boolean;
  around?: boolean;
  end?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

const RowComponent: React.FC<RowProps> = ({
  style,
  start,
  center = true,
  between,
  around,
  end,
  children,
}) => {
  return (
    <View
      style={StyleSheet.flatten([
        styles.default,
        center && styles.center,
        start && styles.start,
        between && styles.between,
        around && styles.around,
        end && styles.end,
        style,
      ])}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  start: {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  between: {
    justifyContent: 'space-between',
  },
  around: {
    justifyContent: 'space-around',
  },
  end: {
    justifyContent: 'flex-end',
  },
});

export const Row = memo(RowComponent);
