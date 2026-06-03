import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { AppNavigator } from './navigation';

export default function App() {

  useEffect(() => {
    setTimeout(async () => {
      await BootSplash.hide({ fade: true });
    }, 1000);
  }, []);

  return <AppNavigator />;
}
