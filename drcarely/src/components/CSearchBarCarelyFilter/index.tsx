import {fonts, images, screenStyles} from '@/configs';
import {Icon, useTheme} from '@rneui/themed';
import {forwardRef, useCallback, useRef, useState} from 'react';
import {Image, Pressable} from 'react-native';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {ICON_TYPE, IconX} from '../Icons';
import {useFocusEffect} from '@react-navigation/native';

interface Props extends TextInputProps {
  onFilterPress?: () => void;
  onClear?: () => void;
  value?: string;
  isApplyFilter: boolean;
}

const CSearchBarCarelyFilter = forwardRef<TextInput, Props>((props, ref) => {
  const {
    value,
    onChangeText,
    onFilterPress,
    onClear,
    placeholder,
    isApplyFilter,
    ...rest
  } = props;

  const {
    theme: {colors},
  } = useTheme();

  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 1000); // 👈 delay nhẹ để đợi animation xong

      return () => clearTimeout(timeout);
    }, []),
  );

  const [isFocus, setIsFocus] = useState(false);

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocus ? colors.c19A2A7 : colors.cF2F4F7,
        },
      ]}>
      {/* Search icon */}
      <IconX
        origin={ICON_TYPE.ANT_ICON}
        name={'search1'}
        size={25}
        color={isFocus ? colors.c19A2A7 : colors.c98A2B3}
        style={{marginLeft: 3}}
      />

      {/* Input */}
      <TextInput
        ref={inputRef}
        numberOfLines={1}
        allowFontScaling={false}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        placeholderTextColor={colors.c98A2B3}
        returnKeyType="search"
        onSubmitEditing={rest.onSubmitEditing}
        {...rest}
      />

      {/* Clear button */}
      {!!value && (
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Icon name="close" type="ionicon" size={22} color={colors.c98A2B3} />
        </TouchableOpacity>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Filter button */}
      <Pressable onPress={onFilterPress} style={styles.filterBtn}>
        <Image
          source={
            (isFocus || isApplyFilter) ? images.carely.ic_filter : images.carely.ic_filter_disable
          }
          style={screenStyles.fillParent}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    paddingVertical: 0,
    fontFamily: fonts.inter,
    color: '#101828',
  },

  clearBtn: {
    width: 36,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },

  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },

  filterBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CSearchBarCarelyFilter;
