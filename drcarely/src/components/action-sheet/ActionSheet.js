import React from 'react';
import {
  View,
  Dimensions,
  Modal,
  TouchableHighlight,
  Animated,
  ScrollView,
  Easing,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import { getBottomSpace, images } from '@/configs';
import { CText, Row } from '@/utils';

const MAX_HEIGHT = Dimensions.get('window').height * 0.7;

export function isSet(prop) {
  return typeof prop !== 'undefined';
}

export class ActionSheet extends React.Component {
  static defaultProps = {
    tintColor: '#007AFF',
    buttonUnderlayColor: '#F4F4F4',
    onPress: () => { },
    styles: {},
  };

  constructor(props) {
    super(props);
    this.scrollEnabled = false;
    this.translateY = this._calculateHeight(props);
    this.state = {
      visible: false,
      sheetAnim: new Animated.Value(this.translateY),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.translateY = this._calculateHeight(nextProps);
  }

  get styles() {
    const { styles } = this.props;
    const obj = {};
    Object.keys(styles2).forEach(key => {
      const arr = [styles2[key]];
      if (styles[key]) {
        arr.push(styles[key]);
      }
      obj[key] = arr;
    });
    return obj;
  }

  show = () => {
    this.setState({ visible: true }, () => {
      this._showSheet();
    });
  };

  hide = index => {
    this._hideSheet(() => {
      this.setState({ visible: false }, () => {
        this.props.onPress(index);
      });
    });
  };

  _cancel = () => {
    const { cancelButtonIndex } = this.props;
    // 保持和 ActionSheetIOS 一致，
    // 未设置 cancelButtonIndex 时，点击背景不隐藏 ActionSheet
    if (isSet(cancelButtonIndex)) {
      this.hide(5);
    }
  };

  _showSheet = () => {
    Animated.timing(this.state.sheetAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  _hideSheet(callback) {
    Animated.timing(this.state.sheetAnim, {
      toValue: this.translateY,
      duration: 200,
      useNativeDriver: true,
    }).start(callback);
  }

  /**
   * elements: titleBox, messageBox, buttonBox, cancelButtonBox
   * box size: height, marginTop, marginBottom
   */
  _calculateHeight(props) {
    const styles = this.styles;

    const getHeight = name => {
      const style = styles[name][styles[name].length - 1];
      let h = 0;
      ['height', 'marginTop', 'marginBottom'].forEach(attrName => {
        if (typeof style[attrName] !== 'undefined') {
          h += style[attrName];
        }
      });
      return h;
    };

    let height = 0;
    if (props.title) {
      height += getHeight('titleBox');
    }
    if (props.message) {
      height += getHeight('messageBox');
    }
    if (isSet(props.cancelButtonIndex)) {
      height += getHeight('cancelButtonBox');
      height += (props.options.length - 1) * getHeight('buttonBox');
    } else {
      height += props.options.length * getHeight('buttonBox');
    }

    if (height > MAX_HEIGHT) {
      this.scrollEnabled = true;
      height = MAX_HEIGHT;
    } else {
      this.scrollEnabled = false;
    }

    return height;
  }

  _renderCancelButton() {
    const { options, cancelButtonIndex } = this.props;
    if (!isSet(cancelButtonIndex)) {
      return null;
    }
    return this._createButton(options[cancelButtonIndex], cancelButtonIndex);
  }

  _createButton(title, index) {
    const {
      buttonUnderlayColor,
      cancelButtonIndex,
      destructiveButtonIndex,
    } = this.props;
    const fontColor =
      destructiveButtonIndex === index ? "#667085" : "#1D2939";
    const buttonBoxStyle =
      cancelButtonIndex === index ? styles2.cancelButtonBox : styles2.buttonBox;
    if (index == 0) {

    }
    return (
      <TouchableHighlight
        key={index}
        activeOpacity={1}
        underlayColor={buttonUnderlayColor}
        style={[buttonBoxStyle, {
          borderTopRightRadius: (index == 0 || index == 2) ? 8 : 0,
          borderTopLeftRadius: (index == 0 || index == 2) ? 8 : 0,
          borderBottomLeftRadius: (index == 1 || index == 2) ? 8 : 0,
          borderBottomRightRadius: (index == 1 || index == 2) ? 8 : 0,
          paddingHorizontal: 14,
        }
        ]}
        onPress={() => this.hide(index)}>
        <Row start style={{
          borderBottomWidth: index == 0 ? 1 : 0,
          borderBottomColor: "#EAECF0", height: '100%'
        }}>
          {index == 0 && <Image source={images.auth.ic_phone_otp} style={{ width: 24, height: 24 }} resizeMode='contain' />}
          {index == 1 && <Image source={images.auth.ic_mail_otp} style={{ width: 24, height: 24 }} resizeMode='contain' />}
          <CText h5 color={fontColor}
            style={{ fontWeight: destructiveButtonIndex === index ? '600' : '400', marginLeft: index != 2 ? 10 : 0 }}>{title}</CText>
        </Row>
      </TouchableHighlight>
    );
  }

  _renderOptions() {
    const { cancelButtonIndex } = this.props;
    return this.props.options.map((title, index) => {
      return cancelButtonIndex === index
        ? null
        : this._createButton(title, index);
    });
  }

  render() {
    const { visible, sheetAnim } = this.state;
    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent
        onRequestClose={this._cancel}>
        <View style={[styles2.wrapper]}>
          <Text style={styles2.overlay} onPress={this._cancel} allowFontScaling={false}/>
          <Animated.View
            style={[
              styles2.body,
              { height: this.translateY, transform: [{ translateY: sheetAnim }] },
            ]}>
            <ScrollView scrollEnabled={this.scrollEnabled}>
              {this._renderOptions()}
            </ScrollView>
            {this._renderCancelButton()}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles2 = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: '#000',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  body: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  titleBox: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  messageBox: {
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonBox: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  cancelButtonBox: {
    height: 50,
    marginBottom: 6 + getBottomSpace(),
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16
  },
});
