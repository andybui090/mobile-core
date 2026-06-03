import { ICON_TYPE, IconX } from '@/components';
import { fonts, isIOS, screenStyles } from '@/configs';
import { Input, makeStyles, useTheme } from '@rneui/themed';
import { Pressable } from 'react-native';

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
  inputContainerStyle: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 0,
  },
}));

export const CInputTouchNoLabel = (props: CInputTouchProps) => {
  const { refChild, label, onTouch, placeHolder, value, errorText = '', rightIcon } = props;
  const styles = useStyles();

  const {
    theme: { colors },
  } = useTheme();

  return (
    <Pressable onPress={onTouch} style={{ width: '100%' }}>
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
  );
};
