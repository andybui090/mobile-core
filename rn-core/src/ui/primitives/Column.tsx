import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';

type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface ColumnProps extends ViewProps {
  justify?: Justify;
  align?: ViewStyle['alignItems'];
  gap?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({
  justify = 'start',
  align = 'stretch',
  gap,
  style,
  children,
  ...rest
}) => {
  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: 'column',
          justifyContent: justifyMap[justify],
          alignItems: align,
          ...(gap !== undefined && { gap }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const justifyMap: Record<Justify, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};
