import { ICON_TYPE, IconX } from '@/components';
import { fonts, images, isIOS, screenStyles } from '@/configs';
import { AppContext } from '@/contexts';
import { CText, Row } from '@/utils';
import { Input, makeStyles, useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { Image, Pressable, View } from 'react-native';

type CInputTouchProps = {
  refChild?: any;
  name?: string;
  onTouch: () => void;
  placeHolder?: string;
  value: string;
  errorText?: string;
  isRequire?: boolean;
  label?: string;
  rightIcon?: any;
  isKYC?: boolean;
  onPressKycInfo?: any;
};

export const useStyles = makeStyles(({ colors }) => ({
  labelStyle: {
    fontWeight: '400',
    color: colors.white,
    marginLeft: 5,
  },
  inputStyle: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.inter,
  },
  txtError: {
    color: '#F04438',
    marginLeft: 5,
  },
  inputContainerStyle: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 0,
  },
}));

export const CInputTouch = (props: CInputTouchProps) => {
  const {
    refChild,
    label,
    onTouch,
    placeHolder,
    value,
    errorText = '',
    isRequire,
    rightIcon,
    isKYC,
    onPressKycInfo,
  } = props;
  const styles = useStyles();

  const {
    theme: { colors },
  } = useTheme();

  const { user } = useContext(AppContext);

  return (
    <>
      <Pressable onPress={onTouch} style={{ marginVertical: 6, width: '100%' }}>
        {label && (
          <Row between>
            <CText h5 color={colors.c344054}>
              {label}
              {isRequire && (
                <CText h5 color={colors.error}>
                  {' *'}
                </CText>
              )}
            </CText>
            {isKYC ? (
              <Pressable hitSlop={screenStyles.hitSlop20} onPress={onPressKycInfo}>
                <Image source={user.personalization?.status == 2 ? images.doctor.kyc_2 : images.doctor.kyc_0} style={screenStyles.box16} resizeMode="contain" />
              </Pressable>
            ) : (
              <View />
            )}
          </Row>
        )}
        <Input
          editable={isIOS ? true : false}
          pointerEvents={isIOS ? 'none' : 'auto'}
          blurOnSubmit={false}
          ref={refChild}
          rightIconContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          rightIcon={
            rightIcon ? (
              rightIcon
            ) : (
              <IconX
                origin={ICON_TYPE.FONTISTO}
                name={'angle-down'}
                size={12}
                color={colors.c667085}
                style={{ marginLeft: 3 }}
              />
            )
          }
          placeholder={placeHolder}
          placeholderTextColor={colors.cD0D5DD}
          label={''}
          inputStyle={[styles.inputStyle, value === '' ? { fontWeight: '400' } : {}, { color: colors.c101828 }]}
          underlineColorAndroid="transparent"
          inputContainerStyle={[
            styles.inputContainerStyle,
            {
              borderColor: errorText ? colors.cFDA29B : colors.cD0D5DD,
              backgroundColor: colors.white,
              height: 48,
            },
          ]}
          containerStyle={[screenStyles.centerWrap, { paddingHorizontal: 0, marginTop: 8 }]}
          value={value.toString() || ''}
          renderErrorMessage={false}
          allowFontScaling={false}
        />
      </Pressable>
      {errorText && (
        <CText h5 w400 style={styles.txtError}>
          {errorText}
        </CText>
      )}
    </>
  );
};
