import { IconX } from '@/components';
import { ifIphoneX } from '@/configs';
import { CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const hitSlop = {
  top: 30,
  left: 30,
  right: 30,
  bottom: 30,
};

const CHeader = props => {
  const {
    width = '100%',
    title = '',
    height,
    hitSlops = hitSlop,
    leftComponent,
    rightComponent,
    containerStyle,
    titleComponent,
    backgroundColor,
    rightComponentStyle,
    leftComponentDisable,
    leftComponentOnPress,
    rightComponentDisable,
    rightComponentOnPress,
    btnClose = false,
    isBorderBottom = false,
  } = props;

  const {
    theme: { colors },
  } = useTheme();

  const insets = useSafeAreaInsets();

  const renderLeftIconComp = () =>
    !leftComponentDisable &&
    (leftComponent || (
      <TouchableOpacity
        hitSlop={hitSlops}
        onPress={leftComponentOnPress}
        style={styles.leftComponentStyle}
      >
        {btnClose ? (
          <IconX
            type="antdesign"
            name={'close'}
            color={colors.c667085}
            size={26}
          />
        ) : (
          <IconX
            type="ionicons"
            name={'chevron-back'}
            color={colors.c667085}
            size={26}
          />
        )}
      </TouchableOpacity>
    ));

  const renderRightIconComp = () =>
    !rightComponentDisable &&
    (rightComponent || (
      <TouchableOpacity
        hitSlop={hitSlops}
        onPress={rightComponentOnPress}
        style={[styles.rightComponentStyle, rightComponentStyle]}
      >
        <IconX type="ionicons" name={'menu'} color={colors.white} size={26} />
      </TouchableOpacity>
    ));

  const renderTitleComp = () =>
    titleComponent || (
      <CText h4 w600 style={styles.titleTextStyle}>
        {title}
      </CText>
    );

  return (
    <View style={{ paddingTop: insets.top }}>
      <View
        style={[
          _container(height, width, backgroundColor, isBorderBottom),
          containerStyle,
        ]}
      >
        <View style={_innerContainer()}>
          {renderLeftIconComp()}
          {renderTitleComp()}
          {renderRightIconComp()}
        </View>
      </View>
    </View>
  );
};

CHeader.propTypes = {
  width: PropTypes.any,
  title: PropTypes.string,
  height: PropTypes.number || PropTypes.string,
  hitSlops: PropTypes.object,
  leftComponent: PropTypes.node,
  rightComponent: PropTypes.node,
  containerStyle: PropTypes.object,
  titleComponent: PropTypes.node,
  titleComponentDisable: PropTypes.bool,
  backgroundColor: PropTypes.string,
  rightComponentStyle: PropTypes.object,
  leftComponentDisable: PropTypes.bool,
  leftComponentOnPress: PropTypes.func,
  rightComponentDisable: PropTypes.bool,
  rightComponentOnPress: PropTypes.func,
  btnClose: PropTypes.bool,
  isBorderBottom: PropTypes.bool,
};

const styles = StyleSheet.create({
  leftComponentStyle: {
    left: 16,
    position: 'absolute',
  },
  rightComponentStyle: {
    right: 16,
    position: 'absolute',
  },
  titleTextStyle: {
    textAlign: 'center',
    color: '#101828',
  },
});

function _container(height, width, backgroundColor, isBorderBottom) {
  return {
    width: width || '100%',
    height: height || 44,
    borderBottomWidth: isBorderBottom ? 1 : 0,
    borderBottomColor: '#f2f2f2',
    backgroundColor: backgroundColor || 'transparent',
  };
}

function _innerContainer() {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ifIphoneX('85%', '100%'),
  };
}

export default CHeader;
