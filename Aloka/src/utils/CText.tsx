import React, { memo, useMemo } from 'react';
import { Text, TextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { fontScale, fonts } from '@/configs';
import { isIOS } from '@rneui/base';

const baseStyles = StyleSheet.create({
  main: { fontFamily: fonts.inter },
  w300: { fontWeight: '300' },
  w400: { fontWeight: '400' },
  w500: { fontWeight: '500' },
  w600: { fontWeight: isIOS ? '600' : '700' },
  w700: { fontWeight: '700' },
  center: { textAlign: 'center' },
});

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
    const { H1, H2, H3, H4, H46, H5, H56, H6, H7 } = fontScale;

    // ⭐ Chỉ tính style 1 lần → tối ưu hiệu năng
    const textStyle = useMemo<StyleProp<TextStyle>>(() => {
      const fontSize = h1
        ? H1.fontSize
        : h2
          ? H2.fontSize
          : h3
            ? H3.fontSize
            : h4
              ? H4.fontSize
              : h46
                ? H46.fontSize
                : h5
                  ? H5.fontSize
                  : h56
                    ? H56.fontSize
                    : h6
                      ? H6.fontSize
                      : h7
                        ? H7.fontSize
                        : undefined;

      const computed: TextStyle = {
        ...baseStyles.main,
        ...(w300 ? baseStyles.w300 : null),
        ...(w400 ? baseStyles.w400 : null),
        ...(w500 ? baseStyles.w500 : null),
        ...(w600 ? baseStyles.w600 : null),
        ...(w700 ? baseStyles.w700 : null),
        ...(center ? baseStyles.center : null),
        ...(color && { color }),
        ...(font && { fontFamily: font }),
        ...(fontSize ? { fontSize } : {}),
      };

      return [computed, style];
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
