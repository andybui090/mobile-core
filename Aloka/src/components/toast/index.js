import React from 'react';
import {StyleSheet, View, Animated, Dimensions, Text} from 'react-native';
import PropTypes from 'prop-types';
import {fonts} from '@/configs';

export const DURATION = {
  LENGTH_SHORT: 500,
  FOREVER: 0,
};

const {height} = Dimensions.get('window');

class Toast extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      text: '',
      opacityValue: new Animated.Value(this.props.opacity),
    };
  }

  show(text, duration, callback) {
    this.duration =
      typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT;
    this.callback = callback;
    this.setState({
      isShow: true,
      text: text,
    });

    this.animation = Animated.timing(this.state.opacityValue, {
      toValue: this.props.opacity,
      duration: this.props.fadeInDuration,
      useNativeDriver: true,
    });
    this.animation.start(() => {
      this.isShow = true;
      if (duration !== DURATION.FOREVER) {
        this.close();
      }
    });
  }

  close(duration) {
    let delay = typeof duration === 'undefined' ? this.duration : duration;

    if (delay === DURATION.FOREVER) {
      delay = this.props.defaultCloseDelay || 250;
    }

    if (!this.isShow && !this.state.isShow) {
      return;
    }
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.animation = Animated.timing(this.state.opacityValue, {
        toValue: 0.0,
        duration: this.props.fadeOutDuration,
        useNativeDriver: true,
      });
      this.animation.start(() => {
        this.setState({
          isShow: false,
        });
        this.isShow = false;
        if (typeof this.callback === 'function') {
          this.callback();
        }
      });
    }, delay);
  }

  componentWillUnmount() {
    this.animation && this.animation.stop();
    this.timer && clearTimeout(this.timer);
  }

  render() {
    let pos;
    switch (this.props.position) {
      case 'top':
        pos = this.props.positionValue;
        break;
      case 'center':
        pos = height / 2;
        break;
      case 'bottom':
        pos = height - this.props.positionValue;
        break;
    }

    const view = this.state.isShow ? (
      <View style={[styles.container, {top: pos}]} pointerEvents="none">
        <Animated.View
          style={[
            styles.content,
            {opacity: this.state.opacityValue},
            this.props.style,
          ]}>
          {React.isValidElement(this.state.text) ? (
            this.state.text
          ) : (
            <Text style={this.props.textStyle} allowFontScaling={false}>{this.state.text}</Text>
          )}
        </Animated.View>
      </View>
    ) : null;
    return view;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    elevation: 999,
    alignItems: 'center',
    zIndex: 10000,
  },
  content: {
    backgroundColor: '#333333',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    color: 'white',
    fontFamily: fonts.inter,
    fontSize: 13,
  },
});

Toast.propTypes = {
  style: PropTypes.object,
  position: PropTypes.oneOf(['top', 'center', 'bottom']),
  textStyle: PropTypes.object,
  positionValue: PropTypes.number,
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  opacity: PropTypes.number,
};

Toast.defaultProps = {
  position: 'bottom',
  textStyle: styles.text,
  positionValue: 180,
  fadeInDuration: 500,
  fadeOutDuration: 500,
  opacity: 1,
};

export default Toast;