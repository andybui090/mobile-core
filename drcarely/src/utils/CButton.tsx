import React from 'react';
import { fonts, getBottomSpace, ifIphoneX } from '@/configs';
import { Button } from '@rneui/base';
import { Row } from '@/utils';
import { makeStyles } from '@rneui/themed';
import { ViewStyle } from 'react-native';

interface CButtonProps {
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

export const CButton = (props: CButtonProps) => {
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
      <Button
        disabled={isDisable}
        titleProps={{allowFontScaling:false}}
        disabledStyle={disabledStyle ? disabledStyle : {
          backgroundColor: 'rgba(0,128,246, 0.8)',
        }}
        disabledTitleStyle={[
          styles.titleStyle,
          {
            fontSize: fontSize ? fontSize : 14,
            color: titleColor,
          },
        ]}
        title={title}
        containerStyle={[
          {
            width: btnWidth,
            opacity: isDisable ? 0.5 : 1,
          },
          containerStyle,
        ]}
        onPress={onPress}
        buttonStyle={[
          styles.btnBgColor,
          {
            paddingVertical: paddingVertical ? paddingVertical : 15,
          },
          backgroundColor ? { backgroundColor: backgroundColor } : null,
          buttonStyle,
        ]}
        titleStyle={[
          styles.titleStyle,
          {
            fontSize: fontSize ? fontSize : 14,
            color: titleColor,
          },
        ]}
        icon={icon}
      />
    </Row>
  );
};