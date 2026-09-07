import { fonts, images, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { CText, Row } from '@/utils';
import { Input, useTheme } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type CInputProps = {
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
  rightIconCustom?: any;
  isKYC?: boolean;
  onPressKycInfo?: any;
  isVerifyOTP?: boolean;
  isVerified?: boolean;
  onBlur?: () => void;   // 🔥 thêm dòng này
  onFocus?: () => void;
  onLayout?: (event: any) => void;
};

export const CInput = (props: CInputProps) => {
  const {
    refChild,
    placeHolder,
    value,
    onChange,
    errorText,
    maxLength,
    returnKeyType,
    onSubmitEditing,
    keyboardType,
    leftIcon,
    rightIcon,
    secureTextEntry = false,
    label,
    noSpace,
    autoCapitalize,
    isRequire,
    editable = true,
    rightIconCustom,
    isKYC,
    onPressKycInfo,
    isVerifyOTP,
    isVerified,
    onBlur,
    onFocus,
    onLayout,
  } = props;

  const {
    theme: { colors },
  } = useTheme();
  const { user } = useContext(AppContext);

  const [borderColor, setBorderColor] = useState(colors.cD0D5DD);

  const handleChangeText = (text: string) => {
    let v = '';
    if (noSpace) {
      v = text.replace(/\s\s+/g, '');
      v = v.trim();
    } else {
      v = text.replace(/\s\s+/g, ' ');
    }
    onChange(v);
  };

  const _onBlur = () => {
    setBorderColor(colors.cD0D5DD);
    if (onBlur) {
      onBlur();
    }
  };

  const _onFocus = () => {
    setBorderColor(colors.primary);
    if (onFocus) {
      onFocus();
    }
  };

  return (
    <View onLayout={onLayout} style={{ marginVertical: 6, width: '100%' }}>
      {label ? (
        <Row between>
          <CText h5 color={colors.c344054}>
            {label}
            {isRequire && (
              <CText h5 color={colors.error}>
                {' *'}
              </CText>
            )}
          </CText>
          {/* {isKYC ? (
            <Pressable hitSlop={screenStyles.hitSlop20} onPress={onPressKycInfo}>
              <Image
                source={user.personalization?.status == 2 ? images.doctor.kyc_2 : images.doctor.kyc_0}
                style={screenStyles.box16}
                resizeMode="contain"
              />
            </Pressable>
          ) : (
            <View />
          )} */}
          {/* {isVerifyOTP ? (
            <View>
              <Image source={isVerified ? images.doctor.kyc_1 : images.doctor.kyc_0} style={screenStyles.box16} resizeMode="contain" />
            </View>
          ) : (
            <View />
          )} */}
        </Row>
      ) : null}
      <Row style={{ flex: 1 }}>
        <Input
          ref={refChild}
          editable={editable}
          onSubmitEditing={onSubmitEditing}
          keyboardType={keyboardType}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          leftIconContainerStyle={{
            marginLeft: -2,
          }}
          secureTextEntry={secureTextEntry}
          onFocus={_onFocus}
          onBlur={_onBlur}
          blurOnSubmit={false}
          maxLength={maxLength}
          placeholder={placeHolder}
          placeholderTextColor={colors.cD0D5DD}
          returnKeyType={returnKeyType}
          inputStyle={[
            styles.inputStyle,
            value === '' ? { fontWeight: '400' } : {},
            { color: editable ? colors.c101828 : colors.c667085 },
          ]}
          underlineColorAndroid="transparent"
          inputContainerStyle={[
            styles.inputContainerStyle,
            {
              borderColor: errorText ? colors.cFDA29B : borderColor,
              backgroundColor: editable ? colors.white : colors.cF9FAFB,
              height: 48,
            },
          ]}
          containerStyle={[screenStyles.centerWrap, { paddingHorizontal: 0, marginTop: 8, flex: 1 }]}
          onChangeText={handleChangeText}
          value={value || ''}
          renderErrorMessage={false}
          selectionColor={colors.primary}
          autoCapitalize={autoCapitalize ? autoCapitalize : undefined}
          allowFontScaling={false}
        />
        {rightIconCustom ? rightIconCustom : null}
      </Row>
      {errorText && (
        <CText h5 w400 style={styles.txtError}>
          {errorText}
        </CText>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.inter,
  },
  txtError: {
    marginVertical: 5,
    color: '#F04438',
    marginLeft: 5,
  },
  inputContainerStyle: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 0,
  },
});
