import { screenStyles } from '@/configs';
import React from 'react';
import {
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { SBImageItem } from './SBImageItem';

interface Props extends ViewProps {
  style?: StyleProp<ViewStyle>;
  index?: number;
  pretty?: boolean;
  item: any;
  onViewDetail: (item: any) => void;
}

export const SBItem: React.FC<Props> = props => {
  const {
    style,
    item,
    index,
    pretty,
    testID,
    onViewDetail,
    ...animatedViewProps
  } = props;

  const enablePretty = false;
  const [isPretty, setIsPretty] = React.useState(pretty || enablePretty);

  // ✅ Gesture mới
  const longPressGesture = React.useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(500) // tương đương default của LongPressGestureHandler
        .onStart(() => {
          setIsPretty(prev => !prev);
        }),
    [],
  );

  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View
        testID={testID}
        style={screenStyles.flex1}
        {...animatedViewProps}>
        <SBImageItem
          style={style}
          item={item}
          index={index}
          showIndex={typeof index === 'number'}
          onViewDetail={onViewDetail}
        />
      </Animated.View>
    </GestureDetector>
  );
};
