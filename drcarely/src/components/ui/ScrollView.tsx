import { screenStyles } from '@/config';
import { ScrollView as CScrollView, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle | object;
  style?: ViewStyle | object;
  innerRef?: any;
  removeClippedSubviews?: boolean;
}

export const ScrollView: React.FC<Props> = ({
  children,
  contentContainerStyle = {},
  style = {},
  innerRef,
  removeClippedSubviews,
}) => {
  return (
    <CScrollView
      ref={innerRef}
      contentContainerStyle={[screenStyles.flexGrow1, contentContainerStyle]}
      style={style}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      scrollEventThrottle={160}
      removeClippedSubviews={removeClippedSubviews}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </CScrollView>
  );
};
