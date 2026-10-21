import React from 'react';
import { Keyboard } from 'react-native';

function useKeyboardHeight() {
    const [keyboardHeight, setKeyboardHeight] = React.useState(0);

    function onKeyboardDidShow(e: any) {
        setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
        setKeyboardHeight(0);
    }

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
    }, []);

    return [keyboardHeight];
}

export default useKeyboardHeight;