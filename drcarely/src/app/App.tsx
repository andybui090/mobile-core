import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { ThemeProvider } from '@rneui/themed';
import { theme } from '@/theme';
import { RootNavigator } from './navigation';

export default function App() {
  useEffect(() => {
    setTimeout(async () => {
      await BootSplash.hide({ fade: true });
    }, 1000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <RootNavigator />
          </Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
