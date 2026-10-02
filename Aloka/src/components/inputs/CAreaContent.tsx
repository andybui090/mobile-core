import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { CText, Row } from '@/utils';
import { fonts, removeExtraSpaces } from '@/configs';
import { useTheme } from '@rneui/themed';

type CAreaProps = {
  refChild?: any;
  placeHolder?: string;
  value: string;
  onChange: (value: string) => void;
  errorText?: string;
  maxLength?: number;
  returnKeyType?: any;
  onSubmitEditing?: () => void;
  keyboardType?: any;
  leftIcon?: any;
  rightIcon?: any;
  secureTextEntry?: boolean;
  label?: string;
  noSpace?: boolean;
  autoCapitalize?: any;
  isRequire?: boolean;
  editable?: boolean;
  textInputStyle?: any;
  maxCharLimit?: number;
  charCountColor?: string;
  exceedCharCountColor?: string;
  onFocus?: () => void;
  heightView?: number;
  name?: string;
  labelStyle?: any;
};

export const CAreaContent = (props: CAreaProps) => {
  const {
    textInputStyle,
    maxCharLimit = 1500,
    charCountColor = '#98A2B3',
    exceedCharCountColor = '#F04438',
    onChange,
    onFocus,
    heightView = 0,
    refChild,
    name,
    label,
    isRequire,
    errorText,
    value,
    placeHolder,
    labelStyle,
    ...rest
  } = props;

  const {
    theme: { colors },
  } = useTheme();

  const [charCount, setCharCount] = React.useState(0);
  const [borderColor, setBorderColor] = useState(colors.cD0D5DD);

  const handleChangeText = (text: string) => {
    let parseStr = removeExtraSpaces(text);
    setCharCount(parseStr.length);
    onChange(parseStr);
  };

  const _onBlur = () => {
    setBorderColor(colors.cD0D5DD);
  };

  const _onFocus = () => {
    setBorderColor(colors.primary);
    onFocus && onFocus();
  };

  const renderCharCount = () => {
    if (!maxCharLimit) {
      return null;
    }
    return (
      <CText
        h6
        style={{
          color: charCount > maxCharLimit ? exceedCharCountColor : charCountColor,
        }}>{`${value ? value.length : charCount}/${maxCharLimit}`}</CText>
    );
  };

  return (
    <View style={{ marginVertical: 6, width: '100%' }}>
      <Row between>
        <CText h5 color={colors.c344054} style={labelStyle ? labelStyle : {}}>
          {label}
          {isRequire && (
            <CText h5 color={colors.error}>
              {' *'}
            </CText>
          )}
        </CText>
        {renderCharCount()}
      </Row>
      <View
        style={[
          styles.container,
          { height: heightView ? heightView : 140, borderColor: errorText ? colors.cFDA29B : borderColor },
        ]}>
        <TextInput
          ref={refChild}
          multiline
          maxLength={maxCharLimit}
          {...rest}
          style={[styles.textInputStyle, value === '' ? { fontWeight: '400' } : {}, { color: colors.c101828 }]}
          onChangeText={handleChangeText}
          onFocus={_onFocus}
          onBlur={_onBlur}
          defaultValue={value || ''}
          placeholder={placeHolder}
          placeholderTextColor={colors.cAAAAAA}
          blurOnSubmit={false}
          textAlignVertical='top'
          allowFontScaling={false}
          // selectionColor={'#4ECE72'}
        />
      </View>
      {errorText && (
        <CText h5 w400 style={styles.txtError}>
          {errorText}
        </CText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  txtError: {
    marginVertical: 5,
    color: '#F04438',
    marginLeft: 5,
  },
  textInputStyle: {
    height: '90%',
    backgroundColor: 'white',
    fontSize: 14,
    fontFamily: fonts.inter,
    // textAlign: 'justify',
  },
});
