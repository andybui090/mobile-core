import { store } from '@/redux/store';
import { theme } from '@/theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@rneui/themed';
import { ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

function ContainerApp(): ReactElement {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <BottomSheetModalProvider>
              <KeyboardProvider>
                
              </KeyboardProvider>
            </BottomSheetModalProvider>
          </Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default ContainerApp;
