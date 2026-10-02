import { IconX } from '@/components';
import { ifIphoneX } from '@/configs';
import { CText } from '@/utils';
import { useTheme } from '@rneui/themed';
import React, { type ReactNode } from 'react';
import {
  type ColorValue,
  type DimensionValue,
  StyleSheet,
  type StyleProp,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const hitSlop = {
  top: 30,
  left: 30,
  right: 30,
  bottom: 30,
};

interface CHeaderProps {
  width?: DimensionValue;
  title?: string;
  height?: DimensionValue;
  hitSlops?: TouchableOpacityProps['hitSlop'];
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleComponent?: ReactNode;
  titleComponentDisable?: boolean;
  backgroundColor?: ColorValue;
  rightComponentStyle?: StyleProp<ViewStyle>;
  leftComponentDisable?: boolean;
  leftComponentOnPress?: TouchableOpacityProps['onPress'];
  rightComponentDisable?: boolean;
  rightComponentOnPress?: TouchableOpacityProps['onPress'];
  btnClose?: boolean;
  isBorderBottom?: boolean;
}

const CHeader = (props: CHeaderProps) => {
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

function _container(
  height: DimensionValue | undefined,
  width: DimensionValue,
  backgroundColor: ColorValue | undefined,
  isBorderBottom: boolean,
): ViewStyle {
  return {
    width: width || '100%',
    height: height || 44,
    borderBottomWidth: isBorderBottom ? 1 : 0,
    borderBottomColor: '#f2f2f2',
    backgroundColor: backgroundColor || 'transparent',
  };
}

function _innerContainer(): ViewStyle {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ifIphoneX('85%', '100%'),
  };
}

export default CHeader;
