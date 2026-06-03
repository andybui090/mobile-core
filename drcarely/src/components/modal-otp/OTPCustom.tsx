import { fonts } from '@/configs';
import { CText } from '@/utils';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

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

interface OTPCustomProps {
  containerStyle?: any;
  contentContainerStyle?: object;
  cellStyle?: object;
  cellFocusedStyle?: object;
  cellFilledStyle?: object;
  textStyle?: object;
  textFocusedStyle?: object;
  value?: string;
  onValueChange?: (code: string, info: { isFulfilled: boolean }) => void;
  onFocus?: (...args: any[]) => void;
  onBlur?: (...args: any[]) => void;
  codeLength?: number;
  password?: boolean;
  placeholder?: string | React.ReactElement;
  restrictToNumbers?: boolean;
  cellSize?: number;
  cellSpacing?: number;
  mask?: string | React.ReactElement;
  maskDelay?: number;
  animationType?: string | object;
  [key: string]: any;
}

const OTPCustom = forwardRef<any, OTPCustomProps>(
  (
    {
      containerStyle = {},
      contentContainerStyle = {},
      cellStyle = {},
      cellFocusedStyle = {},
      cellFilledStyle = {},
      textStyle = {},
      textFocusedStyle = {},
      value = '',
      onValueChange = null,
      onFocus = null,
      onBlur = null,
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
    forwardedRef,
  ) => {
    const animatableRef = useRef<any>(null);
    const inputRef = useRef<any>(null);
    const previousInputRef = useRef(value);

    const [focused, setFocused] = useState(false);
    const [doMask, setDoMask] = useState(false);

    useImperativeHandle(forwardedRef, () => ({
      shake: () => {
        animatableRef.current?.shake(650);
      },
      clear: () => {
        inputRef.current?.clear();
      },
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
    }));

    useEffect(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }, []);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setDoMask(false);
      }, maskDelay);

      return () => clearTimeout(timeout);
    }, [doMask, maskDelay]);

    const onChange = useCallback(
      (code: any) => {
        const input = restrictToNumbers ? (code.match(/[0-9]/g) || []).join('') : code;
        if (onValueChange) {
          onValueChange(input, { isFulfilled: input.length >= codeLength });
        }

        if (password && previousInputRef.current.length < input.length) {
          setDoMask(true);
        }

        previousInputRef.current = input;
      },
      [password, restrictToNumbers, onValueChange, codeLength],
    );

    const onFocused = useCallback(
      (...args: any) => {
        setFocused(true);
        if (onFocus) {
          onFocus(...args);
        }
      },
      [onFocus],
    );

    const onBlurred = useCallback(
      (...args: any) => {
        setFocused(false);
        if (onBlur) {
          onBlur(...args);
        }
      },
      [onBlur],
    );

    return (
      <Animatable.View
        ref={animatableRef}
        style={StyleSheet.flatten([
          styles.container,
          {
            width: cellSize * codeLength + cellSpacing * (codeLength - 1),
            height: cellSize,
          },
          containerStyle,
        ])}>
        <View style={StyleSheet.flatten([styles.viewContainer, contentContainerStyle])}>
          {Array.apply(null, Array(codeLength)).map((_, idx) => {
            const cellFocused = focused && idx === value.length;
            const filled = idx < value.length;
            const last = idx === value.length - 1;
            const showMask = filled && password && (!doMask || !last);
            const isPlaceholderText = typeof placeholder === 'string';
            const isMaskText = typeof mask === 'string';
            const pinCodeChar = value.charAt(idx);

            let cellText = null;
            if (filled || placeholder !== null) {
              if (showMask && isMaskText) {
                cellText = mask;
              } else if (!filled && isPlaceholderText) {
                cellText = placeholder;
              } else if (pinCodeChar) {
                cellText = pinCodeChar;
              }
            }

            const placeholderComponent = !isPlaceholderText ? placeholder : null;
            const maskComponent = showMask && !isMaskText ? mask : null;
            const isCellText = typeof cellText === 'string';

            return (
              <Animatable.View
                key={idx}
                style={StyleSheet.flatten([
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    marginLeft: cellSpacing / 2,
                    marginRight: cellSpacing / 2,
                  },
                  cellStyle,
                  cellFocused ? StyleSheet.flatten([styles.cellFocused, cellFocusedStyle]) : {},
                  filled ? cellFilledStyle : {},
                ])}
                animation={idx === value.length && focused ? animationType : null}
                iterationCount="infinite"
                duration={500}>
                {isCellText && !maskComponent && (
                  <CText
                    h5
                    style={StyleSheet.flatten([
                      styles.text,
                      textStyle,
                      cellFocused ? StyleSheet.flatten([styles.textFocused, textFocusedStyle]) : {},
                    ])}>
                    {cellText}
                  </CText>
                )}
                {!isCellText && !maskComponent && placeholderComponent}
                {isCellText && maskComponent}
                {cellText === '' ? (
                  <View
                    style={{
                      position: 'absolute',
                      height: cellSize,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <CText h2 color={'#98A2B3'}>
                      {'-'}
                    </CText>
                  </View>
                ) : null}
              </Animatable.View>
            );
          })}
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
          selection={{
            start: value.length,
            end: value.length,
          }}
          style={styles.textInput}
          allowFontScaling={false}
          {...props}
        />
      </Animatable.View>
    );
  },
);

export default OTPCustom;
