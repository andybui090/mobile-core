import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | any;
  isCenter?: boolean;
}

export const Container: React.FC<Props> = ({children, style, isCenter}) => {
  return <View style={[styles.container, style, isCenter && styles.center]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});