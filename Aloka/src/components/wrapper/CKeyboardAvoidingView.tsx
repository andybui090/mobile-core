import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface CKeyboardAvoidingViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
}

export const CKeyboardAvoidingView: React.FC<CKeyboardAvoidingViewProps> = ({
  children,
  style = { flex: 1 },
  keyboardVerticalOffset = 0,
}) => {
  return (
    <KeyboardAvoidingView
      style={style}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default CKeyboardAvoidingView;
