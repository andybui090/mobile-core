import { ReactElement, useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, theme } from '@/theme';
import { RootNavigator } from './navigation';
import useI18n from '@/hooks/useI18n';

export default function App(): ReactElement {

  useI18n();

  useEffect(() => {
    setTimeout(async () => {
      await BootSplash.hide({ fade: true });
    }, 1000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
