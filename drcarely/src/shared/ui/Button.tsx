import React from 'react';
import { fonts, getBottomSpace, ifIphoneX } from '@/config';
import { makeStyles } from '@/shared/theme';
import { Row } from './row';
import { ViewStyle, TouchableOpacity, Text, View } from 'react-native';

interface ButtonProps {
  title: string;
  titleColor?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  disabledStyle?: ViewStyle;
  btnWidth?: any;
  paddingVertical?: number;
  onPress?: () => void;
  isDisable?: boolean;
  fontSize?: number;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  icon?: any;
  isBottom?: boolean;
}

const useStyles = makeStyles(({ colors }) => ({
  titleStyle: {
    fontWeight: '600',
    textTransform: 'none',
    fontFamily: fonts.inter,
  },
  btnBgColor: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  btnBottom: {
    paddingTop: 12,
    paddingBottom: getBottomSpace() + ifIphoneX(0, 12),
  },
}));

export const Button = (props: ButtonProps) => {
  const {
    title = 'Button',
    onPress = () => {},
    titleColor = '#FFFFFF',
    style = {},
    backgroundColor,
    disabledStyle,
    btnWidth = '90%',
    paddingVertical,
    isDisable = false,
    fontSize,
    containerStyle,
    buttonStyle,
    icon,
    isBottom = false,
  } = props;

  const styles = useStyles();
  return (
    <Row center style={[isBottom ? styles.btnBottom : {}, style]}>
      <View style={containerStyle}>
        <TouchableOpacity
          disabled={isDisable}
          onPress={onPress}
          style={[
            styles.btnBgColor,
            {
              width: btnWidth,
              paddingVertical: paddingVertical ? paddingVertical : 15,
              backgroundColor: backgroundColor ? backgroundColor : '#0b79f3',
              opacity: isDisable ? 0.5 : 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
            buttonStyle,
            isDisable && disabledStyle,
          ]}
        >
          {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
          <Text style={[styles.titleStyle, { fontSize: fontSize ? fontSize : 14, color: titleColor }]}>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    </Row>
  );
};