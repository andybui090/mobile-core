import {screenStyles} from '@/configs';
import React from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';

interface Props {
  children: React.ReactNode;
}

export const DismissKeyboard: React.FC<Props> = ({children}) => (
  <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
    <View style={screenStyles.flex1}>{children}</View>
  </TouchableWithoutFeedback>
);