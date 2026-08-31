import { fonts } from '@/configs';
import { CText } from '@/utils';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, TextInput, TextStyle, View, ViewStyle, type TextInputInstance } from 'react-native';
import * as Animatable from 'react-native-animatable';

//
// =========================================
//        TYPES
// =========================================
//

export interface OTPCustomRef {
  shake: () => void;
  clear: () => void;
  focus: () => void;
  blur: () => void;
}

export interface OTPCustomProps {
  containerStyle?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];

  cellStyle?: ViewStyle | ViewStyle[];
  cellFocusedStyle?: ViewStyle | ViewStyle[];
  cellFilledStyle?: ViewStyle | ViewStyle[];

  textStyle?: TextStyle | TextStyle[];
  textFocusedStyle?: TextStyle | TextStyle[];

  value: string;
  onValueChange?: (value: string, extra: { isFulfilled: boolean }) => void;
  onFocus?: (...args: any) => void;
  onBlur?: (...args: any) => void;

  codeLength?: number;
  password?: boolean;

  placeholder?: string | React.ReactNode;
  restrictToNumbers?: boolean;

  cellSize?: number;
  cellSpacing?: number;

  mask?: string | React.ReactNode;
  maskDelay?: number;

  animationType?: string;

  [key: string]: any;
}

//
// =========================================
//      COMPONENT
// =========================================
//

const OTPCustom = forwardRef<OTPCustomRef, OTPCustomProps>(
  (
    {
      containerStyle,
      contentContainerStyle,
      cellStyle,
      cellFocusedStyle,
      cellFilledStyle,
      textStyle,
      textFocusedStyle,
      value,
      onValueChange,
      onFocus,
      onBlur,
      codeLength = 4,
      password = false,
      placeholder = '',
      restrictToNumbers = false,
      cellSize = 40,
      cellSpacing = 20,
      mask = '*',
      maskDelay = 200,
      animationType = 'pulse',
      ...props
    },
    forwardedRef
  ) => {
    const animRef = useRef<any>(null);
    const inputRef = useRef<TextInputInstance | null>(null);
    const prevInputRef = useRef(value);

    const [focused, setFocused] = useState(false);
    const [doMask, setDoMask] = useState(false);

    //
    // Expose methods
    //
    useImperativeHandle(forwardedRef, () => ({
      shake: () => animRef.current?.shake(650),
      clear: () => inputRef.current?.clear(),
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    //
    // Auto focus on mount
    //
    useEffect(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timeout);
    }, []);

    //
    // Mask timeout
    //
    useEffect(() => {
      const timeout = setTimeout(() => setDoMask(false), maskDelay);
      return () => clearTimeout(timeout);
    }, [doMask, maskDelay]);

    //
    // Handle value change
    //
    const onChange = useCallback(
      (code: string) => {
        const input = restrictToNumbers ? (code.match(/[0-9]/g) || []).join('') : code;

        onValueChange?.(input, { isFulfilled: input.length >= codeLength });

        // Mask logic
        if (password && prevInputRef.current.length < input.length) {
          setDoMask(true);
        }
        prevInputRef.current = input;
      },
      [password, restrictToNumbers, onValueChange, codeLength]
    );

    //
    // Focus / Blur handlers
    //
    const onFocused = useCallback(
      (...args: any) => {
        setFocused(true);
        onFocus?.(...args);
      },
      [onFocus]
    );

    const onBlurred = useCallback(
      (...args: any) => {
        setFocused(false);
        onBlur?.(...args);
      },
      [onBlur]
    );

    //
    // Render cell views
    //
    const cells = Array.from({ length: codeLength }, (_, idx) => {
      const cellFocusedNow = focused && idx === value.length;
      const filled = idx < value.length;
      const last = idx === value.length - 1;

      const showMask = filled && password && (!doMask || !last);
      const isPlaceholderString = typeof placeholder === 'string';
      const isMaskString = typeof mask === 'string';

      const char = value.charAt(idx);

      let cellContent: string | React.ReactNode = null;
      if (filled || placeholder !== null) {
        if (showMask && isMaskString) cellContent = mask as string;
        else if (!filled && isPlaceholderString) cellContent = placeholder as string;
        else if (char) cellContent = char;
      }

      const maskComponent = showMask && !isMaskString ? (mask as React.ReactNode) : null;
      const placeholderComponent = !isPlaceholderString ? placeholder : null;

      const isCellString = typeof cellContent === 'string';

      return (
        <Animatable.View
          key={idx}
          onTouchStart={() => inputRef.current?.focus()}
          style={StyleSheet.flatten([
            styles.cell,
            { width: cellSize, height: cellSize, marginHorizontal: cellSpacing / 2 },
            cellStyle,
            cellFocusedNow && [styles.cellFocused, cellFocusedStyle],
            filled && cellFilledStyle,
          ])}
          animation={idx === value.length && focused ? animationType : undefined}
          iterationCount="infinite"
          duration={500}
        >
          {isCellString && !maskComponent && (
            <CText
              h5
              style={StyleSheet.flatten([
                styles.text,
                textStyle,
                cellFocusedNow && [styles.textFocused, textFocusedStyle],
              ])}
            >
              {cellContent}
            </CText>
          )}

          {!isCellString && !maskComponent && placeholderComponent}
          {isCellString && maskComponent}

          {cellContent === '' ? (
            <View
              style={{
                position: 'absolute',
                height: cellSize,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CText h2 color={'#98A2B3'}>
                {'-'}
              </CText>
            </View>
          ) : null}
        </Animatable.View>
      );
    });

    return (
      <Animatable.View
        ref={animRef}
        style={StyleSheet.flatten([
          styles.container,
          {
            width: cellSize * codeLength + cellSpacing * (codeLength - 1),
            height: cellSize,
          },
          containerStyle,
        ])}
      >
        <View style={StyleSheet.flatten([styles.viewContainer, contentContainerStyle])}>
          {cells}
        </View>

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          onFocus={onFocused}
          onBlur={onBlurred}
          spellCheck={false}
          numberOfLines={1}
          caretHidden
          maxLength={codeLength}
          keyboardType="numeric"
          returnKeyType="done"
          selection={{ start: value.length, end: value.length }}
          style={styles.textInput}
          allowFontScaling={false}
          {...props}
        />
      </Animatable.View>
    );
  }
);

export default memo(OTPCustom);

//
// =========================================
//        STYLE
// =========================================
//

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  viewContainer: {
    position: 'absolute',
    margin: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
  cellFocused: {
    borderColor: '#00B388',
    borderWidth: 2,
  },
  text: {
    color: 'gray',
    fontSize: 20,
  },
  textFocused: {
    color: 'black',
  },
  textInput: {
    flex: 1,
    opacity: 0,
    textAlign: 'center',
    fontFamily: fonts.inter,
    fontSize: 20,
  },
});
