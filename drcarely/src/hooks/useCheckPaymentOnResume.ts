// useCheckPaymentOnResume.ts
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const useCheckPaymentOnResume = (callback: () => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        callback();
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);
};