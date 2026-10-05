import { throttle } from 'lodash';
import { useRef } from 'react';
import { View as AnimatableView } from 'react-native-animatable';
import { ANIMATIONS } from '.';

export default function (WrappedComponent:any) {
  return ({
    onPress,
    delay = 800,
    duration = 500,
    animation = ANIMATIONS.ZOOM_IN_OUT,
    ...rest
  }:any) => {
    const compEl = useRef<any>(null);
    const onPressAnimatedDelayed = throttle(
      (event:any) => {
        onPress && onPress(event);
        compEl?.current?.animate(animation, duration);
      },
      delay,
      {trailing: false},
    );

    return (
      <AnimatableView ref={compEl}>
        <WrappedComponent onPress={onPressAnimatedDelayed} {...rest} />
      </AnimatableView>
    );
  };
}
