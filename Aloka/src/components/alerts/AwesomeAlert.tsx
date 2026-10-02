import { CText } from '@/utils';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  type EventSubscription,
  Dimensions,
  Modal,
  Platform,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native';

const { height, width } = Dimensions.get('window');
const HW_BACK_EVENT = 'hardwareBackPress';
const { OS } = Platform;

type AwesomeAlertButtonData = {
  testID?: string;
  text?: string;
  backgroundColor?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

type AwesomeAlertProps = {
  show?: boolean;
  animatedValue?: number;
  useNativeDriver?: boolean;
  showProgress?: boolean;
  title?: string;
  message?: string;
  closeOnTouchOutside?: boolean;
  closeOnHardwareBackPress?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  onCancelPressed?: () => void;
  onConfirmPressed?: () => void;
  customView?: React.ReactNode;
  modalProps?: Record<string, unknown>;
  cancelButtonTestID?: string;
  confirmButtonTestID?: string;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  cancelButtonTextStyle?: StyleProp<TextStyle>;
  confirmButtonStyle?: StyleProp<ViewStyle>;
  confirmButtonTextStyle?: StyleProp<TextStyle>;
  alertContainerStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  progressSize?: number | 'small' | 'large';
  progressColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  actionContainerStyle?: StyleProp<ViewStyle>;
  onDismiss?: () => void;
};

type AwesomeAlertState = {
  showSelf: boolean;
};

export default class AwesomeAlert extends Component<
  AwesomeAlertProps,
  AwesomeAlertState
> {
  static defaultProps: Partial<AwesomeAlertProps> = {
    show: false,
    animatedValue: 0.3,
    useNativeDriver: false,
    showProgress: false,
    closeOnTouchOutside: true,
    closeOnHardwareBackPress: true,
    showCancelButton: false,
    showConfirmButton: false,
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    cancelButtonColor: '#D0D0D0',
    confirmButtonColor: '#AEDEF4',
    customView: null,
    modalProps: {},
    cancelButtonTestID: 'awesome-alert-cancel-btn',
    confirmButtonTestID: 'awesome-alert-confirm-btn',
  };

  springValue: Animated.Value;
  backHandlerSubscription?: EventSubscription;

  constructor(props: AwesomeAlertProps) {
    super(props);
    const { show = false } = props;
    this.springValue = new Animated.Value(props.animatedValue ?? 0.3);
    this.state = {
      showSelf: show,
    };

    if (show) {
      this.springValue.setValue(1);
    }
  }

  componentDidMount() {
    this.backHandlerSubscription = BackHandler.addEventListener(
      HW_BACK_EVENT,
      this._handleHwBackEvent,
    );
  }

  _springShow = (fromConstructor?: boolean) => {
    const { useNativeDriver = false } = this.props;

    this._toggleAlert(fromConstructor);
    Animated.spring(this.springValue, {
      toValue: 1,
      bounciness: 10,
      useNativeDriver,
    }).start();
  };

  _springHide = () => {
    const { useNativeDriver = false } = this.props;

    if (this.state.showSelf === true) {
      Animated.spring(this.springValue, {
        toValue: 0,
        tension: 10,
        useNativeDriver,
      }).start();

      setTimeout(() => {
        this._toggleAlert();
        this._onDismiss();
      }, 70);
    }
  };

  _toggleAlert = (fromConstructor?: boolean) => {
    if (fromConstructor) {
      this.setState({ showSelf: true });
      return;
    }

    this.setState(prevState => ({ showSelf: !prevState.showSelf }));
  };

  _handleHwBackEvent = () => {
    const { closeOnHardwareBackPress = true } = this.props;

    if (this.state.showSelf && closeOnHardwareBackPress) {
      this._springHide();
      return true;
    }

    if (!closeOnHardwareBackPress && this.state.showSelf) {
      return true;
    }

    return false;
  };

  _onTapOutside = () => {
    const { closeOnTouchOutside = true } = this.props;
    if (closeOnTouchOutside) this._springHide();
  };

  _onDismiss = () => {
    const { onDismiss } = this.props;
    if (onDismiss) {
      onDismiss();
    }
  };

  _renderButton = (data: AwesomeAlertButtonData) => {
    const {
      testID,
      text,
      backgroundColor,
      buttonStyle,
      buttonTextStyle,
      onPress,
    } = data;

    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor }, buttonStyle]}
        testID={testID}
        onPress={onPress}>
        <CText h5 color="#fff" style={buttonTextStyle} allowFontScaling={false}>
          {text}
        </CText>
      </TouchableOpacity>
    );
  };

  _renderAlert = () => {
    const animation = { transform: [{ scale: this.springValue }] };
    const {
      showProgress,
      title,
      message,
      customView = null,
      showCancelButton,
      cancelText,
      cancelButtonColor,
      cancelButtonStyle,
      cancelButtonTextStyle,
      onCancelPressed,
      cancelButtonTestID,
      showConfirmButton,
      confirmText,
      confirmButtonColor,
      confirmButtonStyle,
      confirmButtonTextStyle,
      onConfirmPressed,
      confirmButtonTestID,
      alertContainerStyle,
      overlayStyle,
      progressSize,
      progressColor,
      contentContainerStyle,
      contentStyle,
      titleStyle,
      messageStyle,
      actionContainerStyle,
    } = this.props;

    const cancelButtonData: AwesomeAlertButtonData = {
      testID: cancelButtonTestID,
      text: cancelText,
      backgroundColor: cancelButtonColor,
      buttonStyle: cancelButtonStyle,
      buttonTextStyle: cancelButtonTextStyle,
      onPress: onCancelPressed,
    };

    const confirmButtonData: AwesomeAlertButtonData = {
      testID: confirmButtonTestID,
      text: confirmText,
      backgroundColor: confirmButtonColor,
      buttonStyle: confirmButtonStyle,
      buttonTextStyle: confirmButtonTextStyle,
      onPress: onConfirmPressed,
    };

    return (
      <View style={[styles.container, alertContainerStyle]}>
        <TouchableWithoutFeedback onPress={this._onTapOutside}>
          <View style={[styles.overlay, overlayStyle]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.contentContainer, animation, contentContainerStyle]}>
          <View style={[styles.content, contentStyle]}>
            {showProgress ? (
              <ActivityIndicator size={progressSize} color={progressColor} />
            ) : null}
            {title ? (
              <CText h4 style={[styles.title, titleStyle]} allowFontScaling={false}>
                {title}
              </CText>
            ) : null}
            {message ? (
              <CText h5 style={[styles.message, messageStyle]} allowFontScaling={false}>
                {message}
              </CText>
            ) : null}
            {customView}
          </View>

          <View style={[styles.action, actionContainerStyle]}>
            {showCancelButton ? this._renderButton(cancelButtonData) : null}
            {showConfirmButton ? this._renderButton(confirmButtonData) : null}
          </View>
        </Animated.View>
      </View>
    );
  };

  render() {
    const { show = false } = this.props;
    const { showSelf } = this.state;
    const { modalProps = {}, closeOnHardwareBackPress = true } = this.props;
    const wrapInModal = OS === 'android' || OS === 'ios';

    return showSelf ? (
      wrapInModal ? (
        <Modal
          animationType="none"
          transparent={true}
          visible={show}
          onRequestClose={() => {
            if (showSelf && closeOnHardwareBackPress) {
              this._springHide();
            }
          }}
          {...modalProps}>
          {this._renderAlert()}
        </Modal>
      ) : (
        this._renderAlert()
      )
    ) : null;
  }

  UNSAFE_componentWillReceiveProps(nextProps: AwesomeAlertProps) {
    const { show } = nextProps;
    const { showSelf } = this.state;

    if (show && !showSelf) {
      this._springShow();
    } else if (show === false && showSelf) {
      this._springHide();
    }
  }

  componentWillUnmount() {
    this.backHandlerSubscription?.remove();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  overlay: {
    width,
    height,
    position: 'absolute',
    backgroundColor: 'rgba(52,52,52,0.5)',
  },
  contentContainer: {
    maxWidth: '80%',
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  title: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    color: '#626262',
  },
  message: {
    paddingTop: 5,
    color: '#7b7b7b',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    margin: 5,
    borderRadius: 5,
  },
});
