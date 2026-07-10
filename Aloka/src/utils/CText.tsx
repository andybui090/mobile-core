import React, { memo, useMemo } from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { fontScale, fonts } from '@/configs';
import { isIOS } from '@rneui/base';
import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ colors }) => ({
  main: { fontFamily: fonts.inter },
  w300: { fontWeight: '300' },
  w400: { fontWeight: '400' },
  w500: { fontWeight: '500' },
  w600: { fontWeight: isIOS ? '600' : '700' },
  w700: { fontWeight: '700' },
  center: { textAlign: 'center' },
}));

// ============================================
// ⭐ TYPE ĐỊNH NGHĨA CHUẨN, KHÔNG CẦN PropTypes
// ============================================
export interface CTextProps extends TextProps {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h46?: boolean;
  h56?: boolean;
  h6?: boolean;
  h7?: boolean;

  w300?: boolean;
  w400?: boolean;
  w500?: boolean;
  w600?: boolean;
  w700?: boolean;

  center?: boolean;
  color?: string;
  font?: string;

  children?: React.ReactNode;
}

// ============================================
// ⭐ COMPONENT CText TỐI ƯU
// ============================================
export const CText: React.FC<CTextProps> = memo(
  ({
    style,
    children,
    h1,
    h2,
    h3,
    h4,
    h5,
    h46,
    h56,
    h6,
    h7,
    w300,
    w400,
    w500,
    w600,
    w700,
    center,
    color,
    font,
    numberOfLines,
    onTextLayout,
    ...rest
  }) => {
    const styles = useStyles();
    const { H1, H2, H3, H4, H46, H5, H56, H6, H7 } = fontScale;

    // ⭐ Chỉ tính style 1 lần → tối ưu hiệu năng
    const textStyle: TextStyle = useMemo(() => {
      let computed: TextStyle = {
        ...styles.main,
        ...(w300 && styles.w300),
        ...(w400 && styles.w400),
        ...(w500 && styles.w500),
        ...(w600 && styles.w600),
        ...(w700 && styles.w700),
        ...(center && styles.center),
        ...(color && { color }),
        ...(font && { fontFamily: font }),
      };

      if (h1) computed.fontSize = H1.fontSize;
      if (h2) computed.fontSize = H2.fontSize;
      if (h3) computed.fontSize = H3.fontSize;
      if (h4) computed.fontSize = H4.fontSize;
      if (h46) computed.fontSize = H46.fontSize;
      if (h5) computed.fontSize = H5.fontSize;
      if (h56) computed.fontSize = H56.fontSize;
      if (h6) computed.fontSize = H6.fontSize;
      if (h7) computed.fontSize = H7.fontSize;

      return StyleSheet.flatten([computed, style]);
    }, [
      style,
      w300,
      w400,
      w500,
      w600,
      w700,
      center,
      color,
      font,
      h1,
      h2,
      h3,
      h4,
      h5,
      h46,
      h56,
      h6,
      h7,
    ]);

    return (
      <Text
        {...rest}
        style={textStyle}
        allowFontScaling={false}
        onTextLayout={onTextLayout}
        numberOfLines={numberOfLines}
      >
        {children}
      </Text>
    );
  }
);
