import { useEffect } from 'react';
import { BackHandler } from 'react-native';

interface IParams {
  enabled?: boolean;
  callback: () => void;
}

const useBackHandler = ({ enabled = true, callback }: IParams) => {
  useEffect(() => {
    if (!enabled) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      callback();
      return true; // prevent default behavior
    });

    return () => subscription.remove(); // proper cleanup
  }, [enabled, callback]);
};

export default useBackHandler;
