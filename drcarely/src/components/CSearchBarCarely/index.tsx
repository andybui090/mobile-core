import { Icon, SearchBar, useTheme } from '@rneui/themed';
import { ForwardedRef, forwardRef, useState } from 'react';
import { TextInputProps } from 'react-native';
import useStyles from './styles';

interface appSearchBarProps extends TextInputProps {
  onScan?: (qrCode: string) => void;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  value?: string;
  content?: boolean;
  onSubmitEditing?: any;
  disabled?: boolean;
  onFocus?: () => void;
  searchIcon?: any;
  rightIcon?: any;
}

type searchBarRef = ForwardedRef<TextInputProps>;

const CSearchBarCarely = (props: appSearchBarProps, ref: searchBarRef | any) => {
  const { placeholder, onSubmitEditing, onClear, onFocus, content, onScan, searchIcon, rightIcon, disabled = false, ...args } = props;
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const [borderColor, setBorderColor] = useState(colors.cF9FAFB);
  const [isFocus, setIsFocus] = useState(false);

  const _onBlur = () => {
    setIsFocus(false);
    setBorderColor(colors.cF9FAFB);
  };

  const _onFocus = () => {
    setIsFocus(true);
    setBorderColor(colors.c19A2A7);
  };

  return (
    <SearchBar
      ref={ref}
      placeholder={placeholder}
      onClear={onClear}
      disabled={disabled}
      round
      onFocus={_onFocus}
      onBlur={_onBlur}
      containerStyle={[
        styles.container,
        { borderColor: borderColor, borderTopColor: borderColor, borderBottomColor: borderColor },
      ]}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      onSubmitEditing={onSubmitEditing}
      searchIcon={<Icon name="search1" type="antdesign" size={20} color={isFocus ? colors.c19A2A7 : colors.c98A2B3} />}
      {...args}
      allowFontScaling={false}
      rightIcon={rightIcon}
    />
  );
};

export default forwardRef(CSearchBarCarely);