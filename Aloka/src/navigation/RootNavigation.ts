import {
  CommonActions,
  createNavigationContainerRef,
  StackActions
} from '@react-navigation/native';
import { createRef } from 'react';
import { RootStackParamList } from './types';

export const isMountedRef = createRef();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: RouteName extends unknown
    ? undefined extends RootStackParamList[RouteName]
    ? [screen: RouteName] | [screen: RouteName, params: RootStackParamList[RouteName]]
    : [screen: RouteName, params: RootStackParamList[RouteName]]
    : never
) {
  if (navigationRef.isReady()) {
    navigationRef.current?.navigate(...args);
  }
}

export function navigate2(screen: any, arg:any) {
  if (navigationRef.isReady()) {
    navigationRef.current?.navigate(screen, arg);
  }
}

export function goBack() {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current?.goBack();
  } else {
    navigateAndReset([{ name: 'AppTabScreen' }], 0);
  }
}

export function navigateAndReset(routes: { name: string; params?: any }[], index: number) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index,
      routes,
    }),
  );
}

let previousScreen: string | undefined = undefined;
export const setPreviousScreen = (screen: string) => {
  previousScreen= screen;
}
export const getPreviousScreen = () => {
  return previousScreen;
}

export function replace(name: string, params?: any) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}
