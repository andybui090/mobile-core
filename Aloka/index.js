/**
 * @format
 */

if (__DEV__) {
  require('./reactotron.config');
}

import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';
import App from './src/ContainerApp';

LogBox.ignoreLogs([
  '[Reanimated] dependencies should only be used in web implementation.',
]);

AppRegistry.registerComponent(appName, () => App);
