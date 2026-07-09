import { store } from '@/redux/store';
import { theme } from '@/theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@rneui/themed';
import { ReactElement, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, setPreviousScreen } from './navigation/RootNavigation';
import App from './App';

function ContainerApp(): ReactElement {
  const routeNameRef = useRef<any>(null);
  const [allowTracking, setAllowTracking] = useState(false);

  const handleUpdateTrackingApp = (isTracking: boolean) => {
    // storeObjectData(STORAGEKEY.ALLOW_TRACKING, { isTracking });
    setAllowTracking(isTracking);
  };
  
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <BottomSheetModalProvider>
              <KeyboardProvider>
                <NavigationContainer
                  ref={navigationRef}
                  onStateChange={() => {
                    // if (!allowTracking || !navigationRef.current) return;
                    // const routeName =
                    //   navigationRef?.current?.getCurrentRoute()?.name;
                    // if (routeName !== routeNameRef.current) {
                    //   logScreenView(getAnalytics(), {
                    //     screen_name: routeName,
                    //     screen_class: routeName,
                    //   });
                    // }
                    // routeNameRef.current = routeName;
                  }}
                >
                  <App updateTrackingApp={handleUpdateTrackingApp} />
                </NavigationContainer>
              </KeyboardProvider>
            </BottomSheetModalProvider>
          </Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default ContainerApp;
