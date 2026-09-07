import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

interface UseKeyboardAwareScrollOptions {
  /** Khoảng cách từ đáy ô input tới nút bấm hành động bên dưới (mặc định: 20) */
  bottomOffset?: number;
  /** Chiều cao ước tính của ô input gồm label + input box + error (mặc định: 85) */
  inputHeight?: number;
  /** paddingBottom cho ScrollView khi bàn phím mở (mặc định: 140) */
  keyboardBottomPadding?: number;
}

/**
 * Hook tối ưu hoá cuộn mượt cho màn hình có form nhập liệu và bàn phím:
 * - Tự động tính toán khung nhìn khả dụng (visible viewport) trên cả iOS và Android.
 * - Chỉ cuộn khi ô input thực sự bị che khuất hoặc vượt ra ngoài màn hình (loại bỏ hoàn toàn rung giật).
 * - Đồng bộ thời điểm cuộn ngay trong keyboardWillShow (iOS) để chuyển động song song với bàn phím,
 *   loại bỏ hiệu ứng khựng / giật 2 nhịp.
 * - Lưu vết vị trí cuộn thực tế của ScrollView qua `onScroll`.
 */
export const useKeyboardAwareScroll = (
  options: UseKeyboardAwareScrollOptions = {},
) => {
  const {
    bottomOffset = 20,
    inputHeight = 85,
    keyboardBottomPadding = 140,
  } = options;

  const isKeyboardVisibleRef = useRef<boolean>(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const keyboardHeightRef = useRef<number>(0);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const scrollViewRef = useRef<any>(null);
  const initialScrollViewHeight = useRef<number>(0);
  const scrollViewHeight = useRef<number>(320);
  const currentScrollY = useRef<number>(0);
  const inputPositions = useRef<Record<string, number>>({});
  const focusedFieldRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<any>(null);

  const onScrollViewLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (!isKeyboardVisibleRef.current && h > 300) {
      initialScrollViewHeight.current = h;
    }
    scrollViewHeight.current = h;
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    currentScrollY.current = e.nativeEvent.contentOffset.y;
  };

  const getVisibleHeight = () => {
    if (isKeyboardVisibleRef.current && keyboardHeightRef.current > 0) {
      if (
        initialScrollViewHeight.current > 0 &&
        scrollViewHeight.current < initialScrollViewHeight.current - 100
      ) {
        return scrollViewHeight.current;
      }
      if (initialScrollViewHeight.current > 0) {
        return Math.max(
          200,
          initialScrollViewHeight.current - keyboardHeightRef.current,
        );
      }
    }
    return scrollViewHeight.current > 0 && scrollViewHeight.current < 500
      ? scrollViewHeight.current
      : 320;
  };

  const scrollToField = (fieldKey: string, delay = 0, force = false) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const executeScroll = () => {
      const y = inputPositions.current[fieldKey];
      if (y === undefined || !scrollViewRef.current) {
        return;
      }

      const visibleHeight = getVisibleHeight();
      const inputTopOnScreen = y - currentScrollY.current;
      const inputBottomOnScreen = inputTopOnScreen + inputHeight;
      const safeBottom = visibleHeight - bottomOffset;

      // Nếu ô input đã hiển thị trọn vẹn trong vùng an toàn thì không cần cuộn
      if (
        !force &&
        inputTopOnScreen >= 10 &&
        inputBottomOnScreen <= safeBottom
      ) {
        return;
      }

      let targetY: number;
      if (inputBottomOnScreen > safeBottom || force) {
        const targetOffsetFromTop = Math.max(
          0,
          visibleHeight - inputHeight - bottomOffset,
        );
        targetY = Math.max(0, y - targetOffsetFromTop);
      } else {
        targetY = Math.max(0, y - 10);
      }

      // Chỉ kích hoạt cuộn nếu thay đổi vị trí đáng kể (tránh giật vi sai)
      if (Math.abs(targetY - currentScrollY.current) >= 5) {
        scrollViewRef.current?.scrollTo({
          y: targetY,
          animated: true,
        });
      }
    };

    if (delay > 0) {
      scrollTimeoutRef.current = setTimeout(executeScroll, delay);
    } else {
      executeScroll();
    }
  };

  const handleInputFocus = (fieldKey: string) => {
    focusedFieldRef.current = fieldKey;
    // Nếu bàn phím đã mở sẵn và đổi giữa các ô
    if (isKeyboardVisibleRef.current) {
      scrollToField(fieldKey, 50);
    }
  };

  useEffect(() => {
    // 1. Khi bàn phím bắt đầu mở (iOS): kích hoạt đồng bộ để cuộn cùng lúc bàn phím đẩy lên
    const willShowSub =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillShow', e => {
            isKeyboardVisibleRef.current = true;
            keyboardHeightRef.current = e.endCoordinates.height;
            setIsKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);

            if (focusedFieldRef.current) {
              scrollToField(focusedFieldRef.current, 0);
            }
          })
        : null;

    // 2. Khi bàn phím đã mở xong (Android hoặc fallback)
    const didShowSub = Keyboard.addListener('keyboardDidShow', e => {
      isKeyboardVisibleRef.current = true;
      keyboardHeightRef.current = e.endCoordinates.height;
      if (!isKeyboardVisibleRef.current) {
        setIsKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
      if (Platform.OS === 'android' && focusedFieldRef.current) {
        scrollToField(focusedFieldRef.current, 0);
      }
    });

    // 3. Khi bàn phím đóng lại
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        isKeyboardVisibleRef.current = false;
        keyboardHeightRef.current = 0;
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
        focusedFieldRef.current = null;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      },
    );

    return () => {
      willShowSub?.remove();
      didShowSub.remove();
      hideSub.remove();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [bottomOffset, inputHeight]);

  const registerInput = (fieldKey: string) => ({
    onLayout: (e: LayoutChangeEvent) => {
      inputPositions.current[fieldKey] = e.nativeEvent.layout.y;
    },
    onFocus: () => handleInputFocus(fieldKey),
  });

  return {
    scrollViewRef,
    isKeyboardVisible,
    keyboardHeight,
    registerInput,
    scrollToField,
    onScrollViewLayout,
    onScroll,
    contentPaddingBottom: keyboardBottomPadding,
  };
};

export default useKeyboardAwareScroll;
